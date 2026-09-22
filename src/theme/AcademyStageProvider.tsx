import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { persistAcademyStage, readAcademyStage, resolveAcademyStage, type AcademyStage } from './academyStage';

interface AcademyStageContextValue {
  /** What the student explicitly chose; null until they answer. */
  stored: AcademyStage | null;
  setStage: (stage: AcademyStage | null) => void;
}

const AcademyStageContext = createContext<AcademyStageContextValue>({
  stored: null,
  setStage: () => {},
});

export function AcademyStageProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<AcademyStage | null>(readAcademyStage);

  const setStage = useCallback((stage: AcademyStage | null) => {
    setStored(stage);
    persistAcademyStage(stage);
  }, []);

  const value = useMemo(() => ({ stored, setStage }), [stored, setStage]);

  return <AcademyStageContext.Provider value={value}>{children}</AcademyStageContext.Provider>;
}

export function useAcademyStage() {
  return useContext(AcademyStageContext);
}

/**
 * The stage the UI should act on: the explicit choice, else what the profile
 * and the patient list imply. `null` means we still have to ask.
 */
export function useResolvedAcademyStage(input: { academicPeriod?: string | null; patientCount?: number }) {
  const { stored, setStage } = useAcademyStage();
  const stage = useMemo(
    () => resolveAcademyStage({ stored, academicPeriod: input.academicPeriod, patientCount: input.patientCount }),
    [stored, input.academicPeriod, input.patientCount],
  );
  return { stage, stored, setStage, isPreClinical: stage === 'pre-clinico' };
}
