import type { GameState } from './types';

/** Days the "buy your streak back" offer stays on the trail. */
export const REPAIR_WINDOW_DAYS = 2;
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 180, 365];
export const MAX_TRACKED_DAYS = 60;

export function dayKeyOf(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDayKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function addDays(key: string, amount: number): string {
  const date = parseDayKey(key);
  date.setDate(date.getDate() + amount);
  return dayKeyOf(date);
}

/** Whole days from `from` to `to`; negative when `to` is in the past. */
export function daysBetween(from: string, to: string): number {
  const start = parseDayKey(from).getTime();
  const end = parseDayKey(to).getTime();
  return Math.round((end - start) / 86400000);
}

const trackDay = (days: string[], key: string): string[] =>
  days.includes(key) ? days : [...days, key].sort().slice(-MAX_TRACKED_DAYS);

/**
 * Brings the streak up to date with the calendar. Skipped days are paid for
 * with freezes, one per day; when there are not enough the streak drops and
 * goes to the repair offer.
 */
export function resolveStreak(state: GameState, now: Date = new Date()): GameState {
  const today = dayKeyOf(now);
  if (!state.lastDay || state.streak <= 0) return state;

  const gap = daysBetween(state.lastDay, today);
  if (gap <= 1) return state;

  const missed = gap - 1;
  if (missed <= state.freezes) {
    let frozen = state.frozen;
    for (let i = 1; i <= missed; i += 1) frozen = trackDay(frozen, addDays(state.lastDay, i));
    return { ...state, freezes: state.freezes - missed, frozen, lastDay: addDays(today, -1) };
  }

  return {
    ...state,
    streak: 0,
    lostStreak: state.streak >= 2 ? { value: state.streak, day: today } : null,
  };
}

export function streakAtRisk(state: GameState, now: Date = new Date()): boolean {
  return state.streak > 0 && state.lastDay !== dayKeyOf(now);
}

/** True when a freeze covered one of the last two days, worth telling the student. */
export function freezeJustUsed(state: GameState, now: Date = new Date()): boolean {
  const today = dayKeyOf(now);
  return state.frozen.some(day => {
    const distance = daysBetween(day, today);
    return distance >= 0 && distance <= 2;
  });
}

export function canRepairStreak(state: GameState, now: Date = new Date()): boolean {
  if (!state.lostStreak) return false;
  const distance = daysBetween(state.lostStreak.day, dayKeyOf(now));
  return distance >= 0 && distance <= REPAIR_WINDOW_DAYS;
}

export function milestoneReached(streak: number): number {
  return STREAK_MILESTONES.includes(streak) ? streak : 0;
}

export function nextMilestone(streak: number): number {
  return STREAK_MILESTONES.find(value => value > streak) ?? 0;
}

export function milestoneGems(milestone: number): number {
  if (milestone >= 100) return 120;
  if (milestone >= 30) return 60;
  if (milestone >= 7) return 30;
  return 15;
}

export type DayStatus = 'done' | 'frozen' | 'missed' | 'today' | 'future';

export interface DayCell {
  key: string;
  label: string;
  status: DayStatus;
}

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

/** The current Sunday-to-Saturday week, the way Duolingo shows the streak. */
export function weekStrip(state: GameState, now: Date = new Date()): DayCell[] {
  const today = dayKeyOf(now);
  const start = addDays(today, -now.getDay());
  return Array.from({ length: 7 }, (_, index) => {
    const key = addDays(start, index);
    const distance = daysBetween(key, today);
    let status: DayStatus;
    if (state.history.includes(key)) status = 'done';
    else if (state.frozen.includes(key)) status = 'frozen';
    else if (distance === 0) status = 'today';
    else if (distance > 0) status = 'missed';
    else status = 'future';
    return { key, label: WEEKDAY_LABELS[index], status };
  });
}

export function rememberDay(days: string[], key: string): string[] {
  return trackDay(days, key);
}
