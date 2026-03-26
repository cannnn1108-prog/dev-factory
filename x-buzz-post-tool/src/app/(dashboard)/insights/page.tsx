"use client";

import { BarChart3, TrendingUp, Clock, Hash, Flame } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import StatCard from "@/components/ui/StatCard";

const toneAnalysis = [
  { tone: "体験談型", count: 12, avgEngagement: 4.2, bestTime: "10:00" },
  { tone: "問題提起型", count: 8, avgEngagement: 3.8, bestTime: "09:00" },
  { tone: "結論先出し型", count: 6, avgEngagement: 3.5, bestTime: "12:00" },
  { tone: "箇条書き型", count: 5, avgEngagement: 3.1, bestTime: "08:00" },
  { tone: "煽りフック型", count: 4, avgEngagement: 2.9, bestTime: "21:00" },
];

const topHashtags = [
  { tag: "#ClaudeCode", impressions: 45200, posts: 5 },
  { tag: "#AI開発", impressions: 38100, posts: 8 },
  { tag: "#プログラミング", impressions: 32400, posts: 6 },
  { tag: "#副業", impressions: 28900, posts: 4 },
  { tag: "#生産性向上", impressions: 21300, posts: 3 },
];

const bestPostingTimes = [
  { time: "07:00-09:00", label: "朝活層", score: 85 },
  { time: "12:00-13:00", label: "ランチタイム", score: 72 },
  { time: "18:00-20:00", label: "帰宅後", score: 68 },
  { time: "21:00-23:00", label: "夜のリラックス", score: 90 },
];

function BarChart({ value, max }: { value: number; max: number }) {
  return (
    <div className="flex-1 h-2 rounded-full bg-dark-800">
      <div
        className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

export default function InsightsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">バズインサイト分析</h1>
        <p className="text-sm text-gray-400 mt-1">投稿パフォーマンスの傾向と最適化のヒント</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="総投稿数" value="35" change="今月 +12" changePositive icon={BarChart3} />
        <StatCard title="最高エンゲージメント" value="4.2%" change="体験談型が最強" changePositive icon={TrendingUp} />
        <StatCard title="ベスト投稿時間" value="21:00" change="夜が最も反応良い" changePositive icon={Clock} />
        <StatCard title="トップハッシュタグ" value="#ClaudeCode" change="4.5万imp" changePositive icon={Hash} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tone Analysis */}
        <GlowCard>
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">文体別パフォーマンス</h2>
          </div>
          <div className="space-y-4">
            {toneAnalysis.map((item) => (
              <div key={item.tone} className="flex items-center gap-4">
                <span className="text-xs text-gray-300 w-24 shrink-0">{item.tone}</span>
                <BarChart value={item.avgEngagement} max={5} />
                <span className="text-xs text-gray-500 w-16 text-right">{item.avgEngagement}%</span>
                <span className="text-[10px] text-gray-600 w-12 text-right">{item.count}件</span>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Best Posting Times */}
        <GlowCard>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">最適投稿時間帯</h2>
          </div>
          <div className="space-y-4">
            {bestPostingTimes.map((slot) => (
              <div key={slot.time} className="flex items-center gap-4">
                <div className="w-28 shrink-0">
                  <p className="text-xs text-white font-medium">{slot.time}</p>
                  <p className="text-[10px] text-gray-500">{slot.label}</p>
                </div>
                <BarChart value={slot.score} max={100} />
                <span className="text-xs text-gray-400 w-10 text-right">{slot.score}</span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Top Hashtags */}
      <GlowCard>
        <div className="flex items-center gap-2 mb-6">
          <Hash className="w-5 h-5 text-neon-purple" />
          <h2 className="text-lg font-semibold text-white">ハッシュタグランキング</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-neon-indigo/10">
                <th className="text-left py-3 px-4">ランク</th>
                <th className="text-left py-3 px-4">ハッシュタグ</th>
                <th className="text-right py-3 px-4">インプレッション</th>
                <th className="text-right py-3 px-4">使用回数</th>
                <th className="text-right py-3 px-4">1件あたり</th>
              </tr>
            </thead>
            <tbody>
              {topHashtags.map((tag, i) => (
                <tr key={tag.tag} className="border-b border-neon-indigo/5 hover:bg-dark-600/30 transition-all">
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-400" : "text-gray-500"}`}>
                      #{i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neon-purple font-medium">{tag.tag}</td>
                  <td className="py-3 px-4 text-right text-white">{(tag.impressions / 1000).toFixed(1)}K</td>
                  <td className="py-3 px-4 text-right text-gray-400">{tag.posts}件</td>
                  <td className="py-3 px-4 text-right text-gray-400">{(tag.impressions / tag.posts / 1000).toFixed(1)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </div>
  );
}
