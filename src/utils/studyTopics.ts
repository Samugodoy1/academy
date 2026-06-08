export type StudyKey =
  | 'exame-clinico'
  | 'radiologia'
  | 'anestesia'
  | 'isolamento'
  | 'periodontia'
  | 'preventiva'
  | 'dentistica'
  | 'endodontia'
  | 'cirurgia'
  | 'protese'
  | 'odontopediatria';

export const mapProcedureToTopic = (procedure: string | null | undefined): StudyKey | null => {
  if (!procedure) return null;
  const lower = procedure.toLowerCase();
  if (lower.includes('anamn') || lower.includes('exame') || lower.includes('avaliacao') || lower.includes('diagnost') || lower.includes('plano de tratamento')) return 'exame-clinico';
  if (lower.includes('radio') || lower.includes('rx') || lower.includes('periapical') || lower.includes('bite') || lower.includes('panoram')) return 'radiologia';
  if (lower.includes('anestes') || lower.includes('bloqueio') || lower.includes('infiltrativa')) return 'anestesia';
  if (lower.includes('isolamento') || lower.includes('dique') || lower.includes('lencol') || lower.includes('grampo')) return 'isolamento';
  if (lower.includes('rasp') || lower.includes('period') || lower.includes('gengiv') || lower.includes('calculo') || lower.includes('tartaro') || lower.includes('profilaxia periodontal')) return 'periodontia';
  if (lower.includes('profilax') || lower.includes('fluor') || lower.includes('selante') || lower.includes('prevent') || lower.includes('biofilme')) return 'preventiva';
  if (lower.includes('endo') || lower.includes('canal') || lower.includes('pulpar') || lower.includes('tratamento endodontico')) return 'endodontia';
  if (lower.includes('restaura') || lower.includes('resin') || lower.includes('clareamento') || lower.includes('facet') || lower.includes('lente') || lower.includes('dentistic')) return 'dentistica';
  if (lower.includes('extra') || lower.includes('siso') || lower.includes('cirurg') || lower.includes('implant') || lower.includes('exodontia')) return 'cirurgia';
  if (lower.includes('protese') || lower.includes('provisor') || lower.includes('moldagem') || lower.includes('coroa') || lower.includes('ciment')) return 'protese';
  if (lower.includes('pediatr') || lower.includes('crianca') || lower.includes('deciduo') || lower.includes('infantil') || lower.includes('art')) return 'odontopediatria';
  return null;
};

export const STUDY_TOPIC_LABELS: Record<StudyKey, string> = {
  'exame-clinico': 'Exame clínico',
  radiologia: 'Radiologia',
  anestesia: 'Anestesia',
  isolamento: 'Isolamento absoluto',
  periodontia: 'Periodontia',
  preventiva: 'Preventiva',
  dentistica: 'Dentística',
  endodontia: 'Endodontia',
  cirurgia: 'Cirurgia',
  protese: 'Prótese',
  odontopediatria: 'Odontopediatria',
};
