import { describe, expect, it } from 'vitest';
import {
  detectHomeScreenPlatform,
  isIosSafari,
  isStandaloneDisplay,
  nextDismissUntil,
  readDismissedUntil,
  shouldSuggestHomeScreen,
} from './homeScreen';

describe('home screen suggestion', () => {
  it('detects iPhone, iPad and Android, and ignores desktop', () => {
    expect(detectHomeScreenPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe('ios');
    expect(detectHomeScreenPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X)', 5, 'MacIntel')).toBe('ios');
    expect(detectHomeScreenPlatform('Mozilla/5.0 (Linux; Android 14; Pixel 8)')).toBe('android');
    expect(detectHomeScreenPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X)')).toBeNull();
  });

  it('treats Safari as the only iOS browser that can finish the install', () => {
    expect(isIosSafari('Mozilla/5.0 (iPhone) Version/18.0 Mobile/15E148 Safari/604.1')).toBe(true);
    expect(isIosSafari('Mozilla/5.0 (iPhone) CriOS/128.0.6613.98 Mobile Safari/604.1')).toBe(false);
  });

  it('hides when already installed, dismissed, or printing', () => {
    expect(isStandaloneDisplay({ standalone: true }, false)).toBe(true);
    expect(isStandaloneDisplay({}, true)).toBe(true);
    const base = { platform: 'ios' as const, standalone: false, dismissedUntil: null, pathname: '/' };
    expect(shouldSuggestHomeScreen(base)).toBe(true);
    expect(shouldSuggestHomeScreen({ ...base, standalone: true })).toBe(false);
    expect(shouldSuggestHomeScreen({ ...base, dismissedUntil: 1 })).toBe(false);
    expect(shouldSuggestHomeScreen({ ...base, pathname: '/print/evolucao/1' })).toBe(false);
    expect(shouldSuggestHomeScreen({ ...base, platform: null })).toBe(false);
  });

  it('snoozes a dismissal for two weeks', () => {
    const now = 1_000_000;
    const until = nextDismissUntil(now);
    expect(readDismissedUntil(String(until), now + 1000)).toBe(until);
    expect(readDismissedUntil(String(until), until + 1)).toBeNull();
    expect(readDismissedUntil('nope')).toBeNull();
  });
});
