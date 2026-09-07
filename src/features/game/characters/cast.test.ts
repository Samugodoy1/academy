import { describe, expect, it } from 'vitest';
import { GAME_UNITS } from '../content';
import { CAST, CAST_LIST, GUIDE_ID, guide, HOST_BY_TOPIC, hostFor, pickLine } from './cast';

describe('elenco', () => {
  it('dá um anfitrião a cada unidade da trilha', () => {
    GAME_UNITS.forEach(unit => {
      const host = hostFor(unit.topic);
      expect(HOST_BY_TOPIC[unit.topic]).toBeDefined();
      expect(host.id).toBe(HOST_BY_TOPIC[unit.topic]);
    });
  });

  it('usa a guia quando a lição mistura temas', () => {
    expect(hostFor(null)).toBe(guide());
    expect(hostFor(undefined)).toBe(guide());
    expect(CAST[GUIDE_ID]).toBe(guide());
  });

  it('mantém id, nome e falas de todo mundo', () => {
    CAST_LIST.forEach(character => {
      expect(CAST[character.id]).toBe(character);
      expect(character.name.length).toBeGreaterThan(0);
      expect(character.role.length).toBeGreaterThan(0);
      expect(character.lines.intro.length).toBeGreaterThan(0);
      expect(character.lines.right.length).toBeGreaterThan(0);
      expect(character.lines.wrong.length).toBeGreaterThan(0);
    });
  });

  it('escolhe sempre a mesma fala para a mesma semente', () => {
    const lines = CAST.val.lines.right;
    const first = pickLine(lines, 'exame-01');
    expect(pickLine(lines, 'exame-01')).toBe(first);
    expect(lines).toContain(first);
  });

  it('varia a fala entre sementes diferentes', () => {
    const lines = CAST.teo.lines.wrong;
    const picked = new Set(
      Array.from({ length: 40 }, (_, index) => pickLine(lines, `seed-${index}`))
    );
    expect(picked.size).toBeGreaterThan(1);
  });

  it('não quebra com uma lista de falas vazia', () => {
    expect(pickLine([], 'seed')).toBe('');
  });
});
