import fs from 'fs';

const appPath = 'src/App.tsx';
let content = fs.readFileSync(appPath, 'utf8');

const newImports = `import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense, lazy } from 'react';
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
  BookOpen
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
import { deriveAcademyPatientState } from './utils/deriveAcademyPatientState';
import { formatAllergieLabel, formatMedicationLabel, hasRecordedAllergie } from './utils/anamnesisUtils';
import { getPatientCardMeta, formatProcedure } from './utils/patientCardMeta';
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

`;

// Remove from "// Types" through UpgradeLimitModal closing before export default
content = content.replace(/^import React[\s\S]*?(?=export default function App)/, newImports);

// Replace patientMap + filteredAppointments + getPatientWeekRole + agendaSmartCopy block with useAgendaState
content = content.replace(
  /  \/\/ ─── O\(1\) patient lookup map[\s\S]*?  \}, \[appointments, selectedDate, now, agendaViewMode, patients\]\);\n\n  const getPatientWeekRole = useCallback[\s\S]*?  \}, \[appointments\]\);\n\n  const agendaSmartCopy = useMemo\(\(\) => \{[\s\S]*?  \}, \[appointments, selectedDate, now, agendaViewMode, patients\]\);/,
  `  const { patientMap, filteredAppointments, getPatientWeekRole, agendaSmartCopy } = useAgendaState({
    appointments,
    patients,
    statusFilter,
    agendaSearchTerm,
    agendaViewMode,
    selectedDate,
    now,
  });`
);

// Remove duplicate helper functions now in patientCardMeta (keep getRelativeDayLabel if exists after)
content = content.replace(
  /  const getPatientLastVisitDate = \(patient: Patient\) => \{[\s\S]*?  \};\n\n  const getProcedureColor = /,
  '  const getProcedureColor = '
);

// Replace agenda tab block
content = content.replace(
  /\{activeTab === 'agenda' && \(\n                    <div className="flex flex-col gap-14[\s\S]*?\)\}\n\n                  \{activeTab === 'pacientes'/,
  `{activeTab === 'agenda' && (
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
                          updateAppointmentStatus={updateAppointmentStatus}
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

                  {activeTab === 'pacientes'`
);

// Replace pacientes tab block
content = content.replace(
  /\{activeTab === 'pacientes' && \(\n                    loading \?[\s\S]*?\)\n                  \)\}\n\n                  \{\(activeTab === 'admin'/,
  `{activeTab === 'pacientes' && (
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

                  {(activeTab === 'admin'`
);

// Replace admin tab
content = content.replace(
  /\{\(activeTab === 'admin' && user\?\.role\?\.toUpperCase\(\) === 'ADMIN'\) && \(\n                    <div className="max-w-screen-xl mx-auto space-y-8">[\s\S]*?\)\}\n\n                  \{activeTab === 'configuracoes'/,
  `{(activeTab === 'admin' && user?.role?.toUpperCase() === 'ADMIN') && (
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

                  {activeTab === 'configuracoes'`
);

// Replace config tab - find from activeTab === 'configuracoes' to before modals section
content = content.replace(
  /\{activeTab === 'configuracoes' && profile && \(\n                    <div className="max-w-2xl mx-auto space-y-6">[\s\S]*?\)\}\n\n                  \{/,
  `{activeTab === 'configuracoes' && profile && (
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

                  {`
);

// Remove trailing ForgotPassword, ResetPassword, Print components
content = content.replace(/\nfunction ForgotPassword\(\)[\s\S]*$/m, '\n');

// Fix auto-filter effect to use imported getPatientCardMeta with appointments, now
content = content.replace(
  /const meta = getPatientCardMeta\(patient\);/g,
  'const meta = getPatientCardMeta(patient, appointments, now);'
);

// Remove unused imports cleanup - PatientClinical if only used in ClinicalPageRoute
content = content.replace(/import \{ PatientClinical \} from '\.\/components\/PatientClinical';\n/, '');
content = content.replace(/import \{ PortalInbox \} from '\.\/components\/PortalInbox';\n/, '');
content = content.replace(/import \{ SubscriptionManagement \} from '\.\/components\/SubscriptionManagement';\n/, '');
content = content.replace(/import AdminEngagement from '\.\/components\/AdminEngagement';\n/, '');
content = content.replace(/import \{ CURRENT_PRODUCT, PRODUCT_LABEL, type ProductCode \}/, 'import { PRODUCT_LABEL, type ProductCode }');

fs.writeFileSync(appPath, content);
console.log('App.tsx wired. New line count:', content.split('\n').length);
