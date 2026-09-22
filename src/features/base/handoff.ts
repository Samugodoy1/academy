import type { StudyKey } from '../../utils/studyTopics';
import type { LabId } from './session/types';

export type BaseView =
  | { kind: 'home' }
  | { kind: 'discipline'; disciplineId: string }
  | { kind: 'session'; disciplineId: string; lessonIndex: number }
  | { kind: 'reference'; disciplineId: string; lessonIndex: number }
  | { kind: 'mindmap'; disciplineId: string }
  | { kind: 'review' }
  | { kind: 'mix' }
  | { kind: 'case'; caseId: string }
  | { kind: 'lab'; labId: LabId };

export const BASE_VIEW_KEY = 'odontohub-academy-base-view';

function normalizeView(raw: BaseView | { kind: string }): BaseView {
  if (raw.kind === 'lesson') {
    const legacy = raw as { kind: 'lesson'; disciplineId: string; lessonIndex: number };
    return { kind: 'session', disciplineId: legacy.disciplineId, lessonIndex: legacy.lessonIndex };
  }
  return raw as BaseView;
}

export function readBaseView(): BaseView {
  try {
    const raw = JSON.parse(sessionStorage.getItem(BASE_VIEW_KEY) || 'null') as BaseView | null;
    if (raw && typeof raw === 'object' && 'kind' in raw) return normalizeView(raw);
  } catch {
    /* fall through to home */
  }
  return { kind: 'home' };
}

export function persistBaseView(view: BaseView) {
  try {
    sessionStorage.setItem(BASE_VIEW_KEY, JSON.stringify(view));
  } catch {
    /* storage indisponível: volta para a capa ao trocar de aba */
  }
}

/** Point the Estudos tab at a discipline before switching to it (dashboard, onboarding). */
export function handOffToBase(view: BaseView = { kind: 'home' }) {
  persistBaseView(view);
}

/** Same keys AcademyEstudos reads on mount; kept here so the Cola chunk stays lazy. */
const STUDY_TOPIC_STORAGE_KEY = 'academy_study_topic';
const STUDY_MODE_STORAGE_KEY = 'academy_study_mode';

/** Hand a Cola topic to the Cola tab so it opens already on that material. */
export function handOffToCola(topic: StudyKey | null) {
  try {
    if (topic) sessionStorage.setItem(STUDY_TOPIC_STORAGE_KEY, topic);
    localStorage.setItem(STUDY_MODE_STORAGE_KEY, 'estudar');
  } catch {
    /* storage indisponível: a Cola abre na capa */
  }
}
