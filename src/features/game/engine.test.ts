import { describe, expect, it } from 'vitest';
import {
  BLITZ_SIZE,
  LESSON_SIZE,
  REVIEW_SIZE,
  buildBlitzLesson,
  buildLesson,
  buildMistakesLesson,
  buildUnitReview,
  checkAnswer,
  comboBonus,
  countLessons,
  describeAnswer,
  lessonXp,
  shuffleWithSeed,
} from './engine';
import { ALL_EXERCISES, GAME_UNITS } from './content';
import type { Exercise, LessonOutcome } from './types';

const unit = GAME_UNITS[0];

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
  elapsedMs: 60000,
  ...partial,
});

describe('conteúdo do jogo', () => {
  it('tem exercícios em todas as unidades', () => {
    expect(GAME_UNITS.length).toBeGreaterThanOrEqual(11);
    for (const gameUnit of GAME_UNITS) {
      expect(gameUnit.exercises.length).toBeGreaterThanOrEqual(LESSON_SIZE);
      expect(gameUnit.lessons).toBe(countLessons(gameUnit.exercises.length));
    }
  });

  it('não repete ids de exercício', () => {
    const ids = ALL_EXERCISES.map(exercise => exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('mantém respostas válidas em todos os formatos', () => {
    for (const exercise of ALL_EXERCISES) {
      if (exercise.kind === 'choice') {
        expect(exercise.options[exercise.answer]).toBeTruthy();
        expect(exercise.options.length).toBeGreaterThanOrEqual(3);
      }
      if (exercise.kind === 'multi') {
        expect(exercise.answers.length).toBeGreaterThan(0);
        expect(exercise.answers.length).toBeLessThan(exercise.options.length);
      }
      if (exercise.kind === 'order') {
        expect(exercise.steps.length).toBeGreaterThanOrEqual(3);
      }
      if (exercise.kind === 'match') {
        expect(exercise.pairs.length).toBeGreaterThanOrEqual(3);
      }
      if (exercise.kind === 'blank') {
        expect(exercise.sentence).toContain('___');
        expect(exercise.bank).toContain(exercise.answer);
      }
      expect(exercise.explanation.length).toBeGreaterThan(20);
    }
  });
});

describe('checkAnswer', () => {
  const choice: Exercise = {
    id: 'x1',
    topic: 'anestesia',
    kind: 'choice',
    prompt: 'p',
    explanation: 'e',
    options: ['a', 'b'],
    answer: 1,
  };

  it('valida múltipla escolha', () => {
    expect(checkAnswer(choice, { kind: 'choice', index: 1 })).toBe(true);
    expect(checkAnswer(choice, { kind: 'choice', index: 0 })).toBe(false);
  });

  it('valida seleção múltipla ignorando a ordem', () => {
    const multi: Exercise = {
      id: 'x2',
      topic: 'anestesia',
      kind: 'multi',
      prompt: 'p',
      explanation: 'e',
      options: ['a', 'b', 'c'],
      answers: [0, 2],
    };
    expect(checkAnswer(multi, { kind: 'multi', indexes: [2, 0] })).toBe(true);
    expect(checkAnswer(multi, { kind: 'multi', indexes: [0] })).toBe(false);
    expect(checkAnswer(multi, { kind: 'multi', indexes: [0, 1, 2] })).toBe(false);
  });

  it('valida ordenação exata', () => {
    const order: Exercise = {
      id: 'x3',
      topic: 'anestesia',
      kind: 'order',
      prompt: 'p',
      explanation: 'e',
      steps: ['um', 'dois', 'três'],
    };
    expect(checkAnswer(order, { kind: 'order', steps: ['um', 'dois', 'três'] })).toBe(true);
    expect(checkAnswer(order, { kind: 'order', steps: ['dois', 'um', 'três'] })).toBe(false);
  });

  it('valida lacuna ignorando acento e caixa', () => {
    const blank: Exercise = {
      id: 'x4',
      topic: 'anestesia',
      kind: 'blank',
      prompt: 'p',
      explanation: 'e',
      sentence: 'a ___ b',
      answer: 'Remineralização',
      bank: ['Remineralização'],
    };
    expect(checkAnswer(blank, { kind: 'blank', value: 'remineralizacao' })).toBe(true);
    expect(checkAnswer(blank, { kind: 'blank', value: 'erosão' })).toBe(false);
  });

  it('só considera o pareamento correto quando não houve erro', () => {
    const match: Exercise = {
      id: 'x5',
      topic: 'anestesia',
      kind: 'match',
      prompt: 'p',
      explanation: 'e',
      pairs: [{ left: 'a', right: '1' }],
    };
    expect(checkAnswer(match, { kind: 'match', mistakes: 0 })).toBe(true);
    expect(checkAnswer(match, { kind: 'match', mistakes: 2 })).toBe(false);
  });

  it('descreve a resposta correta para o feedback', () => {
    expect(describeAnswer(choice)).toBe('b');
  });
});

describe('montagem das lições', () => {
  it('gera a mesma lição para o mesmo nó', () => {
    const first = buildLesson(unit, 0);
    const second = buildLesson(unit, 0);
    expect(first.exercises.map(e => e.id)).toEqual(second.exercises.map(e => e.id));
    expect(first.exercises.length).toBe(LESSON_SIZE);
  });

  it('usa exercícios diferentes em lições diferentes', () => {
    const first = new Set(buildLesson(unit, 0).exercises.map(e => e.id));
    const second = buildLesson(unit, 1).exercises.map(e => e.id);
    expect(second.some(id => first.has(id))).toBe(false);
  });

  it('monta a prova do box com os exercícios mais difíceis', () => {
    const review = buildUnitReview(unit);
    expect(review.kind).toBe('review');
    expect(review.exercises.length).toBe(Math.min(REVIEW_SIZE, unit.exercises.length));
  });

  it('monta a revisão de erros a partir dos ids salvos', () => {
    const ids = [unit.exercises[2].id, unit.exercises[5].id, 'inexistente'];
    const lesson = buildMistakesLesson(ALL_EXERCISES, ids);
    expect(lesson?.exercises.map(e => e.id).sort()).toEqual([ids[0], ids[1]].sort());
    expect(buildMistakesLesson(ALL_EXERCISES, ['nada'])).toBeNull();
  });

  it('usa apenas formatos rápidos no desafio relâmpago', () => {
    const blitz = buildBlitzLesson(ALL_EXERCISES, 'seed');
    expect(blitz.exercises.length).toBe(BLITZ_SIZE);
    expect(blitz.exercises.every(e => e.kind === 'choice' || e.kind === 'boolean')).toBe(true);
  });

  it('embaralha de forma determinística', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(shuffleWithSeed(items, 'a')).toEqual(shuffleWithSeed(items, 'a'));
    expect(shuffleWithSeed(items, 'a')).not.toEqual(shuffleWithSeed(items, 'b'));
    expect([...shuffleWithSeed(items, 'a')].sort()).toEqual(items);
  });
});

describe('pontuação', () => {
  it('premia lição perfeita', () => {
    const perfect = lessonXp(outcome());
    const missed = lessonXp(outcome({ correct: 4, heartsLost: 2, bestCombo: 2 }));
    expect(perfect).toBeGreaterThan(missed);
  });

  it('paga mais pela prova do box', () => {
    expect(lessonXp(outcome({ kind: 'review' }))).toBeGreaterThan(lessonXp(outcome()));
  });

  it('escalona o bônus de combo', () => {
    expect(comboBonus(0)).toBe(0);
    expect(comboBonus(3)).toBe(2);
    expect(comboBonus(6)).toBe(5);
    expect(comboBonus(12)).toBe(8);
  });
});
