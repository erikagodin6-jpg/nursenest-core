import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS } from "@/lib/marketing/marketing-public-content-policy";
import { logMarketingPublicContentOverrideLoadFailure } from "@/lib/marketing/marketing-public-content-observability";

const ALLOWLIST_KEYS = Object.keys(MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS) as string[];

export const MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG = "marketing-public-content";

export function marketingPublicContentOverrideLocaleTag(locale: string): string {
  const loc = locale.trim().toLowerCase() || "en";
  return `${MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG}:${loc}`;
}

async function loadMarketingPublicContentOverridesImpl(locale: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  if (!isDatabaseUrlConfigured()) return out;
  try {
    const rows = await prisma.marketingPublicContentOverride.findMany({
      where: {
        locale,
        isPublished: true,
        messageKey: { in: ALLOWLIST_KEYS },
      },
      select: { messageKey: true, value: true },
    });
    for (const r of rows) {
      out[r.messageKey] = r.value;
    }
  } catch (e) {
    logMarketingPublicContentOverrideLoadFailure({
      detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
    });
  }
  return out;
}

/**
 * One stable `unstable_cache` factory per locale (per server process) so Next can attach tags/revalidate
 * predictably without re-registering cache handlers on every render.
 */
const overrideCacheByLocale = new Map<string, () => Promise<Record<string, string>>>();

function getCachedOverrideLoader(locale: string): () => Promise<Record<string, string>> {
  const loc = locale.trim().toLowerCase() || "en";
  let loader = overrideCacheByLocale.get(loc);
  if (!loader) {
    loader = unstable_cache(
      async () => loadMarketingPublicContentOverridesImpl(loc),
      ["marketing-public-content-overrides-v1", loc],
      {
        tags: [MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG, marketingPublicContentOverrideLocaleTag(loc)],
        revalidate: 300,
      },
    );
    overrideCacheByLocale.set(loc, loader);
  }
  return loader;
}

export async function loadMarketingPublicContentOverridesForLocale(
  locale: string,
): Promise<Record<string, string>> {
  const loc = locale.trim().toLowerCase() || "en";
  return getCachedOverrideLoader(loc)();
}
