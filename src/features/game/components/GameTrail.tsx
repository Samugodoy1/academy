import React, { useMemo, useState } from 'react';
import type { StudyKey } from '../../../utils/studyTopics';
import { Check, Crown, Lock, Play, Star, Trophy } from '../../../icons';
import { CharacterAvatar, hostFor } from '../characters';
import { GAME_UNITS } from '../content';
import { CROWNS_PER_UNIT, getUnitState } from '../progress';
import type { ExerciseMemory, GameState, GameUnit } from '../types';

export interface TrailSelection {
  topic: StudyKey;
  index: number;
  kind: 'lesson' | 'review';
}

interface GameTrailProps {
  state: GameState;
  spotlightTopic?: StudyKey | null;
  spotlightLabel?: string | null;
  onStart: (selection: TrailSelection) => void;
  onStartPractice: () => void;
  onOpenStudy?: (topic: StudyKey) => void;
}

/** Snake offsets, in pixels, applied to consecutive nodes. */
const OFFSETS = [0, 52, 0, -52];

function isUnitUnlocked(
  unit: GameUnit,
  unitIndex: number,
  state: GameState,
  spotlightTopic?: StudyKey | null
): boolean {
  if (unitIndex === 0) return true;
  if (spotlightTopic === unit.topic) return true;
  if (getUnitState(state, unit.topic).lessons > 0) return true;
  const previous = GAME_UNITS[unitIndex - 1];
  const previousProgress = getUnitState(state, previous.topic);
  return previousProgress.crowns > 0 || previousProgress.lessons >= previous.lessons;
}

const CrownRow: React.FC<{ crowns: number }> = ({ crowns }) => (
  <span className="flex items-center gap-1">
    {Array.from({ length: CROWNS_PER_UNIT }).map((_, index) => (
      <span key={index} className={index < crowns ? 'text-[#ffb400]' : 'text-[#d9d9de]'}>
        <Crown size={14} />
      </span>
    ))}
  </span>
);

export const GameTrail: React.FC<GameTrailProps> = ({
  state,
  spotlightTopic,
  spotlightLabel,
  onStart,
  onStartPractice,
  onOpenStudy,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const units = useMemo(
    () =>
      GAME_UNITS.map((unit, index) => ({
        unit,
        unlocked: isUnitUnlocked(unit, index, state, spotlightTopic),
        progress: getUnitState(state, unit.topic),
      })),
    [spotlightTopic, state]
  );
  const dueCount = (Object.values(state.exerciseMemory) as ExerciseMemory[]).filter(
    memory => memory.attempts > 0 && memory.dueAt <= Date.now()
  ).length;
  const focalTopic =
    (spotlightTopic && units.some(item => item.unit.topic === spotlightTopic) && spotlightTopic) ||
    units.find(item => item.unlocked && item.progress.lessons < item.unit.lessons)?.unit.topic ||
    units[0]?.unit.topic;

  return (
    <div className="space-y-10">
      {units.map(({ unit, unlocked, progress }) => {
        const isSpotlight = spotlightTopic === unit.topic;
        const isFocal = unit.topic === focalTopic;
        const host = hostFor(unit.topic);
        const done = Math.min(progress.lessons, unit.lessons);
        const nodes = [
          ...Array.from({ length: unit.lessons }, (_, index) => ({ kind: 'lesson' as const, index })),
          { kind: 'review' as const, index: unit.lessons },
        ];

        const accent = unlocked ? host.accent : '#c7c7cc';
        const accentStyle = { '--node': accent, '--unit': accent } as React.CSSProperties;

        return (
          <section key={unit.topic} className="space-y-4" style={accentStyle}>
            <div className={isFocal ? 'rounded-[24px] px-5 py-4 text-white' : 'ah-card px-5 py-4'} style={isFocal ? { background: accent } : undefined}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={`text-[13px] tracking-[-0.011em] ${isFocal ? 'text-white/80' : 'text-[var(--neo-gray)]'}`}>
                    {isSpotlight && spotlightLabel
                      ? spotlightLabel
                      : `Unidade ${GAME_UNITS.indexOf(unit) + 1}`}
                  </p>
                  <h3 className={`mt-1 font-semibold leading-[1.15] tracking-[-0.02em] ${isFocal ? 'text-[22px]' : 'text-[17px] text-[var(--neo-ink)]'}`}>
                    {unit.title}
                  </h3>
                  <p className={`mt-1 text-[15px] leading-snug ${isFocal ? 'text-white/80' : 'text-[var(--neo-gray)]'}`}>{unit.tagline}</p>
                </div>
                {unlocked ? (
                  <CrownRow crowns={progress.crowns} />
                ) : (
                  <Lock size={16} className={`mt-1 shrink-0 ${isFocal ? 'text-white/80' : 'text-[#c7c7cc]'}`} />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className={`text-[13px] tabular-nums ${isFocal ? 'text-white/80' : 'text-[var(--neo-gray)]'}`}>
                  {unlocked
                    ? `${done} de ${unit.lessons} lições`
                    : 'Termine a unidade anterior'}
                </p>
                {onOpenStudy && unlocked && (
                  <button
                    type="button"
                    onClick={() => onOpenStudy(unit.topic)}
                    className={`text-[13px] ${isFocal ? 'text-white' : 'text-[var(--neo-ink)]'}`}
                  >
                    Ler a cola
                  </button>
                )}
              </div>
            </div>

            <div className="relative space-y-3 py-2">
              {nodes.map((node, nodeIndex) => {
                const key = `${unit.topic}:${node.kind}:${node.index}`;
                const isDone = node.kind === 'lesson' ? node.index < progress.lessons : progress.crowns > 0;
                const isCurrent =
                  unlocked &&
                  !isDone &&
                  (node.kind === 'lesson'
                    ? node.index === progress.lessons
                    : progress.lessons >= unit.lessons);
                const isLocked = !unlocked || (!isDone && !isCurrent);
                const offset = OFFSETS[nodeIndex % OFFSETS.length];
                const isOpen = selected === key;
                // O anfitrião fica sentado ao lado da trilha, no lado oposto à curva.
                const showHost = nodeIndex === 1;

                return (
                  <div key={key} className="flex flex-col items-center">
                    <div className="relative flex w-full items-center justify-center" style={{ minHeight: isCurrent ? 118 : 74 }}>
                      {showHost && (
                        <div
                          className="pointer-events-none absolute"
                          style={{ left: '50%', transform: `translateX(${offset > 0 ? -150 : 70}px)` }}
                          aria-hidden
                        >
                          <CharacterAvatar
                            id={host.id}
                            mood={unlocked ? 'happy' : 'idle'}
                            size={84}
                            className={unlocked ? 'game-face-idle' : 'opacity-45 grayscale'}
                          />
                        </div>
                      )}
                      <div
                        className="flex flex-col items-center"
                        style={{ transform: `translateX(${offset}px)` }}
                      >
                        {isCurrent && (
                          <span
                            className="game-tooltip game-float mb-3"
                            style={{ color: accent, borderColor: accent }}
                          >
                            {node.kind === 'review' ? 'Prova' : 'Começar'}
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label={
                            node.kind === 'review'
                              ? `Prova do box de ${unit.title}`
                              : `${unit.title}, lição ${node.index + 1}`
                          }
                          onClick={() => setSelected(isOpen ? null : key)}
                          className={`game-node ${
                            isLocked
                              ? 'game-node-locked'
                              : node.kind === 'review'
                                ? isDone
                                  ? 'game-node-crown'
                                  : 'game-node-open'
                                : isDone
                                  ? 'game-node-done'
                                  : 'game-node-open'
                          } ${isCurrent ? 'game-node-current' : ''}`}
                        >
                          {isLocked ? (
                            <Lock size={22} />
                          ) : node.kind === 'review' ? (
                            <Trophy size={26} />
                          ) : isDone ? (
                            <Check size={28} />
                          ) : (
                            <Star size={28} />
                          )}
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div
                        className="game-pop mt-2 w-full max-w-[420px] rounded-[22px] p-4 text-white"
                        style={{
                          background: isLocked ? '#e5e5ea' : accent,
                          color: isLocked ? 'var(--neo-gray)' : '#ffffff',
                        }}
                      >
                        <p className="text-[17px] font-bold tracking-[-0.016em]">
                          {node.kind === 'review'
                            ? `Prova do box · ${unit.title}`
                            : `Lição ${node.index + 1} · ${unit.title}`}
                        </p>
                        <p className={`mt-1 text-[14px] leading-snug ${isLocked ? '' : 'text-white/90'}`}>
                          {isLocked
                            ? 'Conclua a etapa anterior para liberar.'
                            : node.kind === 'review'
                              ? 'Oito perguntas misturadas. Passe e leve uma coroa.'
                              : isDone
                                ? 'Já concluída. Refazer só reforça o que você aprendeu.'
                                : 'Seis perguntas rápidas sobre o tema.'}
                        </p>
                        {!isLocked && (
                          <p className="mt-3 text-[13px] leading-snug text-white/85">
                            {host.name}: “{host.lines.trail}”
                          </p>
                        )}
                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(null);
                              onStart({ topic: unit.topic, index: node.index, kind: node.kind });
                            }}
                            className="game-cta game-cta-ghost mt-4"
                            style={{ color: accent }}
                          >
                            <Play size={15} />
                            {isDone ? 'Treinar de novo' : 'Começar'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="ah-feature px-5 py-6 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--neo)] text-white">
          <Trophy size={26} />
        </span>
        <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--neo)]">
          Trilha contínua
        </p>
        <h3 className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-[var(--neo-ink)]">
          Prática personalizada
        </h3>
        <p className="mx-auto mt-2 max-w-[420px] text-[14px] leading-snug text-[var(--neo-gray)]">
          Uma nova lição a cada rodada, misturando pontos fracos, erros e conteúdos no momento
          certo de revisar. Esta etapa nunca termina.
        </p>
        <p className="mt-3 text-[13px] font-medium text-[var(--neo)]">
          {dueCount > 0
            ? `${dueCount} ${dueCount === 1 ? 'questão pronta' : 'questões prontas'} para revisão`
            : 'O próximo treino prioriza conteúdo ainda não visto'}
        </p>
        <button
          type="button"
          onClick={onStartPractice}
          className="game-cta mx-auto mt-5 max-w-[320px]"
        >
          <Play size={15} />
          Começar nova rodada
        </button>
      </section>
    </div>
  );
};
