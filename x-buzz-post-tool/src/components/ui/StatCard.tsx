"use client";

import { LucideIcon } from "lucide-react";
import GlowCard from "./GlowCard";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: LucideIcon;
}

export default function StatCard({ title, value, change, changePositive, icon: Icon }: StatCardProps) {
  return (
    <GlowCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changePositive ? "text-green-400" : "text-red-400"}`}>
              {changePositive ? "+" : ""}{change}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
          <Icon className="w-5 h-5 text-neon-indigo" />
        </div>
      </div>
    </GlowCard>
  );
}
