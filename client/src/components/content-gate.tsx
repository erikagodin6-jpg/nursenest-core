import { LocaleLink } from "@/lib/LocaleLink";
import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { getTierPricingPath, getTierLabel } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ChevronDown, Sparkles, ArrowRight, Eye } from "lucide-react";
import { useEntitlement } from "@/hooks/use-entitlement";

import { useI18n } from "@/lib/i18n";
export type ContentVisibility = "free" | "preview" | "premium";

interface ContentGateProps {
  visibility: ContentVisibility;
  requiredTier?: string;
  previewLines?: number;
  children: ReactNode;
  featureName?: string;
}

export function ContentGate({
  visibility,
  requiredTier = "rpn",
  previewLines = 3,
  children,
  featureName = "this content",
}: ContentGateProps) {
  const { t } = useI18n();
  const { user, hasAccess: authHasAccess } = useAuth();
  const entitlement = useEntitlement("feature", requiredTier);

  const localAccess = authHasAccess(requiredTier);
  const hasAccess = user ? (entitlement.isLoading ? localAccess : entitlement.hasAccess) : localAccess;

  if (visibility === "free" || hasAccess) {
    return <>{children}</>;
  }

  if (visibility === "preview") {
    return (
      <div className="relative overflow-hidden" data-testid="container-preview-content">
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "isAccessibleForFree": "False",
            "hasPart": {
              "@type": "WebPageElement",
              "isAccessibleForFree": "False",
              "cssSelector": ".premium-content"
            }
          })}
        </script>

        <div
          className="relative max-h-[200px] overflow-hidden blur-[2px] opacity-60 pointer-events-none select-none"
          aria-hidden="true"
          data-nosnippet=""
        >
          {children}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent h-48 flex flex-col items-center justify-end pb-8 pt-16 px-6 z-20">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 shadow-sm border border-primary/10 rotate-3">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">{t("components.contentGate.premiumContent")}</h4>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-xs leading-relaxed">
            Unlock {featureName} with a {getTierLabel(requiredTier)} subscription.
          </p>
          <LocaleLink href={getTierPricingPath(requiredTier)}>
            <Button size="lg" className="rounded-full gap-2 bg-primary text-white hover:brightness-110 px-8 shadow-lg shadow-primary/20" data-testid="button-unlock-preview">
              <Sparkles className="w-4 h-4" />
              Upgrade to {getTierLabel(requiredTier)}
            </Button>
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <Card className="border border-gray-100 bg-gradient-to-br from-gray-50 to-white" data-testid="card-locked-content">
      <CardContent className="p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-primary/60" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Premium Content
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
          Access {featureName} with a {getTierLabel(requiredTier)} subscription. 
          Build deeper clinical reasoning with mechanism-level explanations and interactive practice.
        </p>
        <LocaleLink href={getTierPricingPath(requiredTier)}>
          <Button className="rounded-full gap-2 bg-primary text-white hover:brightness-110 px-6" data-testid="button-unlock-premium">
            <Sparkles className="w-4 h-4" />
            Upgrade to {getTierLabel(requiredTier)}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </LocaleLink>
      </CardContent>
    </Card>
  );
}

interface InternalLinkCardProps {
  href: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export function InternalLinkCard({ href, title, description, icon, badge }: InternalLinkCardProps) {
  return (
    <LocaleLink href={href}>
      <Card className="border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer group h-full">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors truncate">
                  {title}
                </span>
                {badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                    {badge}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-gray-400 truncate mt-0.5">{description}</p>
              )}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </CardContent>
      </Card>
    </LocaleLink>
  );
}

export function CrossLinkBanner({ 
  title, 
  description, 
  href, 
  ctaText = "Explore",
  variant = "default" 
}: { 
  title: string; 
  description: string; 
  href: string; 
  ctaText?: string;
  variant?: "default" | "subtle";
}) {
  if (variant === "subtle") {
    return (
      <LocaleLink href={href}>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer group" data-testid={`link-crosslink-${href.replace(/\//g, '-')}`}>
          <Sparkles className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{title}</span>
            <span className="text-xs text-gray-400 ml-2">{description}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </LocaleLink>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent-foreground/5 rounded-xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <LocaleLink href={href}>
          <Button className="rounded-full gap-2 bg-primary text-white hover:brightness-110 flex-shrink-0" data-testid={`button-crosslink-${href.replace(/\//g, '-')}`}>
            {ctaText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </LocaleLink>
      </div>
    </div>
  );
}
