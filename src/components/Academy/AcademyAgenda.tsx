import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface AcademyAgendaProps {
  onSelectAppointment?: (appointment: any) => void;
}

export const AcademyAgenda: React.FC<AcademyAgendaProps> = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const appointments: any[] = [];

  const getWeekDates = (date: Date) => {
    const dates = [];
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(curr.setDate(first + i)));
    }
    return dates;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? (viewMode === 'day' ? 1 : 7) : (viewMode === 'day' ? -1 : -7)));
    setSelectedDate(newDate);
  };

  const weekDates = getWeekDates(selectedDate);
  const monthYear = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const dayName = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' });

  return (
    <div className="flex-1 bg-[var(--academy-bg)] overflow-y-auto pb-20">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 bg-[var(--academy-bg)]/80 backdrop-blur-md px-4 py-4"
        >
          <div className="mb-4">
            <h1 className="ios-title text-2xl mb-1">Agenda</h1>
            <p className="ios-text-secondary">Seus atendimentos de clinica</p>
          </div>

          <div className="flex gap-2 mb-4">
            {['day', 'week'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as 'day' | 'week')}
                className={`flex-1 py-2 rounded-full font-medium text-sm transition-all ${
                  viewMode === mode
                    ? 'bg-[var(--academy-primary)] text-white'
                    : 'bg-white text-[var(--academy-text)] border border-[var(--academy-border)]'
                }`}
              >
                {mode === 'day' ? 'Dia' : 'Semana'}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-white rounded-full transition-all">
              <ChevronLeft size={20} style={{color: 'var(--academy-text)'}} />
            </button>

            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--academy-text)] capitalize">
                {viewMode === 'day' ? dayName : 'Semana'} - {monthYear}
              </p>
              <p className="text-xs text-[var(--academy-muted)]">{selectedDate.toLocaleDateString('pt-BR')}</p>
            </div>

            <button onClick={() => navigateDate('next')} className="p-2 hover:bg-white rounded-full transition-all">
              <ChevronRight size={20} style={{color: 'var(--academy-text)'}} />
            </button>
          </div>

          {viewMode === 'week' && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
              {weekDates.map((date, i) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-[12px] transition-all shrink-0 ${
                      isSelected
                        ? 'bg-[var(--academy-primary)] text-white'
                        : 'bg-white text-[var(--academy-text)] border border-[var(--academy-border)]'
                    }`}
                  >
                    <span className="text-[10px] font-medium uppercase">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                    <span className="text-sm font-bold">{date.getDate()}</span>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        <div className="px-4 space-y-3 py-4">
          {appointments.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Calendar size={40} style={{color: 'var(--academy-muted)', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.75rem'}} />
              <p style={{color: 'var(--academy-muted)'}} className="font-medium">Nenhum atendimento agendado</p>
              <p className="text-sm mt-1" style={{color: 'var(--academy-muted)'}}>A tela ainda nao possui uma API real de agenda Academy.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
