import { describe, expect, it } from 'vitest';
import {
  classifyProcedureText,
  countClinicalSkills,
  detectClinicalGaps,
  suggestNextClinicalStep,
} from './clinicalProgression';

describe('clinicalProgression', () => {
  it('classifies restorative procedures', () => {
    expect(classifyProcedureText('Restauração classe II')).toBe('restauracao');
    expect(classifyProcedureText('Resina composta')).toBe('restauracao');
  });

  it('counts skills from evolutions', () => {
    const patients = [
      {
        evolution: [
          { procedure_performed: 'Restauração classe I', date: '2026-01-10' },
          { procedure_performed: 'Restauração classe II', date: '2026-01-12' },
          { procedure_performed: 'Raspagem supragengival', date: '2026-01-15' },
        ],
      },
    ];

    const counts = countClinicalSkills(patients);
    expect(counts.find(item => item.skill === 'restauracao')?.count).toBe(2);
    expect(counts.find(item => item.skill === 'raspagem')?.count).toBe(1);
  });

  it('does not suggest isolamento when restorations already imply isolation', () => {
    const skillCounts = [
      { skill: 'restauracao' as const, label: 'restaurações', count: 4 },
      { skill: 'isolamento' as const, label: 'casos com isolamento', count: 4 },
    ];
    const next = suggestNextClinicalStep(skillCounts);
    expect(next?.label).not.toContain('isolamento');
  });

  it('counts restorations as implicit isolamento experience', () => {
    const patients = [
      {
        evolution: [
          { procedure_performed: 'Restauração classe I', date: '2026-01-10' },
          { procedure_performed: 'Restauração classe II', date: '2026-01-12' },
        ],
      },
    ];

    const counts = countClinicalSkills(patients);
    expect(counts.find(item => item.skill === 'isolamento')?.count).toBe(2);

    const gaps = detectClinicalGaps(counts);
    expect(gaps.some(gap => gap.id === 'no-isolamento')).toBe(false);
  });

  it('detects restorative vs surgical gap', () => {
    const skillCounts = [
      { skill: 'restauracao' as const, label: 'restaurações', count: 6 },
    ];
    const gaps = detectClinicalGaps(skillCounts);
    expect(gaps.some(gap => gap.id === 'restorative-vs-surgical')).toBe(true);
  });
});
