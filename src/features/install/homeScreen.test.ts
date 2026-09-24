import { describe, expect, it } from 'vitest';
import {
  chooseHomeScreenPrompt,
  detectHomeScreenPlatform,
  homeScreenDay,
  isIosSafari,
  isStandaloneDisplay,
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

  it('shows the sheet once a day, then the banner after Agora não', () => {
    expect(isStandaloneDisplay({ standalone: true }, false)).toBe(true);
    expect(homeScreenDay(new Date(2026, 8, 24))).toBe('2026-09-24');
    const base = {
      platform: 'ios' as const,
      standalone: false,
      installed: false,
      pathname: '/',
      declinedOnce: false,
      modalDay: null as string | null,
      today: '2026-09-24',
      quietThisVisit: false,
    };
    expect(chooseHomeScreenPrompt(base)).toBe('modal');
    expect(chooseHomeScreenPrompt({ ...base, modalDay: '2026-09-24' })).toBe('none');
    expect(chooseHomeScreenPrompt({ ...base, declinedOnce: true, modalDay: '2026-09-24' })).toBe('banner');
    expect(chooseHomeScreenPrompt({ ...base, declinedOnce: true, modalDay: '2026-09-23' })).toBe('modal');
    expect(chooseHomeScreenPrompt({ ...base, declinedOnce: true, modalDay: '2026-09-24', quietThisVisit: true })).toBe('none');
    expect(chooseHomeScreenPrompt({ ...base, installed: true })).toBe('none');
    expect(chooseHomeScreenPrompt({ ...base, pathname: '/print/evolucao/1' })).toBe('none');
    expect(chooseHomeScreenPrompt({ ...base, platform: null })).toBe('none');
  });
});
