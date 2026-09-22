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
      handOffToBase({ kind: 'session', disciplineId: suggestion.discipline.id, lessonIndex: suggestion.lessonIndex });
    } else {
      handOffToBase({ kind: 'home' });
    }
    onOpen();
  };

  return (
    <button type="button" onClick={open} className="w-full rounded-[28px] bg-[var(--neo)] px-6 py-6 text-left text-white ios-press-gentle">
      <p className="text-[12px] font-normal uppercase tracking-[0.04em] text-white/80">
        {suggestion
          ? suggestion.reason === 'resume'
            ? 'Continuar de onde parou'
            : suggestion.reason === 'next'
              ? 'Próxima sessão'
              : 'Ciclo básico · comece por aqui'
          : 'Ciclo básico'}
      </p>
      {suggestion ? (
        <>
          <p className="mt-2 text-[15px] tracking-[-0.011em] text-white/85">{suggestion.discipline.title}</p>
          <p className="mt-1 text-[26px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[32px]">
            {suggestion.lesson.title}
          </p>
          <p className="mt-3 text-[15px] leading-snug text-white/90">{suggestion.lesson.summary}</p>
          <p className="mt-4 flex items-center justify-between text-[15px] text-white/90">
            <span>{suggestion.lesson.minutes} min · {done} de {total} lidos</span>
            <span>Iniciar sessão ›</span>
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 text-[26px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[32px]">
            Você leu o que estava aberto.
          </p>
          <p className="mt-3 text-[15px] leading-snug text-white/90">
            Volte aos mapas e reconstrua um ramo de memória — é assim que fixa.
          </p>
          <p className="mt-4 text-[15px] text-white/90">Abrir Estudos ›</p>
        </>
      )}
    </button>
  );
};
