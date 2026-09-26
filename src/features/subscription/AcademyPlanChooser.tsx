import React, { useState } from 'react';

export type AcademyBillingCycle = 'monthly' | 'yearly';

export interface AcademyCatalogPlan {
  id: number;
  plan: string;
  amount: string;
  frequency_type: string;
  billing_cycle?: string;
}

const OFFERS = [
  {
    plan: 'clinico',
    title: 'Clínico',
    kicker: 'A cadeira e o prontuário.',
    monthly: 12.9,
    yearly: 129,
    features: ['Até 10 pacientes', 'Até 50 fotos', 'Todas as disciplinas', '5 lições da Cola por dia'],
    tone: 'light' as const,
  },
  {
    plan: 'student',
    title: 'Student',
    kicker: 'Estudos e clínica, juntos.',
    monthly: 25,
    yearly: 250,
    features: ['Tudo no Clínico', 'Estudos do ciclo básico', 'Cola sem limite', 'Mapas mentais'],
    tone: 'dark' as const,
  },
];

function cycleOf(plan: AcademyCatalogPlan): AcademyBillingCycle {
  if (plan.billing_cycle === 'yearly' || plan.frequency_type === 'years') return 'yearly';
  return 'monthly';
}

function money(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function offerAmount(plans: AcademyCatalogPlan[], plan: string, cycle: AcademyBillingCycle, fallback: number) {
  const row = plans.find(item => item.plan === plan && cycleOf(item) === cycle);
  const parsed = row ? Number(row.amount) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function offerId(plans: AcademyCatalogPlan[], plan: string, cycle: AcademyBillingCycle) {
  return plans.find(item => item.plan === plan && cycleOf(item) === cycle)?.id ?? null;
}

interface AcademyPlanChooserProps {
  plans: AcademyCatalogPlan[];
  loading: boolean;
  onSubscribe: (planId: number) => void;
}

export function AcademyPlanChooser({ plans, loading, onSubscribe }: AcademyPlanChooserProps) {
  const [cycle, setCycle] = useState<AcademyBillingCycle>('monthly');

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-[28px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f]">
          Escolha o seu plano.
        </h3>
        <p className="mt-2 text-[15px] tracking-[-0.011em] text-[#6e6e73]">
          Mensal ou anual. Cancele quando quiser.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-[#f5f5f7] p-1">
          {(['monthly', 'yearly'] as const).map(option => {
            const selected = cycle === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setCycle(option)}
                className={`rounded-full px-4 py-1.5 text-[14px] tracking-[-0.011em] ${
                  selected ? 'bg-[#1d1d1f] text-white' : 'text-[#1d1d1f]'
                }`}
              >
                {option === 'monthly' ? 'Mensal' : 'Anual'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OFFERS.map(offer => {
          const total = offerAmount(plans, offer.plan, cycle, cycle === 'monthly' ? offer.monthly : offer.yearly);
          const perMonth = cycle === 'monthly' ? total : total / 12;
          const planId = offerId(plans, offer.plan, cycle);
          const dark = offer.tone === 'dark';
          return (
            <article
              key={offer.plan}
              className={`flex flex-col rounded-[22px] px-5 py-5 ${
                dark ? 'bg-[var(--neo)] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'
              }`}
            >
              <h4 className="text-[20px] font-semibold tracking-[-0.02em]">{offer.title}</h4>
              <p className={`mt-1 text-[13px] ${dark ? 'text-white/70' : 'text-[#6e6e73]'}`}>{offer.kicker}</p>
              <p className="mt-5 flex items-end gap-1">
                <span className="text-[34px] font-semibold leading-none tracking-[-0.03em]">{money(perMonth)}</span>
                <span className={`pb-1 text-[15px] ${dark ? 'text-white/70' : 'text-[#6e6e73]'}`}>/mês</span>
              </p>
              <p className={`mt-2 text-[13px] ${dark ? 'text-white/60' : 'text-[#6e6e73]'}`}>
                {cycle === 'yearly' ? `${money(total)} por ano.` : `${money(total)} por mês.`}
              </p>
              <ul className="mt-5 space-y-1.5">
                {offer.features.map(feature => (
                  <li key={feature} className={`text-[14px] ${dark ? 'text-white/85' : 'text-[#3a3a3c]'}`}>
                    – {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={loading || planId == null}
                onClick={() => planId != null && onSubscribe(planId)}
                className={`mt-6 w-full rounded-full py-3 text-[15px] disabled:opacity-50 ${
                  dark ? 'bg-white text-[#1d1d1f]' : 'bg-[var(--neo)] text-white'
                }`}
              >
                {loading ? 'Processando' : planId == null ? 'Indisponível' : `Assinar ${offer.title}`}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
