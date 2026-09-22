import React, { useMemo, useState } from 'react';
import { BASE_DISCIPLINES } from '../content';
import { buildSessionBlueprint } from '../session/buildSession';
import { canOpenMix, markMixDone, unlockedDueCards, type ReviewState } from '../session/review';
import type { BasePlan } from '../plan';
import { BackLink } from './ui';

interface MixViewProps {
  plan: BasePlan;
  review: ReviewState;
  onReviewChange: (next: ReviewState) => void;
  onBack: () => void;
  onUpgrade?: () => void;
}

export function MixView({ plan, review, onReviewChange, onBack, onUpgrade }: MixViewProps) {
  const allowed = canOpenMix(plan, review);
  const due = unlockedDueCards(review, plan);

  const deck = useMemo(() => {
    const cards = due.length >= 3 ? due : [...due];
    while (cards.length < 3 && cards.length > 0) {
      cards.push(cards[cards.length % due.length]);
    }
    if (cards.length === 0) {
      const fallback = BASE_DISCIPLINES.flatMap(d =>
        d.lessons.slice(0, 1).map((l, i) => ({ lessonId: l.id, discipline: d, lessonIndex: i })),
      ).slice(0, 5);
      return fallback;
    }
    return cards.map(c => {
      const loc = BASE_DISCIPLINES.flatMap(d =>
        d.lessons.map((l, i) => ({ lessonId: l.id, discipline: d, lessonIndex: i })),
      ).find(x => x.lessonId === c.lessonId);
      return loc!;
    }).filter(Boolean);
  }, [due]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = deck[index % deck.length];
  const lesson = current?.discipline.lessons[current.lessonIndex];
  const mcq = lesson
    ? buildSessionBlueprint(lesson, current.discipline).pretest.find(p => p.type === 'mcq')
    : null;

  const finish = () => {
    setDone(true);
    onReviewChange(markMixDone(review));
  };

  if (!allowed) {
    return (
      <div className="page-shell space-y-8">
        <BackLink label="Estudos" onClick={onBack} />
        <div className="rounded-[28px] bg-[#f5f5f7] px-6 py-6">
          <p className="text-[22px] font-semibold text-[var(--neo-ink)]">Mistura · Student</p>
          <p className="mt-2 text-[15px] leading-snug text-[var(--neo-gray)]">
            No Free, a mistura interdisciplinar abre uma vez por semana. No Student, quando quiser.
          </p>
          {onUpgrade && (
            <button type="button" onClick={onUpgrade} className="neo-pill mt-5">
              Conhecer o Student
            </button>
          )}
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="page-shell space-y-8">
        <BackLink label="Estudos" onClick={onBack} />
        <div className="rounded-[28px] bg-[var(--neo-wash)] px-6 py-8 text-center">
          <p className="text-[13px] text-[var(--neo)]">Mistura</p>
          <p className="mt-2 text-[28px] font-semibold tracking-[-0.025em] text-[var(--neo-ink)]">
            {score} de {Math.min(5, deck.length)}
          </p>
          <p className="mt-2 text-[15px] text-[var(--neo-gray)]">Disciplinas cruzadas — como cai na prova integrada.</p>
          <button type="button" onClick={onBack} className="neo-pill mt-6">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!lesson || !mcq || mcq.type !== 'mcq') {
    return (
      <div className="page-shell space-y-8">
        <BackLink label="Estudos" onClick={onBack} />
        <p className="text-[15px] text-[var(--neo-gray)]">Complete mais sessões para encher a mistura.</p>
      </div>
    );
  }

  const total = Math.min(5, deck.length);
  const advance = (correct: boolean) => {
    if (correct) setScore(s => s + 1);
    setPicked(null);
    if (index + 1 >= total) finish();
    else setIndex(i => i + 1);
  };

  return (
    <div className="page-shell space-y-8">
      <BackLink label="Estudos" onClick={onBack} />
      <header>
        <p className="text-[13px] text-[var(--neo-gray)]">Mistura · {index + 1} de {total}</p>
        <p className="mt-1 text-[13px] text-[var(--neo-gray)]">{current.discipline.title}</p>
        <h1 className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-[var(--neo-ink)]">{lesson.title}</h1>
      </header>
      <div className="rounded-[28px] bg-[#f5f5f7] px-5 py-6">
        <p className="text-[16px] font-semibold leading-snug text-[var(--neo-ink)]">{mcq.question}</p>
        <div className="mt-4 space-y-2">
          {mcq.options.map((opt, oi) => (
            <button
              key={oi}
              type="button"
              disabled={Boolean(picked)}
              onClick={() => {
                setPicked(String(oi));
                advance(oi === mcq.correctIndex);
              }}
              className={`w-full rounded-[16px] bg-white px-4 py-3 text-left text-[15px] ios-press-gentle ${
                picked === String(oi) ? 'ring-2 ring-[var(--neo)]/40' : ''
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
