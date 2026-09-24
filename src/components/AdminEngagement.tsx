import React, { useEffect, useState } from 'react';
import { Activity, Users, TrendingUp, Clock, UserX, CheckCircle2 } from '../icons';

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

interface AdminEngagementProps {
  apiFetch: ApiFetch;
  product: string;
  compact?: boolean;
}

interface Overview {
  total_users: string;
  approved_users: string;
  dau: string;
  wau: string;
  mau: string;
  never_logged_in: string;
  churned: string;
  onboarding_incomplete: string;
  welcome_seen_count: string;
  record_opened_count: string;
  activation_stuck: string;
}

interface EngagementUser {
  id: number;
  name: string;
  email: string;
  product: string;
  plan: string;
  approval_status: string;
  engagement_status: string;
  account_kind?: string;
  product_last_login_at: string | null;
  product_last_seen_at: string | null;
  login_count: number;
  created_at: string;
  onboarding_completed: boolean;
  welcome_seen: boolean;
  record_opened: boolean;
  patient_count: number;
  appointment_count: number;
  last_patient_at: string | null;
  last_appointment_at: string | null;
  returned_next_day?: boolean;
  first_paywall_at?: string | null;
  last_paywall_surface?: string | null;
  student_cta_at?: string | null;
  checkout_started_at?: string | null;
  paid_at?: string | null;
  first_box_mode_at?: string | null;
  first_game_at?: string | null;
  subscription_status?: string | null;
  subscription_plan?: string | null;
  coupon_code?: string | null;
  coupon_ambassador?: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: 'Ativo', color: 'bg-emerald-100 text-emerald-700' },
  inactive: { label: 'Inativo', color: 'bg-amber-100 text-amber-700' },
  churned: { label: 'Abandonou', color: 'bg-rose-100 text-rose-700' },
  never_logged_in: { label: 'Nunca entrou', color: 'bg-slate-100 text-slate-600' },
  unknown: { label: 'Indefinido', color: 'bg-slate-100 text-slate-500' },
};

const KIND_LABELS: Record<string, string> = {
  standard: 'Aluno',
  ambassador: 'Embaixador',
  test: 'Teste',
};

function formatRelative(dateStr: string | null) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem. atrás`;
  return `${Math.floor(diffDays / 30)} mês(es) atrás`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getFunnelStage(u: EngagementUser) {
  if (u.paid_at || u.subscription_status === 'authorized') return { label: 'Pagou', color: 'bg-emerald-100 text-emerald-800' };
  if (u.checkout_started_at) return { label: 'Checkout', color: 'bg-blue-100 text-blue-700' };
  if (u.student_cta_at) return { label: 'CTA Student', color: 'bg-indigo-100 text-indigo-700' };
  if (u.first_paywall_at) return { label: 'Paywall', color: 'bg-violet-100 text-violet-700' };
  if (u.first_box_mode_at) return { label: 'Modo Box', color: 'bg-cyan-100 text-cyan-700' };
  if (u.first_game_at) return { label: 'Jogo', color: 'bg-sky-100 text-sky-700' };
  if (u.patient_count >= 1) return { label: '1º paciente', color: 'bg-primary/10 text-primary' };
  if (u.record_opened) return { label: 'Prontuário', color: 'bg-emerald-100 text-emerald-700' };
  if (u.welcome_seen) return { label: 'Welcome', color: 'bg-slate-100 text-slate-600' };
  return { label: 'Novo', color: 'bg-slate-100 text-slate-500' };
}

function yesNo(value: boolean | undefined) {
  return value ? 'Sim' : '—';
}

export default function AdminEngagement({ apiFetch, product, compact = false }: AdminEngagementProps) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<EngagementUser[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState<'all' | 'odontohub' | 'academy'>('academy');
  const [excludeTest, setExcludeTest] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const excludeParam = excludeTest ? 'true' : 'false';
      const [overviewRes, usersRes] = await Promise.all([
        apiFetch(`/api/admin/metrics/overview?product=${productFilter}`, { product }),
        apiFetch(
          `/api/admin/metrics/engagement?product=${productFilter}&status=${statusFilter}&exclude_test=${excludeParam}&limit=200`,
          { product },
        ),
      ]);
      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setOverview(data.overview);
      }
      if (usersRes.ok) {
        setUsers(await usersRes.json());
      }
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [productFilter, statusFilter, excludeTest]);

  const cards = overview ? [
    { label: 'Usuários aprovados', value: overview.approved_users, icon: Users, color: 'text-primary' },
    { label: 'Ativos (7 dias)', value: overview.wau, icon: Activity, color: 'text-emerald-600' },
    { label: 'Ativos (30 dias)', value: overview.mau, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Nunca entraram', value: overview.never_logged_in, icon: Clock, color: 'text-slate-500' },
    { label: 'Abandonaram', value: overview.churned, icon: UserX, color: 'text-rose-600' },
    { label: 'Onboarding pendente', value: overview.onboarding_incomplete, icon: CheckCircle2, color: 'text-amber-600' },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            {compact ? 'Engajamento resumido' : 'Engajamento detalhado'}
          </h3>
          <p className="text-slate-500 text-sm">
            Retenção, funil por usuário, assinatura e cupom de embaixador
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value as typeof productFilter)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600"
          >
            <option value="all">Todos os produtos</option>
            <option value="odontohub">OdontoHub</option>
            <option value="academy">Academy</option>
          </select>
          {!compact && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="churned">Abandonaram</option>
              <option value="never_logged_in">Nunca entraram</option>
            </select>
          )}
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm">
            <input type="checkbox" checked={excludeTest} onChange={(e) => setExcludeTest(e.target.checked)} />
            Sem contas teste
          </label>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Carregando métricas...</div>
      ) : (
        <>
          <div className={`grid gap-3 ${compact ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
            {cards.map((card) => (
              <div key={card.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <card.icon size={16} className={card.color} />
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{card.label}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{card.value || '0'}</p>
              </div>
            ))}
          </div>

          {!compact && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="px-4 py-3">Usuário</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Funil</th>
                      <th className="px-4 py-3">D+1</th>
                      <th className="px-4 py-3">Paywall</th>
                      <th className="px-4 py-3">Assinatura</th>
                      <th className="px-4 py-3">Cupom</th>
                      <th className="px-4 py-3">Pacientes</th>
                      <th className="px-4 py-3">Último acesso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => {
                      const status = STATUS_LABELS[u.engagement_status] || STATUS_LABELS.unknown;
                      const funnel = getFunnelStage(u);
                      return (
                        <tr key={`${u.id}-${u.product}`} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                            <p className="text-[10px] text-slate-400">{u.product} · {u.plan}</p>
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold text-slate-600">
                            {KIND_LABELS[u.account_kind || 'standard'] || u.account_kind}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${funnel.color}`}>
                              {funnel.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{yesNo(u.returned_next_day)}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">
                            {u.last_paywall_surface || (u.first_paywall_at ? 'registrado' : '—')}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {u.subscription_status ? (
                              <span className="font-bold text-slate-700">{u.subscription_status}</span>
                            ) : '—'}
                            {u.subscription_plan && (
                              <p className="text-slate-400">{u.subscription_plan}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">
                            {u.coupon_code ? (
                              <>
                                <span className="font-bold">{u.coupon_code}</span>
                                {u.coupon_ambassador && (
                                  <p className="text-slate-400">{u.coupon_ambassador}</p>
                                )}
                              </>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{u.patient_count}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{formatRelative(u.product_last_seen_at)}</td>
                        </tr>
                      );
                    })}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={10} className="px-4 py-8 text-center text-slate-400">Nenhum usuário encontrado</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden divide-y divide-slate-100">
                {users.map((u) => {
                  const status = STATUS_LABELS[u.engagement_status] || STATUS_LABELS.unknown;
                  const funnel = getFunnelStage(u);
                  return (
                    <div key={`${u.id}-${u.product}-mobile`} className="p-4 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {KIND_LABELS[u.account_kind || 'standard']} · {funnel.label} · D+1: {yesNo(u.returned_next_day)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {u.subscription_status || 'sem assinatura'} · cupom: {u.coupon_code || '—'}
                      </p>
                      <p className="text-xs text-slate-500">{u.patient_count} pacientes · {formatRelative(u.product_last_seen_at)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
