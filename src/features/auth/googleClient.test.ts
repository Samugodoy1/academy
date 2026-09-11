import { describe, expect, it } from 'vitest';
import { DEFAULT_GOOGLE_CLIENT_ID, googleClientId } from './googleClient';

describe('googleClient', () => {
  it('uses the same OAuth client as OdontoHub Sistema', () => {
    expect(DEFAULT_GOOGLE_CLIENT_ID).toMatch(/\.apps\.googleusercontent\.com$/);
    expect(googleClientId()).toBe(DEFAULT_GOOGLE_CLIENT_ID);
  });
});
