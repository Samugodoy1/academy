import { comboBonus, lessonGems, lessonXp, levelOf } from './engine';
import { FREE_LIMITS, type PlanLimits } from './plan';
import { applyQuestProgress, rollQuests } from './quests';
import {
  addDays,
  dayKeyOf,
  milestoneGems,
  milestoneReached,
  rememberDay,
  resolveStreak,
} from './streak';
import type { GameState, LessonOutcome, LessonReward, Quest, UnitState } from './types';

export const GAME_STORAGE_KEY = 'academy_cola_game_v1';

export const MAX_HEARTS = 5;
export const HEART_REGEN_MS = FREE_LIMITS.heartRegenMs;
export const MAX_TRACKED_MISTAKES = 30;
export const CROWNS_PER_UNIT = 3;
export const DEFAULT_DAILY_GOAL = 30;

export const DAILY_GOAL_OPTIONS = [15, 30, 50, 80];

/** Gem prices of the trail shop. */
export const FREEZE_COST = 60;
export const HEART_REFILL_COST = 40;
export const STREAK_REPAIR_COST = 80;
/** Bonus for closing the daily goal, on top of the quest that tracks it. */
export const GOAL_GEMS = 10;

export { dayKeyOf };

export function createInitialState(now: Date = new Date()): GameState {
  const dayKey = dayKeyOf(now);
  return {
    version: 2,
    xp: 0,
    hearts: MAX_HEARTS,
    heartsAt: now.getTime(),
    streak: 0,
    lastDay: null,
    dayKey,
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
    gems: 0,
    freezes: 0,
    bestStreak: 0,
    history: [],
    frozen: [],
    lostStreak: null,
    milestone: 0,
    quests: rollQuests(dayKey, DEFAULT_DAILY_GOAL),
    dayLessons: 0,
  };
}

export function getUnitState(state: GameState, topic: string): UnitState {
  return state.units[topic] ?? { lessons: 0, crowns: 0 };
}

// ── Time based rules ──────────────────────────────────────────────────

/** Hearts refill one at a time; call before reading `hearts` anywhere. */
export function regenerateHearts(
  state: GameState,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS
): GameState {
  if (limits.infiniteHearts) {
    return state.hearts === MAX_HEARTS ? state : { ...state, hearts: MAX_HEARTS };
  }
  if (state.hearts >= MAX_HEARTS) {
    return state.heartsAt === now.getTime() ? state : { ...state, heartsAt: now.getTime() };
  }
  const elapsed = now.getTime() - state.heartsAt;
  if (elapsed < limits.heartRegenMs) return state;
  const recovered = Math.floor(elapsed / limits.heartRegenMs);
  const hearts = Math.min(MAX_HEARTS, state.hearts + recovered);
  const heartsAt =
    hearts >= MAX_HEARTS ? now.getTime() : state.heartsAt + recovered * limits.heartRegenMs;
  return { ...state, hearts, heartsAt };
}

export function msToNextHeart(
  state: GameState,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS
): number {
  if (limits.infiniteHearts || state.hearts >= MAX_HEARTS) return 0;
  return Math.max(0, state.heartsAt + limits.heartRegenMs - now.getTime());
}

/** Resets the daily counters and hands out the day's quests. */
export function applyDayRollover(state: GameState, now: Date = new Date()): GameState {
  const key = dayKeyOf(now);
  if (state.dayKey === key) return state;
  return {
    ...state,
    dayKey: key,
    dayXp: 0,
    dayLessons: 0,
    quests: rollQuests(key, state.dailyGoal),
  };
}

/** Day rollover plus streak bookkeeping: the state as of right now. */
export function refreshState(
  state: GameState,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS
): GameState {
  return resolveStreak(applyDayRollover(regenerateHearts(state, now, limits), now), now);
}

/** A streak only survives if the last completed day was today or yesterday. */
export function currentStreak(state: GameState, now: Date = new Date()): number {
  return resolveStreak(state, now).streak;
}

export function isGoalReached(state: GameState, now: Date = new Date()): boolean {
  return applyDayRollover(state, now).dayXp >= state.dailyGoal;
}

/** How many trail lessons the plan still allows today. */
export function lessonsLeftToday(
  state: GameState,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS
): number | null {
  if (limits.dailyLessons === null) return null;
  return Math.max(0, limits.dailyLessons - applyDayRollover(state, now).dayLessons);
}

export function canStartLesson(
  state: GameState,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS
): boolean {
  const left = lessonsLeftToday(state, now, limits);
  return left === null || left > 0;
}

// ── Session transitions ───────────────────────────────────────────────

export function spendHeart(
  state: GameState,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS
): GameState {
  if (limits.infiniteHearts) return state;
  const fresh = regenerateHearts(state, now, limits);
  if (fresh.hearts <= 0) return fresh;
  const hearts = fresh.hearts - 1;
  // The countdown only starts when the student drops below the cap.
  const heartsAt = fresh.hearts === MAX_HEARTS ? now.getTime() : fresh.heartsAt;
  return { ...fresh, hearts, heartsAt };
}

/** Marks one trail lesson against the daily allowance. */
export function startLesson(state: GameState, now: Date = new Date()): GameState {
  const rolled = applyDayRollover(state, now);
  return { ...rolled, dayLessons: rolled.dayLessons + 1 };
}

/** Gives the allowance back when the student quits before answering. */
export function cancelLesson(state: GameState, now: Date = new Date()): GameState {
  const rolled = applyDayRollover(state, now);
  return { ...rolled, dayLessons: Math.max(0, rolled.dayLessons - 1) };
}

function rememberMistakes(mistakes: string[], missed: string[], mastered: string[]): string[] {
  const next = mistakes.filter(id => !mastered.includes(id) && !missed.includes(id));
  next.push(...missed);
  return next.slice(-MAX_TRACKED_MISTAKES);
}

export function registerLessonResult(
  state: GameState,
  outcome: LessonOutcome,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS
): { state: GameState; reward: LessonReward } {
  const rolled = refreshState(state, now, limits);
  const today = dayKeyOf(now);
  const perfect = outcome.heartsLost === 0 && outcome.correct === outcome.total;
  const xp = lessonXp(outcome);

  const streakIncreased = rolled.lastDay !== today;
  const streak = streakIncreased ? rolled.streak + 1 : Math.max(rolled.streak, 1);
  const milestone = milestoneReached(streak) > rolled.milestone ? milestoneReached(streak) : 0;

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

  // Practice modes give a heart back instead of costing one, as long as the
  // round was actually played through.
  const heartRecovered =
    !limits.infiniteHearts &&
    (outcome.kind === 'mistakes' || outcome.kind === 'blitz') &&
    outcome.correct >= Math.ceil(outcome.total / 2) &&
    rolled.hearts < MAX_HEARTS;

  const dayXp = rolled.dayXp + xp;
  const goalReached = dayXp >= rolled.dailyGoal && rolled.dayXp < rolled.dailyGoal;
  const quest = applyQuestProgress(rolled.quests, outcome, xp);
  const gems =
    lessonGems(outcome) +
    quest.gems +
    (goalReached ? GOAL_GEMS : 0) +
    (milestone > 0 ? milestoneGems(milestone) : 0);

  const previousLevel = levelOf(rolled.xp).level;
  const nextXp = rolled.xp + xp;
  const nextLevel = levelOf(nextXp).level;

  const nextState: GameState = {
    ...rolled,
    xp: nextXp,
    dayXp,
    dayLessons: rolled.dayLessons,
    lastDay: today,
    streak,
    bestStreak: Math.max(rolled.bestStreak, streak),
    history: rememberDay(rolled.history, today),
    milestone: Math.max(rolled.milestone, milestone),
    quests: quest.quests,
    gems: rolled.gems + gems,
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
      goalReached,
      heartRecovered,
      gems,
      questsDone: quest.completed,
      milestone,
      levelUp: nextLevel > previousLevel ? nextLevel : null,
    },
  };
}

/**
 * A lesson lost to the hearts running out gives no XP and no streak, but the
 * questions that were missed still go to the review pile.
 */
export function registerFailedLesson(
  state: GameState,
  outcome: LessonOutcome,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS
): GameState {
  const rolled = refreshState(state, now, limits);
  return {
    ...rolled,
    mistakes: rememberMistakes(rolled.mistakes, outcome.missed, outcome.mastered),
    totalCorrect: rolled.totalCorrect + outcome.correct,
    totalAnswered: rolled.totalAnswered + outcome.correct + outcome.missed.length,
    bestCombo: Math.max(rolled.bestCombo, outcome.bestCombo),
  };
}

// ── Shop ──────────────────────────────────────────────────────────────

export function buyFreeze(
  state: GameState,
  limits: PlanLimits = FREE_LIMITS
): GameState {
  if (state.gems < FREEZE_COST || state.freezes >= limits.maxFreezes) return state;
  return { ...state, gems: state.gems - FREEZE_COST, freezes: state.freezes + 1 };
}

export function buyHearts(
  state: GameState,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS
): GameState {
  const fresh = regenerateHearts(state, now, limits);
  if (fresh.gems < HEART_REFILL_COST || fresh.hearts >= MAX_HEARTS) return fresh;
  return {
    ...fresh,
    gems: fresh.gems - HEART_REFILL_COST,
    hearts: MAX_HEARTS,
    heartsAt: now.getTime(),
  };
}

/**
 * Buys the broken streak back. The restored streak counts as alive up to
 * yesterday, so today's lesson keeps it going.
 */
export function repairStreak(state: GameState, now: Date = new Date()): GameState {
  if (!state.lostStreak || state.gems < STREAK_REPAIR_COST) return state;
  const today = dayKeyOf(now);
  return {
    ...state,
    gems: state.gems - STREAK_REPAIR_COST,
    streak: state.lostStreak.value,
    lastDay: state.history.includes(today) ? today : addDays(today, -1),
    lostStreak: null,
  };
}

export function applyDailyGoal(state: GameState, dailyGoal: number): GameState {
  const quests = state.quests.map(quest =>
    quest.kind === 'xp' && quest.progress < quest.target
      ? { ...quest, target: dailyGoal, title: `Ganhe ${dailyGoal} XP hoje` }
      : quest
  );
  return { ...state, dailyGoal, quests };
}

// ── Storage ───────────────────────────────────────────────────────────

const stringList = (value: unknown, cap: number): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(-cap) : [];

function sanitizeQuests(value: unknown, dayKey: string, dailyGoal: number): Quest[] {
  if (!Array.isArray(value) || value.length === 0) return rollQuests(dayKey, dailyGoal);
  const quests = value
    .filter((quest): quest is Quest => Boolean(quest) && typeof quest === 'object')
    .map(quest => ({
      id: String(quest.id ?? ''),
      kind: quest.kind,
      title: String(quest.title ?? ''),
      target: Math.max(1, Number(quest.target) || 1),
      progress: Math.max(0, Number(quest.progress) || 0),
      gems: Math.max(0, Number(quest.gems) || 0),
    }));
  return quests.length > 0 ? quests : rollQuests(dayKey, dailyGoal);
}

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
  const dayKey = typeof value.dayKey === 'string' ? value.dayKey : dayKeyOf(now);
  const dailyGoal = Number(value.dailyGoal) || base.dailyGoal;
  const streak = Math.max(0, Number(value.streak) || 0);
  const lastDay = typeof value.lastDay === 'string' ? value.lastDay : null;
  const history = stringList(value.history, 60);
  return {
    ...base,
    xp: Math.max(0, Number(value.xp) || 0),
    hearts: Math.min(MAX_HEARTS, Math.max(0, Number(value.hearts ?? MAX_HEARTS))),
    heartsAt: Number(value.heartsAt) || now.getTime(),
    streak,
    lastDay,
    dayKey,
    dayXp: Math.max(0, Number(value.dayXp) || 0),
    dailyGoal,
    units,
    mistakes: stringList(value.mistakes, MAX_TRACKED_MISTAKES),
    sound: value.sound !== false,
    totalCorrect: Math.max(0, Number(value.totalCorrect) || 0),
    totalAnswered: Math.max(0, Number(value.totalAnswered) || 0),
    lessonsDone: Math.max(0, Number(value.lessonsDone) || 0),
    perfectLessons: Math.max(0, Number(value.perfectLessons) || 0),
    bestCombo: Math.max(0, Number(value.bestCombo) || 0),
    gems: Math.max(0, Number(value.gems) || 0),
    freezes: Math.max(0, Number(value.freezes) || 0),
    bestStreak: Math.max(streak, Number(value.bestStreak) || 0),
    // Saves from the first version have no day log: seed it with the last day
    // played so the week strip is not empty on the first open.
    history: history.length === 0 && lastDay ? [lastDay] : history,
    frozen: stringList(value.frozen, 60),
    lostStreak:
      value.lostStreak && typeof value.lostStreak === 'object' && typeof value.lostStreak.day === 'string'
        ? { value: Math.max(0, Number(value.lostStreak.value) || 0), day: value.lostStreak.day }
        : null,
    milestone: Math.max(0, Number(value.milestone) || 0),
    quests: sanitizeQuests(value.quests, dayKey, dailyGoal),
    dayLessons: Math.max(0, Number(value.dayLessons) || 0),
  };
}

export function loadGameState(now: Date = new Date(), limits: PlanLimits = FREE_LIMITS): GameState {
  if (typeof localStorage === 'undefined') return createInitialState(now);
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (!raw) return createInitialState(now);
    return refreshState(sanitizeState(JSON.parse(raw), now), now, limits);
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
