/**
 * Where the student is in the course. Pre-clinical students have no patients
 * and no boxes yet, so the Academy leads with the basic-cycle library instead
 * of the chair. The explicit choice always wins; otherwise the period written
 * in the profile and the presence of patients decide.
 */
export type AcademyStage = 'pre-clinico' | 'clinico';

export const ACADEMY_STAGE_KEY = 'odontohub-academy-stage';

/** Periods up to this one are treated as basic cycle in most Brazilian curricula. */
const LAST_PRE_CLINICAL_PERIOD = 4;
const LAST_PRE_CLINICAL_YEAR = 2;

export function isAcademyStage(value: unknown): value is AcademyStage {
  return value === 'pre-clinico' || value === 'clinico';
}

export function readAcademyStage(): AcademyStage | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACADEMY_STAGE_KEY);
    return isAcademyStage(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function persistAcademyStage(stage: AcademyStage | null) {
  if (typeof localStorage === 'undefined') return;
  try {
    if (stage) localStorage.setItem(ACADEMY_STAGE_KEY, stage);
    else localStorage.removeItem(ACADEMY_STAGE_KEY);
  } catch {
    /* storage indisponível: a escolha vale só nesta sessão */
  }
}

/**
 * Reads "3º período", "2° semestre", "1º ano", "P4", "4" and friends.
 * Returns null when the text does not carry a usable number.
 */
export function inferAcademyStageFromPeriod(period?: string | null): AcademyStage | null {
  const text = String(period || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (!text.trim()) return null;

  const match = text.match(/(\d{1,2})/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) return null;

  if (/\bano\b/.test(text)) {
    return value <= LAST_PRE_CLINICAL_YEAR ? 'pre-clinico' : 'clinico';
  }
  return value <= LAST_PRE_CLINICAL_PERIOD ? 'pre-clinico' : 'clinico';
}

export interface ResolveAcademyStageInput {
  stored: AcademyStage | null;
  academicPeriod?: string | null;
  patientCount?: number;
}

/**
 * The explicit choice wins. Someone with patients is clinical no matter the
 * period. Otherwise fall back to the period text; unknown means we should ask.
 */
export function resolveAcademyStage({ stored, academicPeriod, patientCount = 0 }: ResolveAcademyStageInput): AcademyStage | null {
  if (stored) return stored;
  if (patientCount > 0) return 'clinico';
  return inferAcademyStageFromPeriod(academicPeriod);
}

export const STAGE_LABEL: Record<AcademyStage, string> = {
  'pre-clinico': 'Ciclo básico',
  clinico: 'Na clínica',
};
