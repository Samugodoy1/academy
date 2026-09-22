import type { GamePlan } from '../game/plan';
import type { BaseDiscipline } from './types';

/**
 * What the Academy plan changes in the basic-cycle library. Free gets a real
 * taste of every discipline — the opening summary and one full mind map — so
 * the quality is never a promise. Student opens the rest of the shelf.
 */
export type BasePlan = GamePlan;

export const FREE_LESSONS_PER_DISCIPLINE = 1;

/** Index (in catalogue order) of the discipline whose mind map is open on Free. */
export const FREE_MIND_MAP_INDEX = 0;

export function isLessonUnlocked(plan: BasePlan, lessonIndex: number): boolean {
  if (plan === 'student') return true;
  return lessonIndex < FREE_LESSONS_PER_DISCIPLINE;
}

export function isMindMapUnlocked(plan: BasePlan, disciplineIndex: number): boolean {
  if (plan === 'student') return true;
  return disciplineIndex === FREE_MIND_MAP_INDEX;
}

export function countUnlockedLessons(plan: BasePlan, disciplines: BaseDiscipline[]): number {
  return disciplines.reduce((total, discipline) => {
    return total + discipline.lessons.filter((_, index) => isLessonUnlocked(plan, index)).length;
  }, 0);
}

export function countLessons(disciplines: BaseDiscipline[]): number {
  return disciplines.reduce((total, discipline) => total + discipline.lessons.length, 0);
}

export type BaseBlock = 'lesson' | 'mindMap';

export const BASE_BLOCK_COPY: Record<BaseBlock, { title: string; body: string }> = {
  lesson: {
    title: 'Este resumo é do Student',
    body: 'O Free abre o primeiro resumo de cada disciplina. No Student a estante inteira do ciclo básico fica aberta — do 1º ao 4º período.',
  },
  mindMap: {
    title: 'Este mapa mental é do Student',
    body: 'O Free abre um mapa completo para você sentir o formato. No Student todas as disciplinas ganham o seu mapa.',
  },
};

/** Everything the library paywall promises, in the order it is shown. */
export const BASE_STUDENT_PERKS = [
  'Todos os resumos do ciclo básico',
  'Mapa mental de cada disciplina',
  'Referência científica em todo conteúdo',
  'Cola e treino sem limite diário',
] as const;
