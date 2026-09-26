import type { Product, ProductPlan } from '../../types/clinical';

export function adminPlanSelectValue(product: Product, plan: ProductPlan | string): string {
  if (product === 'academy' && plan === 'pro') return 'student';
  return plan;
}

export function adminPlanSelectOptions(product: Product): Array<{ value: ProductPlan; label: string }> {
  if (product === 'academy') {
    return [
      { value: 'free', label: 'Free' },
      { value: 'clinico', label: 'Clínico' },
      { value: 'student', label: 'Student (embaixador / pago)' },
    ];
  }

  return [
    { value: 'free', label: 'free' },
    { value: 'pro', label: 'pro' },
  ];
}
