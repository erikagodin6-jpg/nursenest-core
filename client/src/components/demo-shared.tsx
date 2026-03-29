// Shared demo screenshot components - reusable across all demo screens.
// NOT real learner data - for marketing screenshots only.

import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Minus, CheckCircle2, AlertTriangle,
  Target, Zap, Clock, Star, ChevronRight,
} from "lucide-react";

export const DEMO_BG = "#FCFAFF";
export const DEMO_FONT = "'DM Sans', sans-serif";

export function DemoPageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen", className)} style={{ background: DEMO_BG, fontFamily: DEMO_FONT }}>
      {children}
    </div>
  );
}

export function DemoHeader({ title, subtitle, rightContent }: { title: string; subtitle?: string; rightContent?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {rightContent}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={cn("flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center", accent || "bg-violet-50 text-violet-500")}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500 font-medium leading-tight">{label}</p>
        <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 80, strokeWidth = 6, color = "#8b5cf6", label }: {
  value: number; size?: number; strokeWidth?: number; color?: string; label?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f0fb" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-slate-800">{value}%</span>
        {label && <span className="text-[8px] text-slate-400 font-medium">{label}</span>}
      </div>
    </div>
  );
}

export function MasteryBar({ value, height = 8, className }: { value: number; height?: number; className?: string }) {
  const barColor = value >= 80 ? "bg-emerald-400" : value >= 70 ? "bg-sky-400" : value >= 60 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className={cn("bg-slate-100 rounded-full overflow-hidden", className)} style={{ height }}>
      <div className={cn("h-full rounded-full transition-all duration-700", barColor)} style={{ width: `${value}%` }} />
    </div>
  );
}

export function StatusPill({ status, size = "sm" }: { status: string; size?: "xs" | "sm" }) {
  const styles: Record<string, string> = {
    "Strong": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Mastered": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Improving": "bg-sky-50 text-sky-700 border-sky-100",
    "Stable": "bg-slate-50 text-slate-600 border-slate-100",
    "Moderate": "bg-amber-50 text-amber-700 border-amber-100",
    "Needs Review": "bg-rose-50 text-rose-600 border-rose-100",
    "Focus Area": "bg-rose-50 text-rose-600 border-rose-100",
    "On Track": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "High": "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  const s = styles[status] || "bg-slate-50 text-slate-600 border-slate-100";
  return (
    <span className={cn("inline-flex items-center rounded-full border font-semibold", s,
      size === "xs" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"
    )}>{status}</span>
  );
}

export function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-rose-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

export function PriorityBadge({ priority }: { priority: string }) {
  if (priority === "high" || priority === "urgent") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-semibold border border-rose-100">
      <AlertTriangle className="w-2.5 h-2.5" /> High Priority
    </span>
  );
  if (priority === "medium") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold border border-amber-100">
      <Target className="w-2.5 h-2.5" /> Medium
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold border border-emerald-100">
      <CheckCircle2 className="w-2.5 h-2.5" /> Low
    </span>
  );
}

export function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-md border-0 p-6", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function HeatCell({ value }: { value: number }) {
  const bg = value >= 80 ? "bg-emerald-400" : value >= 70 ? "bg-emerald-300" : value >= 60 ? "bg-amber-300" : value >= 50 ? "bg-amber-400" : "bg-rose-300";
  return (
    <div className={cn("w-full aspect-square rounded-md flex items-center justify-center text-[10px] font-bold text-white", bg)}>
      {value}
    </div>
  );
}
