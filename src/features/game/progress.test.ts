import { describe, expect, it } from 'vitest';
import { FREE_LIMITS, STUDENT_LIMITS } from './plan';
import {
  CROWNS_PER_UNIT,
  FREEZE_COST,
  HEART_REFILL_COST,
  HEART_REGEN_MS,
  MAX_HEARTS,
  applyDailyGoal,
  applyDayRollover,
  buyFreeze,
  buyHearts,
  cancelLesson,
  canStartLesson,
  createInitialState,
  currentStreak,
  dayKeyOf,
  getUnitState,
  lessonsLeftToday,
  msToNextHeart,
  regenerateHearts,
  registerFailedLesson,
  registerLessonResult,
  sanitizeState,
  spendHeart,
  startLesson,
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

describe('limites do plano', () => {
  it('o Free libera cinco lições por dia', () => {
    const now = at('2026-03-01T09:00:00');
    let state = createInitialState(now);
    for (let i = 0; i < 5; i += 1) {
      expect(canStartLesson(state, now, FREE_LIMITS)).toBe(true);
      state = startLesson(state, now);
    }
    expect(canStartLesson(state, now, FREE_LIMITS)).toBe(false);
    expect(lessonsLeftToday(state, now, FREE_LIMITS)).toBe(0);
  });

  it('devolve a cota quando a lição é abandonada', () => {
    const now = at('2026-03-01T09:00:00');
    const started = startLesson(createInitialState(now), now);
    expect(lessonsLeftToday(started, now, FREE_LIMITS)).toBe(4);
    const quit = cancelLesson(started, now);
    expect(lessonsLeftToday(quit, now, FREE_LIMITS)).toBe(5);
    expect(cancelLesson(quit, now).dayLessons).toBe(0);
  });

  it('a cota volta na virada do dia', () => {
    const now = at('2026-03-01T09:00:00');
    let state = createInitialState(now);
    for (let i = 0; i < 5; i += 1) state = startLesson(state, now);
    const tomorrow = at('2026-03-02T07:00:00');
    expect(canStartLesson(state, tomorrow, FREE_LIMITS)).toBe(true);
    expect(lessonsLeftToday(state, tomorrow, FREE_LIMITS)).toBe(5);
  });

  it('o Student não tem cota nem gasta vidas', () => {
    const now = at('2026-03-01T09:00:00');
    let state = createInitialState(now);
    for (let i = 0; i < 12; i += 1) state = startLesson(state, now);
    expect(canStartLesson(state, now, STUDENT_LIMITS)).toBe(true);
    expect(lessonsLeftToday(state, now, STUDENT_LIMITS)).toBeNull();

    const spent = spendHeart(state, now, STUDENT_LIMITS);
    expect(spent.hearts).toBe(MAX_HEARTS);
    expect(msToNextHeart(spent, now, STUDENT_LIMITS)).toBe(0);
  });

  it('o Student volta com as vidas cheias ao trocar de plano', () => {
    const now = at('2026-03-01T09:00:00');
    const drained = spendHeart(spendHeart(createInitialState(now), now), now);
    expect(regenerateHearts(drained, now, STUDENT_LIMITS).hearts).toBe(MAX_HEARTS);
  });
});

describe('cristais', () => {
  it('a lição paga cristais e a meta do dia dá bônus', () => {
    const now = at('2026-03-01T09:00:00');
    const start: GameState = { ...createInitialState(now), dailyGoal: 20 };
    const { state, reward } = registerLessonResult(start, baseOutcome(), now);
    expect(reward.gems).toBeGreaterThan(0);
    expect(state.gems).toBe(reward.gems);
  });

  it('compra protetor respeitando o teto do plano', () => {
    const now = at('2026-03-01T09:00:00');
    const rich: GameState = { ...createInitialState(now), gems: 500 };
    const one = buyFreeze(rich, FREE_LIMITS);
    expect(one.freezes).toBe(1);
    expect(one.gems).toBe(500 - FREEZE_COST);
    expect(buyFreeze(one, FREE_LIMITS).freezes).toBe(1);
    expect(buyFreeze(one, STUDENT_LIMITS).freezes).toBe(2);
  });

  it('não compra protetor sem cristais', () => {
    const now = at('2026-03-01T09:00:00');
    const broke: GameState = { ...createInitialState(now), gems: 5 };
    expect(buyFreeze(broke, FREE_LIMITS).freezes).toBe(0);
  });

  it('enche as vidas pagando cristais', () => {
    const now = at('2026-03-01T09:00:00');
    const spent = spendHeart(spendHeart(createInitialState(now), now), now);
    const paid = buyHearts({ ...spent, gems: 100 }, now);
    expect(paid.hearts).toBe(MAX_HEARTS);
    expect(paid.gems).toBe(100 - HEART_REFILL_COST);
  });
});

describe('missões no resultado', () => {
  it('a lição avança as missões e paga quando fecha', () => {
    const now = at('2026-03-01T09:00:00');
    const start: GameState = {
      ...createInitialState(now),
      quests: [
        { id: 'lessons-1', kind: 'lessons', title: 'Complete 1 lição', target: 1, progress: 0, gems: 15 },
      ],
    };
    const { state, reward } = registerLessonResult(start, baseOutcome(), now);
    expect(state.quests[0].progress).toBe(1);
    expect(reward.questsDone).toHaveLength(1);
    expect(reward.gems).toBeGreaterThanOrEqual(15);
  });

  it('trocar a meta do dia atualiza a missão de XP pendente', () => {
    const now = at('2026-03-01T09:00:00');
    const state = applyDailyGoal(createInitialState(now), 50);
    const xpQuest = state.quests.find(quest => quest.kind === 'xp');
    expect(state.dailyGoal).toBe(50);
    expect(xpQuest?.target).toBe(50);
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

  it('migra um save antigo sem cristais nem missões', () => {
    const now = at('2026-03-11T09:00:00');
    const state = sanitizeState(
      { version: 1, xp: 320, streak: 4, lastDay: '2026-03-10', hearts: 3, dailyGoal: 30 },
      now
    );
    expect(state.version).toBe(2);
    expect(state.gems).toBe(0);
    expect(state.freezes).toBe(0);
    expect(state.quests).toHaveLength(3);
    expect(state.bestStreak).toBe(4);
    // O último dia jogado alimenta a semana mesmo sem histórico salvo.
    expect(state.history).toEqual(['2026-03-10']);
  });
});
