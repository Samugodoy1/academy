import React, { useMemo, useState } from 'react';
import type { StudyKey } from '../../../utils/studyTopics';
import { BookOpen, Check, Crown, Lock, Play, Star, Trophy } from '../../../icons';
import { CharacterAvatar, hostFor } from '../characters';
import { GAME_UNITS } from '../content';
import { CROWNS_PER_UNIT, getUnitState } from '../progress';
import type { GameState, GameUnit } from '../types';

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
  return getUnitState(state, previous.topic).lessons >= previous.lessons;
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

  return (
    <div className="space-y-10">
      {units.map(({ unit, unlocked, progress }) => {
        const isSpotlight = spotlightTopic === unit.topic;
        const host = hostFor(unit.topic);
        const done = Math.min(progress.lessons, unit.lessons);
        const nodes = [
          ...Array.from({ length: unit.lessons }, (_, index) => ({ kind: 'lesson' as const, index })),
          { kind: 'review' as const, index: unit.lessons },
        ];

        return (
          <section key={unit.topic} className="space-y-4">
            <div
              className={`rounded-[24px] px-5 py-4 ${
                isSpotlight ? 'bg-[var(--neo)] text-white' : 'bg-[#f5f5f7] text-[var(--neo-ink)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <CharacterAvatar
                    id={host.id}
                    mood={unlocked ? 'happy' : 'idle'}
                    size={56}
                    className={unlocked ? '' : 'opacity-45 grayscale'}
                  />
                  <div className="min-w-0">
                    {isSpotlight && spotlightLabel && (
                      <p className="text-[12px] font-medium uppercase tracking-[0.05em] text-white/80">
                        {spotlightLabel}
                      </p>
                    )}
                    <h3 className="text-[20px] font-semibold leading-[1.15] tracking-[-0.02em]">
                      {unit.title}
                    </h3>
                    <p
                      className={`mt-1 text-[14px] leading-snug ${
                        isSpotlight ? 'text-white/85' : 'text-[var(--neo-gray)]'
                      }`}
                    >
                      {unit.tagline}
                    </p>
                    <p
                      className={`mt-2 text-[13px] leading-snug ${
                        isSpotlight ? 'text-white/75' : 'text-[var(--neo-gray)]'
                      }`}
                    >
                      Com {host.name}, {host.role}
                    </p>
                  </div>
                </div>
                {unlocked ? (
                  <CrownRow crowns={progress.crowns} />
                ) : (
                  <Lock size={16} className="mt-1 shrink-0 text-[var(--neo-gray)]" />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p
                  className={`text-[13px] tabular-nums ${
                    isSpotlight ? 'text-white/85' : 'text-[var(--neo-gray)]'
                  }`}
                >
                  {unlocked
                    ? `${done}/${unit.lessons} lições`
                    : 'Termine a unidade anterior para abrir'}
                </p>
                {onOpenStudy && (
                  <button
                    type="button"
                    onClick={() => onOpenStudy(unit.topic)}
                    className={`flex items-center gap-1.5 text-[13px] font-medium ${
                      isSpotlight ? 'text-white' : 'text-[var(--neo)]'
                    }`}
                  >
                    <BookOpen size={14} />
                    Ler a cola
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3 py-1">
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

                return (
                  <div key={key} className="flex flex-col items-center">
                    <button
                      type="button"
                      style={{ transform: `translateX(${offset}px)` }}
                      aria-label={
                        node.kind === 'review'
                          ? `Prova do box de ${unit.title}`
                          : `${unit.title}, lição ${node.index + 1}`
                      }
                      onClick={() => {
                        if (isLocked) {
                          setSelected(isOpen ? null : key);
                          return;
                        }
                        setSelected(isOpen ? null : key);
                      }}
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
                        <Check size={26} />
                      ) : (
                        <Star size={26} />
                      )}
                    </button>

                    {isOpen && (
                      <div className="game-pop mt-3 w-full max-w-[420px] rounded-[22px] border-2 border-[var(--game-line)] bg-white p-4">
                        <p className="text-[16px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
                          {node.kind === 'review'
                            ? `Prova do box · ${unit.title}`
                            : `Lição ${node.index + 1} · ${unit.title}`}
                        </p>
                        <p className="mt-1 text-[14px] leading-snug text-[var(--neo-gray)]">
                          {isLocked
                            ? 'Conclua a etapa anterior para liberar.'
                            : node.kind === 'review'
                              ? 'Oito perguntas misturadas. Passe e leve uma coroa.'
                              : isDone
                                ? 'Já concluída. Refazer não custa vidas extras de propósito — só reforça.'
                                : 'Seis perguntas rápidas sobre o tema.'}
                        </p>
                        {!isLocked && (
                          <p className="mt-3 text-[13px] leading-snug text-[var(--neo-gray)]">
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
                            className="game-cta mt-4"
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
    </div>
  );
};
