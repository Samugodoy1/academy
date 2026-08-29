import React from 'react';
import { Search, Clock, CheckCircle2, Trash2 } from '../../icons';
import AdminEngagement from '../../components/AdminEngagement';
import { DEFAULT_PRODUCT } from '../../app/constants';
import type {
  Product,
  ProductAccess,
  ProductApprovalStatus,
  ProductPlan,
} from '../../types/clinical';

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
  updateUserProductAccess: (access: AdminUserAccess, changes: Partial<ProductAccess>) => void | Promise<void>;
}

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
  return (
    <div className="max-w-screen-xl mx-auto space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin geral</h2>
        <p className="text-sm text-slate-500">Aprovacao por produto, plano, papel de acesso e engajamento</p>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <AdminEngagement apiFetch={apiFetch} product={DEFAULT_PRODUCT} />
      </div>

      {/* Painel de aprovação por produto */}
      {adminUsers.filter(u => u.approval_status === 'pending').length > 0 && (
        <div className="bg-amber-50 p-4 md:p-8 rounded-3xl border border-amber-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">Acessos pendentes</h3>
              <p className="text-amber-700 text-sm">Aprove o produto correto antes do usuario entrar</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminUsers.filter(u => u.approval_status === 'pending').map(u => (
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
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    onClick={() => updateUserProductAccess(u, { approval_status: 'rejected' })}
                    className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    title="Rejeitar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gestão de acessos */}
      <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">Acessos por produto</h3>
            <p className="text-slate-500 text-sm">OdontoHub e Academy usam o mesmo usuario, com acessos separados</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar usuario por nome ou e-mail..."
              value={dentistSearchTerm}
              onChange={(e) => setDentistSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={adminProductFilter}
              onChange={(e) => setAdminProductFilter(e.target.value as 'all' | Product)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-600 font-medium"
            >
              <option value="all">Todos os produtos</option>
              <option value="odontohub">OdontoHub</option>
              <option value="academy">Academy</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={dentistStatusFilter}
              onChange={(e) => setDentistStatusFilter(e.target.value as 'all' | ProductApprovalStatus)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-600 font-medium"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Global</th>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Plano</th>
                  <th className="px-6 py-4">Papel</th>
                  <th className="px-6 py-4">Aprovacao</th>
                  <th className="px-6 py-4 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminUsers
                  .filter(u =>
                    !dentistSearchTerm ||
                    u.name?.toLowerCase().includes(dentistSearchTerm.toLowerCase()) ||
                    u.email?.toLowerCase().includes(dentistSearchTerm.toLowerCase())
                  )
                  .filter(u => dentistStatusFilter === 'all' || u.approval_status === dentistStatusFilter)
                  .map((u) => (
                    <tr key={`${u.user_id}-${u.product}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold">
                            {(u.name || '?').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{u.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">{u.global_role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${u.global_status === 'active' ? 'bg-primary/10 text-primary' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                          {u.global_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{u.product}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.plan}
                          onChange={(e) => updateUserProductAccess(u, { plan: e.target.value as ProductPlan })}
                          className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600"
                        >
                          <option value="free">free</option>
                          <option value="pro">pro</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${u.approval_status === 'approved' ? 'bg-primary/10 text-primary' :
                            u.approval_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                          }`}>
                          {u.approval_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateUserProductAccess(u, { approval_status: 'approved' })} className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:opacity-90 transition-colors">Aprovar</button>
                          <button onClick={() => updateUserProductAccess(u, { approval_status: 'blocked' })} className="px-3 py-1.5 bg-slate-700 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-colors">Bloquear</button>
                          <button onClick={() => updateUserProductAccess(u, { approval_status: 'rejected' })} className="px-3 py-1.5 bg-rose-600 text-white text-[10px] font-bold rounded-lg hover:bg-rose-700 transition-colors">Rejeitar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {adminUsers
              .filter(u =>
                !dentistSearchTerm ||
                u.name?.toLowerCase().includes(dentistSearchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(dentistSearchTerm.toLowerCase())
              )
              .filter(u => dentistStatusFilter === 'all' || u.approval_status === dentistStatusFilter)
              .map((u) => (
                <div key={`${u.user_id}-${u.product}-mobile`} className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold">
                        {(u.name || '?').charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{u.product} · {u.plan} · {u.product_role}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.approval_status === 'approved' ? 'bg-primary/10 text-primary' :
                        u.approval_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                      }`}>
                      {u.approval_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{u.email}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={u.plan} onChange={(e) => updateUserProductAccess(u, { plan: e.target.value as ProductPlan })} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                      <option value="free">free</option>
                      <option value="pro">pro</option>
                    </select>
                    <select value={u.product_role} onChange={(e) => updateUserProductAccess(u, { product_role: e.target.value })} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                      <option value="student">student</option>
                      <option value="dentist">dentist</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateUserProductAccess(u, { approval_status: 'approved' })} className="flex-1 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:opacity-90 transition-colors">Aprovar</button>
                    <button onClick={() => updateUserProductAccess(u, { approval_status: 'blocked' })} className="flex-1 py-2 bg-slate-700 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-colors">Bloquear</button>
                    <button onClick={() => updateUserProductAccess(u, { approval_status: 'rejected' })} className="flex-1 py-2 bg-rose-600 text-white text-[10px] font-bold rounded-lg hover:bg-rose-700 transition-colors">Rejeitar</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
