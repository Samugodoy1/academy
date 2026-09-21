import { describe, expect, it } from 'vitest';
import { NOTICE, noticeDurationMs } from './academyNotices';

describe('Academy notices', () => {
  it('keeps patient events short so a top banner can sit above the tab bar', () => {
    expect(NOTICE.patientCreated.length).toBeLessThan(28);
    expect(NOTICE.patientUpdated.length).toBeLessThan(28);
    expect(NOTICE.patientCreated.toLowerCase()).not.toContain('sucesso');
    expect(NOTICE.patientUpdated.toLowerCase()).not.toContain('sucesso');
  });

  it('dismisses faster than a blocking toast, and holds longer when there is an action', () => {
    expect(noticeDurationMs({ message: 'ok' })).toBeLessThan(3000);
    expect(noticeDurationMs({ message: 'ok', onAction: () => undefined })).toBeGreaterThan(4000);
    expect(noticeDurationMs({ message: 'falhou', type: 'error' })).toBeGreaterThan(
      noticeDurationMs({ message: 'ok' }),
    );
  });
});
