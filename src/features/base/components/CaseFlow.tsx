import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMiniCase } from '../session/miniCases/cases';
import type { MiniCaseStep } from '../session/types';
import { ReferenceList, BackLink } from './ui';

interface CaseFlowProps {
  caseId: string;
  embedded?: boolean;
  onBack?: () => void;
  onComplete: () => void;
}

export function CaseFlow({ caseId, embedded = false, onBack, onComplete }: CaseFlowProps) {
  const miniCase = getMiniCase(caseId);
  const [stepIndex, setStepIndex] = useState(0);
  const [choiceFeedback, setChoiceFeedback] = useState<string | null>(null);

  if (!miniCase) {
    return (
      <div className="space-y-3">
        <p className="text-[15px] text-[var(--neo-gray)]">Caso não encontrado.</p>
        {onBack && (
          <button type="button" onClick={onBack} className="neo-link text-[15px]">
            Voltar
          </button>
        )}
      </div>
    );
  }

  const step = miniCase.steps[stepIndex];
  const isLast = stepIndex >= miniCase.steps.length - 1;

  const advance = () => {
    setChoiceFeedback(null);
    if (isLast) onComplete();
    else setStepIndex(i => i + 1);
  };

  const shell = embedded ? 'space-y-5' : 'page-shell space-y-10';

  return (
    <div className={shell}>
      {!embedded && onBack && <BackLink label="Estudos" onClick={onBack} />}
      <header>
        <p className="text-[13px] text-[var(--neo-gray)]">Mini-caso · {miniCase.minutes} min</p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[32px]">
          {miniCase.title}
        </h1>
        <p className="mt-2 text-[15px] text-[var(--neo-gray)]">{miniCase.tagline}</p>
      </header>

      <div className="rounded-[28px] bg-[#f5f5f7] px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepBody step={step} feedback={choiceFeedback} onChoose={setChoiceFeedback} />
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex gap-3">
          {step.kind === 'choice' ? (
            <button
              type="button"
              disabled={!choiceFeedback}
              onClick={advance}
              className="neo-pill flex-1 disabled:opacity-40"
            >
              Continuar
            </button>
          ) : (
            <button type="button" onClick={advance} className="neo-pill flex-1">
              {isLast ? 'Fechar caso' : 'Próximo'}
            </button>
          )}
        </div>
      </div>

      {miniCase.references.length > 0 && (
        <div className="px-1">
          <p className="text-[13px] text-[var(--neo-gray)]">Referências</p>
          <ReferenceList references={miniCase.references} numbered={false} />
        </div>
      )}
    </div>
  );
}

function StepBody({
  step,
  feedback,
  onChoose,
}: {
  step: MiniCaseStep;
  feedback: string | null;
  onChoose: (text: string) => void;
}) {
  if (step.kind === 'choice' && step.choices) {
    return (
      <div className="space-y-4">
        <p className="text-[17px] font-medium leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">{step.body}</p>
        <div className="space-y-2">
          {step.choices.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChoose(c.feedback)}
              className={`w-full rounded-[18px] px-4 py-3.5 text-left text-[15px] leading-snug ios-press-gentle ${
                feedback === c.feedback ? 'bg-white ring-2 ring-[var(--neo)]/40' : 'bg-white/70'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {feedback && <p className="text-[15px] leading-snug text-[var(--neo-gray)]">{feedback}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {step.title && <p className="text-[13px] font-medium uppercase tracking-[0.05em] text-[var(--neo)]">{step.title}</p>}
      <p className="text-[17px] leading-[1.45] tracking-[-0.011em] text-[var(--neo-ink)]">{step.body}</p>
      {step.lessonIds && step.lessonIds.length > 0 && (
        <p className="text-[13px] text-[var(--neo-gray)]">Revise nos resumos: {step.lessonIds.join(', ')}</p>
      )}
    </div>
  );
}
