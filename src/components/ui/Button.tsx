import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold text-sm rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 active:scale-97 disabled:opacity-40 disabled:cursor-not-allowed select-none";
  
  let variantStyle = "";
  if (variant === 'primary') {
    variantStyle = "bg-[#FF385C] hover:bg-[#E31C5F] text-white px-5 py-2.5 shadow-sm";
  } else if (variant === 'secondary') {
    variantStyle = "bg-white border border-[#DDDDDD] text-[#222222] hover:border-[#222222] px-5 py-2.5";
  } else if (variant === 'ghost') {
    variantStyle = "bg-transparent text-[#222222] hover:bg-[#F7F7F7] px-4 py-2";
  } else if (variant === 'icon') {
    variantStyle = "h-10 w-10 p-0 text-[#222222] hover:bg-[#F7F7F7] border border-[#DDDDDD] rounded-full";
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

