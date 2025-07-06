import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getRandomTetromino,
  createEmptyBoard,
  placeTetromino,
  clearLines,
} from '@/utils/tetris';
import { Tetromino, TETROMINO_SHAPES, TETROMINO_COLORS } from '@/types/tetris';

/**
 * テストダブルを活用したテトリスゲームロジックテスト
 *
 * t-wada流のアプローチ：
 * - 外部依存関係の制御による決定論的テスト
 * - ランダム性の排除による再現可能なテスト
 * - 時間に依存しない単体テスト
 * - テストダブルの種類：
 *   - スタブ：決定的な戻り値を返す
 *   - モック：呼び出しを記録・検証する
 *   - フェイク：簡単な実装を提供する
 */

describe('テストダブルを活用したテトリスゲームテスト', () => {
  describe('📦 ランダム性のスタブ化', () => {
    let originalMathRandom: typeof Math.random;

    beforeEach(() => {
      originalMathRandom = Math.random;
    });

    afterEach(() => {
      Math.random = originalMathRandom;
    });

    it('Math.randomをスタブ化してI型ピースを確実に生成', () => {
      // Given: Math.randomが常に0を返すスタブ
      Math.random = vi.fn().mockReturnValue(0);

      // When: ランダムテトロミノを生成
      const tetromino = getRandomTetromino();

      // Then: 必ずI型ピースが生成される
      expect(tetromino.type).toBe('I');
      expect(tetromino.shape).toEqual(TETROMINO_SHAPES.I);
      expect(tetromino.color).toBe(TETROMINO_COLORS.I);
      expect(Math.random).toHaveBeenCalledTimes(1);
    });

    it('異なるMath.random値で特定のピース型を生成', () => {
      // Given: 各ピース型に対応するランダム値
      // types配列: ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] (index: 0-6)
      const testCases = [
        { randomValue: 0, expectedType: 'I' as const }, // 0 * 7 = 0 -> floor = 0
        { randomValue: 0.14, expectedType: 'I' as const }, // 0.14 * 7 = 0.98 -> floor = 0
        { randomValue: 0.15, expectedType: 'O' as const }, // 0.15 * 7 = 1.05 -> floor = 1
        { randomValue: 0.43, expectedType: 'S' as const }, // 0.43 * 7 = 3.01 -> floor = 3
        { randomValue: 0.99, expectedType: 'L' as const }, // 0.99 * 7 = 6.93 -> floor = 6
      ];

      testCases.forEach(({ randomValue, expectedType }) => {
        // When: 特定のランダム値を設定
        Math.random = vi.fn().mockReturnValue(randomValue);
        const tetromino = getRandomTetromino();

        // Then: 期待されるピース型が生成される
        expect(tetromino.type).toBe(expectedType);
        expect(tetromino.shape).toEqual(TETROMINO_SHAPES[expectedType]);
        expect(tetromino.color).toBe(TETROMINO_COLORS[expectedType]);
      });
    });

    it('ランダム性を完全に制御して決定論的なゲームシナリオをテスト', () => {
      // Given: 特定のピース順序を定義
      // types配列: ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] (index: 0-6)
      const pieceSequence = [0.0, 0.2, 0.4, 0.6, 0.8]; // index: 0, 1, 2, 4, 5
      const expectedTypes = ['I', 'O', 'T', 'Z', 'J'];
      let callCount = 0;

      Math.random = vi.fn().mockImplementation(() => {
        return pieceSequence[callCount++ % pieceSequence.length];
      });

      // When: 複数のピースを生成
      const pieces = Array.from({ length: 5 }, () => getRandomTetromino());

      // Then: 期待される順序でピースが生成される
      pieces.forEach((piece, index) => {
        expect(piece.type).toBe(expectedTypes[index]);
      });
      expect(Math.random).toHaveBeenCalledTimes(5);
    });
  });

  describe('🎭 ファクトリーパターンでのテストダブル', () => {
    // テスト用のピース生成器ファクトリー
    const createTestPieceGenerator = (types: string[]) => {
      let index = 0;
      return (): Tetromino => {
        const type = types[
          index % types.length
        ] as keyof typeof TETROMINO_SHAPES;
        index++;
        return {
          type,
          shape: TETROMINO_SHAPES[type],
          position: { x: 4, y: 0 },
          color: TETROMINO_COLORS[type],
        };
      };
    };

    it('決定論的なピース生成器でゲームロジックをテスト', () => {
      // Given: 予測可能なピース順序のジェネレーター
      const predictableGenerator = createTestPieceGenerator([
        'I',
        'O',
        'I',
        'O',
      ]);

      // When: ピースを連続生成
      const pieces = Array.from({ length: 6 }, () => predictableGenerator());

      // Then: パターンが繰り返される
      expect(pieces[0].type).toBe('I');
      expect(pieces[1].type).toBe('O');
      expect(pieces[2].type).toBe('I');
      expect(pieces[3].type).toBe('O');
      expect(pieces[4].type).toBe('I'); // パターン繰り返し
      expect(pieces[5].type).toBe('O');
    });

    it('特定のピース型のみのジェネレーターでエッジケースをテスト', () => {
      // Given: I型のみのジェネレーター（テトリス達成しやすい）
      const iOnlyGenerator = createTestPieceGenerator(['I']);

      // When: 複数のI型ピースを生成
      const pieces = Array.from({ length: 3 }, () => iOnlyGenerator());

      // Then: 全てI型である
      pieces.forEach(piece => {
        expect(piece.type).toBe('I');
        expect(piece.shape).toEqual(TETROMINO_SHAPES.I);
      });
    });
  });

  describe('⏰ 時間依存関数のモック化', () => {
    it('パフォーマンス測定のモック化', () => {
      // Given: performance.nowのモック
      const mockPerformanceNow = vi
        .fn()
        .mockReturnValueOnce(1000) // 開始時間
        .mockReturnValueOnce(1500); // 終了時間

      const originalPerformanceNow = performance.now;
      performance.now = mockPerformanceNow;

      // When: 時間を測定する処理
      const startTime = performance.now();

      // 何らかの処理をシミュレート
      const board = createEmptyBoard();
      const piece: Tetromino = {
        type: 'I',
        shape: TETROMINO_SHAPES.I,
        position: { x: 0, y: 0 },
        color: TETROMINO_COLORS.I,
      };
      placeTetromino(board, piece);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Then: 期待される時間差が計算される
      expect(duration).toBe(500);
      expect(mockPerformanceNow).toHaveBeenCalledTimes(2);

      // 復元
      performance.now = originalPerformanceNow;
    });
  });

  // テスト用ボード状態のファクトリー（グローバルスコープ）
  const createTestBoard = (pattern: string[]): number[][] => {
    return pattern.map(row =>
      row.split('').map(cell => (cell === '#' ? 1 : 0))
    );
  };

  describe('🔧 複雑なボード状態のテストフィクスチャ', () => {
    it('カスタムボード状態でライン消去ロジックをテスト', () => {
      // Given: 特定パターンのボード（下から2行目が完全、最下行が不完全）
      const testBoardPattern = [
        '..........', // 0行目（空）
        '..........', // 1行目（空）
        '..........', // 2行目（空）
        '..........', // 17行目まで空
        '#.........', // 18行目（一部埋まり）
        '##########', // 19行目（完全埋まり）
      ];

      // パターンを20行にパディング
      const fullPattern = Array(16)
        .fill('..........')
        .concat(testBoardPattern.slice(-4));
      const testBoard = createTestBoard(fullPattern);

      // When: ライン消去を実行
      const { newBoard, linesCleared } = clearLines(testBoard);

      // Then: 1ライン消去される
      expect(linesCleared).toBe(1);

      // Then: 最下行が新しい空行になり、18行目の内容が下に移動
      expect(newBoard[19]).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 元の18行目
      expect(newBoard[18]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 新しい空行
    });

    it('複数の完全ラインがあるボードでのライン消去', () => {
      // Given: 3つの完全ラインを持つボード
      const _testBoardPattern = [
        '..........', // 17行目（空）
        '##########', // 18行目（完全）
        '##########', // 19行目（完全）
        '##########', // 20行目（完全）※実際は19行目が最下行
      ];

      const fullPattern = Array(17)
        .fill('..........')
        .concat(['##########', '##########', '##########']);
      const testBoard = createTestBoard(fullPattern);

      // When: ライン消去を実行
      const { newBoard, linesCleared } = clearLines(testBoard);

      // Then: 3ライン消去される
      expect(linesCleared).toBe(3);

      // Then: 最下3行が新しい空行になる
      expect(newBoard[17]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(newBoard[18]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(newBoard[19]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe('🎪 統合テストシナリオでのテストダブル組み合わせ', () => {
    it('決定論的なゲームシナリオの完全制御', () => {
      // Given: 全ての外部依存関係をモック化
      const originalMathRandom = Math.random;
      Math.random = vi.fn().mockReturnValue(0); // 常にI型を生成

      try {
        // Given: テスト用ボード（最下行のみ9セルが埋まっている）
        const board = createTestBoard([
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '..........',
          '#########.',
        ]);

        // When: I型ピースを生成して配置
        const iPiece = getRandomTetromino();
        expect(iPiece.type).toBe('I');

        // I型を垂直配置して最下行を完成させる
        const verticalIPiece: Tetromino = {
          ...iPiece,
          position: { x: 9, y: 16 }, // 右端の空きスペースに縦配置
          shape: [[1], [1], [1], [1]], // 垂直形状
        };

        // When: ピース配置とライン消去
        const boardWithPiece = placeTetromino(board, verticalIPiece);
        const { linesCleared } = clearLines(boardWithPiece);

        // Then: 1ライン消去される
        expect(linesCleared).toBe(1);
        expect(Math.random).toHaveBeenCalledTimes(1);
      } finally {
        Math.random = originalMathRandom;
      }
    });
  });
});
