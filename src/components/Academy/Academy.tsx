import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Users,
} from 'lucide-react';
import { AcademyNeoPicker } from '../AcademyNeoPicker';

interface AcademyProps {
  user?: any;
  onNavigate?: (section: string) => void;
}

const firstNameOf = (user?: any) => {
  const name = user?.name || '';
  return name.replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').split(' ')[0] || '';
};

const academicLine = (user?: any) => {
  return [user?.academic_period, user?.institution].filter(Boolean).join(' · ');
};

export const Academy: React.FC<AcademyProps> = ({ user, onNavigate }) => {
  const firstName = firstNameOf(user);
  const meta = academicLine(user);

  return (
    <div className="relative flex-1 overflow-y-auto bg-[var(--neo-wash)] pb-20 text-[var(--neo-ink)]">
      <div className="neo-blobs" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl px-4 pt-6">
        <header className="mb-8 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] text-[var(--neo-gray)] tracking-[-0.011em]">
              Oi{firstName ? `, ${firstName}` : ''}
            </p>
            {meta && (
              <p className="mt-1 text-[15px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
                {meta}
              </p>
            )}
          </div>
          <span className="neo-pill !px-3 !py-1.5 !text-[13px] shrink-0">0 pacientes</span>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="neo-card overflow-hidden"
        >
          <div className="px-6 pt-7 pb-5">
            <h1 className="text-[28px] sm:text-[34px] font-semibold leading-[1.05] tracking-[-0.025em]">
              Tudo pronto para o seu próximo atendimento.
            </h1>
          </div>
          <div className="mx-4 mb-4 rounded-[22px] bg-[var(--neo)] px-5 py-5 text-white">
            <p className="text-[13px] font-normal tracking-[-0.011em] text-white/80">
              Sem horário · cadeira livre
            </p>
            <p className="mt-1 text-[22px] font-semibold leading-[1.05] tracking-[-0.025em]">
              Nenhum paciente ainda
            </p>
            <p className="mt-1 text-[15px] text-white/80">Comece pelo seu primeiro caso.</p>
          </div>
          <div className="mx-4 mb-6 rounded-[20px] bg-[var(--neo-wash)] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[13px] text-[var(--neo-gray)]">Checklist</p>
              <p className="text-[15px] text-[var(--neo-ink)]">Modo Box quando o caso chegar</p>
            </div>
            <span className="text-[15px] text-[var(--neo)]">Pronto</span>
          </div>
        </motion.section>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { id: 'agenda', title: 'Agenda', description: 'A semana clínica', icon: Calendar },
            { id: 'pacientes', title: 'Pacientes', description: 'Os seus casos', icon: Users },
            { id: 'estudos', title: 'Estudos', description: 'Antes do box', icon: BookOpen, highlight: true },
            { id: 'checklist', title: 'Modo Box', description: 'A lista visível', icon: CheckCircle2 },
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate?.(item.id)}
              className={`rounded-[24px] p-5 text-left ${
                item.highlight ? 'bg-[var(--neo-soft)]' : 'bg-white'
              }`}
            >
              <item.icon size={20} className="text-[var(--neo)] mb-4" />
              <p className="font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">{item.title}</p>
              <p className="mt-1 text-[13px] text-[var(--neo-gray)]">{item.description}</p>
              <p className="neo-link mt-3 inline-flex items-center text-[14px]">
                Ver <ChevronRight size={14} />
              </p>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] text-[var(--neo-gray)]">
          Nenhum paciente ainda. Comece pelo seu primeiro caso.
        </p>

        <div className="mt-6 pb-8">
          <AcademyNeoPicker compact />
        </div>
      </div>
    </div>
  );
};
