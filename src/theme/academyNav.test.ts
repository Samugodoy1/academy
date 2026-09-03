import { describe, expect, it } from 'vitest';
import { moveAcademyNavItem } from './academyNav';

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
});
