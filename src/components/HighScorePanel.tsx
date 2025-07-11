/**
 * 🏆 ハイスコアパネル - UI コンポーネント
 *
 * t-wada流設計思想:
 * - テスタブルなコンポーネント設計
 * - 外部依存の分離
 * - 明確な責任分離
 * - ユーザー体験重視
 */

import React, { useState, useEffect } from 'react';
import { HighScoreEntry } from '@/types/highscore';
import { getHighScores, saveHighScore } from '@/utils/highscore';

interface HighScorePanelProps {
  /** 現在のスコア */
  currentScore: number;
  /** 現在のレベル */
  currentLevel: number;
  /** 現在の消去ライン数 */
  currentLines: number;
  /** ゲームオーバー状態 */
  gameOver: boolean;
  /** 表示状態 */
  isVisible: boolean;
  /** 閉じるコールバック */
  onClose: () => void;
}

/**
 * 現在の日付を取得（YYYY-MM-DD形式）
 */
const getCurrentDate = (): string => {
  const datePart = new Date().toISOString().split('T')[0];
  if (!datePart) {
    throw new Error('Invalid date format');
  }
  return datePart;
};

/**
 * ハイスコアパネルコンポーネント
 */
export const HighScorePanel: React.FC<HighScorePanelProps> = ({
  currentScore,
  currentLevel,
  currentLines,
  gameOver,
  isVisible,
  onClose,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [highScores, setHighScores] = useState<HighScoreEntry[]>([]);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // ハイスコアの読み込み
  useEffect(() => {
    const scores = getHighScores();
    setHighScores(scores);

    // 新しいハイスコアかチェック
    if (gameOver && currentScore > 0) {
      const lastScore = scores[scores.length - 1];
      const isNewRecord =
        scores.length < 10 || (lastScore && currentScore > lastScore.score);
      setIsNewHighScore(Boolean(isNewRecord));
    }
  }, [gameOver, currentScore]);

  // プレイヤー名の保存
  const handleSaveHighScore = () => {
    if (playerName.trim()) {
      const newEntry: HighScoreEntry = {
        score: currentScore,
        playerName: playerName.trim(),
        date: getCurrentDate(),
        level: currentLevel,
        lines: currentLines,
      };

      saveHighScore(newEntry);
      setHighScores(getHighScores());
      setIsNewHighScore(false);
      setPlayerName('');
    }
  };

  // キーボードイベント
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveHighScore();
    }
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>🏆 ハイスコア</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
            aria-label='閉じる'
          >
            ✕
          </button>
        </div>

        {/* 新しいハイスコアの場合の入力フォーム */}
        {isNewHighScore && (
          <div className='mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded'>
            <p className='text-sm text-yellow-800 mb-2'>
              🎉 新しいハイスコアです！
            </p>
            <p className='text-lg font-bold text-yellow-900 mb-2'>
              {currentScore.toLocaleString()}点
            </p>
            <input
              type='text'
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='プレイヤー名を入力'
              className='w-full p-2 border border-gray-300 rounded mb-2'
              maxLength={20}
              autoFocus
            />
            <button
              onClick={handleSaveHighScore}
              disabled={!playerName.trim()}
              className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300'
            >
              保存
            </button>
          </div>
        )}

        {/* ハイスコアリスト */}
        <div className='max-h-60 overflow-y-auto'>
          {highScores.length === 0 ? (
            <p className='text-center text-gray-500 py-4'>
              まだハイスコアがありません
            </p>
          ) : (
            <div className='space-y-2'>
              {highScores.map((score, index) => (
                <div
                  key={`${score.playerName}-${score.date}-${index}`}
                  className='flex items-center justify-between p-2 bg-gray-50 rounded'
                >
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-bold text-gray-600'>
                      {index + 1}
                    </span>
                    <span className='font-medium'>{score.playerName}</span>
                  </div>
                  <div className='text-right'>
                    <div className='font-bold'>
                      {score.score.toLocaleString()}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Lv.{score.level} ({score.lines}ライン)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
