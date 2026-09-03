import { describe, expect, it } from 'vitest';
import {
  ACADEMY_NEO_COLORWAYS,
  DEFAULT_ACADEMY_NEO_ID,
  getAcademyNeoColorway,
  isAcademyNeoId,
  shouldApplyAcademyNeo,
} from './academyNeo';

describe('Academy Neo colorways', () => {
  it('keeps Laranja as the default colorway', () => {
    expect(DEFAULT_ACADEMY_NEO_ID).toBe('laranja');
    expect(getAcademyNeoColorway(undefined)).toEqual(ACADEMY_NEO_COLORWAYS[0]);
    expect(getAcademyNeoColorway('laranja')).toMatchObject({
      neo: '#FF6B2C',
      soft: '#FFD8C4',
      wash: '#FFF4ED',
    });
  });

  it('accepts the five landing colorways and rejects unknown ids', () => {
    expect(ACADEMY_NEO_COLORWAYS.map(item => item.id)).toEqual([
      'laranja',
      'lima',
      'azul',
      'rosa',
      'violeta',
    ]);
    expect(isAcademyNeoId('violeta')).toBe(true);
    expect(isAcademyNeoId('space-black')).toBe(false);
    expect(getAcademyNeoColorway('violeta')).toMatchObject({
      neo: '#BF5AF2',
      wash: '#F8F0FD',
    });
  });

  it('applies Neo on Academy hosts and never on the Pro sistema host', () => {
    expect(shouldApplyAcademyNeo('academy.odontohub.app.br', 'odontohub')).toBe(true);
    expect(shouldApplyAcademyNeo('sistema.odontohub.app.br', 'academy')).toBe(false);
    expect(shouldApplyAcademyNeo('localhost', 'academy')).toBe(true);
    expect(shouldApplyAcademyNeo('localhost', 'odontohub')).toBe(false);
  });
});
