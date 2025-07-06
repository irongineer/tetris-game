import { test, expect } from '@playwright/test';

test.describe('Tetris Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the game interface', async ({ page }) => {
    // ゲームのタイトルが表示されている
    await expect(page.locator('h1')).toContainText('Tetris');

    // スタートボタンが表示されている
    await expect(
      page.getByRole('button', { name: 'Start Game' })
    ).toBeVisible();

    // スコア表示エリアが表示されている
    await expect(page.locator('h2')).toContainText('Score: 0');
    await expect(page.locator('text=Lines: 0')).toBeVisible();
    await expect(page.locator('text=Level: 0')).toBeVisible();

    // コントロール説明が表示されている
    await expect(page.locator('text=Controls:')).toBeVisible();
    await expect(page.locator('text=← → Move')).toBeVisible();
    await expect(page.locator('text=↓ Soft Drop')).toBeVisible();
    await expect(page.locator('text=Space Hard Drop')).toBeVisible();
    await expect(page.locator('text=↑ Rotate')).toBeVisible();
    await expect(page.locator('text=P Pause')).toBeVisible();
  });

  test('should start the game when Start Game button is clicked', async ({
    page,
  }) => {
    // スタートボタンをクリック
    await page.getByRole('button', { name: 'Start Game' }).click();

    // ゲーム開始後、Pauseボタンが表示されている
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

    // Next:セクションが表示されている
    await expect(page.locator('text=Next:')).toBeVisible();

    // ゲームボードが表示されている（グリッドの存在を確認）
    await expect(page.locator('div[class*="border"]').first()).toBeVisible();
  });

  test('should pause and resume the game', async ({ page }) => {
    // ゲームを開始
    await page.getByRole('button', { name: 'Start Game' }).click();

    // Pauseボタンが表示されることを確認
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

    // Pキーで一時停止
    await page.keyboard.press('p');

    // Resumeボタンが表示され、Pausedメッセージが表示されている
    await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible();
    await expect(page.locator('text=Paused')).toBeVisible();

    // Resumeボタンをクリックして再開
    await page.getByRole('button', { name: 'Resume' }).click();

    // Pauseボタンが再び表示されている
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

    // Pausedメッセージが消えている
    await expect(page.locator('text=Paused')).not.toBeVisible();
  });

  test('should handle keyboard inputs', async ({ page }) => {
    // ゲームを開始
    await page.getByRole('button', { name: 'Start Game' }).click();

    // キーボード入力をテスト（エラーが発生しないことを確認）
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');

    // ゲームが継続している（Pauseボタンが表示されている）
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  });

  test('should display game board correctly', async ({ page }) => {
    // ゲームを開始
    await page.getByRole('button', { name: 'Start Game' }).click();

    // ゲームボードの要素が存在することを確認
    const gameBoard = page.locator('div[class*="border"]').first();
    await expect(gameBoard).toBeVisible();

    // ゲームボードに複数のセルが存在することを確認
    const cells = page.locator('div[class*="w-8 h-8"]');
    await expect(cells).toHaveCount(200); // 10x20 = 200セル
  });

  test('should show next piece preview', async ({ page }) => {
    // ゲームを開始
    await page.getByRole('button', { name: 'Start Game' }).click();

    // Next:セクションが表示されている
    await expect(page.locator('text=Next:')).toBeVisible();

    // 次のピースのプレビューエリアが存在することを確認
    const nextPieceArea = page.locator('h3:has-text("Next:")');
    await expect(nextPieceArea).toBeVisible();
  });
});
