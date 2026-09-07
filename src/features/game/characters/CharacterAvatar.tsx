import React from 'react';
import type { CharacterId, Mood } from './cast';

/**
 * A turma da clínica, desenhada no mesmo traço do Siso: contorno grosso roxo,
 * fundo creme e nada de kit genérico. Cada personagem é um busto de 120×120
 * para caber em chip, balão de fala e tela cheia sem redesenhar.
 */

const INK = '#3B0459';
const CREAM = '#FFF6EC';
const BLUSH = '#F5A7C0';

type HairStyle = 'bob' | 'short' | 'ponytail' | 'curly' | 'bun' | 'braids';

interface Traits {
  skin: string;
  shade: string;
  hair: string;
  hairStyle: HairStyle;
  coat: string;
  shirt: string;
  glasses?: boolean;
  beard?: boolean;
  cap?: string;
  loupes?: boolean;
  earrings?: boolean;
  freckles?: boolean;
}

const TRAITS: Record<Exclude<CharacterId, 'siso'>, Traits> = {
  val: {
    skin: '#F2CBAB',
    shade: '#D9A87F',
    hair: '#A2734B',
    hairStyle: 'bob',
    coat: '#EDEEF3',
    shirt: '#0a84ff',
    glasses: true,
  },
  kaio: {
    skin: '#96603E',
    shade: '#7A4B2E',
    hair: '#3A2A1E',
    hairStyle: 'short',
    coat: '#12b28a',
    shirt: '#0b7d61',
    beard: true,
    cap: '#0f9e7c',
  },
  nina: {
    skin: '#EDBA92',
    shade: '#D49B71',
    hair: '#8A5230',
    hairStyle: 'ponytail',
    coat: '#EDEEF3',
    shirt: '#ff375f',
    freckles: true,
  },
  teo: {
    skin: '#CE8F60',
    shade: '#AC7343',
    hair: '#7E5330',
    hairStyle: 'curly',
    coat: '#EDEEF3',
    shirt: '#ff9500',
    loupes: true,
  },
  zaira: {
    skin: '#7A4B2C',
    shade: '#5F3820',
    hair: '#DCD7E6',
    hairStyle: 'bun',
    coat: '#9d74f8',
    shirt: '#6f3fd6',
    earrings: true,
  },
  duda: {
    skin: '#F5D8BE',
    shade: '#DEB995',
    hair: '#A9663A',
    hairStyle: 'braids',
    coat: '#3ecf6b',
    shirt: '#1f9e4c',
  },
};

// ── Rosto ─────────────────────────────────────────────────────────────

const Eyes: React.FC<{ mood: Mood }> = ({ mood }) => {
  if (mood === 'happy' || mood === 'cheer') {
    return (
      <>
        <path d="M43 56c4-6 9-6 13 0" stroke={INK} strokeWidth="4.6" strokeLinecap="round" fill="none" />
        <path d="M64 56c4-6 9-6 13 0" stroke={INK} strokeWidth="4.6" strokeLinecap="round" fill="none" />
      </>
    );
  }
  const radius = mood === 'wow' ? 6.2 : mood === 'sad' ? 4.2 : 5;
  return (
    <>
      <circle cx="49" cy="57" r={radius} fill={INK} />
      <circle cx={50.8} cy={55} r={1.8} fill={CREAM} />
      <circle cx="71" cy="57" r={radius} fill={INK} />
      <circle cx={72.8} cy={55} r={1.8} fill={CREAM} />
    </>
  );
};

const Brows: React.FC<{ mood: Mood }> = ({ mood }) => {
  if (mood === 'sad') {
    return (
      <>
        <path d="M42 43c4-1 9 1 12 5" stroke={INK} strokeWidth="3.6" strokeLinecap="round" fill="none" />
        <path d="M78 43c-4-1-9 1-12 5" stroke={INK} strokeWidth="3.6" strokeLinecap="round" fill="none" />
      </>
    );
  }
  const lift = mood === 'cheer' || mood === 'wow' ? 3 : 0;
  return (
    <>
      <path
        d={`M42 ${46 - lift}c4-3 10-3 13-1`}
        stroke={INK}
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M78 ${46 - lift}c-4-3-10-3-13-1`}
        stroke={INK}
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
};

const Mouth: React.FC<{ mood: Mood }> = ({ mood }) => {
  if (mood === 'cheer') {
    return (
      <g>
        <path d="M47 68h26c0 10-6 15-13 15s-13-5-13-15z" fill={INK} />
        <path d="M50 69h20c0 1.8-.4 3.2-1 4.4H51c-.6-1.2-1-2.6-1-4.4z" fill={CREAM} />
      </g>
    );
  }
  if (mood === 'wow') {
    return <ellipse cx="60" cy="72" rx="5.6" ry="7.2" fill={INK} />;
  }
  if (mood === 'sad') {
    return (
      <path d="M52 74c4-5 12-5 16 0" stroke={INK} strokeWidth="4.2" strokeLinecap="round" fill="none" />
    );
  }
  if (mood === 'happy') {
    return (
      <path d="M48 68c5 9 19 9 24 0" stroke={INK} strokeWidth="4.6" strokeLinecap="round" fill="none" />
    );
  }
  return (
    <path d="M52 69c4 6 12 6 16 0" stroke={INK} strokeWidth="4.4" strokeLinecap="round" fill="none" />
  );
};

// ── Cabelos ───────────────────────────────────────────────────────────

/** Massa de cabelo atrás da cabeça: comprimento, coque, tranças. */
const HairBack: React.FC<{ traits: Traits }> = ({ traits }) => {
  const { hair, hairStyle } = traits;
  const stroke = { stroke: INK, strokeWidth: 4.6, strokeLinejoin: 'round' as const };
  switch (hairStyle) {
    case 'bob':
      return (
        <path
          d="M29 52c0-21 13-33 31-33s31 12 31 33v22c0 6-8 6-9 0l-3-24H41l-3 24c-1 6-9 6-9 0z"
          fill={hair}
          {...stroke}
        />
      );
    case 'ponytail':
      return (
        <g>
          <ellipse cx="95" cy="54" rx="13" ry="22" transform="rotate(14 95 54)" fill={hair} {...stroke} />
          <path d="M82 34c6-2 12 0 15 5" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path
            d="M30 52c0-20 13-32 30-32s30 12 30 32v10c0 5-7 5-8 0l-4-16H42l-4 16c-1 5-8 5-8 0z"
            fill={hair}
            {...stroke}
          />
        </g>
      );
    case 'bun':
      return (
        <g>
          <circle cx="60" cy="16" r="13" fill={hair} {...stroke} />
          <path
            d="M30 54c0-21 13-33 30-33s30 12 30 33v8c0 5-7 5-8 0l-4-14H42l-4 14c-1 5-8 5-8 0z"
            fill={hair}
            {...stroke}
          />
        </g>
      );
    case 'braids':
      return (
        <g>
          <path
            d="M29 50c0-20 13-31 31-31s31 11 31 31v8c0 5-7 5-8 0l-4-14H41l-4 14c-1 5-8 5-8 0z"
            fill={hair}
            {...stroke}
          />
          <path d="M30 58c-8 10-9 25-4 36 2 5 10 3 10-3 0-10 1-18 5-24z" fill={hair} {...stroke} />
          <path d="M90 58c8 10 9 25 4 36-2 5-10 3-10-3 0-10-1-18-5-24z" fill={hair} {...stroke} />
        </g>
      );
    default:
      return null;
  }
};

/** Franja: só o alto da cabeça, para o rosto ficar livre. */
const HairFront: React.FC<{ traits: Traits }> = ({ traits }) => {
  const { hair, hairStyle } = traits;
  const stroke = { stroke: INK, strokeWidth: 4.6, strokeLinejoin: 'round' as const };
  if (hairStyle === 'curly') {
    return (
      <g fill={hair} {...stroke}>
        <circle cx="36" cy="34" r="11" />
        <circle cx="52" cy="22" r="12" />
        <circle cx="70" cy="22" r="12" />
        <circle cx="85" cy="34" r="11" />
        <path d="M32 46c-3-16 8-28 28-28s31 12 28 28c-4-11-14-16-28-16s-24 5-28 16z" />
      </g>
    );
  }
  if (hairStyle === 'short') {
    return <path d="M31 48c-2-19 10-30 29-30s31 11 29 30c-4-10-9-15-16-16-7 5-24 6-33 1-4 3-7 7-9 15z" fill={hair} {...stroke} />;
  }
  if (hairStyle === 'bob') {
    return <path d="M30 46c-1-18 12-29 30-29s31 11 30 29c-4-9-11-14-21-16-9 7-24 9-39 16z" fill={hair} {...stroke} />;
  }
  if (hairStyle === 'ponytail') {
    return <path d="M31 45c-1-18 11-28 29-28s30 10 29 28c-6-10-15-15-27-15-9 4-22 6-31 15z" fill={hair} {...stroke} />;
  }
  if (hairStyle === 'bun') {
    return <path d="M31 47c-1-19 11-29 29-29s30 10 29 29c-7-12-16-17-29-17s-22 5-29 17z" fill={hair} {...stroke} />;
  }
  return <path d="M31 46c-1-18 12-28 29-28s30 10 29 28c-7-11-16-16-29-16s-22 5-29 16z" fill={hair} {...stroke} />;
};

// ── Busto humano ──────────────────────────────────────────────────────

const HumanBust: React.FC<{ traits: Traits; mood: Mood }> = ({ traits, mood }) => (
  <g>
    {/* Blusa por baixo, aparecendo no decote do jaleco */}
    <path d="M36 82h48v38H36z" fill={traits.shirt} stroke={INK} strokeWidth="4.6" strokeLinejoin="round" />

    {/* Jaleco em duas abas, deixando o V da blusa à mostra */}
    <path d="M4 120c2-19 16-31 38-36l10 22v14z" fill={traits.coat} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <path d="M116 120c-2-19-16-31-38-36l-10 22v14z" fill={traits.coat} stroke={INK} strokeWidth="5" strokeLinejoin="round" />

    {/* Pescoço */}
    <path d="M50 70h20v22c0 6-20 6-20 0z" fill={traits.shade} stroke={INK} strokeWidth="4.6" strokeLinejoin="round" />

    {/* Orelhas atrás do cabelo comprido */}
    <circle cx="31" cy="56" r="7" fill={traits.skin} stroke={INK} strokeWidth="4.2" />
    <circle cx="89" cy="56" r="7" fill={traits.skin} stroke={INK} strokeWidth="4.2" />

    <HairBack traits={traits} />

    {traits.earrings && (
      <>
        <circle cx="31" cy="67" r="4" fill="#ffb400" stroke={INK} strokeWidth="2.8" />
        <circle cx="89" cy="67" r="4" fill="#ffb400" stroke={INK} strokeWidth="2.8" />
      </>
    )}

    {/* Cabeça */}
    <ellipse cx="60" cy="52" rx="29" ry="31" fill={traits.skin} stroke={INK} strokeWidth="5" />

    {traits.beard && (
      <path
        d="M31 56c0 6 1 12 3 17 4 12 14 18 26 18s22-6 26-18c2-5 3-11 3-17 1 15-1 27-8 34-6 6-13 9-21 9s-15-3-21-9c-7-7-9-19-8-34z"
        fill={traits.hair}
        stroke={INK}
        strokeWidth="4.2"
        strokeLinejoin="round"
      />
    )}

    <HairFront traits={traits} />

    {/* Blush e sardas */}
    <ellipse cx="40" cy="64" rx="6.5" ry="4.2" fill={BLUSH} opacity="0.75" />
    <ellipse cx="80" cy="64" rx="6.5" ry="4.2" fill={BLUSH} opacity="0.75" />
    {traits.freckles && (
      <g fill={traits.shade}>
        <circle cx="46" cy="63" r="1.3" />
        <circle cx="51" cy="66" r="1.3" />
        <circle cx="69" cy="66" r="1.3" />
        <circle cx="74" cy="63" r="1.3" />
      </g>
    )}

    <Brows mood={mood} />
    <Eyes mood={mood} />
    <Mouth mood={mood} />

    {traits.glasses && (
      <g stroke={INK} strokeWidth="3.8" fill="none">
        <rect x="37" y="47" width="23" height="18" rx="9" fill="#bfe4ff" fillOpacity="0.35" />
        <rect x="60" y="47" width="23" height="18" rx="9" fill="#bfe4ff" fillOpacity="0.35" />
        <path d="M34 53l3-2M86 53l-3-2" strokeLinecap="round" />
      </g>
    )}

    {traits.cap && (
      <g>
        <path
          d="M29 40c1-18 14-29 31-29s30 11 31 29c0 5-4 7-8 5-7-4-14-6-23-6s-16 2-23 6c-4 2-8 0-8-5z"
          fill={traits.cap}
          stroke={INK}
          strokeWidth="4.8"
          strokeLinejoin="round"
        />
        <path d="M41 24c6-5 12-7 19-7" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.45" fill="none" />
      </g>
    )}

    {traits.loupes && (
      <g>
        <path d="M33 34h54" stroke={INK} strokeWidth="4.8" strokeLinecap="round" />
        <circle cx="49" cy="34" r="7.5" fill="#cfe0f0" stroke={INK} strokeWidth="4.2" />
        <circle cx="71" cy="34" r="7.5" fill="#cfe0f0" stroke={INK} strokeWidth="4.2" />
        <path d="M46 31c2-2 4-3 6-3" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </g>
    )}
  </g>
);

// ── Siso em busto ─────────────────────────────────────────────────────

const SisoBust: React.FC<{ mood: Mood }> = ({ mood }) => (
  <g>
    <path
      d="M21 54C21 26 37 10 60 10s39 16 39 44c0 12-2 22-4 32l-4 24c-1 7-4 10-8 9-4-1-6-6-7-13l-3-18c-1-6-3-9-6-9s-5 3-6 9l-3 18c-1 7-3 12-7 13-4 1-7-2-8-9l-4-24c-2-10-4-20-4-32z"
      fill={CREAM}
      stroke={INK}
      strokeWidth="5.5"
      strokeLinejoin="round"
    />
    <path
      d="M33 42c1-14 11-23 27-23"
      stroke="#ffffff"
      strokeWidth="7"
      strokeLinecap="round"
      opacity="0.9"
      fill="none"
    />
    <ellipse cx="36" cy="64" rx="7.5" ry="5" fill={BLUSH} opacity="0.85" />
    <ellipse cx="84" cy="64" rx="7.5" ry="5" fill={BLUSH} opacity="0.85" />
    <g transform="translate(0 -4)">
      <Brows mood={mood} />
      <Eyes mood={mood} />
      <Mouth mood={mood} />
    </g>
  </g>
);

// ── Componente ────────────────────────────────────────────────────────

export interface CharacterAvatarProps {
  id: CharacterId;
  mood?: Mood;
  size?: number;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  id,
  mood = 'idle',
  size = 56,
  className = '',
}) => {
  const animation = mood === 'cheer' ? 'siso-bounce' : mood === 'sad' ? 'siso-wiggle' : 'siso-idle';
  return (
    <span
      className={`inline-block shrink-0 ${animation} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 120 120" width="100%" height="100%" fill="none">
        {id === 'siso' ? <SisoBust mood={mood} /> : <HumanBust traits={TRAITS[id]} mood={mood} />}
      </svg>
    </span>
  );
};
