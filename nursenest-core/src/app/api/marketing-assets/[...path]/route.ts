import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getMissingSpacesProxyEnvKeys } from "@/lib/marketing/spaces-proxy-env";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";

/** Avoid sticky caches for JSON error bodies (404/502/503). Successful images use long-lived immutable caching. */
const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Log missing Spaces credentials once per process (avoid log spam on every asset request). */
let loggedMissingSpacesProxy = false;

/** Allowed object key prefixes in the marketing bucket (screens + brand marks). */
const ALLOW_PREFIXES = ["screenshots/", "brand/", "branding/"] as const;

/** Root-level public marketing files (e.g. `blackbrandlogo.gif`). */
function isAllowedRootMarketingKey(key: string): boolean {
  if (key.includes("/") || key.includes("..")) return false;
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(gif|png|webp|jpe?g|svg)$/i.test(key);
}

function isAllowedKey(key: string): boolean {
  if (key.includes("..")) return false;
  if (ALLOW_PREFIXES.some((p) => key.startsWith(p))) return true;
  return isAllowedRootMarketingKey(key);
}

function getS3Client(): S3Client | null {
  const accessKeyId = process.env.SPACES_KEY?.trim();
  const secretAccessKey = process.env.SPACES_SECRET?.trim();
  if (!accessKeyId || !secretAccessKey) return null;

  const region = process.env.SPACES_REGION?.trim() || "tor1";
  const endpoint =
    process.env.SPACES_ENDPOINT?.trim() || `https://${region}.digitaloceanspaces.com`;

  return new S3Client({
    endpoint,
    region: "us-east-1",
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false,
  });
}

function contentTypeForKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

/**
 * For known image extensions (e.g. `.webp`), always use the key — Spaces metadata can be wrong.
 * For unknown extensions, prefer S3 `image/*` when present, else `application/octet-stream`.
 */
function resolvedImageContentType(s3ContentType: string | undefined, key: string): string {
  const byKey = contentTypeForKey(key);
  if (byKey !== "application/octet-stream") return byKey;
  const raw = s3ContentType?.trim() ?? "";
  if (raw.toLowerCase().startsWith("image/")) return raw;
  return byKey;
}

/**
 * Streams marketing images from DigitalOcean Spaces (private bucket safe).
 * Allowed keys: `screenshots/…`, `brand/…`, `branding/…`, or a single-segment root filename (e.g. `blackbrandlogo.gif`).
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  setSentryServerContext({ route: "/api/marketing-assets/[...path]", feature: "image" });
  const { path: segments } = await ctx.params;
  const key = segments.map((s) => decodeURIComponent(s)).join("/");

  if (!isAllowedKey(key)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE });
  }

  const bucket = process.env.SPACES_BUCKET?.trim() || "nursenest-images";
  const client = getS3Client();

  if (!client) {
    if (!loggedMissingSpacesProxy) {
      loggedMissingSpacesProxy = true;
      safeServerLog("marketing_assets", "spaces_proxy_unconfigured", {
        proxyPrimary: process.env.NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY === "true",
        missingKeys: getMissingSpacesProxyEnvKeys().join(","),
      });
    }
    return NextResponse.json(
      {
        error: "Marketing asset proxy not configured",
        hint: "Set SPACES_KEY and SPACES_SECRET for the proxy, or use public Spaces URLs (default) without NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY=true.",
      },
      { status: 503, headers: NO_STORE },
    );
  }

  try {
    const out = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    const body = out.Body;
    if (!body) {
      return NextResponse.json({ error: "Empty object" }, { status: 502, headers: NO_STORE });
    }

    const ct = resolvedImageContentType(out.ContentType, key);
    const buf = await body.transformToByteArray();

    return new NextResponse(Buffer.from(buf), {
      status: 200,
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e: unknown) {
    const name = (e as { name?: string })?.name;
    const status = (e as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode;
    if (name === "NoSuchKey" || name === "NotFound" || status === 404) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: NO_STORE });
    }
    console.error("[marketing-assets]", key, e);
    return NextResponse.json({ error: "Upstream error" }, { status: 502, headers: NO_STORE });
  }
}
