import { useCallback, useMemo } from 'react';
import type { Appointment, Patient } from '../../types/clinical';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentTime,
  isSameAppointmentDay,
  parseAppointmentDateTime,
} from '../../utils/dateUtils';

export type AgendaViewMode = 'day' | 'week' | 'month';

export interface UseAgendaStateParams {
  appointments: Appointment[];
  patients: Patient[];
  statusFilter: string[];
  agendaSearchTerm: string;
  agendaViewMode: AgendaViewMode;
  selectedDate: Date;
  now: Date;
}

export interface UseAgendaStateResult {
  patientMap: Map<number, Patient>;
  filteredAppointments: Appointment[];
  getPatientWeekRole: (appointment: Appointment, weekAppointments: Appointment[]) => string;
  agendaSmartCopy: string;
}

export function useAgendaState({
  appointments,
  patients,
  statusFilter,
  agendaSearchTerm,
  agendaViewMode,
  selectedDate,
  now,
}: UseAgendaStateParams): UseAgendaStateResult {
  const patientMap = useMemo(() => {
    const map = new Map<number, Patient>();
    for (const p of patients) map.set(p.id, p);
    return map;
  }, [patients]);

  const filteredAppointments = useMemo(() => {
    const effectiveStatusFilter = [...statusFilter, 'FINISHED', 'NO_SHOW'].filter(
      (v, i, a) => a.indexOf(v) === i
    );
    let filtered = appointments
      .filter(a => effectiveStatusFilter.length === 0 || effectiveStatusFilter.includes(a.status))
      .filter(
        a =>
          agendaSearchTerm === '' ||
          (a.patient_name || '').toLowerCase().includes((agendaSearchTerm || '').toLowerCase())
      );

    if (agendaViewMode === 'day') {
      filtered = filtered.filter(a => {
        const appDate = parseAppointmentDateTime(a.start_time);
        if (!appDate) return false;
        return appDate.toDateString() === selectedDate.toDateString();
      });
    } else if (agendaViewMode === 'week') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      filtered = filtered.filter(a => {
        const appDate = parseAppointmentDateTime(a.start_time);
        if (!appDate) return false;
        return appDate >= startOfWeek && appDate <= endOfWeek;
      });
    } else if (agendaViewMode === 'month') {
      filtered = filtered.filter(a => {
        const appDate = parseAppointmentDateTime(a.start_time);
        if (!appDate) return false;
        return (
          appDate.getMonth() === selectedDate.getMonth() &&
          appDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    return filtered.sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));
  }, [appointments, statusFilter, agendaSearchTerm, agendaViewMode, selectedDate]);

  const getPatientWeekRole = useCallback(
    (appointment: Appointment, weekAppointments: Appointment[]) => {
      const patientWeekAppointments = weekAppointments
        .filter(app => app.patient_id === appointment.patient_id)
        .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));
      const appointmentIndex = patientWeekAppointments.findIndex(app => app.id === appointment.id);

      const hasPreviousCare = appointments.some(
        other =>
          other.patient_id === appointment.patient_id &&
          other.id !== appointment.id &&
          getAppointmentTime(other.start_time) < getAppointmentTime(appointment.start_time) &&
          !['CANCELLED', 'NO_SHOW'].includes(String(other.status || '').toUpperCase())
      );

      if (appointmentIndex > 0) return hasPreviousCare ? 'Retorno' : 'Continuação';
      return hasPreviousCare ? 'Retorno' : 'Primeira consulta';
    },
    [appointments]
  );

  const agendaSmartCopy = useMemo(() => {
    const activeStatuses = new Set(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekAppointments = appointments
      .filter(app => activeStatuses.has(String(app.status || '').toUpperCase()))
      .filter(app => {
        const appDate = parseAppointmentDateTime(app.start_time);
        if (!appDate) return false;
        return appDate >= startOfWeek && appDate <= endOfWeek;
      })
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

    if (weekAppointments.length === 0) return 'Semana tranquila por enquanto.';

    const repeatedPatient = (
      Array.from(
        weekAppointments
          .reduce((map, app) => {
            const key = app.patient_id || app.patient_name;
            const current = map.get(key) || [];
            current.push(app);
            map.set(key, current);
            return map;
          }, new Map<string | number, Appointment[]>())
          .values()
      ) as Appointment[][]
    )
      .filter(items => items.length > 1)
      .sort((a, b) => b.length - a.length)[0];

    if (repeatedPatient) {
      const ordered = [...repeatedPatient].sort(
        (a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time)
      );
      const firstAppointment = ordered[0];
      const firstName = (firstAppointment.patient_name || 'Paciente').split(' ')[0];
      const days = ordered
        .map(app => formatAppointmentDate(app.start_time, { weekday: 'long' }).replace('-feira', ''))
        .filter((day, index, list) => list.indexOf(day) === index)
        .join(' e ');
      const time = formatAppointmentTime(firstAppointment.start_time);
      const firstRole = getPatientWeekRole(firstAppointment, weekAppointments);
      const firstAction =
        firstRole === 'Primeira consulta' ? 'Anamnese primeiro.' : 'Revise a evolução.';
      return `${firstName}: ${ordered.length} atendimentos. ${days}, ${time}. ${firstAction}`;
    }

    const hasPreviousCare = (app: Appointment) => {
      const patient = patientMap.get(app.patient_id);
      const evolutions = patient?.evolution || patient?.clinicalEvolution || [];
      const hasEvolution = Array.isArray(evolutions) && evolutions.length > 0;
      const hasLastEvolution = Boolean(patient?.last_evolution_date);
      const hasPastAppointment = appointments.some(
        other =>
          other.patient_id === app.patient_id &&
          other.id !== app.id &&
          getAppointmentTime(other.start_time) < getAppointmentTime(app.start_time) &&
          !['CANCELLED', 'NO_SHOW'].includes(String(other.status || '').toUpperCase())
      );
      return hasEvolution || hasLastEvolution || hasPastAppointment;
    };

    const firstConsultation = weekAppointments.find(app => !hasPreviousCare(app));
    if (firstConsultation) {
      const firstName = (firstConsultation.patient_name || 'Paciente').split(' ')[0];
      return `${firstName} faz primeira consulta. Anamnese antes do box.`;
    }

    const returnAppointment = weekAppointments.find(app => hasPreviousCare(app));
    if (returnAppointment) return 'Retorno marcado. Revise a última evolução.';

    const todayAppointment = weekAppointments.find(app => isSameAppointmentDay(app.start_time, now));
    if (todayAppointment) return 'Hoje tem clínica.';

    const nextAppointment =
      weekAppointments.find(app => getAppointmentTime(app.start_time) >= now.getTime()) ||
      weekAppointments[0];
    const day = formatAppointmentDate(nextAppointment.start_time, { weekday: 'long' }).replace(
      '-feira',
      ''
    );
    return `Seu próximo atendimento é ${day} com ${nextAppointment.patient_name}.`;
  }, [appointments, getPatientWeekRole, now, patientMap, selectedDate]);

  return {
    patientMap,
    filteredAppointments,
    getPatientWeekRole,
    agendaSmartCopy,
  };
}
