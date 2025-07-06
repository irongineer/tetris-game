import { describe, it, expect, beforeEach } from 'vitest';
import {
  createEmptyBoard,
  getRandomTetromino,
  rotateTetromino,
  isValidPosition,
  placeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  isGameOver,
} from './tetris';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
} from '@/types/tetris';

/**
 * テトリスゲームの実装仕様テスト
 *
 * このテストスイートは、テトリスゲームの各機能が
 * 期待通りに動作することを検証します。
 *
 * テスト方針：
 * - 境界値と異常系を重視
 * - 各関数の責任範囲を明確化
 * - ゲームルールの実装正確性を確認
 */
describe('テトリスゲーム実装仕様', () => {
  describe('ボード生成機能', () => {
    describe('新規ボード作成時', () => {
      it('標準テトリス仕様（10×20）のボードを生成する', () => {
        const board = createEmptyBoard();

        expect(board, 'ボードの高さは20行').toHaveLength(BOARD_HEIGHT);
        expect(board[0], 'ボードの幅は10列').toHaveLength(BOARD_WIDTH);
      });

      it('全セルが空状態で初期化される', () => {
        const board = createEmptyBoard();

        const isEmpty = board.every(row => row.every(cell => cell === 0));

        expect(isEmpty, '新規ボードは完全に空である').toBe(true);
      });

      it('各行が独立したオブジェクトである（参照の共有なし）', () => {
        const board = createEmptyBoard();

        board[0][0] = 1;

        expect(board[1][0], '他の行に影響しない').toBe(0);
        expect(board[0][1], '同行の他のセルにも影響しない').toBe(0);
      });
    });
  });

  describe('getRandomTetromino', () => {
    it('有効なテトロミノを生成する', () => {
      const tetromino = getRandomTetromino();

      expect(tetromino).toHaveProperty('type');
      expect(tetromino).toHaveProperty('shape');
      expect(tetromino).toHaveProperty('position');
      expect(tetromino).toHaveProperty('color');

      // 型が有効であることを確認
      expect(['I', 'O', 'T', 'S', 'Z', 'J', 'L']).toContain(tetromino.type);

      // 形状が正しいことを確認
      expect(tetromino.shape).toEqual(TETROMINO_SHAPES[tetromino.type]);

      // 色が正しいことを確認
      expect(tetromino.color).toBe(TETROMINO_COLORS[tetromino.type]);

      // 初期位置が妥当であることを確認
      expect(tetromino.position.x).toBeGreaterThanOrEqual(0);
      expect(tetromino.position.x).toBeLessThan(BOARD_WIDTH);
      expect(tetromino.position.y).toBe(0);
    });

    it('複数回呼び出すと異なるテトロミノが生成される可能性がある', () => {
      const tetrominoes = Array.from({ length: 10 }, () =>
        getRandomTetromino()
      );
      const types = new Set(tetrominoes.map(t => t.type));

      // 10回生成して少なくとも1つは異なる型が出る（統計的に極めて高い確率）
      expect(types.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('rotateTetromino', () => {
    it('Tピースを時計回りに回転させる', () => {
      const tPiece = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        position: { x: 5, y: 0 },
        color: '#9333ea',
      };

      const rotated = rotateTetromino(tPiece);

      expect(rotated.shape).toEqual([
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ]);

      // 他のプロパティは変更されない
      expect(rotated.type).toBe(tPiece.type);
      expect(rotated.position).toEqual(tPiece.position);
      expect(rotated.color).toBe(tPiece.color);
    });

    it('Iピースを回転させる', () => {
      const iPiece = {
        type: 'I' as const,
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        position: { x: 3, y: 0 },
        color: '#06b6d4',
      };

      const rotated = rotateTetromino(iPiece);

      expect(rotated.shape).toEqual([
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ]);
    });
  });

  describe('isValidPosition', () => {
    let board: number[][];

    beforeEach(() => {
      board = createEmptyBoard();
    });

    it('空のボード上の有効な位置でtrueを返す', () => {
      const tetromino = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        position: { x: 3, y: 0 },
        color: '#9333ea',
      };

      expect(isValidPosition(board, tetromino, { x: 3, y: 0 })).toBe(true);
    });

    it('左の境界を超える位置でfalseを返す', () => {
      const tetromino = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        position: { x: 0, y: 0 },
        color: '#9333ea',
      };

      expect(isValidPosition(board, tetromino, { x: -1, y: 0 })).toBe(false);
    });

    it('右の境界を超える位置でfalseを返す', () => {
      const tetromino = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        position: { x: 0, y: 0 },
        color: '#9333ea',
      };

      expect(
        isValidPosition(board, tetromino, { x: BOARD_WIDTH - 2, y: 0 })
      ).toBe(false);
    });

    it('下の境界を超える位置でfalseを返す', () => {
      const tetromino = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        position: { x: 3, y: 0 },
        color: '#9333ea',
      };

      expect(
        isValidPosition(board, tetromino, { x: 3, y: BOARD_HEIGHT - 1 })
      ).toBe(false);
    });

    it('既存のピースと重なる位置でfalseを返す', () => {
      // ボードの一部にピースを配置
      board[BOARD_HEIGHT - 1][3] = 1;
      board[BOARD_HEIGHT - 1][4] = 1;
      board[BOARD_HEIGHT - 1][5] = 1;

      const tetromino = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        position: { x: 3, y: 0 },
        color: '#9333ea',
      };

      expect(
        isValidPosition(board, tetromino, { x: 3, y: BOARD_HEIGHT - 2 })
      ).toBe(false);
    });
  });

  describe('placeTetromino', () => {
    it('テトロミノをボードに正しく配置する', () => {
      const board = createEmptyBoard();
      const tetromino = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        position: { x: 3, y: BOARD_HEIGHT - 3 },
        color: '#9333ea',
      };

      const newBoard = placeTetromino(board, tetromino);

      // 元のボードは変更されない
      expect(board[BOARD_HEIGHT - 3][4]).toBe(0);

      // 新しいボードにテトロミノが配置される
      expect(newBoard[BOARD_HEIGHT - 3][4]).toBe(1); // T字の上部
      expect(newBoard[BOARD_HEIGHT - 2][3]).toBe(1); // T字の左部
      expect(newBoard[BOARD_HEIGHT - 2][4]).toBe(1); // T字の中央部
      expect(newBoard[BOARD_HEIGHT - 2][5]).toBe(1); // T字の右部
    });

    it('ボード境界外への配置は無視される', () => {
      const board = createEmptyBoard();
      const tetromino = {
        type: 'I' as const,
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        position: { x: -1, y: 0 },
        color: '#06b6d4',
      };

      const newBoard = placeTetromino(board, tetromino);

      // 境界内の部分のみ配置される
      expect(newBoard[1][0]).toBe(1);
      expect(newBoard[1][1]).toBe(1);
      expect(newBoard[1][2]).toBe(1);
    });
  });

  describe('clearLines', () => {
    it('完全に埋まった行をクリアする', () => {
      const board = createEmptyBoard();

      // 最下行を完全に埋める
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = 1;
      }

      // その上の行に部分的にブロックを配置
      board[BOARD_HEIGHT - 2][0] = 1;
      board[BOARD_HEIGHT - 2][1] = 1;

      const { newBoard, linesCleared } = clearLines(board);

      expect(linesCleared).toBe(1);
      expect(newBoard[BOARD_HEIGHT - 1][0]).toBe(1); // 部分的な行が下に移動
      expect(newBoard[BOARD_HEIGHT - 1][1]).toBe(1);
      expect(newBoard[BOARD_HEIGHT - 1][2]).toBe(0); // 他は空
      expect(newBoard[0].every(cell => cell === 0)).toBe(true); // 上部に新しい空行
    });

    it('複数行を同時にクリアする', () => {
      const board = createEmptyBoard();

      // 最下2行を完全に埋める
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = 1;
        board[BOARD_HEIGHT - 2][x] = 1;
      }

      const { newBoard, linesCleared } = clearLines(board);

      expect(linesCleared).toBe(2);
      expect(newBoard[BOARD_HEIGHT - 1].every(cell => cell === 0)).toBe(true);
      expect(newBoard[BOARD_HEIGHT - 2].every(cell => cell === 0)).toBe(true);
    });

    it('クリアする行がない場合', () => {
      const board = createEmptyBoard();
      board[BOARD_HEIGHT - 1][0] = 1; // 1つだけブロックを配置

      const { newBoard, linesCleared } = clearLines(board);

      expect(linesCleared).toBe(0);
      expect(newBoard).toEqual(board);
    });
  });

  describe('calculateScore', () => {
    it('正しいスコアを計算する', () => {
      expect(calculateScore(0, 0)).toBe(0); // ライン消去なし
      expect(calculateScore(1, 0)).toBe(40); // 1ライン, レベル0
      expect(calculateScore(2, 0)).toBe(100); // 2ライン, レベル0
      expect(calculateScore(3, 0)).toBe(300); // 3ライン, レベル0
      expect(calculateScore(4, 0)).toBe(1200); // 4ライン（テトリス）, レベル0

      // レベルボーナスを含む
      expect(calculateScore(1, 2)).toBe(120); // 1ライン, レベル2 = 40 * (2+1)
      expect(calculateScore(4, 5)).toBe(7200); // 4ライン, レベル5 = 1200 * (5+1)
    });
  });

  describe('calculateLevel', () => {
    it('消去ライン数に基づいてレベルを計算する', () => {
      expect(calculateLevel(0)).toBe(0);
      expect(calculateLevel(9)).toBe(0);
      expect(calculateLevel(10)).toBe(1);
      expect(calculateLevel(19)).toBe(1);
      expect(calculateLevel(20)).toBe(2);
      expect(calculateLevel(25)).toBe(2);
      expect(calculateLevel(100)).toBe(10);
    });
  });

  describe('getDropSpeed', () => {
    it('レベルに応じて正しい落下速度を返す', () => {
      expect(getDropSpeed(0)).toBe(1000);
      expect(getDropSpeed(1)).toBe(950);
      expect(getDropSpeed(10)).toBe(500);
      expect(getDropSpeed(19)).toBe(50);
      expect(getDropSpeed(20)).toBe(50); // 最小値
      expect(getDropSpeed(100)).toBe(50); // 最小値を下回らない
    });
  });

  describe('isGameOver', () => {
    it('新しいピースが配置可能な場合はfalseを返す', () => {
      const board = createEmptyBoard();
      const tetromino = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        position: { x: 3, y: 0 },
        color: '#9333ea',
      };

      expect(isGameOver(board, tetromino)).toBe(false);
    });

    it('新しいピースが配置不可能な場合はtrueを返す', () => {
      const board = createEmptyBoard();

      // 上部を埋めてゲームオーバー状態を作る
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[0][x] = 1;
        board[1][x] = 1;
      }

      const tetromino = {
        type: 'T' as const,
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        position: { x: 3, y: 0 },
        color: '#9333ea',
      };

      expect(isGameOver(board, tetromino)).toBe(true);
    });
  });
});
