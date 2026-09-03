import { CURRENT_PRODUCT } from '../config/product';

export const ACADEMY_NEO_STORAGE_KEY = 'odontohub-academy-neo';

export const ACADEMY_NEO_COLORWAYS = [
  { id: 'laranja', label: 'Laranja', neo: '#FF6B2C', soft: '#FFD8C4', wash: '#FFF4ED' },
  { id: 'lima', label: 'Lima', neo: '#34C759', soft: '#C8F5D4', wash: '#F0FBF3' },
  { id: 'azul', label: 'Azul', neo: '#32ADE6', soft: '#C5EBFA', wash: '#F0F9FD' },
  { id: 'rosa', label: 'Rosa', neo: '#FF6482', soft: '#FFD0D9', wash: '#FFF0F3' },
  { id: 'violeta', label: 'Violeta', neo: '#BF5AF2', soft: '#E8C8FA', wash: '#F8F0FD' },
] as const;

export type AcademyNeoId = (typeof ACADEMY_NEO_COLORWAYS)[number]['id'];
export type AcademyNeoColorway = (typeof ACADEMY_NEO_COLORWAYS)[number];

export const DEFAULT_ACADEMY_NEO_ID: AcademyNeoId = 'laranja';

export function isAcademyNeoId(value: string | null | undefined): value is AcademyNeoId {
  return ACADEMY_NEO_COLORWAYS.some(colorway => colorway.id === value);
}

export function getAcademyNeoColorway(id: string | null | undefined): AcademyNeoColorway {
  return ACADEMY_NEO_COLORWAYS.find(colorway => colorway.id === id) || ACADEMY_NEO_COLORWAYS[0];
}

export function shouldApplyAcademyNeo(
  host = typeof window !== 'undefined' ? window.location.hostname : '',
  product: string = CURRENT_PRODUCT,
): boolean {
  if (host.includes('sistema.odontohub')) return false;
  if (host.includes('academy.odontohub')) return true;
  return product === 'academy';
}

export function readStoredAcademyNeoId(): AcademyNeoId {
  if (typeof localStorage === 'undefined') return DEFAULT_ACADEMY_NEO_ID;
  const raw = localStorage.getItem(ACADEMY_NEO_STORAGE_KEY);
  return isAcademyNeoId(raw) ? raw : DEFAULT_ACADEMY_NEO_ID;
}

export function persistAcademyNeoId(id: AcademyNeoId) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ACADEMY_NEO_STORAGE_KEY, id);
}

export function applyAcademyNeoColorway(id: AcademyNeoId, enabled = true) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const colorway = getAcademyNeoColorway(id);

  if (!enabled) {
    root.removeAttribute('data-product');
    root.removeAttribute('data-neo');
    root.style.removeProperty('--neo');
    root.style.removeProperty('--neo-soft');
    root.style.removeProperty('--neo-wash');
    return;
  }

  root.setAttribute('data-product', 'academy');
  root.setAttribute('data-neo', colorway.id);
  root.style.setProperty('--neo', colorway.neo);
  root.style.setProperty('--neo-soft', colorway.soft);
  root.style.setProperty('--neo-wash', colorway.wash);
  root.style.colorScheme = 'light';

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', '#ffffff');
}
