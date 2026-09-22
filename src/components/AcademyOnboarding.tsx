import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from '../icons';
import { CharacterAvatar, GUIDE_ID } from '../features/game/characters';
import { AcademyStageControl } from './AcademyStageControl';
import type { AcademyStage } from '../theme/academyStage';
import {
  ACADEMY_TOUR,
  readColaOpened,
  writeColaOpened,
  type SetupStepId,
} from './academyOnboarding';

interface AcademyOnboardingProps {
  user?: any;
  patients: any[];
  totalAppointmentsCount: number;
  openPatientRecord: (id: number) => void;
  setIsPatientModalOpen: (open: boolean) => void;
  openAppointmentModal: () => void;
  openCola: () => void;
  openBase?: () => void;
  /** Resolved stage; null means we still have to ask. */
  stage?: AcademyStage | null;
  onChooseStage?: (stage: AcademyStage) => void;
  onDismissOnboarding: () => void;
  onDismissWelcome: () => void;
  children: React.ReactNode;
}

const firstNameOf = (user?: any) => {
  const name = user?.name || '';
  return name.replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').split(' ')[0] || 'você';
};

type SetupStep = {
  id: SetupStepId;
  label: string;
  hint: string;
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
  openCola,
  openBase,
  stage = null,
  onChooseStage,
  onDismissOnboarding,
  onDismissWelcome,
  children,
}) => {
  const hasPatients = patients.length > 0;
  const hasAppointments = totalAppointmentsCount > 0;
  const recordOpened = user?.record_opened ?? false;
  const [colaOpened, setColaOpened] = useState(() => readColaOpened(user?.id));
  const activationComplete = hasPatients && hasAppointments && recordOpened && colaOpened;
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => user?.onboarding_done ?? false);
  const [welcomeSeen, setWelcomeSeen] = useState(() => user?.welcome_seen ?? false);
  const [tourIndex, setTourIndex] = useState(0);
  const wasInOnboarding = useRef(!activationComplete);
  const showOnboarding = !onboardingDismissed && (!activationComplete || wasInOnboarding.current);
  const [stageChoice, setStageChoice] = useState<AcademyStage | null>(stage);
  const askStage = Boolean(onChooseStage) && stage === null && !hasPatients && !hasAppointments;
  // Someone in the basic cycle has no box to set up: the checklist is not for them yet.
  const basicCycleFirst = stage === 'pre-clinico' && !hasPatients;

  useEffect(() => {
    if (basicCycleFirst && !onboardingDismissed && welcomeSeen) {
      setOnboardingDismissed(true);
      onDismissOnboarding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicCycleFirst, onboardingDismissed, welcomeSeen]);

  const firstPatient = patients[0];
  const firstName = firstNameOf(user);
  const patientNick = (firstPatient?.name || 'seu caso').split(' ')[0];

  const finishOnboarding = () => {
    setOnboardingDismissed(true);
    onDismissOnboarding();
  };

  const skipToAcademy = () => {
    setWelcomeSeen(true);
    onDismissWelcome();
    finishOnboarding();
  };

  const markCola = () => {
    writeColaOpened(user?.id);
    setColaOpened(true);
    openCola();
  };

  const steps: SetupStep[] = [
    {
      id: 'patient',
      label: 'Caso',
      hint: 'Quem você atende',
      done: hasPatients,
      active: !hasPatients,
      locked: false,
      onOpen: () => setIsPatientModalOpen(true),
    },
    {
      id: 'appointment',
      label: 'Box',
      hint: 'Horário na cadeira',
      done: hasAppointments,
      active: hasPatients && !hasAppointments,
      locked: !hasPatients,
      onOpen: () => openAppointmentModal(),
    },
    {
      id: 'record',
      label: 'Prontuário',
      hint: 'Anamnese e evolução',
      done: recordOpened,
      active: hasPatients && hasAppointments && !recordOpened,
      locked: !hasAppointments,
      onOpen: () => firstPatient && openPatientRecord(firstPatient.id),
    },
    {
      id: 'cola',
      label: 'Cola',
      hint: 'Jogo antes do box',
      done: colaOpened,
      active: hasPatients && hasAppointments && recordOpened && !colaOpened,
      locked: !recordOpened,
      onOpen: markCola,
    },
  ];

  const currentIndex = steps.findIndex(step => step.active);
  const currentStep = currentIndex >= 0 ? steps[currentIndex] : null;
  const stepNumber = currentIndex >= 0 ? currentIndex + 1 : steps.length;

  if (!welcomeSeen && !hasPatients && !hasAppointments && !onboardingDismissed) {
    const slide = ACADEMY_TOUR[tourIndex];
    const last = tourIndex === ACADEMY_TOUR.length - 1;
    const moods = ['happy', 'idle', 'wow', 'cheer'] as const;

    return (
      <section className="page-shell">
        <div className="mx-auto flex min-h-[72vh] max-w-[440px] flex-col">
          <div className="flex items-center justify-between pt-2">
            <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">{slide.kicker}</p>
            <button
              type="button"
              className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]"
              onClick={skipToAcademy}
            >
              Explorar
            </button>
          </div>

          <div className="flex flex-1 flex-col pt-8">
            <CharacterAvatar id={GUIDE_ID} mood={moods[tourIndex] ?? 'happy'} size={88} />
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.kicker}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {tourIndex === 0 && (
                  <p className="mt-6 text-[15px] tracking-[-0.011em] text-[var(--neo-gray)]">
                    Fala, {firstName}.
                  </p>
                )}
                <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[40px]">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-[32ch] text-[17px] font-normal leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
                  {slide.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex gap-1.5" aria-hidden>
              {ACADEMY_TOUR.map((item, index) => (
                <span
                  key={item.kicker}
                  className={`h-1 rounded-full transition-all ${
                    index === tourIndex ? 'w-5 bg-[var(--neo-ink)]' : 'w-1.5 bg-[var(--neo-ink)]/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="neo-pill w-full"
            onClick={() => {
              if (!last) {
                setTourIndex(index => index + 1);
                return;
              }
              setWelcomeSeen(true);
              onDismissWelcome();
            }}
          >
            {last ? (askStage ? 'Começar' : 'Montar o box') : 'Continuar'}
          </button>
        </div>
      </section>
    );
  }

  if (askStage && !onboardingDismissed) {
    return (
      <section className="page-shell">
        <div className="mx-auto flex min-h-[72vh] max-w-[440px] flex-col">
          <div className="flex items-center justify-between pt-2">
            <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">Uma pergunta</p>
            <button
              type="button"
              className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]"
              onClick={skipToAcademy}
            >
              Pular
            </button>
          </div>
          <div className="flex-1 pt-8">
            <CharacterAvatar id={GUIDE_ID} mood="idle" size={88} />
            <h1 className="mt-6 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[40px]">
              Onde você está no curso?
            </h1>
            <p className="mt-4 max-w-[32ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
              A home muda com a resposta. Dá pra trocar depois em Conta.
            </p>
            <div className="mt-10">
              <AcademyStageControl value={stageChoice} onChange={setStageChoice} size="cards" />
            </div>
          </div>
          <button
            type="button"
            className="neo-pill w-full disabled:opacity-40"
            disabled={!stageChoice}
            onClick={() => {
              if (!stageChoice) return;
              onChooseStage?.(stageChoice);
              if (stageChoice === 'pre-clinico') {
                finishOnboarding();
                openBase?.();
              }
            }}
          >
            {stageChoice === 'pre-clinico' ? 'Abrir Estudos' : stageChoice === 'clinico' ? 'Montar o box' : 'Continuar'}
          </button>
        </div>
      </section>
    );
  }

  if (basicCycleFirst) {
    return <>{children}</>;
  }

  if (showOnboarding) {
    if (activationComplete) {
      return (
        <section className="page-shell">
          <div className="mx-auto flex min-h-[72vh] max-w-[440px] flex-col">
            <div className="flex-1 pt-6">
              <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">OdontoHub Academy</p>
              <h1 className="mt-8 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[40px]">
                Academy ligado.
              </h1>
              <p className="mt-4 max-w-[32ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
                Caso, box, prontuário e a Cola. A home te guia; o jogo te puxa de volta.
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
                    <span className="min-w-0 flex-1">
                      <span className="block text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
                        {step.label}
                      </span>
                      <span className="block text-[13px] text-[var(--neo-gray)]">{step.hint}</span>
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
          coach: 'Quem senta na cadeira entra na lista. Depois o box e a Cola ligam em volta dele.',
          action: 'Cadastrar paciente',
        }
      : !hasAppointments
        ? {
            title: 'Marca o box.',
            coach: 'Horário, procedimento, cadeira. A Cola usa esse próximo atendimento para treinar o tema certo.',
            action: 'Marcar atendimento',
          }
        : !recordOpened
          ? {
              title: `Abre o prontuário de ${patientNick}.`,
              coach: 'Anamnese, odontograma, evolução. Sem isso o caso é só um nome.',
              action: 'Abrir prontuário',
            }
          : {
              title: 'Joga uma lição na Cola.',
              coach: 'Dois minutos no tema do box. Ofensiva, XP e a turma da clínica te acompanham.',
              action: 'Abrir a Cola',
            };

    return (
      <section className="page-shell">
        <div className="mx-auto flex min-h-[72vh] max-w-[440px] flex-col">
          <div className="flex items-center justify-between pt-2">
            <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">
              Passo {stepNumber} de {steps.length}
            </p>
            <button
              type="button"
              className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]"
              onClick={skipToAcademy}
            >
              Pular
            </button>
          </div>
          <div className="flex-1 pt-6">
            <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[40px]">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-[34ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
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
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[17px] tracking-[-0.011em] ${
                          step.active ? 'font-semibold text-[var(--neo-ink)]' : 'text-[var(--neo-ink)]'
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="block text-[13px] text-[var(--neo-gray)]">{step.hint}</span>
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
  openCola?: () => void;
}> = ({ user, patients, totalAppointmentsCount, onboardingDismissed, openPatientRecord, openCola }) => {
  const recordOpened = user?.record_opened ?? false;
  const firstPatient = patients[0];
  const colaOpened = readColaOpened(user?.id);

  if (!onboardingDismissed || patients.length === 0 || totalAppointmentsCount === 0 || !firstPatient) {
    return null;
  }

  if (!recordOpened) {
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
  }

  if (!colaOpened && openCola) {
    return (
      <button
        type="button"
        onClick={() => {
          writeColaOpened(user?.id);
          openCola();
        }}
        className="flex w-full items-center justify-between gap-4 rounded-[24px] bg-[#f5f5f7] px-5 py-4 text-left"
      >
        <div className="min-w-0">
          <p className="text-[15px] tracking-[-0.011em] text-[var(--neo-ink)]">
            Ainda não jogou a Cola.
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--neo-gray)]">
            Uma lição de 2 minutos no tema do próximo box.
          </p>
        </div>
        <span className="neo-link shrink-0 text-[15px]">Jogar ›</span>
      </button>
    );
  }

  return null;
};
