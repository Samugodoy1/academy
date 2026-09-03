import { ACADEMY_NAV, type AcademyNavId } from '../features/shell/nav';

export const ACADEMY_NAV_ORDER_KEY = 'odontohub-academy-nav-order';

const DEFAULT_ORDER = ACADEMY_NAV.map(item => item.id);

export function isAcademyNavId(value: string): value is AcademyNavId {
  return DEFAULT_ORDER.includes(value as AcademyNavId);
}

export function readAcademyNavOrder(): AcademyNavId[] {
  if (typeof localStorage === 'undefined') return [...DEFAULT_ORDER];
  try {
    const raw = JSON.parse(localStorage.getItem(ACADEMY_NAV_ORDER_KEY) || '[]');
    if (!Array.isArray(raw)) return [...DEFAULT_ORDER];
    const known = raw.filter(isAcademyNavId);
    const missing = DEFAULT_ORDER.filter(id => !known.includes(id));
    return [...known, ...missing];
  } catch {
    return [...DEFAULT_ORDER];
  }
}

export function persistAcademyNavOrder(order: AcademyNavId[]) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ACADEMY_NAV_ORDER_KEY, JSON.stringify(order));
}

export function moveAcademyNavItem(order: AcademyNavId[], from: number, to: number): AcademyNavId[] {
  if (from === to || from < 0 || to < 0 || from >= order.length || to >= order.length) return order;
  const next = [...order];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
