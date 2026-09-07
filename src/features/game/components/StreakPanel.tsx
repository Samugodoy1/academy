import React from 'react';
import { Check, Flame, Gem, Restore, Shield } from '../../../icons';
import { FREEZE_COST, STREAK_REPAIR_COST } from '../progress';
import type { PlanLimits } from '../plan';
import {
  canRepairStreak,
  freezeJustUsed,
  nextMilestone,
  streakAtRisk,
  weekStrip,
  type DayCell,
} from '../streak';
import type { GameState } from '../types';

interface StreakPanelProps {
  state: GameState;
  limits: PlanLimits;
  onBuyFreeze: () => void;
  onRepair: () => void;
}

const CELL_STYLE: Record<DayCell['status'], string> = {
  done: 'bg-[#ff9500] text-white',
  frozen: 'bg-[#e3f0ff] text-[#0a84ff]',
  today: 'border-2 border-dashed border-[#ff9500] text-[#ff9500]',
  missed: 'bg-[#f0f0f2] text-[#c7c7cc]',
  future: 'bg-[#f7f7f8] text-[#d9d9de]',
};

export const StreakPanel: React.FC<StreakPanelProps> = ({
  state,
  limits,
  onBuyFreeze,
  onRepair,
}) => {
  const days = weekStrip(state);
  const atRisk = streakAtRisk(state);
  const saved = freezeJustUsed(state);
  const repairable = canRepairStreak(state);
  const upcoming = nextMilestone(state.streak);
  const canBuyFreeze = state.gems >= FREEZE_COST && state.freezes < limits.maxFreezes;

  const headline = (() => {
    if (repairable && state.lostStreak) {
      return `Sua ofensiva de ${state.lostStreak.value} dias caiu`;
    }
    if (state.streak === 0) return 'Comece sua ofensiva hoje';
    if (atRisk) return `Sua ofensiva de ${state.streak} ${state.streak === 1 ? 'dia' : 'dias'} está em risco`;
    return `${state.streak} ${state.streak === 1 ? 'dia' : 'dias'} de ofensiva`;
  })();

  const subline = (() => {
    if (repairable) return null;
    if (state.streak === 0) return 'Uma lição por dia mantém a chama acesa.';
    if (atRisk) return 'Termine uma lição hoje para não perder o que já construiu.';
    if (upcoming) return `Faltam ${upcoming - state.streak} ${upcoming - state.streak === 1 ? 'dia' : 'dias'} para a marca de ${upcoming}.`;
    return 'Ofensiva garantida hoje.';
  })();

  return (
    <section className="space-y-3 rounded-[24px] bg-[#f5f5f7] px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Flame
              size={26}
              className={state.streak > 0 && !atRisk ? 'text-[#ff9500]' : 'text-[#c7c7cc]'}
            />
            <h3 className="text-[20px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--neo-ink)]">
              {headline}
            </h3>
          </div>
          {subline && (
            <p className="mt-1 text-[14px] leading-snug text-[var(--neo-gray)]">{subline}</p>
          )}
        </div>
        {state.bestStreak > 0 && (
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[12px] font-medium tabular-nums text-[var(--neo-gray)]">
            recorde {state.bestStreak}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-1 pt-1">
        {days.map(day => (
          <div key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[11px] font-medium text-[var(--neo-gray)]">{day.label}</span>
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${CELL_STYLE[day.status]}`}
            >
              {day.status === 'done' && <Check size={16} />}
              {day.status === 'frozen' && <Shield size={14} />}
            </span>
          </div>
        ))}
      </div>

      {saved && !repairable && (
        <p className="flex items-center gap-2 rounded-[16px] bg-[#e3f0ff] px-3 py-2 text-[13px] leading-snug text-[#0a6cd8]">
          <Shield size={14} className="shrink-0" />
          Um protetor cobriu o dia que você não jogou.
        </p>
      )}

      {repairable && state.lostStreak && (
        <div className="rounded-[18px] bg-white px-4 py-3">
          <p className="text-[15px] leading-snug text-[var(--neo-ink)]">
            Dá para trazer de volta antes que ela esfrie de vez. Depois disso, a contagem recomeça
            do zero.
          </p>
          <button
            type="button"
            disabled={state.gems < STREAK_REPAIR_COST}
            onClick={onRepair}
            className={`game-cta mt-3 ${state.gems < STREAK_REPAIR_COST ? 'opacity-50' : ''}`}
          >
            <Restore size={15} />
            Recuperar por {STREAK_REPAIR_COST}
            <Gem size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="flex items-center gap-2 text-[13px] text-[var(--neo-gray)]">
          <Shield size={15} className={state.freezes > 0 ? 'text-[#0a84ff]' : 'text-[#c7c7cc]'} />
          {state.freezes} de {limits.maxFreezes} {state.freezes === 1 ? 'protetor' : 'protetores'}
        </span>
        {state.freezes < limits.maxFreezes && (
          <button
            type="button"
            disabled={!canBuyFreeze}
            onClick={onBuyFreeze}
            className={`flex items-center gap-1.5 text-[13px] font-medium text-[var(--neo)] ${
              canBuyFreeze ? '' : 'opacity-50'
            }`}
          >
            Comprar por {FREEZE_COST}
            <Gem size={13} />
          </button>
        )}
      </div>
    </section>
  );
};
