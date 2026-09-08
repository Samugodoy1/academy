import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  ChevronRight,
  Download,
  FileText,
  GripVertical,
  Heart,
  Lock,
  Loader2,
  Plus,
  Shield,
  Trash2,
  WalletCards,
  X,
  Zap,
} from '../icons';
import { motion } from 'motion/react';
import { CLINICAL_PROCEDURES, getProcedureDefinition, resolveProcedureValue } from '../constants/clinicalProcedures';
import { NovaEvolucao } from './NovaEvolucao';
import { DentitionIndicator, DentitionRevealHint } from './DentitionIndicator';
import { Odontogram } from './Odontogram';
import { OdontogramActiveSummary } from './OdontogramActiveSummary';
import { ScopeProcedureMenu } from './ScopeProcedureMenu';
import {
  type DentitionMode,
  type DentitionSource,
  inferDentitionFromAge,
  isToothVisibleInMode,
  resolveEffectiveDentitionMode,
  resolveSuggestedDentitionMode,
  shouldPromptDentitionUpdate,
  suggestModeToRevealTooth,
} from '../constants/dentition';
import {
  TREATMENT_SCOPES,
  countActiveTreatmentsByScope,
  formatTreatmentAnchor,
  isActiveTreatmentStatus,
  normalizeTreatmentItem,
  resolveQuadrant,
  type QuadrantId,
} from '../utils/treatmentPlanScope';
import { formatAppointmentDate, formatAppointmentTime, formatDate, getAppointmentTime } from '../utils/dateUtils';
import {
  anamnesisToForm,
  buildAnamnesisAlert,
  countFilledAnamnesisFields,
  formatAllergieLabel,
  formatMedicationLabel,
  hasMeaningfulAnamnesisValue,
  hasRecordedAllergie,
  hasRecordedMedication,
  type AnamnesisFormState,
} from '../utils/anamnesisUtils';
import { boxGuideProcedures, boxGuides, type BoxGuideProcedure } from '../data/boxGuides';
import {
  generateBoxContext,
  generateIntelligentSteps,
  generateSmartChipContent,
  generateSmartMaterials,
  generateBoxNowItems,
  generateBoxNowSteps
} from '../data/boxIntelligence';
import { exportClinicalCasePdf, type StudentProfileForPdf } from '../utils/exportClinicalCasePdf';

interface PatientClinicalProps {
  patient: any;
  appointments: any[];
  onUpdatePatient: (updatedPatient: any) => Promise<void>;
  onAddEvolution: (evolutionData: any) => Promise<void>;
  onRefreshPatient?: () => Promise<void>;
  apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  setAppActiveTab: (tab: any) => void;
  navigate: any;
  product?: string;
  pendingEvolutionAppointment?: any;
  studentProfile?: StudentProfileForPdf | null;
  canExportClinicalCasePdf?: boolean;
  onRequestPdfUpgrade?: () => void;
}

type InfoTab = 'anamneses' | 'dados' | 'imagens' | 'financeiro';

type ClinicalStatus = 'EM_TRATAMENTO' | 'REVISAO' | 'ABANDONADO' | 'NOVO';

const statusConfig: Record<ClinicalStatus, { label: string }> = {
  EM_TRATAMENTO: { label: 'Em tratamento' },
  REVISAO: { label: 'Em revisão' },
  ABANDONADO: { label: 'Sem retorno há 6 meses' },
  NOVO: { label: 'Primeiro caso' },
};

const getAge = (birthDate?: string) => {
  if (!birthDate) return null;
  const b = new Date(birthDate);
  if (Number.isNaN(b.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age -= 1;
  return age;
};

const formatTime = (dateValue?: string) => {
  const time = formatAppointmentTime(dateValue);
  return time === '--:--' ? '' : time;
};

const formatCurrencyInputBRL = (value: string) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '0,00';
  const cents = Number(digits);
  const amount = cents / 100;
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const parseCurrencyInputBRL = (value: string) => {
  const normalized = String(value || '').replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const resolveClinicalStatus = (patient: any, appointments: any[]): ClinicalStatus => {
  const now = new Date();

  const patientAppointments = (appointments || [])
    .filter((a: any) => a.patient_id === patient.id)
    .filter((a: any) => !['CANCELLED', 'NO_SHOW'].includes(String(a.status || '').toUpperCase()));

  const hasAnyHistory =
    (patient?.evolution || []).length > 0 ||
    patientAppointments.some((a: any) => ['FINISHED', 'IN_PROGRESS'].includes(String(a.status || '').toUpperCase()));

  if (!hasAnyHistory) return 'NOVO';

  const hasFutureVisit = patientAppointments.some((a: any) => getAppointmentTime(a.start_time) >= now.getTime());
  const hasOngoingTreatment = (patient?.treatmentPlan || []).some((item: any) =>
    ['APROVADO', 'PENDENTE', 'PLANEJADO'].includes(String(item.status || '').toUpperCase())
  );

  if (hasFutureVisit || hasOngoingTreatment) return 'EM_TRATAMENTO';

  const latestEvolution = (patient?.evolution || [])[0]?.date;
  const latestFinishedAppointment = patientAppointments
    .filter((a: any) => String(a.status || '').toUpperCase() === 'FINISHED')
    .sort((a: any, b: any) => getAppointmentTime(b.start_time) - getAppointmentTime(a.start_time))[0]?.start_time;

  const latestActivityRaw = latestEvolution || latestFinishedAppointment;
  if (!latestActivityRaw) return 'REVISAO';

  const latestActivity = new Date(latestActivityRaw);
  const daysSinceLast = Math.floor((now.getTime() - latestActivity.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceLast > 180) return 'ABANDONADO';
  return 'REVISAO';
};

const resolveProcedureCategory = (title: string) => {
  const lower = (title || '').toLowerCase();
  if (/canal|endo|obtur|pulp|odontometr|instrument|lima/.test(lower))
    return { label: 'Endodontia', dotCls: 'bg-indigo-500', tagCls: 'bg-indigo-50 text-indigo-700', borderCls: 'border-l-indigo-400' };
  if (/restaura|resina|c[aá]ri|classe|adesiv|restor/.test(lower))
    return { label: 'Restauração', dotCls: 'bg-amber-500', tagCls: 'bg-amber-50 text-amber-700', borderCls: 'border-l-amber-400' };
  if (/extra|exo|cirurg|sutur|anestes|exodont/.test(lower))
    return { label: 'Cirurgia', dotCls: 'bg-rose-500', tagCls: 'bg-rose-50 text-rose-700', borderCls: 'border-l-rose-400' };
  if (/limpeza|profilax|raspagem|t[aá]rtaro|calcul|poliment/.test(lower))
    return { label: 'Profilaxia', dotCls: 'bg-emerald-500', tagCls: 'bg-emerald-50 text-emerald-700', borderCls: 'border-l-emerald-400' };
  if (/avalia|consulta|retorno|anamnese|revisão|revisao/.test(lower))
    return { label: 'Consulta', dotCls: 'bg-sky-500', tagCls: 'bg-sky-50 text-sky-700', borderCls: 'border-l-sky-400' };
  return { label: 'Evolução', dotCls: 'bg-slate-400', tagCls: 'bg-slate-100 text-slate-600', borderCls: 'border-l-slate-300' };
};

const TIMELINE_STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  CONCLUIDO:    { dot: 'chart-status-dot-done', label: 'Concluído' },
  EM_ANDAMENTO: { dot: 'chart-status-dot-open', label: 'Em andamento' },
  OBSERVACAO:   { dot: 'chart-status-dot-note', label: 'Observação' },
};

const resolveTimelineMonthGroup = (dateStr: string) => {
  if (!dateStr) return '';
  const datePart = dateStr.split('T')[0];
  const [year, month] = datePart.split('-');
  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const now = new Date();
  const monthName = months[parseInt(month, 10) - 1] || month;
  return String(now.getFullYear()) === year ? monthName : `${monthName} ${year}`;
};

type ClinicalEventType = 'TREATMENT_START' | 'PLAN_CHANGE' | 'PROCEDURE_COMPLETION' | 'OBSERVATION' | 'DIAGNOSIS';

const resolveClinicalEventType = (entry: any): ClinicalEventType => {
  const explicitType = String(entry?.event_type || '').toUpperCase();
  if (explicitType === 'TREATMENT_START') return 'TREATMENT_START';
  if (explicitType === 'PLAN_CHANGE') return 'PLAN_CHANGE';
  if (explicitType === 'PROCEDURE_COMPLETION') return 'PROCEDURE_COMPLETION';
  if (explicitType === 'OBSERVATION') return 'OBSERVATION';
  if (explicitType === 'DIAGNOSIS') return 'DIAGNOSIS';

  const procedure = String(entry?.procedure || entry?.procedure_performed || '').toLowerCase();
  const notes = String(entry?.notes || '').toLowerCase();

  if (procedure.includes('diagnostico') || notes.includes('diagnóstico registrado') || notes.includes('diagnostico registrado')) {
    return 'DIAGNOSIS';
  }
  if (procedure.includes('conclus') || notes.includes('procedimento conclu')) {
    return 'PROCEDURE_COMPLETION';
  }
  if (procedure.includes('convers') || notes.includes('convertido') || notes.includes('ajustado')) {
    return 'PLAN_CHANGE';
  }
  if (procedure.includes('inicio') || procedure.includes('início')) {
    return 'TREATMENT_START';
  }

  return 'OBSERVATION';
};

const inferBoxProcedure = (value?: string): BoxGuideProcedure | null => {
  const text = String(value || '').toLowerCase();
  if (/canal|endo|obtur|pulp|odontometr|instrument|lima/.test(text)) return 'Endodontia';
  if (/extra|exo|cirurg|sutur|anestes|forceps|f[oó]rceps/.test(text)) return 'Cirurgia';
  if (/restaura|resina|dent[ií]st|classe|adesiv|c[aá]rie|poliment/.test(text)) return 'Dentistica';
  if (/perio|raspag|profilax|sondag|cureta|t[aá]rtaro|calculo/.test(text)) return 'Periodontia';
  if (/prot|coroa|molde|moldag|ciment|prova|ajuste|placa/.test(text)) return 'Protese';
  if (/urg|dor|abscesso|f[ií]stula|edema|diagn[oó]st/.test(text)) return 'Urgencia';
  if (/consult|avalia|primeira|triag|exame|anamnese|retorno|acolh/.test(text)) return 'Consulta';
  return null;
};

const getAnamnesisAlert = (patient: any) => buildAnamnesisAlert(patient?.anamnesis);

export const PatientClinical: React.FC<PatientClinicalProps> = ({
  patient,
  appointments,
  onUpdatePatient,
  onAddEvolution,
  onRefreshPatient,
  apiFetch,
  setAppActiveTab,
  navigate: appNavigate,
  product,
  pendingEvolutionAppointment,
  studentProfile,
  canExportClinicalCasePdf = false,
  onRequestPdfUpgrade,
}) => {
  const [isAddingEvolution, setIsAddingEvolution] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [evolutionAppointmentContext, setEvolutionAppointmentContext] = useState<any>(null);
  const [infoTab, setInfoTab] = useState<InfoTab>('anamneses');

  // Auto-open evolution when opened from a "Para fechar" pending
  React.useEffect(() => {
    if (pendingEvolutionAppointment && !isAddingEvolution) {
      setEvolutionAppointmentContext(pendingEvolutionAppointment);
      setIsAddingEvolution(true);
    }
  }, [pendingEvolutionAppointment]);
  const isAcademyProduct = product === 'academy';
  const [showAllEvolutions, setShowAllEvolutions] = useState(false);
  const [highlightedTreatmentId, setHighlightedTreatmentId] = useState<string | null>(null);
  const [highlightedTimelineId, setHighlightedTimelineId] = useState<string | null>(null);
  const [highlightedToothNumber, setHighlightedToothNumber] = useState<number | null>(null);
  const [highlightedQuadrant, setHighlightedQuadrant] = useState<QuadrantId | null>(null);
  const [dismissedDentitionSuggestion, setDismissedDentitionSuggestion] = useState<string | null>(null);
  const [pendingRevealTooth, setPendingRevealTooth] = useState<{
    tooth: number;
    mode: DentitionMode;
  } | null>(null);
  const [scopeProcedureWarning, setScopeProcedureWarning] = useState<string | null>(null);
  const [selectedTreatmentAction, setSelectedTreatmentAction] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [optimisticOdontogram, setOptimisticOdontogram] = useState<Record<number, any>>({});
  const [optimisticTreatments, setOptimisticTreatments] = useState<any[]>([]);
  const [optimisticEvolutions, setOptimisticEvolutions] = useState<any[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isBoxModeOpen, setIsBoxModeOpen] = useState(false);
  const [selectedBoxProcedure, setSelectedBoxProcedure] = useState<BoxGuideProcedure>('Consulta');
  const [selectedBoxDoubt, setSelectedBoxDoubt] = useState<string | null>(null);
  const [boxStep, setBoxStep] = useState(0);
  const [boxTrayOpen, setBoxTrayOpen] = useState(false);
  const [boxTrayChecked, setBoxTrayChecked] = useState<Set<number>>(new Set());
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderItems, setReorderItems] = useState<any[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false);
  const [isUploadingClinicalImage, setIsUploadingClinicalImage] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const selectedActionRef = useRef<HTMLDivElement | null>(null);
  const paymentModalRef = useRef<HTMLDivElement | null>(null);
  const reorderPointerIdRef = useRef<number | null>(null);
  const reorderDragIdxRef = useRef<number | null>(null);
  const reorderHandleRef = useRef<HTMLElement | null>(null);

  // Auto-dismiss upload feedback
  useEffect(() => {
    if (!uploadFeedback) return;
    const timer = setTimeout(() => setUploadFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [uploadFeedback]);

  // Focus management for selected treatment action modal
  useEffect(() => {
    if (!selectedTreatmentAction) return;
    const el = selectedActionRef.current;
    const first = el?.querySelector<HTMLElement>('button, [tabindex]:not([tabindex="-1"]), input, textarea, select');
    first?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTreatmentAction(null);
      if (e.key === 'Tab') {
        const focusable = el?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) return;
        const nodes = Array.from(focusable) as HTMLElement[];
        const idx = nodes.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey) {
          if (idx === 0) { nodes[nodes.length - 1].focus(); e.preventDefault(); }
        } else {
          if (idx === nodes.length - 1) { nodes[0].focus(); e.preventDefault(); }
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedTreatmentAction]);

  // Focus management for payment modal
  useEffect(() => {
    if (!showPaymentModal) return;
    const el = paymentModalRef.current;
    const first = el?.querySelector<HTMLElement>('button, [tabindex]:not([tabindex="-1"]), input, textarea, select');
    first?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPaymentModal(false);
      if (e.key === 'Tab') {
        const focusable = el?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) return;
        const nodes = Array.from(focusable) as HTMLElement[];
        const idx = nodes.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey) {
          if (idx === 0) { nodes[nodes.length - 1].focus(); e.preventDefault(); }
        } else {
          if (idx === nodes.length - 1) { nodes[0].focus(); e.preventDefault(); }
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showPaymentModal]);
  const [isEditingAnamnese, setIsEditingAnamnese] = useState(false);
  const [anamneseForm, setAnamneseForm] = useState<AnamnesisFormState>(anamnesisToForm());
  const [isSavingAnamnese, setIsSavingAnamnese] = useState(false);
  const [showAnamneseExtra, setShowAnamneseExtra] = useState(false);
  const [showDadosExtra, setShowDadosExtra] = useState(false);
  const [patientFinancial, setPatientFinancial] = useState<{ transactions: any[]; paymentPlans: any[]; installments: any[] } | null>(null);
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(false);
  const infoPanelRef = useRef<HTMLElement | null>(null);
  const odontogramRef = useRef<HTMLElement | null>(null);
  const treatmentSectionRef = useRef<HTMLElement | null>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const clinicalImageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isAcademyProduct && infoTab === 'financeiro') {
      setInfoTab('anamneses');
    }
  }, [isAcademyProduct, infoTab]);

  useEffect(() => {
    if (isAcademyProduct || infoTab !== 'financeiro' || !patient?.id) return;
    let cancelled = false;
    setIsLoadingFinancial(true);
    apiFetch(`/api/patients/${patient.id}/financial`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPatientFinancial(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingFinancial(false);
      });
    return () => { cancelled = true; };
  }, [isAcademyProduct, infoTab, patient?.id]);

  const age = getAge(patient?.birth_date);
  const hasBirthDate = Boolean(patient?.birth_date);
  const effectiveDentitionMode = useMemo(
    () => resolveEffectiveDentitionMode(patient, age),
    [patient?.dentition_mode, patient?.birth_date, age]
  );
  const suggestedDentitionMode = useMemo(
    () => resolveSuggestedDentitionMode(age),
    [age]
  );
  const dentitionSource: DentitionSource | null =
    patient?.dentition_mode_source === 'manual' ? 'manual' : patient?.dentition_mode ? 'auto' : null;
  const dentitionSuggestionToken = `${patient?.id}:${suggestedDentitionMode}:${effectiveDentitionMode}`;
  const showDentitionUpdatePrompt =
    shouldPromptDentitionUpdate(effectiveDentitionMode, suggestedDentitionMode, dentitionSource) &&
    dismissedDentitionSuggestion !== dentitionSuggestionToken;

  useEffect(() => {
    setDismissedDentitionSuggestion(null);
    setPendingRevealTooth(null);
  }, [patient?.id]);

  useEffect(() => {
    if (!patient?.id || !patient?.birth_date || patient?.dentition_mode) return;
    const mode = inferDentitionFromAge(getAge(patient.birth_date));
    void onUpdatePatient({
      ...patient,
      dentition_mode: mode,
      dentition_mode_source: 'auto',
    });
  }, [patient?.id, patient?.birth_date, patient?.dentition_mode]);
  const clinicalStatus = resolveClinicalStatus(patient, appointments);
  const clinicalBadge = statusConfig[clinicalStatus];
  const patientAppointments = useMemo(
    () =>
      (appointments || [])
        .filter((appointment: any) => appointment.patient_id === patient?.id)
        .filter((appointment: any) => !['CANCELLED', 'NO_SHOW'].includes(String(appointment.status || '').toUpperCase())),
    [appointments, patient?.id]
  );

  const mergedTreatmentPlan = useMemo(() => {
    const serverItems = patient?.treatmentPlan || [];
    if (optimisticTreatments.length === 0) return serverItems;

    const knownIds = new Set(serverItems.map((item: any) => item.id));
    const optimisticMap = new Map(optimisticTreatments.map((item: any) => [item.id, item]));
    const mergedKnown = serverItems.map((item: any) => optimisticMap.get(item.id) || item);
    const optimisticOnly = optimisticTreatments.filter((item: any) => !knownIds.has(item.id));
    return [...optimisticOnly, ...mergedKnown];
  }, [patient?.treatmentPlan, optimisticTreatments]);

  const treatmentInProgress = useMemo(
    () =>
      mergedTreatmentPlan.filter((item: any) =>
        ['APROVADO', 'PENDENTE', 'PLANEJADO'].includes(String(item.status || '').toUpperCase())
      ),
    [mergedTreatmentPlan]
  );

  const moveReorderItem = (fromIndex: number, toIndex: number) => {
    setReorderItems((current) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= current.length ||
        toIndex >= current.length
      ) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const moveReorderItemByStep = (index: number, step: -1 | 1) => {
    const targetIndex = index + step;
    if (targetIndex < 0 || targetIndex >= reorderItems.length) return;
    moveReorderItem(index, targetIndex);
    setDragIdx(null);
    setDragOverIdx(targetIndex);
  };

  const endPointerReorder = () => {
    if (reorderHandleRef.current && reorderPointerIdRef.current !== null) {
      try {
        reorderHandleRef.current.releasePointerCapture(reorderPointerIdRef.current);
      } catch {
        // The browser can release capture itself after pointer cancellation.
      }
    }

    reorderPointerIdRef.current = null;
    reorderDragIdxRef.current = null;
    reorderHandleRef.current = null;
    setDragIdx(null);
    setDragOverIdx(null);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (!isReorderMode) {
      endPointerReorder();
    }
  }, [isReorderMode]);

  useEffect(() => {
    return () => endPointerReorder();
  }, []);

  const startPointerReorder = (event: React.PointerEvent<HTMLButtonElement>, index: number) => {
    if (!isReorderMode || isSavingOrder || event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    reorderPointerIdRef.current = event.pointerId;
    reorderDragIdxRef.current = index;
    reorderHandleRef.current = event.currentTarget;
    setDragIdx(index);
    setDragOverIdx(index);
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    if (!isReorderMode) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (reorderPointerIdRef.current !== event.pointerId || reorderDragIdxRef.current === null) return;

      event.preventDefault();
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const row = target?.closest('[data-reorder-index]');
      if (!row) return;

      const overIndex = Number((row as HTMLElement).dataset.reorderIndex);
      const fromIndex = reorderDragIdxRef.current;
      if (!Number.isFinite(overIndex) || overIndex === fromIndex) return;

      moveReorderItem(fromIndex, overIndex);
      reorderDragIdxRef.current = overIndex;
      setDragIdx(overIndex);
      setDragOverIdx(overIndex);
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (reorderPointerIdRef.current !== event.pointerId) return;
      endPointerReorder();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, [isReorderMode]);

  const timelineItems = useMemo(() => {
    const mergedEvolutions = [
      ...optimisticEvolutions,
      ...(patient?.evolution || []).filter(
        (e: any) => !optimisticEvolutions.some((opt) => opt.id === e.id)
      ),
    ];

    const patientAppts = appointments.filter((a: any) => a.patient_id === patient?.id);

    const evolutionEvents = mergedEvolutions
      .map((e: any) => {
        const eventType = resolveClinicalEventType(e);
        const hasAppointmentId = e.appointment_id != null;
        const recordKind: 'closed' | 'manual' | 'legacy' = hasAppointmentId
          ? 'closed'
          : (e.created_at && new Date(e.created_at) > new Date('2026-05-10'))
            ? 'manual'
            : 'legacy';

        // Enrich with appointment data when available
        const linkedAppointment = hasAppointmentId
          ? patientAppts.find((a: any) => a.id === e.appointment_id)
          : null;
        const appointmentProcedure = linkedAppointment?.notes || linkedAppointment?.procedure || null;
        const appointmentDate = linkedAppointment?.start_time
          ? (() => {
            const date = formatAppointmentDate(linkedAppointment.start_time, { day: '2-digit', month: '2-digit' });
            const time = formatAppointmentTime(linkedAppointment.start_time);
            return date && time !== '--:--' ? `${date} às ${time}` : null;
          })()
          : null;
        const registeredDate = e.created_at
          ? (() => {
            try {
              const d = new Date(e.created_at);
              if (isNaN(d.getTime())) return null;
              const day = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const hours = String(d.getHours()).padStart(2, '0');
              const minutes = String(d.getMinutes()).padStart(2, '0');
              return `${day}/${month} às ${hours}:${minutes}`;
            } catch { return null; }
          })()
          : null;

        let kindLabel: string;
        if (recordKind === 'closed') {
          kindLabel = appointmentProcedure
            ? `Atendimento fechado — ${appointmentProcedure}`
            : 'Atendimento fechado';
        } else if (recordKind === 'manual') {
          kindLabel = 'Registro manual';
        } else {
          kindLabel = 'Registro antigo';
        }

        return {
          id: `evo-${e.id}`,
          date: e.date,
          title: e.procedure || (appointmentProcedure ? `${appointmentProcedure}` : (recordKind === 'closed' ? 'Atendimento fechado' : kindLabel)),
          notes: e.notes || '',
          status:
            eventType === 'PROCEDURE_COMPLETION'
              ? 'CONCLUIDO'
              : eventType === 'OBSERVATION'
                ? 'OBSERVACAO'
                : 'EM_ANDAMENTO',
          type: eventType,
          recordKind,
          kindLabel,
          appointmentId: e.appointment_id,
          appointmentDate,
          registeredDate,
        };
      })
      .filter((event: any) => event.type !== 'DIAGNOSIS');

    return evolutionEvents.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [patient?.evolution, patient?.id, optimisticEvolutions, appointments]);

  const mergedOdontogram = useMemo(
    () => ({
      ...(patient?.odontogram || {}),
      ...optimisticOdontogram,
    }),
    [patient?.odontogram, optimisticOdontogram]
  );

  const persistTreatmentValue = async (treatmentId: string, rawValue: string) => {
    if (isAcademyProduct) return;
    const normalized = String(rawValue || '').trim();
    if (!normalized) return;

    const parsed = parseCurrencyInputBRL(normalized);
    if (!Number.isFinite(parsed) || parsed < 0) return;

    const nextPlan = (mergedTreatmentPlan || []).map((item: any) =>
      item.id === treatmentId
        ? { ...item, value: parsed, updated_at: new Date().toISOString() }
        : item
    );

    setOptimisticTreatments((prev) => {
      const ids = new Set(nextPlan.map((item: any) => item.id));
      const prevOnly = prev.filter((item: any) => !ids.has(item.id));
      return [...prevOnly, ...nextPlan];
    });

    try {
      await onUpdatePatient({
        ...patient,
        treatmentPlan: nextPlan,
      });
    } catch (error) {
      console.error('Error updating treatment value:', error);
    }
  };

  const togglePrepaymentAll = async () => {
    if (isAcademyProduct) return;
    const activeItems = mergedTreatmentPlan.filter((item: any) =>
      ['APROVADO', 'PENDENTE', 'PLANEJADO'].includes(String(item.status || '').toUpperCase())
    );
    if (activeItems.length === 0) return;
    const allActive = activeItems.every((item: any) => item.requires_prepayment);
    const nextValue = !allActive;
    const nowIso = new Date().toISOString();
    const nextPlan = mergedTreatmentPlan.map((item: any) => {
      const isActive = ['APROVADO', 'PENDENTE', 'PLANEJADO'].includes(String(item.status || '').toUpperCase());
      if (!isActive) return item;
      if (item.prepayment_confirmed) return item; // don't toggle already paid
      return { ...item, requires_prepayment: nextValue, prepayment_confirmed: false, updated_at: nowIso };
    });
    setOptimisticTreatments((prev) => {
      const ids = new Set(nextPlan.map((i: any) => i.id));
      return [...prev.filter((i: any) => !ids.has(i.id)), ...nextPlan];
    });
    try {
      await onUpdatePatient({ ...patient, treatmentPlan: nextPlan });
    } catch (error) {
      console.error('Error toggling prepayment:', error);
    }
  };

  const confirmPrepayment = async (treatment: any) => {
    if (isAcademyProduct) {
      setSelectedTreatmentAction(null);
      return;
    }
    const nowIso = new Date().toISOString();
    const nextPlan = (mergedTreatmentPlan || []).map((item: any) =>
      item.id === treatment.id
        ? { ...item, prepayment_confirmed: true, prepayment_confirmed_at: nowIso, updated_at: nowIso }
        : item
    );
    setOptimisticTreatments((prev) => {
      const ids = new Set(nextPlan.map((i: any) => i.id));
      return [...prev.filter((i: any) => !ids.has(i.id)), ...nextPlan];
    });
    try {
      await onUpdatePatient({ ...patient, treatmentPlan: nextPlan });

      // Registrar transação financeira automaticamente
      const treatmentValue = Number(treatment.value) || 0;
      if (treatmentValue > 0) {
        const procedureLabel = treatment.procedure || 'Procedimento';
        const toothLabel = ` — ${formatTreatmentAnchor(treatment)}`;
        apiFetch('/api/finance', {
          method: 'POST',
          body: JSON.stringify({
            type: 'INCOME',
            description: `Pagamento antecipado: ${procedureLabel}${toothLabel}`,
            category: 'Procedimentos',
            amount: treatmentValue,
            payment_method: 'Indefinido',
            date: nowIso.split('T')[0],
            status: 'PAID',
            patient_id: patient.id,
            procedure: procedureLabel,
            notes: 'Pagamento recebido antes da execução do procedimento.',
          }),
        }).catch((err) => {
          console.error('Error creating prepayment transaction:', err);
        });
      }
    } catch (error) {
      console.error('Error confirming prepayment:', error);
    }
    setSelectedTreatmentAction(null);
  };

  const confirmPrepaymentAll = async (paymentMethod: string = 'Indefinido') => {
    if (isAcademyProduct) return;
    const nowIso = new Date().toISOString();
    const unpaid = mergedTreatmentPlan.filter(
      (item: any) =>
        ['APROVADO', 'PENDENTE', 'PLANEJADO'].includes(String(item.status || '').toUpperCase()) &&
        !(item.requires_prepayment && item.prepayment_confirmed)
    );
    if (unpaid.length === 0) return;

    const totalAmount = unpaid.reduce((sum: number, item: any) => sum + (Number(item.value) || 0), 0);

    const nextPlan = mergedTreatmentPlan.map((item: any) => {
      const isTarget = unpaid.some((u: any) => u.id === item.id);
      return isTarget
        ? { ...item, requires_prepayment: true, prepayment_confirmed: true, prepayment_confirmed_at: nowIso, updated_at: nowIso }
        : item;
    });

    setOptimisticTreatments((prev) => {
      const ids = new Set(nextPlan.map((i: any) => i.id));
      return [...prev.filter((i: any) => !ids.has(i.id)), ...nextPlan];
    });

    try {
      await onUpdatePatient({ ...patient, treatmentPlan: nextPlan });

      if (totalAmount > 0) {
        const procedures = unpaid.map((i: any) => i.procedure || 'Procedimento').join(', ');
        apiFetch('/api/finance', {
          method: 'POST',
          body: JSON.stringify({
            type: 'INCOME',
            description: `Pagamento integral do orçamento`,
            category: 'Procedimentos',
            amount: totalAmount,
            payment_method: paymentMethod,
            date: nowIso.split('T')[0],
            status: 'PAID',
            patient_id: patient.id,
            procedure: procedures,
            notes: `Pagamento integral: ${unpaid.length} procedimento(s).`,
          }),
        }).then(() => {
          if (infoTab === 'financeiro') {
            apiFetch(`/api/patients/${patient.id}/financial`)
              .then((r) => r.json())
              .then((data) => setPatientFinancial(data))
              .catch(() => {});
          }
        }).catch((err) => {
          console.error('Error creating full budget payment transaction:', err);
        });
      }
    } catch (error) {
      console.error('Error confirming full budget prepayment:', error);
    }
  };

  const handleOdontogramStatusChange = (toothNumber: number, toothData: any) => {
    setOptimisticOdontogram((prev) => ({ ...prev, [toothNumber]: toothData }));

    const updatedOdontogram = {
      ...(patient?.odontogram || {}),
      [toothNumber]: toothData,
    };

    apiFetch(`/api/patients/${patient.id}/odontogram`, {
      method: 'POST',
      body: JSON.stringify({ data: updatedOdontogram }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || 'Falha ao salvar odontograma');
        }
      })
      .catch((error) => {
        console.error('Error updating odontogram tooth status:', error);
      });
  };

  const persistEvolution = async (payload: { notes: string; procedure_performed: string }) => {
    const res = await apiFetch(`/api/patients/${patient.id}/evolution`, {
      method: 'POST',
      body: JSON.stringify({
        notes: payload.notes,
        procedure_performed: payload.procedure_performed,
        materials: '',
        observations: '',
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Falha ao salvar evolução clínica');
    }
  };

  const handleScopeProcedureSelect = async ({
    procedureKey,
    procedure,
    scope,
    quadrant,
  }: {
    procedureKey: string;
    procedure: string;
    scope: 'patient' | 'quadrant';
    quadrant?: QuadrantId;
  }) => {
    const ts = Date.now();
    const treatmentId = `tp-${ts}-${Math.random().toString(36).slice(2, 9)}`;
    const evolutionId = `evo-scope-${ts}-${Math.random().toString(36).slice(2, 8)}`;
    const nowIso = new Date().toISOString();
    const def = CLINICAL_PROCEDURES[procedureKey];

    if (scope === 'patient') {
      const duplicateCount = treatmentInProgress.filter((item: any) => {
        const normalized = normalizeTreatmentItem(item);
        return (
          normalized.scope === TREATMENT_SCOPES.PATIENT &&
          (normalized.procedure_key === procedureKey ||
            String(normalized.procedure || '').toLowerCase() === procedure.toLowerCase())
        );
      }).length;
      if (duplicateCount > 0) {
        setScopeProcedureWarning(
          `Já existe outro ${procedure} ativo. Será adicionado um novo registro.`
        );
        window.setTimeout(() => setScopeProcedureWarning(null), 4500);
      }
    }

    if (scope === 'quadrant' && quadrant) {
      const existingQuadrant = treatmentInProgress.find((item: any) => {
        const normalized = normalizeTreatmentItem(item);
        return (
          normalized.scope === TREATMENT_SCOPES.QUADRANT &&
          resolveQuadrant(normalized) === quadrant &&
          (normalized.procedure_key === procedureKey ||
            String(normalized.procedure || '').toLowerCase() === procedure.toLowerCase())
        );
      });
      if (existingQuadrant?.id) {
        flashQuadrantHighlight(quadrant);
        flashTreatmentHighlight(String(existingQuadrant.id));
        return;
      }
    }

    const anchorLabel =
      scope === 'quadrant' && quadrant ? `quadrante ${quadrant}` : 'paciente';
    const newTreatment: any = {
      id: treatmentId,
      procedure,
      procedure_key: procedureKey,
      scope,
      value: def?.defaultValue ?? resolveProcedureValue(procedure, procedureKey),
      status: 'PLANEJADO',
      requires_prepayment: !isAcademyProduct,
      created_at: nowIso,
      ...(scope === 'quadrant' && quadrant
        ? { quadrant, region: { quadrant } }
        : {}),
    };

    const evolutionNotes = `Início de tratamento (${anchorLabel}): ${procedure}.`;
    const evolutionProcedure = `Início - ${procedure}`;
    const optimisticEvolution = {
      id: evolutionId,
      date: nowIso,
      notes: evolutionNotes,
      procedure_performed: 'Início de tratamento',
      procedure: evolutionProcedure,
      event_type: 'TREATMENT_START',
    };

    setOptimisticTreatments((prev) => [newTreatment, ...prev]);
    setOptimisticEvolutions((prev) => [optimisticEvolution, ...prev]);

    try {
      await onUpdatePatient({
        ...patient,
        treatmentPlan: [...(patient.treatmentPlan || []), newTreatment],
        evolution: [optimisticEvolution, ...(patient.evolution || [])],
      });
      if (scope === 'quadrant' && quadrant) {
        flashQuadrantHighlight(quadrant);
      } else {
        flashTreatmentHighlight(treatmentId);
      }
    } catch (error) {
      console.error('Error creating scope treatment:', error);
    }

    persistEvolution({
      notes: evolutionNotes,
      procedure_performed: 'Início de tratamento',
    }).catch((error) => {
      console.error('Error persisting scope evolution:', error);
    });
  };

  const handleOdontoProcedureSelect = async ({
    toothNumber,
    procedure,
    category,
    mode,
  }: {
    toothNumber: number;
    procedure: string;
    category: 'diagnosis' | 'procedure';
    mode: 'initial' | 'continuity';
    status: any;
  }) => {
    const ts = Date.now();
    const treatmentId = `tp-${ts}-${Math.random().toString(36).slice(2, 9)}`;
    const evolutionId = `evo-odonto-${ts}-${Math.random().toString(36).slice(2, 8)}`;
    const nowIso = new Date().toISOString();

    const values: Record<string, number> = isAcademyProduct ? {} : {
      Restauração: 150,
      Endodontia: 450,
      Coroa: 1200,
      Implante: 2500,
      Extração: 200,
      Carie: 120,
      Restauracao: 150,
      Canal: 450,
      Extracao: 200,
    };

    const procedureKey = getProcedureDefinition(procedure)?.key;

    const existingTreatment = (patient.treatmentPlan || []).find((item: any) => {
      const normalized = normalizeTreatmentItem(item);
      return (
        normalized.scope === TREATMENT_SCOPES.TOOTH &&
        Number(normalized.tooth_number) === toothNumber &&
        isActiveTreatmentStatus(normalized.status)
      );
    });

    const isCompletionAction =
      mode === 'continuity' &&
      !!existingTreatment &&
      ['root_canal_done', 'extraction_done'].includes(String(status || '').toLowerCase());

    // Block completion via odontogram if prepayment is required but not confirmed
    if (!isAcademyProduct && isCompletionAction && existingTreatment?.requires_prepayment && !existingTreatment?.prepayment_confirmed) {
      setSelectedTreatmentAction(existingTreatment);
      return;
    }

    const nextTreatmentPlan = category === 'procedure'
      ? mode === 'continuity' && existingTreatment
        ? (patient.treatmentPlan || []).map((item: any) =>
            item.id === existingTreatment.id
              ? isCompletionAction
                ? { ...item, status: 'REALIZADO', completed_at: nowIso, updated_at: nowIso }
                : { ...item, status: 'APROVADO', updated_at: nowIso }
              : item
          )
        : [
            ...(patient.treatmentPlan || []),
            {
              id: treatmentId,
              scope: TREATMENT_SCOPES.TOOTH,
              tooth_number: toothNumber,
              procedure,
              procedure_key: procedureKey,
              value: isAcademyProduct ? 0 : resolveProcedureValue(procedure, procedureKey),
              status: 'PLANEJADO',
              requires_prepayment: !isAcademyProduct,
              created_at: nowIso,
            },
          ]
      : (patient.treatmentPlan || []);

    const nextTreatmentId = category === 'procedure'
      ? (mode === 'continuity' && existingTreatment ? existingTreatment.id : treatmentId)
      : null;

    const optimisticTreatment = category === 'procedure'
      ? mode === 'continuity' && existingTreatment
        ? isCompletionAction
          ? { ...existingTreatment, status: 'REALIZADO', completed_at: nowIso, updated_at: nowIso }
          : { ...existingTreatment, status: 'APROVADO', updated_at: nowIso }
        : {
            id: treatmentId,
            scope: TREATMENT_SCOPES.TOOTH,
            tooth_number: toothNumber,
            procedure,
            procedure_key: procedureKey,
            value: isAcademyProduct ? 0 : resolveProcedureValue(procedure, procedureKey),
            status: 'PLANEJADO',
            requires_prepayment: !isAcademyProduct,
            created_at: nowIso,
          }
      : null;

    const shouldAppendEvolution = category === 'procedure';
    const evolutionType = isCompletionAction
      ? 'PROCEDURE_COMPLETION'
      : mode === 'continuity' && existingTreatment
        ? 'PLAN_CHANGE'
        : 'TREATMENT_START';
    const evolutionNotes = isCompletionAction
      ? `Procedimento concluído no dente ${toothNumber}: ${existingTreatment?.procedure || procedure}.`
      : mode === 'continuity' && existingTreatment
        ? `Plano ajustado no dente ${toothNumber}: ${existingTreatment.procedure} convertido para ${procedure}.`
        : `Início de tratamento no dente ${toothNumber}: ${procedure}.`;
    const evolutionProcedure = isCompletionAction
      ? `Conclusão - ${existingTreatment?.procedure || procedure}`
      : mode === 'continuity' && existingTreatment
        ? `Conversão - ${existingTreatment.procedure} -> ${procedure}`
        : `Início - ${procedure}`;
    const evolutionProcedurePerformed = isCompletionAction
      ? `Conclusão - ${existingTreatment?.procedure || procedure}`
      : mode === 'continuity' && existingTreatment
        ? `Conversão de plano`
        : `Início de tratamento`;

    const optimisticEvolution = shouldAppendEvolution
      ? {
          id: evolutionId,
          date: nowIso,
          notes: evolutionNotes,
          procedure_performed: evolutionProcedurePerformed,
          procedure: evolutionProcedure,
          event_type: evolutionType,
        }
      : null;

    if (optimisticTreatment) {
      setOptimisticTreatments((prev) => {
        if (mode === 'continuity' && existingTreatment) {
          const withoutCurrent = prev.filter((item: any) => item.id !== existingTreatment.id);
          return [optimisticTreatment, ...withoutCurrent];
        }
        return [optimisticTreatment, ...prev];
      });
    }
    if (optimisticEvolution) {
      setOptimisticEvolutions((prev) => [optimisticEvolution, ...prev]);
    }

    const updatedPatient = {
      ...patient,
      treatmentPlan: nextTreatmentPlan,
      evolution: shouldAppendEvolution
        ? [
            {
              id: evolutionId,
              date: nowIso,
              notes: evolutionNotes,
              procedure_performed: evolutionProcedurePerformed,
              procedure: evolutionProcedure,
              event_type: evolutionType,
            },
            ...(patient.evolution || []),
          ]
        : (patient.evolution || []),
    };

    try {
      await onUpdatePatient(updatedPatient);

      // Criar transação financeira automaticamente ao concluir via odontograma
      if (!isAcademyProduct && isCompletionAction && existingTreatment) {
        const treatmentValue = Number(existingTreatment.value) || 0;
        const alreadyPaidViaPrePayment = existingTreatment.requires_prepayment && existingTreatment.prepayment_confirmed;
        if (treatmentValue > 0 && !alreadyPaidViaPrePayment) {
          const procedureLabel = existingTreatment.procedure || procedure || 'Procedimento';
          apiFetch('/api/finance', {
            method: 'POST',
            body: JSON.stringify({
              type: 'INCOME',
              description: `${procedureLabel} — dente ${toothNumber}`,
              category: 'Procedimentos',
              amount: treatmentValue,
              payment_method: 'Indefinido',
              date: nowIso.split('T')[0],
              status: 'PAID',
              patient_id: patient.id,
              procedure: procedureLabel,
              notes: `Gerado automaticamente ao concluir procedimento.`,
            }),
          }).then(() => {
            if (infoTab === 'financeiro') {
              apiFetch(`/api/patients/${patient.id}/financial`)
                .then((r) => r.json())
                .then((data) => setPatientFinancial(data))
                .catch(() => {});
            }
          }).catch((err) => {
            console.error('Error creating auto transaction from odontogram:', err);
          });
        }
      }
    } catch (error) {
      console.error('Error applying odontogram action:', error);
    }

    if (shouldAppendEvolution) {
      persistEvolution({
        notes: evolutionNotes,
        procedure_performed: evolutionProcedurePerformed,
      }).catch((error) => {
        console.error('Error persisting evolution from odontogram action:', error);
      });
    }

    if (nextTreatmentId) setHighlightedTreatmentId(nextTreatmentId);
    if (shouldAppendEvolution) setHighlightedTimelineId(`evo-${evolutionId}`);
    setHighlightedToothNumber(toothNumber);

    window.setTimeout(() => setHighlightedTreatmentId(null), 2200);
    if (shouldAppendEvolution) window.setTimeout(() => setHighlightedTimelineId(null), 2200);
    window.setTimeout(() => setHighlightedToothNumber(null), 2600);
  };

  const handleCompleteTreatment = async (treatment: any) => {
    const nowIso = new Date().toISOString();
    const evolutionId = `evo-complete-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const nextTreatmentPlan = (patient.treatmentPlan || []).map((item: any) =>
      item.id === treatment.id
        ? { ...item, status: 'REALIZADO', completed_at: nowIso, updated_at: nowIso }
        : item
    );

    const evolutionEntry = {
      id: evolutionId,
      date: nowIso,
      notes: `Procedimento concluído no dente ${treatment.tooth_number || '-'}: ${treatment.procedure}.`,
      procedure_performed: `Conclusão - ${treatment.procedure}`,
      procedure: `Conclusão - ${treatment.procedure}`,
      event_type: 'PROCEDURE_COMPLETION',
    };

    setOptimisticTreatments((prev) => [
      { ...treatment, status: 'REALIZADO', completed_at: nowIso, updated_at: nowIso },
      ...prev.filter((item: any) => item.id !== treatment.id),
    ]);
    setOptimisticEvolutions((prev) => [evolutionEntry, ...prev]);

    const updatedPatient = {
      ...patient,
      treatmentPlan: nextTreatmentPlan,
      evolution: [evolutionEntry, ...(patient.evolution || [])],
    };

    try {
      await onUpdatePatient(updatedPatient);

      // Criar transação financeira automaticamente (pular se pagamento antecipado já confirmado)
      const treatmentValue = Number(treatment.value) || 0;
      const alreadyPaidViaPrePayment = treatment.requires_prepayment && treatment.prepayment_confirmed;
      if (!isAcademyProduct && treatmentValue > 0 && !alreadyPaidViaPrePayment) {
        const procedureLabel = treatment.procedure || 'Procedimento';
        const toothLabel = ` — ${formatTreatmentAnchor(treatment)}`;
        apiFetch('/api/finance', {
          method: 'POST',
          body: JSON.stringify({
            type: 'INCOME',
            description: `${procedureLabel}${toothLabel}`,
            category: 'Procedimentos',
            amount: treatmentValue,
            payment_method: 'Indefinido',
            date: nowIso.split('T')[0],
            status: 'PAID',
            patient_id: patient.id,
            procedure: procedureLabel,
            notes: `Gerado automaticamente ao concluir procedimento.`,
          }),
        }).then(() => {
          // Atualizar dados financeiros se aba estiver aberta
          if (infoTab === 'financeiro') {
            apiFetch(`/api/patients/${patient.id}/financial`)
              .then((r) => r.json())
              .then((data) => setPatientFinancial(data))
              .catch(() => {});
          }
        }).catch((err) => {
          console.error('Error creating auto transaction:', err);
        });
      }
    } catch (error) {
      console.error('Error completing treatment:', error);
    }

    persistEvolution({
      notes: evolutionEntry.notes,
      procedure_performed: evolutionEntry.procedure_performed,
    }).catch((error) => {
      console.error('Error persisting completion evolution:', error);
    });

    const completedScope = normalizeTreatmentItem(treatment);
    if (completedScope.scope === TREATMENT_SCOPES.TOOTH && completedScope.tooth_number) {
      const toothNumber = Number(completedScope.tooth_number);
      const procedureText = String(treatment.procedure || '').toLowerCase();
      const completionStatus =
        procedureText.includes('canal')
          ? 'root_canal_done'
          : procedureText.includes('extr')
            ? 'extraction_done'
            : null;

      if (completionStatus) {
        handleOdontogramStatusChange(toothNumber, {
          status: completionStatus,
          notes: 'Procedimento concluído.',
        });
      }

      handleAddToothHistory({
        tooth_number: toothNumber,
        procedure: String(treatment.procedure || 'Procedimento'),
        notes: 'Procedimento concluído.',
        date: nowIso.split('T')[0],
      });
    }

    setSelectedTreatmentAction(null);
    setHighlightedTimelineId(`evo-${evolutionId}`);
    window.setTimeout(() => setHighlightedTimelineId(null), 2200);
  };

  const handleConvertTreatment = async (treatment: any, nextProcedure: string) => {
    const nowIso = new Date().toISOString();
    const evolutionId = `evo-convert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const nextTreatmentPlan = (patient.treatmentPlan || []).map((item: any) =>
      item.id === treatment.id
        ? {
            ...item,
            procedure: nextProcedure,
            status: 'APROVADO',
            value: Number(item.value) || 0,
            updated_at: nowIso,
          }
        : item
    );

    const evolutionEntry = {
      id: evolutionId,
      date: nowIso,
      notes: `Plano ajustado no dente ${treatment.tooth_number || '-'}: ${treatment.procedure} convertido para ${nextProcedure}.`,
      procedure_performed: `Conversão de plano`,
      procedure: `Conversão - ${treatment.procedure} -> ${nextProcedure}`,
      event_type: 'PLAN_CHANGE',
    };

    setOptimisticTreatments((prev) => [
      { ...treatment, procedure: nextProcedure, status: 'APROVADO', updated_at: nowIso },
      ...prev.filter((item: any) => item.id !== treatment.id),
    ]);
    setOptimisticEvolutions((prev) => [evolutionEntry, ...prev]);

    const updatedPatient = {
      ...patient,
      treatmentPlan: nextTreatmentPlan,
      evolution: [evolutionEntry, ...(patient.evolution || [])],
    };

    try {
      await onUpdatePatient(updatedPatient);
    } catch (error) {
      console.error('Error converting treatment:', error);
    }

    persistEvolution({
      notes: evolutionEntry.notes,
      procedure_performed: evolutionEntry.procedure_performed,
    }).catch((error) => {
      console.error('Error persisting conversion evolution:', error);
    });

    setSelectedTreatmentAction(null);
    setHighlightedTreatmentId(treatment.id);
    setHighlightedTimelineId(`evo-${evolutionId}`);
    const convertedScope = normalizeTreatmentItem(treatment);
    if (convertedScope.scope === TREATMENT_SCOPES.TOOTH && convertedScope.tooth_number) {
      setHighlightedToothNumber(Number(convertedScope.tooth_number));
      window.setTimeout(() => setHighlightedToothNumber(null), 2600);
    }
    window.setTimeout(() => setHighlightedTreatmentId(null), 2200);
    window.setTimeout(() => setHighlightedTimelineId(null), 2200);
  };

  const handleRemoveScopeTreatment = async (treatment: any) => {
    const normalized = normalizeTreatmentItem(treatment);
    if (
      normalized.scope !== TREATMENT_SCOPES.PATIENT &&
      normalized.scope !== TREATMENT_SCOPES.QUADRANT
    ) {
      return;
    }

    const status = String(treatment.status || '').toUpperCase();
    const needsConfirm =
      status === 'APROVADO' ||
      Boolean(treatment.prepayment_confirmed) ||
      status === 'REALIZADO';

    if (
      needsConfirm &&
      !window.confirm(
        `Remover ${treatment.procedure} (${formatTreatmentAnchor(treatment)}) do plano de tratamento?`
      )
    ) {
      return;
    }

    const nextPlan = (mergedTreatmentPlan || []).filter((item: any) => item.id !== treatment.id);
    setOptimisticTreatments((prev) => prev.filter((item: any) => item.id !== treatment.id));

    try {
      await onUpdatePatient({ ...patient, treatmentPlan: nextPlan });
      if (highlightedTreatmentId === treatment.id) {
        setHighlightedTreatmentId(null);
      }
    } catch (error) {
      console.error('Error removing scope treatment:', error);
    }
  };

  const handleAddToothHistory = async (record: { tooth_number: number; procedure: string; notes: string; date: string }) => {
    try {
      const res = await apiFetch(`/api/patients/${patient.id}/tooth-history`, {
        method: 'POST',
        body: JSON.stringify(record),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Falha ao salvar histórico dentário');
      }
    } catch (error) {
      console.error('Error adding tooth history:', error);
    }
  };

  const handleResetTooth = async (toothNumber: number) => {
    // Remove tooth from odontogram data
    const currentOdontogram = { ...(patient?.odontogram || {}) };
    delete currentOdontogram[toothNumber];
    setOptimisticOdontogram((prev) => {
      const next = { ...prev };
      delete next[toothNumber];
      return next;
    });

    // Remove active treatment plan items for this tooth
    const nextPlan = (mergedTreatmentPlan || []).filter(
      (item: any) => Number(item.tooth_number) !== toothNumber ||
        String(item.status || '').toUpperCase() === 'REALIZADO'
    );
    setOptimisticTreatments((prev) => {
      const nextIds = new Set(nextPlan.map((i: any) => i.id));
      return prev.filter((i: any) => nextIds.has(i.id) || Number(i.tooth_number) !== toothNumber);
    });

    try {
      // Update odontogram without the tooth
      await apiFetch(`/api/patients/${patient.id}/odontogram`, {
        method: 'POST',
        body: JSON.stringify({ data: currentOdontogram }),
      });

      // Delete tooth history entries
      await apiFetch(`/api/patients/${patient.id}/tooth-history/${toothNumber}`, {
        method: 'DELETE',
      });

      // Persist updated treatment plan (removes active items for this tooth)
      await onUpdatePatient({ ...patient, treatmentPlan: nextPlan });
    } catch (error) {
      console.error('Error resetting tooth:', error);
    }
  };

  const patientFiles = patient?.files || [];
  const financialTotal = mergedTreatmentPlan.reduce((acc: number, item: any) => acc + (Number(item.value) || 0), 0);
  const completedTotal = mergedTreatmentPlan
    .filter((item: any) => String(item.status || '').toUpperCase() === 'REALIZADO')
    .reduce((acc: number, item: any) => acc + (Number(item.value) || 0), 0);

  const openImagesTab = () => {
    setInfoTab('imagens');
    requestAnimationFrame(() => {
      infoPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !patient?.id) return;

    setIsUploadingProfilePhoto(true);
    setUploadFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch(`/api/patients/${patient.id}/photo`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Falha ao enviar foto do paciente');
      }

      await onRefreshPatient?.();
      setUploadFeedback('Foto atualizada.');
    } catch (error) {
      console.error('Error uploading patient profile image:', error);
      setUploadFeedback('Não foi possível enviar a foto.');
    } finally {
      setIsUploadingProfilePhoto(false);
      event.target.value = '';
    }
  };

  const handleClinicalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !patient?.id) return;

    const allowedMimeTypes = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
    ]);

    if (!allowedMimeTypes.has(file.type)) {
      setUploadFeedback('Formato inválido. Envie JPG, PNG, WEBP, GIF ou PDF.');
      event.target.value = '';
      return;
    }

    setIsUploadingClinicalImage(true);
    setUploadFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', file.name || 'Imagem/RX clínico');
      formData.append('file_type', file.type === 'application/pdf' ? 'pdf' : 'image');

      const res = await apiFetch(`/api/patients/${patient.id}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Falha ao enviar imagem/RX. Verifique o formato e tamanho (máx. 5MB).');
      }

      await onRefreshPatient?.();
      setInfoTab('imagens');
      setUploadFeedback('Imagem anexada.');
    } catch (error) {
      console.error('Error uploading patient clinical image:', error);
      const message = error instanceof Error ? error.message : 'Não foi possível enviar a imagem.';
      setUploadFeedback(message);
    } finally {
      setIsUploadingClinicalImage(false);
      event.target.value = '';
    }
  };

  const focusOdontogram = () => {
    requestAnimationFrame(() => {
      odontogramRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  useEffect(() => {
    if (!pendingRevealTooth) return;
    if (isToothVisibleInMode(pendingRevealTooth.tooth, effectiveDentitionMode)) {
      setHighlightedToothNumber(pendingRevealTooth.tooth);
      window.setTimeout(() => setHighlightedToothNumber(null), 2600);
      setPendingRevealTooth(null);
      focusOdontogram();
    }
  }, [effectiveDentitionMode, pendingRevealTooth]);

  const focusTreatmentSection = () => {
    requestAnimationFrame(() => {
      treatmentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const flashToothHighlight = (toothNumber: number) => {
    setHighlightedToothNumber(toothNumber);
    window.setTimeout(() => setHighlightedToothNumber(null), 2600);
    focusOdontogram();
  };

  const handleDentitionModeSelect = async (mode: DentitionMode, source: DentitionSource) => {
    setDismissedDentitionSuggestion(null);
    await onUpdatePatient({
      ...patient,
      dentition_mode: mode,
      dentition_mode_source: source,
    });
  };

  const handleAcceptDentitionSuggestion = () => {
    if (!suggestedDentitionMode) return;
    void handleDentitionModeSelect(suggestedDentitionMode, 'auto');
  };

  const handleDismissDentitionSuggestion = () => {
    setDismissedDentitionSuggestion(dentitionSuggestionToken);
  };

  const handleSelectToothFromSummary = (toothNumber: number) => {
    if (!isToothVisibleInMode(toothNumber, effectiveDentitionMode)) {
      const revealMode = suggestModeToRevealTooth(toothNumber, effectiveDentitionMode);
      if (revealMode) {
        setPendingRevealTooth({ tooth: toothNumber, mode: revealMode });
        focusOdontogram();
        return;
      }
    }
    flashToothHighlight(toothNumber);
  };

  const flashQuadrantHighlight = (quadrant: QuadrantId) => {
    setHighlightedQuadrant(quadrant);
    window.setTimeout(() => setHighlightedQuadrant(null), 2600);
    focusOdontogram();
  };

  const flashTreatmentHighlight = (treatmentId: string) => {
    setHighlightedTreatmentId(treatmentId);
    window.setTimeout(() => setHighlightedTreatmentId(null), 2600);
    focusTreatmentSection();
  };

  const saveAnamnese = async () => {
    setIsSavingAnamnese(true);
    try {
      const res = await apiFetch(`/api/patients/${patient.id}/anamnesis`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anamneseForm),
      });
      if (!res.ok) throw new Error('Falha ao salvar anamnese');
      await onRefreshPatient?.();
      setIsEditingAnamnese(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingAnamnese(false);
    }
  };

  const activeToothNumbers = useMemo(() => {
    const toothSet = new Set<number>();
    treatmentInProgress.forEach((item: any) => {
      const normalized = normalizeTreatmentItem(item);
      if (normalized.scope === TREATMENT_SCOPES.TOOTH && Number(normalized.tooth_number) > 0) {
        toothSet.add(Number(normalized.tooth_number));
      }
    });
    return [...toothSet];
  }, [treatmentInProgress]);

  const activeTreatmentCounts = useMemo(
    () => countActiveTreatmentsByScope(treatmentInProgress),
    [treatmentInProgress]
  );

  const activeQuadrants = useMemo(
    () => [...activeTreatmentCounts.quadrantSet],
    [activeTreatmentCounts]
  );

  const priorityToothNumber = useMemo(() => {
    const firstToothItem = treatmentInProgress.find((item: any) => {
      const normalized = normalizeTreatmentItem(item);
      return normalized.scope === TREATMENT_SCOPES.TOOTH && Number(normalized.tooth_number) > 0;
    });
    const toothNumber = Number(firstToothItem?.tooth_number);
    return Number.isFinite(toothNumber) && toothNumber > 0 ? toothNumber : null;
  }, [treatmentInProgress]);

  const upcomingAppointment = useMemo(
    () =>
      [...patientAppointments]
        .filter((appointment: any) => getAppointmentTime(appointment.start_time) >= Date.now())
        .sort((a: any, b: any) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time))[0] || null,
    [patientAppointments]
  );

  const primaryTreatment = treatmentInProgress[0] || null;
  const anamnesisFilledCount = useMemo(
    () => countFilledAnamnesisFields(patient?.anamnesis),
    [patient?.anamnesis]
  );
  const anamnesisIncomplete = anamnesisFilledCount < 3;
  const hasAllergy = hasRecordedAllergie(patient?.anamnesis?.allergies);
  const boxIntelContext = useMemo(
    () => generateBoxContext(patient, treatmentInProgress, patientAppointments),
    [patient, treatmentInProgress, patientAppointments]
  );
  const primaryActionTitle = primaryTreatment
    ? `${primaryTreatment.procedure} • ${formatTreatmentAnchor(primaryTreatment)}`
    : upcomingAppointment
      ? 'Preparar atendimento agendado'
      : 'Começar pelo odontograma';
  const primaryActionHelper = primaryTreatment
    ? String(primaryTreatment.status || '').toUpperCase() === 'PENDENTE'
      ? 'Valide a prioridade e confirme a conduta antes de seguir.'
      : 'Este é o foco clínico principal para o atendimento atual.'
    : upcomingAppointment
      ? 'A consulta já está marcada. Revise o caso e registre a evolução ao finalizar.'
      : 'Mapeie a condição dentária primeiro para orientar o próximo procedimento.';
  const primaryActionButtonLabel = primaryTreatment
    ? (isAcademyProduct ? 'Abrir plano clínico' : 'Abrir tratamento atual')
    : 'Ir para odontograma';

  const handleExportClinicalCasePdf = async () => {
    if (isExportingPdf) return;
    if (!canExportClinicalCasePdf) {
      onRequestPdfUpgrade?.();
      return;
    }
    setIsExportingPdf(true);
    try {
      await exportClinicalCasePdf({
        patient,
        appointments,
        studentProfile,
      });
    } catch (error) {
      console.error('Error exporting clinical case PDF:', error);
      window.alert('Não foi possível gerar o PDF do caso clínico. Tente novamente.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const selectedBoxGuide = boxGuides[selectedBoxProcedure];
  const boxContextProcedure =
    primaryTreatment?.procedure || boxIntelContext.appointmentLabel || boxIntelContext.boxProcedureDetail || '';
  const boxContextTooth = primaryTreatment?.tooth_number
    ? `Dente ${primaryTreatment.tooth_number}`
    : boxIntelContext.targetTooth
      ? `Dente ${boxIntelContext.targetTooth}`
      : '';
  const inferredBoxProcedure = inferBoxProcedure(boxContextProcedure);

  const boxNowItems = useMemo(() => generateBoxNowItems(boxIntelContext), [boxIntelContext]);
  const boxNowSteps = useMemo(() => generateBoxNowSteps(boxIntelContext), [boxIntelContext]);
  const smartChipContent = useMemo(() => generateSmartChipContent(boxIntelContext, selectedBoxProcedure), [boxIntelContext, selectedBoxProcedure]);
  const selectedDoubtItems = selectedBoxDoubt ? smartChipContent[selectedBoxDoubt] || [] : [];
  const boxMaterialItems = useMemo(() => generateSmartMaterials(boxIntelContext, selectedBoxProcedure), [boxIntelContext, selectedBoxProcedure]);
  
  const isFirstConsultation = boxIntelContext.isFirstConsultation;

  const boxSteps = useMemo(() => {
    return generateIntelligentSteps(
      boxIntelContext,
      selectedBoxProcedure,
      (chip) => setSelectedBoxDoubt(chip),
      (step) => setBoxStep(step),
      () => {
        setIsBoxModeOpen(false);
        setIsAddingEvolution(true);
      }
    );
  }, [boxIntelContext, selectedBoxProcedure]);

  const activeBoxStep = boxSteps[boxStep] || boxSteps[0];

  useEffect(() => {
    if (!isBoxModeOpen) return;
    const inferred = inferBoxProcedure(boxContextProcedure);
    if (inferred) {
      setSelectedBoxProcedure(inferred);
    } else if (isFirstConsultation) {
      setSelectedBoxProcedure('Consulta');
    } else {
      // No procedure detected and not clearly a first visit — default to Consulta (safe neutral)
      setSelectedBoxProcedure('Consulta');
    }
    setSelectedBoxDoubt(null);
    setBoxStep(0);
    setBoxTrayOpen(false);
    setBoxTrayChecked(new Set());
  }, [isBoxModeOpen, boxContextProcedure]);

  const patientInitials = String(patient?.name || 'P')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0].toUpperCase())
    .join('');

  return (
    <div className="chart-shell">
      <div aria-live="polite" className="sr-only">{uploadFeedback || (isSavingAnamnese ? 'Salvando anamnese' : '')}</div>
      <header className="chart-nav">
        <div className="chart-nav-inner">
          <div className="chart-nav-bar">
            <button
              type="button"
              onClick={() => { setAppActiveTab('pacientes'); appNavigate('/pacientes'); }}
              className="chart-back"
              aria-label="Voltar para pacientes"
            >
              <ChevronLeft size={22} />
              Pacientes
            </button>
            <div className="chart-tools">
              <div className="chart-segment" role="group" aria-label="Modo de visualização">
                <button type="button" aria-pressed={isFocusMode} onClick={() => setIsFocusMode(true)}>Foco</button>
                <button type="button" aria-pressed={!isFocusMode} onClick={() => setIsFocusMode(false)}>Ficha</button>
              </div>
              {isAcademyProduct && (
                <button
                  type="button"
                  onClick={() => setIsBoxModeOpen(true)}
                  className="chart-tool"
                  title="Modo Box"
                  aria-label="Abrir Modo Box"
                >
                  <BookOpen size={22} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsAddingEvolution(true)}
                className="chart-tool"
                title="Novo registro"
                aria-label="Novo registro clínico"
              >
                <Plus size={22} />
              </button>
              <button
                type="button"
                onClick={openImagesTab}
                className="chart-tool"
                title="Imagens e RX"
                aria-label="Abrir imagens e radiografias"
              >
                <Camera size={20} />
              </button>
              {isAcademyProduct && (
                <button
                  type="button"
                  onClick={handleExportClinicalCasePdf}
                  disabled={isExportingPdf}
                  className="chart-tool"
                  title={
                    canExportClinicalCasePdf
                      ? 'Exportar caso em PDF'
                      : 'PDF exclusivo do plano Student'
                  }
                  aria-label="Exportar caso clínico em PDF"
                >
                  {isExportingPdf ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : canExportClinicalCasePdf ? (
                    <Download size={20} />
                  ) : (
                    <Lock size={18} />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="chart-identity">
            <div className="chart-avatar">
              <div className="chart-avatar-face">
                {patient?.photo_url ? (
                  <img src={patient.photo_url} alt={patient?.name} referrerPolicy="no-referrer" />
                ) : (
                  <span aria-hidden="true">{patientInitials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => profilePhotoInputRef.current?.click()}
                disabled={isUploadingProfilePhoto}
                className="chart-avatar-edit"
                aria-label="Enviar foto do paciente"
              >
                <Camera size={12} />
              </button>
              <input ref={profilePhotoInputRef} type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="chart-name truncate">{patient?.name}</h1>
              <p className="chart-meta">
                {age !== null ? `${age} anos` : 'Idade não informada'}
                {' · '}
                {clinicalBadge.label}
                {treatmentInProgress.length > 0 && (
                  <>
                    {' · '}
                    {treatmentInProgress.length} {isAcademyProduct ? 'no plano' : 'em andamento'}
                  </>
                )}
              </p>
            </div>
          </div>

          {hasAllergy && (
            <div className="chart-medical" role="status">
              <div className="chart-medical-kicker">
                <Heart size={13} />
                Informação médica
              </div>
              <p>{formatAllergieLabel(patient?.anamnesis?.allergies)}</p>
            </div>
          )}

          <div className="chart-today">
            <button
              type="button"
              className={`chart-tile ${primaryTreatment ? 'chart-tile-accent' : ''}`}
              onClick={() => {
                if (primaryTreatment) {
                  setHighlightedTreatmentId(primaryTreatment.id);
                  window.setTimeout(() => setHighlightedTreatmentId(null), 2200);
                }
                focusOdontogram();
              }}
            >
              <span className="chart-tile-kicker">{primaryTreatment ? 'Hoje no box' : 'Plano clínico'}</span>
              <span className="chart-tile-title truncate">
                {primaryTreatment
                  ? primaryTreatment.procedure
                  : 'Comece pela boca'}
              </span>
              <span className="chart-tile-caption truncate">
                {primaryTreatment
                  ? formatTreatmentAnchor(primaryTreatment)
                  : 'Toque no dente para planejar o caso'}
              </span>
            </button>
            <button
              type="button"
              className="chart-tile"
              onClick={focusOdontogram}
            >
              <span className="chart-tile-kicker">Cadeira</span>
              <span className="chart-tile-title truncate">
                {upcomingAppointment
                  ? `${formatTime(upcomingAppointment.start_time) || formatDate(upcomingAppointment.start_time)}`
                  : 'Livre'}
              </span>
              <span className="chart-tile-caption truncate">
                {upcomingAppointment
                  ? formatDate(upcomingAppointment.start_time)
                  : 'Nenhum atendimento marcado'}
              </span>
            </button>
            <button
              type="button"
              className="chart-tile"
              onClick={() => {
                setIsFocusMode(false);
                setInfoTab('anamneses');
                requestAnimationFrame(() => {
                  infoPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
              }}
            >
              <span className="chart-tile-kicker">Anamnese</span>
              <span className="chart-tile-title">{anamnesisFilledCount} de 7</span>
              <span className="chart-tile-caption">
                {hasAllergy
                  ? 'Alergia registrada'
                  : anamnesisIncomplete
                    ? 'Complete antes de anestesiar'
                    : 'Pronta para o box'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="chart-body">
        {isAcademyProduct && (
          <p className="chart-footnote">
            Caso clínico acadêmico. Não substitui o prontuário oficial da faculdade.
          </p>
        )}

        <section ref={odontogramRef}>
          <div className="chart-section-head">
            <div>
              <h2 className="chart-section-title">Odontograma</h2>
              <p className="chart-section-caption">A boca do caso. Diagnóstico e plano saem daqui.</p>
            </div>
            <ScopeProcedureMenu
              onSelect={handleScopeProcedureSelect}
              hint={scopeProcedureWarning}
            />
          </div>

          <div className="chart-group chart-group-flush">
          <div className="flex items-start justify-between gap-3 px-2 pt-2 pb-1">
            <div className="min-w-0 flex-1">
              <OdontogramActiveSummary
                items={treatmentInProgress}
                teethCounterLabel={isAcademyProduct ? 'em plano clínico' : 'em tratamento'}
                toothStatuses={mergedOdontogram}
                highlightedTreatmentId={highlightedTreatmentId}
                onSelectTooth={handleSelectToothFromSummary}
                onSelectQuadrant={flashQuadrantHighlight}
                onSelectPatientItem={flashTreatmentHighlight}
                onRemoveTreatment={handleRemoveScopeTreatment}
              />
            </div>
            <DentitionIndicator
              effectiveMode={effectiveDentitionMode}
              suggestedMode={suggestedDentitionMode}
              source={dentitionSource}
              ageYears={age}
              hasBirthDate={hasBirthDate}
              showUpdatePrompt={showDentitionUpdatePrompt}
              onSelectMode={handleDentitionModeSelect}
              onAcceptSuggestion={handleAcceptDentitionSuggestion}
              onDismissSuggestion={handleDismissDentitionSuggestion}
            />
          </div>

          {pendingRevealTooth && (
            <DentitionRevealHint
              tooth={pendingRevealTooth.tooth}
              currentMode={effectiveDentitionMode}
              targetMode={pendingRevealTooth.mode}
              onReveal={() => void handleDentitionModeSelect(pendingRevealTooth.mode, 'manual')}
              onDismiss={() => setPendingRevealTooth(null)}
            />
          )}

          <div className="px-1 pb-2 pt-1">
            <Odontogram
              data={mergedOdontogram}
              history={patient?.toothHistory || []}
              onChange={handleOdontogramStatusChange}
              onAddHistory={handleAddToothHistory}
              onResetTooth={handleResetTooth}
              onSelectProcedure={handleOdontoProcedureSelect}
              treatments={mergedTreatmentPlan}
              activeToothNumbers={activeToothNumbers}
              activeQuadrants={activeQuadrants}
              priorityToothNumber={priorityToothNumber}
              highlightedToothNumber={highlightedToothNumber}
              highlightedQuadrant={highlightedQuadrant}
              dentitionMode={effectiveDentitionMode}
            />
          </div>
          </div>
        </section>

        <div className={isFocusMode ? '' : 'chart-split'}>
          <div className="space-y-7">
            <section ref={treatmentSectionRef}>
              <div className="chart-section-head">
                <div>
                  <h3 className="chart-section-title">{isAcademyProduct ? 'Plano clínico' : 'Tratamento atual'}</h3>
                  {treatmentInProgress.length > 0 ? (
                    <p className="chart-section-caption">
                      {treatmentInProgress.length} procedimento{treatmentInProgress.length !== 1 ? 's' : ''} no caso
                      {!isAcademyProduct && (
                        <>
                          {' · '}
                          {treatmentInProgress.reduce((s: number, i: any) => s + (Number(i.value) || 0), 0)
                            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="chart-section-caption">Nada planejado ainda</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isAcademyProduct && treatmentInProgress.length > 1 && !isReorderMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setReorderItems([...treatmentInProgress]);
                        setIsReorderMode(true);
                      }}
                      className="chart-link"
                    >
                      Reordenar
                    </button>
                  )}
                {!isAcademyProduct && treatmentInProgress.length > 0 && (() => {
                  const activeUnpaid = treatmentInProgress.filter((item: any) => !item.prepayment_confirmed);
                  const allActive = activeUnpaid.length > 0 && activeUnpaid.every((item: any) => item.requires_prepayment);
                  const allPaid = treatmentInProgress.every((item: any) => item.requires_prepayment && item.prepayment_confirmed);
                  return (
                    <button
                      type="button"
                      onClick={togglePrepaymentAll}
                      disabled={allPaid}
                      className="chart-link"
                      title={allPaid ? 'Orçamento quitado' : allActive ? 'Cobrar antes de executar (ativo)' : 'Exigir pagamento antes de executar'}
                    >
                      {allPaid ? 'Quitado' : 'Cobrar antes'}
                    </button>
                  );
                })()}
              </div>
            </div>

              <div className="chart-group">
                {isReorderMode && (
                  <div className="chart-reorder-bar">
                    <button
                      type="button"
                      disabled={isSavingOrder}
                      onClick={async () => {
                        setIsSavingOrder(true);
                        try {
                          const reorderedIds = new Set(reorderItems.map((i: any) => i.id));
                          const completedItems = mergedTreatmentPlan.filter(
                            (item: any) => !reorderedIds.has(item.id)
                          );
                          const nextPlan = [...reorderItems, ...completedItems];
                          await onUpdatePatient({ ...patient, treatmentPlan: nextPlan });
                          await onRefreshPatient?.();
                        } catch (error) {
                          console.error('Error saving reorder:', error);
                        } finally {
                          setIsSavingOrder(false);
                          setIsReorderMode(false);
                        }
                      }}
                      className="chart-primary !w-auto flex-1 !m-0"
                    >
                      {isSavingOrder ? <Loader2 size={16} className="animate-spin" /> : null}
                      Salvar ordem
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsReorderMode(false); setReorderItems([]); }}
                      className="chart-link"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {(isReorderMode ? reorderItems : treatmentInProgress).length > 0 ? (
                  (isReorderMode ? reorderItems : treatmentInProgress).map((item: any, idx: number) => {
                    const isPriority = idx === 0;
                    const rawStatus = String(item.status || '').toUpperCase();
                    const isPrepaid = !isAcademyProduct && item.requires_prepayment && item.prepayment_confirmed;

                    const itemStatusLabel = rawStatus === 'APROVADO'
                      ? 'Em andamento'
                      : rawStatus === 'PENDENTE'
                        ? 'Aguardando'
                        : 'Planejado';

                    return (
                      <div
                        key={item.id}
                        data-reorder-index={idx}
                        className={`chart-row ${
                          isReorderMode ? 'select-none' : ''
                        } ${
                          isReorderMode && dragIdx === idx
                            ? 'opacity-40'
                            : isReorderMode && dragOverIdx === idx
                              ? 'chart-highlight'
                              : ''
                        } ${
                          !isReorderMode && highlightedTreatmentId === item.id
                            ? 'chart-highlight'
                            : ''
                        }`}
                      >
                        {isReorderMode && (
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onPointerDown={(event) => startPointerReorder(event, idx)}
                              disabled={isSavingOrder}
                              aria-label={`Arrastar ${item.procedure}`}
                              title="Arrastar"
                              className="chart-tool !min-w-10 !min-h-10 text-[#86868b] cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical size={18} />
                            </button>
                            <div className="flex shrink-0 items-center sm:hidden">
                              <button
                                type="button"
                                onClick={() => moveReorderItemByStep(idx, -1)}
                                disabled={idx === 0 || isSavingOrder}
                                aria-label={`Subir ${item.procedure}`}
                                className="chart-tool !min-w-8 !min-h-8 text-[#86868b]"
                              >
                                <ChevronDown size={14} className="rotate-180" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveReorderItemByStep(idx, 1)}
                                disabled={idx === reorderItems.length - 1 || isSavingOrder}
                                aria-label={`Descer ${item.procedure}`}
                                className="chart-tool !min-w-8 !min-h-8 text-[#86868b]"
                              >
                                <ChevronDown size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="chart-row-body">
                          <p className={`chart-row-title truncate ${isPriority ? 'chart-row-title-strong' : ''}`}>
                            {item.procedure}
                          </p>
                          <p className="chart-row-sub">
                            {isPriority ? (isAcademyProduct ? 'Próximo no box · ' : 'Próximo · ') : ''}
                            {formatTreatmentAnchor(item)}
                            {' · '}
                            {itemStatusLabel}
                            {!isAcademyProduct && isPrepaid ? ' · Pago' : ''}
                            {!isAcademyProduct && item.requires_prepayment && !item.prepayment_confirmed ? ' · Aguardando pagamento' : ''}
                          </p>
                          {!isAcademyProduct && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="chart-row-sub !mt-0">R$</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                disabled={isPrepaid}
                                value={editingValues[item.id] ?? formatCurrencyInputBRL(String((Number(item.value) || 0) * 100))}
                                onChange={(event) => {
                                  const next = formatCurrencyInputBRL(event.target.value);
                                  setEditingValues((prev) => ({ ...prev, [item.id]: next }));
                                }}
                                onBlur={() => {
                                  const nextRaw = editingValues[item.id] ?? formatCurrencyInputBRL(String((Number(item.value) || 0) * 100));
                                  persistTreatmentValue(item.id, nextRaw);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    const nextRaw = editingValues[item.id] ?? formatCurrencyInputBRL(String((Number(item.value) || 0) * 100));
                                    persistTreatmentValue(item.id, nextRaw);
                                    (event.currentTarget as HTMLInputElement).blur();
                                  }
                                }}
                                className="ios-input !py-2 !px-3 !text-[15px] w-[7.5rem]"
                                aria-label="Valor do procedimento"
                              />
                            </div>
                          )}
                        </div>

                        {!isReorderMode && (() => {
                          const itemScope = normalizeTreatmentItem(item);
                          if (
                            itemScope.scope !== TREATMENT_SCOPES.PATIENT &&
                            itemScope.scope !== TREATMENT_SCOPES.QUADRANT
                          ) {
                            return null;
                          }
                          return (
                            <button
                              type="button"
                              onClick={() => handleRemoveScopeTreatment(item)}
                              className="chart-tool !text-[#86868b]"
                              aria-label={`Remover ${item.procedure}`}
                              title="Remover"
                            >
                              <Trash2 size={16} />
                            </button>
                          );
                        })()}

                        {!isReorderMode && (
                          <button
                            onClick={() => setSelectedTreatmentAction(item)}
                            className="chart-row-trail"
                          >
                            Continuar
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="chart-empty">
                    <h4>{isAcademyProduct ? 'Nada no plano ainda' : 'Nenhum tratamento ativo'}</h4>
                    <p>Toque um dente no odontograma para montar o caso.</p>
                    <button type="button" onClick={focusOdontogram} className="chart-link mt-2">
                      Ir ao odontograma
                    </button>
                  </div>
                )}
                  </div>

                {/* Receber pelo orçamento completo */}
                {!isAcademyProduct && (() => {
                  const unpaid = treatmentInProgress.filter(
                    (item: any) => !(item.requires_prepayment && item.prepayment_confirmed)
                  );
                  const allPaid = treatmentInProgress.length > 0 && unpaid.length === 0;
                  const unpaidTotal = unpaid.reduce((s: number, i: any) => s + (Number(i.value) || 0), 0);
                  if (treatmentInProgress.length < 2 && !allPaid) return null;
                  return allPaid ? (
                    <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/40 px-4 py-3">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <p className="text-[13px] font-semibold text-emerald-700">Orçamento quitado</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 flex items-center justify-between gap-3 transition-all duration-200 hover:border-slate-300 hover:shadow-sm active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <CreditCard size={14} className="text-slate-600" />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[13px] font-bold text-slate-800">Receber pelo orçamento completo</p>
                          <p className="text-[11px] text-slate-500">{unpaid.length} procedimento{unpaid.length !== 1 ? 's' : ''} pendente{unpaid.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <span className="text-[14px] font-bold text-slate-900 shrink-0">
                        {unpaidTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </button>
                  );
                })()}
            </section>

            {!isFocusMode && (
            <section>
              <div className="chart-section-head">
                <div>
                  <h3 className="chart-section-title">Registros</h3>
                  {timelineItems.length > 0 && (
                    <p className="chart-section-caption">
                      {timelineItems.length} {timelineItems.length === 1 ? 'evolução' : 'evoluções'}
                    </p>
                  )}
                </div>
                <button type="button" onClick={() => setIsAddingEvolution(true)} className="chart-link">
                  Novo
                </button>
              </div>

              {timelineItems.length > 0 ? (
                <div className="chart-group">
                    {(() => {
                      const visibleItems = showAllEvolutions ? timelineItems : timelineItems.slice(0, 5);
                      const nodes: React.ReactNode[] = [];
                      let lastGroup = '';

                      visibleItems.forEach((item: any) => {
                        const group = resolveTimelineMonthGroup(item.date);
                        if (group !== lastGroup) {
                          lastGroup = group;
                          nodes.push(
                            <div key={`grp-${group}`} className="chart-month">{group}</div>
                          );
                        }

                        const cat = resolveProcedureCategory(item.title);
                        const isNewlyAdded = highlightedTimelineId === item.id;
                        const statusStyle = TIMELINE_STATUS_STYLES[item.status] ?? TIMELINE_STATUS_STYLES.OBSERVACAO;
                        const kindLabel = item.recordKind === 'closed'
                          ? 'Atendimento fechado'
                          : item.recordKind === 'manual'
                            ? 'Registro manual'
                            : 'Registro antigo';

                        nodes.push(
                          <div
                            key={item.id}
                            className={`chart-row items-start ${isNewlyAdded ? 'chart-highlight' : ''}`}
                          >
                            <span className={`chart-status-dot mt-2 ${statusStyle.dot}`} />
                            <div className="chart-row-body">
                              <p className="chart-row-title">{item.title}</p>
                              <p className="chart-row-sub">
                                {cat.label} · {kindLabel}
                                {item.recordKind === 'closed' && item.appointmentDate ? ` · ${item.appointmentDate}` : ''}
                              </p>
                              {item.notes && (
                                <p className="chart-row-sub line-clamp-2">{item.notes}</p>
                              )}
                            </div>
                            <span className="chart-row-trail chart-row-trail-muted tabular-nums">{formatDate(item.date)}</span>
                          </div>
                        );
                      });

                      return nodes;
                    })()}

                  {timelineItems.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setShowAllEvolutions(prev => !prev)}
                      className="chart-link w-full"
                    >
                      {showAllEvolutions
                        ? 'Mostrar menos'
                        : `Mais ${timelineItems.length - 5}`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="chart-group">
                  <div className="chart-empty">
                    <h4>Nenhum registro ainda</h4>
                    <p>Feche o atendimento com uma evolução. É o que o preceptor lê.</p>
                    <button type="button" onClick={() => setIsAddingEvolution(true)} className="chart-link mt-1">
                      Escrever o primeiro
                    </button>
                  </div>
                </div>
              )}
            </section>
            )}
          </div>

          {!isFocusMode && (
          <aside ref={infoPanelRef} className="chart-split-side space-y-3">
            <div className="chart-section-head">
              <div>
                <h3 className="chart-section-title">Ficha</h3>
                <p className="chart-section-caption">O que você precisa saber antes de sentar.</p>
              </div>
            </div>
            <div className="chart-group">
            {(() => {
              const pendingCount = (patientFinancial?.installments || []).filter((i: any) => i.status === 'PENDING' || i.status === 'OVERDUE').length;
              const fileCount = patientFiles.length;

              const tabs = [
                {
                  id: 'anamneses',
                  label: 'Anamnese',
                },
                { id: 'dados', label: 'Dados' },
                { id: 'imagens', label: fileCount > 0 ? `RX · ${fileCount}` : 'RX' },
                ...(!isAcademyProduct
                  ? [{ id: 'financeiro', label: pendingCount > 0 ? `Conta · ${pendingCount}` : 'Conta' }]
                  : []),
              ];

              return (
                <div className="chart-tabs" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={infoTab === tab.id}
                      onClick={() => setInfoTab(tab.id as InfoTab)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              );
            })()}

            {infoTab === 'anamneses' && (
              <div>
                <div className="chart-row">
                  <div className="chart-row-body">
                    <p className="chart-row-title">Anamnese</p>
                    <p className="chart-row-sub">{countFilledAnamnesisFields(patient?.anamnesis)} de 7 campos</p>
                  </div>
                  {!isEditingAnamnese ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAnamneseForm(anamnesisToForm(patient?.anamnesis));
                        setIsEditingAnamnese(true);
                      }}
                      className="chart-row-trail"
                    >
                      Editar
                    </button>
                  ) : (
                    <button type="button" onClick={() => setIsEditingAnamnese(false)} className="chart-row-trail chart-row-trail-muted">
                      Cancelar
                    </button>
                  )}
                </div>

                {isEditingAnamnese ? (
                  <>
                    <div className="chart-field">
                      <p className="chart-field-label">Queixa principal</p>
                      <textarea
                        value={anamneseForm.chief_complaint}
                        onChange={(e) => setAnamneseForm((f) => ({ ...f, chief_complaint: e.target.value }))}
                        rows={2}
                        placeholder="Nas palavras do paciente."
                      />
                    </div>
                    <div className="chart-field">
                      <p className="chart-field-label" data-alert="true">
                        Alergias
                        <button
                          type="button"
                          onClick={() => setAnamneseForm((f) => ({ ...f, allergies: 'Nenhuma alergia referida' }))}
                          className="chart-ghost"
                        >
                          Negou
                        </button>
                      </p>
                      <textarea
                        value={anamneseForm.allergies}
                        onChange={(e) => setAnamneseForm((f) => ({ ...f, allergies: e.target.value }))}
                        rows={2}
                        placeholder="Penicilina, látex, anestésico…"
                      />
                    </div>
                    <div className="chart-field">
                      <p className="chart-field-label">
                        Medicações
                        <button
                          type="button"
                          onClick={() => setAnamneseForm((f) => ({ ...f, medications: 'Nenhuma medicação em uso' }))}
                          className="chart-ghost"
                        >
                          Não usa
                        </button>
                      </p>
                      <textarea
                        value={anamneseForm.medications}
                        onChange={(e) => setAnamneseForm((f) => ({ ...f, medications: e.target.value }))}
                        rows={2}
                        placeholder="Losartana 50 mg, Metformina…"
                      />
                    </div>
                    <div className="chart-field">
                      <p className="chart-field-label">Histórico médico</p>
                      <textarea
                        value={anamneseForm.medical_history}
                        onChange={(e) => setAnamneseForm((f) => ({ ...f, medical_history: e.target.value }))}
                        rows={3}
                        placeholder="Doenças, cirurgias, condições sistêmicas."
                      />
                    </div>
                    <div className="chart-field">
                      <p className="chart-field-label">Hábitos</p>
                      <textarea
                        value={anamneseForm.habits}
                        onChange={(e) => setAnamneseForm((f) => ({ ...f, habits: e.target.value }))}
                        rows={2}
                        placeholder="Tabagismo, bruxismo, higiene."
                      />
                    </div>
                    <div className="chart-field">
                      <p className="chart-field-label">Histórico familiar</p>
                      <textarea
                        value={anamneseForm.family_history}
                        onChange={(e) => setAnamneseForm((f) => ({ ...f, family_history: e.target.value }))}
                        rows={2}
                        placeholder="Diabetes, hipertensão, cardiopatias."
                      />
                    </div>
                    <div className="chart-field">
                      <p className="chart-field-label">Sinais vitais</p>
                      <textarea
                        value={anamneseForm.vital_signs}
                        onChange={(e) => setAnamneseForm((f) => ({ ...f, vital_signs: e.target.value }))}
                        rows={2}
                        placeholder="PA 120×80 mmHg, FC 72 bpm."
                      />
                    </div>
                    <button
                      onClick={saveAnamnese}
                      disabled={isSavingAnamnese}
                      className="chart-primary"
                    >
                      {isSavingAnamnese ? <Loader2 size={16} className="animate-spin" /> : null}
                      {isSavingAnamnese ? 'Salvando' : 'Salvar anamnese'}
                    </button>
                  </>
                ) : (
                  <>
                    {hasMeaningfulAnamnesisValue(patient?.anamnesis?.chief_complaint) && (
                      <div className="chart-field">
                        <p className="chart-field-label">Queixa principal</p>
                        <p className="chart-field-value">{patient.anamnesis.chief_complaint}</p>
                      </div>
                    )}
                    <div className="chart-field">
                      <p className="chart-field-label" data-alert={hasAllergy ? 'true' : undefined}>Alergias</p>
                      <p className="chart-field-value">{formatAllergieLabel(patient?.anamnesis?.allergies)}</p>
                    </div>
                    <div className="chart-field">
                      <p className="chart-field-label">Medicações</p>
                      <p className="chart-field-value">{formatMedicationLabel(patient?.anamnesis?.medications)}</p>
                    </div>
                    <div className="chart-field">
                      <p className="chart-field-label">Histórico médico</p>
                      <p className="chart-field-value">
                        {hasMeaningfulAnamnesisValue(patient?.anamnesis?.medical_history)
                          ? patient.anamnesis.medical_history
                          : 'Não informado'}
                      </p>
                    </div>
                    {[
                      { label: 'Hábitos', value: patient?.anamnesis?.habits },
                      { label: 'Histórico familiar', value: patient?.anamnesis?.family_history },
                      { label: 'Sinais vitais', value: patient?.anamnesis?.vital_signs },
                    ]
                      .filter((field) => hasMeaningfulAnamnesisValue(field.value))
                      .map((field) => (
                        <div key={field.label} className="chart-field">
                          <p className="chart-field-label">{field.label}</p>
                          <p className="chart-field-value">{field.value}</p>
                        </div>
                      ))}

                    {(() => {
                      const extra = patient?.anamnesis;
                      const portalFields = [
                        { label: 'Doenças sistêmicas', value: extra?.systemic_diseases },
                        { label: 'Observações clínicas', value: extra?.clinical_notes },
                      ].filter((field) => hasMeaningfulAnamnesisValue(field.value));

                      if (portalFields.length === 0) return null;

                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowAnamneseExtra((v) => !v)}
                            className="chart-link w-full"
                          >
                            {showAnamneseExtra ? 'Ocultar pré-atendimento' : `Pré-atendimento (${portalFields.length})`}
                          </button>
                          {showAnamneseExtra && portalFields.map((field) => (
                            <div key={field.label} className="chart-field">
                              <p className="chart-field-label">{field.label}</p>
                              <p className="chart-field-value">{field.value}</p>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            )}

            {infoTab === 'dados' && (
              <div>
                {[
                  { label: 'CPF', value: patient?.cpf },
                  { label: 'Telefone', value: patient?.phone },
                  { label: 'E-mail', value: patient?.email },
                  { label: 'Nascimento', value: patient?.birth_date ? formatDate(patient.birth_date) : null },
                ].map(({ label, value }) => (
                  <div key={label} className="chart-field">
                    <p className="chart-field-label">{label}</p>
                    <p className="chart-field-value">{value || 'Não informado'}</p>
                  </div>
                ))}

                {/* Ver mais — dados do pré-atendimento */}
                {(() => {
                  const hasEmergency = patient?.emergency_contact_name || patient?.emergency_contact_phone;
                  const hasInsurance = patient?.health_insurance;
                  const consents: any[] = patient?.consents || [];
                  const hasConsents = consents.length > 0;
                  const hasExtra = hasEmergency || hasInsurance || hasConsents;
                  if (!hasExtra) return null;

                  const consentLabels: Record<string, string> = {
                    TREATMENT_CONSENT: 'Consentimento de Tratamento',
                    DATA_PRIVACY: 'Privacidade de Dados (LGPD)',
                    GENERAL_TERMS: 'Termos Gerais de Uso',
                  };

                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowDadosExtra(v => !v)}
                        className="chart-link w-full"
                      >
                        {showDadosExtra ? 'Ocultar pré-atendimento' : 'Pré-atendimento'}
                      </button>
                      {showDadosExtra && (
                        <>
                          {hasEmergency && (
                            <div className="chart-field">
                              <p className="chart-field-label">Emergência</p>
                              <p className="chart-field-value">
                                {[patient.emergency_contact_name, patient.emergency_contact_phone].filter(Boolean).join(' · ')}
                              </p>
                            </div>
                          )}
                          {hasInsurance && (
                            <div className="chart-field">
                              <p className="chart-field-label">Convênio</p>
                              <p className="chart-field-value">
                                {patient.health_insurance}
                                {patient.health_insurance_number ? ` · ${patient.health_insurance_number}` : ''}
                              </p>
                            </div>
                          )}
                          {hasConsents && consents.map((c: any) => (
                            <div key={c.id} className="chart-field">
                              <p className="chart-field-label">{consentLabels[c.consent_type] || c.consent_type}</p>
                              <p className="chart-field-value">
                                Assinado em {new Date(c.signed_at).toLocaleDateString('pt-BR')}
                              </p>
                              {c.signature_data && c.signature_data.startsWith('data:image') && c === consents[0] && (
                                <img src={c.signature_data} alt="Assinatura digital" className="max-h-16 mt-2" />
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {infoTab === 'imagens' && (
              <div>
                <div className="chart-row">
                  <div className="chart-row-body">
                    <p className="chart-row-title">Radiografias e fotos</p>
                    <p className="chart-row-sub">JPG, PNG, WEBP, GIF ou PDF</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => clinicalImageInputRef.current?.click()}
                    disabled={isUploadingClinicalImage}
                    className="chart-row-trail"
                  >
                    {isUploadingClinicalImage ? 'Enviando' : 'Adicionar'}
                  </button>
                  <input
                    ref={clinicalImageInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleClinicalImageUpload}
                    className="hidden"
                  />
                </div>

                {patientFiles.length > 0 ? (
                  patientFiles.slice(0, 6).map((file: any) => (
                    <a
                      key={file.id}
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chart-row"
                    >
                      <div className="chart-row-body">
                        <p className="chart-row-title truncate">{file.description || 'Arquivo clínico'}</p>
                        <p className="chart-row-sub">{file.created_at ? formatDate(file.created_at) : 'Data não informada'}</p>
                      </div>
                      <span className="chart-row-trail chart-row-trail-muted">
                        {(file.file_url || '').toLowerCase().endsWith('.pdf') ? 'PDF' : 'Imagem'}
                        <ChevronRight size={14} />
                      </span>
                    </a>
                  ))
                ) : (
                  <div className="chart-empty">
                    <h4>Nenhum RX ainda</h4>
                    <p>Anexe a radiografia do caso antes da próxima cadeira.</p>
                  </div>
                )}

                {uploadFeedback && (
                  <p className="chart-footnote px-4 py-2">{uploadFeedback}</p>
                )}
              </div>
            )}

            {!isAcademyProduct && infoTab === 'financeiro' && (
              <div className="space-y-3">
                {/* Resumo financeiro — 3 métricas em fluxo visual */}
                {(() => {
                  const received = (patientFinancial?.transactions || [])
                    .filter((t: any) => t.type === 'INCOME')
                    .reduce((s: number, t: any) => s + Number(t.amount || 0), 0);
                  const pct = financialTotal > 0 ? Math.min(100, Math.round((received / financialTotal) * 100)) : 0;
                  const remaining = Math.max(0, financialTotal - received);
                  return (
                    <div className="rounded-[18px] bg-slate-50 border border-slate-200/70 p-4 space-y-3">
                      {/* Orçado → Concluído pipeline */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] font-normal text-slate-400 mb-1">Orçamento total</p>
                          <p className="text-[16px] font-bold text-slate-900">
                            {financialTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-normal text-emerald-600 mb-1">Concluído</p>
                          <p className="text-[16px] font-bold text-emerald-700">
                            {completedTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>
                      </div>

                      {/* Recebimento com barra de progresso */}
                      <div className="pt-2 border-t border-slate-200/70">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-normal text-slate-400">Recebido</p>
                          <span className="text-[11px] font-bold text-slate-500">{pct}%</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p className="text-[15px] font-bold text-emerald-700">
                            {received.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                          {remaining > 0 && (
                            <p className="text-[11px] text-slate-400">falta {remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                          )}
                        </div>
                        <div className="mt-2 h-[6px] rounded-full bg-slate-200/60 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Parcelas pendentes */}
                {(() => {
                  const pending = (patientFinancial?.installments || []).filter((i: any) => i.status === 'PENDING' || i.status === 'OVERDUE');
                  if (pending.length === 0) return null;
                  return (
                    <div>
                      <p className="text-[10px] font-normal text-slate-400 px-1 mb-1.5">Parcelas pendentes</p>
                      <div className="space-y-1.5">
                        {pending.slice(0, 5).map((inst: any) => {
                          const isOverdue = inst.status === 'OVERDUE' || new Date(inst.due_date) < new Date();
                          return (
                            <div key={inst.id} className={`flex items-center gap-2.5 p-2.5 rounded-[14px] border ${isOverdue ? 'bg-rose-50 border-rose-200' : 'bg-amber-50/40 border-amber-200/60'}`}>
                              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isOverdue ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                <WalletCards size={13} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold text-slate-800 truncate">{inst.procedure || `Parcela ${inst.number}`}</p>
                                <p className={`text-[11px] font-medium ${isOverdue ? 'text-rose-600' : 'text-amber-700'}`}>
                                  {isOverdue ? 'Vencida em' : 'Vence em'} {formatDate(inst.due_date)}
                                </p>
                              </div>
                              <span className={`text-[13px] font-bold shrink-0 ${isOverdue ? 'text-rose-700' : 'text-slate-800'}`}>
                                {Number(inst.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                          );
                        })}
                        {pending.length > 5 && (
                          <p className="text-[11px] text-slate-400 text-center">+{pending.length - 5} parcelas</p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Movimentações do paciente */}
                {isLoadingFinancial ? (
                  <div className="p-6 rounded-[18px] text-center text-sm text-slate-500 bg-slate-50/80 border border-slate-200/60">
                    <div className="w-10 h-10 rounded-full bg-slate-100 mx-auto mb-3 flex items-center justify-center">
                      <Loader2 size={18} className="animate-spin text-slate-400" />
                    </div>
                    <p className="text-[13px] font-medium text-slate-400">Buscando dados...</p>
                  </div>
                ) : (patientFinancial?.transactions || []).length > 0 ? (
                  <div>
                    <p className="text-[10px] font-normal text-slate-400 px-1 mb-1.5">Movimentações</p>
                    <div className="space-y-1.5">
                      {patientFinancial!.transactions.slice(0, 8).map((t: any) => {
                        const isIncome = t.type === 'INCOME';
                        return (
                          <div key={t.id} className={`flex items-center gap-2.5 p-2.5 rounded-[14px] border ${isIncome ? 'bg-emerald-50/40 border-emerald-200/50' : 'bg-slate-50 border-slate-200/70'}`}>
                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {isIncome ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-semibold text-slate-800 truncate">{t.procedure || t.description}</p>
                              <p className="text-[11px] text-slate-500 font-medium">{formatDate(t.date)}</p>
                            </div>
                            <span className={`text-[13px] font-bold shrink-0 ${isIncome ? 'text-emerald-700' : 'text-rose-600'}`}>
                              {isIncome ? '+' : '-'}{Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        );
                      })}
                      {patientFinancial!.transactions.length > 8 && (
                        <p className="text-[11px] text-slate-400 text-center">+{patientFinancial!.transactions.length - 8} movimentações</p>
                      )}
                    </div>
                  </div>
                ) : !isLoadingFinancial && patientFinancial ? (
                  <div className="p-6 rounded-[18px] text-center text-sm text-slate-500 bg-slate-50 border border-slate-200/70">Nenhuma movimentação ainda</div>
                ) : null}

                <button
                  onClick={() => {
                    setAppActiveTab('financeiro');
                    appNavigate('/financeiro');
                  }}
                  className="chart-primary"
                >
                  Abrir financeiro
                </button>
              </div>
            )}
            </div>
          </aside>
          )}
        </div>
      </main>

      {isBoxModeOpen && (
        <div className="fixed inset-0 z-[197] overflow-y-auto bg-[var(--neo)] font-sans text-white">
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-6">
            <header className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[15px] text-white/80">Modo Box</p>
                <p className="text-[17px] font-semibold tracking-[-0.016em]">{activeBoxStep.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBoxModeOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"
                aria-label="Fechar Modo Box"
              >
                <X size={20} />
              </button>
            </header>

            <div className="flex flex-1 flex-col rounded-[28px] bg-white px-6 py-7 text-[var(--neo-ink)]">
              {boxStep === 0 && boxMaterialItems.length > 0 && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setBoxTrayOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-2 rounded-[18px] bg-[var(--neo-wash)] px-4 py-4 text-left"
                  >
                    <span className="text-[17px] text-[var(--neo-ink)]">Preparar mesa</span>
                    <ChevronDown
                      size={18}
                      className={`text-[var(--neo-gray)] transition-transform duration-200 ${boxTrayOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {boxTrayOpen && (
                    <ul className="mt-3 space-y-1">
                      {boxMaterialItems.slice(0, 6).map((item, idx) => {
                        const isChecked = boxTrayChecked.has(idx);
                        return (
                          <li key={idx}>
                            <button
                              type="button"
                              onClick={() => setBoxTrayChecked((prev) => {
                                const next = new Set(prev);
                                if (next.has(idx)) next.delete(idx); else next.add(idx);
                                return next;
                              })}
                              className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left"
                            >
                              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                                isChecked
                                  ? 'bg-[var(--neo)] text-white'
                                  : 'bg-[var(--neo-soft)] text-[var(--neo)]'
                              }`}>
                                {isChecked && <Check size={14} strokeWidth={3} />}
                              </span>
                              <span className={`text-[17px] leading-snug ${
                                isChecked ? 'text-[var(--neo-gray)] line-through' : 'text-[var(--neo-ink)]'
                              }`}>
                                {item}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              <p className="text-[15px] text-[var(--neo-gray)]">
                Passo {boxStep + 1} de {boxSteps.length}
              </p>
              <h2 className="mt-2 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[40px]">
                {activeBoxStep.title}
              </h2>
              <p className="mt-3 text-[17px] leading-relaxed text-[var(--neo-gray)]">
                {activeBoxStep.text}
              </p>

              <ol className="mt-8 flex-1 space-y-4">
                {(activeBoxStep.steps || []).slice(0, 5).map((step: string, index: number) => (
                  <li key={`${index}-${step}`} className="text-[22px] leading-snug tracking-[-0.02em] text-[var(--neo-ink)]">
                    {step}
                  </li>
                ))}
              </ol>

              {selectedBoxDoubt && (
                <section className="mt-6 rounded-[22px] bg-[var(--neo-wash)] px-4 py-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[15px] text-[var(--neo)]">Ajuda</p>
                    <button
                      type="button"
                      onClick={() => setSelectedBoxDoubt(null)}
                      className="text-[15px] text-[var(--neo-gray)]"
                    >
                      Fechar
                    </button>
                  </div>
                  <div className="-mx-1 overflow-x-auto pb-2">
                    <div className="flex min-w-max gap-2">
                      {selectedBoxGuide.doubtChips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setSelectedBoxDoubt(chip)}
                          className={`rounded-[980px] px-4 py-2 text-[15px] ${
                            selectedBoxDoubt === chip
                              ? 'bg-[var(--neo)] text-white'
                              : 'bg-white text-[var(--neo-ink)]'
                          }`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2.5 pt-2">
                    {selectedDoubtItems.map((item) => (
                      <p key={item} className="text-[16px] leading-relaxed text-[var(--neo-ink)]">{item}</p>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-8 grid gap-3">
                {activeBoxStep.actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className={action.primary
                      ? 'neo-pill w-full py-4 text-[18px]'
                      : 'neo-pill-secondary w-full py-4 text-[18px] bg-[var(--neo-wash)]'}
                  >
                    {action.primary ? (action.label || 'O seu passo') : action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {false && isBoxModeOpen && (
        <div className="fixed inset-0 z-[197] bg-[#F2F2F7] overflow-y-auto font-sans">
          <div className="min-h-screen pb-10">
            {/* Header iOS Style */}
            <div className="sticky top-0 z-20 bg-[#F2F2F7]/80 backdrop-blur-2xl border-b border-black/[0.05]">
              <div className="mx-auto max-w-[560px] px-4 h-14 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsBoxModeOpen(false)}
                  className="flex items-center gap-1 text-[16px] font-medium text-academy-primary active:opacity-70 transition-opacity"
                >
                  <ChevronLeft size={20} className="-ml-1" />
                  Prontuário
                </button>
                <div className="flex flex-col items-center">
                  <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">Modo Box</h2>
                  <p className="text-[11px] font-medium text-slate-500 truncate max-w-[150px]">{patient?.name}</p>
                </div>
                <div className="w-[85px] flex justify-end">
                  <span className="rounded-full bg-academy-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-academy-primary">
                    {activeBoxStep.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-[560px] px-4 py-5 space-y-5">
              {/* Alívio mental */}
              <section className="flex flex-col items-center text-center px-4 pt-2 pb-1">
                <h3 className="text-[28px] font-semibold text-apple-ink tracking-[-0.025em] leading-[1.05] mb-2">Um passo de cada vez.</h3>
                <p className="text-[14px] font-medium text-slate-500 leading-relaxed max-w-[280px]">
                  Foque apenas no que precisa ser feito agora. Nós te guiamos no restante.
                </p>
              </section>

              {/* O Card Principal de Passo */}
              <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02]">
                <div className="px-6 pt-7 pb-6 min-h-[460px] flex flex-col">
                  {/* Progress Indicators */}
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Etapa {boxStep + 1} de {boxSteps.length}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {boxSteps.map((step, index) => (
                        <button
                          key={step.label}
                          type="button"
                          onClick={() => setBoxStep(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${index === boxStep ? 'w-6 bg-academy-primary' : 'w-2 bg-slate-200'}`}
                          aria-label={step.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-3">
                        {activeBoxStep.label}
                      </span>
                      <h3 className="text-[28px] sm:text-[32px] font-bold leading-tight tracking-tight text-slate-900 mb-3">
                        {activeBoxStep.title}
                      </h3>
                      <p className="text-[16px] font-medium leading-relaxed text-slate-600">
                        {activeBoxStep.text}
                      </p>
                    </div>

                    {activeBoxStep.steps && (
                      <ol className="mt-6 space-y-3">
                        {activeBoxStep.steps.map((step: string, index: number) => (
                          <li key={step} className="flex items-start gap-3">
                            <span className="flex shrink-0 h-[22px] w-[22px] items-center justify-center rounded-full bg-academy-soft text-[11px] font-bold text-academy-primary mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-[15px] font-medium text-slate-700 leading-snug">{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    <div className="mt-auto pt-8 grid grid-cols-1 gap-3">
                      {activeBoxStep.actions.map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          onClick={action.onClick}
                          className={`rounded-[16px] px-4 py-4 text-[16px] font-bold active:scale-[0.98] transition-all ${
                            action.primary
                              ? 'bg-academy-primary text-white shadow-[0_4px_12px_rgba(0,165,160,0.2)] hover:bg-academy-primary-dark'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Guia Rápido (Se der branco) */}
              <section className="rounded-[28px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-black/[0.02]">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Shield size={14} className="text-slate-400" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Guia de Sobrevivência</p>
                    </div>
                    <h3 className="text-[17px] font-bold tracking-tight text-slate-900">{selectedBoxGuide.label}</h3>
                  </div>
                </div>

                {!inferredBoxProcedure && (
                  <div className="mb-3 -mx-1 overflow-x-auto pb-1 hide-scrollbar">
                    <div className="flex min-w-max gap-2 px-1">
                      {boxGuideProcedures.map(({ key, shortLabel }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedBoxProcedure(key);
                            setSelectedBoxDoubt(null);
                          }}
                          className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
                            selectedBoxProcedure === key 
                              ? 'border-academy-primary bg-academy-primary text-white' 
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {shortLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="-mx-1 overflow-x-auto pb-1 hide-scrollbar">
                  <div className="flex min-w-max gap-2 px-1">
                    {selectedBoxGuide.doubtChips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setSelectedBoxDoubt((current) => current === chip ? null : chip)}
                        className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
                          selectedBoxDoubt === chip 
                            ? 'bg-slate-800 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                          {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedBoxDoubt && (
                  <div className="mt-4 rounded-[20px] bg-slate-50 p-4 border border-slate-100">
                    <p className="mb-1 text-[12px] font-bold uppercase tracking-wider text-slate-500">{selectedBoxDoubt}</p>
                    <p className="mb-4 text-[14px] font-medium text-slate-600">Apenas o essencial para você destravar agora.</p>
                    <div className="space-y-3">
                      {selectedDoubtItems.map((item) => (
                        <div key={item} className="flex gap-3">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-academy-primary" />
                          <span className="text-[14px] font-medium leading-relaxed text-slate-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      {false && isBoxModeOpen && (
        <div className="fixed inset-0 z-[196] bg-[#F8F7FC] overflow-y-auto">
          <div className="min-h-screen pb-6">
            <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#F8F7FC]/95 backdrop-blur-xl">
              <div className="mx-auto max-w-[720px] px-3 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBoxModeOpen(false)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 active:scale-[0.96]"
                  >
                    Voltar
                  </button>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[20px] font-black tracking-[-0.03em] text-slate-950 leading-none">Modo Box</h2>
                    <p className="mt-1 truncate text-[12px] font-semibold text-slate-500">{patient?.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBoxModeOpen(false);
                      setIsAddingEvolution(true);
                    }}
                    className="rounded-full bg-primary px-3 py-2 text-[12px] font-bold text-white shadow-[0_5px_14px_color-mix(in_srgb,var(--neo)_22%,transparent)] active:scale-[0.96]"
                  >
                    Evolucao
                  </button>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-[720px] px-3 py-3 space-y-3">
              <section className="rounded-[22px] border border-primary/15 bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.05)]">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.13em] text-primary/70">O que importa agora</p>
                    <h3 className="mt-1 text-[22px] font-black tracking-[-0.035em] text-slate-950">Atendimento atual</h3>
                  </div>
                  {(boxContextProcedure || boxContextTooth) && (
                    <span className="max-w-[42%] rounded-full bg-primary/8 px-2.5 py-1 text-right text-[10px] font-black uppercase tracking-[0.06em] text-primary">
                      {[boxContextProcedure, boxContextTooth].filter(Boolean).join(' - ')}
                    </span>
                  )}
                </div>

                <ul className="space-y-2">
                  {boxNowItems.map((item) => (
                    <li key={String(item)} className="grid grid-cols-[9px_1fr] gap-2 text-[13px] font-semibold leading-snug text-slate-700">
                      <span className="mt-[5px] h-2 w-2 rounded-full bg-primary/75" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[18px] border border-slate-200 bg-white p-3 shadow-[0_4px_18px_rgba(15,23,42,0.035)]">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">Agora</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {boxNowSteps.map((step, index) => (
                    <span
                      key={step}
                      className={`min-w-max rounded-full border px-3 py-1.5 text-[11px] font-black ${
                        index === 0
                          ? 'border-primary/25 bg-primary/8 text-primary'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_4px_18px_rgba(15,23,42,0.035)]">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">Se bater duvida</p>
                    <h3 className="text-[15px] font-black text-slate-950">
                      {inferredBoxProcedure ? selectedBoxGuide.label : 'Escolher guia'}
                    </h3>
                  </div>
                  {!inferredBoxProcedure && (
                    <span className="text-[10px] font-bold text-slate-400">sem procedimento em foco</span>
                  )}
                </div>

                {!inferredBoxProcedure && (
                  <div className="mb-3 -mx-1 overflow-x-auto pb-1">
                    <div className="flex min-w-max gap-1.5 px-1">
                      {boxGuideProcedures.map(({ key, shortLabel }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedBoxProcedure(key);
                            setSelectedBoxDoubt(null);
                          }}
                          className={`rounded-full border px-3 py-1.5 text-[12px] font-extrabold ${
                            selectedBoxProcedure === key
                              ? 'border-primary bg-primary text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-600'
                          }`}
                        >
                          {shortLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="-mx-1 overflow-x-auto pb-1">
                  <div className="flex min-w-max gap-1.5 px-1">
                    {selectedBoxGuide.doubtChips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setSelectedBoxDoubt((current) => current === chip ? null : chip)}
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-extrabold ${
                          selectedBoxDoubt === chip
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 rounded-[16px] border border-slate-200 bg-slate-50/80 p-3">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[0.1em] text-slate-500">
                    {selectedBoxDoubt || 'Resumo rapido'}
                  </p>
                  <div className="space-y-2">
                    {selectedDoubtItems.length > 0 ? (
                      selectedDoubtItems.map((item) => (
                        <div key={item} className="grid grid-cols-[8px_1fr] gap-2 text-[12px] font-semibold leading-snug text-slate-700">
                          <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary/70" />
                          <span>{item}</span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[12px] bg-white px-3 py-2 text-[12px] font-semibold text-slate-500">
                        Escolha um assunto acima apenas se travar durante o atendimento.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_4px_18px_rgba(15,23,42,0.035)]">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">Fechar atendimento</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBoxModeOpen(false);
                      setIsAddingEvolution(true);
                    }}
                    className="rounded-[16px] bg-primary px-3 py-3 text-[13px] font-black text-white active:scale-[0.98]"
                  >
                    Registrar evolucao
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBoxModeOpen(false);
                      setAppActiveTab('agenda');
                      appNavigate('/agenda');
                    }}
                    className="rounded-[16px] border border-slate-200 bg-slate-50 px-3 py-3 text-[13px] font-black text-slate-800 active:scale-[0.98]"
                  >
                    Marcar retorno
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {false && isBoxModeOpen && (
        <div className="fixed inset-0 z-[195] bg-[#F8F7FC] overflow-y-auto">
          <div className="min-h-screen pb-8">
            <div className="sticky top-0 z-10 bg-[#F8F7FC]/95 backdrop-blur-xl border-b border-slate-200/70">
              <div className="max-w-[760px] mx-auto px-3 sm:px-4 py-3">
                <div className="rounded-[18px] border border-slate-200/80 bg-white px-3 py-3 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBoxModeOpen(false)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 active:scale-[0.96]"
                    aria-label="Voltar ao prontuário"
                  >
                    Voltar
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <h2 className="text-[20px] font-black tracking-[-0.03em] text-slate-950 leading-none">Modo Box</h2>
                    </div>
                    <p className="text-[12px] font-semibold text-slate-600 truncate">{patient?.name}</p>
                    {(boxContextProcedure || boxContextTooth) && (
                      <p className="mt-1 text-[11px] font-bold text-primary truncate">
                        {[boxContextProcedure, boxContextTooth].filter(Boolean).join(' - ')}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBoxModeOpen(false);
                      setIsAddingEvolution(true);
                    }}
                    className="shrink-0 rounded-full bg-primary px-3 py-2 text-[12px] font-bold text-white shadow-[0_5px_14px_color-mix(in_srgb,var(--neo)_22%,transparent)] active:scale-[0.96]"
                  >
                    Registrar evolucao
                  </button>
                </div>

                <div className="hidden">
                  <div className="w-12 h-12 rounded-[20px] bg-white/15 flex items-center justify-center mb-4">
                    <BookOpen size={22} />
                  </div>
                  <h2 className="text-[32px] font-black tracking-[-0.04em] leading-none">Modo Box</h2>
                  <p className="text-[14px] text-white/78 font-medium leading-relaxed mt-3">Guia rápido para consultar durante a clínica</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                    <button
                      type="button"
                      onClick={() => setIsBoxModeOpen(false)}
                      className="rounded-[18px] bg-white text-primary px-4 py-3 text-sm font-bold shadow-sm active:scale-[0.98]"
                    >
                      Voltar ao prontuário
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsBoxModeOpen(false);
                        setIsAddingEvolution(true);
                      }}
                      className="rounded-[18px] bg-white/12 border border-white/18 text-white px-4 py-3 text-sm font-bold active:scale-[0.98]"
                    >
                      Registrar evolução
                    </button>
                  </div>
                </div>
              </div>
            </div>

            </div>

            <div className="max-w-[760px] mx-auto px-3 sm:px-4 py-3 space-y-3">
              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-primary/70 mb-2 px-1">Procedimento</p>
                <div className="-mx-1 overflow-x-auto pb-1">
                  <div className="flex min-w-max gap-1.5 px-1">
                  {boxGuideProcedures.map(({ key, shortLabel }) => {
                    const isSelected = selectedBoxProcedure === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedBoxProcedure(key)}
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-extrabold transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-white shadow-[0_5px_14px_color-mix(in_srgb,var(--neo)_22%,transparent)]'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {shortLabel}
                      </button>
                    );
                  })}
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-end justify-between gap-3 px-1">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-primary/70 mb-1">Ficha de seguranca</p>
                    <h3 className="text-[17px] font-black tracking-[-0.02em] text-slate-950">{selectedBoxGuide.label}</h3>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">consulta rapida</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedBoxGuide.blocks.map((block) => (
                    <article
                      key={block.title}
                      className={`rounded-[16px] border p-3 shadow-[0_3px_12px_rgba(15,23,42,0.035)] ${
                        block.emphasis === 'warning'
                          ? 'border-amber-200 bg-amber-50/80'
                          : block.emphasis === 'record'
                            ? 'border-primary/20 bg-primary/[0.06]'
                            : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2 border-b border-black/5 pb-2">
                        <span className={`h-6 w-6 rounded-lg flex items-center justify-center ${
                          block.emphasis === 'warning'
                            ? 'bg-amber-500 text-white'
                            : block.emphasis === 'record'
                              ? 'bg-primary text-white'
                              : 'bg-slate-900 text-white'
                        }`}>
                          {block.emphasis === 'record' ? <FileText size={13} /> : <CheckCircle2 size={13} />}
                        </span>
                        <h4 className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-900">{block.title}</h4>
                      </div>
                      {block.ordered ? (
                        <ol className="space-y-1.5">
                          {block.items.map((item, index) => (
                            <li key={item} className="grid grid-cols-[22px_1fr] gap-2 text-[12px] font-semibold leading-snug text-slate-700">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-primary ring-1 ring-primary/15">{index + 1}</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <ul className="space-y-1.5">
                          {block.items.map((item) => (
                            <li key={item} className="grid grid-cols-[8px_1fr] gap-2 text-[12px] font-semibold leading-snug text-slate-700">
                              <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary/70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {isAddingEvolution && (
        <div className="fixed inset-0 bg-white z-[200] overflow-y-auto">
          <NovaEvolucao
            patientId={patient.id}
            patientName={patient.name}
            patient={patient}
            appointment={evolutionAppointmentContext}
            boxProcedure={selectedBoxProcedure}
            onSave={async (evolution) => {
              const updatedPatient = {
                ...patient,
                evolution: [evolution, ...(patient.evolution || [])],
              };
              await onUpdatePatient(updatedPatient);
              await onAddEvolution(evolution);
              setIsAddingEvolution(false);
              setEvolutionAppointmentContext(null);
            }}
            onClose={() => { setIsAddingEvolution(false); setEvolutionAppointmentContext(null); }}
          />
        </div>
      )}

      {selectedTreatmentAction && (
        <div className="fixed inset-0 z-[210] flex items-end sm:items-center justify-center bg-slate-900/30 backdrop-blur-[6px] p-0 sm:p-4" onClick={(e) => { if (e.target === e.currentTarget) setSelectedTreatmentAction(null); }}>
          <motion.div
            ref={selectedActionRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="treatment-action-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="w-full sm:max-w-lg chart-sheet sm:!rounded-[14px] max-h-[85vh] overflow-y-auto"
          >
            {/* iOS drag handle */}
            <div className="ios-drag-handle sm:hidden" />

              <div className="mb-5 px-1">
              <p className="chart-sheet-kicker">O que fazer agora</p>
              <h3 id="treatment-action-title" className="chart-sheet-title">{selectedTreatmentAction.procedure}</h3>
              <p className="chart-section-caption mt-1">{formatTreatmentAnchor(selectedTreatmentAction)}</p>
            </div>

            <div className="space-y-2.5">
              {!isAcademyProduct && selectedTreatmentAction.requires_prepayment && !selectedTreatmentAction.prepayment_confirmed ? (
                <>
                  <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <Lock size={13} className="text-amber-600" />
                      </div>
                      <p className="text-sm font-bold text-amber-900">Aguardando pagamento</p>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed pl-9">
                      Confirme o recebimento antes de executar.
                      {Number(selectedTreatmentAction.value) > 0 && (
                        <> Valor: <strong>{Number(selectedTreatmentAction.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => confirmPrepayment(selectedTreatmentAction)}
                    className="w-full rounded-[18px] border border-emerald-200 bg-emerald-50 p-4 text-left transition-all duration-200 hover:bg-emerald-100/80 hover:shadow-sm ios-press-gentle"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check size={13} className="text-emerald-700" />
                      </div>
                      <p className="text-sm font-bold text-emerald-900">Pagamento recebido — pode prosseguir</p>
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleCompleteTreatment(selectedTreatmentAction)}
                  className="w-full rounded-[18px] border border-emerald-200 bg-emerald-50 p-4 text-left transition-all duration-200 hover:bg-emerald-100/80 hover:shadow-sm ios-press-gentle"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Procedimento concluído</p>
                      {!isAcademyProduct && selectedTreatmentAction.requires_prepayment && selectedTreatmentAction.prepayment_confirmed && (
                        <p className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1"><Check size={9} /> Pagamento já confirmado</p>
                      )}
                    </div>
                  </div>
                </button>
              )}

              <div className="rounded-[18px] border border-slate-200/70 bg-slate-50 p-4">
                <p className="mb-3 text-[10px] font-normal text-slate-400">Mudar o procedimento</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Restauracao', 'Canal', 'Extracao', 'Coroa', 'Implante']
                    .filter((proc) => proc !== selectedTreatmentAction.procedure)
                    .map((proc) => (
                      <button
                        key={proc}
                        onClick={() => handleConvertTreatment(selectedTreatmentAction, proc)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-slate-800 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm hover:border-slate-300 ios-press"
                      >
                        {proc}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedTreatmentAction(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 ios-press"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {!isAcademyProduct && showPaymentModal && (() => {
        const unpaid = treatmentInProgress.filter(
          (item: any) => !(item.requires_prepayment && item.prepayment_confirmed)
        );
        const unpaidTotal = unpaid.reduce((s: number, i: any) => s + (Number(i.value) || 0), 0);
        const methods = [
          { key: 'Dinheiro', label: 'Dinheiro', icon: <WalletCards size={16} />, desc: 'Espécie' },
          { key: 'Pix', label: 'Pix', icon: <Zap size={16} />, desc: 'Transferência instantânea' },
          { key: 'Cartão Crédito', label: 'Cartão Crédito', icon: <CreditCard size={16} />, desc: 'Crédito' },
          { key: 'Cartão Débito', label: 'Cartão Débito', icon: <CreditCard size={16} />, desc: 'Débito' },
          { key: 'Transferência', label: 'Transferência', icon: <ArrowUpRight size={16} />, desc: 'TED/DOC' },
        ];
        return (
          <div className="fixed inset-0 z-[220] flex items-end sm:items-center justify-center bg-slate-900/30 backdrop-blur-[6px] p-0 sm:p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowPaymentModal(false); }}>
              <motion.div
                ref={paymentModalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-modal-title"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 28, stiffness: 340 }}
                className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] border border-slate-200/60 bg-white p-5 sm:p-6 shadow-[0_-8px_40px_rgba(15,23,42,0.12),0_28px_70px_rgba(15,23,42,0.18)] max-h-[85vh] overflow-y-auto"
              >
              {/* iOS drag handle */}
              <div className="ios-drag-handle sm:hidden" />
              <div className="mb-5">
                <p className="chart-sheet-kicker">Pagamento</p>
                <h3 id="payment-modal-title" className="chart-sheet-title">Receber</h3>
                <div className="mt-3 flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] bg-slate-50 border border-slate-200/70">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-500 font-medium">{unpaid.length} procedimento{unpaid.length !== 1 ? 's' : ''} pendente{unpaid.length !== 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-[16px] font-bold text-slate-950 shrink-0">
                    {unpaidTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <p className="text-[10px] font-normal text-slate-400 mb-2.5">Forma de pagamento</p>
              <div className="space-y-1.5">
                {methods.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={async () => {
                      setShowPaymentModal(false);
                      await confirmPrepaymentAll(m.key);
                    }}
                    className="w-full rounded-[16px] border border-slate-200/60 bg-white px-4 py-3.5 flex items-center gap-3 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-sm ios-press-gentle"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      {m.icon}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800">{m.label}</p>
                      <p className="text-[11px] text-slate-400">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 ios-press"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        );
      })()}

    </div>
  );
};
