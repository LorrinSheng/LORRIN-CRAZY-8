export type GameMode = 'classic' | 'time';

export interface Block {
  id: string;
  value: number;
  row: number;
  col: number;
  isRemoved?: boolean; // For animation
}

export interface GameState {
  grid: Block[];
  targetNumber: number;
  score: number;
  status: 'menu' | 'playing' | 'gameover';
  mode: GameMode;
  selectedBlockIds: string[];
  timeLeft: number; // For time mode
  level: number;
}

export const COLS = 5;
export const ROWS = 8; // Visible rows, but grid can go higher logically (game over if > ROWS)
export const BLOCK_SIZE = 60; // Base size for calculations
