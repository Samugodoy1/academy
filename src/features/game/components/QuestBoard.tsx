import React from 'react';
import { Check, Gem, Gift, Target, TrendingUp, Trophy, Zap } from '../../../icons';
import type { Quest, QuestKind } from '../types';

const QUEST_ICON: Record<QuestKind, React.ElementType> = {
  xp: TrendingUp,
  lessons: Trophy,
  correct: Check,
  perfect: Gift,
  combo: Zap,
  mistakes: Target,
};

export const QuestBoard: React.FC<{ quests: Quest[] }> = ({ quests }) => {
  const done = quests.filter(quest => quest.progress >= quest.target).length;

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-[13px] text-[var(--neo-gray)]">Missões do dia</h2>
        <span className="text-[13px] tabular-nums text-[var(--neo-gray)]">
          {done}/{quests.length}
        </span>
      </div>
      <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
        {quests.map(quest => {
          const complete = quest.progress >= quest.target;
          const ratio = Math.min(1, quest.progress / Math.max(1, quest.target));
          const Icon = QUEST_ICON[quest.kind] ?? Target;
          return (
            <div
              key={quest.id}
              className="flex items-center gap-3 border-b border-black/[0.04] px-5 py-4 last:border-b-0"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  complete
                    ? 'bg-[var(--game-right)] text-white'
                    : 'bg-white text-[var(--neo-gray)]'
                }`}
              >
                {complete ? <Check size={18} /> : <Icon size={17} />}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[15px] font-medium tracking-[-0.011em] ${
                    complete ? 'text-[var(--neo-gray)] line-through' : 'text-[var(--neo-ink)]'
                  }`}
                >
                  {quest.title}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                    <span
                      className="block h-full rounded-full bg-[var(--game-right)] transition-[width] duration-500"
                      style={{ width: `${Math.round(ratio * 100)}%` }}
                    />
                  </span>
                  <span className="shrink-0 text-[12px] tabular-nums text-[var(--neo-gray)]">
                    {Math.min(quest.progress, quest.target)}/{quest.target}
                  </span>
                </div>
              </div>
              <span
                className={`flex shrink-0 items-center gap-1 text-[13px] font-semibold tabular-nums ${
                  complete ? 'text-[var(--game-right-ink)]' : 'text-[#0a84ff]'
                }`}
              >
                {quest.gems}
                <Gem size={13} />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
