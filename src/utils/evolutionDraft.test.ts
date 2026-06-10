import { describe, expect, it } from 'vitest';
import { generateEvolutionDraft, inferBoxProcedure } from './evolutionDraft';

describe('evolutionDraft', () => {
  it('infers clinical specialties from procedure text', () => {
    expect(inferBoxProcedure('Tratamento de canal dente 47')).toBe('Endodontia');
    expect(inferBoxProcedure('Restauração em resina classe II')).toBe('Dentistica');
    expect(inferBoxProcedure('Exodontia do dente 38')).toBe('Cirurgia');
  });

  it('builds endodontic draft from appointment and tooth in plan', () => {
    const draft = generateEvolutionDraft({
      patient: {
        treatmentPlan: [{ id: 1, procedure: 'Tratamento endodôntico', tooth_number: 47, status: 'APROVADO' }],
        evolution: [],
      },
      appointment: { id: 10, procedure: 'Endodontia', notes: 'Canal dente 47' },
    });

    expect(draft).toContain('dente 47');
    expect(draft).toContain('Acesso coronário');
    expect(draft).not.toContain('Ex:');
  });

  it('continues endodontic draft after access in previous evolution', () => {
    const draft = generateEvolutionDraft({
      patient: {
        treatmentPlan: [{ id: 1, procedure: 'Tratamento endodôntico', tooth_number: 47, status: 'APROVADO' }],
        evolution: [
          {
            date: '2026-06-01',
            notes: 'Acesso coronário no dente 47, odontometria realizada.',
            procedure_performed: 'Endodontia',
          },
        ],
      },
      appointment: { id: 11, procedure: 'Endodontia', notes: 'Retorno canal 47' },
    });

    expect(draft).toContain('Instrumentação químico-mecânica');
  });

  it('builds restorative draft from appointment label', () => {
    const draft = generateEvolutionDraft({
      patient: {
        treatmentPlan: [{ id: 2, procedure: 'Restauração classe II', tooth_number: 26, status: 'APROVADO' }],
      },
      appointment: { id: 12, notes: 'Restauração resina dente 26' },
    });

    expect(draft).toContain('Restauração em resina composta');
    expect(draft).toContain('dente 26');
  });

  it('returns empty draft when there is no appointment context', () => {
    expect(generateEvolutionDraft({ patient: {}, appointment: null })).toBe('');
  });
});
