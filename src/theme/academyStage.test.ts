import { describe, expect, it } from 'vitest';
import { inferAcademyStageFromPeriod, resolveAcademyStage } from './academyStage';

describe('inferAcademyStageFromPeriod', () => {
  it('reads early periods as basic cycle', () => {
    expect(inferAcademyStageFromPeriod('1º período')).toBe('pre-clinico');
    expect(inferAcademyStageFromPeriod('2° semestre')).toBe('pre-clinico');
    expect(inferAcademyStageFromPeriod('P3')).toBe('pre-clinico');
    expect(inferAcademyStageFromPeriod('4')).toBe('pre-clinico');
  });

  it('reads later periods as clinical', () => {
    expect(inferAcademyStageFromPeriod('5º período')).toBe('clinico');
    expect(inferAcademyStageFromPeriod('8º semestre')).toBe('clinico');
    expect(inferAcademyStageFromPeriod('10º')).toBe('clinico');
  });

  it('understands years as well as periods', () => {
    expect(inferAcademyStageFromPeriod('1º ano')).toBe('pre-clinico');
    expect(inferAcademyStageFromPeriod('2º ano')).toBe('pre-clinico');
    expect(inferAcademyStageFromPeriod('3º ano')).toBe('clinico');
  });

  it('gives up without a number', () => {
    expect(inferAcademyStageFromPeriod('')).toBeNull();
    expect(inferAcademyStageFromPeriod(undefined)).toBeNull();
    expect(inferAcademyStageFromPeriod('Clínica integrada')).toBeNull();
  });
});

describe('resolveAcademyStage', () => {
  it('lets the explicit choice win over everything', () => {
    expect(resolveAcademyStage({ stored: 'pre-clinico', academicPeriod: '8º', patientCount: 5 })).toBe('pre-clinico');
    expect(resolveAcademyStage({ stored: 'clinico', academicPeriod: '1º' })).toBe('clinico');
  });

  it('treats anyone with patients as clinical', () => {
    expect(resolveAcademyStage({ stored: null, academicPeriod: '1º período', patientCount: 1 })).toBe('clinico');
  });

  it('falls back to the profile period and then to unknown', () => {
    expect(resolveAcademyStage({ stored: null, academicPeriod: '2º período' })).toBe('pre-clinico');
    expect(resolveAcademyStage({ stored: null })).toBeNull();
  });
});
