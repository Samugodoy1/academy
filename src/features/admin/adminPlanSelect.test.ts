import { describe, expect, it } from 'vitest';
import { adminPlanSelectOptions, adminPlanSelectValue } from './adminPlanSelect';

describe('admin plan select', () => {
  it('maps legado academy pro to student so the select is not blank', () => {
    expect(adminPlanSelectValue('academy', 'pro')).toBe('student');
    expect(adminPlanSelectValue('academy', 'student')).toBe('student');
    expect(adminPlanSelectValue('academy', 'free')).toBe('free');
  });

  it('keeps Hub plan values as they are', () => {
    expect(adminPlanSelectValue('odontohub', 'pro')).toBe('pro');
    expect(adminPlanSelectValue('odontohub', 'free')).toBe('free');
  });

  it('offers Free and Student for Academy only', () => {
    expect(adminPlanSelectOptions('academy')).toEqual([
      { value: 'free', label: 'Free' },
      { value: 'student', label: 'Student (embaixador / pago)' },
    ]);
  });

  it('keeps the existing Hub options', () => {
    expect(adminPlanSelectOptions('odontohub')).toEqual([
      { value: 'free', label: 'free' },
      { value: 'pro', label: 'pro' },
    ]);
  });
});
