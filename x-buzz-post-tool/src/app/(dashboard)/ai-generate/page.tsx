"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Save, Trophy, Check, Star } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

const toneOptions = ["問題提起型", "対比型", "体験談型", "箇条書き型", "結論先出し型", "煽りフック型", "教育スレッド型"];

interface GeneratedResult {
  title: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  recommended?: boolean;
  score?: number;
  reason?: string;
}

// Fallback dummy results (used when API is not configured)
const dummyResults: GeneratedResult[] = [
  {
    title: "案1: 体験ベース",
    hook: "Claude Codeに丸投げして失敗した話をします。",
    body: "最初は「全部作って」と言ったら、めちゃくちゃなコードが出てきた。でも「ダッシュボードだけ作って」に変えた瞬間、完璧なUIが出てきた。\n\nAIへの指示は、小さく具体的にが鉄則。",
    cta: "あなたもAI開発、始めてみませんか？",
    hashtags: ["#ClaudeCode", "#AI開発", "#プログラミング初心者"],
  },
  {
    title: "案2: 問題提起",
    hook: "「プログラミングできないとAI時代に置いていかれる」は嘘です。",
    body: "本当に必要なのは、自分が何を作りたいか言語化する力。Claude Codeを使えば、設計を言葉で伝えるだけでWebアプリが動く。\n\nコードを書く力より、要件を整理する力の時代。",
    cta: "設計力を磨く第一歩、踏み出しましょう。",
    hashtags: ["#AI時代", "#ノーコード", "#設計力"],
  },
  {
    title: "案3: 結論先出し",
    hook: "結論: AIツールは「指示の具体性」で成果が10倍変わる。",
    body: "「いい感じにして」→ 微妙な結果\n「背景は黒、カードに青紫発光、角丸大きめ」→ 完璧なUI\n\n違いは明確。抽象的 vs 具体的。たったこれだけで、AIの出力品質は劇的に変わります。",
    cta: "今日から指示の解像度を上げてみてください。",
    hashtags: ["#AIハック", "#プロンプト設計", "#生産性向上"],
  },
];

export default function GeneratePage() {
  const [theme, setTheme] = useState("");
  const [target, setTarget] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("体験談型");
  const [charLimit, setCharLimit] = useState("280");
  const [hasCta, setHasCta] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, target, goal, tone, charLimit: Number(charLimit), hasCta, platform: "x" }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Fallback to dummy data if API key is not set
        if (res.status === 500 && data.error?.includes("ANTHROPIC_API_KEY")) {
          setResults(dummyResults);
          setError("APIキー未設定のためダミーデータを表示しています。設定画面からAPIキーを登録してください。");
        } else {
          setError(data.error || "生成に失敗しました");
        }
      } else {
        setResults(data.results);
      }
    } catch {
      // Network error fallback
      setResults(dummyResults);
      setError("API接続エラー: ダミーデータを表示しています。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">AI投稿生成</h1>
        <p className="text-sm text-gray-400 mt-1">テーマを入力して、バズる投稿を3パターン生成</p>
      </div>

      {/* Input Form */}
      <GlowCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">テーマ *</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="例: Claude Codeで1時間でアプリを作った話"
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 focus:shadow-neon-glow transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ターゲット</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="例: プログラミング初心者、副業に興味がある会社員"
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">目的</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="例: フォロワー増加、ブランディング"
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">文体・トーン</label>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      tone === t
                        ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                        : "bg-dark-800 text-gray-400 border border-neon-indigo/10 hover:border-neon-indigo/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">文字数目安</label>
              <input
                type="number"
                value={charLimit}
                onChange={(e) => setCharLimit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setHasCta(!hasCta)}
                className={`w-10 h-6 rounded-full transition-all ${
                  hasCta ? "bg-neon-indigo" : "bg-dark-600"
                } relative`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    hasCta ? "left-5" : "left-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-300">CTA（行動喚起）を含める</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!theme || isGenerating}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium text-sm flex items-center justify-center gap-2 hover:shadow-neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> 生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> 3パターン生成
            </>
          )}
        </button>
      </GlowCard>

      {/* Error/Info Message */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-300">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">生成結果</h2>

          {/* Sort: recommended first */}
          {[...results].sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0)).map((result, i) => (
            <GlowCard key={i} className={result.recommended ? "ring-2 ring-yellow-400/50 shadow-[0_0_25px_rgba(250,204,21,0.15)]" : ""}>
              {/* Recommended Badge */}
              {result.recommended && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-300">AIおすすめ</span>
                  {result.score && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-yellow-400">
                      <Star className="w-3 h-3 fill-yellow-400" /> {result.score}/10
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-neon-indigo">{result.title}</h3>
                  {!result.recommended && result.score && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Star className="w-3 h-3" /> {result.score}/10
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const text = result.hook + "\n\n" + result.body + (result.cta ? "\n\n" + result.cta : "") + "\n\n" + result.hashtags.join(" ");
                      await navigator.clipboard.writeText(text);
                      setCopiedIndex(i);
                      setTimeout(() => setCopiedIndex(null), 2000);
                    }}
                    className="p-2 rounded-lg bg-dark-800 hover:bg-dark-600 transition-all"
                    title="コピー"
                  >
                    {copiedIndex === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button className="p-2 rounded-lg bg-dark-800 hover:bg-dark-600 transition-all" title="保存">
                    <Save className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-yellow-300 font-medium">{result.hook}</p>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">{result.body}</p>
                {result.cta && <p className="text-neon-blue font-medium">{result.cta}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.hashtags.map((tag) => (
                    <span key={tag} className="text-xs text-neon-purple bg-neon-purple/10 px-2 py-1 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendation Reason */}
              {result.recommended && result.reason && (
                <div className="mt-4 pt-3 border-t border-yellow-400/10">
                  <p className="text-xs text-yellow-300/80">
                    <span className="font-semibold">おすすめ理由:</span> {result.reason}
                  </p>
                </div>
              )}
            </GlowCard>
          ))}
        </div>
      )}
    </div>
  );
}
