import React, { useCallback, useEffect, useState } from 'react';
import { CreditCard, Clock } from '../../icons';

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

interface AdminSubscriptionRow {
  id: number;
  product: string;
  status: string;
  plan_name: string;
  plan_type: string;
  amount: string;
  user_name: string;
  user_email: string;
  current_plan: string;
  created_at: string;
  next_payment_date: string | null;
  last_payment_date: string | null;
}

const STATUS_STYLE: Record<string, string> = {
  authorized: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  paused: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-slate-100 text-slate-600',
  expired: 'bg-rose-100 text-rose-700',
};

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-BR');
}

export function AdminSubscriptionsPanel({
  apiFetch,
  product,
}: {
  apiFetch: ApiFetch;
  product: string;
}) {
  const [rows, setRows] = useState<AdminSubscriptionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ product, limit: '100', page: '1' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await apiFetch(`/api/admin/subscriptions?${params.toString()}`, { product });
      if (res.ok) {
        const data = await res.json();
        setRows(data.subscriptions || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Admin subscriptions load error:', error);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, product, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Assinaturas</h3>
          <p className="text-sm text-slate-500">{total} registros · checkout, pagamento e status MP</p>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
          >
            <option value="all">Todos os status</option>
            <option value="authorized">Ativas</option>
            <option value="pending">Pendentes</option>
            <option value="paused">Pausadas</option>
            <option value="cancelled">Canceladas</option>
            <option value="expired">Expiradas</option>
          </select>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Clock size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-8 text-slate-400">Carregando assinaturas...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full min-w-[880px] text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-4 py-3">Aluno</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Próx. cobrança</th>
                <th className="px-4 py-3">Último pagamento</th>
                <th className="px-4 py-3">Criada em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 text-sm">{row.user_name}</p>
                    <p className="text-xs text-slate-400">{row.user_email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="inline-flex items-center gap-1">
                      <CreditCard size={14} className="text-slate-400" />
                      {row.plan_name || row.plan_type}
                    </div>
                    <p className="text-[10px] uppercase text-slate-400">acesso: {row.current_plan}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLE[row.status] || 'bg-slate-100 text-slate-600'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                    {Number(row.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDate(row.next_payment_date)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDate(row.last_payment_date)}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(row.created_at)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Nenhuma assinatura encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
