import React, { useCallback, useEffect, useState } from 'react';
import { Flame } from '../../icons';
import { limitsFor, type GamePlan } from './plan';
import { loadLocalGameState } from './sync';
import { streakAtRisk } from './streak';
import type { GameState } from './types';

interface ColaShortcutProps {
  plan?: GamePlan;
  onOpen: () => void;
}

/**
 * Home card for the game. Deliberately imports no exercise content so the
 * dashboard bundle stays small — only the saved progress is read.
 */
export const ColaShortcut: React.FC<ColaShortcutProps> = ({ plan, onOpen }) => {
  const [state, setState] = useState<GameState | null>(null);

  const refresh = useCallback(() => {
    setState(loadLocalGameState(new Date(), limitsFor(plan ?? 'free')));
  }, [plan]);

  useEffect(() => {
    refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh]);

  if (!state) return null;

  const atRisk = streakAtRisk(state);
  const goalProgress = Math.min(1, state.dayXp / Math.max(1, state.dailyGoal));
  const goalDone = goalProgress >= 1;
  const questsLeft = state.quests.filter(quest => quest.progress < quest.target).length;

  const headline = (() => {
    if (atRisk) return `Sua ofensiva de ${state.streak} ${state.streak === 1 ? 'dia' : 'dias'} está em risco`;
    if (goalDone) return 'Meta do dia batida';
    if (state.streak > 0) return `${state.streak} ${state.streak === 1 ? 'dia' : 'dias'} de ofensiva`;
    if (state.xp > 0) return 'Retome o treino';
    return 'Treine a clínica jogando';
  })();

  const subline = (() => {
    if (atRisk) return 'Uma lição de 2 minutos hoje mantém a chama acesa.';
    if (goalDone && questsLeft > 0) {
      return `Ainda dá para fechar ${questsLeft} ${questsLeft === 1 ? 'missão' : 'missões'} do dia.`;
    }
    if (goalDone) return 'Todas as missões do dia estão fechadas. Que dia.';
    if (state.xp > 0) return `Faltam ${state.dailyGoal - state.dayXp} XP para a meta de hoje.`;
    return 'Lições curtas de exame, anestesia, endo e mais.';
  })();

  return (
    <button
      type="button"
      onClick={onOpen}
      className="ah-card w-full px-5 py-5 text-left ios-press-gentle"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[17px] font-semibold leading-[1.15] tracking-[-0.016em] text-[var(--neo-ink)]">
            {headline}
          </p>
          <p className="mt-1 text-[15px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
            {subline}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[15px] tabular-nums text-[var(--neo-gray)]">
          <Flame size={16} className="text-[var(--neo-gray)]" />
          {state.streak}
        </span>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-black/[0.06]">
        <span
          className="block h-full rounded-full bg-[#1d1d1f]"
          style={{ width: `${Math.round(goalProgress * 100)}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-[var(--neo-gray)]">
        <span className="tabular-nums">
          {state.dayXp}/{state.dailyGoal} XP · {state.gems} gemas
        </span>
        <span className="text-[var(--neo-ink)]">Treinar ›</span>
      </div>
    </button>
  );
};
