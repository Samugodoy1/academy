import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const ACADEMY_COLOR_STORAGE_KEY = 'academy_accent';

export const ACADEMY_COLORS = [
  { id: 'lilac', label: 'Lilás', hex: '#bf5af2' },
  { id: 'violet', label: 'Violeta', hex: '#8682d8' },
  { id: 'purple', label: 'Roxo', hex: '#52057B' },
  { id: 'blue', label: 'Azul', hex: '#0071e3' },
  { id: 'sky', label: 'Céu', hex: '#64d2ff' },
  { id: 'green', label: 'Verde', hex: '#30d158' },
  { id: 'orange', label: 'Laranja', hex: '#ff9f0a' },
  { id: 'pink', label: 'Rosa', hex: '#ff375f' },
  { id: 'gray', label: 'Cinza', hex: '#86868b' },
  { id: 'white', label: 'Branco', hex: '#f5f5f7' },
] as const;

export type AcademyColorId = (typeof ACADEMY_COLORS)[number]['id'];

export const DEFAULT_ACADEMY_COLOR_ID: AcademyColorId = 'lilac';

export function getAcademyColor(id: string | null | undefined) {
  return ACADEMY_COLORS.find(color => color.id === id) || ACADEMY_COLORS[0];
}

function applyAccent(hex: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--academy-accent', hex);
}

interface AcademyColorContextValue {
  colorId: AcademyColorId;
  hex: string;
  setColorId: (id: AcademyColorId) => void;
}

const AcademyColorContext = createContext<AcademyColorContextValue>({
  colorId: DEFAULT_ACADEMY_COLOR_ID,
  hex: ACADEMY_COLORS[0].hex,
  setColorId: () => {},
});

export function AcademyColorProvider({ children }: { children: React.ReactNode }) {
  const [colorId, setColorIdState] = useState<AcademyColorId>(() => {
    if (typeof localStorage === 'undefined') return DEFAULT_ACADEMY_COLOR_ID;
    return getAcademyColor(localStorage.getItem(ACADEMY_COLOR_STORAGE_KEY)).id;
  });

  const hex = useMemo(() => getAcademyColor(colorId).hex, [colorId]);

  useEffect(() => {
    applyAccent(hex);
  }, [hex]);

  const setColorId = (id: AcademyColorId) => {
    const next = getAcademyColor(id);
    setColorIdState(next.id);
    localStorage.setItem(ACADEMY_COLOR_STORAGE_KEY, next.id);
    applyAccent(next.hex);
  };

  return (
    <AcademyColorContext.Provider value={{ colorId, hex, setColorId }}>
      {children}
    </AcademyColorContext.Provider>
  );
}

export function useAcademyColor() {
  return useContext(AcademyColorContext);
}
