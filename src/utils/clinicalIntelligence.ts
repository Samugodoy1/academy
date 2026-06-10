import { parseAppointmentDateTime } from './dateUtils';
import {
  countClinicalSkills,
  detectClinicalGaps,
  getDaysSinceLastEvolution,
  getLastPerformedSkill,
  getTopSkillHighlights,
  suggestNextClinicalStep,
  mapSkillToStudyTopic,
} from './clinicalProgression';
import { mapProcedureToTopic, StudyKey, STUDY_TOPIC_LABELS } from './studyTopics';
import { generateBoxContext } from '../data/boxIntelligence';
import { hasRecordedAllergie } from './anamnesisUtils';

export type ObservationAccent = 'violet' | 'rose' | 'amber' | 'sky' | 'emerald' | 'neutral';

export interface ClinicalObservation {
  text: string;
  accent: ObservationAccent;
}

export interface BoxPrepItem {
  label: string;
  duration: string;
  studyTopic?: StudyKey;
}

export interface TodayContext {
  now: Date;
  patients: any[];
  appointments: any[];
  hasEvolutionPending: boolean;
  hasClinicalToday: boolean;
  hasClinicalTomorrow: boolean;
  nextAppointment?: any;
  nextAppointmentPatient?: any;
  nextProcedure?: string | null;
  daysSinceLastEvolution: number | null;
  skillHighlights: ReturnType<typeof getTopSkillHighlights>;
  nextStep: ReturnType<typeof suggestNextClinicalStep>;
  primaryGap: ReturnType<typeof detectClinicalGaps>[0] | null;
  lastSkill: ReturnType<typeof getLastPerformedSkill>;
}

const ACTIVE_STATUSES = new Set(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const pickDailyVariant = (messages: string[], seed: string) => {
  if (messages.length === 0) return '';
  const value = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return messages[Math.abs(value) % messages.length];
};

const getProcedureHint = (appointment?: any, patient?: any) => {
  const treatment = patient?.treatmentPlan?.find((item: any) =>
    item?.status === 'PLANEJADO' || item?.status === 'APROVADO'
  );
  return appointment?.notes || appointment?.procedure || treatment?.procedure || null;
};

const firstName = (name?: string) => (name || 'paciente').trim().split(' ')[0] || 'paciente';

export const buildTodayContext = (
  patients: any[],
  appointments: any[],
  now = new Date()
): TodayContext => {
  const usable = appointments
    .filter(app => app.status !== 'CANCELLED')
    .sort((a, b) => {
      const aTime = parseAppointmentDateTime(a.start_time)?.getTime() || 0;
      const bTime = parseAppointmentDateTime(b.start_time)?.getTime() || 0;
      return aTime - bTime;
    });

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const todayAppointments = usable.filter(app => {
    const start = parseAppointmentDateTime(app.start_time);
    return start && sameDay(start, now) && ACTIVE_STATUSES.has(String(app.status || '').toUpperCase());
  });

  const tomorrowAppointments = usable.filter(app => {
    const start = parseAppointmentDateTime(app.start_time);
    return start && sameDay(start, tomorrow) && ACTIVE_STATUSES.has(String(app.status || '').toUpperCase());
  });

  const nextFuture = usable.find(app => {
    const start = parseAppointmentDateTime(app.start_time);
    return start && start > now && ACTIVE_STATUSES.has(String(app.status || '').toUpperCase());
  });

  const nextAppointment = todayAppointments.find(app => {
    const start = parseAppointmentDateTime(app.start_time);
    return start && start >= now;
  }) || todayAppointments[0] || tomorrowAppointments[0] || nextFuture;

  const nextAppointmentPatient = nextAppointment
    ? patients.find(p => p.id === nextAppointment.patient_id)
    : undefined;

  const skillCounts = countClinicalSkills(patients);

  return {
    now,
    patients,
    appointments: usable,
    hasEvolutionPending: false,
    hasClinicalToday: todayAppointments.length > 0,
    hasClinicalTomorrow: tomorrowAppointments.length > 0,
    nextAppointment,
    nextAppointmentPatient,
    nextProcedure: getProcedureHint(nextAppointment, nextAppointmentPatient),
    daysSinceLastEvolution: getDaysSinceLastEvolution(patients, now),
    skillHighlights: getTopSkillHighlights(skillCounts),
    nextStep: suggestNextClinicalStep(skillCounts),
    primaryGap: detectClinicalGaps(skillCounts)[0] || null,
    lastSkill: getLastPerformedSkill(patients),
  };
};

export const getTodayHeadline = (
  context: TodayContext,
  operationalFocus?: { kind: string; patientName?: string }
): string => {
  const daySeed = context.now.toISOString().slice(0, 10);
  const patientName = operationalFocus?.patientName
    ? firstName(operationalFocus.patientName)
    : context.nextAppointment
      ? firstName(context.nextAppointment.patient_name || context.nextAppointmentPatient?.name)
      : null;

  if (operationalFocus?.kind === 'evolution') {
    return pickDailyVariant([
      'Falta registrar a evolução para fechar o atendimento.',
      'Atendimento concluído. Registre a evolução para fechar.',
      'Feche o atendimento antes de seguir.',
    ], `${daySeed}|evolution`);
  }

  if (context.hasClinicalTomorrow && !context.hasClinicalToday && patientName) {
    const proc = context.nextProcedure?.toLowerCase() || '';
    if (proc.includes('anestes') || proc.includes('extra') || proc.includes('cirurg')) {
      return pickDailyVariant([
        `Você tem clínica amanhã. Vale revisar anestesia infiltrativa.`,
        `Amanhã tem box. Separei algo para revisar antes.`,
        `Clínica amanhã com ${patientName}. Vale uma revisão rápida.`,
      ], `${daySeed}|tomorrow-anestesia`);
    }
    return pickDailyVariant([
      `Você tem clínica amanhã. Vale revisar a sequência.`,
      `Amanhã começa com ${patientName}.`,
      `Separei algo que pode ajudar antes da clínica.`,
    ], `${daySeed}|tomorrow`);
  }

  if (context.hasClinicalToday && patientName) {
    return pickDailyVariant([
      `Hoje começa com ${patientName}.`,
      `Seu próximo paciente pode exigir atenção na conduta.`,
      `Hoje a clínica pede foco.`,
    ], `${daySeed}|today`);
  }

  if (context.lastSkill && context.daysSinceLastEvolution !== null && context.daysSinceLastEvolution >= 5) {
    return pickDailyVariant([
      'Faz alguns dias desde sua última evolução clínica.',
      'Faz um tempo desde seu último registro clínico.',
      'Vale retomar a evolução clínica.',
    ], `${daySeed}|stale-evolution`);
  }

  if (context.lastSkill && context.skillHighlights.length > 0) {
    const top = context.skillHighlights[0];
    return pickDailyVariant([
      `Seu último caso envolveu ${top.label}. Separei algo para o próximo.`,
      'Isso é o que faz mais sentido para você agora.',
      'Hoje eu começaria por aqui.',
    ], `${daySeed}|last-skill`);
  }

  if (context.patients.length === 0) {
    return pickDailyVariant([
      'Comece pelo primeiro caso clínico.',
      'A evolução começa com o primeiro registro.',
      'Monte sua base clínica.',
    ], `${daySeed}|start`);
  }

  return pickDailyVariant([
    'Isso é o que faz mais sentido para você agora.',
    'Organize retornos e revise casos abertos.',
    'Bom momento para consolidar sua evolução clínica.',
  ], `${daySeed}|default`);
};

export const getClinicalObservation = (
  context: TodayContext,
  options: {
    hasEvolutionPending?: boolean;
    evolutionCount?: number;
    hasClinicalPending?: boolean;
    isCalm?: boolean;
  } = {}
): ClinicalObservation | null => {
  const { hasEvolutionPending, evolutionCount = 0, hasClinicalPending, isCalm } = options;

  if (hasEvolutionPending) {
    return {
      text: evolutionCount > 1
        ? `${evolutionCount} atendimentos aguardam evolução para fechar.`
        : 'Registre a evolução para fechar o atendimento.',
      accent: 'rose',
    };
  }

  if (context.hasClinicalTomorrow && context.nextProcedure) {
    const topic = mapProcedureToTopic(context.nextProcedure);
    if (topic) {
      const label = STUDY_TOPIC_LABELS[topic];
      return {
        text: `Você realizará ${label.toLowerCase()} amanhã. Quer revisar a sequência?`,
        accent: 'violet',
      };
    }
    return {
      text: 'Separei algo que pode ajudar antes da clínica.',
      accent: 'violet',
    };
  }

  if (context.hasClinicalToday && context.nextProcedure) {
    return {
      text: 'Existe um procedimento que vale revisar antes do próximo atendimento.',
      accent: 'sky',
    };
  }

  if (context.daysSinceLastEvolution !== null && context.daysSinceLastEvolution >= 7) {
    return {
      text: 'Faz algum tempo desde sua última prática clínica registrada.',
      accent: 'amber',
    };
  }

  if (context.primaryGap) {
    return {
      text: context.primaryGap.message,
      accent: 'amber',
    };
  }

  if (context.nextStep && context.patients.length > 0) {
    return {
      text: `Você está pronto para avançar: ${context.nextStep.label.toLowerCase()}.`,
      accent: 'emerald',
    };
  }

  if (hasClinicalPending) {
    return {
      text: 'Antes da clínica, vale revisar pendências no prontuário.',
      accent: 'amber',
    };
  }

  if (isCalm) {
    return {
      text: pickDailyVariant([
        'Está tudo em ordem por aqui.',
        'Bom trabalho. Continue assim.',
        'Nada urgente agora. Bom momento para revisar casos.',
      ], context.now.toISOString().slice(0, 10)),
      accent: 'neutral',
    };
  }

  return null;
};

export const getBoxPrepItems = (procedure: string | null | undefined): BoxPrepItem[] => {
  if (!procedure) {
    return [
      { label: 'Revisar sequência clínica', duration: '2 min', studyTopic: 'exame-clinico' },
      { label: 'Revisar anamnese', duration: '1 min', studyTopic: 'exame-clinico' },
    ];
  }

  const lower = procedure.toLowerCase();
  const topic = mapProcedureToTopic(procedure);

  if (lower.includes('restaura') || lower.includes('classe')) {
    return [
      { label: 'Revisar sequência clínica', duration: '2 min', studyTopic: 'dentistica' },
      { label: 'Revisar isolamento absoluto', duration: '1 min', studyTopic: 'isolamento' },
      { label: 'Revisar acabamento', duration: '1 min', studyTopic: 'dentistica' },
    ];
  }

  if (lower.includes('endo') || lower.includes('canal')) {
    return [
      { label: 'Revisar sequência endodôntica', duration: '2 min', studyTopic: 'endodontia' },
      { label: 'Revisar isolamento', duration: '1 min', studyTopic: 'isolamento' },
      { label: 'Revisar radiografia', duration: '1 min', studyTopic: 'radiologia' },
    ];
  }

  if (lower.includes('extra') || lower.includes('exodont') || lower.includes('cirurg')) {
    return [
      { label: 'Revisar sequência cirúrgica', duration: '2 min', studyTopic: 'cirurgia' },
      { label: 'Revisar anestesia', duration: '1 min', studyTopic: 'anestesia' },
      { label: 'Revisar hemostasia', duration: '1 min', studyTopic: 'cirurgia' },
    ];
  }

  if (lower.includes('rasp') || lower.includes('period')) {
    return [
      { label: 'Revisar sondagem', duration: '2 min', studyTopic: 'periodontia' },
      { label: 'Revisar técnica de raspagem', duration: '1 min', studyTopic: 'periodontia' },
    ];
  }

  if (lower.includes('anestes')) {
    return [
      { label: 'Revisar técnica anestésica', duration: '2 min', studyTopic: 'anestesia' },
      { label: 'Revisar contraindicações', duration: '1 min', studyTopic: 'anestesia' },
    ];
  }

  if (topic) {
    return [
      { label: `Revisar ${STUDY_TOPIC_LABELS[topic].toLowerCase()}`, duration: '2 min', studyTopic: topic },
      { label: 'Revisar sequência clínica', duration: '1 min', studyTopic: 'exame-clinico' },
    ];
  }

  return [
    { label: 'Revisar sequência clínica', duration: '2 min', studyTopic: 'exame-clinico' },
    { label: 'Revisar conduta', duration: '1 min' },
  ];
};

export const getSmartBoxPrepItems = (
  procedure: string | null | undefined,
  patient?: any,
  appointments: any[] = []
): BoxPrepItem[] => {
  const base = getBoxPrepItems(procedure);

  if (!patient) return base;

  const treatments = (patient.treatmentPlan || []).filter((item: any) =>
    ['APROVADO', 'PENDENTE', 'PLANEJADO'].includes(String(item?.status || '').toUpperCase())
  );
  const patientAppointments = appointments.filter(
    (app) => String(app.patient_id) === String(patient.id)
  );
  const boxContext = generateBoxContext(patient, treatments, patientAppointments);
  const smart: BoxPrepItem[] = [];

  if (boxContext.criticalCheckpoint) {
    smart.push({ label: boxContext.criticalCheckpoint.replace(/^⚠️\s*/, '').slice(0, 72), duration: '1 min' });
  }

  if (boxContext.clinicalStage === 'endo_access' || boxContext.clinicalStage === 'endo_instrumentation') {
    smart.push({ label: 'Revisar continuidade do canal (não refazer acesso)', duration: '2 min', studyTopic: 'endodontia' });
  }

  if (
    boxContext.anamnesisAlert &&
    (hasRecordedAllergie(patient?.anamnesis?.allergies) || /hipertens|anticoagul|diabet/i.test(boxContext.anamnesisAlert))
  ) {
    smart.push({ label: `Revisar alerta: ${boxContext.anamnesisAlert.slice(0, 50)}`, duration: '1 min', studyTopic: 'anestesia' });
  }

  if (boxContext.targetTooth) {
    smart.push({
      label: `Conferir dente ${boxContext.targetTooth} no odontograma e RX`,
      duration: '1 min',
      studyTopic: mapProcedureToTopic(procedure || '') || 'radiologia',
    });
  }

  const merged = [...smart, ...base];
  const seen = new Set<string>();
  return merged.filter((item) => {
    const key = item.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 4);
};

export const shouldShowBoxMode = (context: TodayContext): boolean => {
  if (!context.nextAppointment || !context.nextProcedure) return false;
  if (context.hasClinicalToday) return true;

  if (context.hasClinicalTomorrow) {
    const start = parseAppointmentDateTime(context.nextAppointment.start_time);
    if (!start) return false;
    const tomorrow = new Date(context.now);
    tomorrow.setDate(context.now.getDate() + 1);
    return sameDay(start, tomorrow);
  }

  return false;
};

export const getStudyRefreshSuggestion = (
  context: TodayContext
): { topic: StudyKey; reason: string; duration: string } | null => {
  if (context.nextProcedure) {
    const topic = mapProcedureToTopic(context.nextProcedure);
    if (topic) {
      const patientName = firstName(context.nextAppointment?.patient_name || context.nextAppointmentPatient?.name);
      return {
        topic,
        reason: patientName ? `Para o caso de ${patientName}.` : 'Para o próximo atendimento.',
        duration: '5 min',
      };
    }
  }

  if (context.lastSkill) {
    const topic = mapSkillToStudyTopic(context.lastSkill);
    if (topic) {
      return {
        topic,
        reason: 'Para consolidar o que você já pratica.',
        duration: '5 min',
      };
    }
  }

  if (context.nextStep?.studyTopic) {
    return {
      topic: context.nextStep.studyTopic,
      reason: context.nextStep.reason,
      duration: '5 min',
    };
  }

  return null;
};
