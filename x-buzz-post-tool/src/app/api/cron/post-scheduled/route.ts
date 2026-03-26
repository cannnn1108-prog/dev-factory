import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";

const CRON_SECRET = process.env.CRON_SECRET || "buzz-cron-secret-key";

export async function GET(req: NextRequest) {
  // Simple auth check
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const now = new Date().toISOString();

  // Fetch scheduled posts that are due
  const { data: duePosts, error: fetchError } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("status", "scheduled")
    .lte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(10);

  if (fetchError) {
    console.error("Failed to fetch scheduled posts:", fetchError);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!duePosts || duePosts.length === 0) {
    return NextResponse.json({ message: "No posts due", count: 0 });
  }

  // Fallback env credentials
  const envApiKey = process.env.X_API_KEY;
  const envApiSecret = process.env.X_API_SECRET;
  const envAccessToken = process.env.X_ACCESS_TOKEN;
  const envAccessSecret = process.env.X_ACCESS_TOKEN_SECRET;

  // Cache profile credentials to avoid repeated DB lookups
  const profileCredentials: Record<string, { apiKey: string; apiSecret: string; accessToken: string; accessSecret: string } | null> = {};

  const results: { id: string; status: string; error?: string }[] = [];

  for (const post of duePosts) {
    // Mark as posting
    await supabase
      .from("scheduled_posts")
      .update({ status: "posting" })
      .eq("id", post.id);

    try {
      // Get credentials for this post's profile
      let apiKey = envApiKey;
      let apiSecret = envApiSecret;
      let accessToken = envAccessToken;
      let accessSecret = envAccessSecret;

      if (post.profile_id) {
        if (!(post.profile_id in profileCredentials)) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("x_api_key, x_api_secret, x_access_token, x_access_token_secret")
            .eq("id", post.profile_id)
            .single();
          profileCredentials[post.profile_id] = profile?.x_api_key
            ? { apiKey: profile.x_api_key, apiSecret: profile.x_api_secret, accessToken: profile.x_access_token, accessSecret: profile.x_access_token_secret }
            : null;
        }
        const creds = profileCredentials[post.profile_id];
        if (creds) {
          apiKey = creds.apiKey;
          apiSecret = creds.apiSecret;
          accessToken = creds.accessToken;
          accessSecret = creds.accessSecret;
        }
      }

      if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
        throw new Error("X API credentials not found for this profile");
      }

      const client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
        accessToken: accessToken,
        accessSecret: accessSecret,
      });

      const tweetContent = post.content.slice(0, 280);
      const result = await client.v2.tweet(tweetContent);

      await supabase
        .from("scheduled_posts")
        .update({
          status: "posted",
          posted_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      // Also save to post_metrics
      await supabase.from("post_metrics").insert({
        profile_id: post.profile_id,
        platform: post.platform || "x",
        content: tweetContent,
        impressions: 0,
        likes: 0,
        retweets: 0,
        replies: 0,
        posted_at: new Date().toISOString(),
      });

      results.push({ id: post.id, status: "posted" });
      console.log(`Posted scheduled post ${post.id}: ${result.data.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to post ${post.id}:`, message);

      await supabase
        .from("scheduled_posts")
        .update({
          status: "failed",
          error_message: message,
        })
        .eq("id", post.id);

      results.push({ id: post.id, status: "failed", error: message });
    }
  }

  return NextResponse.json({
    message: `Processed ${results.length} posts`,
    count: results.length,
    results,
  });
}
