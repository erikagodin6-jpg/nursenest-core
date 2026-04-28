import { NextResponse } from "next/server";
import { isReliabilityRequestAuthorized } from "@/lib/reliability/internal-reliability-guard";
import { runReliabilityCheckBundle } from "@/lib/reliability/run-reliability-check-bundle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolveProbeBaseUrl(request: Request): string | null {
  const fromEnv = process.env.NURSENEST_PRODUCTION_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  try {
    return new URL(request.url).origin;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  if (!isReliabilityRequestAuthorized(request)) {
    return new NextResponse(null, { status: 404 });
  }

  const baseUrl = resolveProbeBaseUrl(request);
  if (!baseUrl) {
    return NextResponse.json(
      {
        ok: false,
        checkedAt: new Date().toISOString(),
        baseUrl: "",
        failures: ["missing_probe_base_url: set NURSENEST_PRODUCTION_BASE_URL or use a valid request URL"],
        warnings: [],
        probes: [],
      },
      { status: 500 },
    );
  }

  const bundle = await runReliabilityCheckBundle(baseUrl);

  return NextResponse.json({
    ok: bundle.ok,
    checkedAt: bundle.checkedAt,
    baseUrl: bundle.baseUrl,
    failures: bundle.failures,
    warnings: bundle.warnings,
    probes: bundle.probes,
  });
}
