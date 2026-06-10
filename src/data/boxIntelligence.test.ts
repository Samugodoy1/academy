import { describe, expect, it } from 'vitest';
import {
  generateBoxContext,
  generateIntelligentSteps,
  generateSmartMaterials,
  generateSmartChipContent,
  generateBoxNowItems,
  parseClinicalFacts,
  getToothAnatomyHint,
  resolveBoxAppointment,
} from '../data/boxIntelligence';

describe('boxIntelligence', () => {
  const endoPatient = {
    id: 1,
    name: 'João Silva',
    anamnesis: {
      chief_complaint: 'Dor ao mastigar no lado direito',
      allergies: 'Látex',
      medications: 'Losartana 50mg',
    },
    treatmentPlan: [{ id: 1, procedure: 'Tratamento endodôntico', tooth_number: 47, status: 'APROVADO' }],
    evolution: [
      {
        date: '2026-06-01',
        notes: 'Acesso coronário no dente 47, odontometria realizada.',
        procedure_performed: 'Endodontia',
      },
    ],
    odontogram: {
      47: { status: 'NEED_TREATMENT', notes: 'Pulpite irreversível' },
    },
  };

  it('prioritizes in-progress appointment for box context', () => {
    const appointment = resolveBoxAppointment([
      { id: 1, start_time: '2026-06-10T14:00:00', status: 'IN_PROGRESS', procedure: 'Endodontia' },
      { id: 2, start_time: '2026-06-12T14:00:00', status: 'SCHEDULED', procedure: 'Consulta' },
    ]);

    expect(appointment?.id).toBe(1);
  });

  it('builds personalized endodontic context with continuity', () => {
    const context = generateBoxContext(endoPatient, endoPatient.treatmentPlan, [
      { id: 10, start_time: '2026-06-10T14:00:00', status: 'IN_PROGRESS', procedure: 'Retorno canal 47' },
    ]);

    expect(context.patientFirstName).toBe('João');
    expect(context.targetTooth).toBe(47);
    expect(context.chiefComplaint).toContain('mastigar');
    expect(context.expectedTodaySummary).toContain('dente 47');
    expect(context.evolutionContinuityHint).toContain('Acesso coronário');
    expect(context.clinicalStage).toBe('endo_access');
  });

  it('generates patient-specific materials and steps', () => {
    const context = generateBoxContext(endoPatient, endoPatient.treatmentPlan, []);
    const materials = generateSmartMaterials(context, 'Endodontia');
    const steps = generateIntelligentSteps(context, 'Endodontia', () => {}, () => {}, () => {});

    expect(materials.some((item) => /sem látex/i.test(item))).toBe(true);
    expect(materials.some((item) => /dente 47/i.test(item))).toBe(true);
    expect(steps[0].text).toContain('João');
    expect(steps[2].steps.some((step) => /instrument/i.test(step))).toBe(true);
  });

  it('personalizes box now items with patient data', () => {
    const context = generateBoxContext(endoPatient, endoPatient.treatmentPlan, []);
    const items = generateBoxNowItems(context);

    expect(items[0]).toMatch(/instrument|acesso|47/i);
    expect(items.some((item) => /dente 47|47/i.test(item))).toBe(true);
    expect(items.some((item) => /Acesso coronário|instrument/i.test(item))).toBe(true);
  });

  it('parses clinical facts from evolution text', () => {
    const facts = parseClinicalFacts(
      'Acesso coronário no dente 47, CT 21mm, lima final #25, irrigação com hipoclorito.'
    );

    expect(facts.accessDone).toBe(true);
    expect(facts.workingLength).toBe('21 mm');
    expect(facts.finalFile).toBe('#25');
    expect(facts.irrigant).toBe('hipoclorito');
  });

  it('builds critical checkpoint for endo continuation', () => {
    const context = generateBoxContext(endoPatient, endoPatient.treatmentPlan, [
      { id: 10, start_time: '2026-06-10T14:00:00', status: 'IN_PROGRESS', procedure: 'Retorno canal 47' },
    ]);

    expect(context.criticalCheckpoint).toMatch(/instrument|acesso/i);
    expect(context.isInChairNow).toBe(true);
    expect(context.clinicalFacts.accessDone).toBe(true);
  });

  it('generates contextual chip tips instead of only generic ones', () => {
    const context = generateBoxContext(endoPatient, endoPatient.treatmentPlan, []);
    const chips = generateSmartChipContent(context, 'Endodontia');

    expect(chips.Acesso?.[0]).toMatch(/instrument|acesso/i);
    expect(chips.Anestesia?.[0]).toMatch(/látex|alergia|PA|47/i);
    expect(chips.Evolucao?.[0]).toMatch(/47|obtur|instrument/i);
  });

  it('provides tooth anatomy hints for molars', () => {
    expect(getToothAnatomyHint(47)).toMatch(/molar inferior/i);
    expect(getToothAnatomyHint(16)).toMatch(/molar superior/i);
  });

  it('does not treat "nada" in allergies as a clinical alert', () => {
    const patient = {
      ...endoPatient,
      anamnesis: {
        ...endoPatient.anamnesis,
        allergies: 'nada',
      },
    };
    const context = generateBoxContext(patient, patient.treatmentPlan, []);
    const materials = generateSmartMaterials(context, 'Endodontia');

    expect(context.anamnesisAlert).not.toMatch(/alergia:\s*nada/i);
    expect(materials.some((item) => /sem látex/i.test(item))).toBe(false);
  });
});
