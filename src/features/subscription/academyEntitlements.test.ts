import { describe, expect, it } from 'vitest';
import {
  ACADEMY_FREE_MAX_PATIENTS,
  academyPatientLimitReached,
  canUseAcademyBoxMode,
  isAcademyStudentPlan,
} from './academyEntitlements';

describe('academyEntitlements', () => {
  it('trata student como plano pago', () => {
    expect(isAcademyStudentPlan('student')).toBe(true);
    expect(canUseAcademyBoxMode('student')).toBe(true);
    expect(academyPatientLimitReached('student', 99)).toBe(false);
  });

  it('limita free a um paciente e bloqueia modo box', () => {
    expect(canUseAcademyBoxMode('free')).toBe(false);
    expect(academyPatientLimitReached('free', ACADEMY_FREE_MAX_PATIENTS - 1)).toBe(false);
    expect(academyPatientLimitReached('free', ACADEMY_FREE_MAX_PATIENTS)).toBe(true);
  });
});
