import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { limitsFor, type GamePlan } from './plan';
import {
  applyDailyGoal,
  buyFreeze,
  buyHearts,
  loadGameState,
  refreshState,
  registerFailedLesson,
  registerLessonResult,
  repairStreak,
  saveGameState,
  spendHeart,
  startLesson,
} from './progress';
import type { GameState, LessonOutcome, LessonReward } from './types';

const TICK_MS = 15000;

/**
 * Single owner of the game state: keeps a ref in sync so lesson results are
 * computed exactly once (React 18 can invoke state updaters twice).
 */
export function useGameState(plan: GamePlan = 'free') {
  const limits = useMemo(() => limitsFor(plan), [plan]);
  const limitsRef = useRef(limits);
  limitsRef.current = limits;

  const [state, setState] = useState<GameState>(() => loadGameState(new Date(), limits));
  const stateRef = useRef(state);
  stateRef.current = state;

  const commit = useCallback((next: GameState) => {
    stateRef.current = next;
    setState(next);
    saveGameState(next);
  }, []);

  // Hearts, quests and the streak all move with the clock while the page is open.
  useEffect(() => {
    const sync = () => {
      const next = refreshState(stateRef.current, new Date(), limitsRef.current);
      if (next !== stateRef.current) commit(next);
    };
    sync();
    const timer = window.setInterval(sync, TICK_MS);
    return () => window.clearInterval(timer);
  }, [commit, limits]);

  const loseHeart = useCallback(() => {
    commit(spendHeart(stateRef.current, new Date(), limitsRef.current));
  }, [commit]);

  const beginLesson = useCallback(() => {
    commit(startLesson(stateRef.current));
  }, [commit]);

  const completeLesson = useCallback(
    (outcome: LessonOutcome): LessonReward => {
      const { state: next, reward } = registerLessonResult(
        stateRef.current,
        outcome,
        new Date(),
        limitsRef.current
      );
      commit(next);
      return reward;
    },
    [commit]
  );

  const failLesson = useCallback(
    (outcome: LessonOutcome) => {
      commit(registerFailedLesson(stateRef.current, outcome, new Date(), limitsRef.current));
    },
    [commit]
  );

  const setDailyGoal = useCallback(
    (dailyGoal: number) => {
      commit(applyDailyGoal(stateRef.current, dailyGoal));
    },
    [commit]
  );

  const toggleSound = useCallback(() => {
    commit({ ...stateRef.current, sound: !stateRef.current.sound });
  }, [commit]);

  const purchaseFreeze = useCallback(() => {
    commit(buyFreeze(stateRef.current, limitsRef.current));
  }, [commit]);

  const purchaseHearts = useCallback(() => {
    commit(buyHearts(stateRef.current, new Date(), limitsRef.current));
  }, [commit]);

  const purchaseStreakRepair = useCallback(() => {
    commit(repairStreak(stateRef.current));
  }, [commit]);

  return {
    state,
    limits,
    loseHeart,
    beginLesson,
    completeLesson,
    failLesson,
    setDailyGoal,
    toggleSound,
    purchaseFreeze,
    purchaseHearts,
    purchaseStreakRepair,
  };
}
