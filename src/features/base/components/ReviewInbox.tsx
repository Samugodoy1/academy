import React, { useMemo, useState } from 'react';
import { buildSessionBlueprint } from '../session/buildSession';
import { findLessonLocation, gradeReviewCard, type ReviewState } from '../session/review';
import { BackLink, GroupedList } from './ui';

interface ReviewInboxProps {
  review: ReviewState;
  onReviewChange: (next: ReviewState) => void;
  onBack: () => void;
  onOpenSession: (disciplineId: string, lessonIndex: number) => void;
}

export function ReviewInbox({ review, onReviewChange, onBack, onOpenSession }: ReviewInboxProps) {
  const due = useMemo(() => {
    const today = Date.now();
    return Object.values(review.cards)
      .filter(c => new Date(c.due).getTime() <= today)
      .sort((a, b) => a.due.localeCompare(b.due));
  }, [review]);

  const [activeId, setActiveId] = useState<string | null>(() => due[0]?.lessonId ?? null);

  const active = activeId ? findLessonLocation(activeId) : null;
  const blueprint = active ? buildSessionBlueprint(active.discipline.lessons[active.lessonIndex], active.discipline) : null;
  const mcqItem = blueprint?.pretest.find(p => p.type === 'mcq');

  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const grade = (correct: boolean) => {
    if (!activeId) return;
    onReviewChange(gradeReviewCard(review, activeId, correct));
    setPicked(null);
    setFeedback(null);
    const remaining = due.filter(c => c.lessonId !== activeId);
    setActiveId(remaining[0]?.lessonId ?? null);
  };

  return (
    <div className="page-shell space-y-10">
      <header className="space-y-4">
        <BackLink label="Estudos" onClick={onBack} />
        <div>
          <p className="text-[13px] text-[var(--neo-gray)]">Revisão espaçada</p>
          <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
            {due.length === 0 ? 'Fila vazia' : `${due.length} ${due.length === 1 ? 'cartão' : 'cartões'} hoje`}
          </h1>
          <p className="mt-3 max-w-[38ch] text-[17px] leading-snug text-[var(--neo-gray)]">
            Uma pergunta por resumo — o intervalo cresce quando você acerta de verdade.
          </p>
        </div>
      </header>

      {due.length === 0 ? (
        <div className="rounded-[28px] bg-[#f5f5f7] px-6 py-6">
          <p className="text-[17px] font-semibold text-[var(--neo-ink)]">Nada venceu hoje.</p>
          <p className="mt-2 text-[15px] text-[var(--neo-gray)]">Complete sessões e escolha como se sentiu ao fechar — a fila enche sozinha.</p>
        </div>
      ) : active && mcqItem && mcqItem.type === 'mcq' ? (
        <div className="space-y-6">
          <p className="text-[13px] text-[var(--neo-gray)]">{active.discipline.title}</p>
          <p className="text-[22px] font-semibold tracking-[-0.02em] text-[var(--neo-ink)]">
            {active.discipline.lessons[active.lessonIndex].title}
          </p>
          <GroupedList>
            <div className="px-5 py-4">
              <p className="text-[15px] font-semibold text-[var(--neo-ink)]">{mcqItem.question}</p>
              <div className="mt-3 space-y-2">
                {mcqItem.options.map((opt, oi) => (
                  <button
                    key={oi}
                    type="button"
                    disabled={Boolean(feedback)}
                    onClick={() => {
                      setPicked(String(oi));
                      const ok = oi === mcqItem.correctIndex;
                      setFeedback(ok ? mcqItem.why : 'Revise no resumo e tente de novo amanhã.');
                      setTimeout(() => grade(ok), ok ? 600 : 1200);
                    }}
                    className={`w-full rounded-[14px] px-3 py-2.5 text-left text-[14px] ${
                      picked === String(oi) ? 'bg-white ring-2 ring-[var(--neo)]/35' : 'bg-white/80'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && <p className="mt-3 text-[15px] text-[var(--neo-gray)]">{feedback}</p>}
            </div>
          </GroupedList>
          <button
            type="button"
            onClick={() => onOpenSession(active.discipline.id, active.lessonIndex)}
            className="neo-link text-[15px]"
          >
            Refazer sessão completa ›
          </button>
        </div>
      ) : (
        <p className="text-[15px] text-[var(--neo-gray)]">Selecione um cartão na fila.</p>
      )}

      {due.length > 1 && (
        <div className="space-y-2">
          <p className="text-[13px] text-[var(--neo-gray)]">Na fila</p>
          <GroupedList>
            {due.map(card => {
              const loc = findLessonLocation(card.lessonId);
              if (!loc) return null;
              return (
                <button
                  key={card.lessonId}
                  type="button"
                  onClick={() => {
                    setActiveId(card.lessonId);
                    setPicked(null);
                    setFeedback(null);
                  }}
                  className={`w-full border-b border-black/[0.04] px-5 py-3 text-left last:border-b-0 ${
                    card.lessonId === activeId ? 'bg-white/50' : ''
                  }`}
                >
                  <p className="text-[14px] font-semibold text-[var(--neo-ink)]">{loc.discipline.lessons[loc.lessonIndex].title}</p>
                  <p className="text-[12px] text-[var(--neo-gray)]">{loc.discipline.title}</p>
                </button>
              );
            })}
          </GroupedList>
        </div>
      )}
    </div>
  );
}
