import React from 'react';
import { ArrowUpRight, ChevronRight, Lock } from '../../../icons';
import type { BaseReference } from '../types';
import { referenceHref } from '../references';

export const BaseSection: React.FC<{
  kicker: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ kicker, action, children }) => {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="ac-section-title">{kicker}</h2>
        {action}
      </div>
      {children}
    </section>
  );
};

export function GroupedList({ children }: { children: React.ReactNode }) {
  return <div className="ac-group">{children}</div>;
}

export const ListRow: React.FC<{
  title: string;
  meta?: string;
  trailing?: React.ReactNode;
  locked?: boolean;
  done?: boolean;
  onClick: () => void;
}> = ({ title, meta, trailing, locked = false, done = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ac-row"
    >
      <div className="min-w-0 flex-1">
        <p className={`ac-row-title truncate ${locked ? 'text-[var(--neo-gray)]' : ''}`}>
          {title}
        </p>
        {meta && <p className="ac-row-meta truncate">{meta}</p>}
      </div>
      {trailing}
      {done && !locked && (
        <span className="shrink-0 rounded-full bg-[var(--neo-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--neo)]">
          Lido
        </span>
      )}
      {locked ? (
        <Lock size={15} className="shrink-0 text-[#C6C6C8]" />
      ) : (
        <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
      )}
    </button>
  );
};

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-black/[0.06] ${className}`}>
      <span className="block h-full rounded-full bg-[var(--neo)] transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ReferenceList({
  references,
  numbered = true,
}: {
  references: BaseReference[];
  numbered?: boolean;
}) {
  return (
    <GroupedList>
      {references.map((reference, index) => {
        const href = referenceHref(reference);
        const body = (
          <>
            <div className="flex items-start gap-3">
              {numbered && (
                <span className="mt-0.5 w-5 shrink-0 text-[13px] tabular-nums text-[var(--neo)]">{index + 1}</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">
                  {reference.title}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-[var(--neo-gray)]">
                  {reference.authors}. <span className="italic">{reference.journal}</span>, {reference.year}.
                  {reference.doi ? ` doi:${reference.doi}` : ''}
                </p>
                <p className="mt-2 text-[13px] leading-snug text-[var(--neo-ink)]">{reference.why}</p>
                {href && (
                  <span className="neo-link mt-2 inline-flex items-center gap-1 text-[13px]">
                    {reference.doi ? 'Abrir pelo DOI' : 'Abrir fonte'} <ArrowUpRight size={12} />
                  </span>
                )}
              </div>
            </div>
          </>
        );
        const className = 'ac-row block';
        return href ? (
          <a key={reference.id} href={href} target="_blank" rel="noreferrer" className={className}>
            {body}
          </a>
        ) : (
          <div key={reference.id} className={className}>
            {body}
          </div>
        );
      })}
    </GroupedList>
  );
}

export function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="neo-link text-[15px]">
      ‹ {label}
    </button>
  );
}
