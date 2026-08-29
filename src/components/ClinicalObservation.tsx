import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope } from '../icons';
import type { ClinicalObservation as ClinicalObservationType, ObservationAccent } from '../utils/clinicalIntelligence';

const ACCENT_STYLES: Record<ObservationAccent, string> = {
  violet: 'liquid-glass-card border-primary/8',
  rose: 'liquid-glass-card border-rose-200/60',
  amber: 'liquid-glass-card border-amber-200/60',
  sky: 'liquid-glass-card border-sky-200/60',
  emerald: 'liquid-glass-card border-emerald-200/60',
  neutral: 'liquid-glass-card border-academy-border/60',
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
      className={`flex items-start gap-3 rounded-2xl px-5 py-4 ${ACCENT_STYLES[observation.accent]}`}
    >
      <Stethoscope size={16} className={`mt-0.5 shrink-0 ${ACCENT_ICON[observation.accent]}`} />
      <p className="text-[14px] font-medium text-academy-text leading-snug">
        {observation.text}
      </p>
    </motion.div>
  );
};
