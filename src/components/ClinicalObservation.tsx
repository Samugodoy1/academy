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
      <p className="text-[13px] font-normal text-apple-gray mb-1 tracking-[-0.011em]">
        Recado
      </p>
      <p className="text-[17px] font-normal text-apple-ink leading-snug tracking-[-0.011em]">
        {observation.text}
      </p>
    </motion.div>
  );
};
