import React from 'react';
import { GameState } from '@/types/tetris';

interface GameInfoProps {
  gameState: GameState;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameState }) => {
  const { score, lines, level, nextPiece, gameOver, isPaused } = gameState;

  const renderNextPiece = () => {
    if (!nextPiece) return null;

    return (
      <div className='mb-4'>
        <h3 className='text-lg font-bold mb-2'>Next:</h3>
        <div className='inline-block'>
          {nextPiece.shape.map((row, y) => (
            <div key={y} className='flex'>
              {row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className='w-6 h-6 border border-gray-400'
                  style={{
                    backgroundColor: cell !== 0 ? nextPiece.color : '#000',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='ml-8 p-4 bg-gray-100 rounded-lg'>
      <div className='mb-4'>
        <h2 className='text-xl font-bold mb-2'>Score: {score}</h2>
        <p className='text-lg'>Lines: {lines}</p>
        <p className='text-lg'>Level: {level}</p>
      </div>

      {renderNextPiece()}

      {gameOver && (
        <div className='mb-4 p-2 bg-red-100 border border-red-400 rounded'>
          <h3 className='text-lg font-bold text-red-800'>Game Over!</h3>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className='mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded'>
          <h3 className='text-lg font-bold text-yellow-800'>Paused</h3>
        </div>
      )}

      <div className='text-sm text-gray-600'>
        <h4 className='font-bold mb-2'>Controls:</h4>
        <p>← → Move</p>
        <p>↓ Soft Drop</p>
        <p>Space Hard Drop</p>
        <p>↑ Rotate</p>
        <p>P Pause</p>
      </div>
    </div>
  );
};

export default GameInfo;
