import { createRandom, hashSeed, shuffle } from './engine';
import type { LessonOutcome, Quest, QuestKind } from './types';

interface QuestTemplate {
  id: string;
  kind: QuestKind;
  gems: number;
  target: number;
  title: (target: number) => string;
}

const POOL: QuestTemplate[] = [
  { id: 'lessons-2', kind: 'lessons', gems: 15, target: 2, title: t => `Complete ${t} lições` },
  { id: 'lessons-4', kind: 'lessons', gems: 25, target: 4, title: t => `Complete ${t} lições` },
  { id: 'correct-15', kind: 'correct', gems: 15, target: 15, title: t => `Acerte ${t} questões` },
  { id: 'correct-30', kind: 'correct', gems: 25, target: 30, title: t => `Acerte ${t} questões` },
  { id: 'perfect-1', kind: 'perfect', gems: 20, target: 1, title: () => 'Feche uma lição sem errar' },
  { id: 'combo-6', kind: 'combo', gems: 15, target: 6, title: t => `Emende um combo de ${t}` },
  { id: 'combo-10', kind: 'combo', gems: 25, target: 10, title: t => `Emende um combo de ${t}` },
  { id: 'mistakes-1', kind: 'mistakes', gems: 15, target: 1, title: () => 'Revise os erros guardados' },
];

export const QUESTS_PER_DAY = 3;

const toQuest = (template: QuestTemplate, target = template.target): Quest => ({
  id: template.id,
  kind: template.kind,
  title: template.title(target),
  target,
  progress: 0,
  gems: template.gems,
});

/** The day's missions: the XP goal is always there, the other two rotate. */
export function rollQuests(dayKey: string, dailyGoal: number): Quest[] {
  const goalQuest: Quest = {
    id: 'xp-goal',
    kind: 'xp',
    title: `Ganhe ${dailyGoal} XP hoje`,
    target: dailyGoal,
    progress: 0,
    gems: 20,
  };
  const random = createRandom(hashSeed(`quests:${dayKey}`));
  const picked = shuffle(POOL, random).slice(0, QUESTS_PER_DAY - 1);
  return [goalQuest, ...picked.map(template => toQuest(template))];
}

function gainFor(quest: Quest, outcome: LessonOutcome, xp: number): number {
  switch (quest.kind) {
    case 'xp':
      return xp;
    case 'lessons':
      return outcome.kind === 'lesson' || outcome.kind === 'review' ? 1 : 0;
    case 'correct':
      return outcome.correct;
    case 'perfect':
      return outcome.heartsLost === 0 && outcome.correct === outcome.total ? 1 : 0;
    case 'combo':
      // Not cumulative: what counts is the best run of the lesson.
      return Math.max(0, outcome.bestCombo - quest.progress);
    case 'mistakes':
      return outcome.kind === 'mistakes' ? 1 : 0;
    default:
      return 0;
  }
}

export interface QuestUpdate {
  quests: Quest[];
  gems: number;
  completed: Quest[];
}

export function applyQuestProgress(quests: Quest[], outcome: LessonOutcome, xp: number): QuestUpdate {
  const completed: Quest[] = [];
  let gems = 0;
  const next = quests.map(quest => {
    const wasDone = quest.progress >= quest.target;
    const progress = Math.min(quest.target, quest.progress + gainFor(quest, outcome, xp));
    if (!wasDone && progress >= quest.target) {
      gems += quest.gems;
      completed.push({ ...quest, progress });
    }
    return progress === quest.progress ? quest : { ...quest, progress };
  });
  return { quests: next, gems, completed };
}

export const questsDone = (quests: Quest[]): number =>
  quests.filter(quest => quest.progress >= quest.target).length;
