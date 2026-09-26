/**
 * What the Academy plan changes inside the game. Free keeps the whole trail
 * open but rations how much can be played in a day; Student removes the
 * rationing so a study marathon is never interrupted.
 */
export type GamePlan = 'free' | 'clinico' | 'student';

export interface PlanLimits {
  /** Trail lessons per day, or null for no cap. */
  dailyLessons: number | null;
  heartRegenMs: number;
  infiniteHearts: boolean;
  maxFreezes: number;
  blitz: boolean;
}

export const FREE_LIMITS: PlanLimits = {
  dailyLessons: 1,
  heartRegenMs: 20 * 60 * 1000,
  infiniteHearts: false,
  maxFreezes: 1,
  blitz: false,
};

export const CLINICO_LIMITS: PlanLimits = {
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
  if (plan === 'student') return STUDENT_LIMITS;
  if (plan === 'clinico') return CLINICO_LIMITS;
  return FREE_LIMITS;
}

/** Everything the paywall sheet promises, in the order it is shown. */
export const STUDENT_PERKS = [
  'Lições sem limite diário',
  'Vidas infinitas: erra e continua',
  'Desafio relâmpago liberado',
  'Dois protetores de ofensiva',
  'Ciclo básico inteiro nos Estudos',
] as const;

export type PlanBlock = 'dailyLessons' | 'blitz' | 'hearts';

export const BLOCK_COPY: Record<PlanBlock, { title: string; body: string }> = {
  dailyLessons: {
    title: 'Lição gratuita concluída',
    body: 'O plano Free libera 1 lição de trilha por dia. Amanhã a próxima abre — ou passe para o Student e continue agora.',
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
