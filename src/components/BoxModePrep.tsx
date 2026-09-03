import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from '../icons';
import { ChairGlyph } from '../illustrations/glyphs';
import { DuoButton } from './DuoButton';
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
      className="overflow-hidden rounded-[26px] bg-[var(--neo-soft)] px-6 py-7"
    >
      <div className="flex items-center gap-2 mb-4">
        <ChairGlyph size={24} />
        <span className="text-[13px] font-normal text-apple-gray tracking-[-0.011em]">
          Modo box
        </span>
      </div>

      <h3 className="text-[28px] font-semibold text-sys-text leading-[1.05] tracking-[-0.025em]">
        {firstName(patientName)}
      </h3>
      <p className="text-[17px] text-apple-gray mt-2 tracking-[-0.011em]">{procedure}</p>
      {scheduleLabel && (
        <p className="text-[13px] text-[var(--neo)] mt-2">{scheduleLabel}</p>
      )}

      <p className="text-[15px] text-apple-gray mt-5 leading-relaxed">
        Antes de começar — refrescar, não reaprender.
      </p>

      <div className="mt-5 space-y-1">
        {items.map((item, index) => (
          <motion.button
            key={`${item.label}-${index}`}
            whileTap={{ scale: 0.98, opacity: 0.92 }}
            onClick={() => onReviewItem?.(item)}
              className="w-full flex items-center gap-3 rounded-[16px] bg-white px-4 py-3.5 text-left"
          >
            <CheckCircle2 size={16} className="text-[var(--neo)] shrink-0" />
              <span className="flex-1 text-[17px] text-sys-text">{item.label}</span>
            <span className="text-[13px] text-apple-gray flex items-center gap-1 shrink-0">
              <Clock size={11} />
              {item.duration}
            </span>
          </motion.button>
        ))}
      </div>

      {onOpenCase && (
        <div className="pt-5">
          <DuoButton onClick={onOpenCase}>Abrir caso</DuoButton>
        </div>
      )}
    </motion.section>
  );
};
