import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Plus, Search, Ticket, Trash2, X } from '../../icons';
import { cancelAmbassadorCoupon, createAmbassadorCoupon, listAmbassadorCoupons } from '../coupons/api';
import {
  formatDiscountLabel,
  remainingRedemptions,
  validateCreateCouponInput,
} from '../coupons/couponUtils';
import type { AmbassadorCoupon, CouponDiscountType, CouponStatus } from '../coupons/types';

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

const STATUS_LABEL: Record<CouponStatus, { label: string; className: string }> = {
  active: { label: 'Ativo', className: 'bg-primary/10 text-primary' },
  cancelled: { label: 'Cancelado', className: 'bg-slate-100 text-slate-500' },
  expired: { label: 'Esgotado', className: 'bg-amber-100 text-amber-700' },
};

const EMPTY_FORM = {
  code: '',
  ambassador_name: '',
  discount_type: 'percent' as CouponDiscountType,
  discount_value: '20',
  max_redemptions: '',
  expires_at: '',
};

function formatDate(value: string | null): string {
  if (!value) return 'Sem validade';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR');
}

function copyCode(code: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(code);
  }
}

export function AmbassadorCouponsPanel({ apiFetch }: { apiFetch: ApiFetch }) {
  const [coupons, setCoupons] = useState<AmbassadorCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CouponStatus>('all');
  const [pendingCancel, setPendingCancel] = useState<AmbassadorCoupon | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listAmbassadorCoupons(apiFetch, 'academy');
    setCoupons(result.coupons);
    setUnavailable(result.unavailable);
    setError(result.error);
    setLoading(false);
  }, [apiFetch]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return coupons
      .filter((coupon) => statusFilter === 'all' || coupon.status === statusFilter)
      .filter((coupon) => {
        if (!term) return true;
        return (
          coupon.code.toLowerCase().includes(term)
          || coupon.ambassador_name.toLowerCase().includes(term)
        );
      });
  }, [coupons, search, statusFilter]);

  const activeCount = coupons.filter((coupon) => coupon.status === 'active').length;

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const validated = validateCreateCouponInput(form);
    if (validated.ok === false) {
      setError(validated.error);
      return;
    }
    setSaving(true);
    const result = await createAmbassadorCoupon(apiFetch, {
      ...validated.payload,
      notes: null,
    });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.coupon) {
      setCoupons((current) => [result.coupon as AmbassadorCoupon, ...current.filter((row) => row.id !== result.coupon?.id)]);
    } else {
      await load();
    }
    setNotice(`Cupom ${validated.payload.code} cadastrado.`);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleCancel = async (coupon: AmbassadorCoupon) => {
    setError(null);
    setNotice(null);
    setCancellingId(coupon.id);
    const result = await cancelAmbassadorCoupon(apiFetch, coupon.id, 'academy');
    setCancellingId(null);
    setPendingCancel(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setCoupons((current) => current.map((row) => (
      row.id === coupon.id
        ? result.coupon ?? { ...row, status: 'cancelled', cancelled_at: new Date().toISOString() }
        : row
    )));
    setNotice(`Cupom ${coupon.code} cancelado. Ele deixa de valer no checkout.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">Cupons de embaixadores</h3>
          <p className="text-slate-500 text-sm">
            Cadastre um código de desconto para o Academy Student ou cancele um cupom ativo.
            {activeCount > 0 ? ` ${activeCount} ativo${activeCount === 1 ? '' : 's'}.` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm((open) => !open);
            setError(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-2xl hover:opacity-90 transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Fechar' : 'Novo cupom'}
        </button>
      </div>

      {notice && (
        <div className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <p>{notice}</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 md:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Código</span>
              <input
                value={form.code}
                onChange={(e) => setForm((current) => ({ ...current, code: e.target.value.toUpperCase() }))}
                placeholder="SAMU20"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold tracking-wide"
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Embaixador</span>
              <input
                value={form.ambassador_name}
                onChange={(e) => setForm((current) => ({ ...current, ambassador_name: e.target.value }))}
                placeholder="Nome de quem indica"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Tipo de desconto</span>
              <select
                value={form.discount_type}
                onChange={(e) => setForm((current) => ({ ...current, discount_type: e.target.value as CouponDiscountType }))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-700 font-medium"
              >
                <option value="percent">Percentual (%)</option>
                <option value="amount">Valor fixo (R$)</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {form.discount_type === 'percent' ? 'Percentual' : 'Valor em reais'}
              </span>
              <input
                type="number"
                min="1"
                max={form.discount_type === 'percent' ? 100 : undefined}
                step={form.discount_type === 'percent' ? '1' : '0.01'}
                value={form.discount_value}
                onChange={(e) => setForm((current) => ({ ...current, discount_value: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Limite de usos</span>
              <input
                type="number"
                min="1"
                value={form.max_redemptions}
                onChange={(e) => setForm((current) => ({ ...current, max_redemptions: e.target.value }))}
                placeholder="Ilimitado"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Validade</span>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm((current) => ({ ...current, expires_at: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setShowForm(false);
              }}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || unavailable}
              className="px-4 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Cadastrando...' : 'Cadastrar cupom'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por código ou embaixador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="sm:w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-medium"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="cancelled">Cancelados</option>
          <option value="expired">Esgotados</option>
        </select>
      </div>

      {loading ? (
        <div className="py-10 text-center text-slate-400">Carregando cupons...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center">
          <Ticket size={28} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">Nenhum cupom neste filtro</p>
          <p className="mt-1 text-xs text-slate-500">
            {unavailable
              ? 'O backend ainda precisa das rotas de cupom. O prompt está em docs/BACKEND_AMBASSADOR_COUPONS_PROMPT.md.'
              : 'Cadastre o primeiro código do embaixador para o aluno usar no checkout do Student.'}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">Embaixador</th>
                  <th className="px-5 py-3">Desconto</th>
                  <th className="px-5 py-3">Usos</th>
                  <th className="px-5 py-3">Validade</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((coupon) => {
                  const remaining = remainingRedemptions(coupon);
                  const status = STATUS_LABEL[coupon.status];
                  return (
                    <tr key={coupon.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => copyCode(coupon.code)}
                          className="font-bold tracking-wide text-slate-800 hover:text-primary"
                          title="Copiar código"
                        >
                          {coupon.code}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{coupon.ambassador_name}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {formatDiscountLabel(coupon.discount_type, coupon.discount_value)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {coupon.redemption_count}
                        {coupon.max_redemptions != null ? ` / ${coupon.max_redemptions}` : ''}
                        {remaining != null ? ` · ${remaining} rest.` : ' · ilimitado'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{formatDate(coupon.expires_at)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {coupon.status === 'active' ? (
                          <button
                            type="button"
                            onClick={() => setPendingCancel(coupon)}
                            disabled={cancellingId === coupon.id}
                            className="px-3 py-1.5 bg-rose-600 text-white text-[10px] font-bold rounded-lg hover:bg-rose-700 disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.map((coupon) => {
              const remaining = remainingRedemptions(coupon);
              const status = STATUS_LABEL[coupon.status];
              return (
                <div key={`${coupon.id}-mobile`} className="rounded-2xl border border-slate-100 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold tracking-wide text-slate-800">{coupon.code}</p>
                      <p className="text-xs text-slate-500">{coupon.ambassador_name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatDiscountLabel(coupon.discount_type, coupon.discount_value)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {coupon.redemption_count} uso{coupon.redemption_count === 1 ? '' : 's'}
                    {remaining != null ? ` · ${remaining} restantes` : ' · ilimitado'}
                    {' · '}
                    {formatDate(coupon.expires_at)}
                  </p>
                  {coupon.status === 'active' && (
                    <button
                      type="button"
                      onClick={() => setPendingCancel(coupon)}
                      className="w-full py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
                    >
                      Cancelar cupom
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {pendingCancel && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl">
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <Trash2 size={22} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Cancelar cupom {pendingCancel.code}?</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                O código do embaixador {pendingCancel.ambassador_name} deixa de valer no checkout.
                Assinaturas já pagas com esse cupom não são desfeitas.
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                type="button"
                onClick={() => setPendingCancel(null)}
                className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Manter ativo
              </button>
              <button
                type="button"
                onClick={() => void handleCancel(pendingCancel)}
                disabled={cancellingId === pendingCancel.id}
                className="flex-1 rounded-full bg-rose-500 py-2.5 text-sm font-bold text-white hover:bg-rose-600 disabled:opacity-50"
              >
                {cancellingId === pendingCancel.id ? 'Cancelando...' : 'Cancelar cupom'}
              </button>
            </div>
          </div>
        </div>
      )}

      {unavailable && (
        <p className="flex items-center gap-2 text-xs text-slate-400">
          <Clock size={12} />
          Frontend pronto. Falta persistir as rotas no odontohub-api.
        </p>
      )}
    </div>
  );
}
