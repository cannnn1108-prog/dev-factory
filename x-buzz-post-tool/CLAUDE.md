# X Buzz Post Tool (& Threads対応)

## 技術スタック
- Next.js 14 App Router / TypeScript / Tailwind CSS
- Anthropic API (@anthropic-ai/sdk) for AI投稿生成
- Supabase for DB

## デザインルール
- 背景: ネイビー〜ブラック (#06070f, #0a0b1a)
- カード: 半透明ダーク + 青紫発光ボーダー (glow-border)
- アイコン: Lucide React
- 角丸: rounded-2xl
- 余白: 広め (p-6, gap-6)
- SaaS風の高級感、ダークネオンUI

## フォルダ構成
- src/app/                    — ページ (App Router)
- src/app/api/                — API Routes (generate, rewrite)
- src/app/(dashboard)/        — 各サブページ
- src/components/ui/          — GlowCard, StatCard, QuickAction
- src/components/layout/      — Sidebar
- src/lib/                    — supabase.ts, prompts.ts, dummy-data.ts
- src/types/                  — index.ts, database.ts
- supabase/                   — schema.sql

## プラットフォーム対応
- X (Twitter) と Threads の両対応
- DB設計・型定義に platform フィールドあり
- プロンプトもplatformパラメータで切替

## 完了済み
- [x] プロジェクト初期化
- [x] 共通レイアウト + サイドバー
- [x] ダッシュボード
- [x] AI投稿生成画面 (API Route + ダミーフォールバック)
- [x] 予約投稿画面
- [x] 投稿履歴画面
- [x] ネタ帳
- [x] バズキャラ設定
- [x] 学習AIリライト (API Route + ダミーフォールバック)
- [x] 自動バズ通信
- [x] バズインサイト分析
- [x] セットアップガイド
- [x] 設定画面
- [x] Supabase スキーマ設計 (schema.sql)
- [x] DB型定義 (database.ts)
- [x] Anthropic API連携 (generate, rewrite)
- [x] プロンプト設計 (prompts.ts)
- [ ] Supabase CRUD実装  ← 次はここ
- [ ] X API連携
- [ ] Threads API連携
