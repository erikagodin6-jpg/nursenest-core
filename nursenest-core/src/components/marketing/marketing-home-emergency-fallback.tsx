import { MarketingHomeSafeMode } from "@/components/marketing/marketing-home-safe-mode";

/**
 * Last-resort homepage body when the normal marketing home tree throws.
 * Layout chrome (header/footer) remains from the parent layout when that path succeeded.
 */
export function MarketingHomeEmergencyFallback() {
  return <MarketingHomeSafeMode layout="embedded" />;
}
