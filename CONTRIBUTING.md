# 🤝 Contributing to Tetris Game - Enterprise Quality Edition

このプロジェクトへの貢献を歓迎します！このガイドでは、**t-wada流テスト設計思想**に基づく高品質な貢献を行うための詳細な手順を説明します。

## 🎯 貢献の方針

### 基本原則

1. **テストファースト設計の徹底**: 新機能は必ずTDDで実装
2. **品質第一**: 機能よりも品質を優先
3. **教育的価値**: 学習者にとって理解しやすい実装
4. **実用的なベストプラクティス**: 現実的で実践可能な手法

### 貢献が歓迎される分野

- 🧪 **テスト改善**: 新しいテスト手法の実装
- 🏗️ **アーキテクチャ改善**: コードの品質向上
- 📚 **ドキュメント**: 技術文書の改善
- 🎮 **ゲーム機能**: 新機能の追加
- 🛡️ **セキュリティ**: 脆弱性の修正
- ♿ **アクセシビリティ**: UI/UXの改善

## 🚀 開発環境のセットアップ

### 前提条件

```bash
# 必要なソフトウェア
- Node.js 18.x 以上
- npm 9.x 以上
- Git 2.x 以上
```

### 初期セットアップ

```bash
# 1. リポジトリをフォーク
# GitHubでフォークボタンをクリック

# 2. ローカルにクローン
git clone https://github.com/YOUR_USERNAME/tetris-game.git
cd tetris-game

# 3. 依存関係をインストール
npm install

# 4. 開発サーバーを起動
npm run dev

# 5. テストを実行して動作確認
npm run test:all
```

### 開発ブランチの作成

```bash
# mainブランチから新しいブランチを作成
git checkout -b feature/your-feature-name

# 例: ハイスコア機能の改善
git checkout -b feature/improve-highscore-ui
```

## 🧪 t-wada流TDD実装ガイド

### 必須プロセス

新機能の実装時は、以下の **Red → Green → Refactor** サイクルを厳守してください：

#### 🔴 Phase 1: Red (失敗テスト作成)

```typescript
// 1. テストファイルを作成
// 例: src/__tests__/newfeature.tdd.test.ts

describe('🆕 新機能 - TDD実装', () => {
  it('[RED] 機能が存在しない - 失敗テスト', () => {
    // Given: 前提条件
    const input = '入力値';

    // When & Then: 関数がまだ存在しないため失敗
    expect(() => {
      newFeature(input);
    }).toThrow(); // 関数が存在しないためエラー
  });
});
```

#### 🟢 Phase 2: Green (最小限の実装)

```typescript
// 2. 最小限のコードでテストを通す
// 例: src/utils/newfeature.ts

export function newFeature(input: string): string {
  // 最小限の実装
  return input;
}
```

#### 🔵 Phase 3: Refactor (品質向上)

```typescript
// 3. コードの品質を向上
export function newFeature(input: string): string {
  // 責任分離
  const sanitizedInput = sanitizeInput(input);
  const processedResult = processInput(sanitizedInput);
  return formatOutput(processedResult);
}

const sanitizeInput = (input: string): string => {
  // 純粋関数による実装
  return input.trim();
};
```

### テスト作成のベストプラクティス

#### Given-When-Then構造の必須使用

```typescript
describe('🎯 ユーザーストーリー重視のテスト', () => {
  it('Given: プレイヤーが新記録達成, When: スコア保存, Then: ランキングに表示される', () => {
    // Given: 前提条件を明確に記述
    const playerName = 'テストプレイヤー';
    const newScore = 25000;
    const existingScores = [{ score: 20000, playerName: 'プレイヤー1' }];

    // When: 実行する操作
    saveHighScore({ score: newScore, playerName });

    // Then: 期待される結果
    const rankings = getHighScores();
    expect(rankings[0].score).toBe(newScore);
    expect(rankings[0].playerName).toBe(playerName);
  });
});
```

#### 境界値テストの実装

```typescript
describe('🔍 境界値テスト', () => {
  it('Given: 最大値+1, When: 処理実行, Then: 適切にエラーハンドリング', () => {
    // Given: 境界値を超える入力
    const maxScore = 999999;
    const overflowScore = maxScore + 1;

    // When: 処理を実行
    const result = processScore(overflowScore);

    // Then: 適切に制限される
    expect(result).toBe(maxScore);
  });
});
```

#### Property-Based Testing の活用

```typescript
import { fc } from 'fast-check';

describe('🔬 Property-Based Testing', () => {
  it('どんな入力でも出力は必ず正の値', () => {
    fc.assert(
      fc.property(fc.integer(), input => {
        const result = absoluteValue(input);
        return result >= 0;
      })
    );
  });
});
```

## 🔍 コードレビュー基準

### 必須チェック項目

#### 1. テスト品質

- [ ] TDDサイクル（Red→Green→Refactor）に従って実装
- [ ] Given-When-Then構造を使用
- [ ] 境界値テストを含む
- [ ] Property-Based Testingを適切に活用（該当する場合）

#### 2. コード品質

- [ ] TypeScript strict mode対応
- [ ] 純粋関数による実装
- [ ] 単一責任の原則
- [ ] 適切なエラーハンドリング

#### 3. 静的解析

- [ ] ESLint警告なし
- [ ] TypeScript型チェック通過
- [ ] Prettier フォーマット適用

### コードレビューの手順

```bash
# 1. 品質チェック実行
npm run quality

# 2. 全テスト実行
npm run test:all

# 3. E2Eテスト実行
npm run test:e2e

# 4. コミット前の最終確認
git add .
git commit -m "適切なコミットメッセージ"
```

## 📝 コミットメッセージ規約

### 基本フォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 推奨タイプ

- `feat`: 新機能追加
- `fix`: バグ修正
- `test`: テスト追加・修正
- `refactor`: リファクタリング
- `docs`: ドキュメント更新
- `style`: コードスタイル修正
- `perf`: パフォーマンス改善

### コミットメッセージ例

```bash
# 良い例
feat(highscore): TDD実装でハイスコア機能を追加

## 実装内容
- Red→Green→Refactorサイクルで完全実装
- LocalStorageによる永続化
- 12個のTDDテストで品質保証

## 技術詳細
- Given-When-Then構造の仕様化テスト
- 境界値テスト・エラーハンドリング完備
- 純粋関数による責任分離

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

## 🛠️ 開発ワークフロー

### 日常的な開発手順

```bash
# 1. 最新のmainブランチを取得
git checkout main
git pull origin main

# 2. 新しいブランチを作成
git checkout -b feature/your-feature

# 3. TDDで開発
# 🔴 Red: 失敗テスト作成
npm run test:unit -- --watch

# 🟢 Green: 最小限の実装
npm run test:unit -- --run

# 🔵 Refactor: 品質向上
npm run quality

# 4. 最終チェック
npm run test:all
npm run test:e2e

# 5. コミット
git add .
git commit -m "適切なメッセージ"

# 6. プッシュ
git push origin feature/your-feature
```

### プルリクエストの作成

#### PR タイトル

```
[TDD実装] 機能名: 簡潔な説明
```

#### PR 説明テンプレート

```markdown
## 🎯 実装概要

- 実装した機能の簡潔な説明
- 解決する問題・追加する価値

## 🧪 TDD実装プロセス

### 🔴 Red フェーズ

- [ ] 失敗テストX個を作成
- [ ] 仕様の明確化完了

### 🟢 Green フェーズ

- [ ] 最小限のコードで全テスト通過
- [ ] 機能の基本動作確認

### 🔵 Refactor フェーズ

- [ ] コードの品質向上
- [ ] 責任分離・可読性改善

## 📊 テスト結果

- ユニットテスト: XX個追加 (全XX個成功)
- E2Eテスト: XX個追加 (該当する場合)
- Property-Based Testing: 適用済み (該当する場合)

## 🔍 チェックリスト

- [ ] TDDサイクルで実装
- [ ] Given-When-Then構造使用
- [ ] 境界値テスト実装
- [ ] TypeScript strict mode対応
- [ ] 静的解析警告なし
- [ ] 全テスト成功

## 📚 学習価値

この実装から学べる技術・手法:

- 具体的な技術要素
- 実践的なベストプラクティス
```

## 🔧 開発ツール・設定

### 推奨エディタ設定

#### VS Code

```json
// .vscode/settings.json
{
  "typescript.preferences.strictNullChecks": true,
  "eslint.autoFixOnSave": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### 推奨拡張機能

- ESLint
- Prettier
- TypeScript Hero
- Vitest Runner
- GitLens

### デバッグ設定

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## 🎓 学習リソース

### 推奨学習順序

1. **t-wada流テスト設計思想**
   - [和田卓人氏の講演・記事](https://t-wada.hatenablog.jp/)
   - Given-When-Then構造の理解
   - 境界値テストの重要性

2. **TDD実践**
   - Red→Green→Refactorサイクル
   - 失敗テストから始める意義
   - リファクタリングの技法

3. **Property-Based Testing**
   - [fast-check公式ドキュメント](https://fast-check.dev/)
   - 不変条件の数学的証明
   - ランダム入力による堅牢性確保

4. **TypeScript型安全プログラミング**
   - strict mode の活用
   - 型による設計改善
   - エラーハンドリングの型安全化

## 🚨 よくある問題と解決法

### テスト関連

#### Q: テストが通らない

```bash
# 1. 詳細なエラー情報を確認
npm run test:unit -- --reporter=verbose

# 2. 特定のテストファイルを実行
npm run test:unit -- src/__tests__/specific.test.ts

# 3. watchモードで開発
npm run test:unit -- --watch
```

#### Q: Property-Based Testingが失敗する

```bash
# 1. シードを固定して再現
npm run test:unit -- --seed=12345

# 2. 実行回数を減らしてデバッグ
npm run test:unit -- --runs=10
```

### 開発環境関連

#### Q: 型エラーが解決しない

```bash
# 1. TypeScript 言語サーバーを再起動
# VS Code: Ctrl+Shift+P > "TypeScript: Restart TS Server"

# 2. 型チェック実行
npm run type-check

# 3. node_modules削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 💡 貢献のアイデア

### 初心者向け

- 🐛 **Good First Issue**: 簡単なバグ修正
- 📚 **ドキュメント改善**: README・コメントの追加
- 🧪 **テスト追加**: 既存機能のテスト追加

### 中級者向け

- 🏗️ **リファクタリング**: コードの品質向上
- 🎮 **機能拡張**: 新しいゲーム機能の追加
- 🔍 **品質改善**: 静的解析ルールの強化

### 上級者向け

- 🧪 **TDD実装**: 新機能の完全TDD実装
- 🔬 **Property-Based Testing**: 新しい不変条件の発見
- 🏛️ **アーキテクチャ改善**: 設計パターンの導入

## 🤝 コミュニティ

### 質問・議論

- **GitHub Issues**: バグ報告・機能要求
- **GitHub Discussions**: 技術的な議論・質問
- **Pull Requests**: コードレビュー・協議

### 行動規範

1. **敬意を持った対応**: 建設的なフィードバック
2. **学習重視**: 教育的価値を優先
3. **品質第一**: 機能より品質を重視
4. **包括的な環境**: 全てのレベルの開発者を歓迎

## 📞 サポート

困った時のサポート手順:

1. **ドキュメント確認**: README.md・CLAUDE.md
2. **Issue検索**: 既存の問題・解決策を確認
3. **新しいIssue作成**: 詳細な情報と再現手順を記載
4. **Discussion利用**: 技術的な質問・議論

---

## 🎉 最後に

このプロジェクトは、**高品質なソフトウェア開発のベストプラクティス**を学ぶための教育的なリソースです。あなたの貢献により、より多くの開発者が**t-wada流テスト設計思想**や**TDD実装**を学ぶことができます。

**共に学び、共に成長し、共に高品質なソフトウェアを作り上げましょう！**

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
