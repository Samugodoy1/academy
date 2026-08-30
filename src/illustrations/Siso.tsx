import React from 'react';

export type SisoMood = 'idle' | 'wave' | 'study' | 'box' | 'celebrate' | 'think' | 'proud';

interface SisoProps {
  mood?: SisoMood;
  size?: number;
  className?: string;
}

/**
 * Siso — mascote original do Academy.
 * Um dente do siso estudante: ansioso, afiado e sempre no box.
 * Desenho próprio, traço grosso, paleta da marca. Nada de kit genérico.
 */
export function Siso({ mood = 'idle', size = 168, className }: SisoProps) {
  const bounce = mood === 'celebrate' || mood === 'wave' || mood === 'proud';
  const wiggle = mood === 'think';

  return (
    <div
      className={`${bounce ? 'siso-bounce' : wiggle ? 'siso-wiggle' : 'siso-idle'} ${className || ''}`}
      style={{ width: size, height: size * 1.18 }}
      aria-hidden
    >
      <svg viewBox="0 0 200 236" width="100%" height="100%" fill="none">
        {mood === 'celebrate' && <MolarConfetti />}

        {/* Arms behind body for some poses */}
        {mood === 'celebrate' && (
          <>
            <path d="M48 118c-22-28-28-52-18-58 6-4 14 6 18 22" stroke="#3B0459" strokeWidth="10" strokeLinecap="round" />
            <path d="M152 118c22-28 28-52 18-58-6-4-14 6-18 22" stroke="#3B0459" strokeWidth="10" strokeLinecap="round" />
            <circle cx="28" cy="58" r="11" fill="#FFF6EC" stroke="#3B0459" strokeWidth="6" />
            <circle cx="172" cy="58" r="11" fill="#FFF6EC" stroke="#3B0459" strokeWidth="6" />
          </>
        )}

        {mood === 'wave' && (
          <g className="siso-wave-arm" style={{ transformOrigin: '48px 120px' }}>
            <path d="M50 122c-26-8-42-38-28-58 8-12 20-4 26 14" stroke="#3B0459" strokeWidth="10" strokeLinecap="round" />
            <circle cx="46" cy="72" r="11" fill="#FFF6EC" stroke="#3B0459" strokeWidth="6" />
          </g>
        )}

        {/* Body — crown + roots */}
        <path
          d="M100 18c32 0 56 22 56 54 0 14-4 28-8 42-4 16-6 30-6 40 0 16-12 28-26 28-8 0-14-4-18-10-3 4-8 8-14 10-12 4-22-4-22-18 0-8 2-20 5-34 3-14 5-28 5-40C72 40 78 18 100 18Z"
          fill="#F3DDC8"
          stroke="#3B0459"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path
          d="M100 28c26 0 44 17 44 44 0 13-3 26-7 39-4 15-6 28-6 37 0 11-8 18-17 18-6 0-10-3-13-8-3 5-8 8-13 6-8-2-12-10-12-18 0-8 2-19 4-32 3-14 5-27 5-38 0-27 5-48 15-48Z"
          fill="#FFF6EC"
        />

        {/* Roots as little legs */}
        <path d="M78 178c-2 16-8 28-18 34" stroke="#3B0459" strokeWidth="8" strokeLinecap="round" />
        <path d="M122 178c2 16 8 28 18 34" stroke="#3B0459" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="58" cy="216" rx="16" ry="8" fill="#52057B" stroke="#3B0459" strokeWidth="4" />
        <ellipse cx="142" cy="216" rx="16" ry="8" fill="#52057B" stroke="#3B0459" strokeWidth="4" />

        {/* Blush */}
        <ellipse cx="72" cy="108" rx="10" ry="6" fill="#F5A7C0" opacity="0.85" />
        <ellipse cx="128" cy="108" rx="10" ry="6" fill="#F5A7C0" opacity="0.85" />

        {/* Face */}
        {mood === 'think' ? (
          <>
            <path d="M78 92c4-6 10-8 14-6" stroke="#3B0459" strokeWidth="5" strokeLinecap="round" />
            <path d="M108 86c4-2 10 0 14 6" stroke="#3B0459" strokeWidth="5" strokeLinecap="round" />
            <circle cx="84" cy="102" r="6" fill="#3B0459" />
            <circle cx="116" cy="102" r="6" fill="#3B0459" />
            <path d="M90 128c6 4 14 4 20 0" stroke="#3B0459" strokeWidth="5" strokeLinecap="round" />
          </>
        ) : mood === 'celebrate' || mood === 'proud' ? (
          <>
            <path d="M76 98c6-8 12-8 16 0" stroke="#3B0459" strokeWidth="6" strokeLinecap="round" />
            <path d="M108 98c6-8 12-8 16 0" stroke="#3B0459" strokeWidth="6" strokeLinecap="round" />
            <path d="M84 124c8 14 24 14 32 0" stroke="#3B0459" strokeWidth="6" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="84" cy="102" r="7" fill="#3B0459" />
            <circle cx="86.5" cy="99.5" r="2.2" fill="#FFF6EC" />
            <circle cx="116" cy="102" r="7" fill="#3B0459" />
            <circle cx="118.5" cy="99.5" r="2.2" fill="#FFF6EC" />
            {mood === 'study' ? (
              <path d="M90 126c8 8 20 8 28 0" stroke="#3B0459" strokeWidth="5" strokeLinecap="round" />
            ) : (
              <path d="M88 124c6 10 18 10 24 0" stroke="#3B0459" strokeWidth="5.5" strokeLinecap="round" />
            )}
          </>
        )}

        {/* Right arm idle / study / box / think */}
        {mood === 'study' && (
          <g>
            <path d="M148 128c18 8 22 28 8 38" stroke="#3B0459" strokeWidth="9" strokeLinecap="round" />
            <rect x="118" y="148" width="40" height="28" rx="6" fill="#52057B" stroke="#3B0459" strokeWidth="5" />
            <rect x="122" y="152" width="32" height="20" rx="3" fill="#FFF6EC" />
            <path d="M138 152v20" stroke="#52057B" strokeWidth="3" />
          </g>
        )}

        {mood === 'box' && (
          <g>
            <path d="M52 128c-16 4-24 22-12 34" stroke="#3B0459" strokeWidth="9" strokeLinecap="round" />
            <path d="M36 164l-14 18" stroke="#C9A227" strokeWidth="6" strokeLinecap="round" />
            <circle cx="22" cy="186" r="6" fill="#C9A227" stroke="#3B0459" strokeWidth="3" />
            <path d="M70 44c-18-4-28 8-22 20 8 4 22 2 28-6" fill="#FFFFFF" stroke="#3B0459" strokeWidth="5" />
            <path d="M78 40h44c8 0 12 6 10 12l-8 6H76l-4-8c-2-6 2-10 6-10Z" fill="#FFFFFF" stroke="#3B0459" strokeWidth="5" />
          </g>
        )}

        {mood === 'think' && (
          <g>
            <path d="M148 130c16 6 18 28 4 36" stroke="#3B0459" strokeWidth="9" strokeLinecap="round" />
            <circle cx="148" cy="170" r="11" fill="#FFF6EC" stroke="#3B0459" strokeWidth="6" />
          </g>
        )}

        {mood === 'idle' && (
          <path d="M150 128c14 10 16 28 4 34" stroke="#3B0459" strokeWidth="9" strokeLinecap="round" />
        )}

        {mood === 'proud' && (
          <g>
            <path d="M150 122c20 0 28 18 14 32" stroke="#3B0459" strokeWidth="9" strokeLinecap="round" />
            <circle cx="162" cy="158" r="11" fill="#FFF6EC" stroke="#3B0459" strokeWidth="6" />
          </g>
        )}
      </svg>
    </div>
  );
}

function MolarConfetti() {
  return (
    <g>
      <MiniMolar x={18} y={36} rot={-18} />
      <MiniMolar x={168} y={28} rot={22} />
      <MiniMolar x={24} y={150} rot={12} />
      <MiniMolar x={166} y={142} rot={-14} />
    </g>
  );
}

function MiniMolar({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M8 0c5 0 8 3 8 7 0 3-1 5-2 8-1 2-1 4-1 5 0 2-2 4-4 4s-3-1-4-3c-1 1-2 2-3 2-2 0-4-2-4-5 0-2 1-4 1-7C0 4 3 0 8 0Z" fill="#52057B" />
    </g>
  );
}
