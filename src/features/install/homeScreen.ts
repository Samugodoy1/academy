/** Set when the person actually installs. */
export const HOME_SCREEN_INSTALLED_KEY = 'odontohub-academy-home-screen-installed';
/** Set after the first "Agora não". Later visits use the banner until the next daily modal. */
export const HOME_SCREEN_DECLINED_KEY = 'odontohub-academy-home-screen-declined';
/** Calendar day (YYYY-MM-DD) when the full sheet was last shown. */
export const HOME_SCREEN_MODAL_DAY_KEY = 'odontohub-academy-home-screen-modal-day';
/** Hides the banner for the rest of this visit, including right after the sheet closes. */
export const HOME_SCREEN_SESSION_KEY = 'odontohub-academy-home-screen-session';

export type HomeScreenPrompt = 'modal' | 'banner' | 'none';

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

export function homeScreenDay(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function chooseHomeScreenPrompt(input: {
  platform: HomeScreenPlatform | null;
  standalone: boolean;
  installed: boolean;
  pathname: string;
  declinedOnce: boolean;
  modalDay: string | null;
  today: string;
  quietThisVisit: boolean;
}): HomeScreenPrompt {
  if (!input.platform || input.standalone || input.installed) return 'none';
  if (input.pathname.startsWith('/print')) return 'none';
  if (input.quietThisVisit) return 'none';
  if (input.modalDay !== input.today) return 'modal';
  if (input.declinedOnce) return 'banner';
  return 'none';
}
