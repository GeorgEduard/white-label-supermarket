'use client';
import React, { forwardRef } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'danger' | 'neutral';
export type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-cyan-700 text-white shadow-sm hover:bg-cyan-800 focus:ring-2 focus:ring-cyan-500/60',
  danger:
    'text-red-600 border border-transparent hover:bg-red-50 focus:ring-2 focus:ring-red-500/50',
  neutral:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-2 focus:ring-slate-400/60',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'neutral', size = 'md', fullWidth, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export default Button;
