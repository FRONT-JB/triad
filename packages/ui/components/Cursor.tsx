import React from 'react';
import { User } from '@triad/shared';

interface CursorProps {
  user: User;
  x: number;
  y: number;
  visible?: boolean;
  className?: string;
}

export const Cursor: React.FC<CursorProps> = ({
  user,
  x,
  y,
  visible = true,
  className = ''
}) => {
  if (!visible) return null;

  const classes = `absolute pointer-events-none transition-all duration-100 ease-out ${className}`;

  return (
    <div
      className={classes}
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div 
        className="w-5 h-5 rounded-full shadow-lg"
        style={{ backgroundColor: user.color }}
      />
      <div 
        className="absolute top-6 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap shadow-lg"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </div>
    </div>
  );
};