import { describe, expect, it } from 'vitest';
import {
  CROWNS_PER_UNIT,
  HEART_REGEN_MS,
  MAX_HEARTS,
  applyDayRollover,
  createInitialState,
  currentStreak,
  dayKeyOf,
  getUnitState,
  msToNextHeart,
  regenerateHearts,
  registerFailedLesson,
  registerLessonResult,
  sanitizeState,
  spendHeart,
} from './progress';
import type { GameState, LessonOutcome } from './types';

const at = (iso: string) => new Date(iso);

const baseOutcome = (partial: Partial<LessonOutcome> = {}): LessonOutcome => ({
  topic: 'anestesia',
  kind: 'lesson',
  index: 0,
  correct: 6,
  total: 6,
  heartsLost: 0,
  bestCombo: 6,
  missed: [],
  mastered: [],
  elapsedMs: 45000,
  ...partial,
});

describe('vidas', () => {
  it('gasta uma vida e inicia o cronômetro', () => {
    const now = at('2026-03-01T10:00:00');
    const state = spendHeart(createInitialState(now), now);
    expect(state.hearts).toBe(MAX_HEARTS - 1);
    expect(msToNextHeart(state, now)).toBe(HEART_REGEN_MS);
  });

  it('regenera uma vida a cada intervalo', () => {
    const start = at('2026-03-01T10:00:00');
    let state = spendHeart(spendHeart(createInitialState(start), start), start);
    expect(state.hearts).toBe(3);

    state = regenerateHearts(state, new Date(start.getTime() + HEART_REGEN_MS - 1000));
    expect(state.hearts).toBe(3);

    state = regenerateHearts(state, new Date(start.getTime() + HEART_REGEN_MS + 1000));
    expect(state.hearts).toBe(4);
  });

  it('nunca ultrapassa o máximo', () => {
    const start = at('2026-03-01T10:00:00');
    const spent = spendHeart(createInitialState(start), start);
    const later = regenerateHearts(spent, new Date(start.getTime() + HEART_REGEN_MS * 20));
    expect(later.hearts).toBe(MAX_HEARTS);
    expect(msToNextHeart(later, start)).toBe(0);
  });
});

describe('ofensiva e meta diária', () => {
  it('conta o primeiro dia como ofensiva 1', () => {
    const now = at('2026-03-01T09:00:00');
    const { state, reward } = registerLessonResult(createInitialState(now), baseOutcome(), now);
    expect(reward.streak).toBe(1);
    expect(reward.streakIncreased).toBe(true);
    expect(currentStreak(state, now)).toBe(1);
  });

  it('não soma duas vezes no mesmo dia', () => {
    const now = at('2026-03-01T09:00:00');
    const first = registerLessonResult(createInitialState(now), baseOutcome(), now);
    const second = registerLessonResult(first.state, baseOutcome({ index: 1 }), at('2026-03-01T20:00:00'));
    expect(second.reward.streak).toBe(1);
    expect(second.reward.streakIncreased).toBe(false);
  });

  it('soma no dia seguinte e zera após pular um dia', () => {
    const day1 = at('2026-03-01T09:00:00');
    const first = registerLessonResult(createInitialState(day1), baseOutcome(), day1);
    const day2 = at('2026-03-02T09:00:00');
    const second = registerLessonResult(first.state, baseOutcome({ index: 1 }), day2);
    expect(second.reward.streak).toBe(2);

    expect(currentStreak(second.state, at('2026-03-04T09:00:00'))).toBe(0);
    const day4 = at('2026-03-04T09:00:00');
    const third = registerLessonResult(second.state, baseOutcome({ index: 2 }), day4);
    expect(third.reward.streak).toBe(1);
  });

  it('zera o xp do dia na virada', () => {
    const day1 = at('2026-03-01T09:00:00');
    const { state } = registerLessonResult(createInitialState(day1), baseOutcome(), day1);
    expect(state.dayXp).toBeGreaterThan(0);
    const rolled = applyDayRollover(state, at('2026-03-02T00:30:00'));
    expect(rolled.dayXp).toBe(0);
    expect(rolled.dayKey).toBe(dayKeyOf(at('2026-03-02T00:30:00')));
  });

  it('avisa quando a meta do dia é batida', () => {
    const now = at('2026-03-01T09:00:00');
    const start: GameState = { ...createInitialState(now), dailyGoal: 20 };
    const { reward } = registerLessonResult(start, baseOutcome(), now);
    expect(reward.goalReached).toBe(true);
  });
});

describe('progresso da trilha', () => {
  it('libera a próxima lição da unidade', () => {
    const now = at('2026-03-01T09:00:00');
    const { state } = registerLessonResult(createInitialState(now), baseOutcome({ index: 0 }), now);
    expect(getUnitState(state, 'anestesia').lessons).toBe(1);
  });

  it('não retrocede ao refazer uma lição antiga', () => {
    const now = at('2026-03-01T09:00:00');
    const first = registerLessonResult(createInitialState(now), baseOutcome({ index: 1 }), now);
    const again = registerLessonResult(first.state, baseOutcome({ index: 0 }), now);
    expect(getUnitState(again.state, 'anestesia').lessons).toBe(2);
  });

  it('dá coroa ao concluir a prova do box e para no limite', () => {
    const now = at('2026-03-01T09:00:00');
    let state = createInitialState(now);
    for (let i = 0; i < CROWNS_PER_UNIT + 1; i += 1) {
      state = registerLessonResult(state, baseOutcome({ kind: 'review', index: 2 }), now).state;
    }
    expect(getUnitState(state, 'anestesia').crowns).toBe(CROWNS_PER_UNIT);
  });

  it('guarda erros e limpa o que foi acertado depois', () => {
    const now = at('2026-03-01T09:00:00');
    const first = registerLessonResult(
      createInitialState(now),
      baseOutcome({ correct: 4, missed: ['anest-01', 'anest-02'], mastered: [] }),
      now
    );
    expect(first.state.mistakes).toEqual(['anest-01', 'anest-02']);

    const second = registerLessonResult(
      first.state,
      baseOutcome({ kind: 'mistakes', missed: [], mastered: ['anest-01'] }),
      now
    );
    expect(second.state.mistakes).toEqual(['anest-02']);
  });

  it('devolve uma vida ao completar o treino livre sem erros', () => {
    const now = at('2026-03-01T09:00:00');
    const spent = spendHeart(createInitialState(now), now);
    const { state, reward } = registerLessonResult(
      spent,
      baseOutcome({ kind: 'mistakes', heartsLost: 0 }),
      now
    );
    expect(reward.heartRecovered).toBe(true);
    expect(state.hearts).toBe(MAX_HEARTS);
  });

  it('não devolve vida quando o treino livre foi majoritariamente errado', () => {
    const now = at('2026-03-01T09:00:00');
    const spent = spendHeart(createInitialState(now), now);
    const { state, reward } = registerLessonResult(
      spent,
      baseOutcome({ kind: 'mistakes', correct: 1, total: 6 }),
      now
    );
    expect(reward.heartRecovered).toBe(false);
    expect(state.hearts).toBe(MAX_HEARTS - 1);
  });
});

describe('lição perdida', () => {
  it('guarda os erros mas não dá xp nem ofensiva', () => {
    const now = at('2026-03-01T09:00:00');
    const start = createInitialState(now);
    const next = registerFailedLesson(
      start,
      baseOutcome({ correct: 1, missed: ['anest-04', 'anest-09'] }),
      now
    );
    expect(next.xp).toBe(0);
    expect(next.lastDay).toBeNull();
    expect(next.streak).toBe(0);
    expect(next.mistakes).toEqual(['anest-04', 'anest-09']);
    expect(getUnitState(next, 'anestesia').lessons).toBe(0);
  });
});

describe('sanitize', () => {
  it('recupera de um estado corrompido', () => {
    const now = at('2026-03-01T09:00:00');
    const state = sanitizeState({ xp: 'muito', hearts: 99, units: { anestesia: { lessons: -3, crowns: 9 } } }, now);
    expect(state.xp).toBe(0);
    expect(state.hearts).toBe(MAX_HEARTS);
    expect(state.units.anestesia).toEqual({ lessons: 0, crowns: CROWNS_PER_UNIT });
  });

  it('devolve o estado inicial para lixo', () => {
    const now = at('2026-03-01T09:00:00');
    expect(sanitizeState(null, now).xp).toBe(0);
    expect(sanitizeState('oi', now).hearts).toBe(MAX_HEARTS);
  });
});
