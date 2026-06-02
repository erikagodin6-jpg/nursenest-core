/**
 * SEO Operations Observability
 *
 * Tracks and validates the health of NurseNest's SEO asset portfolio:
 *   - Blog posts (count, published, indexed)
 *   - Authority clusters (long-tail content)
 *   - Marketing hubs (pathway pages)
 *   - Sitemap integrity
 *   - Metadata completeness
 *   - Canonical issues
 *   - Broken/orphaned pages
 *
 * This module provides:
 *   1. SeoHealthSnapshot — current state of SEO assets
 *   2. SeoRegressionAlert — changes that need immediate attention
 *   3. Integration with the ops-center dashboard
 *
 * Data sources:
 *   - Database query counts (BlogPost, PathwayLesson, ExamQuestion)
 *   - File system checks (sitemap.xml, robots.txt)
 *   - Route registry (marketing routes present)
 *
 * Run periodically (cron) or on deploy to detect SEO regressions.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SeoHealthStatus = "healthy" | "watch" | "degraded" | "critical";

export type SeoMetric = {
  label: string;
  value: number | string;
  status: "ok" | "warn" | "critical";
  detail?: string;
};

export type SeoHealthSnapshot = {
  generatedAt: string;
  overallStatus: SeoHealthStatus;
  overallScore: number;
  metrics: {
    blogPosts: SeoMetric;
    publishedBlogs: SeoMetric;
    authorityClusterPages: SeoMetric;
    marketingHubPages: SeoMetric;
    sitemapPresent: SeoMetric;
    robotsTxtPresent: SeoMetric;
  };
  alerts: SeoRegressionAlert[];
};

export type SeoRegressionAlert = {
  type:
    | "blog_count_drop"
    | "sitemap_missing"
    | "robots_missing"
    | "hub_missing"
    | "orphan_detected"
    | "metadata_gap"
    | "cluster_count_drop";
  severity: "warn" | "critical";
  message: string;
  detail?: string;
};

// ─── Baseline expectations ────────────────────────────────────────────────────

export const SEO_BASELINE = {
  /** Minimum published blog posts. Alert if count drops below this. */
  minPublishedBlogs: 50,
  /** Minimum authority cluster pages. */
  minAuthorityPages: 20,
  /** Key marketing hub routes that must be present. */
  requiredMarketingHubs: [
    "/us/rn/nclex-rn",
    "/canada/pn/rex-pn",
    "/canada/np/cnple",
    "/allied/allied-health",
    "/canada/new-grad",
  ],
} as const;

// ─── Metric builders ──────────────────────────────────────────────────────────

function blogMetric(count: number): SeoMetric {
  const min = SEO_BASELINE.minPublishedBlogs;
  return {
    label: "Published blog posts",
    value: count,
    status: count < min * 0.8 ? "critical" : count < min ? "warn" : "ok",
    detail: `Minimum expected: ${min}`,
  };
}

function hubMetric(count: number): SeoMetric {
  return {
    label: "Marketing hub pages",
    value: count,
    status: count < SEO_BASELINE.requiredMarketingHubs.length ? "warn" : "ok",
    detail: `${SEO_BASELINE.requiredMarketingHubs.length} required hubs`,
  };
}

function fileMetric(label: string, present: boolean): SeoMetric {
  return {
    label,
    value: present ? "present" : "missing",
    status: present ? "ok" : "critical",
  };
}

// ─── Snapshot builders ────────────────────────────────────────────────────────

export type SeoSnapshotInput = {
  publishedBlogCount: number;
  totalBlogCount: number;
  authorityClusterCount: number;
  marketingHubCount: number;
  sitemapPresent: boolean;
  robotsTxtPresent: boolean;
  /** Optional: list of hub routes actually found (for orphan detection). */
  foundHubRoutes?: string[];
};

export function buildSeoHealthSnapshot(input: SeoSnapshotInput): SeoHealthSnapshot {
  const alerts: SeoRegressionAlert[] = [];

  // Blog count check
  if (input.publishedBlogCount < SEO_BASELINE.minPublishedBlogs * 0.8) {
    alerts.push({
      type: "blog_count_drop",
      severity: "critical",
      message: `Published blog count dropped significantly: ${input.publishedBlogCount} (min ${SEO_BASELINE.minPublishedBlogs})`,
    });
  } else if (input.publishedBlogCount < SEO_BASELINE.minPublishedBlogs) {
    alerts.push({
      type: "blog_count_drop",
      severity: "warn",
      message: `Published blog count below target: ${input.publishedBlogCount} (target ${SEO_BASELINE.minPublishedBlogs})`,
    });
  }

  // Sitemap / robots
  if (!input.sitemapPresent) {
    alerts.push({ type: "sitemap_missing", severity: "critical", message: "sitemap.xml not found" });
  }
  if (!input.robotsTxtPresent) {
    alerts.push({ type: "robots_missing", severity: "warn", message: "robots.txt not found" });
  }

  // Hub routes
  if (input.foundHubRoutes) {
    for (const required of SEO_BASELINE.requiredMarketingHubs) {
      if (!input.foundHubRoutes.includes(required)) {
        alerts.push({
          type: "hub_missing",
          severity: "critical",
          message: `Required marketing hub not found: ${required}`,
        });
      }
    }
  }

  // Authority clusters
  if (input.authorityClusterCount < SEO_BASELINE.minAuthorityPages * 0.8) {
    alerts.push({
      type: "cluster_count_drop",
      severity: "warn",
      message: `Authority cluster count low: ${input.authorityClusterCount} (min ${SEO_BASELINE.minAuthorityPages})`,
    });
  }

  // Compute overall score
  const criticals = alerts.filter((a) => a.severity === "critical").length;
  const warns = alerts.filter((a) => a.severity === "warn").length;
  let score = 100 - criticals * 25 - warns * 10;
  score = Math.max(0, Math.min(100, score));

  const overallStatus: SeoHealthStatus =
    criticals > 0 ? "critical" :
    warns > 1 ? "degraded" :
    warns === 1 ? "watch" : "healthy";

  return {
    generatedAt: new Date().toISOString(),
    overallStatus,
    overallScore: score,
    metrics: {
      blogPosts: { label: "Total blog posts", value: input.totalBlogCount, status: "ok" },
      publishedBlogs: blogMetric(input.publishedBlogCount),
      authorityClusterPages: {
        label: "Authority cluster pages",
        value: input.authorityClusterCount,
        status: input.authorityClusterCount < SEO_BASELINE.minAuthorityPages ? "warn" : "ok",
      },
      marketingHubPages: hubMetric(input.marketingHubCount),
      sitemapPresent: fileMetric("sitemap.xml", input.sitemapPresent),
      robotsTxtPresent: fileMetric("robots.txt", input.robotsTxtPresent),
    },
    alerts,
  };
}

/**
 * Emit a structured log of the SEO health snapshot.
 * Call after building a snapshot during cron runs or deploys.
 */
export function emitSeoHealthSnapshot(snapshot: SeoHealthSnapshot): void {
  safeServerLog("seo", "health_snapshot", {
    overallStatus: snapshot.overallStatus,
    overallScore: snapshot.overallScore,
    alertCount: snapshot.alerts.length,
    criticalAlerts: snapshot.alerts.filter((a) => a.severity === "critical").length,
    publishedBlogs: typeof snapshot.metrics.publishedBlogs.value === "number"
      ? snapshot.metrics.publishedBlogs.value : null,
  });

  for (const alert of snapshot.alerts) {
    safeServerLog("seo", `regression_alert_${alert.type}`, {
      severity: alert.severity,
      message: alert.message.slice(0, 200),
    });
  }
}
