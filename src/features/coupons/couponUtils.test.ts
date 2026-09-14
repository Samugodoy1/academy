import { describe, expect, it } from 'vitest';
import {
  applyCouponDiscount,
  couponCodeFromSearch,
  couponStatusFromRecord,
  formatDiscountLabel,
  isValidCouponCodeFormat,
  normalizeCouponCode,
  parseAmbassadorCouponsPayload,
  parseCouponPreview,
  remainingRedemptions,
  validateCreateCouponInput,
} from './couponUtils';

describe('cupons de embaixador', () => {
  it('normaliza o código do cupom', () => {
    expect(normalizeCouponCode(' samu 20 ')).toBe('SAMU20');
    expect(isValidCouponCodeFormat('SAMU20')).toBe(true);
    expect(isValidCouponCodeFormat('ab')).toBe(false);
    expect(isValidCouponCodeFormat('SAMU 20!')).toBe(false);
  });

  it('lê o cupom da query string compartilhada pelo embaixador', () => {
    expect(couponCodeFromSearch('?coupon=ana15&utm=ig')).toBe('ANA15');
    expect(couponCodeFromSearch('cupom=joao-10')).toBe('JOAO-10');
    expect(couponCodeFromSearch('')).toBe('');
  });

  it('aplica desconto percentual e em reais', () => {
    expect(applyCouponDiscount(29.9, 'percent', 20)).toBe(23.92);
    expect(applyCouponDiscount(29.9, 'amount', 10)).toBe(19.9);
    expect(applyCouponDiscount(29.9, 'amount', 50)).toBe(0);
    expect(applyCouponDiscount(29.9, 'percent', 100)).toBe(0);
  });

  it('formata o rótulo do desconto', () => {
    expect(formatDiscountLabel('percent', 20)).toBe('20% de desconto');
    expect(formatDiscountLabel('amount', 10)).toContain('10,00');
  });

  it('deriva status cancelado, expirado por data e esgotado', () => {
    expect(couponStatusFromRecord({ status: 'active', cancelled_at: '2026-01-01' })).toBe('cancelled');
    expect(couponStatusFromRecord({ status: 'active', expires_at: '2020-01-01T00:00:00.000Z' })).toBe('expired');
    expect(couponStatusFromRecord({ status: 'active', max_redemptions: 10, redemption_count: 10 })).toBe('expired');
    expect(couponStatusFromRecord({ status: 'active', max_redemptions: 10, redemption_count: 3 })).toBe('active');
  });

  it('lê a lista da API tanto como array quanto envelope', () => {
    const row = {
      id: 7,
      code: 'lua30',
      ambassador_name: 'Lua',
      discount_type: 'percent',
      discount_value: '30',
      redemption_count: 2,
      max_redemptions: 20,
      status: 'active',
      created_at: '2026-09-14T12:00:00.000Z',
    };
    expect(parseAmbassadorCouponsPayload([row])).toHaveLength(1);
    expect(parseAmbassadorCouponsPayload({ coupons: [row] })[0].code).toBe('LUA30');
    expect(remainingRedemptions(parseAmbassadorCouponsPayload({ data: [row] })[0])).toBe(18);
  });

  it('lê o preview do checkout e calcula o valor com desconto', () => {
    const preview = parseCouponPreview({
      valid: true,
      code: 'samu20',
      ambassador_name: 'Samuel',
      discount_type: 'percent',
      discount_value: 20,
      original_amount: '29.90',
    }, 'samu20', 29.9);
    expect(preview.valid).toBe(true);
    expect(preview.discounted_amount).toBe(23.92);
    expect(parseCouponPreview({ valid: false, error: 'Cupom cancelado.' }).error).toBe('Cupom cancelado.');
  });

  it('valida o cadastro do admin', () => {
    const ok = validateCreateCouponInput({
      code: 'ana-15',
      ambassador_name: 'Ana Costa',
      discount_type: 'percent',
      discount_value: '15',
      max_redemptions: '40',
      expires_at: '2026-12-31',
    });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.payload.code).toBe('ANA-15');
      expect(ok.payload.max_redemptions).toBe(40);
    }

    const bad = validateCreateCouponInput({
      code: 'x',
      ambassador_name: 'Ana',
      discount_type: 'percent',
      discount_value: '15',
      max_redemptions: '',
      expires_at: '',
    });
    expect(bad.ok).toBe(false);
  });
});
