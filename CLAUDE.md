# CLAUDE.md

必ず日本語で回答してください。
このファイルは、このリポジトリのコードを扱う際に Claude Code (claude.ai/code)にガイダンスを提供します。

## プロジェクト概要

これは**テトリスゲーム - Enterprise Quality Edition**です。単なるゲーム実装にとどまらず、**t-wada流テスト設計思想**に基づく包括的なQA改善を通じて、エンタープライズレベルの品質を実現したソフトウェア開発のベストプラクティス実証プロジェクトです。

### 技術スタック

- **Next.js 15** + **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS 4** でスタイリング
- **Vitest** + **Playwright** + **CodeceptJS** でテスト
- **fast-check** でProperty-Based Testing
- **ESLint** + **SonarJS** + **Prettier** で品質管理
- **Husky** + **lint-staged** でGit Hooks

### 品質指標

- **テスト総数**: 173個 (100%成功)
- **テストカバレッジ**: 高水準
- **静的解析警告**: ゼロ
- **発見・修正バグ**: 1件 (Property-Based Testingで発見)
- **TDD実装機能**: ハイスコア機能 (完全なRed→Green→Refactorサイクル)

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
# 全テスト実行 (173個)
npm run test:all

# ユニットテスト (151個 + TDD実装22個 = 173個)
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

### ディレクトリ構造

```
tetris-game/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React コンポーネント
│   │   ├── TetrisBoard.tsx     # ゲームボード表示
│   │   ├── GameInfo.tsx        # スコア・状態表示
│   │   └── HighScorePanel.tsx  # ハイスコア機能 (TDD実装)
│   ├── hooks/                  # カスタムフック
│   │   ├── useTetris.ts        # ゲーム状態管理
│   │   └── useKeyboard.ts      # キーボード制御
│   ├── types/                  # TypeScript型定義
│   │   ├── tetris.ts           # ゲーム型システム
│   │   └── highscore.ts        # ハイスコア型定義 (TDD実装)
│   ├── utils/                  # ゲームロジック
│   │   ├── tetris.ts           # 純粋関数ロジック
│   │   └── highscore.ts        # ハイスコア機能 (TDD実装)
│   ├── engine/                 # コアエンジン
│   │   └── TetrisEngine.ts     # 依存性注入対応エンジン
│   └── __tests__/              # 各種テストファイル
│       ├── tetris.test.ts                # 基本ロジックテスト (22)
│       ├── tetris.spec.ts                # t-wada流仕様化テスト (25)
│       ├── tetris.boundary.spec.ts       # 境界値テスト (42)
│       ├── tetris.property.test.ts       # Property-Based Testing (23)
│       ├── tetris.testdoubles.test.ts    # テストダブル (9)
│       └── highscore.tdd.test.ts         # TDD実装テスト (12)
├── tests/                      # E2Eテスト (Playwright)
│   ├── tetris.spec.ts          # 機能仕様テスト (6)
│   └── tetris.user-story.spec.ts # ユーザーストーリーテスト (12)
├── tests-codecept/             # E2Eテスト (CodeceptJS)
└── 設定ファイル群
```

### 主要コンポーネント

#### 1. ゲーム状態管理 (`useTetris`)

- 集中的な状態管理パターン
- 不変性を保った更新処理
- ボード、ピース、スコア、レベルの管理

#### 2. キーボード制御 (`useKeyboard`)

- ゲームコントロールの抽象化
- イベントハンドリングとキー状態管理
- 長押し防止とキーリピート制御

#### 3. ゲームロジック (`utils/tetris.ts`)

- 純粋関数によるコアロジック
- テスタブルな設計
- 主要関数:
  - `createEmptyBoard()`: ボード初期化
  - `rotateTetromino()`: ピース回転
  - `isValidPosition()`: 位置検証
  - `placeTetromino()`: ピース配置
  - `clearLines()`: ライン消去
  - `calculateScore()`: スコア計算 ※Property-Based Testingでバグ発見・修正済み

#### 4. 型システム (`types/tetris.ts`)

- 完全な型安全性
- ゲーム状態の厳密な定義
- 主要型: `GameState`, `Tetromino`, `TetrominoType`, `Position`

#### 5. ハイスコア機能 (`utils/highscore.ts`) - TDD実装

- LocalStorageによる永続化
- スコア降順ソート（最大10件制限）
- プレイヤー名文字数制限（20文字）
- 日付別・プレイヤー別フィルタリング
- 堅牢なエラーハンドリング

### テスト戦略

#### t-wada流テスト設計思想の実践

1. **仕様化テスト**: 実装詳細ではなく仕様を検証
2. **境界値テスト**: エッジケースの徹底的な検証
3. **ユーザーストーリー重視**: ビジネス価値を明確に表現
4. **Given-When-Then**: 可読性の高いテスト構造
5. **Property-Based Testing**: 数学的な不変条件検証

#### テスト種別詳細

**ユニットテスト (173個)**:

- コアロジック: 基本機能の動作確認
- 仕様化テスト: Given-When-Then構造でビジネス価値検証
- 境界値テスト: エッジケース・異常値の徹底検証
- Property-Based Testing: 1000回/テストのランダム入力検証
- テストダブル: モック・スタブ・フェイクによる外部依存制御
- コンポーネント: React要素の動作検証
- Hooks: カスタムフックの詳細テスト
- **TDD実装**: ハイスコア機能（Red→Green→Refactorサイクル）

**E2Eテスト (29個)**:

- Playwright (18個): ユーザーストーリー・機能仕様
  - 🎮 新規プレイヤー体験
  - 🏆 経験豊富なプレイヤー体験
  - ☕ カジュアルプレイヤー体験
  - 🛡️ エラー処理・ロバスト性
  - ♿ アクセシビリティ
  - 📱 レスポンシブ対応
- CodeceptJS (11個): BDD形式・読みやすいシナリオ

### 品質保証システム

#### 静的解析

- **TypeScript**: strict mode、完全型安全
- **ESLint**: @typescript-eslint + SonarJS ルール
- **Prettier**: 統一されたコードフォーマット

#### Git Hooks (Husky + lint-staged)

pre-commitで自動実行:

- ESLint --fix
- Prettier --write
- TypeScript 型チェック

### ゲームコントロール

- 矢印キー：ピースを左右下に移動、ピースを回転
- スペースバー：ハードドロップ（即座に底まで落下）
- Pキー：ゲームの一時停止/再開
- スタート/新規ゲームボタン：ゲーム管理

### 重要な発見・修正事項

#### バグ発見: `calculateScore`関数の配列範囲外アクセス

- **発見手法**: Property-Based Testing
- **症状**: ライン数≥5でNaN返却
- **原因**: `baseScores[linesCleared]`で未定義値アクセス
- **修正**: 適切な範囲チェックとクランプ処理を実装

### 実装機能

#### ゲーム機能

- 7つのピースタイプを持つ標準的なテトリスゲームプレイ
- 段階的な難易度（レベルに応じて速度が上がる）
- スコアリングシステム付きライン消去
- 次のピースのプレビュー
- 一時停止機能
- ゲームオーバー検出と再開機能
- **🏆 ハイスコア・ランキング機能** (TDD実装)

#### アクセシビリティ対応

- 完全なキーボードナビゲーション
- レスポンシブデザイン (モバイル・タブレット対応)
- 視覚的状態変化の明確化
- ARIA属性の適切な実装

#### パフォーマンス保証

- 大量操作での安定性確認
- メモリリークの防止
- 効率的な状態更新
- Property-Based Testingでの負荷テスト

## 開発方針・ベストプラクティス

### 🧪 t-wada流テスト設計思想の厳格な適用

1. **テストファースト設計の徹底**
   - 新機能は必ずRed→Green→Refactorサイクルで実装
   - 失敗テストを先に書き、仕様を明確化
   - 最小限のコードでテストを通し、その後リファクタリング

2. **Given-When-Then構造の必須使用**
   - 全テストでGiven（前提条件）、When（実行）、Then（検証）を明記
   - テストケース名にシナリオを日本語で記述
   - 実装詳細ではなく、ビジネス価値・ユーザーストーリーを重視

3. **外部依存関係の完全制御**
   - Math.random()等は依存性注入で制御
   - LocalStorage、Date、Performance等も適切にモック化
   - テストダブル（モック・スタブ・フェイク）を積極活用

4. **境界値テストの徹底**
   - 最小値・最大値・境界値を必ずテスト
   - 異常値・エラーケースの網羅的な検証
   - Property-Based Testingで数学的不変条件を確認

### 🏗️ アーキテクチャ設計原則

1. **純粋関数によるコアロジック分離**
   - 副作用のないテスタブルな関数設計
   - UIとビジネスロジックの完全分離
   - 単一責任の原則の厳格な適用

2. **不変性の保持**
   - 全ての状態更新で不変性を維持
   - スプレッド演算子・Object.assign等で新しいオブジェクト生成
   - 配列・オブジェクトの直接変更を禁止

3. **型安全性の確保**
   - TypeScript strict modeの必須使用
   - 完全な型定義でバグを防止
   - unknownの積極的活用でany型を排除

### 🔄 継続的品質改善

1. **自動化されたQAパイプライン**
   - pre-commitでESLint・Prettier・TypeScriptチェック
   - 全テストの100%成功を維持
   - GitHub Actionsでの定期E2Eテスト実行

2. **プロパティベーステストの活用**
   - fast-checkでランダム入力による堅牢性確認
   - 1000回/テストの大量実行でバグ発見
   - 数学的不変条件の検証

3. **テストカバレッジの高水準維持**
   - ライン・ブランチ・関数カバレッジの計測
   - 未テスト領域の継続的な改善
   - エラーハンドリングパスの完全テスト

### 💡 新機能開発時の必須プロセス

1. **TDD実装の徹底**

   ```
   🔴 Red: 失敗テストを先に作成
   🟢 Green: 最小限のコードでテストを通す
   🔵 Refactor: 品質向上のリファクタリング
   ```

2. **品質ゲートの通過**
   - 全テストの成功
   - 静的解析警告ゼロ
   - 型チェック完全通過
   - コードフォーマット統一

3. **ドキュメント更新**
   - CLAUDE.mdの仕様・アーキテクチャ情報更新
   - テスト戦略・実装方針の記録
   - 発見バグ・修正内容の文書化

### ⚠️ 重要な注意事項

#### コード修正時の必須確認点

1. **ゲームロジック修正**: `utils/tetris.ts`の純粋関数が副作用なしの状態を維持
2. **状態管理**: React hooksパターンを通じて不変性を保持
3. **テスト**: 新機能追加時は対応するテストも同時に作成
4. **型安全性**: TypeScript strict modeの維持

#### 推奨開発フロー

1. `npm run dev` でゲーム動作確認
2. `npm run test:unit` でユニットテスト実行
3. `npm run test:e2e` でE2Eテスト実行
4. `npm run quality` で品質チェック
5. Git commit時は自動的にlint-stagedが実行

#### テスト追加ガイドライン

- **新機能**: t-wada流の仕様化テストとして実装
- **バグ修正**: 再現テストを先に作成
- **境界値**: エッジケースの網羅的テスト
- **ユーザー体験**: E2Eテストでのシナリオ追加

このプロジェクトは、ゲーム開発の楽しさとエンタープライズレベルの品質保証を両立させた、現代的なソフトウェア開発の実践例です。全173個のテストが品質を保証し、Property-Based Testingによる重要バグの発見・修正、t-wada流TDD実装を通じて、堅牢性を実証しています。
