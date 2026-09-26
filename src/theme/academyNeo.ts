import { CURRENT_PRODUCT } from '../config/product';

export const ACADEMY_NEO_STORAGE_KEY = 'odontohub-academy-neo';
export const ACADEMY_CANVAS = '#f5f5f7';

let boundNeoUserId: number | null = null;

export function bindAcademyNeoUser(userId: number | null) {
  boundNeoUserId = userId;
}

function storageKey(userId?: number | null) {
  return userId ? `${ACADEMY_NEO_STORAGE_KEY}:${userId}` : ACADEMY_NEO_STORAGE_KEY;
}

/**
 * Apple system colors, standard light appearance (Padrão leve).
 * soft/wash are pale tints for surfaces; neo is the spec color.
 * onInk marks fills light enough that foreground text must be dark.
 */
export const ACADEMY_NEO_COLORWAYS = [
  { id: 'red', label: 'Vermelho', neo: '#FF383C', soft: '#FFDFE0', wash: '#FFF3F3', onInk: false },
  { id: 'orange', label: 'Laranja', neo: '#FF8D28', soft: '#FFEDDD', wash: '#FFF8F2', onInk: false },
  { id: 'yellow', label: 'Amarelo', neo: '#FFCC00', soft: '#FFF7D6', wash: '#FFFCF0', onInk: false },
  { id: 'green', label: 'Verde', neo: '#34C759', soft: '#DFF6E4', wash: '#F3FCF5', onInk: false },
  { id: 'mint', label: 'Hortelã', neo: '#00C8B3', soft: '#D6F6F3', wash: '#F0FCFA', onInk: false },
  { id: 'teal', label: 'Cerceta', neo: '#00C3D0', soft: '#D6F5F7', wash: '#F0FBFC', onInk: false },
  { id: 'cyan', label: 'Ciano', neo: '#00C0E8', soft: '#D6F5FB', wash: '#F0FBFE', onInk: false },
  { id: 'blue', label: 'Azul', neo: '#0088FF', soft: '#D6ECFF', wash: '#F0F8FF', onInk: false },
  { id: 'indigo', label: 'Índigo', neo: '#6155F5', soft: '#E6E4FD', wash: '#F6F5FE', onInk: false },
  { id: 'purple', label: 'Roxo', neo: '#CB30E0', soft: '#F7DEFA', wash: '#FCF3FD', onInk: false },
  { id: 'pink', label: 'Rosa', neo: '#F4B6C8', soft: '#FDE8EE', wash: '#FFF6F8', onInk: false },
  { id: 'brown', label: 'Marrom', neo: '#AC7F5E', soft: '#F2EBE5', wash: '#FAF7F5', onInk: false },
] as const;

export type AcademyNeoId = (typeof ACADEMY_NEO_COLORWAYS)[number]['id'];
export type AcademyNeoColorway = (typeof ACADEMY_NEO_COLORWAYS)[number];

export const DEFAULT_ACADEMY_NEO_ID: AcademyNeoId = 'blue';

const LEGACY_ACADEMY_NEO: Record<string, AcademyNeoId> = {
  laranja: 'orange',
  lima: 'green',
  azul: 'blue',
  rosa: 'pink',
  violeta: 'purple',
};

export function normalizeAcademyNeoId(value: string | null | undefined): AcademyNeoId | null {
  if (!value) return null;
  if (isAcademyNeoId(value)) return value;
  return LEGACY_ACADEMY_NEO[value] ?? null;
}

export function isAcademyNeoId(value: string | null | undefined): value is AcademyNeoId {
  return ACADEMY_NEO_COLORWAYS.some(colorway => colorway.id === value);
}

export function getAcademyNeoColorway(id: string | null | undefined): AcademyNeoColorway {
  return ACADEMY_NEO_COLORWAYS.find(colorway => colorway.id === id)
    || ACADEMY_NEO_COLORWAYS.find(colorway => colorway.id === DEFAULT_ACADEMY_NEO_ID)!;
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
  return readExplicitAcademyNeoId() ?? DEFAULT_ACADEMY_NEO_ID;
}

/** Null when this account has never chosen a color on this browser. */
export function readExplicitAcademyNeoId(userId?: number | null): AcademyNeoId | null {
  if (typeof localStorage === 'undefined') return null;
  const key = storageKey(userId);
  const raw = localStorage.getItem(key);
  if (raw == null || raw === '') return null;
  const normalized = normalizeAcademyNeoId(raw);
  if (normalized && normalized !== raw) {
    localStorage.setItem(key, normalized);
  }
  return normalized;
}

export function persistAcademyNeoId(id: AcademyNeoId) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ACADEMY_NEO_STORAGE_KEY, id);
  if (boundNeoUserId) localStorage.setItem(storageKey(boundNeoUserId), id);
}

export function applyAcademyNeoColorway(id: AcademyNeoId, enabled = true) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const colorway = getAcademyNeoColorway(id);

  if (!enabled) {
    root.removeAttribute('data-product');
    root.removeAttribute('data-neo');
    root.removeAttribute('data-neo-on');
    root.style.removeProperty('--neo');
    root.style.removeProperty('--neo-soft');
    root.style.removeProperty('--neo-wash');
    return;
  }

  root.setAttribute('data-product', 'academy');
  root.setAttribute('data-neo', colorway.id);
  root.setAttribute('data-neo-on', colorway.onInk ? 'ink' : 'white');
  root.style.setProperty('--neo', colorway.neo);
  root.style.setProperty('--neo-soft', colorway.soft);
  root.style.setProperty('--neo-wash', colorway.wash);
  root.style.colorScheme = 'light';

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', ACADEMY_CANVAS);
}
