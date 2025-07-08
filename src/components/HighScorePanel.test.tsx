/**
 * 🏆 ハイスコアパネル - コンポーネントテスト
 *
 * t-wada流設計思想:
 * - Given-When-Then構造
 * - ユーザー体験重視のテスト
 * - 外部依存関係の制御
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { HighScorePanel } from './HighScorePanel';
import * as highscoreUtils from '@/utils/highscore';

// モック化
vi.mock('@/utils/highscore', () => ({
  getHighScores: vi.fn(),
  saveHighScore: vi.fn(),
}));

const mockGetHighScores = vi.mocked(highscoreUtils.getHighScores);
const mockSaveHighScore = vi.mocked(highscoreUtils.saveHighScore);

describe('🏆 ハイスコアパネル - コンポーネントテスト', () => {
  const defaultProps = {
    currentScore: 15000,
    currentLevel: 5,
    currentLines: 25,
    gameOver: true,
    isVisible: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetHighScores.mockReturnValue([]);
  });

  describe('📱 基本表示テスト', () => {
    it('Given: パネルが非表示状態, When: isVisible=false, Then: 何も表示されない', () => {
      // Given: 非表示状態
      const props = { ...defaultProps, isVisible: false };

      // When: レンダリング
      render(<HighScorePanel {...props} />);

      // Then: ハイスコアタイトルが表示されない
      expect(screen.queryByText('🏆 ハイスコア')).not.toBeInTheDocument();
    });

    it('Given: パネルが表示状態, When: isVisible=true, Then: ハイスコアパネルが表示される', () => {
      // Given: 表示状態
      const props = { ...defaultProps, isVisible: true };

      // When: レンダリング
      render(<HighScorePanel {...props} />);

      // Then: ハイスコアタイトルが表示される
      expect(screen.getByText('🏆 ハイスコア')).toBeInTheDocument();
    });

    it('Given: 閉じるボタンクリック, When: ボタンを押す, Then: onCloseが呼ばれる', async () => {
      // Given: 閉じるコールバック
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose };

      // When: レンダリングして閉じるボタンをクリック
      render(<HighScorePanel {...props} />);
      await userEvent.click(screen.getByRole('button', { name: '閉じる' }));

      // Then: onCloseが呼ばれる
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('🎉 新しいハイスコア処理', () => {
    it('Given: 新しいハイスコア達成, When: ゲームオーバー, Then: 入力フォームが表示される', () => {
      // Given: 空のハイスコアリスト（新記録）
      mockGetHighScores.mockReturnValue([]);
      const props = { ...defaultProps, gameOver: true, currentScore: 15000 };

      // When: レンダリング
      render(<HighScorePanel {...props} />);

      // Then: 新しいハイスコアメッセージが表示される
      expect(screen.getByText('🎉 新しいハイスコアです！')).toBeInTheDocument();
      expect(screen.getByText('15,000点')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('プレイヤー名を入力')
      ).toBeInTheDocument();
    });

    it('Given: プレイヤー名入力, When: 名前を入力して保存, Then: ハイスコアが保存される', async () => {
      // Given: 新しいハイスコア状態
      mockGetHighScores.mockReturnValue([]);
      const props = { ...defaultProps, gameOver: true, currentScore: 15000 };

      // When: レンダリングして名前を入力
      render(<HighScorePanel {...props} />);
      const input = screen.getByPlaceholderText('プレイヤー名を入力');
      await userEvent.type(input, 'テストプレイヤー');

      // When: 保存ボタンをクリック
      await userEvent.click(screen.getByRole('button', { name: '保存' }));

      // Then: saveHighScoreが呼ばれる
      expect(mockSaveHighScore).toHaveBeenCalledWith({
        score: 15000,
        playerName: 'テストプレイヤー',
        date: expect.any(String),
        level: 5,
        lines: 25,
      });
    });

    it('Given: プレイヤー名入力, When: Enterキーを押す, Then: ハイスコアが保存される', async () => {
      // Given: 新しいハイスコア状態
      mockGetHighScores.mockReturnValue([]);
      const props = { ...defaultProps, gameOver: true, currentScore: 15000 };

      // When: レンダリングして名前を入力
      render(<HighScorePanel {...props} />);
      const input = screen.getByPlaceholderText('プレイヤー名を入力');
      await userEvent.type(input, 'テストプレイヤー');

      // When: Enterキーを押す
      await userEvent.keyboard('{Enter}');

      // Then: saveHighScoreが呼ばれる
      expect(mockSaveHighScore).toHaveBeenCalledWith({
        score: 15000,
        playerName: 'テストプレイヤー',
        date: expect.any(String),
        level: 5,
        lines: 25,
      });
    });

    it('Given: 空のプレイヤー名, When: 空白のまま保存, Then: 保存ボタンが無効', () => {
      // Given: 新しいハイスコア状態
      mockGetHighScores.mockReturnValue([]);
      const props = { ...defaultProps, gameOver: true, currentScore: 15000 };

      // When: レンダリング
      render(<HighScorePanel {...props} />);

      // Then: 保存ボタンが無効状態
      expect(screen.getByRole('button', { name: '保存' })).toBeDisabled();
    });
  });

  describe('📋 ハイスコアリスト表示', () => {
    it('Given: ハイスコアなし, When: 表示, Then: 空メッセージが表示される', () => {
      // Given: 空のハイスコアリスト
      mockGetHighScores.mockReturnValue([]);
      const props = { ...defaultProps, gameOver: false };

      // When: レンダリング
      render(<HighScorePanel {...props} />);

      // Then: 空メッセージが表示される
      expect(
        screen.getByText('まだハイスコアがありません')
      ).toBeInTheDocument();
    });

    it('Given: ハイスコアあり, When: 表示, Then: ランキングが表示される', () => {
      // Given: ハイスコアデータ
      mockGetHighScores.mockReturnValue([
        {
          score: 20000,
          playerName: 'プレイヤー1',
          date: '2024-01-15',
          level: 6,
          lines: 30,
        },
        {
          score: 15000,
          playerName: 'プレイヤー2',
          date: '2024-01-14',
          level: 5,
          lines: 25,
        },
      ]);
      const props = { ...defaultProps, gameOver: false };

      // When: レンダリング
      render(<HighScorePanel {...props} />);

      // Then: ランキングが表示される
      expect(screen.getByText('プレイヤー1')).toBeInTheDocument();
      expect(screen.getByText('20,000')).toBeInTheDocument();
      expect(screen.getByText('プレイヤー2')).toBeInTheDocument();
      expect(screen.getByText('15,000')).toBeInTheDocument();
      expect(screen.getByText('Lv.6 (30ライン)')).toBeInTheDocument();
    });
  });

  describe('🎯 ユーザー体験重視のテスト', () => {
    it('Given: 新記録達成, When: プレイヤーが自分の名前を入力, Then: 自然な流れで保存できる', async () => {
      // Given: 新しいハイスコア状態
      mockGetHighScores.mockReturnValue([]);
      const props = { ...defaultProps, gameOver: true, currentScore: 25000 };

      // When: レンダリング
      render(<HighScorePanel {...props} />);

      // Then: 祝福メッセージが表示される
      expect(screen.getByText('🎉 新しいハイスコアです！')).toBeInTheDocument();
      expect(screen.getByText('25,000点')).toBeInTheDocument();

      // When: プレイヤーが名前を入力
      const input = screen.getByPlaceholderText('プレイヤー名を入力');
      expect(input).toHaveFocus(); // 自動フォーカス確認
      await userEvent.type(input, 'やまだ');

      // When: 保存
      await userEvent.click(screen.getByRole('button', { name: '保存' }));

      // Then: 適切なデータで保存される
      expect(mockSaveHighScore).toHaveBeenCalledWith({
        score: 25000,
        playerName: 'やまだ',
        date: expect.any(String),
        level: 5,
        lines: 25,
      });
    });
  });
});
