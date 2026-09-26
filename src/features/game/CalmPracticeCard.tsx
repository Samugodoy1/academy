import React, { useEffect, useState } from 'react';
import { STUDY_TOPIC_LABELS, type StudyKey } from '../../utils/studyTopics';
import { limitsFor, type GamePlan } from './plan';
import { hydrateGameFromServer, loadLocalGameState } from './sync';
import { weakestStudyFocus } from './weakStudy';

interface CalmPracticeCardProps {
  plan?: GamePlan;
  onStudy: (topic: StudyKey) => void;
  onPlay: () => void;
}

export function CalmPracticeCard({ plan, onStudy, onPlay }: CalmPracticeCardProps) {
  const [focus, setFocus] = useState<ReturnType<typeof weakestStudyFocus> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const limits = limitsFor(plan ?? 'free');
    const now = new Date();
    const local = loadLocalGameState(now, limits);
    setFocus(weakestStudyFocus(local));
    void hydrateGameFromServer(local, now, limits).then(merged => {
      if (!cancelled) setFocus(weakestStudyFocus(merged));
    });
    return () => {
      cancelled = true;
    };
  }, [plan]);

  if (focus === undefined) {
    return <div className="h-[196px] rounded-[28px] bg-[var(--neo-soft)]" />;
  }

  if (!focus) {
    return (
      <button type="button" onClick={onPlay} className="patient-hero w-full px-6 py-6 text-left sm:px-7 sm:py-7">
        <p className="text-[13px] tracking-[-0.011em] text-white/75">Foco de estudos</p>
        <p className="mt-3 text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[36px]">
          Jogue uma lição.
        </p>
        <p className="mt-2 max-w-[36ch] text-[17px] leading-snug tracking-[-0.011em] text-white/80">
          Ainda não há erros para guiar. Uma lição mostra qual matéria precisa de revisão.
        </p>
        <span className="hero-action">Começar</span>
      </button>
    );
  }

  const title = STUDY_TOPIC_LABELS[focus.topic];
  const misses = `${focus.wrong} ${focus.wrong === 1 ? 'erro' : 'erros'}`;

  return (
    <button
      type="button"
      onClick={() => onStudy(focus.topic)}
      className="patient-hero w-full px-6 py-6 text-left sm:px-7 sm:py-7"
    >
      <p className="text-[13px] tracking-[-0.011em] text-white/75">Foco de estudos</p>
      <p className="mt-3 text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[36px]">
        {title}
      </p>
      <p className="mt-2 max-w-[36ch] text-[17px] leading-snug tracking-[-0.011em] text-white/80">
        É a matéria em que você mais erra no jogo. {misses} ainda pedem revisão.
      </p>
      <span className="hero-action">Revisar</span>
    </button>
  );
}
