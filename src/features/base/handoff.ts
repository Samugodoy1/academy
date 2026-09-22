import type { StudyKey } from '../../utils/studyTopics';

export type BaseView =
  | { kind: 'home' }
  | { kind: 'discipline'; disciplineId: string }
  | { kind: 'lesson'; disciplineId: string; lessonIndex: number }
  | { kind: 'mindmap'; disciplineId: string };

export const BASE_VIEW_KEY = 'odontohub-academy-base-view';

export function readBaseView(): BaseView {
  try {
    const raw = JSON.parse(sessionStorage.getItem(BASE_VIEW_KEY) || 'null') as BaseView | null;
    if (raw && typeof raw === 'object' && 'kind' in raw) return raw;
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
