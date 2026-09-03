import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  applyAcademyNeoColorway,
  DEFAULT_ACADEMY_NEO_ID,
  persistAcademyNeoId,
  readStoredAcademyNeoId,
  shouldApplyAcademyNeo,
  type AcademyNeoId,
} from './academyNeo';

interface AcademyNeoContextValue {
  enabled: boolean;
  colorwayId: AcademyNeoId;
  setColorwayId: (id: AcademyNeoId) => void;
}

const AcademyNeoContext = createContext<AcademyNeoContextValue>({
  enabled: false,
  colorwayId: DEFAULT_ACADEMY_NEO_ID,
  setColorwayId: () => {},
});

export function AcademyNeoProvider({ children }: { children: React.ReactNode }) {
  const enabled = shouldApplyAcademyNeo();
  const [colorwayId, setColorwayIdState] = useState<AcademyNeoId>(readStoredAcademyNeoId);

  useEffect(() => {
    applyAcademyNeoColorway(colorwayId, enabled);
  }, [colorwayId, enabled]);

  const setColorwayId = (id: AcademyNeoId) => {
    setColorwayIdState(id);
    persistAcademyNeoId(id);
    applyAcademyNeoColorway(id, enabled);
  };

  const value = useMemo(
    () => ({ enabled, colorwayId, setColorwayId }),
    [enabled, colorwayId],
  );

  return (
    <AcademyNeoContext.Provider value={value}>
      {children}
    </AcademyNeoContext.Provider>
  );
}

export function useAcademyNeo() {
  return useContext(AcademyNeoContext);
}
