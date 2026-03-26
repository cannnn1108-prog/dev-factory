"use client";

import { useState } from "react";
import { Calendar, Clock, Edit3, Trash2, Plus, X } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { useLocalStorage } from "@/lib/use-local-storage";
import { ScheduledPost } from "@/types";
import { dummyScheduled } from "@/lib/dummy-data";

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-400",
  scheduled: "bg-neon-blue/20 text-neon-blue",
  posted: "bg-green-500/20 text-green-400",
};

const statusLabels: Record<string, string> = {
  draft: "下書き",
  scheduled: "予約済み",
  posted: "投稿済み",
};

export default function SchedulePage() {
  const [posts, setPosts] = useLocalStorage<ScheduledPost[]>("buzz_scheduled", dummyScheduled);
  const [showForm, setShowForm] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newContent.trim()) return;
    const post: ScheduledPost = {
      id: Date.now().toString(),
      content: newContent.trim(),
      scheduledAt: newDate || new Date().toISOString(),
      status: newDate ? "scheduled" : "draft",
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);
    setNewContent("");
    setNewDate("");
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStatusToggle = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "draft" ? "scheduled" : p.status === "scheduled" ? "draft" : p.status }
          : p
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">予約投稿</h1>
          <p className="text-sm text-gray-400 mt-1">投稿をスケジュールして最適なタイミングで自動投稿</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "閉じる" : "新規作成"}
        </button>
      </div>

      {/* New Post Form */}
      {showForm && (
        <GlowCard>
          <h2 className="text-sm font-semibold text-white mb-4">新しい予約投稿</h2>
          <div className="space-y-4">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="投稿内容を入力..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all resize-none"
            />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">投稿日時</label>
                <input
                  type="datetime-local"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white focus:outline-none focus:border-neon-indigo/50 transition-all"
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={!newContent.trim()}
                className="mt-5 px-6 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all disabled:opacity-50"
              >
                予約する
              </button>
            </div>
          </div>
        </GlowCard>
      )}

      {/* Scheduled Posts List */}
      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">予約投稿がありません</p>
          </div>
        )}
        {posts.map((post) => (
          <GlowCard key={post.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {editingId === post.id ? (
                  <textarea
                    defaultValue={post.content}
                    onBlur={(e) => {
                      setPosts((prev) =>
                        prev.map((p) => (p.id === post.id ? { ...p, content: e.target.value } : p))
                      );
                      setEditingId(null);
                    }}
                    autoFocus
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-neon-indigo/30 text-white text-sm focus:outline-none resize-none"
                  />
                ) : (
                  <p className="text-sm text-gray-200 leading-relaxed">{post.content}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.scheduledAt).toLocaleDateString("ja-JP")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(post.scheduledAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <button
                    onClick={() => handleStatusToggle(post.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] cursor-pointer hover:opacity-80 transition-all ${statusColors[post.status]}`}
                  >
                    {statusLabels[post.status]}
                  </button>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setEditingId(post.id)}
                  className="p-2 rounded-lg bg-dark-800 hover:bg-dark-600 transition-all"
                >
                  <Edit3 className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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
