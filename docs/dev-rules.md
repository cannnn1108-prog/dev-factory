# 開発ルール

## ブランチ戦略

- `main` - 本番ブランチ
- `claude/*` - 機能開発ブランチ（Claude Code使用時）

## デプロイフロー

1. ローカルで開発・テスト
2. GitHub にプッシュ
3. VPS で `git pull` → `npm run build` → `pm2 restart`

## コーディング規約

- TypeScript 使用
- Next.js App Router パターンに従う
- Server Actions を活用
- 環境変数は `.env.local` で管理（Git管理外）

## VPS構成

- OS: Ubuntu
- Web: Nginx (リバースプロキシ)
- Node: PM2 (プロセス管理)
- パス: `/var/www/dev-factory/`
