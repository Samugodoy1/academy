import type { BaseDiscipline, BaseLesson } from './types';

export const BASE_PROGRESS_KEY = 'odontohub-academy-base-progress-v1';

export interface BaseProgress {
  /** lessonId → ISO date it was marked as done. */
  done: Record<string, string>;
  /** lessonId → ISO date of the last time it was opened. */
  opened: Record<string, string>;
  lastLessonId?: string;
}

export const emptyBaseProgress = (): BaseProgress => ({ done: {}, opened: {} });

export function parseBaseProgress(raw: unknown): BaseProgress {
  if (!raw || typeof raw !== 'object') return emptyBaseProgress();
  const record = raw as Record<string, unknown>;
  const pickMap = (value: unknown): Record<string, string> => {
    if (!value || typeof value !== 'object') return {};
    const out: Record<string, string> = {};
    for (const [key, date] of Object.entries(value as Record<string, unknown>)) {
      if (typeof date === 'string') out[key] = date;
    }
    return out;
  };
  return {
    done: pickMap(record.done),
    opened: pickMap(record.opened),
    lastLessonId: typeof record.lastLessonId === 'string' ? record.lastLessonId : undefined,
  };
}

export function readBaseProgress(): BaseProgress {
  if (typeof localStorage === 'undefined') return emptyBaseProgress();
  try {
    return parseBaseProgress(JSON.parse(localStorage.getItem(BASE_PROGRESS_KEY) || 'null'));
  } catch {
    return emptyBaseProgress();
  }
}

export function persistBaseProgress(progress: BaseProgress) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(BASE_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    /* storage indisponível: o progresso vale só nesta sessão */
  }
}

export function markLessonOpened(progress: BaseProgress, lessonId: string, now = new Date()): BaseProgress {
  return {
    ...progress,
    opened: { ...progress.opened, [lessonId]: now.toISOString() },
    lastLessonId: lessonId,
  };
}

export function toggleLessonDone(progress: BaseProgress, lessonId: string, now = new Date()): BaseProgress {
  const done = { ...progress.done };
  if (done[lessonId]) delete done[lessonId];
  else done[lessonId] = now.toISOString();
  return { ...progress, done };
}

export function isLessonDone(progress: BaseProgress, lessonId: string) {
  return Boolean(progress.done[lessonId]);
}

export function countDone(progress: BaseProgress, discipline: BaseDiscipline) {
  return discipline.lessons.filter(lesson => isLessonDone(progress, lesson.id)).length;
}

export function countAllDone(progress: BaseProgress, disciplines: BaseDiscipline[]) {
  return disciplines.reduce((total, discipline) => total + countDone(progress, discipline), 0);
}

export interface BaseContinueSuggestion {
  discipline: BaseDiscipline;
  lesson: BaseLesson;
  lessonIndex: number;
  /** 'resume' when returning to something opened but not finished. */
  reason: 'resume' | 'next' | 'start';
}

export function findLesson(disciplines: BaseDiscipline[], lessonId: string) {
  for (const discipline of disciplines) {
    const lessonIndex = discipline.lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex >= 0) return { discipline, lesson: discipline.lessons[lessonIndex], lessonIndex };
  }
  return null;
}

/**
 * What to put in front of the student now: the last summary they opened and
 * did not finish, otherwise the first unfinished summary in catalogue order.
 * Only summaries the plan can open are suggested — never a locked door.
 */
export function suggestNextLesson(
  disciplines: BaseDiscipline[],
  progress: BaseProgress,
  canOpen: (lessonIndex: number) => boolean,
): BaseContinueSuggestion | null {
  if (progress.lastLessonId) {
    const last = findLesson(disciplines, progress.lastLessonId);
    if (last && !isLessonDone(progress, last.lesson.id) && canOpen(last.lessonIndex)) {
      return { ...last, reason: 'resume' };
    }
  }

  const anyDone = Object.keys(progress.done).length > 0;
  for (const discipline of disciplines) {
    for (let lessonIndex = 0; lessonIndex < discipline.lessons.length; lessonIndex += 1) {
      const lesson = discipline.lessons[lessonIndex];
      if (isLessonDone(progress, lesson.id) || !canOpen(lessonIndex)) continue;
      return { discipline, lesson, lessonIndex, reason: anyDone ? 'next' : 'start' };
    }
  }
  return null;
}
