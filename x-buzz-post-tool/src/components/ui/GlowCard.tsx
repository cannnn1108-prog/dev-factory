"use client";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlowCard({ children, className = "", hover = false }: GlowCardProps) {
  return (
    <div
      className={`
        relative rounded-2xl bg-dark-700/60 backdrop-blur-sm
        glow-border p-6
        ${hover ? "transition-all duration-300 hover:bg-dark-600/60 hover:shadow-neon-glow cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
