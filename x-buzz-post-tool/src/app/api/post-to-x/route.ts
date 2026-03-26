import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, profileId } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "投稿内容は必須です。" }, { status: 400 });
    }
    if (content.length > 280) {
      return NextResponse.json({ error: "投稿は280文字以内にしてください。" }, { status: 400 });
    }

    let apiKey = process.env.X_API_KEY;
    let apiSecret = process.env.X_API_SECRET;
    let accessToken = process.env.X_ACCESS_TOKEN;
    let accessSecret = process.env.X_ACCESS_TOKEN_SECRET;

    // If profileId provided, look up credentials from DB
    if (profileId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: profile } = await supabase
          .from("profiles")
          .select("x_api_key, x_api_secret, x_access_token, x_access_token_secret")
          .eq("id", profileId)
          .single();
        if (profile?.x_api_key) {
          apiKey = profile.x_api_key;
          apiSecret = profile.x_api_secret;
          accessToken = profile.x_access_token;
          accessSecret = profile.x_access_token_secret;
        }
      }
    }

    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      return NextResponse.json(
        { error: "X APIキーが設定されていません。設定画面からAPIキーを登録してください。" },
        { status: 500 }
      );
    }

    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    const result = await client.v2.tweet(content);

    return NextResponse.json({
      success: true,
      tweetId: result.data.id,
      text: result.data.text,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "投稿に失敗しました";
    console.error("X API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
