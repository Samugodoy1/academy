import React from 'react';
import { SYSTEM_THEMES, useSystemTheme, type SystemThemeId } from '../theme/systemTheme';

function ThemePreview({ id }: { id: SystemThemeId }) {
  if (id === 'auto') {
    return (
      <span className="relative block h-16 overflow-hidden rounded-[16px]">
        <span className="absolute inset-y-0 left-0 w-1/2 bg-[#f5f5f7]" />
        <span className="absolute inset-y-0 right-0 w-1/2 bg-black" />
        <span className="absolute left-2 top-2 h-3 w-7 rounded-full bg-white" />
        <span className="absolute right-2 top-2 h-3 w-7 rounded-full bg-[#1d1d1f]" />
        <span className="absolute bottom-2 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-[#0071e3]" />
      </span>
    );
  }

  const dark = id === 'dark';
  return (
    <span
      className="relative block h-16 overflow-hidden rounded-[16px]"
      style={{ background: dark ? '#000000' : '#f5f5f7' }}
    >
      <span
        className="absolute left-2 top-2 h-3 w-8 rounded-full"
        style={{ background: dark ? '#1d1d1f' : '#ffffff' }}
      />
      <span
        className="absolute bottom-2 left-2 right-2 h-2 rounded-full"
        style={{ background: '#0071e3' }}
      />
    </span>
  );
}

export function SystemThemePicker() {
  const { themeId, setThemeId } = useSystemTheme();

  return (
    <div className="oh-device p-6 space-y-4">
      <div>
        <h3 className="text-[13px] font-normal text-sys-muted">Tema do sistema</h3>
        <p className="mt-1 text-[17px] text-sys-text tracking-[-0.011em]">
          Escolha o tema que o sistema usa.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 pt-1">
        {SYSTEM_THEMES.map(theme => {
          const selected = theme.id === themeId;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setThemeId(theme.id)}
              aria-pressed={selected}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`w-full rounded-[18px] p-0.5 ${
                  selected ? 'ring-2 ring-apple-blue' : 'ring-1 ring-sys-hairline'
                }`}
              >
                <ThemePreview id={theme.id} />
              </span>
              <span className={`text-[13px] ${selected ? 'text-sys-text' : 'text-sys-muted'}`}>
                {theme.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
