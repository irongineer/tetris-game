# 🎮 Tetris Game - Enterprise Quality Edition

高品質なテトリスゲーム実装と、t-wada流テスト手法を駆使したエンタープライズレベルのQA改善プロジェクトです。

[![Tests](https://img.shields.io/badge/tests-180_passing-brightgreen)](./src/__tests__)
[![Coverage](https://img.shields.io/badge/coverage-high-brightgreen)](#テスト構成)
[![Quality](https://img.shields.io/badge/quality-enterprise-blue)](#品質保証)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## 🌟 プロジェクト概要

このプロジェクトは、単なるテトリスゲーム実装にとどまらず、**t-wada流テスト設計思想**に基づく包括的なQA改善を通じて、現代的なソフトウェア開発のベストプラクティスを実証しています。

### 🎯 主要特徴

- **完全機能のテトリスゲーム**: 標準的なゲームプレイメカニクス
- **エンタープライズレベルの品質**: 180個のテスト全てが成功
- **モダンな技術スタック**: Next.js 15, TypeScript, Tailwind CSS
- **包括的なテスト戦略**: ユニット・E2E・Property-Based・TestDoubles
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

| テスト種別           | ファイル数 | テスト数 | 目的                            |
| -------------------- | ---------- | -------- | ------------------------------- |
| **ユニットテスト**   | 8          | 151      | ロジック・コンポーネント・Hooks |
| **E2E (Playwright)** | 2          | 18       | ユーザーストーリー・機能仕様    |
| **E2E (CodeceptJS)** | 2          | 11       | BDD形式・読みやすいシナリオ     |
| **合計**             | **12**     | **180**  | **包括的品質保証**              |

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

6. **コンポーネント** (`*.test.tsx`) - 18テスト
   - React コンポーネントの動作検証

7. **Hooks** (`useKeyboard.test.ts`) - 12テスト
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
- **テスト成功率**: 100% (180/180)
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
│   ├── app/                 # Next.js App Router
│   ├── components/          # React コンポーネント
│   ├── hooks/              # カスタムフック
│   ├── types/              # TypeScript 型定義
│   ├── utils/              # ゲームロジック
│   └── __tests__/          # 各種テストファイル
├── tests/                  # E2Eテスト (Playwright)
├── tests-codecept/         # E2Eテスト (CodeceptJS)
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

4. **型システム** (`types/tetris.ts`)
   - 完全な型安全性
   - ゲーム状態の厳密な定義

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
- **テスト追加**: 基本6テスト → 180テスト (30倍増)
- **バグ修正**: Property-Based Testing による重要バグ1件発見・修正

## 🤝 貢献

このプロジェクトは教育・学習目的で作成されており、以下の技術習得に活用できます:

- t-wada流テスト設計手法
- Property-Based Testing実践
- TypeScript型安全プログラミング
- モダンReact開発パターン
- 包括的QA戦略の構築

## 📄 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照

## 🙏 謝辞

- **和田卓人氏 (t-wada)**: テスト設計思想とベストプラクティスの提供
- **Claude Code**: 包括的なQA改善の実装支援
- **オープンソースコミュニティ**: 素晴らしいツールとライブラリの提供

---

**🎮 高品質なゲーム開発と、エンタープライズレベルのQA実践の融合**

このプロジェクトは、ゲーム開発の楽しさと、現代的なソフトウェア品質保証の厳格さを両立させた、教育的価値の高い実装例です。
