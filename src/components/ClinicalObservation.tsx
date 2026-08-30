import React from 'react';
import { motion } from 'framer-motion';
import type { ClinicalObservation as ClinicalObservationType } from '../utils/clinicalIntelligence';

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
      className="siso-bubble"
    >
      <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary mb-1">
        Recado do box
      </p>
      <p className="text-[15px] font-bold text-academy-text leading-snug">
        {observation.text}
      </p>
    </motion.div>
  );
};
