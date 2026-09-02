import React from 'react';
import { ACADEMY_COLORS, useAcademyColor } from '../theme/academyColor';

export function AcademyColorPicker() {
  const { colorId, setColorId } = useAcademyColor();

  return (
    <div className="oh-device p-6 space-y-4">
      <div>
        <h3 className="text-[13px] font-normal text-[#86868b]">Cor do Academy</h3>
        <p className="mt-1 text-[17px] text-white tracking-[-0.011em]">
          Escolha a cor da palavra Academy.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 pt-1">
        {ACADEMY_COLORS.map(color => {
          const selected = color.id === colorId;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => setColorId(color.id)}
              title={color.label}
              aria-label={color.label}
              aria-pressed={selected}
              className="flex flex-col items-center gap-1.5 min-w-[56px]"
            >
              <span
                className={`w-9 h-9 rounded-full transition-transform ${
                  selected ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#1d1d1f]' : ''
                }`}
                style={{ background: color.hex }}
              />
              <span className={`text-[11px] ${selected ? 'text-white' : 'text-[#86868b]'}`}>
                {color.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
