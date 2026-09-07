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
  bio?: unknown;
  photo_url?: unknown;
  academy_neo?: unknown;
  academy_widgets?: unknown;
  settings?: unknown;
  preferences?: unknown;
  [key: string]: unknown;
};

const ENVELOPE_OPEN = '[[OH_ACADEMY]]';
const ENVELOPE_CLOSE = '[[/OH_ACADEMY]]';
const ENVELOPE_RE = /\[\[OH_ACADEMY\]\]([\s\S]*?)\[\[\/OH_ACADEMY\]\]/;

let profileSnapshot: ProfileLike | null = null;
let currentPrefs: AcademyAccountPrefs = {
  academy_neo: DEFAULT_ACADEMY_NEO_ID,
  academy_widgets: defaultAcademyWidgets(),
};
let saveTimer: number | null = null;
let pendingPatch: Partial<AcademyAccountPrefs> = {};
let saveChain: Promise<boolean> = Promise.resolve(false);

function readNestedPrefs(source: unknown): { neo?: AcademyNeoId; widgets?: AcademyWidget[] } {
  if (!source || typeof source !== 'object') return {};
  const record = source as Record<string, unknown>;
  const neoValue = record.academy_neo ?? record.neo;
  const neo = typeof neoValue === 'string' && isAcademyNeoId(neoValue) ? neoValue : undefined;
  const widgets = parseAcademyWidgets(record.academy_widgets ?? record.widgets) ?? undefined;
  return { neo, widgets };
}

export function parseAcademyPrefsEnvelope(raw: unknown): { neo?: AcademyNeoId; widgets?: AcademyWidget[] } {
  if (typeof raw !== 'string' || !raw.includes(ENVELOPE_OPEN)) return {};
  const match = raw.match(ENVELOPE_RE);
  if (!match) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1])) as Record<string, unknown>;
    return readNestedPrefs({
      academy_neo: parsed.neo ?? parsed.academy_neo,
      academy_widgets: parsed.widgets ?? parsed.academy_widgets,
    });
  } catch {
    return {};
  }
}

export function stripAcademyPrefsEnvelope(raw: unknown): string {
  if (typeof raw !== 'string' || !raw) return '';
  return raw.replace(ENVELOPE_RE, '').trim();
}

export function encodeAcademyPrefsEnvelope(prefs: AcademyAccountPrefs): string {
  return `${ENVELOPE_OPEN}${encodeURIComponent(JSON.stringify({
    v: 1,
    neo: prefs.academy_neo,
    widgets: serializeAcademyWidgets(prefs.academy_widgets),
  }))}${ENVELOPE_CLOSE}`;
}

export function embedAcademyPrefsInBio(bio: unknown, prefs: AcademyAccountPrefs): string {
  const visible = stripAcademyPrefsEnvelope(bio);
  const envelope = encodeAcademyPrefsEnvelope(prefs);
  return visible ? `${visible}\n${envelope}` : envelope;
}

export function resolveAcademyPrefs(profile: unknown): { neo: AcademyNeoId | null; widgets: AcademyWidget[] | null } {
  if (!profile || typeof profile !== 'object') return { neo: null, widgets: null };
  const record = profile as ProfileLike;
  const layers = [
    parseAcademyPrefsEnvelope(record.bio),
    parseAcademyPrefsEnvelope(record.clinic_address),
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

export function applyAcademyPrefsToProfile<T extends Record<string, unknown>>(profile: T, prefs = currentPrefs): T {
  const nextBio = embedAcademyPrefsInBio(profile.bio, prefs);
  const address = typeof profile.clinic_address === 'string' ? profile.clinic_address : '';
  const addressIsOurs = !stripAcademyPrefsEnvelope(address);
  return {
    ...profile,
    academy_neo: prefs.academy_neo,
    academy_widgets: serializeAcademyWidgets(prefs.academy_widgets),
    settings: {
      ...(typeof profile.settings === 'object' && profile.settings ? profile.settings : {}),
      academy_neo: prefs.academy_neo,
      academy_widgets: serializeAcademyWidgets(prefs.academy_widgets),
    },
    bio: nextBio,
    ...(addressIsOurs ? { clinic_address: encodeAcademyPrefsEnvelope(prefs) } : {}),
  };
}

function authHeaders(json = true): Record<string, string> {
  const token = typeof localStorage === 'undefined' ? '' : localStorage.getItem('token') || '';
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-product': CURRENT_PRODUCT,
  };
  if (json) headers['Content-Type'] = 'application/json';
  if (token && token !== 'null' && token !== 'undefined') {
    headers.Authorization = `Bearer ${token}`;
    headers['x-auth-token'] = token;
  }
  return headers;
}

async function academyFetch(path: string, options: RequestInit = {}, json = true) {
  const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;
  return fetch(fullUrl, {
    ...options,
    headers: { ...authHeaders(json), ...(options.headers as Record<string, string> | undefined) },
    credentials: API_URL ? 'include' : 'same-origin',
  });
}

async function postProfile(prefs: AcademyAccountPrefs): Promise<boolean> {
  if (!profileSnapshot) return false;
  const body = applyAcademyPrefsToProfile({ ...profileSnapshot, password: '' }, prefs);
  const res = await academyFetch('/api/profile', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) return false;
  profileSnapshot = { ...profileSnapshot, ...body };
  return true;
}

export async function saveAcademyAccount(patch: Partial<AcademyAccountPrefs>): Promise<boolean> {
  if (!patch.academy_neo && !Array.isArray(patch.academy_widgets)) return false;
  setAcademyAccountPrefs(patch);
  if (!profileSnapshot) return false;

  saveChain = saveChain.then(async () => {
    const prefs: AcademyAccountPrefs = { ...currentPrefs };

    try {
      await academyFetch('/api/profile/academy', {
        method: 'PATCH',
        body: JSON.stringify({
          academy_neo: prefs.academy_neo,
          academy_widgets: serializeAcademyWidgets(prefs.academy_widgets),
        }),
      });
    } catch {
      /* dedicated route is optional */
    }

    const saved = await postProfile(prefs);
    if (!saved) return false;

    try {
      const verify = await academyFetch('/api/profile');
      if (verify.ok) {
        const fresh = await verify.json();
        setAcademyProfileSnapshot(fresh);
        const resolved = resolveAcademyPrefs(fresh);
        if (resolved.neo) setAcademyAccountPrefs({ academy_neo: resolved.neo });
        if (resolved.widgets) setAcademyAccountPrefs({ academy_widgets: resolved.widgets });
        return Boolean(resolved.neo || resolved.widgets);
      }
    } catch {
      /* POST already succeeded */
    }
    return saved;
  });

  return saveChain;
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
