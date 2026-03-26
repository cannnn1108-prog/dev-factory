"use client";

import { Save, UserCircle, Check, Loader2 } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { useProfile } from "@/lib/profile-context";
import { fetchPersona, upsertPersona } from "@/lib/db";
import { useState, useEffect, useCallback } from "react";

interface PersonaForm {
  name: string;
  first_person: string;
  writing_style: string;
  endings: string[];
  ng_expressions: string[];
  values: string;
  target_audience: string;
  expert_topics: string[];
  cta_style: string;
}

const defaultPersona: PersonaForm = {
  name: "テック太郎",
  first_person: "僕",
  writing_style: "カジュアルだけど信頼感のある文体",
  endings: ["〜だと思う", "〜なんですよね", "〜してみてください"],
  ng_expressions: ["絶対に", "誰でも簡単に", "裏ワザ"],
  values: "実体験ベースで嘘をつかない。初心者に寄り添う。",
  target_audience: "20-30代のプログラミング初心者・副業に興味がある会社員",
  expert_topics: ["AI開発", "Claude Code", "Web開発", "副業"],
  cta_style: "押し付けず、自然に行動を促す",
};

export default function PersonaPage() {
  const { profileId, loading: profileLoading } = useProfile();
  const [persona, setPersona] = useState<PersonaForm>(defaultPersona);
  const [personaId, setPersonaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadPersona = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const data = await fetchPersona(profileId);
      if (data) {
        setPersonaId(data.id);
        setPersona({
          name: data.name,
          first_person: data.first_person,
          writing_style: data.writing_style,
          endings: data.endings || [],
          ng_expressions: data.ng_expressions || [],
          values: data.values,
          target_audience: data.target_audience,
          expert_topics: data.expert_topics || [],
          cta_style: data.cta_style,
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [profileId]);

  useEffect(() => { loadPersona(); }, [loadPersona]);

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);
    try {
      const result = await upsertPersona(profileId, persona, personaId || undefined);
      if (result) setPersonaId(result.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const updateField = (field: string, value: string) => {
    setPersona((prev) => ({ ...prev, [field]: value }));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">バズキャラ設定</h1>
          <p className="text-sm text-gray-400 mt-1">投稿の人格・文体を設定して一貫性を保つ</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-neon-glow transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "保存中..." : saved ? "保存しました" : "保存"}
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
              <input type="text" value={persona.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">一人称</label>
              <input type="text" value={persona.first_person} onChange={(e) => updateField("first_person", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">文体</label>
              <textarea value={persona.writing_style} onChange={(e) => updateField("writing_style", e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">よく使う語尾（カンマ区切り）</label>
              <input type="text" value={persona.endings.join(", ")} onChange={(e) => setPersona((prev) => ({ ...prev, endings: e.target.value.split(", ") }))} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all" />
            </div>
          </div>
        </GlowCard>

        <GlowCard>
          <h2 className="text-sm font-semibold text-white mb-6">ターゲット・方針</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">価値観</label>
              <textarea value={persona.values} onChange={(e) => updateField("values", e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">狙う読者</label>
              <input type="text" value={persona.target_audience} onChange={(e) => updateField("target_audience", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">得意テーマ（カンマ区切り）</label>
              <input type="text" value={persona.expert_topics.join(", ")} onChange={(e) => setPersona((prev) => ({ ...prev, expert_topics: e.target.value.split(", ") }))} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">NG表現（カンマ区切り）</label>
              <input type="text" value={persona.ng_expressions.join(", ")} onChange={(e) => setPersona((prev) => ({ ...prev, ng_expressions: e.target.value.split(", ") }))} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">CTAの癖</label>
              <input type="text" value={persona.cta_style} onChange={(e) => updateField("cta_style", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-neon-indigo/20 text-white text-sm focus:outline-none focus:border-neon-indigo/50 transition-all" />
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
