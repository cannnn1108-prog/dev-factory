-- X Buzz Post Tool - Supabase Schema
-- プラットフォーム: X (Twitter) / Threads 両対応

-- ===========================
-- profiles: ユーザープロフィール
-- ===========================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===========================
-- x_accounts: SNSアカウント連携（X / Threads）
-- ===========================
CREATE TABLE x_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL DEFAULT 'x' CHECK (platform IN ('x', 'threads')),
  username TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_x_accounts_profile ON x_accounts(profile_id);

-- ===========================
-- post_personas: バズキャラ設定
-- ===========================
CREATE TABLE post_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  first_person TEXT NOT NULL DEFAULT '僕',
  writing_style TEXT NOT NULL DEFAULT '',
  endings TEXT[] NOT NULL DEFAULT '{}',
  ng_expressions TEXT[] NOT NULL DEFAULT '{}',
  "values" TEXT NOT NULL DEFAULT '',
  target_audience TEXT NOT NULL DEFAULT '',
  expert_topics TEXT[] NOT NULL DEFAULT '{}',
  cta_style TEXT NOT NULL DEFAULT '',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_personas_profile ON post_personas(profile_id);

-- ===========================
-- post_ideas: ネタ帳
-- ===========================
CREATE TABLE post_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT NOT NULL,
  memo TEXT,
  is_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_ideas_profile ON post_ideas(profile_id);

-- ===========================
-- generated_posts: AI生成投稿
-- ===========================
CREATE TABLE generated_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES post_personas(id) ON DELETE SET NULL,
  platform TEXT NOT NULL DEFAULT 'x' CHECK (platform IN ('x', 'threads')),
  theme TEXT NOT NULL,
  target TEXT,
  goal TEXT,
  tone TEXT NOT NULL,
  title TEXT NOT NULL,
  hook TEXT NOT NULL,
  body TEXT NOT NULL,
  cta TEXT,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  char_count INTEGER NOT NULL DEFAULT 0,
  is_saved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_generated_posts_profile ON generated_posts(profile_id);

-- ===========================
-- scheduled_posts: 予約投稿
-- ===========================
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id UUID REFERENCES x_accounts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL DEFAULT 'x' CHECK (platform IN ('x', 'threads')),
  content TEXT NOT NULL,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  scheduled_at TIMESTAMPTZ NOT NULL,
  posted_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posting', 'posted', 'failed')),
  error_message TEXT,
  auto_rule_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scheduled_posts_profile ON scheduled_posts(profile_id);
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status, scheduled_at);

-- ===========================
-- post_metrics: 投稿パフォーマンス
-- ===========================
CREATE TABLE post_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_post_id UUID REFERENCES scheduled_posts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL DEFAULT 'x' CHECK (platform IN ('x', 'threads')),
  content TEXT NOT NULL,
  impressions INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  retweets INTEGER NOT NULL DEFAULT 0,
  replies INTEGER NOT NULL DEFAULT 0,
  theme TEXT,
  tone TEXT,
  posted_at TIMESTAMPTZ NOT NULL,
  hook_strength INTEGER CHECK (hook_strength BETWEEN 1 AND 10),
  empathy INTEGER CHECK (empathy BETWEEN 1 AND 10),
  shareability INTEGER CHECK (shareability BETWEEN 1 AND 10),
  self_score INTEGER CHECK (self_score BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_metrics_profile ON post_metrics(profile_id);
CREATE INDEX idx_post_metrics_posted ON post_metrics(posted_at);

-- ===========================
-- auto_post_rules: 自動投稿ルール
-- ===========================
CREATE TABLE auto_post_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES post_personas(id) ON DELETE SET NULL,
  platform TEXT NOT NULL DEFAULT 'x' CHECK (platform IN ('x', 'threads')),
  name TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time_slots TEXT[] NOT NULL DEFAULT '{}',
  themes TEXT[] NOT NULL DEFAULT '{}',
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auto_post_rules_profile ON auto_post_rules(profile_id);

-- ===========================
-- updated_at 自動更新トリガー
-- ===========================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_x_accounts_updated_at BEFORE UPDATE ON x_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_post_personas_updated_at BEFORE UPDATE ON post_personas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_scheduled_posts_updated_at BEFORE UPDATE ON scheduled_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_post_metrics_updated_at BEFORE UPDATE ON post_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_auto_post_rules_updated_at BEFORE UPDATE ON auto_post_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
