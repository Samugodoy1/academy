import React, { useEffect } from 'react';
import { Check, Gem, Heart, Sparkles, Target, TrendingUp, Zap } from '../../../icons';
import { CharacterAvatar, guide, hostFor } from '../characters';
import { levelTitle } from '../engine';
import { feedback } from '../sound';
import type { LessonOutcome, LessonReward } from '../types';

interface LessonCompleteProps {
  outcome: LessonOutcome;
  reward: LessonReward;
  soundOn: boolean;
  onContinue: () => void;
  onReviewMistakes?: () => void;
  onNextLesson?: () => void;
  studyLink?: { label: string; onClick: () => void } | null;
}

const headlineFor = (reward: LessonReward, accuracy: number) => {
  if (reward.crownEarned) return 'Coroa conquistada!';
  if (reward.perfect) return 'Lição impecável!';
  if (accuracy >= 0.8) return 'Muito bem!';
  if (accuracy >= 0.5) return 'Lição concluída';
  return 'Concluída — e agora você sabe onde apertar';
};

const Stat: React.FC<{ icon: React.ElementType; label: string; value: string; tone?: string }> = ({
  icon: Icon,
  label,
  value,
  tone = 'text-[var(--neo)]',
}) => (
  <div className="flex-1 rounded-[20px] bg-[#f5f5f7] px-4 py-4 text-center">
    <span className={`mx-auto flex h-8 w-8 items-center justify-center ${tone}`}>
      <Icon size={20} />
    </span>
    <p className="mt-1 text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-[var(--neo-ink)]">
      {value}
    </p>
    <p className="mt-0.5 text-[12px] text-[var(--neo-gray)]">{label}</p>
  </div>
);

export const LessonComplete: React.FC<LessonCompleteProps> = ({
  outcome,
  reward,
  soundOn,
  onContinue,
  onReviewMistakes,
  onNextLesson,
  studyLink,
}) => {
  const accuracy = outcome.total > 0 ? outcome.correct / outcome.total : 0;
  const seconds = Math.round(outcome.elapsedMs / 1000);
  const host = hostFor(outcome.topic);

  useEffect(() => {
    feedback('complete', soundOn);
  }, [soundOn]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-white">
      <div className="mx-auto flex w-full max-w-[620px] flex-1 flex-col justify-center px-5 py-10 sm:px-6">
        <div className="game-pop text-center">
          <CharacterAvatar id={host.id} mood="cheer" size={132} className="mx-auto" />
          <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--neo)]">
            {reward.perfect ? 'Sem erros' : 'Concluído'}
          </p>
          <h2 className="mt-2 text-[32px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[40px]">
            {headlineFor(reward, accuracy)}
          </h2>
          <p className="mx-auto mt-3 max-w-[34ch] text-[17px] leading-snug text-[var(--neo-gray)]">
            {host.name}: “{reward.perfect ? host.lines.perfect : host.lines.done}”
          </p>
          <p className="mx-auto mt-2 max-w-[34ch] text-[15px] leading-snug text-[var(--neo-gray)]">
            {reward.streakIncreased
              ? `Ofensiva de ${reward.streak} ${reward.streak === 1 ? 'dia' : 'dias'} garantida hoje.`
              : `Você acertou ${outcome.correct} de ${outcome.total} de primeira.`}
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <Stat icon={TrendingUp} label="XP ganho" value={`+${reward.xp}`} />
          <Stat
            icon={Target}
            label="De primeira"
            value={`${Math.round(accuracy * 100)}%`}
            tone="text-[var(--game-right)]"
          />
          <Stat
            icon={Zap}
            label="Combo máximo"
            value={`x${outcome.bestCombo}`}
            tone="text-[#ffb400]"
          />
          <Stat icon={Gem} label="Cristais" value={`+${reward.gems}`} tone="text-[#0a84ff]" />
        </div>

        <div className="mt-4 space-y-2">
          {reward.levelUp !== null && (
            <p className="flex items-center gap-2 rounded-[18px] bg-[var(--neo)] px-4 py-3 text-[15px] font-medium text-white">
              <Sparkles size={16} className="shrink-0" />
              Nível {reward.levelUp}: {levelTitle(reward.levelUp)}
            </p>
          )}
          {reward.questsDone.map(quest => (
            <p
              key={quest.id}
              className="flex items-center gap-2 rounded-[18px] bg-[var(--game-right-wash)] px-4 py-3 text-[15px] text-[var(--game-right-ink)]"
            >
              <Check size={16} className="shrink-0" />
              Missão concluída · {quest.title} · +{quest.gems} cristais
            </p>
          ))}
          {reward.goalReached && (
            <p className="rounded-[18px] bg-[var(--neo-wash)] px-4 py-3 text-[15px] text-[var(--neo-ink)]">
              Meta do dia batida. Amanhã a ofensiva continua.
            </p>
          )}
          {reward.heartRecovered && (
            <p className="flex items-center gap-2 rounded-[18px] bg-[var(--game-right-wash)] px-4 py-3 text-[15px] text-[var(--game-right-ink)]">
              <Heart size={16} /> Você recuperou uma vida.
            </p>
          )}
          {seconds > 0 && (
            <p className="px-1 text-[13px] text-[var(--neo-gray)]">
              Tempo: {Math.floor(seconds / 60)} min {seconds % 60}s
            </p>
          )}
        </div>

        <div className="mt-8 space-y-2">
          {onNextLesson ? (
            <button type="button" onClick={onNextLesson} className="game-cta">
              Próxima lição
            </button>
          ) : (
            <button type="button" onClick={onContinue} className="game-cta">
              Voltar para a trilha
            </button>
          )}
          {outcome.missed.length > 0 && onReviewMistakes && (
            <button type="button" onClick={onReviewMistakes} className="game-cta game-cta-ghost">
              {outcome.missed.length === 1
                ? 'Revisar o erro'
                : `Revisar os ${outcome.missed.length} erros`}
            </button>
          )}
          {studyLink && (
            <button
              type="button"
              onClick={studyLink.onClick}
              className="w-full py-3 text-[15px] font-medium text-[var(--neo)]"
            >
              {studyLink.label}
            </button>
          )}
          {onNextLesson && (
            <button
              type="button"
              onClick={onContinue}
              className="w-full py-2 text-[14px] font-medium text-[var(--neo-gray)]"
            >
              Voltar para a trilha
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface LessonFailedProps {
  minutesToHeart: number;
  gems: number;
  refillCost: number;
  onPractice: () => void;
  onRefill: () => void;
  onExit: () => void;
  onUpgrade?: () => void;
}

export const LessonFailed: React.FC<LessonFailedProps> = ({
  minutesToHeart,
  gems,
  refillCost,
  onPractice,
  onRefill,
  onExit,
  onUpgrade,
}) => (
  <div className="fixed inset-0 z-[200] flex flex-col justify-center overflow-y-auto bg-white px-5 py-10 sm:px-6">
    <div className="mx-auto w-full max-w-[520px] text-center">
      <span className="game-pop relative mx-auto flex w-[132px] items-end justify-center">
        <CharacterAvatar id={guide().id} mood="sad" size={132} />
        <span className="absolute -right-6 bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--game-wrong-wash)] text-[var(--game-wrong)]">
          <Heart size={22} />
        </span>
      </span>
      <h2 className="mt-4 text-[30px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)]">
        Você ficou sem vidas
      </h2>
      <p className="mx-auto mt-3 max-w-[34ch] text-[17px] leading-snug text-[var(--neo-gray)]">
        {guide().name}: “{guide().lines.fail}” A próxima vida chega em {minutesToHeart} min, ou
        você recupera uma agora no treino livre.
      </p>
      <div className="mt-8 space-y-2 text-left">
        <button type="button" onClick={onPractice} className="game-cta">
          Treino livre para recuperar
        </button>
        <button
          type="button"
          disabled={gems < refillCost}
          onClick={onRefill}
          className={`game-cta game-cta-ghost ${gems < refillCost ? 'opacity-50' : ''}`}
        >
          Encher as vidas por {refillCost}
          <Gem size={15} />
        </button>
        {onUpgrade && (
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full py-3 text-[15px] font-medium text-[var(--neo)]"
          >
            No Student as vidas são infinitas
          </button>
        )}
        <button
          type="button"
          onClick={onExit}
          className="w-full py-2 text-[14px] font-medium text-[var(--neo-gray)]"
        >
          Sair por enquanto
        </button>
      </div>
    </div>
  </div>
);
