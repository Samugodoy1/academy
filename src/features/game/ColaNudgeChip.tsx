import React, { useCallback, useEffect, useState } from 'react';
import { limitsFor, type GamePlan } from './plan';
import { loadLocalGameState } from './sync';
interface ColaNudgeChipProps {
  plan?: GamePlan;
  onOpen: () => void;
}

export function ColaNudgeChip({ plan, onOpen }: ColaNudgeChipProps) {
  const [label, setLabel] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const state = loadLocalGameState(new Date(), limitsFor(plan ?? 'free'));
    const goalDone = state.dayXp >= state.dailyGoal;
    setLabel(goalDone ? null : 'Ofensiva');
  }, [plan]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!label) return null;

  return (
    <button type="button" onClick={onOpen} className="cola-chip" aria-label="Manter a ofensiva da Cola">
      <span className="student-mark-dot" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
