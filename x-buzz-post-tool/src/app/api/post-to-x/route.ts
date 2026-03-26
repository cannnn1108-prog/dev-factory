import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.X_API_KEY;
    const apiSecret = process.env.X_API_SECRET;
    const accessToken = process.env.X_ACCESS_TOKEN;
    const accessSecret = process.env.X_ACCESS_TOKEN_SECRET;

    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      return NextResponse.json(
        { error: "X APIキーが設定されていません。.env.localにX_API_KEY等を設定してください。" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "投稿内容は必須です。" }, { status: 400 });
    }

    if (content.length > 280) {
      return NextResponse.json({ error: "投稿は280文字以内にしてください。" }, { status: 400 });
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
