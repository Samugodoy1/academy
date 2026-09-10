import { academyApiFetch, currentUserId } from '../../api/client';
import { FREE_LIMITS, type PlanLimits } from './plan';
import {
  GAME_STORAGE_KEY,
  createInitialState,
  refreshState,
  sanitizeState,
} from './progress';
import type { GameState } from './types';

export interface GameStatePayload {
  version: 2;
  updatedAt: number;
  state: GameState;
}

export function gameStorageKey(userId: number | null = currentUserId()): string {
  return userId ? `${GAME_STORAGE_KEY}:${userId}` : GAME_STORAGE_KEY;
}

export function progressScore(state: GameState): number {
  return (
    state.xp * 10 +
    state.lessonsDone * 100 +
    state.gems +
    state.streak * 5 +
    state.totalAnswered +
    state.perfectLessons * 3
  );
}

export function isDefaultGameState(state: GameState): boolean {
  return (
    state.xp === 0 &&
    state.lessonsDone === 0 &&
    state.gems === 0 &&
    state.streak === 0 &&
    state.totalAnswered === 0
  );
}

export function parseGamePayload(raw: unknown, now: Date = new Date()): GameState | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const inner = record.state && typeof record.state === 'object' ? record.state : raw;
  return sanitizeState(inner, now);
}

export function mergeGameStates(
  local: GameState,
  remote: GameState,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS,
): GameState {
  const left = refreshState(sanitizeState(local, now), now, limits);
  const right = refreshState(sanitizeState(remote, now), now, limits);
  if (isDefaultGameState(right) && !isDefaultGameState(left)) return left;
  if (isDefaultGameState(left) && !isDefaultGameState(right)) return right;
  return progressScore(right) >= progressScore(left) ? right : left;
}

export function loadLocalGameState(
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS,
  userId: number | null = currentUserId(),
): GameState {
  if (typeof localStorage === 'undefined') return createInitialState(now);
  const keys = [gameStorageKey(userId)];
  if (userId) keys.push(GAME_STORAGE_KEY);
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      return refreshState(sanitizeState(JSON.parse(raw), now), now, limits);
    } catch {
      /* tenta a próxima chave */
    }
  }
  return createInitialState(now);
}

export function saveLocalGameState(state: GameState, userId: number | null = currentUserId()) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(gameStorageKey(userId), JSON.stringify(state));
  } catch {
    /* storage cheio ou indisponível */
  }
}

export async function fetchAcademyGame(now: Date = new Date()): Promise<GameState | null> {
  if (!currentUserId()) return null;
  try {
    const res = await academyApiFetch('/api/academy/game');
    if (!res.ok) return null;
    const data = await res.json();
    return parseGamePayload(data, now);
  } catch {
    return null;
  }
}

export async function putAcademyGame(state: GameState): Promise<boolean> {
  if (!currentUserId()) return false;
  try {
    const payload: GameStatePayload = {
      version: 2,
      updatedAt: Date.now(),
      state,
    };
    const res = await academyApiFetch('/api/academy/game', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

let saveTimer: number | null = null;
let pendingState: GameState | null = null;
let saveChain: Promise<boolean> = Promise.resolve(false);

export function queueAcademyGameSave(state: GameState) {
  pendingState = state;
  if (typeof window === 'undefined') {
    void putAcademyGame(state);
    return;
  }
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    const next = pendingState;
    pendingState = null;
    saveTimer = null;
    if (!next) return;
    saveChain = saveChain.then(() => putAcademyGame(next));
  }, 800);
}

export function persistGameState(state: GameState) {
  saveLocalGameState(state);
  queueAcademyGameSave(state);
}

export async function hydrateGameFromServer(
  local: GameState,
  now: Date = new Date(),
  limits: PlanLimits = FREE_LIMITS,
): Promise<GameState> {
  const remote = await fetchAcademyGame(now);
  if (!remote) return local;
  const merged = mergeGameStates(local, remote, now, limits);
  saveLocalGameState(merged);
  if (progressScore(merged) > progressScore(remote) || isDefaultGameState(remote)) {
    queueAcademyGameSave(merged);
  }
  return merged;
}
