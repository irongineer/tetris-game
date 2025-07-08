import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveHighScore,
  getHighScores,
  clearHighScores,
  getBestScoreForPlayer,
  getScoresByDate,
} from '@/utils/highscore';
import { HighScoreEntry } from '@/types/highscore';

/**
 * 🏆 ハイスコア機能 - t-wada流TDDテスト
 *
 * TDD開発思想:
 * 1. Red: 失敗テストを先に書く
 * 2. Green: 最小限のコードでテストを通す
 * 3. Refactor: コードを改善する
 *
 * t-wada流設計原則:
 * - Given-When-Then構造での仕様明確化
 * - 外部依存関係の制御とテスタビリティ
 * - ユーザーストーリー重視の価値提供
 * - 境界値テストでエッジケース対応
 */

describe('🏆 ハイスコア機能 - TDD実装', () => {
  beforeEach(() => {
    // テスト間でLocalStorageをクリア
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('📁 LocalStorageデータ管理', () => {
    it('[GREEN] ハイスコア保存機能が正常に動作する', () => {
      // Given: 新しいハイスコアエントリ
      const newScore: HighScoreEntry = {
        score: 12500,
        playerName: 'プレイヤー1',
        date: '2024-01-15',
        level: 5,
        lines: 25,
      };

      // When: ハイスコアを保存
      saveHighScore(newScore);

      // Then: 正常に保存される
      const savedScores = getHighScores();
      expect(savedScores).toHaveLength(1);
      expect(savedScores[0]).toEqual(newScore);
    });

    it('[GREEN] ハイスコア読み込み機能が正常に動作する', () => {
      // Given: 初期状態（空のLocalStorage）

      // When: ハイスコアを読み込み
      const scores = getHighScores();

      // Then: 空配列が返される
      expect(scores).toEqual([]);
    });

    it('[GREEN] ハイスコアクリア機能が正常に動作する', () => {
      // Given: 既存のハイスコア
      const testScore: HighScoreEntry = {
        score: 10000,
        playerName: 'テスト',
        date: '2024-01-15',
        level: 3,
        lines: 15,
      };
      saveHighScore(testScore);

      // When: ハイスコアをクリア
      clearHighScores();

      // Then: 空配列が返される
      const scores = getHighScores();
      expect(scores).toEqual([]);
    });
  });

  describe('💾 データ永続化の仕様', () => {
    it('[GREEN] 初回アクセス時は空配列を返す', () => {
      // Given: LocalStorageにデータが存在しない状態
      // When: ハイスコアを取得
      const scores = getHighScores();

      // Then: 空配列が返される
      expect(scores).toEqual([]);
    });

    it('[GREEN] ハイスコア保存後に読み込める', () => {
      // Given: 保存するハイスコア
      const testScore: HighScoreEntry = {
        score: 15000,
        playerName: 'テストプレイヤー',
        date: '2024-01-15',
        level: 6,
        lines: 30,
      };

      // When: 保存と読み込み
      saveHighScore(testScore);
      const savedScores = getHighScores();

      // Then: 正常に保存・読み込みできる
      expect(savedScores).toHaveLength(1);
      expect(savedScores[0]).toEqual(testScore);
    });

    it('[GREEN] 複数ハイスコアをスコア降順でソートして返す', () => {
      // Given: 複数のハイスコア（意図的に順序を乱す）
      const scores: HighScoreEntry[] = [
        {
          score: 8000,
          playerName: 'プレイヤーB',
          date: '2024-01-15',
          level: 3,
          lines: 15,
        },
        {
          score: 15000,
          playerName: 'プレイヤーA',
          date: '2024-01-14',
          level: 6,
          lines: 30,
        },
        {
          score: 12000,
          playerName: 'プレイヤーC',
          date: '2024-01-16',
          level: 4,
          lines: 20,
        },
      ];

      // When: 複数スコアを保存
      scores.forEach(score => saveHighScore(score));
      const retrievedScores = getHighScores();

      // Then: スコア降順でソートされている
      expect(retrievedScores[0].score).toBe(15000);
      expect(retrievedScores[1].score).toBe(12000);
      expect(retrievedScores[2].score).toBe(8000);
    });

    it('[GREEN] 最大10件でハイスコアを制限する', () => {
      // Given: 12件のハイスコア（制限を超える）
      const manyScores: HighScoreEntry[] = Array.from(
        { length: 12 },
        (_, i) => ({
          score: 1000 * (12 - i), // 12000, 11000, 10000, ...
          playerName: `プレイヤー${i + 1}`,
          date: '2024-01-15',
          level: 1,
          lines: 5,
        })
      );

      // When: 制限を超えるスコアを保存
      manyScores.forEach(score => saveHighScore(score));
      const retrievedScores = getHighScores();

      // Then: 最大10件に制限される
      expect(retrievedScores).toHaveLength(10);
      // 上位10件のみ残る
      expect(retrievedScores[0].score).toBe(12000);
      expect(retrievedScores[9].score).toBe(3000);
    });
  });

  describe('🔄 エラーハンドリングとエッジケース', () => {
    it('[GREEN] LocalStorage利用不可時の適切なエラーハンドリング', () => {
      // Given: LocalStorageが利用できない環境をシミュレート
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
      });

      // When: LocalStorage不可時の操作
      const testScore: HighScoreEntry = {
        score: 10000,
        playerName: 'テスト',
        date: '2024-01-15',
        level: 3,
        lines: 15,
      };

      // Then: エラーを投げずに適切に処理される
      expect(() => saveHighScore(testScore)).not.toThrow();
      expect(getHighScores()).toEqual([]);

      // 復元
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
      });
    });

    it('[GREEN] 不正なJSONデータ保存時の復旧処理', () => {
      // Given: LocalStorageに不正なJSONデータを設定
      localStorage.setItem('tetris-highscores', 'invalid-json');

      // When: 不正データ状態でハイスコアを取得
      const scores = getHighScores();

      // Then: 空配列を返す
      expect(scores).toEqual([]);
    });

    it('[GREEN] プレイヤー名の文字数制限チェック', () => {
      // Given: 異常に長いプレイヤー名
      const longNameScore: HighScoreEntry = {
        score: 10000,
        playerName: 'あ'.repeat(100), // 100文字の名前
        date: '2024-01-15',
        level: 3,
        lines: 15,
      };

      // When: 長いプレイヤー名で保存
      saveHighScore(longNameScore);
      const scores = getHighScores();

      // Then: プレイヤー名は最大20文字に制限される
      expect(scores[0].playerName).toHaveLength(20);
    });
  });

  describe('🎯 ユーザーストーリー重視のテスト', () => {
    it('[GREEN] プレイヤーが自分のベストスコアを確認できる', () => {
      // Given: 同じプレイヤーの複数スコア
      const playerScores: HighScoreEntry[] = [
        {
          score: 8000,
          playerName: 'たけし',
          date: '2024-01-14',
          level: 3,
          lines: 15,
        },
        {
          score: 12000,
          playerName: 'たけし',
          date: '2024-01-15',
          level: 4,
          lines: 20,
        },
        {
          score: 10000,
          playerName: 'ひろし',
          date: '2024-01-15',
          level: 3,
          lines: 18,
        },
      ];

      // When: 複数プレイヤーのスコアを保存
      playerScores.forEach(score => saveHighScore(score));

      // Then: たけしのベストスコアは12000
      const takeshiBest = getBestScoreForPlayer('たけし');
      expect(takeshiBest?.score).toBe(12000);

      // Then: ひろしのベストスコアは10000
      const hiroshiBest = getBestScoreForPlayer('ひろし');
      expect(hiroshiBest?.score).toBe(10000);

      // Then: 存在しないプレイヤーはnull
      const nonExistentPlayer = getBestScoreForPlayer('存在しない');
      expect(nonExistentPlayer).toBeNull();
    });

    it('[GREEN] 今日のハイスコアランキングを表示できる', () => {
      // Given: 異なる日付のスコア
      const todayScore: HighScoreEntry = {
        score: 15000,
        playerName: 'プレイヤー1',
        date: '2024-01-15',
        level: 5,
        lines: 25,
      };

      const yesterdayScore: HighScoreEntry = {
        score: 20000,
        playerName: 'プレイヤー2',
        date: '2024-01-14',
        level: 6,
        lines: 30,
      };

      // When: 異なる日付のスコアを保存
      saveHighScore(todayScore);
      saveHighScore(yesterdayScore);

      // Then: 今日のスコアのみ取得
      const todayScores = getScoresByDate('2024-01-15');
      expect(todayScores).toHaveLength(1);
      expect(todayScores[0].score).toBe(15000);

      // Then: 昨日のスコアのみ取得
      const yesterdayScores = getScoresByDate('2024-01-14');
      expect(yesterdayScores).toHaveLength(1);
      expect(yesterdayScores[0].score).toBe(20000);
    });
  });
});

// 関数は実装済み
