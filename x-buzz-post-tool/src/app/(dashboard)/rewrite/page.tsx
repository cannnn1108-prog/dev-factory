"use client";

import { useState } from "react";
import { RefreshCw, Loader2, ArrowRight } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

export default function RewritePage() {
  const [original, setOriginal] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [result, setResult] = useState("");

  const dummyResult =
    "AIツールの使い方で、成果が10倍変わる事実を知っていますか？\n\n" +
    "「いい感じにして」→ 微妙な結果\n" +
    "「背景は黒、カードに青紫発光ボーダー」→ 完璧\n\n" +
    "違いはたった1つ。指示の具体性です。\n\n" +
    "抽象的な指示は、抽象的な結果しか返しません。\n今日から「具体語」で伝えてみてください。";

  const handleRewrite = async () => {
    setIsRewriting(true);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original, instruction, platform: "x" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(dummyResult);
      } else {
        setResult(data.result);
      }
    } catch {
      setResult(dummyResult);
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">学習AIリライト</h1>
        <p className="text-sm text-gray-400 mt-1">既存の投稿をAIでリライトして改善</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original */}
        <GlowCard>
          <h2 className="text-sm font-semibold text-white mb-4">元の投稿</h2>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="リライトしたい投稿を貼り付け..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all resize-none"
          />
          <div className="mt-4">
            <label className="block text-xs text-gray-400 mb-1">リライト指示（任意）</label>
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="例: もっとフックを強くして、箇条書きにして"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
            />
          </div>
        </GlowCard>

        {/* Result */}
        <GlowCard>
          <h2 className="text-sm font-semibold text-white mb-4">リライト結果</h2>
          {result ? (
            <div className="px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 min-h-[200px]">
              <p className="text-sm text-gray-200 whitespace-pre-line leading-relaxed">{result}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[200px] text-gray-600 text-sm">
              <p>リライト結果がここに表示されます</p>
            </div>
          )}
        </GlowCard>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleRewrite}
          disabled={!original || isRewriting}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium text-sm hover:shadow-neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRewriting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> リライト中...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" /> リライトする <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
