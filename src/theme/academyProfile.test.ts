import { describe, expect, it } from 'vitest';
import {
  isAcademyStudentPlan,
  studentAcademicLine,
  studentFirstName,
  studentIdentityHeadline,
  studentSchoolLine,
} from './academyProfile';

describe('Academy profile copy', () => {
  it('keeps the first name and drops the title', () => {
    expect(studentFirstName('Dra. Ana Costa')).toBe('Ana');
    expect(studentFirstName('João Pedro')).toBe('João');
    expect(studentFirstName('')).toBe('');
  });

  it('builds the academic line like the home', () => {
    expect(studentAcademicLine('6º período', 'FOUSP')).toBe('6º período · FOUSP');
    expect(studentAcademicLine('6º período', '')).toBe('6º período');
    expect(studentAcademicLine('', '')).toBe('');
  });

  it('uses the period as identity, not a form label', () => {
    expect(studentIdentityHeadline('6º período')).toBe('Você no 6º período.');
    expect(studentIdentityHeadline('')).toBe('Você no box.');
  });

  it('joins school and the current clinic', () => {
    expect(studentSchoolLine('FOUSP', 'Dentística')).toBe('FOUSP · Dentística');
    expect(studentSchoolLine('FOUSP', '')).toBe('FOUSP');
  });

  it('treats student as the paid academy plan', () => {
    expect(isAcademyStudentPlan('student')).toBe(true);
    expect(isAcademyStudentPlan('free')).toBe(false);
  });
});
