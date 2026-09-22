import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { buildSessionRuntime } from '../session/buildSession';
import type { PretestItem, ReadinessLevel, SessionStepId } from '../session/types';
import { LabExperience } from '../session/labs/LabExperience';
import { MechanisticConnect } from './MechanisticConnect';
import { CaseFlow } from './CaseFlow';
import { MindMap } from './MindMap';
import { getDiscipline } from '../content';
import { BackLink, BaseSection, GroupedList, ReferenceList } from './ui';
import type { BaseDiscipline } from '../types';

const STEP_LABEL: Record<SessionStepId, string> = {
  chute: 'Chute',
  correcao: 'Correção',
  gesto: 'Gesto',
  fixar: 'Fixar',
  explique: 'Explique',
  fechar: 'Fechar',
};

const STEPS: SessionStepId[] = ['chute', 'correcao', 'gesto', 'fixar', 'explique', 'fechar'];

interface SessionFlowProps {
  discipline: BaseDiscipline;
  lessonIndex: number;
  onBack: () => void;
  onOpenReference: () => void;
  onComplete: (readiness: ReadinessLevel, note?: string) => void;
  onLabComplete: (labId: string) => void;
  onCaseComplete: (caseId: string) => void;
}

export function SessionFlow({
  discipline,
  lessonIndex,
  onBack,
  onOpenReference,
  onComplete,
  onLabComplete,
  onCaseComplete,
}: SessionFlowProps) {
  const runtime = useMemo(
    () => buildSessionRuntime(discipline, lessonIndex),
    [discipline, lessonIndex],
  );
  const [step, setStep] = useState<SessionStepId>('chute');
  const [pretestAnswers, setPretestAnswers] = useState<Record<string, string>>({});
  const [gestoDone, setGestoDone] = useState(false);
  const [explainText, setExplainText] = useState('');
  const [readiness, setReadiness] = useState<ReadinessLevel | null>(null);
  const [note, setNote] = useState('');

  if (!runtime) return null;

  const { lesson, blueprint, references } = runtime;
  const stepIndex = STEPS.indexOf(step);

  const goNext = useCallback(() => {
    setStep(current => {
      const i = STEPS.indexOf(current);
      return i < STEPS.length - 1 ? STEPS[i + 1] : current;
    });
  }, []);

  const onGestoComplete = useCallback(() => {
    setGestoDone(true);
    setStep(current => {
      const i = STEPS.indexOf(current);
      return i < STEPS.length - 1 ? STEPS[i + 1] : current;
    });
  }, []);

  const handleLabComplete = (labId: string) => {
    onLabComplete(labId);
    onGestoComplete();
  };

  const handleCaseComplete = (caseId: string) => {
    onCaseComplete(caseId);
    onGestoComplete();
  };

  const finish = () => {
    if (readiness) onComplete(readiness, note.trim() || undefined);
  };

  return (
    <div className="page-shell space-y-8">
      <header className="space-y-4">
        <BackLink label={discipline.title} onClick={onBack} />
        <div>
          <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">
            Sessão · {lessonIndex + 1} de {discipline.lessons.length} · {lesson.minutes} min
          </p>
          <h1 className="mt-2 max-w-[20ch] text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
            {lesson.title}
          </h1>
        </div>
        <SessionProgress steps={STEPS} current={step} />
      </header>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {step === 'chute' && (
          <PretestStep
            items={blueprint.pretest}
            answers={pretestAnswers}
            onChange={setPretestAnswers}
            onContinue={goNext}
          />
        )}
        {step === 'correcao' && (
          <CorrecaoStep
            items={blueprint.pretest}
            answers={pretestAnswers}
            onOpenReference={onOpenReference}
            onContinue={goNext}
          />
        )}
        {step === 'gesto' && (
          <GestoStep
            gesto={blueprint.gesto}
            discipline={discipline}
            done={gestoDone}
            onLabComplete={handleLabComplete}
            onCaseComplete={handleCaseComplete}
            onMechanisticComplete={onGestoComplete}
            onRebuildComplete={onGestoComplete}
          />
        )}
        {step === 'fixar' && (
          <FixarStep lesson={lesson} onContinue={goNext} />
        )}
        {step === 'explique' && (
          <ExpliqueStep
            prompt={blueprint.explainPrompt}
            mustInclude={blueprint.explainMustInclude}
            model={blueprint.explainModel}
            value={explainText}
            onChange={setExplainText}
            onContinue={goNext}
          />
        )}
        {step === 'fechar' && (
          <FecharStep
            readiness={readiness}
            note={note}
            onReadiness={setReadiness}
            onNote={setNote}
            references={references}
            onFinish={finish}
          />
        )}
      </motion.div>

      {stepIndex > 0 && step !== 'fechar' && (
        <p className="px-1 text-[13px] text-[var(--neo-gray)]">
          Etapa {stepIndex + 1} · {STEP_LABEL[step]}
        </p>
      )}
    </div>
  );
}

function SessionProgress({ steps, current }: { steps: SessionStepId[]; current: SessionStepId }) {
  const idx = steps.indexOf(current);
  return (
    <div className="flex gap-1">
      {steps.map((s, i) => (
        <span
          key={s}
          className={`h-1 flex-1 rounded-full transition-colors ${i <= idx ? 'bg-[var(--neo)]' : 'bg-black/[0.06]'}`}
        />
      ))}
    </div>
  );
}

function PretestStep({
  items,
  answers,
  onChange,
  onContinue,
}: {
  items: PretestItem[];
  answers: Record<string, string>;
  onChange: (a: Record<string, string>) => void;
  onContinue: () => void;
}) {
  const allAnswered = items.every(item => {
    const v = answers[item.id];
    return v !== undefined && v.length > 0;
  });

  return (
    <div className="space-y-6">
      <p className="text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
        Responda antes de abrir o resumo — o chute fixa o que você já sabe e o que precisa conferir.
      </p>
      <GroupedList>
        {items.map(item => (
          <div key={item.id} className="border-b border-black/[0.04] px-5 py-4 last:border-b-0">
            <p className="text-[15px] font-semibold leading-snug text-[var(--neo-ink)]">{item.question}</p>
            {item.type === 'open' ? (
              <textarea
                value={answers[item.id] || ''}
                onChange={e => onChange({ ...answers, [item.id]: e.target.value })}
                rows={2}
                className="mt-3 w-full resize-none rounded-[16px] border-0 bg-white px-3 py-2.5 text-[15px] leading-snug"
                placeholder="Sua resposta…"
              />
            ) : (
              <div className="mt-3 space-y-2">
                {item.options.map((opt, oi) => (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => onChange({ ...answers, [item.id]: String(oi) })}
                    className={`w-full rounded-[14px] px-3 py-2.5 text-left text-[14px] leading-snug ${
                      answers[item.id] === String(oi) ? 'bg-white ring-2 ring-[var(--neo)]/35' : 'bg-white/80'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </GroupedList>
      <button type="button" disabled={!allAnswered} onClick={onContinue} className="neo-pill w-full disabled:opacity-40">
        Ver correção
      </button>
    </div>
  );
}

function CorrecaoStep({
  items,
  answers,
  onOpenReference,
  onContinue,
}: {
  items: PretestItem[];
  answers: Record<string, string>;
  onOpenReference: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <GroupedList>
        {items.map(item => {
          let result: React.ReactNode = null;
          if (item.type === 'open') {
            result = (
              <p className="mt-2 text-[15px] leading-snug text-[var(--neo-gray)]">
                <span className="font-medium text-[var(--neo-ink)]">Referência: </span>
                {item.answer}
              </p>
            );
          } else {
            const picked = Number(answers[item.id]);
            const ok = picked === item.correctIndex;
            result = (
              <div className="mt-2 space-y-1">
                <p className={`text-[14px] font-medium ${ok ? 'text-[var(--neo)]' : 'text-[#FF3B30]'}`}>
                  {ok ? 'Correto' : 'Revise'}
                </p>
                <p className="text-[15px] leading-snug text-[var(--neo-gray)]">{item.why}</p>
              </div>
            );
          }
          return (
            <div key={item.id} className="border-b border-black/[0.04] px-5 py-4 last:border-b-0">
              <p className="text-[15px] font-semibold text-[var(--neo-ink)]">{item.question}</p>
              {result}
            </div>
          );
        })}
      </GroupedList>
      <button type="button" onClick={onOpenReference} className="w-full rounded-[24px] bg-[#f5f5f7] px-5 py-4 text-left ios-press-gentle">
        <p className="text-[15px] font-semibold text-[var(--neo-ink)]">Abrir resumo de referência</p>
        <p className="mt-1 text-[14px] text-[var(--neo-gray)]">Teoria completa com DOI — quando quiser aprofundar.</p>
      </button>
      <button type="button" onClick={onContinue} className="neo-pill w-full">
        Ir ao gesto
      </button>
    </div>
  );
}

function GestoStep({
  gesto,
  discipline,
  done,
  onLabComplete,
  onCaseComplete,
  onMechanisticComplete,
  onRebuildComplete,
}: {
  gesto: import('../session/types').GestoKind;
  discipline: BaseDiscipline;
  done: boolean;
  onLabComplete: (labId: string) => void;
  onCaseComplete: (caseId: string) => void;
  onMechanisticComplete: () => void;
  onRebuildComplete: () => void;
}) {
  if (gesto.type === 'lab') {
    return (
      <LabExperience labId={gesto.labId} onComplete={() => onLabComplete(gesto.labId)} />
    );
  }
  if (gesto.type === 'minicase') {
    return (
      <CaseFlow caseId={gesto.caseId} embedded onComplete={() => onCaseComplete(gesto.caseId)} />
    );
  }
  if (gesto.type === 'mechanistic') {
    const disc = getDiscipline(gesto.disciplineId) || discipline;
    return (
      <div className="space-y-4">
        <p className="text-[15px] text-[var(--neo-gray)]">Mapa mecânico · {disc.title}</p>
        <div className="rounded-[24px] bg-[#f5f5f7] px-4 py-5">
          <MechanisticConnect disciplineId={gesto.disciplineId} onComplete={onMechanisticComplete} />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="text-[15px] text-[var(--neo-gray)]">Reconstrua o mapa mental sem olhar as folhas.</p>
      <div className="rounded-[24px] bg-[#f5f5f7] px-4 py-5">
        <MindMap root={discipline.mindMap} />
      </div>
      {!done && (
        <button type="button" onClick={onRebuildComplete} className="neo-pill w-full">
          Terminei a reconstrução
        </button>
      )}
    </div>
  );
}

function FixarStep({
  lesson,
  onContinue,
}: {
  lesson: import('../types').BaseLesson;
  onContinue: () => void;
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  return (
    <div className="space-y-6">
      <BaseSection kicker="Fixar · responda antes de abrir">
        <GroupedList>
          {lesson.selfCheck.map((item, index) => {
            const revealed = open.has(index);
            return (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setOpen(prev => {
                    const n = new Set(prev);
                    if (n.has(index)) n.delete(index);
                    else n.add(index);
                    return n;
                  })
                }
                className="block w-full border-b border-black/[0.04] px-5 py-4 text-left last:border-b-0"
              >
                <p className="text-[15px] font-semibold text-[var(--neo-ink)]">{item.question}</p>
                {revealed && (
                  <p className="mt-2 text-[15px] leading-snug text-[var(--neo-gray)]">{item.answer}</p>
                )}
              </button>
            );
          })}
        </GroupedList>
      </BaseSection>
      <button type="button" onClick={onContinue} className="neo-pill w-full">
        Explique em voz alta
      </button>
    </div>
  );
}

function ExpliqueStep({
  prompt,
  mustInclude,
  model,
  value,
  onChange,
  onContinue,
}: {
  prompt: string;
  mustInclude: string[];
  model: string;
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
}) {
  const [showModel, setShowModel] = useState(false);
  return (
    <div className="space-y-5">
      <p className="text-[17px] font-medium leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">{prompt}</p>
      <ul className="space-y-2 text-[14px] text-[var(--neo-gray)]">
        {mustInclude.map(line => (
          <li key={line} className="flex gap-2">
            <span className="text-[var(--neo)]">·</span>
            {line}
          </li>
        ))}
      </ul>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-[20px] border-0 bg-[#f5f5f7] px-4 py-4 text-[16px] leading-relaxed"
        placeholder="Escreva como falaria para um colega…"
      />
      <button type="button" onClick={() => setShowModel(s => !s)} className="neo-link text-[15px]">
        {showModel ? 'Ocultar modelo' : 'Ver modelo de resposta'}
      </button>
      {showModel && (
        <p className="rounded-[20px] bg-[var(--neo-wash)] px-4 py-4 text-[15px] leading-relaxed text-[var(--neo-ink)]">
          {model}
        </p>
      )}
      <button type="button" onClick={onContinue} className="neo-pill w-full">
        Fechar sessão
      </button>
    </div>
  );
}

function FecharStep({
  readiness,
  note,
  onReadiness,
  onNote,
  references,
  onFinish,
}: {
  readiness: ReadinessLevel | null;
  note: string;
  onReadiness: (r: ReadinessLevel) => void;
  onNote: (n: string) => void;
  references: import('../types').BaseReference[];
  onFinish: () => void;
}) {
  const options: { id: ReadinessLevel; title: string; sub: string }[] = [
    { id: 'confident', title: 'Levo para a prova', sub: 'Agenda revisão espaçada mais longa.' },
    { id: 'review', title: 'Quero rever em breve', sub: 'Volta amanhã na fila.' },
    { id: 'ask', title: 'Preciso de ajuda', sub: 'Marca para tutor ou professor.' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-[17px] text-[var(--neo-gray)]">Como você se sente com este tópico?</p>
      <div className="space-y-2">
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onReadiness(opt.id)}
            className={`w-full rounded-[22px] px-5 py-4 text-left transition-colors ${
              readiness === opt.id ? 'bg-[var(--neo)] text-white' : 'bg-[#f5f5f7] text-[var(--neo-ink)]'
            }`}
          >
            <p className="text-[16px] font-semibold tracking-[-0.011em]">{opt.title}</p>
            <p className={`mt-1 text-[14px] ${readiness === opt.id ? 'text-white/85' : 'text-[var(--neo-gray)]'}`}>
              {opt.sub}
            </p>
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={e => onNote(e.target.value)}
        rows={2}
        placeholder="Anotação opcional…"
        className="w-full resize-none rounded-[18px] border-0 bg-[#f5f5f7] px-4 py-3 text-[15px]"
      />
      {references.length > 0 && (
        <BaseSection kicker="Referências desta sessão">
          <ReferenceList references={references} />
        </BaseSection>
      )}
      <button type="button" disabled={!readiness} onClick={onFinish} className="neo-pill w-full disabled:opacity-40">
        Concluir
      </button>
    </div>
  );
}
