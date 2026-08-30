import React from 'react';

interface SpeechBubbleProps {
  children: React.ReactNode;
  from?: 'left' | 'right';
  className?: string;
}

export function SpeechBubble({ children, from = 'left', className }: SpeechBubbleProps) {
  return (
    <div className={`relative ${className || ''}`}>
      <div className="siso-bubble font-display text-[17px] sm:text-[19px] font-extrabold leading-snug text-academy-text">
        {children}
      </div>
      <span
        className={`absolute -bottom-2 ${from === 'left' ? 'left-7' : 'right-7'} w-4 h-4 bg-white border-b-[3px] border-r-[3px] border-[#3B0459] rotate-45`}
      />
    </div>
  );
}
