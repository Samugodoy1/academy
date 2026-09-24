export const HOME_SCREEN_DISMISS_KEY = 'odontohub-academy-home-screen';
const DISMISS_MS = 14 * 24 * 60 * 60 * 1000;

export type HomeScreenPlatform = 'ios' | 'android';

export function isStandaloneDisplay(
  nav: { standalone?: boolean } = {},
  displayModeStandalone = false,
): boolean {
  return nav.standalone === true || displayModeStandalone;
}

export function detectHomeScreenPlatform(
  ua: string,
  maxTouchPoints = 0,
  platform = '',
): HomeScreenPlatform | null {
  const iOS = /iPad|iPhone|iPod/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
  if (iOS) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return null;
}

/** Home Screen install on iOS only completes in Safari. */
export function isIosSafari(ua: string): boolean {
  return /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Instagram|FBAN|FBAV/i.test(ua);
}

export function readDismissedUntil(raw: string | null, now = Date.now()): number | null {
  if (!raw) return null;
  const until = Number(raw);
  if (!Number.isFinite(until)) return null;
  return until > now ? until : null;
}

export function nextDismissUntil(now = Date.now()): number {
  return now + DISMISS_MS;
}

export function shouldSuggestHomeScreen(input: {
  platform: HomeScreenPlatform | null;
  standalone: boolean;
  dismissedUntil: number | null;
  pathname: string;
}): boolean {
  if (!input.platform || input.standalone) return false;
  if (input.pathname.startsWith('/print')) return false;
  if (input.dismissedUntil) return false;
  return true;
}
