import React from 'react';

interface DataLoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export const DataLoadingSkeleton: React.FC<DataLoadingSkeletonProps> = ({
  rows = 4,
  className = '',
}) => (
  <div className={`bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] overflow-hidden ${className}`}>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-start gap-4 p-5 animate-pulse">
          <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
            <div className="h-3 bg-slate-50 rounded-lg w-1/2" />
            <div className="h-8 bg-slate-50 rounded-full w-28" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
