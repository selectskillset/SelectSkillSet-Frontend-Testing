import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  animate = true,
}) => {
  const Component = animate ? motion.div : 'div';

  return (
    <Component
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300',
        className
      )}
    >
      {children}
    </Component>
  );
};