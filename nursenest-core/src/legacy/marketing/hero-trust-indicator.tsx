"use client";

import { Users, ShieldCheck } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const audiences = [
  { key: "hero.trustIndicator.nursingStudents", fallback: "Nursing Students" },
  { key: "hero.trustIndicator.newGradNurses", fallback: "New Grad Nurses" },
  { key: "hero.trustIndicator.alliedHealth", fallback: "Allied Health" },
  { key: "hero.trustIndicator.certCandidates", fallback: "Cert Candidates" },
];

/** Restored from `client/src/components/hero-trust-indicator.tsx` */
export default function HeroTrustIndicator() {
  const { t } = useMarketingI18n();

  return (
    <section className="border-y border-gray-100 bg-white py-4 sm:py-5" data-testid="section-hero-trust-indicator">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-semibold text-gray-800" data-testid="text-built-for-badge">
              {(() => {
                const v = t("hero.trustIndicator.builtFor");
                return v === "hero.trustIndicator.builtFor" ? "Built For" : v;
              })()}
            </span>
          </div>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {audiences.map((item) => {
              const translated = t(item.key);
              const label = translated === item.key ? item.fallback : translated;
              return (
                <span
                  key={item.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
                  data-testid={`audience-${label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Users className="h-3 w-3 text-gray-400" />
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
