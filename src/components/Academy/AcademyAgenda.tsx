import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { formatAppointmentTime, parseAppointmentDateTime } from '../../utils/dateUtils';

interface AcademyAgendaProps {
  appointments?: any[];
  onSelectAppointment?: (appointment: any) => void;
}

type ViewMode = 'day' | 'week' | 'month';

const ACTIVE_STATUSES = new Set(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const parseDate = (value?: string) => {
  if (!value) return null;
  return parseAppointmentDateTime(value);
};

const formatTime = (value?: string) => {
  return formatAppointmentTime(value);
};

const getStatusLabel = (status?: string) => {
  const labels: Record<string, string> = {
    SCHEDULED: 'Agendado',
    CONFIRMED: 'Confirmado',
    IN_PROGRESS: 'Em atendimento',
    FINISHED: 'Concluído',
    CANCELLED: 'Cancelado',
    NO_SHOW: 'Faltou'
  };
  return labels[String(status || '').toUpperCase()] || 'Agendado';
};

const getConduct = (appointment: any) => {
  return appointment?.procedure || appointment?.notes || appointment?.reason || appointment?.type || 'Avaliação';
};

const getWeekDates = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const item = new Date(start);
    item.setDate(start.getDate() + index);
    return item;
  });
};

const getMonthDates = (date: Date) => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return Array.from({ length: lastDay.getDate() }, (_, index) => (
    new Date(date.getFullYear(), date.getMonth(), index + 1)
  ));
};

const getPeriodTitle = (date: Date, viewMode: ViewMode) => {
  if (viewMode === 'day') {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  }

  if (viewMode === 'month') {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  const week = getWeekDates(date);
  const start = week[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const end = week[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return `${start} - ${end}`;
};

export const AcademyAgenda: React.FC<AcademyAgendaProps> = ({
  appointments = [],
  onSelectAppointment
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const now = new Date();

  const visibleDates = useMemo(() => {
    if (viewMode === 'day') return [selectedDate];
    if (viewMode === 'month') return getMonthDates(selectedDate);
    return getWeekDates(selectedDate);
  }, [selectedDate, viewMode]);

  const visibleAppointments = useMemo(() => {
    return appointments
      .filter(app => ACTIVE_STATUSES.has(String(app.status || 'SCHEDULED').toUpperCase()))
      .filter(app => {
        const start = parseDate(app.start_time || app.date);
        return start ? visibleDates.some(date => sameDay(start, date)) : false;
      })
      .sort((a, b) => {
        const aDate = parseDate(a.start_time || a.date)?.getTime() || 0;
        const bDate = parseDate(b.start_time || b.date)?.getTime() || 0;
        return aDate - bDate;
      });
  }, [appointments, visibleDates]);

  const appointmentsByDay = useMemo(() => {
    return visibleDates.map(date => ({
      date,
      items: visibleAppointments.filter(app => {
        const start = parseDate(app.start_time || app.date);
        return start ? sameDay(start, date) : false;
      })
    }));
  }, [visibleAppointments, visibleDates]);

  const getAppointmentRole = (appointment: any) => {
    const patientWeekAppointments = visibleAppointments
      .filter(app => app.patient_id === appointment.patient_id || app.patient_name === appointment.patient_name)
      .sort((a, b) => {
        const aDate = parseDate(a.start_time || a.date)?.getTime() || 0;
        const bDate = parseDate(b.start_time || b.date)?.getTime() || 0;
        return aDate - bDate;
      });
    const appointmentIndex = patientWeekAppointments.findIndex(app => app.id === appointment.id);
    const appDate = parseDate(appointment.start_time || appointment.date);
    const hasPreviousCare = appointments.some(other => {
      const otherDate = parseDate(other.start_time || other.date);
      return (other.patient_id === appointment.patient_id || other.patient_name === appointment.patient_name) &&
        other.id !== appointment.id &&
        otherDate &&
        appDate &&
        otherDate < appDate &&
        !['CANCELLED', 'NO_SHOW'].includes(String(other.status || '').toUpperCase());
    });

    if (appointmentIndex > 0) return hasPreviousCare ? 'Retorno' : 'Continuação';
    return hasPreviousCare ? 'Retorno' : 'Primeira consulta';
  };

  const agendaSmartCopy = useMemo(() => {
    const weekDates = getWeekDates(selectedDate);
    const start = weekDates[0];
    const end = new Date(weekDates[6]);
    end.setHours(23, 59, 59, 999);

    const weekAppointments = appointments
      .filter(app => ACTIVE_STATUSES.has(String(app.status || 'SCHEDULED').toUpperCase()))
      .filter(app => {
        const appDate = parseDate(app.start_time || app.date);
        return appDate ? appDate >= start && appDate <= end : false;
      })
      .sort((a, b) => {
        const aDate = parseDate(a.start_time || a.date)?.getTime() || 0;
        const bDate = parseDate(b.start_time || b.date)?.getTime() || 0;
        return aDate - bDate;
      });

    if (weekAppointments.length === 0) return 'Semana tranquila por enquanto.';

    const nextAppointment = weekAppointments.find(app => {
      const appDate = parseDate(app.start_time || app.date);
      return appDate ? appDate >= now : false;
    }) || weekAppointments[0];
    const nextDate = parseDate(nextAppointment.start_time || nextAppointment.date);
    const day = nextDate?.toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-feira', '') || 'em breve';
    return `Seu próximo atendimento é ${day} com ${nextAppointment.patient_name || nextAppointment.patient?.name || 'paciente'}.`;
  }, [appointments, now, selectedDate]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const nextDate = new Date(selectedDate);
    const amount = direction === 'next' ? 1 : -1;

    if (viewMode === 'day') nextDate.setDate(nextDate.getDate() + amount);
    if (viewMode === 'week') nextDate.setDate(nextDate.getDate() + amount * 7);
    if (viewMode === 'month') nextDate.setMonth(nextDate.getMonth() + amount);

    setSelectedDate(nextDate);
  };

  const isEmpty = visibleAppointments.length === 0;

  return (
    <div className="flex-1 overflow-y-auto bg-white pb-20 text-[var(--neo-ink)]">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 bg-white/90 px-4 py-4 backdrop-blur-xl"
        >
          <div className="mb-5">
            <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-[1.05] mb-1">
              {viewMode === 'week' ? 'Semana clínica' : 'Agenda'}
            </h1>
            <p className="text-[15px] text-[var(--neo-gray)]">{agendaSmartCopy}</p>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2 rounded-[980px] bg-white p-1">
            {[
              { id: 'day', label: 'Dia' },
              { id: 'week', label: 'Semana' },
              { id: 'month', label: 'Mês' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as ViewMode)}
                className={`rounded-[980px] py-2.5 text-sm font-normal transition-all ${
                  viewMode === mode.id
                    ? 'bg-[var(--neo)] text-white'
                    : 'text-[var(--neo-gray)]'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => navigateDate('prev')} className="rounded-full p-2 hover:bg-white">
              <ChevronLeft size={20} />
            </button>
            <p className="text-[15px] font-semibold capitalize tracking-[-0.016em]">
              {getPeriodTitle(selectedDate, viewMode)}
            </p>
            <button onClick={() => navigateDate('next')} className="rounded-full p-2 hover:bg-white">
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        <div className="px-4 py-5">
          {isEmpty ? (
            <div className="neo-card px-6 py-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--neo-soft)]">
                <Calendar size={22} className="text-[var(--neo)]" />
              </div>
              <h2 className="text-[22px] font-semibold tracking-[-0.025em]">Nenhum atendimento nesta semana.</h2>
              <p className="mt-2 text-[15px] text-[var(--neo-gray)]">Quando você marcar um paciente, ele aparece aqui.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {appointmentsByDay.map(({ date, items }) => (
                <section key={date.toISOString()} className="space-y-3">
                  <div className="flex items-baseline justify-between px-1">
                    <h2 className="text-[15px] font-semibold capitalize tracking-[-0.016em]">
                      {date.toLocaleDateString('pt-BR', { weekday: 'long' })}
                    </h2>
                    <span className="text-[12px] text-[var(--neo-gray)]">
                      {date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <div className="rounded-[22px] bg-white/70 px-5 py-4 text-[13px] text-[var(--neo-gray)]">
                      Sem atendimento marcado.
                    </div>
                  ) : (
                    <div className="neo-card overflow-hidden">
                      {items.map((appointment, index) => (
                        <button
                          key={appointment.id || `${appointment.patient_name}-${appointment.start_time}-${index}`}
                          onClick={() => onSelectAppointment?.(appointment)}
                          className={`flex w-full gap-4 px-5 py-4 text-left ${
                            index !== items.length - 1 ? 'border-b border-[color-mix(in_srgb,var(--neo)_10%,#e8e8ed)]' : ''
                          }`}
                        >
                          <div className="w-14 shrink-0 text-[14px] text-[var(--neo)]">
                            <Clock size={13} className="mr-1 inline" />
                            {formatTime(appointment.start_time || appointment.date)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-semibold tracking-[-0.016em]">
                              {appointment.patient_name || appointment.patient?.name || 'Paciente'}
                            </p>
                            <p className="mt-1 truncate text-[13px] text-[var(--neo-gray)]">
                              {getAppointmentRole(appointment)} · {getConduct(appointment)}
                            </p>
                          </div>
                          <span className="self-start rounded-[980px] bg-[var(--neo-soft)] px-2.5 py-1 text-[11px] text-[var(--neo-ink)]">
                            {getStatusLabel(appointment.status)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
