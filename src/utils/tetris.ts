import { TetrisEngine } from '@/engine/TetrisEngine';
import { Tetromino, Position, GameState } from '@/types/tetris';

/**
 * 既存APIとの互換性を保つためのユーティリティ関数
 * 内部的にはTetrisEngineに委譲
 *
 * t-wada思想: 既存のテストを壊さずに段階的にリファクタリング
 */

// デフォルトエンジンインスタンス（互換性のため）
const defaultEngine = new TetrisEngine();

export const createEmptyBoard = (): number[][] => {
  return defaultEngine.createEmptyBoard();
};

export const getRandomTetromino = (): Tetromino => {
  return defaultEngine.getRandomTetromino();
};

export const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  return defaultEngine.rotateTetromino(tetromino);
};

export const isValidPosition = (
  board: number[][],
  tetromino: Tetromino,
  newPosition: Position
): boolean => {
  return defaultEngine.isValidPosition(board, tetromino, newPosition);
};

export const placeTetromino = (
  board: number[][],
  tetromino: Tetromino
): number[][] => {
  return defaultEngine.placeTetromino(board, tetromino);
};

export const clearLines = (
  board: number[][]
): { newBoard: number[][]; linesCleared: number } => {
  return defaultEngine.clearLines(board);
};

export const calculateScore = (linesCleared: number, level: number): number => {
  return defaultEngine.calculateScore(linesCleared, level);
};

export const calculateLevel = (lines: number): number => {
  return defaultEngine.calculateLevel(lines);
};

export const getDropSpeed = (level: number): number => {
  return defaultEngine.getDropSpeed(level);
};

export const isGameOver = (board: number[][], newPiece: Tetromino): boolean => {
  return defaultEngine.isGameOver(board, newPiece);
};

// 新しい関数 - 重複コード排除のため
export const applyPiecePlacement = (
  gameState: GameState,
  piece: Tetromino
): Partial<GameState> => {
  return defaultEngine.applyPiecePlacement(gameState, piece);
};

export const calculateHardDropPosition = (
  board: number[][],
  piece: Tetromino
): Position => {
  return defaultEngine.calculateHardDropPosition(board, piece);
};

// エンジンインスタンスの作成（設定可能）
export const createTetrisEngine = (
  config?: ConstructorParameters<typeof TetrisEngine>[0]
) => {
  return new TetrisEngine(config);
};
