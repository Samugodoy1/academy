import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { queueAcademyAccountSave, setAcademyAccountPrefs } from './academyAccount';
import {
  applyAcademyNeoColorway,
  DEFAULT_ACADEMY_NEO_ID,
  persistAcademyNeoId,
  shouldApplyAcademyNeo,
  type AcademyNeoId,
} from './academyNeo';

interface AcademyNeoContextValue {
  enabled: boolean;
  colorwayId: AcademyNeoId;
  setColorwayId: (id: AcademyNeoId) => void;
  hydrateColorway: (id: AcademyNeoId) => void;
}

const AcademyNeoContext = createContext<AcademyNeoContextValue>({
  enabled: false,
  colorwayId: DEFAULT_ACADEMY_NEO_ID,
  setColorwayId: () => {},
  hydrateColorway: () => {},
});

export function AcademyNeoProvider({ children }: { children: React.ReactNode }) {
  const enabled = shouldApplyAcademyNeo();
  const [colorwayId, setColorwayIdState] = useState<AcademyNeoId>(DEFAULT_ACADEMY_NEO_ID);

  useEffect(() => {
    applyAcademyNeoColorway(colorwayId, enabled);
  }, [colorwayId, enabled]);

  const hydrateColorway = useCallback((id: AcademyNeoId) => {
    setColorwayIdState(id);
    setAcademyAccountPrefs({ academy_neo: id });
    persistAcademyNeoId(id);
    applyAcademyNeoColorway(id, enabled);
  }, [enabled]);

  const setColorwayId = useCallback((id: AcademyNeoId) => {
    setColorwayIdState(id);
    persistAcademyNeoId(id);
    applyAcademyNeoColorway(id, enabled);
    queueAcademyAccountSave({ academy_neo: id });
  }, [enabled]);

  const value = useMemo(
    () => ({ enabled, colorwayId, setColorwayId, hydrateColorway }),
    [enabled, colorwayId, setColorwayId, hydrateColorway],
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
