import React from 'react';

interface SpeechBubbleProps {
  children: React.ReactNode;
  from?: 'left' | 'right';
  className?: string;
}

export function SpeechBubble({ children, from = 'left', className }: SpeechBubbleProps) {
  return (
    <div className={`relative ${className || ''}`}>
      <div className="siso-bubble text-[17px] leading-snug text-apple-ink font-normal tracking-[-0.011em]">
        {children}
      </div>
      <span
        className={`absolute -bottom-1.5 ${from === 'left' ? 'left-7' : 'right-7'} w-3 h-3 bg-apple-surface rotate-45`}
      />
    </div>
  );
}
