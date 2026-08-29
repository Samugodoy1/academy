import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Link, useNavigate, Navigate } from 'react-router-dom';
import { API_URL } from './config';
import {
  Users,
  Calendar,
  CalendarPlus,
  CalendarDays,
  ClipboardList,
  DollarSign,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Clock,
  CheckCircle2,
  CheckCircle,
  Check,
  AlertCircle,
  AlertTriangle,
  LogOut,
  Settings,
  ImageIcon,
  Bell,
  Lock,
  Trash2,
  Printer,
  Upload,
  FileText,
  Phone,
  MapPin,
  Building2,
  Shield,
  Home,
  Sparkles,
  Activity,
  UserCog,
  UserCircle,
  X,
  List,
  UserPlus,
  Camera,
  Pencil,
  Mail,
  Download,
  LinkIcon,
  BookOpen,
  Stethoscope
} from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Odontogram } from './components/Odontogram';
import { TermsPage, PrivacyPage } from './components/LegalPages';
import { NovaEvolucao } from './components/NovaEvolucao';
import { AcademyDashboard } from './components/AcademyDashboard';
import { DataLoadingSkeleton } from './components/DataLoadingSkeleton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PreAtendimento } from './components/PreAtendimento';
import { PatientPortal } from './components/PatientPortal';
import { SubscriptionCallback } from './components/SubscriptionCallback';
import {
  addMinutesToLocalDateTime,
  createLocalDateTime,
  formatAppointmentDate,
  formatAppointmentDateInputValue,
  formatAppointmentTime,
  formatAppointmentTimeInputValue,
  formatDate,
  formatDateInputValue,
  formatTimeInputValue,
  getAppointmentTime,
  getFreeSlots,
  getSuggestion,
  isOverdue,
  isSameAppointmentDay,
  parseAppointmentDateTime,
  FreeSlot,
} from './utils/dateUtils';
import { PRODUCT_LABEL, type ProductCode } from './config/product';
import { formatProcedure } from './utils/patientCardMeta';
import type {
  Patient,
  Appointment,
  Transaction,
  Dentist,
  CurrentUser,
  Product,
  ProductAccess,
  PaymentPlan,
  Installment,
} from './types/clinical';
import { DEFAULT_PRODUCT, ACADEMY_DISABLED_TABS } from './app/constants';
import { SidebarItem } from './features/shell/SidebarItem';
import { BottomNavItem } from './features/shell/BottomNavItem';
import { ClinicalPageRoute } from './features/clinical/ClinicalPageRoute';
import { LegacyClinicalRedirect } from './features/clinical/LegacyClinicalRedirect';
import { UpgradeLimitModal } from './features/modals/UpgradeLimitModal';
import { ForgotPassword } from './features/auth/ForgotPassword';
import { ResetPassword } from './features/auth/ResetPassword';
import PrintDocument from './features/print/PrintRoutes';
import { useAgendaState } from './features/agenda/useAgendaState';
import { AppProvider } from './app/AppProvider';

const AcademyEstudos = lazy(() =>
  import('./components/AcademyEstudos').then(m => ({ default: m.AcademyEstudos }))
);
const AgendaTab = lazy(() =>
  import('./features/agenda/AgendaTab').then(m => ({ default: m.AgendaTab }))
);
const PacientesTab = lazy(() =>
  import('./features/pacientes/PacientesTab').then(m => ({ default: m.PacientesTab }))
);
const AdminTab = lazy(() =>
  import('./features/admin/AdminTab').then(m => ({ default: m.AdminTab }))
);
const ConfigTab = lazy(() =>
  import('./features/config/ConfigTab').then(m => ({ default: m.ConfigTab }))
);

export default function App() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agenda' | 'pacientes' | 'estudos' | 'financeiro' | 'documentos' | 'prontuario' | 'configuracoes' | 'admin' | 'portal' | 'inteligencia' | 'academy'>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'patients' | 'finance'>('patients');
  const [exportFilters, setExportFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString('en-CA'),
    endDate: new Date().toLocaleDateString('en-CA'),
    patientId: 'all',
    category: 'all',
  });

  const exportPatients = async () => {
    let filteredP = patients;
    if (exportFilters.patientId !== 'all') {
      filteredP = filteredP.filter(p => p.id.toString() === exportFilters.patientId);
    }
    if (exportFilters.startDate) {
      filteredP = filteredP.filter(p => p.created_at && p.created_at.split('T')[0] >= exportFilters.startDate);
    }
    if (exportFilters.endDate) {
      filteredP = filteredP.filter(p => p.created_at && p.created_at.split('T')[0] <= exportFilters.endDate);
    }

    const data = filteredP.map(p => ({
      'ID': p.id,
      'Nome Completo': p.name,
      'Telefone': p.phone,
      'Email': p.email,
      'Data de Nascimento': p.birth_date ? formatDate(p.birth_date) : '',
      'CPF': p.cpf || '',
      'Endereço': p.address || '',
      'Observações': p.anamnesis?.medical_history || '',
      'Data de Cadastro': p.created_at ? formatDate(p.created_at) : '',
      'Dentista Responsável': profile?.name || user?.name
    }));

    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pacientes");
    XLSX.writeFile(wb, `Pacientes_${new Date().toLocaleDateString('en-CA')}.xlsx`);
    setIsExportModalOpen(false);
  };

  const exportFinance = async () => {
    let filteredT = transactions;
    if (exportFilters.startDate) {
      filteredT = filteredT.filter(t => t.date >= exportFilters.startDate);
    }
    if (exportFilters.endDate) {
      filteredT = filteredT.filter(t => t.date <= exportFilters.endDate);
    }
    if (exportFilters.patientId !== 'all') {
      filteredT = filteredT.filter(t => t.patient_id?.toString() === exportFilters.patientId);
    }
    if (exportFilters.category === 'income') {
      filteredT = filteredT.filter(t => t.type === 'INCOME');
    } else if (exportFilters.category === 'expense') {
      filteredT = filteredT.filter(t => t.type === 'EXPENSE');
    }

    const transactionData = filteredT.map(t => ({
      'Data': formatDate(t.date),
      'Paciente': t.patient_name || 'N/A',
      'Procedimento': t.procedure || t.description,
      'Categoria': t.type === 'INCOME' ? 'Receita' : 'Despesa',
      'Valor': t.amount,
      'Forma de Pagamento': t.payment_method,
      'Status': 'Pago',
      'Dentista Responsável': profile?.name || user?.name,
      'Observações': t.notes || '',
      'Valor Total do Tratamento': '',
      'Número de Parcelas': '',
      'Número da Parcela': '',
      'Valor da Parcela': '',
      'Data de Vencimento': '',
      'Status da Parcela': '',
      'Data de Pagamento': ''
    }));

    const installmentData = installments.filter(inst => {
      if (exportFilters.startDate && inst.due_date < exportFilters.startDate) return false;
      if (exportFilters.endDate && inst.due_date > exportFilters.endDate) return false;
      if (exportFilters.patientId !== 'all' && inst.patient_id?.toString() !== exportFilters.patientId) return false;
      if (exportFilters.category === 'expense') return false; // Installments are income
      return true;
    }).map(inst => {
      const plan = paymentPlans.find(p => p.id === inst.payment_plan_id);
      const patient = patientMap.get(inst.patient_id);
      return {
        'Data': formatDate(inst.due_date),
        'Paciente': patient?.name || 'N/A',
        'Procedimento': inst.procedure || plan?.procedure || 'Parcelamento',
        'Categoria': 'Receita (Parcela)',
        'Valor': inst.amount,
        'Forma de Pagamento': inst.status === 'PAID' ? 'N/A' : 'Pendente',
        'Status': inst.status === 'PAID' ? 'Pago' : (isOverdue(inst.due_date) ? 'Atrasado' : 'Pendente'),
        'Dentista Responsável': profile?.name || user?.name,
        'Observações': `Parcela ${inst.number}/${plan?.installments_count || '?'}`,
        'Valor Total do Tratamento': plan?.total_amount || 0,
        'Número de Parcelas': plan?.installments_count || 0,
        'Número da Parcela': inst.number,
        'Valor da Parcela': inst.amount,
        'Data de Vencimento': formatDate(inst.due_date),
        'Status da Parcela': inst.status,
        'Data de Pagamento': inst.payment_date ? formatDate(inst.payment_date) : ''
      };
    });

    const combinedData = [...transactionData, ...installmentData];

    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet(combinedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financeiro");
    XLSX.writeFile(wb, `Financeiro_${new Date().toLocaleDateString('en-CA')}.xlsx`);
    setIsExportModalOpen(false);
  };
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: false, product: DEFAULT_PRODUCT });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    product: DEFAULT_PRODUCT,
    acceptedTerms: false,
    acceptedPrivacyPolicy: false,
    acceptedResponsibility: false
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientTab, setSelectedPatientTab] = useState<'evolucao' | 'imagens' | 'financeiro'>('evolucao');
  const [pendingEvolutionAppointment, setPendingEvolutionAppointment] = useState<any>(null);
  const [isAnamnesisEditing, setIsAnamnesisEditing] = useState(false);
  const [showTreatmentPlanSummary, setShowTreatmentPlanSummary] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [upgradeLimitModal, setUpgradeLimitModal] = useState<{
    open: boolean;
    limit: number;
    currentUsage: number;
    product: string;
    upgradePlan: string;
    feature?: 'pdf' | 'cases' | 'appointments';
  }>({
    open: false,
    limit: 0,
    currentUsage: 0,
    product: 'academy',
    upgradePlan: 'student',
  });
  const [isDentistModalOpen, setIsDentistModalOpen] = useState(false);
  const [isEditDentistModalOpen, setIsEditDentistModalOpen] = useState(false);
  const [editingDentist, setEditingDentist] = useState<any>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientListFilter, setPatientListFilter] = useState<'all' | 'pending' | 'scheduled'>('all');
  const [patientActionsToday, setPatientActionsToday] = useState<Set<number>>(new Set());
  const [patientsInlineFeedback, setPatientsInlineFeedback] = useState('');
  const [patientsSubView, setPatientsSubView] = useState<'list' | 'portal'>('list');
  const [portalPendingCount, setPortalPendingCount] = useState(0);
  const [patientIntelligence, setPatientIntelligence] = useState<any[]>([]);
  const [patientIntelLoaded, setPatientIntelLoaded] = useState(false);
  const [dentistSearchTerm, setDentistSearchTerm] = useState('');
  const [dentistStatusFilter, setDentistStatusFilter] = useState<'all' | ProductApprovalStatus>('all');
  const [adminProductFilter, setAdminProductFilter] = useState<'all' | Product>('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendaViewMode, setAgendaViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedWeekDay, setSelectedWeekDay] = useState<number>(new Date().getDay());
  const [now, setNow] = useState(new Date());
  const [monthSheetSelectedDay, setMonthSheetSelectedDay] = useState<Date | null>(null);
  const [weekSheetSelectedAppointment, setWeekSheetSelectedAppointment] = useState<Appointment | null>(null);
  const [weekSuggestionSheet, setWeekSuggestionSheet] = useState<{ date: Date; start: string; end: string; duration: number; procedure: string } | null>(null);

  useEffect(() => {
    if (activeTab !== 'dashboard' && activeTab !== 'agenda' && activeTab !== 'pacientes') return;
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const [statusFilter, setStatusFilter] = useState<string[]>(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);
  const [agendaSearchTerm, setAgendaSearchTerm] = useState('');

  // ─── O(1) patient lookup map ─────────────────────────────────────────
  const patientMap = useMemo(() => {
    const map = new Map<number, typeof patients[0]>();
    for (const p of patients) map.set(p.id, p);
    return map;
  }, [patients]);

  // ─── Memoized filtered appointments ──────────────────────────────────
  const filteredAppointments = useMemo(() => {
    const effectiveStatusFilter = [...statusFilter, 'FINISHED', 'NO_SHOW'].filter((v, i, a) => a.indexOf(v) === i);
    let filtered = appointments
      .filter(a => effectiveStatusFilter.length === 0 || effectiveStatusFilter.includes(a.status))
      .filter(a => agendaSearchTerm === '' || (a.patient_name || '').toLowerCase().includes((agendaSearchTerm || '').toLowerCase()));

    if (agendaViewMode === 'day') {
      filtered = filtered.filter(a => {
        const appDate = parseAppointmentDateTime(a.start_time);
        if (!appDate) return false;
        return appDate.toDateString() === selectedDate.toDateString();
      });
    } else if (agendaViewMode === 'week') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      filtered = filtered.filter(a => {
        const appDate = parseAppointmentDateTime(a.start_time);
        if (!appDate) return false;
        return appDate >= startOfWeek && appDate <= endOfWeek;
      });
    } else if (agendaViewMode === 'month') {
      filtered = filtered.filter(a => {
        const appDate = parseAppointmentDateTime(a.start_time);
        if (!appDate) return false;
        return appDate.getMonth() === selectedDate.getMonth() && appDate.getFullYear() === selectedDate.getFullYear();
      });
    }

    return filtered.sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));
  }, [appointments, statusFilter, agendaSearchTerm, agendaViewMode, selectedDate]);

  const getPatientWeekRole = useCallback((appointment: Appointment, weekAppointments: Appointment[]) => {
    const patientWeekAppointments = weekAppointments
      .filter(app => app.patient_id === appointment.patient_id)
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));
    const appointmentIndex = patientWeekAppointments.findIndex(app => app.id === appointment.id);

    const hasPreviousCare = appointments.some(other =>
      other.patient_id === appointment.patient_id &&
      other.id !== appointment.id &&
      getAppointmentTime(other.start_time) < getAppointmentTime(appointment.start_time) &&
      !['CANCELLED', 'NO_SHOW'].includes(String(other.status || '').toUpperCase())
    );

    if (appointmentIndex > 0) return hasPreviousCare ? 'Retorno' : 'Continuação';
    return hasPreviousCare ? 'Retorno' : 'Primeira consulta';
  }, [appointments]);

  const agendaSmartCopy = useMemo(() => {
    const activeStatuses = new Set(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekAppointments = appointments
      .filter(app => activeStatuses.has(String(app.status || '').toUpperCase()))
      .filter(app => {
        const appDate = parseAppointmentDateTime(app.start_time);
        if (!appDate) return false;
        return appDate >= startOfWeek && appDate <= endOfWeek;
      })
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

    if (weekAppointments.length === 0) return 'Semana tranquila por enquanto.';

    const repeatedPatient = (Array.from(
      weekAppointments.reduce((map, app) => {
        const key = app.patient_id || app.patient_name;
        const current = map.get(key) || [];
        current.push(app);
        map.set(key, current);
        return map;
      }, new Map<any, Appointment[]>()).values()
    ) as Appointment[][])
      .filter(items => items.length > 1)
      .sort((a, b) => b.length - a.length)[0];

    if (repeatedPatient) {
      const ordered = [...repeatedPatient].sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));
      const firstAppointment = ordered[0];
      const firstName = (firstAppointment.patient_name || 'Paciente').split(' ')[0];
      const days = ordered
        .map(app => formatAppointmentDate(app.start_time, { weekday: 'long' }).replace('-feira', ''))
        .filter((day, index, list) => list.indexOf(day) === index)
        .join(' e ');
      const time = formatAppointmentTime(firstAppointment.start_time);
      const firstRole = getPatientWeekRole(firstAppointment, weekAppointments);
      const firstAction = firstRole === 'Primeira consulta'
        ? 'Anamnese primeiro.'
        : 'Revise a evolução.';
      return `${firstName}: ${ordered.length} atendimentos. ${days}, ${time}. ${firstAction}`;
    }

    const hasPreviousCare = (app: Appointment) => {
      const patient = patientMap.get(app.patient_id);
      const evolutions = patient?.evolution || patient?.clinicalEvolution || [];
      const hasEvolution = Array.isArray(evolutions) && evolutions.length > 0;
      const hasLastEvolution = Boolean(patient?.last_evolution_date);
      const hasPastAppointment = appointments.some(other =>
        other.patient_id === app.patient_id &&
        other.id !== app.id &&
        getAppointmentTime(other.start_time) < getAppointmentTime(app.start_time) &&
        !['CANCELLED', 'NO_SHOW'].includes(String(other.status || '').toUpperCase())
      );
      return hasEvolution || hasLastEvolution || hasPastAppointment;
    };

    const firstConsultation = weekAppointments.find(app => !hasPreviousCare(app));
    if (firstConsultation) {
      const firstName = (firstConsultation.patient_name || 'Paciente').split(' ')[0];
      return `${firstName} faz primeira consulta. Anamnese antes do box.`;
    }

    const returnAppointment = weekAppointments.find(app => hasPreviousCare(app));
    if (returnAppointment) return 'Retorno marcado. Revise a última evolução.';

    const todayAppointment = weekAppointments.find(app => isSameAppointmentDay(app.start_time, now));
    if (todayAppointment) return 'Hoje tem clínica.';

    const nextAppointment = weekAppointments.find(app => getAppointmentTime(app.start_time) >= now.getTime()) || weekAppointments[0];
    const day = formatAppointmentDate(nextAppointment.start_time, { weekday: 'long' })
      .replace('-feira', '');
    return `Seu próximo atendimento é ${day} com ${nextAppointment.patient_name}.`;
  }, [appointments, getPatientWeekRole, now, patientMap, selectedDate]);

  const [agendaFocusMode, setAgendaFocusMode] = useState(false);
  const [academyView, setAcademyView] = useState<'home' | 'pacientes' | 'agenda' | 'estudos' | 'checklist'>('home');

  const getCurrentProduct = useCallback((): Product => DEFAULT_PRODUCT, []);

  const getProductAccess = useCallback((product: Product) => {
    return user?.product_accesses?.find(access => access.product === product) || null;
  }, [user?.product_accesses]);

  const hasApprovedProductAccess = useCallback((product: Product) => {
    return getProductAccess(product)?.approval_status === 'approved';
  }, [getProductAccess]);

  // ─── Agenda date navigation helper ───────────────────────────────────
  const navigateDate = useCallback((direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') { setSelectedDate(new Date()); return; }
    setSelectedDate(prev => {
      const d = new Date(prev);
      const delta = direction === 'next' ? 1 : -1;
      if (agendaViewMode === 'day' || agendaFocusMode) d.setDate(d.getDate() + delta);
      else if (agendaViewMode === 'week') d.setDate(d.getDate() + 7 * delta);
      else d.setMonth(d.getMonth() + delta);
      return d;
    });
  }, [agendaViewMode, agendaFocusMode]);

  // ─── Keyboard shortcuts (agenda) ─────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'agenda') return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); navigateDate('prev'); break;
        case 'ArrowRight': e.preventDefault(); navigateDate('next'); break;
        case 't': case 'T': e.preventDefault(); navigateDate('today'); break;
        case '1': e.preventDefault(); setAgendaFocusMode(false); setAgendaViewMode('day'); break;
        case '2': e.preventDefault(); setAgendaFocusMode(false); setAgendaViewMode('week'); break;
        case '3': e.preventDefault(); setAgendaFocusMode(false); setAgendaViewMode('month'); break;
        case 'n': case 'N': e.preventDefault(); openAppointmentModal(); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, navigateDate]);
  const [isEvolutionFormOpen, setIsEvolutionFormOpen] = useState(false);
  const [newEvolution, setNewEvolution] = useState({ notes: '', procedure: '' });
  const [newDentist, setNewDentist] = useState({ name: '', email: '', password: '' });
  const [newImage, setNewImage] = useState<{ url: string, description: string, file: File | null }>({ url: '', description: '', file: null });
  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    patient_name: '',
    dentist_id: '',
    date: '',
    time: '',
    duration: '',
    notes: ''
  });
  const appointmentPresets = [
    { label: 'Limpeza', procedure: 'Limpeza', duration: '40' },
    { label: 'Consulta', procedure: 'Consulta', duration: '30' },
    { label: 'Endo', procedure: 'Endodontia', duration: '90' },
    { label: 'Restauração', procedure: 'Restauração', duration: '60' },
  ];
  const [appointmentModalMode, setAppointmentModalMode] = useState<'schedule' | 'reschedule'>('schedule');
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [suggestedSlot, setSuggestedSlot] = useState<{ date: Date; duration: number; procedure: string } | null>(null);
  const [appointmentFormError, setAppointmentFormError] = useState<string | null>(null);
  const [appointmentConflict, setAppointmentConflict] = useState<Appointment | null>(null);

  const [newPaymentPlan, setNewPaymentPlan] = useState({
    patient_id: '',
    procedure: '',
    total_amount: '',
    installments_count: '1',
    first_due_date: new Date().toLocaleDateString('en-CA')
  });

  const [isPaymentPlanModalOpen, setIsPaymentPlanModalOpen] = useState(false);
  const [isReceiveInstallmentModalOpen, setIsReceiveInstallmentModalOpen] = useState(false);
  const [isViewInstallmentsModalOpen, setIsViewInstallmentsModalOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    cpf: '',
    birth_date: '',
    phone: '',
    email: '',
    address: ''
  });

  // Finance States
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    category: 'Outros',
    amount: '',
    payment_method: 'PIX',
    date: new Date().toLocaleDateString('en-CA'),
    status: 'PAID',
    patient_id: '',
    procedure: '',
    notes: ''
  });

  const [profile, setProfile] = useState<Dentist | null>(null);
  const [profileDraft, setProfileDraft] = useState<Dentist | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profilePassword, setProfilePassword] = useState('');
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [showAcademyUpgradeModal, setShowAcademyUpgradeModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error', celebration?: boolean, onUndo?: () => void, actionLabel?: string, onAction?: () => void } | null>(null);
  const [confirmation, setConfirmation] = useState<{ message: string, onConfirm: () => void } | null>(null);
  const [guideDismissedUntil, setGuideDismissedUntil] = useState<string | null>(null);
  const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success', celebration = false, onUndo?: () => void, actionLabel?: string, onAction?: () => void) => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ message, type, celebration, onUndo, actionLabel, onAction });
    notificationTimerRef.current = setTimeout(() => setNotification(null), onUndo || onAction ? 8000 : celebration ? 5500 : 3000);
  };

  // ─── Implicit Onboarding: milestone tracking ─────────────────────────
  const milestoneKey = (key: string) => `odontohub_milestone_${user?.id ?? 'x'}_${key}`;
  const hasMilestone = (key: string) => localStorage.getItem(milestoneKey(key)) === '1';
  const setMilestone = (key: string) => localStorage.setItem(milestoneKey(key), '1');

  const getGuideStep = (): { message: string; action: string; tab?: string; onClick?: () => void } | null => {
    if (guideDismissedUntil === activeTab) return null;
    if (!user || loading) return null;
    if (patients.length === 0) {
      if (activeTab === 'pacientes') return null; // already there
      return {
        message: 'Comece cadastrando seu primeiro caso clinico',
        action: 'Ir para Casos',
        tab: 'pacientes',
      };
    }
    if (appointments.length === 0) {
      if (activeTab === 'agenda') return null;
      return {
        message: 'Agora agende o primeiro atendimento',
        action: 'Ir para Atendimentos',
        tab: 'agenda',
      };
    }
    const recordOpened = user?.record_opened || hasMilestone('recordOpened');
    if (!recordOpened) {
      if (activeTab === 'prontuario') return null;
      const firstId = patients[0]?.id;
      return {
        message: 'Último passo: abra o caso clínico — evoluções e odontograma ficam no prontuário',
        action: firstId ? 'Abrir caso clínico' : 'Ver Casos',
        tab: 'pacientes',
        onClick: firstId ? () => openPatientRecord(firstId) : undefined,
      };
    }
    return null;
  };

  // Reset guide dismiss when user navigates to a different tab
  useEffect(() => {
    setGuideDismissedUntil(null);
  }, [activeTab]);

  useEffect(() => {
    if (user && !hasApprovedProductAccess(DEFAULT_PRODUCT)) {
      setActiveTab('dashboard');
    }
  }, [activeTab, user?.id, user?.product_accesses]);

  useEffect(() => {
    if (ACADEMY_DISABLED_TABS.has(activeTab)) {
      setActiveTab('dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'DENTIST') {
          // No filter needed
        }
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const userIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (user && user.id !== userIdRef.current) {
      userIdRef.current = user.id;
      fetchData();
      fetchProfile();
      if (user.role?.toUpperCase() === 'ADMIN') {
        fetchAdminUsers();
        apiFetch('/api/admin/update-schema', { product: DEFAULT_PRODUCT }).catch(console.error);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedPatientTab === 'financeiro' && selectedPatient) {
      fetchPatientFinancialHistory(selectedPatient.id);
    }
  }, [selectedPatientTab, selectedPatient?.id]);

  const prevProfileTabRef = useRef<string | null>(null);
  useEffect(() => {
    const isProfileTab = activeTab === 'configuracoes' || activeTab === 'documentos';
    if (isProfileTab && user && prevProfileTabRef.current !== activeTab) {
      prevProfileTabRef.current = activeTab;
      fetchProfile();
    } else if (!isProfileTab) {
      prevProfileTabRef.current = null;
    }
  }, [activeTab]);

  const fetchProfileInFlight = useRef(false);
  const fetchProfile = async () => {
    if (fetchProfileInFlight.current) return;
    fetchProfileInFlight.current = true;
    try {
      const res = await apiFetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setProfileDraft(prev => (isProfileEditing ? prev : data));
        setUser(prev => {
          if (!prev) return prev;
          const currentAccess = data.product_accesses?.find((access: ProductAccess) => access.product === getCurrentProduct());
          const newAccesses = JSON.stringify(data.product_accesses);
          const prevAccesses = JSON.stringify(prev.product_accesses);
          const newOnboarding = currentAccess?.onboarding_completed ?? prev.onboarding_done;
          if (
            newAccesses === prevAccesses &&
            prev.current_product === data.current_product &&
            prev.onboarding_done === newOnboarding &&
            prev.welcome_seen === data.welcome_seen &&
            prev.record_opened === data.record_opened
          ) {
            return prev;
          }
          const updated = {
            ...prev,
            product_accesses: data.product_accesses,
            current_product: data.current_product,
            onboarding_done: newOnboarding,
            welcome_seen: data.welcome_seen,
            record_opened: data.record_opened
          };
          localStorage.setItem('user', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      fetchProfileInFlight.current = false;
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileDraft) return;
    setIsSavingProfile(true);
    try {
      const res = await apiFetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify({ ...profileDraft, password: profilePassword })
      });
      if (res.ok) {
        showNotification('Perfil atualizado com sucesso!');
        setProfilePassword('');
        setIsProfileEditing(false);
        setProfile(profileDraft);
        fetchProfile();
      } else {
        const data = await res.json();
        showNotification(data.error || 'Erro ao atualizar perfil', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('Erro de conexão ao salvar perfil', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const startProfileEditing = () => {
    setProfileDraft(profile ? { ...profile } : null);
    setIsProfileEditing(true);
  };

  const updateProfileDraft = (patch: Partial<Dentist>) => {
    setProfileDraft(prev => prev ? { ...prev, ...patch } : prev);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiFetch('/api/profile/photo', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(prev => prev ? { ...prev, photo_url: data.url } : null);
        showNotification('Foto de perfil atualizada!');
      } else {
        showNotification('Erro ao carregar foto de perfil.', 'error');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      showNotification('Erro ao carregar foto de perfil.', 'error');
    }
  };

  const handlePatientPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPatient) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiFetch(`/api/patients/${selectedPatient.id}/photo`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        // Refresh patient data
        openPatientRecord(selectedPatient.id);
        fetchData(); // Refresh list
        showNotification('Foto do paciente atualizada!');
      } else {
        showNotification('Erro ao carregar foto do paciente.', 'error');
      }
    } catch (error) {
      console.error('Error uploading patient photo:', error);
      showNotification('Erro ao carregar foto do paciente.', 'error');
    }
  };

  const fetchDataInFlight = useRef(false);
  const fetchData = async (explicitToken?: string) => {
    if (!user && !explicitToken) return;
    if (fetchDataInFlight.current) return;
    fetchDataInFlight.current = true;
    try {
      const [pRes, aRes] = await Promise.all([
        apiFetch('/api/patients', { explicitToken }),
        apiFetch('/api/appointments', { explicitToken })
      ]);

      const pData = await pRes.json();
      const aData = await aRes.json();

      let hydratedPatients = Array.isArray(pData) ? pData : [];
      if (DEFAULT_PRODUCT === 'academy' && Array.isArray(pData) && Array.isArray(aData)) {
        const finishedPatientIds = new Set(
          aData
            .filter((appointment: any) => String(appointment.status || '').toUpperCase() === 'FINISHED')
            .map((appointment: any) => Number(appointment.patient_id))
            .filter((patientId: number) => Number.isFinite(patientId))
        );

        const relevantPatientIds = Array.from(finishedPatientIds);

        if (relevantPatientIds.length > 0) {
          const details = await Promise.all(
            relevantPatientIds.map(async (patientId) => {
              try {
                const detailRes = await apiFetch(`/api/patients/${patientId}`, { explicitToken });
                return detailRes.ok ? await detailRes.json() : null;
              } catch (error) {
                console.error('[fetchData] Error hydrating academy patient:', { patientId, error });
                return null;
              }
            })
          );

          const detailById = new Map(
            details
              .filter(Boolean)
              .map((patient: any) => [Number(patient.id), patient])
          );

          hydratedPatients = pData.map((patient: any) => {
            const detail = detailById.get(Number(patient.id));
            return detail ? { ...patient, ...detail } : patient;
          });
        }
      }

      if (Array.isArray(pData)) setPatients(hydratedPatients);
      if (Array.isArray(aData)) setAppointments(aData);
      setTransactions([]);
      setFinancialSummary(null);
      setPaymentPlans([]);
      setInstallments([]);
      setPatientIntelligence([]);
      setPatientIntelLoaded(true);
      setPortalPendingCount(0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      fetchDataInFlight.current = false;
      setLoading(false);
    }
  };

  const handleCreatePaymentPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const patientId = selectedPatient ? selectedPatient.id : newPaymentPlan.patient_id;
      if (!patientId) {
        showNotification('Selecione um paciente', 'error');
        return;
      }

      const res = await apiFetch('/api/finance/payment-plans', {
        method: 'POST',
        body: JSON.stringify({
          ...newPaymentPlan,
          patient_id: patientId,
          total_amount: parseFloat(newPaymentPlan.total_amount),
          installments_count: parseInt(newPaymentPlan.installments_count)
        })
      });
      if (res.ok) {
        setIsPaymentPlanModalOpen(false);
        setNewPaymentPlan({
          patient_id: '',
          procedure: '',
          total_amount: '',
          installments_count: '1',
          first_due_date: new Date().toLocaleDateString('en-CA')
        });
        fetchData();
        if (selectedPatient) {
          fetchPatientFinancialHistory(selectedPatient.id);
        }
      } else {
        const data = await res.json();
        showNotification(data.error || 'Erro ao criar plano de pagamento', 'error');
      }
    } catch (error) {
      console.error('Error creating payment plan:', error);
      showNotification('Erro de conexão ao criar plano', 'error');
    }
  };

  const handlePayInstallment = async (id: number, method: string) => {
    try {
      const res = await apiFetch(`/api/finance/installments/${id}/pay`, {
        method: 'PATCH',
        body: JSON.stringify({
          payment_method: method,
          payment_date: new Date().toLocaleDateString('en-CA')
        })
      });
      if (res.ok) {
        const data = await res.json();
        setIsReceiveInstallmentModalOpen(false);
        setIsViewInstallmentsModalOpen(false);
        fetchData();
        if (selectedPatient) {
          fetchPatientFinancialHistory(selectedPatient.id);
          // Update journey status
          const updatedPatient = {
            ...selectedPatient,
            journey: {
              ...(selectedPatient.journey || {}),
              pagamento: 'CONCLUIDO'
            }
          };
          setSelectedPatient(updatedPatient);
          setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
        }
        // Automatically show receipt
        if (data.transaction) {
          generateReceipt(data.transaction);
        }
      } else {
        const data = await res.json();
        showNotification(data.error || 'Erro ao registrar pagamento', 'error');
      }
    } catch (error) {
      console.error('Error paying installment:', error);
      showNotification('Erro de conexão ao registrar pagamento', 'error');
    }
  };

  const fetchPatientFinancialHistory = async (patientId: number) => {
    try {
      const res = await apiFetch(`/api/patients/${patientId}/financial`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPatient(prev => prev ? { ...prev, financial: data } : null);
      }
    } catch (error) {
      console.error('Error fetching patient financial history:', error);
    }
  };

  const generateReceipt = (transaction: any) => {
    const dentist = adminUsers.find(u => u.id === transaction.dentist_id) || profile;
    setSelectedReceipt({
      id: transaction.id,
      patientName: transaction.patient_name || transaction.patientName || (transaction.patient && transaction.patient.name) || 'Paciente não identificado',
      amount: transaction.amount,
      amountFormatted: Number(transaction.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      procedure: transaction.procedure || transaction.description,
      date: formatDate(transaction.date),
      paymentMethod: transaction.payment_method,
      dentistName: dentist?.name || user?.name,
      dentistCro: dentist?.cro || profile?.cro,
      clinicName: profile?.clinic_name || 'OdontoHub',
      clinicAddress: profile?.clinic_address || ''
    });
    setIsReceiptModalOpen(true);
  };

  const imprimirDocumento = (tipo: string, id: string | number | null = null) => {
    let url = `/print/${tipo}`;
    if (id) {
      url += `/${id}`;
    }

    // Special case for agenda date if not provided as ID
    if (tipo === 'agenda' && !id) {
      const dateStr = formatDateInputValue(selectedDate);
      url += `?date=${dateStr}`;
    }

    window.open(url, "_blank");
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/finance', {
        method: 'POST',
        body: JSON.stringify({
          ...newTransaction,
          type: transactionType,
          amount: parseFloat(newTransaction.amount),
          patient_id: newTransaction.patient_id ? parseInt(newTransaction.patient_id) : null
        })
      });
      if (res.ok) {
        setIsTransactionModalOpen(false);
        setNewTransaction({
          description: '',
          category: 'Outros',
          amount: '',
          payment_method: 'PIX',
          date: new Date().toLocaleDateString('en-CA'),
          status: 'PAID',
          patient_id: '',
          procedure: '',
          notes: ''
        });
        fetchData();
      } else {
        const data = await res.json();
        showNotification(data.error || 'Erro ao salvar transação', 'error');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      showNotification('Erro de conexão ao salvar transação', 'error');
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    setConfirmation({
      message: 'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        try {
          const res = await apiFetch(`/api/finance/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            fetchData();
            showNotification('Transação excluída com sucesso!');
          }
        } catch (error) {
          console.error('Error deleting transaction:', error);
          showNotification('Erro ao excluir transação', 'error');
        }
      }
    });
  };

  const fetchAdminUsers = async () => {
    try {
      const query = `?product=${adminProductFilter}`;
      const res = await apiFetch(`/api/admin/users${query}`, { product: DEFAULT_PRODUCT });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Error fetching admin users (${res.status}):`, errorText);
        return;
      }
      const data = await res.json();
      setAdminUsers(data);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  useEffect(() => {
    if (user?.role?.toUpperCase() === 'ADMIN') {
      fetchAdminUsers();
    }
  }, [adminProductFilter]);

  const updateUserProductAccess = async (access: any, changes: Partial<ProductAccess>) => {
    try {
      const res = await apiFetch(`/api/admin/users/${access.user_id || access.id}`, {
        method: 'PATCH',
        product: DEFAULT_PRODUCT,
        body: JSON.stringify({ product: access.product, ...changes })
      });
      if (res.ok) {
        fetchAdminUsers();
      } else {
        const errorText = await res.text();
        console.error(`Error updating product access (${res.status}):`, errorText);
      }
    } catch (error) {
      console.error('Error updating product access:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        fetchData(data.token);
        if (data.user.role === 'DENTIST') {
          // No filter needed
        }
      } else {
        setLoginError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setLoginError('Erro de conexão com o servidor');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setRegisterMessage('');

    if (!registerData.acceptedTerms || !registerData.acceptedPrivacyPolicy || !registerData.acceptedResponsibility) {
      setLoginError('Você deve aceitar todos os termos e declarações para continuar.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      if (res.ok) {
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: API_URL ? 'include' as const : 'same-origin' as const,
          body: JSON.stringify({
            email: registerData.email,
            password: registerData.password,
            rememberMe: true,
            product: getCurrentProduct(),
          }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('user', JSON.stringify(loginData.user));
          setUser(loginData.user);
          setIsRegistering(false);
          setRegisterMessage('');
          fetchData();
          fetchProfile();
          return;
        }
        setRegisterMessage(data.message);
        setIsRegistering(false);
      } else {
        setLoginError(data.error || 'Erro ao fazer cadastro');
      }
    } catch (error) {
      setLoginError('Erro de conexão com o servidor');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActiveTab('dashboard');
    setLoading(true);
  };

  const updateUserOnboarding = async (field: 'onboarding_done' | 'welcome_seen') => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/profile/onboarding`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-product': getCurrentProduct() },
        body: JSON.stringify({ product: getCurrentProduct(), [field]: true, onboarding_completed: field === 'onboarding_done' ? true : undefined })
      });
    } catch (e) {
      console.error('Failed to update onboarding state', e);
    }
    if (user) {
      const updated = {
        ...user,
        [field]: true,
        product_accesses: field === 'onboarding_done'
          ? user.product_accesses?.map(access => access.product === getCurrentProduct() ? { ...access, onboarding_completed: true } : access)
          : user.product_accesses
      };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  // Dashboard Stats Calculations
  const dashboardNow = new Date();
  const dashboardMonth = dashboardNow.getMonth();
  const dashboardYear = dashboardNow.getFullYear();

  const startOfWeek = new Date(dashboardNow);
  startOfWeek.setDate(dashboardNow.getDate() - dashboardNow.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const weeklyAppointmentsCount = appointments.filter(a => {
    const d = parseAppointmentDateTime(a.start_time);
    if (!d) return false;
    return d >= startOfWeek && d <= endOfWeek;
  }).length;

  const todayStr = formatDateInputValue(new Date());
  const dailyRevenue = financialSummary?.todayRevenue !== undefined
    ? financialSummary.todayRevenue
    : transactions
      .filter(t => {
        const tDate = t.date?.split('T')[0];
        return t.type === 'INCOME' && tDate === todayStr;
      })
      .reduce((acc, t) => acc + Number(t.amount), 0);

  const todayIncome = transactions
    .filter(t => t.type === 'INCOME' && t.date?.split('T')[0] === todayStr)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const todayExpense = transactions
    .filter(t => t.type === 'EXPENSE' && t.date?.split('T')[0] === todayStr)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const absencesToday = appointments.filter(a =>
    isSameAppointmentDay(a.start_time, dashboardNow) &&
    a.status === 'CANCELLED'
  ).length;

  const proceduresToday = appointments.filter(a =>
    isSameAppointmentDay(a.start_time, dashboardNow) &&
    (a.status === 'FINISHED' || a.status === 'IN_PROGRESS')
  ).length;

  const nextAppointments = appointments
    .filter(a => isSameAppointmentDay(a.start_time, dashboardNow) && getAppointmentTime(a.start_time) >= dashboardNow.getTime() && a.status !== 'FINISHED' && a.status !== 'CANCELLED')
    .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time))
    .slice(0, 5);

  const todayAppointmentsTotalCount = appointments.filter(a => isSameAppointmentDay(a.start_time, dashboardNow)).length;
  const todayAppointmentsRemainingCount = appointments.filter(a =>
    isSameAppointmentDay(a.start_time, dashboardNow) &&
    a.status !== 'FINISHED' &&
    a.status !== 'CANCELLED'
  ).length;

  const tomorrowStart = new Date(dashboardNow);
  tomorrowStart.setDate(dashboardNow.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const tomorrowUnconfirmedAppointments = appointments.filter(a => {
    const apptDate = parseAppointmentDateTime(a.start_time);
    if (!apptDate) return false;
    return apptDate >= tomorrowStart && apptDate <= tomorrowEnd && a.status !== 'CONFIRMED' && a.status !== 'CANCELLED';
  }).sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

  const tomorrowUnconfirmedCount = tomorrowUnconfirmedAppointments.length;

  // Weekly Revenue Data for the Chart
  const weeklyRevenueData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = formatDateInputValue(d);
    const amount = transactions
      .filter(t => t.type === 'INCOME' && t.date?.split('T')[0] === dStr)
      .reduce((acc, t) => acc + Number(t.amount), 0);
    return {
      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase(),
      amount
    };
  });

  const maxWeeklyRevenue = Math.max(...weeklyRevenueData.map(d => d.amount), 1);

  const apiFetch = async (url: string, options: any = {}) => {
    const token = options.explicitToken || localStorage.getItem('token');
    const product = options.product || getCurrentProduct();
    const headers: any = {
      'Accept': 'application/json',
      'x-product': product,
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token && token !== 'null' && token !== 'undefined') {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-auth-token'] = token;
    }

    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
    const response = await fetch(fullUrl, { ...options, headers, credentials: API_URL ? 'include' : 'same-origin' });
    if (response.status === 401) {
      try {
        const errorData = await response.json();
        console.warn('Auth error details:', errorData);
      } catch (e) {
        // Not JSON
      }
      handleLogout();
    } else if (response.status === 403) {
      try {
        const errorData = await response.clone().json();
        const message = errorData?.error || '';
        if (message.includes('produto') || message.includes('Conta global')) {
          console.warn('Product access error details:', errorData);
          handleLogout();
        }
      } catch (e) {
        // Not JSON
      }
    }
    return response;
  };

  const openAppointmentModal = (prefill?: { patientId: number; patientName: string }) => {
    const dentist_id = user?.id ? user.id.toString() : (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}')?.id?.toString() : '');

    setAppointmentModalMode('schedule');
    setEditingAppointmentId(null);
    setSuggestedSlot(null);
    setNewAppointment({
      patient_id: prefill ? String(prefill.patientId) : '',
      patient_name: prefill?.patientName || '',
      dentist_id: dentist_id || '',
      date: formatDateInputValue(selectedDate),
      time: '',
      duration: '30',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const getTimeFromPreferredSlot = (preferredTime?: string | null) => {
    switch (preferredTime) {
      case 'manha': return '08:00';
      case 'tarde': return '13:00';
      case 'noite': return '18:00';
      default: return '';
    }
  };

  const openPatientAppointmentModal = (patient: Patient, preferredDate?: string, preferredTime?: string | null) => {
    const dentistId = user?.id ? user.id.toString() : (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}')?.id?.toString() : '');

    setAppointmentModalMode('schedule');
    setEditingAppointmentId(null);
    setSuggestedSlot(null);
    setNewAppointment({
      patient_id: patient.id.toString(),
      patient_name: patient.name,
      dentist_id: dentistId || '',
      date: preferredDate || formatDateInputValue(new Date()),
      time: getTimeFromPreferredSlot(preferredTime),
      duration: '30',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openScheduleSuggestion = (patientId: number, date: string, startTime: string, endTime: string, procedure?: string | null) => {
    const patient = patientMap.get(patientId);
    if (!patient) return;
    const dentistId = user?.id ? user.id.toString() : (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}')?.id?.toString() : '');
    // Calculate duration from start/end times
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const duration = ((eh * 60 + em) - (sh * 60 + sm)).toString();
    setAppointmentModalMode('schedule');
    setEditingAppointmentId(null);
    setSuggestedSlot(null);
    setNewAppointment({
      patient_id: patient.id.toString(),
      patient_name: patient.name,
      dentist_id: dentistId || '',
      date,
      time: startTime,
      duration: duration || '30',
      notes: procedure || ''
    });
    setIsModalOpen(true);
  };

  const openRescheduleAppointment = (appointment: Appointment) => {
    const startDate = parseAppointmentDateTime(appointment.start_time);
    const endDate = parseAppointmentDateTime(appointment.end_time);
    if (!startDate || !endDate) {
      showNotification('Nao foi possivel ler o horario deste atendimento.', 'error');
      return;
    }
    const durationMinutes = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 60000));

    setAppointmentModalMode('reschedule');
    setEditingAppointmentId(appointment.id);
    setSuggestedSlot(null);
    setActiveTab('agenda');
    setAgendaViewMode('day');
    setSelectedDate(startDate);
    setNewAppointment({
      patient_id: appointment.patient_id.toString(),
      patient_name: appointment.patient_name || '',
      dentist_id: appointment.dentist_id?.toString() || (user?.id ? user.id.toString() : ''),
      date: formatAppointmentDateInputValue(startDate),
      time: formatAppointmentTimeInputValue(startDate),
      duration: durationMinutes.toString(),
      notes: appointment.notes || ''
    });
    setIsModalOpen(true);
  };

  const contactPatientOnWhatsApp = (patient: Patient) => {
    if (!patient.phone) {
      showNotification('Este paciente não possui telefone cadastrado.', 'error');
      return;
    }

    let phone = patient.phone.replace(/\D/g, '');
    if (phone.length === 10 || phone.length === 11) {
      phone = `55${phone}`;
    } else if (phone.length > 11 && !phone.startsWith('55')) {
      phone = `55${phone}`;
    }

    const firstName = (patient.name || '').split(' ')[0] || 'Olá';
    const message = `Olá ${firstName}, tudo bem?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const [portalLinkData, setPortalLinkData] = useState<{ url: string; preUrl: string | null; patientName: string } | null>(null);

  const generatePatientPortalLink = async (patient: Patient) => {
    try {
      const res = await apiFetch('/api/portal/generate-link', {
        method: 'POST',
        body: JSON.stringify({ patient_id: patient.id })
      });
      if (!res.ok) {
        const data = await res.json();
        showNotification(data.error || 'Erro ao gerar link', 'error');
        return;
      }
      const data = await res.json();

      // Only show pre-atendimento link for first visit (no finished appointments)
      const hasFinished = appointments.some(a => a.patient_id === patient.id && a.status === 'FINISHED');
      setPortalLinkData({
        url: data.portal_url,
        preUrl: hasFinished ? null : data.pre_atendimento_url,
        patientName: patient.name
      });
    } catch {
      showNotification('Erro de conexão ao gerar link do portal', 'error');
    }
  };

  const getProcedureColor = (procedure: string) => {
    const lower = (procedure || '').toLowerCase();

    if (/endo|canal/.test(lower)) {
      return { bg: '#1e40af', hover: '#1e3a8a' }; // blue-600, blue-800
    } else if (/restaura|resina/.test(lower)) {
      return { bg: '#16a34a', hover: '#15803d' }; // green-600, green-700
    } else if (/extra|exo/.test(lower)) {
      return { bg: '#dc2626', hover: '#991b1b' }; // red-600, red-900
    } else if (/higiene|limpeza|profila/.test(lower)) {
      return { bg: '#ca8a04', hover: '#a16207' }; // yellow-600, yellow-700
    } else if (/ortodo|alinha/.test(lower)) {
      return { bg: '#7c3aed', hover: '#6d28d9' }; // purple-600, purple-700
    } else if (/prot/.test(lower)) {
      return { bg: '#db2777', hover: '#be123c' }; // pink-600, pink-700
    } else {
      return { bg: '#4b5563', hover: '#2d3748' }; // slate-600, slate-800
    }
  };

  const getProcedureByDuration = (minutes: number): string => {
    if (minutes < 30) {
      return 'Avaliação';
    } else if (minutes < 60) {
      return 'Avaliação e limpeza';
    } else if (minutes < 90) {
      return 'Restauração';
    } else if (minutes < 120) {
      return 'Endodontia';
    } else {
      return 'Tratamento complexo';
    }
  };

  const findAvailableSlots = (date: Date, workingHours = { start: 8, end: 18 }) => {
    const dayAppointments = appointments
      .filter(a => {
        const appDate = parseAppointmentDateTime(a.start_time);
        if (!appDate) return false;
        return appDate.toDateString() === date.toDateString();
      })
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

    const slots: Array<{ startTime: Date; endTime: Date; duration: number; procedure: string }> = [];

    // First slot: from working hours start to first appointment
    if (dayAppointments.length === 0) {
      const startTime = new Date(date);
      startTime.setHours(workingHours.start, 0, 0, 0);
      const endTime = new Date(date);
      endTime.setHours(workingHours.end, 0, 0, 0);
      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      slots.push({
        startTime,
        endTime,
        duration,
        procedure: getProcedureByDuration(duration)
      });
    } else {
      // First slot: before first appointment
      const firstAppStart = parseAppointmentDateTime(dayAppointments[0].start_time);
      if (!firstAppStart) return slots;
      if (firstAppStart.getHours() > workingHours.start) {
        const startTime = new Date(date);
        startTime.setHours(workingHours.start, 0, 0, 0);
        const duration = (firstAppStart.getTime() - startTime.getTime()) / (1000 * 60);
        if (duration >= 15) {
          slots.push({
            startTime,
            endTime: firstAppStart,
            duration,
            procedure: getProcedureByDuration(duration)
          });
        }
      }

      // Slots between appointments
      for (let i = 0; i < dayAppointments.length - 1; i++) {
        const currentAppEnd = parseAppointmentDateTime(dayAppointments[i].end_time);
        const nextAppStart = parseAppointmentDateTime(dayAppointments[i + 1].start_time);
        if (!currentAppEnd || !nextAppStart) continue;
        const duration = (nextAppStart.getTime() - currentAppEnd.getTime()) / (1000 * 60);

        if (duration >= 15) {
          slots.push({
            startTime: currentAppEnd,
            endTime: nextAppStart,
            duration,
            procedure: getProcedureByDuration(duration)
          });
        }
      }

      // Last slot: after last appointment
      const lastAppEnd = parseAppointmentDateTime(dayAppointments[dayAppointments.length - 1].end_time);
      if (!lastAppEnd) return slots;
      if (lastAppEnd.getHours() < workingHours.end) {
        const endTime = new Date(date);
        endTime.setHours(workingHours.end, 0, 0, 0);
        const duration = (endTime.getTime() - lastAppEnd.getTime()) / (1000 * 60);
        if (duration >= 15) {
          slots.push({
            startTime: lastAppEnd,
            endTime,
            duration,
            procedure: getProcedureByDuration(duration)
          });
        }
      }
    }

    return slots.sort((a, b) => b.duration - a.duration); // Sort by duration (biggest first)
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentFormError(null);
    setAppointmentConflict(null);

    // Ensure dentist_id is set - fallback to user if not already set
    const dentist_id = newAppointment.dentist_id || (user?.id ? user.id.toString() : null);
    const savedUser = localStorage.getItem('user');
    const fallbackDentistId = dentist_id || (savedUser ? JSON.parse(savedUser)?.id?.toString() : null);

    // Inline validation — no alert()
    if (!newAppointment.patient_id || newAppointment.patient_id === '') {
      setAppointmentFormError('Selecione um paciente da lista.');
      return;
    }
    if (!fallbackDentistId) {
      setAppointmentFormError('Aluno nao identificado. Recarregue a pagina.');
      return;
    }
    if (!newAppointment.date || newAppointment.date === '') {
      setAppointmentFormError('Selecione a data do atendimento.');
      return;
    }
    if (!newAppointment.time || newAppointment.time === '') {
      setAppointmentFormError('Selecione o horário.');
      return;
    }
    if (!newAppointment.duration || newAppointment.duration === '') {
      setAppointmentFormError('Informe a duração em minutos.');
      return;
    }
    const durationMinutes = parseInt(newAppointment.duration, 10);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      setAppointmentFormError('A duração deve ser maior que 0.');
      return;
    }

    const startTimeValue = createLocalDateTime(newAppointment.date, newAppointment.time);
    const endTimeValue = addMinutesToLocalDateTime(startTimeValue, durationMinutes);
    const startTime = parseAppointmentDateTime(startTimeValue);
    const endTime = parseAppointmentDateTime(endTimeValue);
    if (!startTime || !endTime) {
      setAppointmentFormError('Data ou horÃ¡rio invÃ¡lido.');
      return;
    }

    // Conflict detection — check for overlapping appointments
    const conflicting = appointments.find(a => {
      if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') return false;
      if (appointmentModalMode === 'reschedule' && a.id === editingAppointmentId) return false;
      const aStart = getAppointmentTime(a.start_time);
      const aEnd = getAppointmentTime(a.end_time);
      return startTime.getTime() < aEnd && endTime.getTime() > aStart;
    });

    if (conflicting) {
      setAppointmentConflict(conflicting);
      setAppointmentFormError(
        `Conflito: ${conflicting.patient_name} às ${formatAppointmentTime(conflicting.start_time)}-${formatAppointmentTime(conflicting.end_time)}`
      );
      return;
    }

    try {
      const formattedProcedure = formatProcedure(newAppointment.notes || '');
      const body = {
        ...newAppointment,
        notes: formattedProcedure,
        dentist_id: fallbackDentistId,
        start_time: startTimeValue,
        end_time: endTimeValue
      };

      const isReschedule = appointmentModalMode === 'reschedule' && editingAppointmentId !== null;
      const res = await apiFetch(isReschedule ? `/api/appointments/${editingAppointmentId}` : '/api/appointments', {
        method: isReschedule ? 'PUT' : 'POST',
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setSuggestedSlot(null);
        setAppointmentModalMode('schedule');
        setEditingAppointmentId(null);
        setAppointmentFormError(null);
        setAppointmentConflict(null);
        fetchData();

        setNewAppointment({ patient_id: '', patient_name: '', dentist_id: '', date: '', time: '', duration: '', notes: '' });
        const isFirstAppointment = appointments.length === 0 && !isReschedule;
        if (isFirstAppointment) {
          setActiveTab('dashboard');
          navigate('/dashboard');
          const firstPatientId = newAppointment.patient_id ? Number(newAppointment.patient_id) : patients[0]?.id;
          showNotification(
            '🎉 Primeiro atendimento agendado! Agora abra o caso clínico.',
            'success',
            true,
            undefined,
            firstPatientId ? 'Abrir caso clínico' : undefined,
            firstPatientId ? () => openPatientRecord(firstPatientId) : undefined
          );
        } else {
          showNotification(
            isReschedule ? 'Reagendamento salvo com sucesso!' : 'Atendimento agendado com sucesso!',
            'success',
            false
          );
        }
      } else {
        if (data.upgrade_required) {
          setIsModalOpen(false);
          setUpgradeLimitModal({
            open: true,
            limit: data.limit ?? 10,
            currentUsage: data.current_usage ?? 0,
            product: data.product || 'academy',
            upgradePlan: data.upgrade_plan || 'student',
          });
          return;
        }
        setAppointmentFormError(data.error || 'Erro ao realizar agendamento.');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setAppointmentFormError('Erro de conexão. Tente novamente.');
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await apiFetch('/api/patients', {
        method: 'POST',
        body: JSON.stringify(newPatient)
      });
      if (res.ok) {
        const data = await res.json();
        setIsPatientModalOpen(false);
        fetchData();

        const createdName = newPatient.name;
        setNewPatient({ name: '', cpf: '', birth_date: '', phone: '', email: '', address: '' });
        const isFirst = patients.length === 0;
        if (isFirst) {
          setActiveTab('dashboard');
          navigate('/dashboard');
          showNotification(
            '🎉 Primeiro caso cadastrado! Próximo passo: agendar atendimento.',
            'success',
            true,
            undefined,
            'Agendar atendimento',
            () => openAppointmentModal({ patientId: data.id, patientName: createdName })
          );
        } else {
          showNotification('Paciente cadastrado com sucesso!', 'success', false);
        }
      } else {
        const data = await res.json();
        if (data.upgrade_required) {
          setIsPatientModalOpen(false);
          setUpgradeLimitModal({
            open: true,
            limit: data.limit ?? 3,
            currentUsage: data.current_usage ?? patients.length,
            product: data.product || 'academy',
            upgradePlan: data.upgrade_plan || 'student',
          });
          return;
        }
        showNotification(data.error || 'Erro ao cadastrar paciente', 'error');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      showNotification('Erro de conexão ao cadastrar paciente', 'error');
    }
  };

  const handleCreateDentist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/dentists', {
        method: 'POST',
        body: JSON.stringify(newDentist)
      });
      if (res.ok) {
        setIsDentistModalOpen(false);
        fetchAdminUsers();
        setNewDentist({ name: '', email: '', password: '' });
        showNotification('Dentista cadastrado com sucesso!');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Erro ao cadastrar dentista', 'error');
      }
    } catch (error) {
      console.error('Error creating dentist:', error);
      showNotification('Erro de conexão ao cadastrar dentista', 'error');
    }
  };

  const handleUpdateDentist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDentist) return;
    try {
      const res = await apiFetch(`/api/admin/users/${editingDentist.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editingDentist.name, email: editingDentist.email })
      });
      if (res.ok) {
        setIsEditDentistModalOpen(false);
        fetchAdminUsers();
        showNotification('Dentista atualizado com sucesso!');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Erro ao atualizar dentista', 'error');
      }
    } catch (error) {
      console.error('Error updating dentist:', error);
      showNotification('Erro de conexão ao atualizar dentista', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage({ ...newImage, url: reader.result as string, file: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !newImage.file) return;
    try {
      await uploadFile(selectedPatient.id, newImage.file, newImage.description);
      setIsImageModalOpen(false);
      setNewImage({ url: '', description: '', file: null });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const isNextAppointment = (app: Appointment, allApps: Appointment[]) => {
    const futureApps = allApps
      .filter(a => getAppointmentTime(a.start_time) > now.getTime() && a.status !== 'CANCELLED' && a.status !== 'FINISHED')
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));
    return futureApps.length > 0 && futureApps[0].id === app.id;
  };

  const updateStatus = async (id: number, status: Appointment['status']) => {
    const previousApp = appointments.find(a => a.id === id);
    const previousStatus = previousApp?.status;
    try {
      const res = await apiFetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (status === 'FINISHED') {
          showNotification('Atendimento concluido. Registre a evolucao do caso quando necessario.', 'success');
        } else {
          const statusLabels: Record<string, string> = {
            SCHEDULED: 'Agendado', CONFIRMED: 'Confirmado', IN_PROGRESS: 'Atendendo',
            FINISHED: 'Finalizado', CANCELLED: 'Cancelado', NO_SHOW: 'Faltou'
          };
          const undoFn = previousStatus ? () => {
            updateStatus(id, previousStatus);
          } : undefined;
          showNotification(`Status alterado para ${statusLabels[status] || status}`, 'success', false, undoFn);
        }
        fetchData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openPatientRecord = async (id: number) => {
    if (!user) return;
    const wasFirstRecord = !(user.record_opened || hasMilestone('recordOpened'));
    try {
      const res = await apiFetch(`/api/patients/${id}`);
      const data = await res.json();
      setSelectedPatient(data);
      setPatients(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p));
      setMilestone('recordOpened');
      try {
        await apiFetch('/api/profile/onboarding', {
          method: 'PATCH',
          body: JSON.stringify({ record_opened: true })
        });
        const updatedUser = { ...user, record_opened: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error saving record opened state:', error);
      }
      navigate(`/prontuario/${id}`);
      if (wasFirstRecord) {
        showNotification(
          '🎉 Caso clínico aberto! Explore o prontuário. Volte ao Início para concluir.',
          'success',
          true,
          undefined,
          'Ir para Início',
          () => { setActiveTab('dashboard'); navigate('/dashboard'); }
        );
      }
    } catch (error) {
      console.error('Error fetching patient record:', error);
    }
  };

  const openPatientEvolution = async (patientId: number, appointment: any) => {
    setPendingEvolutionAppointment(appointment);
    await openPatientRecord(patientId);
  };

  const handleUpdateAnamnesis = async (patientId: number, anamnesisData: any) => {
    try {
      const res = await apiFetch(`/api/patients/${patientId}/anamnesis`, {
        method: 'PUT',
        body: JSON.stringify(anamnesisData)
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const savedAnamnesis = data?.anamnesis || anamnesisData;
        setPatients(prev => prev.map(p => {
          if (p.id === patientId) {
            return { ...p, anamnesis: savedAnamnesis };
          }
          return p;
        }));
        setSelectedPatient(prev => prev?.id === patientId ? { ...prev, anamnesis: savedAnamnesis } : prev);
        showNotification('Anamnese salva com sucesso!');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Erro ao salvar anamnese', 'error');
      }
    } catch (error) {
      console.error('Error saving anamnesis:', error);
      showNotification('Erro de conexão ao salvar anamnese', 'error');
    }
  };

  const saveAnamnesis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    await handleUpdateAnamnesis(selectedPatient.id, selectedPatient.anamnesis);
  };

  const saveOdontogram = async (toothNumber: number, toothData: any) => {
    if (!selectedPatient) return;
    const updatedOdontogram = {
      ...(selectedPatient.odontogram || {}),
      [toothNumber]: toothData
    };

    try {
      const res = await apiFetch(`/api/patients/${selectedPatient.id}/odontogram`, {
        method: 'POST',
        body: JSON.stringify({ data: updatedOdontogram })
      });
      if (res.ok) {
        setSelectedPatient({ ...selectedPatient, odontogram: updatedOdontogram });
      }
    } catch (error) {
      console.error('Error saving odontogram:', error);
    }
  };

  const addToothHistory = async (record: any) => {
    if (!selectedPatient) return;
    try {
      const res = await apiFetch(`/api/patients/${selectedPatient.id}/tooth-history`, {
        method: 'POST',
        body: JSON.stringify(record)
      });
      if (res.ok) {
        // Refresh patient data to show new history
        openPatientRecord(selectedPatient.id);
      }
    } catch (error) {
      console.error('Error adding tooth history:', error);
      throw error;
    }
  };

  const addEvolution = async (evolutionData: any) => {
    if (!user) return;
    const patientId = Number(evolutionData.patient_id || selectedPatient?.id);
    if (!Number.isFinite(patientId)) {
      console.error('[addEvolution] missing patient_id:', { selected_patient_id: selectedPatient?.id, evolutionData });
      showNotification('Nao foi possivel identificar o paciente da evolucao', 'error');
      return;
    }
    const appointmentId = evolutionData.appointment_id === undefined || evolutionData.appointment_id === null || evolutionData.appointment_id === ''
      ? undefined
      : Number(evolutionData.appointment_id);
    const payload = {
      notes: evolutionData.notes,
      procedure_performed: evolutionData.procedure_performed || evolutionData.procedure,
      materials: evolutionData.materials,
      observations: evolutionData.observations,
      appointment_id: Number.isFinite(appointmentId) ? appointmentId : undefined,
    };
    if (import.meta.env.DEV) {
      console.log('[addEvolution] payload:', {
        patient_id: patientId,
        selected_patient_id: selectedPatient?.id,
        appointment_id: payload.appointment_id,
      });
    }
    try {
      const res = await apiFetch(`/api/patients/${patientId}/evolution`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (import.meta.env.DEV) {
        console.log('[addEvolution] response:', { ok: res.ok, data });
      }
      if (res.ok) {
        await fetchData();
        if (selectedPatient?.id === patientId) {
          openPatientRecord(patientId);
        }
        showNotification(evolutionData.appointment_id
          ? 'Atendimento fechado. Evolução salva no prontuário.'
          : 'Registro clínico salvo!');
      } else {
        showNotification(data.error || 'Erro ao registrar evolução', 'error');
      }
    } catch (error) {
      console.error('[addEvolution] error:', error);
      showNotification('Erro de conexão ao registrar evolução', 'error');
    }
  };

  const sendReminder = async (app: Appointment) => {
    if (!app.patient_phone) {
      showNotification('Este paciente não possui telefone cadastrado.', 'error');
      return;
    }

    // Calcula o dia natural da consulta
    const appointmentDate = parseAppointmentDateTime(app.start_time);
    if (!appointmentDate) {
      showNotification('Nao foi possivel ler o horario deste atendimento.', 'error');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    const daysUntilAppointment = Math.floor((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let dayDescription = '';
    if (daysUntilAppointment === 0) {
      dayDescription = 'hoje';
    } else if (daysUntilAppointment === 1) {
      dayDescription = 'amanhã';
    } else if (daysUntilAppointment > 1 && daysUntilAppointment <= 6) {
      const daysOfWeek = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
      const dayOfWeek = appointmentDate.getDay();
      dayDescription = `no próximo ${daysOfWeek[dayOfWeek]}`;
    } else {
      dayDescription = `em ${appointmentDate.toLocaleDateString('pt-BR')}`;
    }

    // Formata a mensagem de WhatsApp conforme solicitado
    const time = formatAppointmentTime(app.start_time);
    const message = `Olá ${app.patient_name}, você confirma sua consulta ${dayDescription} às ${time}?`;

    // Limpa o número de telefone (apenas números)
    let phone = app.patient_phone.replace(/\D/g, '');

    // Garante o formato internacional (55 + DDD + número)
    if (phone.length === 10 || phone.length === 11) {
      phone = '55' + phone;
    } else if (phone.length > 11 && !phone.startsWith('55')) {
      // Se tiver mais de 11 dígitos e não começar com 55, assume que falta o DDI
      phone = '55' + phone;
    }

    // Abre o WhatsApp usando wa.me (melhor compatibilidade mobile/desktop)
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // No mobile, window.open pode ser bloqueado se houver um await antes.
    // Abrimos primeiro e depois fazemos a chamada de log no backend.
    window.open(url, '_blank');

    try {
      // Chama o backend para registrar o lembrete enviado
      await apiFetch(`/api/appointments/${app.id}/remind`, { method: 'POST' });
    } catch (error) {
      console.error('Error sending reminder log:', error);
    }
  };

  const uploadFile = async (patientId: number, file: File, description: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('file_type', 'image');

    try {
      const res = await apiFetch(`/api/patients/${patientId}/files`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) openPatientRecord(patientId);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const deleteFile = async (fileId: number) => {
    if (!selectedPatient) return;
    setConfirmation({
      message: 'Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        try {
          const res = await apiFetch(`/api/files/${fileId}`, { method: 'DELETE' });
          if (res.ok) {
            openPatientRecord(selectedPatient.id);
            showNotification('Arquivo excluído com sucesso!');
          }
        } catch (error) {
          console.error('Error deleting file:', error);
          showNotification('Erro ao excluir arquivo', 'error');
        }
      }
    });
  };

  const handleUpdatePatient = async (updatedPatient: Patient) => {
    try {
      const res = await apiFetch(`/api/patients/${updatedPatient.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedPatient)
      });
      if (res.ok) {
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
        showNotification('Dados do paciente atualizados!');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Erro ao atualizar paciente', 'error');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      showNotification('Erro de conexão ao atualizar paciente', 'error');
    }
  };

  const handleAddTransaction = async (transaction: any) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update journey status if it's for the selected patient
    if (selectedPatient && transaction.patient_id === selectedPatient.id) {
      const updatedPatient = {
        ...selectedPatient,
        journey: {
          ...(selectedPatient.journey || {}),
          pagamento: 'CONCLUIDO'
        }
      };
      setSelectedPatient(updatedPatient);
      setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    }
  };

  const appContextValue = useMemo(
    () => ({
      user,
      profile,
      patients,
      appointments,
      loading,
      now,
      apiFetch,
      showNotification,
      openPatientRecord,
      setActiveTab,
    }),
    [user, profile, patients, appointments, loading, now],
  );

  return (
    <>
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/portal/:token" element={<PatientPortal />} />
      <Route path="/pre-atendimento/:token" element={<PreAtendimento />} />
      <Route path="/prontuario/:id" element={
        user ? (
          <div className="min-h-screen bg-white flex font-sans text-slate-900 relative overflow-x-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] tablet-l:hidden"
                />
              )}
            </AnimatePresence>

            <aside className={`
              fixed inset-y-0 left-0 z-[110] bg-white border-r border-slate-200 p-4 md:p-6 flex flex-col transition-all duration-300 ease-in-out tablet-l:static tablet-l:translate-x-0 no-print
              ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 tablet-l:w-20 desktop:w-72'}
            `}>
              <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                    <Plus size={24} strokeWidth={3} />
                  </div>
                  <div className="tablet-l:hidden desktop:block">
                    <h1 className="text-xl font-bold tracking-tight text-slate-800 whitespace-nowrap">{PRODUCT_LABEL}</h1>
                    {getProductAccess(getCurrentProduct())?.plan && getProductAccess(getCurrentProduct())?.plan !== 'free' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {getProductAccess(getCurrentProduct())?.plan}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="tablet-l:hidden text-slate-400">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              <nav className="space-y-2 flex-1">
                <SidebarItem id="dashboard" icon={Home} label="Rotina" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
                <SidebarItem id="agenda" icon={Calendar} label="Atendimentos" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
                <SidebarItem id="pacientes" icon={Users} label="Casos clinicos" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
                <SidebarItem id="configuracoes" icon={Settings} label="Configuracoes" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
              </nav>
            </aside>
            <main className="flex-1 min-w-0 overflow-x-hidden flex flex-col pt-4 md:pt-6 lg:pt-8">
              <ClinicalPageRoute
                transactions={transactions}
                appointments={appointments}
                onUpdatePatient={handleUpdatePatient}
                onUpdateAnamnesis={handleUpdateAnamnesis}
                onAddEvolution={addEvolution}
                onAddTransaction={handleAddTransaction}
                onOpenSidebar={() => setIsSidebarOpen(true)}
                apiFetch={apiFetch}
                setAppActiveTab={setActiveTab}
                navigate={navigate}
                pendingEvolutionAppointment={pendingEvolutionAppointment}
                onClearPendingEvolution={() => setPendingEvolutionAppointment(null)}
                onPatientLoaded={(loadedPatient: Patient) => {
                  setPatients(prev => prev.map(p => p.id === loadedPatient.id ? { ...p, ...loadedPatient } : p));
                }}
                profile={profile}
                canExportClinicalCasePdf={(getProductAccess(getCurrentProduct())?.plan || 'free') !== 'free'}
                onRequestPdfUpgrade={() =>
                  setUpgradeLimitModal({
                    open: true,
                    limit: 0,
                    currentUsage: 0,
                    product: 'academy',
                    upgradePlan: 'student',
                    feature: 'pdf',
                  })
                }
              />
            </main>
          </div>
        ) : <Navigate to="/" />
      } />
      <Route path="/pacientes/:id/clinico" element={<LegacyClinicalRedirect />} />
      <Route path="/nova-evolucao" element={<NovaEvolucao />} />
      <Route path="/termos" element={<TermsPage />} />
      <Route path="/privacidade" element={<PrivacyPage />} />
      <Route path="/subscription/callback" element={
        <SubscriptionCallback
          apiFetch={apiFetch}
          product={getCurrentProduct()}
          onNavigate={() => { setActiveTab('dashboard'); navigate('/'); }}
        />
      } />
      <Route path="/print/:tipo/:id?" element={
        <PrintDocument
          profile={profile}
          patients={patients}
          apiFetch={apiFetch}
          appointments={appointments}
          transactions={transactions}
          installments={installments}
          paymentPlans={paymentPlans}
        />
      } />
      <Route path="*" element={
        !user ? (
          <div className="min-h-screen academy-ambient-bg flex items-center justify-center px-6 font-sans antialiased">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[400px] liquid-glass-heavy rounded-[32px] p-8 sm:p-10"
            >
              {/* Heading */}
              <motion.div
                className="mb-11"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-[26px] font-semibold text-academy-text tracking-[-0.4px] leading-[1.2] mb-2.5">
                  {isRegistering ? 'Crie sua conta gratuita' : (() => {
                    const h = new Date().getHours();
                    if (h >= 5 && h < 12) return 'Bom dia. Vamos organizar sua rotina clinica?';
                    if (h >= 12 && h < 18) return 'Boa tarde. Pronto para mais um turno?';
                    return 'Boa noite. Vamos revisar o dia de hoje?';
                  })()}
                </h1>
                <p className="text-[15px] text-academy-muted leading-relaxed">
                  {isRegistering ? 'Preencha os dados para enviar sua solicitacao' : 'Acesse sua rotina academica com seguranca'}
                </p>
              </motion.div>

              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
                {isRegistering && (
                  <div>
                    <label className="block text-[13px] font-medium text-academy-muted mb-2">Nome completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome completo"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="ios-input w-full h-[48px]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[13px] font-medium text-academy-muted mb-2">E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="voce@faculdade.com"
                    value={isRegistering ? registerData.email : loginData.email}
                    onChange={(e) => isRegistering
                      ? setRegisterData({ ...registerData, email: e.target.value })
                      : setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="ios-input w-full h-[48px]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[13px] font-medium text-academy-muted">Senha</label>
                    {!isRegistering && (
                      <Link
                        to="/forgot-password"
                        className="text-[12px] text-academy-muted hover:text-academy-text transition-colors duration-200"
                      >
                        Esqueci a senha
                      </Link>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={isRegistering ? registerData.password : loginData.password}
                    onChange={(e) => isRegistering
                      ? setRegisterData({ ...registerData, password: e.target.value })
                      : setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="ios-input w-full h-[48px]"
                  />
                </div>

                {loginError && (
                  <motion.p
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="text-[13px] text-red-400"
                  >
                    {loginError}
                  </motion.p>
                )}

                {registerMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="text-[13px] text-academy-success-text"
                  >
                    {registerMessage}
                  </motion.p>
                )}

                {isRegistering && (
                  <div className="space-y-3 pt-0.5">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={registerData.acceptedTerms && registerData.acceptedPrivacyPolicy}
                        onChange={(e) => setRegisterData({
                          ...registerData,
                          acceptedTerms: e.target.checked,
                          acceptedPrivacyPolicy: e.target.checked
                        })}
                        className="mt-[3px] w-3.5 h-3.5 rounded-[4px] border-academy-border text-primary focus:ring-0 cursor-pointer shrink-0"
                      />
                      <span className="text-[13px] text-academy-muted leading-snug">
                        Li e concordo com os{' '}
                        <Link to="/termos" target="_blank" className="text-academy-text underline underline-offset-2 decoration-academy-border hover:decoration-academy-text transition-[text-decoration-color] duration-200">Termos de Uso</Link>
                        {' '}e a{' '}
                        <Link to="/privacidade" target="_blank" className="text-academy-text underline underline-offset-2 decoration-academy-border hover:decoration-academy-text transition-[text-decoration-color] duration-200">Política de Privacidade</Link>.
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={registerData.acceptedResponsibility}
                        onChange={(e) => setRegisterData({ ...registerData, acceptedResponsibility: e.target.checked })}
                        className="mt-[3px] w-3.5 h-3.5 rounded-[4px] border-academy-border text-primary focus:ring-0 cursor-pointer shrink-0"
                      />
                      <span className="text-[13px] text-academy-muted leading-snug">
                        Declaro que vou cadastrar apenas dados reais vinculados a minha rotina clinica academica.
                      </span>
                    </label>
                  </div>
                )}

                <div className="pt-3">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                    className="w-full h-[48px] bg-academy-primary hover:bg-academy-primary-dark text-white text-[15px] font-medium rounded-[14px] shadow-[0_8px_24px_rgba(82,5,123,0.22)] transition-[background-color,box-shadow] duration-[160ms] ease-in-out"
                    style={{ willChange: 'transform' }}
                  >
                    {isRegistering ? 'Criar conta' : 'Continuar'}
                  </motion.button>
                  <p className="text-center text-[11px] text-academy-muted/70 mt-3.5">Ambiente seguro · Dados criptografados</p>
                </div>
              </form>

              {/* Footer links */}
              <div className="mt-14 space-y-6">
                <div className="text-center">
                  <motion.button
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setLoginError('');
                      setRegisterMessage('');
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="text-[13px] text-academy-muted hover:text-academy-text transition-colors duration-200"
                  >
                    {isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem conta? Cadastre-se'}
                  </motion.button>
                </div>

                <div className="flex justify-center items-center gap-3 text-[11px] text-academy-muted/60">
                  <Link to="/termos" className="hover:text-academy-muted transition-colors duration-200">Termos</Link>
                  <span>·</span>
                  <Link to="/privacidade" className="hover:text-academy-muted transition-colors duration-200">Privacidade</Link>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <AppProvider value={appContextValue}>
          <div className="min-h-screen academy-ambient-bg flex font-sans text-academy-text relative overflow-x-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] tablet-l:hidden"
                />
              )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-[110] liquid-glass-sidebar p-4 md:p-6 flex flex-col transition-all duration-300 ease-in-out tablet-l:static tablet-l:translate-x-0 no-print
        ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 tablet-l:w-20 desktop:w-72'}
      `}>
              <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-primary rounded-[14px] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(82,5,123,0.25)] shrink-0">
                    <BookOpen size={22} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-academy-text whitespace-nowrap tablet-l:hidden desktop:block">{PRODUCT_LABEL}</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="tablet-l:hidden text-academy-muted">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <nav className="space-y-2 flex-1">
                <SidebarItem id="dashboard" icon={Home} label="Rotina" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
                <SidebarItem id="agenda" icon={Calendar} label="Atendimentos" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
                <SidebarItem id="pacientes" icon={Users} label="Casos clinicos" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
                <SidebarItem id="estudos" icon={BookOpen} label="Estudos" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
                {user?.role?.toUpperCase() === 'ADMIN' && (
                  <SidebarItem id="admin" icon={UserCog} label="Aprovacoes" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
                )}
                <SidebarItem id="configuracoes" icon={Settings} label="Configuracoes" activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />
              </nav>

              <div className="pt-6 border-t border-academy-border/50">
                <div className="flex items-center gap-3 px-2 mb-4 overflow-hidden">
                  <div className="w-10 h-10 rounded-full liquid-glass-subtle flex items-center justify-center text-academy-muted shrink-0 overflow-hidden">
                    {profile?.photo_url ? (
                      <img
                        src={profile.photo_url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserCircle size={24} />
                    )}
                  </div>
                  <div className="tablet-l:hidden desktop:block whitespace-nowrap">
                    <p className="text-sm font-semibold text-academy-text truncate">{user?.name}</p>
                    <p className="text-xs text-academy-muted uppercase tracking-wider font-bold">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-academy-muted hover:text-academy-attention-text transition-colors overflow-hidden"
                >
                  <LogOut size={18} className="shrink-0" />
                  <span className="text-sm font-medium tablet-l:hidden desktop:block whitespace-nowrap">Sair</span>
                </button>

                <div className="mt-6 pt-6 border-t border-academy-border/40 tablet-l:hidden desktop:block">
                  <p className="text-[10px] text-academy-muted px-4 mb-2">© 2026 {PRODUCT_LABEL}</p>
                  <div className="flex flex-col gap-1 px-4 text-[10px] font-bold text-academy-muted">
                    <Link to="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link>
                    <Link to="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-full print:p-0 pb-36 md:pb-8">
              {/* ── Floating Guide Banner ── */}
              {(() => {
                const guide = getGuideStep();
                if (!guide) return null;
                return (
                  <motion.div
                    key={guide.message}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-screen-xl mx-auto px-0 md:px-4 mb-4 no-print"
                  >
                    <div className="flex items-center gap-3 liquid-glass-card border border-primary/10 rounded-2xl px-5 py-3.5">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Stethoscope size={16} className="text-primary" />
                      </div>
                      <p className="text-[13px] font-medium text-academy-text flex-1">
                        {guide.message}
                      </p>
                      <button
                        onClick={() => {
                          if (guide.tab) {
                            setGuideDismissedUntil(null);
                            setActiveTab(guide.tab as any);
                            navigate('/');
                          }
                          guide.onClick?.();
                        }}
                        className="shrink-0 bg-primary text-white px-4 py-2 rounded-xl text-[12px] font-bold hover:opacity-90 transition-all"
                      >
                        {guide.action}
                      </button>
                      <button
                        onClick={() => setGuideDismissedUntil(activeTab)}
                        className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors p-1"
                        title="Fechar dica"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })()}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-screen-xl mx-auto px-0 md:px-4"
                >
                  {searchTerm && activeTab !== 'pacientes' && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Resultados da Busca: "{searchTerm}"</h3>
                        <button onClick={() => setSearchTerm('')} className="text-sm text-slate-400 hover:text-slate-600">Limpar</button>
                      </div>
                      <div className="space-y-2">
                        {patients
                          .filter(p => (p.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || (p.cpf && p.cpf.includes(searchTerm)))
                          .slice(0, 5)
                          .map(p => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setSearchTerm('');
                                openPatientRecord(p.id);
                              }}
                              className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold overflow-hidden border border-primary/20">
                                  {p.photo_url ? (
                                    <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    (p.name || '?').charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{p.name}</p>
                                  <p className="text-[10px] text-slate-400">{p.cpf || 'Sem CPF'}</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchTerm('');
                                  openPatientRecord(p.id);
                                }}
                                className="text-xs font-bold text-primary hover:underline"
                              >
                                Ver Prontuário
                              </button>
                            </div>
                          ))}
                        {patients.filter(p => (p.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())).length === 0 && (
                          <p className="text-center py-4 text-slate-400 text-sm">Nenhum resultado.</p>
                        )}
                        {patients.filter(p => (p.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())).length > 5 && (
                          <button
                            onClick={() => setActiveTab('pacientes')}
                            className="w-full text-center py-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                          >
                            Ver todos os resultados
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'dashboard' && !searchTerm && (
                    <AcademyDashboard
                      user={user}
                      patients={patients}
                      appointments={appointments}
                      now={now}
                      loading={loading}
                      openPatientRecord={openPatientRecord}
                      openPatientEvolution={openPatientEvolution}
                      setActiveTab={setActiveTab}
                      setIsPatientModalOpen={setIsPatientModalOpen}
                      openAppointmentModal={openAppointmentModal}
                      onDismissOnboarding={() => updateUserOnboarding('onboarding_done')}
                      onDismissWelcome={() => updateUserOnboarding('welcome_seen')}
                    />
                  )}

                  {activeTab === 'estudos' && !searchTerm && (
                    <ErrorBoundary fallbackTitle="Não foi possível carregar Estudos">
                      <Suspense fallback={<DataLoadingSkeleton rows={6} className="mt-10" />}>
                        <AcademyEstudos
                          patients={patients}
                          appointments={appointments}
                          setActiveTab={setActiveTab}
                          openPatientRecord={openPatientRecord}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  )}

                  {activeTab === 'agenda' && (
                    <ErrorBoundary fallbackTitle="Não foi possível carregar Atendimentos">
                      <Suspense fallback={<DataLoadingSkeleton rows={6} className="mt-10" />}>
                        <AgendaTab
                          appointments={appointments}
                          patients={patients}
                          loading={loading}
                          now={now}
                          selectedDate={selectedDate}
                          agendaViewMode={agendaViewMode}
                          agendaFocusMode={agendaFocusMode}
                          agendaSmartCopy={agendaSmartCopy}
                          filteredAppointments={filteredAppointments}
                          patientMap={patientMap}
                          selectedWeekDay={selectedWeekDay}
                          monthSheetSelectedDay={monthSheetSelectedDay}
                          weekSheetSelectedAppointment={weekSheetSelectedAppointment}
                          weekSuggestionSheet={weekSuggestionSheet}
                          user={user}
                          getPatientWeekRole={getPatientWeekRole}
                          isNextAppointment={isNextAppointment}
                          getProcedureColor={getProcedureColor}
                          findAvailableSlots={findAvailableSlots}
                          navigateDate={navigateDate}
                          openAppointmentModal={openAppointmentModal}
                          openPatientRecord={openPatientRecord}
                          updateAppointmentStatus={updateStatus}
                          sendReminder={sendReminder}
                          setAgendaFocusMode={setAgendaFocusMode}
                          setAgendaViewMode={setAgendaViewMode}
                          setSelectedDate={setSelectedDate}
                          setSelectedWeekDay={setSelectedWeekDay}
                          setMonthSheetSelectedDay={setMonthSheetSelectedDay}
                          setWeekSheetSelectedAppointment={setWeekSheetSelectedAppointment}
                          setWeekSuggestionSheet={setWeekSuggestionSheet}
                          setActiveTab={setActiveTab}
                          setNewAppointment={setNewAppointment}
                          setIsModalOpen={setIsModalOpen}
                          setAppointmentModalMode={setAppointmentModalMode}
                          setEditingAppointmentId={setEditingAppointmentId}
                          setSuggestedSlot={setSuggestedSlot}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  )}

                  {activeTab === 'pacientes' && (
                    <ErrorBoundary fallbackTitle="Não foi possível carregar Casos">
                      <Suspense fallback={<DataLoadingSkeleton rows={6} className="pt-10" />}>
                        <PacientesTab
                          loading={loading}
                          patients={patients}
                          appointments={appointments}
                          now={now}
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          patientListFilter={patientListFilter}
                          setPatientListFilter={setPatientListFilter}
                          patientsSubView={patientsSubView}
                          setPatientsSubView={setPatientsSubView}
                          portalPendingCount={portalPendingCount}
                          patientsInlineFeedback={patientsInlineFeedback}
                          setPatientsInlineFeedback={setPatientsInlineFeedback}
                          patientActionsToday={patientActionsToday}
                          setPatientActionsToday={setPatientActionsToday}
                          patientIntelligence={patientIntelligence}
                          patientMap={patientMap}
                          apiFetch={apiFetch}
                          openPatientAppointmentModal={openPatientAppointmentModal}
                          openPatientRecord={openPatientRecord}
                          contactPatientOnWhatsApp={contactPatientOnWhatsApp}
                          generatePatientPortalLink={generatePatientPortalLink}
                          setIsPatientModalOpen={setIsPatientModalOpen}
                          setActiveTab={setActiveTab}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  )}

                  {(activeTab === 'admin' && user?.role?.toUpperCase() === 'ADMIN') && (
                    <Suspense fallback={<DataLoadingSkeleton rows={4} className="mt-10" />}>
                      <AdminTab
                        apiFetch={apiFetch}
                        adminUsers={adminUsers}
                        dentistSearchTerm={dentistSearchTerm}
                        setDentistSearchTerm={setDentistSearchTerm}
                        adminProductFilter={adminProductFilter}
                        setAdminProductFilter={setAdminProductFilter}
                        dentistStatusFilter={dentistStatusFilter}
                        setDentistStatusFilter={setDentistStatusFilter}
                        updateUserProductAccess={updateUserProductAccess}
                      />
                    </Suspense>
                  )}

                  {activeTab === 'configuracoes' && (
                    <ErrorBoundary fallbackTitle="Não foi possível carregar Configurações">
                      {!profile || !user ? (
                        <div className="pt-10 px-2 max-w-screen-xl mx-auto w-full">
                          <DataLoadingSkeleton rows={5} />
                        </div>
                      ) : (
                        <Suspense fallback={<DataLoadingSkeleton rows={5} className="mt-10" />}>
                          <ConfigTab
                            user={user}
                            profile={profile}
                            profileDraft={profileDraft}
                            isProfileEditing={isProfileEditing}
                            profilePassword={profilePassword}
                            isSavingProfile={isSavingProfile}
                            apiFetch={apiFetch}
                            getCurrentProduct={getCurrentProduct}
                            getProductAccess={getProductAccess}
                            handlePhotoUpload={handlePhotoUpload}
                            startProfileEditing={startProfileEditing}
                            handleSaveProfile={handleSaveProfile}
                            updateProfileDraft={updateProfileDraft}
                            setIsProfileEditing={setIsProfileEditing}
                            setProfileDraft={setProfileDraft}
                            setProfilePassword={setProfilePassword}
                            fetchProfile={fetchProfile}
                            setShowAcademyUpgradeModal={setShowAcademyUpgradeModal}
                            setActiveTab={setActiveTab}
                            handleLogout={handleLogout}
                          />
                        </Suspense>
                      )}
                    </ErrorBoundary>
                  )}                </motion.div>
              </AnimatePresence>
            </main>

            {/* Modal de Exportação */}
            <AnimatePresence>
              {isExportModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsExportModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white/85 backdrop-blur-2xl border border-white/30 w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden"
                  >
                    <div className="p-6 border-b border-slate-100/70 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Download className="text-primary" size={24} />
                        Exportar relatório
                      </h3>
                      <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <Plus size={24} className="rotate-45" />
                      </button>
                    </div>

                    <div className="p-6 space-y-6">
                      <p className="text-sm text-slate-500">
                        Selecione os filtros para exportar os dados em formato Excel (.xlsx).
                      </p>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                              {exportType === 'patients' ? 'Cadastrados desde' : 'Data Inicial'}
                            </label>
                            <input
                              type="date"
                              value={exportFilters.startDate}
                              onChange={(e) => setExportFilters({ ...exportFilters, startDate: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                              {exportType === 'patients' ? 'Cadastrados até' : 'Data Final'}
                            </label>
                            <input
                              type="date"
                              value={exportFilters.endDate}
                              onChange={(e) => setExportFilters({ ...exportFilters, endDate: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Paciente</label>
                          <select
                            value={exportFilters.patientId}
                            onChange={(e) => setExportFilters({ ...exportFilters, patientId: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                          >
                            <option value="all">Todos os Pacientes</option>
                            {patients.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        {exportType === 'finance' && (
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tipo de Transação</label>
                            <select
                              value={exportFilters.category}
                              onChange={(e) => setExportFilters({ ...exportFilters, category: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                              <option value="all">Receitas + Despesas</option>
                              <option value="income">Apenas Receitas</option>
                              <option value="expense">Apenas Despesas</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setIsExportModalOpen(false)}
                          className="flex-1 py-3 rounded-full font-bold text-slate-500 hover:bg-slate-100/70 transition-all"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={exportType === 'patients' ? exportPatients : exportFinance}
                          className="flex-1 bg-primary text-white py-3 rounded-full font-bold shadow-[0_12px_36px_rgba(139,92,246,0.12)] hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Download size={20} />
                          Exportar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal de Novo Agendamento — iOS Premium Minimalista */}
            <AnimatePresence>
              {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setIsModalOpen(false);
                      setSuggestedSlot(null);
                    }}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    className="relative bg-white/80 backdrop-blur-2xl w-full sm:max-w-sm rounded-t-[28px] sm:rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-fit overflow-y-auto border border-white/20"
                  >
                    {/* Minimal Header */}
                    <div className="px-5 pt-5 pb-3 border-b border-slate-100/50">
                      <div className="flex justify-between items-center gap-4">
                        <h2 className="text-lg font-semibold text-slate-900">{appointmentModalMode === 'reschedule' ? 'Reagendar atendimento' : 'Agendar atendimento'}</h2>
                        <button
                          onClick={() => {
                            setIsModalOpen(false);
                            setSuggestedSlot(null);
                            setAppointmentModalMode('schedule');
                            setEditingAppointmentId(null);
                          }}
                          className="w-7 h-7 rounded-full hover:bg-slate-100/50 transition-colors flex items-center justify-center shrink-0"
                        >
                          <X size={16} className="text-slate-400" />
                        </button>
                      </div>
                    </div>

                    {/* Alert Suggestion - Super minimalista */}
                    {suggestedSlot && (
                      <div className="mx-4 mt-3 p-2.5 bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-[12px]">
                        <p className="text-xs text-slate-600 font-medium">
                          <strong>{suggestedSlot.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong> • <strong>{Math.floor(suggestedSlot.duration)}min</strong> • {suggestedSlot.procedure}
                        </p>
                      </div>
                    )}

                    {/* Form - iOS Glass Style */}
                    <form onSubmit={handleCreateAppointment} className="p-4 sm:p-5 space-y-4">

                      {/* Inline error banner */}
                      {appointmentFormError && (
                        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-rose-50/80 border border-rose-200/60 rounded-xl" role="alert">
                          <AlertCircle size={16} className="text-rose-500 shrink-0" />
                          <p className="text-[13px] font-medium text-rose-700 flex-1">{appointmentFormError}</p>
                          <button type="button" onClick={() => { setAppointmentFormError(null); setAppointmentConflict(null); }} className="text-rose-400 hover:text-rose-600 shrink-0">
                            <X size={14} />
                          </button>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-0.5">
                          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Atalhos</span>
                          <span className="text-[11px] text-slate-400 font-medium">opcional</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {appointmentPresets.map((preset) => {
                            const isActive = (newAppointment.notes || '').trim().toLowerCase() === preset.procedure.toLowerCase();
                            return (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                  setAppointmentFormError(null);
                                  setNewAppointment({
                                    ...newAppointment,
                                    notes: preset.procedure,
                                    duration: preset.duration,
                                  });
                                }}
                                className={`min-h-[40px] rounded-xl border px-3 py-2 text-[13px] font-semibold transition-all ios-press ${isActive
                                  ? 'border-academy-primary/30 bg-academy-soft text-academy-primary-dark shadow-[0_3px_10px_rgba(82,5,123,0.08)]'
                                  : 'border-slate-200/60 bg-white/70 text-slate-600 hover:border-academy-primary/20 hover:bg-academy-soft/40 hover:text-academy-primary-dark'
                                  }`}
                              >
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* SEÇÃO 1: Procedimento */}
                      <div>
                        <input
                          type="text"
                          value={newAppointment.notes || ''}
                          onChange={(e) => { setAppointmentFormError(null); setNewAppointment({ ...newAppointment, notes: e.target.value }); }}
                          placeholder="Procedimento..."
                          maxLength={60}
                          aria-label="Procedimento"
                          className="w-full px-3.5 py-2.5 bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-base font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                        />
                      </div>

                      {/* SEÇÃO 2: Paciente (Campo de busca com feedback visual) */}
                      <div>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            placeholder="Paciente..."
                            aria-label="Paciente"
                            value={newAppointment.patient_name || ''}
                            onChange={(e) => {
                              const name = e.target.value;
                              setAppointmentFormError(null);
                              setNewAppointment({ ...newAppointment, patient_name: name, patient_id: '' });
                            }}
                            className={`w-full px-3.5 py-2.5 bg-slate-50/50 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-base font-medium text-slate-900 placeholder:text-slate-400 transition-all ${newAppointment.patient_id ? 'border-primary/40 bg-primary/5' : 'border-slate-200/50'
                              }`}
                          />
                          {newAppointment.patient_id && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <CheckCircle size={16} className="text-primary" />
                            </div>
                          )}
                        </div>
                        {newAppointment.patient_name && !newAppointment.patient_id && (
                          <div className="mt-2 bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-xl max-h-40 overflow-y-auto shadow-lg">
                            {patients.filter(p => p.name.toLowerCase().includes(newAppointment.patient_name?.toLowerCase() || '')).length > 0 ? (
                              patients.filter(p => p.name.toLowerCase().includes(newAppointment.patient_name?.toLowerCase() || '')).map(p => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => {
                                    setNewAppointment({ ...newAppointment, patient_id: p.id.toString(), patient_name: p.name });
                                    setAppointmentFormError(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-sm text-slate-700 font-medium border-b border-slate-100/30 last:border-b-0 transition-colors min-h-[44px] flex items-center"
                                >
                                  {p.name}
                                </button>
                              ))
                            ) : (
                              <div className="px-3.5 py-2.5 text-xs text-slate-400">Nenhum paciente encontrado</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* SEÇÃO 3: Data, Hora, Duração */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold mb-1 block uppercase tracking-wider">Data</label>
                          <input
                            required
                            type="date"
                            value={newAppointment.date}
                            onChange={(e) => { setAppointmentFormError(null); setAppointmentConflict(null); setNewAppointment({ ...newAppointment, date: e.target.value }); }}
                            aria-label="Data do atendimento"
                            className="w-full px-3.5 py-2.5 bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-base font-medium text-slate-900 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-[1fr_100px] gap-3">
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold mb-1 block uppercase tracking-wider">Horário</label>
                            <input
                              required
                              type="time"
                              value={newAppointment.time}
                              onChange={(e) => { setAppointmentFormError(null); setAppointmentConflict(null); setNewAppointment({ ...newAppointment, time: e.target.value }); }}
                              aria-label="Horario do atendimento"
                              className="w-full px-3.5 py-2.5 bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-base font-medium text-slate-900 transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold mb-1 block uppercase tracking-wider">Duração</label>
                            <input
                              required
                              type="number"
                              min="1"
                              value={newAppointment.duration}
                              onChange={(e) => { setAppointmentFormError(null); setNewAppointment({ ...newAppointment, duration: e.target.value }); }}
                              placeholder="30 min"
                              aria-label="Duração em minutos"
                              className="w-full px-3.5 py-2.5 bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-base font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            setSuggestedSlot(null);
                            setAppointmentModalMode('schedule');
                            setEditingAppointmentId(null);
                            setAppointmentFormError(null);
                            setAppointmentConflict(null);
                          }}
                          className="flex-1 py-2.5 px-4 border border-slate-200/50 text-slate-700 font-medium rounded-xl hover:bg-slate-50/50 active:bg-slate-100/50 transition-all text-sm backdrop-blur-sm min-h-[44px]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={!newAppointment.patient_id || !newAppointment.date || !newAppointment.time}
                          className="flex-1 py-2.5 px-4 bg-primary/90 hover:bg-primary text-white font-medium rounded-xl active:scale-95 transition-all text-sm shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm min-h-[44px]"
                        >
                          {appointmentModalMode === 'reschedule' ? 'Confirmar reagendamento' : 'Agendar atendimento'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            {/* Modal de Novo Paciente */}
            <AnimatePresence>
              {isPatientModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPatientModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white/85 backdrop-blur-2xl border border-white/30 w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-slate-900">Novo paciente</h3>
                        <button onClick={() => setIsPatientModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <Plus size={20} className="rotate-45" />
                        </button>
                      </div>

                      <form onSubmit={handleCreatePatient} className="space-y-3">
                        {/* Essencial: Nome */}
                        <div>
                          <input
                            required
                            type="text"
                            placeholder="Nome completo"
                            value={newPatient.name}
                            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none text-base"
                          />
                        </div>

                        {/* Essencial: Telefone */}
                        <div>
                          <input
                            required
                            type="text"
                            placeholder="Telefone"
                            value={newPatient.phone}
                            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none text-base"
                          />
                        </div>

                        {/* Contato: Email */}
                        <div>
                          <input
                            type="email"
                            placeholder="E-mail (opcional)"
                            value={newPatient.email}
                            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none text-base"
                          />
                        </div>

                        {/* Informações Adicionais - Collapsible */}
                        <details className="group">
                          <summary className="cursor-pointer text-xs font-bold text-slate-400 uppercase tracking-wider py-3 hover:text-slate-600 transition-colors">
                            + Informações adicionais
                          </summary>
                          <div className="space-y-3 pt-1">
                            <div>
                              <input
                                type="text"
                                placeholder="CPF (opcional)"
                                value={newPatient.cpf}
                                onChange={(e) => setNewPatient({ ...newPatient, cpf: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none text-base"
                              />
                            </div>
                            <div>
                              <input
                                type="date"
                                value={newPatient.birth_date}
                                onChange={(e) => setNewPatient({ ...newPatient, birth_date: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none text-base"
                                title="Data de Nascimento"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Endereço (opcional)"
                                value={newPatient.address}
                                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none text-base"
                              />
                            </div>
                          </div>
                        </details>

                        <div className="flex gap-2.5 pt-4">
                          <button
                            type="button"
                            onClick={() => setIsPatientModalOpen(false)}
                            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-bold rounded-full hover:bg-slate-100/70 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-full shadow-[0_12px_36px_rgba(139,92,246,0.12)] hover:opacity-90 transition-all active:scale-95"
                          >
                            Salvar
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal de Editar Dentista */}
            <AnimatePresence>
              {isEditDentistModalOpen && editingDentist && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsEditDentistModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white/85 backdrop-blur-2xl border border-white/30 w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">Editar usuario</h3>
                        <button onClick={() => setIsEditDentistModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <Plus size={24} className="rotate-45" />
                        </button>
                      </div>

                      <form onSubmit={handleUpdateDentist} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nome Completo</label>
                          <input
                            required
                            type="text"
                            value={editingDentist.name}
                            onChange={(e) => setEditingDentist({ ...editingDentist, name: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">E-mail</label>
                          <input
                            required
                            type="email"
                            value={editingDentist.email}
                            onChange={(e) => setEditingDentist({ ...editingDentist, email: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button
                            type="button"
                            onClick={() => setIsEditDentistModalOpen(false)}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-[0_12px_36px_rgba(139,92,246,0.12)] hover:opacity-90 transition-all active:scale-95"
                          >
                            Salvar
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal de Plano de Parcelamento */}
            <AnimatePresence>
              {isPaymentPlanModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPaymentPlanModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex justify-between items-center mb-6 md:mb-8">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Novo parcelamento</h3>
                        <button onClick={() => setIsPaymentPlanModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <Plus size={24} className="rotate-45" />
                        </button>
                      </div>

                      <form onSubmit={handleCreatePaymentPlan} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Paciente</label>
                          {selectedPatient ? (
                            <input
                              readOnly
                              type="text"
                              value={selectedPatient.name}
                              className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                            />
                          ) : (
                            <select
                              required
                              value={newPaymentPlan.patient_id}
                              onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, patient_id: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                              <option value="">Selecione um paciente</option>
                              {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Procedimento / Tratamento</label>
                          <input
                            required
                            type="text"
                            placeholder="Procedimento"
                            value={newPaymentPlan.procedure}
                            onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, procedure: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Valor Total (R$)</label>
                            <input
                              required
                              type="number"
                              step="0.01"
                              placeholder="0,00"
                              value={newPaymentPlan.total_amount}
                              onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, total_amount: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nº de Parcelas</label>
                            <select
                              required
                              value={newPaymentPlan.installments_count}
                              onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, installments_count: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                              {[1, 2, 3, 4, 5, 6, 10, 12, 18, 24].map(n => (
                                <option key={n} value={n}>{n}x</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Data do Primeiro Vencimento</label>
                          <input
                            required
                            type="date"
                            value={newPaymentPlan.first_due_date}
                            onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, first_due_date: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button
                            type="button"
                            onClick={() => setIsPaymentPlanModalOpen(false)}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-100/70 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-full shadow-[0_12px_36px_rgba(139,92,246,0.12)] hover:opacity-90 transition-all active:scale-95"
                          >
                            Criar Plano
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal de Recibo */}
            <AnimatePresence>
              {isReceiptModalOpen && selectedReceipt && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 receipt-modal-overlay">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsReceiptModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm no-print"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto receipt-content"
                  >
                    <div className="p-8 md:p-12 bg-white text-slate-800 font-serif">
                      <div className="flex justify-between items-start mb-12 no-print">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <Plus size={24} strokeWidth={3} />
                          </div>
                          <h1 className="text-xl font-bold tracking-tight text-slate-800">OdontoHub</h1>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => imprimirDocumento('recibo', selectedReceipt.id)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                            title="Imprimir"
                          >
                            <Printer size={20} />
                          </button>
                          <button
                            onClick={() => setIsReceiptModalOpen(false)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            <Plus size={24} className="rotate-45" />
                          </button>
                        </div>
                      </div>

                      <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold uppercase tracking-widest border-b-2 border-slate-200 pb-4 inline-block px-12">Recibo</h2>
                        <p className="hidden print:block text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Via do Paciente</p>
                      </div>

                      <div className="space-y-8 text-lg leading-relaxed">
                        <p>
                          Recebi de <span className="font-bold border-b border-slate-300 px-2">{selectedReceipt.patientName}</span>,
                          a importância de <span className="font-bold border-b border-slate-300 px-2">{selectedReceipt.amountFormatted}</span>,
                          referente ao procedimento de <span className="font-bold border-b border-slate-300 px-2">{selectedReceipt.procedure}</span>.
                        </p>

                        <div className="flex justify-between items-center py-4">
                          <p>Forma de Pagamento: <span className="font-bold">{selectedReceipt.paymentMethod}</span></p>
                          <p>Data: <span className="font-bold">{selectedReceipt.date}</span></p>
                        </div>

                        <div className="pt-16 flex flex-col items-center">
                          <div className="w-64 border-t border-slate-400 mb-2"></div>
                          <p className="font-bold text-xl">{selectedReceipt.dentistName}</p>
                          <p className="text-slate-500 uppercase tracking-widest text-sm">CRO: {selectedReceipt.dentistCro || 'XXXXX'}</p>
                        </div>

                        <div className="pt-12 text-sm text-slate-400 text-center italic">
                          <p>{selectedReceipt.clinicName}</p>
                          <p>{selectedReceipt.clinicAddress}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal de Novo Dentista */}
            <AnimatePresence>
              {isDentistModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsDentistModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white/85 backdrop-blur-2xl border border-white/30 w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">Novo usuario</h3>
                        <button onClick={() => setIsDentistModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <Plus size={24} className="rotate-45" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateDentist} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nome Completo</label>
                          <input
                            required
                            type="text"
                            value={newDentist.name}
                            onChange={(e) => setNewDentist({ ...newDentist, name: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">E-mail</label>
                          <input
                            required
                            type="email"
                            value={newDentist.email}
                            onChange={(e) => setNewDentist({ ...newDentist, email: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Senha</label>
                          <input
                            required
                            type="password"
                            value={newDentist.password}
                            onChange={(e) => setNewDentist({ ...newDentist, password: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button
                            type="button"
                            onClick={() => setIsDentistModalOpen(false)}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-100/70 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-full shadow-[0_12px_36px_rgba(139,92,246,0.12)] hover:opacity-90 transition-all active:scale-95"
                          >
                            Salvar dentista
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal de Upload de Imagem */}
            <AnimatePresence>
              {isImageModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsImageModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">Adicionar imagem</h3>
                        <button onClick={() => setIsImageModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <Plus size={24} className="rotate-45" />
                        </button>
                      </div>

                      <form onSubmit={handleUploadImage} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Arquivo de Imagem</label>
                          <div className="relative group">
                            <input
                              required={!newImage.url}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              id="file-upload"
                            />
                            <label
                              htmlFor="file-upload"
                              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden"
                            >
                              {newImage.url ? (
                                <div className="relative w-full h-full p-2">
                                  <img src={newImage.url} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                    <p className="text-white text-xs font-bold">Alterar Imagem</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-primary">
                                  <Upload size={32} />
                                  <span className="text-xs font-bold uppercase">Clique para selecionar arquivo</span>
                                  <span className="text-[10px] text-slate-400">PNG, JPG ou GIF</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Descrição</label>
                          <input
                            required
                            type="text"
                            placeholder="Descricao do arquivo"
                            value={newImage.description}
                            onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button
                            type="button"
                            onClick={() => setIsImageModalOpen(false)}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-[0_12px_36px_rgba(139,92,246,0.12)] hover:opacity-90 transition-all active:scale-95"
                          >
                            Salvar
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal de Transação Financeira */}
            <AnimatePresence>
              {isTransactionModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsTransactionModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white/85 backdrop-blur-2xl border border-white/30 w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                  >
                    <div className="p-8 overflow-y-auto">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {transactionType === 'INCOME' ? 'Registrar entrada' : 'Registrar saída'}
                          </h3>
                          <p className="text-sm text-slate-500">Preencha os campos abaixo</p>
                        </div>
                        <button onClick={() => setIsTransactionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <Plus size={24} className="rotate-45" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveTransaction} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Descrição</label>
                            <input
                              required
                              type="text"
                              placeholder={transactionType === 'INCOME' ? 'Procedimento' : 'Despesa'}
                              value={newTransaction.description}
                              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Categoria</label>
                            <select
                              value={newTransaction.category}
                              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                              {transactionType === 'INCOME' ? (
                                <>
                                  <option value="Procedimentos">Procedimentos</option>
                                  <option value="Consultas">Consultas</option>
                                  <option value="Produtos">Produtos</option>
                                  <option value="Outros">Outros</option>
                                </>
                              ) : (
                                <>
                                  <option value="Aluguel">Aluguel</option>
                                  <option value="Materiais">Materiais</option>
                                  <option value="Laboratório">Laboratório</option>
                                  <option value="Marketing">Marketing</option>
                                  <option value="Salários">Salários</option>
                                  <option value="Outros">Outros</option>
                                </>
                              )}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Valor (R$)</label>
                            <input
                              required
                              type="number"
                              step="0.01"
                              placeholder="0,00"
                              value={newTransaction.amount}
                              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Data</label>
                            <input
                              required
                              type="date"
                              value={newTransaction.date}
                              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Forma de Pagamento</label>
                            <select
                              value={newTransaction.payment_method}
                              onChange={(e) => setNewTransaction({ ...newTransaction, payment_method: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                              <option value="Dinheiro">Dinheiro</option>
                              <option value="PIX">PIX</option>
                              <option value="Cartão de Crédito">Cartão de Crédito</option>
                              <option value="Cartão de Débito">Cartão de Débito</option>
                              <option value="Transferência">Transferência</option>
                            </select>
                          </div>

                          {transactionType === 'INCOME' && (
                            <>
                              <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Paciente (Opcional)</label>
                                <select
                                  value={newTransaction.patient_id}
                                  onChange={(e) => setNewTransaction({ ...newTransaction, patient_id: e.target.value })}
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                  <option value="">Selecione um paciente</option>
                                  {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Procedimento (Opcional)</label>
                                <input
                                  type="text"
                                  placeholder="Procedimento"
                                  value={newTransaction.procedure}
                                  onChange={(e) => setNewTransaction({ ...newTransaction, procedure: e.target.value })}
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                              </div>
                            </>
                          )}
                          <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Observações</label>
                            <textarea
                              rows={2}
                              value={newTransaction.notes || ''}
                              onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button
                            type="button"
                            onClick={() => setIsTransactionModalOpen(false)}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-100/70 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className={`flex-1 px-6 py-3 text-white font-bold rounded-full shadow-lg transition-all active:scale-95 ${transactionType === 'INCOME'
                                ? 'bg-primary shadow-primary/10 hover:opacity-90'
                                : 'bg-rose-600 shadow-rose-100 hover:bg-rose-700'
                              }`}
                          >
                            Salvar {transactionType === 'INCOME' ? 'entrada' : 'saída'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal: Receber Parcela */}
            <AnimatePresence>
              {isReceiveInstallmentModalOpen && selectedInstallment && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white/85 backdrop-blur-2xl border border-white/30 rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
                  >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <DollarSign size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Registrar recebimento</h3>
                          <p className="text-xs text-slate-500">Confirme o recebimento do pagamento</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsReceiveInstallmentModalOpen(false)}
                        className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="p-6 space-y-6 overflow-y-auto">
                      <div className="bg-slate-50 rounded-[20px] p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Paciente</span>
                          <span className="text-sm font-semibold text-slate-700">{selectedPatient?.name || selectedInstallment.patient_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Procedimento</span>
                          <span className="text-sm font-semibold text-slate-700">{selectedInstallment.procedure || selectedInstallment.procedure_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Parcela</span>
                          <span className="text-sm font-semibold text-slate-700">{selectedInstallment.installment_number}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-800">Valor</span>
                          <span className="text-lg font-bold text-primary">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedInstallment.amount)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Forma de Pagamento</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito'].map((method) => (
                            <button
                              key={method}
                              onClick={() => setPaymentMethod(method)}
                              className={`p-3 rounded-full border text-sm font-medium transition-all ${paymentMethod === method
                                  ? 'bg-primary/5 border-primary/20 text-primary shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setIsReceiveInstallmentModalOpen(false)}
                          className="flex-1 py-3 px-4 text-slate-600 font-bold hover:bg-slate-100/70 rounded-full transition-colors border border-slate-200"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handlePayInstallment(selectedInstallment.id, paymentMethod)}
                          className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-full hover:opacity-90 transition-all shadow-[0_12px_36px_rgba(139,92,246,0.12)] active:scale-95"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Modal: Ver Parcelas */}
            <AnimatePresence>
              {isViewInstallmentsModalOpen && selectedPlan && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white/85 backdrop-blur-2xl border border-white/30 rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                  >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                          <List size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Parcelas</h3>
                          <p className="text-xs text-slate-500">{selectedPlan.procedure} - {selectedPatient?.name || selectedPlan.patient_name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsViewInstallmentsModalOpen(false)}
                        className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase">Parcela</th>
                              <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase">Valor</th>
                              <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase">Vencimento</th>
                              <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase">Status</th>
                              <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {installments
                              .filter(inst => inst.payment_plan_id === selectedPlan.id)
                              .sort((a, b) => a.installment_number - b.installment_number)
                              .map((inst) => (
                                <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-4 text-sm font-medium text-slate-700">{inst.installment_number}ª</td>
                                  <td className="py-4 text-sm font-bold text-slate-900">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inst.amount)}
                                  </td>
                                  <td className="py-4 text-sm text-slate-500">
                                    {formatDate(inst.due_date)}
                                  </td>
                                  <td className="py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inst.status === 'PAID'
                                        ? 'bg-primary/10 text-primary'
                                        : isOverdue(inst.due_date)
                                          ? 'bg-rose-100 text-rose-700'
                                          : 'bg-amber-100 text-amber-700'
                                      }`}>
                                      {inst.status === 'PAID' ? 'Pago' : isOverdue(inst.due_date) ? 'Atrasado' : 'Pendente'}
                                    </span>
                                  </td>
                                  <td className="py-4 text-right">
                                    {inst.status === 'PENDING' && (
                                      <button
                                        onClick={() => {
                                          setIsViewInstallmentsModalOpen(false);
                                          setSelectedInstallment(inst);
                                          setIsReceiveInstallmentModalOpen(true);
                                        }}
                                        className="text-primary hover:opacity-80 font-bold text-xs bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
                                      >
                                        Receber
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Notifications */}
            {/* Primary Action & Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 tablet-l:hidden no-print">
              {/* Bottom Navigation */}
              <nav className="liquid-glass-nav px-2 pt-2 pb-6 flex justify-around items-center">
                <BottomNavItem id="dashboard" label="Rotina" icon={Home} activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />
                <BottomNavItem id="agenda" label="Atend." icon={Calendar} activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />
                <BottomNavItem id="pacientes" label="Casos" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />
                <BottomNavItem id="estudos" label="Estudos" icon={BookOpen} activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />
                <BottomNavItem id="configuracoes" label="Mais" icon={Settings} activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />
              </nav>
            </div>

            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: notification.celebration ? 0.9 : 1 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={notification.celebration ? { type: 'spring', stiffness: 300, damping: 20 } : undefined}
                  className={`fixed z-[100] flex items-center gap-3 border ${notification.celebration
                      ? 'bottom-12 left-1/2 -translate-x-1/2 px-8 py-5 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] bg-white border-primary/20'
                      : 'bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl'
                    } ${!notification.celebration && notification.type === 'success'
                      ? 'bg-primary border-primary/20 text-white'
                      : !notification.celebration
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : ''
                    }`}
                >
                  {notification.celebration ? (
                    <>
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle size={22} className="text-primary" />
                      </div>
                      <span className="font-bold text-[15px] text-slate-800">{notification.message}</span>
                      {notification.onAction && notification.actionLabel && (
                        <button
                          onClick={() => {
                            notification.onAction?.();
                            setNotification(null);
                            if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
                          }}
                          className="shrink-0 ml-1 px-4 py-2 bg-primary text-white text-[13px] font-bold rounded-xl hover:opacity-90 transition-all"
                        >
                          {notification.actionLabel}
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                      <span className="font-bold text-sm">{notification.message}</span>
                      {notification.onUndo && (
                        <button
                          onClick={() => {
                            notification.onUndo?.();
                            setNotification(null);
                            if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
                          }}
                          className="ml-1 px-3 py-1 text-sm font-bold rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          Desfazer
                        </button>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showAcademyUpgradeModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    className="bg-white border border-primary/10 rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Sparkles size={22} />
                      </div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary mb-2">Academy Free</p>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Seu Academy já tem seus primeiros casos.</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        Você já organizou 3 casos. Para continuar acompanhando seus pacientes, evoluções e atendimentos da faculdade, mude para o Academy Student.
                      </p>
                      <div className="space-y-2">
                        {['Casos ilimitados', 'Agenda acadêmica sem limite', 'Evoluções e modo box completos'].map((item) => (
                          <div key={item} className="flex items-center gap-3 rounded-2xl bg-primary/5 px-3 py-2.5 text-[13px] font-semibold text-slate-700">
                            <CheckCircle2 size={16} className="text-primary shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAcademyUpgradeModal(false)}
                        className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-500 text-sm font-bold hover:bg-slate-200 transition-all"
                      >
                        Continuar no Free
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAcademyUpgradeModal(false);
                          setActiveTab('configuracoes');
                          navigate('/');
                        }}
                        className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:opacity-90 transition-all"
                      >
                        Mudar para Student
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Confirmation Modal */}
            <AnimatePresence>
              {confirmation && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/85 backdrop-blur-2xl border border-white/30 rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden"
                  >
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Confirmar</h3>
                      <p className="text-slate-600">{confirmation.message}</p>
                    </div>
                    <div className="p-6 bg-slate-50 flex gap-3">
                      <button
                        onClick={() => setConfirmation(null)}
                        className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-100 transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          confirmation.onConfirm();
                          setConfirmation(null);
                        }}
                        className="flex-1 px-6 py-3 bg-rose-600 text-white font-bold rounded-full hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all"
                      >
                        Confirmar
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Portal Link Modal */}
            <AnimatePresence>
              {portalLinkData && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300] flex items-center justify-center px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Portal do Paciente</h3>
                        <button onClick={() => setPortalLinkData(null)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 mb-5">
                        Links gerados para <span className="font-semibold text-slate-700">{portalLinkData.patientName}</span>.
                      </p>

                      <div className="space-y-3">
                        {/* Pre-atendimento link — only for first visit */}
                        {portalLinkData.preUrl && (
                          <div className="bg-[#F3E8FF] rounded-2xl p-4 border border-[#DDD6FE]">
                            <div className="flex items-center gap-2 mb-2">
                              <ClipboardList size={16} className="text-academy-primary-dark" />
                              <span className="text-sm font-bold text-academy-primary-dark">Pré-Atendimento</span>
                            </div>
                            <p className="text-xs text-academy-primary-dark mb-3">Ficha online, termos e envio de documentos</p>
                            <div className="flex gap-2">
                              <input
                                readOnly
                                value={portalLinkData.preUrl}
                                className="flex-1 text-xs bg-white border border-[#DDD6FE] rounded-lg px-3 py-2 text-slate-600 truncate"
                              />
                              <button
                                onClick={() => { navigator.clipboard.writeText(portalLinkData.preUrl!); }}
                                className="px-3 py-2 bg-academy-primary text-white text-xs font-bold rounded-lg hover:bg-academy-primary transition-colors whitespace-nowrap"
                              >
                                Copiar
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Portal link */}
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Home size={16} className="text-blue-600" />
                            <span className="text-sm font-bold text-blue-800">Portal Completo</span>
                          </div>
                          <p className="text-xs text-blue-600 mb-3">Histórico, exames, orçamentos, agendamento</p>
                          <div className="flex gap-2">
                            <input
                              readOnly
                              value={portalLinkData.url}
                              className="flex-1 text-xs bg-white border border-blue-200 rounded-lg px-3 py-2 text-slate-600 truncate"
                            />
                            <button
                              onClick={() => { navigator.clipboard.writeText(portalLinkData.url); }}
                              className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                              Copiar
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 text-center">
                          💡 Envie o link de pré-atendimento <strong>antes</strong> da consulta para zero papel e atendimento mais rápido!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
          </AppProvider>
        )
      } />
        </Routes>

    <UpgradeLimitModal
      data={upgradeLimitModal}
      onClose={() =>
        setUpgradeLimitModal({
          open: false,
          limit: 0,
          currentUsage: 0,
          product: 'academy',
          upgradePlan: 'student',
        })
      }
      onUpgrade={() => {
        setUpgradeLimitModal({
          open: false,
          limit: 0,
          currentUsage: 0,
          product: 'academy',
          upgradePlan: 'student',
        });
        navigate('/subscription');
      }}
    />
  </>
);
}

