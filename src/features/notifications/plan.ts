export interface StudyReminderInput {
  streak: number;
  goalReached: boolean;
  lastDay: string | null;
  today: string;
}

export interface AppointmentReminderInput {
  id: number | string;
  patientName: string;
  startMs: number;
  status: string;
}

export interface PlannedNotification {
  id: string;
  title: string;
  body: string;
  at: number;
  url: string;
}

const STUDY_HOUR = 19;
const APPOINTMENT_LEAD_MS = 60 * 60 * 1000;
const HORIZON_MS = 48 * 60 * 60 * 1000;

export function nextStudyReminderAt(now: Date): number {
  const at = new Date(now);
  at.setHours(STUDY_HOUR, 0, 0, 0);
  at.setSeconds(0, 0);
  if (at.getTime() <= now.getTime()) at.setDate(at.getDate() + 1);
  return at.getTime();
}

function clock(ms: number): string {
  return new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/** The next phone notifications: the daily question at 19:00, and each visit one hour before. */
export function planPhoneNotifications(input: {
  now: Date;
  study: StudyReminderInput;
  appointments: AppointmentReminderInput[];
}): PlannedNotification[] {
  const items: PlannedNotification[] = [];
  const { study, now } = input;
  const streakAtRisk = study.streak > 0 && study.lastDay !== study.today;

  if (!study.goalReached) {
    items.push({
      id: 'academy-study',
      title: streakAtRisk ? 'Ofensiva' : 'Questão do dia',
      body: streakAtRisk
        ? `São ${study.streak} ${study.streak === 1 ? 'dia' : 'dias'}. A questão de hoje segura a sequência.`
        : 'A questão de hoje ainda está aberta.',
      at: nextStudyReminderAt(now),
      url: '/',
    });
  }

  const start = now.getTime();
  const horizon = start + HORIZON_MS;
  for (const appointment of input.appointments) {
    const status = String(appointment.status || '').toUpperCase();
    if (status !== 'SCHEDULED' && status !== 'CONFIRMED') continue;
    if (!Number.isFinite(appointment.startMs)) continue;
    const at = appointment.startMs - APPOINTMENT_LEAD_MS;
    if (at <= start || at > horizon) continue;
    items.push({
      id: `academy-appointment-${appointment.id}`,
      title: `Atendimento às ${clock(appointment.startMs)}`,
      body: appointment.patientName || 'Paciente na cadeira',
      at,
      url: '/',
    });
  }

  return items.sort((a, b) => a.at - b.at);
}
