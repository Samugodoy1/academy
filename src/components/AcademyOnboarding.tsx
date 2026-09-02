import React, { useEffect, useRef, useState } from 'react';
import { PathNode, PathStem } from '../illustrations/PathNode';
import { DuoButton } from './DuoButton';

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

  const n1Done = hasPatients;
  const n1Active = !hasPatients;
  const n2Done = hasAppointments;
  const n2Active = hasPatients && !hasAppointments;
  const n2Locked = !hasPatients;
  const n3Done = recordOpened;
  const n3Active = hasPatients && hasAppointments && !recordOpened;
  const n3Locked = !hasAppointments;
  const n4Active = activationComplete;
  const n4Locked = !activationComplete;

  useEffect(() => {
    if (n3Active) {
      const node = document.getElementById('siso-path-prontuario');
      node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [n3Active]);

  if (!welcomeSeen && !hasPatients && !hasAppointments && !onboardingDismissed) {
    return (
      <section className="page-shell">
        <div className="mx-auto flex max-w-[440px] flex-col pt-10 pb-4">
          <p className="text-[15px] text-sys-muted">Oi, {firstName}.</p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-sys-text">
            O box é seu.
          </h1>
          <p className="mt-4 text-[17px] font-normal leading-snug text-sys-muted tracking-[-0.011em]">
            Casos reais, atendimento, prontuário.
          </p>
          <DuoButton
            className="mt-10"
            onClick={() => {
              setWelcomeSeen(true);
              onDismissWelcome();
            }}
          >
            Começar
          </DuoButton>
        </div>
      </section>
    );
  }

  if (showOnboarding) {
    const title = !hasPatients
      ? 'Primeiro caso.'
      : !hasAppointments
        ? 'Marque o atendimento.'
        : !recordOpened
          ? `Abra o prontuário de ${(firstPatient?.name || 'seu caso').split(' ')[0]}.`
          : 'A rotina assume daqui.';

    const coach = !hasPatients
      ? 'Cadastre o caso que você atende.'
      : !hasAppointments
        ? 'Data, hora, o que vai fazer na cadeira.'
        : !recordOpened
          ? 'Entre no prontuário.'
          : 'Ligue a rotina.';

    return (
      <section className="page-shell">
        <div className="mx-auto flex max-w-[440px] flex-col">
          <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-sys-text">
            {title}
          </h1>
          <p className="mt-3 text-[17px] text-sys-muted tracking-[-0.011em]">{coach}</p>

          <div className="mt-10 flex w-full flex-col items-center">
            <PathNode
              done={n1Done}
              active={n1Active}
              glyph="tooth"
              label="Primeiro caso"
              onClick={() => !n1Done && setIsPatientModalOpen(true)}
            />
            <PathStem dimmed={n2Locked} />
            <PathNode
              done={n2Done}
              active={n2Active}
              locked={n2Locked}
              glyph="chair"
              label="Primeiro box"
              onClick={() => n2Active && openAppointmentModal()}
            />
            <PathStem dimmed={n3Locked} />
            <div id="siso-path-prontuario">
              <PathNode
                done={n3Done}
                active={n3Active}
                locked={n3Locked}
                glyph="chart"
                label="Prontuário"
                onClick={() => n3Active && firstPatient && openPatientRecord(firstPatient.id)}
              />
            </div>
            <PathStem dimmed={n4Locked} />
            <PathNode
              active={n4Active}
              locked={n4Locked}
              glyph="check"
              label="Rotina ligada"
              onClick={() => {
                if (!n4Active) return;
                setOnboardingDismissed(true);
                onDismissOnboarding();
              }}
            />
          </div>

          {n4Active && (
            <DuoButton
              className="mt-8"
              onClick={() => {
                setOnboardingDismissed(true);
                onDismissOnboarding();
              }}
            >
              Ir para a rotina
            </DuoButton>
          )}
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
    <div className="oh-device p-6">
      <p className="text-[17px] text-sys-text leading-snug tracking-[-0.011em]">
        Tem prontuário de {nick} que ainda não foi aberto.
      </p>
      <p className="mt-2 text-[15px] text-sys-muted">
        Sem anamnese o caso é só um nome na lista.
      </p>
      <DuoButton className="mt-5" onClick={() => openPatientRecord(firstPatient.id)}>
        Abrir prontuário
      </DuoButton>
    </div>
  );
};
