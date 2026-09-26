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

  const kicker = suggestion
    ? suggestion.reason === 'resume'
      ? 'Continuar de onde parou'
      : suggestion.reason === 'next'
        ? 'Próximo resumo'
        : 'Comece por aqui'
    : 'Ciclo básico';

  return (
    <button type="button" onClick={open} className="patient-hero w-full px-6 py-6 text-left sm:px-7 sm:py-7">
      <p className="text-[13px] tracking-[-0.011em] text-white/75">{kicker}</p>
      {suggestion ? (
        <>
          <p className="mt-3 text-[15px] tracking-[-0.011em] text-white/80">{suggestion.discipline.title}</p>
          <p className="mt-1 text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[36px]">
            {suggestion.lesson.title}
          </p>
          <p className="mt-2 max-w-[36ch] text-[17px] leading-snug text-white/80">{suggestion.lesson.summary}</p>
          <span className="hero-action">Ler · {suggestion.lesson.minutes} min</span>
          <span className="mt-3 block text-[13px] text-white/70">
            {done} de {total} lidos
          </span>
        </>
      ) : (
        <>
          <p className="mt-3 text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
            Você leu o que estava aberto.
          </p>
          <p className="mt-2 max-w-[36ch] text-[17px] leading-snug text-white/80">
            Volte aos mapas e reconstrua um ramo de memória.
          </p>
          <span className="hero-action">Abrir Estudos</span>
        </>
      )}
    </button>
  );
};
