import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from '../icons';
import type { AcademyNotice } from './academyNotices';

interface AcademyToastProps {
  notice: AcademyNotice;
  onDismiss: () => void;
}

export const AcademyToast: React.FC<AcademyToastProps> = ({ notice, onDismiss }) => {
  const isError = notice.type === 'error';
  const live = isError ? 'assertive' : 'polite';

  const runAction = (fn?: () => void) => {
    fn?.();
    onDismiss();
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] flex justify-center px-3 pt-[max(10px,env(safe-area-inset-top))]">
      <motion.div
        role="status"
        aria-live={live}
        initial={{ opacity: 0, y: -18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 520, damping: 38, mass: 0.7 }}
        drag="y"
        dragConstraints={{ top: -72, bottom: 8 }}
        dragElastic={0.08}
        onDragEnd={(_, info) => {
          if (info.offset.y < -28 || info.velocity.y < -400) onDismiss();
        }}
        className="academy-banner pointer-events-auto flex w-full max-w-[400px] items-center gap-3 px-3.5 py-2.5"
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            isError
              ? 'bg-[color-mix(in_srgb,#ff3b30_14%,transparent)] text-[var(--apple-red)]'
              : 'bg-[color-mix(in_srgb,#30d158_16%,transparent)] text-[var(--apple-green)]'
          }`}
        >
          {isError ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
        </span>
        <p className="min-w-0 flex-1 text-[13px] font-medium leading-snug tracking-[-0.016em] text-[var(--sys-text)]">
          {notice.message}
        </p>
        {notice.onAction && notice.actionLabel && (
          <button
            type="button"
            onClick={() => runAction(notice.onAction)}
            className="shrink-0 text-[13px] font-semibold tracking-[-0.016em] text-[var(--apple-blue)]"
          >
            {notice.actionLabel}
          </button>
        )}
        {notice.onUndo && (
          <button
            type="button"
            onClick={() => runAction(notice.onUndo)}
            className="shrink-0 text-[13px] font-semibold tracking-[-0.016em] text-[var(--apple-blue)]"
          >
            Desfazer
          </button>
        )}
      </motion.div>
    </div>
  );
};
