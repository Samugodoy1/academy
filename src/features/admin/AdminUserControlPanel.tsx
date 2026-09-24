import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Shield,
  UserRound,
} from '../../icons';
import { DEFAULT_PRODUCT } from '../../app/constants';
import { adminPlanSelectOptions, adminPlanSelectValue } from './adminPlanSelect';
import type { AccountKind, AdminUserAccess } from './AdminTab';
import {
  PRESENCE_DOT,
  PRESENCE_LABELS,
  type PresenceStatus,
} from './adminUserPresence';
import {
  croByUserId,
  pickCro,
  rowsFromAdminUsersPayload,
  showsOdontohubCro,
  withResolvedCro,
} from './adminUserCro';
import type { Product, ProductApprovalStatus, ProductPlan } from '../../types/clinical';

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

export interface DirectoryUser {
  user_id: number;
  id: number;
  name: string;
  email: string;
  photo_url: string | null;
  global_role: string;
  global_status: string;
  account_kind: AccountKind;
  product: Product;
  plan: ProductPlan;
  product_role: string;
  approval_status: ProductApprovalStatus;
  presence_status: PresenceStatus;
  engagement_status: string;
  product_last_seen_at: string | null;
  product_last_login_at: string | null;
  login_count: number;
  patient_count: number;
  created_at: string;
  subscription_id: number | null;
  subscription_status: string | null;
  subscription_plan: string | null;
  subscription_amount: string | null;
  next_payment_date: string | null;
  coupon_code: string | null;
  coupon_ambassador: string | null;
  cro?: string | null;
}

interface DirectoryResponse {
  users: DirectoryUser[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

const ACCOUNT_KIND_OPTIONS: { value: AccountKind; label: string }[] = [
  { value: 'standard', label: 'Aluno' },
  { value: 'ambassador', label: 'Embaixador' },
  { value: 'test', label: 'Teste' },
];

function formatRelative(dateStr: string | null) {
  if (!dateStr) return '—';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Agora';
  if (diffMin < 60) return `${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} d`;
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function UserAvatar({ name, photoUrl, presence }: { name: string; photoUrl: string | null; presence: PresenceStatus }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className="relative shrink-0">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          className="w-14 h-14 rounded-2xl object-cover bg-slate-100 ring-2 ring-white shadow-sm"
        />
      ) : (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 ring-2 ring-white shadow-sm">
          {initial}
        </div>
      )}
      <span
        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white ${PRESENCE_DOT[presence]}`}
        title={PRESENCE_LABELS[presence]}
      />
    </div>
  );
}

export function AdminUserControlPanel({
  apiFetch,
  updateUserProductAccess,
}: {
  apiFetch: ApiFetch;
  updateUserProductAccess: (
    access: AdminUserAccess,
    changes: Partial<{ plan: ProductPlan; product_role: string; approval_status: ProductApprovalStatus; account_kind: AccountKind; global_status: string }>,
  ) => void | Promise<void>;
}) {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(40);
  const [productFilter, setProductFilter] = useState<'all' | Product>(DEFAULT_PRODUCT);
  const [approvalFilter, setApprovalFilter] = useState<'all' | ProductApprovalStatus>('all');
  const [accountKindFilter, setAccountKindFilter] = useState<'all' | AccountKind>('all');
  const [presenceFilter, setPresenceFilter] = useState('all');
  const [sort, setSort] = useState('last_seen');
  const [data, setData] = useState<DirectoryResponse | null>(null);
  const [croIndex, setCroIndex] = useState<Map<number, string>>(() => new Map());
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadDirectory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
        product: productFilter,
      });
      if (debouncedQ.length >= 2) params.set('q', debouncedQ);
      if (approvalFilter !== 'all') params.set('approval_status', approvalFilter);
      if (accountKindFilter !== 'all') params.set('account_kind', accountKindFilter);
      if (presenceFilter !== 'all') params.set('presence', presenceFilter);

      const directoryUrl = `/api/admin/users/directory?${params.toString()}`;
      const needsCro = productFilter === 'all' || productFilter === 'odontohub';
      const [res, croRes] = await Promise.all([
        apiFetch(directoryUrl, { product: DEFAULT_PRODUCT }),
        needsCro
          ? apiFetch('/api/admin/users?product=odontohub', { product: DEFAULT_PRODUCT })
          : Promise.resolve(null),
      ]);
      if (!res.ok) {
        setError('Não foi possível carregar usuários. Confirme se a API foi atualizada.');
        setData(null);
        return;
      }
      const payload = await res.json() as DirectoryResponse;
      const index = croRes?.ok
        ? croByUserId(rowsFromAdminUsersPayload(await croRes.json()))
        : new Map<number, string>();
      setCroIndex(index);
      setData({
        ...payload,
        users: (payload.users ?? []).map((user) => withResolvedCro(user, index)),
      });
    } catch {
      setError('Erro de conexão ao carregar usuários.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [
    apiFetch,
    page,
    limit,
    sort,
    productFilter,
    debouncedQ,
    approvalFilter,
    accountKindFilter,
    presenceFilter,
  ]);

  useEffect(() => {
    void loadDirectory();
  }, [loadDirectory]);

  const toAccess = (u: DirectoryUser): AdminUserAccess => ({
    user_id: u.user_id,
    id: u.id,
    name: u.name,
    email: u.email,
    product: u.product,
    plan: u.plan,
    product_role: u.product_role,
    approval_status: u.approval_status,
    global_role: u.global_role,
    global_status: u.global_status,
    account_kind: u.account_kind,
  });

  const runAction = async (user: DirectoryUser, fn: () => Promise<void>) => {
    setActionUserId(user.user_id);
    try {
      await fn();
      await loadDirectory();
    } finally {
      setActionUserId(null);
    }
  };

  const cancelSubscription = async (user: DirectoryUser) => {
    if (!user.subscription_id) return;
    if (!window.confirm(`Cancelar renovação da assinatura de ${user.name}?`)) return;
    setActionUserId(user.user_id);
    try {
      const res = await apiFetch(`/api/admin/subscriptions/${user.subscription_id}`, {
        method: 'PATCH',
        product: DEFAULT_PRODUCT,
        body: JSON.stringify({ action: 'cancel', reason: 'admin_panel' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body.error || 'Falha ao cancelar assinatura');
        return;
      }
      await loadDirectory();
    } finally {
      setActionUserId(null);
    }
  };

  const summary = useMemo(() => {
    if (!data) return null;
    const start = (data.page - 1) * data.limit + 1;
    const end = Math.min(data.page * data.limit, data.total);
    return { start: data.total === 0 ? 0 : start, end, total: data.total };
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Controle de usuários</h3>
        <p className="text-sm text-slate-500">
          Gerencie plano, conta, presença e assinatura — paginado para escalar com milhares de cadastros
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="search"
            placeholder="Buscar nome ou e-mail (mín. 2 caracteres)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={productFilter}
          onChange={(e) => { setProductFilter(e.target.value as 'all' | Product); setPage(1); }}
          className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium"
        >
          <option value="all">Todos produtos</option>
          <option value="academy">Academy</option>
          <option value="odontohub">OdontoHub</option>
        </select>
        <select
          value={approvalFilter}
          onChange={(e) => { setApprovalFilter(e.target.value as typeof approvalFilter); setPage(1); }}
          className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium"
        >
          <option value="all">Aprovação</option>
          <option value="approved">Aprovados</option>
          <option value="pending">Pendentes</option>
          <option value="blocked">Bloqueados</option>
          <option value="rejected">Rejeitados</option>
        </select>
        <select
          value={accountKindFilter}
          onChange={(e) => { setAccountKindFilter(e.target.value as typeof accountKindFilter); setPage(1); }}
          className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium"
        >
          <option value="all">Tipo de conta</option>
          {ACCOUNT_KIND_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={presenceFilter}
          onChange={(e) => { setPresenceFilter(e.target.value); setPage(1); }}
          className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium"
        >
          <option value="all">Presença</option>
          <option value="online">Online agora</option>
          <option value="recent">Últimas 24h</option>
          <option value="away">Última semana</option>
          <option value="offline">Inativos</option>
          <option value="never">Nunca entraram</option>
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium"
        >
          <option value="last_seen">Último acesso</option>
          <option value="created">Cadastro</option>
          <option value="name">Nome</option>
          <option value="email">E-mail</option>
        </select>
      </div>

      {summary && (
        <p className="text-xs font-medium text-slate-500">
          Exibindo {summary.start}–{summary.end} de {summary.total} acessos
          {debouncedQ ? ` · busca: “${debouncedQ}”` : ''}
        </p>
      )}

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
          <Loader2 size={20} className="animate-spin" />
          Carregando usuários...
        </div>
      ) : (
        <div className="space-y-3">
          {(data?.users ?? []).map((user) => {
            const busy = actionUserId === user.user_id;
            const presence = user.presence_status || 'never';
            return (
              <article
                key={`${user.user_id}-${user.product}`}
                className="rounded-2xl border border-slate-100 bg-white p-4 md:p-5 shadow-sm hover:border-slate-200 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex gap-4 min-w-0 flex-1">
                    <UserAvatar name={user.name} photoUrl={user.photo_url} presence={presence} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 truncate">{user.name}</h4>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          #{user.user_id}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {PRESENCE_LABELS[presence]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                      {showsOdontohubCro(user.product) && (
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">
                          CRO {pickCro(user) || croIndex.get(user.user_id) || 'não informado'}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {user.product} · {user.plan}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {user.approval_status}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
                          {ACCOUNT_KIND_OPTIONS.find((o) => o.value === user.account_kind)?.label || user.account_kind}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          global: {user.global_status}
                        </span>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                        <div>
                          <dt className="text-slate-400">Último visto</dt>
                          <dd className="font-semibold">{formatRelative(user.product_last_seen_at)}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">Logins</dt>
                          <dd className="font-semibold">{user.login_count ?? 0}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">Pacientes</dt>
                          <dd className="font-semibold">{user.patient_count}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">Assinatura</dt>
                          <dd className="font-semibold">
                            {user.subscription_status || '—'}
                            {user.subscription_plan ? ` · ${user.subscription_plan}` : ''}
                          </dd>
                        </div>
                      </dl>
                      {user.coupon_code && (
                        <p className="mt-2 text-xs text-slate-500">
                          Cupom <span className="font-bold text-slate-700">{user.coupon_code}</span>
                          {user.coupon_ambassador ? ` · ${user.coupon_ambassador}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="lg:w-[320px] shrink-0 space-y-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-4">
                    <select
                      value={user.account_kind || 'standard'}
                      disabled={busy}
                      onChange={(e) => void runAction(user, () => updateUserProductAccess(toAccess(user), { account_kind: e.target.value as AccountKind }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    >
                      {ACCOUNT_KIND_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <select
                      value={adminPlanSelectValue(user.product, user.plan)}
                      disabled={busy}
                      onChange={(e) => void runAction(user, () => updateUserProductAccess(toAccess(user), { plan: e.target.value as ProductPlan }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    >
                      {adminPlanSelectOptions(user.product).map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <select
                      value={user.product_role}
                      disabled={busy}
                      onChange={(e) => void runAction(user, () => updateUserProductAccess(toAccess(user), { product_role: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    >
                      <option value="student">student</option>
                      <option value="dentist">dentist</option>
                      <option value="admin">admin</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void runAction(user, () => updateUserProductAccess(toAccess(user), { approval_status: 'approved' }))}
                        className="py-2 rounded-xl bg-primary text-white text-[10px] font-bold uppercase"
                      >
                        Aprovar
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void runAction(user, () => updateUserProductAccess(toAccess(user), { approval_status: 'blocked' }))}
                        className="py-2 rounded-xl bg-slate-800 text-white text-[10px] font-bold uppercase"
                      >
                        Bloquear
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void runAction(user, () => updateUserProductAccess(toAccess(user), { global_status: 'blocked' }))}
                        className="py-2 rounded-xl bg-rose-600 text-white text-[10px] font-bold uppercase"
                      >
                        Desativar
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void runAction(user, () => updateUserProductAccess(toAccess(user), { global_status: 'active', approval_status: 'approved' }))}
                        className="py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-bold uppercase"
                      >
                        Reativar
                      </button>
                    </div>
                    {user.subscription_id && ['authorized', 'pending', 'paused'].includes(user.subscription_status || '') && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void cancelSubscription(user)}
                        className="w-full py-2 rounded-xl border border-rose-200 text-rose-700 text-[10px] font-bold uppercase hover:bg-rose-50"
                      >
                        Cancelar assinatura
                      </button>
                    )}
                    {busy && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin" /> Salvando...
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {(data?.users?.length ?? 0) === 0 && !error && (
            <div className="text-center py-12 text-slate-400">
              <UserRound size={32} className="mx-auto mb-2 opacity-40" />
              Nenhum usuário nesta página
            </div>
          )}
        </div>
      )}

      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="text-sm text-slate-600 font-medium">
            Página {data.page} de {data.total_pages}
          </span>
          <button
            type="button"
            disabled={page >= data.total_pages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold disabled:opacity-40"
          >
            Próxima <ChevronRight size={16} />
          </button>
        </div>
      )}

      <p className="text-[11px] text-slate-400 flex items-center gap-1">
        <Shield size={12} />
        Desativar bloqueia login global; bloquear remove acesso ao produto; cancelar assinatura não reembolsa.
      </p>
    </div>
  );
}
