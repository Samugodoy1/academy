import { describe, expect, it } from 'vitest';
import {
  BLITZ_SIZE,
  LESSON_SIZE,
  REVIEW_SIZE,
  buildBlitzLesson,
  buildLesson,
  buildMistakesLesson,
  buildPersonalizedLesson,
  buildUnitReview,
  checkAnswer,
  comboBonus,
  countLessons,
  describeAnswer,
  lessonXp,
  shuffleWithSeed,
} from './engine';
import { ALL_EXERCISES, GAME_UNITS } from './content';
import type { Exercise, ExerciseMemory, GameUnit, LessonOutcome } from './types';

const unit = GAME_UNITS[0];
const references = [{ label: 'Referência', url: 'https://example.com/reference' }];

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

  it('tem um banco autoral amplo, com todos os formatos em cada tema', () => {
    expect(ALL_EXERCISES.length).toBeGreaterThanOrEqual(21 * 24);
    for (const gameUnit of GAME_UNITS) {
      expect(gameUnit.exercises.length).toBeGreaterThanOrEqual(24);
      expect(gameUnit.lessons).toBeGreaterThanOrEqual(4);
      const kinds = new Set(gameUnit.exercises.map(exercise => exercise.kind));
      expect(kinds).toEqual(new Set(['choice', 'multi', 'boolean', 'order', 'match', 'blank']));
    }
  });

  it('não repete ids de exercício', () => {
    const ids = ALL_EXERCISES.map(exercise => exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('escreve como um card do Duolingo: enunciado curto e alternativas curtas', () => {
    for (const exercise of ALL_EXERCISES) {
      expect(exercise.prompt.length).toBeLessThanOrEqual(120);
      if (exercise.kind === 'choice' || exercise.kind === 'multi') {
        for (const option of exercise.options) {
          expect(option.length).toBeLessThanOrEqual(90);
        }
        expect(new Set(exercise.options).size).toBe(exercise.options.length);
      }
    }
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
      expect(exercise.references.length).toBeGreaterThan(0);
      expect(exercise.references.every(reference => reference.url.startsWith('https://'))).toBe(true);
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
    references,
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
      references,
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
      references,
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
      references,
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
      references,
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
    const first = buildLesson(unit, 0, 'fixed-seed');
    const second = buildLesson(unit, 0, 'fixed-seed');
    expect(first.exercises.map(e => e.id)).toEqual(second.exercises.map(e => e.id));
    expect(first.exercises.length).toBe(LESSON_SIZE);
  });

  it('varia os formatos dentro de cada lição', () => {
    for (const gameUnit of GAME_UNITS) {
      const lesson = buildLesson(gameUnit, 0, `formats:${gameUnit.topic}`);
      const counts = lesson.exercises.reduce<Record<string, number>>((totals, exercise) => {
        totals[exercise.kind] = (totals[exercise.kind] ?? 0) + 1;
        return totals;
      }, {});
      expect(Object.keys(counts).length).toBeGreaterThanOrEqual(3);
      expect(Math.max(...Object.values(counts))).toBeLessThanOrEqual(2);
    }
  });

  it('abre a lição com um formato rápido', () => {
    for (const gameUnit of GAME_UNITS) {
      const lesson = buildLesson(gameUnit, 0, `opener:${gameUnit.topic}`);
      expect(['choice', 'boolean', 'blank']).toContain(lesson.exercises[0].kind);
    }
  });

  it('começa pelas questões fáceis e guarda as difíceis para a prova', () => {
    const first = buildLesson(unit, 0, 'easy');
    const review = buildUnitReview(unit, 0, 'hard');
    const average = (exercises: Exercise[]) =>
      exercises.reduce((sum, exercise) => sum + (exercise.difficulty ?? 2), 0) / exercises.length;
    expect(average(first.exercises)).toBeLessThan(average(review.exercises));
  });

  it('prioriza questões ainda não vistas na lição seguinte', () => {
    const first = buildLesson(unit, 0, 'first');
    const memory = Object.fromEntries(
      first.exercises.map(exercise => [
        exercise.id,
        { attempts: 1, correct: 1, streak: 1, lastSeenAt: 100, dueAt: 9999999999999 },
      ])
    ) satisfies Record<string, ExerciseMemory>;
    const second = buildLesson(unit, 1, { seed: 'second', memory, now: 200 });
    const firstIds = new Set(first.exercises.map(exercise => exercise.id));
    expect(second.exercises.filter(exercise => firstIds.has(exercise.id))).toHaveLength(0);
  });

  it('não repete a mesma questão em lições consecutivas de nenhum tema', () => {
    for (const gameUnit of GAME_UNITS) {
      const memory: Record<string, ExerciseMemory> = {};
      let previousIds = new Set<string>();

      for (let round = 0; round < 3; round += 1) {
        const lesson = buildLesson(gameUnit, round, {
          seed: `${gameUnit.topic}:${round}`,
          memory,
          now: round * 1000,
        });
        const ids = new Set(lesson.exercises.map(exercise => exercise.id));
        expect(ids.size).toBe(LESSON_SIZE);
        if (round > 0) {
          expect([...ids].filter(id => previousIds.has(id))).toHaveLength(0);
        }
        for (const exercise of lesson.exercises) {
          const previous = memory[exercise.id];
          memory[exercise.id] = {
            attempts: (previous?.attempts ?? 0) + 1,
            correct: (previous?.correct ?? 0) + 1,
            streak: (previous?.streak ?? 0) + 1,
            lastSeenAt: (round + 1) * 1000,
            dueAt: 9999999999999,
          };
        }
        previousIds = ids;
      }
    }
  });

  it('traz de volta primeiro o que está vencido e o que o aluno mais erra', () => {
    const now = 1_000_000;
    const memory: Record<string, ExerciseMemory> = {};
    unit.exercises.forEach((exercise, index) => {
      memory[exercise.id] = {
        attempts: 4,
        correct: index === 0 ? 1 : 4,
        streak: index === 0 ? 0 : 4,
        lastSeenAt: now - 10,
        dueAt: index < 3 ? now - 1 : now + 100_000,
      };
    });
    const practice = buildPersonalizedLesson(unit.exercises, { seed: 'due', memory, now });
    const ids = practice.exercises.map(exercise => exercise.id);
    expect(ids).toContain(unit.exercises[0].id);
    expect(ids).toContain(unit.exercises[1].id);
    expect(ids).toContain(unit.exercises[2].id);
  });

  it('monta a prova do box com os exercícios mais difíceis', () => {
    const review = buildUnitReview(unit, 0, 'review-seed');
    expect(review.kind).toBe('review');
    expect(review.exercises.length).toBe(REVIEW_SIZE);
    expect(new Set(review.exercises.map(exercise => exercise.id)).size).toBe(REVIEW_SIZE);
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

  it('muda a posição da resposta quando a mesma questão reaparece', () => {
    const rotatingChoice: Exercise = {
      id: 'rotation-choice',
      topic: 'anestesia',
      kind: 'choice',
      prompt: 'Qual opção está correta?',
      explanation: 'Uma explicação suficientemente detalhada para o teste.',
      references,
      options: ['A', 'B', 'C', 'D'],
      answer: 1,
    };
    const rotatingUnit: GameUnit = {
      topic: 'anestesia',
      title: 'Teste',
      tagline: 'Teste',
      lessons: 1,
      exercises: [
        {
          ...rotatingChoice,
        },
      ],
    };
    const first = buildLesson(rotatingUnit, 0, {
      seed: 'rotation',
      memory: {},
    }).exercises[0];
    const second = buildLesson(rotatingUnit, 0, {
      seed: 'rotation',
      memory: {
        [rotatingChoice.id]: { attempts: 1, correct: 1, streak: 1, lastSeenAt: 1, dueAt: 2 },
      },
    }).exercises[0];
    expect(first.kind).toBe('choice');
    expect(second.kind).toBe('choice');
    if (first.kind === 'choice' && second.kind === 'choice') {
      expect(first.answer).not.toBe(second.answer);
      expect(first.options[first.answer]).toBe(second.options[second.answer]);
    }
  });

  it('gera prática personalizada contínua sem repetir questões na rodada', () => {
    const practice = buildPersonalizedLesson(ALL_EXERCISES, 'practice-seed');
    expect(practice.kind).toBe('practice');
    expect(practice.exercises).toHaveLength(REVIEW_SIZE);
    expect(new Set(practice.exercises.map(exercise => exercise.id)).size).toBe(REVIEW_SIZE);
    const kindCounts = practice.exercises.reduce<Record<string, number>>((counts, exercise) => {
      counts[exercise.kind] = (counts[exercise.kind] ?? 0) + 1;
      return counts;
    }, {});
    expect(Object.keys(kindCounts).length).toBeGreaterThanOrEqual(3);
    expect(Math.max(...Object.values(kindCounts))).toBeLessThanOrEqual(3);
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
