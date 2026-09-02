import React from 'react';
import { DuoButton } from './DuoButton';

interface QuietEmptyProps {
  title: React.ReactNode;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function QuietEmpty({ title, body, actionLabel, onAction }: QuietEmptyProps) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <p className="text-[28px] font-semibold text-white tracking-[-0.025em] leading-[1.05] max-w-md">
        {title}
      </p>
      {body && (
        <p className="mt-3 max-w-sm text-[17px] font-normal leading-snug text-[#86868b] tracking-[-0.011em]">
          {body}
        </p>
      )}
      {onAction && actionLabel && (
        <DuoButton className="mt-8 max-w-xs" onClick={onAction}>
          {actionLabel}
        </DuoButton>
      )}
    </div>
  );
}
