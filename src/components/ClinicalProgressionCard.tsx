import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from '../icons';
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
      className="comic-card overflow-hidden px-6 py-7"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <CheckMolarGlyph size={24} />
        <span className="text-[13px] font-normal text-apple-gray tracking-[-0.011em]">
          Progressão clínica
        </span>
      </div>

      {highlights.length > 0 && (
        <div className="space-y-3">
          <p className="text-[13px] text-apple-gray">Você já realizou</p>
          <div className="space-y-2">
            {highlights.map(item => (
              <div key={item.skill} className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-apple-green shrink-0" />
                <span className="text-[17px] text-sys-text">
                  {item.count} {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {nextStep && (
        <div className={`${highlights.length > 0 ? 'mt-6 pt-5 border-t border-apple-line' : ''}`}>
          <p className="text-[13px] text-apple-gray mb-1.5">Próximo passo sugerido</p>
          <p className="text-[22px] font-semibold text-sys-text leading-[1.05] tracking-[-0.025em]">{nextStep.label}</p>
          <p className="text-[15px] text-apple-gray mt-2 leading-relaxed">{nextStep.reason}</p>
        </div>
      )}

      {nextStep?.studyTopic && onReviewNextStep && (
        <div className="pt-5 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onReviewNextStep}
            className="apple-link inline-flex items-center gap-1"
          >
            Revisar
            <span aria-hidden>›</span>
          </motion.button>
        </div>
      )}
    </motion.section>
  );
};
