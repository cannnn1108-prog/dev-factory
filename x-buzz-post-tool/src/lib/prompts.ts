import type { Persona } from "@/types";

interface GeneratePostParams {
  theme: string;
  target?: string;
  goal?: string;
  tone: string;
  charLimit: number;
  hasCta: boolean;
  persona?: Persona | null;
  platform: "x" | "threads";
}

export function buildGeneratePrompt(params: GeneratePostParams): string {
  const { theme, target, goal, tone, charLimit, hasCta, persona, platform } = params;

  const platformName = platform === "x" ? "X (Twitter)" : "Threads";
  const platformAdvice =
    platform === "x"
      ? "日本のXユーザー向けの自然な言い回しを使ってください。"
      : "Threadsはカジュアルで親しみやすいトーンが好まれます。Xよりも長文が読まれやすい傾向があります。";

  let personaBlock = "";
  if (persona) {
    personaBlock = `
ペルソナ情報:
* キャラ名: ${persona.name}
* 一人称: ${persona.firstPerson}
* 文体: ${persona.writingStyle}
* よく使う語尾: ${persona.endings.join("、")}
* NG表現: ${persona.ngExpressions.join("、")}
* 価値観: ${persona.values}
* 狙う読者: ${persona.targetAudience}
* 得意テーマ: ${persona.expertTopics.join("、")}
* CTAの癖: ${persona.ctaStyle}`;
  }

  return `あなたは${platformName}投稿のプロ編集者です。
以下の条件をもとに、反応が取りやすい日本語の短文投稿を3案作成してください。

条件:
* テーマ: ${theme}
${target ? `* ターゲット: ${target}` : ""}
${goal ? `* 目的: ${goal}` : ""}
* 文体: ${tone}
* 文字数目安: ${charLimit}文字以内
* CTA: ${hasCta ? "含める" : "不要"}
* プラットフォーム: ${platformName}
${personaBlock}

出力ルール:
* 1案ずつ見出し付き（案1、案2、案3）
* 冒頭1行は強いフック（読者が止まる一言）
* 改行を活用して読みやすく
* 読みやすさ重視
* 抽象論で終わらず具体性を入れる
* ${platformAdvice}
* ハッシュタグは3〜5個提案

各案を以下の基準でスコアリングし、最もバズりやすい1案を選んでください:
* フックの引き力（思わず読んでしまうか）
* 共感・議論を呼ぶか（リプやRTが来そうか）
* 具体性があるか（抽象論で終わっていないか）
* 保存されやすいか（あとで見返したくなるか）

出力フォーマット（厳密なJSON配列）:
[
  {
    "title": "案1: 体験ベース",
    "hook": "フック文",
    "body": "本文",
    "cta": "CTA文",
    "hashtags": ["#タグ1", "#タグ2"],
    "recommended": false,
    "score": 7,
    "reason": "スコアの根拠"
  },
  {
    "title": "案2: 問題提起",
    "hook": "フック文",
    "body": "本文",
    "cta": "CTA文",
    "hashtags": ["#タグ1", "#タグ2"],
    "recommended": true,
    "score": 9,
    "reason": "この案が最もバズりやすい理由"
  },
  {
    "title": "案3: 結論先出し",
    "hook": "フック文",
    "body": "本文",
    "cta": "",
    "hashtags": ["#タグ1", "#タグ2"],
    "recommended": false,
    "score": 6,
    "reason": "スコアの根拠"
  }
]

重要: recommendedはboolean型(true/false)、scoreは整数(1-10)で出力。3案中1案だけrecommended:trueにすること。
JSONのみ出力してください。説明文やマークダウンは絶対に含めないでください。`;
}

export function buildRewritePrompt(
  original: string,
  instruction: string,
  persona?: Persona | null,
  platform: "x" | "threads" = "x"
): string {
  const platformName = platform === "x" ? "X (Twitter)" : "Threads";

  let personaBlock = "";
  if (persona) {
    personaBlock = `
このキャラの文体に合わせてリライトしてください:
* 一人称: ${persona.firstPerson}
* 文体: ${persona.writingStyle}
* よく使う語尾: ${persona.endings.join("、")}
* NG表現は避ける: ${persona.ngExpressions.join("、")}`;
  }

  return `あなたは${platformName}投稿のプロ編集者です。
以下の投稿をリライトして、よりバズりやすく改善してください。

元の投稿:
${original}

${instruction ? `リライト指示: ${instruction}` : ""}
${personaBlock}

改善のポイント:
* フックを強くする
* 具体性を加える
* 読みやすい改行
* 共感を呼ぶ表現
* ${platformName}に最適化

リライト結果のみを出力してください。説明文は不要です。`;
}
