import { describe, expect, it } from 'vitest';
import { GAME_STORAGE_KEY, createInitialState } from './progress';
import {
  gameStorageKey,
  isDefaultGameState,
  mergeGameStates,
  parseGamePayload,
  progressScore,
} from './sync';

const at = (iso: string) => new Date(iso);

describe('persistência do jogo', () => {
  it('escopa o save local por usuário', () => {
    expect(gameStorageKey(12)).toBe(`${GAME_STORAGE_KEY}:12`);
    expect(gameStorageKey(null)).toBe(GAME_STORAGE_KEY);
  });

  it('lê o estado tanto no envelope da API quanto solto', () => {
    const now = at('2026-09-10T10:00:00');
    const inner = { ...createInitialState(now), xp: 140, lessonsDone: 4, gems: 20 };
    expect(parseGamePayload({ version: 2, updatedAt: now.getTime(), state: inner }, now)?.xp).toBe(140);
    expect(parseGamePayload(inner, now)?.lessonsDone).toBe(4);
    expect(parseGamePayload(null, now)).toBeNull();
  });

  it('fica com o progresso maior ao mesclar local e remoto', () => {
    const now = at('2026-09-10T10:00:00');
    const local = { ...createInitialState(now), xp: 80, lessonsDone: 2, gems: 10 };
    const remote = { ...createInitialState(now), xp: 240, lessonsDone: 7, gems: 40 };
    expect(progressScore(remote)).toBeGreaterThan(progressScore(local));
    expect(mergeGameStates(local, remote, now).xp).toBe(240);
    expect(mergeGameStates(remote, local, now).lessonsDone).toBe(7);
  });

  it('não deixa um save vazio do servidor apagar o progresso local', () => {
    const now = at('2026-09-10T10:00:00');
    const local = { ...createInitialState(now), xp: 90, lessonsDone: 3 };
    const remote = createInitialState(now);
    expect(isDefaultGameState(remote)).toBe(true);
    expect(mergeGameStates(local, remote, now).xp).toBe(90);
  });
});
