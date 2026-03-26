"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  Calendar,
  History,
  Sparkles,
  BookOpen,
  UserCircle,
  RefreshCw,
  Send,
  BarChart3,
  HelpCircle,
  AlertCircle,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useProfile } from "@/lib/profile-context";

const mainNav = [
  { label: "ダッシュボード", href: "/", icon: LayoutDashboard },
  { label: "X投稿作成", href: "/generate", icon: PenSquare },
  { label: "バズ予約投稿", href: "/schedule", icon: Calendar },
  { label: "バズ投稿履歴", href: "/history", icon: History },
  { label: "AIバズ投稿生成", href: "/ai-generate", icon: Sparkles },
];

const subNav = [
  { label: "ネタ帳", href: "/notebook", icon: BookOpen },
  { label: "バズキャラ設定", href: "/persona", icon: UserCircle },
  { label: "学習AIリライト", href: "/rewrite", icon: RefreshCw },
  { label: "自動バズ通信", href: "/auto-post", icon: Send },
  { label: "バズインサイト分析", href: "/insights", icon: BarChart3 },
  { label: "セットアップガイド", href: "/guide", icon: HelpCircle },
];

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: { label: string; href: string; icon: React.ElementType };
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white shadow-neon-glow border border-neon-indigo/30"
            : "text-gray-400 hover:text-white hover:bg-dark-600/50"
        }
      `}
    >
      <Icon className={`w-4 h-4 ${isActive ? "text-neon-indigo" : ""}`} />
      <span>{item.label}</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { userEmail, signOut } = useProfile();

  return (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-neon-indigo/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Xバズポストツール</h1>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="px-5 py-3 border-b border-neon-indigo/10">
        {userEmail ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300 truncate max-w-[160px]">{userEmail}</p>
              <p className="text-[10px] text-gray-600">ログイン中</p>
            </div>
            <button onClick={signOut} className="p-1.5 rounded-lg hover:bg-dark-600 transition-all" title="ログアウト">
              <LogOut className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-yellow-400/80">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>未ログイン</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} isActive={pathname === item.href} onClick={onNavigate} />
          ))}
        </div>

        <div className="my-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600 uppercase tracking-wider whitespace-nowrap">学習＆AI</span>
            <div className="flex-1 h-px bg-neon-indigo/10" />
          </div>
        </div>

        <div className="space-y-1">
          {subNav.map((item) => (
            <NavLink key={item.href} item={item} isActive={pathname === item.href} onClick={onNavigate} />
          ))}
        </div>
      </nav>

      {/* Platform Switcher */}
      <div className="p-4 border-t border-neon-indigo/10">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-700/50">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <span className="text-xs text-gray-300">X (Twitter)</span>
          <span className="ml-auto text-[10px] text-gray-600">切替</span>
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-dark-800/90 backdrop-blur-sm border border-neon-indigo/20 lg:hidden"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-dark-800/80 backdrop-blur-md border-r border-neon-indigo/10 flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-dark-800 flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-dark-600 transition-all"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
