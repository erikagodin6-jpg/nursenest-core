import { ShieldCheck } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface IntegrityProps {
  variant?: "inline" | "footer" | "banner";
  className?: string;
}

export function EducationalIntegrity({ variant = "inline", className = "" }: IntegrityProps) {
  const { t } = useI18n();
  const text = "NurseNest provides independently developed educational content grounded in established physiological principles and widely accepted clinical reasoning frameworks. NurseNest is not affiliated with or endorsed by any licensing or regulatory authority. All material is intended solely for educational use.";

  if (variant === "footer") {
    return (
      <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`} data-testid="text-integrity-footer">
        <div className="flex items-start gap-2 text-xs text-gray-400 max-w-3xl mx-auto">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-gray-300" />
          <p>{text}</p>
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`bg-gray-50 border border-gray-100 rounded-xl p-4 ${className}`} data-testid="text-integrity-banner">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">{t("components.educationalIntegrity.educationalIntegrity")}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <p className={`text-xs text-gray-400 leading-relaxed ${className}`} data-testid="text-integrity-inline">
      <ShieldCheck className="w-3 h-3 inline mr-1 -mt-0.5" />
      {text}
    </p>
  );
}
