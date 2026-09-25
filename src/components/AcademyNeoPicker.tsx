import React from 'react';
import { ACADEMY_NEO_COLORWAYS } from '../theme/academyNeo';
import { useAcademyNeo } from '../theme/AcademyNeoProvider';

export function AcademyNeoPicker() {
  const { enabled, colorwayId, setColorwayId } = useAcademyNeo();
  if (!enabled) return null;

  return (
    <div className="rounded-[24px] bg-[#f5f5f7] p-5 space-y-4">
      <div>
        <h3 className="text-[13px] font-normal tracking-[-0.011em] text-[var(--neo-gray)]">A sua cor</h3>
        <p className="mt-1 text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
          Ela pinta o box, os widgets e os detalhes da conta.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-1">
        {ACADEMY_NEO_COLORWAYS.map(colorway => {
          const isSelected = colorway.id === colorwayId;
          return (
            <button
              key={colorway.id}
              type="button"
              onClick={() => setColorwayId(colorway.id)}
              aria-label={colorway.label}
              aria-pressed={isSelected}
              className="flex items-center justify-center rounded-full"
              style={{
                width: 40,
                height: 40,
                boxShadow: isSelected ? `0 0 0 2px ${colorway.neo}` : undefined,
              }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  background: colorway.neo,
                  boxShadow: isSelected ? 'inset 0 0 0 2px #ffffff' : 'none',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
