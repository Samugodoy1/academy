import React from 'react';

export function AcademyWordmark({
  size = 'md',
  invert = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  invert?: boolean;
}) {
  const scale =
    size === 'lg'
      ? 'text-[28px]'
      : size === 'sm'
        ? 'text-[15px]'
        : 'text-[17px]';

  return (
    <p className={`${scale} font-semibold tracking-[-0.025em] leading-[1.05] ${invert ? 'text-white' : 'text-apple-ink'}`}>
      OdontoHub
      <span className="ml-1.5 font-normal" style={{ color: 'var(--academy-accent)' }}>
        Academy
      </span>
    </p>
  );
}
