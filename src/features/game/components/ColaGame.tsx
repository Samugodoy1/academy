import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StudyKey } from '../../../utils/studyTopics';
import { STUDY_TOPIC_LABELS } from '../../../utils/studyTopics';
import { Flame, Heart, SoundOff, SoundOn, Target, TrendingUp, Zap } from '../../../icons';
import { ALL_EXERCISES, getUnit } from '../content';
import {
  BLITZ_SECONDS,
  buildBlitzLesson,
  buildLesson,
  buildMistakesLesson,
  buildUnitReview,
} from '../engine';
import {
  DAILY_GOAL_OPTIONS,
  MAX_HEARTS,
  currentStreak,
  getUnitState,
  msToNextHeart,
} from '../progress';
import { useGameState } from '../useGameState';
import type { LessonOutcome, LessonPlan, LessonReward } from '../types';
import { GameSession } from './GameSession';
import { GameTrail, type TrailSelection } from './GameTrail';
import { LessonComplete, LessonFailed } from './LessonComplete';

interface ColaGameProps {
  /** Topic of the student's next appointment: always unlocked and highlighted. */
  spotlightTopic?: StudyKey | null;
  spotlightLabel?: string | null;
  /** Opens straight into this topic's current lesson (used by "jogar a lição"). */
  autoStartTopic?: StudyKey | null;
  onOpenStudy?: (topic: StudyKey) => void;
}

interface RunningLesson {
  plan: LessonPlan;
  useHearts: boolean;
  timeLimitSec?: number;
}

const minutesLeft = (ms: number) => Math.max(1, Math.ceil(ms / 60000));

export const ColaGame: React.FC<ColaGameProps> = ({
  spotlightTopic,
  spotlightLabel,
  autoStartTopic,
  onOpenStudy,
}) => {
  const { state, loseHeart, completeLesson, failLesson, setDailyGoal, toggleSound } = useGameState();
  const [running, setRunning] = useState<RunningLesson | null>(null);
  const [result, setResult] = useState<{ outcome: LessonOutcome; reward: LessonReward } | null>(null);
  const [noHearts, setNoHearts] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);

  const streak = currentStreak(state);
  const goalProgress = Math.min(1, state.dayXp / Math.max(1, state.dailyGoal));
  const heartsFull = state.hearts >= MAX_HEARTS;

  const startTrailNode = useCallback(
    (selection: TrailSelection) => {
      const unit = getUnit(selection.topic);
      if (!unit) return;
      if (state.hearts <= 0) {
        setNoHearts(true);
        return;
      }
      const plan =
        selection.kind === 'review'
          ? buildUnitReview(unit, getUnitState(state, unit.topic).crowns)
          : buildLesson(unit, selection.index);
      setRunning({ plan, useHearts: true });
    },
    [state]
  );

  /** Current node of a unit: the next unfinished lesson, or its review. */
  const nextNodeOf = useCallback(
    (topic: StudyKey): TrailSelection | null => {
      const unit = getUnit(topic);
      if (!unit) return null;
      const progress = getUnitState(state, topic);
      return progress.lessons >= unit.lessons
        ? { topic, index: unit.lessons, kind: 'review' }
        : { topic, index: progress.lessons, kind: 'lesson' };
    },
    [state]
  );

  const autoStarted = useRef(false);
  useEffect(() => {
    if (autoStarted.current || !autoStartTopic) return;
    autoStarted.current = true;
    const node = nextNodeOf(autoStartTopic);
    if (node) startTrailNode(node);
  }, [autoStartTopic, nextNodeOf, startTrailNode]);

  const startMistakes = useCallback(
    (ids?: string[]) => {
      const plan = buildMistakesLesson(
        ALL_EXERCISES,
        ids && ids.length > 0 ? ids : state.mistakes,
        `mistakes-${Date.now()}`
      );
      if (!plan) return;
      setNoHearts(false);
      setResult(null);
      setRunning({ plan, useHearts: false });
    },
    [state.mistakes]
  );

  const startBlitz = useCallback(() => {
    setNoHearts(false);
    setResult(null);
    setRunning({
      plan: buildBlitzLesson(ALL_EXERCISES, `blitz-${Date.now()}`),
      useHearts: false,
      timeLimitSec: BLITZ_SECONDS,
    });
  }, []);

  const handleFinish = useCallback(
    (outcome: LessonOutcome, reason: 'complete' | 'failed') => {
      setRunning(null);
      if (reason === 'failed') {
        failLesson(outcome);
        setNoHearts(true);
        return;
      }
      setResult({ outcome, reward: completeLesson(outcome) });
    },
    [completeLesson, failLesson]
  );

  const nextLesson = useMemo(() => {
    if (!result || result.outcome.kind !== 'lesson' || !result.outcome.topic) return null;
    const unit = getUnit(result.outcome.topic);
    if (!unit) return null;
    const nextIndex = result.outcome.index + 1;
    if (nextIndex < unit.lessons) {
      return { topic: unit.topic, index: nextIndex, kind: 'lesson' as const };
    }
    if (getUnitState(state, unit.topic).lessons >= unit.lessons) {
      return { topic: unit.topic, index: unit.lessons, kind: 'review' as const };
    }
    return null;
  }, [result, state]);

  if (running) {
    return (
      <GameSession
        key={running.plan.id}
        plan={running.plan}
        hearts={state.hearts}
        useHearts={running.useHearts}
        soundOn={state.sound}
        timeLimitSec={running.timeLimitSec}
        onHeartLost={loseHeart}
        onFinish={handleFinish}
        onQuit={() => setRunning(null)}
      />
    );
  }

  if (result) {
    const topic = result.outcome.topic;
    return (
      <LessonComplete
        outcome={result.outcome}
        reward={result.reward}
        soundOn={state.sound}
        onContinue={() => setResult(null)}
        onReviewMistakes={
          result.outcome.missed.length > 0 ? () => startMistakes(result.outcome.missed) : undefined
        }
        onNextLesson={
          nextLesson && state.hearts > 0
            ? () => {
                setResult(null);
                startTrailNode(nextLesson);
              }
            : undefined
        }
        studyLink={
          topic && onOpenStudy
            ? { label: `Ler a cola de ${STUDY_TOPIC_LABELS[topic]}`, onClick: () => onOpenStudy(topic) }
            : null
        }
      />
    );
  }

  if (noHearts) {
    return (
      <LessonFailed
        minutesToHeart={minutesLeft(msToNextHeart(state))}
        onPractice={() => (state.mistakes.length > 0 ? startMistakes() : startBlitz())}
        onExit={() => setNoHearts(false)}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[560px] space-y-8">
      <div className="flex items-center justify-between gap-3 rounded-[24px] bg-[#f5f5f7] px-5 py-4">
        <span className="flex items-center gap-2 text-[17px] font-semibold tabular-nums text-[var(--neo-ink)]">
          <Flame size={20} className={streak > 0 ? 'text-[#ff9500]' : 'text-[#c7c7cc]'} />
          {streak}
        </span>
        <span className="flex items-center gap-2 text-[17px] font-semibold tabular-nums text-[var(--neo-ink)]">
          <TrendingUp size={20} className="text-[var(--neo)]" />
          {state.xp}
        </span>
        <span className="flex items-center gap-2 text-[17px] font-semibold tabular-nums text-[var(--neo-ink)]">
          <Heart size={20} className="text-[var(--game-wrong)]" />
          {state.hearts}
          {!heartsFull && (
            <span className="text-[12px] font-normal text-[var(--neo-gray)]">
              +1 em {minutesLeft(msToNextHeart(state))}min
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={state.sound ? 'Desligar som' : 'Ligar som'}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--neo-gray)]"
        >
          {state.sound ? <SoundOn size={18} /> : <SoundOff size={18} />}
        </button>
      </div>

      <section className="space-y-3">
        <button
          type="button"
          onClick={() => setGoalOpen(open => !open)}
          className="flex w-full items-baseline justify-between gap-3 px-1"
        >
          <span className="text-[13px] text-[var(--neo-gray)]">Meta do dia</span>
          <span className="text-[13px] tabular-nums text-[var(--neo)]">
            {state.dayXp}/{state.dailyGoal} XP
          </span>
        </button>
        <div className="game-bar">
          <div className="game-bar-fill" style={{ width: `${Math.round(goalProgress * 100)}%` }} />
        </div>
        {goalOpen && (
          <div className="flex flex-wrap gap-2 pt-1">
            {DAILY_GOAL_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setDailyGoal(option);
                  setGoalOpen(false);
                }}
                className={`game-chip ${
                  state.dailyGoal === option ? 'border-[var(--neo)] bg-[var(--neo-wash)] text-[var(--neo)]' : ''
                }`}
              >
                {option} XP
              </button>
            ))}
          </div>
        )}
        {goalProgress >= 1 && (
          <p className="px-1 text-[13px] text-[var(--game-right-ink)]">
            Meta batida hoje. A ofensiva está garantida.
          </p>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={startBlitz} className="game-tile items-start gap-3 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--neo-wash)] text-[var(--neo)]">
            <Zap size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-semibold text-[var(--neo-ink)]">
              Desafio relâmpago
            </span>
            <span className="block text-[13px] text-[var(--neo-gray)]">
              {BLITZ_SECONDS} segundos, sem gastar vidas
            </span>
          </span>
        </button>
        <button
          type="button"
          disabled={state.mistakes.length === 0}
          onClick={() => startMistakes()}
          className={`game-tile items-start gap-3 py-4 ${
            state.mistakes.length === 0 ? 'opacity-50' : ''
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--game-wrong-wash)] text-[var(--game-wrong)]">
            <Target size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-semibold text-[var(--neo-ink)]">
              Revisar erros
            </span>
            <span className="block text-[13px] text-[var(--neo-gray)]">
              {state.mistakes.length > 0
                ? `${state.mistakes.length} ${state.mistakes.length === 1 ? 'questão guardada' : 'questões guardadas'}`
                : 'Nenhum erro pendente'}
            </span>
          </span>
        </button>
      </div>

      <GameTrail
        state={state}
        spotlightTopic={spotlightTopic}
        spotlightLabel={spotlightLabel}
        onStart={startTrailNode}
        onOpenStudy={onOpenStudy}
      />

      <p className="px-1 pb-2 text-center text-[13px] leading-snug text-[var(--neo-gray)]">
        Conteúdo de estudo para revisão acadêmica. A conduta final é sempre do professor
        responsável pelo caso.
      </p>
    </div>
  );
};
