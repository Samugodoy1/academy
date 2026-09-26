export const ACADEMY_FREE_MAX_PATIENTS = 1;
export const ACADEMY_FREE_MAX_APPOINTMENTS_PER_MONTH = 10;
export const ACADEMY_CLINICO_MAX_PATIENTS = 10;
export const ACADEMY_CLINICO_MAX_PHOTOS = 50;
export const ACADEMY_CLINICO_DAILY_LESSONS = 5;

export type AcademyPlan = 'free' | 'clinico' | 'student';

export function normalizeAcademyPlan(plan: string | null | undefined): AcademyPlan {
  if (plan === 'student' || plan === 'pro') return 'student';
  if (plan === 'clinico') return 'clinico';
  return 'free';
}

export function isAcademyStudentPlan(plan: string | null | undefined): boolean {
  return normalizeAcademyPlan(plan) === 'student';
}

export function isAcademyClinicalPlan(plan: string | null | undefined): boolean {
  const normalized = normalizeAcademyPlan(plan);
  return normalized === 'clinico' || normalized === 'student';
}

export function canUseAcademyBoxMode(plan: string | null | undefined): boolean {
  return isAcademyClinicalPlan(plan);
}

export function canExportAcademyClinicalPdf(plan: string | null | undefined): boolean {
  return isAcademyClinicalPlan(plan);
}

export function academyPatientLimit(plan: string | null | undefined): number | null {
  const normalized = normalizeAcademyPlan(plan);
  if (normalized === 'student') return null;
  if (normalized === 'clinico') return ACADEMY_CLINICO_MAX_PATIENTS;
  return ACADEMY_FREE_MAX_PATIENTS;
}

export function academyPatientLimitReached(
  plan: string | null | undefined,
  patientCount: number,
): boolean {
  const limit = academyPatientLimit(plan);
  if (limit === null) return false;
  return patientCount >= limit;
}

export function academyGamePlan(plan: string | null | undefined): 'free' | 'clinico' | 'student' {
  return normalizeAcademyPlan(plan);
}
