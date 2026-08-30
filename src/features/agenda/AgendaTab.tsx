import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  CalendarDays,
  Plus,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  CheckCircle2,
  Clock,
  Activity,
  UserCircle,
  X,
  UserPlus,
} from '../../icons';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  formatDateInputValue,
  formatTimeInputValue,
  getAppointmentTime,
  getFreeSlots,
  getSuggestion,
  isSameAppointmentDay,
  parseAppointmentDateTime,
  type FreeSlot,
} from '../../utils/dateUtils';
import type { Appointment, CurrentUser, Patient } from '../../types/clinical';
import { StatusBadge } from './StatusBadge';
import type { AgendaViewMode } from './useAgendaState';
import { SisoLine } from '../../illustrations/SisoLine';
import { EmptySiso } from '../../illustrations/EmptySiso';

type AppTabId =
  | 'dashboard'
  | 'agenda'
  | 'pacientes'
  | 'estudos'
  | 'financeiro'
  | 'documentos'
  | 'prontuario'
  | 'configuracoes'
  | 'admin'
  | 'portal'
  | 'inteligencia'
  | 'academy';

export interface NewAppointmentForm {
  patient_id: string;
  patient_name: string;
  dentist_id: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
}

export interface WeekSuggestionSheet {
  date: Date;
  start: string;
  end: string;
  duration: number;
  procedure: string;
}

export interface SuggestedSlot {
  date: Date;
  duration: number;
  procedure: string;
}

export interface AgendaTabProps {
  appointments: Appointment[];
  patients: Patient[];
  loading: boolean;
  now: Date;
  selectedDate: Date;
  agendaViewMode: AgendaViewMode;
  agendaFocusMode: boolean;
  agendaSmartCopy: string;
  filteredAppointments: Appointment[];
  patientMap: Map<number, Patient>;
  selectedWeekDay: number;
  monthSheetSelectedDay: Date | null;
  weekSheetSelectedAppointment: Appointment | null;
  weekSuggestionSheet: WeekSuggestionSheet | null;
  user: CurrentUser | null;
  getPatientWeekRole: (appointment: Appointment, weekAppointments: Appointment[]) => string;
  isNextAppointment: (app: Appointment, allApps: Appointment[]) => boolean;
  getProcedureColor: (procedure: string) => { bg: string; hover: string };
  findAvailableSlots: (
    date: Date,
    workingHours?: { start: number; end: number }
  ) => Array<{ startTime: Date; endTime: Date; duration: number; procedure: string }>;
  navigateDate: (direction: 'prev' | 'next' | 'today') => void;
  openAppointmentModal: (prefill?: { patientId: number; patientName: string }) => void;
  openPatientRecord: (id: number) => void | Promise<void>;
  updateAppointmentStatus: (id: number, status: Appointment['status']) => void | Promise<void>;
  sendReminder: (app: Appointment) => void | Promise<void>;
  setAgendaFocusMode: (value: boolean) => void;
  setAgendaViewMode: (value: AgendaViewMode) => void;
  setSelectedWeekDay: (value: number) => void;
  setMonthSheetSelectedDay: (value: Date | null) => void;
  setWeekSheetSelectedAppointment: (value: Appointment | null) => void;
  setWeekSuggestionSheet: (value: WeekSuggestionSheet | null) => void;
  setActiveTab: (tab: AppTabId) => void;
  setNewAppointment: React.Dispatch<React.SetStateAction<NewAppointmentForm>>;
  setIsModalOpen: (value: boolean) => void;
  setAppointmentModalMode: (value: 'schedule' | 'reschedule') => void;
  setEditingAppointmentId: (value: number | null) => void;
  setSuggestedSlot: (value: SuggestedSlot | null) => void;
}

function AgendaTabComponent({
  patients,
  loading,
  now,
  selectedDate,
  agendaViewMode,
  agendaFocusMode,
  agendaSmartCopy,
  filteredAppointments,
  patientMap,
  selectedWeekDay,
  monthSheetSelectedDay,
  weekSheetSelectedAppointment,
  weekSuggestionSheet,
  user,
  getPatientWeekRole,
  isNextAppointment,
  getProcedureColor,
  findAvailableSlots,
  navigateDate,
  openAppointmentModal,
  openPatientRecord,
  updateAppointmentStatus,
  sendReminder,
  setAgendaFocusMode,
  setAgendaViewMode,
  setSelectedWeekDay,
  setMonthSheetSelectedDay,
  setWeekSheetSelectedAppointment,
  setWeekSuggestionSheet,
  setActiveTab,
  setNewAppointment,
  setIsModalOpen,
  setAppointmentModalMode,
  setEditingAppointmentId,
  setSuggestedSlot,
}: AgendaTabProps) {
  const navigate = useNavigate();

  return (
    <div className="page-shell flex flex-col gap-8 tablet-l:gap-10">
      {/* Header */}
      <div className="flex flex-col gap-5 mb-2 no-print">
        <div className="flex items-end justify-between gap-3">
          <SisoLine mood="box" size={112}>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-primary mb-1">
              Seus horários
            </p>
            <p className="text-[20px] sm:text-[22px] leading-snug">
              {agendaViewMode === 'week' && !agendaFocusMode ? 'Como está sua semana?' : 'Quem você atende hoje?'}
            </p>
            <p className="mt-1.5 text-[14px] font-bold leading-snug text-[#3B0459]/75">
              {agendaSmartCopy}
            </p>
          </SisoLine>
          <button
            onClick={openAppointmentModal}
            className="duo-btn duo-btn-active mb-8 w-12 h-12 flex items-center justify-center rounded-full shrink-0"
            title="Novo atendimento"
            aria-label="Novo atendimento"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 liquid-glass-segment rounded-full p-1">
            <button
              onClick={() => navigateDate('prev')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors text-academy-muted"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => navigateDate('today')}
              className={`px-4 py-2 text-[13px] font-bold rounded-full transition-all min-h-[36px] ${
                selectedDate.toDateString() === new Date().toDateString()
                  ? 'liquid-glass-segment-active text-primary'
                  : 'text-academy-muted hover:text-academy-text'
              }`}
              aria-label="Ir para hoje (T)"
            >
              Hoje
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors text-academy-muted"
              aria-label="Próximo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <span className="text-sm font-semibold text-academy-muted text-right">
            {agendaViewMode === 'week' && !agendaFocusMode
              ? (() => {
                const start = new Date(selectedDate);
                start.setDate(start.getDate() - start.getDay());
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                return `${start.getDate()} ${start.toLocaleDateString('pt-BR', { month: 'short' })} – ${end.getDate()} ${end.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`;
              })()
              : agendaViewMode === 'month' && !agendaFocusMode
                ? selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                : selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
            }
          </span>
        </div>

        {/* View Mode Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="grid grid-cols-3 liquid-glass-segment p-1 rounded-full w-full sm:w-auto">
            <button
              onClick={() => { setAgendaFocusMode(false); setAgendaViewMode('day'); }}
              className={`px-5 py-2 text-[13px] font-bold rounded-full transition-all min-h-[40px] ${!agendaFocusMode && agendaViewMode === 'day' ? 'liquid-glass-segment-active text-primary' : 'text-academy-muted hover:text-academy-text'}`}
              aria-label="Visão diária"
            >
              Dia
            </button>
            <button
              onClick={() => { setAgendaFocusMode(false); setAgendaViewMode('week'); }}
              className={`px-5 py-2 text-[13px] font-bold rounded-full transition-all min-h-[40px] ${!agendaFocusMode && agendaViewMode === 'week' ? 'liquid-glass-segment-active text-primary' : 'text-academy-muted hover:text-academy-text'}`}
              aria-label="Visão semanal"
            >
              Semana
            </button>
            <button
              onClick={() => { setAgendaFocusMode(false); setAgendaViewMode('month'); }}
              className={`px-5 py-2 text-[13px] font-bold rounded-full transition-all min-h-[40px] ${!agendaFocusMode && agendaViewMode === 'month' ? 'liquid-glass-segment-active text-primary' : 'text-academy-muted hover:text-academy-text'}`}
              aria-label="Visão mensal"
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="liquid-glass-card rounded-[28px] overflow-hidden">
          <div className="divide-y divide-academy-border/40">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-start gap-4 p-5 animate-pulse">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className="w-12 h-4 bg-slate-100 rounded-md" />
                  <div className="w-8 h-3 bg-slate-50 rounded-md" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
                      <div className="h-3 bg-slate-50 rounded-lg w-1/3" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-slate-50 rounded-full w-24" />
                    <div className="h-8 bg-slate-50 rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="liquid-glass-card rounded-[28px] overflow-hidden no-print">
          <div className="divide-y divide-academy-border/40">
            {(() => {
              const filtered = filteredAppointments;

              if (filtered.length === 0 && agendaViewMode === 'day') {
                return patients.length === 0 ? (
                  <EmptySiso
                    mood="think"
                    title="Primeiro, me conta quem você atende."
                    body="Cadastre o nome do paciente e depois volte aqui pra escolher o dia do box."
                    actionLabel="Adicionar paciente"
                    onAction={() => setActiveTab('pacientes')}
                  />
                ) : (
                  <EmptySiso
                    mood="idle"
                    title="Hoje a cadeira está livre."
                    body="Se já souber o próximo dia de clínica, deixa marcado agora."
                    actionLabel="Marcar atendimento"
                    onAction={openAppointmentModal}
                  />
                );
              }

              const renderAppointment = (app: Appointment, isFocusMode: boolean = false) => {
                const isNext = isNextAppointment(app, filtered);

                return (
                  <div key={app.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-white/30 transition-all group relative ${isNext && !isFocusMode ? 'border-l-4 border-primary bg-primary/5' : 'border-l-4 border-transparent'}`}>
                    {/* Time column */}
                    <div className={`${agendaViewMode === 'day' ? '' : 'hidden sm:flex'} w-12 sm:w-16 pt-1 flex flex-col items-center shrink-0`}>
                      <p className={`text-[13px] sm:text-[15px] font-bold ${isNext && !isFocusMode ? 'text-primary' : 'text-academy-text'}`}>
                        {formatAppointmentTime(app.start_time)}
                      </p>
                      <div className={`w-[1px] ${agendaViewMode === 'day' ? 'flex-1' : 'h-8'} bg-academy-border/60 my-2`} />
                    </div>

                    <div className="flex-1 liquid-glass-subtle rounded-2xl p-4 sm:p-5 group-hover:shadow-sm transition-all flex flex-col gap-4">
                      {/* Head: Patient info and status */}
                      <div className="flex items-start gap-3 justify-between">
                        <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => openPatientRecord(app.patient_id)}>
                          <div className="w-12 h-12 liquid-glass-subtle rounded-full flex items-center justify-center text-academy-muted shrink-0 overflow-hidden">
                            {(() => {
                              const patient = patientMap.get(app.patient_id);
                              return patient?.photo_url ? (
                                <img src={patient.photo_url} alt={app.patient_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <UserCircle size={24} />
                              );
                            })()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-base sm:text-lg font-bold text-academy-text truncate">{app.patient_name}</p>
                            <p className="text-xs sm:text-sm text-academy-muted truncate">{app.notes || 'Consulta'}</p>
                          </div>
                        </div>

                        <select
                          value={app.status}
                          onChange={(e) => updateAppointmentStatus(app.id, e.target.value as Appointment['status'])}
                          aria-label={`Status de ${app.patient_name}`}
                          className={`px-3 py-2 border rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none whitespace-nowrap shrink-0 appearance-none cursor-pointer transition-colors ${app.status === 'CONFIRMED' ? 'bg-[#F3E8FF] border-[#DDD6FE] text-academy-primary-dark' :
                              app.status === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                app.status === 'FINISHED' ? 'bg-slate-100 border-slate-200 text-slate-500' :
                                  app.status === 'CANCELLED' ? 'bg-rose-50 border-rose-200 text-rose-600' :
                                    app.status === 'NO_SHOW' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                      'bg-white border-slate-200 text-slate-700'
                            }`}
                        >
                          <option value="SCHEDULED">⏳ Agendado</option>
                          <option value="CONFIRMED">✓ Confirmado</option>
                          <option value="IN_PROGRESS">● Atendendo</option>
                          <option value="FINISHED">✓ Finalizado</option>
                          <option value="CANCELLED">✕ Cancelado</option>
                          <option value="NO_SHOW">⊘ Faltou</option>
                        </select>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            const patient = patientMap.get(app.patient_id);
                            if (patient) openPatientRecord(patient.id);
                            navigate(`/prontuario/${app.patient_id}`);
                          }}
                          className="flex-1 sm:flex-none bg-primary text-white px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
                        >
                          <Activity size={16} />
                          <span className="hidden sm:inline">{app.status === 'FINISHED' ? 'Ver Prontuário' : 'Iniciar Atendimento'}</span>
                          <span className="sm:hidden">{app.status === 'FINISHED' ? 'Ver' : 'Atender'}</span>
                        </button>

                        <button
                          onClick={() => sendReminder(app)}
                          className="p-2.5 text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-all shrink-0"
                          title="WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              };

              const renderSuggestion = (slot: FreeSlot) => {
                const suggestion = getSuggestion(slot.duration);
                return (
                  <div
                    key={`suggestion-${slot.start}-${slot.end}`}
                    className="py-1 px-6 hover:bg-white/30 transition-colors cursor-pointer group"
                    onClick={() => {
                      // Pre-fill new appointment form
                      setNewAppointment({
                        patient_id: '',
                        dentist_id: user?.id ? user.id.toString() : '',
                        date: formatDateInputValue(selectedDate),
                        time: slot.start,
                        duration: slot.duration.toString(),
                        notes: suggestion
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    <span className="text-xs text-academy-muted flex items-center gap-1.5">
                      <Clock size={12} className="text-academy-alert-text" />
                      {slot.start} – {slot.end} • {suggestion}
                    </span>
                  </div>
                );
              };

              if (agendaFocusMode && agendaViewMode === 'day') {
                const todayStr = new Date().toDateString();
                const isToday = selectedDate.toDateString() === todayStr;
                const todayApps = filtered.filter(a => isSameAppointmentDay(a.start_time, now));
                const nextApps = todayApps
                  .filter(a => getAppointmentTime(a.start_time) > now.getTime() && a.status !== 'CANCELLED' && a.status !== 'FINISHED' && a.status !== 'NO_SHOW')
                  .slice(0, 3);

                return (
                  <div className="divide-y divide-slate-100">
                    {/* Current Time Indicator */}
                    {isToday && (
                      <div className="py-4 px-6 flex items-center gap-3">
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">Agora</span>
                        </div>
                        <div className="h-[1px] flex-1 bg-rose-200/50" />
                      </div>
                    )}

                    {/* Next Appointments */}
                    {nextApps.length > 0 ? nextApps.map(app => renderAppointment(app, true)) : (
                      <div className="px-6 py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="text-slate-200" size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">Nenhum paciente próximo para hoje.</p>
                      </div>
                    )}
                  </div>
                );
              }

              // Full Agenda Mode - Different views based on agendaViewMode
              if (agendaViewMode === 'week') {
                // Week grid view — navigable via selectedDate
                const startOfWeek = new Date(selectedDate);
                startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

                const weekDays = [];
                for (let i = 0; i < 7; i++) {
                  const day = new Date(startOfWeek);
                  day.setDate(startOfWeek.getDate() + i);
                  weekDays.push(day);
                }

                // Keep weekly grid broad enough to always include suggestion hours
                let earliestHour = 8;
                let latestHour = 18;

                if (filtered.length > 0) {
                  const hours = filtered
                    .map(a => parseAppointmentDateTime(a.start_time)?.getHours())
                    .filter((hour): hour is number => typeof hour === 'number');
                  if (hours.length > 0) {
                    earliestHour = Math.min(...hours);
                    latestHour = Math.max(...hours);

                    // Add one hour buffer before and after while always including 08:00-18:00
                    earliestHour = Math.max(0, Math.min(8, earliestHour - 1));
                    latestHour = Math.min(23, Math.max(18, latestHour + 1));
                  }
                }

                const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                const timeSlots = [];
                for (let h = earliestHour; h <= latestHour; h++) {
                  timeSlots.push(h);
                }

                const timeToMinutes = (time: string) => {
                  const [h, m] = time.split(':').map(Number);
                  return h * 60 + m;
                };

                const weekdayCandidates = weekDays.map((day, idx) => {
                  const dayOfWeek = day.getDay();
                  if (dayOfWeek === 0 || dayOfWeek === 6) {
                    return null;
                  }

                  const dayAppointments = filtered.filter(a => {
                    const appDate = parseAppointmentDateTime(a.start_time);
                    if (!appDate) return false;
                    return appDate.toDateString() === day.toDateString() && a.status !== 'CANCELLED';
                  });

                  const validSlots = getFreeSlots(dayAppointments, '08:00', '18:00')
                    .filter(slot => slot.duration >= 30)
                    .map(slot => ({
                      ...slot,
                      startMin: timeToMinutes(slot.start),
                      endMin: timeToMinutes(slot.end)
                    }));

                  if (validSlots.length === 0) return null;

                  const bestSlot = validSlots.sort((a, b) => b.duration - a.duration)[0];

                  return {
                    ...bestSlot,
                    day,
                    dayIndex: idx,
                    appointmentCount: dayAppointments.length
                  };
                }).filter(Boolean);

                const workdayAppointmentCount = weekDays.reduce((total, day) => {
                  const dayOfWeek = day.getDay();
                  if (dayOfWeek === 0 || dayOfWeek === 6) {
                    return total;
                  }

                  return total + filtered.filter(a => {
                    const appDate = parseAppointmentDateTime(a.start_time);
                    if (!appDate) return false;
                    return appDate.toDateString() === day.toDateString() && a.status !== 'CANCELLED';
                  }).length;
                }, 0);

                const isMostlyEmptyWeek = workdayAppointmentCount <= 2;
                const allWorkdaysCompletelyFree = workdayAppointmentCount === 0;
                const maxSuggestionDays = allWorkdaysCompletelyFree ? 1 : 2;
                const limitedCandidates = isMostlyEmptyWeek
                  ? weekdayCandidates
                    .sort((a, b) => {
                      const appointmentWeight = (b.appointmentCount - a.appointmentCount) * 1000;
                      const durationWeight = b.duration - a.duration;
                      const dayWeight = a.dayIndex - b.dayIndex;
                      return appointmentWeight || durationWeight || dayWeight;
                    })
                    .slice(0, Math.min(maxSuggestionDays, weekdayCandidates.length))
                  : weekdayCandidates;

                const weekBestSlots = weekDays.map((_, idx) => {
                  return limitedCandidates.find(candidate => candidate.dayIndex === idx) || null;
                });
                const weekAppointmentsForRoles = filtered
                  .filter(a => {
                    const appDate = parseAppointmentDateTime(a.start_time);
                    if (!appDate) return false;
                    return weekDays.some(day => appDate.toDateString() === day.toDateString());
                  })
                  .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

                return (
                  <div className="space-y-4">
                    {/* Mobile: Day-selector strip + appointment list */}
                    <div className="block sm:hidden space-y-4">
                      {/* 7-day horizontal strip */}
                      <div className="grid grid-cols-7 gap-1">
                        {weekDays.map((day, idx) => {
                          const isToday = day.toDateString() === new Date().toDateString();
                          const isSelected = selectedWeekDay === idx;
                          const hasDayApps = filtered.some(a =>
                            isSameAppointmentDay(a.start_time, day)
                          );
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedWeekDay(idx)}
                              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${isSelected
                                  ? 'bg-primary text-white shadow-sm'
                                  : isToday
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-slate-50 text-slate-600'
                                }`}
                            >
                              <span className="text-[10px] font-semibold uppercase tracking-wide">{dayLabels[idx].slice(0, 1)}</span>
                              <span className={`text-base font-bold leading-tight mt-0.5 ${isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-slate-900'}`}>
                                {day.getDate()}
                              </span>
                              {hasDayApps && (
                                <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white/70' : 'bg-primary'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Appointment list for selected day */}
                      {(() => {
                        const selectedDay = weekDays[selectedWeekDay];
                        const dayApps = filtered
                          .filter(a => selectedDay && isSameAppointmentDay(a.start_time, selectedDay))
                          .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

                        const bestSlot = weekBestSlots[selectedWeekDay];

                        if (dayApps.length === 0) {
                          return (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-3">
                              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                <CalendarDays size={24} className="text-slate-300" />
                              </div>
                              <p className="text-sm text-slate-400 font-medium">Agenda livre neste dia</p>
                              {bestSlot && (
                                <button
                                  type="button"
                                  onClick={() => setWeekSuggestionSheet({
                                    date: selectedDay,
                                    start: bestSlot.start,
                                    end: bestSlot.end,
                                    duration: bestSlot.duration,
                                    procedure: getSuggestion(bestSlot.duration)
                                  })}
                                  className="text-xs font-bold text-primary flex items-center gap-1 mx-auto hover:underline"
                                >
                                  <Clock size={12} className="inline text-academy-alert-text mr-1" />Ver horário disponível ({bestSlot.start}–{bestSlot.end})
                                </button>
                              )}
                            </div>
                          );
                        }

                        return (
                          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            {bestSlot && (
                              <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                                <span className="text-xs text-academy-alert-text flex items-center gap-1"><Clock size={12} /> Horário livre: {bestSlot.start}–{bestSlot.end}</span>
                                <button
                                  type="button"
                                  onClick={() => setWeekSuggestionSheet({
                                    date: selectedDay,
                                    start: bestSlot.start,
                                    end: bestSlot.end,
                                    duration: bestSlot.duration,
                                    procedure: getSuggestion(bestSlot.duration)
                                  })}
                                  className="text-xs font-bold text-amber-700 hover:underline"
                                >
                                  Agendar
                                </button>
                              </div>
                            )}
                            <div className="divide-y divide-slate-100">
                              {dayApps.map(app => {
                                const colors = app.status === 'FINISHED'
                                  ? { bg: '#cbd5e1', hover: '#a1a5ab' }
                                  : getProcedureColor(app.notes || '');
                                const time = formatAppointmentTime(app.start_time);
                                const weekRole = getPatientWeekRole(app, weekAppointmentsForRoles);
                                return (
                                  <button
                                    key={app.id}
                                    type="button"
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                                    onClick={() => setWeekSheetSelectedAppointment(app)}
                                  >
                                    <div
                                      className="w-1 self-stretch rounded-full shrink-0"
                                      style={{ backgroundColor: colors.bg }}
                                    />
                                    <div className="w-12 shrink-0 text-center">
                                      <span className="text-sm font-bold text-slate-900">{time}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-semibold text-slate-900 truncate">{app.patient_name}</p>
                                      <p className="text-xs text-slate-400 truncate">{weekRole} · {app.notes || 'Avaliação'}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Desktop: Full time-grid view */}
                    <div className="hidden sm:block overflow-x-auto pb-2">
                      <div className="min-w-[760px] space-y-4">
                        {/* Week header with day names and dates */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-x divide-slate-200">
                            {/* Time column header */}
                            <div className="bg-slate-50 p-2 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Hora</span>
                            </div>

                            {/* Day headers */}
                            {weekDays.map((day, idx) => {
                              const isToday = day.toDateString() === new Date().toDateString();
                              const bestSlotSuggestion = weekBestSlots[idx];
                              return (
                                <div
                                  key={idx}
                                  className={`p-3 text-center relative ${isToday ? 'bg-primary/10' : 'bg-slate-50'
                                    }`}
                                >
                                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    {dayLabels[idx]}
                                  </div>
                                  <div className={`text-lg font-bold mt-1 ${isToday ? 'text-primary' : 'text-slate-900'}`}>
                                    {day.getDate()}
                                  </div>
                                  {isToday && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />
                                  )}
                                  {bestSlotSuggestion && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setWeekSuggestionSheet({
                                          date: day,
                                          start: bestSlotSuggestion.start,
                                          end: bestSlotSuggestion.end,
                                          duration: bestSlotSuggestion.duration,
                                          procedure: getSuggestion(bestSlotSuggestion.duration)
                                        });
                                      }}
                                      className="absolute top-1 right-1 z-10 text-slate-400 bg-white/80 rounded-full p-0.5 hover:text-amber-500 transition-colors"
                                      title="Ver sugestão de encaixe"
                                      aria-label="Ver sugestão de encaixe"
                                    >
                                      <Clock size={12} />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Time slots grid */}
                        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                          {timeSlots.map(hour => (
                            <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] gap-0 border-b border-slate-200 last:border-b-0 min-h-[60px] divide-x divide-slate-200">
                              {/* Time label */}
                              <div className="bg-slate-50 p-2 flex items-center justify-center border-b border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400">
                                  {String(hour).padStart(2, '0')}:00
                                </span>
                              </div>

                              {/* Day columns */}
                              {weekDays.map((day, dayIdx) => {
                                const dayAppointments = filtered.filter(a => {
                                  const appDate = parseAppointmentDateTime(a.start_time);
                                  if (!appDate) return false;
                                  const appHour = appDate.getHours();
                                  // Show appointment if it starts in this hour
                                  return appDate.toDateString() === day.toDateString() && appHour === hour;
                                }).sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

                                const isToday = day.toDateString() === new Date().toDateString();
                                return (
                                  <div
                                    key={dayIdx}
                                    className={`p-1.5 relative ${isToday ? 'bg-primary/5' : 'bg-white'
                                      } hover:bg-slate-50 transition-colors`}
                                  >
                                    <div className="space-y-1">
                                      {dayAppointments.slice(0, 3).map(app => {
                                        const firstName = (app.patient_name || '').split(' ')[0] || app.patient_name;
                                        const weekRole = getPatientWeekRole(app, weekAppointmentsForRoles);
                                        const colors = app.status === 'FINISHED'
                                          ? { bg: '#e2e8f0', hover: '#cbd5e1' }
                                          : getProcedureColor(app.notes || '');
                                        const textColor = app.status === 'FINISHED' ? 'text-slate-600' : 'text-white';
                                        return (
                                          <div
                                            key={app.id}
                                            style={{
                                              backgroundColor: colors.bg,
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                                            className={`${textColor} rounded-lg text-[11px] px-1.5 py-1 font-semibold cursor-pointer transition-colors min-h-7 flex flex-col justify-center overflow-hidden`}
                                            title={`${app.patient_name} - ${formatAppointmentTime(app.start_time)}`}
                                            onClick={() => setWeekSheetSelectedAppointment(app)}
                                          >
                                            <div className="truncate leading-tight">{firstName}</div>
                                            <div className="text-[10px] opacity-80 leading-tight">
                                              {weekRole}
                                            </div>
                                          </div>
                                        );
                                      })}
                                      {dayAppointments.length > 3 && (
                                        <div className="text-[10px] text-primary font-bold px-1 py-0.5">
                                          +{dayAppointments.length - 3}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Sheet for selected appointment in week view */}
                    {weekSheetSelectedAppointment && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setWeekSheetSelectedAppointment(null)}
                      />
                    )}
                    {weekSheetSelectedAppointment && (
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 z-[1000] bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto pb-32"
                      >
                        <div className="p-6 space-y-6">
                          {/* Close button and header */}
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900">
                                {formatAppointmentDate(weekSheetSelectedAppointment.start_time, { day: 'numeric', month: 'long', weekday: 'long' })}
                              </h3>
                              <p className="text-sm text-slate-500 mt-1">Detalhes do Agendamento</p>
                            </div>
                            <button
                              onClick={() => setWeekSheetSelectedAppointment(null)}
                              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                              <X size={24} className="text-slate-400" />
                            </button>
                          </div>

                          {/* Appointment details */}
                          <div className="pt-4 space-y-6">
                            {/* Time and duration */}
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Horário</p>
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-2xl font-bold text-primary">
                                    {formatAppointmentTime(weekSheetSelectedAppointment.start_time)}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    {(() => {
                                      const start = parseAppointmentDateTime(weekSheetSelectedAppointment.start_time);
                                      const end = parseAppointmentDateTime(weekSheetSelectedAppointment.end_time);
                                      if (!start || !end) return '0min';
                                      const mins = Math.round((end.getTime() - start.getTime()) / 60000);
                                      return `${mins}min`;
                                    })()}
                                  </p>
                                </div>
                                <div className="h-12 w-[1px] bg-slate-200" />
                                <div>
                                  <p className="text-sm text-slate-500">Término</p>
                                  <p className="text-lg font-bold text-slate-700 mt-0.5">
                                    {formatAppointmentTime(weekSheetSelectedAppointment.end_time)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Patient info */}
                            <div className="border-t border-slate-100 pt-6 space-y-3">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paciente</p>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200 shrink-0">
                                  {(() => {
                                    const patient = patientMap.get(weekSheetSelectedAppointment.patient_id);
                                    return patient?.photo_url ? (
                                      <img src={patient.photo_url} alt={weekSheetSelectedAppointment.patient_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <UserCircle size={24} />
                                    );
                                  })()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-900">{weekSheetSelectedAppointment.patient_name}</p>
                                  <p className="text-sm text-slate-500 truncate">
                                    {getPatientWeekRole(weekSheetSelectedAppointment, filtered)} · {weekSheetSelectedAppointment.notes || 'Avaliação'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Status and controls */}
                            <div className="border-t border-slate-100 pt-6 space-y-4">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ações</p>
                              <div className="space-y-3">
                                <select
                                  value={weekSheetSelectedAppointment.status}
                                  onChange={(e) => {
                                    updateAppointmentStatus(weekSheetSelectedAppointment.id, e.target.value as Appointment['status']);
                                    setWeekSheetSelectedAppointment(null);
                                  }}
                                  className="w-full px-4 py-3 text-base bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                  <option value="SCHEDULED">Agendado</option>
                                  <option value="CONFIRMED">Confirmado</option>
                                  <option value="IN_PROGRESS">Atendendo</option>
                                  <option value="FINISHED">Finalizado</option>
                                  <option value="CANCELLED">Cancelado</option>
                                  <option value="NO_SHOW">Faltou</option>
                                </select>

                                <button
                                  onClick={() => {
                                    const patient = patientMap.get(weekSheetSelectedAppointment.patient_id);
                                    if (patient) openPatientRecord(patient.id);
                                    navigate(`/prontuario/${weekSheetSelectedAppointment.patient_id}`);
                                    setWeekSheetSelectedAppointment(null);
                                  }}
                                  className="w-full bg-primary text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                >
                                  <Activity size={18} />
                                  Iniciar Atendimento
                                </button>

                                <button
                                  onClick={() => {
                                    sendReminder(weekSheetSelectedAppointment);
                                    setWeekSheetSelectedAppointment(null);
                                  }}
                                  className="w-full bg-slate-50 text-primary px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border border-slate-200"
                                >
                                  <MessageCircle size={18} />
                                  Enviar Lembrete WhatsApp
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Bottom Sheet for weekly suggestion */}
                    {weekSuggestionSheet && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setWeekSuggestionSheet(null)}
                      />
                    )}
                    {weekSuggestionSheet && (
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 z-[1000] bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto pb-24"
                      >
                        {/* Grab handle */}
                        <div className="flex justify-center pt-3 pb-1">
                          <div className="w-9 h-1 rounded-full bg-slate-300" />
                        </div>
                        <div className="p-6 pt-2 space-y-5">
                          <div className="flex items-center justify-between">
                            <p className="text-base font-semibold text-slate-800">Sugestão de encaixe</p>
                            <button
                              onClick={() => setWeekSuggestionSheet(null)}
                              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                              <X size={20} className="text-slate-400" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm text-slate-600">
                              {weekSuggestionSheet.start} - {weekSuggestionSheet.end}
                            </p>
                            <p className="text-sm text-slate-600">{weekSuggestionSheet.procedure}</p>
                          </div>

                          <button
                            onClick={() => {
                              setNewAppointment({
                                patient_id: '',
                                dentist_id: user?.id ? user.id.toString() : '',
                                date: formatDateInputValue(weekSuggestionSheet.date),
                                time: weekSuggestionSheet.start,
                                duration: String(weekSuggestionSheet.duration),
                                notes: weekSuggestionSheet.procedure
                              });
                              setWeekSuggestionSheet(null);
                              setIsModalOpen(true);
                            }}
                            className="w-full bg-primary text-white px-4 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                          >
                            Agendar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              } else if (agendaViewMode === 'month') {
                // Interactive month view with bottom sheet
                const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

                const weeks = [];
                let currentWeek = [];
                let currentDate = new Date(startOfMonth);

                const firstDayOfWeek = startOfMonth.getDay();
                for (let i = 0; i < firstDayOfWeek; i++) {
                  currentWeek.push(null);
                }

                while (currentDate <= endOfMonth) {
                  currentWeek.push(new Date(currentDate));
                  if (currentWeek.length === 7) {
                    weeks.push(currentWeek);
                    currentWeek = [];
                  }
                  currentDate.setDate(currentDate.getDate() + 1);
                }

                while (currentWeek.length < 7) {
                  currentWeek.push(null);
                }
                weeks.push(currentWeek);

                const selectedDayAppointments = monthSheetSelectedDay
                  ? filtered.filter(a => {
                    const appDate = parseAppointmentDateTime(a.start_time);
                    if (!appDate) return false;
                    return appDate.toDateString() === monthSheetSelectedDay.toDateString();
                  }).sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time))
                  : [];

                return (
                  <div className="space-y-4">
                    {/* Calendar grid */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">

                      {/* Day headers */}
                      <div className="grid grid-cols-7 gap-0 border-b border-slate-200">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                          <div key={day} className="p-3 text-center border-r border-slate-100 last:border-r-0 bg-slate-50">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{day}</p>
                          </div>
                        ))}
                      </div>

                      {/* Calendar weeks */}
                      {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7 gap-0 border-b border-slate-200 last:border-b-0">
                          {week.map((day, dayIndex) => {
                            if (!day) {
                              return <div key={dayIndex} className="border-r border-slate-100 last:border-r-0 bg-slate-50/50" />;
                            }

                            const dayAppointments = filtered.filter(a => {
                              const appDate = parseAppointmentDateTime(a.start_time);
                              if (!appDate) return false;
                              return appDate.toDateString() === day.toDateString();
                            });

                            const isToday = day.toDateString() === new Date().toDateString();
                            const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                            const isSelected = monthSheetSelectedDay?.toDateString() === day.toDateString();
                            const hasAppointments = dayAppointments.length > 0;

                            return (
                              <div
                                key={dayIndex}
                                onClick={() => setMonthSheetSelectedDay(day)}
                                className={`border-r border-slate-100 last:border-r-0 min-h-[100px] p-2 cursor-pointer transition-all relative ${isSelected
                                    ? 'bg-primary/10 border-primary/50'
                                    : isToday
                                      ? 'bg-primary/5 hover:bg-primary/10'
                                      : 'bg-white hover:bg-slate-50'
                                  } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                              >
                                {/* Day number */}
                                <div className={`text-sm font-bold mb-2 ${isToday
                                    ? 'text-primary'
                                    : isCurrentMonth
                                      ? 'text-slate-900'
                                      : 'text-slate-400'
                                  }`}>
                                  {day.getDate()}
                                </div>

                                {/* Today indicator dot */}
                                {isToday && (
                                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
                                )}

                                {/* Appointment indicators */}
                                {hasAppointments && (
                                  <div className="space-y-0.5">
                                    <div className="flex gap-0.5 flex-wrap">
                                      {dayAppointments.slice(0, 2).map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                                      ))}
                                    </div>
                                    <div className="text-[10px] font-bold text-primary">
                                      {dayAppointments.length} {dayAppointments.length === 1 ? 'consulta' : 'consultas'}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    {/* Bottom Sheet for selected day */}
                    {monthSheetSelectedDay && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setMonthSheetSelectedDay(null)}
                      />
                    )}
                    {monthSheetSelectedDay && (
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 z-[1000] bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto pb-32"
                      >
                        {/* Grab handle */}
                        <div className="flex justify-center pt-3 pb-1">
                          <div className="w-9 h-1 rounded-full bg-slate-300" />
                        </div>
                        <div className="p-6 pt-2 space-y-6">
                          {/* Close button and header */}
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900">
                                {monthSheetSelectedDay.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', weekday: 'long' })}
                              </h3>
                              <p className="text-sm text-slate-500 mt-1">
                                {selectedDayAppointments.length} {selectedDayAppointments.length === 1 ? 'agendamento' : 'agendamentos'}
                              </p>
                            </div>
                            <button
                              onClick={() => setMonthSheetSelectedDay(null)}
                              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                              <X size={24} className="text-slate-400" />
                            </button>
                          </div>

                          {/* Appointments list for selected day */}
                          {selectedDayAppointments.length > 0 ? (
                            <div className="space-y-4 divide-y divide-slate-100">
                              {selectedDayAppointments.map(app => (
                                <div key={app.id} className="pt-4 first:pt-0">
                                  <div className="flex items-start gap-4">
                                    {/* Time */}
                                    <div className="flex-shrink-0 text-center">
                                      <p className="text-lg font-bold text-primary">
                                        {formatAppointmentTime(app.start_time)}
                                      </p>
                                      <p className="text-[10px] text-slate-400 mt-1">
                                        {(() => {
                                          const start = parseAppointmentDateTime(app.start_time);
                                          const end = parseAppointmentDateTime(app.end_time);
                                          if (!start || !end) return '0min';
                                          const mins = Math.round((end.getTime() - start.getTime()) / 60000);
                                          return `${mins}min`;
                                        })()}
                                      </p>
                                    </div>

                                    {/* Patient info and actions */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                          <p className="text-base font-bold text-slate-900">{app.patient_name}</p>
                                          <p className="text-sm text-slate-500 truncate">{app.notes || 'Consulta'}</p>
                                        </div>
                                        <button
                                          onClick={() => {
                                            const patient = patientMap.get(app.patient_id);
                                            if (patient) openPatientRecord(patient.id);
                                            navigate(`/prontuario/${app.patient_id}`);
                                            setMonthSheetSelectedDay(null);
                                          }}
                                          className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-bold hover:opacity-90 transition-all shrink-0"
                                        >
                                          Atender
                                        </button>
                                      </div>

                                      {/* Status and actions */}
                                      <div className="flex items-center gap-2 mt-3">
                                        <select
                                          value={app.status}
                                          onChange={(e) => {
                                            updateAppointmentStatus(app.id, e.target.value as Appointment['status']);
                                            setMonthSheetSelectedDay(null);
                                          }}
                                          className="px-2 py-1 text-base bg-white border border-slate-200 rounded font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                          <option value="SCHEDULED">Agendado</option>
                                          <option value="CONFIRMED">Confirmado</option>
                                          <option value="IN_PROGRESS">Atendendo</option>
                                          <option value="FINISHED">Finalizado</option>
                                          <option value="CANCELLED">Cancelado</option>
                                          <option value="NO_SHOW">Faltou</option>
                                        </select>
                                        <button
                                          onClick={() => sendReminder(app)}
                                          className="p-1.5 text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-all"
                                          title="WhatsApp"
                                        >
                                          <MessageCircle size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-12 text-center space-y-4">
                              <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
                              <p className="text-slate-500 font-medium">Nenhum agendamento para este dia</p>
                              <button
                                onClick={() => {
                                  const slots = findAvailableSlots(monthSheetSelectedDay!);
                                  const dentist_id = user?.id ? user.id.toString() : (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}')?.id?.toString() : '');
                                  setAppointmentModalMode('schedule');
                                  setEditingAppointmentId(null);
                                  if (slots.length > 0) {
                                    const bestSlot = slots[0]; // Biggest slot
                                    setSuggestedSlot({
                                      date: bestSlot.startTime,
                                      duration: bestSlot.duration,
                                      procedure: bestSlot.procedure
                                    });
                                    setNewAppointment({
                                      patient_id: '',
                                      patient_name: '',
                                      dentist_id: dentist_id || '',
                                      date: formatDateInputValue(bestSlot.startTime),
                                      time: formatTimeInputValue(bestSlot.startTime),
                                      duration: Math.floor(bestSlot.duration).toString(),
                                      notes: bestSlot.procedure
                                    });
                                  } else {
                                    setSuggestedSlot(null);
                                    setNewAppointment({
                                      patient_id: '',
                                      patient_name: '',
                                      dentist_id: dentist_id || '',
                                      date: formatDateInputValue(monthSheetSelectedDay!),
                                      time: '',
                                      duration: '30',
                                      notes: ''
                                    });
                                  }
                                  setMonthSheetSelectedDay(null);
                                  setIsModalOpen(true);
                                }}
                                className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-[0_12px_36px_rgba(139,92,246,0.12)] hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
                              >
                                <Plus size={18} />
                                Criar Nova Consulta
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                  </div>
                );
              }

              // Day view - Group by time periods
              const _now = new Date();

              // Finished appointments from the selected day that already happened — shown in "Consultas Anteriores Realizadas"
              const pastFinishedAppointments = filtered.filter(a => {
                const appDate = parseAppointmentDateTime(a.start_time);
                if (!appDate) return false;
                return a.status === 'FINISHED' && appDate <= _now && appDate.toDateString() === selectedDate.toDateString();
              }).sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

              // Remaining appointments (exclude ones already shown above to avoid duplication)
              const todayAppointments = filtered.filter(a => {
                const appDate = parseAppointmentDateTime(a.start_time);
                if (!appDate) return false;
                if (appDate.toDateString() !== selectedDate.toDateString()) return false;
                if (a.status === 'FINISHED' && appDate <= _now) return false;
                return true;
              });

              // Calculate free slots for suggestions
              const freeSlots = getFreeSlots(todayAppointments);

              const morning = todayAppointments.filter(a => {
                const hour = parseAppointmentDateTime(a.start_time)?.getHours() ?? 0;
                return hour >= 6 && hour < 12;
              });
              const afternoon = todayAppointments.filter(a => {
                const hour = parseAppointmentDateTime(a.start_time)?.getHours() ?? 0;
                return hour >= 12 && hour < 18;
              });
              const evening = todayAppointments.filter(a => {
                const hour = parseAppointmentDateTime(a.start_time)?.getHours() ?? 0;
                return hour >= 18 && hour < 22;
              });

              const isToday = selectedDate.toDateString() === new Date().toDateString();

              const renderNowIndicator = () => (
                <div key="now-indicator" className="py-4 px-6 flex items-center gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">Agora</span>
                  </div>
                  <div className="h-[1px] flex-1 bg-rose-200/50" />
                </div>
              );

              const renderPeriod = (apps: Appointment[], periodStart: number, periodEnd: number, label: string) => {
                const nowHour = now.getHours();
                const showNowInThisPeriod = isToday && nowHour >= periodStart && nowHour < periodEnd;

                if (apps.length === 0 && !showNowInThisPeriod) return null;

                // Filter free slots for this period
                const periodFreeSlots = freeSlots.filter(slot => {
                  const slotHour = parseInt(slot.start.split(':')[0]);
                  return slotHour >= periodStart && slotHour < periodEnd;
                });

                // Create timeline items: appointments and suggestions
                const timelineItems: Array<{ type: 'appointment' | 'suggestion' | 'now', item: any, time: number }> = [];

                // Add appointments
                apps.forEach(app => {
                  const appDate = parseAppointmentDateTime(app.start_time);
                  const appTime = appDate ? appDate.getHours() * 60 + appDate.getMinutes() : 0;
                  timelineItems.push({ type: 'appointment', item: app, time: appTime });
                });

                // Add suggestions
                periodFreeSlots.forEach(slot => {
                  const slotTime = parseInt(slot.start.split(':')[0]) * 60 + parseInt(slot.start.split(':')[1]);
                  timelineItems.push({ type: 'suggestion', item: slot, time: slotTime });
                });

                // Add now indicator if in this period
                if (showNowInThisPeriod) {
                  const nowTime = now.getHours() * 60 + now.getMinutes();
                  timelineItems.push({ type: 'now', item: null, time: nowTime });
                }

                // Sort by time
                timelineItems.sort((a, b) => a.time - b.time);

                // Render content
                const content = timelineItems.map(({ type, item }) => {
                  if (type === 'appointment') {
                    return renderAppointment(item);
                  } else if (type === 'suggestion') {
                    return renderSuggestion(item);
                  } else if (type === 'now') {
                    return renderNowIndicator();
                  }
                  return null;
                });

                return (
                  <div key={label} className="py-2">
                    <div className="px-6 py-2 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-academy-muted uppercase tracking-wider">{label}</span>
                    </div>
                    {content}
                  </div>
                );
              };

              return (
                <div className="divide-y divide-[#C6C6C8]/5">
                  {/* Past finished appointments */}
                  {pastFinishedAppointments.length > 0 && (
                    <div className="py-4">
                      <div className="px-6 py-2 flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consultas Anteriores Realizadas</span>
                      </div>
                      <div className="space-y-2">
                        {pastFinishedAppointments.map(app => renderAppointment(app))}
                      </div>
                    </div>
                  )}
                  {renderPeriod(morning, 6, 12, "Manhã")}
                  {renderPeriod(afternoon, 12, 18, "Tarde")}
                  {renderPeriod(evening, 18, 24, "Noite")}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export const AgendaTab = React.memo(AgendaTabComponent);

export { StatusBadge } from './StatusBadge';
export { useAgendaState } from './useAgendaState';
export type { AgendaViewMode, UseAgendaStateParams, UseAgendaStateResult } from './useAgendaState';
