# CLAUDE.md

必ず日本語で回答してください。
このファイルは、このリポジトリのコードを扱う際にClaude Code (claude.ai/code)にガイダンスを提供します。

## プロジェクト概要

これはNext.js 15、TypeScript、Tailwind CSSで構築されたテトリスゲームです。このアプリケーションは、ピース移動、回転、ライン消去、および段階的な難易度上昇を含む標準的なゲームプレイメカニクスを持つ、完全に機能するブラウザベースのテトリスゲームです。

## 開発コマンド

### ゲーム開発

```bash
# 開発サーバー起動 (http://localhost:3000)
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

### テスト実行

```bash
# 全テスト実行 (180個)
npm run test:all

# ユニットテスト (151個)
npm run test:unit          # watch mode
npm run test:unit:run      # 1回実行
npm run test:unit:coverage # カバレッジ付き

# E2Eテスト - Playwright (18個)
npm run test:e2e           # headless
npm run test:e2e:headed    # ブラウザ表示
npm run test:e2e:ui        # UIモード

# E2Eテスト - CodeceptJS (11個)
npm run test:codecept
npm run test:codecept:verbose
```

### 品質管理

```bash
# 全品質チェック
npm run quality

# 品質チェック + 自動修正
npm run quality:fix

# 個別実行
npm run type-check    # TypeScript型チェック
npm run lint          # ESLint
npm run lint:fix      # ESLint + 自動修正
npm run format        # Prettier
npm run format:check  # Prettier検証
```

### 継続的品質保証

```bash
# GitHub Actions daily E2E tests
# 毎日午前9時(JST)に自動実行
# 手動実行も可能: Actions タブから「Daily E2E Tests」を選択
```

## アーキテクチャ

### ゲーム状態管理

ゲームはReact hooksを使った集中的な状態管理パターンを使用しています：

- `useTetris` hook は中核のゲーム状態（ボード、ピース、スコア、ゲームオーバー状態）を管理
- `useKeyboard` hook はゲームコントロールのキーボード入力を処理
- ゲーム状態は不変で、reducer的パターンで更新

### コアゲームロジック (`src/utils/tetris.ts`)

ゲームメカニクスのための純粋関数を含む：

- ボード操作（作成、ピース配置、ライン消去）
- ピース生成と検証
- 衝突検出と位置検証
- スコア計算とレベル進行計算

### 型システム (`src/types/tetris.ts`)

ゲームのデータ構造を定義：

- `GameState` - ボード、ピース、メタデータを含む完全なゲーム状態
- `Tetromino` - 形状、位置、色を持つ個別のゲームピース
- `TetrominoType` - 7つの標準テトリスピースタイプ（I、O、T、S、Z、J、L）
- ゲーム定数（ボード寸法、ピース形状、色）

### コンポーネント構造

- `TetrisBoard` - 現在のピースと配置されたピースを持つゲームボードをレンダリング
- `GameInfo` - スコア、レベル、次のピース、ゲーム状態を表示
- メインゲームページ (`src/app/page.tsx`) - コンポーネントを統合し、ユーザーインタラクションを処理

### ゲームコントロール

- 矢印キー：ピースを左右下に移動、ピースを回転
- スペースバー：ハードドロップ（即座に底まで落下）
- Pキー：ゲームの一時停止/再開
- スタート/新規ゲームボタン：ゲーム管理

### 主要機能

- 7つのピースタイプを持つ標準的なテトリスゲームプレイ
- 段階的な難易度（レベルに応じて速度が上がる）
- スコアリングシステム付きライン消去
- 次のピースのプレビュー
- 一時停止機能
- ゲームオーバー検出と再開機能
- Tailwind CSSによるレスポンシブデザイン

ゲームロジックを修正する際は、`utils/tetris.ts`の純粋関数が副作用なしの状態を維持し、ゲーム状態がReact hooksパターンを通じて不変であることを確認してください。
