# dev-factory

様々なツール・アプリ開発の拠点リポジトリ

## プロジェクト一覧

| プロジェクト | 概要 | ステータス |
|-------------|------|-----------|
| [x-buzz-post-tool](docs/x-buzz-tool/README.md) | AI搭載X(Twitter)バズ投稿生成・自動投稿ツール | 稼働中 |

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **AI**: Claude API (Anthropic)
- **DB/Auth**: Supabase
- **デプロイ**: VPS (Nginx + PM2)
- **SNS連携**: X API (Pay-per-use)

## 環境

- **本番**: https://buzz.miyagigori.com
- **VPS**: `/var/www/dev-factory/`
