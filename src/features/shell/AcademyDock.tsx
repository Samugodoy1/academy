import React from 'react';
import { BookOpen, Calendar, CalendarPlus, GraduationCap, House, Users } from '@phosphor-icons/react';

const DOCK = [
  { id: 'dashboard', label: 'Hoje', icon: House },
  { id: 'base', label: 'Estudos', icon: GraduationCap },
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
              className="relative mx-auto flex h-11 w-11 items-center justify-center rounded-[18px]"
            >
              {active && <span className="ac-lens absolute inset-0 rounded-[18px]" aria-hidden />}
              <Icon
                size={24}
                weight={active ? 'fill' : 'regular'}
                className={`relative ${active ? 'text-[var(--neo)]' : 'text-[#1d1d1f]'}`}
              />
              <span className="sr-only">{item.label}</span>
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
            <CalendarPlus size={26} weight="regular" className="text-[#1d1d1f]" />
            <span className="sr-only">Encaixe</span>
          </button>
        )}
      </nav>
    </div>
  );
}
