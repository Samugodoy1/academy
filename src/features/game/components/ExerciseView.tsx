import React, { useEffect, useMemo, useState } from 'react';
import { Check } from '../../../icons';
import { shuffleWithSeed } from '../engine';
import type {
  Answer,
  BlankExercise,
  BooleanExercise,
  ChoiceExercise,
  Exercise,
  MatchExercise,
  MultiExercise,
  OrderExercise,
} from '../types';

export interface ExerciseViewProps {
  exercise: Exercise;
  answer: Answer | null;
  locked: boolean;
  onChange: (answer: Answer | null) => void;
  onAutoSubmit: (answer: Answer) => void;
  onTap: () => void;
}

const Scenario: React.FC<{ text?: string }> = ({ text }) =>
  text ? (
    <div className="rounded-[20px] rounded-bl-[6px] bg-[#f5f5f7] px-5 py-4 text-[16px] leading-snug text-[var(--neo-ink)]">
      {text}
    </div>
  ) : null;

function toneFor(locked: boolean, selected: boolean, correct: boolean) {
  if (!locked) return selected ? 'game-tile-selected' : '';
  if (correct) return 'game-tile-right';
  if (selected) return 'game-tile-wrong';
  return 'game-tile-ghost';
}

// ── Múltipla escolha ──────────────────────────────────────────────────

const ChoiceView: React.FC<ExerciseViewProps & { exercise: ChoiceExercise }> = ({
  exercise,
  answer,
  locked,
  onChange,
  onTap,
}) => {
  const selected = answer?.kind === 'choice' ? answer.index : null;
  return (
    <div className="space-y-4">
      <Scenario text={exercise.scenario} />
      <div className="space-y-3">
        {exercise.options.map((option, index) => (
          <button
            key={option}
            type="button"
            disabled={locked}
            onClick={() => {
              onTap();
              onChange(selected === index ? null : { kind: 'choice', index });
            }}
            className={`game-tile ${toneFor(locked, selected === index, index === exercise.answer)}`}
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-current text-[13px] font-semibold opacity-60"
              aria-hidden
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Seleção múltipla ──────────────────────────────────────────────────

const MultiView: React.FC<ExerciseViewProps & { exercise: MultiExercise }> = ({
  exercise,
  answer,
  locked,
  onChange,
  onTap,
}) => {
  const selected = answer?.kind === 'multi' ? answer.indexes : [];
  const toggle = (index: number) => {
    onTap();
    const next = selected.includes(index)
      ? selected.filter(item => item !== index)
      : [...selected, index];
    onChange(next.length > 0 ? { kind: 'multi', indexes: next } : null);
  };
  return (
    <div className="space-y-4">
      <Scenario text={exercise.scenario} />
      <p className="px-1 text-[13px] text-[var(--neo-gray)]">Pode marcar mais de uma.</p>
      <div className="space-y-3">
        {exercise.options.map((option, index) => {
          const isSelected = selected.includes(index);
          const isCorrect = exercise.answers.includes(index);
          return (
            <button
              key={option}
              type="button"
              disabled={locked}
              onClick={() => toggle(index)}
              className={`game-tile ${toneFor(locked, isSelected, isCorrect)}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-current ${
                  isSelected || (locked && isCorrect) ? '' : 'opacity-40'
                }`}
                aria-hidden
              >
                {isSelected || (locked && isCorrect) ? <Check size={14} /> : null}
              </span>
              <span className="min-w-0 flex-1">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Verdadeiro ou falso ───────────────────────────────────────────────

const BooleanView: React.FC<ExerciseViewProps & { exercise: BooleanExercise }> = ({
  exercise,
  answer,
  locked,
  onChange,
  onTap,
}) => {
  const selected = answer?.kind === 'boolean' ? answer.value : null;
  const options: Array<{ value: boolean; label: string }> = [
    { value: true, label: 'Verdadeiro' },
    { value: false, label: 'Falso' },
  ];
  return (
    <div className="space-y-5">
      <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-6 text-[19px] font-semibold leading-snug tracking-[-0.016em] text-[var(--neo-ink)]">
        {exercise.statement}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map(option => (
          <button
            key={option.label}
            type="button"
            disabled={locked}
            onClick={() => {
              onTap();
              onChange(selected === option.value ? null : { kind: 'boolean', value: option.value });
            }}
            className={`game-tile justify-center py-6 text-[17px] font-semibold ${toneFor(
              locked,
              selected === option.value,
              option.value === exercise.answer
            )}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Ordenar passos ────────────────────────────────────────────────────

const OrderView: React.FC<ExerciseViewProps & { exercise: OrderExercise }> = ({
  exercise,
  answer,
  locked,
  onChange,
  onTap,
}) => {
  const pool = useMemo(
    () => shuffleWithSeed(exercise.steps, `${exercise.id}:order`),
    [exercise.id, exercise.steps]
  );
  const chosen = answer?.kind === 'order' ? answer.steps : [];
  const available = pool.filter(step => !chosen.includes(step));

  const pick = (step: string) => {
    onTap();
    const next = [...chosen, step];
    onChange({ kind: 'order', steps: next });
  };

  const drop = (step: string) => {
    if (locked) return;
    onTap();
    const next = chosen.filter(item => item !== step);
    onChange(next.length > 0 ? { kind: 'order', steps: next } : null);
  };

  return (
    <div className="space-y-5">
      <Scenario text={exercise.scenario} />
      <div className="space-y-2 rounded-[22px] border-2 border-dashed border-[var(--game-line)] p-3">
        {chosen.length === 0 && (
          <p className="px-2 py-6 text-center text-[14px] text-[var(--neo-gray)]">
            Toque nos passos na ordem certa.
          </p>
        )}
        {chosen.map((step, index) => {
          const rightHere = locked && exercise.steps[index] === step;
          const wrongHere = locked && exercise.steps[index] !== step;
          return (
            <button
              key={step}
              type="button"
              onClick={() => drop(step)}
              disabled={locked}
              className={`game-tile py-3 ${
                rightHere ? 'game-tile-right' : wrongHere ? 'game-tile-wrong' : 'game-tile-selected'
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-[12px] font-semibold tabular-nums">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 text-[15px]">{step}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {available.map(step => (
          <button
            key={step}
            type="button"
            disabled={locked}
            onClick={() => pick(step)}
            className="game-chip text-left"
          >
            {step}
          </button>
        ))}
      </div>
      {locked && (
        <div className="rounded-[18px] bg-[#f5f5f7] px-4 py-3 text-[14px] leading-snug text-[var(--neo-gray)]">
          Ordem correta: {exercise.steps.join(' → ')}
        </div>
      )}
    </div>
  );
};

// ── Completar a lacuna ────────────────────────────────────────────────

const BlankView: React.FC<ExerciseViewProps & { exercise: BlankExercise }> = ({
  exercise,
  answer,
  locked,
  onChange,
  onTap,
}) => {
  const bank = useMemo(() => {
    const options = exercise.bank.includes(exercise.answer)
      ? exercise.bank
      : [...exercise.bank, exercise.answer];
    return shuffleWithSeed(options, `${exercise.id}:bank`);
  }, [exercise.answer, exercise.bank, exercise.id]);

  const value = answer?.kind === 'blank' ? answer.value : null;
  const [before, after] = exercise.sentence.split('___');

  return (
    <div className="space-y-6">
      <p className="text-[19px] leading-relaxed tracking-[-0.016em] text-[var(--neo-ink)]">
        {before}
        <span
          className={`mx-1 inline-flex min-w-[92px] items-center justify-center rounded-lg border-b-[3px] px-2 py-0.5 align-baseline font-semibold ${
            value
              ? locked
                ? 'border-current text-[var(--neo-ink)]'
                : 'border-[var(--neo)] text-[var(--neo)]'
              : 'border-[var(--game-line-shadow)] text-transparent'
          }`}
        >
          {value ?? '—'}
        </span>
        {after}
      </p>
      <div className="flex flex-wrap gap-2">
        {bank.map(option => {
          const isSelected = value === option;
          const isAnswer = option === exercise.answer;
          return (
            <button
              key={option}
              type="button"
              disabled={locked}
              onClick={() => {
                onTap();
                onChange(isSelected ? null : { kind: 'blank', value: option });
              }}
              className={`game-chip ${
                locked
                  ? isAnswer
                    ? 'border-[var(--game-right)] bg-[var(--game-right-wash)] text-[var(--game-right-ink)]'
                    : isSelected
                      ? 'border-[var(--game-wrong)] bg-[var(--game-wrong-wash)] text-[var(--game-wrong-ink)]'
                      : 'opacity-40'
                  : isSelected
                    ? 'border-[var(--neo)] bg-[var(--neo-wash)] text-[var(--neo)]'
                    : ''
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Pareamento ────────────────────────────────────────────────────────

const MatchView: React.FC<ExerciseViewProps & { exercise: MatchExercise }> = ({
  exercise,
  locked,
  onAutoSubmit,
  onTap,
}) => {
  const lefts = useMemo(
    () => shuffleWithSeed(exercise.pairs.map(pair => pair.left), `${exercise.id}:l`),
    [exercise.id, exercise.pairs]
  );
  const rights = useMemo(
    () => shuffleWithSeed(exercise.pairs.map(pair => pair.right), `${exercise.id}:r`),
    [exercise.id, exercise.pairs]
  );

  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [missPair, setMissPair] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    setActiveLeft(null);
    setMatched([]);
    setMissPair(null);
    setMistakes(0);
  }, [exercise.id]);

  const rightOf = (left: string) => exercise.pairs.find(pair => pair.left === left)?.right;

  const tapRight = (right: string) => {
    if (!activeLeft || locked) return;
    onTap();
    if (rightOf(activeLeft) === right) {
      const nextMatched = [...matched, activeLeft];
      setMatched(nextMatched);
      setActiveLeft(null);
      if (nextMatched.length === exercise.pairs.length) {
        onAutoSubmit({ kind: 'match', mistakes });
      }
      return;
    }
    setMistakes(count => count + 1);
    setMissPair(right);
    window.setTimeout(() => setMissPair(null), 420);
  };

  return (
    <div className="space-y-4">
      <p className="px-1 text-[13px] text-[var(--neo-gray)]">
        Toque de um lado e depois no par correspondente.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {lefts.map(left => {
            const done = matched.includes(left);
            return (
              <button
                key={left}
                type="button"
                disabled={done || locked}
                onClick={() => {
                  onTap();
                  setActiveLeft(activeLeft === left ? null : left);
                }}
                className={`game-tile min-h-[64px] text-[14px] ${
                  done ? 'game-tile-right' : activeLeft === left ? 'game-tile-selected' : ''
                }`}
              >
                {left}
              </button>
            );
          })}
        </div>
        <div className="space-y-3">
          {rights.map(right => {
            const done = matched.some(left => rightOf(left) === right);
            return (
              <button
                key={right}
                type="button"
                disabled={done || locked}
                onClick={() => tapRight(right)}
                className={`game-tile min-h-[64px] text-[14px] ${done ? 'game-tile-right' : ''} ${
                  missPair === right ? 'game-tile-wrong game-shake' : ''
                }`}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Roteador ──────────────────────────────────────────────────────────

export const ExerciseView: React.FC<ExerciseViewProps> = props => {
  const { exercise } = props;
  switch (exercise.kind) {
    case 'choice':
      return <ChoiceView {...props} exercise={exercise} />;
    case 'multi':
      return <MultiView {...props} exercise={exercise} />;
    case 'boolean':
      return <BooleanView {...props} exercise={exercise} />;
    case 'order':
      return <OrderView {...props} exercise={exercise} />;
    case 'blank':
      return <BlankView {...props} exercise={exercise} />;
    case 'match':
      return <MatchView {...props} exercise={exercise} />;
    default:
      return null;
  }
};

export const EXERCISE_KIND_LABEL: Record<Exercise['kind'], string> = {
  choice: 'Escolha a alternativa',
  multi: 'Marque todas as corretas',
  boolean: 'Verdadeiro ou falso',
  order: 'Coloque na ordem',
  blank: 'Complete a frase',
  match: 'Faça os pares',
};
