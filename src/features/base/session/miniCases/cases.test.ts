import { describe, expect, it } from 'vitest';
import { GESTO_BY_LESSON } from '../gestoMap';
import { MINI_CASES, getMiniCase } from './cases';

describe('mini cases', () => {
  it('every referenced case exists', () => {
    const caseIds = new Set(MINI_CASES.map(c => c.id));
    for (const gesto of Object.values(GESTO_BY_LESSON)) {
      if (gesto.type === 'minicase') expect(caseIds.has(gesto.caseId)).toBe(true);
    }
  });

  it('each case has steps and resolves by id', () => {
    for (const c of MINI_CASES) {
      expect(c.steps.length).toBeGreaterThan(0);
      expect(getMiniCase(c.id)?.title).toBe(c.title);
    }
  });
});
