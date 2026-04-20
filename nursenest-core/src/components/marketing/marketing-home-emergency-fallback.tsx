import Link from "next/link";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";

const FALLBACK_REGION = "CA" as const;

/**
 * Last-resort homepage body when the normal marketing home tree throws.
 * Layout chrome (header/footer) remains from the parent layout when that path succeeded.
 */
export function MarketingHomeEmergencyFallback() {
  const title = defaultHomeMetaTitle(FALLBACK_REGION);
  const subtitle = defaultHomeMetaDescription(FALLBACK_REGION);
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-balance text-foreground/80">{subtitle}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/signup" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Get started
        </Link>
        <Link href="/pricing" className="rounded-md border border-border px-4 py-2">
          Pricing
        </Link>
      </div>
    </div>
  );
}
