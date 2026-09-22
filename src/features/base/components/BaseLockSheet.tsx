import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from '../../../icons';
import { BASE_BLOCK_COPY, BASE_STUDENT_PERKS, type BaseBlock } from '../plan';

interface BaseLockSheetProps {
  block: BaseBlock;
  /** Title of what was tapped, e.g. the summary name. */
  subject?: string;
  onClose: () => void;
  onUpgrade?: () => void;
}

/**
 * Shown when Free reaches a locked summary or mind map. It never hides what
 * is already open, and it names exactly what the student was about to read.
 */
export const BaseLockSheet: React.FC<BaseLockSheetProps> = ({ block, subject, onClose, onUpgrade }) => {
  const copy = BASE_BLOCK_COPY[block];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="base-lock-title"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] rounded-[28px] bg-white px-6 py-7"
        onClick={event => event.stopPropagation()}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--neo-wash)] text-[var(--neo)]">
          <Lock size={20} />
        </span>
        <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--neo-gray)]">Academy Free</p>
        <h2 id="base-lock-title" className="mt-1 text-[26px] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--neo-ink)]">
          {copy.title}
        </h2>
        {subject && (
          <p className="mt-2 text-[15px] font-semibold tracking-[-0.011em] text-[var(--neo-ink)]">{subject}</p>
        )}
        <p className="mt-2 text-[15px] leading-snug text-[var(--neo-gray)]">{copy.body}</p>

        <div className="mt-5 space-y-2">
          {BASE_STUDENT_PERKS.map(perk => (
            <div
              key={perk}
              className="flex items-center gap-3 rounded-[16px] bg-[var(--neo-wash)] px-3 py-2.5 text-[14px] font-medium text-[var(--neo-ink)]"
            >
              <Check size={15} className="shrink-0 text-[var(--neo)]" />
              {perk}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {onUpgrade && (
            <button type="button" onClick={onUpgrade} className="neo-pill w-full">
              Conhecer o Student
            </button>
          )}
          <button type="button" onClick={onClose} className="neo-pill-secondary w-full !bg-[#f5f5f7]">
            Continuar no Free
          </button>
        </div>
      </motion.div>
    </div>
  );
};
