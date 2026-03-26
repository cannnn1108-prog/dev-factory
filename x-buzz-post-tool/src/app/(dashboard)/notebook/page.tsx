"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { useProfile } from "@/lib/profile-context";
import { fetchIdeas, createIdea, deleteIdea } from "@/lib/db";

interface Idea {
  id: string;
  theme: string;
  memo: string | null;
  created_at: string;
}

export default function NotebookPage() {
  const { profileId, loading: profileLoading } = useProfile();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTheme, setNewTheme] = useState("");
  const [newMemo, setNewMemo] = useState("");

  const loadIdeas = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const data = await fetchIdeas(profileId);
      setIdeas(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [profileId]);

  useEffect(() => { loadIdeas(); }, [loadIdeas]);

  const handleAdd = async () => {
    if (!newTheme.trim() || !profileId) return;
    try {
      const created = await createIdea(profileId, newTheme.trim(), newMemo.trim());
      setIdeas((prev) => [created, ...prev]);
      setNewTheme("");
      setNewMemo("");
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIdea(id);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
    } catch (e) { console.error(e); }
  };

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 text-neon-indigo animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">ネタ帳</h1>
        <p className="text-sm text-gray-400 mt-1">バズ投稿のアイデアをストックして管理</p>
      </div>

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
                  {new Date(idea.created_at).toLocaleDateString("ja-JP")}
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
