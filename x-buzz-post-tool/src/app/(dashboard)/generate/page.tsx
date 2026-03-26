"use client";

import { useState } from "react";
import { Send, Hash, Image, Clock, Copy, Check, Loader2 } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

export default function PostCreatePage() {
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [copied, setCopied] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [postError, setPostError] = useState("");
  const charLimit = 280;
  const remaining = charLimit - content.length;

  const handleCopy = async () => {
    const fullText = content + (hashtags ? "\n\n" + hashtags : "");
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem("buzz_drafts") || "[]");
    drafts.unshift({
      id: Date.now().toString(),
      content,
      hashtags,
      createdAt: new Date().toISOString(),
      status: "draft",
    });
    localStorage.setItem("buzz_drafts", JSON.stringify(drafts));
    setContent("");
    setHashtags("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">X投稿作成</h1>
        <p className="text-sm text-gray-400 mt-1">投稿を手動で作成・下書き保存</p>
      </div>

      <GlowCard>
        {/* Content Area */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="いまどうしてる？"
            rows={6}
            maxLength={charLimit}
            className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all resize-none text-sm leading-relaxed"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className={`text-xs ${remaining < 20 ? (remaining < 0 ? "text-red-400" : "text-yellow-400") : "text-gray-500"}`}>
              {remaining}
            </span>
            <div className="w-6 h-6 relative">
              <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="#1e2048" strokeWidth="2" />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke={remaining < 20 ? (remaining < 0 ? "#f87171" : "#facc15") : "#6366f1"}
                  strokeWidth="2"
                  strokeDasharray={`${Math.max(0, (1 - content.length / charLimit)) * 62.83} 62.83`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-neon-purple" />
            <label className="text-xs text-gray-400">ハッシュタグ</label>
          </div>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#AI開発 #ClaudeCode #プログラミング"
            className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neon-indigo/10">
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-dark-800 hover:bg-dark-600 transition-all" title="画像を追加（準備中）">
              <Image className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 rounded-lg bg-dark-800 hover:bg-dark-600 transition-all" title="予約投稿へ">
              <Clock className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-dark-800 hover:bg-dark-600 transition-all"
              title="コピー"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-500" />}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={!content}
              className="px-4 py-2 rounded-xl border border-neon-indigo/20 text-sm text-gray-300 hover:bg-dark-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下書き保存
            </button>
            <button
              disabled={!content || remaining < 0 || posting}
              onClick={async () => {
                setPosting(true);
                setPostError("");
                try {
                  const fullText = (content + (hashtags ? "\n\n" + hashtags : "")).slice(0, 280);
                  const res = await fetch("/api/post-to-x", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: fullText }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setPostError(data.error || "投稿に失敗しました");
                  } else {
                    setPosted(true);
                    setContent("");
                    setHashtags("");
                    setTimeout(() => setPosted(false), 5000);
                  }
                } catch { setPostError("X投稿に失敗しました"); }
                finally { setPosting(false); }
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : posted ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {posting ? "投稿中..." : posted ? "投稿完了!" : "Xに投稿"}
            </button>
          </div>
        </div>
      </GlowCard>

      {/* Post Error */}
      {postError && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {postError}
        </div>
      )}

      {/* Preview */}
      {content && (
        <GlowCard>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">プレビュー</h2>
          <div className="p-4 rounded-xl bg-dark-800 border border-neon-indigo/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold text-white">
                U
              </div>
              <div>
                <p className="text-sm font-medium text-white">ユーザー</p>
                <p className="text-[10px] text-gray-500">@username</p>
              </div>
            </div>
            <p className="text-sm text-gray-200 whitespace-pre-line leading-relaxed">{content}</p>
            {hashtags && (
              <p className="text-sm text-neon-blue mt-2">{hashtags}</p>
            )}
          </div>
        </GlowCard>
      )}
    </div>
  );
}
