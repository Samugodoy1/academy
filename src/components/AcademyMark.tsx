import React from 'react';

/** App icon: Siso's face on the brand tile. */
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
      <rect width="48" height="48" rx="16" fill="#52057B" />
      <path
        d="M24 8c8.8 0 15 6.2 15 14.2 0 3.6-1.1 7.2-2.2 10.6-1.2 3.8-1.8 7.2-1.8 9.4 0 3.6-2.6 6.4-6.2 6.4-2.2 0-3.8-1.2-4.8-2.8-.6 1.2-1.8 2.2-3.2 2.6-2.4.8-4.6-.8-4.6-3.4 0-1.8.6-4.4 1.2-7.2.6-2.8 1-5.4 1-7.6C18.4 14.2 19.8 8 24 8Z"
        fill="#FFF6EC"
        stroke="#3B0459"
        strokeWidth="1.6"
      />
      <ellipse cx="19.2" cy="23" rx="2.4" ry="1.5" fill="#F5A7C0" />
      <ellipse cx="28.8" cy="23" rx="2.4" ry="1.5" fill="#F5A7C0" />
      <circle cx="19.6" cy="21.2" r="1.7" fill="#3B0459" />
      <circle cx="28.4" cy="21.2" r="1.7" fill="#3B0459" />
      <circle cx="20.1" cy="20.6" r=".5" fill="#FFF6EC" />
      <circle cx="28.9" cy="20.6" r=".5" fill="#FFF6EC" />
      <path d="M20.6 26.2c1.6 2.4 5.2 2.4 6.8 0" stroke="#3B0459" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
