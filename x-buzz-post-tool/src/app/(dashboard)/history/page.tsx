"use client";

import { Eye, Heart, Repeat2, Star } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { dummyMetrics } from "@/lib/dummy-data";

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + "万";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-dark-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-[10px] text-gray-400 w-4 text-right">{value}</span>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">投稿履歴</h1>
        <p className="text-sm text-gray-400 mt-1">過去の投稿とパフォーマンスを分析</p>
      </div>

      <div className="space-y-4">
        {dummyMetrics.map((post) => (
          <GlowCard key={post.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-200 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{new Date(post.postedAt).toLocaleDateString("ja-JP")}</span>
                    <span className="px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple text-[10px]">
                      {post.tone}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue text-[10px]">
                      {post.theme}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-neon-indigo/10">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-white font-medium">{formatNumber(post.impressions)}</span>
                  <span className="text-xs text-gray-500">imp</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span className="text-white font-medium">{formatNumber(post.likes)}</span>
                  <span className="text-xs text-gray-500">likes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Repeat2 className="w-4 h-4 text-gray-500" />
                  <span className="text-white font-medium">{formatNumber(post.retweets)}</span>
                  <span className="text-xs text-gray-500">RT</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                  <Star className="w-3 h-3" /> 主観スコア
                </div>
                <ScoreBar label="フック力" value={post.hookStrength} />
                <ScoreBar label="共感度" value={post.empathy} />
                <ScoreBar label="拡散性" value={post.shareability} />
                <ScoreBar label="自己評価" value={post.selfScore} />
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
