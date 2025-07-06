import React from 'react';
import { GameState } from '@/types/tetris';

interface TetrisBoardProps {
  gameState: GameState;
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ gameState }) => {
  const { board, currentPiece } = gameState;

  const addCurrentPieceToBoard = (baseBoard: number[][]) => {
    const displayBoard = baseBoard.map(row => [...row]);

    if (!currentPiece) return displayBoard;

    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== 0) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;

          if (
            boardY >= 0 &&
            boardY < displayBoard.length &&
            boardX >= 0 &&
            boardX < displayBoard[0].length
          ) {
            displayBoard[boardY][boardX] = 2;
          }
        }
      }
    }

    return displayBoard;
  };

  const getCellBackgroundColor = (cell: number) => {
    if (cell === 2 && currentPiece) return currentPiece.color;
    if (cell === 1) return '#666';
    return '#000';
  };

  const renderBoard = () => {
    const displayBoard = addCurrentPieceToBoard(board);

    return displayBoard.map((row, y) => (
      <div key={y} className='flex'>
        {row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className='w-8 h-8 border border-gray-400'
            style={{
              backgroundColor: getCellBackgroundColor(cell),
            }}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className='inline-block border-2 border-gray-300 bg-black'>
      {renderBoard()}
    </div>
  );
};

export default TetrisBoard;
