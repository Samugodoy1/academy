import React from 'react';

/** Quiet product mark: ink tile, no mascot chrome. */
export function AcademyMark({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="48" height="48" rx="12" fill="#1d1d1f" />
      <path
        d="M24 10c7.2 0 12 5 12 11.4 0 2.9-.9 5.8-1.8 8.5-1 3-1.5 5.8-1.5 7.5 0 2.8-2.1 5.1-5 5.1-1.7 0-3-.9-3.8-2.2-.5 1-1.5 1.8-2.6 2.1-1.9.6-3.7-.6-3.7-2.7 0-1.4.5-3.5 1-5.8.5-2.2.8-4.3.8-6.1C19.4 15 20.6 10 24 10Z"
        fill="#f5f5f7"
      />
    </svg>
  );
}
