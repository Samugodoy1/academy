import { comboBonus, lessonXp } from './engine';
import type { GameState, LessonOutcome, LessonReward, UnitState } from './types';

export const GAME_STORAGE_KEY = 'academy_cola_game_v1';

export const MAX_HEARTS = 5;
export const HEART_REGEN_MS = 20 * 60 * 1000;
export const MAX_TRACKED_MISTAKES = 30;
export const CROWNS_PER_UNIT = 3;
export const DEFAULT_DAILY_GOAL = 30;

export const DAILY_GOAL_OPTIONS = [15, 30, 50, 80];

export function dayKeyOf(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(key: string, amount: number): string {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() + amount);
  return dayKeyOf(date);
}

export function createInitialState(now: Date = new Date()): GameState {
  return {
    version: 1,
    xp: 0,
    hearts: MAX_HEARTS,
    heartsAt: now.getTime(),
    streak: 0,
    lastDay: null,
    dayKey: dayKeyOf(now),
    dayXp: 0,
    dailyGoal: DEFAULT_DAILY_GOAL,
    units: {},
    mistakes: [],
    sound: true,
    totalCorrect: 0,
    totalAnswered: 0,
    lessonsDone: 0,
    perfectLessons: 0,
    bestCombo: 0,
  };
}

export function getUnitState(state: GameState, topic: string): UnitState {
  return state.units[topic] ?? { lessons: 0, crowns: 0 };
}

// ── Time based rules ──────────────────────────────────────────────────

/** Hearts refill one at a time; call before reading `hearts` anywhere. */
export function regenerateHearts(state: GameState, now: Date = new Date()): GameState {
  if (state.hearts >= MAX_HEARTS) {
    return state.heartsAt === now.getTime() ? state : { ...state, heartsAt: now.getTime() };
  }
  const elapsed = now.getTime() - state.heartsAt;
  if (elapsed < HEART_REGEN_MS) return state;
  const recovered = Math.floor(elapsed / HEART_REGEN_MS);
  const hearts = Math.min(MAX_HEARTS, state.hearts + recovered);
  const heartsAt =
    hearts >= MAX_HEARTS ? now.getTime() : state.heartsAt + recovered * HEART_REGEN_MS;
  return { ...state, hearts, heartsAt };
}

export function msToNextHeart(state: GameState, now: Date = new Date()): number {
  if (state.hearts >= MAX_HEARTS) return 0;
  return Math.max(0, state.heartsAt + HEART_REGEN_MS - now.getTime());
}

/** Resets the daily counter when the calendar day turns. */
export function applyDayRollover(state: GameState, now: Date = new Date()): GameState {
  const key = dayKeyOf(now);
  if (state.dayKey === key) return state;
  return { ...state, dayKey: key, dayXp: 0 };
}

/** A streak only survives if the last completed day was today or yesterday. */
export function currentStreak(state: GameState, now: Date = new Date()): number {
  if (!state.lastDay) return 0;
  const today = dayKeyOf(now);
  if (state.lastDay === today || state.lastDay === addDays(today, -1)) return state.streak;
  return 0;
}

export function isGoalReached(state: GameState, now: Date = new Date()): boolean {
  return applyDayRollover(state, now).dayXp >= state.dailyGoal;
}

// ── Session transitions ───────────────────────────────────────────────

export function spendHeart(state: GameState, now: Date = new Date()): GameState {
  const fresh = regenerateHearts(state, now);
  if (fresh.hearts <= 0) return fresh;
  const hearts = fresh.hearts - 1;
  // The countdown only starts when the student drops below the cap.
  const heartsAt = fresh.hearts === MAX_HEARTS ? now.getTime() : fresh.heartsAt;
  return { ...fresh, hearts, heartsAt };
}

function rememberMistakes(mistakes: string[], missed: string[], mastered: string[]): string[] {
  const next = mistakes.filter(id => !mastered.includes(id) && !missed.includes(id));
  next.push(...missed);
  return next.slice(-MAX_TRACKED_MISTAKES);
}

export function registerLessonResult(
  state: GameState,
  outcome: LessonOutcome,
  now: Date = new Date()
): { state: GameState; reward: LessonReward } {
  const rolled = applyDayRollover(regenerateHearts(state, now), now);
  const today = dayKeyOf(now);
  const perfect = outcome.heartsLost === 0 && outcome.correct === outcome.total;
  const xp = lessonXp(outcome);

  const previousStreak = currentStreak(rolled, now);
  const streakIncreased = rolled.lastDay !== today;
  const streak = streakIncreased ? previousStreak + 1 : Math.max(previousStreak, 1);

  const units = { ...rolled.units };
  let crownEarned = false;
  if (outcome.topic) {
    const unit = getUnitState(rolled, outcome.topic);
    let lessons = unit.lessons;
    let crowns = unit.crowns;
    if (outcome.kind === 'lesson') {
      lessons = Math.max(lessons, outcome.index + 1);
    }
    if (outcome.kind === 'review' && crowns < CROWNS_PER_UNIT) {
      crowns += 1;
      crownEarned = true;
      // A cleared review reopens the unit for the next crown round.
      lessons = Math.max(lessons, outcome.index);
    }
    units[outcome.topic] = { lessons, crowns };
  }

  // Practice modes give a heart back instead of costing one.
  const heartRecovered =
    (outcome.kind === 'mistakes' || outcome.kind === 'blitz') &&
    outcome.heartsLost === 0 &&
    rolled.hearts < MAX_HEARTS;

  const dayXp = rolled.dayXp + xp;
  const nextState: GameState = {
    ...rolled,
    xp: rolled.xp + xp,
    dayXp,
    lastDay: today,
    streak,
    units,
    hearts: heartRecovered ? rolled.hearts + 1 : rolled.hearts,
    heartsAt: heartRecovered ? now.getTime() : rolled.heartsAt,
    mistakes: rememberMistakes(rolled.mistakes, outcome.missed, outcome.mastered),
    totalCorrect: rolled.totalCorrect + outcome.correct,
    totalAnswered: rolled.totalAnswered + outcome.total,
    lessonsDone: rolled.lessonsDone + 1,
    perfectLessons: rolled.perfectLessons + (perfect ? 1 : 0),
    bestCombo: Math.max(rolled.bestCombo, outcome.bestCombo),
  };

  return {
    state: nextState,
    reward: {
      xp,
      perfect,
      comboBonus: comboBonus(outcome.bestCombo),
      crownEarned,
      streak,
      streakIncreased,
      goalReached: dayXp >= rolled.dailyGoal && rolled.dayXp < rolled.dailyGoal,
      heartRecovered,
    },
  };
}

// ── Storage ───────────────────────────────────────────────────────────

export function sanitizeState(raw: unknown, now: Date = new Date()): GameState {
  const base = createInitialState(now);
  if (!raw || typeof raw !== 'object') return base;
  const value = raw as Partial<GameState>;
  const units: Record<string, UnitState> = {};
  if (value.units && typeof value.units === 'object') {
    for (const [topic, unit] of Object.entries(value.units)) {
      if (!unit || typeof unit !== 'object') continue;
      units[topic] = {
        lessons: Math.max(0, Number((unit as UnitState).lessons) || 0),
        crowns: Math.min(CROWNS_PER_UNIT, Math.max(0, Number((unit as UnitState).crowns) || 0)),
      };
    }
  }
  return {
    ...base,
    xp: Math.max(0, Number(value.xp) || 0),
    hearts: Math.min(MAX_HEARTS, Math.max(0, Number(value.hearts ?? MAX_HEARTS))),
    heartsAt: Number(value.heartsAt) || now.getTime(),
    streak: Math.max(0, Number(value.streak) || 0),
    lastDay: typeof value.lastDay === 'string' ? value.lastDay : null,
    dayKey: typeof value.dayKey === 'string' ? value.dayKey : dayKeyOf(now),
    dayXp: Math.max(0, Number(value.dayXp) || 0),
    dailyGoal: Number(value.dailyGoal) || base.dailyGoal,
    units,
    mistakes: Array.isArray(value.mistakes)
      ? value.mistakes.filter((id): id is string => typeof id === 'string').slice(-MAX_TRACKED_MISTAKES)
      : [],
    sound: value.sound !== false,
    totalCorrect: Math.max(0, Number(value.totalCorrect) || 0),
    totalAnswered: Math.max(0, Number(value.totalAnswered) || 0),
    lessonsDone: Math.max(0, Number(value.lessonsDone) || 0),
    perfectLessons: Math.max(0, Number(value.perfectLessons) || 0),
    bestCombo: Math.max(0, Number(value.bestCombo) || 0),
  };
}

export function loadGameState(now: Date = new Date()): GameState {
  if (typeof localStorage === 'undefined') return createInitialState(now);
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (!raw) return createInitialState(now);
    return applyDayRollover(regenerateHearts(sanitizeState(JSON.parse(raw), now), now), now);
  } catch {
    return createInitialState(now);
  }
}

export function saveGameState(state: GameState): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage cheio ou indisponível: o jogo segue só em memória */
  }
}
