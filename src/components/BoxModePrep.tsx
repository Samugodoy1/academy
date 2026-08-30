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
      className="comic-card overflow-hidden"
    >
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <ChairGlyph size={28} />
          <span className="font-display text-[12px] font-extrabold uppercase tracking-[0.12em] text-primary">
            Antes de sentar na cadeira
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
          Só o que vale relembrar agora. Nada de estudar a matéria inteira.
        </p>

        <div className="mt-4 space-y-2">
          {items.map((item, index) => (
            <motion.button
              key={`${item.label}-${index}`}
              whileTap={{ scale: 0.98, opacity: 0.92 }}
              onClick={() => onReviewItem?.(item)}
              className="w-full flex items-center gap-3 rounded-[16px] liquid-glass-subtle px-4 py-3.5 text-left transition-colors hover:bg-white/70"
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
          <DuoButton onClick={onOpenCase}>Abrir caso</DuoButton>
        </div>
      )}
    </motion.section>
  );
};
