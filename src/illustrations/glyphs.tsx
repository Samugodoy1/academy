import React from 'react';

/** Original clinic glyphs — same thick-ink language as Siso. Not icon packs. */

const stroke = '#3B0459';
const cream = '#FFF6EC';
const blush = '#F3DDC8';
const purple = '#52057B';
const gold = '#C9A227';

export function ToothGlyph({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 6c8 0 14 6 14 13 0 4-1 8-2 12-1 5-2 9-2 11 0 4-3 7-7 7-2 0-4-1-5-3-1 2-3 3-5 3-4 0-6-3-6-7 0-2 1-6 2-11 1-4 2-8 2-12C16 12 18 6 24 6Z"
        fill={cream}
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="18.5" cy="22" rx="2.4" ry="1.5" fill="#F5A7C0" />
      <ellipse cx="29.5" cy="22" rx="2.4" ry="1.5" fill="#F5A7C0" />
      <circle cx="19" cy="20" r="1.8" fill={stroke} />
      <circle cx="29" cy="20" r="1.8" fill={stroke} />
      <path d="M20 27c2.5 3 5.5 3 8 0" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ChairGlyph({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M14 38h22" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M18 38V22" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 38V26" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M12 22h22c3 0 5 2 5 5v1H14c-2 0-3-1-3-3 0-2 1-3 1-3Z" fill={cream} stroke={stroke} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M12 14c0-4 3-7 8-7h2c2 0 3 1 3 3v10H14c-1.5 0-2-2-2-6Z" fill={cream} stroke={stroke} strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="38" cy="14" r="3.2" fill={gold} stroke={stroke} strokeWidth="2" />
      <path d="M36 16l-4 6" stroke={gold} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function OdontogramGlyph({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M8 28c4-10 10-14 16-14s12 4 16 14" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" />
      {[12, 19, 26, 33].map((x, i) => (
        <path
          key={x}
          d={`M${x} 18c2.4 0 4 1.8 4 4 0 1.4-.4 2.8-.8 4-.4 1.4-.6 2.6-.6 3.2 0 1.2-.8 2-1.8 2s-1.4-.4-1.8-1.2c-.3.6-.8 1-1.4 1-1.2 0-1.8-1-1.8-2.2 0-.6.2-1.8.5-3.2.4-1.2.7-2.6.7-4 0-2.2 1-4 4-4Z`}
          fill={i === 1 || i === 2 ? purple : cream}
          stroke={stroke}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

export function BookGlyph({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M8 12c6-2 10-1 16 2 6-3 10-4 16-2v24c-6-2-10-1-16 2-6-3-10-4-16-2V12Z" fill={cream} stroke={stroke} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M24 14v24" stroke={purple} strokeWidth="2.4" />
      <path d="M13 20h7M13 25h6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M28 20h7M29 25h6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16.5" cy="32" r="3" fill={purple} />
    </svg>
  );
}

export function ExplorerGlyph({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M16 40c8-2 12-8 14-16 1-6 4-10 10-12" stroke={gold} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M38 10c4 1 6 5 3 8" stroke={gold} strokeWidth="3.2" strokeLinecap="round" />
      <rect x="10" y="34" width="12" height="8" rx="3" fill={purple} stroke={stroke} strokeWidth="2.2" />
    </svg>
  );
}

export function CheckMolarGlyph({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 7c8 0 13 6 13 13 0 4-1 8-2 11-1 5-2 9-2 11 0 3.5-3 6.5-6.5 6.5-2 0-3.5-1-4.5-2.6-1 1.6-2.6 2.6-4.5 2.6C14 48.5 11 45.5 11 42c0-2 1-6 2-11 1-3 2-7 2-11C15 13 18 7 24 7Z"
        fill={cream}
        stroke={stroke}
        strokeWidth="3"
      />
      <path d="M17 24l5 5 9-10" stroke={purple} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MolarStamp({ size = 22, rotate = 0 }: { size?: number; rotate?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M12 2c5 0 8 3.5 8 8 0 2.4-.7 4.8-1.4 7-.7 2.4-1 4.4-1 5.6 0 2-1.6 3.6-3.6 3.6-1.2 0-2.2-.7-2.8-1.7-.5.9-1.4 1.6-2.5 1.8-2 .4-3.7-1-3.7-3 0-1.2.4-3.2.9-5.4.5-2 .8-4.2.8-6.5C7 5.5 8.4 2 12 2Z" fill={purple} />
    </svg>
  );
}

export function DentalChairScene({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 200 144" fill="none" aria-hidden>
      <ellipse cx="100" cy="132" rx="54" ry="8" fill="#F4F1F6" />
      <path d="M48 118h104" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <path d="M70 118V72" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <path d="M128 118V78" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <path d="M42 70h92c12 0 18 8 18 16v6H50c-8 0-12-6-12-12 0-6 2-10 4-10Z" fill={purple} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
      <path d="M44 38c0-16 12-26 30-26h8c8 0 12 6 12 12v40H52c-6 0-8-8-8-26Z" fill={cream} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
      <path d="M54 48h22" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <circle cx="168" cy="36" r="10" fill={gold} stroke={stroke} strokeWidth="4" />
      <path d="M160 42l-16 22" stroke={gold} strokeWidth="5" strokeLinecap="round" />
      <path d="M28 86c-10 2-16 12-8 20" stroke={blush} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function MiniOdontogramBanner({ className }: { className?: string }) {
  const tooth =
    'M12 4c5 0 8 3.6 8 8 0 2.8-.8 5.6-1.6 8.4C17.6 23 17 25.4 17 26.6c0 2.4-1.6 4.4-4 4.4-1.6 0-2.8-1.2-3.6-2.8-.6 1.4-1.8 2.4-3.2 2.6-2.4.4-4.4-1.6-4.4-4.2 0-1.2.4-3.4 1-6.2.6-2.8 1-5.4 1-8.4C4 7.6 6.4 4 12 4Z';
  return (
    <svg className={className} viewBox="0 0 280 48" fill="none" aria-hidden>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i} transform={`translate(${8 + i * 34} 6) scale(0.85)`}>
          <path d={tooth} fill={i === 2 || i === 5 ? purple : cream} stroke={stroke} strokeWidth="2.4" />
        </g>
      ))}
    </svg>
  );
}

const GLYPHS = {
  tooth: ToothGlyph,
  chair: ChairGlyph,
  chart: OdontogramGlyph,
  book: BookGlyph,
  explorer: ExplorerGlyph,
  check: CheckMolarGlyph,
} as const;

export type GlyphName = keyof typeof GLYPHS;

export function ClinicGlyph({ name, size = 36 }: { name: GlyphName; size?: number }) {
  const Cmp = GLYPHS[name];
  return <Cmp size={size} />;
}
