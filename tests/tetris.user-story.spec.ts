import { test, expect } from '@playwright/test';

/**
 * t-wada流 ユーザーストーリー重視のE2Eテスト
 *
 * テスト設計方針：
 * - ユーザーの行動と期待を重視
 * - ビジネス価値を明確に表現
 * - 実装詳細ではなく、ユーザー体験を検証
 * - Given-When-Then構造で可読性向上
 *
 * 対象ユーザー：
 * - 新規プレイヤー（初めてテトリスを体験）
 * - 経験豊富なプレイヤー（高スコアを目指す）
 * - カジュアルプレイヤー（短時間の息抜き）
 */

test.describe('テトリスゲーム ユーザーストーリー', () => {
  test.beforeEach('ユーザーがゲーム画面にアクセスする', async ({ page }) => {
    await page.goto('/');
  });

  test.describe('🎮 新規プレイヤーの体験', () => {
    test('初回訪問時に、ゲームの基本情報と操作方法を理解できる', async ({
      page,
    }) => {
      // Given: 新規ユーザーがサイトを訪問
      // When: 画面を確認
      // Then: ゲームの基本情報が一目で分かる

      // ゲーム名が明確に表示される
      const gameTitle = page.locator('h1:has-text("Tetris")');
      await expect(gameTitle, 'ゲームタイトルが大きく表示される').toBeVisible();

      // ゲーム開始方法が明確
      const startButton = page.getByRole('button', {
        name: /Start Game|New Game/,
      });
      await expect(
        startButton,
        'ゲーム開始ボタンが分かりやすく配置される'
      ).toBeVisible();

      // 現在の状態が理解できる
      await expect(
        page.locator('text=Score: 0'),
        'スコアの初期状態が表示される'
      ).toBeVisible();
      await expect(
        page.locator('text=Lines: 0'),
        'ライン数の初期状態が表示される'
      ).toBeVisible();
      await expect(
        page.locator('text=Level: 0'),
        'レベルの初期状態が表示される'
      ).toBeVisible();

      // 操作方法が事前に理解できる
      await expect(
        page.locator('text=Controls:'),
        '操作説明セクションがある'
      ).toBeVisible();
      await expect(
        page.locator('text=← → Move'),
        '移動操作が説明される'
      ).toBeVisible();
      await expect(
        page.locator('text=↑ Rotate'),
        '回転操作が説明される'
      ).toBeVisible();
      await expect(
        page.locator('text=Space Hard Drop'),
        'ハードドロップ操作が説明される'
      ).toBeVisible();
      await expect(
        page.locator('text=P Pause'),
        '一時停止操作が説明される'
      ).toBeVisible();
    });

    test('ゲーム開始後に、すぐにゲームプレイを体験できる', async ({ page }) => {
      // Given: 新規ユーザーがゲーム開始を決意
      // When: スタートボタンをクリック
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();

      // Then: 即座にゲームが始まり、基本要素が表示される

      // 落下ピースが表示される（ゲームが動作中）
      const gameBoard = page
        .locator('div')
        .filter({ hasText: /score|lines|level/i })
        .first();
      await expect(gameBoard, 'ゲームボードが表示される').toBeVisible();

      // 次のピースが予告される
      await expect(
        page.locator('text=Next:'),
        '次のピースプレビューが表示される'
      ).toBeVisible();

      // ゲーム制御ができることが分かる
      const pauseButton = page.getByRole('button', { name: 'Pause' });
      await expect(pauseButton, '一時停止ボタンが利用可能になる').toBeVisible();

      // ゲームボードが期待通りの構造
      const boardCells = page.locator('div[class*="w-8"][class*="h-8"]');
      await expect(
        boardCells,
        '標準的なテトリスボード（200セル）が表示される'
      ).toHaveCount(200);
    });
  });

  test.describe('🏆 経験豊富なプレイヤーの体験', () => {
    test('高速操作で効率的にピースを配置できる', async ({ page }) => {
      // Given: 経験豊富なプレイヤーがゲーム開始
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();
      await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

      // When: 高速でキーボード操作を実行
      // 高速移動テスト
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowLeft');

      // 高速回転テスト
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');

      // ハードドロップテスト
      await page.keyboard.press('Space');

      // Then: ゲームが正常に応答し続ける
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲームが継続している'
      ).toBeVisible();

      // スコアリングシステムが機能している
      const scoreArea = page.locator('h2');
      await expect(scoreArea, 'スコア表示エリアが存在する').toBeVisible();
    });

    test('一時停止機能で戦略を練ることができる', async ({ page }) => {
      // Given: プレイヤーがゲーム中に戦略を練りたい
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();
      await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

      // When: Pキーで一時停止
      await page.keyboard.press('p');

      // Then: ゲームが完全に停止し、状況確認ができる
      await expect(
        page.locator('text=Paused'),
        '一時停止状態が明確に表示される'
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Resume' }),
        '再開方法が明確'
      ).toBeVisible();

      // When: 再開を決定
      await page.getByRole('button', { name: 'Resume' }).click();

      // Then: スムーズにゲームが再開される
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲームが再開される'
      ).toBeVisible();
      await expect(
        page.locator('text=Paused'),
        '一時停止表示が消える'
      ).not.toBeVisible();
    });
  });

  test.describe('☕ カジュアルプレイヤーの体験', () => {
    test('簡単にゲームを開始して中断できる', async ({ page }) => {
      // Given: 短時間で遊びたいカジュアルプレイヤー
      // When: ワンクリックでゲーム開始
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();

      // Then: 即座にゲームが開始される
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲームが始まる'
      ).toBeVisible();

      // When: 途中で中断したい
      await page.keyboard.press('p');

      // Then: 簡単に一時停止できる
      await expect(page.locator('text=Paused'), '一時停止できる').toBeVisible();

      // 後で再開可能であることが分かる
      await expect(
        page.getByRole('button', { name: 'Resume' }),
        '再開ボタンが利用可能'
      ).toBeVisible();
    });

    test('進捗状況を一目で把握できる', async ({ page }) => {
      // Given: プレイヤーがゲーム状況を確認したい
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();

      // When: ゲーム画面を確認
      // Then: 重要な情報が分かりやすく表示される

      // スコア進捗
      const scoreDisplay = page.locator('h2').filter({ hasText: /Score:/ });
      await expect(scoreDisplay, 'スコアが大きく表示される').toBeVisible();

      // レベル進捗
      await expect(
        page.locator('text=Level:'),
        'レベル情報が表示される'
      ).toBeVisible();

      // ライン消去進捗
      await expect(
        page.locator('text=Lines:'),
        'ライン消去数が表示される'
      ).toBeVisible();

      // 次の目標（次のピース）
      await expect(
        page.locator('text=Next:'),
        '次のピースが予告される'
      ).toBeVisible();
    });
  });

  test.describe('🛡️ エラー処理とロバスト性', () => {
    test('無効なキー入力でもゲームが停止しない', async ({ page }) => {
      // Given: ゲームが開始されている
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();
      await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

      // When: 様々な無効キーを押下
      await page.keyboard.press('a');
      await page.keyboard.press('z');
      await page.keyboard.press('1');
      await page.keyboard.press('!');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Escape');

      // Then: ゲームが継続している
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲームが継続している'
      ).toBeVisible();

      // 有効なキー操作も正常に動作する
      await page.keyboard.press('ArrowRight');
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        '有効キーも正常動作'
      ).toBeVisible();
    });

    test('ブラウザのリサイズでもレイアウトが崩れない', async ({ page }) => {
      // Given: ゲームが表示されている
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();

      // When: ブラウザウィンドウをリサイズ
      await page.setViewportSize({ width: 800, height: 600 });
      await page.waitForTimeout(100);

      // Then: 主要要素が表示され続ける
      await expect(
        page.locator('h1:has-text("Tetris")'),
        'タイトルが表示される'
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲーム制御が可能'
      ).toBeVisible();

      // When: さらに小さくリサイズ
      await page.setViewportSize({ width: 400, height: 800 });
      await page.waitForTimeout(100);

      // Then: レスポンシブに対応している
      await expect(
        page.locator('h1:has-text("Tetris")'),
        'タイトルが表示される'
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲーム制御が可能'
      ).toBeVisible();
    });
  });

  test.describe('♿ アクセシビリティ体験', () => {
    test('キーボードのみでゲーム全体を操作できる', async ({ page }) => {
      // Given: キーボードユーザーがゲームにアクセス
      // When: Tab キーでナビゲーション
      await page.keyboard.press('Tab');

      // スタートボタンにフォーカスが移動する
      const startButton = page.getByRole('button', {
        name: /Start Game|New Game/,
      });
      await expect(startButton, 'スタートボタンがフォーカス可能').toBeFocused();

      // When: Enterでゲーム開始
      await page.keyboard.press('Enter');

      // Then: ゲームが開始される
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'キーボードでゲーム開始可能'
      ).toBeVisible();

      // When: ゲーム操作をキーボードで実行
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('p'); // 一時停止

      // Then: キーボード操作が正常に動作
      await expect(
        page.locator('text=Paused'),
        'キーボードで一時停止可能'
      ).toBeVisible();

      // Tab で再開ボタンにフォーカス
      await page.keyboard.press('Tab');
      const resumeButton = page.getByRole('button', { name: 'Resume' });
      await expect(resumeButton, '再開ボタンがフォーカス可能').toBeFocused();
    });

    test('重要な状態変化が視覚的に明確である', async ({ page }) => {
      // Given: ユーザーがゲーム状態を把握したい
      // When: ゲームを開始
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();

      // Then: ゲーム状態が明確に区別される
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'アクティブ状態が明確'
      ).toBeVisible();

      // When: 一時停止
      await page.keyboard.press('p');

      // Then: 一時停止状態が明確に表示される
      const pausedText = page.locator('text=Paused');
      await expect(pausedText, '一時停止状態が視覚的に明確').toBeVisible();

      // 背景色やスタイリングで状態が区別されている
      await expect(pausedText, '一時停止表示が強調される').toHaveCSS(
        'font-weight',
        /bold|700/
      );
    });
  });

  test.describe('📱 レスポンシブ体験', () => {
    test('モバイル環境でも基本的な操作ができる', async ({ page }) => {
      // Given: モバイルサイズの画面
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE サイズ

      // When: ゲームを開始
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();

      // Then: 主要要素が適切に表示される
      await expect(
        page.locator('h1:has-text("Tetris")'),
        'タイトルが表示される'
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲーム制御ボタンが表示される'
      ).toBeVisible();

      // ゲームボードが表示される
      const gameBoard = page
        .locator('div')
        .filter({ hasText: /score|lines|level/i })
        .first();
      await expect(gameBoard, 'ゲームボードが表示される').toBeVisible();

      // 重要な情報が表示される
      await expect(
        page.locator('text=Score:'),
        'スコア情報が表示される'
      ).toBeVisible();
      await expect(
        page.locator('text=Next:'),
        'ネクストピース情報が表示される'
      ).toBeVisible();
    });

    test('タブレット環境で快適にプレイできる', async ({ page }) => {
      // Given: タブレットサイズの画面
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad サイズ

      // When: ゲームを開始してプレイ
      await page.getByRole('button', { name: /Start Game|New Game/ }).click();

      // Then: デスクトップ同等の体験ができる
      await expect(
        page.locator('h1:has-text("Tetris")'),
        'タイトルが大きく表示'
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲーム制御が可能'
      ).toBeVisible();

      // レイアウトが適切に配置される
      const scoreArea = page.locator('h2').filter({ hasText: /Score:/ });
      await expect(scoreArea, 'スコアエリアが適切に配置').toBeVisible();

      // ゲーム操作が正常に動作
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowUp');
      await expect(
        page.getByRole('button', { name: 'Pause' }),
        'ゲーム操作が正常動作'
      ).toBeVisible();
    });
  });
});
