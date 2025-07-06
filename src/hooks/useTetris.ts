import { useState, useEffect, useCallback } from 'react';
import { GameState } from '@/types/tetris';
import {
  createEmptyBoard,
  getRandomTetromino,
  rotateTetromino,
  isValidPosition,
  placeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  isGameOver,
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

      let newY = prev.currentPiece.position.y;
      while (
        isValidPosition(prev.board, prev.currentPiece, {
          x: prev.currentPiece.position.x,
          y: newY + 1,
        })
      ) {
        newY++;
      }

      const droppedPiece = {
        ...prev.currentPiece,
        position: { x: prev.currentPiece.position.x, y: newY },
      };

      const newBoard = placeTetromino(prev.board, droppedPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

      const newLines = prev.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prev.score + calculateScore(linesCleared, prev.level);

      const nextPiece = prev.nextPiece || getRandomTetromino();
      const newCurrentPiece = getRandomTetromino();

      if (isGameOver(clearedBoard, nextPiece)) {
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: null,
          gameOver: true,
          score: newScore,
          lines: newLines,
          level: newLevel,
        };
      }

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: nextPiece,
        nextPiece: newCurrentPiece,
        score: newScore,
        lines: newLines,
        level: newLevel,
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

      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition,
          },
        };
      } else {
        const newBoard = placeTetromino(prev.board, prev.currentPiece);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

        const newLines = prev.lines + linesCleared;
        const newLevel = calculateLevel(newLines);
        const newScore = prev.score + calculateScore(linesCleared, prev.level);

        const nextPiece = prev.nextPiece || getRandomTetromino();
        const newCurrentPiece = getRandomTetromino();

        if (isGameOver(clearedBoard, nextPiece)) {
          return {
            ...prev,
            board: clearedBoard,
            currentPiece: null,
            gameOver: true,
            score: newScore,
            lines: newLines,
            level: newLevel,
          };
        }

        return {
          ...prev,
          board: clearedBoard,
          currentPiece: nextPiece,
          nextPiece: newCurrentPiece,
          score: newScore,
          lines: newLines,
          level: newLevel,
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
