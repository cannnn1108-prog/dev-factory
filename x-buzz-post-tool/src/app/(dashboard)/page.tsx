"use client";

import { FileText, Calendar, Eye, Heart, PenSquare, Sparkles, HelpCircle, Settings, AlertCircle, Lock } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import GlowCard from "@/components/ui/GlowCard";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
        <p className="text-sm text-gray-400 mt-1">Xアカウントの概要と最新のバズ投稿パフォーマンス</p>
      </div>

      {/* Alert Banner */}
      <GlowCard className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
          <div>
            <p className="text-sm text-white font-medium">まずはXアカウントを登録しましょう！</p>
            <p className="text-xs text-gray-400 mt-0.5">
              「設定」からアカウントを追加するか、<a href="/guide" className="text-neon-blue underline underline-offset-2 hover:text-neon-purple transition-colors">セットアップガイド</a>を確認してください。
            </p>
          </div>
        </div>
      </GlowCard>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="公開済みバズ投稿"
          value="0"
          icon={FileText}
        />
        <StatCard
          title="予約バズ投稿"
          value="0"
          icon={Calendar}
        />
        <StatCard
          title="インプレッション"
          value="0"
          icon={Eye}
        />
        <StatCard
          title="いいね"
          value="0"
          icon={Heart}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Buzz Posts */}
        <div className="lg:col-span-2">
          <GlowCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">最近のバズ投稿</h2>
              <a href="/history" className="text-xs text-neon-blue hover:text-neon-purple transition-colors">
                すべて見る &rarr;
              </a>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-16 text-center">
              {/* Decorative chart placeholder */}
              <div className="relative w-48 h-28 mb-6 opacity-30">
                <div className="absolute bottom-0 left-0 w-full flex items-end justify-between gap-1.5 px-4">
                  {[40, 65, 35, 80, 55, 70, 45, 90, 60, 75, 50, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-neon-blue/50 to-neon-purple/50"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <Lock className="w-8 h-8 text-gray-600 mb-3" />
              <p className="text-sm text-gray-500">まだバズ投稿がありません</p>
              <p className="text-xs text-gray-600 mt-1">AI投稿生成から最初の投稿を作りましょう</p>
            </div>
          </GlowCard>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">クイックアクション</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/generate">
              <GlowCard hover className="text-center py-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
                    <PenSquare className="w-5 h-5 text-neon-indigo" />
                  </div>
                  <span className="text-xs font-medium text-gray-300">バズ投稿作成</span>
                </div>
              </GlowCard>
            </a>
            <a href="/ai-generate">
              <GlowCard hover className="text-center py-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-300">AIバズ生成</span>
                </div>
              </GlowCard>
            </a>
            <a href="/guide">
              <GlowCard hover className="text-center py-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <HelpCircle className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-300">ガイド</span>
                </div>
              </GlowCard>
            </a>
            <a href="/settings">
              <GlowCard hover className="text-center py-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <Settings className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-300">設定</span>
                </div>
              </GlowCard>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
