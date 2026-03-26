"use client";

import { LucideIcon } from "lucide-react";
import GlowCard from "./GlowCard";

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export default function QuickAction({ title, description, icon: Icon, href }: QuickActionProps) {
  return (
    <a href={href}>
      <GlowCard hover>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 shrink-0">
            <Icon className="w-5 h-5 text-neon-indigo" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
      </GlowCard>
    </a>
  );
}
