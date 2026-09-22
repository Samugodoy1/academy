import type { ReadinessLevel } from './types';
import type { LabId } from './types';

export const SESSION_PROGRESS_KEY = 'odontohub-academy-session-v1';

export interface LessonSessionRecord {
  lessonId: string;
  readiness: ReadinessLevel;
  completedAt: string;
  gestoDone?: boolean;
}

export interface SessionProgress {
  lessons: Record<string, LessonSessionRecord>;
  labsCompleted: Partial<Record<LabId, string>>;
  casesCompleted: Record<string, string>;
}

export const emptySessionProgress = (): SessionProgress => ({
  lessons: {},
  labsCompleted: {},
  casesCompleted: {},
});

export function parseSessionProgress(raw: unknown): SessionProgress {
  if (!raw || typeof raw !== 'object') return emptySessionProgress();
  const record = raw as Record<string, unknown>;
  const lessons: SessionProgress['lessons'] = {};
  if (record.lessons && typeof record.lessons === 'object') {
    for (const [lessonId, value] of Object.entries(record.lessons as Record<string, unknown>)) {
      if (!value || typeof value !== 'object') continue;
      const v = value as Record<string, unknown>;
      if (typeof v.completedAt !== 'string' || typeof v.readiness !== 'string') continue;
      lessons[lessonId] = {
        lessonId,
        readiness: v.readiness as ReadinessLevel,
        completedAt: v.completedAt,
        gestoDone: v.gestoDone === true,
      };
    }
  }
  const labsCompleted: SessionProgress['labsCompleted'] = {};
  if (record.labsCompleted && typeof record.labsCompleted === 'object') {
    for (const [id, at] of Object.entries(record.labsCompleted as Record<string, unknown>)) {
      if (typeof at === 'string') labsCompleted[id as LabId] = at;
    }
  }
  const casesCompleted: SessionProgress['casesCompleted'] = {};
  if (record.casesCompleted && typeof record.casesCompleted === 'object') {
    for (const [id, at] of Object.entries(record.casesCompleted as Record<string, unknown>)) {
      if (typeof at === 'string') casesCompleted[id] = at;
    }
  }
  return { lessons, labsCompleted, casesCompleted };
}

export function readSessionProgress(): SessionProgress {
  if (typeof localStorage === 'undefined') return emptySessionProgress();
  try {
    return parseSessionProgress(JSON.parse(localStorage.getItem(SESSION_PROGRESS_KEY) || 'null'));
  } catch {
    return emptySessionProgress();
  }
}

export function persistSessionProgress(state: SessionProgress) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(SESSION_PROGRESS_KEY, JSON.stringify(state));
  } catch {
    /* storage indisponível */
  }
}

export function markSessionComplete(
  state: SessionProgress,
  lessonId: string,
  readiness: ReadinessLevel,
  now = new Date(),
): SessionProgress {
  return {
    ...state,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        lessonId,
        readiness,
        completedAt: now.toISOString(),
        gestoDone: true,
      },
    },
  };
}

export function markLabComplete(state: SessionProgress, labId: LabId, now = new Date()): SessionProgress {
  return {
    ...state,
    labsCompleted: { ...state.labsCompleted, [labId]: now.toISOString() },
  };
}

export function markCaseComplete(state: SessionProgress, caseId: string, now = new Date()): SessionProgress {
  return {
    ...state,
    casesCompleted: { ...state.casesCompleted, [caseId]: now.toISOString() },
  };
}

export function hasCompletedSession(state: SessionProgress, lessonId: string) {
  return Boolean(state.lessons[lessonId]);
}
