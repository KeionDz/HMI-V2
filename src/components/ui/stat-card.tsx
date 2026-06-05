import { type ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: ReactNode;
  className?: string;
}

export function StatCard({ title, value, className = "" }: StatCardProps) {
  return (
    <div className={`bg-[#1d2338] border border-border/20 rounded-xl p-4 flex flex-col items-center justify-center ${className}`}>
      <span className="text-sm font-semibold mb-1 text-muted-foreground">{title}</span>
      <span className="text-2xl font-medium text-foreground">{value}</span>
    </div>
  );
}