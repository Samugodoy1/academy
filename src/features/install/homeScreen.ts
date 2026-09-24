/** Set when the person actually installs. "Agora não" does not use this. */
export const HOME_SCREEN_INSTALLED_KEY = 'odontohub-academy-home-screen-installed';
/** Hides the sheet only for the current visit, so the next open asks again. */
export const HOME_SCREEN_SESSION_KEY = 'odontohub-academy-home-screen-session';

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

export function shouldSuggestHomeScreen(input: {
  platform: HomeScreenPlatform | null;
  standalone: boolean;
  installed: boolean;
  dismissedThisVisit: boolean;
  pathname: string;
}): boolean {
  if (!input.platform || input.standalone || input.installed) return false;
  if (input.pathname.startsWith('/print')) return false;
  if (input.dismissedThisVisit) return false;
  return true;
}
