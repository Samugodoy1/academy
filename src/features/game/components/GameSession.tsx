import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Clock, Heart, X, Zap } from '../../../icons';
import { checkAnswer, describeAnswer } from '../engine';
import { feedback } from '../sound';
import type { Answer, Exercise, LessonOutcome, LessonPlan } from '../types';
import { EXERCISE_KIND_LABEL, ExerciseView } from './ExerciseView';

const MAX_ATTEMPTS = 3;

export interface GameSessionProps {
  plan: LessonPlan;
  hearts: number;
  useHearts: boolean;
  soundOn: boolean;
  timeLimitSec?: number;
  onHeartLost: () => void;
  onFinish: (outcome: LessonOutcome, reason: 'complete' | 'failed') => void;
  onQuit: () => void;
}

const formatClock = (seconds: number) => {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
};

export const GameSession: React.FC<GameSessionProps> = ({
  plan,
  hearts,
  useHearts,
  soundOn,
  timeLimitSec,
  onHeartLost,
  onFinish,
  onQuit,
}) => {
  const total = plan.exercises.length;
  const [queue, setQueue] = useState<Exercise[]>(plan.exercises);
  const [cursor, setCursor] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [checked, setChecked] = useState<null | { correct: boolean }>(null);
  const [resolved, setResolved] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [mastered, setMastered] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [heartsLost, setHeartsLost] = useState(0);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(timeLimitSec ?? 0);
  const startedAt = useRef(Date.now());
  const finishedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const current = queue[cursor] ?? null;
  const progress = total > 0 ? Math.min(1, resolved.length / total) : 0;

  const buildOutcome = useCallback(
    (finalMissed: string[], finalMastered: string[], finalHeartsLost: number, finalBest: number): LessonOutcome => ({
      topic: plan.topic,
      kind: plan.kind,
      index: plan.index,
      correct: finalMastered.length,
      total,
      heartsLost: finalHeartsLost,
      bestCombo: finalBest,
      missed: finalMissed,
      mastered: finalMastered,
      elapsedMs: Date.now() - startedAt.current,
    }),
    [plan.index, plan.kind, plan.topic, total]
  );

  const finish = useCallback(
    (reason: 'complete' | 'failed', overrides?: { missed?: string[]; mastered?: string[]; heartsLost?: number; bestCombo?: number }) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinish(
        buildOutcome(
          overrides?.missed ?? missed,
          overrides?.mastered ?? mastered,
          overrides?.heartsLost ?? heartsLost,
          overrides?.bestCombo ?? bestCombo
        ),
        reason
      );
    },
    [bestCombo, buildOutcome, heartsLost, mastered, missed, onFinish]
  );

  const finishRef = useRef(finish);
  finishRef.current = finish;

  // Rapid fire mode: the clock, not the exercise count, ends the round.
  useEffect(() => {
    if (!timeLimitSec) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft(value => {
        if (value <= 1) {
          window.clearInterval(timer);
          finishRef.current('complete');
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timeLimitSec]);

  const advance = useCallback(
    (nextQueue: Exercise[], nextResolved: string[]) => {
      setChecked(null);
      setAnswer(null);
      const nextCursor = cursor + 1;
      if (nextCursor >= nextQueue.length || nextResolved.length >= total) {
        finish('complete', { missed, mastered, heartsLost, bestCombo });
        return;
      }
      setCursor(nextCursor);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [bestCombo, cursor, finish, heartsLost, mastered, missed, total]
  );

  const submit = useCallback(
    (value: Answer) => {
      if (!current || checked) return;
      const isCorrect = checkAnswer(current, value);
      const tries = (attempts[current.id] ?? 0) + 1;
      setAttempts(previous => ({ ...previous, [current.id]: tries }));
      setAnswer(value);
      setChecked({ correct: isCorrect });
      feedback(isCorrect ? 'correct' : 'wrong', soundOn);

      if (isCorrect) {
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setBestCombo(best => Math.max(best, nextCombo));
        setResolved(list => (list.includes(current.id) ? list : [...list, current.id]));
        if (tries === 1 && !missed.includes(current.id)) {
          setMastered(list => (list.includes(current.id) ? list : [...list, current.id]));
        }
        return;
      }

      setCombo(0);
      setMissed(list => (list.includes(current.id) ? list : [...list, current.id]));
      setMastered(list => list.filter(id => id !== current.id));
      if (useHearts) {
        setHeartsLost(count => count + 1);
        onHeartLost();
      }
      if (tries >= MAX_ATTEMPTS) {
        setResolved(list => (list.includes(current.id) ? list : [...list, current.id]));
      } else {
        // Duolingo style: a missed exercise comes back before the lesson ends.
        setQueue(list => [...list, current]);
      }
    },
    [attempts, checked, combo, current, missed, onHeartLost, soundOn, useHearts]
  );

  const skip = useCallback(() => {
    if (!current || checked) return;
    setCombo(0);
    setMissed(list => (list.includes(current.id) ? list : [...list, current.id]));
    setMastered(list => list.filter(id => id !== current.id));
    const nextResolved = resolved.includes(current.id) ? resolved : [...resolved, current.id];
    setResolved(nextResolved);
    advance(queue, nextResolved);
  }, [advance, checked, current, queue, resolved]);

  const handleContinue = useCallback(() => {
    if (!checked || !current) return;
    const nextResolved = checked.correct || (attempts[current.id] ?? 0) >= MAX_ATTEMPTS
      ? resolved.includes(current.id)
        ? resolved
        : [...resolved, current.id]
      : resolved;
    const nextQueue = queue;
    setResolved(nextResolved);
    advance(nextQueue, nextResolved);
  }, [advance, attempts, checked, current, queue, resolved]);

  // Out of hearts ends the run, but only after the student reads the feedback.
  const outOfHearts = useHearts && hearts <= 0;
  useEffect(() => {
    if (outOfHearts && checked && !checked.correct) {
      const timer = window.setTimeout(() => finish('failed'), 1200);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [checked, finish, outOfHearts]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (checked) handleContinue();
        else if (answer) submit(answer);
        return;
      }
      if (checked || !current) return;
      const digit = Number(event.key);
      if (!Number.isNaN(digit) && digit >= 1) {
        if (current.kind === 'choice' && digit <= current.options.length) {
          setAnswer({ kind: 'choice', index: digit - 1 });
        }
        if (current.kind === 'boolean' && digit <= 2) {
          setAnswer({ kind: 'boolean', value: digit === 1 });
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [answer, checked, current, handleContinue, submit]);

  const feedbackCopy = useMemo(() => {
    if (!checked || !current) return null;
    if (checked.correct) {
      const cheers = ['Isso!', 'Mandou bem!', 'Exatamente!', 'Perfeito!'];
      return { title: cheers[resolved.length % cheers.length], detail: current.explanation };
    }
    return {
      title: 'Resposta correta',
      detail: `${describeAnswer(current)}. ${current.explanation}`,
    };
  }, [checked, current, resolved.length]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white">
      <header className="flex items-center gap-3 px-4 pb-2 pt-[max(12px,env(safe-area-inset-top))] sm:px-6">
        <button
          type="button"
          aria-label="Sair da lição"
          onClick={() => setConfirmQuit(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--neo-gray)]"
        >
          <X size={20} />
        </button>
        <div className="game-bar flex-1">
          <div className="game-bar-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        {timeLimitSec ? (
          <span
            className={`flex shrink-0 items-center gap-1.5 text-[15px] font-semibold tabular-nums ${
              secondsLeft <= 10 ? 'text-[var(--game-wrong)]' : 'text-[var(--neo-ink)]'
            }`}
          >
            <Clock size={16} />
            {formatClock(secondsLeft)}
          </span>
        ) : useHearts ? (
          <span className="flex shrink-0 items-center gap-1.5 text-[15px] font-semibold tabular-nums text-[var(--game-wrong)]">
            <Heart size={18} />
            {hearts}
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-[var(--neo-wash)] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--neo)]">
            Treino livre
          </span>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-40 pt-4 sm:px-6">
        <div className="mx-auto w-full max-w-[620px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--neo-gray)]">
              {EXERCISE_KIND_LABEL[current.kind]}
            </p>
            {combo >= 2 && (
              <span className="game-pop flex items-center gap-1 rounded-full bg-[var(--neo-wash)] px-3 py-1 text-[13px] font-semibold text-[var(--neo)]">
                <Zap size={13} />
                Combo x{combo}
              </span>
            )}
          </div>

          <h2 className="mb-5 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--neo-ink)] sm:text-[28px]">
            {current.prompt}
          </h2>

          <ExerciseView
            key={`${current.id}-${attempts[current.id] ?? 0}`}
            exercise={current}
            answer={answer}
            locked={Boolean(checked)}
            onChange={setAnswer}
            onAutoSubmit={submit}
            onTap={() => feedback('tap', soundOn)}
          />
        </div>
      </div>

      <footer
        className={`game-sheet border-t px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 sm:px-6 ${
          checked
            ? checked.correct
              ? 'border-transparent bg-[var(--game-right-wash)]'
              : 'border-transparent bg-[var(--game-wrong-wash)]'
            : 'border-[var(--game-line)] bg-white'
        }`}
      >
        <div className="mx-auto w-full max-w-[620px]">
          {checked && feedbackCopy ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${
                    checked.correct ? 'bg-[var(--game-right)]' : 'bg-[var(--game-wrong)]'
                  }`}
                >
                  {checked.correct ? <Check size={16} /> : <X size={16} />}
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-[17px] font-semibold tracking-[-0.016em] ${
                      checked.correct ? 'text-[var(--game-right-ink)]' : 'text-[var(--game-wrong-ink)]'
                    }`}
                  >
                    {feedbackCopy.title}
                  </p>
                  <p
                    className={`mt-1 text-[14px] leading-snug ${
                      checked.correct ? 'text-[var(--game-right-ink)]' : 'text-[var(--game-wrong-ink)]'
                    }`}
                  >
                    {feedbackCopy.detail}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleContinue}
                className={`game-cta ${checked.correct ? 'game-cta-right' : 'game-cta-wrong'}`}
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                disabled={!answer}
                onClick={() => answer && submit(answer)}
                className="game-cta"
              >
                Verificar
              </button>
              <button
                type="button"
                onClick={skip}
                className="w-full py-2 text-[14px] font-medium text-[var(--neo-gray)]"
              >
                Pular
              </button>
            </div>
          )}
        </div>
      </footer>

      {confirmQuit && (
        <div className="fixed inset-0 z-[210] flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="game-sheet w-full max-w-[420px] rounded-[28px] bg-white p-6">
            <p className="text-[22px] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--neo-ink)]">
              Sair agora?
            </p>
            <p className="mt-2 text-[15px] leading-snug text-[var(--neo-gray)]">
              O progresso desta lição não será salvo.
            </p>
            <div className="mt-6 space-y-2">
              <button type="button" onClick={() => setConfirmQuit(false)} className="game-cta">
                Continuar treinando
              </button>
              <button type="button" onClick={onQuit} className="game-cta game-cta-ghost">
                Sair da lição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
