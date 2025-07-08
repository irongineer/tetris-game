export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  position: Position;
  color: string;
}

export interface GameState {
  board: number[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const TETROMINO_SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

export const TETROMINO_COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
};

// セル状態の定数化 - マジックナンバー排除
export const CELL_TYPES = {
  EMPTY: 0,
  PLACED: 1,
  CURRENT_PIECE: 2,
} as const;

export type CellType = (typeof CELL_TYPES)[keyof typeof CELL_TYPES];

// ランダム生成の抽象化インターface
export interface RandomGenerator {
  (): number;
}

// ゲーム設定の型定義
export interface TetrisConfig {
  randomGenerator?: RandomGenerator;
  dropSpeedBase?: number;
  dropSpeedDecrement?: number;
  linesPerLevel?: number;
}
