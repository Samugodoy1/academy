import type { AmbassadorCoupon, CouponPreview, CreateAmbassadorCouponInput } from './types';
import {
  apiErrorMessage,
  normalizeCouponCode,
  parseAmbassadorCoupon,
  parseAmbassadorCouponsPayload,
  parseCouponPreview,
} from './couponUtils';

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

async function readJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function listAmbassadorCoupons(
  apiFetch: ApiFetch,
  product = 'academy',
): Promise<{ coupons: AmbassadorCoupon[]; error: string | null; unavailable: boolean }> {
  try {
    const res = await apiFetch(`/api/admin/coupons?product=${encodeURIComponent(product)}`, { product });
    const body = await readJson(res);
    if (res.status === 404) {
      return { coupons: [], error: 'A API de cupons ainda não está disponível. Use o prompt em docs/BACKEND_AMBASSADOR_COUPONS_PROMPT.md.', unavailable: true };
    }
    if (!res.ok) {
      return { coupons: [], error: apiErrorMessage(body, 'Não foi possível carregar os cupons.'), unavailable: false };
    }
    return { coupons: parseAmbassadorCouponsPayload(body), error: null, unavailable: false };
  } catch {
    return { coupons: [], error: 'Não foi possível carregar os cupons.', unavailable: false };
  }
}

export async function createAmbassadorCoupon(
  apiFetch: ApiFetch,
  input: CreateAmbassadorCouponInput,
): Promise<{ coupon: AmbassadorCoupon | null; error: string | null }> {
  try {
    const res = await apiFetch('/api/admin/coupons', {
      method: 'POST',
      product: input.product,
      body: JSON.stringify(input),
    });
    const body = await readJson(res);
    if (res.status === 404) {
      return { coupon: null, error: 'A API de cupons ainda não está disponível no backend.' };
    }
    if (!res.ok) {
      return { coupon: null, error: apiErrorMessage(body, 'Não foi possível cadastrar o cupom.') };
    }
    const coupon = parseAmbassadorCoupon(
      body && typeof body === 'object' && 'coupon' in (body as object)
        ? (body as { coupon: unknown }).coupon
        : body,
    );
    if (!coupon) {
      return { coupon: null, error: 'Cupom criado, mas a resposta da API veio incompleta. Recarregue a lista.' };
    }
    return { coupon, error: null };
  } catch {
    return { coupon: null, error: 'Não foi possível cadastrar o cupom.' };
  }
}

export async function cancelAmbassadorCoupon(
  apiFetch: ApiFetch,
  couponId: number,
  product = 'academy',
): Promise<{ coupon: AmbassadorCoupon | null; error: string | null }> {
  try {
    const res = await apiFetch(`/api/admin/coupons/${couponId}/cancel`, {
      method: 'POST',
      product,
      body: JSON.stringify({ product }),
    });
    const body = await readJson(res);
    if (res.status === 404) {
      return { coupon: null, error: 'A API de cupons ainda não está disponível no backend.' };
    }
    if (!res.ok) {
      return { coupon: null, error: apiErrorMessage(body, 'Não foi possível cancelar o cupom.') };
    }
    const coupon = parseAmbassadorCoupon(
      body && typeof body === 'object' && 'coupon' in (body as object)
        ? (body as { coupon: unknown }).coupon
        : body,
    );
    return { coupon, error: null };
  } catch {
    return { coupon: null, error: 'Não foi possível cancelar o cupom.' };
  }
}

export async function previewAmbassadorCoupon(
  apiFetch: ApiFetch,
  product: string,
  code: string,
  planId?: number,
  originalAmount: number | null = null,
): Promise<{ preview: CouponPreview; unavailable: boolean }> {
  const normalized = normalizeCouponCode(code);
  const invalid: CouponPreview = {
    valid: false,
    code: normalized,
    ambassador_name: null,
    discount_type: null,
    discount_value: null,
    original_amount: originalAmount,
    discounted_amount: originalAmount,
    currency: 'BRL',
    error: 'Cupom inválido ou expirado.',
  };

  try {
    const res = await apiFetch('/api/coupons/preview', {
      method: 'POST',
      product,
      body: JSON.stringify({
        product,
        code: normalized,
        ...(planId ? { plan_id: planId } : {}),
      }),
    });
    const body = await readJson(res);
    if (res.status === 404) {
      return {
        preview: {
          ...invalid,
          error: 'A validação de cupom ainda não está disponível. O código será enviado no checkout.',
        },
        unavailable: true,
      };
    }
    return {
      preview: parseCouponPreview(body, normalized, originalAmount),
      unavailable: false,
    };
  } catch {
    return { preview: { ...invalid, error: 'Não foi possível validar o cupom.' }, unavailable: false };
  }
}
