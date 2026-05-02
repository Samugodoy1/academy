import React, { useMemo } from 'react';
import { Calendar, ChevronRight, ClipboardList, Clock, Plus, Users } from '../icons';

interface AcademyDashboardProps {
  patients: any[];
  appointments: any[];
  openPatientRecord: (id: number) => void;
  setActiveTab: (tab: any) => void;
  setIsPatientModalOpen: (open: boolean) => void;
  openAppointmentModal: () => void;
}

const ACADEMY_PURPLE = '#8B5CF6';
const ACADEMY_PURPLE_HOVER = '#7C3AED';
const ACADEMY_PURPLE_SOFT = '#F3E8FF';
const ACADEMY_PURPLE_BORDER = '#DDD6FE';
const ACADEMY_PURPLE_DEEP = '#6D28D9';

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const formatDayTime = (date: string) => {
  const parsed = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (sameDay(parsed, today)) return `Hoje, ${formatTime(date)}`;
  if (sameDay(parsed, tomorrow)) return `Amanha, ${formatTime(date)}`;

  return `${parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}, ${formatTime(date)}`;
};

const firstName = (name?: string) => (name || 'paciente').trim().split(' ')[0] || 'paciente';

export const AcademyDashboard: React.FC<AcademyDashboardProps> = ({
  patients,
  appointments,
  openPatientRecord,
  setActiveTab,
  setIsPatientModalOpen,
  openAppointmentModal
}) => {
  const now = new Date();

  const activeAppointments = useMemo(() => {
    return appointments
      .filter(app => app.status !== 'CANCELLED')
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    return activeAppointments
      .filter(app => sameDay(new Date(app.start_time), now))
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [activeAppointments]);

  const nextAppointment = useMemo(() => {
    return activeAppointments.find(app =>
      new Date(app.start_time) >= now &&
      app.status !== 'FINISHED' &&
      app.status !== 'NO_SHOW'
    );
  }, [activeAppointments]);

  const upcomingAppointments = useMemo(() => {
    return activeAppointments
      .filter(app => new Date(app.start_time) > now)
      .filter(app => app.status !== 'FINISHED' && app.status !== 'NO_SHOW')
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 3);
  }, [activeAppointments]);

  const pendingEvolution = useMemo(() => {
    return activeAppointments
      .filter(app => app.status === 'FINISHED')
      .filter(app => {
        const patient = patients.find(p => p.id === app.patient_id);
        if (!patient?.last_evolution_date) return true;
        return new Date(patient.last_evolution_date) < new Date(app.start_time);
      })
      .slice(0, 3);
  }, [activeAppointments, patients]);

  const pausedCases = useMemo(() => {
    const scheduledPatientIds = new Set(upcomingAppointments.map(app => app.patient_id));
    return patients
      .filter(patient => !scheduledPatientIds.has(patient.id))
      .filter(patient => {
        if (!patient.created_at) return false;
        const referenceDate = patient.last_evolution_date || patient.created_at;
        const days = (now.getTime() - new Date(referenceDate).getTime()) / 86400000;
        return days >= 30;
      })
      .slice(0, 3);
  }, [patients, upcomingAppointments]);

  const mainFocus = (() => {
    const todayNext = todayAppointments.find(app => new Date(app.start_time) >= now && app.status !== 'FINISHED');

    if (todayNext) {
      return {
        eyebrow: 'Atendimento de hoje',
        title: `Hoje voce atende ${firstName(todayNext.patient_name)} as ${formatTime(todayNext.start_time)}.`,
        description: todayNext.notes || 'Abra o caso antes do atendimento e deixe a evolucao facil de registrar.',
        actionLabel: 'Abrir caso',
        action: () => openPatientRecord(todayNext.patient_id),
        icon: Calendar
      };
    }

    if (pendingEvolution.length > 0) {
      const item = pendingEvolution[0];
      return {
        eyebrow: 'Pede atencao',
        title: `Falta registrar a evolucao de ${firstName(item.patient_name)}.`,
        description: 'Resolva isso agora e tire essa pendencia da sua rotina.',
        actionLabel: 'Registrar evolucao',
        action: () => openPatientRecord(item.patient_id),
        icon: ClipboardList
      };
    }

    if (nextAppointment) {
      return {
        eyebrow: 'Proximo atendimento',
        title: `${firstName(nextAppointment.patient_name)} esta marcado para ${formatDayTime(nextAppointment.start_time)}.`,
        description: 'Sem pressa na tela: so o que voce precisa lembrar agora.',
        actionLabel: 'Ver agenda',
        action: () => setActiveTab('agenda'),
        icon: Clock
      };
    }

    if (patients.length === 0) {
      return {
        eyebrow: 'Primeiro caso',
        title: 'Voce ainda nao cadastrou casos clinicos.',
        description: 'Comece pelo primeiro caso e deixe o Academy organizar o restante.',
        actionLabel: 'Cadastrar caso',
        action: () => setIsPatientModalOpen(true),
        icon: Plus
      };
    }

    return {
      eyebrow: 'Rotina em ordem',
      title: 'Nenhuma pendencia clinica por enquanto.',
      description: 'Quando um atendimento ou caso pedir sua atencao, ele aparece aqui primeiro.',
      actionLabel: 'Novo atendimento',
      action: openAppointmentModal,
      icon: Calendar
    };
  })();

  const FocusIcon = mainFocus.icon;
  const attentionCount = pendingEvolution.length + pausedCases.length;

  return (
    <div className="max-w-screen-xl mx-auto space-y-7">
      <header className="flex flex-col gap-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: ACADEMY_PURPLE_DEEP }}>
          Academy
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-[28px] md:text-[34px] font-bold text-slate-950 tracking-tight leading-tight">
              Rotina clinica
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              O mais importante primeiro. O resto fica quieto.
            </p>
          </div>
          <button
            onClick={openAppointmentModal}
            className="w-fit inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: ACADEMY_PURPLE }}
            onMouseEnter={event => { event.currentTarget.style.backgroundColor = ACADEMY_PURPLE_HOVER; }}
            onMouseLeave={event => { event.currentTarget.style.backgroundColor = ACADEMY_PURPLE; }}
          >
            <Plus size={16} />
            Agendar
          </button>
        </div>
      </header>

      <section
        className="relative overflow-hidden rounded-[28px] border bg-white p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
        style={{ borderColor: ACADEMY_PURPLE_BORDER }}
      >
        <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[80px]" style={{ backgroundColor: ACADEMY_PURPLE_SOFT }} />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
          <div className="max-w-2xl">
            <div
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: ACADEMY_PURPLE_SOFT, color: ACADEMY_PURPLE_DEEP }}
            >
              <FocusIcon size={22} />
            </div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: ACADEMY_PURPLE_DEEP }}>
              {mainFocus.eyebrow}
            </p>
            <h3 className="text-[26px] md:text-[36px] font-bold tracking-tight text-slate-950 leading-[1.08]">
              {mainFocus.title}
            </h3>
            <p className="mt-4 text-base text-slate-500 leading-relaxed">
              {mainFocus.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <button
              onClick={mainFocus.action}
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: ACADEMY_PURPLE }}
              onMouseEnter={event => { event.currentTarget.style.backgroundColor = ACADEMY_PURPLE_HOVER; }}
              onMouseLeave={event => { event.currentTarget.style.backgroundColor = ACADEMY_PURPLE; }}
            >
              {mainFocus.actionLabel}
              <ChevronRight size={17} />
            </button>
            <p className="text-xs text-slate-400 text-left lg:text-right">
              {attentionCount > 0
                ? `Separei ${attentionCount} ${attentionCount === 1 ? 'caso que pede' : 'casos que pedem'} sua atencao.`
                : 'Sem ruido extra para hoje.'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-5">
        <div className="rounded-[24px] bg-white p-5 md:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-bold text-slate-950">Proximos atendimentos</h3>
              <p className="text-sm text-slate-500">So os proximos da fila.</p>
            </div>
            <Calendar size={19} style={{ color: ACADEMY_PURPLE }} />
          </div>

          {upcomingAppointments.length === 0 ? (
            <EmptyState text="Nenhum atendimento hoje." actionLabel="Agendar atendimento" onAction={openAppointmentModal} />
          ) : (
            <div className="divide-y divide-slate-100">
              {upcomingAppointments.map(app => (
                <button
                  key={app.id}
                  onClick={() => openPatientRecord(app.patient_id)}
                  className="w-full py-4 first:pt-0 last:pb-0 text-left flex items-center justify-between gap-4 group"
                >
                  <div>
                    <p className="font-bold text-slate-900">{app.patient_name}</p>
                    <p className="text-sm text-slate-500">{formatDayTime(app.start_time)}</p>
                  </div>
                  <ChevronRight size={17} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <SecondaryBlock
            icon={ClipboardList}
            title="Pendencias clinicas"
            description={pendingEvolution.length === 0 ? 'Nenhuma pendencia clinica por enquanto.' : `Falta evolucao em ${pendingEvolution.length} atendimento${pendingEvolution.length === 1 ? '' : 's'}.`}
            items={pendingEvolution.map(app => ({
              id: app.id,
              title: app.patient_name,
              meta: 'Falta registrar a evolucao do ultimo atendimento.',
              onClick: () => openPatientRecord(app.patient_id)
            }))}
            empty="Nenhuma pendencia clinica encontrada."
          />

          <SecondaryBlock
            icon={Users}
            title="Casos parados"
            description={pausedCases.length === 0 ? 'Nada parado agora.' : `Separei ${pausedCases.length} caso${pausedCases.length === 1 ? '' : 's'} sem movimento recente.`}
            items={pausedCases.map(patient => ({
              id: patient.id,
              title: patient.name,
              meta: 'Sem movimentacao recente.',
              onClick: () => openPatientRecord(patient.id)
            }))}
            empty={patients.length === 0 ? 'Voce ainda nao cadastrou casos clinicos.' : 'Nenhum caso parado encontrado.'}
          />
        </div>
      </section>
    </div>
  );
};

const EmptyState = ({ text, actionLabel, onAction }: { text: string; actionLabel?: string; onAction?: () => void }) => (
  <div className="rounded-[20px] bg-slate-50 px-5 py-6 text-center">
    <p className="text-sm font-semibold text-slate-500">{text}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-3 text-sm font-bold transition-colors"
        style={{ color: ACADEMY_PURPLE_DEEP }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const SecondaryBlock = ({
  icon: Icon,
  title,
  description,
  items,
  empty
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  items: Array<{ id: number; title: string; meta: string; onClick: () => void }>;
  empty: string;
}) => (
  <div className="rounded-[24px] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl shrink-0"
        style={{ backgroundColor: ACADEMY_PURPLE_SOFT, color: ACADEMY_PURPLE_DEEP }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-slate-950">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </div>

    {items.length === 0 ? (
      <p className="mt-5 text-sm font-medium text-slate-400">{empty}</p>
    ) : (
      <div className="mt-5 space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full text-left rounded-[18px] bg-slate-50 px-4 py-3 transition-colors hover:bg-[#F3E8FF]"
          >
            <p className="font-bold text-slate-900 text-sm">{item.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.meta}</p>
          </button>
        ))}
      </div>
    )}
  </div>
);
