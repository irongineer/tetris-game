/**
 * 🏆 ハイスコア機能の型定義
 *
 * t-wada流設計思想:
 * - 型安全性によるバグ防止
 * - 明確なインターフェース定義
 * - 拡張性を考慮した設計
 */

export interface HighScoreEntry {
  /** スコア */
  score: number;
  /** プレイヤー名 */
  playerName: string;
  /** 記録日 (YYYY-MM-DD形式) */
  date: string;
  /** 到達レベル */
  level: number;
  /** 消去ライン数 */
  lines: number;
}

export interface HighScoreStorage {
  /** ハイスコアを保存 */
  saveScore: (entry: HighScoreEntry) => void;
  /** ハイスコア一覧を取得 */
  getScores: () => HighScoreEntry[];
  /** ハイスコアをクリア */
  clearScores: () => void;
  /** プレイヤー別ベストスコアを取得 */
  getBestScoreForPlayer: (playerName: string) => HighScoreEntry | null;
  /** 日付別スコアを取得 */
  getScoresByDate: (date: string) => HighScoreEntry[];
}

export const HIGH_SCORE_STORAGE_KEY = 'tetris-highscores';
export const MAX_HIGH_SCORE_ENTRIES = 10;
export const MAX_PLAYER_NAME_LENGTH = 20;
