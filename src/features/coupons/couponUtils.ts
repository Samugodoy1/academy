import type {
  AmbassadorCoupon,
  CouponDiscountType,
  CouponPreview,
  CouponStatus,
  CreateAmbassadorCouponInput,
} from './types';

export const ACADEMY_COUPON_STORAGE_KEY = 'academy_ambassador_coupon';
export const COUPON_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{2,31}$/;

export function normalizeCouponCode(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

export function isValidCouponCodeFormat(code: string): boolean {
  return COUPON_CODE_PATTERN.test(normalizeCouponCode(code));
}

export function couponCodeFromSearch(search: string): string {
  const query = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  return normalizeCouponCode(params.get('coupon') || params.get('cupom') || '');
}

export function rememberCouponCode(code: string): void {
  if (typeof sessionStorage === 'undefined') return;
  const normalized = normalizeCouponCode(code);
  if (normalized) sessionStorage.setItem(ACADEMY_COUPON_STORAGE_KEY, normalized);
  else sessionStorage.removeItem(ACADEMY_COUPON_STORAGE_KEY);
}

export function recalledCouponCode(): string {
  if (typeof sessionStorage === 'undefined') return '';
  return normalizeCouponCode(sessionStorage.getItem(ACADEMY_COUPON_STORAGE_KEY) || '');
}

export function forgetCouponCode(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(ACADEMY_COUPON_STORAGE_KEY);
}

export function parseMoney(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function applyCouponDiscount(
  amount: number,
  discountType: CouponDiscountType,
  discountValue: number,
): number {
  if (!Number.isFinite(amount) || amount < 0) return 0;
  if (!Number.isFinite(discountValue) || discountValue <= 0) return roundMoney(amount);

  if (discountType === 'percent') {
    const pct = Math.min(100, Math.max(0, discountValue));
    return roundMoney(amount * (1 - pct / 100));
  }

  return roundMoney(Math.max(0, amount - discountValue));
}

export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDiscountLabel(
  discountType: CouponDiscountType | null,
  discountValue: number | null,
): string {
  if (discountType == null || discountValue == null) return '';
  if (discountType === 'percent') return `${discountValue}% de desconto`;
  return `${formatCurrencyBRL(discountValue)} de desconto`;
}

export function couponStatusFromRecord(coupon: {
  status?: unknown;
  expires_at?: unknown;
  cancelled_at?: unknown;
  max_redemptions?: unknown;
  redemption_count?: unknown;
}): CouponStatus {
  const raw = typeof coupon.status === 'string' ? coupon.status.toLowerCase() : '';
  if (raw === 'cancelled' || coupon.cancelled_at) return 'cancelled';
  if (raw === 'expired') return 'expired';

  if (typeof coupon.expires_at === 'string' && coupon.expires_at) {
    const expires = new Date(coupon.expires_at);
    if (!Number.isNaN(expires.getTime()) && expires.getTime() < Date.now()) return 'expired';
  }

  const max = parsePositiveInt(coupon.max_redemptions);
  const used = parseNonNegativeInt(coupon.redemption_count) ?? 0;
  if (max != null && used >= max) return 'expired';

  return 'active';
}

export function remainingRedemptions(coupon: Pick<AmbassadorCoupon, 'max_redemptions' | 'redemption_count'>): number | null {
  if (coupon.max_redemptions == null) return null;
  return Math.max(0, coupon.max_redemptions - coupon.redemption_count);
}

function parsePositiveInt(value: unknown): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

function parseNonNegativeInt(value: unknown): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(n) || n < 0) return null;
  return n;
}

function parseDiscountType(value: unknown): CouponDiscountType {
  return value === 'amount' || value === 'fixed' || value === 'value' ? 'amount' : 'percent';
}

export function parseAmbassadorCoupon(raw: unknown): AmbassadorCoupon | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const id = Number(row.id);
  const code = normalizeCouponCode(row.code);
  const ambassadorName = typeof row.ambassador_name === 'string'
    ? row.ambassador_name.trim()
    : typeof row.ambassador === 'string'
      ? row.ambassador.trim()
      : '';
  const discountValue = parseMoney(row.discount_value ?? row.percent_off ?? row.amount_off);

  if (!Number.isFinite(id) || id <= 0 || !code || discountValue == null) return null;

  const discountType = parseDiscountType(row.discount_type);
  const status = couponStatusFromRecord(row);

  return {
    id,
    product: typeof row.product === 'string' ? row.product : 'academy',
    code,
    ambassador_name: ambassadorName || 'Embaixador',
    ambassador_user_id: parsePositiveInt(row.ambassador_user_id),
    discount_type: discountType,
    discount_value: discountValue,
    max_redemptions: parsePositiveInt(row.max_redemptions),
    redemption_count: parseNonNegativeInt(row.redemption_count ?? row.redemptions) ?? 0,
    expires_at: typeof row.expires_at === 'string' && row.expires_at ? row.expires_at : null,
    status,
    notes: typeof row.notes === 'string' && row.notes.trim() ? row.notes.trim() : null,
    created_at: typeof row.created_at === 'string' ? row.created_at : '',
    cancelled_at: typeof row.cancelled_at === 'string' && row.cancelled_at ? row.cancelled_at : null,
  };
}

export function parseAmbassadorCouponsPayload(payload: unknown): AmbassadorCoupon[] {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as { coupons?: unknown; data?: unknown }).coupons
        ?? (payload as { data?: unknown }).data
      : null;

  if (!Array.isArray(list)) return [];
  return list.map(parseAmbassadorCoupon).filter((row): row is AmbassadorCoupon => row != null);
}

export function parseCouponPreview(payload: unknown, fallbackCode = '', originalAmount: number | null = null): CouponPreview {
  const empty: CouponPreview = {
    valid: false,
    code: normalizeCouponCode(fallbackCode),
    ambassador_name: null,
    discount_type: null,
    discount_value: null,
    original_amount: originalAmount,
    discounted_amount: originalAmount,
    currency: 'BRL',
    error: 'Cupom inválido ou expirado.',
  };

  if (!payload || typeof payload !== 'object') return empty;
  const row = payload as Record<string, unknown>;
  const nested = row.coupon && typeof row.coupon === 'object' ? row.coupon as Record<string, unknown> : row;
  const code = normalizeCouponCode(nested.code ?? row.code ?? fallbackCode);
  const error = typeof row.error === 'string' && row.error.trim()
    ? row.error.trim()
    : typeof row.message === 'string' && row.message.trim()
      ? row.message.trim()
      : null;

  const explicitInvalid = row.valid === false || row.ok === false;
  const discountType = nested.discount_type != null || row.discount_type != null
    ? parseDiscountType(nested.discount_type ?? row.discount_type)
    : null;
  const discountValue = parseMoney(nested.discount_value ?? row.discount_value ?? nested.percent_off ?? row.percent_off);
  const parsedOriginal = parseMoney(row.original_amount ?? nested.original_amount) ?? originalAmount;
  const parsedDiscounted = parseMoney(row.discounted_amount ?? nested.discounted_amount ?? row.amount);

  const canCompute = parsedOriginal != null && discountType && discountValue != null;
  const discounted = parsedDiscounted ?? (canCompute ? applyCouponDiscount(parsedOriginal, discountType, discountValue) : parsedOriginal);

  const valid = !explicitInvalid && Boolean(code) && (row.valid === true || row.ok === true || discountValue != null);

  if (!valid) {
    return { ...empty, code, error: error || empty.error };
  }

  return {
    valid: true,
    code,
    ambassador_name: typeof nested.ambassador_name === 'string' ? nested.ambassador_name : typeof row.ambassador_name === 'string' ? row.ambassador_name : null,
    discount_type: discountType,
    discount_value: discountValue,
    original_amount: parsedOriginal,
    discounted_amount: discounted,
    currency: typeof row.currency === 'string' ? row.currency : 'BRL',
    error: null,
  };
}

export function validateCreateCouponInput(input: {
  code: string;
  ambassador_name: string;
  discount_type: CouponDiscountType;
  discount_value: string | number;
  max_redemptions: string;
  expires_at: string;
}): { ok: true; payload: CreateAmbassadorCouponInput } | { ok: false; error: string } {
  const code = normalizeCouponCode(input.code);
  const ambassadorName = input.ambassador_name.trim();
  const discountValue = parseMoney(input.discount_value);

  if (!isValidCouponCodeFormat(code)) {
    return { ok: false, error: 'O código precisa ter de 3 a 32 caracteres (letras, números, _ ou -).' };
  }
  if (ambassadorName.length < 2) {
    return { ok: false, error: 'Informe o nome do embaixador.' };
  }
  if (discountValue == null || discountValue <= 0) {
    return { ok: false, error: 'Informe um desconto maior que zero.' };
  }
  if (input.discount_type === 'percent' && discountValue > 100) {
    return { ok: false, error: 'O percentual de desconto não pode passar de 100%.' };
  }

  const maxRedemptions = input.max_redemptions.trim()
    ? parsePositiveInt(input.max_redemptions.trim())
    : null;
  if (input.max_redemptions.trim() && maxRedemptions == null) {
    return { ok: false, error: 'O limite de usos precisa ser um número inteiro positivo.' };
  }

  let expiresAt: string | null = null;
  if (input.expires_at.trim()) {
    const date = new Date(`${input.expires_at}T23:59:59`);
    if (Number.isNaN(date.getTime())) {
      return { ok: false, error: 'Data de validade inválida.' };
    }
    expiresAt = date.toISOString();
  }

  return {
    ok: true,
    payload: {
      product: 'academy',
      code,
      ambassador_name: ambassadorName,
      discount_type: input.discount_type,
      discount_value: discountValue,
      max_redemptions: maxRedemptions,
      expires_at: expiresAt,
    },
  };
}

export function apiErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const row = payload as { error?: unknown; message?: unknown };
    if (typeof row.error === 'string' && row.error.trim()) return row.error.trim();
    if (typeof row.message === 'string' && row.message.trim()) return row.message.trim();
  }
  return fallback;
}
