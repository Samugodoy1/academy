import type {
  Answer,
  Exercise,
  ExerciseMemory,
  GameUnit,
  LessonKind,
  LessonOutcome,
  LessonPlan,
} from './types';

export const LESSON_SIZE = 6;
export const REVIEW_SIZE = 8;
export const BLITZ_SIZE = 20;
export const BLITZ_SECONDS = 60;

// ── Seeded randomness ─────────────────────────────────────────────────
// Seeds make a generated session reproducible for tests while production uses
// a fresh seed. Long-term repetition is controlled by the learner memory.

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
  if (exercise.kind === 'boolean') return `${exercise.prompt} ${exercise.statement}`;
  if (exercise.kind === 'blank') return `${exercise.prompt}: ${exercise.sentence}`;
  if (exercise.kind === 'choice' || exercise.kind === 'multi' || exercise.kind === 'order') {
    return exercise.scenario ? `${exercise.scenario} ${exercise.prompt}` : exercise.prompt;
  }
  if (exercise.kind === 'match') return exercise.prompt;
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

export interface LessonBuildOptions {
  seed?: string;
  memory?: Record<string, ExerciseMemory>;
  now?: number;
}

const lessonOptions = (
  value: string | LessonBuildOptions | undefined,
  fallbackSeed: string
): Required<LessonBuildOptions> => {
  const options = typeof value === 'string' ? { seed: value } : value ?? {};
  return {
    seed: options.seed ?? fallbackSeed,
    memory: options.memory ?? {},
    now: options.now ?? Date.now(),
  };
};

function randomizeExercise(
  exercise: Exercise,
  random: () => number,
  appearance = 0
): Exercise {
  if (exercise.kind === 'choice') {
    const entries = exercise.options.map((option, index) => ({ option, index }));
    const correct = entries[exercise.answer];
    const distractors = shuffle(
      entries.filter(entry => entry.index !== exercise.answer),
      random
    );
    const answer = (hashSeed(exercise.id) + appearance) % entries.length;
    const shuffled = [...distractors];
    shuffled.splice(answer, 0, correct);
    return {
      ...exercise,
      options: shuffled.map(entry => entry.option),
      answer,
    };
  }
  if (exercise.kind === 'multi') {
    const entries = exercise.options.map((option, index) => ({ option, index }));
    const shuffled = shuffle(entries, random);
    const indexMap = new Map(shuffled.map((entry, nextIndex) => [entry.index, nextIndex]));
    return {
      ...exercise,
      options: shuffled.map(entry => entry.option),
      answers: exercise.answers.map(index => indexMap.get(index) ?? index),
    };
  }
  if (exercise.kind === 'blank') {
    return { ...exercise, bank: shuffle(exercise.bank, random) };
  }
  return exercise;
}

const conceptIdOf = (exercise: Exercise) => exercise.conceptId ?? exercise.id;
const EXERCISE_KIND_CYCLE: Exercise['kind'][] = [
  'choice',
  'multi',
  'boolean',
  'order',
  'match',
  'blank',
];

function selectLessonExercises(
  pool: Exercise[],
  index: number,
  size: number,
  options: Required<LessonBuildOptions>
): Exercise[] {
  const random = createRandom(hashSeed(options.seed));
  const groups = new Map<string, Exercise[]>();
  for (const exercise of pool) {
    const conceptId = conceptIdOf(exercise);
    groups.set(conceptId, [...(groups.get(conceptId) ?? []), exercise]);
  }

  const targetDifficulty = index < 2 ? 1 : index < 5 ? 2 : 3;
  const ranked = [...groups.entries()]
    .map(([conceptId, variants]) => {
      const memories = variants
        .map(variant => options.memory[variant.id])
        .filter((memory): memory is ExerciseMemory => Boolean(memory));
      const attempts = memories.reduce((sum, memory) => sum + memory.attempts, 0);
      const correct = memories.reduce((sum, memory) => sum + memory.correct, 0);
      const overdue = memories.filter(memory => memory.dueAt <= options.now).length;
      const difficulty = variants[0]?.difficulty ?? 2;
      return {
        conceptId,
        variants,
        attempts,
        weakness: attempts === 0 ? 1 : 1 - correct / attempts,
        overdue,
        difficultyDistance: Math.abs(difficulty - targetDifficulty),
        tie: random(),
      };
    })
    .sort(
      (a, b) =>
        a.attempts - b.attempts ||
        b.overdue - a.overdue ||
        b.weakness - a.weakness ||
        a.difficultyDistance - b.difficultyDistance ||
        a.tie - b.tie
    );

  const targetKinds = Array.from(
    { length: Math.min(size, groups.size) },
    (_, offset) =>
      EXERCISE_KIND_CYCLE[(hashSeed(options.seed) + offset) % EXERCISE_KIND_CYCLE.length]
  );
  const remaining = [...ranked];
  const balanced = targetKinds.map(kind => {
    const matchingIndex = remaining.findIndex(group =>
      group.variants.some(variant => variant.kind === kind)
    );
    const [group] = remaining.splice(matchingIndex >= 0 ? matchingIndex : 0, 1);
    return { group, kind };
  });

  const selected = balanced.map(({ group, kind }) => {
    const candidates = group.variants.some(variant => variant.kind === kind)
      ? group.variants.filter(variant => variant.kind === kind)
      : group.variants;
    const variant = [...candidates]
      .map(exercise => ({
        exercise,
        memory: options.memory[exercise.id],
        tie: random(),
      }))
      .sort(
        (a, b) =>
          (a.memory?.attempts ?? 0) - (b.memory?.attempts ?? 0) ||
          (a.memory?.lastSeenAt ?? 0) - (b.memory?.lastSeenAt ?? 0) ||
          a.tie - b.tie
      )[0].exercise;
    return randomizeExercise(
      variant,
      createRandom(hashSeed(`${options.seed}:${variant.id}`)),
      options.memory[variant.id]?.attempts ?? 0
    );
  });

  return shuffle(selected, random);
}


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

export function buildLesson(
  unit: GameUnit,
  index: number,
  buildOptions?: string | LessonBuildOptions
): LessonPlan {
  const options = lessonOptions(
    buildOptions,
    `${unit.topic}:${index}:${Date.now()}:${Math.random()}`
  );
  const id = planId('lesson', unit.topic, index);
  return {
    id,
    topic: unit.topic,
    kind: 'lesson',
    index,
    title: `${unit.title} · Lição ${index + 1}`,
    exercises: selectLessonExercises(unit.exercises, index, LESSON_SIZE, options),
  };
}

export function buildUnitReview(
  unit: GameUnit,
  round = 0,
  buildOptions?: string | LessonBuildOptions
): LessonPlan {
  const options = lessonOptions(
    buildOptions,
    `${unit.topic}:review:${round}:${Date.now()}:${Math.random()}`
  );
  const id = planId('review', unit.topic, round);
  return {
    id,
    topic: unit.topic,
    kind: 'review',
    index: unit.lessons,
    title: `${unit.title} · Prova do box`,
    exercises: selectLessonExercises(unit.exercises, 99, REVIEW_SIZE, options),
  };
}

export function buildPersonalizedLesson(
  pool: Exercise[],
  buildOptions?: string | LessonBuildOptions
): LessonPlan {
  const options = lessonOptions(
    buildOptions,
    `practice:${Date.now()}:${Math.random()}`
  );
  return {
    id: planId('practice', null, options.now),
    topic: null,
    kind: 'practice',
    index: 0,
    title: 'Prática personalizada',
    exercises: selectLessonExercises(pool, 99, REVIEW_SIZE, options),
  };
}

export function buildMistakesLesson(
  pool: Exercise[],
  ids: string[],
  buildOptions: string | LessonBuildOptions = 'mistakes'
): LessonPlan | null {
  const options = lessonOptions(buildOptions, `mistakes:${Date.now()}`);
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
    exercises: shuffleWithSeed(exercises, options.seed).map(exercise =>
      randomizeExercise(
        exercise,
        createRandom(hashSeed(`${options.seed}:${exercise.id}`)),
        options.memory[exercise.id]?.attempts ?? 0
      )
    ),
  };
}

export function buildBlitzLesson(
  pool: Exercise[],
  buildOptions: string | LessonBuildOptions
): LessonPlan {
  const options = lessonOptions(buildOptions, `blitz:${Date.now()}`);
  // Rapid fire only uses formats that can be answered with a single tap.
  const quick = pool.filter(exercise => exercise.kind === 'choice' || exercise.kind === 'boolean');
  const selected = shuffleWithSeed(quick.length > 0 ? quick : pool, options.seed)
    .slice(0, BLITZ_SIZE)
    .map(exercise =>
      randomizeExercise(
        exercise,
        createRandom(hashSeed(`${options.seed}:${exercise.id}`)),
        options.memory[exercise.id]?.attempts ?? 0
      )
    );
  return {
    id: planId('blitz', null, 0),
    topic: null,
    kind: 'blitz',
    index: 0,
    title: 'Desafio relâmpago',
    exercises: selected,
  };
}

// ── Scoring ───────────────────────────────────────────────────────────

const KIND_BASE: Record<LessonKind, number> = {
  lesson: 10,
  review: 20,
  practice: 12,
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
