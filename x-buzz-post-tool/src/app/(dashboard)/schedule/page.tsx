"use client";
import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, Edit3, Trash2, Plus, X, Loader2, Send, RefreshCw, AlertCircle } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { useProfile } from "@/lib/profile-context";
import { fetchScheduledPosts, createScheduledPost, updateScheduledPost, deleteScheduledPost } from "@/lib/db";

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-400",
  scheduled: "bg-neon-blue/20 text-neon-blue",
  posting: "bg-yellow-500/20 text-yellow-400",
  posted: "bg-green-500/20 text-green-400",
  failed: "bg-red-500/20 text-red-400",
};

const statusLabels: Record<string, string> = {
  draft: "下書き",
  scheduled: "予約済み",
  posting: "投稿中...",
  posted: "投稿済み",
  failed: "失敗",
};

interface Post {
  id: string;
  content: string;
  scheduled_at: string;
  status: string;
  error_message?: string | null;
  posted_at?: string | null;
  created_at: string;
}

export default function SchedulePage() {
  const { profileId, loading: profileLoading } = useProfile();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [postingId, setPostingId] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const data = await fetchScheduledPosts(profileId);
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleAdd = async () => {
    if (!newContent.trim() || !profileId) return;
    try {
      const status = newDate ? "scheduled" : "draft";
      const scheduledAt = newDate ? new Date(newDate).toISOString() : new Date().toISOString();
      const created = await createScheduledPost(profileId, newContent.trim(), scheduledAt, status);
      setPosts((prev) => [created, ...prev].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()));
      setNewContent("");
      setNewDate("");
      setShowForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteScheduledPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "draft" ? "scheduled" : "draft";
    try {
      await updateScheduledPost(id, { status: newStatus });
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditSave = async (id: string, content: string) => {
    try {
      await updateScheduledPost(id, { content });
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, content } : p)));
      setEditingId(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Post immediately
  const handlePostNow = async (post: Post) => {
    setPostingId(post.id);
    try {
      const res = await fetch("/api/post-to-x", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: post.content.slice(0, 280) }),
      });
      const data = await res.json();
      if (!res.ok) {
        await updateScheduledPost(post.id, { status: "failed", error_message: data.error });
        setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: "failed", error_message: data.error } : p)));
      } else {
        await updateScheduledPost(post.id, { status: "posted", posted_at: new Date().toISOString() });
        setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: "posted", posted_at: new Date().toISOString() } : p)));
      }
    } catch {
      await updateScheduledPost(post.id, { status: "failed", error_message: "投稿に失敗しました" });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: "failed", error_message: "投稿に失敗しました" } : p)));
    } finally {
      setPostingId(null);
    }
  };

  // Retry failed post
  const handleRetry = async (post: Post) => {
    await updateScheduledPost(post.id, { status: "scheduled", error_message: null });
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: "scheduled", error_message: null } : p)));
  };

  const charLimit = 280;

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 text-neon-indigo animate-spin" />
      </div>
    );
  }

  const scheduledCount = posts.filter((p) => p.status === "scheduled").length;
  const postedCount = posts.filter((p) => p.status === "posted").length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">予約投稿</h1>
          <p className="text-sm text-gray-400 mt-1">
            投稿をスケジュールして最適なタイミングで自動投稿
          </p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-neon-blue">{scheduledCount}件 予約中</span>
            <span className="text-xs text-green-400">{postedCount}件 投稿済み</span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "閉じる" : "新規作成"}
        </button>
      </div>

      {showForm && (
        <GlowCard>
          <h2 className="text-sm font-semibold text-white mb-4">新しい予約投稿</h2>
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="投稿内容を入力..."
                rows={4}
                maxLength={charLimit}
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all resize-none"
              />
              <span className={`absolute bottom-3 right-3 text-xs ${charLimit - newContent.length < 20 ? "text-yellow-400" : "text-gray-500"}`}>
                {charLimit - newContent.length}
              </span>
            </div>
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
                {newDate ? "予約する" : "下書き保存"}
              </button>
            </div>
          </div>
        </GlowCard>
      )}

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
                    onBlur={(e) => handleEditSave(post.id, e.target.value)}
                    autoFocus
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-neon-indigo/30 text-white text-sm focus:outline-none resize-none"
                  />
                ) : (
                  <p className="text-sm text-gray-200 leading-relaxed">{post.content}</p>
                )}

                {/* Error message */}
                {post.status === "failed" && post.error_message && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    {post.error_message}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.scheduled_at).toLocaleDateString("ja-JP")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(post.scheduled_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <button
                    onClick={() => handleStatusToggle(post.id, post.status)}
                    disabled={post.status === "posted" || post.status === "posting"}
                    className={`px-2 py-0.5 rounded-full text-[10px] cursor-pointer hover:opacity-80 transition-all disabled:cursor-default ${statusColors[post.status] || statusColors.draft}`}
                  >
                    {statusLabels[post.status] || post.status}
                  </button>
                  {post.posted_at && (
                    <span className="text-green-400/60">
                      投稿: {new Date(post.posted_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                {/* Post now button */}
                {(post.status === "draft" || post.status === "scheduled") && (
                  <button
                    onClick={() => handlePostNow(post)}
                    disabled={postingId === post.id}
                    className="p-2 rounded-lg bg-dark-800 hover:bg-neon-blue/20 transition-all"
                    title="今すぐ投稿"
                  >
                    {postingId === post.id ? (
                      <Loader2 className="w-4 h-4 text-neon-blue animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-neon-blue" />
                    )}
                  </button>
                )}
                {/* Retry button */}
                {post.status === "failed" && (
                  <button
                    onClick={() => handleRetry(post)}
                    className="p-2 rounded-lg bg-dark-800 hover:bg-yellow-500/20 transition-all"
                    title="リトライ"
                  >
                    <RefreshCw className="w-4 h-4 text-yellow-400" />
                  </button>
                )}
                {post.status !== "posted" && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
