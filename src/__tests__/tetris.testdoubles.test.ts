import { describe, it, expect, vi } from 'vitest';
import {
  createEmptyBoard,
  placeTetromino,
  clearLines,
  createTetrisEngine,
} from '@/utils/tetris';
import {
  Tetromino,
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
  RandomGenerator,
} from '@/types/tetris';

/**
 * テストダブルを活用したテトリスゲームロジックテスト
 *
 * t-wada流のアプローチ：
 * - 外部依存関係の制御による決定論的テスト
 * - 依存性注入によるテスタブルなアーキテクチャ
 * - ランダム性の排除による再現可能なテスト
 * - 時間に依存しない単体テスト
 * - テストダブルの種類：
 *   - スタブ：決定的な戻り値を返す
 *   - モック：呼び出しを記録・検証する
 *   - フェイク：簡単な実装を提供する
 */
describe('テストダブルを活用したテトリスゲームテスト', () => {
  describe('🧪 依存性注入によるランダム性の制御', () => {
    it('ランダム生成器スタブでI型ピースを確実に生成', () => {
      // Given: 常に0を返すランダム生成器スタブ（依存性注入）
      const mockRandomGenerator: RandomGenerator = vi.fn().mockReturnValue(0);
      const engine = createTetrisEngine({
        randomGenerator: mockRandomGenerator,
      });

      // When: ランダムテトロミノを生成
      const tetromino = engine.getRandomTetromino();

      // Then: 必ずI型ピースが生成される
      expect(tetromino.type).toBe('I');
      expect(tetromino.shape).toEqual(TETROMINO_SHAPES.I);
      expect(tetromino.color).toBe(TETROMINO_COLORS.I);
      expect(mockRandomGenerator).toHaveBeenCalledTimes(1);
    });

    it('異なるランダム値で特定のピース型を生成', () => {
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
        // Given: 特定の値を返すランダム生成器（依存性注入）
        const mockRandomGenerator: RandomGenerator = vi
          .fn()
          .mockReturnValue(randomValue);
        const engine = createTetrisEngine({
          randomGenerator: mockRandomGenerator,
        });

        // When: テトロミノを生成
        const tetromino = engine.getRandomTetromino();

        // Then: 期待されるピース型が生成される
        expect(tetromino.type).toBe(expectedType);
        expect(tetromino.shape).toEqual(TETROMINO_SHAPES[expectedType]);
        expect(tetromino.color).toBe(TETROMINO_COLORS[expectedType]);
      });
    });

    it('ランダム性を完全に制御して決定論的なゲームシナリオをテスト', () => {
      // Given: 特定のピース順序を定義
      const pieceSequence = [0.0, 0.2, 0.4, 0.6, 0.8]; // index: 0, 1, 2, 4, 5
      const expectedTypes = ['I', 'O', 'T', 'Z', 'J'];
      let callCount = 0;

      const mockRandomGenerator: RandomGenerator = vi
        .fn()
        .mockImplementation(() => {
          return pieceSequence[callCount++];
        });
      const engine = createTetrisEngine({
        randomGenerator: mockRandomGenerator,
      });

      // When: 複数のピースを順次生成
      const pieces = Array.from({ length: 5 }, () =>
        engine.getRandomTetromino()
      );

      // Then: 期待される順序でピースが生成される
      pieces.forEach((piece, index) => {
        expect(piece.type).toBe(expectedTypes[index]);
      });
      expect(mockRandomGenerator).toHaveBeenCalledTimes(5);
    });
  });

  describe('🎭 ファクトリーパターンでのテストダブル', () => {
    it('決定論的なピース生成器でゲームロジックをテスト', () => {
      // Given: 常にT型ピースを返すファクトリー
      const tPieceFactory = (): Tetromino => ({
        type: 'T',
        shape: TETROMINO_SHAPES.T,
        position: { x: 4, y: 0 },
        color: TETROMINO_COLORS.T,
      });

      // When: T型ピースを取得
      const piece = tPieceFactory();

      // Then: 期待されるT型ピースが生成される
      expect(piece.type).toBe('T');
      expect(piece.shape).toEqual(TETROMINO_SHAPES.T);
      expect(piece.color).toBe(TETROMINO_COLORS.T);
      expect(piece.position).toEqual({ x: 4, y: 0 });
    });

    it('特定のピース型のみのジェネレーターでエッジケースをテスト', () => {
      // Given: I型ピースのみを生成するジェネレーター
      const iPieceOnlyEngine = createTetrisEngine({
        randomGenerator: () => 0, // 常にI型ピース（index: 0）
      });

      // When: 複数回ピースを生成
      const pieces = Array.from({ length: 3 }, () =>
        iPieceOnlyEngine.getRandomTetromino()
      );

      // Then: 全てI型ピースが生成される
      pieces.forEach(piece => {
        expect(piece.type).toBe('I');
        expect(piece.shape).toEqual(TETROMINO_SHAPES.I);
        expect(piece.color).toBe(TETROMINO_COLORS.I);
      });
    });
  });

  describe('⏰ 時間依存関数のモック化', () => {
    it('パフォーマンス測定のモック化', () => {
      // Given: Date.nowをモック化
      const startTime = 1000;
      const endTime = 1500;
      let callCount = 0;

      Date.now = vi.fn().mockImplementation(() => {
        return callCount++ === 0 ? startTime : endTime;
      });

      // When: 計算処理を実行
      const start = Date.now();
      // 何らかの計算処理（シミュレーション）
      createEmptyBoard();
      const end = Date.now();
      const duration = end - start;

      // Then: 期待される実行時間が記録される
      expect(duration).toBe(500);
      expect(Date.now).toHaveBeenCalledTimes(2);
    });
  });

  describe('🔧 複雑なボード状態のテストフィクスチャ', () => {
    it('カスタムボード状態でライン消去ロジックをテスト', () => {
      // Given: 最下行が完全に埋まったボード状態のフィクスチャ
      const customBoard = createEmptyBoard();
      // 最下行（index: 19）を完全に埋める
      customBoard[19] = Array(10).fill(1);
      // 最下行の一つ上（index: 18）を部分的に埋める
      customBoard[18] = [1, 1, 0, 1, 1, 0, 1, 1, 0, 1];

      // When: ライン消去処理を実行
      const { newBoard, linesCleared } = clearLines(customBoard);

      // Then: 1ライン消去され、新しい空行が追加される
      expect(linesCleared).toBe(1);
      expect(newBoard[19]).toEqual([1, 1, 0, 1, 1, 0, 1, 1, 0, 1]); // 18行目が19行目に移動
      expect(newBoard[0]).toEqual(Array(10).fill(0)); // 新しい空行が最上部に追加
    });

    it('複数の完全ラインがあるボードでのライン消去', () => {
      // Given: 複数行が完全に埋まったボード状態
      const customBoard = createEmptyBoard();
      customBoard[17] = Array(10).fill(1); // 完全ライン
      customBoard[18] = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; // 不完全ライン
      customBoard[19] = Array(10).fill(1); // 完全ライン

      // When: ライン消去処理を実行
      const { newBoard, linesCleared } = clearLines(customBoard);

      // Then: 2ライン消去され、不完全ラインが最下行に移動
      expect(linesCleared).toBe(2);
      expect(newBoard[19]).toEqual([1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
      expect(newBoard[0]).toEqual(Array(10).fill(0));
      expect(newBoard[1]).toEqual(Array(10).fill(0));
    });
  });

  describe('🎪 統合テストシナリオでのテストダブル組み合わせ', () => {
    it('決定論的なゲームシナリオの完全制御', () => {
      // Given: 制御されたランダム生成器と特定のボード状態
      const mockRandomGenerator: RandomGenerator = vi.fn().mockReturnValue(0); // 常にI型
      const engine = createTetrisEngine({
        randomGenerator: mockRandomGenerator,
      });

      // 特定のボード状態を作成（最下行の9つを埋める）
      const board = createEmptyBoard();
      for (let x = 0; x < 9; x++) {
        board[19][x] = 1; // 最下行の0-8を埋める（xに1つ空き）
      }

      // When: I型ピースを生成して配置
      const iPiece = engine.getRandomTetromino();
      expect(iPiece.type).toBe('I');

      // I型を垂直配置して最下行を完成させる
      const verticalIPiece: Tetromino = {
        ...iPiece,
        shape: [[1], [1], [1], [1]], // 垂直I型
        position: { x: 9, y: 16 }, // 空いている位置
      };

      const boardWithPiece = placeTetromino(board, verticalIPiece);
      const { newBoard, linesCleared } = clearLines(boardWithPiece);

      // Then: ライン消去が発生し、期待される結果になる
      expect(linesCleared).toBe(1);
      // 18行目が19行目に移動し、最下行にはI型の一部が残る
      expect(newBoard[19]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 1]); // I型の一部が残る
      expect(mockRandomGenerator).toHaveBeenCalledTimes(1);
    });
  });
});
