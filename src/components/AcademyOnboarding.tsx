import React, { useEffect, useRef, useState } from 'react';
import { Siso } from '../illustrations/Siso';
import { SpeechBubble } from '../illustrations/SpeechBubble';
import { PathNode, PathStem } from '../illustrations/PathNode';
import { MolarStamp } from '../illustrations/glyphs';
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
      <section className="page-shell siso-stage">
        <div className="mx-auto flex max-w-[440px] flex-col items-center pt-2 pb-4">
          <div className="relative">
            <span className="absolute -left-8 top-2 siso-idle">
              <MolarStamp size={18} rotate={-18} />
            </span>
            <span className="absolute -right-6 top-10 siso-bounce">
              <MolarStamp size={16} rotate={22} />
            </span>
            <Siso mood="wave" size={176} />
          </div>
          <div className="mt-5 w-full">
            <SpeechBubble>
              <p className="text-[22px] leading-snug">Oi, {firstName}.</p>
              <p className="mt-2 text-[15px] font-bold leading-snug text-[#3B0459]/80">
                Eu sou o Siso — o dente que a faculdade não arrancou. Daqui pra frente o box é
                seu: casos reais, atendimento, prontuário. Sem aula genérica. Sem checklist de
                startup.
              </p>
            </SpeechBubble>
          </div>
          <DuoButton
            className="mt-7"
            onClick={() => {
              setWelcomeSeen(true);
              onDismissWelcome();
            }}
          >
            Bora, Siso
          </DuoButton>
          <p className="mt-3 text-center text-[12px] font-bold text-[#8E8E93]">
            Você escolhe o ritmo. Eu só não deixo o box vazio.
          </p>
        </div>
      </section>
    );
  }

  if (showOnboarding) {
    const bubble = !hasPatients
      ? 'Primeiro caso. Sem nome na ficha o box é só cadeira vazia.'
      : !hasAppointments
        ? 'Tem caso. Falta marcar o atendimento — senão é só cadastro bonito.'
        : !recordOpened
          ? `Abre o prontuário de ${(firstPatient?.name || 'seu caso').split(' ')[0]}. Anamnese, odontograma, o que o professor cobra.`
          : 'Trilha fechada. A rotina assume daqui. Eu fico de olho no siso — no seu, não no meu.';

    const coach = !hasPatients
      ? 'Toque no primeiro nó. Cadastre o caso que você realmente atende.'
      : !hasAppointments
        ? 'Agora o segundo nó. Data, hora, o que vai fazer na cadeira.'
        : !recordOpened
          ? 'Terceiro nó: entra no prontuário. Sem isso o caso é só um nome.'
          : 'Último nó. Liga a rotina e parte pro painel.';

    return (
      <section className="page-shell siso-stage">
        <div className="mx-auto flex max-w-[440px] flex-col items-center">
          <Siso
            mood={activationComplete ? 'celebrate' : hasPatients ? 'proud' : 'think'}
            size={136}
          />
          <div className="mt-4 w-full">
            <SpeechBubble>
              <p className="text-[20px] leading-snug">{bubble}</p>
            </SpeechBubble>
          </div>

          <div className="mt-8 flex w-full flex-col items-center">
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

          <p className="mt-8 max-w-[300px] text-center text-[13px] font-bold leading-snug text-[#8E8E93]">
            {coach}
          </p>

          {n4Active && (
            <DuoButton
              className="mt-5"
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
    <div className="comic-card p-5">
      <div className="flex items-end gap-3">
        <Siso mood="think" size={92} className="shrink-0" />
        <div className="min-w-0 flex-1 pb-3">
          <SpeechBubble>
            <p className="text-[17px] leading-snug">
              Tem prontuário de {nick} que ainda não foi aberto.
            </p>
            <p className="mt-1.5 text-[14px] font-bold text-[#3B0459]/75">
              Sem anamnese o caso é só um nome na lista.
            </p>
          </SpeechBubble>
        </div>
      </div>
      <DuoButton className="mt-4" onClick={() => openPatientRecord(firstPatient.id)}>
        Abrir prontuário
      </DuoButton>
    </div>
  );
};
