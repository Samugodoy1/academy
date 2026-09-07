import type {
  Answer,
  Exercise,
  GameUnit,
  LessonKind,
  LessonOutcome,
  LessonPlan,
} from './types';

export const LESSON_SIZE = 6;
export const REVIEW_SIZE = 8;
export const BLITZ_SIZE = 20;
export const BLITZ_SECONDS = 60;

// ── Deterministic randomness ──────────────────────────────────────────
// Lessons must look shuffled but stay identical if the student closes and
// reopens the same node, so every shuffle is seeded by the lesson id.

export function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createRandom(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: T[], random: () => number): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function shuffleWithSeed<T>(items: T[], seed: string): T[] {
  return shuffle(items, createRandom(hashSeed(seed)));
}

// ── Answer checking ───────────────────────────────────────────────────

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const sameSet = (a: number[], b: number[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((value, index) => value === sortedB[index]);
};

export function checkAnswer(exercise: Exercise, answer: Answer): boolean {
  switch (exercise.kind) {
    case 'choice':
      return answer.kind === 'choice' && answer.index === exercise.answer;
    case 'multi':
      return answer.kind === 'multi' && sameSet(answer.indexes, exercise.answers);
    case 'boolean':
      return answer.kind === 'boolean' && answer.value === exercise.answer;
    case 'order':
      return (
        answer.kind === 'order' &&
        answer.steps.length === exercise.steps.length &&
        answer.steps.every((step, index) => normalize(step) === normalize(exercise.steps[index]))
      );
    case 'match':
      return answer.kind === 'match' && answer.mistakes === 0;
    case 'blank':
      return answer.kind === 'blank' && normalize(answer.value) === normalize(exercise.answer);
    default:
      return false;
  }
}

/** The part of an exercise a character can read out loud, when there is one. */
export function exerciseSpeech(exercise: Exercise): string | null {
  if (exercise.kind === 'boolean') return exercise.statement;
  if (exercise.kind === 'choice' || exercise.kind === 'multi' || exercise.kind === 'order') {
    return exercise.scenario ?? null;
  }
  return null;
}

/** Human readable correct answer, used by the feedback sheet when the student misses. */
export function describeAnswer(exercise: Exercise): string {
  switch (exercise.kind) {
    case 'choice':
      return exercise.options[exercise.answer];
    case 'multi':
      return exercise.answers.map(index => exercise.options[index]).join(' · ');
    case 'boolean':
      return exercise.answer ? 'Verdadeiro' : 'Falso';
    case 'order':
      return exercise.steps.join(' → ');
    case 'match':
      return exercise.pairs.map(pair => `${pair.left} → ${pair.right}`).join(' · ');
    case 'blank':
      return exercise.answer;
    default:
      return '';
  }
}

// ── Lesson building ───────────────────────────────────────────────────

export function countLessons(exerciseCount: number): number {
  return Math.max(1, Math.ceil(exerciseCount / LESSON_SIZE));
}

/** Total nodes of a unit on the trail: every lesson plus the closing review. */
export function unitNodeCount(unit: GameUnit): number {
  return unit.lessons + 1;
}

function planId(kind: LessonKind, topic: string | null, index: number) {
  return `${kind}:${topic ?? 'geral'}:${index}`;
}

export function buildLesson(unit: GameUnit, index: number): LessonPlan {
  const start = index * LESSON_SIZE;
  const slice = unit.exercises.slice(start, start + LESSON_SIZE);
  const exercises = slice.length > 0 ? slice : unit.exercises.slice(0, LESSON_SIZE);
  const id = planId('lesson', unit.topic, index);
  return {
    id,
    topic: unit.topic,
    kind: 'lesson',
    index,
    title: `${unit.title} · Lição ${index + 1}`,
    exercises: shuffleWithSeed(exercises, id),
  };
}

export function buildUnitReview(unit: GameUnit, round = 0): LessonPlan {
  const id = planId('review', unit.topic, round);
  const pool = shuffleWithSeed(unit.exercises, id);
  const hardFirst = [...pool].sort((a, b) => (b.difficulty ?? 2) - (a.difficulty ?? 2));
  return {
    id,
    topic: unit.topic,
    kind: 'review',
    index: unit.lessons,
    title: `${unit.title} · Prova do box`,
    exercises: shuffleWithSeed(hardFirst.slice(0, REVIEW_SIZE), `${id}:final`),
  };
}

export function buildMistakesLesson(pool: Exercise[], ids: string[], seed = 'mistakes'): LessonPlan | null {
  const byId = new Map(pool.map(exercise => [exercise.id, exercise]));
  const exercises = ids
    .map(id => byId.get(id))
    .filter((exercise): exercise is Exercise => Boolean(exercise))
    .slice(0, REVIEW_SIZE);
  if (exercises.length === 0) return null;
  return {
    id: planId('mistakes', null, 0),
    topic: null,
    kind: 'mistakes',
    index: 0,
    title: 'Revisão dos erros',
    exercises: shuffleWithSeed(exercises, seed),
  };
}

export function buildBlitzLesson(pool: Exercise[], seed: string): LessonPlan {
  // Rapid fire only uses formats that can be answered with a single tap.
  const quick = pool.filter(exercise => exercise.kind === 'choice' || exercise.kind === 'boolean');
  return {
    id: planId('blitz', null, 0),
    topic: null,
    kind: 'blitz',
    index: 0,
    title: 'Desafio relâmpago',
    exercises: shuffleWithSeed(quick.length > 0 ? quick : pool, seed).slice(0, BLITZ_SIZE),
  };
}

// ── Scoring ───────────────────────────────────────────────────────────

const KIND_BASE: Record<LessonKind, number> = {
  lesson: 10,
  review: 20,
  mistakes: 8,
  blitz: 12,
};

export function comboBonus(bestCombo: number): number {
  if (bestCombo >= 10) return 8;
  if (bestCombo >= 6) return 5;
  if (bestCombo >= 3) return 2;
  return 0;
}

export function lessonXp(outcome: LessonOutcome): number {
  const perfect = outcome.heartsLost === 0 && outcome.correct === outcome.total;
  const base = KIND_BASE[outcome.kind] ?? 10;
  const accuracy = outcome.total > 0 ? outcome.correct / outcome.total : 0;
  return (
    base +
    Math.round(accuracy * outcome.total * 2) +
    comboBonus(outcome.bestCombo) +
    (perfect ? 5 : 0)
  );
}

/** Gems are the slow currency: enough to buy a freeze every few days. */
export function lessonGems(outcome: LessonOutcome): number {
  const perfect = outcome.heartsLost === 0 && outcome.correct === outcome.total;
  const base = outcome.kind === 'review' ? 8 : 3;
  return base + (perfect ? 3 : 0);
}

// ── Levels ────────────────────────────────────────────────────────────

const LEVEL_TITLES = [
  'Calouro',
  'Pré-clínica',
  'Primeiro box',
  'Clínica geral',
  'Plantonista',
  'Interno',
  'Chefe de box',
  'Residente',
  'Especialista',
  'Referência da turma',
];

export interface LevelInfo {
  level: number;
  title: string;
  /** XP already earned inside the current level. */
  into: number;
  /** XP the current level costs in total. */
  size: number;
}

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(Math.max(1, level) - 1, LEVEL_TITLES.length - 1)];
}

/** Each level costs 50 XP more than the one before, starting at 100. */
const levelSize = (level: number) => 100 + (level - 1) * 50;

export function levelOf(xp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, xp);
  while (remaining >= levelSize(level)) {
    remaining -= levelSize(level);
    level += 1;
  }
  return { level, title: levelTitle(level), into: remaining, size: levelSize(level) };
}
