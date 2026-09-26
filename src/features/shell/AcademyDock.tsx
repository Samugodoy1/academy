import React from 'react';
import { BookOpen, Calendar, CalendarPlus, GraduationCap, House, Users } from '@phosphor-icons/react';
import { StudentMark } from './StudentMark';

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
  studentActive?: boolean;
  onSubscribe?: () => void;
}

export function AcademyDock({ activeTab, onGo, onSchedule, studentActive = false, onSubscribe }: AcademyDockProps) {
  return (
    <div className="neo-dock-screen no-print">
      <div className="pointer-events-auto flex items-center gap-3">
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
              className="flex flex-col items-center gap-0.5 px-1 py-1"
            >
              <span className={`dock-glyph ${active ? 'dock-glyph-active' : ''}`}>
                <Icon size={22} weight={active ? 'fill' : 'regular'} />
              </span>
              <span className={`text-[10px] tracking-[-0.01em] ${active ? 'text-[var(--neo)]' : 'text-[#8e8e93]'}`}>
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
            className="flex flex-col items-center gap-0.5 px-1 py-1"
          >
            <span className="dock-glyph">
              <CalendarPlus size={22} weight="regular" />
            </span>
            <span className="text-[10px] tracking-[-0.01em] text-[#8e8e93]">Encaixe</span>
          </button>
        )}
      </nav>
      <StudentMark active={studentActive} onSubscribe={onSubscribe} />
      </div>
    </div>
  );
}
