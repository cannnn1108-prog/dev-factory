"use client";

import { useState } from "react";
import { Plus, Trash2, Lightbulb, Sparkles } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { useLocalStorage } from "@/lib/use-local-storage";
import { PostIdea } from "@/types";
import { dummyIdeas } from "@/lib/dummy-data";

export default function NotebookPage() {
  const [ideas, setIdeas] = useLocalStorage<PostIdea[]>("buzz_ideas", dummyIdeas);
  const [newTheme, setNewTheme] = useState("");
  const [newMemo, setNewMemo] = useState("");

  const handleAdd = () => {
    if (!newTheme.trim()) return;
    const idea: PostIdea = {
      id: Date.now().toString(),
      theme: newTheme.trim(),
      memo: newMemo.trim(),
      createdAt: new Date().toISOString(),
    };
    setIdeas((prev) => [idea, ...prev]);
    setNewTheme("");
    setNewMemo("");
  };

  const handleDelete = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">ネタ帳</h1>
        <p className="text-sm text-gray-400 mt-1">バズ投稿のアイデアをストックして管理</p>
      </div>

      {/* Add New Idea */}
      <GlowCard>
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" /> 新しいアイデア
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="テーマ"
            className="flex-1 px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all"
          />
          <input
            type="text"
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="メモ（任意）"
            className="flex-1 px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all"
          />
          <button
            onClick={handleAdd}
            disabled={!newTheme.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all shrink-0 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </GlowCard>

      {/* Ideas List */}
      <div className="space-y-3">
        {ideas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">まだアイデアがありません</p>
          </div>
        )}
        {ideas.map((idea) => (
          <GlowCard key={idea.id} hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">{idea.theme}</h3>
                {idea.memo && <p className="text-xs text-gray-400 mt-1">{idea.memo}</p>}
                <p className="text-[10px] text-gray-600 mt-2">
                  {new Date(idea.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/ai-generate?theme=${encodeURIComponent(idea.theme)}`}
                  className="p-2 rounded-lg bg-dark-800 hover:bg-dark-600 transition-all"
                  title="AI生成に使う"
                >
                  <Sparkles className="w-4 h-4 text-neon-purple" />
                </a>
                <button
                  onClick={() => handleDelete(idea.id)}
                  className="p-2 rounded-lg bg-dark-800 hover:bg-red-900/30 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
