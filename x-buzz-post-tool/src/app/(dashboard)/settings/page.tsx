"use client";

import { useState } from "react";
import { Save, Key, Globe, Bell, Palette } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

export default function SettingsPage() {
  const [anthropicKey, setAnthropicKey] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [platform, setPlatform] = useState<"x" | "threads">("x");

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">設定</h1>
          <p className="text-sm text-gray-400 mt-1">APIキー、アカウント連携、通知の管理</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all">
          <Save className="w-4 h-4" /> 保存
        </button>
      </div>

      {/* Platform Selection */}
      <GlowCard>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-neon-indigo" />
          <h2 className="text-sm font-semibold text-white">プラットフォーム</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPlatform("x")}
            className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
              platform === "x"
                ? "border-neon-indigo/50 bg-neon-indigo/10 shadow-neon-glow"
                : "border-neon-indigo/10 bg-dark-800/50 hover:border-neon-indigo/20"
            }`}
          >
            <div className="p-2 rounded-lg bg-dark-800">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">X (Twitter)</p>
              <p className="text-[10px] text-gray-500">ポスト・リプライ対応</p>
            </div>
          </button>
          <button
            onClick={() => setPlatform("threads")}
            className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
              platform === "threads"
                ? "border-neon-indigo/50 bg-neon-indigo/10 shadow-neon-glow"
                : "border-neon-indigo/10 bg-dark-800/50 hover:border-neon-indigo/20"
            }`}
          >
            <div className="p-2 rounded-lg bg-dark-800">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.017.88-.724 2.104-1.13 3.59-1.19 1.076-.044 2.074.07 2.99.306-.025-1.384-.474-2.422-1.335-3.09-.899-.697-2.107-.992-3.59-.878l-.147-2.076c1.894-.136 3.54.28 4.762 1.226 1.283.993 2.005 2.506 2.087 4.376.306.14.594.3.863.482 1.2.81 2.073 1.882 2.532 3.098.803 2.128.678 4.92-1.528 7.078C18.437 23.012 16.16 23.88 12.9 23.97l-.105.002z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Threads</p>
              <p className="text-[10px] text-gray-500">近日対応予定</p>
            </div>
          </button>
        </div>
      </GlowCard>

      {/* API Keys */}
      <GlowCard>
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-yellow-400" />
          <h2 className="text-sm font-semibold text-white">APIキー設定</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Anthropic API Key</label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Supabase URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xxx.supabase.co"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Supabase Anon Key</label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJ..."
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all"
            />
          </div>
        </div>
      </GlowCard>

      {/* Notifications */}
      <GlowCard>
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">通知設定</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "投稿が自動公開されたとき", enabled: true },
            { label: "バズ投稿（1000imp以上）が発生したとき", enabled: true },
            { label: "予約投稿の失敗時", enabled: true },
            { label: "週次レポート", enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">{item.label}</span>
              <div
                className={`w-10 h-6 rounded-full transition-all cursor-pointer relative ${
                  item.enabled ? "bg-neon-indigo" : "bg-dark-600"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    item.enabled ? "left-5" : "left-1"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Appearance */}
      <GlowCard>
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">外観</h2>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-300">ダークテーマ</span>
          <div className="w-10 h-6 rounded-full bg-neon-indigo relative cursor-pointer">
            <span className="absolute top-1 left-5 w-4 h-4 rounded-full bg-white" />
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
