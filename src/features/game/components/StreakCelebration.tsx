import React, { useEffect } from 'react';
import { Flame, Gem } from '../../../icons';
import { CharacterAvatar, GUIDE_ID } from '../characters';
import { feedback } from '../sound';
import { milestoneGems } from '../streak';

interface StreakCelebrationProps {
  milestone: number;
  soundOn: boolean;
  onContinue: () => void;
}

const LINE: Record<number, string> = {
  3: 'Três dias seguidos. É assim que vira hábito.',
  7: 'Uma semana inteira. Seu cérebro já agradece.',
  14: 'Duas semanas. Isso já é rotina de clínica.',
  30: 'Um mês sem falhar. Poucos chegam aqui.',
  60: 'Dois meses. Você está construindo repertório de verdade.',
  100: 'Cem dias. Isso é disciplina de residente.',
  180: 'Meio ano de ofensiva. Respeito.',
  365: 'Um ano inteiro. Você virou referência.',
};

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({
  milestone,
  soundOn,
  onContinue,
}) => {
  useEffect(() => {
    feedback('complete', soundOn);
  }, [soundOn]);

  return (
    <div className="fixed inset-0 z-[210] flex flex-col justify-center bg-[#ff9500] px-5 py-10 text-white sm:px-6">
      <div className="mx-auto w-full max-w-[440px] text-center">
        <span className="game-pop relative mx-auto flex w-[150px] items-end justify-center">
          <CharacterAvatar id={GUIDE_ID} mood="cheer" size={150} />
          <span className="absolute -right-7 bottom-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#ff9500]">
            <Flame size={26} />
          </span>
        </span>
        <p className="mt-6 text-[64px] font-semibold leading-none tabular-nums tracking-[-0.04em]">
          {milestone}
        </p>
        <p className="mt-1 text-[17px] font-medium uppercase tracking-[0.08em] text-white/85">
          dias de ofensiva
        </p>
        <p className="mx-auto mt-5 max-w-[28ch] text-[17px] leading-snug text-white/90">
          {LINE[milestone] ?? 'Mais uma marca batida. Segue o jogo.'}
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-[15px] font-semibold tabular-nums">
          <Gem size={16} /> +{milestoneGems(milestone)} cristais
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="game-cta mt-8 !bg-white !text-[#c26a00] !shadow-[0_4px_0_rgba(0,0,0,0.18)]"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
