import React from 'react';
import { STAGE_LABEL, type AcademyStage } from '../theme/academyStage';

const OPTIONS: Array<{ id: AcademyStage; hint: string }> = [
  { id: 'pre-clinico', hint: 'Ainda sem pacientes' },
  { id: 'clinico', hint: 'Já atendo' },
];

interface AcademyStageControlProps {
  value: AcademyStage | null;
  onChange: (stage: AcademyStage) => void;
  /** Big tappable cards (onboarding) instead of the compact segmented pill. */
  size?: 'compact' | 'cards';
}

export const AcademyStageControl: React.FC<AcademyStageControlProps> = ({ value, onChange, size = 'compact' }) => {
  if (size === 'cards') {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map(option => {
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={active}
              className={`rounded-[24px] px-5 py-5 text-left transition-colors ios-press-gentle ${
                active ? 'bg-[var(--neo)] text-white' : 'bg-[#f5f5f7] text-[var(--neo-ink)]'
              }`}
            >
              <p className="text-[20px] font-semibold leading-[1.1] tracking-[-0.02em]">{STAGE_LABEL[option.id]}</p>
              <p className={`mt-1 text-[14px] ${active ? 'text-white/85' : 'text-[var(--neo-gray)]'}`}>{option.hint}</p>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 rounded-full bg-[#f5f5f7] p-1" role="radiogroup" aria-label="Fase do curso">
      {OPTIONS.map(option => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={`rounded-full py-2.5 text-[14px] font-medium transition-all ${
              active ? 'bg-white text-[var(--neo-ink)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-[var(--neo-gray)]'
            }`}
          >
            {STAGE_LABEL[option.id]}
          </button>
        );
      })}
    </div>
  );
};
