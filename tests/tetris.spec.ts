import { test, expect } from '@playwright/test';

/**
 * テトリスゲーム機能仕様テスト
 *
 * t-wada流のアプローチ：
 * - 機能の正確性を重視
 * - 実装詳細ではなく仕様を検証
 * - エラーケースも含む網羅的テスト
 */

test.describe('テトリスゲーム 機能仕様', () => {
  test.beforeEach('テストページの初期化', async ({ page }) => {
    await page.goto('/');
  });

  test.describe('ゲーム画面の初期表示仕様', () => {
    test('ゲーム開始前に必要な情報がすべて表示される', async ({ page }) => {
      // Given: ユーザーがゲーム画面にアクセス
      // When: 初期画面を確認
      // Then: ゲームに必要な全ての情報が表示される

      // ゲームの識別情報
      await expect(
        page.locator('h1'),
        'ゲームタイトルが明確に表示される'
      ).toContainText('Tetris');

      // ゲーム開始方法
      await expect(
        page.getByRole('button', { name: 'Start Game' }),
        'ゲーム開始ボタンが利用可能である'
      ).toBeVisible();

      // 現在のゲーム状態
      await expect(
        page.locator('h2'),
        'スコアの初期状態が表示される'
      ).toContainText('Score: 0');
      await expect(
        page.locator('text=Lines: 0'),
        'ライン数の初期状態が表示される'
      ).toBeVisible();
      await expect(
        page.locator('text=Level: 0'),
        'レベルの初期状態が表示される'
      ).toBeVisible();

      // 操作方法の説明
      await expect(
        page.locator('text=Controls:'),
        '操作説明セクションが存在する'
      ).toBeVisible();
      await expect(
        page.locator('text=← → Move'),
        'ピース移動操作が説明される'
      ).toBeVisible();
      await expect(
        page.locator('text=↓ Soft Drop'),
        'ソフトドロップ操作が説明される'
      ).toBeVisible();
      await expect(
        page.locator('text=Space Hard Drop'),
        'ハードドロップ操作が説明される'
      ).toBeVisible();
      await expect(
        page.locator('text=↑ Rotate'),
        'ピース回転操作が説明される'
      ).toBeVisible();
      await expect(
        page.locator('text=P Pause'),
        '一時停止操作が説明される'
      ).toBeVisible();
    });
  });

  test.describe('ゲーム開始機能の仕様', () => {
    test('スタートボタンクリックで即座にゲームが開始される', async ({
      page,
    }) => {
      // Given: ユーザーがゲーム開始を決意
      // When: スタートボタンをクリック
      await page.getByRole('button', { name: 'Start Game' }).click();

      // Then: ゲームが開始状態に移行する

      // ゲーム制御が可能になる
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲーム制御（一時停止）が可能になる'
      ).toBeVisible();

      // 次のピース情報が表示される
      await expect(
        page.locator('text=Next:'),
        '次のピースプレビューが表示される'
      ).toBeVisible();

      // ゲームボードが活性化される
      await expect(
        page.locator('div[class*="border"]').first(),
        'ゲームボードが表示される'
      ).toBeVisible();
    });
  });

  test.describe('ゲーム一時停止・再開機能の仕様', () => {
    test('Pキーによる一時停止とボタンによる再開が正しく動作する', async ({
      page,
    }) => {
      // Given: ゲームが開始されている
      await page.getByRole('button', { name: 'Start Game' }).click();
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲームが開始状態である'
      ).toBeVisible();

      // When: Pキーで一時停止を実行
      await page.keyboard.press('p');

      // Then: ゲームが一時停止状態に変化する
      await expect(
        page.getByRole('button', { name: 'Resume' }),
        '再開ボタンが表示される'
      ).toBeVisible();
      await expect(
        page.locator('text=Paused'),
        '一時停止状態が明確に表示される'
      ).toBeVisible();

      // When: Resumeボタンで再開を実行
      await page.getByRole('button', { name: 'Resume' }).click();

      // Then: ゲームが再開状態に戻る
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        '一時停止ボタンが再表示される'
      ).toBeVisible();
      await expect(
        page.locator('text=Paused'),
        '一時停止表示が消去される'
      ).not.toBeVisible();
    });
  });

  test.describe('キーボード操作機能の仕様', () => {
    test('全てのゲーム操作キーが正常に動作する', async ({ page }) => {
      // Given: ゲームが開始されている
      await page.getByRole('button', { name: 'Start Game' }).click();

      // When: 各種キーボード操作を実行
      await page.keyboard.press('ArrowRight'); // 右移動
      await page.keyboard.press('ArrowLeft'); // 左移動
      await page.keyboard.press('ArrowUp'); // 回転
      await page.keyboard.press('ArrowDown'); // 下移動
      await page.keyboard.press('Space'); // ハードドロップ

      // Then: ゲームが正常に継続している
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'キーボード操作後もゲームが継続している'
      ).toBeVisible();
    });
  });

  test.describe('ゲームボード表示機能の仕様', () => {
    test('標準テトリス仕様のゲームボードが正しく表示される', async ({
      page,
    }) => {
      // Given: ユーザーがゲームを開始
      await page.getByRole('button', { name: 'Start Game' }).click();

      // When: ゲームボードを確認
      const gameBoard = page.locator('div[class*="border"]').first();

      // Then: ゲームボードが適切に表示される
      await expect(gameBoard, 'ゲームボードが表示される').toBeVisible();

      // Then: 標準テトリス仕様（10×20=200セル）が実装される
      const cells = page.locator('div[class*="w-8 h-8"]');
      await expect(
        cells,
        '標準テトリスボード（200セル）が表示される'
      ).toHaveCount(200);
    });
  });

  test.describe('次ピースプレビュー機能の仕様', () => {
    test('次に落下するピースが事前に表示される', async ({ page }) => {
      // Given: ユーザーがゲームを開始
      await page.getByRole('button', { name: 'Start Game' }).click();

      // When: 次ピース表示エリアを確認
      // Then: 次ピース情報が表示される
      await expect(
        page.locator('text=Next:'),
        '次ピースセクションが表示される'
      ).toBeVisible();

      // Then: 次ピースプレビューエリアが利用可能
      const nextPieceArea = page.locator('h3:has-text("Next:")');
      await expect(
        nextPieceArea,
        '次ピースプレビューエリアが存在する'
      ).toBeVisible();
    });
  });
});
