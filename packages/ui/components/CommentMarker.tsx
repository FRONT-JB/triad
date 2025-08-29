import React from 'react';
import { Comment } from '@triad/shared';

interface CommentMarkerProps {
  comment: Comment;
  onClick?: (comment: Comment, event: React.MouseEvent) => void;
  className?: string;
}

export const CommentMarker: React.FC<CommentMarkerProps> = ({
  comment,
  onClick,
  className = ''
}) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick?.(comment, event);
  };

  const classes = `absolute w-6 h-6 bg-orange-500 border-2 border-white rounded-full cursor-pointer shadow-lg flex items-center justify-center text-xs text-white font-bold pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform ${className}`;

  return (
    <div
      className={classes}
      style={{ left: comment.x, top: comment.y }}
      onClick={handleClick}
      title={comment.text}
    >
      💬
    </div>
  );
};