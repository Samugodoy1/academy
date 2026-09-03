import React from 'react';
import { CalendarPlus } from '../../icons';

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
  const day = new Date().getDate();

  return (
    <div className="flex-1 overflow-y-auto bg-white pb-20 text-[var(--neo-ink)]">
      <div className="mx-auto max-w-[720px] px-5 pt-6 space-y-7">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] text-[var(--neo-gray)] tracking-[-0.011em]">
              Oi{firstName ? `, ${firstName}` : ''}
            </p>
            {meta && (
              <p className="mt-1 text-[17px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
                {meta}
              </p>
            )}
          </div>
          <span className="neo-pill !px-3.5 !py-1.5 !text-[13px] shrink-0">0 pacientes</span>
        </header>

        <h1 className="text-[28px] sm:text-[34px] font-semibold leading-[1.05] tracking-[-0.025em]">
          Tudo pronto para o seu próximo atendimento.
        </h1>

        <div className="flex flex-col items-center pt-6 text-center">
          <div className="mb-5 flex h-16 w-14 flex-col overflow-hidden rounded-[16px] bg-[#f5f5f7]">
            <div className="h-4 bg-[#e8e8ed]" />
            <div className="flex flex-1 items-center justify-center text-[18px] font-semibold tracking-[-0.025em]">
              {day}
            </div>
          </div>
          <p className="text-[19px] font-semibold tracking-[-0.016em]">Agenda livre</p>
          <p className="mt-1 text-[15px] text-[var(--neo-gray)]">Nenhuma consulta por agora</p>
          <button
            type="button"
            className="neo-pill mt-6"
            onClick={() => onNavigate?.('agenda')}
          >
            <CalendarPlus size={18} />
            Agendar consulta
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.('agenda')}
            className="neo-link mt-3 text-[15px]"
          >
            Ver agenda completa ›
          </button>
        </div>
      </div>
    </div>
  );
};
