import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildGeneratePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY が設定されていません。設定画面からAPIキーを登録してください。" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { theme, target, goal, tone, charLimit, hasCta, persona, platform } = body;

    if (!theme) {
      return NextResponse.json({ error: "テーマは必須です。" }, { status: 400 });
    }

    const prompt = buildGeneratePrompt({
      theme,
      target,
      goal,
      tone: tone || "体験談型",
      charLimit: charLimit || 280,
      hasCta: hasCta !== false,
      persona,
      platform: platform || "x",
    });

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "AIからの応答が空でした。" }, { status: 500 });
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AIの応答をパースできませんでした。", raw: textContent.text }, { status: 500 });
    }

    const results = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "不明なエラーが発生しました";
    console.error("Generate API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
