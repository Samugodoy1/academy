import React from 'react';

interface DuoButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  wide?: boolean;
  className?: string;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export function DuoButton({
  variant = 'primary',
  wide = true,
  className = '',
  children,
  type = 'button',
  ...props
}: DuoButtonProps) {
  const tone =
    variant === 'primary'
      ? 'apple-btn'
      : variant === 'danger'
        ? 'bg-[#ff3b30] hover:bg-[#ff453a] text-white rounded-[980px] px-[22px] py-3 text-[17px] font-normal tracking-[-0.022em]'
        : 'apple-btn-light';

  return (
    <button
      type={type}
      className={`${tone} disabled:opacity-50 disabled:pointer-events-none ${
        wide ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
