# x-buzz-post-tool

AI搭載のX(Twitter)バズ投稿生成・自動投稿ツール

## 機能

- Claude AIによるバズ投稿文の自動生成
- X APIを使った直接投稿
- Supabaseによる投稿履歴管理

## 技術構成

- Next.js 14 (App Router)
- Claude API (投稿文生成)
- X API v2 (投稿)
- Supabase (DB)

## 環境変数

| 変数名 | 用途 |
|--------|------|
| `ANTHROPIC_API_KEY` | Claude API キー |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公開キー |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase サービスロールキー |
| `X_API_KEY` | X API コンシューマーキー |
| `X_API_SECRET` | X API コンシューマーシークレット |
| `X_ACCESS_TOKEN` | X アクセストークン |
| `X_ACCESS_TOKEN_SECRET` | X アクセストークンシークレット |

## デプロイ

```bash
cd /var/www/dev-factory/x-buzz-post-tool
npm run build
pm2 restart buzz-tool
```

## 今後の予定

- [ ] スケジュール投稿機能
- [ ] スレッド自動生成
- [ ] 投稿分析ダッシュボード
