import type { Exercise } from '../types';

const conceptOf = (exercise: Exercise) => exercise.conceptId ?? exercise.id;

const common = (exercise: Exercise, id: string, prompt: string) => ({
  id,
  conceptId: conceptOf(exercise),
  topic: exercise.topic,
  prompt,
  explanation: exercise.explanation,
  references: exercise.references,
  difficulty: exercise.difficulty,
});

/**
 * Converts each clinically reviewed item into a family of safe active-recall
 * variations. Every variation is derived only from authored correct answers
 * and distractors, so the bank grows without inventing new clinical claims.
 */
export function expandExerciseVariants(exercise: Exercise): Exercise[] {
  const source = { ...exercise, conceptId: conceptOf(exercise) };

  if (exercise.kind === 'choice') {
    const prompt = exercise.scenario
      ? `${exercise.scenario} ${exercise.prompt}`
      : exercise.prompt;
    return [
      source,
      {
        ...common(
          exercise,
          `${exercise.id}::blank`,
          'Complete com a resposta correta para o caso'
        ),
        kind: 'blank',
        sentence: `${prompt} ___`,
        answer: exercise.options[exercise.answer],
        bank: exercise.options,
      },
      ...exercise.options.map((option, index) => ({
        ...common(exercise, `${exercise.id}::option:${index}`, prompt),
        kind: 'boolean' as const,
        statement: `A resposta proposta é: “${option}”`,
        answer: index === exercise.answer,
      })),
    ];
  }

  if (exercise.kind === 'multi') {
    const prompt = exercise.scenario
      ? `${exercise.scenario} ${exercise.prompt}`
      : exercise.prompt;
    return [
      source,
      ...exercise.options.map((option, index) => ({
        ...common(exercise, `${exercise.id}::item:${index}`, prompt),
        kind: 'boolean' as const,
        statement: `A opção “${option}” deve ser selecionada.`,
        answer: exercise.answers.includes(index),
      })),
    ];
  }

  if (exercise.kind === 'blank') {
    const options = exercise.bank.includes(exercise.answer)
      ? exercise.bank
      : [...exercise.bank, exercise.answer];
    return [
      source,
      ...options.map((option, index) => ({
        ...common(exercise, `${exercise.id}::blank:${index}`, 'A frase foi completada corretamente?'),
        kind: 'boolean' as const,
        statement: exercise.sentence.replace('___', option),
        answer: option === exercise.answer,
      })),
    ];
  }

  if (exercise.kind === 'order') {
    const ordinalPairs = exercise.steps.map((step, index) => ({
      left: `${index + 1}ª etapa`,
      right: step,
    }));
    return [
      source,
      {
        ...common(
          exercise,
          `${exercise.id}::sequence`,
          `Relacione cada posição à etapa correta: ${exercise.prompt}`
        ),
        kind: 'match' as const,
        pairs: ordinalPairs,
      },
      {
        ...common(exercise, `${exercise.id}::first`, `Qual é a primeira etapa? ${exercise.prompt}`),
        kind: 'choice' as const,
        scenario: exercise.scenario,
        options: exercise.steps,
        answer: 0,
      },
      {
        ...common(exercise, `${exercise.id}::last`, `Qual é a última etapa? ${exercise.prompt}`),
        kind: 'choice' as const,
        scenario: exercise.scenario,
        options: exercise.steps,
        answer: exercise.steps.length - 1,
      },
    ];
  }

  if (exercise.kind === 'match') {
    const rights = exercise.pairs.map(pair => pair.right);
    return [
      source,
      ...exercise.pairs.map((pair, index) => ({
        ...common(
          exercise,
          `${exercise.id}::blank:${index}`,
          'Complete a correspondência'
        ),
        kind: 'blank' as const,
        sentence: `${pair.left} corresponde a ___`,
        answer: pair.right,
        bank: rights,
      })),
      ...exercise.pairs.map((pair, index) => ({
        ...common(
          exercise,
          `${exercise.id}::pair:${index}`,
          `${exercise.prompt}: o que corresponde a “${pair.left}”?`
        ),
        kind: 'choice' as const,
        options: rights,
        answer: index,
      })),
    ];
  }

  return [
    source,
    {
      ...common(exercise, `${exercise.id}::choice`, exercise.prompt),
      kind: 'choice',
      options: ['Verdadeiro', 'Falso'],
      answer: exercise.answer ? 0 : 1,
    },
  ];
}
