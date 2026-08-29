import React, { useEffect, useRef } from 'react';
import {
  Users,
  Calendar,
  CalendarPlus,
  ClipboardList,
  Plus,
  Search,
  MessageCircle,
  Check,
  LinkIcon,
  UserPlus,
} from '../../icons';
import { DataLoadingSkeleton } from '../../components/DataLoadingSkeleton';
import { PortalInbox } from '../../components/PortalInbox';
import {
  getPatientCardMeta,
  formatProcedure,
  type PatientCardMeta,
} from '../../utils/patientCardMeta';
import { deriveAcademyPatientState } from '../../utils/deriveAcademyPatientState';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentTime,
} from '../../utils/dateUtils';
import type { Appointment, Patient } from '../../types/clinical';

type AppTabId =
  | 'dashboard'
  | 'agenda'
  | 'pacientes'
  | 'estudos'
  | 'financeiro'
  | 'documentos'
  | 'prontuario'
  | 'configuracoes'
  | 'admin'
  | 'portal'
  | 'inteligencia'
  | 'academy';

type PatientListFilter = 'all' | 'pending' | 'scheduled';
type PatientsSubView = 'list' | 'portal';

export interface PatientIntelligence {
  patient_id: number;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  status?: 'ABANDONO' | 'ATENCAO' | 'EM_TRATAMENTO' | 'FINALIZADO' | null;
}

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

export interface PacientesTabProps {
  loading: boolean;
  patients: Patient[];
  appointments: Appointment[];
  now: Date;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  patientListFilter: PatientListFilter;
  setPatientListFilter: (value: PatientListFilter) => void;
  patientsSubView: PatientsSubView;
  setPatientsSubView: (value: PatientsSubView) => void;
  portalPendingCount: number;
  patientsInlineFeedback: string;
  setPatientsInlineFeedback: (value: string) => void;
  patientActionsToday: Set<number>;
  setPatientActionsToday: React.Dispatch<React.SetStateAction<Set<number>>>;
  patientIntelligence: PatientIntelligence[];
  patientMap: Map<number, Patient>;
  apiFetch: ApiFetch;
  openPatientAppointmentModal: (
    patient: Patient,
    preferredDate?: string,
    preferredTime?: string | null,
  ) => void;
  openPatientRecord: (id: number) => void | Promise<void>;
  contactPatientOnWhatsApp: (patient: Patient) => void;
  generatePatientPortalLink: (patient: Patient) => void | Promise<void>;
  setIsPatientModalOpen: (value: boolean) => void;
  setActiveTab: (tab: AppTabId) => void;
}

function PacientesTabComponent({
  loading,
  patients,
  appointments,
  now,
  searchTerm,
  setSearchTerm,
  patientListFilter,
  setPatientListFilter,
  patientsSubView,
  setPatientsSubView,
  portalPendingCount,
  patientsInlineFeedback,
  setPatientsInlineFeedback,
  patientActionsToday,
  setPatientActionsToday,
  patientIntelligence,
  patientMap,
  apiFetch,
  openPatientAppointmentModal,
  openPatientRecord,
  contactPatientOnWhatsApp,
  generatePatientPortalLink,
  setIsPatientModalOpen,
  setActiveTab,
}: PacientesTabProps) {
  const filterAutoAppliedRef = useRef(false);

  useEffect(() => {
    if (loading || filterAutoAppliedRef.current) return;

    const unique = Array.from(
      new Map(patients.map(patient => [patient.id, patient])).values(),
    ) as Patient[];
    const intelMap = new Map<number, PatientIntelligence>();
    patientIntelligence.forEach(pi => intelMap.set(pi.patient_id, pi));

    const getNextAppt = (patient: Patient) =>
      appointments
        .filter(
          app =>
            app.patient_id === patient.id &&
            getAppointmentTime(app.start_time) >= now.getTime() &&
            !['CANCELLED', 'NO_SHOW'].includes(String(app.status || '').toUpperCase()),
        )
        .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time))[0] ||
      null;

    const hasAnamnesis = (patient: Patient) => {
      const anamnesis = patient.anamnesis || {};
      return Object.values(anamnesis).some(value =>
        typeof value === 'string' ? value.trim().length > 0 : Boolean(value),
      );
    };

    const isPending = (patient: Patient) => {
      const meta = getPatientCardMeta(patient, appointments, now);
      const intel = intelMap.get(patient.id) || null;
      const nextAppointment = getNextAppt(patient);
      const state = deriveAcademyPatientState(patient, appointments, now);
      if (state.finishedWithoutEvolution.length > 0) return true;
      if (nextAppointment && !hasAnamnesis(patient)) return true;
      if (meta.attentionStatus.key === 'overdue' || meta.attentionStatus.key === 'review' || meta.isLead) {
        return true;
      }
      return intel?.priority === 'HIGH' || intel?.status === 'ABANDONO' || intel?.status === 'ATENCAO';
    };

    const totalPending = unique.filter(isPending).length;
    const totalScheduled = unique.filter(patient => Boolean(getNextAppt(patient))).length;

    setPatientListFilter(totalPending > 0 ? 'pending' : totalScheduled > 0 ? 'scheduled' : 'all');
    filterAutoAppliedRef.current = true;
  }, [loading, patients, patientIntelligence, appointments, now, setPatientListFilter]);

  if (loading) {
    return (
      <div className="pt-10 px-2 max-w-screen-xl mx-auto w-full">
        <DataLoadingSkeleton rows={6} />
      </div>
    );
  }

  // ---------- stats ----------
  const uniquePatients = Array.from(
    new Map(patients.map((patient) => [patient.id, patient])).values(),
  ) as Patient[];
  const allMetas = uniquePatients.map(p => ({
    patient: p,
    meta: getPatientCardMeta(p, appointments, now),
  }));
  const getNextPatientAppointment = (patient: Patient) =>
    appointments
      .filter(
        app =>
          app.patient_id === patient.id &&
          getAppointmentTime(app.start_time) >= now.getTime() &&
          !['CANCELLED', 'NO_SHOW'].includes(String(app.status || '').toUpperCase()),
      )
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time))[0] ||
    null;
  const hasFilledAnamnesis = (patient: Patient) => {
    const anamnesis = patient.anamnesis || {};
    return Object.values(anamnesis).some(value =>
      typeof value === 'string' ? value.trim().length > 0 : Boolean(value),
    );
  };
  const hasEvolution = (patient: Patient) => {
    const evolutions = patient.evolution || patient.clinicalEvolution || [];
    return Array.isArray(evolutions) && evolutions.length > 0;
  };
  const getCaseMoment = (patient: Patient, nextAppointment: Appointment | null) => {
    if (nextAppointment && !hasEvolution(patient)) return 'Primeira consulta';
    if (nextAppointment) return 'Retorno';
    if (hasEvolution(patient)) return 'Em acompanhamento';
    return 'Caso novo';
  };
  const getPatientConduct = (patient: Patient, nextAppointment: Appointment | null) => {
    const planned = patient.treatmentPlan?.find(
      plan => plan.status === 'PLANEJADO' || plan.status === 'APROVADO',
    );
    return (
      nextAppointment?.notes ||
      (nextAppointment as Appointment & { procedure?: string })?.procedure ||
      planned?.procedure ||
      'Avaliação'
    );
  };
  const patientStateCache = new Map<number, ReturnType<typeof deriveAcademyPatientState>>();
  const getCachedPatientState = (patient: Patient) => {
    if (!patientStateCache.has(patient.id)) {
      patientStateCache.set(patient.id, deriveAcademyPatientState(patient, appointments, now));
    }
    return patientStateCache.get(patient.id)!;
  };

  const getPatientNextAction = (
    patient: Patient,
    meta: PatientCardMeta,
    nextAppointment: Appointment | null,
  ) => {
    const state = getCachedPatientState(patient);
    if (state.finishedWithoutEvolution.length > 0) return 'Fechar atendimento';
    if (nextAppointment && !hasFilledAnamnesis(patient)) return 'Revisar anamnese';
    if (nextAppointment && hasEvolution(patient)) return 'Revisar última evolução';
    if (nextAppointment) return 'Preparar conduta';
    if (meta.attentionStatus.key === 'overdue' || meta.attentionStatus.key === 'review') {
      return 'Definir retorno';
    }
    if (meta.isLead) return 'Agendar primeira consulta';
    return 'Acompanhar caso';
  };
  const getCasePendingLabel = (
    patient: Patient,
    meta: PatientCardMeta,
    nextAppointment: Appointment | null,
  ) => {
    const state = getCachedPatientState(patient);
    if (state.finishedWithoutEvolution.length > 0) return 'Fechar atendimento';
    if (nextAppointment && !hasFilledAnamnesis(patient)) return 'Anamnese pendente';
    if (nextAppointment && hasEvolution(patient)) return 'Revisar última evolução';
    if (nextAppointment) return 'Preparar conduta';
    if (meta.attentionStatus.key === 'overdue' || meta.attentionStatus.key === 'review') {
      return 'Retorno pendente';
    }
    if (meta.isLead) return 'Agendar primeira consulta';
    return 'Sem pendências no momento';
  };
  const getCaseConductLabel = (patient: Patient, nextAppointment: Appointment | null) => {
    const conduct = getPatientConduct(patient, nextAppointment);
    const formatted = formatProcedure(conduct);
    if (!formatted || formatted === 'Avaliação' || conduct === 'Avaliação') return 'Avaliação inicial';
    return formatted;
  };
  const isCasePending = (
    patient: Patient,
    meta: PatientCardMeta,
    intel: PatientIntelligence | null,
    nextAppointment: Appointment | null,
  ) => {
    const state = getCachedPatientState(patient);
    if (state.finishedWithoutEvolution.length > 0) return true;
    if (nextAppointment && !hasFilledAnamnesis(patient)) return true;
    if (meta.attentionStatus.key === 'overdue' || meta.attentionStatus.key === 'review' || meta.isLead) {
      return true;
    }
    return intel?.priority === 'HIGH' || intel?.status === 'ABANDONO' || intel?.status === 'ATENCAO';
  };
  const formatCaseAppointment = (appointment: Appointment | null) => {
    if (!appointment) return 'Sem consulta marcada';
    const day = formatAppointmentDate(appointment.start_time, { weekday: 'short', day: '2-digit' });
    const time = formatAppointmentTime(appointment.start_time);
    return `${day} às ${time}`;
  };
  const hasText = (value?: string | null) => Boolean(value?.trim());
  const intelMap = new Map<number, PatientIntelligence>();
  patientIntelligence.forEach(pi => intelMap.set(pi.patient_id, pi));

  const caseSummaries = allMetas.map(({ patient, meta }) => {
    const intel = intelMap.get(patient.id) || null;
    const nextAppointment = getNextPatientAppointment(patient);
    return { patient, meta, intel, nextAppointment };
  });
  const totalPendingCases = caseSummaries.filter(({ patient, meta, intel, nextAppointment }) =>
    isCasePending(patient, meta, intel, nextAppointment),
  ).length;
  const totalScheduledCases = caseSummaries.filter(({ nextAppointment }) =>
    Boolean(nextAppointment),
  ).length;

  const filterChips = [
    { key: 'all' as const, label: 'Todos', count: null },
    { key: 'pending' as const, label: 'Pendentes', count: totalPendingCases },
    { key: 'scheduled' as const, label: 'Com consulta', count: totalScheduledCases },
  ].filter(chip => chip.count === null || chip.count > 0) as {
    key: PatientListFilter;
    label: string;
    count: number | null;
  }[];

  const effectivePatientListFilter: PatientListFilter =
    patientListFilter !== 'all' && !filterChips.some(c => c.key === patientListFilter)
      ? 'all'
      : patientListFilter;

  const patientCards = uniquePatients
    .map(patient => {
      const meta = getPatientCardMeta(patient, appointments, now);
      const intel = intelMap.get(patient.id) || null;
      const nextAppointment = getNextPatientAppointment(patient);
      const moment = getCaseMoment(patient, nextAppointment);
      const conduct = getPatientConduct(patient, nextAppointment);
      const conductLabel = getCaseConductLabel(patient, nextAppointment);
      const nextAction = getPatientNextAction(patient, meta, nextAppointment);
      const pendingLabel = getCasePendingLabel(patient, meta, nextAppointment);
      return { patient, meta, intel, nextAppointment, moment, conduct, conductLabel, nextAction, pendingLabel };
    })
    .filter(
      ({ patient, meta, conduct, nextAction }) =>
        (patient.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (conduct || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (nextAction || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        meta.attentionStatus.label.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (patient.cpf && patient.cpf.includes(searchTerm)) ||
        (patient.phone && patient.phone.includes(searchTerm)),
    )
    .filter(({ patient, meta, intel, nextAppointment }) => {
      if (effectivePatientListFilter === 'all') return true;
      if (effectivePatientListFilter === 'pending') {
        return isCasePending(patient, meta, intel, nextAppointment);
      }
      if (effectivePatientListFilter === 'scheduled') return Boolean(nextAppointment);
      return true;
    })
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      const aPri = priorityOrder[a.intel?.priority ?? ''] ?? 2;
      const bPri = priorityOrder[b.intel?.priority ?? ''] ?? 2;
      if (aPri !== bPri) return aPri - bPri;
      const attentionPriority = { overdue: 0, review: 1, 'up-to-date': 2 } as const;
      const attentionDiff =
        attentionPriority[a.meta.attentionStatus.key as keyof typeof attentionPriority] -
        attentionPriority[b.meta.attentionStatus.key as keyof typeof attentionPriority];
      if (attentionDiff !== 0) return attentionDiff;
      const dateA = a.meta.lastVisitDate ? a.meta.lastVisitDate.getTime() : 0;
      const dateB = b.meta.lastVisitDate ? b.meta.lastVisitDate.getTime() : 0;
      return dateA - dateB;
    });

  const handleScheduleFromCard = (patient: Patient) => {
    setPatientActionsToday(prev => new Set([...prev, patient.id]));
    openPatientAppointmentModal(patient);
  };

  const featuredCase = caseSummaries
    .filter(({ patient, meta, intel, nextAppointment }) =>
      nextAppointment || isCasePending(patient, meta, intel, nextAppointment),
    )
    .sort((a, b) => {
      if (a.nextAppointment && b.nextAppointment) {
        return (
          getAppointmentTime(a.nextAppointment.start_time) -
          getAppointmentTime(b.nextAppointment.start_time)
        );
      }
      if (a.nextAppointment) return -1;
      if (b.nextAppointment) return 1;
      return 0;
    })[0];

  const casesSmartCopy = (() => {
    if (totalPendingCases > 0) {
      return `${totalPendingCases} ${totalPendingCases === 1 ? 'caso pede' : 'casos pedem'} sua atenção.`;
    }
    if (totalScheduledCases > 0) {
      return `${totalScheduledCases} ${totalScheduledCases === 1 ? 'caso tem' : 'casos têm'} consulta marcada.`;
    }
    if (!featuredCase) return 'Tudo em ordem por enquanto.';
    const firstName = (featuredCase.patient.name || 'Paciente').split(' ')[0];
    const action = getPatientNextAction(
      featuredCase.patient,
      featuredCase.meta,
      featuredCase.nextAppointment,
    );
    const actionCopy = action === 'Revisar anamnese' ? 'Comece pela anamnese.' : `${action}.`;
    if (featuredCase.nextAppointment) return `${firstName} tem consulta marcada. ${actionCopy}`;
    return `${firstName} precisa de atenção. ${actionCopy}`;
  })();

  return (
    <div className="space-y-4 pt-8 pb-28 px-5 sm:px-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-academy-primary">Prontuário</p>
            <h3 className="text-[34px] sm:text-[38px] font-bold tracking-tight text-academy-text leading-[1.1]">Casos</h3>
            {patientsSubView === 'list' && (
              <p className="text-[14px] text-academy-muted mt-1">{casesSmartCopy}</p>
            )}
          </div>
          {portalPendingCount > 0 && patientsSubView === 'list' && (
            <button
              type="button"
              onClick={() => setPatientsSubView('portal')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-card border border-rose-200/50 text-academy-attention-text hover:scale-[0.98] transition-all text-[12px] font-semibold shrink-0"
            >
              <ClipboardList size={13} />
              {portalPendingCount}{' '}
              {portalPendingCount === 1 ? 'solicitação' : 'solicitações'}
            </button>
          )}
          {patientsSubView === 'portal' && (
            <button
              type="button"
              onClick={() => setPatientsSubView('list')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-segment text-academy-muted hover:text-academy-text transition-colors text-[12px] font-semibold shrink-0"
            >
              ← Lista
            </button>
          )}
        </div>

        {patientsSubView === 'list' && (
          <div className="flex items-center gap-3 liquid-glass-segment p-1.5 rounded-[22px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-academy-muted" size={16} />
              <input
                type="text"
                placeholder="Buscar paciente, conduta ou pendência"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-9 pr-3 py-2 liquid-glass-subtle rounded-[18px] focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-base text-academy-text placeholder:text-academy-muted/60"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsPatientModalOpen(true)}
              className="p-2.5 text-academy-primary transition-colors rounded-full liquid-glass-card hover:scale-[0.97] active:scale-95"
              title="Novo caso clinico"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {patientsSubView === 'portal' ? (
        <PortalInbox
          apiFetch={apiFetch}
          onSchedulePatient={(patientId, _patientName, preferredDate) => {
            const p = patientMap.get(patientId);
            if (p) openPatientAppointmentModal(p, preferredDate);
          }}
          onOpenPatient={id => {
            openPatientRecord(id);
            setActiveTab('prontuario');
          }}
        />
      ) : (
        <>
          {patientsInlineFeedback && (
            <p className="text-[11px] text-slate-400 px-0.5 -mt-1">{patientsInlineFeedback}</p>
          )}

          {/* ── Filter chips ── */}
          <div className="flex flex-wrap gap-2 liquid-glass-segment p-1.5 rounded-[22px] mt-2">
            {filterChips.map(chip => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setPatientListFilter(chip.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  effectivePatientListFilter === chip.key
                    ? 'liquid-glass-segment-active text-primary'
                    : 'text-academy-muted hover:text-academy-text'
                }`}
              >
                {chip.label}
                {chip.count !== null && chip.count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
                      chip.key === 'pending'
                        ? 'bg-rose-100 text-rose-600'
                        : chip.key === 'scheduled'
                          ? 'bg-violet-100 text-academy-primary'
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {chip.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Card grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {patientCards.map(
              ({
                patient,
                meta,
                intel,
                nextAppointment,
                moment,
                conductLabel,
                pendingLabel,
              }) => {
                const isActed = patientActionsToday.has(patient.id);

                const intelPriority = intel?.priority || null;
                const intelStatus = intel?.status || null;
                const appointmentLabel = formatCaseAppointment(nextAppointment);
                const statusConfig: Record<
                  string,
                  { label: string; bg: string; text: string; dot: string }
                > = {
                  ABANDONO: {
                    label: 'Abandono',
                    bg: 'bg-rose-50',
                    text: 'text-rose-700',
                    dot: 'bg-rose-500',
                  },
                  ATENCAO: {
                    label: 'Atenção',
                    bg: 'bg-amber-50',
                    text: 'text-amber-700',
                    dot: 'bg-amber-400',
                  },
                  EM_TRATAMENTO: {
                    label: 'Em tratamento',
                    bg: 'bg-sky-50',
                    text: 'text-sky-700',
                    dot: 'bg-sky-500',
                  },
                  FINALIZADO: {
                    label: 'Concluído',
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    dot: 'bg-emerald-500',
                  },
                };
                const priorityConfig: Record<
                  string,
                  { label: string; bg: string; text: string; ring: string }
                > = {
                  HIGH: {
                    label: 'Urgente',
                    bg: 'bg-rose-500',
                    text: 'text-white',
                    ring: 'ring-rose-200',
                  },
                  MEDIUM: {
                    label: 'Atenção',
                    bg: 'bg-amber-400',
                    text: 'text-white',
                    ring: 'ring-amber-200',
                  },
                };
                const stCfg = intelStatus ? statusConfig[intelStatus] : null;
                const priCfg = intelPriority ? priorityConfig[intelPriority] : null;

                const borderColor = meta.isLead
                  ? 'border-l-violet-500 border-violet-100'
                  : intelPriority === 'HIGH'
                    ? 'border-l-rose-500 border-rose-100'
                    : intelStatus === 'ATENCAO'
                      ? 'border-l-amber-400 border-amber-50'
                      : intelStatus === 'ABANDONO'
                        ? 'border-l-rose-400 border-rose-50'
                        : intelStatus === 'EM_TRATAMENTO'
                          ? 'border-l-sky-400 border-slate-100'
                          : 'border-l-transparent border-slate-100 hover:border-slate-200';

                return (
                  <div
                    key={patient.id}
                    className={`flex items-stretch liquid-glass-card rounded-2xl border-l-[3px] hover:shadow-md transition-all ${borderColor}`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => openPatientRecord(patient.id)}
                        className="w-11 h-11 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm overflow-hidden border border-primary/20 shrink-0"
                      >
                        {patient.photo_url ? (
                          <img
                            src={patient.photo_url}
                            alt={patient.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          (patient.name || '?').charAt(0)
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => openPatientRecord(patient.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[15px] font-semibold text-academy-text truncate leading-tight">
                            {patient.name}
                          </p>
                          {meta.isLead && hasText('Novo') && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-academy-primary text-white ring-1 ring-violet-200 shrink-0">
                              Novo
                            </span>
                          )}
                          {!meta.isLead && priCfg && hasText(priCfg.label) && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${priCfg.bg} ${priCfg.text} ring-1 ${priCfg.ring} shrink-0`}
                            >
                              {priCfg.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {stCfg && hasText(stCfg.label) && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${stCfg.bg} ${stCfg.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`} />
                              {stCfg.label}
                            </span>
                          )}
                          {hasText(`${moment} · ${appointmentLabel}`) && (
                            <span className="text-[11px] text-academy-muted truncate">
                              {moment} · {appointmentLabel}
                            </span>
                          )}
                        </div>
                        {hasText(conductLabel) && (
                          <p className="text-[13px] text-academy-text/80 mt-1 truncate">{conductLabel}</p>
                        )}
                        {hasText(pendingLabel) && (
                          <p className="text-[12px] text-primary font-semibold mt-0.5 truncate">
                            {pendingLabel}
                          </p>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 px-3 border-l border-academy-border/40">
                      {meta.isLead ? (
                        <button
                          type="button"
                          title="Agendar 1º atendimento"
                          onClick={() => handleScheduleFromCard(patient)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-academy-primary text-white text-[11px] font-bold hover:opacity-90 transition-colors active:scale-95"
                        >
                          <CalendarPlus size={14} />
                          <span className="hidden sm:inline">1º atendimento</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            title={isActed ? 'Atendimento iniciado' : 'Agendar atendimento'}
                            onClick={() => handleScheduleFromCard(patient)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                              isActed
                                ? 'text-academy-primary-dark bg-[#F3E8FF]'
                                : 'text-slate-400 hover:text-primary hover:bg-primary/8'
                            }`}
                          >
                            {isActed ? <Check size={16} /> : <Calendar size={16} />}
                          </button>
                          <button
                            type="button"
                            title="Contatar via WhatsApp"
                            onClick={() => contactPatientOnWhatsApp(patient)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-academy-primary-dark hover:bg-[#F3E8FF] transition-colors"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button
                            type="button"
                            title="Link Portal do Paciente"
                            onClick={() => generatePatientPortalLink(patient)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <LinkIcon size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              },
            )}

            {patientCards.length === 0 && patients.length === 0 && !searchTerm && (
              <div className="col-span-full liquid-glass-card rounded-3xl p-8 sm:p-12 space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <UserPlus size={28} className="text-primary" />
                  </div>
                  <p className="text-lg font-bold text-academy-text">
                    Voce ainda nao cadastrou pacientes.
                  </p>
                  <p className="text-sm text-academy-muted max-w-sm mx-auto leading-relaxed">
                    Quando houver casos clinicos reais, eles aparecerao aqui com historico, evolucoes
                    e anexos.
                  </p>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setIsPatientModalOpen(true)}
                    className="bg-primary text-white px-7 py-3.5 rounded-[20px] font-bold shadow-[0_8px_24px_rgba(82,5,123,0.2)] hover:opacity-90 transition-all active:scale-95 inline-flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} />
                    Cadastrar paciente
                  </button>
                  <p className="text-[11px] text-academy-muted mt-3">
                    Use apenas dados reais do atendimento academico.
                  </p>
                </div>
              </div>
            )}

            {patientCards.length === 0 && (patients.length > 0 || !!searchTerm) && (
              <div className="col-span-full liquid-glass-card rounded-2xl p-10 text-center">
                <Users size={36} className="mx-auto text-academy-border mb-3" />
                <p className="text-academy-muted font-medium">Nenhum caso clinico neste filtro.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export const PacientesTab = React.memo(PacientesTabComponent);
