import React from 'react';
import { Check, Sparkles } from '../../../icons';
import { BLOCK_COPY, STUDENT_PERKS, type PlanBlock } from '../plan';

interface PlanSheetProps {
  block: PlanBlock;
  onClose: () => void;
  onUpgrade?: () => void;
}

/** Shown when a Free limit stops the run. Never blocks what is already unlocked. */
export const PlanSheet: React.FC<PlanSheetProps> = ({ block, onClose, onUpgrade }) => {
  const copy = BLOCK_COPY[block];

  return (
    <div className="fixed inset-0 z-[210] flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="game-pop w-full max-w-[440px] rounded-[28px] bg-white px-6 py-7">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--neo-wash)] text-[var(--neo)]">
          <Sparkles size={24} />
        </span>
        <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--neo-gray)]">
          Academy Free
        </p>
        <h2 className="mt-1 text-[26px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--neo-ink)]">
          {copy.title}
        </h2>
        <p className="mt-2 text-[15px] leading-snug text-[var(--neo-gray)]">{copy.body}</p>

        <div className="mt-5 space-y-2">
          {STUDENT_PERKS.map(perk => (
            <div
              key={perk}
              className="flex items-center gap-3 rounded-[16px] bg-[var(--neo-wash)] px-3 py-2.5 text-[14px] font-medium text-[var(--neo-ink)]"
            >
              <Check size={15} className="shrink-0 text-[var(--neo)]" />
              {perk}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {onUpgrade && (
            <button type="button" onClick={onUpgrade} className="game-cta">
              Conhecer o Student
            </button>
          )}
          <button type="button" onClick={onClose} className="game-cta game-cta-ghost">
            Continuar no Free
          </button>
        </div>
      </div>
    </div>
  );
};
