import React from 'react';

interface FloatingBarProps {
  children: React.ReactNode;
  position?: 'bottom' | 'top';
  className?: string;
}

export const FloatingBar: React.FC<FloatingBarProps> = ({
  children,
  position = 'bottom',
  className = ''
}) => {
  const positionClasses = {
    bottom: 'bottom-5 left-1/2 transform -translate-x-1/2',
    top: 'top-5 left-1/2 transform -translate-x-1/2'
  };

  const classes = `fixed ${positionClasses[position]} bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl border border-white border-opacity-10 pointer-events-auto z-50 ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};