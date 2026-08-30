import React from 'react';

/** Chunky tooth mark — the Academy equivalent of Duolingo's owl. */
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
        d="M24 9c5.8 0 10.2 3.6 10.2 9.2 0 2.4-.5 4.6-1.2 6.8-.8 2.6-1.3 5.2-1.3 7.2 0 2.4-1.6 4.3-3.8 4.3-1.5 0-2.6-.8-3.2-1.8-.4.7-1 1.3-1.7 1.6-.7.4-1.6.5-2.5.2-1.6-.5-2.6-2-2.6-3.8 0-1.4.3-3.2.7-5.1.4-1.8.7-3.7.7-5.4C19.3 13.4 20.8 9 24 9Z"
        fill="#FFF8F2"
      />
      <path
        d="M24 11.2c4.6 0 8 2.8 8 7 0 2.2-.5 4.3-1.1 6.4-.7 2.4-1.2 4.8-1.2 6.6 0 1.5-.9 2.6-2.2 2.6-.8 0-1.4-.4-1.7-1.1-.5 1.2-1.6 2-2.9 1.6-.9-.3-1.4-1.2-1.4-2.3 0-1.3.3-3 .7-4.8.4-1.9.7-3.9.7-5.6 0-5.4 1-10.4 4.1-10.4Z"
        fill="#FFFFFF"
      />
      <circle cx="21.2" cy="20.4" r="1.35" fill="#3B0459" />
      <circle cx="26.8" cy="20.4" r="1.35" fill="#3B0459" />
      <path
        d="M22.2 24.1c.6.7 1.3 1.1 1.8 1.1s1.2-.4 1.8-1.1"
        stroke="#3B0459"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
