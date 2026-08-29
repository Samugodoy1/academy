import { createContext, useContext, type ReactNode } from 'react';
import type { Appointment, CurrentUser, Dentist, Patient } from '../types/clinical';

export interface AppContextValue {
  user: CurrentUser | null;
  profile: Dentist | null;
  patients: Patient[];
  appointments: Appointment[];
  loading: boolean;
  now: Date;
  apiFetch: (url: string, options?: RequestInit & { product?: string; explicitToken?: string }) => Promise<Response>;
  showNotification: (message: string, type?: 'success' | 'error') => void;
  openPatientRecord: (id: number) => void | Promise<void>;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  value,
  children,
}: {
  value: AppContextValue;
  children: ReactNode;
}) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
