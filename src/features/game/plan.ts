/**
 * What the Academy plan changes inside the game. Free keeps the whole trail
 * open but rations how much can be played in a day; Student removes the
 * rationing so a study marathon is never interrupted.
 */
export type GamePlan = 'free' | 'student';

export interface PlanLimits {
  /** Trail lessons per day, or null for no cap. */
  dailyLessons: number | null;
  heartRegenMs: number;
  infiniteHearts: boolean;
  maxFreezes: number;
  blitz: boolean;
}

export const FREE_LIMITS: PlanLimits = {
  dailyLessons: 5,
  heartRegenMs: 20 * 60 * 1000,
  infiniteHearts: false,
  maxFreezes: 1,
  blitz: false,
};

export const STUDENT_LIMITS: PlanLimits = {
  dailyLessons: null,
  heartRegenMs: 5 * 60 * 1000,
  infiniteHearts: true,
  maxFreezes: 2,
  blitz: true,
};

export function limitsFor(plan: GamePlan): PlanLimits {
  return plan === 'free' ? FREE_LIMITS : STUDENT_LIMITS;
}

/** Everything the paywall sheet promises, in the order it is shown. */
export const STUDENT_PERKS = [
  'Lições sem limite diário',
  'Vidas infinitas: erra e continua',
  'Desafio relâmpago liberado',
  'Dois protetores de ofensiva',
] as const;

export type PlanBlock = 'dailyLessons' | 'blitz' | 'hearts';

export const BLOCK_COPY: Record<PlanBlock, { title: string; body: string }> = {
  dailyLessons: {
    title: 'Você já treinou bastante hoje',
    body: 'O plano Free libera 5 lições por dia. Amanhã a trilha abre de novo — ou passe para o Student e siga agora.',
  },
  blitz: {
    title: 'Desafio relâmpago é do Student',
    body: '60 segundos de perguntas rápidas para fechar o dia com XP extra.',
  },
  hearts: {
    title: 'Vidas infinitas no Student',
    body: 'Errar deixa de custar tempo de espera: você continua a lição na hora.',
  },
};
