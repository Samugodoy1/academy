import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Clock } from '../icons';
import { AcademyActivationCard, AcademyOnboarding } from './AcademyOnboarding';
import { DuoButton } from './DuoButton';
import { BoxModePrep } from './BoxModePrep';
import { ClinicalObservation } from './ClinicalObservation';
import { ClinicalProgressionCard } from './ClinicalProgressionCard';
import { formatAppointmentTime, getAppointmentTime, parseAppointmentDateTime } from '../utils/dateUtils';
import { buildParaFecharRows } from '../utils/deriveAcademyPatientState';
import {
  buildTodayContext,
  getSmartBoxPrepItems,
  getClinicalObservation,
  getStudyRefreshSuggestion,
  getTodayHeadline,
  shouldShowBoxMode,
} from '../utils/clinicalIntelligence';
import { countClinicalSkills, suggestNextClinicalStep, getTopSkillHighlights } from '../utils/clinicalProgression';
import { STUDY_TOPIC_LABELS, StudyKey } from '../utils/studyTopics';
import { DataLoadingSkeleton } from './DataLoadingSkeleton';

const STUDY_TOPIC_STORAGE_KEY = 'academy_study_topic';

interface AcademyDashboardProps {
  user?: any;
  patients: any[];
  appointments: any[];
  now: Date;
  loading?: boolean;
  openPatientRecord: (id: number) => void;
  openPatientEvolution?: (patientId: number, appointment: any) => void;
  setActiveTab: (tab: any) => void;
  setIsPatientModalOpen: (open: boolean) => void;
  openAppointmentModal: () => void;
  onDismissOnboarding: () => void;
  onDismissWelcome: () => void;
  academicPeriod?: string;
}

const ACTIVE_STATUSES = new Set(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const parseDate = (value?: string) => {
  if (!value) return null;
  return parseAppointmentDateTime(value);
};

const firstName = (name?: string) => (name || 'paciente').trim().split(' ')[0] || 'paciente';

const getGreetingName = (user?: any) => {
  const name = user?.name || '';
  return name.replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').split(' ')[0];
};

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const formatTime = (value?: string) => {
  const time = formatAppointmentTime(value);
  return time === '--:--' ? null : time;
};

const formatDayLabel = (value?: string) => {
  const parsed = parseDate(value);
  if (!parsed) return null;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (sameDay(parsed, today)) return 'Hoje';
  if (sameDay(parsed, tomorrow)) return 'Amanhã';
  return parsed.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });
};

const formatDayTime = (value?: string) => {
  const day = formatDayLabel(value);
  const time = formatTime(value);
  if (!day && !time) return null;
  if (!time) return day;
  return `${day}, ${time}`;
};

const formatAppointmentChipTime = (value?: string) => {
  const day = formatDayLabel(value);
  const time = formatTime(value);
  return [day, time].filter(Boolean).join(' · ');
};

const formatAgendaListDateTime = (value?: string) => {
  const parsed = parseDate(value);
  const time = formatTime(value);
  if (!parsed || !time) return { date: '', time: time || '' };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (sameDay(parsed, today)) return { date: 'Hoje', time };
  if (sameDay(parsed, tomorrow)) return { date: 'Amanhã', time };

  const dateLabel = parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  return { date: dateLabel, time };
};

const getStatusLabel = (status?: string) => {
  const labels: Record<string, string> = {
    SCHEDULED: 'Agendado',
    CONFIRMED: 'Agendado',
    FINISHED: 'Concluído',
    CANCELLED: 'Cancelado',
    NO_SHOW: 'Faltou',
    IN_PROGRESS: 'Em atendimento'
  };
  return labels[status || ''] || null;
};

const getPatient = (patients: any[], patientId: number) => patients.find(patient => patient.id === patientId);

const getLastEvolution = (patient?: any) => {
  const evolutions = patient?.evolution || patient?.clinicalEvolution || [];
  if (!Array.isArray(evolutions) || evolutions.length === 0) return null;

  return [...evolutions]
    .filter(item => item?.date || item?.created_at)
    .sort((a, b) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime())[0] || null;
};

const getEvolutionSummary = (patient?: any) => {
  const evolution = getLastEvolution(patient);
  if (!evolution) return null;

  const text = [
    evolution.procedure,
    evolution.procedure_performed,
    evolution.notes
  ].find(Boolean);

  if (!text) return null;
  return String(text).trim();
};

const hasEvolutionAfterAppointment = (patient: any, appointment: any) => {
  const start = parseDate(appointment?.start_time);
  if (!start) return false;

  const lastEvolutionDate = parseDate(patient?.last_evolution_date);
  if (lastEvolutionDate && lastEvolutionDate >= start) return true;

  const evolutions = patient?.evolution || patient?.clinicalEvolution || [];
  if (!Array.isArray(evolutions)) return false;

  return evolutions.some(item => {
    const date = parseDate(item?.date || item?.created_at);
    return date ? date >= start : false;
  });
};

const getProcedureHint = (appointment?: any, patient?: any) => {
  const treatment = patient?.treatmentPlan?.find((item: any) =>
    item?.status === 'PLANEJADO' || item?.status === 'APROVADO'
  );

  return appointment?.notes || appointment?.procedure || treatment?.procedure || null;
};

const ANAMNESIS_FIELDS = [
  'medical_history',
  'allergies',
  'medications',
  'systemic_diseases',
  'clinical_notes',
  'chief_complaint',
  'habits',
  'family_history',
  'vital_signs'
];

const hasFilledAnamnesis = (anamnesis?: any) => {
  if (!anamnesis) return false;

  return ANAMNESIS_FIELDS.some((field) => {
    const value = anamnesis[field];
    return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
  });
};

const hasObjectData = (value: any) => {
  if (!value) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed === '{}') return false;
    try {
      return hasObjectData(JSON.parse(trimmed));
    } catch {
      return trimmed.length > 0;
    }
  }
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return Boolean(value);
};

const hasOdontogramData = (patient?: any) => {
  if (!patient) return false;
  if (hasObjectData(patient.odontogram) || hasObjectData(patient.odontogram_data)) return true;

  const treatmentPlan = patient.treatmentPlan || patient.treatment_plan || [];
  if (Array.isArray(treatmentPlan) && treatmentPlan.length > 0) return true;

  const procedures = patient.procedures || [];
  if (Array.isArray(procedures) && procedures.length > 0) return true;

  return patient.has_odontogram_record === true;
};

const getPatientAppointments = (appointments: any[], patientId?: number) => {
  if (!patientId) return [];
  return appointments
    .filter(app => app.patient_id === patientId)
    .filter(app => !['CANCELLED', 'NO_SHOW'].includes(String(app.status || '').toUpperCase()));
};

const hasTreatmentActivity = (patient?: any) => {
  if (!patient) return false;
  const treatmentPlan = patient.treatmentPlan || patient.treatment_plan || [];
  if (Array.isArray(treatmentPlan) && treatmentPlan.length > 0) return true;

  const evolutions = patient.evolution || patient.clinicalEvolution || [];
  if (Array.isArray(evolutions) && evolutions.length > 0) return true;

  return Boolean(patient.last_evolution_date || Number(patient.evolution_count || 0) > 0);
};

const getAnamnesisAlert = (
  patient: any,
  appointments: any[],
  now: Date,
  options: { includeFirstVisitGuidance?: boolean } = {}
) => {
  if (hasFilledAnamnesis(patient.anamnesis)) return null;

  const patientAppointments = getPatientAppointments(appointments, patient.id);
  const finishedAppointments = patientAppointments.filter(app => String(app.status || '').toUpperCase() === 'FINISHED');
  if (finishedAppointments.length > 0 || hasTreatmentActivity(patient)) return 'Anamnese pendente.';

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const futureOrTodayAppointments = patientAppointments
    .filter(app => ACTIVE_STATUSES.has(String(app.status || '').toUpperCase()))
    .map(app => ({ appointment: app, parsedStart: parseDate(app.start_time) }))
    .filter((item): item is { appointment: any; parsedStart: Date } =>
      Boolean(item.parsedStart && item.parsedStart >= todayStart)
    )
    .sort((a, b) => a.parsedStart.getTime() - b.parsedStart.getTime());

  if (futureOrTodayAppointments.length > 0) {
    const firstAppointment = futureOrTodayAppointments[0];
    if (options.includeFirstVisitGuidance && sameDay(firstAppointment.parsedStart, now)) {
      return 'Comece pela anamnese.';
    }
    return null;
  }

  return 'Anamnese pendente.';
};

const getOdontogramAlert = (
  patient: any,
  appointments: any[],
  now: Date,
  options: { includeFirstVisitGuidance?: boolean } = {}
) => {
  if (hasOdontogramData(patient)) return null;

  const patientAppointments = getPatientAppointments(appointments, patient.id);
  const finishedAppointments = patientAppointments.filter(app => String(app.status || '').toUpperCase() === 'FINISHED');
  if (finishedAppointments.length > 0 || hasTreatmentActivity(patient)) return 'Odontograma pendente.';

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const futureOrTodayAppointments = patientAppointments
    .filter(app => ACTIVE_STATUSES.has(String(app.status || '').toUpperCase()))
    .map(app => ({ appointment: app, parsedStart: parseDate(app.start_time) }))
    .filter((item): item is { appointment: any; parsedStart: Date } =>
      Boolean(item.parsedStart && item.parsedStart >= todayStart)
    )
    .sort((a, b) => a.parsedStart.getTime() - b.parsedStart.getTime());

  if (futureOrTodayAppointments.length > 0) {
    const firstAppointment = futureOrTodayAppointments[0];
    if (options.includeFirstVisitGuidance && sameDay(firstAppointment.parsedStart, now)) {
      return 'Comece pelo odontograma.';
    }
    return null;
  }

  return 'Odontograma pendente.';
};

const getClinicalAlert = (
  patient?: any,
  appointments: any[] = [],
  now: Date = new Date(),
  options: { includeFirstVisitGuidance?: boolean } = {}
) => {
  if (!patient) return null;
  const anamnesisAlert = getAnamnesisAlert(patient, appointments, now, options);
  if (anamnesisAlert) return anamnesisAlert;
  const odontogramAlert = getOdontogramAlert(patient, appointments, now, options);
  if (odontogramAlert) return odontogramAlert;
  return null;
};

const getFirstVisitAnamnesisMessage = (patient: any, appointments: any[], now: Date) => {
  if (!patient || hasFilledAnamnesis(patient.anamnesis) || hasTreatmentActivity(patient)) return null;

  const patientAppointments = getPatientAppointments(appointments, patient.id);
  const hasFinishedAppointment = patientAppointments.some(app => String(app.status || '').toUpperCase() === 'FINISHED');
  if (hasFinishedAppointment) return null;

  const nextFirstAppointment = patientAppointments
    .filter(app => ACTIVE_STATUSES.has(String(app.status || '').toUpperCase()))
    .map(app => ({ appointment: app, parsedStart: parseDate(app.start_time) }))
    .filter((item): item is { appointment: any; parsedStart: Date } => Boolean(item.parsedStart))
    .sort((a, b) => a.parsedStart.getTime() - b.parsedStart.getTime())[0];

  if (!nextFirstAppointment) return null;
  return sameDay(nextFirstAppointment.parsedStart, now)
    ? 'Primeira consulta: comece pela anamnese.'
    : 'Primeira consulta: revise a anamnese antes do box.';
};

const getClinicalPending = (patients: any[], appointments: any[], now: Date) => {
  return patients.find(patient => Boolean(getClinicalAlert(patient, appointments, now))) || null;
};

const getShortClinicalMoment = (focus: any) => {
  const text = String(getProcedureHint(focus.appointment, focus.patient) || '').trim();
  if (!text) return null;

  const lower = text.toLowerCase();
  if (lower.includes('restaura')) return 'restaurar';
  if (lower.includes('endo') || lower.includes('canal')) return 'endodontia';
  if (lower.includes('extra') || lower.includes('cirurg')) return 'cirurgia';
  if (lower.includes('limpeza') || lower.includes('profil')) return 'profilaxia';
  if (lower.includes('clare')) return 'clareamento';
  if (lower.includes('avali') || lower.includes('consulta')) return 'avaliar';

  return text.length > 34 ? `${text.slice(0, 31).trim()}...` : text;
};

const getClinicalActionCopy = (moment: string) => {
  if (moment === 'restaurar') return 'Confira isolamento e material.';
  if (moment === 'endodontia') return 'Confira radiografia e conduta.';
  if (moment === 'cirurgia') return 'Confira anamnese e medicação.';
  if (moment === 'profilaxia') return 'Confira periodonto e orientação.';
  if (moment === 'clareamento') return 'Confira protocolo e sensibilidade.';
  if (moment === 'avaliar') return 'Comece pela queixa principal.';
  return 'Revise a conduta.';
};

const getClinicalAlertCopy = (patient: any, appointment: any, appointments: any[], now: Date) => {
  const firstVisitMessage = getFirstVisitAnamnesisMessage(patient, appointments, now);
  if (firstVisitMessage) return firstVisitMessage;

  const alert = getClinicalAlert(patient, appointments, now, { includeFirstVisitGuidance: true });
  if (alert?.toLowerCase().includes('anamnese')) return 'Anamnese pendente: revise antes do box.';
  if (alert?.toLowerCase().includes('odontograma')) return 'Odontograma pendente: complete antes do box.';

  const clinicalMoment = getShortClinicalMoment({ appointment, patient });
  if (clinicalMoment) return getClinicalActionCopy(clinicalMoment);

  return 'Confira plano e última evolução.';
};

const getAppointmentActionCopy = (patient: any, appointment: any, appointments: any[], now: Date) => {
  const alert = getClinicalAlert(patient, appointments, now, { includeFirstVisitGuidance: true });
  if (alert?.toLowerCase().includes('anamnese')) return 'Revisar anamnese';
  if (alert?.toLowerCase().includes('odontograma')) return 'Revisar odontograma';

  const clinicalMoment = getShortClinicalMoment({ appointment, patient });
  if (clinicalMoment === 'restaurar') return 'Separar material';
  if (clinicalMoment === 'endodontia') return 'Revisar radiografia';
  if (clinicalMoment === 'cirurgia') return 'Revisar anamnese';
  if (clinicalMoment === 'profilaxia') return 'Revisar periodonto';
  if (clinicalMoment === 'clareamento') return 'Conferir protocolo';
  if (clinicalMoment === 'avaliar') return 'Revisar queixa';
  if (getEvolutionSummary(patient)) return 'Revisar última evolução';

  return 'Abrir preparo do caso';
};

export const AcademyDashboard: React.FC<AcademyDashboardProps> = ({
  user,
  patients,
  appointments,
  now,
  loading = false,
  openPatientRecord,
  openPatientEvolution,
  setActiveTab,
  setIsPatientModalOpen,
  openAppointmentModal,
  onDismissOnboarding,
  onDismissWelcome,
  academicPeriod,
}) => {
  const usableAppointments = useMemo(() => {
    return appointments
      .filter(app => app.status !== 'CANCELLED')
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));
  }, [appointments]);

  const paraFecharRows = useMemo(() => {
    return buildParaFecharRows(patients, usableAppointments, now);
  }, [patients, usableAppointments, now]);

  const finishedWithoutEvolution = useMemo(() => {
    return paraFecharRows.map(row => usableAppointments.find(a => a.id === row.appointmentId)).filter(Boolean) as typeof usableAppointments;
  }, [paraFecharRows, usableAppointments]);

  const todayAppointments = useMemo(() => {
    return usableAppointments
      .filter(app => {
        const start = parseDate(app.start_time);
        return !!start && sameDay(start, now);
      })
      .filter(app => ACTIVE_STATUSES.has(app.status))
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));
  }, [usableAppointments, now]);

  const nextTodayAppointment = useMemo(() => {
    return todayAppointments.find(app => getAppointmentTime(app.start_time) >= now.getTime()) || todayAppointments[0] || null;
  }, [todayAppointments, now]);

  const nextAppointment = useMemo(() => {
    return usableAppointments.find(app =>
      getAppointmentTime(app.start_time) > now.getTime() &&
      ACTIVE_STATUSES.has(app.status)
    ) || null;
  }, [usableAppointments, now]);

  const nextAppointments = useMemo(() => {
    return usableAppointments
      .filter(app => getAppointmentTime(app.start_time) > now.getTime() && ACTIVE_STATUSES.has(app.status))
      .slice(0, 4);
  }, [usableAppointments, now]);

  const pausedCase = useMemo(() => {
    const scheduledIds = new Set(nextAppointments.map(app => app.patient_id));

    return patients
      .filter(patient => !scheduledIds.has(patient.id))
      .map(patient => {
        const lastEvolution = getLastEvolution(patient);
        const reference = parseDate(lastEvolution?.date || lastEvolution?.created_at || patient.last_evolution_date || patient.created_at);
        const days = reference ? (now.getTime() - reference.getTime()) / 86400000 : 0;
        return { patient, days };
      })
      .filter(item => item.days >= 30)
      .sort((a, b) => b.days - a.days)[0]?.patient || null;
  }, [patients, nextAppointments, now]);

  const clinicalPending = useMemo(() => getClinicalPending(patients, usableAppointments, now), [patients, usableAppointments, now]);

  const focus = (() => {
    const pendingApp = finishedWithoutEvolution[0];
    if (pendingApp) {
      const patient = getPatient(patients, pendingApp.patient_id);
      const pendingRow = paraFecharRows.find(r => r.appointmentId === pendingApp.id);
      const procedureLabel = pendingRow?.procedure || pendingApp.notes || pendingApp.procedure || 'Atendimento';
      const dateLabel = pendingRow?.appointmentLabel || '';
      return {
        kind: 'evolution',
        eyebrow: 'Atendimento concluído',
        title: `${firstName(patient?.name || pendingApp.patient_name)} já foi atendido.`,
        subtitle: dateLabel
          ? `Fechar atendimento de ${procedureLabel} · ${dateLabel}`
          : 'Falta registrar a evolução para fechar o atendimento.',
        actionLabel: `Fechar atendimento${procedureLabel !== 'Atendimento' ? ` de ${procedureLabel}` : ''}`,
        patient,
        appointment: pendingApp,
        pendingProcedure: procedureLabel,
        pendingDateLabel: dateLabel,
        action: () => openPatientEvolution
          ? openPatientEvolution(pendingApp.patient_id, pendingApp)
          : openPatientRecord(pendingApp.patient_id)
      };
    }

    if (nextTodayAppointment) {
      const patient = getPatient(patients, nextTodayAppointment.patient_id);
      return {
        kind: 'today',
        eyebrow: 'A seguir',
        title: getAppointmentActionCopy(patient, nextTodayAppointment, usableAppointments, now),
        subtitle: getClinicalAlertCopy(patient, nextTodayAppointment, usableAppointments, now),
        actionLabel: 'Abrir caso',
        patient,
        appointment: nextTodayAppointment,
        action: () => openPatientRecord(nextTodayAppointment.patient_id)
      };
    }

    if (nextAppointment) {
      const patient = getPatient(patients, nextAppointment.patient_id);
      return {
        kind: 'next',
        eyebrow: 'Próximo',
        title: getAppointmentActionCopy(patient, nextAppointment, usableAppointments, now),
        subtitle: getClinicalAlertCopy(patient, nextAppointment, usableAppointments, now),
        actionLabel: 'Revisar caso',
        patient,
        appointment: nextAppointment,
        action: () => openPatientRecord(nextAppointment.patient_id)
      };
    }

    if (pausedCase) {
      return {
        kind: 'paused',
        eyebrow: 'Retorno',
        title: 'Caso sem próximo passo.',
        subtitle: 'Revise a última evolução e defina o retorno.',
        actionLabel: 'Revisar caso',
        patient: pausedCase,
        appointment: null,
        action: () => openPatientRecord(pausedCase.id)
      };
    }

    if (clinicalPending) {
      return {
        kind: 'pending',
        eyebrow: 'Prontuário',
        title: 'Dado clínico pendente.',
        subtitle: getClinicalAlert(clinicalPending, usableAppointments, now) || 'Complete o prontuário antes do próximo atendimento.',
        actionLabel: 'Abrir prontuário',
        patient: clinicalPending,
        appointment: null,
        action: () => openPatientRecord(clinicalPending.id)
      };
    }

    if (patients.length === 0) {
      return {
        kind: 'start',
        eyebrow: 'Primeiro passo',
        title: 'Cadastre o primeiro paciente.',
        subtitle: 'A rotina começa pelo caso clínico, não pela agenda.',
        actionLabel: 'Cadastrar paciente',
        patient: null,
        appointment: null,
        action: () => setIsPatientModalOpen(true)
      };
    }

    return {
      kind: 'calm',
      eyebrow: 'Sem box hoje',
      title: 'Organize retornos.',
      subtitle: 'Bom momento para revisar evoluções e pendências.',
      actionLabel: 'Ver pacientes',
      patient: null,
      appointment: null,
      action: () => setActiveTab('pacientes')
    };
  })();

  const greetingName = getGreetingName(user);

  const todayContext = useMemo(
    () => buildTodayContext(patients, usableAppointments, now),
    [patients, usableAppointments, now]
  );

  const skillCounts = useMemo(() => countClinicalSkills(patients), [patients]);
  const skillHighlights = useMemo(() => getTopSkillHighlights(skillCounts), [skillCounts]);
  const nextClinicalStep = useMemo(() => suggestNextClinicalStep(skillCounts), [skillCounts]);

  const smartMessage = getTodayHeadline(todayContext, {
    kind: focus.kind,
    patientName: focus.patient?.name || focus.appointment?.patient_name,
  });

  const isCalmState = focus.kind === 'calm' && finishedWithoutEvolution.length === 0;
  const clinicalObservation = getClinicalObservation(todayContext, {
    hasEvolutionPending: finishedWithoutEvolution.length > 0,
    evolutionCount: finishedWithoutEvolution.length,
    hasClinicalPending: Boolean(clinicalPending),
    isCalm: isCalmState,
  });

  const showBoxMode = shouldShowBoxMode(todayContext) && focus.kind !== 'evolution';
  const boxPrepItems = getSmartBoxPrepItems(
    todayContext.nextProcedure,
    todayContext.nextAppointmentPatient,
    todayContext.appointments
  );
  const boxScheduleLabel = formatAppointmentChipTime(todayContext.nextAppointment?.start_time);

  const openStudyTopic = (topic: StudyKey) => {
    sessionStorage.setItem(STUDY_TOPIC_STORAGE_KEY, topic);
    setActiveTab('estudos');
  };

  const focusPatientName = focus.patient?.name || focus.appointment?.patient_name || null;
  const isFinishedFocus = focus.appointment?.status === 'FINISHED';
  const pendingDateLabel = (focus as any).pendingDateLabel || '';
  const statusLabel = isFinishedFocus && focus.kind === 'evolution'
    ? `Evolução pendente${pendingDateLabel ? ` · ${pendingDateLabel}` : ''}`
    : getStatusLabel(focus.appointment?.status);
  const scheduleLabel = formatAppointmentChipTime(focus.appointment?.start_time);
  const appointmentMetaLabel = [
    statusLabel,
    !isFinishedFocus ? scheduleLabel : null
  ].filter(Boolean).join(' · ');
  const procedureHint = getProcedureHint(focus.appointment, focus.patient);
  const otherAppointments = nextAppointments
    .filter(app => app.id !== focus.appointment?.id)
    .slice(0, 3);
  const pendingRows = [
    ...paraFecharRows.slice(0, 2).map(row => ({
      id: row.id,
      patientId: row.patientId,
      appointmentId: row.appointmentId,
      title: row.title,
      meta: row.meta,
      tone: 'coral' as const
    })),
    ...(clinicalPending && !paraFecharRows.some(row => row.patientId === clinicalPending.id)
      ? [{
        id: `clinical-${clinicalPending.id}`,
        patientId: clinicalPending.id,
        appointmentId: 0,
        title: clinicalPending.name,
        meta: getClinicalAlert(clinicalPending, usableAppointments, now) || 'Complete o prontuário.',
        tone: 'coral' as const
      }]
      : [])
  ].slice(0, 3);

  const studySuggestion = useMemo(() => {
    if (focus.kind === 'evolution' || focus.kind === 'start') return null;
    if (showBoxMode) return null;

    const refresh = getStudyRefreshSuggestion(todayContext);
    if (!refresh) return null;

    return {
      topicKey: refresh.topic,
      topic: STUDY_TOPIC_LABELS[refresh.topic],
      reason: refresh.reason,
      duration: refresh.duration,
    };
  }, [focus.kind, showBoxMode, todayContext]);

  if (loading) {
    return (
      <div className="page-shell">
        <DataLoadingSkeleton rows={5} />
      </div>
    );
  }

  return (
    <AcademyOnboarding
      user={user}
      patients={patients}
      totalAppointmentsCount={usableAppointments.length}
      openPatientRecord={openPatientRecord}
      setIsPatientModalOpen={setIsPatientModalOpen}
      openAppointmentModal={openAppointmentModal}
      onDismissOnboarding={onDismissOnboarding}
      onDismissWelcome={onDismissWelcome}
    >
    <div className="page-shell space-y-8 tablet-l:space-y-10">
      <section className="space-y-5">
        <AcademyActivationCard
          user={user}
          patients={patients}
          totalAppointmentsCount={usableAppointments.length}
          onboardingDismissed={user?.onboarding_done ?? false}
          openPatientRecord={openPatientRecord}
        />
        <ClinicalObservation observation={clinicalObservation} />
      </section>

      <div className="flex flex-col gap-8 tablet-l:grid tablet-l:grid-cols-12 tablet-l:gap-8 tablet-l:items-start">
      <div className="space-y-5 tablet-l:col-span-7">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="oh-device px-6 py-8 tablet-l:px-9 tablet-l:py-10"
        >
          <p className="text-[15px] font-normal text-[#86868b] tracking-[-0.011em]">
            {getTimeGreeting()}{greetingName ? `, ${greetingName}` : ''}
            {academicPeriod ? ` · ${academicPeriod}` : ''}
          </p>
          <h1 className="mt-3 text-[34px] sm:text-[40px] font-semibold text-white leading-[1.05] tracking-[-0.025em]">
            {smartMessage}
          </h1>

          {focusPatientName && (
            <button
              type="button"
              onClick={focus.action}
              className="oh-device-inset mt-8 w-full px-5 py-5 text-left"
            >
              {appointmentMetaLabel && (
                <p className="text-[12px] font-normal text-[#86868b] tracking-[0.08em] uppercase">
                  {appointmentMetaLabel}
                </p>
              )}
              <p className="mt-1.5 text-[28px] font-semibold text-white leading-[1.05] tracking-[-0.025em]">
                {focusPatientName}
              </p>
              <p className="mt-1 text-[15px] text-[#86868b] tracking-[-0.011em]">
                {procedureHint || focus.subtitle}
              </p>
            </button>
          )}

          {!focusPatientName && (
            <p className="mt-5 text-[17px] text-[#86868b] leading-snug tracking-[-0.011em]">
              {focus.subtitle}
            </p>
          )}

          {showBoxMode && boxPrepItems[0] && (
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[13px] text-[#86868b]">Checklist</p>
                <p className="text-[17px] text-white truncate">{boxPrepItems[0].label}</p>
              </div>
              <span className="text-[15px] text-[#30d158] shrink-0">Pronto</span>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <DuoButton onClick={focus.action}>{focus.actionLabel}</DuoButton>
            <div className="grid grid-cols-2 gap-3">
              <DuoButton variant="secondary" onClick={() => setActiveTab('pacientes')}>
                Casos
              </DuoButton>
              <DuoButton variant="secondary" onClick={openAppointmentModal}>
                Agendar
              </DuoButton>
            </div>
          </div>
        </motion.section>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsPatientModalOpen(true)}
            className="apple-btn-light !px-4 !py-2 !text-[15px]"
          >
            Caso
          </button>
          <button
            type="button"
            onClick={openAppointmentModal}
            className="apple-btn !px-4 !py-2 !text-[15px]"
          >
            Agendar
          </button>
        </div>

      {showBoxMode && todayContext.nextAppointment && todayContext.nextProcedure && (
        <BoxModePrep
          patientName={todayContext.nextAppointment.patient_name || todayContext.nextAppointmentPatient?.name || 'Paciente'}
          procedure={todayContext.nextProcedure}
          items={boxPrepItems}
          scheduleLabel={boxScheduleLabel}
          onReviewItem={(item) => item.studyTopic && openStudyTopic(item.studyTopic)}
          onOpenCase={() => openPatientRecord(todayContext.nextAppointment!.patient_id)}
        />
      )}

      {!showBoxMode && (skillHighlights.length > 0 || nextClinicalStep) && (
        <ClinicalProgressionCard
          highlights={skillHighlights}
          nextStep={nextClinicalStep}
          onReviewNextStep={
            nextClinicalStep?.studyTopic
              ? () => openStudyTopic(nextClinicalStep.studyTopic!)
              : undefined
          }
        />
      )}
      </div>

      <div className="space-y-6 tablet-l:col-span-5 tablet-l:sticky tablet-l:top-8">

      {studySuggestion && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="oh-device overflow-hidden">
            <div className="px-5 pt-5 pb-2">
              <div className="min-w-0">
                <span className="text-[13px] font-normal text-[#86868b]">
                  Antes do box
                </span>
                <h3 className="text-[22px] font-semibold text-white leading-[1.05] tracking-[-0.025em] mt-1">
                  {studySuggestion.topic}
                </h3>
                <p className="text-[15px] font-normal text-[#86868b] mt-1.5 leading-relaxed">
                  {studySuggestion.reason}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-3 flex items-center justify-between gap-3">
              <span className="text-[13px] font-normal text-apple-gray">
                {studySuggestion.duration}
              </span>
              <DuoButton wide={false} className="!w-auto px-5" onClick={() => openStudyTopic(studySuggestion.topicKey)}>
                Revisar
              </DuoButton>
            </div>
          </div>
        </motion.section>
      )}

      {pendingRows.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[17px] font-semibold text-white tracking-[-0.016em]">Para fechar</h3>
            </div>
            <span className="text-[13px] font-normal text-apple-gray">{pendingRows.length}</span>
          </div>
          <div className="rounded-[28px] overflow-hidden bg-[#1d1d1f]">
            {pendingRows.map(row => (
              <React.Fragment key={row.id}>
                <ListRow
                  title={row.title}
                  meta={row.meta}
                  accent="coral"
                  onClick={() => {
                    if (row.appointmentId && openPatientEvolution) {
                      const app = usableAppointments.find(a => a.id === row.appointmentId);
                      if (app) {
                        openPatientEvolution(row.patientId, app);
                        return;
                      }
                    }
                    openPatientRecord(row.patientId);
                  }}
                />
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {otherAppointments.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[17px] font-semibold text-white tracking-[-0.016em]">Próximos boxes</h3>
            </div>
            <button onClick={() => setActiveTab('agenda')} className="apple-link !text-[15px]">
              Ver tudo ›
            </button>
          </div>
          <div className="rounded-[28px] overflow-hidden bg-[#1d1d1f]">
            {otherAppointments.map((app, index) => {
              const dateTime = formatAgendaListDateTime(app.start_time);
              return (
                <motion.div
                  key={app.id}
                  whileTap={{ backgroundColor: 'var(--academy-bg)' }}
                  transition={{ duration: 0.15 }}
                  onClick={() => openPatientRecord(app.patient_id)}
                  className={`flex items-center justify-between px-5 py-[16px] transition-colors cursor-pointer ${index !== otherAppointments.length - 1 ? 'border-b border-academy-border' : ''}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex flex-col items-start shrink-0 w-14">
                      <span className="text-[12px] font-bold text-academy-primary leading-none">
                        {dateTime.date}
                      </span>
                      <span className="text-[15px] font-bold text-academy-primary leading-none mt-1">
                        {dateTime.time}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-academy-primary/12 shrink-0" />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[15px] font-semibold text-academy-text truncate">{app.patient_name}</span>
                      <span className="text-[12px] text-academy-muted truncate">{app.notes || 'Atendimento'}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#C6C6C8] shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {pausedCase && focus.patient?.id !== pausedCase.id && (
        <section>
          <motion.button
            whileTap={{ scale: 0.98, opacity: 0.9 }}
            onClick={() => openPatientRecord(pausedCase.id)}
            className="w-full flex items-center gap-4 bg-[#1d1d1f] rounded-[28px] px-5 py-4 transition-all"
          >
            <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center text-academy-alert-text shadow-sm shrink-0">
              <Clock size={20} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[15px] font-semibold text-academy-text">Retorno sem data</p>
              <p className="text-[12px] text-academy-muted truncate">{pausedCase.name}</p>
            </div>
            <ChevronRight size={16} className="text-[#C6C6C8] shrink-0" />
          </motion.button>
        </section>
      )}

      {patients.length > 0 && pendingRows.length === 0 && otherAppointments.length === 0 && !pausedCase && (
        <section>
          <div className="w-full flex items-center gap-4 bg-[#1d1d1f] rounded-[28px] px-5 py-4">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-[#30d158] shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[15px] font-semibold text-white">Sem paciente marcado hoje.</p>
              <p className="text-[12px] text-academy-muted">Revise retornos e prontuários abertos.</p>
            </div>
          </div>
        </section>
      )}
      </div>
      </div>
    </div>
    </AcademyOnboarding>
  );
};

const ListRow = ({
  title,
  meta,
  accent,
  onClick
}: {
  title: string;
  meta: string;
  accent: 'coral';
  onClick: () => void;
}) => {
  const metaLines = meta.split('\n').filter(Boolean);
  return (
    <motion.div
      whileTap={{ backgroundColor: 'var(--academy-bg)' }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 p-5 cursor-pointer border-b border-[#C6C6C8]/5 last:border-b-0"
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] overflow-hidden border shrink-0 bg-academy-attention text-academy-attention-text border-rose-100">
          {(title || '?').charAt(0).toUpperCase()}
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-academy-attention-text border-2 border-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-academy-text truncate">{title}</p>
        {metaLines.map((line, i) => (
          <p key={i} className={`text-[12px] ${i === 0 && metaLines.length > 1 ? 'font-medium text-academy-text/70' : 'text-academy-muted'} ${i === 0 ? 'mt-0.5' : 'mt-0'} truncate`}>
            {line}
          </p>
        ))}
      </div>
      <ChevronRight size={16} className="text-[#C6C6C8] shrink-0" />
    </motion.div>
  );
};
