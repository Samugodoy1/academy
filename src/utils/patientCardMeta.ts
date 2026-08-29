import type { Appointment, Patient } from '../types/clinical';
import {
  formatDate,
  formatDateInputValue,
  getAppointmentTime,
  parseAppointmentDateTime,
} from './dateUtils';

export type AttentionKey = 'overdue' | 'review' | 'up-to-date' | 'lead';
export type PatientStatus = 'em_tratamento' | 'atrasado' | 'revisao' | 'em_dia' | 'lead';

export interface AttentionStatus {
  key: AttentionKey;
  label: string;
  dot: string;
  tone: string;
}

export interface PatientCardMeta {
  lastVisitDate: Date | null;
  lastVisitLabel: string;
  clinicalStatus: string;
  attentionStatus: AttentionStatus;
  hasActiveTreatment: boolean;
  nextVisitDate: Date | null;
  nextVisitLabel: string | null;
  isInRecallProgram: boolean;
  daysSinceLastVisit: number;
  status: PatientStatus;
  isLead: boolean;
}

export function getPatientLastVisitDate(patient: Patient, appointments: Appointment[]): Date | null {
  const finishedAppointments = appointments
    .filter(app => app.patient_id === patient.id && app.status === 'FINISHED')
    .sort((a, b) => getAppointmentTime(b.start_time) - getAppointmentTime(a.start_time));

  if (finishedAppointments.length > 0) {
    return parseAppointmentDateTime(finishedAppointments[0].start_time);
  }

  if (patient.evolution && patient.evolution.length > 0) {
    const evolutionDates = patient.evolution
      .map(item => new Date(item.date))
      .filter(date => !Number.isNaN(date.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    return evolutionDates[0] || null;
  }

  return null;
}

export function formatTimeSinceLastVisit(date: Date | null): string {
  if (!date) return 'Sem visitas registradas';

  const nowDate = new Date();
  const diffInDays = Math.max(0, Math.floor((nowDate.getTime() - date.getTime()) / 86400000));

  if (diffInDays < 30) {
    if (diffInDays <= 1) return 'há 1 dia';
    if (diffInDays < 7) return `há ${diffInDays} dias`;
    const weeks = Math.floor(diffInDays / 7);
    return `há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }

  const months = Math.max(1, Math.floor(diffInDays / 30));
  if (months < 12) {
    return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }

  const years = Math.floor(months / 12);
  return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

export function formatNextVisitLabel(date: Date | null, now: Date): string | null {
  if (!date) return null;

  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const startTomorrow = new Date(startToday);
  startTomorrow.setDate(startTomorrow.getDate() + 1);
  const startAfterTomorrow = new Date(startTomorrow);
  startAfterTomorrow.setDate(startAfterTomorrow.getDate() + 1);

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const timeLabel = `${hh}:${mm}`;

  if (date >= startToday && date < startTomorrow) {
    return `Hoje, ${timeLabel}`;
  }
  if (date >= startTomorrow && date < startAfterTomorrow) {
    return `Amanhã, ${timeLabel}`;
  }
  return `${formatDate(formatDateInputValue(date))}, ${timeLabel}`;
}

export function getPatientCardMeta(
  patient: Patient,
  appointments: Appointment[],
  now: Date
): PatientCardMeta {
  const lastVisitDate = getPatientLastVisitDate(patient, appointments);

  // hasActiveTreatment: treatment plan with open items OR a future scheduled/confirmed appointment
  const hasActiveTreatment =
    (patient.treatmentPlan?.some(plan => plan.status === 'PLANEJADO' || plan.status === 'APROVADO') ?? false) ||
    appointments.some(app =>
      app.patient_id === patient.id &&
      getAppointmentTime(app.start_time) > now.getTime() &&
      app.status !== 'CANCELLED' && app.status !== 'FINISHED'
    );

  // nextVisitDate: nearest upcoming SCHEDULED/CONFIRMED appointment.
  const scheduledAppointments = appointments
    .filter(app =>
      app.patient_id === patient.id &&
      (app.status === 'SCHEDULED' || app.status === 'CONFIRMED')
    )
    .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

  const nextVisitAppointment = scheduledAppointments.find(app => getAppointmentTime(app.start_time) >= now.getTime()) ?? null;
  const nextVisitDate: Date | null = nextVisitAppointment ? parseAppointmentDateTime(nextVisitAppointment.start_time) : null;

  // isInRecallProgram: patient has at least one recorded visit (ever seen before)
  const isInRecallProgram = lastVisitDate !== null;

  // Fallback signal when there's no next visit scheduled.
  const daysSinceLastVisit = lastVisitDate
    ? Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
    : Number.POSITIVE_INFINITY;

  // Clinical priority rules (strict order):
  // 1. em_tratamento – nextVisitDate exists and today <= nextVisitDate
  // 2. atrasado      – daysSinceLastVisit > 180 (only when nextVisitDate is null)
  // 3. revisao       – daysSinceLastVisit > 90  (only when nextVisitDate is null)
  // 4. em_dia        – otherwise

  let attentionKey: AttentionKey;
  let status: PatientStatus;
  let clinicalStatus: string;

  // Lead: never visited, no future appointments, no active treatment plan
  const isLead = !isInRecallProgram && nextVisitDate === null && !hasActiveTreatment;

  if (isLead) {
    status = 'lead';
    attentionKey = 'lead';
    clinicalStatus = 'Caso novo';
  } else if (nextVisitDate !== null && now <= nextVisitDate) {
    status = 'em_tratamento';
    attentionKey = 'up-to-date';
    clinicalStatus = 'Em tratamento';
  } else if (nextVisitDate !== null && now > nextVisitDate) {
    // Missed scheduled appointment should still be treated as attention-needed.
    status = 'atrasado';
    attentionKey = 'overdue';
    clinicalStatus = 'Inativo';
  } else if (nextVisitDate === null) {
    if (daysSinceLastVisit > 180) {
      status = 'atrasado';
      attentionKey = 'overdue';
      clinicalStatus = 'Inativo';
    } else if (daysSinceLastVisit > 90) {
      status = 'revisao';
      attentionKey = 'review';
      clinicalStatus = 'Revisão';
    } else {
      status = 'em_dia';
      attentionKey = 'up-to-date';
      clinicalStatus = 'Em dia';
    }
  } else {
    status = 'em_dia';
    attentionKey = 'up-to-date';
    clinicalStatus = 'Em dia';
  }

  const attentionStatusMap: Record<AttentionKey, AttentionStatus> = {
    overdue: { key: 'overdue', label: 'Sem visita há tempo', dot: 'bg-rose-500', tone: 'text-rose-700 bg-rose-50 border-rose-100' },
    review: { key: 'review', label: 'Revisão próxima', dot: 'bg-amber-400', tone: 'text-amber-700 bg-amber-50 border-amber-100' },
    'up-to-date': { key: 'up-to-date', label: 'Em dia', dot: 'bg-emerald-500', tone: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    lead: { key: 'lead', label: 'Caso novo', dot: 'bg-academy-primary', tone: 'text-academy-primary-dark bg-academy-soft border-violet-100' },
  };

  return {
    lastVisitDate,
    lastVisitLabel: formatTimeSinceLastVisit(lastVisitDate),
    clinicalStatus,
    attentionStatus: attentionStatusMap[attentionKey],
    hasActiveTreatment,
    nextVisitDate,
    nextVisitLabel: formatNextVisitLabel(nextVisitDate, now),
    isInRecallProgram,
    daysSinceLastVisit,
    status,
    isLead,
  };
}

export function formatProcedure(input: string): string {
  const normalized = (input || '').trim();
  if (!normalized) return '';

  const lower = normalized.toLowerCase();

  // Endodontia shorthand
  const endoMatch = lower.match(/\b(?:endo|canal)\b\s*(\d{1,2})/);
  if (endoMatch) {
    return `Endodontia dente ${endoMatch[1]}`;
  }

  // Restauração shorthand
  const restaMatch = lower.match(/\b(?:restaura(?:c|ç)ao|restauração|resina)\b(?:\s+dente\s*(\d{1,2}))?/);
  if (restaMatch) {
    return restaMatch[1] ? `Restauração dente ${restaMatch[1]}` : 'Restauração';
  }

  // Extração shorthand
  const exoMatch = lower.match(/\b(?:extra(?:c|ç)ao|extração|exo)\b\s*(\d{1,2})?/);
  if (exoMatch) {
    return exoMatch[1] ? `Extração dente ${exoMatch[1]}` : 'Extração';
  }

  // Limpeza / profilaxia
  if (/\b(?:higiene|limpeza|profilaxia)\b/.test(lower)) {
    return 'Limpeza';
  }

  // Fallback: capitalize words
  return normalized
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
