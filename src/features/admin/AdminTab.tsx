import React, { useState } from 'react';
import { Activity, Users, CreditCard, Ticket, Shield } from '../../icons';
import AdminEngagement from '../../components/AdminEngagement';
import { DEFAULT_PRODUCT } from '../../app/constants';
import { AmbassadorCouponsPanel } from './AmbassadorCouponsPanel';
import { AdminFunnelDashboard } from './AdminFunnelDashboard';
import { AdminSubscriptionsPanel } from './AdminSubscriptionsPanel';
import { AdminUserControlPanel } from './AdminUserControlPanel';
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
  photo_url?: string | null;
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
  updateUserProductAccess: (
    access: AdminUserAccess,
    changes: Partial<ProductAccess> & { account_kind?: AccountKind; global_status?: string },
  ) => void | Promise<void>;
}

type AdminSection = 'overview' | 'control' | 'users' | 'subscriptions' | 'coupons';

const SECTIONS: { id: AdminSection; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'overview', label: 'Visão geral', icon: Activity },
  { id: 'control', label: 'Controle', icon: Shield },
  { id: 'users', label: 'Engajamento', icon: Users },
  { id: 'subscriptions', label: 'Assinaturas', icon: CreditCard },
  { id: 'coupons', label: 'Cupons', icon: Ticket },
];

export function AdminTab({
  apiFetch,
  updateUserProductAccess,
}: AdminTabProps) {
  const [section, setSection] = useState<AdminSection>('control');

  return (
    <div className="page-shell space-y-6">
      <header className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Painel de controle</h2>
          <p className="text-sm text-slate-500">
            Funil, gestão de contas em escala, assinaturas e cupons de embaixador
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
        <>
          <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <AdminFunnelDashboard apiFetch={apiFetch} product={DEFAULT_PRODUCT} />
          </div>
          <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <AdminEngagement apiFetch={apiFetch} product={DEFAULT_PRODUCT} compact />
          </div>
        </>
      )}

      {section === 'control' && (
        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <AdminUserControlPanel apiFetch={apiFetch} updateUserProductAccess={updateUserProductAccess} />
        </div>
      )}

      {section === 'users' && (
        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <AdminEngagement apiFetch={apiFetch} product={DEFAULT_PRODUCT} />
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
    </div>
  );
}
