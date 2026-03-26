import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildRewritePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY が設定されていません。" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { original, instruction, persona, platform } = body;

    if (!original) {
      return NextResponse.json({ error: "元の投稿は必須です。" }, { status: 400 });
    }

    const prompt = buildRewritePrompt(original, instruction || "", persona, platform || "x");

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "AIからの応答が空でした。" }, { status: 500 });
    }

    return NextResponse.json({ result: textContent.text.trim() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "不明なエラーが発生しました";
    console.error("Rewrite API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
