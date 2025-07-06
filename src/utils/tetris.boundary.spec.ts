import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  getRandomTetromino,
  isValidPosition,
  placeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
} from './tetris';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINO_SHAPES } from '@/types/tetris';

/**
 * 境界値テスト・エッジケーステスト
 *
 * t-wada流の徹底的な境界値テスト
 * - 各関数の入力境界で正しく動作するか
 * - 異常値に対して適切に処理するか
 * - エッジケースでの安全性確認
 */

describe('テトリス境界値・エッジケース仕様', () => {
  describe('ピース配置境界値テスト', () => {
    const board = createEmptyBoard();
    const piece = {
      type: 'I' as const,
      shape: TETROMINO_SHAPES.I,
      position: { x: 0, y: 0 },
      color: '#06b6d4',
    };

    describe('ボード境界での配置判定', () => {
      it.each([
        { x: -1, y: 0, expected: false, desc: '左端境界外（x=-1）' },
        { x: 0, y: 0, expected: true, desc: '左端境界内（x=0）' },
        { x: 6, y: 0, expected: true, desc: 'Iピース配置可能位置（x=6）' },
        { x: 7, y: 0, expected: false, desc: 'Iピース配置不可位置（x=7）' },
        { x: BOARD_WIDTH, y: 0, expected: false, desc: '右端境界外（x=10）' },
        {
          x: 0,
          y: -1,
          expected: true,
          desc: '上端境界外でもIピースなら部分的に表示可能',
        },
        { x: 0, y: 0, expected: true, desc: '上端境界内（y=0）' },
        {
          x: 0,
          y: BOARD_HEIGHT - 1,
          expected: true,
          desc: '下端境界内（y=19）',
        },
        { x: 0, y: BOARD_HEIGHT, expected: false, desc: '下端境界外（y=20）' },
      ])('$desc では期待通りの結果を返す', ({ x, y, expected }) => {
        const result = isValidPosition(board, piece, { x, y });
        expect(result).toBe(expected);
      });
    });

    describe('極端な座標値での安全性', () => {
      it.each([
        { x: -999, y: 0, desc: '極端な負のX座標' },
        { x: 999, y: 0, desc: '極端な正のX座標' },
        { x: 0, y: -999, desc: '極端な負のY座標' },
        { x: 0, y: 999, desc: '極端な正のY座標' },
      ])('$desc でもエラーにならない', ({ x, y }) => {
        expect(() => {
          isValidPosition(board, piece, { x, y });
        }).not.toThrow();
      });
    });
  });

  describe('スコア計算境界値テスト', () => {
    describe('ライン数の境界値', () => {
      it.each([
        { lines: 0, level: 1, desc: '0ライン消去' },
        { lines: 1, level: 1, desc: '1ライン消去（最小）' },
        { lines: 4, level: 1, desc: '4ライン消去（最大）' },
      ])('$desc でも適切なスコアを計算する', ({ lines, level }) => {
        const score = calculateScore(lines, level);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(score)).toBe(true);
      });
    });

    describe('レベルの境界値', () => {
      it.each([
        { lines: 1, level: 0, desc: 'レベル0' },
        { lines: 1, level: 1, desc: 'レベル1（最小実用）' },
        { lines: 1, level: 99, desc: 'レベル99（高レベル）' },
      ])('$desc でも適切なスコアを計算する', ({ lines, level }) => {
        const score = calculateScore(lines, level);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(score)).toBe(true);
      });
    });

    describe('異常値での安全性', () => {
      it.each([
        { lines: -1, level: 1, desc: '負のライン数' },
        { lines: 1, level: -1, desc: '負のレベル' },
        { lines: 999, level: 1, desc: '異常に大きなライン数' },
        { lines: 1, level: 999, desc: '異常に大きなレベル' },
      ])('$desc でもエラーにならない', ({ lines, level }) => {
        expect(() => {
          calculateScore(lines, level);
        }).not.toThrow();
      });
    });
  });

  describe('レベル計算境界値テスト', () => {
    it.each([
      { totalLines: 0, expected: 0, desc: 'ゲーム開始時' },
      { totalLines: 9, expected: 0, desc: 'レベルアップ直前' },
      { totalLines: 10, expected: 1, desc: 'レベルアップちょうど' },
      { totalLines: 19, expected: 1, desc: '次のレベルアップ直前' },
      { totalLines: 20, expected: 2, desc: '2回目のレベルアップ' },
      { totalLines: 999, expected: 99, desc: '極端に多いライン数' },
    ])(
      '$desc（$totalLines ライン）では レベル$expected',
      ({ totalLines, expected }) => {
        const level = calculateLevel(totalLines);
        expect(level).toBe(expected);
      }
    );

    describe('異常値での安全性', () => {
      it('負の値でもエラーにならない', () => {
        expect(() => {
          calculateLevel(-1);
        }).not.toThrow();
      });
    });
  });

  describe('落下速度境界値テスト', () => {
    it.each([
      { level: 0, desc: 'レベル0' },
      { level: 1, desc: 'レベル1' },
      { level: 10, desc: 'レベル10' },
      { level: 20, desc: 'レベル20' },
      { level: 999, desc: 'レベル999' },
    ])('$desc でも妥当な速度を返す', ({ level }) => {
      const speed = getDropSpeed(level);

      expect(speed).toBeGreaterThan(0);
      expect(speed).toBeLessThanOrEqual(1000);
      expect(Number.isInteger(speed)).toBe(true);
    });

    it('レベルが上がるほど速度が速くなる（単調減少）', () => {
      const speeds = Array.from({ length: 20 }, (_, i) => getDropSpeed(i));

      for (let i = 1; i < speeds.length; i++) {
        expect(speeds[i]).toBeLessThanOrEqual(speeds[i - 1]);
      }
    });
  });

  describe('ライン消去境界値テスト', () => {
    describe('ボード満杯時の動作', () => {
      it('ボード全体が満杯でも安全に処理する', () => {
        const fullBoard = Array(BOARD_HEIGHT)
          .fill(null)
          .map(() => Array(BOARD_WIDTH).fill(1));

        expect(() => {
          clearLines(fullBoard);
        }).not.toThrow();
      });

      it('ボード全体が満杯の場合は全ライン消去される', () => {
        const fullBoard = Array(BOARD_HEIGHT)
          .fill(null)
          .map(() => Array(BOARD_WIDTH).fill(1));

        const result = clearLines(fullBoard);

        expect(result.linesCleared).toBe(BOARD_HEIGHT);
        expect(
          result.newBoard.every(row => row.every(cell => cell === 0))
        ).toBe(true);
      });
    });

    describe('部分的な満杯行の処理', () => {
      it('交互に満杯と空の行がある場合も正しく処理する', () => {
        const board = createEmptyBoard();

        // 偶数行のみを満杯にする
        for (let y = 0; y < BOARD_HEIGHT; y += 2) {
          for (let x = 0; x < BOARD_WIDTH; x++) {
            board[y][x] = 1;
          }
        }

        const result = clearLines(board);

        expect(result.linesCleared).toBe(BOARD_HEIGHT / 2);
      });
    });
  });

  describe('ピース配置時の不変性保証', () => {
    it('ピース配置後も元のボードは変更されない', () => {
      const originalBoard = createEmptyBoard();
      const boardCopy = originalBoard.map(row => [...row]);

      const piece = getRandomTetromino();
      piece.position = { x: 5, y: 18 };

      placeTetromino(originalBoard, piece);

      expect(originalBoard).toEqual(boardCopy);
    });

    it('ライン消去後も元のボードは変更されない', () => {
      const board = createEmptyBoard();
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = 1;
      }

      const boardCopy = board.map(row => [...row]);

      clearLines(board);

      expect(board).toEqual(boardCopy);
    });
  });

  describe('型安全性の確認', () => {
    it('すべての公開関数が適切な型を返す', () => {
      const board = createEmptyBoard();
      const piece = getRandomTetromino();

      // 戻り値の型が期待通りであることを確認
      expect(Array.isArray(board)).toBe(true);
      expect(typeof piece.type).toBe('string');
      expect(Array.isArray(piece.shape)).toBe(true);
      expect(typeof piece.position.x).toBe('number');
      expect(typeof piece.position.y).toBe('number');
      expect(typeof piece.color).toBe('string');

      expect(typeof isValidPosition(board, piece, { x: 0, y: 0 })).toBe(
        'boolean'
      );
      expect(typeof calculateScore(1, 1)).toBe('number');
      expect(typeof calculateLevel(10)).toBe('number');
      expect(typeof getDropSpeed(1)).toBe('number');
    });
  });
});
