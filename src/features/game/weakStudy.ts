import type { StudyKey } from '../../utils/studyTopics';
import type { ExerciseMemory, GameState } from './types';

const TOPIC_BY_PREFIX: Record<string, StudyKey> = {
  exame: 'exame-clinico',
  radio: 'radiologia',
  anest: 'anestesia',
  isol: 'isolamento',
  prev: 'preventiva',
  perio: 'periodontia',
  dent: 'dentistica',
  endo: 'endodontia',
  cir: 'cirurgia',
  prot: 'protese',
  ped: 'odontopediatria',
  anat: 'anatomia-aplicada',
  farm: 'farmacologia',
  pat: 'patologia-oral',
  urg: 'urgencias-medicas',
  bio: 'biosseguranca',
  mat: 'materiais-dentarios',
  ocl: 'oclusao',
  impl: 'implantodontia',
  orto: 'ortodontia',
  geri: 'odontogeriatria',
};

export function topicFromExerciseId(id: string): StudyKey | null {
  const prefix = id.split('-')[0];
  return TOPIC_BY_PREFIX[prefix] ?? null;
}

export interface WeakStudyFocus {
  topic: StudyKey;
  wrong: number;
  attempts: number;
}

/** The subject with the most missed answers. Null until the student has missed something. */
export function weakestStudyFocus(state: Pick<GameState, 'exerciseMemory' | 'mistakes'>): WeakStudyFocus | null {
  const totals = new Map<StudyKey, { wrong: number; attempts: number }>();

  const add = (topic: StudyKey, wrong: number, attempts: number) => {
    const current = totals.get(topic) ?? { wrong: 0, attempts: 0 };
    current.wrong += wrong;
    current.attempts += attempts;
    totals.set(topic, current);
  };

  for (const [id, memory] of Object.entries(state.exerciseMemory) as Array<[string, ExerciseMemory]>) {
    const topic = topicFromExerciseId(id);
    if (!topic || memory.attempts <= 0) continue;
    add(topic, Math.max(0, memory.attempts - memory.correct), memory.attempts);
  }

  for (const id of state.mistakes) {
    const topic = topicFromExerciseId(id);
    if (!topic) continue;
    const current = totals.get(topic);
    if (!current) add(topic, 1, 1);
  }

  let best: WeakStudyFocus | null = null;
  for (const [topic, score] of totals) {
    if (score.wrong <= 0) continue;
    if (
      !best
      || score.wrong > best.wrong
      || (score.wrong === best.wrong && score.attempts > 0 && best.attempts > 0 && score.wrong / score.attempts > best.wrong / best.attempts)
    ) {
      best = { topic, wrong: score.wrong, attempts: score.attempts };
    }
  }
  return best;
}
