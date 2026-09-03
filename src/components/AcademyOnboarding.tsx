import React, { useState, useRef } from 'react';
import { Check } from '../icons';

interface AcademyOnboardingProps {
  user?: any;
  patients: any[];
  totalAppointmentsCount: number;
  openPatientRecord: (id: number) => void;
  setIsPatientModalOpen: (open: boolean) => void;
  openAppointmentModal: () => void;
  onDismissOnboarding: () => void;
  onDismissWelcome: () => void;
  children: React.ReactNode;
}

const firstNameOf = (user?: any) => {
  const name = user?.name || '';
  return name.replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').split(' ')[0] || 'você';
};

type SetupStep = {
  id: 'patient' | 'appointment' | 'record';
  label: string;
  done: boolean;
  active: boolean;
  locked: boolean;
  onOpen: () => void;
};

export const AcademyOnboarding: React.FC<AcademyOnboardingProps> = ({
  user,
  patients,
  totalAppointmentsCount,
  openPatientRecord,
  setIsPatientModalOpen,
  openAppointmentModal,
  onDismissOnboarding,
  onDismissWelcome,
  children,
}) => {
  const hasPatients = patients.length > 0;
  const hasAppointments = totalAppointmentsCount > 0;
  const recordOpened = user?.record_opened ?? false;
  const activationComplete = hasPatients && hasAppointments && recordOpened;
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => user?.onboarding_done ?? false);
  const [welcomeSeen, setWelcomeSeen] = useState(() => user?.welcome_seen ?? false);
  const wasInOnboarding = useRef(!activationComplete);
  const showOnboarding = !onboardingDismissed && (!activationComplete || wasInOnboarding.current);

  const firstPatient = patients[0];
  const firstName = firstNameOf(user);
  const patientNick = (firstPatient?.name || 'seu caso').split(' ')[0];

  const finishOnboarding = () => {
    setOnboardingDismissed(true);
    onDismissOnboarding();
  };

  const steps: SetupStep[] = [
    {
      id: 'patient',
      label: 'Paciente',
      done: hasPatients,
      active: !hasPatients,
      locked: false,
      onOpen: () => setIsPatientModalOpen(true),
    },
    {
      id: 'appointment',
      label: 'Atendimento',
      done: hasAppointments,
      active: hasPatients && !hasAppointments,
      locked: !hasPatients,
      onOpen: () => openAppointmentModal(),
    },
    {
      id: 'record',
      label: 'Prontuário',
      done: recordOpened,
      active: hasPatients && hasAppointments && !recordOpened,
      locked: !hasAppointments,
      onOpen: () => firstPatient && openPatientRecord(firstPatient.id),
    },
  ];

  const currentIndex = steps.findIndex(step => step.active);
  const currentStep = currentIndex >= 0 ? steps[currentIndex] : null;
  const stepNumber = currentIndex >= 0 ? currentIndex + 1 : 3;

  if (!welcomeSeen && !hasPatients && !hasAppointments && !onboardingDismissed) {
    return (
      <section className="page-shell">
        <div className="mx-auto flex min-h-[72vh] max-w-[440px] flex-col">
          <div className="flex-1 pt-6">
            <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">Academy</p>
            <p className="mt-8 text-[15px] tracking-[-0.011em] text-[var(--neo-gray)]">
              Oi, {firstName}.
            </p>
            <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[40px]">
              O box é seu.
            </h1>
            <p className="mt-4 max-w-[28ch] text-[17px] font-normal leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
              Paciente, atendimento, prontuário. Três passos para ligar a rotina da clínica.
            </p>
          </div>
          <button
            type="button"
            className="neo-pill w-full"
            onClick={() => {
              setWelcomeSeen(true);
              onDismissWelcome();
            }}
          >
            Começar
          </button>
        </div>
      </section>
    );
  }

  if (showOnboarding) {
    if (activationComplete) {
      return (
        <section className="page-shell">
          <div className="mx-auto flex min-h-[72vh] max-w-[440px] flex-col">
            <div className="flex-1 pt-6">
              <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">Academy</p>
              <h1 className="mt-8 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[40px]">
                Rotina ligada.
              </h1>
              <p className="mt-4 max-w-[28ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
                Paciente, atendimento e prontuário. A home assume daqui.
              </p>
              <ol className="mt-10 overflow-hidden rounded-[24px] bg-[#f5f5f7]">
                {steps.map(step => (
                  <li
                    key={step.id}
                    className="flex items-center gap-3 border-b border-black/[0.04] px-5 py-4 last:border-b-0"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--neo)] text-white">
                      <Check size={14} />
                    </span>
                    <span className="text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
                      {step.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <button type="button" className="neo-pill w-full" onClick={finishOnboarding}>
              Ir para hoje
            </button>
          </div>
        </section>
      );
    }

    const copy = !hasPatients
      ? {
          title: 'Primeiro caso.',
          coach: 'Cadastre o paciente que você atende na faculdade.',
          action: 'Cadastrar paciente',
        }
      : !hasAppointments
        ? {
            title: 'Primeiro atendimento.',
            coach: 'Marque data, hora e o que você vai fazer na cadeira.',
            action: 'Marcar atendimento',
          }
        : {
            title: `Abra o prontuário de ${patientNick}.`,
            coach: 'Sem anamnese o caso é só um nome na lista.',
            action: 'Abrir prontuário',
          };

    return (
      <section className="page-shell">
        <div className="mx-auto flex min-h-[72vh] max-w-[440px] flex-col">
          <div className="flex-1 pt-6">
            <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">
              Passo {stepNumber} de 3
            </p>
            <h1 className="mt-8 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[40px]">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-[30ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
              {copy.coach}
            </p>

            <ol className="mt-10 overflow-hidden rounded-[24px] bg-[#f5f5f7]">
              {steps.map(step => (
                <li key={step.id} className="border-b border-black/[0.04] last:border-b-0">
                  <button
                    type="button"
                    disabled={!step.active}
                    onClick={() => step.onOpen()}
                    className={`flex w-full items-center gap-3 px-5 py-4 text-left ${
                      step.locked ? 'opacity-40' : ''
                    } ${step.active ? '' : 'cursor-default'}`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        step.done
                          ? 'bg-[var(--neo)] text-white'
                          : step.active
                            ? 'bg-[var(--neo-soft)] text-[var(--neo)]'
                            : 'bg-white text-transparent'
                      }`}
                    >
                      {step.done ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                    </span>
                    <span
                      className={`min-w-0 flex-1 text-[17px] tracking-[-0.011em] ${
                        step.active ? 'font-semibold text-[var(--neo-ink)]' : 'text-[var(--neo-ink)]'
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.active && (
                      <span className="neo-link shrink-0 text-[15px]">Abrir ›</span>
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <button
            type="button"
            className="neo-pill w-full"
            onClick={() => currentStep?.onOpen()}
          >
            {copy.action}
          </button>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};

export const AcademyActivationCard: React.FC<{
  user?: any;
  patients: any[];
  totalAppointmentsCount: number;
  onboardingDismissed: boolean;
  openPatientRecord: (id: number) => void;
}> = ({ user, patients, totalAppointmentsCount, onboardingDismissed, openPatientRecord }) => {
  const recordOpened = user?.record_opened ?? false;
  const firstPatient = patients[0];
  if (recordOpened || !onboardingDismissed || patients.length === 0 || totalAppointmentsCount === 0 || !firstPatient) {
    return null;
  }

  const nick = firstPatient.name?.split(' ')[0] || 'seu caso';

  return (
    <button
      type="button"
      onClick={() => openPatientRecord(firstPatient.id)}
      className="flex w-full items-center justify-between gap-4 rounded-[24px] bg-[#f5f5f7] px-5 py-4 text-left"
    >
      <div className="min-w-0">
        <p className="text-[15px] tracking-[-0.011em] text-[var(--neo-ink)]">
          Prontuário de {nick} ainda não foi aberto.
        </p>
        <p className="mt-0.5 text-[13px] text-[var(--neo-gray)]">
          Sem anamnese o caso é só um nome na lista.
        </p>
      </div>
      <span className="neo-link shrink-0 text-[15px]">Abrir ›</span>
    </button>
  );
};
