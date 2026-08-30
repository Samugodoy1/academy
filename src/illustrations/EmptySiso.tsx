import React from 'react';
import { Siso, type SisoMood } from './Siso';
import { SpeechBubble } from './SpeechBubble';
import { DuoButton } from '../components/DuoButton';

interface EmptySisoProps {
  mood?: SisoMood;
  title: React.ReactNode;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  size?: number;
}

export function EmptySiso({
  mood = 'think',
  title,
  body,
  actionLabel,
  onAction,
  size = 140,
}: EmptySisoProps) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      <Siso mood={mood} size={size} />
      <div className="mt-4 w-full max-w-[340px]">
        <SpeechBubble>
          <span className="block text-[18px] leading-snug">{title}</span>
        </SpeechBubble>
      </div>
      {body && (
        <p className="mt-4 max-w-sm text-[14px] font-semibold leading-snug text-academy-muted">
          {body}
        </p>
      )}
      {onAction && actionLabel && (
        <DuoButton className="mt-6 max-w-xs" onClick={onAction}>
          {actionLabel}
        </DuoButton>
      )}
    </div>
  );
}
