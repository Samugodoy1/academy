import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const SYSTEM_THEME_STORAGE_KEY = 'system_theme';

export const SYSTEM_THEMES = [
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Escuro' },
  { id: 'auto', label: 'Automático' },
] as const;

export type SystemThemeId = (typeof SYSTEM_THEMES)[number]['id'];
export type ResolvedTheme = 'light' | 'dark';

export const DEFAULT_SYSTEM_THEME_ID: SystemThemeId = 'dark';

export function isSystemThemeId(value: string | null | undefined): value is SystemThemeId {
  return value === 'light' || value === 'dark' || value === 'auto';
}

function prefersLight() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches;
}

export function resolveTheme(id: SystemThemeId): ResolvedTheme {
  if (id === 'auto') return prefersLight() ? 'light' : 'dark';
  return id;
}

export function applyResolvedTheme(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (root.getAttribute('data-product') === 'academy') {
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
    return;
  }
  root.setAttribute('data-theme', resolved);
  root.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'light' ? '#f5f5f7' : '#000000');
}

function readStoredTheme(): SystemThemeId {
  if (typeof localStorage === 'undefined') return DEFAULT_SYSTEM_THEME_ID;
  const raw = localStorage.getItem(SYSTEM_THEME_STORAGE_KEY);
  return isSystemThemeId(raw) ? raw : DEFAULT_SYSTEM_THEME_ID;
}

interface SystemThemeContextValue {
  themeId: SystemThemeId;
  resolved: ResolvedTheme;
  setThemeId: (id: SystemThemeId) => void;
}

const SystemThemeContext = createContext<SystemThemeContextValue>({
  themeId: DEFAULT_SYSTEM_THEME_ID,
  resolved: 'dark',
  setThemeId: () => {},
});

export function SystemThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<SystemThemeId>(readStoredTheme);
  const resolved = useMemo(() => resolveTheme(themeId), [themeId]);

  useEffect(() => {
    applyResolvedTheme(resolved);
  }, [resolved]);

  useEffect(() => {
    if (themeId !== 'auto' || typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => applyResolvedTheme(resolveTheme('auto'));
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [themeId]);

  const setThemeId = (id: SystemThemeId) => {
    const next = isSystemThemeId(id) ? id : DEFAULT_SYSTEM_THEME_ID;
    setThemeIdState(next);
    localStorage.setItem(SYSTEM_THEME_STORAGE_KEY, next);
    applyResolvedTheme(resolveTheme(next));
  };

  return (
    <SystemThemeContext.Provider value={{ themeId, resolved, setThemeId }}>
      {children}
    </SystemThemeContext.Provider>
  );
}

export function useSystemTheme() {
  return useContext(SystemThemeContext);
}
