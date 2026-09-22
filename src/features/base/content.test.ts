import { describe, expect, it } from 'vitest';
import { BASE_DISCIPLINES, disciplinesByPeriod, STUDY_METHOD_TIPS } from './content';
import { referenceHref, referenceShortCitation } from './references';

const DOI_PATTERN = /^10\.\d{4,9}\/\S+$/;

describe('Base content integrity', () => {
  it('has unique discipline and lesson ids', () => {
    const disciplineIds = BASE_DISCIPLINES.map(discipline => discipline.id);
    expect(new Set(disciplineIds).size).toBe(disciplineIds.length);

    const lessonIds = BASE_DISCIPLINES.flatMap(discipline => discipline.lessons.map(lesson => lesson.id));
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
  });

  it('backs every lesson with at least one scientific reference from its discipline', () => {
    for (const discipline of BASE_DISCIPLINES) {
      const known = new Set(discipline.references.map(reference => reference.id));
      expect(discipline.references.length).toBeGreaterThan(0);
      for (const lesson of discipline.lessons) {
        expect(lesson.refIds.length, `${lesson.id} sem referência`).toBeGreaterThan(0);
        for (const refId of lesson.refIds) {
          expect(known.has(refId), `${lesson.id} cita ${refId}, que não existe em ${discipline.id}`).toBe(true);
        }
      }
    }
  });

  it('gives every reference a resolvable link (DOI or URL) and a reason', () => {
    const all = [
      ...BASE_DISCIPLINES.flatMap(discipline => discipline.references),
      ...STUDY_METHOD_TIPS.map(tip => tip.reference),
    ];
    for (const reference of all) {
      expect(referenceHref(reference), `${reference.id} sem link`).toBeTruthy();
      if (reference.doi) expect(reference.doi, `${reference.id} DOI malformado`).toMatch(DOI_PATTERN);
      expect(reference.why.length).toBeGreaterThan(10);
      expect(reference.year).toBeGreaterThan(1890);
    }
  });

  it('keeps every lesson complete: key points, sections, bridge, self-check', () => {
    for (const discipline of BASE_DISCIPLINES) {
      expect(discipline.lessons.length).toBeGreaterThanOrEqual(3);
      expect(discipline.mindMap.children?.length ?? 0).toBeGreaterThanOrEqual(3);
      for (const lesson of discipline.lessons) {
        expect(lesson.keyPoints.length).toBeGreaterThanOrEqual(3);
        expect(lesson.sections.length).toBeGreaterThanOrEqual(2);
        expect(lesson.selfCheck.length).toBeGreaterThanOrEqual(3);
        expect(lesson.clinicalBridge.length).toBeGreaterThan(40);
        expect(lesson.minutes).toBeGreaterThan(0);
      }
    }
  });

  it('groups disciplines by period in curriculum order', () => {
    const groups = disciplinesByPeriod();
    const periods = groups.map(group => group.period);
    expect(periods).toEqual([...periods].sort((a, b) => a - b));
    expect(groups.flatMap(group => group.disciplines).length).toBe(BASE_DISCIPLINES.length);
  });
});

describe('reference helpers', () => {
  it('prefers DOI links and falls back to URL', () => {
    expect(referenceHref({ id: 'a', authors: 'X', title: 't', journal: 'j', year: 2000, doi: '10.1/abc', why: 'porque sim' })).toBe(
      'https://doi.org/10.1/abc',
    );
    expect(referenceHref({ id: 'b', authors: 'X', title: 't', journal: 'j', year: 2000, url: 'https://x', why: 'porque sim' })).toBe(
      'https://x',
    );
  });

  it('formats a compact citation', () => {
    expect(
      referenceShortCitation({ id: 'a', authors: 'Pitts NB, Zero DT', title: 't', journal: 'Nat Rev Dis Primers', year: 2017, why: 'porque sim' }),
    ).toBe('Pitts NB et al. · Nat Rev Dis Primers, 2017');
    expect(
      referenceShortCitation({ id: 'a', authors: 'Featherstone JDB', title: 't', journal: 'J Dent Res', year: 2004, why: 'porque sim' }),
    ).toBe('Featherstone JDB · J Dent Res, 2004');
  });
});
