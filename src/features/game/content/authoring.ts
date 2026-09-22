import type { ExerciseSeed } from '../types';

type Difficulty = 1 | 2 | 3;

interface Extra {
  scenario?: string;
  difficulty?: Difficulty;
}

/**
 * Small authoring helpers so every item in the bank reads like a Duolingo card:
 * one idea, a short prompt, short options and a two-line explanation.
 * For `choice` the first option is always the correct one; the engine rotates
 * answer positions at play time, so the student never learns "it's always B".
 */
export const choice = (
  id: string,
  prompt: string,
  options: [string, string, ...string[]],
  explanation: string,
  extra: Extra = {}
): ExerciseSeed => ({
  id,
  kind: 'choice',
  difficulty: extra.difficulty ?? 2,
  prompt,
  scenario: extra.scenario,
  options,
  answer: 0,
  explanation,
});

export const truth = (
  id: string,
  statement: string,
  answer: boolean,
  explanation: string,
  difficulty: Difficulty = 1
): ExerciseSeed => ({
  id,
  kind: 'boolean',
  difficulty,
  prompt: 'Verdadeiro ou falso?',
  statement,
  answer,
  explanation,
});

export const gap = (
  id: string,
  sentence: string,
  answer: string,
  distractors: string[],
  explanation: string,
  difficulty: Difficulty = 2
): ExerciseSeed => ({
  id,
  kind: 'blank',
  difficulty,
  prompt: 'Complete a frase',
  sentence,
  answer,
  bank: [answer, ...distractors],
  explanation,
});

/** `correct` come first in `options`; the engine shuffles them at play time. */
export const multi = (
  id: string,
  prompt: string,
  correct: string[],
  wrong: string[],
  explanation: string,
  extra: Extra = {}
): ExerciseSeed => ({
  id,
  kind: 'multi',
  difficulty: extra.difficulty ?? 2,
  prompt,
  scenario: extra.scenario,
  options: [...correct, ...wrong],
  answers: correct.map((_, index) => index),
  explanation,
});

export const order = (
  id: string,
  prompt: string,
  steps: string[],
  explanation: string,
  extra: Extra = {}
): ExerciseSeed => ({
  id,
  kind: 'order',
  difficulty: extra.difficulty ?? 2,
  prompt,
  scenario: extra.scenario,
  steps,
  explanation,
});

export const pairs = (
  id: string,
  prompt: string,
  items: Array<[string, string]>,
  explanation: string,
  difficulty: Difficulty = 2
): ExerciseSeed => ({
  id,
  kind: 'match',
  difficulty,
  prompt,
  pairs: items.map(([left, right]) => ({ left, right })),
  explanation,
});
