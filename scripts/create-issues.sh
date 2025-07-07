#!/bin/bash

# GitHub Issues作成スクリプト
# 使用前に gh auth login を実行してください

echo "🚀 GitHub Issuesを作成します..."

# Issue 1: デプロイメント自動化
echo "1. デプロイメント自動化のIssueを作成中..."
gh issue create \
  --title "🚀 本番環境デプロイメントの自動化" \
  --body "## 概要
現在のテトリスゲームを本番環境に自動デプロイするシステムを構築

## 作業内容
- [ ] Vercel/Netlify等のホスティングサービス選定
- [ ] GitHub Actionsでのデプロイワークフロー作成
- [ ] 環境変数管理
- [ ] カスタムドメイン設定
- [ ] デプロイ後の自動E2Eテスト実行

## 受け入れ条件
- mainブランチへのpush時に自動デプロイ
- デプロイ失敗時の適切な通知
- ステージング環境でのテスト実行

## 技術スタック
- Vercel または Netlify
- GitHub Actions
- Custom Domain (任意)

## 優先度
High - エンドユーザーがアクセス可能にするため" \
  --label "enhancement,deployment"

# Issue 2: PWA対応
echo "2. PWA対応のIssueを作成中..."
gh issue create \
  --title "📱 PWA対応でモバイル体験向上" \
  --body "## 概要
テトリスゲームをPWA（Progressive Web App）として対応し、モバイルデバイスでのユーザー体験を向上

## 作業内容
- [ ] Service Workerの実装
- [ ] Web App Manifestの作成
- [ ] オフライン対応
- [ ] ホーム画面追加対応
- [ ] プッシュ通知対応（任意）
- [ ] モバイル最適化

## 受け入れ条件
- モバイルブラウザで「ホーム画面に追加」が可能
- オフラインでもゲームプレイ可能
- PWA Lighthouseスコア90点以上
- タッチ操作の最適化

## 技術スタック
- Next.js PWA plugin
- Service Worker API
- Web App Manifest
- Touch Events API

## 優先度
Medium - ユーザー体験の大幅向上" \
  --label "enhancement,pwa"

# Issue 3: パフォーマンス最適化
echo "3. パフォーマンス最適化のIssueを作成中..."
gh issue create \
  --title "⚡ パフォーマンス最適化" \
  --body "## 概要
テトリスゲームのパフォーマンスを最適化し、より滑らかなゲーム体験を提供

## 作業内容
- [ ] React.memoによるコンポーネント最適化
- [ ] useCallbackとuseMemoの活用
- [ ] Canvas描画への移行検討
- [ ] バンドルサイズの最適化
- [ ] 画像最適化（WebP対応）
- [ ] Core Web Vitalsの改善

## パフォーマンス目標
- FPS: 60fps維持
- First Contentful Paint: < 1.5秒
- Largest Contentful Paint: < 2.5秒
- Cumulative Layout Shift: < 0.1
- バンドルサイズ: < 100KB

## 測定方法
- Lighthouse performance audit
- Chrome DevTools Performance tab
- Web Vitals extension
- 本番環境での実測定

## 優先度
High - ユーザー体験に直結" \
  --label "enhancement,performance"

# Issue 4: ハイスコア機能
echo "4. ハイスコア機能のIssueを作成中..."
gh issue create \
  --title "🏆 ハイスコア・ランキング機能の実装" \
  --body "## 概要
プレイヤーのスコアを保存・表示するハイスコア機能を実装し、ゲームの継続性を向上

## 作業内容
- [ ] LocalStorage活用によるスコア保存
- [ ] ハイスコア表示UI作成
- [ ] ランキング機能（Top 10）
- [ ] スコア達成時の演出
- [ ] プレイヤー名入力機能
- [ ] スコアリセット機能

## UI/UX要件
- ゲーム終了時のスコア入力画面
- メイン画面でのハイスコア表示
- ランキング画面の追加
- スコア更新時のアニメーション

## データ構造
\`\`\`typescript
interface HighScore {
  score: number;
  playerName: string;
  lines: number;
  level: number;
  timestamp: Date;
}
\`\`\`

## 優先度
Medium - ゲームの楽しさ向上" \
  --label "enhancement,feature"

# Issue 5: セキュリティ監査
echo "5. セキュリティ監査のIssueを作成中..."
gh issue create \
  --title "🔒 セキュリティ監査・強化" \
  --body "## 概要
テトリスゲームのセキュリティを包括的に監査し、潜在的な脆弱性を修正

## 作業内容
- [ ] npm auditによる依存関係の脆弱性チェック
- [ ] Content Security Policy (CSP)の実装
- [ ] XSS対策の強化
- [ ] HTTPS強制化
- [ ] セキュリティヘッダーの設定
- [ ] Snyk等によるセキュリティスキャン

## セキュリティチェックリスト
- [ ] 外部リソースの検証
- [ ] ユーザー入力のサニタイゼーション
- [ ] 機密情報の漏洩チェック
- [ ] 認証・認可の実装（将来のオンライン機能向け）

## ツール・サービス
- npm audit
- Snyk
- OWASP ZAP
- Lighthouse Security audit
- Next.js Security Headers

## 優先度
High - セキュリティは基本要件" \
  --label "enhancement,security"

# Issue 6: コードカバレッジ向上
echo "6. コードカバレッジ向上のIssueを作成中..."
gh issue create \
  --title "📊 コードカバレッジ100%達成" \
  --body "## 概要
現在のテストカバレッジを分析し、100%カバレッジを目指してテストを追加

## 作業内容
- [ ] 現在のカバレッジレポート作成
- [ ] 未カバー領域の特定
- [ ] エラーハンドリングのテスト追加
- [ ] エッジケースのテスト追加
- [ ] カバレッジ閾値の設定（95%以上）
- [ ] CI/CDでのカバレッジチェック自動化

## カバレッジ目標
- Statement Coverage: 100%
- Branch Coverage: 100%
- Function Coverage: 100%
- Line Coverage: 100%

## 現在の状況
現在180個のテストが実装済み
- ユニットテスト: 151個
- E2Eテスト: 29個

## ツール
- Vitest coverage
- c8/nyc
- Codecov連携

## 優先度
Medium - 品質保証の完成" \
  --label "enhancement,testing"

echo "✅ 全6個のIssuesを作成完了しました！"
echo "GitHub Web UIで確認してください: https://github.com/irongineer/tetris-game/issues"