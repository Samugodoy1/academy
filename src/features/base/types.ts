import type { StudyKey } from '../../utils/studyTopics';

/** Typical semester in which the discipline is taught (1º–4º período). */
export type BasePeriod = 1 | 2 | 3 | 4;

export interface BaseReference {
  id: string;
  authors: string;
  title: string;
  journal: string;
  year: number;
  /** Bare DOI, e.g. "10.1038/nrdp.2017.30". Rendered as https://doi.org/… */
  doi?: string;
  /** Used when the source has no DOI (PubMed ID, guideline page, etc.). */
  url?: string;
  /** Why this source matters for the lesson. One line. */
  why: string;
}

export interface BaseSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface BaseSelfCheck {
  question: string;
  answer: string;
}

export interface BaseLesson {
  id: string;
  title: string;
  /** One-sentence promise shown in lists. */
  summary: string;
  minutes: number;
  /** Ideas the student must leave with. Rendered first. */
  keyPoints: string[];
  sections: BaseSection[];
  /** Why the theory shows up in the chair. Bridges basic cycle to clinic. */
  clinicalBridge: string;
  selfCheck: BaseSelfCheck[];
  /** Reference ids from the discipline's list that back this lesson. */
  refIds: string[];
}

export interface MindMapNode {
  label: string;
  note?: string;
  children?: MindMapNode[];
}

export interface BaseDiscipline {
  id: string;
  title: string;
  /** Short label for tight spaces. */
  short: string;
  tagline: string;
  period: BasePeriod;
  lessons: BaseLesson[];
  mindMap: MindMapNode;
  references: BaseReference[];
  /** Cola material that continues this discipline in the clinic, if any. */
  colaTopic?: StudyKey;
}
