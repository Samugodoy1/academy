import { BoxGuideProcedure, boxGuides } from './boxGuides';
import { inferBoxProcedure } from '../utils/evolutionDraft';
import { getAppointmentTime, parseAppointmentDateTime } from '../utils/dateUtils';
import {
  buildAnamnesisAlert,
  buildAnamnesisRiskFlags,
  hasMeaningfulAnamnesisValue,
  hasRecordedAllergie,
  hasRecordedMedication,
} from '../utils/anamnesisUtils';

const TOOTH_REGEX = /\b([1-4][1-8]|[5-8][1-5])\b/;
const ACTIVE_APPOINTMENT_STATUSES = new Set(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);
const ACTIVE_TREATMENT_STATUSES = new Set(['APROVADO', 'PENDENTE', 'PLANEJADO']);

export interface ClinicalFacts {
  workingLength: string | null;
  finalFile: string | null;
  irrigant: string | null;
  intracanalMedication: string | null;
  canalsLocated: string | null;
  accessDone: boolean;
  obturationDone: boolean;
  anesthesiaNote: string | null;
  materialUsed: string | null;
  provisionalSeal: boolean;
}

export interface BoxIntelligenceContext {
  patient: any;
  primaryTreatment: any;
  currentAppointment: any;
  upcomingAppointment: any;
  lastEvolution: any;
  lastEvolutionForTooth: any;
  riskFlags: string[];
  anamnesisAlert: string;
  isFirstConsultation: boolean;
  boxProcedureDetail: string;
  patientFirstName: string;
  chiefComplaint: string;
  targetTooth: number | null;
  toothArch: 'superior' | 'inferior' | null;
  odontogramNote: string;
  clinicalStage: ClinicalStage;
  clinicalStageLabel: string;
  appointmentLabel: string;
  daysSinceLastEvolution: number | null;
  expectedTodaySummary: string;
  evolutionContinuityHint: string;
  clinicalFacts: ClinicalFacts;
  toothAnatomyHint: string;
  criticalCheckpoint: string;
  isInChairNow: boolean;
  appointmentTimeLabel: string;
  pendingChartItems: string[];
  procedureInferred: BoxGuideProcedure | null;
}

export type ClinicalStage =
  | 'first_visit'
  | 'consultation'
  | 'endo_initial'
  | 'endo_access'
  | 'endo_instrumentation'
  | 'endo_obturation'
  | 'restoration'
  | 'extraction'
  | 'surgery'
  | 'periodontal'
  | 'prosthodontic'
  | 'urgency'
  | 'follow_up';

type BoxStep = {
  label: string;
  title: string;
  text: string;
  steps: string[];
  actions: Array<{ label: string; onClick: () => void; primary?: boolean }>;
};

const normalizeText = (value: unknown) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const firstName = (name?: string) => (name || 'paciente').trim().split(/\s+/)[0] || 'paciente';

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const extractToothNumber = (...sources: Array<string | number | undefined | null>): number | null => {
  for (const source of sources) {
    if (typeof source === 'number' && source >= 11 && source <= 48) return source;
    const match = String(source || '').match(TOOTH_REGEX);
    if (match) return Number(match[1]);
  }
  return null;
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

const evolutionText = (item?: any) =>
  [item?.notes, item?.procedure_performed, item?.procedure].filter(Boolean).join(' ');

const getLastEvolutionForTooth = (evolutions: any[], tooth: number) =>
  evolutions.find((item) => extractToothNumber(evolutionText(item), item?.tooth_number) === tooth);

const getToothArch = (tooth: number | null): 'superior' | 'inferior' | null => {
  if (!tooth) return null;
  if (/^(1[1-8]|2[1-8]|5[1-5]|6[1-5])/.test(String(tooth))) return 'superior';
  if (/^(3[1-8]|4[1-8]|7[1-5]|8[1-5])/.test(String(tooth))) return 'inferior';
  return null;
};

const getOdontogramNote = (patient: any, tooth: number | null) => {
  if (!tooth) return '';
  const odontogram = patient?.odontogram || patient?.odontogram_data || {};
  const entry = odontogram?.[tooth] || odontogram?.[String(tooth)];
  const status = entry?.status ? String(entry.status).replace(/_/g, ' ') : '';
  const notes = entry?.notes ? String(entry.notes).trim() : '';
  return [status, notes].filter(Boolean).join(' · ');
};

const daysSince = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
};

const formatShortDate = (value?: string | null) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const formatAppointmentTime = (appointment?: any) => {
  if (!appointment?.start_time) return '';
  const parsed = parseAppointmentDateTime(appointment.start_time);
  if (!parsed) return '';
  return parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const getToothQuadrant = (tooth: number | null): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null => {
  if (!tooth) return null;
  const str = String(tooth);
  if (str.length < 2) return null;
  return Number(str[0]) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

const getToothType = (tooth: number | null): 'incisivo' | 'canino' | 'premolar' | 'molar' | null => {
  if (!tooth) return null;
  const unit = tooth % 10;
  if (unit >= 1 && unit <= 2) return 'incisivo';
  if (unit === 3) return 'canino';
  if (unit >= 4 && unit <= 5) return 'premolar';
  if (unit >= 6 && unit <= 8) return 'molar';
  return null;
};

export const parseClinicalFacts = (text: string): ClinicalFacts => {
  const norm = normalizeText(text);
  const workingLengthMatch = text.match(/(?:ct|comprimento(?:\s+de\s+trabalho)?|wl)\s*[:\-]?\s*(\d{1,2}(?:[.,]\d)?)\s*(?:mm)?/i);
  const finalFileMatch = text.match(/lima\s*(?:final|master|apical)?\s*[:\-#]?\s*#?\s*(\d{2,3})/i);
  const irrigantMatch = text.match(/(hipoclorito|nacl|edta|clorexidina|peroxid)/i);
  const medicationMatch = text.match(/(hidroxido|caoh|paramonoclorofenol|pmc|formocresol|antibiot)/i);
  const canalsMatch = text.match(/(\d)\s*canal/i);

  return {
    workingLength: workingLengthMatch ? `${workingLengthMatch[1].replace(',', '.')} mm` : null,
    finalFile: finalFileMatch ? `#${finalFileMatch[1]}` : null,
    irrigant: irrigantMatch ? irrigantMatch[1] : null,
    intracanalMedication: medicationMatch ? medicationMatch[1] : null,
    canalsLocated: canalsMatch ? canalsMatch[1] : null,
    accessDone: /acess|abert|odontometr/.test(norm),
    obturationDone: /obtur|selament.*definitiv|cone/.test(norm),
    anesthesiaNote: text.match(/anestes\w+\s*[:\-]?\s*([^.;]+)/i)?.[1]?.trim() || null,
    materialUsed: text.match(/(?:resina|gic|ion[oô]mero|amalgama|compomer)\s+([^.;]+)/i)?.[0]?.trim() || null,
    provisionalSeal: /provisor|gic|ion[oô]mero.*provisor|selament.*provisor/.test(norm),
  };
};

export const getToothAnatomyHint = (tooth: number | null): string => {
  if (!tooth) return '';
  const type = getToothType(tooth);
  const quadrant = getToothQuadrant(tooth);
  const isUpper = quadrant ? quadrant <= 4 || (quadrant >= 5 && quadrant <= 6) : null;

  if (type === 'molar') {
    if (isUpper) {
      return `Dente ${tooth} (molar superior): atenção a 3–4 canais, inclinação do grampo e visão do MB2.`;
    }
    return `Dente ${tooth} (molar inferior): atenção a 2–3 canais, curvatura mesial e posicionamento do paciente.`;
  }
  if (type === 'premolar') {
    if (isUpper) {
      return `Dente ${tooth} (premolar superior): pode ter 1–2 canais — confirme no RX antes de instrumentar.`;
    }
    return `Dente ${tooth} (premolar inferior): geralmente 1 canal, mas confirme anatomia no acesso.`;
  }
  if (type === 'canino') {
    return `Dente ${tooth} (canino): canal único e longo — cuidado com comprimento de trabalho.`;
  }
  if (type === 'incisivo') {
    return `Dente ${tooth} (incisivo): canal único; atenção à inclinação labial no acesso.`;
  }
  return '';
};

const detectPendingChartItems = (patient: any): string[] => {
  const items: string[] = [];
  const anamnesis = patient?.anamnesis || {};
  const hasAnamnesis = Boolean(
    hasMeaningfulAnamnesisValue(anamnesis.chief_complaint) ||
      hasRecordedAllergie(anamnesis.allergies) ||
      hasMeaningfulAnamnesisValue(anamnesis.medical_history) ||
      hasRecordedMedication(anamnesis.medications)
  );
  if (!hasAnamnesis) items.push('Anamnese incompleta — preencher antes de anestesiar.');

  const odontogram = patient?.odontogram || patient?.odontogram_data || {};
  const hasOdontogram = Object.keys(odontogram).length > 0 || patient?.has_odontogram_record;
  if (!hasOdontogram) items.push('Odontograma vazio — mapear achados antes de intervir.');

  const evolutions = getEvolutions(patient);
  if (evolutions.length === 0 && hasAnamnesis) {
    items.push('Sem evolução registrada — documentar ao final do atendimento.');
  }

  return items;
};

const buildAnesthesiaGuidance = (
  context: Pick<
    BoxIntelligenceContext,
    'anamnesisAlert' | 'riskFlags' | 'targetTooth' | 'toothArch' | 'patientFirstName' | 'patient'
  >,
  procedure: BoxGuideProcedure
): string => {
  const parts: string[] = [];
  const alert = normalizeText(context.anamnesisAlert);
  const anamnesis = context.patient?.anamnesis;

  if (/hipertens|press|losartan|enalapril|captopril|amlodipina/.test(alert)) {
    parts.push('Medir PA antes. Vasoconstrictor com cautela — alinhar com professor.');
  }
  if (/anticoagul|varfarina|rivaroxabana|aas|aspirina|sangr/.test(alert)) {
    parts.push('Risco de sangramento. Evitar trauma excessivo; hemostasia planejada.');
  }
  if (/diabet/.test(alert)) {
    parts.push('Confirmar controle glicêmico e horário da última refeição.');
  }
  if (hasRecordedAllergie(anamnesis?.allergies)) {
    parts.push(`Alergia (${anamnesis!.allergies!.trim()}): confirmar e usar kit sem látex se indicado.`);
  }
  if (/gest|gravid/.test(alert)) {
    parts.push('Gestante: evitar RX sem necessidade e confirmar anestésico seguro.');
  }

  if (context.targetTooth && procedure !== 'Consulta') {
    const quadrant = getToothQuadrant(context.targetTooth);
    if (quadrant === 1 || quadrant === 2 || quadrant === 5 || quadrant === 6) {
      parts.push(`Para dente ${context.targetTooth} (superior): infiltração ou PSA conforme região.`);
    } else if (quadrant) {
      parts.push(`Para dente ${context.targetTooth} (inferior): bloqueio do nervo alveolar inferior ou infiltração.`);
    }
  }

  if (parts.length === 0) {
    return `Testar anestesia de ${context.patientFirstName} antes de iniciar — se dor persistir, reforçar e avisar professor.`;
  }

  return parts.join(' ');
};

const buildCriticalCheckpoint = (
  context: Pick<
    BoxIntelligenceContext,
    | 'clinicalStage'
    | 'clinicalFacts'
    | 'targetTooth'
    | 'chiefComplaint'
    | 'odontogramNote'
    | 'evolutionContinuityHint'
    | 'pendingChartItems'
    | 'isInChairNow'
    | 'patientFirstName'
  >,
  procedure: BoxGuideProcedure
): string => {
  if (context.pendingChartItems[0]?.includes('Anamnese incompleta')) {
    return '⚠️ Anamnese incompleta — não anestesie sem preencher alergias e medicações.';
  }

  if (procedure === 'Endodontia') {
    if (context.clinicalStage === 'endo_access') {
      const facts = [
        context.clinicalFacts.workingLength && `CT ${context.clinicalFacts.workingLength}`,
        context.clinicalFacts.canalsLocated && `${context.clinicalFacts.canalsLocated} canal(is)`,
      ].filter(Boolean);
      return facts.length > 0
        ? `Acesso já feito${context.targetTooth ? ` no ${context.targetTooth}` : ''} (${facts.join(', ')}). Hoje: instrumentar — não refaça acesso sem necessidade.`
        : `Acesso já realizado${context.targetTooth ? ` no ${context.targetTooth}` : ''}. Hoje: instrumentação químico-mecânica.`;
    }
    if (context.clinicalStage === 'endo_instrumentation') {
      const lima = context.clinicalFacts.finalFile ? ` com lima ${context.clinicalFacts.finalFile}` : '';
      const ct = context.clinicalFacts.workingLength ? ` (CT ${context.clinicalFacts.workingLength})` : '';
      return `Instrumentação em andamento${context.targetTooth ? ` no ${context.targetTooth}` : ''}${ct}${lima}. Confirme lima final antes de obturar ou medicar.`;
    }
    if (context.clinicalStage === 'endo_obturation') {
      return `Etapa de obturação${context.targetTooth ? ` do ${context.targetTooth}` : ''}. Confirme CT e seco canal antes de cimentar cone.`;
    }
    if (context.targetTooth && context.odontogramNote) {
      return `Início de canal no ${context.targetTooth}: ${context.odontogramNote}. RX + odontometria antes de instrumentar.`;
    }
  }

  if (procedure === 'Urgencia' && context.chiefComplaint) {
    return `Queixa: "${context.chiefComplaint}". Investigue com testes antes de qualquer conduta invasiva.`;
  }

  if (procedure === 'Cirurgia' && context.targetTooth) {
    return `Exodontia do ${context.targetTooth}: confirme RX, anestesia testada e plano de hemostasia antes de luxar.`;
  }

  if (procedure === 'Dentistica' && context.targetTooth) {
    return `Restauração do ${context.targetTooth}: selecione cor ANTES de isolar — umidade mata adesão.`;
  }

  if (context.isInChairNow) {
    return `${context.patientFirstName} está no box agora. Foque em uma etapa por vez.`;
  }

  return context.evolutionContinuityHint || `Revise o caso de ${context.patientFirstName} antes de iniciar.`;
};

export const resolveBoxAppointment = (appointments: any[] = [], now = Date.now()) => {
  const usable = (appointments || []).filter(
    (appointment) => !['CANCELLED', 'NO_SHOW'].includes(String(appointment?.status || '').toUpperCase())
  );

  const inProgress = usable.find((appointment) => String(appointment?.status || '').toUpperCase() === 'IN_PROGRESS');
  if (inProgress) return inProgress;

  const today = new Date(now);
  const todayAppointments = usable
    .filter((appointment) => {
      const start = parseAppointmentDateTime(appointment?.start_time);
      return start && sameDay(start, today) && ACTIVE_APPOINTMENT_STATUSES.has(String(appointment?.status || '').toUpperCase());
    })
    .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

  if (todayAppointments[0]) return todayAppointments[0];

  return (
    usable
      .filter((appointment) => getAppointmentTime(appointment.start_time) >= now)
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time))[0] || null
  );
};

const detectClinicalStage = (
  procedure: BoxGuideProcedure,
  lastEvolutionText: string,
  isFirstConsultation: boolean
): { stage: ClinicalStage; label: string } => {
  const norm = normalizeText(lastEvolutionText);

  if (procedure === 'Consulta') {
    return isFirstConsultation
      ? { stage: 'first_visit', label: 'Primeira consulta' }
      : { stage: 'consultation', label: 'Consulta de acompanhamento' };
  }

  if (procedure === 'Endodontia') {
    if (/obtur|selament.*definitiv|cone/.test(norm)) {
      return { stage: 'endo_obturation', label: 'Etapa de obturação/restauração' };
    }
    if (/instrument|prepar.*quimic|limp.*canal|hipoclor|irriga/.test(norm)) {
      return { stage: 'endo_instrumentation', label: 'Etapa de instrumentação' };
    }
    if (/acess|odontometr|abert/.test(norm)) {
      return { stage: 'endo_access', label: 'Continuação após acesso' };
    }
    return { stage: 'endo_initial', label: 'Início do tratamento de canal' };
  }

  if (procedure === 'Dentistica') return { stage: 'restoration', label: 'Restauração direta' };
  if (procedure === 'Cirurgia') {
    if (/extra|exodont|remoc/.test(norm)) return { stage: 'extraction', label: 'Exodontia' };
    return { stage: 'surgery', label: 'Procedimento cirúrgico' };
  }
  if (procedure === 'Periodontia') return { stage: 'periodontal', label: 'Periodontia/profilaxia' };
  if (procedure === 'Protese') return { stage: 'prosthodontic', label: 'Etapa protética' };
  if (procedure === 'Urgencia') return { stage: 'urgency', label: 'Urgência/diagnóstico' };

  return { stage: 'follow_up', label: 'Retorno clínico' };
};

const buildExpectedTodaySummary = (
  procedure: BoxGuideProcedure,
  stage: ClinicalStage,
  context: Pick<
    BoxIntelligenceContext,
    | 'boxProcedureDetail'
    | 'targetTooth'
    | 'chiefComplaint'
    | 'patientFirstName'
    | 'clinicalFacts'
    | 'isInChairNow'
    | 'appointmentTimeLabel'
  >
) => {
  const toothText = context.targetTooth ? ` no dente ${context.targetTooth}` : '';
  const chairPrefix = context.isInChairNow ? 'Agora no box' : context.appointmentTimeLabel ? `Às ${context.appointmentTimeLabel}` : 'Hoje';
  const complaint = context.chiefComplaint ? `Queixa: ${context.chiefComplaint}. ` : '';
  const facts = context.clinicalFacts;

  if (procedure === 'Consulta') {
    return `${complaint}${chairPrefix}: consulta de ${context.patientFirstName}${context.boxProcedureDetail ? ` · foco provável: ${context.boxProcedureDetail}` : ''}.`;
  }

  if (procedure === 'Endodontia') {
    if (stage === 'endo_obturation') {
      const ct = facts.workingLength ? ` (CT ${facts.workingLength})` : '';
      return `${chairPrefix}${toothText}: obturar${ct} e selar/restaurar.`;
    }
    if (stage === 'endo_instrumentation') {
      const detail = [facts.workingLength && `CT ${facts.workingLength}`, facts.finalFile && `lima ${facts.finalFile}`]
        .filter(Boolean)
        .join(', ');
      return `${chairPrefix}${toothText}: ${detail ? `continuar instrumentação (${detail})` : 'concluir instrumentação ou iniciar obturação'}.`;
    }
    if (stage === 'endo_access') {
      const ct = facts.workingLength ? ` CT ${facts.workingLength} registrado` : '';
      return `${chairPrefix}${toothText}: instrumentar — acesso já feito${ct}. Não refaça acesso sem necessidade.`;
    }
    return `${chairPrefix}${toothText}: acesso, odontometria e início do preparo químico-mecânico.`;
  }

  if (procedure === 'Dentistica') {
    const material = facts.materialUsed ? ` com ${facts.materialUsed}` : '';
    return `${chairPrefix}${toothText}: restauração adesiva${material} — cor antes de isolar, oclusão ao final.`;
  }

  if (procedure === 'Cirurgia') {
    if (stage === 'extraction') return `${chairPrefix}${toothText}: exodontia — anestesia testada, luxação controlada, hemostasia.`;
    return `${chairPrefix}: ${context.boxProcedureDetail || 'procedimento cirúrgico'}${toothText}.`;
  }

  if (procedure === 'Periodontia') {
    return `${chairPrefix}: sondagem + raspagem${toothText ? ` na região do ${context.targetTooth}` : ''} e orientação de higiene.`;
  }

  if (procedure === 'Protese') {
    return `${chairPrefix}${toothText}: ${context.boxProcedureDetail || 'etapa protética'} — prova, cor ou cimentação conforme fase.`;
  }

  if (procedure === 'Urgencia') {
    return `${complaint}${chairPrefix}: investigar dor${toothText} com testes clínicos, aliviar e definir conduta com professor.`;
  }

  return context.boxProcedureDetail || 'Atendimento clínico do plano.';
};

const buildEvolutionContinuityHint = (context: BoxIntelligenceContext, procedure: BoxGuideProcedure) => {
  const last = context.lastEvolutionForTooth || context.lastEvolution;
  if (!last) {
    return context.isFirstConsultation
      ? 'Primeiro registro deste caso. Ao final, documente queixa, achados e plano.'
      : 'Sem evolução anterior neste foco. Registre tudo o que foi feito hoje.';
  }

  const dateLabel = formatShortDate(last.date || last.created_at);
  const summary = evolutionText(last).trim() || last.procedure_performed || last.procedure || 'atendimento anterior';
  const prefix = dateLabel ? `Em ${dateLabel}` : 'Na última sessão';

  if (procedure === 'Endodontia') {
    const facts = context.clinicalFacts;
    const factDetail = [
      facts.workingLength && `CT ${facts.workingLength}`,
      facts.finalFile && `lima ${facts.finalFile}`,
      facts.irrigant && `irrigação com ${facts.irrigant}`,
      facts.intracanalMedication && `medicação ${facts.intracanalMedication}`,
    ]
      .filter(Boolean)
      .join(' · ');

    if (context.clinicalStage === 'endo_access') {
      return `${prefix}: ${summary}.${factDetail ? ` Dados: ${factDetail}.` : ''} Hoje: instrumentar — não refaça acesso.`;
    }
    if (context.clinicalStage === 'endo_instrumentation') {
      return `${prefix}: ${summary}.${factDetail ? ` Dados: ${factDetail}.` : ''} Confirme lima final antes de obturar ou medicar.`;
    }
    if (context.clinicalStage === 'endo_obturation') {
      return `${prefix}: ${summary}.${facts.workingLength ? ` CT ${facts.workingLength} registrado.` : ''} Hoje: obturar e selar.`;
    }
  }

  if (procedure === 'Dentistica' && context.clinicalFacts.materialUsed) {
    return `${prefix}: ${summary}. Material anterior: ${context.clinicalFacts.materialUsed}.`;
  }

  return `${prefix}: ${summary}. Use isso para decidir a conduta de hoje.`;
};

export function generateBoxContext(
  patient: any,
  treatmentInProgress: any[] = [],
  appointments: any[] = [],
  now = Date.now()
): BoxIntelligenceContext {
  const primaryTreatment = treatmentInProgress[0] || null;
  const currentAppointment = resolveBoxAppointment(appointments, now);
  const upcomingAppointment =
    currentAppointment ||
    appointments
      .filter((appointment) => getAppointmentTime(appointment.start_time) >= now)
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time))[0] ||
    null;

  const evolutions = getEvolutions(patient);
  const lastEvolution = evolutions[0] || null;

  const appointmentLabel = String(
    currentAppointment?.notes || currentAppointment?.procedure || upcomingAppointment?.notes || upcomingAppointment?.procedure || ''
  ).trim();

  const targetTooth = extractToothNumber(
    primaryTreatment?.tooth_number,
    appointmentLabel,
    primaryTreatment?.procedure,
    evolutionText(lastEvolution)
  );

  const lastEvolutionForTooth = targetTooth ? getLastEvolutionForTooth(evolutions, targetTooth) : lastEvolution;

  const hasEvolutions = evolutions.length > 0;
  const hasTreatmentPlan = treatmentInProgress.length > 0;
  const isExplicitConsulta = /consult|avalia|primeira|triag|exame|acolh/.test(normalizeText(appointmentLabel));
  const isFirstConsultation = isExplicitConsulta || (!hasEvolutions && !hasTreatmentPlan);

  const anamnesis = patient?.anamnesis || {};
  const chiefComplaint = hasMeaningfulAnamnesisValue(anamnesis.chief_complaint)
    ? String(anamnesis.chief_complaint).trim()
    : '';
  const anamnesisAlert = buildAnamnesisAlert(anamnesis);
  const riskFlags = buildAnamnesisRiskFlags(anamnesis);

  const inferredProcedure =
    inferBoxProcedure(appointmentLabel) ||
    inferBoxProcedure(primaryTreatment?.procedure) ||
    (isFirstConsultation ? 'Consulta' : null);

  const boxProcedureDetail = primaryTreatment
    ? `${primaryTreatment.procedure}${primaryTreatment.tooth_number ? ` · dente ${primaryTreatment.tooth_number}` : ''}`
    : appointmentLabel || upcomingAppointment?.procedure || upcomingAppointment?.notes || '';

  const { stage, label } = detectClinicalStage(
    inferredProcedure || 'Consulta',
    evolutionText(lastEvolutionForTooth),
    isFirstConsultation
  );

  const patientFirstName = firstName(patient?.name);
  const odontogramNote = getOdontogramNote(patient, targetTooth);
  const daysSinceLastEvolution = daysSince(lastEvolution?.date || lastEvolution?.created_at);

  const isInChairNow = String(currentAppointment?.status || '').toUpperCase() === 'IN_PROGRESS';
  const appointmentTimeLabel = formatAppointmentTime(currentAppointment || upcomingAppointment);
  const clinicalFacts = parseClinicalFacts(evolutionText(lastEvolutionForTooth));
  const toothAnatomyHint = getToothAnatomyHint(targetTooth);
  const pendingChartItems = detectPendingChartItems(patient);
  const procedureInferred = inferredProcedure;

  const baseContext = {
    patient,
    primaryTreatment,
    currentAppointment,
    upcomingAppointment,
    lastEvolution,
    lastEvolutionForTooth,
    riskFlags,
    anamnesisAlert,
    isFirstConsultation,
    boxProcedureDetail,
    patientFirstName,
    chiefComplaint,
    targetTooth,
    toothArch: getToothArch(targetTooth),
    odontogramNote,
    clinicalStage: stage,
    clinicalStageLabel: label,
    appointmentLabel,
    daysSinceLastEvolution,
    clinicalFacts,
    toothAnatomyHint,
    isInChairNow,
    appointmentTimeLabel,
    pendingChartItems,
    procedureInferred,
    expectedTodaySummary: '',
    evolutionContinuityHint: '',
    criticalCheckpoint: '',
  };

  const expectedTodaySummary = buildExpectedTodaySummary(inferredProcedure || 'Consulta', stage, baseContext);
  const evolutionContinuityHint = buildEvolutionContinuityHint(
    { ...baseContext, expectedTodaySummary } as BoxIntelligenceContext,
    inferredProcedure || 'Consulta'
  );
  const criticalCheckpoint = buildCriticalCheckpoint(
    { ...baseContext, expectedTodaySummary, evolutionContinuityHint },
    inferredProcedure || 'Consulta'
  );

  return {
    ...baseContext,
    expectedTodaySummary,
    evolutionContinuityHint,
    criticalCheckpoint,
  };
}

export function generateSmartAlerts(context: BoxIntelligenceContext, selectedProcedure: BoxGuideProcedure): string[] {
  const alerts: string[] = [];

  context.pendingChartItems.forEach((item) => alerts.push(item));

  if (context.anamnesisAlert) {
    alerts.push(`${context.patientFirstName}: ${context.anamnesisAlert}`);
  }

  if (
    hasRecordedAllergie(context.patient?.anamnesis?.allergies) &&
    selectedProcedure === 'Endodontia'
  ) {
    alerts.push(`Alergia (${context.patient.anamnesis.allergies.trim()}): confirmar látex/anestésico antes do isolamento.`);
  }

  if (/anticoagul|sangr/i.test(context.anamnesisAlert) && (selectedProcedure === 'Cirurgia' || selectedProcedure === 'Periodontia')) {
    alerts.push('Risco de sangramento. Alinhe anestesia, hemostasia e medicação com o professor.');
  }

  if (/hipertens|press|losartan|enalapril/.test(normalizeText(context.anamnesisAlert))) {
    alerts.push('Medir PA antes do procedimento. Vasoconstrictor com cautela — confirmar com professor.');
  }

  if (/diabet/i.test(context.anamnesisAlert) && (selectedProcedure === 'Cirurgia' || selectedProcedure === 'Periodontia')) {
    alerts.push('Diabetes: avaliar controle glicêmico e cicatrização antes de procedimento invasivo.');
  }

  if (context.daysSinceLastEvolution !== null && context.daysSinceLastEvolution > 180) {
    alerts.push(`Última evolução há ${context.daysSinceLastEvolution} dias. Atualize anamnese antes de iniciar.`);
  }

  if (context.odontogramNote && context.targetTooth) {
    alerts.push(`Odontograma ${context.targetTooth}: ${context.odontogramNote}.`);
  }

  if (context.toothAnatomyHint && selectedProcedure === 'Endodontia') {
    alerts.push(context.toothAnatomyHint);
  }

  if (selectedProcedure === 'Endodontia' && context.clinicalStage === 'endo_access') {
    alerts.push('Acesso já realizado em sessão anterior — vá direto para instrumentação, não refaça acesso.');
  }

  if (selectedProcedure === 'Endodontia' && context.clinicalFacts.workingLength) {
    alerts.push(`Comprimento de trabalho registrado: ${context.clinicalFacts.workingLength}. Confirme antes de instrumentar/obturar.`);
  }

  if (selectedProcedure === 'Urgencia' && context.chiefComplaint) {
    alerts.push(`Queixa principal: "${context.chiefComplaint}" — correlacione com testes clínicos antes de intervir.`);
  }

  if (context.isInChairNow) {
    alerts.push(`${context.patientFirstName} está no box agora (${context.appointmentTimeLabel || 'em atendimento'}).`);
  }

  return [...new Set(alerts)].slice(0, 6);
}

export function generateSmartMaterials(context: BoxIntelligenceContext, selectedProcedure: BoxGuideProcedure): string[] {
  const guide = boxGuides[selectedProcedure];
  const baseMaterials = guide?.blocks[0]?.items || [];
  const prioritized: string[] = [];
  const facts = context.clinicalFacts;

  if (hasRecordedAllergie(context.patient?.anamnesis?.allergies)) {
    prioritized.push(`Kit sem látex (${context.patient.anamnesis.allergies.trim()}): luvas, grampo e materiais compatíveis.`);
  }

  if (/hipertens|press/.test(normalizeText(context.anamnesisAlert))) {
    prioritized.push('Esfigmomanômetro — medir PA antes de anestesiar.');
  }

  if (context.targetTooth && selectedProcedure === 'Endodontia') {
    if (context.toothArch === 'superior') {
      prioritized.push(`Grampo #${context.targetTooth} (arco superior).`);
    }
    if (context.toothArch === 'inferior') {
      prioritized.push(`Grampo #${context.targetTooth} (arco inferior).`);
    }
    prioritized.push(`RX periapical do ${context.targetTooth} — conferir antes de iniciar.`);

    if (context.clinicalStage === 'endo_obturation') {
      prioritized.push(`Cones obturadores para CT ${facts.workingLength || 'registrado'}.`);
      prioritized.push('Cimento obturador + espátula/condensador.');
    } else if (context.clinicalStage === 'endo_access' || context.clinicalStage === 'endo_instrumentation') {
      prioritized.push(`Limas até ${facts.finalFile || 'lima final definida'} + irrigante (hipoclorito).`);
      if (facts.intracanalMedication) {
        prioritized.push(`Medicação intracanal: ${facts.intracanalMedication}.`);
      }
    } else {
      prioritized.push('Localizador apical / RX para odontometria.');
      prioritized.push('Limas iniciais + hipoclorito + seringa de irrigação.');
    }
  }

  if (context.targetTooth && selectedProcedure === 'Cirurgia') {
    if (context.toothArch === 'superior') {
      prioritized.push(`Fórceps/extrator superior · dente ${context.targetTooth}.`);
    }
    if (context.toothArch === 'inferior') {
      prioritized.push(`Fórceps/extrator inferior · dente ${context.targetTooth}.`);
    }
    prioritized.push('RX pré-operatório conferido.');
    if (/anticoagul|sangr/.test(normalizeText(context.anamnesisAlert))) {
      prioritized.push('Gaze estéril extra + plano de hemostasia.');
    }
  }

  if (context.targetTooth && selectedProcedure === 'Dentistica') {
    prioritized.push(`Escala de cor do ${context.targetTooth} — selecionar ANTES de isolar.`);
    prioritized.push('Matriz/cunha se envolver face proximal.');
    if (facts.materialUsed) {
      prioritized.push(`Material do plano: ${facts.materialUsed}.`);
    }
  }

  if (context.chiefComplaint && selectedProcedure === 'Urgencia') {
    prioritized.push(`Foco na queixa: ${context.chiefComplaint}.`);
    prioritized.push('Teste frio/percussão + RX se indicado.');
  }

  if (selectedProcedure === 'Consulta' && !context.patient?.anamnesis?.chief_complaint) {
    prioritized.push('Ficha de anamnese em branco — preencher com o paciente.');
  }

  const merged = [...prioritized, ...baseMaterials];
  return [...new Set(merged)].slice(0, 8);
}

const prependPersonalized = (items: string[] | undefined, personalized: string[]) => {
  const base = items || [];
  return [...new Set([...personalized.filter(Boolean), ...base])].slice(0, 8);
};

const buildContextualChipTips = (
  context: BoxIntelligenceContext,
  selectedProcedure: BoxGuideProcedure,
  chip: string
): string[] => {
  const facts = context.clinicalFacts;
  const tooth = context.targetTooth;
  const tips: string[] = [];

  if (chip === 'Anamnese' || chip === 'Anamnese') {
    if (context.chiefComplaint) tips.push(`Queixa de ${context.patientFirstName}: "${context.chiefComplaint}" — explore com as palavras dele.`);
    if (context.anamnesisAlert) tips.push(`⚠️ Prontuário: ${context.anamnesisAlert}`);
    context.riskFlags.forEach((flag) => tips.push(flag));
    if (context.daysSinceLastEvolution && context.daysSinceLastEvolution > 90) {
      tips.push(`Sem evolução há ${context.daysSinceLastEvolution} dias — reconfirmar medicações e condições.`);
    }
    context.pendingChartItems.forEach((item) => tips.push(item));
  }

  if (chip === 'Anestesia') {
    tips.push(buildAnesthesiaGuidance(context, selectedProcedure));
    if (facts.anesthesiaNote) tips.push(`Última anestesia registrada: ${facts.anesthesiaNote}.`);
  }

  if (chip === 'Acesso' && selectedProcedure === 'Endodontia') {
    if (context.clinicalStage === 'endo_access' || context.clinicalStage === 'endo_instrumentation' || context.clinicalStage === 'endo_obturation') {
      tips.push(`Acesso já realizado${tooth ? ` no ${tooth}` : ''}. Não remova estrutura desnecessária — vá para instrumentação.`);
      if (facts.workingLength) tips.push(`CT registrado: ${facts.workingLength}. Confirme com RX/localizador.`);
      if (facts.canalsLocated) tips.push(`${facts.canalsLocated} canal(is) localizado(s) — confirme todos antes de instrumentar.`);
    } else if (tooth) {
      tips.push(`Abrir acesso no ${tooth}. ${context.toothAnatomyHint || 'Confirme anatomia no RX.'}`);
      if (context.odontogramNote) tips.push(`Odontograma: ${context.odontogramNote}`);
    }
  }

  if (chip === 'Odontometria' && selectedProcedure === 'Endodontia') {
    if (facts.workingLength) {
      tips.push(`CT já registrado: ${facts.workingLength}. Confirme antes de instrumentar ou obturar.`);
    } else {
      tips.push(`Definir CT do ${tooth || 'dente'} com RX + localizador apical.`);
    }
    if (facts.finalFile) tips.push(`Lima final da sessão anterior: ${facts.finalFile}.`);
  }

  if (chip === 'Irrigacao' && selectedProcedure === 'Endodontia') {
    if (facts.irrigant) tips.push(`Irrigante usado antes: ${facts.irrigant}. Manter irrigação a cada troca de lima.`);
    tips.push('Nunca instrumentar canal seco — irrigar e aspirar refluxo.');
    if (facts.intracanalMedication) tips.push(`Medicação intracanal anterior: ${facts.intracanalMedication}.`);
  }

  if (chip === 'Sequencia') {
    tips.push(context.criticalCheckpoint);
    if (context.evolutionContinuityHint) tips.push(context.evolutionContinuityHint);
    if (context.boxProcedureDetail) tips.push(`Plano: ${context.boxProcedureDetail}`);
  }

  if (chip === 'Dor' && selectedProcedure === 'Urgencia' && context.chiefComplaint) {
    tips.push(`Queixa: "${context.chiefComplaint}"`);
    tips.push('Pergunte: início, duração, intensidade (0–10), o que alivia e o que piora.');
    if (context.odontogramNote && tooth) tips.push(`Odontograma ${tooth}: ${context.odontogramNote}`);
  }

  if (chip === 'Testes' && selectedProcedure === 'Urgencia') {
    if (tooth) tips.push(`Testar dente ${tooth}: percussão, palpação e frio.`);
    tips.push('Correlacionar testes com queixa antes de definir conduta.');
    if (context.odontogramNote) tips.push(`Achado no odontograma: ${context.odontogramNote}`);
  }

  if (chip === 'Isolamento' && selectedProcedure === 'Endodontia' && tooth) {
    tips.push(`Isolamento absoluto do ${tooth} — grampo ${context.toothArch === 'superior' ? 'superior' : 'inferior'}.`);
    if (hasRecordedAllergie(context.patient?.anamnesis?.allergies)) {
      tips.push(`Usar kit sem látex — alergia: ${context.patient.anamnesis.allergies.trim()}.`);
    }
  }

  if (chip === 'Cor' && selectedProcedure === 'Dentistica' && tooth) {
    tips.push(`Selecionar cor do ${tooth} com dente hidratado ANTES de isolar.`);
    if (facts.materialUsed) tips.push(`Material previsto: ${facts.materialUsed}`);
  }

  if (chip === 'Evolucao') {
    tips.push(`Registrar: ${context.expectedTodaySummary}`);
    if (selectedProcedure === 'Endodontia') {
      tips.push('Incluir: CT, lima final, irrigante, medicação/obturação e provisório.');
      if (facts.workingLength) tips.push(`CT atual: ${facts.workingLength}`);
    }
    if (tooth) tips.push(`Não esquecer: dente ${tooth}, técnica e próximo passo.`);
  }

  if (chip === 'Exame' && selectedProcedure === 'Consulta') {
    if (context.chiefComplaint) tips.push(`Investigar queixa: ${context.chiefComplaint}`);
    if (tooth && context.odontogramNote) tips.push(`Focar ${tooth}: ${context.odontogramNote}`);
    else tips.push('Exame sistemático: extra → intra → periodontal → radiografia se indicado.');
  }

  if (chip === 'Plano' && selectedProcedure === 'Consulta') {
    if (context.boxProcedureDetail) tips.push(`Provável conduta: ${context.boxProcedureDetail}`);
    if (context.chiefComplaint) tips.push(`Relacionar achados com "${context.chiefComplaint}"`);
    tips.push('Validar plano com professor antes de comunicar ao paciente.');
  }

  return tips.filter(Boolean);
};

export function generateSmartChipContent(
  context: BoxIntelligenceContext,
  selectedProcedure: BoxGuideProcedure
): Record<string, string[]> {
  const baseChips = boxGuides[selectedProcedure]?.chipContent || {};
  const smartChips: Record<string, string[]> = {};

  Object.entries(baseChips).forEach(([chip, genericTips]) => {
    const contextual = buildContextualChipTips(context, selectedProcedure, chip);
    if (contextual.length >= 2) {
      smartChips[chip] = [...new Set([...contextual, ...genericTips.slice(0, 2)])].slice(0, 6);
    } else {
      smartChips[chip] = prependPersonalized(genericTips, contextual);
    }
  });

  return smartChips;
}

const buildSafetySteps = (context: BoxIntelligenceContext, alerts: string[]) => {
  const steps = [
    context.criticalCheckpoint,
    context.anamnesisAlert
      ? `⚠️ ${context.anamnesisAlert}`
      : `Confirmar anamnese, alergias e medicações de ${context.patientFirstName}`,
    context.chiefComplaint ? `Queixa de hoje: ${context.chiefComplaint}` : 'Confirmar objetivo do atendimento com o paciente',
    ...alerts.filter((a) => a !== context.criticalCheckpoint).slice(0, 2),
    'Separar bandeja do caso antes de anestesiar',
  ];

  return [...new Set(steps.filter(Boolean))].slice(0, 5);
};

const buildCaseSteps = (context: BoxIntelligenceContext, procedure: BoxGuideProcedure) => {
  const toothText = context.targetTooth ? `dente ${context.targetTooth}` : 'dente/região';
  const facts = context.clinicalFacts;
  const steps = [
    context.boxProcedureDetail ? `Foco: ${context.boxProcedureDetail}` : `Etapa: ${context.clinicalStageLabel}`,
    context.targetTooth ? `Conferir ${toothText} na boca, odontograma e RX` : 'Conferir região, RX e plano',
    context.odontogramNote ? `Odontograma: ${context.odontogramNote}` : '',
    context.evolutionContinuityHint,
  ];

  if (procedure === 'Endodontia') {
    if (context.clinicalStage === 'endo_obturation') {
      steps.push(
        facts.workingLength
          ? `Confirmar CT ${facts.workingLength} e seco canal antes de obturar`
          : 'Confirmar comprimento de trabalho e seco canal antes da obturação'
      );
    } else if (context.clinicalStage === 'endo_access') {
      steps.push('Acesso já feito — localizar canais e iniciar instrumentação com irrigação');
    } else if (context.toothAnatomyHint) {
      steps.push(context.toothAnatomyHint);
    }
  }

  if (procedure === 'Urgencia' && context.chiefComplaint) {
    steps.push(`Investigar: ${context.chiefComplaint} — testes antes de intervir`);
  }

  return [...new Set(steps.filter(Boolean))].slice(0, 5);
};

const buildDuringSteps = (context: BoxIntelligenceContext, procedure: BoxGuideProcedure) => {
  const tooth = context.targetTooth;
  const toothText = tooth ? ` no dente ${tooth}` : '';
  const facts = context.clinicalFacts;
  const ctNote = facts.workingLength ? ` (CT ${facts.workingLength})` : '';
  const limaNote = facts.finalFile ? ` até ${facts.finalFile}` : '';

  if (procedure === 'Endodontia') {
    if (context.clinicalStage === 'endo_obturation') {
      return [
        `Provar cone${ctNote}${toothText}`,
        'Secar canal com papel ponta e aplicar cimento',
        'Obturar e radiografar para confirmar',
        facts.provisionalSeal ? 'Remover provisório anterior e restaurar' : 'Selar provisoriamente ou restaurar',
        `Registrar cone, cimento e próximo passo${tooth ? ` do ${tooth}` : ''}`,
      ];
    }
    if (context.clinicalStage === 'endo_instrumentation') {
      return [
        `Confirmar CT${ctNote}${toothText}`,
        `Instrumentar${limaNote} com irrigação a cada troca`,
        facts.irrigant ? `Irrigar com ${facts.irrigant} — nunca canal seco` : 'Irrigar com hipoclorito — nunca canal seco',
        'Definir: medicação intracanal ou obturação hoje?',
        'Selar provisório e registrar lima final + conduta',
      ];
    }
    if (context.clinicalStage === 'endo_access') {
      return [
        `Não refaça acesso${toothText} — vá direto para instrumentação`,
        facts.canalsLocated ? `Confirmar ${facts.canalsLocated} canal(is) localizado(s)` : 'Confirmar todos os canais localizados',
        `Instrumentar${ctNote}${limaNote} com irrigação constante`,
        'Nunca instrumentar canal seco',
        'Selar provisório e registrar lima final + próximo passo',
      ];
    }
    return [
      `Anestesia testada + isolamento absoluto${toothText}`,
      context.toothAnatomyHint || 'Acesso coronário — localizar canais',
      'Odontometria com RX/localizador apical',
      'Iniciar preparo químico-mecânico com irrigação',
      'Selar provisório e registrar CT + lima usada',
    ];
  }

  if (procedure === 'Dentistica') {
    return [
      `Selecionar cor antes de isolar${toothText}`,
      'Remover cariado e preparar cavidade',
      'Condicionar e aplicar adesivo em campo seco',
      'Inserir incrementos e fotoativar por camadas',
      'Ajustar oclusão, acabamento e polimento',
    ];
  }

  if (procedure === 'Cirurgia') {
    return [
      `Confirmar dente/região${toothText} e radiografia`,
      'Anestesia, sindesmotomia e luxação controlada',
      'Remover elemento e curetar/irrigar se indicado',
      'Hemostasia e sutura quando necessário',
      'Orientar pós-operatório e registrar intercorrências',
    ];
  }

  if (procedure === 'Periodontia') {
    return [
      'Atualizar sondagem e sangramento',
      context.targetTooth ? `Priorizar região do dente ${context.targetTooth}` : 'Priorizar áreas com sangramento/supuração',
      'Raspagem/supragingival ou subgingival conforme plano',
      'Revisar biofilme e superfície radicular',
      'Orientar higiene e definir retorno',
    ];
  }

  if (procedure === 'Protese') {
    return [
      context.boxProcedureDetail ? `Executar etapa: ${context.boxProcedureDetail}` : 'Confirmar etapa protética do plano',
      'Provar/adaptar ou moldar conforme fase',
      'Checar oclusão, contato e conforto',
      'Registrar cor/material e ajustes feitos',
      'Orientar uso e próxima etapa',
    ];
  }

  if (procedure === 'Urgencia') {
    return [
      context.chiefComplaint ? `Investigar: ${context.chiefComplaint}` : 'Detalhar início, duração e gatilho da dor',
      'Exame clínico + testes (percussão, palpação, frio)',
      'Radiografar se indicado',
      'Aliviar dor/inflamação conforme orientação',
      'Validar conduta final com professor',
    ];
  }

  const guide = boxGuides[procedure];
  const ordered = guide?.chipContent.Sequencia || guide?.blocks.find((block) => block.ordered)?.items || [];
  return ordered.slice(0, 5);
};

const buildCloseSteps = (context: BoxIntelligenceContext, procedure: BoxGuideProcedure) => {
  const guide = boxGuides[procedure];
  const recordItems =
    guide?.chipContent.Evolucao || guide?.blocks.find((block) => block.emphasis === 'record')?.items || [];

  const personalized = [
    `Registrar o que foi feito hoje: ${context.expectedTodaySummary}`,
    context.targetTooth ? `Incluir dente ${context.targetTooth}, materiais e técnica usada` : 'Incluir região, materiais e técnica usada',
    'Registrar intercorrência ou ausência dela',
    'Orientar paciente e definir retorno/próxima etapa',
  ];

  return [...personalized, ...recordItems].slice(0, 5);
};

export function generateIntelligentSteps(
  context: BoxIntelligenceContext,
  selectedProcedure: BoxGuideProcedure,
  doubtCallback: (chip: string) => void,
  nextStepCallback: (step: number) => void,
  finishCallback: () => void
): BoxStep[] {
  const smartAlerts = generateSmartAlerts(context, selectedProcedure);
  const guide = boxGuides[selectedProcedure];
  const boxSafetyChip = guide?.doubtChips.includes('Anamnese') ? 'Anamnese' : guide?.doubtChips.includes('Anestesia') ? 'Anestesia' : guide?.doubtChips[0];
  const boxSequenceChip = guide?.doubtChips.includes('Sequencia') ? 'Sequencia' : guide?.doubtChips.includes('Acesso') ? 'Acesso' : guide?.doubtChips[0];
  const boxEvolutionChip = guide?.doubtChips.includes('Evolucao') ? 'Evolucao' : guide?.doubtChips[guide?.doubtChips.length - 1];

  if (selectedProcedure === 'Consulta') {
    const chairNote = context.isInChairNow
      ? `${context.patientFirstName} está no box agora.`
      : context.appointmentTimeLabel
        ? `Consulta às ${context.appointmentTimeLabel}.`
        : '';

    return [
      {
        label: 'Acolhimento',
        title: context.isFirstConsultation
          ? `Primeira consulta de ${context.patientFirstName}`
          : `Receber ${context.patientFirstName}`,
        text: context.chiefComplaint
          ? `${chairNote} Queixa: "${context.chiefComplaint}". Confirme anamnese e histórico antes do exame.`
          : `${chairNote} Entenda a queixa de ${context.patientFirstName} e revise o histórico antes de examinar.`,
        steps: [
          `Confirmar identidade de ${context.patientFirstName}`,
          context.chiefComplaint ? `Explorar queixa: ${context.chiefComplaint}` : 'Perguntar queixa principal com as palavras do paciente',
          context.anamnesisAlert ? `⚠️ ${context.anamnesisAlert}` : 'Revisar alergias, medicações e condições sistêmicas',
          'Verificar PA se indicado',
        ],
        actions: [
          { label: 'Anamnese conferida', onClick: () => nextStepCallback(1), primary: true },
          { label: 'Preciso revisar', onClick: () => doubtCallback('Anamnese') },
        ],
      },
      {
        label: 'Exame',
        title: 'Exame clínico deste caso',
        text: context.odontogramNote
          ? `Use o odontograma como apoio. Achado atual${context.targetTooth ? ` no dente ${context.targetTooth}` : ''}: ${context.odontogramNote}.`
          : 'Examine de forma sistemática e registre achados relevantes no odontograma.',
        steps: [
          'Inspeção extra-oral: face, linfonodos, ATM',
          'Inspeção intra-oral: mucosa, gengiva, dentes',
          context.targetTooth ? `Focar exame no dente ${context.targetTooth} e adjacentes` : 'Mapear dentes/regiões com alteração',
          'Sondagem periodontal quando indicado',
          'Solicitar radiografia se necessário',
        ],
        actions: [
          { label: 'Exame concluído', onClick: () => nextStepCallback(2), primary: true },
          { label: 'Ajuda no exame', onClick: () => doubtCallback('Exame') },
        ],
      },
      {
        label: 'Plano',
        title: 'Plano para este paciente',
        text: context.boxProcedureDetail
          ? `Organize os achados de ${context.patientFirstName} e valide com o professor antes de comunicar. Foco provável: ${context.boxProcedureDetail}.`
          : `Organize os achados de ${context.patientFirstName} e valide a conduta com o professor.`,
        steps: [
          'Listar achados principais do exame',
          context.chiefComplaint ? `Relacionar achados com a queixa "${context.chiefComplaint}"` : 'Relacionar achados com a queixa',
          'Priorizar necessidades clínicas',
          'Alinhar plano e próximos passos com o professor',
        ],
        actions: [
          { label: 'Plano definido', onClick: () => nextStepCallback(3), primary: true },
          { label: 'Rever orientações', onClick: () => doubtCallback('Plano') },
        ],
      },
      {
        label: 'Fechar',
        title: `Fechar consulta de ${context.patientFirstName}`,
        text: 'Registre achados e plano enquanto a consulta ainda está fresca na memória.',
        steps: buildCloseSteps(context, selectedProcedure),
        actions: [
          { label: 'Registrar agora', onClick: finishCallback, primary: true },
          { label: 'Revisar registro', onClick: () => doubtCallback('Evolucao') },
        ],
      },
    ];
  }

  const alertStepText = [
    context.criticalCheckpoint,
    ...smartAlerts.filter((a) => a !== context.criticalCheckpoint).slice(0, 2),
  ]
    .filter(Boolean)
    .join(' ');

  const caseTitle = context.targetTooth
    ? `${context.clinicalStageLabel} · dente ${context.targetTooth}`
    : `${context.clinicalStageLabel} · ${context.patientFirstName}`;

  const caseText = [
    context.expectedTodaySummary,
    context.evolutionContinuityHint !== context.criticalCheckpoint ? context.evolutionContinuityHint : '',
  ]
    .filter(Boolean)
    .join(' ');

  const duringTitle =
    context.targetTooth && selectedProcedure === 'Endodontia'
      ? `${context.clinicalStageLabel} do ${context.targetTooth}`
      : context.clinicalStageLabel;

  return [
    {
      label: 'Antes',
      title: context.isInChairNow
        ? `${context.patientFirstName} no box — conferir antes`
        : `Antes de tratar ${context.patientFirstName}`,
      text: alertStepText || `Revise anamnese de ${context.patientFirstName} antes de iniciar ${guide?.label || 'o procedimento'}.`,
      steps: buildSafetySteps(context, smartAlerts),
      actions: [
        { label: 'Tudo certo', onClick: () => nextStepCallback(1), primary: true },
        { label: 'Revisar antes', onClick: () => doubtCallback(boxSafetyChip as string) },
      ],
    },
    {
      label: 'Caso',
      title: caseTitle,
      text: caseText,
      steps: buildCaseSteps(context, selectedProcedure),
      actions: [
        { label: 'Caso confirmado', onClick: () => nextStepCallback(2), primary: true },
        { label: 'Rever sequência', onClick: () => doubtCallback(boxSequenceChip as string) },
      ],
    },
    {
      label: 'Durante',
      title: duringTitle,
      text: `${context.expectedTodaySummary} Uma etapa por vez — chame o professor se algo fugir do esperado.`,
      steps: buildDuringSteps(context, selectedProcedure),
      actions: [
        { label: 'Terminei essa parte', onClick: () => nextStepCallback(3), primary: true },
        { label: 'Pedir ajuda', onClick: () => doubtCallback(boxSequenceChip as string) },
      ],
    },
    {
      label: 'Fechar',
      title: `Fechar atendimento de ${context.patientFirstName}`,
      text: `Registre ${context.boxProcedureDetail || 'a conduta de hoje'} enquanto ainda lembra dos detalhes.`,
      steps: buildCloseSteps(context, selectedProcedure),
      actions: [
        { label: 'Registrar agora', onClick: finishCallback, primary: true },
        { label: 'Revisar registro', onClick: () => doubtCallback(boxEvolutionChip as string) },
      ],
    },
  ];
}

export function generateEvolutionSuggestion(context: BoxIntelligenceContext, selectedProcedure: BoxGuideProcedure): string {
  const facts = context.clinicalFacts;
  const lines = [
    `${selectedProcedure}${context.targetTooth ? ` · dente ${context.targetTooth}` : ''}`,
    context.expectedTodaySummary,
    context.boxProcedureDetail ? `Plano: ${context.boxProcedureDetail}` : '',
    facts.workingLength ? `CT: ${facts.workingLength}` : '',
    facts.finalFile ? `Lima final: ${facts.finalFile}` : '',
    facts.irrigant ? `Irrigante: ${facts.irrigant}` : '',
    context.anamnesisAlert ? `Alerta: ${context.anamnesisAlert}` : '',
    'Intercorrências: nenhuma / descrever',
    'Próximo passo: definir retorno',
  ].filter(Boolean);

  return lines.join('\n');
}

export function generateBoxNowItems(context: BoxIntelligenceContext): string[] {
  return [
    context.criticalCheckpoint,
    context.expectedTodaySummary,
    context.evolutionContinuityHint !== context.criticalCheckpoint ? context.evolutionContinuityHint : '',
    context.targetTooth && context.odontogramNote
      ? `Odontograma ${context.targetTooth}: ${context.odontogramNote}`
      : '',
    context.pendingChartItems[0] || '',
    'Ao terminar: registrar evolução com materiais e próximo passo.',
  ].filter(Boolean);
}

export function generateBoxNowSteps(context: BoxIntelligenceContext): string[] {
  const facts = context.clinicalFacts;
  return [
    context.pendingChartItems[0] || (context.anamnesisAlert ? `⚠️ ${context.anamnesisAlert}` : 'Confirmar anamnese'),
    context.targetTooth ? `Conferir ${context.targetTooth} + RX` : 'Conferir dente/região + RX',
    facts.workingLength
      ? `${context.clinicalStageLabel} (CT ${facts.workingLength})`
      : context.clinicalStageLabel,
    'Registrar evolução ao final',
  ].filter(Boolean);
}
