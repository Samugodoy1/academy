import React from 'react';
import { COMPETENCIES, countUnlockedCompetencies, isCompetencyUnlocked } from '../session/competencies';
import type { SessionProgress } from '../session/sessionProgress';
import type { ReviewState } from '../session/review';
import { BaseSection, GroupedList } from './ui';

interface CompetenciesPanelProps {
  session: SessionProgress;
  review: ReviewState;
}

export function CompetenciesPanel({ session, review }: CompetenciesPanelProps) {
  const unlocked = countUnlockedCompetencies(session, review);
  const total = COMPETENCIES.length;

  return (
    <BaseSection kicker={`Competências · ${unlocked} de ${total}`}>
      <GroupedList>
        {COMPETENCIES.map(c => {
          const on = isCompetencyUnlocked(c, session, review);
          return (
            <div
              key={c.id}
              className={`border-b border-black/[0.04] px-5 py-4 last:border-b-0 ${on ? '' : 'opacity-55'}`}
            >
              <p className="text-[15px] font-semibold tracking-[-0.011em] text-[var(--neo-ink)]">{c.title}</p>
              <p className="mt-0.5 text-[14px] leading-snug text-[var(--neo-gray)]">{c.short}</p>
            </div>
          );
        })}
      </GroupedList>
    </BaseSection>
  );
}
