import React from 'react';

interface BadgeProps {
  status: 'safe' | 'warning' | 'critical' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  children,
  className = ''
}) => {
  let themeStyle = "";

  if (status === 'safe') {
    themeStyle = "bg-[#00A699]/10 text-[#00A699]";
  } else if (status === 'warning') {
    themeStyle = "bg-[#FFB400]/10 text-[#D49500]";
  } else if (status === 'critical') {
    themeStyle = "bg-[#C13515]/10 text-[#C13515]";
  } else if (status === 'info') {
    themeStyle = "bg-[#428BCA]/10 text-[#428BCA]";
  } else {
    themeStyle = "bg-neutral-100 text-neutral-600";
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide tabular-nums uppercase ${themeStyle} ${className}`}>
      {children}
    </span>
  );
};
