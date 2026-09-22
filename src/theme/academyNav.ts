import { ACADEMY_NAV, type AcademyNavId } from '../features/shell/nav';

export const ACADEMY_NAV_ORDER_KEY = 'odontohub-academy-nav-order';

const DEFAULT_ORDER = ACADEMY_NAV.map(item => item.id);

export function isAcademyNavId(value: string): value is AcademyNavId {
  return DEFAULT_ORDER.includes(value as AcademyNavId);
}

/**
 * Merges a saved order with the current catalogue. Tabs the student never saw
 * (added after they saved) slot in at their default position instead of being
 * pushed after "Conta", so a new tab shows up where it was designed to live.
 */
export function mergeAcademyNavOrder(saved: readonly string[]): AcademyNavId[] {
  const known = saved.filter(isAcademyNavId).filter((id, index, list) => list.indexOf(id) === index);
  const result: AcademyNavId[] = [...known];
  DEFAULT_ORDER.forEach((id, defaultIndex) => {
    if (result.includes(id)) return;
    const predecessor = DEFAULT_ORDER.slice(0, defaultIndex).reverse().find(candidate => result.includes(candidate));
    const at = predecessor ? result.indexOf(predecessor) + 1 : 0;
    result.splice(at, 0, id);
  });
  return result;
}

export function readAcademyNavOrder(): AcademyNavId[] {
  if (typeof localStorage === 'undefined') return [...DEFAULT_ORDER];
  try {
    const raw = JSON.parse(localStorage.getItem(ACADEMY_NAV_ORDER_KEY) || '[]');
    if (!Array.isArray(raw)) return [...DEFAULT_ORDER];
    return mergeAcademyNavOrder(raw);
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
