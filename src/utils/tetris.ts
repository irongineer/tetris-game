import {
  Tetromino,
  TetrominoType,
  Position,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
} from '@/types/tetris';

export const createEmptyBoard = (): number[][] => {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(0));
};

export const getRandomTetromino = (): Tetromino => {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const randomType = types[Math.floor(Math.random() * types.length)];

  return {
    type: randomType,
    shape: TETROMINO_SHAPES[randomType],
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    color: TETROMINO_COLORS[randomType],
  };
};

export const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  const rotatedShape = tetromino.shape[0].map((_, index) =>
    tetromino.shape.map(row => row[index]).reverse()
  );

  return {
    ...tetromino,
    shape: rotatedShape,
  };
};

export const isValidPosition = (
  board: number[][],
  tetromino: Tetromino,
  newPosition: Position
): boolean => {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x] !== 0) {
        const newX = newPosition.x + x;
        const newY = newPosition.y + y;

        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placeTetromino = (
  board: number[][],
  tetromino: Tetromino
): number[][] => {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x] !== 0) {
        const boardY = tetromino.position.y + y;
        const boardX = tetromino.position.x + x;

        if (
          boardY >= 0 &&
          boardY < BOARD_HEIGHT &&
          boardX >= 0 &&
          boardX < BOARD_WIDTH
        ) {
          newBoard[boardY][boardX] = 1;
        }
      }
    }
  }

  return newBoard;
};

export const clearLines = (
  board: number[][]
): { newBoard: number[][]; linesCleared: number } => {
  const newBoard = board.filter(row => !row.every(cell => cell !== 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }

  return { newBoard, linesCleared };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
};

export const calculateLevel = (lines: number): number => {
  return Math.floor(lines / 10);
};

export const getDropSpeed = (level: number): number => {
  return Math.max(50, 1000 - level * 50);
};

export const isGameOver = (board: number[][], newPiece: Tetromino): boolean => {
  return !isValidPosition(board, newPiece, newPiece.position);
};
