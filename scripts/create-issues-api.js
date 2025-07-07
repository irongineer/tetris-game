#!/usr/bin/env node

// GitHub API経由でIssuesを作成するスクリプト
// 使用方法: GITHUB_TOKEN=your_token node scripts/create-issues-api.js

const https = require('https'); // eslint-disable-line @typescript-eslint/no-require-imports

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'irongineer';
const REPO = 'tetris-game';

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN環境変数が必要です');
  console.log(
    '使用方法: GITHUB_TOKEN=your_token node scripts/create-issues-api.js'
  );
  process.exit(1);
}

const issues = [
  {
    title: '🚀 本番環境デプロイメントの自動化',
    body: `## 概要
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
High - エンドユーザーがアクセス可能にするため`,
    labels: ['enhancement', 'deployment'],
  },
  {
    title: '📱 PWA対応でモバイル体験向上',
    body: `## 概要
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
Medium - ユーザー体験の大幅向上`,
    labels: ['enhancement', 'pwa'],
  },
  {
    title: '⚡ パフォーマンス最適化',
    body: `## 概要
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
High - ユーザー体験に直結`,
    labels: ['enhancement', 'performance'],
  },
  {
    title: '🏆 ハイスコア・ランキング機能の実装',
    body: `## 概要
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
Medium - ゲームの楽しさ向上`,
    labels: ['enhancement', 'feature'],
  },
  {
    title: '🔒 セキュリティ監査・強化',
    body: `## 概要
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
High - セキュリティは基本要件`,
    labels: ['enhancement', 'security'],
  },
  {
    title: '📊 コードカバレッジ100%達成',
    body: `## 概要
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
Medium - 品質保証の完成`,
    labels: ['enhancement', 'testing'],
  },
];

async function createIssue(issue) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(issue);

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${OWNER}/${REPO}/issues`,
      method: 'POST',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Node.js Issue Creator',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 201) {
          const responseData = JSON.parse(body);
          resolve(responseData);
        } else {
          reject(
            new Error(`Failed to create issue: ${res.statusCode} ${body}`)
          );
        }
      });
    });

    req.on('error', err => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

async function createAllIssues() {
  console.log('🚀 GitHub Issuesを作成開始...');

  for (let i = 0; i < issues.length; i++) {
    try {
      console.log(`${i + 1}. ${issues[i].title} を作成中...`);
      const result = await createIssue(issues[i]);
      console.log(`✅ Issue #${result.number} 作成完了: ${result.html_url}`);
    } catch (error) {
      console.error(`❌ Issue作成失敗: ${issues[i].title}`, error.message);
    }
  }

  console.log('🎉 Issue作成プロセス完了！');
  console.log(`📋 Issues確認: https://github.com/${OWNER}/${REPO}/issues`);
}

createAllIssues();
