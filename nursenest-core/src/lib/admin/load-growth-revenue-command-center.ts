import "server-only";

import {
  loadExecutiveBusinessCommandCenter,
  type ExecutiveBusinessMetric,
} from "@/lib/admin/load-executive-business-command-center";
import { loadRevenueAlertsCenterDashboard } from "@/lib/revenue-alerts/revenue-alerts-center.server";
import { buildSeoCommandCenter } from "@/lib/seo/search-console-optimization-engine";

export type GrowthRevenueStatus = "green" | "yellow" | "red";

export type GrowthRevenueMetric = {
  label: string;
  value: string;
  status: GrowthRevenueStatus;
  detail: string;
};

export type GrowthRevenueCommandCenterData = {
  generatedAt: string;
  degraded: boolean;
  notes: string[];
  sixtySecondRead: {
    revenueToday: GrowthRevenueMetric;
    subscriptionsWorking: GrowthRevenueMetric;
    notificationsWorking: GrowthRevenueMetric;
    contentGrowing: GrowthRevenueMetric;
    nextContentBet: GrowthRevenueMetric;
  };
  traffic: {
    organic: GrowthRevenueMetric;
    direct: GrowthRevenueMetric;
    referral: GrowthRevenueMetric;
    social: GrowthRevenueMetric;
    email: GrowthRevenueMetric;
    trend: GrowthRevenueMetric;
    dimensions: GrowthRevenueMetric[];
  };
  searchConsole: {
    impressions: GrowthRevenueMetric;
    clicks: GrowthRevenueMetric;
    ctr: GrowthRevenueMetric;
    averagePosition: GrowthRevenueMetric;
    opportunityPages: number;
    pagesLosingTraffic: number;
    keywordOpportunities: number;
  };
  content: {
    mostVisited: GrowthRevenueMetric[];
    mostConverted: GrowthRevenueMetric[];
    failing: GrowthRevenueMetric[];
  };
  revenue: {
    today: GrowthRevenueMetric;
    yesterday: GrowthRevenueMetric;
    thisWeek: GrowthRevenueMetric;
    thisMonth: GrowthRevenueMetric;
    thisYear: GrowthRevenueMetric;
    mrr: GrowthRevenueMetric;
    arr: GrowthRevenueMetric;
    trials: GrowthRevenueMetric;
    conversions: GrowthRevenueMetric;
    renewals: GrowthRevenueMetric;
    cancellations: GrowthRevenueMetric;
    failedPayments: GrowthRevenueMetric;
    refunds: GrowthRevenueMetric;
    chargebacks: GrowthRevenueMetric;
  };
  funnel: {
    homepageToSignup: GrowthRevenueMetric;
    signupToTrial: GrowthRevenueMetric;
    trialToPaid: GrowthRevenueMetric;
    pageToPaid: GrowthRevenueMetric;
    keywordToPaid: GrowthRevenueMetric;
  };
  seoRoi: Array<{
    cluster: string;
    traffic: string;
    conversionRate: string;
    revenue: string;
    roi: string;
    status: GrowthRevenueStatus;
  }>;
  alertCenter: GrowthRevenueMetric[];
};

function metric(label: string, value: string, status: GrowthRevenueStatus, detail: string): GrowthRevenueMetric {
  return { label, value, status, detail };
}

function fromBusinessMetric(item: ExecutiveBusinessMetric): GrowthRevenueMetric {
  return metric(item.label, item.value, item.status, item.note ?? "");
}

function statusFromHealth(ok: boolean): GrowthRevenueStatus {
  return ok ? "green" : "red";
}

function statusFromMissing(value: string): GrowthRevenueStatus {
  return /no data|stripe|pending|not configured/i.test(value) ? "yellow" : "green";
}

export async function loadGrowthRevenueCommandCenter(): Promise<GrowthRevenueCommandCenterData> {
  const [business, alerts] = await Promise.all([
    loadExecutiveBusinessCommandCenter(),
    loadRevenueAlertsCenterDashboard(),
  ]);
  const seo = buildSeoCommandCenter({ currentRows: [] });
  const notificationsOk =
    alerts.health.emailConfigured &&
    alerts.health.stripeWebhookConfigured &&
    alerts.health.notificationQueueHealthy &&
    alerts.health.recentFailedDeliveries === 0;

  const gscPending = "Connect Search Console exports or API credentials to populate this live metric.";
  const posthogPending = "Connect PostHog traffic/source data for live channel attribution.";
  const stripePending = "Stripe remains billing source of truth for exact net revenue.";

  return {
    generatedAt: new Date().toISOString(),
    degraded: business.degraded || seo.totalImpressions === 0,
    notes: [
      ...business.notes,
      "This dashboard consolidates owner decisions across traffic, Search Console, content, revenue, funnel, SEO ROI, and alert health.",
      "Search Console rows are ready through the Phase 4 optimization engine; current loader uses local/API-fed rows when wired.",
      "Traffic source attribution requires PostHog or equivalent event analytics.",
    ],
    sixtySecondRead: {
      revenueToday: metric("Revenue Today", business.revenue.revenueYesterday.value, business.revenue.revenueYesterday.status, "Current operational fallback uses recent subscription mirror data until Stripe net revenue is mirrored."),
      subscriptionsWorking: metric("Subscriptions Working", business.revenue.failedPayments.value, business.revenue.failedPayments.status, business.revenue.failedPayments.note ?? "Failed payments and active subscription mirrors."),
      notificationsWorking: metric("Notifications Working", notificationsOk ? "Healthy" : "Needs Review", statusFromHealth(notificationsOk), `${alerts.health.recentFailedDeliveries} failed recent deliveries; email ${alerts.health.emailConfigured ? "configured" : "missing"}, SMS ${alerts.health.smsConfigured ? "configured" : "missing"}.`),
      contentGrowing: metric("Content Growing", seo.totalImpressions > 0 ? `${seo.totalImpressions.toLocaleString()} impressions` : "No GSC Data", seo.totalImpressions > 0 ? "green" : "yellow", gscPending),
      nextContentBet: metric("Next Content Bet", seo.quickWins[0]?.page ?? "Await GSC Export", seo.quickWins.length ? "green" : "yellow", seo.quickWins[0]?.actions[0] ?? "Import GSC rows to identify highest-impression, lowest-difficulty content opportunities."),
    },
    traffic: {
      organic: metric("Organic Traffic", seo.totalOrganicTraffic.toLocaleString(), seo.totalOrganicTraffic > 0 ? "green" : "yellow", "Search Console click total from imported rows."),
      direct: metric("Direct Traffic", "Pending", "yellow", posthogPending),
      referral: metric("Referral Traffic", business.topReferralSources[0]?.value ?? "Pending", business.topReferralSources.length ? "green" : "yellow", "Top referral sources from attribution tables where available."),
      social: metric("Social Traffic", "Pending", "yellow", posthogPending),
      email: metric("Email Traffic", "Pending", "yellow", posthogPending),
      trend: metric("Trend Analysis", seo.decayFindings.length ? `${seo.decayFindings.length} decay risks` : "No Decay Data", seo.decayFindings.length ? "red" : "yellow", "Compares current and previous Search Console periods when both are imported."),
      dimensions: [
        metric("Country", "Pending", "yellow", "Requires GSC country dimension or analytics geo events."),
        metric("Province/State", "Pending", "yellow", "Requires analytics geo enrichment."),
        metric("Device", "Pending", "yellow", "Requires GSC device dimension or analytics device events."),
        metric("Browser", "Pending", "yellow", "Requires product analytics browser properties."),
      ],
    },
    searchConsole: {
      impressions: metric("Impressions", seo.totalImpressions.toLocaleString(), seo.totalImpressions > 0 ? "green" : "yellow", gscPending),
      clicks: metric("Clicks", seo.totalOrganicTraffic.toLocaleString(), seo.totalOrganicTraffic > 0 ? "green" : "yellow", gscPending),
      ctr: metric("CTR", `${(seo.averageCtr * 100).toFixed(1)}%`, seo.averageCtr > 0 ? "green" : "yellow", "Weighted Search Console CTR."),
      averagePosition: metric("Average Position", String(seo.averagePosition), seo.averagePosition > 0 ? "green" : "yellow", "Weighted by impressions."),
      opportunityPages: seo.opportunityPages.length,
      pagesLosingTraffic: seo.decayFindings.length,
      keywordOpportunities: seo.authorityExpansion.length,
    },
    content: {
      mostVisited: seo.clusters.slice(0, 5).map((cluster) => metric(cluster.cluster, `${cluster.clicks} clicks`, "green", `${cluster.impressions} impressions · ${(cluster.ctr * 100).toFixed(1)}% CTR`)),
      mostConverted: business.topProducts.map((product) => metric(product.label, product.value, product.status, product.note ?? "Subscription mirror product grouping.")),
      failing: [
        ...seo.decayFindings.slice(0, 5).map((item) => metric(item.page, `${item.clickChangePercent}% clicks`, "red", item.refreshReasons.join("; "))),
        ...(seo.totalImpressions === 0 ? [metric("Pages With No Impressions", "Needs GSC Import", "yellow", gscPending)] : []),
      ],
    },
    revenue: {
      today: metric("Today", business.revenue.revenueYesterday.value, business.revenue.revenueYesterday.status, "Uses current operational subscription mirror until Stripe net revenue is mirrored."),
      yesterday: fromBusinessMetric(business.revenue.revenueYesterday),
      thisWeek: metric("This Week", String(alerts.summary.thisWeek), "yellow", "Revenue alert event count this week; exact net revenue remains Stripe-side."),
      thisMonth: metric("This Month", String(alerts.summary.thisMonth), "yellow", "Revenue alert event count this month; exact net revenue remains Stripe-side."),
      thisYear: metric("This Year", "Stripe", "yellow", stripePending),
      mrr: fromBusinessMetric(business.revenue.mrr),
      arr: fromBusinessMetric(business.revenue.arr),
      trials: metric("Trials", "See Funnel Analytics", "yellow", "Trial starts require trial event aggregation or DB trial status windowing."),
      conversions: metric("Conversions", business.subscriptions.newSubscribers.value, business.subscriptions.newSubscribers.status, business.subscriptions.newSubscribers.note ?? "New subscription mirror rows."),
      renewals: metric("Renewals", "Stripe", "yellow", "Renewal event counts are available once Stripe webhook events are mirrored into revenue alerts."),
      cancellations: fromBusinessMetric(business.subscriptions.cancelledSubscribers),
      failedPayments: fromBusinessMetric(business.revenue.failedPayments),
      refunds: fromBusinessMetric(business.revenue.refunds),
      chargebacks: fromBusinessMetric(business.revenue.chargebacks),
    },
    funnel: {
      homepageToSignup: metric("Homepage → Signup", "PostHog", "yellow", "Use `/admin/analytics/funnels` for configured event funnels."),
      signupToTrial: metric("Signup → Trial", "Pending", "yellow", "Requires trial activation event or trial status window query."),
      trialToPaid: metric("Trial → Paid", business.subscriptions.newSubscribers.value, business.subscriptions.newSubscribers.status, "Subscription conversion proxy from DB mirror."),
      pageToPaid: metric("Page → Paid", "Pending", "yellow", "Requires landing-page attribution in conversion events."),
      keywordToPaid: metric("Keyword → Paid", "Pending", "yellow", "Requires GSC query to anonymous visitor to signup attribution bridge."),
    },
    seoRoi: [
      "Heart Failure",
      "COPD",
      "Diabetes",
      "RT",
      "Paramedic",
      "OT",
      "PT",
      "MLT",
    ].map((cluster) => {
      const row = seo.clusters.find((item) => item.cluster.toLowerCase() === cluster.toLowerCase());
      return {
        cluster,
        traffic: row ? row.clicks.toLocaleString() : "Pending",
        conversionRate: row && row.clicks > 0 ? `${((row.conversions / row.clicks) * 100).toFixed(1)}%` : "Pending",
        revenue: row ? `$${(row.revenueCents / 100).toFixed(2)}` : "Pending",
        roi: row ? String(row.authorityScore) : "Needs GSC + conversion data",
        status: row ? "green" : "yellow",
      };
    }),
    alertCenter: [
      metric("Traffic Drop >20%", seo.decayFindings.length ? `${seo.decayFindings.length} pages` : "No Data", seo.decayFindings.length ? "red" : "yellow", "Requires previous-period GSC rows."),
      metric("Conversions Drop >20%", "Pending", "yellow", "Requires conversion event baseline."),
      metric("Stripe Webhook", alerts.health.stripeWebhookConfigured ? "Configured" : "Missing", statusFromHealth(alerts.health.stripeWebhookConfigured), alerts.health.missingCritical.join(", ") || "Webhook secret configured."),
      metric("Email Delivery", alerts.health.emailConfigured ? "Configured" : "Missing", statusFromHealth(alerts.health.emailConfigured), "Owner revenue email notification channel."),
      metric("SMS Delivery", alerts.health.smsConfigured ? "Configured" : "Missing", alerts.health.smsConfigured ? "green" : "yellow", "Secondary owner notification channel."),
      metric("Search Console Errors", seo.decayFindings.length ? "Review" : "Pending", statusFromMissing(seo.totalImpressions ? "ok" : "pending"), "Import GSC issue exports for indexing and ranking-loss alerting."),
      metric("Large Ranking Losses", seo.decayFindings.length ? `${seo.decayFindings.length}` : "No Data", seo.decayFindings.length ? "red" : "yellow", "Detected when current and previous GSC position data are imported."),
    ],
  };
}
