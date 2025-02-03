import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]';
  
  const variants = {
    primary: 'bg-[#0077B5] text-white hover:bg-[#005885]',
    secondary: 'bg-white text-[#0077B5] border-2 border-[#0077B5] hover:bg-[#0077B5] hover:text-white',
    outline: 'bg-transparent text-[#0077B5] border border-[#0077B5] hover:bg-[#0077B5] hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};