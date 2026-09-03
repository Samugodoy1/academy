import React, { createContext, useContext, useMemo, useState } from 'react';
import { ACADEMY_NAV, type AcademyNavId } from '../features/shell/nav';
import { persistAcademyNavOrder, readAcademyNavOrder } from './academyNav';

interface AcademyNavContextValue {
  order: AcademyNavId[];
  tabs: typeof ACADEMY_NAV[number][];
  pinFirst: (id: AcademyNavId) => void;
}

const AcademyNavContext = createContext<AcademyNavContextValue>({
  order: ACADEMY_NAV.map(item => item.id),
  tabs: [...ACADEMY_NAV],
  pinFirst: () => {},
});

export function AcademyNavProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState<AcademyNavId[]>(readAcademyNavOrder);
  const tabs = useMemo(
    () => order.map(id => ACADEMY_NAV.find(item => item.id === id)).filter(Boolean) as typeof ACADEMY_NAV[number][],
    [order],
  );

  const pinFirst = (id: AcademyNavId) => {
    const next = [id, ...order.filter(item => item !== id)];
    setOrder(next);
    persistAcademyNavOrder(next);
  };

  return (
    <AcademyNavContext.Provider value={{ order, tabs, pinFirst }}>
      {children}
    </AcademyNavContext.Provider>
  );
}

export function useAcademyNavOrder() {
  return useContext(AcademyNavContext);
}
