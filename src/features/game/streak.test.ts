import { describe, expect, it } from 'vitest';
import { createInitialState, registerLessonResult, repairStreak } from './progress';
import {
  addDays,
  canRepairStreak,
  dayKeyOf,
  daysBetween,
  milestoneReached,
  nextMilestone,
  resolveStreak,
  streakAtRisk,
  weekStrip,
} from './streak';
import type { GameState, LessonOutcome } from './types';

const at = (iso: string) => new Date(iso);

const outcome = (partial: Partial<LessonOutcome> = {}): LessonOutcome => ({
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

const withStreak = (days: number, lastDay: string, extra: Partial<GameState> = {}): GameState => ({
  ...createInitialState(at(`${lastDay}T09:00:00`)),
  streak: days,
  lastDay,
  history: [lastDay],
  ...extra,
});

describe('calendário', () => {
  it('conta a distância entre dias', () => {
    expect(daysBetween('2026-03-01', '2026-03-04')).toBe(3);
    expect(daysBetween('2026-03-04', '2026-03-01')).toBe(-3);
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
  });

  it('atravessa o horário de verão sem perder um dia', () => {
    expect(daysBetween('2026-10-17', '2026-10-19')).toBe(2);
    expect(addDays('2026-02-14', -1)).toBe('2026-02-13');
  });
});

describe('ofensiva', () => {
  it('mantém a ofensiva de hoje e de ontem', () => {
    const state = withStreak(4, '2026-03-10');
    expect(resolveStreak(state, at('2026-03-10T20:00:00')).streak).toBe(4);
    expect(resolveStreak(state, at('2026-03-11T08:00:00')).streak).toBe(4);
  });

  it('avisa que o dia ainda não foi jogado', () => {
    const state = withStreak(4, '2026-03-10');
    expect(streakAtRisk(state, at('2026-03-10T20:00:00'))).toBe(false);
    expect(streakAtRisk(state, at('2026-03-11T08:00:00'))).toBe(true);
  });

  it('gasta um protetor no dia pulado', () => {
    const state = withStreak(6, '2026-03-10', { freezes: 1 });
    const resolved = resolveStreak(state, at('2026-03-12T08:00:00'));
    expect(resolved.streak).toBe(6);
    expect(resolved.freezes).toBe(0);
    expect(resolved.frozen).toEqual(['2026-03-11']);
    expect(resolved.lastDay).toBe('2026-03-11');
  });

  it('não segura mais dias do que tem protetores', () => {
    const state = withStreak(6, '2026-03-10', { freezes: 1 });
    const resolved = resolveStreak(state, at('2026-03-14T08:00:00'));
    expect(resolved.streak).toBe(0);
    expect(resolved.freezes).toBe(1);
    expect(resolved.lostStreak).toEqual({ value: 6, day: '2026-03-14' });
  });

  it('não oferece recuperação para ofensiva de um dia só', () => {
    const state = withStreak(1, '2026-03-10');
    expect(resolveStreak(state, at('2026-03-13T08:00:00')).lostStreak).toBeNull();
  });

  it('a oferta de recuperação expira depois da janela', () => {
    const lost: GameState = {
      ...createInitialState(at('2026-03-12T09:00:00')),
      lostStreak: { value: 9, day: '2026-03-12' },
    };
    expect(canRepairStreak(lost, at('2026-03-13T09:00:00'))).toBe(true);
    expect(canRepairStreak(lost, at('2026-03-14T09:00:00'))).toBe(true);
    expect(canRepairStreak(lost, at('2026-03-16T09:00:00'))).toBe(false);
  });

  it('recupera a ofensiva pagando cristais e retoma no dia seguinte', () => {
    const now = at('2026-03-13T09:00:00');
    const lost: GameState = {
      ...createInitialState(now),
      gems: 200,
      lostStreak: { value: 9, day: '2026-03-13' },
    };
    const repaired = repairStreak(lost, now);
    expect(repaired.streak).toBe(9);
    expect(repaired.gems).toBe(120);
    expect(repaired.lostStreak).toBeNull();

    const { reward } = registerLessonResult(repaired, outcome(), now);
    expect(reward.streak).toBe(10);
  });

  it('não recupera sem cristais suficientes', () => {
    const now = at('2026-03-13T09:00:00');
    const lost: GameState = {
      ...createInitialState(now),
      gems: 10,
      lostStreak: { value: 9, day: '2026-03-13' },
    };
    expect(repairStreak(lost, now).streak).toBe(0);
  });

  it('marca as marcas comemoradas', () => {
    expect(milestoneReached(7)).toBe(7);
    expect(milestoneReached(8)).toBe(0);
    expect(nextMilestone(8)).toBe(14);
  });

  it('celebra a marca uma única vez', () => {
    const now = at('2026-03-10T09:00:00');
    const state = withStreak(2, '2026-03-09', { milestone: 0 });
    const first = registerLessonResult(state, outcome(), now);
    expect(first.reward.streak).toBe(3);
    expect(first.reward.milestone).toBe(3);

    const again = registerLessonResult(first.state, outcome({ index: 1 }), now);
    expect(again.reward.milestone).toBe(0);
  });
});

describe('semana', () => {
  it('mostra jogado, protegido, perdido e futuro', () => {
    const now = at('2026-03-11T10:00:00'); // quarta
    const state: GameState = {
      ...createInitialState(now),
      history: ['2026-03-09'],
      frozen: ['2026-03-10'],
    };
    const strip = weekStrip(state, now);
    expect(strip).toHaveLength(7);
    expect(strip[0].key).toBe('2026-03-08');
    expect(strip.map(day => day.status)).toEqual([
      'missed',
      'done',
      'frozen',
      'today',
      'future',
      'future',
      'future',
    ]);
  });

  it('marca o dia jogado como concluído', () => {
    const now = at('2026-03-11T10:00:00');
    const { state } = registerLessonResult(createInitialState(now), outcome(), now);
    const today = weekStrip(state, now).find(day => day.key === dayKeyOf(now));
    expect(today?.status).toBe('done');
  });
});
