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
    <div>
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
              className="flex flex-col items-center gap-1 rounded-[18px] px-1 py-1"
            >
              <Icon
                size={22}
                weight="regular"
                className={active ? 'text-[var(--neo)]' : 'text-[var(--neo-ink)]'}
              />
              <span className={`h-1 w-1 rounded-full ${active ? 'bg-[var(--neo)]' : 'bg-transparent'}`} />
            </button>
          );
        })}
      </nav>
      {onSchedule && (
        <button
          type="button"
          onClick={onSchedule}
          className="mt-1 flex w-full items-center justify-center gap-1.5 py-2 text-[13px] tracking-[-0.011em] text-[var(--neo)]"
        >
          <CalendarPlus size={14} weight="regular" />
          Encaixar horário
        </button>
      )}
    </div>
  );
}
