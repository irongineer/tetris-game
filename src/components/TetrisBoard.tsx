import React from 'react';
import { GameState, CELL_TYPES, CellType } from '@/types/tetris';

interface TetrisBoardProps {
  gameState: GameState;
}

/**
 * テトリスゲームボードコンポーネント
 *
 * t-wada改善点:
 * - マジックナンバーの排除
 * - セル状態の型安全性
 * - 関数の単一責任化
 */
const TetrisBoard: React.FC<TetrisBoardProps> = ({ gameState }) => {
  const { board, currentPiece } = gameState;

  /**
   * 現在のピースをボードに重ねて表示用ボードを作成
   */
  const addCurrentPieceToBoard = (baseBoard: number[][]): number[][] => {
    const displayBoard = baseBoard.map(row => [...row]);

    if (!currentPiece) return displayBoard;

    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== CELL_TYPES.EMPTY) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;

          if (
            boardY >= 0 &&
            boardY < displayBoard.length &&
            boardX >= 0 &&
            boardX < displayBoard[0].length
          ) {
            displayBoard[boardY][boardX] = CELL_TYPES.CURRENT_PIECE;
          }
        }
      }
    }

    return displayBoard;
  };

  /**
   * セル状態に応じた背景色を取得
   * 意図を明確にし、テストしやすい純粋関数
   */
  const getCellBackgroundColor = (
    cellType: CellType,
    pieceColor?: string
  ): string => {
    switch (cellType) {
      case CELL_TYPES.CURRENT_PIECE:
        return pieceColor ?? '#fff';
      case CELL_TYPES.PLACED:
        return '#666';
      case CELL_TYPES.EMPTY:
      default:
        return '#000';
    }
  };

  /**
   * ゲームボードをレンダリング
   * 各セルの状態に応じて適切な色を設定
   */
  const renderBoard = () => {
    const displayBoard = addCurrentPieceToBoard(board);

    return displayBoard.map((row, y) => (
      <div key={y} className='flex'>
        {row.map((cellType, x) => (
          <div
            key={`${y}-${x}`}
            className='w-8 h-8 border border-gray-400'
            style={{
              backgroundColor: getCellBackgroundColor(
                cellType as CellType,
                currentPiece?.color
              ),
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
