import { useState, useEffect, useCallback } from 'react';
import { GameState } from '@/types/tetris';
import {
  createEmptyBoard,
  getRandomTetromino,
  rotateTetromino,
  isValidPosition,
  getDropSpeed,
  applyPiecePlacement,
  calculateHardDropPosition,
} from '@/utils/tetris';

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 0,
    gameOver: false,
    isPaused: false,
  });

  const [dropTime, setDropTime] = useState<number | null>(null);

  const startGame = useCallback(() => {
    const newPiece = getRandomTetromino();
    const nextPiece = getRandomTetromino();

    setGameState({
      board: createEmptyBoard(),
      currentPiece: newPiece,
      nextPiece: nextPiece,
      score: 0,
      lines: 0,
      level: 0,
      gameOver: false,
      isPaused: false,
    });

    setDropTime(1000);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newPosition = {
        x: prev.currentPiece.position.x + deltaX,
        y: prev.currentPiece.position.y + deltaY,
      };

      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition,
          },
        };
      }

      return prev;
    });
  }, []);

  const rotatePiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const rotatedPiece = rotateTetromino(prev.currentPiece);

      if (isValidPosition(prev.board, rotatedPiece, rotatedPiece.position)) {
        return {
          ...prev,
          currentPiece: rotatedPiece,
        };
      }

      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      // ハードドロップの最終位置を計算
      const dropPosition = calculateHardDropPosition(
        prev.board,
        prev.currentPiece
      );
      const droppedPiece = {
        ...prev.currentPiece,
        position: dropPosition,
      };

      // 共通のピース配置処理を使用（重複コード排除）
      const placementResult = applyPiecePlacement(prev, droppedPiece);

      return {
        ...prev,
        ...placementResult,
      };
    });
  }, []);

  const drop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newPosition = {
        x: prev.currentPiece.position.x,
        y: prev.currentPiece.position.y + 1,
      };

      // ソフトドロップ可能な場合は位置を更新
      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition,
          },
        };
      } else {
        // 配置不可の場合は共通のピース配置処理を使用（重複コード排除）
        const placementResult = applyPiecePlacement(prev, prev.currentPiece);

        return {
          ...prev,
          ...placementResult,
        };
      }
    });
  }, []);

  useEffect(() => {
    if (dropTime === null || gameState.isPaused) return;

    const interval = setInterval(() => {
      drop();
    }, dropTime);

    return () => clearInterval(interval);
  }, [dropTime, drop, gameState.isPaused]);

  useEffect(() => {
    setDropTime(getDropSpeed(gameState.level));
  }, [gameState.level]);

  return {
    gameState,
    startGame,
    pauseGame,
    movePiece,
    rotatePiece,
    hardDrop,
    drop,
  };
};
