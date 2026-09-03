import React, { useState } from 'react';

interface AcademyChecklistProps {
  appointmentId?: number;
}

const STEPS = [
  { title: 'Anestesia', done: true },
  { title: 'Sindesmotomia', done: false, current: true },
  { title: 'Luxação', done: false },
  { title: 'Avulsão', done: false },
];

export const AcademyChecklist: React.FC<AcademyChecklistProps> = () => {
  const [active] = useState(1);
  const current = STEPS[active];

  return (
    <div className="min-h-full bg-[var(--neo)] px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col">
        <p className="text-[15px] text-white/80">A lista de passos, visível de longe.</p>
        <h1 className="mt-2 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em]">
          Modo Box
        </h1>

        <div className="neo-card mt-8 flex flex-1 flex-col px-6 py-8 text-[var(--neo-ink)]">
          <p className="text-[15px] text-[var(--neo-gray)]">Passo {active + 1} de {STEPS.length}</p>
          <p className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.025em]">
            {current.title}
          </p>
          <ol className="mt-8 space-y-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`text-[22px] tracking-[-0.02em] ${
                  index === active ? 'font-semibold text-[var(--neo-ink)]' : 'text-[var(--neo-gray)]'
                }`}
              >
                {step.title}
              </li>
            ))}
          </ol>
          <button type="button" className="neo-pill mt-auto w-full py-4 text-[18px]">
            O seu passo
          </button>
        </div>
      </div>
    </div>
  );
};
