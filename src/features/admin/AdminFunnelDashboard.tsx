import React, { useCallback, useEffect, useState } from 'react';
import { Activity, CreditCard, TrendingUp, Users } from '../../icons';

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

interface FunnelStep {
  key: string;
  label: string;
  count: number;
  rate_from_previous: number | null;
  rate_from_approved: number | null;
}

interface FunnelResponse {
  product: string;
  exclude_test: boolean;
  summary: {
    approved_users: number;
    active_subscriptions: number;
    coupon_users: number;
  };
  funnel: FunnelStep[];
  paywall_surfaces: { surface: string; users: number }[];
  account_kinds: { account_kind: string; users: number }[];
}

const KIND_LABELS: Record<string, string> = {
  standard: 'Alunos',
  ambassador: 'Embaixadores',
  test: 'Contas de teste',
};

export function AdminFunnelDashboard({
  apiFetch,
  product,
}: {
  apiFetch: ApiFetch;
  product: string;
}) {
  const [data, setData] = useState<FunnelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [excludeTest, setExcludeTest] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(
        `/api/admin/metrics/funnel?product=${product}&exclude_test=${excludeTest ? 'true' : 'false'}`,
        { product },
      );
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error('Admin funnel load error:', error);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, product, excludeTest]);

  useEffect(() => {
    void load();
  }, [load]);

  const maxCount = data?.funnel?.[0]?.count || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">Funil Academy</h3>
          <p className="text-sm text-slate-500">
            Da aprovação ao pagamento — inclui paywall, checkout e assinatura ativa
          </p>
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={excludeTest}
            onChange={(e) => setExcludeTest(e.target.checked)}
            className="rounded border-slate-300"
          />
          Excluir contas de teste das métricas
        </label>
      </div>

      {loading ? (
        <p className="text-center py-10 text-slate-400">Carregando funil...</p>
      ) : !data ? (
        <p className="text-center py-10 text-slate-400">Não foi possível carregar o funil.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Users size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aprovados</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{data.summary.approved_users}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <CreditCard size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assinaturas ativas</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{data.summary.active_subscriptions}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <TrendingUp size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Com cupom</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{data.summary.coupon_users}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-primary" />
              <h4 className="font-bold text-slate-900">Conversão por etapa</h4>
            </div>
            {data.funnel.map((step, index) => {
              const width = Math.max(8, Math.round((step.count / maxCount) * 100));
              return (
                <div key={step.key} className="grid grid-cols-1 md:grid-cols-[180px_1fr_120px] gap-2 items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                    {index > 0 && step.rate_from_previous != null && (
                      <p className="text-[11px] text-slate-500">
                        {step.rate_from_previous}% da etapa anterior
                      </p>
                    )}
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <p className="text-right text-lg font-bold text-slate-900 tabular-nums">{step.count}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
              <h4 className="font-bold text-slate-900 mb-3">Paywalls exibidos</h4>
              {data.paywall_surfaces.length === 0 ? (
                <p className="text-sm text-slate-400">Nenhum paywall registrado ainda.</p>
              ) : (
                <ul className="space-y-2">
                  {data.paywall_surfaces.map((row) => (
                    <li key={row.surface} className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">{row.surface}</span>
                      <span className="font-bold text-slate-900">{row.users}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
              <h4 className="font-bold text-slate-900 mb-3">Tipos de conta</h4>
              <ul className="space-y-2">
                {data.account_kinds.map((row) => (
                  <li key={row.account_kind} className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">
                      {KIND_LABELS[row.account_kind] || row.account_kind}
                    </span>
                    <span className="font-bold text-slate-900">{row.users}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
