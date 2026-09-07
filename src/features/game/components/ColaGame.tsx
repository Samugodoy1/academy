import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StudyKey } from '../../../utils/studyTopics';
import { STUDY_TOPIC_LABELS } from '../../../utils/studyTopics';
import { Flame, Gem, Heart, Shield, SoundOff, SoundOn, Target, Zap } from '../../../icons';
import { CAST, CharacterSay } from '../characters';
import { ALL_EXERCISES, getUnit } from '../content';
import {
  BLITZ_SECONDS,
  buildBlitzLesson,
  buildLesson,
  buildMistakesLesson,
  buildUnitReview,
  levelOf,
} from '../engine';
import { type GamePlan, type PlanBlock } from '../plan';
import {
  DAILY_GOAL_OPTIONS,
  HEART_REFILL_COST,
  MAX_HEARTS,
  STREAK_REPAIR_COST,
  canStartLesson,
  getUnitState,
  lessonsLeftToday,
  msToNextHeart,
} from '../progress';
import { canRepairStreak, streakAtRisk } from '../streak';
import { useGameState } from '../useGameState';
import type { LessonOutcome, LessonPlan, LessonReward } from '../types';
import { GameSession } from './GameSession';
import { GameTrail, type TrailSelection } from './GameTrail';
import { LessonComplete, LessonFailed } from './LessonComplete';
import { PlanSheet } from './PlanSheet';
import { QuestBoard } from './QuestBoard';
import { StreakCelebration } from './StreakCelebration';
import { StreakPanel } from './StreakPanel';

interface ColaGameProps {
  /** Topic of the student's next appointment: always unlocked and highlighted. */
  spotlightTopic?: StudyKey | null;
  spotlightLabel?: string | null;
  /** Opens straight into this topic's current lesson (used by "jogar a lição"). */
  autoStartTopic?: StudyKey | null;
  plan?: GamePlan;
  onOpenStudy?: (topic: StudyKey) => void;
  onUpgrade?: () => void;
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
  plan,
  onOpenStudy,
  onUpgrade,
}) => {
  const {
    state,
    limits,
    loseHeart,
    beginLesson,
    abandonLesson,
    completeLesson,
    failLesson,
    setDailyGoal,
    toggleSound,
    purchaseFreeze,
    purchaseHearts,
    purchaseStreakRepair,
  } = useGameState(plan ?? 'free');

  const [running, setRunning] = useState<RunningLesson | null>(null);
  const [result, setResult] = useState<{ outcome: LessonOutcome; reward: LessonReward } | null>(null);
  const [celebration, setCelebration] = useState<number | null>(null);
  const [noHearts, setNoHearts] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [streakOpen, setStreakOpen] = useState(false);
  const [planBlock, setPlanBlock] = useState<PlanBlock | null>(null);

  const streak = state.streak;
  const level = levelOf(state.xp);
  const goalProgress = Math.min(1, state.dayXp / Math.max(1, state.dailyGoal));
  const heartsFull = state.hearts >= MAX_HEARTS;
  const atRisk = streakAtRisk(state);
  const repairable = canRepairStreak(state);
  const lessonsLeft = lessonsLeftToday(state, new Date(), limits);

  /** O Siso comenta o estado do dia em vez de mais um aviso de sistema. */
  const sisoLine = (() => {
    if (repairable) {
      return `Sua ofensiva de ${state.lostStreak?.value} dias caiu. Dá para recuperar por ${STREAK_REPAIR_COST} cristais.`;
    }
    if (atRisk) {
      return `Você ainda não treinou hoje. Uma lição mantém a ofensiva de ${streak} ${streak === 1 ? 'dia' : 'dias'}.`;
    }
    if (goalProgress >= 1) return 'Meta do dia batida. Se quiser mais uma, eu topo.';
    if (streak > 0) return `Ofensiva de ${streak} ${streak === 1 ? 'dia' : 'dias'}. Bora manter.`;
    return 'Duas perguntas e você já esquenta. Escolhe um box aí embaixo.';
  })();

  const startTrailNode = useCallback(
    (selection: TrailSelection) => {
      const unit = getUnit(selection.topic);
      if (!unit) return;
      if (!canStartLesson(state, new Date(), limits)) {
        setPlanBlock('dailyLessons');
        return;
      }
      if (!limits.infiniteHearts && state.hearts <= 0) {
        setNoHearts(true);
        return;
      }
      const lessonPlan =
        selection.kind === 'review'
          ? buildUnitReview(unit, getUnitState(state, unit.topic).crowns)
          : buildLesson(unit, selection.index);
      beginLesson();
      setRunning({ plan: lessonPlan, useHearts: true });
    },
    [beginLesson, limits, state]
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
      const lessonPlan = buildMistakesLesson(
        ALL_EXERCISES,
        ids && ids.length > 0 ? ids : state.mistakes,
        `mistakes-${Date.now()}`
      );
      if (!lessonPlan) return;
      setNoHearts(false);
      setResult(null);
      setRunning({ plan: lessonPlan, useHearts: false });
    },
    [state.mistakes]
  );

  const startBlitz = useCallback(() => {
    if (!limits.blitz) {
      setPlanBlock('blitz');
      return;
    }
    setNoHearts(false);
    setResult(null);
    setRunning({
      plan: buildBlitzLesson(ALL_EXERCISES, `blitz-${Date.now()}`),
      useHearts: false,
      timeLimitSec: BLITZ_SECONDS,
    });
  }, [limits.blitz]);

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

  /** Results screen closes into the streak celebration when a mark was hit. */
  const closeResult = useCallback(() => {
    if (result && result.reward.milestone > 0) setCelebration(result.reward.milestone);
    setResult(null);
  }, [result]);

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
        useHearts={running.useHearts && !limits.infiniteHearts}
        soundOn={state.sound}
        timeLimitSec={running.timeLimitSec}
        onHeartLost={loseHeart}
        onFinish={handleFinish}
        onQuit={() => {
          if (running.useHearts) abandonLesson();
          setRunning(null);
        }}
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
        onContinue={closeResult}
        onReviewMistakes={
          result.outcome.missed.length > 0 ? () => startMistakes(result.outcome.missed) : undefined
        }
        onNextLesson={
          nextLesson && (limits.infiniteHearts || state.hearts > 0) && result.reward.milestone === 0
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

  if (celebration !== null) {
    return (
      <StreakCelebration
        milestone={celebration}
        soundOn={state.sound}
        onContinue={() => setCelebration(null)}
      />
    );
  }

  if (noHearts) {
    return (
      <LessonFailed
        minutesToHeart={minutesLeft(msToNextHeart(state, new Date(), limits))}
        gems={state.gems}
        refillCost={HEART_REFILL_COST}
        onPractice={() => (state.mistakes.length > 0 ? startMistakes() : startBlitz())}
        onRefill={() => {
          purchaseHearts();
          setNoHearts(false);
        }}
        onExit={() => setNoHearts(false)}
        onUpgrade={onUpgrade && !limits.infiniteHearts ? () => setPlanBlock('hearts') : undefined}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[560px] space-y-6">
      <div className="flex items-center justify-between gap-2 rounded-[24px] bg-[#f5f5f7] px-4 py-4 sm:px-5">
        <button
          type="button"
          onClick={() => setStreakOpen(open => !open)}
          aria-label="Ver ofensiva"
          className="flex items-center gap-2 text-[17px] font-semibold tabular-nums text-[var(--neo-ink)]"
        >
          <Flame size={20} className={streak > 0 && !atRisk ? 'text-[#ff9500]' : 'text-[#c7c7cc]'} />
          {streak}
        </button>
        <span className="flex items-center gap-2 text-[17px] font-semibold tabular-nums text-[var(--neo-ink)]">
          <Gem size={19} className="text-[#0a84ff]" />
          {state.gems}
        </span>
        <span className="flex items-center gap-2 text-[17px] font-semibold tabular-nums text-[var(--neo-ink)]">
          <Heart size={20} className="text-[var(--game-wrong)]" />
          {limits.infiniteHearts ? '∞' : state.hearts}
          {!limits.infiniteHearts && !heartsFull && (
            <span className="text-[12px] font-normal text-[var(--neo-gray)]">
              +1 em {minutesLeft(msToNextHeart(state, new Date(), limits))}min
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

      {!streakOpen && (
        <button
          type="button"
          onClick={() => setStreakOpen(true)}
          aria-label="Ver ofensiva"
          className="block w-full text-left"
        >
          <CharacterSay
            character={CAST.siso}
            text={sisoLine}
            size={72}
            mood={repairable ? 'sad' : atRisk ? 'wow' : goalProgress >= 1 ? 'cheer' : 'happy'}
            tone={repairable ? 'wrong' : 'default'}
          />
        </button>
      )}

      {streakOpen && (
        <StreakPanel
          state={state}
          limits={limits}
          onBuyFreeze={purchaseFreeze}
          onRepair={purchaseStreakRepair}
        />
      )}

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <span className="text-[13px] text-[var(--neo-gray)]">
            Nível {level.level} · {level.title}
          </span>
          <span className="text-[13px] tabular-nums text-[var(--neo-gray)]">
            {level.into}/{level.size} XP
          </span>
        </div>
        <div className="game-bar game-bar-thin">
          <div
            className="game-bar-fill game-bar-fill-xp"
            style={{ width: `${Math.round((level.into / level.size) * 100)}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => setGoalOpen(open => !open)}
          className="flex w-full items-baseline justify-between gap-3 px-1 pt-1"
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

      <QuestBoard quests={state.quests} />

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={startBlitz} className="game-tile items-start gap-3 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--neo-wash)] text-[var(--neo)]">
            <Zap size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 text-[16px] font-semibold text-[var(--neo-ink)]">
              Desafio relâmpago
              {!limits.blitz && (
                <span className="rounded-full bg-[var(--neo-wash)] px-2 py-0.5 text-[11px] font-medium text-[var(--neo)]">
                  Student
                </span>
              )}
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

      {lessonsLeft !== null && (
        <button
          type="button"
          onClick={() => setPlanBlock('dailyLessons')}
          className="flex w-full items-center gap-3 rounded-[20px] bg-[#f5f5f7] px-4 py-3 text-left"
        >
          <Shield size={16} className="shrink-0 text-[var(--neo-gray)]" />
          <span className="min-w-0 flex-1 text-[13px] leading-snug text-[var(--neo-gray)]">
            {lessonsLeft > 0
              ? `Plano Free: ${lessonsLeft} ${lessonsLeft === 1 ? 'lição' : 'lições'} de trilha ainda hoje.`
              : 'Plano Free: as lições de hoje acabaram. Revisar erros continua liberado.'}
          </span>
          <span className="shrink-0 text-[13px] font-medium text-[var(--neo)]">Ver ›</span>
        </button>
      )}

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

      {planBlock && (
        <PlanSheet
          block={planBlock}
          onClose={() => setPlanBlock(null)}
          onUpgrade={
            onUpgrade
              ? () => {
                  setPlanBlock(null);
                  onUpgrade();
                }
              : undefined
          }
        />
      )}
    </div>
  );
};
