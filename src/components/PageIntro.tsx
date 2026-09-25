import React from 'react';

interface PageIntroProps {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function PageIntro({ kicker, title, subtitle }: PageIntroProps) {
  return (
    <header className="min-w-0">
      {kicker && <p className="ac-voice mb-2">{kicker}</p>}
      <h1 className="ac-title text-[34px]">{title}</h1>
      {subtitle && (
        <p className="ac-support mt-2 max-w-[36ch]">
          {subtitle}
        </p>
      )}
    </header>
  );
}
