import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Stethoscope } from '../icons';
import type { BoxPrepItem } from '../utils/clinicalIntelligence';

interface BoxModePrepProps {
  patientName: string;
  procedure: string;
  items: BoxPrepItem[];
  scheduleLabel?: string | null;
  onReviewItem?: (item: BoxPrepItem) => void;
  onOpenCase?: () => void;
}

const firstName = (name: string) => name.trim().split(' ')[0] || name;

export const BoxModePrep: React.FC<BoxModePrepProps> = ({
  patientName,
  procedure,
  items,
  scheduleLabel,
  onReviewItem,
  onOpenCase,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[24px] bg-white border border-academy-border/70 shadow-[0_8px_28px_rgba(15,23,42,0.05)] overflow-hidden"
    >
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-[12px] bg-academy-soft flex items-center justify-center">
            <Stethoscope size={16} className="text-academy-primary" />
          </div>
          <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-academy-muted">
            Modo clínica
          </span>
        </div>

        <h3 className="text-[20px] font-bold text-academy-text leading-snug">
          {firstName(patientName)}
        </h3>
        <p className="text-[14px] text-academy-muted mt-1">{procedure}</p>
        {scheduleLabel && (
          <p className="text-[12px] font-semibold text-academy-primary mt-2">{scheduleLabel}</p>
        )}

        <p className="text-[13px] text-academy-muted mt-4 leading-relaxed">
          Antes de começar — refrescar, não reaprender.
        </p>

        <div className="mt-4 space-y-2">
          {items.map((item, index) => (
            <motion.button
              key={`${item.label}-${index}`}
              whileTap={{ scale: 0.98, opacity: 0.92 }}
              onClick={() => onReviewItem?.(item)}
              className="w-full flex items-center gap-3 rounded-[16px] bg-academy-bg/80 border border-academy-border/60 px-4 py-3.5 text-left transition-colors hover:bg-academy-neutral/60"
            >
              <CheckCircle2 size={16} className="text-academy-success-text shrink-0" />
              <span className="flex-1 text-[14px] font-semibold text-academy-text">{item.label}</span>
              <span className="text-[12px] font-semibold text-academy-muted flex items-center gap-1 shrink-0">
                <Clock size={11} />
                {item.duration}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {onOpenCase && (
        <div className="px-6 pb-5 pt-3">
          <motion.button
            whileTap={{ scale: 0.98, opacity: 0.92 }}
            onClick={onOpenCase}
            className="w-full py-3 rounded-[16px] bg-academy-primary text-white text-[14px] font-bold transition-all"
          >
            Abrir caso
          </motion.button>
        </div>
      )}
    </motion.section>
  );
};
