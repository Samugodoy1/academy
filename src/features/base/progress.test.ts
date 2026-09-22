import { describe, expect, it } from 'vitest';
import { BASE_DISCIPLINES } from './content';
import { isLessonUnlocked } from './plan';
import {
  countAllDone,
  emptyBaseProgress,
  markLessonOpened,
  parseBaseProgress,
  suggestNextLesson,
  toggleLessonDone,
} from './progress';

const first = BASE_DISCIPLINES[0];
const canOpenFree = (index: number) => isLessonUnlocked('free', index);
const canOpenAll = () => true;

describe('Base progress', () => {
  it('parses defensively', () => {
    expect(parseBaseProgress(null)).toEqual(emptyBaseProgress());
    expect(parseBaseProgress({ done: { a: '2026-01-01' }, opened: 'nope', lastLessonId: 7 })).toEqual({
      done: { a: '2026-01-01' },
      opened: {},
      lastLessonId: undefined,
    });
  });

  it('toggles done and counts across disciplines', () => {
    let progress = emptyBaseProgress();
    progress = toggleLessonDone(progress, first.lessons[0].id);
    expect(countAllDone(progress, BASE_DISCIPLINES)).toBe(1);
    progress = toggleLessonDone(progress, first.lessons[0].id);
    expect(countAllDone(progress, BASE_DISCIPLINES)).toBe(0);
  });

  it('starts at the very first summary for a new student', () => {
    const suggestion = suggestNextLesson(BASE_DISCIPLINES, emptyBaseProgress(), canOpenAll);
    expect(suggestion?.lesson.id).toBe(first.lessons[0].id);
    expect(suggestion?.reason).toBe('start');
  });

  it('resumes the last opened summary when it is not finished', () => {
    const target = BASE_DISCIPLINES[2].lessons[0];
    const progress = markLessonOpened(emptyBaseProgress(), target.id);
    const suggestion = suggestNextLesson(BASE_DISCIPLINES, progress, canOpenAll);
    expect(suggestion?.lesson.id).toBe(target.id);
    expect(suggestion?.reason).toBe('resume');
  });

  it('never suggests a locked summary on Free', () => {
    let progress = emptyBaseProgress();
    progress = toggleLessonDone(progress, first.lessons[0].id);
    const suggestion = suggestNextLesson(BASE_DISCIPLINES, progress, canOpenFree);
    expect(suggestion).not.toBeNull();
    expect(suggestion?.lessonIndex).toBe(0);
    expect(suggestion?.discipline.id).toBe(BASE_DISCIPLINES[1].id);
    expect(suggestion?.reason).toBe('next');
  });

  it('returns null when everything the plan allows is done', () => {
    let progress = emptyBaseProgress();
    for (const discipline of BASE_DISCIPLINES) {
      progress = toggleLessonDone(progress, discipline.lessons[0].id);
    }
    expect(suggestNextLesson(BASE_DISCIPLINES, progress, canOpenFree)).toBeNull();
    expect(suggestNextLesson(BASE_DISCIPLINES, progress, canOpenAll)).not.toBeNull();
  });
});
