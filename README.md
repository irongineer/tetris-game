# 🎮 Tetris Game - Enterprise Quality Edition

高品質なテトリスゲーム実装と、t-wada流テスト手法を駆使したエンタープライズレベルのQA改善プロジェクトです。

[![Tests](https://img.shields.io/badge/tests-173_passing-brightgreen)](./src/__tests__)
[![Coverage](https://img.shields.io/badge/coverage-high-brightgreen)](#テスト構成)
[![Quality](https://img.shields.io/badge/quality-enterprise-blue)](#品質保証)
[![TDD](https://img.shields.io/badge/TDD-t--wada_style-blue)](#t-wada流テスト設計思想)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## 🌟 プロジェクト概要

このプロジェクトは、単なるテトリスゲーム実装にとどまらず、**t-wada流テスト設計思想**に基づく包括的なQA改善を通じて、現代的なソフトウェア開発のベストプラクティスを実証しています。

### 🎯 主要特徴

- **完全機能のテトリスゲーム**: 標準的なゲームプレイメカニクス + ハイスコア機能
- **エンタープライズレベルの品質**: 173個のテスト全てが成功
- **t-wada流TDD実装**: 完全なRed→Green→Refactorサイクル実践
- **モダンな技術スタック**: Next.js 15, React 19, TypeScript (strict mode)
- **包括的なテスト戦略**: ユニット・E2E・Property-Based・TestDoubles・TDD
- **アクセシビリティ対応**: キーボードナビゲーション・レスポンシブデザイン

## 🏗️ 技術スタック

### フロントエンド

- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **React 19** - UI ライブラリ

### 開発・品質管理

- **Vitest** - ユニットテスト
- **Playwright** - E2Eテスト
- **CodeceptJS** - BDD形式E2Eテスト
- **fast-check** - Property-Based Testing
- **ESLint + SonarJS** - 静的解析
- **Prettier** - コードフォーマット
- **Husky + lint-staged** - Git Hooks

## 🚀 クイックスタート

### 前提条件

- Node.js 18.x 以上
- npm または yarn

### インストールと起動

```bash
# リポジトリをクローン
git clone <repository-url>
cd tetris-game

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いてゲームをプレイできます。

## 🎮 ゲーム操作

| キー    | 動作           |
| ------- | -------------- |
| `←` `→` | ピース移動     |
| `↑`     | ピース回転     |
| `↓`     | ソフトドロップ |
| `Space` | ハードドロップ |
| `P`     | 一時停止/再開  |

## 🧪 テスト構成

### テスト実行コマンド

```bash
# 全テスト実行
npm run test:all

# ユニットテスト
npm run test:unit          # watch mode
npm run test:unit:run      # 1回実行
npm run test:unit:coverage # カバレッジ付き

# E2Eテスト
npm run test:e2e           # headless
npm run test:e2e:headed    # ブラウザ表示
npm run test:e2e:ui        # UIモード

# CodeceptJS E2Eテスト
npm run test:codecept
npm run test:codecept:verbose
```

### テスト構成詳細

| テスト種別           | ファイル数 | テスト数 | 目的                                 |
| -------------------- | ---------- | -------- | ------------------------------------ |
| **ユニットテスト**   | 10         | 173      | ロジック・コンポーネント・Hooks・TDD |
| **E2E (Playwright)** | 2          | 18       | ユーザーストーリー・機能仕様         |
| **E2E (CodeceptJS)** | 2          | 11       | BDD形式・読みやすいシナリオ          |
| **合計**             | **14**     | **202**  | **包括的品質保証**                   |

#### ユニットテスト詳細

1. **コアロジック** (`tetris.test.ts`) - 22テスト
   - 基本的なゲームロジック検証

2. **仕様化テスト** (`tetris.spec.ts`) - 25テスト
   - t-wada流Given-When-Then構造
   - ビジネス価値重視の設計

3. **境界値テスト** (`tetris.boundary.spec.ts`) - 42テスト
   - エッジケース・異常値の徹底検証
   - ロバスト性確保

4. **Property-Based Testing** (`tetris.property.test.ts`) - 23テスト
   - 1000回/テストのランダム入力検証
   - 不変条件の数学的証明

5. **テストダブル** (`tetris.testdoubles.test.ts`) - 9テスト
   - モック・スタブ・フェイクによる外部依存制御
   - 決定論的テスト実現

6. **🏆 TDD実装** (`highscore.tdd.test.ts`) - 12テスト
   - 完全なRed→Green→Refactorサイクル実践
   - LocalStorageデータ管理・エラーハンドリング

7. **コンポーネント** (`*.test.tsx`) - 28テスト
   - React コンポーネントの動作検証
   - ハイスコアUI機能のテスト

8. **Hooks** (`useKeyboard.test.ts`) - 12テスト
   - カスタムフックの詳細テスト

#### E2Eテスト詳細

1. **機能仕様テスト** (`tetris.spec.ts`) - 6テスト
   - ゲームの基本機能検証
   - t-wada流の仕様重視アプローチ

2. **ユーザーストーリーテスト** (`tetris.user-story.spec.ts`) - 12テスト
   - 🎮 新規プレイヤー体験 (2テスト)
   - 🏆 経験豊富なプレイヤー体験 (2テスト)
   - ☕ カジュアルプレイヤー体験 (2テスト)
   - 🛡️ エラー処理・ロバスト性 (2テスト)
   - ♿ アクセシビリティ (2テスト)
   - 📱 レスポンシブ対応 (2テスト)

## 🔍 品質保証

### 静的解析・リンティング

```bash
# 型チェック
npm run type-check

# リンティング
npm run lint
npm run lint:fix

# フォーマット
npm run format
npm run format:check

# 全品質チェック
npm run quality
npm run quality:fix
```

### 品質指標

- **TypeScript**: strict mode, 完全型安全
- **ESLint**: @typescript-eslint + SonarJS ルール適用
- **コードカバレッジ**: 高カバレッジ達成
- **テスト成功率**: 100% (173/173 ユニット + 29/29 E2E)
- **ゼロ警告**: すべての静的解析警告解消済み

### Git Hooks

pre-commitで以下を自動実行:

- ESLint --fix
- Prettier --write
- TypeScript 型チェック

## 🏛️ アーキテクチャ

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
│   ├── types/                  # TypeScript 型定義
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
├── tests-codecept/             # E2Eテスト (CodeceptJS)
└── 設定ファイル群
```

### 主要コンポーネント

1. **ゲーム状態管理** (`useTetris`)
   - 集中的な状態管理パターン
   - 不変性を保った更新処理

2. **キーボード制御** (`useKeyboard`)
   - ゲームコントロールの抽象化
   - イベントハンドリング

3. **ゲームロジック** (`utils/tetris.ts`)
   - 純粋関数によるコアロジック
   - テスタブルな設計

4. **型システム** (`types/tetris.ts`, `types/highscore.ts`)
   - 完全な型安全性
   - ゲーム状態の厳密な定義
   - ハイスコア機能の型定義 (TDD実装)

5. **🏆 ハイスコア機能** (`utils/highscore.ts`) - TDD実装
   - LocalStorageによる永続化
   - スコア降順ソート（最大10件制限）
   - プレイヤー名文字数制限（20文字）
   - 日付別・プレイヤー別フィルタリング
   - 堅牢なエラーハンドリング

## 🚧 開発プロセス

### t-wada流テスト設計思想

このプロジェクトでは、和田卓人氏(t-wada)のテスト設計思想を採用:

1. **仕様化テスト**: 実装詳細ではなく仕様を検証
2. **境界値テスト**: エッジケースの徹底的な検証
3. **ユーザーストーリー重視**: ビジネス価値を明確に表現
4. **Given-When-Then**: 可読性の高いテスト構造
5. **Property-Based Testing**: 数学的な不変条件検証

### 発見・修正されたバグ

**重要バグ**: `calculateScore`関数の配列範囲外アクセス

- **発見手法**: Property-Based Testing
- **症状**: ライン数≥5でNaN返却
- **原因**: `baseScores[linesCleared]`で未定義値アクセス
- **修正**: 適切な範囲チェックとクランプ処理

### 🏆 TDD実装事例: ハイスコア機能

**完全なt-wada流TDD実装**を実践:

1. **🔴 Red**: 12個の失敗テストを先に作成
   - LocalStorageデータ管理の仕様明確化
   - エラーハンドリングとエッジケース対応
   - Given-When-Then構造による仕様化テスト

2. **🟢 Green**: 最小限のコードで全テストを通過
   - 外部依存関係の制御（LocalStorage）
   - 適切なエラーハンドリング実装
   - 型安全性の確保

3. **🔵 Refactor**: 品質向上のリファクタリング
   - 純粋関数による責任分離
   - 可読性とメンテナンス性の向上
   - 単一責任の原則適用

## 🎯 特筆すべき技術的成果

### 1. Property-Based Testing導入

- `fast-check`ライブラリ活用
- 1000回/テストの徹底検証
- ランダム入力での堅牢性保証
- 重要バグの発見と修正

### 2. テストダブル戦略

- **スタブ**: `Math.random`の決定論的制御
- **モック**: 関数呼び出しの記録・検証
- **フェイク**: シンプルな代替実装
- **ファクトリー**: テストデータ生成の抽象化

### 3. アクセシビリティ対応

- 完全なキーボードナビゲーション
- レスポンシブデザイン (モバイル・タブレット)
- 視覚的状態変化の明確化
- ARIA属性の適切な実装

### 4. パフォーマンス保証

- 大量操作での安定性確認
- メモリリークの防止
- 効率的な状態更新

## 📊 開発統計

- **総開発工数**: 高品質QA改善に特化
- **コミット数**: 段階的な品質向上を記録
- **テスト追加**: 基本6テスト → 173テスト (約29倍増)
- **バグ修正**: Property-Based Testing による重要バグ1件発見・修正
- **TDD実装**: ハイスコア機能の完全なRed→Green→Refactorサイクル

## 🤝 貢献

このプロジェクトは教育・学習目的で作成されており、以下の技術習得に活用できます:

- **t-wada流テスト設計手法**: 仕様化テスト・境界値テスト・Given-When-Then
- **TDD実装**: Red→Green→Refactorサイクルの完全実践
- **Property-Based Testing実践**: fast-checkライブラリ活用
- **TypeScript型安全プログラミング**: strict mode・完全型定義
- **モダンReact開発パターン**: hooks・コンポーネント設計
- **包括的QA戦略の構築**: 静的解析・自動化・継続的品質改善

詳細な貢献ガイドラインは [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照

## 🙏 謝辞

- **和田卓人氏 (t-wada)**: テスト設計思想とベストプラクティスの提供
- **Claude Code**: 包括的なQA改善・TDD実装の支援
- **オープンソースコミュニティ**: 素晴らしいツールとライブラリの提供

---

**🎮 高品質なゲーム開発と、エンタープライズレベルのQA実践の融合**

このプロジェクトは、ゲーム開発の楽しさと、現代的なソフトウェア品質保証の厳格さを両立させた、教育的価値の高い実装例です。特に**t-wada流TDD実装**を通じて、テストファースト設計の実践的な学習ができる貴重なリソースとなっています。
