import React, { useMemo, useState } from 'react';
import { Search, Clock, CheckCircle2, Trash2, Activity, Users, CreditCard, Ticket } from '../../icons';
import AdminEngagement from '../../components/AdminEngagement';
import { DEFAULT_PRODUCT } from '../../app/constants';
import { AmbassadorCouponsPanel } from './AmbassadorCouponsPanel';
import { AdminFunnelDashboard } from './AdminFunnelDashboard';
import { AdminSubscriptionsPanel } from './AdminSubscriptionsPanel';
import { adminPlanSelectOptions, adminPlanSelectValue } from './adminPlanSelect';
import type {
  Product,
  ProductAccess,
  ProductApprovalStatus,
  ProductPlan,
} from '../../types/clinical';

export type AccountKind = 'standard' | 'ambassador' | 'test';

export interface AdminUserAccess {
  user_id: number;
  id?: number;
  name: string;
  email: string;
  product: Product;
  plan: ProductPlan;
  product_role: string;
  approval_status: ProductApprovalStatus;
  global_role: string;
  global_status: string;
  account_kind?: AccountKind;
}

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

export interface AdminTabProps {
  apiFetch: ApiFetch;
  adminUsers: AdminUserAccess[];
  dentistSearchTerm: string;
  setDentistSearchTerm: (value: string) => void;
  adminProductFilter: 'all' | Product;
  setAdminProductFilter: (value: 'all' | Product) => void;
  dentistStatusFilter: 'all' | ProductApprovalStatus;
  setDentistStatusFilter: (value: 'all' | ProductApprovalStatus) => void;
  updateUserProductAccess: (access: AdminUserAccess, changes: Partial<ProductAccess> & { account_kind?: AccountKind }) => void | Promise<void>;
}

type AdminSection = 'overview' | 'users' | 'subscriptions' | 'coupons';

const ACCOUNT_KIND_OPTIONS: { value: AccountKind; label: string }[] = [
  { value: 'standard', label: 'Aluno' },
  { value: 'ambassador', label: 'Embaixador' },
  { value: 'test', label: 'Teste' },
];

const SECTIONS: { id: AdminSection; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'overview', label: 'Visão geral', icon: Activity },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'subscriptions', label: 'Assinaturas', icon: CreditCard },
  { id: 'coupons', label: 'Cupons', icon: Ticket },
];

export function AdminTab({
  apiFetch,
  adminUsers,
  dentistSearchTerm,
  setDentistSearchTerm,
  adminProductFilter,
  setAdminProductFilter,
  dentistStatusFilter,
  setDentistStatusFilter,
  updateUserProductAccess,
}: AdminTabProps) {
  const [section, setSection] = useState<AdminSection>('overview');
  const [accountKindFilter, setAccountKindFilter] = useState<'all' | AccountKind>('all');

  const pendingUsers = adminUsers.filter((u) => u.approval_status === 'pending');

  const filteredUsers = useMemo(
    () =>
      adminUsers
        .filter(
          (u) =>
            !dentistSearchTerm
            || u.name?.toLowerCase().includes(dentistSearchTerm.toLowerCase())
            || u.email?.toLowerCase().includes(dentistSearchTerm.toLowerCase()),
        )
        .filter((u) => dentistStatusFilter === 'all' || u.approval_status === dentistStatusFilter)
        .filter((u) => accountKindFilter === 'all' || (u.account_kind || 'standard') === accountKindFilter),
    [adminUsers, dentistSearchTerm, dentistStatusFilter, accountKindFilter],
  );

  return (
    <div className="page-shell space-y-6">
      <header className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Painel de controle</h2>
          <p className="text-sm text-slate-500">
            Funil de conversão, segmentação de contas, assinaturas e gestão de acessos Academy
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                section === id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </header>

      {section === 'overview' && (
        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <AdminFunnelDashboard apiFetch={apiFetch} product={DEFAULT_PRODUCT} />
        </div>
      )}

      {section === 'overview' && (
        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <AdminEngagement apiFetch={apiFetch} product={DEFAULT_PRODUCT} compact />
        </div>
      )}

      {section === 'coupons' && (
        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <AmbassadorCouponsPanel apiFetch={apiFetch} />
        </div>
      )}

      {section === 'subscriptions' && (
        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <AdminSubscriptionsPanel apiFetch={apiFetch} product={DEFAULT_PRODUCT} />
        </div>
      )}

      {section === 'users' && pendingUsers.length > 0 && (
        <div className="bg-amber-50 p-4 md:p-8 rounded-3xl border border-amber-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">Acessos pendentes</h3>
              <p className="text-amber-700 text-sm">Aprove o produto correto antes do usuário entrar</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingUsers.map((u) => (
              <div key={`${u.user_id}-${u.product}-pending`} className="bg-white p-4 rounded-2xl border border-amber-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                  <p className="text-[10px] text-amber-700 uppercase font-bold mt-1">{u.product} · {u.plan} · {u.product_role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateUserProductAccess(u, { approval_status: 'approved' })}
                    className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
                    title="Aprovar"
                    type="button"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    onClick={() => updateUserProductAccess(u, { approval_status: 'rejected' })}
                    className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    title="Rejeitar"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'users' && (
        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">Contas e acessos</h3>
            <p className="text-slate-500 text-sm">Plano, papel, tipo de conta (aluno, embaixador, teste) e aprovação</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={dentistSearchTerm}
                onChange={(e) => setDentistSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <select
              value={adminProductFilter}
              onChange={(e) => setAdminProductFilter(e.target.value as 'all' | Product)}
              className="lg:w-44 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-600"
            >
              <option value="all">Todos produtos</option>
              <option value="odontohub">OdontoHub</option>
              <option value="academy">Academy</option>
            </select>
            <select
              value={dentistStatusFilter}
              onChange={(e) => setDentistStatusFilter(e.target.value as 'all' | ProductApprovalStatus)}
              className="lg:w-44 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-600"
            >
              <option value="all">Todos status</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
              <option value="blocked">Bloqueados</option>
            </select>
            <select
              value={accountKindFilter}
              onChange={(e) => setAccountKindFilter(e.target.value as 'all' | AccountKind)}
              className="lg:w-44 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-600"
            >
              <option value="all">Todos tipos</option>
              {ACCOUNT_KIND_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-slate-100 overflow-hidden">
            <div className="hidden xl:block overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-4 py-3">Usuário</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Produto</th>
                    <th className="px-4 py-3">Plano</th>
                    <th className="px-4 py-3">Papel</th>
                    <th className="px-4 py-3">Aprovação</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={`${u.user_id}-${u.product}`} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                        <p className="text-[10px] uppercase text-slate-400 font-bold">{u.global_role} · {u.global_status}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.account_kind || 'standard'}
                          onChange={(e) => updateUserProductAccess(u, { account_kind: e.target.value as AccountKind })}
                          className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600"
                        >
                          {ACCOUNT_KIND_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-700">{u.product}</td>
                      <td className="px-4 py-3">
                        <select
                          value={adminPlanSelectValue(u.product, u.plan)}
                          onChange={(e) => updateUserProductAccess(u, { plan: e.target.value as ProductPlan })}
                          className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600"
                        >
                          {adminPlanSelectOptions(u.product).map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.product_role}
                          onChange={(e) => updateUserProductAccess(u, { product_role: e.target.value })}
                          className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600"
                        >
                          <option value="student">student</option>
                          <option value="dentist">dentist</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.approval_status === 'approved' ? 'bg-primary/10 text-primary'
                            : u.approval_status === 'pending' ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                        }`}>
                          {u.approval_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => updateUserProductAccess(u, { approval_status: 'approved' })} className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-lg">Aprovar</button>
                          <button type="button" onClick={() => updateUserProductAccess(u, { approval_status: 'blocked' })} className="px-2 py-1 bg-slate-700 text-white text-[10px] font-bold rounded-lg">Bloquear</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="xl:hidden divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <div key={`${u.user_id}-${u.product}-mobile`} className="p-4 space-y-3">
                  <div>
                    <p className="font-bold text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                  <select
                    value={u.account_kind || 'standard'}
                    onChange={(e) => updateUserProductAccess(u, { account_kind: e.target.value as AccountKind })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    {ACCOUNT_KIND_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={adminPlanSelectValue(u.product, u.plan)} onChange={(e) => updateUserProductAccess(u, { plan: e.target.value as ProductPlan })} className="px-3 py-2 rounded-xl bg-slate-50 border text-xs font-bold">
                      {adminPlanSelectOptions(u.product).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <select value={u.product_role} onChange={(e) => updateUserProductAccess(u, { product_role: e.target.value })} className="px-3 py-2 rounded-xl bg-slate-50 border text-xs font-bold">
                      <option value="student">student</option>
                      <option value="dentist">dentist</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'users' && (
        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <AdminEngagement apiFetch={apiFetch} product={DEFAULT_PRODUCT} />
        </div>
      )}
    </div>
  );
}
