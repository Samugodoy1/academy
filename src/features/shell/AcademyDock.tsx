import React from 'react';
import { BookOpen, Calendar, CalendarPlus, House, Users } from '@phosphor-icons/react';

const DOCK = [
  { id: 'dashboard', label: 'Hoje', icon: House },
  { id: 'pacientes', label: 'Casos', icon: Users },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'estudos', label: 'Cola', icon: BookOpen },
] as const;

interface AcademyDockProps {
  activeTab: string;
  onGo: (tab: string) => void;
  onSchedule?: () => void;
}

export function AcademyDock({ activeTab, onGo, onSchedule }: AcademyDockProps) {
  return (
    <div className="neo-dock-screen no-print">
      <nav className="neo-dock" aria-label="Atalhos">
        {DOCK.map(item => {
          const Icon = item.icon;
          const active = item.id === 'dashboard' ? activeTab === 'dashboard' : activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onGo(item.id)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center gap-0.5 rounded-[18px] px-1 py-1"
            >
              <Icon
                size={22}
                weight="regular"
                className={active ? 'text-[var(--neo)]' : 'text-[var(--neo-ink)]'}
              />
              <span className={`text-[10px] tracking-[-0.01em] ${active ? 'text-[var(--neo)]' : 'text-[var(--neo-gray)]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
        {onSchedule && (
          <button
            type="button"
            onClick={onSchedule}
            aria-label="Encaixar horário"
            className="flex flex-col items-center gap-0.5 rounded-[18px] px-1 py-1"
          >
            <CalendarPlus size={22} weight="regular" className="text-[var(--neo-ink)]" />
            <span className="text-[10px] tracking-[-0.01em] text-[var(--neo-gray)]">Encaixe</span>
          </button>
        )}
      </nav>
    </div>
  );
}
