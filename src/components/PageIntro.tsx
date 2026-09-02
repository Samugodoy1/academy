import React from 'react';

interface PageIntroProps {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function PageIntro({ kicker, title, subtitle }: PageIntroProps) {
  return (
    <header className="min-w-0">
      {kicker && (
        <p className="text-[13px] font-normal text-[#86868b] mb-1 tracking-[-0.011em]">
          {kicker}
        </p>
      )}
      <h1 className="text-[34px] font-semibold text-white tracking-[-0.025em] leading-[1.05]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[17px] font-normal text-[#86868b] leading-snug tracking-[-0.011em]">
          {subtitle}
        </p>
      )}
    </header>
  );
}
