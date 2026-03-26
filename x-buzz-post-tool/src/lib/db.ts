import { supabase } from "./supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

const DEFAULT_PROFILE_ID_KEY = "buzz_profile_id";

// Get or create a default profile for the current user
export async function getOrCreateProfile() {
  // Check localStorage first
  const cached = typeof window !== "undefined" ? localStorage.getItem(DEFAULT_PROFILE_ID_KEY) : null;
  if (cached) {
    const { data } = await supabase.from("profiles").select("*").eq("id", cached).single();
    if (data) return data;
  }

  // Check if any profile exists
  const { data: existing } = await supabase.from("profiles").select("*").limit(1).single();
  if (existing) {
    if (typeof window !== "undefined") localStorage.setItem(DEFAULT_PROFILE_ID_KEY, existing.id);
    return existing;
  }

  // Create default profile
  const { data: created, error } = await supabase
    .from("profiles")
    .insert({ display_name: "ユーザー", plan: "free" })
    .select()
    .single();

  if (error) throw error;
  if (typeof window !== "undefined" && created) localStorage.setItem(DEFAULT_PROFILE_ID_KEY, created.id);
  return created;
}

// ============ Post Ideas (ネタ帳) ============

export async function fetchIdeas(profileId: string) {
  const { data, error } = await supabase
    .from("post_ideas")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createIdea(profileId: string, theme: string, memo: string) {
  const { data, error } = await supabase
    .from("post_ideas")
    .insert({ profile_id: profileId, theme, memo: memo || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteIdea(id: string) {
  const { error } = await supabase.from("post_ideas").delete().eq("id", id);
  if (error) throw error;
}

// ============ Personas (バズキャラ設定) ============

export async function fetchPersona(profileId: string): Promise<Row | null> {
  const { data, error } = await supabase
    .from("post_personas")
    .select("*")
    .eq("profile_id", profileId)
    .order("is_default", { ascending: false })
    .limit(1);
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function upsertPersona(profileId: string, persona: {
  name: string;
  first_person: string;
  writing_style: string;
  endings: string[];
  ng_expressions: string[];
  values: string;
  target_audience: string;
  expert_topics: string[];
  cta_style: string;
}, existingId?: string) {
  if (existingId) {
    const { data, error } = await supabase
      .from("post_personas")
      .update(persona)
      .eq("id", existingId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("post_personas")
      .insert({ ...persona, profile_id: profileId, is_default: true })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ============ Scheduled Posts (予約投稿) ============

export async function fetchScheduledPosts(profileId: string) {
  const { data, error } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("profile_id", profileId)
    .order("scheduled_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createScheduledPost(profileId: string, content: string, scheduledAt: string, status: string) {
  const { data, error } = await supabase
    .from("scheduled_posts")
    .insert({ profile_id: profileId, content, scheduled_at: scheduledAt, status })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateScheduledPost(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("scheduled_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteScheduledPost(id: string) {
  const { error } = await supabase.from("scheduled_posts").delete().eq("id", id);
  if (error) throw error;
}

// ============ Generated Posts (AI生成投稿) ============

export async function saveGeneratedPost(profileId: string, post: {
  theme: string;
  target?: string;
  goal?: string;
  tone: string;
  title: string;
  hook: string;
  body: string;
  cta?: string;
  hashtags: string[];
  recommended?: boolean;
  score?: number;
  reason?: string;
  platform?: string;
}) {
  const { data, error } = await supabase
    .from("generated_posts")
    .insert({
      profile_id: profileId,
      platform: post.platform || "x",
      theme: post.theme,
      target: post.target || null,
      goal: post.goal || null,
      tone: post.tone,
      title: post.title,
      hook: post.hook,
      body: post.body,
      cta: post.cta || null,
      hashtags: post.hashtags,
      char_count: (post.hook + post.body + (post.cta || "")).length,
      is_saved: true,
      recommended: post.recommended || false,
      score: post.score || null,
      reason: post.reason || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchSavedPosts(profileId: string) {
  const { data, error } = await supabase
    .from("generated_posts")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_saved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ============ Post Metrics (投稿履歴) ============

export async function fetchMetrics(profileId: string) {
  const { data, error } = await supabase
    .from("post_metrics")
    .select("*")
    .eq("profile_id", profileId)
    .order("posted_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createMetric(profileId: string, metric: {
  content: string;
  impressions?: number;
  likes?: number;
  retweets?: number;
  theme?: string;
  tone?: string;
  posted_at: string;
  hook_strength?: number;
  empathy?: number;
  shareability?: number;
  self_score?: number;
  platform?: string;
}) {
  const { data, error } = await supabase
    .from("post_metrics")
    .insert({
      profile_id: profileId,
      platform: metric.platform || "x",
      content: metric.content,
      impressions: metric.impressions || 0,
      likes: metric.likes || 0,
      retweets: metric.retweets || 0,
      replies: 0,
      theme: metric.theme || null,
      tone: metric.tone || null,
      posted_at: metric.posted_at,
      hook_strength: metric.hook_strength || null,
      empathy: metric.empathy || null,
      shareability: metric.shareability || null,
      self_score: metric.self_score || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
