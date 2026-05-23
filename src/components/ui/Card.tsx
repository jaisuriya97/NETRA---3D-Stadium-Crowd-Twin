import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  interactive = false,
  onClick,
  id
}) => {
  const restingStyle = "bg-white border border-[#DDDDDD] rounded-xl p-6 transition-all duration-300";
  const hoverStyle = interactive ? "hover:shadow-md hover:border-[#B0B0B0] cursor-pointer" : "";

  return (
    <motion.div
      id={id}
      onClick={onClick}
      whileHover={interactive ? { y: -2 } : {}}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`${restingStyle} ${hoverStyle} ${className}`}
    >
      {children}
    </motion.div>
  );
};
