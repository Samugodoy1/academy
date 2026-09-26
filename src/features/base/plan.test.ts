import { describe, expect, it } from 'vitest';
import { BASE_DISCIPLINES } from './content';
import { countLessons, countUnlockedLessons, isLessonUnlocked, isMindMapUnlocked } from './plan';

describe('Base plan gating', () => {
  it('opens the first summary of every discipline on Free and everything on Student', () => {
    expect(isLessonUnlocked('free', 0)).toBe(true);
    expect(isLessonUnlocked('free', 1)).toBe(false);
    expect(isLessonUnlocked('student', 1)).toBe(true);
    expect(isLessonUnlocked('student', 5)).toBe(true);
    expect(isLessonUnlocked('clinico', 5)).toBe(true);
    expect(isMindMapUnlocked('clinico', 2)).toBe(true);
  });

  it('opens exactly one mind map on Free', () => {
    const openOnFree = BASE_DISCIPLINES.filter((_, index) => isMindMapUnlocked('free', index));
    expect(openOnFree).toHaveLength(1);
    expect(openOnFree[0].id).toBe('anatomia-dental');
    expect(BASE_DISCIPLINES.every((_, index) => isMindMapUnlocked('student', index))).toBe(true);
  });

  it('counts unlocked lessons per plan so the paywall copy can be honest', () => {
    expect(countUnlockedLessons('free', BASE_DISCIPLINES)).toBe(BASE_DISCIPLINES.length);
    expect(countUnlockedLessons('student', BASE_DISCIPLINES)).toBe(countLessons(BASE_DISCIPLINES));
    expect(countLessons(BASE_DISCIPLINES)).toBeGreaterThan(BASE_DISCIPLINES.length);
  });
});
