import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { queueAcademyAccountSave, setAcademyAccountPrefs } from './academyAccount';
import { defaultAcademyWidgets, type AcademyWidget } from './academyWidgets';

interface AcademyWidgetsContextValue {
  widgets: AcademyWidget[];
  hydrateWidgets: (widgets: AcademyWidget[]) => void;
  commitWidgets: (widgets: AcademyWidget[]) => void;
}

const AcademyWidgetsContext = createContext<AcademyWidgetsContextValue>({
  widgets: defaultAcademyWidgets(),
  hydrateWidgets: () => {},
  commitWidgets: () => {},
});

export function AcademyWidgetsProvider({ children }: { children: React.ReactNode }) {
  const [widgets, setWidgets] = useState<AcademyWidget[]>(defaultAcademyWidgets);

  const hydrateWidgets = useCallback((next: AcademyWidget[]) => {
    setWidgets(next);
    setAcademyAccountPrefs({ academy_widgets: next });
  }, []);

  const commitWidgets = useCallback((next: AcademyWidget[]) => {
    setWidgets(next);
    queueAcademyAccountSave({ academy_widgets: next });
  }, []);

  const value = useMemo(
    () => ({ widgets, hydrateWidgets, commitWidgets }),
    [widgets, hydrateWidgets, commitWidgets],
  );

  return (
    <AcademyWidgetsContext.Provider value={value}>
      {children}
    </AcademyWidgetsContext.Provider>
  );
}

export function useAcademyWidgets() {
  return useContext(AcademyWidgetsContext);
}
