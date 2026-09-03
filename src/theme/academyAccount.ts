import { API_URL } from '../config';
import { CURRENT_PRODUCT } from '../config/product';
import {
  DEFAULT_ACADEMY_NEO_ID,
  isAcademyNeoId,
  type AcademyNeoId,
} from './academyNeo';
import {
  defaultAcademyWidgets,
  parseAcademyWidgets,
  type AcademyWidget,
} from './academyWidgets';

export interface AcademyAccountPrefs {
  academy_neo: AcademyNeoId;
  academy_widgets: AcademyWidget[];
}

type ProfileLike = {
  id?: number;
  academy_neo?: unknown;
  academy_widgets?: unknown;
  settings?: unknown;
  preferences?: unknown;
  [key: string]: unknown;
};

let profileSnapshot: ProfileLike | null = null;
let currentPrefs: AcademyAccountPrefs = {
  academy_neo: DEFAULT_ACADEMY_NEO_ID,
  academy_widgets: defaultAcademyWidgets(),
};
let saveTimer: number | null = null;
let pendingPatch: Partial<AcademyAccountPrefs> = {};

function readNestedPrefs(source: unknown): { neo?: AcademyNeoId; widgets?: AcademyWidget[] } {
  if (!source || typeof source !== 'object') return {};
  const record = source as Record<string, unknown>;
  const neoValue = record.academy_neo ?? record.neo;
  const neo = typeof neoValue === 'string' && isAcademyNeoId(neoValue) ? neoValue : undefined;
  const widgets = parseAcademyWidgets(record.academy_widgets ?? record.widgets) ?? undefined;
  return { neo, widgets };
}

export function resolveAcademyPrefs(profile: unknown): { neo: AcademyNeoId | null; widgets: AcademyWidget[] | null } {
  if (!profile || typeof profile !== 'object') return { neo: null, widgets: null };
  const record = profile as ProfileLike;
  const layers = [
    readNestedPrefs(record.preferences),
    readNestedPrefs(record.settings),
    readNestedPrefs(record),
  ];
  let neo: AcademyNeoId | undefined;
  let widgets: AcademyWidget[] | undefined;
  for (const layer of layers) {
    if (layer.neo) neo = layer.neo;
    if (layer.widgets) widgets = layer.widgets;
  }
  return {
    neo: neo ?? null,
    widgets: widgets ?? null,
  };
}

export function getAcademyAccountPrefs(): AcademyAccountPrefs {
  return currentPrefs;
}

export function setAcademyAccountPrefs(prefs: Partial<AcademyAccountPrefs>) {
  currentPrefs = { ...currentPrefs, ...prefs };
}

export function setAcademyProfileSnapshot(profile: unknown) {
  profileSnapshot = profile && typeof profile === 'object' ? (profile as ProfileLike) : null;
}

export function serializeAcademyWidgets(widgets: AcademyWidget[]): AcademyWidget[] {
  return parseAcademyWidgets(widgets) || [];
}

async function academyFetch(path: string, options: RequestInit = {}) {
  const token = typeof localStorage === 'undefined' ? '' : localStorage.getItem('token');
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-product': CURRENT_PRODUCT,
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token && token !== 'null' && token !== 'undefined') {
    headers.Authorization = `Bearer ${token}`;
    headers['x-auth-token'] = token;
  }
  const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;
  return fetch(fullUrl, {
    ...options,
    headers,
    credentials: API_URL ? 'include' : 'same-origin',
  });
}

export async function saveAcademyAccount(patch: Partial<AcademyAccountPrefs>): Promise<boolean> {
  if (!patch.academy_neo && !Array.isArray(patch.academy_widgets)) return false;
  const payload: Record<string, unknown> = {};
  if (patch.academy_neo) payload.academy_neo = patch.academy_neo;
  if (Array.isArray(patch.academy_widgets)) payload.academy_widgets = serializeAcademyWidgets(patch.academy_widgets);

  try {
    const dedicated = await academyFetch('/api/profile/academy', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (dedicated.ok) return true;

    if (!profileSnapshot) return false;
    const merged = {
      ...profileSnapshot,
      ...payload,
      password: '',
      settings: {
        ...(typeof profileSnapshot.settings === 'object' && profileSnapshot.settings ? profileSnapshot.settings : {}),
        ...payload,
      },
    };
    const fallback = await academyFetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify(merged),
    });
    return fallback.ok;
  } catch {
    return false;
  }
}

export function queueAcademyAccountSave(patch: Partial<AcademyAccountPrefs>) {
  setAcademyAccountPrefs(patch);
  pendingPatch = { ...pendingPatch, ...patch };
  if (typeof window === 'undefined') return;
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    const next = pendingPatch;
    pendingPatch = {};
    saveTimer = null;
    void saveAcademyAccount(next);
  }, 450);
}

export function resetAcademyAccountPrefs() {
  currentPrefs = {
    academy_neo: DEFAULT_ACADEMY_NEO_ID,
    academy_widgets: defaultAcademyWidgets(),
  };
  profileSnapshot = null;
  pendingPatch = {};
  if (saveTimer && typeof window !== 'undefined') {
    window.clearTimeout(saveTimer);
    saveTimer = null;
  }
}
