import React, { useMemo } from 'react';
import { BASE_DISCIPLINES } from '../content';
import { handOffToBase } from '../handoff';
import { countLessons, isLessonUnlocked, type BasePlan } from '../plan';
import { countAllDone, readBaseProgress, suggestNextLesson } from '../progress';

interface BaseContinueCardProps {
  plan: BasePlan;
  /** Switches the shell to the Estudos tab after the view has been handed off. */
  onOpen: () => void;
}

/**
 * The dashboard's hero for a student who has no chair yet: the next summary
 * to read, straight from their progress. Reads storage on every mount so it
 * stays honest after a study session without any shared state.
 */
export const BaseContinueCard: React.FC<BaseContinueCardProps> = ({ plan, onOpen }) => {
  const progress = useMemo(() => readBaseProgress(), []);
  const suggestion = useMemo(
    () => suggestNextLesson(BASE_DISCIPLINES, progress, index => isLessonUnlocked(plan, index)),
    [progress, plan],
  );
  const done = countAllDone(progress, BASE_DISCIPLINES);
  const total = countLessons(BASE_DISCIPLINES);

  const open = () => {
    if (suggestion) {
      handOffToBase({ kind: 'lesson', disciplineId: suggestion.discipline.id, lessonIndex: suggestion.lessonIndex });
    } else {
      handOffToBase({ kind: 'home' });
    }
    onOpen();
  };

  return (
    <button type="button" onClick={open} className="ac-hero px-6 pb-6 pt-6 ios-press-gentle sm:px-7 sm:pt-7">
      <p className="ac-voice">
        {suggestion
          ? suggestion.reason === 'resume'
            ? 'Continuar de onde parou'
            : suggestion.reason === 'next'
              ? 'Próximo resumo'
              : 'Ciclo básico · comece por aqui'
          : 'Ciclo básico'}
      </p>
      {suggestion ? (
        <>
          <p className="ac-support mt-3 !text-[15px]">{suggestion.discipline.title} · {done} de {total}</p>
          <p className="ac-name mt-1 text-[28px] sm:text-[32px]">{suggestion.lesson.title}</p>
          <p className="ac-support mt-3 max-w-[36ch]">{suggestion.lesson.summary}</p>
          <span className="ac-action">Ler · {suggestion.lesson.minutes} min</span>
        </>
      ) : (
        <>
          <p className="ac-name mt-3 text-[28px] sm:text-[32px]">Você leu o que estava aberto.</p>
          <p className="ac-support mt-3">
            Volte aos mapas e reconstrua um ramo de memória — é assim que fixa.
          </p>
          <span className="ac-action">Abrir Estudos</span>
        </>
      )}
    </button>
  );
};
