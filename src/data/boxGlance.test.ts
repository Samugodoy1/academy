import { describe, expect, it } from 'vitest';
import { buildBoxGlance } from './boxGlance';

describe('box plate', () => {
  it('tells a lower third molar restoration what actually fails', () => {
    const plate = buildBoxGlance({
      procedure: 'Dentistica',
      clinicalStage: 'restoration',
      targetTooth: 48,
    });

    expect(plate.hero).toBe('48');
    expect(plate.place).toBe('3º molar · inferior direito');
    expect(plate.cues.map((cue) => cue.lead)).toEqual(['Isolamento', 'Bloqueio', 'Cor agora']);
    expect(plate.cues.find((cue) => cue.id === 'iso')?.note).toMatch(/grampo/i);
    expect(plate.cues.find((cue) => cue.id === 'block')?.note).toMatch(/48/);
  });

  it('puts latex and the unfinished canal ahead of a generic sequence', () => {
    const plate = buildBoxGlance({
      procedure: 'Endodontia',
      clinicalStage: 'endo_access',
      targetTooth: 47,
      allergies: 'Látex',
      workingLength: '21 mm',
    });

    expect(plate.hero).toBe('47');
    expect(plate.cues.map((cue) => cue.id).slice(0, 2)).toEqual(['latex', 'noredo']);
    expect(plate.cues.some((cue) => cue.lead === '21 mm')).toBe(true);
    expect(plate.cues.some((cue) => /acesso coronário|instrumentar com irrigação/i.test(cue.lead))).toBe(false);
  });

  it('names the hidden canal of an upper molar', () => {
    const plate = buildBoxGlance({
      procedure: 'Endodontia',
      clinicalStage: 'endo_initial',
      targetTooth: 16,
    });

    expect(plate.place).toMatch(/1º molar · superior direito/);
    expect(plate.cues.some((cue) => cue.lead === 'MB2')).toBe(true);
  });
});
