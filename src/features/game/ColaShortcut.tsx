import React, { useCallback, useEffect, useState } from 'react';
import { ChevronRight, Flame, Gem, Target } from '../../icons';
import { limitsFor, type GamePlan } from './plan';
import { loadGameState } from './progress';
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
    setState(loadGameState(new Date(), limitsFor(plan ?? 'free')));
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
      className={`w-full rounded-[24px] px-5 py-5 text-left ${
        atRisk ? 'bg-[#fff3e0]' : 'bg-[#f5f5f7]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[22px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--neo-ink)]">
            {headline}
          </p>
          <p className="mt-2 text-[15px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
            {subline}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[17px] font-semibold tabular-nums text-[var(--neo-ink)]">
          <Flame size={20} className={state.streak > 0 && !atRisk ? 'text-[#ff9500]' : 'text-[#c7c7cc]'} />
          {state.streak}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <span
          className="block h-full rounded-full bg-[var(--neo)]"
          style={{ width: `${Math.round(goalProgress * 100)}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-[var(--neo-gray)]">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1 tabular-nums">
            <Target size={13} /> {state.dayXp}/{state.dailyGoal} XP
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <Gem size={13} className="text-[#0a84ff]" /> {state.gems}
          </span>
        </span>
        <span className="flex items-center gap-0.5 font-medium text-[var(--neo)]">
          Treinar <ChevronRight size={14} />
        </span>
      </div>
    </button>
  );
};
