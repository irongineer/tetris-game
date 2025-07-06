'use client';

import React, { useEffect } from 'react';
import TetrisBoard from '@/components/TetrisBoard';
import GameInfo from '@/components/GameInfo';
import { useTetris } from '@/hooks/useTetris';
import { useKeyboard } from '@/hooks/useKeyboard';

export default function Home() {
  const { gameState, startGame, pauseGame, movePiece, rotatePiece, hardDrop } =
    useTetris();

  useKeyboard({
    onMoveLeft: () => movePiece(-1, 0),
    onMoveRight: () => movePiece(1, 0),
    onMoveDown: () => movePiece(0, 1),
    onRotate: rotatePiece,
    onHardDrop: hardDrop,
    onPause: pauseGame,
  });

  useEffect(() => {
    const handleFocus = () => {
      if (gameState.gameOver || !gameState.currentPiece) return;
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [gameState]);

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4'>
      <h1 className='text-4xl font-bold text-white mb-8'>Tetris</h1>

      <div className='flex flex-col lg:flex-row items-start gap-8'>
        <div className='flex flex-col items-center'>
          <TetrisBoard gameState={gameState} />

          <div className='mt-4 flex gap-4'>
            <button
              onClick={startGame}
              className='px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
            >
              {gameState.gameOver ? 'New Game' : 'Start Game'}
            </button>

            {gameState.currentPiece && !gameState.gameOver && (
              <button
                onClick={pauseGame}
                className='px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors'
              >
                {gameState.isPaused ? 'Resume' : 'Pause'}
              </button>
            )}
          </div>
        </div>

        <GameInfo gameState={gameState} />
      </div>

      <div className='mt-8 text-center text-gray-400'>
        <p className='text-sm'>
          Use arrow keys to move and rotate pieces. Space for hard drop, P to
          pause.
        </p>
      </div>
    </div>
  );
}
