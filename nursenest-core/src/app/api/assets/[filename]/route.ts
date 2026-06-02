import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const ALLOWED_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpg",
  ".jpeg",
  ".m4a",
  ".mp3",
  ".mp4",
  ".ogg",
  ".png",
  ".svg",
  ".wav",
  ".webm",
  ".webp",
]);

const MIME_BY_EXT: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

function safeFilename(raw: string) {
  const decoded = decodeURIComponent(raw);
  const base = path.basename(decoded);
  if (!base || base !== decoded || base.includes("..")) return null;
  const ext = path.extname(base).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) return null;
  return base;
}

function localCandidates(filename: string) {
  return [
    path.join(process.cwd(), "public", "assets", filename),
    path.join(process.cwd(), "public", "audio", filename),
    path.join(process.cwd(), "client", "src", "assets", filename),
    path.join(process.cwd(), "..", "client", "src", "assets", filename),
  ];
}

function legacyAssetBase(request: Request) {
  const raw = (
    process.env.NURSENEST_LEGACY_ASSETS_BASE ??
    process.env.NEXT_PUBLIC_NURSENEST_LEGACY_ASSETS_BASE ??
    ""
  ).trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(raw)) return null;

  const requestOrigin = new URL(request.url).origin.replace(/\/$/, "");
  if (raw === `${requestOrigin}/api/assets` || raw === requestOrigin) return null;
  return raw;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ filename: string }> },
): Promise<Response> {
  const { filename: rawFilename } = await context.params;
  const filename = safeFilename(rawFilename);
  if (!filename) return new NextResponse("Not found", { status: 404 });

  for (const candidate of localCandidates(filename)) {
    if (!existsSync(candidate)) continue;
    const body = await readFile(candidate);
    const ext = path.extname(filename).toLowerCase();
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  }

  const base = legacyAssetBase(request);
  if (base) {
    return NextResponse.redirect(`${base}/${encodeURIComponent(filename)}`, 307);
  }

  return new NextResponse("Not found", { status: 404 });
}
