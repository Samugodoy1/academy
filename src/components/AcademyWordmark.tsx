import React from 'react';

export function AcademyWordmark({
  size = 'md',
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
    <p className={`${scale} font-semibold tracking-[-0.025em] leading-[1.05] text-sys-text`}>
      OdontoHub
      <span className="ml-1.5 font-normal">Academy</span>
    </p>
  );
}
