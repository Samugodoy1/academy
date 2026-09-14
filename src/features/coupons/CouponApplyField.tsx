import React, { useEffect, useState } from 'react';
import { CheckCircle2, Ticket, X } from '../../icons';
import { previewAmbassadorCoupon } from './api';
import {
  forgetCouponCode,
  formatCurrencyBRL,
  formatDiscountLabel,
  isValidCouponCodeFormat,
  normalizeCouponCode,
  rememberCouponCode,
} from './couponUtils';
import type { CouponPreview } from './types';

type ApiFetch = (url: string, options?: any) => Promise<Response>;

interface CouponApplyFieldProps {
  apiFetch: ApiFetch;
  product: string;
  planId?: number;
  originalAmount: number | null;
  neo?: boolean;
  initialCode?: string;
  onChange: (preview: CouponPreview | null) => void;
}

export function CouponApplyField({
  apiFetch,
  product,
  planId,
  originalAmount,
  neo = false,
  initialCode = '',
  onChange,
}: CouponApplyFieldProps) {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<CouponPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialCode) return;
    void applyCode(initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const applyCode = async (raw = code) => {
    const normalized = normalizeCouponCode(raw);
    setError(null);
    if (!isValidCouponCodeFormat(normalized)) {
      setError('Digite um código válido.');
      return;
    }
    setLoading(true);
    const result = await previewAmbassadorCoupon(apiFetch, product, normalized, planId, originalAmount);
    setLoading(false);

    if (result.unavailable) {
      const pending: CouponPreview = {
        valid: true,
        code: normalized,
        ambassador_name: null,
        discount_type: null,
        discount_value: null,
        original_amount: originalAmount,
        discounted_amount: originalAmount,
        currency: 'BRL',
        error: null,
      };
      setPreview(pending);
      rememberCouponCode(normalized);
      onChange(pending);
      setCode(normalized);
      return;
    }

    if (!result.preview.valid) {
      setPreview(null);
      forgetCouponCode();
      onChange(null);
      setError(result.preview.error || 'Cupom inválido ou expirado.');
      return;
    }

    setPreview(result.preview);
    rememberCouponCode(result.preview.code);
    onChange(result.preview);
    setCode(result.preview.code);
  };

  const clear = () => {
    setCode('');
    setPreview(null);
    setError(null);
    forgetCouponCode();
    onChange(null);
  };

  const inputClass = neo
    ? 'w-full rounded-2xl bg-white px-4 py-3 text-[15px] tracking-[-0.011em] text-[var(--neo-ink)] outline-none'
    : 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <div className="space-y-2">
      {preview?.valid ? (
        <div className={neo ? 'rounded-[20px] bg-white px-4 py-3' : 'rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3'}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={neo ? 'text-[13px] text-[var(--neo-gray)]' : 'text-[10px] uppercase tracking-wider text-emerald-700 font-bold'}>
                Cupom {preview.code}
              </p>
              <p className={neo ? 'mt-1 text-[17px] font-semibold tracking-[-0.022em] text-[var(--neo-ink)]' : 'mt-0.5 text-sm font-bold text-slate-800'}>
                {preview.discount_type && preview.discount_value != null
                  ? formatDiscountLabel(preview.discount_type, preview.discount_value)
                  : 'Será aplicado no checkout'}
              </p>
              {preview.ambassador_name && (
                <p className={neo ? 'mt-1 text-[13px] text-[var(--neo-gray)]' : 'text-xs text-slate-500'}>
                  Embaixador {preview.ambassador_name}
                </p>
              )}
              {preview.original_amount != null && preview.discounted_amount != null && preview.discounted_amount < preview.original_amount && (
                <p className={neo ? 'mt-1 text-[15px] text-[var(--neo-ink)]' : 'mt-1 text-sm font-semibold text-slate-800'}>
                  De {formatCurrencyBRL(preview.original_amount)} por {formatCurrencyBRL(preview.discounted_amount)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={clear}
              className={neo ? 'text-[13px] text-[var(--neo-gray)]' : 'rounded-full p-1 text-slate-400 hover:bg-white hover:text-slate-600'}
              aria-label="Remover cupom"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Ticket size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${neo ? 'text-[var(--neo-gray)]' : 'text-slate-400'}`} />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void applyCode();
                }
              }}
              placeholder="Cupom de embaixador"
              className={`${inputClass} pl-9`}
              autoComplete="off"
              disabled={loading}
            />
          </div>
          <button
            type="button"
            onClick={() => void applyCode()}
            disabled={loading}
            className={neo ? 'neo-pill-secondary !px-4 !py-3 !text-[15px] disabled:opacity-50' : 'rounded-xl bg-slate-900 px-3 text-sm font-semibold text-white disabled:opacity-50'}
          >
            {loading ? '...' : 'Aplicar'}
          </button>
        </div>
      )}
      {error && (
        <p className={neo ? 'text-[13px] text-rose-600' : 'text-xs text-rose-600'}>{error}</p>
      )}
      {preview?.valid && !preview.discount_type && (
        <p className={neo ? 'flex items-center gap-1.5 text-[13px] text-[var(--neo-gray)]' : 'flex items-center gap-1.5 text-[11px] text-slate-500'}>
          <CheckCircle2 size={12} />
          Código guardado. O desconto entra no pagamento.
        </p>
      )}
    </div>
  );
}
