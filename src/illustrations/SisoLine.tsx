import React from 'react';
import { Siso, type SisoMood } from './Siso';
import { SpeechBubble } from './SpeechBubble';

interface SisoLineProps {
  mood?: SisoMood;
  children: React.ReactNode;
  size?: number;
  align?: 'start' | 'center';
}

export function SisoLine({ mood = 'idle', children, size = 132, align = 'start' }: SisoLineProps) {
  return (
    <div className={`flex items-end gap-3 sm:gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
      <Siso mood={mood} size={size} className="shrink-0" />
      <div className="pb-8 min-w-0 flex-1 max-w-md">
        <SpeechBubble>{children}</SpeechBubble>
      </div>
    </div>
  );
}
