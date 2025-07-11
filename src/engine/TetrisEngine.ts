import {
  GameState,
  Tetromino,
  TetrominoType,
  Position,
  TetrisConfig,
  RandomGenerator,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
} from '@/types/tetris';

/**
 * テトリスゲームエンジン - 純粋なゲームロジック
 * UIに依存しない、テスタブルなコアエンジン
 *
 * t-wada設計思想:
 * - 副作用のない純粋関数
 * - 依存性注入によるテスタビリティ
 * - 単一責任の原則
 */
export class TetrisEngine {
  private readonly randomGenerator: RandomGenerator;
  private readonly dropSpeedBase: number;
  private readonly dropSpeedDecrement: number;
  private readonly linesPerLevel: number;

  constructor(config: TetrisConfig = {}) {
    this.randomGenerator = config.randomGenerator ?? Math.random;
    this.dropSpeedBase = config.dropSpeedBase ?? 1000;
    this.dropSpeedDecrement = config.dropSpeedDecrement ?? 50;
    this.linesPerLevel = config.linesPerLevel ?? 10;
  }

  /**
   * 空のゲームボードを作成
   */
  public createEmptyBoard(): number[][] {
    return Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(0));
  }

  /**
   * ランダムなテトロミノを生成
   * 依存性注入されたランダム生成器を使用
   */
  public getRandomTetromino(): Tetromino {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const randomIndex = Math.floor(this.randomGenerator() * types.length);
    const randomType = types[randomIndex];

    // 型安全性確保: types配列のインデックスは必ず有効
    if (!randomType) {
      throw new Error('Invalid random tetromino generation');
    }

    return {
      type: randomType,
      shape: TETROMINO_SHAPES[randomType],
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      color: TETROMINO_COLORS[randomType],
    };
  }

  /**
   * テトロミノを回転
   */
  public rotateTetromino(tetromino: Tetromino): Tetromino {
    const firstRow = tetromino.shape[0];
    if (!firstRow) {
      throw new Error('Invalid tetromino shape for rotation');
    }

    const rotatedShape = firstRow.map((_, index) =>
      tetromino.shape
        .map(row => {
          const cell = row[index];
          return cell !== undefined ? cell : 0;
        })
        .reverse()
    );

    return {
      ...tetromino,
      shape: rotatedShape,
    };
  }

  /**
   * 位置の有効性をチェック
   */
  public isValidPosition(
    board: number[][],
    tetromino: Tetromino,
    newPosition: Position
  ): boolean {
    for (let y = 0; y < tetromino.shape.length; y++) {
      const row = tetromino.shape[y];
      if (!row) continue;

      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell !== undefined && cell !== 0) {
          const newX = newPosition.x + x;
          const newY = newPosition.y + y;

          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY]?.[newX] !== 0)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * テトロミノをボードに配置
   */
  public placeTetromino(board: number[][], tetromino: Tetromino): number[][] {
    const newBoard = board.map(row => [...row]);

    for (let y = 0; y < tetromino.shape.length; y++) {
      const row = tetromino.shape[y];
      if (!row) continue;

      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell !== undefined && cell !== 0) {
          const boardY = tetromino.position.y + y;
          const boardX = tetromino.position.x + x;

          if (
            boardY >= 0 &&
            boardY < BOARD_HEIGHT &&
            boardX >= 0 &&
            boardX < BOARD_WIDTH
          ) {
            const targetRow = newBoard[boardY];
            if (targetRow) {
              targetRow[boardX] = 1;
            }
          }
        }
      }
    }

    return newBoard;
  }

  /**
   * 完全なラインをクリア
   */
  public clearLines(board: number[][]): {
    newBoard: number[][];
    linesCleared: number;
  } {
    const newBoard = board.filter(row => !row.every(cell => cell !== 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    return { newBoard, linesCleared };
  }

  /**
   * スコア計算 - 標準テトリス仕様
   */
  public calculateScore(linesCleared: number, level: number): number {
    const baseScores = [0, 40, 100, 300, 1200];
    const clampedLines = Math.min(
      Math.max(0, linesCleared),
      baseScores.length - 1
    );
    const baseScore = baseScores[clampedLines];
    if (baseScore === undefined) {
      throw new Error(`Invalid score calculation for ${linesCleared} lines`);
    }
    return baseScore * (level + 1);
  }

  /**
   * レベル計算
   */
  public calculateLevel(lines: number): number {
    return Math.floor(lines / this.linesPerLevel);
  }

  /**
   * ドロップスピード計算
   */
  public getDropSpeed(level: number): number {
    return Math.max(50, this.dropSpeedBase - level * this.dropSpeedDecrement);
  }

  /**
   * ゲームオーバー判定
   */
  public isGameOver(board: number[][], newPiece: Tetromino): boolean {
    return !this.isValidPosition(board, newPiece, newPiece.position);
  }

  /**
   * ピースの配置処理（共通ロジック抽出）
   * hardDropとdropの重複を排除
   */
  public applyPiecePlacement(
    gameState: GameState,
    piece: Tetromino
  ): Partial<GameState> {
    const newBoard = this.placeTetromino(gameState.board, piece);
    const { newBoard: clearedBoard, linesCleared } = this.clearLines(newBoard);

    const newLines = gameState.lines + linesCleared;
    const newLevel = this.calculateLevel(newLines);
    const newScore =
      gameState.score + this.calculateScore(linesCleared, gameState.level);

    const nextPiece = gameState.nextPiece || this.getRandomTetromino();
    const newCurrentPiece = this.getRandomTetromino();

    if (this.isGameOver(clearedBoard, nextPiece)) {
      return {
        board: clearedBoard,
        currentPiece: null,
        gameOver: true,
        score: newScore,
        lines: newLines,
        level: newLevel,
      };
    }

    return {
      board: clearedBoard,
      currentPiece: nextPiece,
      nextPiece: newCurrentPiece,
      score: newScore,
      lines: newLines,
      level: newLevel,
    };
  }

  /**
   * ハードドロップの最終位置を計算
   */
  public calculateHardDropPosition(
    board: number[][],
    piece: Tetromino
  ): Position {
    let newY = piece.position.y;
    while (
      this.isValidPosition(board, piece, {
        x: piece.position.x,
        y: newY + 1,
      })
    ) {
      newY++;
    }
    return { x: piece.position.x, y: newY };
  }
}
