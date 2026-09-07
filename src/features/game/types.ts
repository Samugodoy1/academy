import type { StudyKey } from '../../utils/studyTopics';

export type ExerciseKind = 'choice' | 'multi' | 'boolean' | 'order' | 'match' | 'blank';

interface ExerciseCommon {
  id: string;
  topic: StudyKey;
  /** Short instruction shown above the exercise, Duolingo style. */
  prompt: string;
  /** Shown in the feedback sheet, right after answering. */
  explanation: string;
  /** 1 = aquecimento, 2 = clínica do dia a dia, 3 = pega do professor. */
  difficulty?: 1 | 2 | 3;
}

export interface ChoiceExercise extends ExerciseCommon {
  kind: 'choice';
  /** The clinical situation. Rendered as the "speech" of the exercise. */
  scenario?: string;
  options: string[];
  answer: number;
}

export interface MultiExercise extends ExerciseCommon {
  kind: 'multi';
  scenario?: string;
  options: string[];
  answers: number[];
}

export interface BooleanExercise extends ExerciseCommon {
  kind: 'boolean';
  statement: string;
  answer: boolean;
}

export interface OrderExercise extends ExerciseCommon {
  kind: 'order';
  scenario?: string;
  /** Already in the correct sequence; the UI shuffles them. */
  steps: string[];
}

export interface MatchExercise extends ExerciseCommon {
  kind: 'match';
  pairs: Array<{ left: string; right: string }>;
}

export interface BlankExercise extends ExerciseCommon {
  kind: 'blank';
  /** Sentence containing "___" where the answer goes. */
  sentence: string;
  answer: string;
  /** Word bank tiles (the answer is added automatically if missing). */
  bank: string[];
}

export type Exercise =
  | ChoiceExercise
  | MultiExercise
  | BooleanExercise
  | OrderExercise
  | MatchExercise
  | BlankExercise;

/** Exercise as written in the content files, before the topic is stamped on it. */
export type ExerciseSeed =
  | Omit<ChoiceExercise, 'topic'>
  | Omit<MultiExercise, 'topic'>
  | Omit<BooleanExercise, 'topic'>
  | Omit<OrderExercise, 'topic'>
  | Omit<MatchExercise, 'topic'>
  | Omit<BlankExercise, 'topic'>;

export type Answer =
  | { kind: 'choice'; index: number }
  | { kind: 'multi'; indexes: number[] }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'order'; steps: string[] }
  | { kind: 'match'; mistakes: number }
  | { kind: 'blank'; value: string };

export type LessonKind = 'lesson' | 'review' | 'mistakes' | 'blitz';

export interface LessonPlan {
  id: string;
  topic: StudyKey | null;
  kind: LessonKind;
  /** Index of the node inside the unit (review node uses the last index). */
  index: number;
  title: string;
  exercises: Exercise[];
}

export interface GameUnit {
  topic: StudyKey;
  title: string;
  /** One-line promise of what the student walks out knowing. */
  tagline: string;
  lessons: number;
  exercises: Exercise[];
}

export interface UnitState {
  /** Number of lessons completed in order (also the index of the next node). */
  lessons: number;
  /** 0-3, earned by clearing the unit review. */
  crowns: number;
}

export interface GameState {
  version: 1;
  xp: number;
  hearts: number;
  /** Epoch ms of the last heart regeneration checkpoint. */
  heartsAt: number;
  streak: number;
  /** YYYY-MM-DD of the last day a lesson was completed. */
  lastDay: string | null;
  dayKey: string | null;
  dayXp: number;
  dailyGoal: number;
  units: Record<string, UnitState>;
  /** Exercise ids missed recently, oldest first. */
  mistakes: string[];
  sound: boolean;
  totalCorrect: number;
  totalAnswered: number;
  lessonsDone: number;
  perfectLessons: number;
  bestCombo: number;
}

export interface LessonOutcome {
  topic: StudyKey | null;
  kind: LessonKind;
  index: number;
  correct: number;
  total: number;
  heartsLost: number;
  bestCombo: number;
  /** Exercise ids answered wrong at least once. */
  missed: string[];
  /** Exercise ids answered right on the first try. */
  mastered: string[];
  elapsedMs: number;
}

export interface LessonReward {
  xp: number;
  perfect: boolean;
  comboBonus: number;
  crownEarned: boolean;
  streak: number;
  streakIncreased: boolean;
  goalReached: boolean;
  heartRecovered: boolean;
}
