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
  TetrominoType,
} from '@/types/tetris';

/**
 * テトリスゲームの仕様化テスト
 * t-wada流のテスト設計：ビジネス要件を明確に表現し、
 * 実装者の意図よりも利用者の期待を重視したテスト
 */

describe('テトリス仕様', () => {
  describe('ゲームボードの仕様', () => {
    describe('空のボード作成時', () => {
      it('標準サイズ（10x20）のボードが作成される', () => {
        const board = createEmptyBoard();

        expect(board, 'ボードの高さが20である').toHaveLength(BOARD_HEIGHT);
        expect(board[0], 'ボードの幅が10である').toHaveLength(BOARD_WIDTH);
      });

      it('全てのセルが空（値0）で初期化される', () => {
        const board = createEmptyBoard();

        const allCellsEmpty = board.every(row => row.every(cell => cell === 0));

        expect(allCellsEmpty, '全セルが初期状態（空）である').toBe(true);
      });
    });
  });

  describe('テトロミノ（ゲームピース）の仕様', () => {
    describe('ランダムピース生成時', () => {
      it('7種類のうちいずれかのピースが生成される', () => {
        const validTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

        // 複数回生成して全て有効な型であることを確認
        Array.from({ length: 100 }, () => {
          const piece = getRandomTetromino();
          expect(validTypes, `ピース種別${piece.type}は有効である`).toContain(
            piece.type
          );
        });
      });

      it('生成されたピースは必要な属性を全て持つ', () => {
        const piece = getRandomTetromino();

        expect(piece, 'ピース種別を持つ').toHaveProperty('type');
        expect(piece, 'ピース形状を持つ').toHaveProperty('shape');
        expect(piece, 'ピース位置を持つ').toHaveProperty('position');
        expect(piece, 'ピース色を持つ').toHaveProperty('color');
      });

      it('ピースは適正な初期位置（上部中央）に配置される', () => {
        const piece = getRandomTetromino();

        expect(
          piece.position.x,
          'X座標がボード中央付近である'
        ).toBeGreaterThanOrEqual(3);
        expect(
          piece.position.x,
          'X座標がボード中央付近である'
        ).toBeLessThanOrEqual(5);
        expect(piece.position.y, 'Y座標がボード上部である').toBe(0);
      });

      it('Iピース（棒）は正確に4ブロックの直線である', () => {
        // Iピースの形状仕様を明確化
        const iPieceShape = TETROMINO_SHAPES.I;
        const blockCount = iPieceShape.flat().filter(cell => cell === 1).length;

        expect(blockCount, 'Iピースは4ブロックで構成される').toBe(4);

        // 水平線かどうかを確認
        const hasHorizontalLine = iPieceShape.some(
          row => row.filter(cell => cell === 1).length === 4
        );

        expect(hasHorizontalLine, 'Iピースは水平直線を形成する').toBe(true);
      });

      it('Oピース（四角）は正確に2x2の正方形である', () => {
        const oPieceShape = TETROMINO_SHAPES.O;
        const blockCount = oPieceShape.flat().filter(cell => cell === 1).length;

        expect(blockCount, 'Oピースは4ブロックで構成される').toBe(4);

        // 2x2の正方形パターンを確認
        expect(oPieceShape[0]?.[0], 'Oピースは左上にブロックを持つ').toBe(1);
        expect(oPieceShape[0]?.[1], 'Oピースは右上にブロックを持つ').toBe(1);
        expect(oPieceShape[1]?.[0], 'Oピースは左下にブロックを持つ').toBe(1);
        expect(oPieceShape[1]?.[1], 'Oピースは右下にブロックを持つ').toBe(1);
      });
    });

    describe('ピース回転時', () => {
      it('Iピースの回転で縦横が切り替わる', () => {
        const originalPiece = getRandomTetromino();
        // Iピースの場合のみテスト
        if (originalPiece.type !== 'I') {
          originalPiece.type = 'I';
          originalPiece.shape = TETROMINO_SHAPES.I;
        }

        const rotatedPiece = rotateTetromino(originalPiece);

        expect(rotatedPiece.type, 'ピース種別は回転後も変わらない').toBe('I');
        expect(rotatedPiece.shape, '回転後の形状は元と異なる').not.toEqual(
          originalPiece.shape
        );
      });

      it('Oピースは回転しても形状が変わらない', () => {
        const originalPiece = getRandomTetromino();
        originalPiece.type = 'O';
        originalPiece.shape = TETROMINO_SHAPES.O;

        const rotatedPiece = rotateTetromino(originalPiece);

        expect(rotatedPiece.shape, 'Oピースは回転不変である').toEqual(
          originalPiece.shape
        );
      });

      it('回転後もブロック数は保持される', () => {
        const originalPiece = getRandomTetromino();
        const rotatedPiece = rotateTetromino(originalPiece);

        const originalBlockCount = originalPiece.shape
          .flat()
          .filter(cell => cell === 1).length;
        const rotatedBlockCount = rotatedPiece.shape
          .flat()
          .filter(cell => cell === 1).length;

        expect(rotatedBlockCount, 'ピース回転後もブロック数は保持される').toBe(
          originalBlockCount
        );
      });
    });
  });

  describe('ピース配置の仕様', () => {
    let emptyBoard: number[][];

    beforeEach(() => {
      emptyBoard = createEmptyBoard();
    });

    describe('配置可能性の判定', () => {
      it('空のボード上の有効な位置では配置可能である', () => {
        const piece = getRandomTetromino();
        piece.position = { x: 5, y: 5 }; // ボード中央

        const canPlace = isValidPosition(emptyBoard, piece, piece.position);

        expect(canPlace, '空ボード中央への配置は可能である').toBe(true);
      });

      it('ボード境界外への配置は不可能である', () => {
        const piece = getRandomTetromino();

        const testCases = [
          { x: -1, y: 5, description: '左境界外' },
          { x: BOARD_WIDTH, y: 5, description: '右境界外' },
          { x: 5, y: BOARD_HEIGHT, description: '下境界外' },
        ];

        testCases.forEach(({ x, y, description }) => {
          const canPlace = isValidPosition(emptyBoard, piece, { x, y });
          expect(canPlace, `${description}への配置は不可能である`).toBe(false);
        });
      });

      it('他のピースと重複する位置への配置は不可能である', () => {
        // ボード下部に障害物を配置
        emptyBoard[BOARD_HEIGHT - 1]![5] = 1;

        const piece = getRandomTetromino();
        piece.position = { x: 5, y: BOARD_HEIGHT - 1 };

        const canPlace = isValidPosition(emptyBoard, piece, piece.position);

        expect(canPlace, '既存ブロックとの重複配置は不可能である').toBe(false);
      });
    });

    describe('ピース配置実行時', () => {
      it('配置したピースがボードに反映される', () => {
        const piece = getRandomTetromino();
        piece.position = { x: 5, y: 18 }; // ボード下部

        const newBoard = placeTetromino(emptyBoard, piece);

        // 元のボードは変更されない（不変性）
        expect(emptyBoard, '元ボードは変更されない').toEqual(
          createEmptyBoard()
        );

        // 新しいボードにピースが配置される
        const hasPlacedBlocks = newBoard.some(row =>
          row.some(cell => cell === 1)
        );
        expect(hasPlacedBlocks, '新ボードにピースが配置される').toBe(true);
      });
    });
  });

  describe('ライン消去の仕様', () => {
    let boardWithCompleteLine: number[][];

    beforeEach(() => {
      boardWithCompleteLine = createEmptyBoard();
      // 最下段を完全に埋める
      for (let x = 0; x < BOARD_WIDTH; x++) {
        boardWithCompleteLine[BOARD_HEIGHT - 1]![x] = 1;
      }
    });

    it('完全に埋まったラインは消去される', () => {
      const result = clearLines(boardWithCompleteLine);

      expect(result.linesCleared, '1ライン消去される').toBe(1);

      // 最下段が空になっていることを確認
      const bottomRow = result.newBoard[BOARD_HEIGHT - 1];
      const isBottomEmpty = bottomRow?.every(cell => cell === 0);
      expect(isBottomEmpty, '消去されたラインは空になる').toBe(true);
    });

    it('複数の完全ラインは同時に消去される', () => {
      // 下2段を完全に埋める
      for (let y = BOARD_HEIGHT - 2; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          boardWithCompleteLine[y]![x] = 1;
        }
      }

      const result = clearLines(boardWithCompleteLine);

      expect(result.linesCleared, '2ライン同時消去される').toBe(2);
    });

    it('不完全なラインは消去されない', () => {
      // 最下段の一部のみを埋める
      const incompleteBoard = createEmptyBoard();
      for (let x = 0; x < BOARD_WIDTH - 1; x++) {
        // 1セル未満
        incompleteBoard[BOARD_HEIGHT - 1]![x] = 1;
      }

      const result = clearLines(incompleteBoard);

      expect(result.linesCleared, '不完全ラインは消去されない').toBe(0);
    });
  });

  describe('スコアリングの仕様', () => {
    it('ライン消去数に応じてスコアが計算される', () => {
      const testCases = [
        { lines: 1, level: 1, expectedMin: 40, description: '1ライン消去' },
        { lines: 2, level: 1, expectedMin: 100, description: '2ライン消去' },
        { lines: 3, level: 1, expectedMin: 300, description: '3ライン消去' },
        {
          lines: 4,
          level: 1,
          expectedMin: 1200,
          description: '4ライン消去（テトリス）',
        },
      ];

      testCases.forEach(({ lines, level, expectedMin, description }) => {
        const score = calculateScore(lines, level);
        expect(score, `${description}の基本スコア`).toBeGreaterThanOrEqual(
          expectedMin
        );
      });
    });

    it('レベルが高いほどスコアボーナスが増加する', () => {
      const level1Score = calculateScore(1, 1);
      const level5Score = calculateScore(1, 5);

      expect(level5Score, 'レベル5でのスコアがレベル1より高い').toBeGreaterThan(
        level1Score
      );
    });

    it('テトリス（4ライン同時消去）は特別な高得点である', () => {
      const singleLineScore = calculateScore(1, 1);
      const tetrisScore = calculateScore(4, 1);

      expect(
        tetrisScore,
        'テトリスは1ライン×4倍より大幅に高得点'
      ).toBeGreaterThan(singleLineScore * 10);
    });
  });

  describe('レベル進行の仕様', () => {
    it('10ライン消去ごとにレベルが上がる', () => {
      expect(calculateLevel(0), 'ゲーム開始時はレベル0').toBe(0);
      expect(calculateLevel(9), '9ライン消去時はレベル0').toBe(0);
      expect(calculateLevel(10), '10ライン消去時はレベル1').toBe(1);
      expect(calculateLevel(25), '25ライン消去時はレベル2').toBe(2);
    });
  });

  describe('ゲーム速度の仕様', () => {
    it('レベルが上がるほど落下速度が速くなる', () => {
      const level1Speed = getDropSpeed(1);
      const level5Speed = getDropSpeed(5);
      const level10Speed = getDropSpeed(10);

      expect(level5Speed, 'レベル5はレベル1より速い').toBeLessThan(level1Speed);
      expect(level10Speed, 'レベル10はレベル5より速い').toBeLessThan(
        level5Speed
      );
    });

    it('速度には下限が設定されている', () => {
      const extremelyHighLevelSpeed = getDropSpeed(999);

      expect(
        extremelyHighLevelSpeed,
        '最高速度でも適度な間隔を保つ'
      ).toBeGreaterThanOrEqual(50);
    });
  });

  describe('ゲーム終了条件の仕様', () => {
    it('ボード上部に新しいピースが配置できない場合はゲームオーバー', () => {
      // ボード上部を埋める
      const fullTopBoard = createEmptyBoard();
      for (let x = 0; x < BOARD_WIDTH; x++) {
        fullTopBoard[0]![x] = 1;
        fullTopBoard[1]![x] = 1;
      }

      const piece = getRandomTetromino();

      const gameOver = isGameOver(fullTopBoard, piece);

      expect(gameOver, 'ボード上部が満杯の場合はゲームオーバー').toBe(true);
    });

    it('ボードに余裕がある場合はゲームは継続する', () => {
      const emptyBoard = createEmptyBoard();
      const piece = getRandomTetromino();

      const gameOver = isGameOver(emptyBoard, piece);

      expect(gameOver, '空ボードではゲームは継続する').toBe(false);
    });
  });
});
