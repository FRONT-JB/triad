export interface Comment {
  id: number;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp?: number;
}

export interface User {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

export interface CursorPosition {
  x: number;
  y: number;
  userId: string;
}