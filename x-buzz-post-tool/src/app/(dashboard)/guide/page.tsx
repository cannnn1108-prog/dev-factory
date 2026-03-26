"use client";

import { CheckCircle2, Circle, Key, UserCircle, Zap, Globe } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

const steps = [
  {
    title: "Anthropic APIキーを設定",
    description: "AI投稿生成に必要です。Anthropicのダッシュボードからキーを取得してください。",
    icon: Key,
    completed: false,
  },
  {
    title: "バズキャラ設定を作成",
    description: "投稿の人格・文体を設定して、一貫性のあるバズ投稿を生成しましょう。",
    icon: UserCircle,
    completed: false,
  },
  {
    title: "最初のAI投稿を生成",
    description: "テーマを入力してAI投稿を生成してみましょう。3パターンの投稿案が表示されます。",
    icon: Zap,
    completed: false,
  },
  {
    title: "Xアカウントを連携（任意）",
    description: "X Developer PlatformのAPIキーを設定すると、予約投稿の自動投稿が可能になります。",
    icon: Globe,
    completed: false,
  },
];

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">セットアップガイド</h1>
        <p className="text-sm text-gray-400 mt-1">ツールを使い始めるための手順</p>
      </div>

      <GlowCard className="bg-gradient-to-r from-neon-blue/5 to-neon-purple/5">
        <p className="text-sm text-gray-300 leading-relaxed">
          X Buzz Post Toolへようこそ。以下のステップを順番に完了すると、すべての機能が使えるようになります。
          APIキーの設定は必須ですが、Xアカウント連携は後からでも構いません。
        </p>
      </GlowCard>

      <div className="space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <GlowCard key={i} hover>
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500 w-6 text-center">
                    {i + 1}
                  </span>
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.description}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 shrink-0">
                  <Icon className="w-5 h-5 text-neon-indigo" />
                </div>
              </div>
            </GlowCard>
          );
        })}
      </div>

      <GlowCard>
        <h2 className="text-sm font-semibold text-white mb-3">環境変数の設定</h2>
        <p className="text-xs text-gray-400 mb-3">
          以下の環境変数を <code className="text-neon-purple bg-neon-purple/10 px-1.5 py-0.5 rounded">.env.local</code> に設定してください。
        </p>
        <div className="bg-dark-800 rounded-xl p-4 font-mono text-xs text-gray-300 space-y-1">
          <p><span className="text-neon-blue">ANTHROPIC_API_KEY</span>=your_api_key_here</p>
          <p><span className="text-neon-blue">NEXT_PUBLIC_SUPABASE_URL</span>=your_supabase_url</p>
          <p><span className="text-neon-blue">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=your_anon_key</p>
        </div>
      </GlowCard>
    </div>
  );
}
