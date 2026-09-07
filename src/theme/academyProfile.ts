export function studentFirstName(name?: string | null) {
  const cleaned = String(name || '')
    .replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '')
    .trim();
  return cleaned.split(/\s+/)[0] || '';
}

export function studentAcademicLine(period?: string | null, institution?: string | null) {
  return [period, institution].map(value => String(value || '').trim()).filter(Boolean).join(' · ');
}

export function studentIdentityHeadline(period?: string | null) {
  const value = String(period || '').trim();
  if (value) return `Você no ${value}.`;
  return 'Você no box.';
}

export function studentSchoolLine(institution?: string | null, discipline?: string | null) {
  const school = String(institution || '').trim();
  const current = String(discipline || '').trim();
  if (school && current) return `${school} · ${current}`;
  return school || current;
}

export function isAcademyStudentPlan(plan?: string | null) {
  return plan === 'student' || plan === 'pro';
}
