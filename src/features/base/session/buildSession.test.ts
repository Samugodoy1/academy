import { describe, expect, it } from 'vitest';
import { BASE_DISCIPLINES } from '../content';
import { buildSessionRuntime } from './buildSession';
import { GESTO_BY_LESSON } from './gestoMap';

describe('buildSessionRuntime', () => {
  it('builds for every lesson in catalogue', () => {
    for (const discipline of BASE_DISCIPLINES) {
      discipline.lessons.forEach((lesson, lessonIndex) => {
        const runtime = buildSessionRuntime(discipline, lessonIndex);
        expect(runtime?.lesson.id).toBe(lesson.id);
        expect(runtime?.blueprint.pretest.length).toBeGreaterThanOrEqual(3);
        expect(GESTO_BY_LESSON[lesson.id]).toBeTruthy();
      });
    }
  });
});
