"use client";

import { useState } from "react";
import { Save, UserCircle } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { dummyPersona } from "@/lib/dummy-data";

export default function PersonaPage() {
  const [persona, setPersona] = useState(dummyPersona);

  const updateField = (field: string, value: string) => {
    setPersona((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">バズキャラ設定</h1>
          <p className="text-sm text-gray-400 mt-1">投稿の人格・文体を設定して一貫性を保つ</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all">
          <Save className="w-4 h-4" /> 保存
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlowCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
              <UserCircle className="w-6 h-6 text-neon-indigo" />
            </div>
            <h2 className="text-sm font-semibold text-white">基本情報</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">キャラ名</label>
              <input
                type="text"
                value={persona.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">一人称</label>
              <input
                type="text"
                value={persona.firstPerson}
                onChange={(e) => updateField("firstPerson", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">文体</label>
              <textarea
                value={persona.writingStyle}
                onChange={(e) => updateField("writingStyle", e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">よく使う語尾（カンマ区切り）</label>
              <input
                type="text"
                value={persona.endings.join(", ")}
                onChange={(e) => setPersona((prev) => ({ ...prev, endings: e.target.value.split(", ") }))}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <h2 className="text-sm font-semibold text-white mb-6">ターゲット・方針</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">価値観</label>
              <textarea
                value={persona.values}
                onChange={(e) => updateField("values", e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">狙う読者</label>
              <input
                type="text"
                value={persona.targetAudience}
                onChange={(e) => updateField("targetAudience", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">得意テーマ（カンマ区切り）</label>
              <input
                type="text"
                value={persona.expertTopics.join(", ")}
                onChange={(e) => setPersona((prev) => ({ ...prev, expertTopics: e.target.value.split(", ") }))}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">NG表現（カンマ区切り）</label>
              <input
                type="text"
                value={persona.ngExpressions.join(", ")}
                onChange={(e) => setPersona((prev) => ({ ...prev, ngExpressions: e.target.value.split(", ") }))}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">CTAの癖</label>
              <input
                type="text"
                value={persona.ctaStyle}
                onChange={(e) => updateField("ctaStyle", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all"
              />
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
