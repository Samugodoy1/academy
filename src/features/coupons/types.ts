export type CouponDiscountType = 'percent' | 'amount';
export type CouponStatus = 'active' | 'cancelled' | 'expired';

export interface AmbassadorCoupon {
  id: number;
  product: string;
  code: string;
  ambassador_name: string;
  ambassador_user_id: number | null;
  discount_type: CouponDiscountType;
  discount_value: number;
  max_redemptions: number | null;
  redemption_count: number;
  expires_at: string | null;
  status: CouponStatus;
  notes: string | null;
  created_at: string;
  cancelled_at: string | null;
}

export interface CreateAmbassadorCouponInput {
  product: string;
  code: string;
  ambassador_name: string;
  ambassador_user_id?: number | null;
  discount_type: CouponDiscountType;
  discount_value: number;
  max_redemptions?: number | null;
  expires_at?: string | null;
  notes?: string | null;
}

export interface CouponPreview {
  valid: boolean;
  code: string;
  ambassador_name: string | null;
  discount_type: CouponDiscountType | null;
  discount_value: number | null;
  original_amount: number | null;
  discounted_amount: number | null;
  currency: string;
  error: string | null;
}

export interface CouponPreviewRequest {
  product: string;
  code: string;
  plan_id?: number;
}
