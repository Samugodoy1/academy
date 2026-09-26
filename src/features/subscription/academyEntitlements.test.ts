import { describe, expect, it } from 'vitest';
import { isLessonUnlocked, isMindMapUnlocked } from '../base/plan';
import { limitsFor } from '../game/plan';
import {
  ACADEMY_FREE_MAX_PATIENTS,
  academyGamePlan,
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

  it('libera a cadeira no Clínico e mantém os estudos no Student', () => {
    expect(isAcademyStudentPlan('clinico')).toBe(false);
    expect(canUseAcademyBoxMode('clinico')).toBe(true);
    expect(academyPatientLimitReached('clinico', 9)).toBe(false);
    expect(academyPatientLimitReached('clinico', 10)).toBe(true);
  });

  it('abre todas as disciplinas e limita a Cola a 5 lições no Clínico', () => {
    expect(academyGamePlan('clinico')).toBe('clinico');
    expect(limitsFor('clinico').dailyLessons).toBe(5);
    expect(limitsFor('student').dailyLessons).toBeNull();
    expect(isLessonUnlocked('clinico', 4)).toBe(true);
    expect(isMindMapUnlocked('clinico', 3)).toBe(true);
    expect(isLessonUnlocked('free', 4)).toBe(false);
  });

  it('limita free a um paciente e bloqueia modo box', () => {
    expect(canUseAcademyBoxMode('free')).toBe(false);
    expect(academyPatientLimitReached('free', ACADEMY_FREE_MAX_PATIENTS - 1)).toBe(false);
    expect(academyPatientLimitReached('free', ACADEMY_FREE_MAX_PATIENTS)).toBe(true);
  });
});
