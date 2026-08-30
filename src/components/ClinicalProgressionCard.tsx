import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from '../icons';
import { CheckMolarGlyph } from '../illustrations/glyphs';
import type { NextStepSuggestion, SkillCount } from '../utils/clinicalProgression';

interface ClinicalProgressionCardProps {
  highlights: SkillCount[];
  nextStep: NextStepSuggestion | null;
  onReviewNextStep?: () => void;
}

export const ClinicalProgressionCard: React.FC<ClinicalProgressionCardProps> = ({
  highlights,
  nextStep,
  onReviewNextStep,
}) => {
  if (highlights.length === 0 && !nextStep) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="comic-card overflow-hidden"
    >
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2.5 mb-4">
          <CheckMolarGlyph size={28} />
          <span className="font-display text-[12px] font-extrabold uppercase tracking-[0.12em] text-primary">
            Progressão clínica
          </span>
        </div>

        {highlights.length > 0 && (
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-academy-muted">Você já realizou</p>
            <div className="space-y-2">
              {highlights.map(item => (
                <div key={item.skill} className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-academy-success-text shrink-0" />
                  <span className="text-[15px] font-semibold text-academy-text">
                    {item.count} {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {nextStep && (
          <div className={`${highlights.length > 0 ? 'mt-6 pt-5 border-t border-academy-border/60' : ''}`}>
            <p className="text-[13px] font-semibold text-academy-muted mb-1.5">Próximo passo sugerido</p>
            <p className="text-[18px] font-bold text-academy-text leading-snug">{nextStep.label}</p>
            <p className="text-[13px] text-academy-muted mt-1.5 leading-relaxed">{nextStep.reason}</p>
          </div>
        )}
      </div>

      {nextStep?.studyTopic && onReviewNextStep && (
        <div className="px-6 pb-5 pt-4 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.96, opacity: 0.9 }}
            onClick={onReviewNextStep}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-[14px] duo-btn duo-btn-active font-display text-[13px] font-extrabold uppercase tracking-[0.1em]"
          >
            Revisar
            <ChevronRight size={14} />
          </motion.button>
        </div>
      )}
    </motion.section>
  );
};
