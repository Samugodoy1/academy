import React from 'react';

interface StudentMarkProps {
  active: boolean;
  onSubscribe?: () => void;
  className?: string;
}

export function StudentMark({ active, onSubscribe, className = '' }: StudentMarkProps) {
  return (
    <button
      type="button"
      onClick={onSubscribe}
      className={`student-pill ${active ? 'student-pill-on' : ''} ${className}`}
      aria-label={active ? 'Student ativo. Ver o plano' : 'Assinar o Student'}
    >
      <span className={active ? 'student-mark-dot' : 'student-mark-offer'} aria-hidden="true">
        {active ? '' : '+'}
      </span>
      <span>{active ? 'Student' : 'Assinar'}</span>
    </button>
  );
}
