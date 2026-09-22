import { describe, expect, it } from 'vitest';
import { mergeAcademyNavOrder, moveAcademyNavItem } from './academyNav';

describe('Academy nav order', () => {
  it('pins a tile to the front like Control Center', () => {
    const order = ['dashboard', 'agenda', 'pacientes', 'estudos', 'configuracoes'] as const;
    expect(moveAcademyNavItem([...order], 3, 0)).toEqual([
      'estudos',
      'dashboard',
      'agenda',
      'pacientes',
      'configuracoes',
    ]);
  });

  it('slots a tab the student never saw into its default place, not after Conta', () => {
    const saved = ['dashboard', 'pacientes', 'agenda', 'estudos', 'configuracoes'];
    expect(mergeAcademyNavOrder(saved)).toEqual(['dashboard', 'base', 'pacientes', 'agenda', 'estudos', 'configuracoes']);
  });

  it('respects a custom order and drops unknown ids', () => {
    const saved = ['estudos', 'dashboard', 'legacy', 'configuracoes', 'pacientes', 'agenda'];
    expect(mergeAcademyNavOrder(saved)).toEqual(['estudos', 'dashboard', 'base', 'configuracoes', 'pacientes', 'agenda']);
  });

  it('returns the default order for an empty save', () => {
    expect(mergeAcademyNavOrder([])).toEqual(['dashboard', 'base', 'pacientes', 'agenda', 'estudos', 'configuracoes']);
  });
});
