import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameInfo from './GameInfo';
import { GameState } from '@/types/tetris';

describe('GameInfo コンポーネント', () => {
  const mockGameState: GameState = {
    board: [],
    currentPiece: null,
    nextPiece: {
      type: 'T',
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      position: { x: 0, y: 0 },
      color: '#9333ea',
    },
    score: 1500,
    lines: 12,
    level: 2,
    gameOver: false,
    isPaused: false,
  };

  it('スコア、ライン数、レベルが正しく表示される', () => {
    render(<GameInfo gameState={mockGameState} />);

    expect(screen.getByText('Score: 1500')).toBeInTheDocument();
    expect(screen.getByText('Lines: 12')).toBeInTheDocument();
    expect(screen.getByText('Level: 2')).toBeInTheDocument();
  });

  it('次のピースが表示される', () => {
    const { container } = render(<GameInfo gameState={mockGameState} />);

    expect(screen.getByText('Next:')).toBeInTheDocument();

    // 次のピースの形状が描画されることを確認
    const pieceBlocks = Array.from(container.querySelectorAll('div')).filter(
      el => (el as HTMLElement).style.backgroundColor === 'rgb(147, 51, 234)' // #9333ea
    );
    expect(pieceBlocks.length).toBeGreaterThan(0);
  });

  it('次のピースがnullの場合は表示されない', () => {
    const gameStateWithoutNextPiece = {
      ...mockGameState,
      nextPiece: null,
    };

    render(<GameInfo gameState={gameStateWithoutNextPiece} />);

    expect(screen.queryByText('Next:')).not.toBeInTheDocument();
  });

  it('ゲームオーバー時にメッセージが表示される', () => {
    const gameOverState = {
      ...mockGameState,
      gameOver: true,
    };

    render(<GameInfo gameState={gameOverState} />);

    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    expect(screen.getByText('Game Over!')).toHaveClass('text-red-800');
  });

  it('一時停止時にメッセージが表示される', () => {
    const pausedState = {
      ...mockGameState,
      isPaused: true,
    };

    render(<GameInfo gameState={pausedState} />);

    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByText('Paused')).toHaveClass('text-yellow-800');
  });

  it('ゲームオーバー時は一時停止メッセージが表示されない', () => {
    const gameOverAndPausedState = {
      ...mockGameState,
      gameOver: true,
      isPaused: true,
    };

    render(<GameInfo gameState={gameOverAndPausedState} />);

    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    expect(screen.queryByText('Paused')).not.toBeInTheDocument();
  });

  it('操作説明が表示される', () => {
    render(<GameInfo gameState={mockGameState} />);

    expect(screen.getByText('Controls:')).toBeInTheDocument();
    expect(screen.getByText('← → Move')).toBeInTheDocument();
    expect(screen.getByText('↓ Soft Drop')).toBeInTheDocument();
    expect(screen.getByText('Space Hard Drop')).toBeInTheDocument();
    expect(screen.getByText('↑ Rotate')).toBeInTheDocument();
    expect(screen.getByText('P Pause')).toBeInTheDocument();
  });

  it('Iピースの次のピースが正しく表示される', () => {
    const gameStateWithIPiece = {
      ...mockGameState,
      nextPiece: {
        type: 'I' as const,
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        position: { x: 0, y: 0 },
        color: '#06b6d4',
      },
    };

    const { container } = render(<GameInfo gameState={gameStateWithIPiece} />);

    expect(screen.getByText('Next:')).toBeInTheDocument();

    // Iピースの色のブロックが表示されることを確認
    const pieceBlocks = Array.from(container.querySelectorAll('div')).filter(
      el => (el as HTMLElement).style.backgroundColor === 'rgb(6, 182, 212)' // #06b6d4
    );
    expect(pieceBlocks.length).toBe(4); // Iピースは4つのブロック
  });

  it('スコアが0の場合も正しく表示される', () => {
    const zeroScoreState = {
      ...mockGameState,
      score: 0,
      lines: 0,
      level: 0,
    };

    render(<GameInfo gameState={zeroScoreState} />);

    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(screen.getByText('Lines: 0')).toBeInTheDocument();
    expect(screen.getByText('Level: 0')).toBeInTheDocument();
  });
});
