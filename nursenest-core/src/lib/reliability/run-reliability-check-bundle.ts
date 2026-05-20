import type { LessonRouteProbeResult } from "@/lib/reliability/lesson-route-probes";
import { runLessonRouteProbes } from "@/lib/reliability/lesson-route-probes";
import type { PricingProbeResult, PublicRouteProbeResult, SitemapProbeResult } from "@/lib/reliability/public-route-probes";
import { runPricingProbe, runPublicRouteProbes, runSitemapProbe } from "@/lib/reliability/public-route-probes";

export type ReliabilityProbeRow =
  | PublicRouteProbeResult
  | SitemapProbeResult
  | PricingProbeResult
  | LessonRouteProbeResult;

export type ReliabilityCheckBundle = {
  ok: boolean;
  checkedAt: string;
  baseUrl: string;
  failures: string[];
  warnings: string[];
  probes: ReliabilityProbeRow[];
  public: Awaited<ReturnType<typeof runPublicRouteProbes>>;
  sitemap: Awaited<ReturnType<typeof runSitemapProbe>>;
  pricing: Awaited<ReturnType<typeof runPricingProbe>>;
  lessons: Awaited<ReturnType<typeof runLessonRouteProbes>>;
};

export async function runReliabilityCheckBundle(baseUrl: string): Promise<ReliabilityCheckBundle> {
  const checkedAt = new Date().toISOString();
  const [publicReport, sitemap, pricing, lessons] = await Promise.all([
    runPublicRouteProbes(baseUrl),
    runSitemapProbe(baseUrl),
    runPricingProbe(baseUrl),
    runLessonRouteProbes(baseUrl),
  ]);

  const failures: string[] = [
    ...publicReport.failures,
    ...(sitemap.ok ? [] : sitemap.issues.map((i) => `sitemap:${i}`)),
    ...(pricing.ok ? [] : pricing.issues.map((i) => `pricing:${i}`)),
    ...lessons.failures,
  ];

  const warnings: string[] = [
    ...publicReport.warnings,
    ...lessons.warnings,
    ...(sitemap.durationMs > 12_000 ? [`sitemap: slow_probe_ms:${sitemap.durationMs}`] : []),
    ...(pricing.durationMs > 12_000 ? [`pricing: slow_probe_ms:${pricing.durationMs}`] : []),
  ];

  const probes: ReliabilityProbeRow[] = [...publicReport.probes, sitemap, pricing, ...lessons.targets];

  const ok = publicReport.ok && sitemap.ok && pricing.ok && lessons.ok;

  return {
    ok,
    checkedAt,
    baseUrl,
    failures: [...new Set(failures)],
    warnings: [...new Set(warnings)],
    probes,
    public: publicReport,
    sitemap,
    pricing,
    lessons,
  };
}
