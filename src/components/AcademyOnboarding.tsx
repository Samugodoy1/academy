import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ClipboardList,
  UserPlus,
  Users,
} from '../icons';

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

const getGreetingName = (user?: any) => {
  const name = user?.name || '';
  return name.replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').split(' ')[0];
};

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Bom dia', emoji: '☀️' };
  if (hour < 18) return { text: 'Boa tarde', emoji: '👋' };
  return { text: 'Boa noite', emoji: '🌙' };
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

  const completedSteps =
    (hasPatients ? 1 : 0) +
    (hasAppointments ? 1 : 0) +
    (recordOpened ? 1 : 0);
  const step3Active = hasPatients && hasAppointments && !recordOpened;
  const step4Active = activationComplete;
  const totalSteps = 4;
  const firstPatient = patients[0];
  const timeGreeting = getTimeGreeting();
  const greetingName = getGreetingName(user);
  const step3Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (step3Active && step3Ref.current) {
      step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [step3Active]);

  if (!welcomeSeen && !hasPatients && !hasAppointments && !onboardingDismissed) {
    return (
      <div className="page-shell flex flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 pt-6"
        >
          <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-[0_12px_36px_rgba(82,5,123,0.25)] mx-auto">
            <BookOpen size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-[32px] font-bold tracking-tight text-academy-text">
              Bem-vindo ao Academy
            </h1>
            <p className="text-[17px] text-academy-muted leading-relaxed max-w-md mx-auto">
              Sua rotina clínica de estudo: casos, atendimentos, evoluções e materiais integrados.
            </p>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-[13px] font-bold text-academy-muted uppercase tracking-widest px-2">
            Como funciona
          </h2>
          <div className="liquid-glass-card rounded-[28px] divide-y divide-academy-border/40">
            {[
              {
                icon: <UserPlus size={20} className="text-primary" />,
                bg: 'bg-primary/10',
                title: 'Cadastre casos clínicos',
                desc: 'Pacientes reais ou simulados — prontuário completo desde o início.',
              },
              {
                icon: <Calendar size={20} className="text-academy-primary" />,
                bg: 'bg-academy-soft',
                title: 'Organize atendimentos',
                desc: 'Agenda clínica para simular ou registrar sua rotina de box.',
              },
              {
                icon: <ClipboardList size={20} className="text-academy-primary" />,
                bg: 'bg-academy-soft',
                title: 'Registre evoluções',
                desc: 'Anamnese, odontograma e evolução clínica no prontuário.',
              },
              {
                icon: <BookOpen size={20} className="text-academy-primary" />,
                bg: 'bg-academy-soft',
                title: 'Estude no contexto',
                desc: 'Materiais de estudo ligados ao que você está atendendo.',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5">
                <div className={`w-10 h-10 ${item.bg} rounded-[14px] flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-academy-text">{item.title}</p>
                  <p className="text-[13px] text-academy-muted mt-0.5">{item.desc}</p>
                </div>
                <div className="flex items-center justify-center w-6 h-6 liquid-glass-subtle rounded-full text-[11px] font-bold text-academy-muted shrink-0 mt-1">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-[13px] font-bold text-academy-muted uppercase tracking-widest px-2">
            Onde encontrar cada coisa
          </h2>
          <div className="grid grid-cols-2 tablet-l:grid-cols-4 gap-3">
            {[
              { icon: <Users size={18} />, label: 'Casos', desc: 'Cadastro e prontuário', color: 'text-primary', bg: 'liquid-glass-card border-primary/10' },
              { icon: <Calendar size={18} />, label: 'Atendimentos', desc: 'Agenda clínica', color: 'text-academy-primary', bg: 'liquid-glass-card border-academy-primary/10' },
              { icon: <ClipboardList size={18} />, label: 'Prontuário', desc: 'Evolução e odontograma', color: 'text-academy-primary', bg: 'liquid-glass-card border-academy-primary/10' },
              { icon: <BookOpen size={18} />, label: 'Estudos', desc: 'Materiais clínicos', color: 'text-academy-primary', bg: 'liquid-glass-card border-academy-primary/10' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className={`rounded-[18px] border p-4 space-y-2 ${item.bg}`}
              >
                <span className={item.color}>{item.icon}</span>
                <p className="text-[14px] font-bold text-academy-text">{item.label}</p>
                <p className="text-[11px] text-academy-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="px-2 pt-4"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setWelcomeSeen(true);
              onDismissWelcome();
            }}
            className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-[20px] text-[16px] font-bold shadow-[0_12px_36px_rgba(82,5,123,0.22)] hover:opacity-90 transition-all"
          >
            Começar minha rotina clínica
            <ArrowRight size={18} />
          </motion.button>
          <p className="text-center text-[12px] text-academy-muted mt-3">
            Leva menos de 2 minutos para configurar
          </p>
        </motion.div>
      </div>
    );
  }

  if (showOnboarding) {
    const getOnboardingMessage = () => {
      if (!hasPatients) return 'Vamos montar sua rotina. Comece cadastrando seu primeiro caso clínico.';
      if (!hasAppointments) return 'Ótimo! Agora agende o primeiro atendimento para ativar a agenda.';
      if (!recordOpened) return 'Quase lá! Abra o caso clínico para ver prontuário, odontograma e evoluções.';
      return 'Tudo pronto! Sua rotina clínica está configurada.';
    };

    return (
      <div className="page-shell flex flex-col gap-8">
        <header className="space-y-1.5 px-2">
          <h1 className="text-[28px] font-bold tracking-tight text-academy-text">
            {timeGreeting.text}{greetingName ? `, ${greetingName}` : ''}{' '}
            <span className="text-[14px] align-middle">{timeGreeting.emoji}</span>
          </h1>
          <p className="text-[17px] font-medium text-academy-muted">{getOnboardingMessage()}</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-2 flex items-center gap-3"
        >
          <div className="flex-1 h-1.5 bg-academy-border/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.max((completedSteps / totalSteps) * 100, 8)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <span className="text-[12px] font-bold text-academy-muted shrink-0">
            {completedSteps} de {totalSteps}
          </span>
        </motion.div>

        {/* Step 1: First case */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <div className="px-2 flex items-center gap-2">
            {hasPatients ? (
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-primary" />
            )}
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Passo 1</span>
            {hasPatients && <span className="text-[11px] font-bold text-primary/60 ml-1">Concluído</span>}
          </div>
          <div className={`liquid-glass-card rounded-[28px] p-7 sm:p-8 space-y-5 ${hasPatients ? 'border-primary/20 opacity-55' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-[18px] flex items-center justify-center shrink-0">
                {hasPatients ? <Check size={22} className="text-primary" /> : <UserPlus size={22} className="text-primary" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[18px] sm:text-[20px] font-bold text-academy-text tracking-tight">
                  {hasPatients ? 'Caso clínico cadastrado' : 'Cadastre seu primeiro caso clínico'}
                </h3>
                <p className="text-[14px] text-academy-muted mt-1 leading-relaxed">
                  {hasPatients
                    ? `${patients.length} caso${patients.length > 1 ? 's' : ''} no sistema. A rotina começa pelo caso, não pela agenda.`
                    : 'Use um paciente real ou simulado. Prontuário, odontograma e evoluções ficam organizados automaticamente.'}
                </p>
              </div>
            </div>
            {!hasPatients && (
              <>
                <div className="liquid-glass-subtle rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">M</div>
                    <div>
                      <p className="text-[13px] font-semibold text-academy-text">Maria Silva</p>
                      <p className="text-[11px] text-academy-muted">Caso clínico · Em acompanhamento</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['Anamnese', 'Odontograma', 'Evolução', 'Plano'].map(label => (
                      <span key={label} className="px-2.5 py-1 liquid-glass-subtle rounded-lg text-[10px] font-bold text-academy-muted">{label}</span>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsPatientModalOpen(true)}
                  className="flex items-center gap-2.5 bg-primary text-white px-6 py-3.5 rounded-[18px] text-[14px] font-bold shadow-[0_8px_24px_rgba(82,5,123,0.2)] hover:opacity-90 transition-all"
                  >
                  Cadastrar primeiro caso
                  <ArrowRight size={15} />
                </motion.button>
              </>
            )}
          </div>
        </motion.section>

        {/* Step 2: First appointment */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          <div className="px-2 flex items-center gap-2">
            {hasAppointments ? (
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className={`w-5 h-5 rounded-full border-2 ${hasPatients ? 'border-primary' : 'border-academy-border'}`} />
            )}
            <span className={`text-[11px] font-bold uppercase tracking-widest ${hasPatients ? 'text-primary' : 'text-academy-muted/50'}`}>Passo 2</span>
            {hasAppointments && <span className="text-[11px] font-bold text-primary/60 ml-1">Concluído</span>}
          </div>
          <div className={`liquid-glass-card rounded-[28px] p-7 sm:p-8 space-y-5 ${
            hasAppointments ? 'border-primary/20 opacity-55' : hasPatients ? '' : 'opacity-45'
          }`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-academy-soft rounded-[18px] flex items-center justify-center shrink-0">
                {hasAppointments ? <Check size={22} className="text-primary" /> : <Calendar size={22} className="text-primary" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[18px] sm:text-[20px] font-bold text-academy-text tracking-tight">
                  {hasAppointments ? 'Agenda ativa' : 'Agende o primeiro atendimento'}
                </h3>
                <p className="text-[14px] text-academy-muted mt-1 leading-relaxed">
                  {hasAppointments
                    ? 'Sua agenda clínica está funcionando. Acesse Atendimentos no menu para gerenciar.'
                    : hasPatients
                      ? 'Simule ou registre um atendimento. É assim que a rotina de box ganha forma.'
                      : 'Primeiro cadastre um caso clínico (passo 1), depois agende aqui.'}
                </p>
              </div>
            </div>
            {hasPatients && !hasAppointments && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={openAppointmentModal}
                className="flex items-center gap-2.5 bg-primary text-white px-6 py-3.5 rounded-[18px] text-[14px] font-bold shadow-[0_8px_24px_rgba(82,5,123,0.2)] hover:opacity-90 transition-all"
              >
                Agendar primeiro atendimento
                <ArrowRight size={15} />
              </motion.button>
            )}
          </div>
        </motion.section>

        {/* Step 3: Open clinical record */}
        <motion.section ref={step3Ref} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
          <div className="px-2 flex items-center gap-2">
            {recordOpened ? (
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className={`w-5 h-5 rounded-full border-2 ${step3Active ? 'border-primary' : 'border-academy-border'}`} />
            )}
            <span className={`text-[11px] font-bold uppercase tracking-widest ${step3Active || recordOpened ? 'text-primary' : 'text-academy-muted/50'}`}>Passo 3</span>
            {recordOpened && <span className="text-[11px] font-bold text-primary/60 ml-1">Concluído</span>}
          </div>
          <div className={`liquid-glass-card rounded-[28px] p-7 sm:p-8 space-y-5 ${
            recordOpened ? 'border-primary/20 opacity-55' : step3Active ? 'ring-2 ring-primary/10' : ''
          }`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-academy-soft rounded-[18px] flex items-center justify-center shrink-0">
                {recordOpened ? <Check size={22} className="text-primary" /> : <ClipboardList size={22} className="text-primary" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[18px] sm:text-[20px] font-bold text-academy-text tracking-tight">
                  {recordOpened ? 'Caso clínico explorado' : 'Abra o prontuário do caso'}
                </h3>
                <p className="text-[14px] text-academy-muted mt-1 leading-relaxed">
                  {recordOpened
                    ? 'Anamnese, odontograma e evoluções ficam no prontuário — o coração da rotina clínica.'
                    : step3Active
                      ? `Abra o caso de ${firstPatient?.name?.split(' ')[0] || 'seu paciente'}. É aqui que você registra evoluções de verdade.`
                      : 'Após cadastrar caso e agendar atendimento, explore o prontuário.'}
                </p>
              </div>
            </div>
            {step3Active && firstPatient && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => openPatientRecord(firstPatient.id)}
                className="flex items-center gap-2.5 bg-primary text-white px-6 py-3.5 rounded-[18px] text-[14px] font-bold shadow-[0_8px_24px_rgba(82,5,123,0.2)] hover:opacity-90 transition-all"
              >
                Abrir caso de {firstPatient.name?.split(' ')[0] || 'paciente'}
                <ArrowRight size={15} />
              </motion.button>
            )}
          </div>
        </motion.section>

        {/* Step 4: Finish */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
          <div className="px-2 flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full border-2 ${step4Active ? 'border-primary' : 'border-academy-border'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-widest ${step4Active ? 'text-primary' : 'text-academy-muted/50'}`}>Passo 4</span>
          </div>
          <div className="liquid-glass-card rounded-[28px] p-7 sm:p-8 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-academy-soft rounded-[18px] flex items-center justify-center shrink-0">
                <BookOpen size={22} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[18px] sm:text-[20px] font-bold text-academy-text tracking-tight">Pronto! Explore seu painel</h3>
                <p className="text-[14px] text-academy-muted mt-1 leading-relaxed">
                  {step4Active
                    ? 'Sua rotina clínica está ativa. O Início mostra próximos atendimentos, pendências e sugestões de estudo.'
                    : 'Após explorar o prontuário, esta tela guia seu dia clínico.'}
                </p>
              </div>
            </div>
            {step4Active && (
              <>
                <div className="liquid-glass-card border border-emerald-200/50 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Check size={18} className="text-academy-success-text shrink-0" />
                  <p className="text-[13px] font-semibold text-academy-success-text">Rotina clínica ativada! Você já pode usar o Academy normalmente.</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setOnboardingDismissed(true);
                    onDismissOnboarding();
                  }}
                  className="flex items-center gap-2.5 bg-primary text-white px-6 py-3.5 rounded-[18px] text-[14px] font-bold shadow-[0_8px_24px_rgba(82,5,123,0.2)] hover:opacity-90 transition-all"
                >
                  Ir para o painel principal
                  <ArrowRight size={15} />
                </motion.button>
              </>
            )}
          </div>
        </motion.section>
      </div>
    );
  }

  return <>{children}</>;
};

/** Card shown on main dashboard when user skipped onboarding but hasn't opened a record yet. */
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] liquid-glass-card border border-primary/15 p-5 space-y-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-academy-soft rounded-[14px] flex items-center justify-center shrink-0">
          <ClipboardList size={20} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-academy-text">Falta um passo para ativar sua rotina</p>
          <p className="text-[13px] text-academy-muted mt-1 leading-relaxed">
            Abra o caso de {firstPatient.name?.split(' ')[0]} para registrar evoluções, odontograma e pendências clínicas.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => openPatientRecord(firstPatient.id)}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-[16px] text-[14px] font-bold hover:opacity-90 transition-colors"
      >
        Abrir caso clínico agora
        <ArrowRight size={15} />
      </button>
    </motion.div>
  );
};
