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
        className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-colors
          ${done ? 'bg-apple-ink text-white' : ''}
          ${active && !done ? 'bg-apple-blue text-white' : ''}
          ${locked ? 'bg-apple-surface text-apple-gray cursor-not-allowed' : ''}
          ${!done && !active && !locked ? 'bg-apple-surface text-apple-ink' : ''}
        `}
        aria-label={label}
      >
        {done ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5l5 5L19 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className={locked ? 'opacity-40' : ''}>
            {icon || <ClinicGlyph name={glyph} size={32} />}
          </span>
        )}
      </button>
      <p
        className={`mt-2.5 text-[13px] font-normal tracking-[-0.011em] ${
          locked ? 'text-sys-muted/50' : 'text-sys-text'
        }`}
      >
        {label}
      </p>
      {hint && <p className="text-[13px] text-apple-gray mt-0.5 leading-snug">{hint}</p>}
    </div>
  );
}

export function PathStem({ dimmed }: { dimmed?: boolean }) {
  return (
    <div className={`w-px h-10 mx-auto ${dimmed ? 'bg-apple-line' : 'bg-apple-ink'}`} />
  );
}
