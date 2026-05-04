import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Home,
  Library,
  Sparkles,
  Stethoscope,
  UserRound,
  Users
} from 'lucide-react';

interface AcademyProps {
  user?: any;
  onNavigate?: (section: string) => void;
}

const SectionCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  onClick?: () => void;
}> = ({ icon: Icon, title, description, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className="ios-card w-full text-left transition-all duration-200 hover:shadow-lg"
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="rounded-full p-3" style={{ backgroundColor: 'var(--academy-primary)', opacity: 0.1 }}>
        <Icon size={22} style={{ color: 'var(--academy-primary)' }} />
      </div>
      <ChevronRight size={18} className="text-[var(--academy-muted)] mt-1" />
    </div>
    <h3 className="font-bold text-[var(--academy-text)] mb-1">{title}</h3>
    <p className="text-[13px] text-[var(--academy-muted)]">{description}</p>
  </motion.button>
);

const ConversationalCard: React.FC<{
  title: string;
  message: string;
  reason: string;
  cta: string;
}> = ({ title, message, reason, cta }) => (
  <motion.article
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className="ios-card"
  >
    <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[var(--academy-muted)] mb-2">{title}</p>
    <p className="text-[15px] leading-6 text-[var(--academy-text)] mb-3">{message}</p>
    <div className="rounded-2xl px-3 py-2 mb-4 bg-[var(--academy-soft)]">
      <p className="text-xs text-[var(--academy-muted)]">{reason}</p>
    </div>
    <button className="text-sm font-semibold text-[var(--academy-primary)]">{cta}</button>
  </motion.article>
);

export const Academy: React.FC<AcademyProps> = ({ user, onNavigate }) => {
  const firstName = String(user?.name || 'Aluno').split(' ')[0];

  return (
    <div className="flex-1 bg-[var(--academy-bg)] overflow-y-auto pb-20">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between px-4 py-4 sticky top-0 z-10 bg-[var(--academy-bg)]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--academy-primary)] rounded-full flex items-center justify-center">
              <Stethoscope size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[var(--academy-text)] leading-none">OdontoHub Academy</p>
              <p className="text-xs text-[var(--academy-muted)]">Assistente clínico e acadêmico</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/60 rounded-full transition-all">
            <Home size={20} className="text-academy-text" />
          </button>
        </header>

        <section className="px-4 pt-4 pb-8">
          <p className="text-sm text-[var(--academy-muted)] mb-3">Agora</p>
          <h1 className="ios-title text-[30px] leading-tight mb-3">
            {firstName}, seu dia clínico e acadêmico está <span className="text-[var(--academy-primary)]">organizado por contexto</span>.
          </h1>
          <p className="ios-text-secondary text-base max-w-2xl">
            O Academy conecta agenda, pacientes, casos, evoluções, requisitos e estudos para você saber o que importa neste momento.
          </p>
        </section>

        <section className="px-4 mb-8 space-y-3">
          <ConversationalCard
            title="Atendimento próximo"
            message="Você atende Laura amanhã. O caso está quase pronto, mas ainda falta planejamento."
            reason="Importa agora porque faltam menos de 24h para a clínica e o plano acelera sua tomada de decisão em cadeira."
            cta="Abrir caso de Laura"
          />
          <ConversationalCard
            title="Registro pendente"
            message="João ficou sem evolução depois da última clínica."
            reason="Importa agora para evitar perda de detalhe clínico e manter seu histórico coerente para discussão com o professor."
            cta="Registrar evolução"
          />
          <ConversationalCard
            title="Estudo conectado ao caso"
            message="Como seu próximo caso é de Dentística, separei uma revisão curta de isolamento e adesão."
            reason="Importa agora porque revisar o procedimento ligado ao próximo atendimento reduz insegurança e retrabalho."
            cta="Iniciar revisão de 8 min"
          />
          <ConversationalCard
            title="Requisito clínico"
            message="Você ainda não vinculou nenhum caso de Endodontia neste semestre."
            reason="Importa agora para distribuir melhor sua carga clínica e não concentrar pendências no fim do período."
            cta="Ver requisitos do semestre"
          />
        </section>

        <section className="px-4 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[var(--academy-primary)]" />
            <h2 className="text-sm font-semibold tracking-[0.08em] uppercase text-[var(--academy-muted)]">Ambientes principais</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SectionCard
              icon={Calendar}
              title="Agora"
              description="Tela inicial inteligente com prioridades clínicas e acadêmicas do dia."
              onClick={() => onNavigate?.('agora')}
            />
            <SectionCard
              icon={Users}
              title="Clínica"
              description="Agenda, pacientes, casos, evoluções e requisitos conectados em fluxo único."
              onClick={() => onNavigate?.('clinica')}
            />
            <SectionCard
              icon={BookOpen}
              title="Estudos"
              description="Matérias e revisões relacionadas diretamente aos seus casos ativos."
              onClick={() => onNavigate?.('estudos')}
            />
            <SectionCard
              icon={Library}
              title="Biblioteca"
              description="Modelos, checklists e guias rápidos para preparo e execução clínica."
              onClick={() => onNavigate?.('biblioteca')}
            />
            <SectionCard
              icon={UserRound}
              title="Perfil"
              description="Dados do aluno, período, disciplinas em andamento e plano de evolução."
              onClick={() => onNavigate?.('perfil')}
            />
            <SectionCard
              icon={ClipboardList}
              title="Plano do semestre"
              description="Visão calma de requisitos pendentes e distribuição recomendada de casos."
              onClick={() => onNavigate?.('checklist')}
            />
          </div>
        </section>

        <section className="px-4 pb-8">
          <div className="ios-card bg-[var(--academy-soft)] border border-[var(--academy-border)]">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-[var(--academy-primary)] mt-0.5" />
              <p className="text-sm text-[var(--academy-muted)] leading-6">
                O Academy não substitui professor, faculdade ou protocolo institucional. Ele ajuda você a organizar, revisar,
                registrar e se preparar com clareza para cada etapa clínica.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
