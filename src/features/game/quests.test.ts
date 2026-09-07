import { describe, expect, it } from 'vitest';
import { levelOf } from './engine';
import { applyQuestProgress, QUESTS_PER_DAY, rollQuests } from './quests';
import type { LessonOutcome, Quest } from './types';

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

const quest = (partial: Partial<Quest>): Quest => ({
  id: 'q',
  kind: 'lessons',
  title: 'teste',
  target: 2,
  progress: 0,
  gems: 15,
  ...partial,
});

describe('missões do dia', () => {
  it('entrega três missões, sempre com a meta de XP', () => {
    const quests = rollQuests('2026-03-11', 30);
    expect(quests).toHaveLength(QUESTS_PER_DAY);
    expect(quests[0].kind).toBe('xp');
    expect(quests[0].target).toBe(30);
    expect(new Set(quests.map(item => item.id)).size).toBe(QUESTS_PER_DAY);
  });

  it('é estável no mesmo dia e muda de um dia para o outro', () => {
    const ids = (day: string) => rollQuests(day, 30).map(item => item.id).join();
    expect(ids('2026-03-11')).toBe(ids('2026-03-11'));
    const week = new Set(
      ['2026-03-11', '2026-03-12', '2026-03-13', '2026-03-14'].map(ids)
    );
    expect(week.size).toBeGreaterThan(1);
  });

  it('paga os cristais apenas na virada para concluída', () => {
    const quests = [quest({ id: 'lessons-2', target: 2, gems: 15 })];
    const first = applyQuestProgress(quests, outcome(), 12);
    expect(first.gems).toBe(0);
    expect(first.quests[0].progress).toBe(1);

    const second = applyQuestProgress(first.quests, outcome(), 12);
    expect(second.gems).toBe(15);
    expect(second.completed).toHaveLength(1);

    const third = applyQuestProgress(second.quests, outcome(), 12);
    expect(third.gems).toBe(0);
    expect(third.quests[0].progress).toBe(2);
  });

  it('conta o combo pelo melhor da lição, não pela soma', () => {
    const quests = [quest({ id: 'combo-10', kind: 'combo', target: 10, gems: 25 })];
    const first = applyQuestProgress(quests, outcome({ bestCombo: 6 }), 10);
    expect(first.quests[0].progress).toBe(6);
    const second = applyQuestProgress(first.quests, outcome({ bestCombo: 4 }), 10);
    expect(second.quests[0].progress).toBe(6);
    const third = applyQuestProgress(second.quests, outcome({ bestCombo: 10 }), 10);
    expect(third.gems).toBe(25);
  });

  it('só conta lição sem erro quando não houve erro', () => {
    const quests = [quest({ id: 'perfect-1', kind: 'perfect', target: 1 })];
    const missed = applyQuestProgress(quests, outcome({ correct: 5, heartsLost: 1 }), 10);
    expect(missed.gems).toBe(0);
    const clean = applyQuestProgress(quests, outcome(), 10);
    expect(clean.gems).toBe(15);
  });

  it('a revisão de erros não conta como lição da trilha', () => {
    const quests = [
      quest({ id: 'lessons-2', kind: 'lessons', target: 2 }),
      quest({ id: 'mistakes-1', kind: 'mistakes', target: 1 }),
    ];
    const update = applyQuestProgress(quests, outcome({ kind: 'mistakes' }), 8);
    expect(update.quests[0].progress).toBe(0);
    expect(update.quests[1].progress).toBe(1);
  });
});

describe('níveis', () => {
  it('começa no nível 1 e sobe conforme o XP', () => {
    expect(levelOf(0).level).toBe(1);
    expect(levelOf(99).level).toBe(1);
    expect(levelOf(100).level).toBe(2);
    expect(levelOf(249).level).toBe(2);
    expect(levelOf(250).level).toBe(3);
  });

  it('informa quanto falta dentro do nível', () => {
    const level = levelOf(120);
    expect(level.level).toBe(2);
    expect(level.into).toBe(20);
    expect(level.size).toBe(150);
    expect(level.title).toBeTruthy();
  });
});
