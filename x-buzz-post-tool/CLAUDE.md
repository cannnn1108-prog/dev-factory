# X Buzz Post Tool (バズ投稿ツール)

## プロジェクト概要
X(Twitter)向けのAIバズ投稿生成・管理ツール。Next.js 14 + Supabase + PM2。

- **本番URL**: https://buzz.miyagigori.com
- **VPSパス**: /var/www/dev-factory/x-buzz-post-tool
- **PM2プロセス名**: buzz-tool
- **ポート**: 3000

## ページ一覧

| URL | ファイル | 機能 |
|-----|---------|------|
| `/` | `src/app/(dashboard)/page.tsx` | ダッシュボード |
| `/ai-generate` | `src/app/(dashboard)/ai-generate/page.tsx` | AI投稿生成（3パターン生成） |
| `/generate` | `src/app/(dashboard)/generate/page.tsx` | X投稿作成（手動作成・下書き） |
| `/schedule` | `src/app/(dashboard)/schedule/page.tsx` | 予約投稿（cron毎分チェック） |
| `/rewrite` | `src/app/(dashboard)/rewrite/page.tsx` | 投稿リライト |
| `/auto-post` | `src/app/(dashboard)/auto-post/page.tsx` | 自動投稿設定 |
| `/history` | `src/app/(dashboard)/history/page.tsx` | 投稿履歴 |
| `/insights` | `src/app/(dashboard)/insights/page.tsx` | 分析・インサイト |
| `/notebook` | `src/app/(dashboard)/notebook/page.tsx` | ネタ帳 |
| `/persona` | `src/app/(dashboard)/persona/page.tsx` | バズキャラ設定 |
| `/settings` | `src/app/(dashboard)/settings/page.tsx` | 設定 |
| `/guide` | `src/app/(dashboard)/guide/page.tsx` | ガイド |
| `/login` | `src/app/(dashboard)/login/page.tsx` | ログイン |

## API

| エンドポイント | 機能 |
|--------------|------|
| `/api/generate` | AI投稿生成（Anthropic API） |
| `/api/post-to-x` | Xへ即時投稿 |
| `/api/rewrite` | 投稿リライト |
| `/api/cron/post-scheduled` | 予約投稿の自動実行（cron毎分） |

## データベース (Supabase)

### テーブル一覧

#### `profiles` - ユーザープロファイル
- `id` (UUID, PK)
- `display_name` (text)
- `plan` (text: "free" etc.)

#### `scheduled_posts` - 予約投稿
- `id` (UUID, PK)
- `profile_id` (UUID, FK → profiles)
- `content` (text) - 投稿本文
- `scheduled_at` (timestamptz) - 予約日時（UTC保存、JST表示）
- `status` (text: "draft" | "scheduled" | "posting" | "posted" | "failed")
- `error_message` (text, nullable)
- `posted_at` (timestamptz, nullable)
- `created_at` (timestamptz)

#### `generated_posts` - AI生成投稿
- `id` (UUID, PK)
- `profile_id` (UUID, FK → profiles)
- `platform` (text: "x")
- `theme`, `target`, `goal`, `tone` (text)
- `title`, `hook`, `body`, `cta` (text)
- `hashtags` (text[])
- `char_count` (int)
- `is_saved` (boolean)
- `recommended` (boolean)
- `score` (int, nullable)
- `reason` (text, nullable)
- `created_at` (timestamptz)

#### `post_ideas` - ネタ帳
- `id` (UUID, PK)
- `profile_id` (UUID, FK → profiles)
- `theme` (text)
- `memo` (text, nullable)
- `created_at` (timestamptz)

#### `post_personas` - バズキャラ設定
- `id` (UUID, PK)
- `profile_id` (UUID, FK → profiles)
- `name`, `first_person`, `writing_style` (text)
- `endings` (text[])
- `ng_expressions` (text[])
- `values`, `target_audience`, `cta_style` (text)
- `expert_topics` (text[])
- `is_default` (boolean)

#### `post_metrics` - 投稿履歴・分析
- `id` (UUID, PK)
- `profile_id` (UUID, FK → profiles)
- `platform` (text: "x")
- `content` (text)
- `impressions`, `likes`, `retweets`, `replies` (int)
- `theme`, `tone` (text, nullable)
- `posted_at` (timestamptz)
- `hook_strength`, `empathy`, `shareability`, `self_score` (int, nullable)

### DB関数 (`src/lib/db.ts`)

| 関数名 | テーブル | 用途 |
|--------|---------|------|
| `getOrCreateProfile()` | profiles | プロファイル取得/作成 |
| `fetchScheduledPosts(profileId)` | scheduled_posts | 予約投稿一覧 |
| `createScheduledPost(profileId, content, scheduledAt, status)` | scheduled_posts | 予約投稿作成 |
| `updateScheduledPost(id, updates)` | scheduled_posts | 予約投稿更新 |
| `deleteScheduledPost(id)` | scheduled_posts | 予約投稿削除 |
| `saveGeneratedPost(profileId, post)` | generated_posts | AI生成投稿保存 |
| `fetchSavedPosts(profileId)` | generated_posts | 保存済み投稿取得 |
| `fetchIdeas(profileId)` | post_ideas | ネタ帳一覧 |
| `createIdea(profileId, theme, memo)` | post_ideas | ネタ追加 |
| `deleteIdea(id)` | post_ideas | ネタ削除 |
| `fetchPersona(profileId)` | post_personas | ペルソナ取得 |
| `upsertPersona(profileId, persona, existingId?)` | post_personas | ペルソナ作成/更新 |
| `fetchMetrics(profileId)` | post_metrics | 投稿履歴取得 |
| `createMetric(profileId, metric)` | post_metrics | 投稿履歴追加 |

## localStorage キー

| キー | 用途 |
|-----|------|
| `buzz_profile_id` | ログイン中のprofile ID |
| `buzz_saved_posts` | 保存済み投稿（ai-generate/generate → schedule間で共有） |
| `buzz_schedule_draft` | 他ページから予約投稿への引き継ぎ用（一時的） |
| `buzz_drafts` | X投稿作成の下書き |

## 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (ダークテーマ、ネオン系UI)
- Supabase (DB + Auth)
- Anthropic API (AI生成)
- X API v2 (投稿、Pay-per-use)
- PM2 (プロセス管理)
- Cron (毎分予約投稿チェック)

## デプロイ手順
```bash
cd /var/www/dev-factory/x-buzz-post-tool
npm run build
pm2 restart buzz-tool
```
