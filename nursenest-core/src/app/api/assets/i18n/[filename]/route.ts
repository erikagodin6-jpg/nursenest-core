import path from "path";
import { NextResponse } from "next/server";
import { loadMergedMarketingMessagesFromNextPublicDir } from "@/lib/i18n/merge-next-public-i18n-shards";

/** Must match `script/compile-i18n.ts` / `script/merge-marketing-i18n.ts`. */
const ALLOWED = new Set<string>([
  "en", "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id", "it", "ru",
]);

/** Scoped to `public/i18n` under the app root (matches `source_dir` / `process.cwd()` on DO App Platform). */
const I18N_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "public", "i18n");

function resolveMergedBundle(lang: string): Record<string, string> | null {
  if (!ALLOWED.has(lang)) return null;
  return loadMergedMarketingMessagesFromNextPublicDir(I18N_DIR, lang);
}

/**
 * Fallback for clients that cannot fetch static `/i18n/{lang}.json` (same contract as monolith SPA).
 * Path: `/api/assets/i18n/{lang}.json`
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
): Promise<Response> {
  const { filename } = await context.params;
  const lang = filename.replace(/\.json$/i, "");
  if (!ALLOWED.has(lang)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const cdnBase = process.env.MARKETING_I18N_CDN_BASE?.trim()?.replace(/\/$/, "");
  if (cdnBase && /^https?:\/\//i.test(cdnBase)) {
    const target = `${cdnBase}/${encodeURIComponent(lang)}.json`;
    return NextResponse.redirect(target, 307);
  }

  const merged = resolveMergedBundle(lang);
  if (!merged || Object.keys(merged).length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const body = JSON.stringify(merged);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
