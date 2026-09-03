import React from 'react';
import { ACADEMY_NEO_COLORWAYS } from '../theme/academyNeo';
import { useAcademyNeo } from '../theme/AcademyNeoProvider';

interface AcademyNeoPickerProps {
  compact?: boolean;
}

export function AcademyNeoPicker({ compact = false }: AcademyNeoPickerProps) {
  const { enabled, colorwayId, setColorwayId } = useAcademyNeo();
  if (!enabled) return null;

  const selected = ACADEMY_NEO_COLORWAYS.find(item => item.id === colorwayId) || ACADEMY_NEO_COLORWAYS[0];

  return (
    <div className={compact ? '' : 'neo-card p-6 space-y-4'}>
      {!compact && (
        <div>
          <h3 className="text-[13px] font-normal text-[var(--neo-gray)]">A sua cor</h3>
          <p className="mt-1 text-[17px] text-[var(--neo-ink)] tracking-[-0.011em]">
            O app inteiro muda com ela.
          </p>
        </div>
      )}
      <div className={`flex items-center ${compact ? 'justify-center gap-2.5' : 'gap-3 pt-1'}`}>
        {ACADEMY_NEO_COLORWAYS.map(colorway => {
          const isSelected = colorway.id === colorwayId;
          return (
            <button
              key={colorway.id}
              type="button"
              onClick={() => setColorwayId(colorway.id)}
              aria-label={colorway.label}
              aria-pressed={isSelected}
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={isSelected ? { boxShadow: `0 0 0 2px ${colorway.neo}` } : undefined}
            >
              <span
                className="block h-7 w-7 rounded-full"
                style={{
                  background: colorway.neo,
                  boxShadow: isSelected ? 'inset 0 0 0 2px #ffffff' : 'none',
                }}
              />
            </button>
          );
        })}
      </div>
      {compact && (
        <p className="mt-2 text-center text-[12px] text-[var(--neo-gray)]">{selected.label}</p>
      )}
    </div>
  );
}
