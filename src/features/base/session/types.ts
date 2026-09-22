import type { BaseLesson, BaseReference } from '../types';

/** How the student proves the idea before reading — pretest effect. */
export type PretestItem =
  | {
      type: 'open';
      id: string;
      question: string;
      answer: string;
    }
  | {
      type: 'mcq';
      id: string;
      question: string;
      options: [string, string, string, string];
      correctIndex: 0 | 1 | 2 | 3;
      /** Shown after answer, with ref if any. */
      why: string;
    };

export type GestoKind =
  | { type: 'lab'; labId: LabId }
  | { type: 'mechanistic'; disciplineId: string }
  | { type: 'minicase'; caseId: string }
  | { type: 'rebuild'; disciplineId: string };

export type LabId =
  | 'stephan'
  | 'anesthetic'
  | 'eruption'
  | 'alveolar-nerve'
  | 'radiation'
  | 'biofilm-chain';

export type ReadinessLevel = 'confident' | 'review' | 'ask';

export interface SessionBlueprint {
  lessonId: string;
  pretest: PretestItem[];
  gesto: GestoKind;
  /** One line the student must hit in Explique. */
  explainPrompt: string;
  explainMustInclude: string[];
  explainModel: string;
}

export interface MiniCaseStep {
  kind: 'story' | 'choice' | 'theory' | 'outcome';
  title?: string;
  body: string;
  choices?: Array<{ id: string; label: string; correct?: boolean; feedback: string }>;
  lessonIds?: string[];
  refIds?: string[];
}

export interface MiniCase {
  id: string;
  title: string;
  tagline: string;
  period: 1 | 2 | 3 | 4;
  minutes: number;
  steps: MiniCaseStep[];
  references: BaseReference[];
}

export interface MechanisticEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Competency {
  id: string;
  title: string;
  short: string;
  /** Unlocks when all listed signals fire. */
  requires: Array<
    | { kind: 'session'; lessonId: string; readiness: ReadinessLevel }
    | { kind: 'lab'; labId: LabId }
    | { kind: 'case'; caseId: string }
    | { kind: 'review'; lessonId: string; streak: number }
  >;
}

export type SessionStepId = 'chute' | 'correcao' | 'gesto' | 'fixar' | 'explique' | 'fechar';

export interface SessionClosePayload {
  readiness: ReadinessLevel;
  note?: string;
}

/** Built runtime bundle for SessionFlow. */
export interface SessionRuntime {
  disciplineId: string;
  disciplineTitle: string;
  lesson: BaseLesson;
  lessonIndex: number;
  blueprint: SessionBlueprint;
  references: BaseReference[];
}
