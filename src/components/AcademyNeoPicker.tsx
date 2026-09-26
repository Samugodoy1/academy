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
    <div className="flex items-start justify-between gap-4 rounded-[14px] bg-white px-4 py-3 shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)]">
      <p className="pt-1.5 text-[15px] tracking-[-0.011em] text-[var(--neo-ink)]">Cor</p>
      <div className="flex items-start gap-2.5">
        {colorways.map(colorway => {
          const isSelected = colorway.id === colorwayId;
          return (
            <button
              key={colorway.id}
              type="button"
              onClick={() => setColorwayId(colorway.id)}
              aria-label={colorway.label}
              aria-pressed={isSelected}
              className="flex w-8 flex-col items-center"
            >
              <span
                className="block h-[26px] w-[26px] rounded-full"
                style={{
                  background: colorway.neo,
                  boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)',
                }}
              />
              <span
                className={`mt-1 whitespace-nowrap text-[11px] leading-none tracking-[-0.01em] text-[var(--neo-gray)] ${
                  isSelected ? '' : 'invisible'
                }`}
              >
                {colorway.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
