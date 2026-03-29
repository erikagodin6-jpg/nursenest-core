import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { NextResponse } from "next/server";

/** Must match `script/compile-i18n.ts` / `script/merge-marketing-i18n.ts`. */
const ALLOWED = new Set<string>([
  "en", "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id",
]);

/** From `…/i18n/[filename]/route.ts` → package `public/i18n` (no `process.cwd()`). */
const I18N_DIR = path.join(
  /*turbopackIgnore: true*/ path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "public",
  "i18n",
);

function resolvePath(lang: string): string | null {
  if (!ALLOWED.has(lang)) return null;
  const fp = path.join(I18N_DIR, `${lang}.json`);
  return existsSync(fp) ? fp : null;
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

  const fp = resolvePath(lang);
  if (!fp) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const body = readFileSync(fp, "utf8");
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
