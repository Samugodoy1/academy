import React from 'react';
import { ClinicGlyph, type GlyphName } from './glyphs';

interface PathNodeProps {
  done?: boolean;
  active?: boolean;
  locked?: boolean;
  label: string;
  hint?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  glyph?: GlyphName;
}

export function PathNode({
  done,
  active,
  locked,
  label,
  hint,
  onClick,
  icon,
  glyph = 'tooth',
}: PathNodeProps) {
  const clickable = Boolean(onClick) && !locked;

  return (
    <div className="flex flex-col items-center text-center max-w-[150px]">
      <button
        type="button"
        disabled={!clickable}
        onClick={onClick}
        className={`relative w-[88px] h-[88px] rounded-full flex items-center justify-center transition-transform
          ${done || (active && !done) ? 'duo-btn duo-btn-active text-white' : ''}
          ${active && !done ? 'siso-pulse' : ''}
          ${locked ? 'bg-[#E5E5EA] border-4 border-[#D1D1D6] cursor-not-allowed' : ''}
          ${!done && !active && !locked ? 'duo-btn text-primary' : ''}
        `}
        aria-label={label}
      >
        {done ? (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5l5 5L19 7" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className={locked ? 'opacity-40 grayscale' : ''}>
            {icon || <ClinicGlyph name={glyph} size={40} />}
          </span>
        )}
        {active && !done && (
          <span className="absolute -inset-2 rounded-full border-[3px] border-primary/25 pointer-events-none" />
        )}
      </button>
      <p
        className={`mt-2.5 font-display font-extrabold uppercase tracking-[0.1em] text-[12px] ${
          locked ? 'text-academy-muted/50' : 'text-academy-text'
        }`}
      >
        {label}
      </p>
      {hint && <p className="text-[12px] text-academy-muted mt-0.5 leading-snug">{hint}</p>}
    </div>
  );
}

export function PathStem({ dimmed }: { dimmed?: boolean }) {
  return (
    <div className={`w-1.5 h-11 rounded-full mx-auto ${dimmed ? 'bg-[#E5E5EA]' : 'bg-primary'}`} />
  );
}
