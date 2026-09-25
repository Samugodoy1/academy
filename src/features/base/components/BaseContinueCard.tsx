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
    <button type="button" onClick={open} className="ac-hero px-7 pb-7 pt-8 ios-press-gentle">
      <p className="text-[13px] tracking-[-0.011em] text-white/50">
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
          <p className="mt-2 text-[15px] tracking-[-0.016em] text-white/60">{suggestion.discipline.title}</p>
          <p className="apple-display mt-1 text-[32px] sm:text-[36px]">
            {suggestion.lesson.title}
          </p>
          <p className="mt-3 max-w-[40ch] text-[17px] leading-snug text-white/80">{suggestion.lesson.summary}</p>
          <span className="apple-btn-light mt-7 flex w-full py-[14px] text-[17px]">
            Ler · {suggestion.lesson.minutes} min · {done} de {total}
          </span>
        </>
      ) : (
        <>
          <p className="apple-display mt-2 text-[32px] sm:text-[36px]">
            Você leu o que estava aberto.
          </p>
          <p className="mt-3 text-[17px] leading-snug text-white/80">
            Volte aos mapas e reconstrua um ramo de memória — é assim que fixa.
          </p>
          <span className="apple-btn-light mt-7 flex w-full py-[14px] text-[17px]">Abrir Estudos</span>
        </>
      )}
    </button>
  );
};
