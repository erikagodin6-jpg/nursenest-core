export type RiskLevel = "critical" | "high" | "medium" | "low";

export type RetentionRiskSignal = {
  code: string;
  label: string;
  severity: RiskLevel;
  detail: string;
};

export type RetentionRiskProfile = {
  userId: string;
  email: string;
  name: string;
  tier: string;
  riskLevel: RiskLevel;
  riskScore: number;
  healthScore: number;
  daysSinceLastActivity: number | null;
  signals: RetentionRiskSignal[];
  subscriptionEndsAt: string | null;
  daysUntilExpiry: number | null;
  recommendedAction: string;
};

export type RetentionRiskSummary = {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
  profiles: RetentionRiskProfile[];
  generatedAt: string;
};

export function riskLevelColor(level: RiskLevel): string {
  switch (level) {
    case "critical": return "text-red-700 bg-red-50 border-red-200";
    case "high": return "text-orange-700 bg-orange-50 border-orange-200";
    case "medium": return "text-amber-700 bg-amber-50 border-amber-200";
    case "low": return "text-slate-600 bg-slate-50 border-slate-200";
  }
}
