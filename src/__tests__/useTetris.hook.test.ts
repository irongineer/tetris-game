import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useTetris } from '@/hooks/useTetris';
import * as tetrisUtils from '@/utils/tetris';

/**
 * 🎮 useTetris Hook統合テスト - t-wada流TDDテスト
 *
 * テスト設計方針:
 * - Given-When-Then構造でのユーザーストーリー重視
 * - 実装詳細ではなく、ゲームの振る舞いを検証
 * - 外部依存関係の制御でテストの決定論性を確保
 * - 境界値・エラーケースの徹底的な検証
 */

describe('🎮 useTetris Hook統合テスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('📦 初期状態の仕様', () => {
    it('Given: Hookが初期化される, When: 状態を確認, Then: 適切な初期値が設定される', () => {
      // Given: useTetrisを初期化
      const { result } = renderHook(() => useTetris());

      // When: 初期状態を確認
      const { gameState } = result.current;

      // Then: 適切な初期値が設定される
      expect(gameState.board).toHaveLength(20);
      expect(gameState.board[0]).toHaveLength(10);
      expect(gameState.currentPiece).toBeNull();
      expect(gameState.nextPiece).toBeNull();
      expect(gameState.score).toBe(0);
      expect(gameState.lines).toBe(0);
      expect(gameState.level).toBe(0);
      expect(gameState.gameOver).toBe(false);
      expect(gameState.isPaused).toBe(false);
    });
  });

  describe('🎯 ゲーム開始の仕様', () => {
    it('Given: 初期状態, When: ゲームを開始, Then: 現在・次ピースが生成される', () => {
      // Given: モックの設定
      const mockCurrentPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
        color: '#00f0f0',
      };
      const mockNextPiece = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
        ],
        position: { x: 3, y: 0 },
        color: '#a000f0',
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino')
        .mockReturnValueOnce(mockCurrentPiece)
        .mockReturnValueOnce(mockNextPiece);

      const { result } = renderHook(() => useTetris());

      // When: ゲームを開始
      act(() => {
        result.current.startGame();
      });

      // Then: 現在・次ピースが適切に設定される
      expect(result.current.gameState.currentPiece).toEqual(mockCurrentPiece);
      expect(result.current.gameState.nextPiece).toEqual(mockNextPiece);
      expect(result.current.gameState.gameOver).toBe(false);
      expect(result.current.gameState.isPaused).toBe(false);
    });

    it('Given: 既存のゲーム状態, When: 新しいゲームを開始, Then: 状態がリセットされる', () => {
      // Given: 既存のゲーム状態をシミュレート
      const { result } = renderHook(() => useTetris());

      // 既存状態を作成（スコア・レベルが存在）
      act(() => {
        result.current.startGame();
      });

      // When: 新しいゲームを開始
      act(() => {
        result.current.startGame();
      });

      // Then: 状態がリセットされる
      expect(result.current.gameState.score).toBe(0);
      expect(result.current.gameState.lines).toBe(0);
      expect(result.current.gameState.level).toBe(0);
      expect(result.current.gameState.gameOver).toBe(false);
    });
  });

  describe('⏸️ ゲーム一時停止の仕様', () => {
    it('Given: 実行中のゲーム, When: 一時停止を実行, Then: 状態が一時停止に変わる', () => {
      // Given: 実行中のゲーム
      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });
      expect(result.current.gameState.isPaused).toBe(false);

      // When: 一時停止を実行
      act(() => {
        result.current.pauseGame();
      });

      // Then: 状態が一時停止に変わる
      expect(result.current.gameState.isPaused).toBe(true);
    });

    it('Given: 一時停止中のゲーム, When: 再開を実行, Then: 状態が実行中に戻る', () => {
      // Given: 一時停止中のゲーム
      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
        result.current.pauseGame();
      });
      expect(result.current.gameState.isPaused).toBe(true);

      // When: 再開を実行
      act(() => {
        result.current.pauseGame();
      });

      // Then: 状態が実行中に戻る
      expect(result.current.gameState.isPaused).toBe(false);
    });
  });

  describe('🎮 ピース移動の仕様', () => {
    it('Given: 有効な移動先, When: ピースを移動, Then: 位置が更新される', () => {
      // Given: 有効な移動先のモック
      const mockPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
        color: '#00f0f0',
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'isValidPosition').mockReturnValue(true);

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });

      // When: ピースを右に移動
      act(() => {
        result.current.movePiece(1, 0);
      });

      // Then: 位置が更新される
      expect(result.current.gameState.currentPiece?.position.x).toBe(4);
      expect(result.current.gameState.currentPiece?.position.y).toBe(0);
    });

    it('Given: 無効な移動先, When: ピースを移動, Then: 位置が変更されない', () => {
      // Given: 無効な移動先のモック
      const mockPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
        color: '#00f0f0',
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'isValidPosition').mockReturnValue(false);

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });

      // When: 無効な移動を試行
      act(() => {
        result.current.movePiece(1, 0);
      });

      // Then: 位置が変更されない
      expect(result.current.gameState.currentPiece?.position.x).toBe(3);
      expect(result.current.gameState.currentPiece?.position.y).toBe(0);
    });
  });

  describe('🔄 ピース回転の仕様', () => {
    it('Given: 有効な回転, When: ピースを回転, Then: 形状が更新される', () => {
      // Given: 有効な回転のモック
      const mockPiece = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
        ],
        position: { x: 3, y: 0 },
        color: '#a000f0',
      };

      const mockRotatedPiece = {
        type: 'T' as const,
        shape: [
          [1, 0],
          [1, 1],
          [1, 0],
        ],
        position: { x: 3, y: 0 },
        color: '#a000f0',
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'rotateTetromino').mockReturnValue(
        mockRotatedPiece
      );
      vi.spyOn(tetrisUtils, 'isValidPosition').mockReturnValue(true);

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });

      // When: ピースを回転
      act(() => {
        result.current.rotatePiece();
      });

      // Then: 形状が更新される
      expect(result.current.gameState.currentPiece?.shape).toEqual([
        [1, 0],
        [1, 1],
        [1, 0],
      ]);
    });

    it('Given: 無効な回転, When: ピースを回転, Then: 形状が変更されない', () => {
      // Given: 無効な回転のモック
      const mockPiece = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
        ],
        position: { x: 3, y: 0 },
        color: '#a000f0',
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'rotateTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'isValidPosition').mockReturnValue(false);

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });

      // When: 無効な回転を試行
      act(() => {
        result.current.rotatePiece();
      });

      // Then: 形状が変更されない
      expect(result.current.gameState.currentPiece?.shape).toEqual([
        [0, 1, 0],
        [1, 1, 1],
      ]);
    });
  });

  describe('⚡ ハードドロップの仕様', () => {
    it('Given: 有効なハードドロップ, When: ハードドロップを実行, Then: ピースが即座に配置される', () => {
      // Given: ハードドロップのモック
      const mockPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
        color: '#00f0f0',
      };

      const mockDropPosition = { x: 3, y: 18 };
      const mockPlacementResult = {
        board: Array(20)
          .fill(0)
          .map(() => Array(10).fill(0)),
        currentPiece: null,
        nextPiece: mockPiece,
        score: 40,
        lines: 1,
        level: 0,
        gameOver: false,
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'calculateHardDropPosition').mockReturnValue(
        mockDropPosition
      );
      vi.spyOn(tetrisUtils, 'applyPiecePlacement').mockReturnValue(
        mockPlacementResult
      );

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });

      // When: ハードドロップを実行
      act(() => {
        result.current.hardDrop();
      });

      // Then: ピースが配置され、状態が更新される
      expect(result.current.gameState.currentPiece).toBeNull();
      expect(result.current.gameState.score).toBe(40);
    });
  });

  describe('⬇️ ソフトドロップの仕様', () => {
    it('Given: 有効なドロップ, When: ソフトドロップを実行, Then: ピースが1段下に移動', () => {
      // Given: 有効なドロップのモック
      const mockPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
        color: '#00f0f0',
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'isValidPosition').mockReturnValue(true);

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });

      // When: ソフトドロップを実行
      act(() => {
        result.current.drop();
      });

      // Then: ピースが1段下に移動
      expect(result.current.gameState.currentPiece?.position.y).toBe(1);
    });

    it('Given: 底に到達, When: ソフトドロップを実行, Then: ピースが配置される', () => {
      // Given: 底に到達した状態のモック
      const mockPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 18 },
        color: '#00f0f0',
      };

      const mockPlacementResult = {
        board: Array(20)
          .fill(0)
          .map(() => Array(10).fill(0)),
        currentPiece: null,
        nextPiece: mockPiece,
        score: 40,
        lines: 1,
        level: 0,
        gameOver: false,
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'isValidPosition').mockReturnValue(false);
      vi.spyOn(tetrisUtils, 'applyPiecePlacement').mockReturnValue(
        mockPlacementResult
      );

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });

      // When: 底でソフトドロップを実行
      act(() => {
        result.current.drop();
      });

      // Then: ピースが配置される
      expect(result.current.gameState.currentPiece).toBeNull();
      expect(result.current.gameState.score).toBe(40);
    });
  });

  describe('🚫 エラーハンドリングとエッジケース', () => {
    it('Given: ゲームオーバー状態, When: ピース操作を試行, Then: 状態が変更されない', () => {
      // Given: ゲームオーバー状態をシミュレート
      const mockPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
        color: '#00f0f0',
      };

      const mockGameOverResult = {
        board: Array(20)
          .fill(0)
          .map(() => Array(10).fill(0)),
        currentPiece: null,
        nextPiece: mockPiece,
        score: 1000,
        lines: 10,
        level: 1,
        gameOver: true,
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'applyPiecePlacement').mockReturnValue(
        mockGameOverResult
      );
      vi.spyOn(tetrisUtils, 'isValidPosition').mockReturnValue(false);

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
        result.current.drop(); // ゲームオーバー状態にする
      });

      const initialState = result.current.gameState;

      // When: ピース操作を試行
      act(() => {
        result.current.movePiece(1, 0);
        result.current.rotatePiece();
        result.current.drop();
        result.current.hardDrop();
      });

      // Then: 状態が変更されない
      expect(result.current.gameState.currentPiece).toEqual(
        initialState.currentPiece
      );
      expect(result.current.gameState.board).toEqual(initialState.board);
      expect(result.current.gameState.gameOver).toBe(true);
    });

    it('Given: 一時停止状態, When: ピース操作を試行, Then: 状態が変更されない', () => {
      // Given: 一時停止状態
      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
        result.current.pauseGame();
      });

      const initialState = result.current.gameState;

      // When: ピース操作を試行
      act(() => {
        result.current.movePiece(1, 0);
        result.current.rotatePiece();
        result.current.drop();
        result.current.hardDrop();
      });

      // Then: 状態が変更されない
      expect(result.current.gameState.currentPiece).toEqual(
        initialState.currentPiece
      );
      expect(result.current.gameState.board).toEqual(initialState.board);
    });

    it('Given: 現在ピースが存在しない, When: ピース操作を試行, Then: 状態が変更されない', () => {
      // Given: 現在ピースが存在しない初期状態
      const { result } = renderHook(() => useTetris());
      const initialState = result.current.gameState;

      // When: ピース操作を試行
      act(() => {
        result.current.movePiece(1, 0);
        result.current.rotatePiece();
        result.current.drop();
        result.current.hardDrop();
      });

      // Then: 状態が変更されない
      expect(result.current.gameState).toEqual(initialState);
    });
  });

  describe('⏰ 自動ドロップのタイマー制御', () => {
    it('Given: ゲーム開始, When: タイマーが進行, Then: 自動ドロップが実行される', () => {
      // Given: ゲーム開始とモック設定
      const mockPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
        color: '#00f0f0',
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'isValidPosition').mockReturnValue(true);
      vi.spyOn(tetrisUtils, 'getDropSpeed').mockReturnValue(1000);

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });

      // When: タイマーが進行
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Then: 自動ドロップが実行される
      expect(result.current.gameState.currentPiece?.position.y).toBe(1);
    });

    it('Given: 一時停止状態, When: タイマーが進行, Then: 自動ドロップが実行されない', () => {
      // Given: 一時停止状態
      const mockPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
        color: '#00f0f0',
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'isValidPosition').mockReturnValue(true);

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
        result.current.pauseGame();
      });

      const initialY = result.current.gameState.currentPiece?.position.y;

      // When: タイマーが進行
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Then: 自動ドロップが実行されない
      expect(result.current.gameState.currentPiece?.position.y).toBe(initialY);
    });
  });

  describe('📊 レベル進行とドロップ速度の仕様', () => {
    it('Given: レベルが上がる, When: ドロップ速度を確認, Then: 速度が更新される', () => {
      // Given: レベル進行のモック
      const mockPiece = {
        type: 'I' as const,
        shape: [[1, 1, 1, 1]],
        position: { x: 3, y: 0 },
        color: '#00f0f0',
      };

      const mockPlacementResult = {
        board: Array(20)
          .fill(0)
          .map(() => Array(10).fill(0)),
        currentPiece: null,
        nextPiece: mockPiece,
        score: 1000,
        lines: 10,
        level: 1, // レベルアップ
        gameOver: false,
      };

      vi.spyOn(tetrisUtils, 'getRandomTetromino').mockReturnValue(mockPiece);
      vi.spyOn(tetrisUtils, 'applyPiecePlacement').mockReturnValue(
        mockPlacementResult
      );
      vi.spyOn(tetrisUtils, 'getDropSpeed')
        .mockReturnValueOnce(1000) // 初期レベル
        .mockReturnValueOnce(800); // レベル1

      const { result } = renderHook(() => useTetris());
      act(() => {
        result.current.startGame();
      });

      // When: レベルが上がる操作（ピース配置）
      act(() => {
        result.current.hardDrop();
      });

      // Then: ドロップ速度が更新される
      expect(tetrisUtils.getDropSpeed).toHaveBeenCalledWith(1);
    });
  });
});
