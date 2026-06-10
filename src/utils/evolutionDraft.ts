import type { BoxGuideProcedure } from '../data/boxGuides';

const TOOTH_REGEX = /\b([1-4][1-8]|[5-8][1-5])\b/;

const ACTIVE_TREATMENT_STATUSES = new Set(['APROVADO', 'PENDENTE', 'PLANEJADO']);

export interface EvolutionDraftInput {
  patient?: any;
  appointment?: {
    id?: number;
    procedure?: string;
    notes?: string;
    patient_name?: string;
    start_time?: string;
    status?: string;
  } | null;
  boxProcedure?: BoxGuideProcedure | null;
}

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const inferBoxProcedure = (value?: string): BoxGuideProcedure | null => {
  const text = normalizeText(String(value || ''));
  if (/canal|endo|obtur|pulp|odontometr|instrument|lima/.test(text)) return 'Endodontia';
  if (/extra|exo|cirurg|sutur|anestes|forceps|forc/.test(text)) return 'Cirurgia';
  if (/restaura|resina|dentist|classe|adesiv|carie|poliment/.test(text)) return 'Dentistica';
  if (/perio|raspag|profilax|sondag|cureta|tartaro|calculo/.test(text)) return 'Periodontia';
  if (/prot|coroa|molde|moldag|ciment|prova|ajuste|placa/.test(text)) return 'Protese';
  if (/urg|dor|abscesso|fistula|edema|diagnost/.test(text)) return 'Urgencia';
  if (/consult|avalia|primeira|triag|exame|anamnese|retorno|acolh/.test(text)) return 'Consulta';
  return null;
};

const extractToothNumber = (...sources: Array<string | number | undefined | null>): number | null => {
  for (const source of sources) {
    if (typeof source === 'number' && source >= 11 && source <= 48) return source;
    const match = String(source || '').match(TOOTH_REGEX);
    if (match) return Number(match[1]);
  }
  return null;
};

const getActiveTreatments = (patient?: any) =>
  (patient?.treatmentPlan || []).filter((item: any) =>
    ACTIVE_TREATMENT_STATUSES.has(String(item?.status || '').toUpperCase())
  );

const findMatchingTreatment = (patient: any, procedureLabel: string) => {
  const treatments = getActiveTreatments(patient);
  if (treatments.length === 0) return null;

  const labelNorm = normalizeText(procedureLabel);
  if (labelNorm) {
    const byName = treatments.find((item: any) => {
      const procNorm = normalizeText(item?.procedure || '');
      return procNorm.includes(labelNorm) || labelNorm.includes(procNorm);
    });
    if (byName) return byName;
  }

  const tooth = extractToothNumber(procedureLabel);
  if (tooth) {
    const byTooth = treatments.find((item: any) => Number(item?.tooth_number) === tooth);
    if (byTooth) return byTooth;
  }

  return treatments[0] || null;
};

const getEvolutions = (patient?: any) => {
  const items = [
    ...(Array.isArray(patient?.evolution) ? patient.evolution : []),
    ...(Array.isArray(patient?.clinicalEvolution) ? patient.clinicalEvolution : []),
  ];

  return items.sort((a: any, b: any) => {
    const aTime = new Date(a?.created_at || a?.date || 0).getTime();
    const bTime = new Date(b?.created_at || b?.date || 0).getTime();
    return bTime - aTime;
  });
};

const getLastEvolutionForTooth = (evolutions: any[], tooth: number) => {
  return evolutions.find((item: any) => {
    const text = [item?.notes, item?.procedure_performed, item?.procedure].filter(Boolean).join(' ');
    return extractToothNumber(text, item?.tooth_number) === tooth;
  });
};

type EndoStage = 'initial' | 'access' | 'instrumentation' | 'obturation' | 'unknown';

const detectEndoStage = (text: string): EndoStage => {
  const norm = normalizeText(text);
  if (/obtur|selament.*definitiv|cone/.test(norm)) return 'obturation';
  if (/instrument|prepar.*quimic|limp.*canal|hipoclor|irriga/.test(norm)) return 'instrumentation';
  if (/acess|odontometr|abert/.test(norm)) return 'access';
  if (/canal|endo|pulpar/.test(norm)) return 'initial';
  return 'unknown';
};

const toothPhrase = (tooth: number | null) => (tooth ? ` no dente ${tooth}` : '');

interface DraftContext {
  procedureLabel: string;
  tooth: number | null;
  lastEvolutionText: string;
  chiefComplaint: string;
}

const buildProcedureDraft = (boxType: BoxGuideProcedure, ctx: DraftContext): string => {
  const { procedureLabel, tooth, lastEvolutionText, chiefComplaint } = ctx;
  const location = toothPhrase(tooth);
  const procName = procedureLabel || 'Atendimento clínico';

  switch (boxType) {
    case 'Endodontia': {
      const stage = detectEndoStage(lastEvolutionText);
      const title = procedureLabel || 'Tratamento endodôntico';

      if (stage === 'obturation') {
        return `Obturação radicular${location}. Conduto(s) obturado(s) com técnica indicada. Restauração conforme plano. Paciente sem intercorrências. Alta do tratamento de canal.`;
      }
      if (stage === 'instrumentation') {
        return `${title}${location}. Instrumentação químico-mecânica realizada com irrigação. Paciente sem intercorrências. Próximo passo: obturação. Retorno em 7 dias.`;
      }
      if (stage === 'access') {
        return `${title}${location}. Acesso coronário ampliado e odontometria realizada. Instrumentação inicial concluída. Paciente sem intercorrências. Próximo passo: conclusão do preparo e obturação. Retorno em 7 dias.`;
      }
      return `${title}${location}. Acesso coronário realizado, localização dos canais e odontometria. Preparo químico-mecânico iniciado. Paciente sem intercorrências. Próximo passo: instrumentação e/ou obturação. Retorno em 7 dias.`;
    }
    case 'Dentistica':
      return `Restauração em resina composta${location}. Remoção de tecido cariado, preparo cavitário, condicionamento ácido e adesão. Resina fotoativada com acabamento e polimento. Paciente sem intercorrências. Orientações de higiene e sensibilidade.`;
    case 'Cirurgia': {
      if (/extra|exodont|remoc/.test(normalizeText(procedureLabel))) {
        return `Exodontia${location}. Anestesia local, sindesmotomia, luxação e remoção do elemento. Alvéolo irrigado conforme necessidade. Hemostasia obtida. Paciente sem intercorrências. Orientações pós-operatórias fornecidas. Retorno em 7 dias se necessário.`;
      }
      return `${procName}${location}. Anestesia local e técnica cirúrgica realizada conforme plano. Paciente sem intercorrências. Orientações pós-operatórias fornecidas. Retorno conforme indicação.`;
    }
    case 'Periodontia':
      return `Profilaxia e raspagem supra/subgengival${location}. Sondagem e controle de biofilme realizados. Paciente orientado quanto à higiene oral. Sem intercorrências. Retorno para manutenção em 30 dias.`;
    case 'Consulta': {
      const complaint = chiefComplaint ? `Queixa: ${chiefComplaint}. ` : '';
      return `${complaint}Consulta de avaliação clínica. Exame intra e extraoral realizado. Achados registrados no odontograma. Plano de tratamento discutido com paciente e professor. Orientações fornecidas. Próximo passo conforme plano clínico.`;
    }
    case 'Protese':
      return `${procName}${location}. Etapa protética realizada conforme plano (moldagem, prova, ajuste ou cimentação). Paciente sem intercorrências. Próxima etapa definida no plano de tratamento.`;
    case 'Urgencia': {
      const complaint = chiefComplaint ? `Queixa: ${chiefComplaint}. ` : '';
      return `${complaint}Atendimento de urgência. Exame clínico e testes realizados. Conduta de alívio inicial aplicada. Paciente orientado sobre sinais de alerta. Retorno ou encaminhamento conforme necessidade.`;
    }
    default:
      return `${procName}${location}. Conduta realizada conforme plano. Paciente sem intercorrências. Próximo passo e retorno definidos.`;
  }
};

export const generateEvolutionDraft = (input: EvolutionDraftInput): string => {
  const { patient, appointment, boxProcedure } = input;
  if (!appointment?.id) return '';

  const appointmentLabel = String(appointment.notes || appointment.procedure || '').trim();
  const treatment = patient ? findMatchingTreatment(patient, appointmentLabel) : null;
  const treatmentProcedure = String(treatment?.procedure || '').trim();
  const effectiveProcedure = appointmentLabel || treatmentProcedure;

  const tooth = extractToothNumber(treatment?.tooth_number, appointmentLabel, treatmentProcedure);
  const inferred =
    boxProcedure ||
    inferBoxProcedure(effectiveProcedure) ||
    inferBoxProcedure(treatmentProcedure) ||
    'Consulta';

  const evolutions = patient ? getEvolutions(patient) : [];
  const lastEvolutionForTooth =
    tooth !== null ? getLastEvolutionForTooth(evolutions, tooth) : evolutions[0];
  const lastEvolutionText = lastEvolutionForTooth
    ? [lastEvolutionForTooth.notes, lastEvolutionForTooth.procedure_performed, lastEvolutionForTooth.procedure]
        .filter(Boolean)
        .join(' ')
    : '';

  return buildProcedureDraft(inferred, {
    procedureLabel: effectiveProcedure || treatmentProcedure,
    tooth,
    lastEvolutionText,
    chiefComplaint: String(patient?.anamnesis?.chief_complaint || '').trim(),
  });
};
