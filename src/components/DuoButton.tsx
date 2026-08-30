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
      ? 'duo-btn-active text-white'
      : variant === 'danger'
        ? 'bg-[#E11D48] border-[#9F1239] text-white'
        : 'duo-btn text-primary';

  return (
    <button
      type={type}
      className={`duo-btn ${tone} rounded-[16px] px-6 py-3.5 font-display font-extrabold uppercase tracking-[0.12em] text-[15px] disabled:opacity-50 disabled:pointer-events-none ${
        wide ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
