export const ACADEMY_FREE_MAX_PATIENTS = 1;
export const ACADEMY_FREE_MAX_APPOINTMENTS_PER_MONTH = 10;

export type AcademyPlan = 'free' | 'student';

export function normalizeAcademyPlan(plan: string | null | undefined): AcademyPlan {
  return plan === 'student' ? 'student' : 'free';
}

export function isAcademyStudentPlan(plan: string | null | undefined): boolean {
  return normalizeAcademyPlan(plan) === 'student';
}

export function canUseAcademyBoxMode(plan: string | null | undefined): boolean {
  return isAcademyStudentPlan(plan);
}

export function canExportAcademyClinicalPdf(plan: string | null | undefined): boolean {
  return isAcademyStudentPlan(plan);
}

export function academyPatientLimitReached(
  plan: string | null | undefined,
  patientCount: number,
): boolean {
  if (isAcademyStudentPlan(plan)) return false;
  return patientCount >= ACADEMY_FREE_MAX_PATIENTS;
}
