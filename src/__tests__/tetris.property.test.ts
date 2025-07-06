import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  createEmptyBoard,
  rotateTetromino,
  isValidPosition,
  placeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  isGameOver,
} from '@/utils/tetris';
import {
  Tetromino,
  TetrominoType,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
} from '@/types/tetris';

/**
 * Property-Based Testing for テトリスゲームロジック
 *
 * t-wada流のアプローチ：
 * - ランダムな入力に対する不変条件の検証
 * - 仕様の境界値における堅牢性の確認
 * - 実装の隠れたバグの発見
 */

describe('テトリスゲームロジック Property-Based Tests', () => {
  // Property-Based Testing設定
  const TEST_RUNS = 1000; // 各プロパティのテスト実行回数

  // データ生成器の定義
  const tetrominoTypeArb = fc.constantFrom<TetrominoType>(
    'I',
    'O',
    'T',
    'S',
    'Z',
    'J',
    'L'
  );

  const positionArb = fc.record({
    x: fc.integer({ min: -5, max: BOARD_WIDTH + 5 }),
    y: fc.integer({ min: -5, max: BOARD_HEIGHT + 5 }),
  });

  const tetrominoArb = tetrominoTypeArb.map(
    (type): Tetromino => ({
      type,
      shape: TETROMINO_SHAPES[type],
      position: { x: 4, y: 0 },
      color: TETROMINO_COLORS[type],
    })
  );

  const boardCellArb = fc.constantFrom(0, 1);
  const boardRowArb = fc.array(boardCellArb, {
    minLength: BOARD_WIDTH,
    maxLength: BOARD_WIDTH,
  });
  const boardArb = fc.array(boardRowArb, {
    minLength: BOARD_HEIGHT,
    maxLength: BOARD_HEIGHT,
  });

  describe('ボード作成の不変条件', () => {
    it('空のボードは常に正しい寸法を持つ', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          // Given: 空のボードを作成
          const board = createEmptyBoard();

          // Then: 標準テトリス寸法を満たす
          expect(board).toHaveLength(BOARD_HEIGHT);
          expect(board.every(row => row.length === BOARD_WIDTH)).toBe(true);

          // Then: 全セルが空である
          expect(board.every(row => row.every(cell => cell === 0))).toBe(true);
        })
      );
    });
  });

  describe('ピース回転の不変条件', () => {
    it('ピース回転は形状の面積を保持する', () => {
      fc.assert(
        fc.property(tetrominoArb, originalPiece => {
          // Given: 任意のテトロミノ
          const rotatedPiece = rotateTetromino(originalPiece);

          // When: ピースを回転
          const originalCells = originalPiece.shape
            .flat()
            .filter(cell => cell !== 0).length;
          const rotatedCells = rotatedPiece.shape
            .flat()
            .filter(cell => cell !== 0).length;

          // Then: 非空セル数が保持される
          expect(rotatedCells).toBe(originalCells);

          // Then: 型と色が保持される
          expect(rotatedPiece.type).toBe(originalPiece.type);
          expect(rotatedPiece.color).toBe(originalPiece.color);
        })
      );
    });

    it('4回回転すると元の形状に戻る（I型とO型以外）', () => {
      fc.assert(
        fc.property(
          tetrominoArb.filter(piece => piece.type !== 'O'),
          originalPiece => {
            // Given: 任意のテトロミノ（O型以外）
            // When: 4回連続回転
            let rotatedPiece = originalPiece;
            for (let i = 0; i < 4; i++) {
              rotatedPiece = rotateTetromino(rotatedPiece);
            }

            // Then: 元の形状に戻る（位置は保持）
            expect(rotatedPiece.shape).toEqual(originalPiece.shape);
            expect(rotatedPiece.position).toEqual(originalPiece.position);
          }
        )
      );
    });
  });

  describe('位置検証の不変条件', () => {
    it('ボード外の位置は常に無効', () => {
      fc.assert(
        fc.property(
          boardArb,
          tetrominoArb,
          fc.record({
            x: fc.integer({ min: BOARD_WIDTH, max: BOARD_WIDTH + 10 }),
            y: fc.integer({ min: 0, max: BOARD_HEIGHT - 1 }),
          }),
          (board, tetromino, outOfBoundsPos) => {
            // Given: ボード外のX座標
            // When: 位置を検証
            const isValid = isValidPosition(board, tetromino, outOfBoundsPos);

            // Then: 無効と判定される
            expect(isValid).toBe(false);
          }
        )
      );
    });

    it('負のY座標でも一部の位置は有効（ピースの上部がボード外でも可）', () => {
      fc.assert(
        fc.property(
          boardArb,
          tetrominoArb,
          fc.record({
            x: fc.integer({ min: 0, max: BOARD_WIDTH - 1 }),
            y: fc.integer({ min: -3, max: -1 }),
          }),
          (board, tetromino, negativeYPos) => {
            // Given: 負のY座標の位置
            // When: 位置を検証
            const isValid = isValidPosition(board, tetromino, negativeYPos);

            // Then: 結果は一貫している（エラーが発生しない）
            expect(typeof isValid).toBe('boolean');
          }
        )
      );
    });
  });

  describe('ピース配置の不変条件', () => {
    it('ピース配置はボードの寸法を変更しない', () => {
      fc.assert(
        fc.property(boardArb, tetrominoArb, (board, tetromino) => {
          // Given: 任意のボードとテトロミノ
          // When: ピースを配置
          const newBoard = placeTetromino(board, tetromino);

          // Then: ボード寸法が保持される
          expect(newBoard).toHaveLength(BOARD_HEIGHT);
          expect(newBoard.every(row => row.length === BOARD_WIDTH)).toBe(true);

          // Then: 元のボードは変更されない（純粋関数）
          expect(board).not.toBe(newBoard);
        })
      );
    });

    it('配置後のボードは元のボード以上のセル数を持つ', () => {
      fc.assert(
        fc.property(boardArb, tetrominoArb, (board, tetromino) => {
          // Given: 任意のボードとテトロミノ
          const originalCells = board.flat().filter(cell => cell !== 0).length;

          // When: ピースを配置
          const newBoard = placeTetromino(board, tetromino);
          const newCells = newBoard.flat().filter(cell => cell !== 0).length;

          // Then: 非空セル数が増加または同じ
          expect(newCells).toBeGreaterThanOrEqual(originalCells);
        })
      );
    });
  });

  describe('ライン消去の不変条件', () => {
    it('ライン消去後もボード寸法が保持される', () => {
      fc.assert(
        fc.property(boardArb, board => {
          // Given: 任意のボード
          // When: ライン消去を実行
          const { newBoard, linesCleared } = clearLines(board);

          // Then: ボード寸法が保持される
          expect(newBoard).toHaveLength(BOARD_HEIGHT);
          expect(newBoard.every(row => row.length === BOARD_WIDTH)).toBe(true);

          // Then: 消去ライン数は合理的範囲内
          expect(linesCleared).toBeGreaterThanOrEqual(0);
          expect(linesCleared).toBeLessThanOrEqual(BOARD_HEIGHT);
        })
      );
    });

    it('完全に埋まったラインがない場合、ボードが変更されない', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.array(
              fc
                .constantFrom(0, 1)
                .filter(cell => Math.random() < 0.8 || cell === 0),
              { minLength: BOARD_WIDTH, maxLength: BOARD_WIDTH }
            ),
            { minLength: BOARD_HEIGHT, maxLength: BOARD_HEIGHT }
          ),
          incompleteBoard => {
            // Given: 不完全なライン（0を含む）のボード
            // When: ライン消去を実行
            const { newBoard, linesCleared } = clearLines(incompleteBoard);

            // 完全なラインがないことを確認
            const hasCompleteLine = incompleteBoard.some(row =>
              row.every(cell => cell !== 0)
            );

            if (!hasCompleteLine) {
              // Then: ボードが変更されない
              expect(newBoard).toEqual(incompleteBoard);
              expect(linesCleared).toBe(0);
            }
          }
        )
      );
    });
  });

  describe('スコア計算の不変条件', () => {
    it('スコアは非負値である', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 4 }),
          fc.integer({ min: 0, max: 100 }),
          (linesCleared, level) => {
            // Given: 任意のライン数とレベル
            // When: スコアを計算
            const score = calculateScore(linesCleared, level);

            // Then: スコアは非負
            expect(score).toBeGreaterThanOrEqual(0);
          }
        )
      );
    });

    it('より多くのライン消去でより高いスコア（同レベル）', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }),
          fc.integer({ min: 1, max: 4 }),
          fc.integer({ min: 1, max: 4 }),
          (level, lines1, lines2) => {
            // Given: 同じレベルでの異なるライン数
            const score1 = calculateScore(lines1, level);
            const score2 = calculateScore(lines2, level);

            // When: ライン数を比較
            if (lines1 < lines2) {
              // Then: より多いライン消去でより高いスコア
              expect(score1).toBeLessThanOrEqual(score2);
            }
          }
        )
      );
    });
  });

  describe('レベル計算の不変条件', () => {
    it('レベルは消去ライン数に基づいて単調増加', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 200 }),
          fc.integer({ min: 0, max: 200 }),
          (lines1, lines2) => {
            // Given: 異なる消去ライン数
            const level1 = calculateLevel(lines1);
            const level2 = calculateLevel(lines2);

            // When: ライン数を比較
            if (lines1 <= lines2) {
              // Then: レベルも単調増加
              expect(level1).toBeLessThanOrEqual(level2);
            }
          }
        )
      );
    });

    it('レベルは非負整数', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 1000 }), lines => {
          // Given: 任意の消去ライン数
          const level = calculateLevel(lines);

          // Then: レベルは非負整数
          expect(level).toBeGreaterThanOrEqual(0);
          expect(Number.isInteger(level)).toBe(true);
        })
      );
    });
  });

  describe('ドロップ速度の不変条件', () => {
    it('ドロップ速度は正の値', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), level => {
          // Given: 任意のレベル
          // When: ドロップ速度を計算
          const speed = getDropSpeed(level);

          // Then: 速度は正の値
          expect(speed).toBeGreaterThan(0);
        })
      );
    });

    it('レベルが上がると速度が上がる（値は下がる）', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 15 }), level => {
          // Given: 連続するレベル
          const speed1 = getDropSpeed(level);
          const speed2 = getDropSpeed(level + 1);

          // When: レベルを比較
          // Then: 高いレベルでより速い（値は小さい）、または最小値に到達
          expect(speed2).toBeLessThanOrEqual(speed1);
        })
      );
    });
  });

  describe('ゲームオーバー判定の不変条件', () => {
    it('ゲームオーバー判定は一貫している', () => {
      fc.assert(
        fc.property(boardArb, tetrominoArb, (board, piece) => {
          // Given: 任意のボードとピース
          // When: ゲームオーバーを判定
          const gameOver1 = isGameOver(board, piece);
          const gameOver2 = isGameOver(board, piece);

          // Then: 結果が一貫している
          expect(gameOver1).toBe(gameOver2);

          // Then: ブール値を返す
          expect(typeof gameOver1).toBe('boolean');
        })
      );
    });

    it('有効な位置ではゲームオーバーにならない', () => {
      fc.assert(
        fc.property(
          boardArb,
          tetrominoArb,
          positionArb,
          (board, piece, position) => {
            // Given: 任意のボード、ピース、位置
            const pieceAtPosition = { ...piece, position };

            // When: 位置が有効な場合
            if (isValidPosition(board, pieceAtPosition, position)) {
              // Then: ゲームオーバーではない
              expect(isGameOver(board, pieceAtPosition)).toBe(false);
            }
          }
        )
      );
    });
  });

  describe('🔥 エッジケースと境界値のProperty-Based Testing', () => {
    it('極端に大きな座標でも関数が例外を投げない', () => {
      fc.assert(
        fc.property(
          boardArb,
          tetrominoArb,
          fc.record({
            x: fc.integer({ min: -1000, max: 1000 }),
            y: fc.integer({ min: -1000, max: 1000 }),
          }),
          (board, tetromino, extremePosition) => {
            // Given: 極端な座標
            // When: 位置検証を実行
            // Then: 例外が発生しない
            expect(() => {
              isValidPosition(board, tetromino, extremePosition);
            }).not.toThrow();
          }
        ),
        { numRuns: TEST_RUNS }
      );
    });

    it('大量のライン消去でもスコア計算が正常動作', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 20 }),
          fc.integer({ min: 0, max: 1000 }),
          (linesCleared, level) => {
            // Given: 大量のライン消去とレベル
            // When: スコア計算
            const score = calculateScore(linesCleared, level);

            // Then: 有限の数値が返される
            expect(Number.isFinite(score)).toBe(true);
            expect(score).toBeGreaterThanOrEqual(0);
          }
        ),
        { numRuns: TEST_RUNS }
      );
    });

    it('複数回の回転操作が安定している', () => {
      fc.assert(
        fc.property(
          tetrominoArb,
          fc.integer({ min: 1, max: 20 }),
          (originalPiece, rotations) => {
            // Given: 任意のピースと回転回数
            let piece = originalPiece;

            // When: 複数回回転
            for (let i = 0; i < rotations; i++) {
              piece = rotateTetromino(piece);
            }

            // Then: 基本プロパティが保持される
            expect(piece.type).toBe(originalPiece.type);
            expect(piece.color).toBe(originalPiece.color);
            expect(piece.position).toEqual(originalPiece.position);

            // Then: 形状の整合性が保たれる
            const cellCount = piece.shape
              .flat()
              .filter(cell => cell !== 0).length;
            const originalCellCount = originalPiece.shape
              .flat()
              .filter(cell => cell !== 0).length;
            expect(cellCount).toBe(originalCellCount);
          }
        ),
        { numRuns: TEST_RUNS }
      );
    });

    it('完全に埋まったボードでもライン消去が正常動作', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          // Given: 完全に埋まったボード
          const fullBoard = Array(BOARD_HEIGHT)
            .fill(null)
            .map(() => Array(BOARD_WIDTH).fill(1));

          // When: ライン消去
          const { newBoard, linesCleared } = clearLines(fullBoard);

          // Then: 全ライン消去される
          expect(linesCleared).toBe(BOARD_HEIGHT);

          // Then: 新しいボードは空
          expect(newBoard.every(row => row.every(cell => cell === 0))).toBe(
            true
          );

          // Then: 寸法が保持される
          expect(newBoard).toHaveLength(BOARD_HEIGHT);
          expect(newBoard.every(row => row.length === BOARD_WIDTH)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('様々なボード状態でピース配置が一貫している', () => {
      fc.assert(
        fc.property(
          boardArb,
          tetrominoArb,
          fc.array(
            fc.record({
              x: fc.integer({ min: -2, max: BOARD_WIDTH + 2 }),
              y: fc.integer({ min: -2, max: BOARD_HEIGHT + 2 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (board, piece, positions) => {
            // Given: 様々な位置でのピース配置テスト
            positions.forEach(position => {
              const pieceAtPosition = { ...piece, position };

              // When: ピース配置
              const newBoard = placeTetromino(board, pieceAtPosition);

              // Then: ボードの整合性が保たれる
              expect(newBoard).toHaveLength(BOARD_HEIGHT);
              expect(newBoard.every(row => row.length === BOARD_WIDTH)).toBe(
                true
              );
              expect(
                newBoard.every(row =>
                  row.every(cell => cell === 0 || cell === 1)
                )
              ).toBe(true);
            });
          }
        ),
        { numRuns: TEST_RUNS / 2 }
      );
    });
  });

  describe('⚡ パフォーマンスProperty-Based Testing', () => {
    it('大量の操作でも合理的な時間で完了する', () => {
      fc.assert(
        fc.property(
          fc.array(tetrominoArb, { minLength: 10, maxLength: 100 }),
          pieces => {
            // Given: 大量のピース操作
            const startTime = performance.now();

            let board = createEmptyBoard();

            // When: 連続的な操作を実行
            pieces.forEach(piece => {
              // 位置検証
              isValidPosition(board, piece, piece.position);

              // ピース配置
              board = placeTetromino(board, piece);

              // ライン消去
              const result = clearLines(board);
              board = result.newBoard;

              // 回転
              rotateTetromino(piece);
            });

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Then: 合理的な時間で完了（10秒以内）
            expect(duration).toBeLessThan(10000);
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});
