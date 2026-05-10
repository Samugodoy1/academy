import { parseAppointmentDateTime } from './dateUtils';

// ── Types ──────────────────────────────────────────────────────────────────

interface EvolutionRecord {
  id?: number;
  date?: string;
  created_at?: string;
  notes?: string;
  procedure?: string;
  procedure_performed?: string;
  materials?: string;
  observations?: string;
}

interface AppointmentRecord {
  id: number;
  patient_id: number;
  patient_name?: string;
  start_time: string;
  end_time?: string;
  status: string;
  notes?: string;
  procedure?: string;
}

interface AnamnesisRecord {
  medical_history?: string;
  allergies?: string;
  medications?: string;
  systemic_diseases?: string;
  clinical_notes?: string;
  chief_complaint?: string;
  habits?: string;
  family_history?: string;
  vital_signs?: string;
}

interface PatientRecord {
  id: number;
  name?: string;
  evolution?: EvolutionRecord[];
  clinicalEvolution?: EvolutionRecord[];
  anamnesis?: AnamnesisRecord;
  treatmentPlan?: Array<{ status: string; procedure?: string }>;
  procedures?: Array<{ id: number; date: string }>;
  odontogram?: Record<string, unknown>;
  odontogram_data?: unknown;
  has_odontogram_record?: boolean;
  last_evolution_date?: string;
  evolution_count?: number;
  created_at?: string;
}

// ── Pending types returned by the state derivation ─────────────────────────

export type PendingKind =
  | 'evolution'
  | 'anamnesis'
  | 'odontogram'
  | 'schedule_first'
  | 'schedule_return';

export interface PatientPending {
  kind: PendingKind;
  label: string;
  appointmentId?: number;
}

export interface PatientStateResult {
  pendings: PatientPending[];
  /** Appointments that are FINISHED and still need an evolution record. */
  finishedWithoutEvolution: AppointmentRecord[];
  /** Short text for the Casos card. */
  pendingLabel: string;
  /** Whether this patient should appear in the "Para fechar" list. */
  showInParaFechar: boolean;
}

// ── Helpers (private) ──────────────────────────────────────────────────────

const ANAMNESIS_FIELDS: (keyof AnamnesisRecord)[] = [
  'medical_history',
  'allergies',
  'medications',
  'systemic_diseases',
  'clinical_notes',
  'chief_complaint',
  'habits',
  'family_history',
  'vital_signs',
];

const ACTIVE_STATUSES = new Set(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);

const norm = (s?: string) => String(s || '').toUpperCase();

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  return parseAppointmentDateTime(value);
};

function hasFilledAnamnesis(anamnesis?: AnamnesisRecord): boolean {
  if (!anamnesis) return false;
  return ANAMNESIS_FIELDS.some(field => {
    const v = anamnesis[field];
    return typeof v === 'string' ? v.trim().length > 0 : Boolean(v);
  });
}

function hasObjectData(value: unknown): boolean {
  if (!value) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed === '{}') return false;
    try { return hasObjectData(JSON.parse(trimmed)); } catch { return trimmed.length > 0; }
  }
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as object).length > 0;
  return Boolean(value);
}

function hasOdontogramData(patient: PatientRecord): boolean {
  if (hasObjectData(patient.odontogram) || hasObjectData(patient.odontogram_data)) return true;
  const plans = patient.treatmentPlan || [];
  if (Array.isArray(plans) && plans.length > 0) return true;
  const procs = patient.procedures || [];
  if (Array.isArray(procs) && procs.length > 0) return true;
  return patient.has_odontogram_record === true;
}

function getEvolutions(patient: PatientRecord): EvolutionRecord[] {
  const evos = patient.evolution || patient.clinicalEvolution || [];
  return Array.isArray(evos) ? evos : [];
}

function hasTreatmentActivity(patient: PatientRecord): boolean {
  const plans = patient.treatmentPlan || [];
  if (Array.isArray(plans) && plans.length > 0) return true;
  if (getEvolutions(patient).length > 0) return true;
  return Boolean(patient.last_evolution_date || Number(patient.evolution_count || 0) > 0);
}

/**
 * Check whether a FINISHED appointment has a matching evolution record.
 *
 * Since the `clinical_evolution` table has no `appointment_id` column,
 * we match by date: an evolution whose date/created_at is on the same day
 * or after the appointment's start_time is considered to "cover" that
 * appointment.
 */
function appointmentHasEvolution(
  appointment: AppointmentRecord,
  patient: PatientRecord,
): boolean {
  const start = parseDate(appointment.start_time);
  if (!start) return false;

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());

  if (patient.last_evolution_date) {
    const lastEvo = parseDate(patient.last_evolution_date);
    if (lastEvo && lastEvo >= startDay) return true;
  }

  return getEvolutions(patient).some(evo => {
    const d = parseDate(evo.date || evo.created_at);
    return d ? d >= startDay : false;
  });
}

// ── Main derivation ────────────────────────────────────────────────────────

/**
 * Centralized, single-source-of-truth function that derives the clinical
 * state of a patient in Academy.  All screens (Dashboard / Rotina, Casos,
 * main card) must use this function instead of inline logic.
 *
 * Business rules implemented:
 *
 * 1. FINISHED + no evolution  → pending "Fechar evolucao", show in "Para fechar"
 * 2. FINISHED + has evolution → no pending from this appointment
 * 3. Future appointment       → only prep pendings (anamnesis, odontogram)
 * 4. CANCELLED / NO_SHOW      → ignored, no evolution pending
 * 5. No appointment at all    → "Agendar primeira consulta" if new case
 */
export function deriveAcademyPatientState(
  patient: PatientRecord,
  appointments: AppointmentRecord[],
  now: Date = new Date(),
): PatientStateResult {
  const patientAppointments = appointments.filter(a => a.patient_id === patient.id);

  // ── Rule 4: filter out CANCELLED / NO_SHOW ──────────────────────────
  const relevantAppointments = patientAppointments.filter(
    a => !['CANCELLED', 'NO_SHOW'].includes(norm(a.status)),
  );

  // ── Rule 1: FINISHED without evolution ───────────────────────────────
  const finishedApps = relevantAppointments.filter(a => norm(a.status) === 'FINISHED');
  const finishedWithoutEvolution = finishedApps.filter(
    a => !appointmentHasEvolution(a, patient),
  );

  // Deduplicate: keep only the most recent FINISHED appointment per patient
  // (there is only one patient here, but multiple appointments can be pending).
  // We still keep all pending appointments, but deduplicate by appointment id.
  const seenAppIds = new Set<number>();
  const dedupedFinished = finishedWithoutEvolution.filter(a => {
    if (seenAppIds.has(a.id)) return false;
    seenAppIds.add(a.id);
    return true;
  });

  // ── Rule 3: future / active appointments ─────────────────────────────
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const futureAppointments = relevantAppointments
    .filter(a => ACTIVE_STATUSES.has(norm(a.status)))
    .filter(a => {
      const s = parseDate(a.start_time);
      return s ? s >= todayStart : false;
    });

  // ── Build pending list ───────────────────────────────────────────────
  const pendings: PatientPending[] = [];

  // 1. Evolution pendings (one per un-evolved FINISHED appointment)
  for (const app of dedupedFinished) {
    pendings.push({
      kind: 'evolution',
      label: 'Fechar evolucao',
      appointmentId: app.id,
    });
  }

  // 2. Anamnesis pending — only if there are finished or upcoming appointments
  const hasRelevantAppointments = finishedApps.length > 0 || futureAppointments.length > 0;
  if (!hasFilledAnamnesis(patient.anamnesis)) {
    if (hasRelevantAppointments || hasTreatmentActivity(patient)) {
      pendings.push({ kind: 'anamnesis', label: 'Anamnese pendente' });
    }
  }

  // 3. Odontogram pending — same condition
  if (!hasOdontogramData(patient)) {
    if (hasRelevantAppointments || hasTreatmentActivity(patient)) {
      pendings.push({ kind: 'odontogram', label: 'Odontograma pendente' });
    }
  }

  // ── Rule 5: no appointment at all ────────────────────────────────────
  const hasAnyNonCancelledAppointment = relevantAppointments.length > 0;
  if (!hasAnyNonCancelledAppointment && !hasTreatmentActivity(patient)) {
    pendings.push({ kind: 'schedule_first', label: 'Agendar primeira consulta' });
  } else if (
    !hasAnyNonCancelledAppointment &&
    hasTreatmentActivity(patient) &&
    futureAppointments.length === 0
  ) {
    // Patient has history but no future appointment
    pendings.push({ kind: 'schedule_return', label: 'Retorno pendente' });
  }

  // ── Derive summary label ─────────────────────────────────────────────
  const showInParaFechar = dedupedFinished.length > 0;
  let pendingLabel: string;
  if (dedupedFinished.length > 0) {
    pendingLabel = 'Fechar evolucao';
  } else if (pendings.length > 0) {
    pendingLabel = pendings[0].label;
  } else {
    pendingLabel = 'Sem pendencias no momento';
  }

  return {
    pendings,
    finishedWithoutEvolution: dedupedFinished,
    pendingLabel,
    showInParaFechar,
  };
}

// ── Convenience: derive "Para fechar" rows for the dashboard ───────────

export interface ParaFecharRow {
  id: string;
  patientId: number;
  appointmentId: number;
  title: string;
  meta: string;
  tone: 'rose' | 'amber';
}

/**
 * Build a deduplicated list of "Para fechar" rows across all patients.
 * Each FINISHED appointment without evolution produces at most one row.
 * Rows are deduplicated by appointment id.
 */
export function buildParaFecharRows(
  patients: PatientRecord[],
  appointments: AppointmentRecord[],
  now: Date = new Date(),
): ParaFecharRow[] {
  const rows: ParaFecharRow[] = [];
  const seenAppointmentIds = new Set<number>();

  for (const patient of patients) {
    const state = deriveAcademyPatientState(patient, appointments, now);
    for (const app of state.finishedWithoutEvolution) {
      if (seenAppointmentIds.has(app.id)) continue;
      seenAppointmentIds.add(app.id);
      rows.push({
        id: `evolution-${app.id}`,
        patientId: patient.id,
        appointmentId: app.id,
        title: patient.name || app.patient_name || 'Paciente',
        meta: 'Evolucao aberta. Registre o essencial.',
        tone: 'rose',
      });
    }
  }

  // Sort by appointment start_time descending (most recent first)
  rows.sort((a, b) => {
    const appA = appointments.find(x => x.id === a.appointmentId);
    const appB = appointments.find(x => x.id === b.appointmentId);
    const tA = appA ? new Date(appA.start_time).getTime() : 0;
    const tB = appB ? new Date(appB.start_time).getTime() : 0;
    return tB - tA;
  });

  return rows;
}
