import { BASE_DISCIPLINES, getDiscipline } from '../content';
import type { BasePlan } from '../plan';
import { isLessonUnlocked } from '../plan';

export const REVIEW_STORAGE_KEY = 'odontohub-academy-review-v1';

export interface ReviewCard {
  lessonId: string;
  /** ISO due date (date only matters for inbox). */
  due: string;
  intervalDays: number;
  ease: number;
  /** Consecutive successful reviews. */
  streak: number;
  lastReviewed?: string;
}

export interface ReviewState {
  cards: Record<string, ReviewCard>;
  lastMixAt?: string;
  reviewStreakDays?: string[];
}

export const emptyReviewState = (): ReviewState => ({ cards: {} });

export function parseReviewState(raw: unknown): ReviewState {
  if (!raw || typeof raw !== 'object') return emptyReviewState();
  const record = raw as Record<string, unknown>;
  const cards: Record<string, ReviewCard> = {};
  if (record.cards && typeof record.cards === 'object') {
    for (const [lessonId, value] of Object.entries(record.cards as Record<string, unknown>)) {
      if (!value || typeof value !== 'object') continue;
      const c = value as Record<string, unknown>;
      if (typeof c.due !== 'string') continue;
      cards[lessonId] = {
        lessonId,
        due: c.due,
        intervalDays: typeof c.intervalDays === 'number' ? c.intervalDays : 1,
        ease: typeof c.ease === 'number' ? c.ease : 2.3,
        streak: typeof c.streak === 'number' ? c.streak : 0,
        lastReviewed: typeof c.lastReviewed === 'string' ? c.lastReviewed : undefined,
      };
    }
  }
  return {
    cards,
    lastMixAt: typeof record.lastMixAt === 'string' ? record.lastMixAt : undefined,
    reviewStreakDays: Array.isArray(record.reviewStreakDays)
      ? record.reviewStreakDays.filter(d => typeof d === 'string')
      : undefined,
  };
}

export function readReviewState(): ReviewState {
  if (typeof localStorage === 'undefined') return emptyReviewState();
  try {
    return parseReviewState(JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || 'null'));
  } catch {
    return emptyReviewState();
  }
}

export function persistReviewState(state: ReviewState) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage indisponível */
  }
}

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function addDays(from: Date, days: number) {
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return next;
}

/** Schedule or reschedule after a session closes. */
export function scheduleAfterSession(
  state: ReviewState,
  lessonId: string,
  readiness: 'confident' | 'review' | 'ask',
  now = new Date(),
): ReviewState {
  const cards = { ...state.cards };
  const existing = cards[lessonId];
  let intervalDays = 1;
  let ease = existing?.ease ?? 2.3;
  let streak = existing?.streak ?? 0;

  if (readiness === 'confident') {
    intervalDays = existing ? Math.min(60, Math.round(existing.intervalDays * ease)) : 3;
    ease = Math.min(2.8, ease + 0.05);
    streak = (existing?.streak ?? 0) + 1;
  } else if (readiness === 'review') {
    intervalDays = 1;
    ease = Math.max(1.8, ease - 0.15);
    streak = 0;
  } else {
    intervalDays = 0;
    ease = Math.max(1.6, ease - 0.2);
    streak = 0;
  }

  const due = addDays(now, intervalDays).toISOString();
  cards[lessonId] = {
    lessonId,
    due,
    intervalDays,
    ease,
    streak,
    lastReviewed: now.toISOString(),
  };

  const day = dateKey(now);
  const reviewStreakDays = [...(state.reviewStreakDays || [])];
  if (!reviewStreakDays.includes(day)) reviewStreakDays.push(day);

  return { ...state, cards, reviewStreakDays: reviewStreakDays.slice(-90) };
}

export function gradeReviewCard(
  state: ReviewState,
  lessonId: string,
  correct: boolean,
  now = new Date(),
): ReviewState {
  const cards = { ...state.cards };
  const card = cards[lessonId];
  if (!card) return state;

  let { intervalDays, ease, streak } = card;
  if (correct) {
    intervalDays = Math.min(90, Math.max(1, Math.round(intervalDays * ease)));
    ease = Math.min(2.8, ease + 0.08);
    streak += 1;
  } else {
    intervalDays = 1;
    ease = Math.max(1.6, ease - 0.2);
    streak = 0;
  }

  cards[lessonId] = {
    ...card,
    due: addDays(now, intervalDays).toISOString(),
    intervalDays,
    ease,
    streak,
    lastReviewed: now.toISOString(),
  };

  const day = dateKey(now);
  const reviewStreakDays = [...(state.reviewStreakDays || [])];
  if (!reviewStreakDays.includes(day)) reviewStreakDays.push(day);

  return { ...state, cards, reviewStreakDays: reviewStreakDays.slice(-90) };
}

export function dueCards(state: ReviewState, now = new Date()) {
  const today = now.getTime();
  return Object.values(state.cards).filter(card => new Date(card.due).getTime() <= today);
}

export function canOpenMix(plan: BasePlan, state: ReviewState, now = new Date()) {
  if (plan === 'student') return true;
  if (!state.lastMixAt) return true;
  const last = new Date(state.lastMixAt);
  const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 7;
}

export function markMixDone(state: ReviewState, now = new Date()): ReviewState {
  return { ...state, lastMixAt: now.toISOString() };
}

export function findLessonLocation(lessonId: string) {
  for (const discipline of BASE_DISCIPLINES) {
    const lessonIndex = discipline.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex >= 0) return { discipline, lessonIndex };
  }
  return null;
}

export function unlockedDueCards(state: ReviewState, plan: BasePlan, now = new Date()) {
  return dueCards(state, now).filter(card => {
    const loc = findLessonLocation(card.lessonId);
    if (!loc) return false;
    return isLessonUnlocked(plan, loc.lessonIndex);
  });
}

export function getDisciplineForLesson(lessonId: string) {
  return getDiscipline(findLessonLocation(lessonId)?.discipline.id || '') || findLessonLocation(lessonId)?.discipline;
}
