import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from '../icons';
import type { ClinicalObservation as ClinicalObservationType, ObservationAccent } from '../utils/clinicalIntelligence';

const ACCENT_STYLES: Record<ObservationAccent, string> = {
  violet: 'bg-violet-50/70 border-violet-100/60 text-[#3A3A3C]',
  rose: 'bg-rose-50/70 border-rose-100/60 text-[#3A3A3C]',
  amber: 'bg-amber-50/70 border-amber-100/60 text-[#3A3A3C]',
  sky: 'bg-sky-50/70 border-sky-100/60 text-[#3A3A3C]',
  emerald: 'bg-emerald-50/70 border-emerald-100/60 text-[#3A3A3C]',
  neutral: 'bg-academy-neutral/80 border-academy-border/70 text-[#3A3A3C]',
};

const ACCENT_ICON: Record<ObservationAccent, string> = {
  violet: 'text-academy-primary',
  rose: 'text-academy-attention-text',
  amber: 'text-academy-alert-text',
  sky: 'text-sky-600',
  emerald: 'text-academy-success-text',
  neutral: 'text-academy-primary',
};

interface ClinicalObservationProps {
  observation: ClinicalObservationType | null;
}

export const ClinicalObservation: React.FC<ClinicalObservationProps> = ({ observation }) => {
  if (!observation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className={`flex items-start gap-3 rounded-2xl px-5 py-4 border ${ACCENT_STYLES[observation.accent]}`}
    >
      <Sparkles size={16} className={`mt-0.5 shrink-0 ${ACCENT_ICON[observation.accent]}`} />
      <p className="text-[14px] font-medium leading-snug">
        {observation.text}
      </p>
    </motion.div>
  );
};
