import { describe, expect, it } from 'vitest';
import {
  ACADEMY_NEO_COLORWAYS,
  DEFAULT_ACADEMY_NEO_ID,
  getAcademyNeoColorway,
  isAcademyNeoId,
  normalizeAcademyNeoId,
  shouldApplyAcademyNeo,
} from './academyNeo';

describe('Academy Neo colorways', () => {
  it('keeps Azul as the default colorway', () => {
    expect(DEFAULT_ACADEMY_NEO_ID).toBe('blue');
    expect(getAcademyNeoColorway(undefined).id).toBe('blue');
    expect(getAcademyNeoColorway('blue')).toMatchObject({
      neo: '#0088FF',
      soft: '#D6ECFF',
      wash: '#F0F8FF',
    });
  });

  it('uses the Apple system colors in light appearance', () => {
    expect(ACADEMY_NEO_COLORWAYS.map(item => item.id)).toEqual([
      'red',
      'orange',
      'yellow',
      'green',
      'mint',
      'teal',
      'cyan',
      'blue',
      'indigo',
      'purple',
      'pink',
      'brown',
    ]);
    expect(isAcademyNeoId('pink')).toBe(true);
    expect(normalizeAcademyNeoId('rosa')).toBe('pink');
    expect(normalizeAcademyNeoId('azul')).toBe('blue');
    expect(isAcademyNeoId('space-black')).toBe(false);
    expect(getAcademyNeoColorway('red')).toMatchObject({ neo: '#FF383C' });
    expect(getAcademyNeoColorway('green')).toMatchObject({ neo: '#34C759' });
    expect(getAcademyNeoColorway('pink')).toMatchObject({ neo: '#F4B6C8' });
    expect(getAcademyNeoColorway('brown')).toMatchObject({ neo: '#AC7F5E' });
  });

  it('applies Neo on Academy hosts and never on the Pro sistema host', () => {
    expect(shouldApplyAcademyNeo('academy.odontohub.app.br', 'odontohub')).toBe(true);
    expect(shouldApplyAcademyNeo('sistema.odontohub.app.br', 'academy')).toBe(false);
    expect(shouldApplyAcademyNeo('localhost', 'academy')).toBe(true);
    expect(shouldApplyAcademyNeo('localhost', 'odontohub')).toBe(false);
  });
});
