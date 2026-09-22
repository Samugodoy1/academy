import React, { useMemo, useState } from 'react';
import type { LabId } from '../types';

interface LabExperienceProps {
  labId: LabId;
  onComplete: () => void;
}

const LAB_META: Record<
  LabId,
  { title: string; subtitle: string }
> = {
  stephan: {
    title: 'Curva de Stephan',
    subtitle: 'O pH cai depois do açúcar e sobe com saliva e flúor.',
  },
  anesthetic: {
    title: 'Tubetes e teto',
    subtitle: 'Escolha o cenário; a dose precisa caber no peso.',
  },
  eruption: {
    title: 'Linha do tempo',
    subtitle: 'Toque na ordem correta de erupção dos molares.',
  },
  'alveolar-nerve': {
    title: 'Forame mandibular',
    subtitle: 'Onde a agulha busca contato ósseo posterior.',
  },
  radiation: {
    title: 'ALARA na sala',
    subtitle: 'Cada escolha soma ou reduz exposição desnecessária.',
  },
  'biofilm-chain': {
    title: 'Da placa à lesão',
    subtitle: 'Arraste na ordem fisiológica — sem pular etapas.',
  },
};

export function LabExperience({ labId, onComplete }: LabExperienceProps) {
  const meta = LAB_META[labId];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[13px] text-[var(--neo-gray)]">Laboratório</p>
        <p className="mt-1 text-[22px] font-semibold tracking-[-0.025em] text-[var(--neo-ink)]">{meta.title}</p>
        <p className="mt-2 text-[15px] leading-snug text-[var(--neo-gray)]">{meta.subtitle}</p>
      </div>
      <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-5">
        {labId === 'stephan' && <StephanLab onComplete={onComplete} />}
        {labId === 'anesthetic' && <AnestheticLab onComplete={onComplete} />}
        {labId === 'eruption' && <EruptionLab onComplete={onComplete} />}
        {labId === 'alveolar-nerve' && <AlveolarLab onComplete={onComplete} />}
        {labId === 'radiation' && <RadiationLab onComplete={onComplete} />}
        {labId === 'biofilm-chain' && <BiofilmLab onComplete={onComplete} />}
      </div>
    </div>
  );
}

function StephanLab({ onComplete }: { onComplete: () => void }) {
  const [sugar, setSugar] = useState(40);
  const ph = useMemo(() => {
    const drop = (sugar / 100) * 2.2;
    return Math.max(4.8, 7 - drop * 0.9);
  }, [sugar]);
  const critical = ph < 5.5;

  return (
    <div className="space-y-4">
      <label className="block text-[14px] font-medium text-[var(--neo-ink)]">
        Ingesta de açúcar fermentável (intensidade)
      </label>
      <input
        type="range"
        min={0}
        max={100}
        value={sugar}
        onChange={e => setSugar(Number(e.target.value))}
        className="w-full accent-[var(--neo)]"
      />
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-[0.05em] text-[var(--neo-gray)]">pH estimado</p>
          <p className={`text-[36px] font-semibold tabular-nums tracking-[-0.03em] ${critical ? 'text-[#FF3B30]' : 'text-[var(--neo-ink)]'}`}>
            {ph.toFixed(1)}
          </p>
        </div>
        <p className="max-w-[18ch] text-right text-[14px] leading-snug text-[var(--neo-gray)]">
          {critical ? 'Abaixo de 5,5 — esmalte perde mineral.' : 'Acima do limiar crítico — remineralização compete.'}
        </p>
      </div>
      <button type="button" onClick={onComplete} className="neo-pill w-full">
        Entendi a curva
      </button>
    </div>
  );
}

function AnestheticLab({ onComplete }: { onComplete: () => void }) {
  const [weight, setWeight] = useState(70);
  const [tubes, setTubes] = useState(2);
  const mgPerTube = 36;
  const total = tubes * mgPerTube;
  const ceiling = weight * 4.4;
  const ok = total <= ceiling;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-[13px] text-[var(--neo-gray)]">Peso (kg)</span>
          <input
            type="number"
            min={20}
            max={120}
            value={weight}
            onChange={e => setWeight(Number(e.target.value) || 70)}
            className="w-full rounded-[14px] border-0 bg-white px-3 py-2.5 text-[16px] tabular-nums"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[13px] text-[var(--neo-gray)]">Tubetes 1,8 mL</span>
          <input
            type="number"
            min={1}
            max={6}
            value={tubes}
            onChange={e => setTubes(Number(e.target.value) || 1)}
            className="w-full rounded-[14px] border-0 bg-white px-3 py-2.5 text-[16px] tabular-nums"
          />
        </label>
      </div>
      <p className="text-[15px] leading-snug text-[var(--neo-ink)]">
        Articaína 4%: ~{total} mg lidocaína-equivalente · teto orientativo ~{ceiling.toFixed(0)} mg
      </p>
      <p className={`text-[14px] ${ok ? 'text-[var(--neo)]' : 'text-[#FF3B30]'}`}>
        {ok ? 'Dose dentro do teto para revisão clínica.' : 'Revise tubetes ou concentração antes de repetir.'}
      </p>
      <button type="button" disabled={!ok} onClick={onComplete} className="neo-pill w-full disabled:opacity-40">
        Marcar laboratório
      </button>
    </div>
  );
}

const ERUPTION_ORDER = ['1º molar permanente', 'Incisivos centrais', 'Lateral', 'Canino', 'Pré-molares', '2º molar'];

function EruptionLab({ onComplete }: { onComplete: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const remaining = ERUPTION_ORDER.filter(x => !picked.includes(x));

  const pick = (label: string) => {
    if (picked.includes(label)) return;
    const next = [...picked, label];
    setPicked(next);
    if (next.length === ERUPTION_ORDER.length) onComplete();
  };

  return (
    <div className="space-y-3">
      <p className="text-[14px] text-[var(--neo-gray)]">Próximo na sequência típica (mandíbula/maxila agregadas):</p>
      <div className="flex flex-wrap gap-2">
        {remaining.map(label => (
          <button
            key={label}
            type="button"
            onClick={() => pick(label)}
            className="rounded-full bg-white px-3.5 py-2 text-[14px] font-medium text-[var(--neo-ink)] ios-press-gentle"
          >
            {label}
          </button>
        ))}
      </div>
      {picked.length > 0 && (
        <ol className="mt-2 space-y-1 text-[14px] text-[var(--neo-ink)]">
          {picked.map((p, i) => (
            <li key={p}>
              {i + 1}. {p}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function AlveolarLab({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const prompts = [
    'Marque o ramo mandibular — trajeto do nervo alveolar inferior.',
    'Indique o forame mentoniano — saída do nervo mentoniano.',
    'Confirme: contato ósseo posterior ao forame no bloqueio.',
  ];

  return (
    <div className="space-y-4">
      <div className="relative mx-auto aspect-[4/3] max-w-sm rounded-[20px] bg-white p-6">
        <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
          <path d="M40 120 Q100 40 160 120" fill="none" stroke="#d2d2d7" strokeWidth="3" />
          <circle cx="130" cy="95" r="6" fill={step >= 2 ? 'var(--neo)' : '#e5e5ea'} />
          <circle cx="95" cy="118" r="5" fill={step >= 1 ? 'var(--neo)' : '#e5e5ea'} />
        </svg>
        <p className="mt-2 text-center text-[12px] text-[var(--neo-gray)]">Esquema didático — não substitui atlas.</p>
      </div>
      <p className="text-[15px] font-medium text-[var(--neo-ink)]">{prompts[step]}</p>
      <button
        type="button"
        onClick={() => {
          if (step >= 2) onComplete();
          else setStep(step + 1);
        }}
        className="neo-pill w-full"
      >
        {step >= 2 ? 'Concluir' : 'Próximo ponto'}
      </button>
    </div>
  );
}

function RadiationLab({ onComplete }: { onComplete: () => void }) {
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<Set<number>>(() => new Set());
  const choices = [
    { label: 'Pedir bite-wing só com indicação clínica', delta: 1 },
    { label: 'Repetir filme “por garantia” sem motivo', delta: -1 },
    { label: 'Colar avental com toroide', delta: 1 },
    { label: 'Aumentar kV para “ficar mais nítido” sem necessidade', delta: -1 },
  ];

  const pick = (index: number, delta: number) => {
    if (picked.has(index)) return;
    const nextPicked = new Set(picked).add(index);
    setPicked(nextPicked);
    const nextScore = score + delta;
    setScore(nextScore);
    if (nextPicked.size === choices.length && nextScore >= 2) onComplete();
  };

  return (
    <div className="space-y-2">
      {choices.map((c, i) => (
        <button
          key={c.label}
          type="button"
          disabled={picked.has(i)}
          onClick={() => pick(i, c.delta)}
          className="flex w-full rounded-[16px] bg-white px-4 py-3 text-left text-[14px] text-[var(--neo-ink)] ios-press-gentle disabled:opacity-50"
        >
          {c.label}
        </button>
      ))}
      <p className="pt-2 text-[13px] text-[var(--neo-gray)]">ALARA: tão baixo quanto razoavelmente exequível.</p>
    </div>
  );
}

const BIOFILM_ORDER = ['Adesão bacteriana', 'Coagregação', 'Matriz extracelular', 'pH ácido local', 'Desmineralização'];

function BiofilmLab({ onComplete }: { onComplete: () => void }) {
  const [order, setOrder] = useState<string[]>([]);
  const pool = BIOFILM_ORDER.filter(x => !order.includes(x));

  const add = (item: string) => {
    const next = [...order, item];
    setOrder(next);
    if (next.length === BIOFILM_ORDER.length) {
      const ok = next.every((v, i) => v === BIOFILM_ORDER[i]);
      if (ok) onComplete();
      else setOrder([]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[14px] text-[var(--neo-gray)]">Monte a sequência (toque na ordem):</p>
      <div className="flex flex-wrap gap-2">
        {pool.map(item => (
          <button
            key={item}
            type="button"
            onClick={() => add(item)}
            className="rounded-full bg-white px-3 py-2 text-[14px] font-medium ios-press-gentle"
          >
            {item}
          </button>
        ))}
      </div>
      {order.length > 0 && (
        <p className="text-[14px] text-[var(--neo-ink)]">
          {order.map((o, i) => `${i + 1}. ${o}`).join(' → ')}
        </p>
      )}
      {order.length === BIOFILM_ORDER.length && order.some((v, i) => v !== BIOFILM_ORDER[i]) && (
        <p className="text-[14px] text-[#FF3B30]">Ordem incorreta — tente de novo.</p>
      )}
    </div>
  );
}
