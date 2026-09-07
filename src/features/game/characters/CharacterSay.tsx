import React from 'react';
import { CharacterAvatar } from './CharacterAvatar';
import type { Character, Mood } from './cast';

type Tone = 'default' | 'right' | 'wrong' | 'accent';

const TONE: Record<Tone, { bubble: string; text: string; name: string }> = {
  default: {
    bubble: 'bg-[#f5f5f7]',
    text: 'text-[var(--neo-ink)]',
    name: 'text-[var(--neo-gray)]',
  },
  right: {
    bubble: 'bg-[var(--game-right-wash)]',
    text: 'text-[var(--game-right-ink)]',
    name: 'text-[var(--game-right-ink)] opacity-70',
  },
  wrong: {
    bubble: 'bg-[var(--game-wrong-wash)]',
    text: 'text-[var(--game-wrong-ink)]',
    name: 'text-[var(--game-wrong-ink)] opacity-70',
  },
  accent: {
    bubble: 'bg-white/20',
    text: 'text-white',
    name: 'text-white/75',
  },
};

export interface CharacterSayProps {
  character: Character;
  text: string;
  mood?: Mood;
  size?: number;
  tone?: Tone;
  /** Hides the name line when the character is already introduced nearby. */
  anonymous?: boolean;
  className?: string;
}

/** Personagem + balão de fala, com o rabinho apontando para quem falou. */
export const CharacterSay: React.FC<CharacterSayProps> = ({
  character,
  text,
  mood = 'idle',
  size = 64,
  tone = 'default',
  anonymous = false,
  className = '',
}) => {
  const skin = TONE[tone];
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <CharacterAvatar id={character.id} mood={mood} size={size} />
      <div className={`relative min-w-0 flex-1 rounded-[20px] rounded-bl-[6px] px-4 py-3 ${skin.bubble}`}>
        <span
          className={`absolute -left-1.5 bottom-3 h-3 w-3 rotate-45 ${skin.bubble}`}
          aria-hidden
        />
        {!anonymous && (
          <p className={`text-[12px] font-medium uppercase tracking-[0.05em] ${skin.name}`}>
            {character.name}
          </p>
        )}
        <p className={`text-[16px] leading-snug ${skin.text}`}>{text}</p>
      </div>
    </div>
  );
};
