import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import TetrisBoard from './TetrisBoard';
import { GameState } from '@/types/tetris';
import { createEmptyBoard } from '@/utils/tetris';

describe('TetrisBoard コンポーネント', () => {
  const mockGameState: GameState = {
    board: createEmptyBoard(),
    currentPiece: {
      type: 'T',
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      position: { x: 3, y: 1 },
      color: '#9333ea',
    },
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 0,
    gameOver: false,
    isPaused: false,
  };

  it('ゲームボードが正しく描画される', () => {
    const { container } = render(<TetrisBoard gameState={mockGameState} />);

    // ボードのコンテナが存在することを確認
    const boardContainer = container.querySelector(
      '.inline-block.border-2.border-gray-300.bg-black'
    );
    expect(boardContainer).toBeInTheDocument();
  });

  it('正しい数のセルが描画される', () => {
    const { container } = render(<TetrisBoard gameState={mockGameState} />);

    // 10x20 = 200個のセルが存在することを確認
    const cells = container.querySelectorAll('.w-8.h-8');
    expect(cells).toHaveLength(200);
  });

  it('空のセルが黒色で描画される', () => {
    const { container } = render(<TetrisBoard gameState={mockGameState} />);

    // 空のセル（cell === 0）が黒背景で描画されることを確認
    const emptyCells = container.querySelectorAll('.bg-black');
    expect(emptyCells.length).toBeGreaterThan(0);
  });

  it('現在のピースが正しい色で描画される', () => {
    const { container } = render(<TetrisBoard gameState={mockGameState} />);

    // currentPieceの色が適用されたセルを確認
    const pieceCells = Array.from(
      container.querySelectorAll('.w-8.h-8')
    ).filter(
      cell =>
        (cell as HTMLElement).style.backgroundColor === 'rgb(147, 51, 234)' // #9333ea
    );

    // Tピースは4つのブロックから構成される
    expect(pieceCells.length).toBe(4);
  });

  it('配置済みのピースがグレー色で描画される', () => {
    const boardWithPlacedPieces = createEmptyBoard();
    boardWithPlacedPieces[19][0] = 1;
    boardWithPlacedPieces[19][1] = 1;
    boardWithPlacedPieces[19][2] = 1;

    const gameStateWithPlacedPieces = {
      ...mockGameState,
      board: boardWithPlacedPieces,
      currentPiece: null,
    };

    const { container } = render(
      <TetrisBoard gameState={gameStateWithPlacedPieces} />
    );

    // 配置済みピースの色を確認
    const placedPieceCells = Array.from(
      container.querySelectorAll('.w-8.h-8')
    ).filter(
      cell =>
        (cell as HTMLElement).style.backgroundColor === 'rgb(102, 102, 102)' // #666
    );

    expect(placedPieceCells.length).toBe(3);
  });

  it('現在のピースがnullの場合でも正常に描画される', () => {
    const gameStateWithoutCurrentPiece = {
      ...mockGameState,
      currentPiece: null,
    };

    const { container } = render(
      <TetrisBoard gameState={gameStateWithoutCurrentPiece} />
    );

    // エラーが発生せず、200個のセルが描画される
    const cells = container.querySelectorAll('.w-8.h-8');
    expect(cells).toHaveLength(200);
  });

  it('ピースがボード境界外にある場合でも安全に処理される', () => {
    const gameStateWithBoundaryPiece = {
      ...mockGameState,
      currentPiece: {
        type: 'I' as const,
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        position: { x: -1, y: 0 },
        color: '#06b6d4',
      },
    };

    // エラーが発生しないことを確認
    expect(() => {
      render(<TetrisBoard gameState={gameStateWithBoundaryPiece} />);
    }).not.toThrow();
  });

  it('複数の配置済みピースと現在のピースが同時に表示される', () => {
    const boardWithMultiplePieces = createEmptyBoard();

    // 複数の配置済みピースを配置
    for (let x = 0; x < 5; x++) {
      boardWithMultiplePieces[19][x] = 1;
    }
    for (let x = 2; x < 7; x++) {
      boardWithMultiplePieces[18][x] = 1;
    }

    const gameStateWithMultiplePieces = {
      ...mockGameState,
      board: boardWithMultiplePieces,
    };

    const { container } = render(
      <TetrisBoard gameState={gameStateWithMultiplePieces} />
    );

    // 配置済みピース（グレー）
    const placedPieceCells = Array.from(
      container.querySelectorAll('.w-8.h-8')
    ).filter(
      cell =>
        (cell as HTMLElement).style.backgroundColor === 'rgb(102, 102, 102)' // #666
    );
    expect(placedPieceCells.length).toBe(10); // 5 + 5個

    // 現在のピース（紫）
    const currentPieceCells = Array.from(
      container.querySelectorAll('.w-8.h-8')
    ).filter(
      cell =>
        (cell as HTMLElement).style.backgroundColor === 'rgb(147, 51, 234)' // #9333ea
    );
    expect(currentPieceCells.length).toBe(4); // Tピース
  });

  it('Iピースが正しく表示される', () => {
    const gameStateWithIPiece = {
      ...mockGameState,
      currentPiece: {
        type: 'I' as const,
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        position: { x: 3, y: 5 },
        color: '#06b6d4',
      },
    };

    const { container } = render(
      <TetrisBoard gameState={gameStateWithIPiece} />
    );

    // Iピースの色のセルが4つ存在することを確認
    const iPieceCells = Array.from(
      container.querySelectorAll('.w-8.h-8')
    ).filter(
      cell => (cell as HTMLElement).style.backgroundColor === 'rgb(6, 182, 212)' // #06b6d4
    );
    expect(iPieceCells.length).toBe(4);
  });
});
