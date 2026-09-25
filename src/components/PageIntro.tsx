import React from 'react';

interface PageIntroProps {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function PageIntro({ kicker, title, subtitle }: PageIntroProps) {
  return (
    <header className="min-w-0">
      {kicker && <p className="ac-caption mb-1">{kicker}</p>}
      <h1 className="apple-display-ink text-[34px]">{title}</h1>
      {subtitle && (
        <p className="mt-2 max-w-[42ch] text-[17px] font-normal leading-snug tracking-[-0.022em] text-sys-muted">
          {subtitle}
        </p>
      )}
    </header>
  );
}
