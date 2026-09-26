import type { BoxGuideProcedure } from './boxGuides';
import type { ClinicalStage } from './boxIntelligence';
import { hasRecordedAllergie } from '../utils/anamnesisUtils';

export type PlateCue = {
  id: string;
  lead: string;
  note: string;
};

export type BoxGlance = {
  kicker: string;
  hero: string;
  place: string;
  cues: PlateCue[];
};

export type GlanceInput = {
  procedure: BoxGuideProcedure;
  clinicalStage?: ClinicalStage;
  boxProcedureDetail?: string;
  targetTooth?: number | null;
  allergies?: string | null;
  anamnesisAlert?: string | null;
  anamnesisIncomplete?: boolean;
  chiefComplaint?: string | null;
  odontogramNote?: string | null;
  workingLength?: string | null;
  finalFile?: string | null;
  materialUsed?: string | null;
  isFirstConsultation?: boolean;
};

const clip = (value: string, max: number) => {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
};

const norm = (value?: string | null) =>
  (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const quadrant = (tooth: number) => Math.floor(tooth / 10);
const unit = (tooth: number) => tooth % 10;
const isUpper = (tooth: number) => {
  const q = quadrant(tooth);
  return q === 1 || q === 2 || q === 5 || q === 6;
};
const isLower = (tooth: number) => {
  const q = quadrant(tooth);
  return q === 3 || q === 4 || q === 7 || q === 8;
};
const isBaby = (tooth: number) => quadrant(tooth) >= 5;
const isMolar = (tooth: number) => (isBaby(tooth) ? unit(tooth) >= 4 : unit(tooth) >= 6);
const isThirdMolar = (tooth: number) => !isBaby(tooth) && unit(tooth) === 8;

const isExtraction = (input: GlanceInput) =>
  input.clinicalStage === 'extraction' ||
  /extra|exodont|remoc/i.test(input.boxProcedureDetail || '');

const kickerFor = (input: GlanceInput) => {
  if (input.procedure === 'Cirurgia') return isExtraction(input) ? 'Exodontia' : 'Cirurgia';
  if (input.procedure === 'Endodontia') return 'Endodontia';
  if (input.procedure === 'Dentistica') return 'Dentística';
  if (input.procedure === 'Periodontia') return 'Periodontia';
  if (input.procedure === 'Protese') return 'Prótese';
  if (input.procedure === 'Urgencia') return 'Urgência';
  return input.isFirstConsultation ? 'Primeira consulta' : 'Consulta';
};

const placeFor = (tooth: number) => {
  const q = quadrant(tooth);
  const u = unit(tooth);
  const upper = isUpper(tooth);
  const right = q === 1 || q === 4 || q === 5 || q === 8;
  const side = `${upper ? 'superior' : 'inferior'} ${right ? 'direito' : 'esquerdo'}`;

  let kind = '';
  if (isBaby(tooth)) {
    if (u === 1) kind = 'incisivo central';
    else if (u === 2) kind = 'incisivo lateral';
    else if (u === 3) kind = 'canino';
    else if (u === 4) kind = '1º molar decíduo';
    else if (u === 5) kind = '2º molar decíduo';
  } else if (u === 8) kind = '3º molar';
  else if (u === 7) kind = '2º molar';
  else if (u === 6) kind = '1º molar';
  else if (u === 5) kind = '2º pré-molar';
  else if (u === 4) kind = '1º pré-molar';
  else if (u === 3) kind = 'canino';
  else if (u === 2) kind = 'incisivo lateral';
  else if (u === 1) kind = 'incisivo central';

  if (!kind) return side;
  return `${kind} · ${side}`;
};

const safetyCue = (input: GlanceInput): PlateCue | null => {
  const alert = norm(input.anamnesisAlert);
  const allergy = String(input.allergies || '');

  if (hasRecordedAllergie(allergy)) {
    if (/latex/.test(norm(allergy))) {
      return { id: 'latex', lead: 'Sem látex', note: 'Luva, grampo e lençol.' };
    }
    return { id: 'allergy', lead: 'Alergia', note: clip(allergy, 28) };
  }
  if (/hipertens|losartan|enalapril|captopril|amlodipina|pressao/.test(alert)) {
    return { id: 'bp', lead: 'Medir a PA', note: 'Antes de anestesiar.' };
  }
  if (/anticoagul|varfarina|rivaroxabana|clopidogrel|sangr/.test(alert)) {
    return { id: 'bleed', lead: 'Pode sangrar', note: 'Combine com o professor.' };
  }
  if (/diabet/.test(alert)) {
    return { id: 'dm', lead: 'Diabetes', note: 'Pergunte a última refeição.' };
  }
  if (/gestante|gravid/.test(alert)) {
    return { id: 'preg', lead: 'Gestante', note: 'RX só se for preciso.' };
  }
  if (input.anamnesisIncomplete) {
    return { id: 'anam', lead: 'Anamnese', note: 'Alergia antes de anestesiar.' };
  }
  return null;
};

const anesthesiaCue = (tooth: number): PlateCue => {
  if (isLower(tooth) && isMolar(tooth)) {
    return { id: 'block', lead: 'Bloqueio', note: `Infiltração não pega no ${tooth}.` };
  }
  if (isLower(tooth) && unit(tooth) >= 4) {
    return { id: 'block', lead: 'Bloqueio', note: 'Mental ou alveolar inferior.' };
  }
  if (isUpper(tooth) && isMolar(tooth) && !isBaby(tooth)) {
    return { id: 'infil', lead: 'Infiltração', note: 'PSA se a vestibular falhar.' };
  }
  return { id: 'infil', lead: 'Infiltração', note: 'No ápice, pela vestibular.' };
};

const canalCue = (tooth: number): PlateCue | null => {
  if (isUpper(tooth) && isMolar(tooth) && !isBaby(tooth)) {
    return { id: 'mb2', lead: 'MB2', note: 'Procure. Fica escondido.' };
  }
  if (isLower(tooth) && isMolar(tooth) && !isBaby(tooth)) {
    return { id: 'curve', lead: '2 ou 3 canais', note: 'A raiz mesial curva.' };
  }
  if (isUpper(tooth) && (unit(tooth) === 4 || unit(tooth) === 5)) {
    return { id: 'two', lead: '1 ou 2 canais', note: 'Confirme no RX.' };
  }
  if (unit(tooth) <= 3) {
    return { id: 'one', lead: 'Canal único', note: 'Longo. Cuidado com o CT.' };
  }
  return null;
};

const numberCue = (input: GlanceInput): PlateCue | null => {
  if (input.workingLength) {
    return { id: 'ct', lead: input.workingLength, note: 'Comprimento de trabalho.' };
  }
  if (input.finalFile) {
    return { id: 'file', lead: `Lima ${input.finalFile}`, note: 'A última registrada.' };
  }
  if (input.materialUsed) {
    return { id: 'mat', lead: clip(input.materialUsed, 18), note: 'Material deste dente.' };
  }
  const note = (input.odontogramNote || '').trim();
  if (note && note.length <= 32) {
    return { id: 'odo', lead: clip(note, 22), note: 'Está no odontograma.' };
  }
  return null;
};

const visitCues = (input: GlanceInput): PlateCue[] => {
  const tooth = input.targetTooth || null;
  const stage = input.clinicalStage;
  const cues: PlateCue[] = [];

  if (input.procedure === 'Endodontia') {
    if (stage === 'endo_access' || stage === 'endo_instrumentation') {
      cues.push({ id: 'noredo', lead: 'Não refaça', note: 'O acesso já foi feito.' });
      cues.push({ id: 'wet', lead: 'Canal molhado', note: 'Irrigue a cada lima.' });
    } else if (stage === 'endo_obturation') {
      cues.push({ id: 'dry', lead: 'Secar o canal', note: 'Agora sim. Depois o cone.' });
    } else if (tooth) {
      cues.push(anesthesiaCue(tooth));
    }
    if (tooth) {
      const canals = canalCue(tooth);
      if (canals) cues.push(canals);
    }
    if (!input.workingLength && stage !== 'endo_obturation') {
      cues.push({ id: 'ct-missing', lead: 'Anote o CT', note: 'RX e localizador.' });
    }
    return cues;
  }

  if (input.procedure === 'Dentistica') {
    if (tooth && isLower(tooth) && isThirdMolar(tooth)) {
      cues.push({ id: 'iso', lead: 'Isolamento', note: 'O grampo escapa. Use relativo.' });
    }
    if (tooth) cues.push(anesthesiaCue(tooth));
    cues.push({ id: 'shade', lead: 'Cor agora', note: 'Antes de secar o dente.' });
    if (!(tooth && isLower(tooth) && isThirdMolar(tooth))) {
      cues.push({ id: 'field', lead: 'Campo seco', note: 'Umidade solta a restauração.' });
    }
    return cues;
  }

  if (input.procedure === 'Cirurgia') {
    if (tooth) cues.push(anesthesiaCue(tooth));
    cues.push({
      id: 'rx',
      lead: 'Olhe o RX',
      note: tooth ? `Raiz do ${tooth}, antes de luxar.` : 'Confirme o dente antes de luxar.',
    });
    cues.push({ id: 'lux', lead: 'Luxação', note: 'Sem força para apical.' });
    return cues;
  }

  if (input.procedure === 'Periodontia') {
    cues.push({ id: 'bleed', lead: 'Onde sangra', note: tooth ? `Comece pelo ${tooth}.` : 'Anote na sondagem.' });
    if (tooth) cues.push(anesthesiaCue(tooth));
    cues.push({ id: 'hygiene', lead: 'Mostre', note: 'Onde o paciente não limpa.' });
    return cues;
  }

  if (input.procedure === 'Protese') {
    const detail = (input.boxProcedureDetail || '').split('·')[0].trim();
    cues.push({
      id: 'stage',
      lead: detail && detail.length <= 18 ? detail : 'Esta etapa',
      note: 'Prova, cor ou cimentação.',
    });
    cues.push({ id: 'occ', lead: 'Oclusão', note: 'Os dois lados, em cêntrica.' });
    return cues;
  }

  if (input.procedure === 'Urgencia') {
    cues.push({ id: 'tests', lead: 'Testes antes', note: 'Percussão, palpação, frio.' });
    if (tooth) cues.push(anesthesiaCue(tooth));
    cues.push({ id: 'prof', lead: 'Professor', note: 'Antes de abrir o dente.' });
    return cues;
  }

  if (input.chiefComplaint) {
    cues.push({ id: 'complaint', lead: clip(input.chiefComplaint, 22), note: 'A queixa, nas palavras dele.' });
  }
  cues.push({ id: 'exam', lead: 'Exame', note: 'Extra-oral, depois a boca.' });
  cues.push({ id: 'plan', lead: 'Com o professor', note: 'Antes de prometer conduta.' });
  return cues;
};

const unique = (cues: PlateCue[]) => {
  const seen = new Set<string>();
  return cues.filter((cue) => {
    if (seen.has(cue.id)) return false;
    seen.add(cue.id);
    return true;
  });
};

export function buildBoxGlance(input: GlanceInput): BoxGlance {
  const tooth = input.targetTooth || null;
  const complaint = (input.chiefComplaint || '').trim();
  const visit = visitCues(input);
  const ranked = unique(
    [safetyCue(input), visit[0], numberCue(input), ...visit.slice(1)].filter(
      (cue): cue is PlateCue => Boolean(cue)
    )
  );

  const cues = ranked.slice(0, 3);
  const hero = tooth
    ? String(tooth)
    : complaint
      ? clip(complaint, 28)
      : kickerFor(input);

  return {
    kicker: kickerFor(input),
    hero,
    place: tooth ? placeFor(tooth) : '',
    cues: cues.filter((cue) => cue.lead !== hero),
  };
}
