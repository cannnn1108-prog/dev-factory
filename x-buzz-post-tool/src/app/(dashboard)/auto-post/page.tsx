"use client";

import { useState } from "react";
import { Send, Clock, ToggleLeft, ToggleRight, Plus, Trash2 } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

interface AutoRule {
  id: string;
  name: string;
  frequency: string;
  timeSlots: string[];
  personaId: string;
  themes: string[];
  enabled: boolean;
}

const dummyRules: AutoRule[] = [
  {
    id: "ar1",
    name: "朝の学び投稿",
    frequency: "毎日",
    timeSlots: ["07:00"],
    personaId: "per1",
    themes: ["AI開発", "プログラミング学習"],
    enabled: true,
  },
  {
    id: "ar2",
    name: "週末まとめ投稿",
    frequency: "毎週土曜",
    timeSlots: ["10:00"],
    personaId: "per1",
    themes: ["週間振り返り", "気づき"],
    enabled: false,
  },
];

export default function AutoPostPage() {
  const [rules] = useState(dummyRules);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">自動バズ通信</h1>
          <p className="text-sm text-gray-400 mt-1">AIが自動で投稿を生成・予約するルールを設定</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all"
        >
          <Plus className="w-4 h-4" /> ルール追加
        </button>
      </div>

      {/* How it works */}
      <GlowCard className="bg-gradient-to-r from-neon-blue/5 to-neon-purple/5">
        <div className="flex items-start gap-3">
          <Send className="w-5 h-5 text-neon-indigo shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">自動バズ通信の仕組み</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              設定したルールに従い、AIがテーマに沿ったバズ投稿を自動生成し、指定時刻に予約投稿としてセットします。
              バズキャラ設定のペルソナが自動で適用されます。
            </p>
          </div>
        </div>
      </GlowCard>

      {/* New Rule Form */}
      {showForm && (
        <GlowCard>
          <h2 className="text-sm font-semibold text-white mb-4">新しい自動投稿ルール</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">ルール名</label>
              <input
                type="text"
                placeholder="例: 朝の学び投稿"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">頻度</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all">
                <option>毎日</option>
                <option>平日のみ</option>
                <option>毎週月曜</option>
                <option>毎週土曜</option>
                <option>毎週日曜</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">投稿時刻</label>
              <input
                type="time"
                defaultValue="07:00"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">テーマ（カンマ区切り）</label>
              <input
                type="text"
                placeholder="例: AI開発, プログラミング"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
          </div>
          <button className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all">
            ルールを作成
          </button>
        </GlowCard>
      )}

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <GlowCard key={rule.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="shrink-0">
                  {rule.enabled ? (
                    <ToggleRight className="w-8 h-8 text-neon-indigo" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-600" />
                  )}
                </button>
                <div>
                  <h3 className="text-sm font-medium text-white">{rule.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {rule.frequency} {rule.timeSlots.join(", ")}
                    </span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {rule.themes.map((theme) => (
                      <span key={theme} className="text-[10px] px-2 py-0.5 rounded-full bg-neon-purple/15 text-neon-purple">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg bg-dark-800 hover:bg-red-900/30 transition-all">
                <Trash2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
