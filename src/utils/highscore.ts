/**
 * 🏆 ハイスコア機能 - LocalStorage実装
 *
 * t-wada流設計思想:
 * - 外部依存関係の制御
 * - エラーハンドリングの徹底
 * - 純粋関数による予測可能性
 * - 単一責任の原則
 */

import {
  HighScoreEntry,
  HIGH_SCORE_STORAGE_KEY,
  MAX_HIGH_SCORE_ENTRIES,
  MAX_PLAYER_NAME_LENGTH,
} from '@/types/highscore';

/**
 * プレイヤー名をサニタイズ
 */
const sanitizePlayerName = (name: string): string => {
  return name.substring(0, MAX_PLAYER_NAME_LENGTH);
};

/**
 * ハイスコアをスコア降順でソート
 */
const sortScoresByScore = (scores: HighScoreEntry[]): HighScoreEntry[] => {
  return [...scores].sort((a, b) => b.score - a.score);
};

/**
 * ハイスコアを最大件数で制限
 */
const limitScoreEntries = (scores: HighScoreEntry[]): HighScoreEntry[] => {
  return scores.slice(0, MAX_HIGH_SCORE_ENTRIES);
};

/**
 * LocalStorageが利用可能かチェック
 */
const isLocalStorageAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.localStorage;
};

/**
 * ハイスコアを保存
 * リファクタリング: 責任分離と可読性向上
 */
export function saveHighScore(entry: HighScoreEntry): void {
  try {
    const sanitizedEntry: HighScoreEntry = {
      ...entry,
      playerName: sanitizePlayerName(entry.playerName),
    };

    const existingScores = getHighScores();
    const newScores = [...existingScores, sanitizedEntry];
    const sortedScores = sortScoresByScore(newScores);
    const limitedScores = limitScoreEntries(sortedScores);

    if (isLocalStorageAvailable()) {
      localStorage.setItem(
        HIGH_SCORE_STORAGE_KEY,
        JSON.stringify(limitedScores)
      );
    }
  } catch (error) {
    // エラーが発生しても処理を続行
    // eslint-disable-next-line no-console
    console.warn('ハイスコア保存に失敗しました:', error);
  }
}

/**
 * LocalStorageからデータを安全に取得
 */
const getStoredData = (): string | null => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  return localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
};

/**
 * JSONを安全にパース
 */
const parseHighScores = (data: string): HighScoreEntry[] => {
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * ハイスコア一覧を取得
 * リファクタリング: エラーハンドリングの改善と責任分離
 */
export function getHighScores(): HighScoreEntry[] {
  try {
    const storedData = getStoredData();
    if (!storedData) {
      return [];
    }

    return parseHighScores(storedData);
  } catch (error) {
    // 不正なJSONデータの場合は空配列を返す
    // eslint-disable-next-line no-console
    console.warn('ハイスコア読み込みに失敗しました:', error);
    return [];
  }
}

/**
 * ハイスコアをクリア
 * リファクタリング: 統一されたエラーハンドリング
 */
export function clearHighScores(): void {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(HIGH_SCORE_STORAGE_KEY);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('ハイスコアクリアに失敗しました:', error);
  }
}

/**
 * プレイヤー名でスコアをフィルタリング
 */
const filterScoresByPlayer = (
  scores: HighScoreEntry[],
  playerName: string
): HighScoreEntry[] => {
  return scores.filter(score => score.playerName === playerName);
};

/**
 * スコア配列から最高スコアを取得
 */
const findBestScore = (scores: HighScoreEntry[]): HighScoreEntry => {
  return scores.reduce((best, current) =>
    current.score > best.score ? current : best
  );
};

/**
 * プレイヤー別ベストスコアを取得
 * リファクタリング: 責任分離とnull安全性
 */
export function getBestScoreForPlayer(
  playerName: string
): HighScoreEntry | null {
  const allScores = getHighScores();
  const playerScores = filterScoresByPlayer(allScores, playerName);

  if (playerScores.length === 0) {
    return null;
  }

  return findBestScore(playerScores);
}

/**
 * 日付別スコアを取得
 * リファクタリング: 純粋関数による予測可能性
 */
export function getScoresByDate(date: string): HighScoreEntry[] {
  const allScores = getHighScores();
  return allScores.filter(score => score.date === date);
}
