import type { BaseDiscipline, BaseLesson } from '../types';
import type { GestoKind, PretestItem, SessionBlueprint, SessionRuntime } from './types';
import { GESTO_BY_LESSON } from './gestoMap';
import { EXPLAIN_BY_LESSON } from './explainCopy';
import { EXTRA_MCQ_BY_LESSON } from './pretestExtra';

function shuffleOptions<T>(items: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    h = (h * 1664525 + 1013904223) | 0;
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function mcqFromKeyPoint(
  lesson: BaseLesson,
  discipline: BaseDiscipline,
  pointIndex: number,
): PretestItem {
  const correct = lesson.keyPoints[pointIndex] || lesson.keyPoints[0];
  const pool = discipline.lessons
    .filter(l => l.id !== lesson.id)
    .flatMap(l => l.keyPoints)
    .filter(Boolean);
  const distractors = shuffleOptions(pool, lesson.id).slice(0, 3);
  while (distractors.length < 3) distractors.push('Nenhuma das anteriores.');
  const options = shuffleOptions([correct, ...distractors], `${lesson.id}-mcq`) as [
    string,
    string,
    string,
    string,
  ];
  const correctIndex = options.findIndex(o => o === correct) as 0 | 1 | 2 | 3;
  return {
    type: 'mcq',
    id: `${lesson.id}-kp-${pointIndex}`,
    question: 'Qual afirmação você levaria para a prova?',
    options,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    why: correct,
  };
}

export function buildPretest(lesson: BaseLesson, discipline: BaseDiscipline): PretestItem[] {
  const open = lesson.selfCheck.slice(0, 2).map((item, index) => ({
    type: 'open' as const,
    id: `${lesson.id}-open-${index}`,
    question: item.question,
    answer: item.answer,
  }));

  const extra = EXTRA_MCQ_BY_LESSON[lesson.id];
  const mcq: PretestItem = extra || mcqFromKeyPoint(lesson, discipline, 0);

  return [...open, mcq];
}

export function buildSessionBlueprint(lesson: BaseLesson, discipline: BaseDiscipline): SessionBlueprint {
  const gesto: GestoKind = GESTO_BY_LESSON[lesson.id] || { type: 'rebuild', disciplineId: discipline.id };
  const explain = EXPLAIN_BY_LESSON[lesson.id] || {
    prompt: `Explique para um colega, em três frases, o essencial de "${lesson.title}".`,
    mustInclude: lesson.keyPoints.slice(0, 2),
    model: lesson.keyPoints.join(' '),
  };

  return {
    lessonId: lesson.id,
    pretest: buildPretest(lesson, discipline),
    gesto,
    explainPrompt: explain.prompt,
    explainMustInclude: explain.mustInclude,
    explainModel: explain.model,
  };
}

export function buildSessionRuntime(
  discipline: BaseDiscipline,
  lessonIndex: number,
): SessionRuntime | null {
  const lesson = discipline.lessons[lessonIndex];
  if (!lesson) return null;
  const blueprint = buildSessionBlueprint(lesson, discipline);
  const references = discipline.references.filter(r => lesson.refIds.includes(r.id));
  return {
    disciplineId: discipline.id,
    disciplineTitle: discipline.title,
    lesson,
    lessonIndex,
    blueprint,
    references,
  };
}
