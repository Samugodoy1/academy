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
              <p className="text-[22px] leading-snug">Oi, {firstName}! Eu sou o Siso.</p>
              <p className="mt-2 text-[15px] font-bold leading-snug text-[#3B0459]/80">
                Vou te ajudar a lembrar quem você atende, o que precisa separar antes do box e o
                que ficou pra anotar depois. Do jeito que a faculdade realmente acontece.
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
            Vamos começar
          </DuoButton>
          <p className="mt-3 text-center text-[12px] font-bold text-[#8E8E93]">
            Leva só um minutinho pra deixar tudo no jeito.
          </p>
        </div>
      </section>
    );
  }

  if (showOnboarding) {
    const bubble = !hasPatients
      ? 'Vamos colocar aqui a primeira pessoa que você atende na faculdade?'
      : !hasAppointments
        ? `Boa! Agora, quando você vai atender ${(firstPatient?.name || 'essa pessoa').split(' ')[0]}?`
        : !recordOpened
          ? `Antes do box, dá uma olhada na ficha de ${(firstPatient?.name || 'seu paciente').split(' ')[0]}. Assim você já chega sabendo o que falta.`
          : 'Pronto! Da próxima vez que você entrar, eu te mostro de onde continuar.';

    const coach = !hasPatients
      ? 'Comece pelo nome. O restante você pode completar aos poucos.'
      : !hasAppointments
        ? 'Escolha o paciente, o dia e o horário do atendimento.'
        : !recordOpened
          ? 'Abra a ficha e veja com calma o que já está preenchido.'
          : 'Toque no último passo para ver sua rotina.';

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
              label="Adicionar paciente"
              onClick={n1Done ? undefined : () => setIsPatientModalOpen(true)}
            />
            <PathStem dimmed={n2Locked} />
            <PathNode
              done={n2Done}
              active={n2Active}
              locked={n2Locked}
              glyph="chair"
              label="Marcar atendimento"
              onClick={() => {
                if (n2Locked) {
                  setIsPatientModalOpen(true);
                  return;
                }
                openAppointmentModal();
              }}
            />
            <PathStem dimmed={n3Locked} />
            <div id="siso-path-prontuario">
              <PathNode
                done={n3Done}
                active={n3Active}
                locked={n3Locked}
                glyph="chart"
                label="Conhecer a ficha"
                onClick={() => {
                  if (!hasPatients) {
                    setIsPatientModalOpen(true);
                    return;
                  }
                  if (!hasAppointments) {
                    openAppointmentModal();
                    return;
                  }
                  if (firstPatient) openPatientRecord(firstPatient.id);
                }}
              />
            </div>
            <PathStem dimmed={n4Locked} />
            <PathNode
              active={n4Active}
              locked={n4Locked}
              glyph="check"
              label="Tudo pronto"
              onClick={n4Active
                ? () => {
                    setOnboardingDismissed(true);
                    onDismissOnboarding();
                  }
                : undefined}
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
              Ver minha rotina
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
              Você ainda não abriu a ficha de {nick}.
            </p>
            <p className="mt-1.5 text-[14px] font-bold text-[#3B0459]/75">
              Dá uma olhada agora pra ver o que já está preenchido e o que falta.
            </p>
          </SpeechBubble>
        </div>
      </div>
      <DuoButton className="mt-4" onClick={() => openPatientRecord(firstPatient.id)}>
        Ver ficha de {nick}
      </DuoButton>
    </div>
  );
};
