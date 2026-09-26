import React from 'react';
import { ACADEMY_NEO_COLORWAYS, type AcademyNeoId } from '../theme/academyNeo';
import { useAcademyNeo } from '../theme/AcademyNeoProvider';

const PICKER_ORDER: AcademyNeoId[] = [
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
  'brown',
];

export function AcademyNeoPicker() {
  const { enabled, colorwayId, setColorwayId } = useAcademyNeo();
  if (!enabled) return null;

  const colorways = PICKER_ORDER.map(id => ACADEMY_NEO_COLORWAYS.find(colorway => colorway.id === id)).filter(
    (colorway): colorway is (typeof ACADEMY_NEO_COLORWAYS)[number] => Boolean(colorway),
  );

  return (
    <div className="rounded-[14px] bg-white px-4 py-3 shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)]">
      <p className="text-[15px] tracking-[-0.011em] text-[var(--neo-ink)]">Cor</p>
      <div className="mt-3 grid grid-cols-4 gap-x-2 gap-y-3 min-[420px]:grid-cols-8">
        {colorways.map(colorway => {
          const isSelected = colorway.id === colorwayId;
          return (
            <button
              key={colorway.id}
              type="button"
              onClick={() => setColorwayId(colorway.id)}
              aria-label={colorway.label}
              aria-pressed={isSelected}
              className="flex min-w-0 flex-col items-center"
            >
              <span
                className="block h-[26px] w-[26px] rounded-full"
                style={{
                  background: colorway.neo,
                  boxShadow: isSelected
                    ? 'inset 0 0 0 0.5px rgba(0,0,0,0.12), 0 0 0 2px #ffffff, 0 0 0 3.5px rgba(0,0,0,0.28)'
                    : 'inset 0 0 0 0.5px rgba(0,0,0,0.12)',
                }}
              />
              <span className={`mt-1 max-w-full truncate text-center text-[11px] leading-none tracking-[-0.01em] text-[var(--neo-gray)] ${
                isSelected ? '' : 'invisible'
              }`}>
                {colorway.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
