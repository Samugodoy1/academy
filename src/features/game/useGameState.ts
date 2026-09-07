import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyDayRollover,
  loadGameState,
  regenerateHearts,
  registerFailedLesson,
  registerLessonResult,
  saveGameState,
  spendHeart,
} from './progress';
import type { GameState, LessonOutcome, LessonReward } from './types';

const TICK_MS = 15000;

/**
 * Single owner of the game state: keeps a ref in sync so lesson results are
 * computed exactly once (React 18 can invoke state updaters twice).
 */
export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadGameState());
  const stateRef = useRef(state);
  stateRef.current = state;

  const commit = useCallback((next: GameState) => {
    stateRef.current = next;
    setState(next);
    saveGameState(next);
  }, []);

  // Hearts refill and the daily counter turn over while the page stays open.
  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = new Date();
      const next = applyDayRollover(regenerateHearts(stateRef.current, now), now);
      if (next !== stateRef.current) commit(next);
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [commit]);

  const loseHeart = useCallback(() => {
    commit(spendHeart(stateRef.current));
  }, [commit]);

  const completeLesson = useCallback(
    (outcome: LessonOutcome): LessonReward => {
      const { state: next, reward } = registerLessonResult(stateRef.current, outcome);
      commit(next);
      return reward;
    },
    [commit]
  );

  const failLesson = useCallback(
    (outcome: LessonOutcome) => {
      commit(registerFailedLesson(stateRef.current, outcome));
    },
    [commit]
  );

  const setDailyGoal = useCallback(
    (dailyGoal: number) => {
      commit({ ...stateRef.current, dailyGoal });
    },
    [commit]
  );

  const toggleSound = useCallback(() => {
    commit({ ...stateRef.current, sound: !stateRef.current.sound });
  }, [commit]);

  return { state, loseHeart, completeLesson, failLesson, setDailyGoal, toggleSound };
}
