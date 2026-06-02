import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Sparkles, Lock, ArrowRight, CheckCircle2, Shield } from "lucide-react";

type NewGradEntitlements = {
  tier: string;
  hasToolkitAccess: boolean;
  hasCertPrepAccess: boolean;
  hasFullAccess: boolean;
  features: {
    brainSheets: boolean;
    shiftTemplates: boolean;
    documentationCheats: boolean;
    medSafety: boolean;
    unitOnboarding: boolean;
    fullInterviewBank: boolean;
    premiumTemplates: boolean;
    fullQbank: boolean;
    mockExams: boolean;
    flashcards: boolean;
  };
};

export function useNewGradEntitlements() {
  const { user } = useAuth();

  const { data: entitlements } = useQuery<NewGradEntitlements>({
    queryKey: ["/api/newgrad/entitlements", user?.id],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem("nursenest-user-token");
      if (token) headers["x-user-token"] = token;
      const creds = localStorage.getItem("nursenest-credentials");
      if (creds) {
        try {
          const { username, password } = JSON.parse(creds);
          if (username) headers["x-username"] = username;
          if (password) headers["x-password"] = password;
        } catch {}
      }
      const res = await fetch("/api/newgrad/entitlements", { headers });
      if (!res.ok) return { tier: "free", hasToolkitAccess: false, hasCertPrepAccess: false, hasFullAccess: false, features: {} as any };
      return res.json();
    },
    staleTime: 60000,
  });

  const tier = user?.tier || "free";
  const isAdmin = tier === "admin";
  const hasToolkitAccess = isAdmin || entitlements?.hasToolkitAccess || false;
  const hasCertPrepAccess = isAdmin || entitlements?.hasCertPrepAccess || false;
  const hasFullAccess = isAdmin || entitlements?.hasFullAccess || false;

  return {
    user,
    tier,
    isAdmin,
    hasToolkitAccess,
    hasCertPrepAccess,
    hasFullAccess,
    hasAnyPremium: hasToolkitAccess || hasCertPrepAccess || hasFullAccess,
    features: entitlements?.features || {
      brainSheets: isAdmin,
      shiftTemplates: isAdmin,
      documentationCheats: isAdmin,
      medSafety: isAdmin,
      unitOnboarding: isAdmin,
      fullInterviewBank: isAdmin,
      premiumTemplates: isAdmin,
      fullQbank: isAdmin,
      mockExams: isAdmin,
      flashcards: isAdmin,
    },
  };
}

export function PremiumUpgradeCTA({ context, requiredEntitlement }: { context?: string; requiredEntitlement?: "toolkit" | "certification" }) {
  const { hasToolkitAccess, hasCertPrepAccess, hasFullAccess } = useNewGradEntitlements();
  const { t } = useI18n();

  if (hasFullAccess) return null;
  if (requiredEntitlement === "toolkit" && hasToolkitAccess) return null;
  if (requiredEntitlement === "certification" && hasCertPrepAccess) return null;
  if (!requiredEntitlement && hasToolkitAccess && hasCertPrepAccess) return null;

  const isToolkit = requiredEntitlement === "toolkit";
  const isCert = requiredEntitlement === "certification";

  const title = isCert
    ? t("newGrad.premiumCta.unlockCertPrep")
    : isToolkit
    ? t("newGrad.premiumCta.unlockToolkit")
    : t("newGrad.premiumCta.unlockPremium");

  const features = isCert
    ? [t("newGrad.premiumCta.certFeature1"), t("newGrad.premiumCta.certFeature2"), t("newGrad.premiumCta.certFeature3"), t("newGrad.premiumCta.certFeature4")]
    : isToolkit
    ? [t("newGrad.premiumCta.toolkitFeature1"), t("newGrad.premiumCta.toolkitFeature2"), t("newGrad.premiumCta.toolkitFeature3"), t("newGrad.premiumCta.toolkitFeature4")]
    : [t("newGrad.premiumCta.generalFeature1"), t("newGrad.premiumCta.generalFeature2"), t("newGrad.premiumCta.generalFeature3"), t("newGrad.premiumCta.generalFeature4")];

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl border border-indigo-100 p-8 my-8" data-testid="premium-upgrade-cta">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          {isCert ? <Shield className="w-6 h-6 text-indigo-600" /> : <Sparkles className="w-6 h-6 text-indigo-600" />}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {context || t("newGrad.premiumCta.defaultDesc")}
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            {features.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> {item}
              </span>
            ))}
          </div>
          <Link href="/subscribe/newgrad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm" data-testid="button-premium-upgrade">
            <Lock className="w-3.5 h-3.5" /> {t("newGrad.common.upgradeNow")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PremiumContentGate({
  children,
  previewContent,
  requiredEntitlement,
}: {
  children: React.ReactNode;
  previewContent?: React.ReactNode;
  requiredEntitlement?: "toolkit" | "certification";
}) {
  const { hasToolkitAccess, hasCertPrepAccess, hasFullAccess } = useNewGradEntitlements();

  let hasAccess = hasFullAccess;
  if (requiredEntitlement === "toolkit") hasAccess = hasAccess || hasToolkitAccess;
  else if (requiredEntitlement === "certification") hasAccess = hasAccess || hasCertPrepAccess;
  else hasAccess = hasAccess || hasToolkitAccess;

  if (hasAccess) return <>{children}</>;

  return (
    <div data-testid="premium-content-gate">
      {previewContent && (
        <div className="relative">
          {previewContent}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>
      )}
      <PremiumUpgradeCTA requiredEntitlement={requiredEntitlement} />
    </div>
  );
}

export function useNewGradAccess() {
  const entitlements = useNewGradEntitlements();
  return {
    hasAccess: entitlements.hasToolkitAccess || entitlements.hasFullAccess,
    user: entitlements.user,
    ...entitlements,
  };
}
