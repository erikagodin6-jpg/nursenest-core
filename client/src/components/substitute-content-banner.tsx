import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubstitutionMeta {
  originalContentId: string;
  substituteId: string;
  matchScore: number;
  matchingCriteria: Record<string, boolean>;
  wasLanguageFallback: boolean;
  message: string;
}

interface SubstituteContentBannerProps {
  substitutionMeta?: SubstitutionMeta | null;
  onViewSubstitute?: () => void;
  className?: string;
}

export function SubstituteContentBanner({
  substitutionMeta,
  onViewSubstitute,
  className = "",
}: SubstituteContentBannerProps) {
  if (!substitutionMeta) return null;

  return (
    <Alert
      className={`bg-blue-50 border-blue-200 ${className}`}
      data-testid="banner-substitute-content"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <AlertDescription className="text-blue-800 text-sm font-medium leading-relaxed" data-testid="text-substitute-message">
            {substitutionMeta.message}
          </AlertDescription>
          {substitutionMeta.wasLanguageFallback && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600" data-testid="text-language-fallback-notice">
              <Globe className="w-3.5 h-3.5" />
              <span>This resource is displayed in the default language.</span>
            </div>
          )}
          {onViewSubstitute && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100 gap-1 px-2 h-7 text-xs"
              onClick={onViewSubstitute}
              data-testid="button-view-substitute"
            >
              Continue with backup resource
              <ArrowRight className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}

export function useSubstitutionMeta(data: any): SubstitutionMeta | null {
  if (!data) return null;
  if (data._substitutionMeta) return data._substitutionMeta;
  if (data._deliveryTier === "substitute_equivalent" && data.data?._substitutionMeta) {
    return data.data._substitutionMeta;
  }
  return null;
}
