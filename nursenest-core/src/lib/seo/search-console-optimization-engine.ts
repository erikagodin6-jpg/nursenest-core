export type SearchConsoleDimension = "page" | "query" | "date" | "device" | "country" | "searchAppearance";

export type SearchConsolePerformanceRow = {
  page: string;
  query?: string;
  date?: string;
  device?: string;
  country?: string;
  searchAppearance?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchConsoleApiRequest = {
  siteUrl: string;
  accessToken: string;
  startDate: string;
  endDate: string;
  dimensions?: SearchConsoleDimension[];
  rowLimit?: number;
  startRow?: number;
};

export type SearchConsoleApiRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

export type SearchConsoleApiResponse = {
  rows?: SearchConsoleApiRow[];
};

export type SeoPageProfile = {
  url: string;
  title?: string;
  metaDescription?: string;
  cluster?: string;
  targetedKeywords?: string[];
  internalLinks?: string[];
  relatedUrls?: string[];
  author?: string;
  reviewer?: string;
  updatedAt?: string;
  clinicalReviewStatus?: "clinically_reviewed" | "under_review" | "needs_review" | "unknown";
  referencesCount?: number;
  schemaTypes?: string[];
  contentType?: "disease" | "medication" | "care-plan" | "lab" | "skill" | "career" | "certification" | "article" | "unknown";
  conversionMetrics?: {
    lessonClicks?: number;
    flashcardClicks?: number;
    questionBankClicks?: number;
    simulationClicks?: number;
    trialStarts?: number;
    subscriptions?: number;
    revenueCents?: number;
  };
};

export type PageOpportunity = {
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  expectedCtr: number;
  ctrGap: number;
  priority: "tier_1" | "tier_2" | "tier_3";
  reasons: string[];
  recommendations: string[];
};

export type ContentDecayFinding = {
  page: string;
  currentClicks: number;
  previousClicks: number;
  clickChangePercent: number;
  currentImpressions: number;
  previousImpressions: number;
  impressionChangePercent: number;
  currentPosition: number;
  previousPosition: number;
  needsRefresh: boolean;
  refreshReasons: string[];
};

export type AuthorityExpansionOpportunity = {
  page: string;
  query: string;
  impressions: number;
  position: number;
  opportunityType: "supporting_page" | "cluster_branch" | "faq_section" | "internal_link";
  recommendation: string;
};

export type InternalLinkRecommendation = {
  sourceUrl: string;
  targetUrl: string;
  reason: string;
  priority: "high" | "medium" | "low";
};

export type SnippetOpportunity = {
  page: string;
  query: string;
  position: number;
  impressions: number;
  snippetBlock: "definition" | "quick_answer" | "comparison_table" | "step_by_step" | "faq";
  recommendation: string;
};

export type EeatRefreshFinding = {
  page: string;
  issues: string[];
  score: number;
  needsClinicalReview: boolean;
};

export type RefreshQueueItem = {
  page: string;
  tier: "tier_1" | "tier_2" | "tier_3";
  reasons: string[];
  actions: string[];
  revenuePotential: "high" | "medium" | "low";
};

export type ClusterPerformance = {
  cluster: string;
  pages: number;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  conversions: number;
  revenueCents: number;
  authorityScore: number;
};

export type SeoCommandCenter = {
  totalOrganicTraffic: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  opportunityPages: PageOpportunity[];
  decayFindings: ContentDecayFinding[];
  authorityExpansion: AuthorityExpansionOpportunity[];
  internalLinks: InternalLinkRecommendation[];
  snippets: SnippetOpportunity[];
  eeatRefresh: EeatRefreshFinding[];
  refreshQueue: RefreshQueueItem[];
  clusters: ClusterPerformance[];
  quickWins: RefreshQueueItem[];
};

export function expectedCtrForPosition(position: number): number {
  if (position <= 1) return 0.28;
  if (position <= 2) return 0.16;
  if (position <= 3) return 0.11;
  if (position <= 5) return 0.075;
  if (position <= 10) return 0.04;
  if (position <= 15) return 0.022;
  if (position <= 20) return 0.012;
  return 0.006;
}

export function normalizeSearchConsoleRows(
  rows: readonly SearchConsoleApiRow[],
  dimensions: readonly SearchConsoleDimension[] = ["page", "query"],
): SearchConsolePerformanceRow[] {
  return rows.map((row) => {
    const keys = row.keys ?? [];
    const mapped = Object.fromEntries(dimensions.map((dimension, index) => [dimension, keys[index] ?? ""]));
    return {
      page: String(mapped.page ?? ""),
      query: String(mapped.query ?? ""),
      date: String(mapped.date ?? "") || undefined,
      device: String(mapped.device ?? "") || undefined,
      country: String(mapped.country ?? "") || undefined,
      searchAppearance: String(mapped.searchAppearance ?? "") || undefined,
      clicks: Number(row.clicks ?? 0),
      impressions: Number(row.impressions ?? 0),
      ctr: Number(row.ctr ?? 0),
      position: Number(row.position ?? 0),
    };
  });
}

export async function fetchSearchConsoleRows(request: SearchConsoleApiRequest): Promise<SearchConsolePerformanceRow[]> {
  const dimensions = request.dimensions ?? ["page", "query"];
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(request.siteUrl)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${request.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: request.startDate,
      endDate: request.endDate,
      dimensions,
      rowLimit: request.rowLimit ?? 25000,
      startRow: request.startRow ?? 0,
    }),
  });

  if (!response.ok) {
    throw new Error(`Search Console request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as SearchConsoleApiResponse;
  return normalizeSearchConsoleRows(data.rows ?? [], dimensions);
}

function aggregateByPage(rows: readonly SearchConsolePerformanceRow[]): SearchConsolePerformanceRow[] {
  const groups = new Map<string, SearchConsolePerformanceRow[]>();
  for (const row of rows) {
    if (!row.page) continue;
    groups.set(row.page, [...(groups.get(row.page) ?? []), row]);
  }

  return [...groups.entries()].map(([page, group]) => {
    const impressions = sum(group.map((row) => row.impressions));
    const clicks = sum(group.map((row) => row.clicks));
    return {
      page,
      clicks,
      impressions,
      ctr: impressions > 0 ? clicks / impressions : 0,
      position: weightedAverage(group.map((row) => ({ value: row.position, weight: row.impressions }))),
    };
  });
}

export function detectPageOpportunities(rows: readonly SearchConsolePerformanceRow[]): PageOpportunity[] {
  return aggregateByPage(rows)
    .filter((row) => row.impressions >= 500 && row.position >= 3 && row.position <= 15)
    .map((row) => {
      const expectedCtr = expectedCtrForPosition(row.position);
      const ctrGap = Math.max(0, expectedCtr - row.ctr);
      const reasons: string[] = [];
      const recommendations: string[] = [];
      if (ctrGap > 0.015) {
        reasons.push("CTR is below expected benchmark for current average position.");
        recommendations.push("Rewrite SEO title and meta description around clearer learner value and certification relevance.");
      }
      if (row.position <= 8) {
        reasons.push("Already close to page-one visibility.");
        recommendations.push("Add FAQ schema, quick-answer block, and stronger above-the-fold answer match.");
      }
      if (row.impressions >= 2000) {
        reasons.push("High-impression page can compound gains quickly.");
        recommendations.push("Prioritize SERP snippet refresh before creating net-new content.");
      }
      return {
        page: row.page,
        impressions: row.impressions,
        clicks: row.clicks,
        ctr: round(row.ctr),
        position: round(row.position),
        expectedCtr: round(expectedCtr),
        ctrGap: round(ctrGap),
        priority: row.impressions >= 2000 && ctrGap > 0.015 ? "tier_1" : row.impressions >= 1000 ? "tier_2" : "tier_3",
        reasons,
        recommendations,
      };
    })
    .filter((item) => item.ctrGap > 0)
    .sort((a, b) => b.impressions * b.ctrGap - a.impressions * a.ctrGap);
}

export function detectContentDecay(
  currentRows: readonly SearchConsolePerformanceRow[],
  previousRows: readonly SearchConsolePerformanceRow[],
): ContentDecayFinding[] {
  const current = new Map(aggregateByPage(currentRows).map((row) => [row.page, row]));
  const previous = new Map(aggregateByPage(previousRows).map((row) => [row.page, row]));
  const pages = new Set([...current.keys(), ...previous.keys()]);

  return [...pages]
    .map((page) => {
      const c = current.get(page) ?? emptyPage(page);
      const p = previous.get(page) ?? emptyPage(page);
      const clickChangePercent = percentChange(c.clicks, p.clicks);
      const impressionChangePercent = percentChange(c.impressions, p.impressions);
      const positionWorse = c.position > 0 && p.position > 0 && c.position - p.position >= 2;
      const refreshReasons: string[] = [];
      if (clickChangePercent <= -20) refreshReasons.push("Clicks declined by at least 20%.");
      if (impressionChangePercent <= -20) refreshReasons.push("Impressions declined by at least 20%.");
      if (positionWorse) refreshReasons.push("Average position worsened by at least two ranking positions.");
      return {
        page,
        currentClicks: c.clicks,
        previousClicks: p.clicks,
        clickChangePercent: round(clickChangePercent),
        currentImpressions: c.impressions,
        previousImpressions: p.impressions,
        impressionChangePercent: round(impressionChangePercent),
        currentPosition: round(c.position),
        previousPosition: round(p.position),
        needsRefresh: refreshReasons.length > 0,
        refreshReasons,
      };
    })
    .filter((finding) => finding.needsRefresh)
    .sort((a, b) => a.clickChangePercent - b.clickChangePercent);
}

export function detectAuthorityExpansion(
  rows: readonly SearchConsolePerformanceRow[],
  profiles: readonly SeoPageProfile[],
): AuthorityExpansionOpportunity[] {
  const byUrl = new Map(profiles.map((profile) => [profile.url, profile]));
  return rows
    .filter((row) => row.page && row.query && row.impressions >= 100 && row.position <= 20)
    .filter((row) => {
      const targeted = byUrl.get(row.page)?.targetedKeywords ?? [];
      return !targeted.some((keyword) => normalized(row.query).includes(normalized(keyword)) || normalized(keyword).includes(normalized(row.query)));
    })
    .map((row) => {
      const query = row.query ?? "";
      const type = queryType(query);
      return {
        page: row.page,
        query,
        impressions: row.impressions,
        position: round(row.position),
        opportunityType: type,
        recommendation: recommendationForQuery(type, query),
      };
    })
    .sort((a, b) => b.impressions - a.impressions);
}

export function buildInternalLinkRecommendations(profiles: readonly SeoPageProfile[]): InternalLinkRecommendation[] {
  const recommendations: InternalLinkRecommendation[] = [];
  for (const source of profiles) {
    const sourceTerms = new Set([...(source.targetedKeywords ?? []), source.cluster ?? "", source.contentType ?? ""].map(normalized).filter(Boolean));
    for (const target of profiles) {
      if (source.url === target.url) continue;
      if ((source.internalLinks ?? []).includes(target.url)) continue;
      const targetTerms = [target.cluster ?? "", ...(target.targetedKeywords ?? [])].map(normalized).filter(Boolean);
      const overlap = targetTerms.filter((term) => sourceTerms.has(term)).length;
      if (overlap > 0) {
        recommendations.push({
          sourceUrl: source.url,
          targetUrl: target.url,
          reason: `Shared cluster or keyword signal: ${targetTerms.find((term) => sourceTerms.has(term))}`,
          priority: overlap >= 2 ? "high" : "medium",
        });
      }
    }
    if ((source.internalLinks ?? []).length < 3) {
      const target = profiles.find((profile) => profile.url !== source.url && profile.cluster === source.cluster);
      if (target) {
        recommendations.push({
          sourceUrl: source.url,
          targetUrl: target.url,
          reason: "Weakly connected page needs at least three meaningful internal links.",
          priority: "high",
        });
      }
    }
  }
  return recommendations.slice(0, 200);
}

export function detectSnippetOpportunities(rows: readonly SearchConsolePerformanceRow[]): SnippetOpportunity[] {
  return rows
    .filter((row) => row.query && row.impressions >= 100 && row.position >= 2 && row.position <= 12)
    .map((row) => {
      const query = row.query ?? "";
      const block = snippetBlockForQuery(query);
      return {
        page: row.page,
        query,
        position: round(row.position),
        impressions: row.impressions,
        snippetBlock: block,
        recommendation: `Add a ${block.replace(/_/g, " ")} block that answers "${query}" in 40-70 words before deeper clinical teaching.`,
      };
    })
    .sort((a, b) => b.impressions - a.impressions);
}

export function auditEeatRefresh(profiles: readonly SeoPageProfile[], now = new Date()): EeatRefreshFinding[] {
  return profiles
    .map((profile) => {
      const issues: string[] = [];
      if (!profile.author) issues.push("Author missing.");
      if (!profile.reviewer) issues.push("Reviewer missing.");
      if (!profile.updatedAt) issues.push("Last updated date missing.");
      if ((profile.referencesCount ?? 0) < 3) issues.push("Reference count below clinical authority floor.");
      if (!profile.schemaTypes?.length) issues.push("Schema coverage missing.");
      if (profile.clinicalReviewStatus !== "clinically_reviewed") issues.push("Clinical review status is not clinically reviewed.");
      if (profile.updatedAt && daysBetween(new Date(profile.updatedAt), now) > 180) issues.push("Content has not been refreshed in 180+ days.");
      const score = clamp100(100 - issues.length * 16);
      return { page: profile.url, issues, score, needsClinicalReview: issues.length > 0 };
    })
    .filter((finding) => finding.issues.length > 0)
    .sort((a, b) => a.score - b.score);
}

export function buildRefreshQueue(input: {
  opportunities: readonly PageOpportunity[];
  decay: readonly ContentDecayFinding[];
  eeat: readonly EeatRefreshFinding[];
  profiles?: readonly SeoPageProfile[];
}): RefreshQueueItem[] {
  const pages = new Map<string, RefreshQueueItem>();
  const profileMap = new Map((input.profiles ?? []).map((profile) => [profile.url, profile]));
  const upsert = (page: string, tier: RefreshQueueItem["tier"], reason: string, action: string) => {
    const current = pages.get(page) ?? {
      page,
      tier,
      reasons: [],
      actions: [],
      revenuePotential: revenuePotential(profileMap.get(page)),
    };
    current.tier = minTier(current.tier, tier);
    current.reasons.push(reason);
    current.actions.push(action);
    pages.set(page, current);
  };

  for (const item of input.opportunities) {
    upsert(item.page, item.priority, "High impressions with CTR gap.", "Refresh title, meta description, FAQ schema, and snippet block.");
  }
  for (const item of input.decay) {
    upsert(item.page, "tier_1", item.refreshReasons.join(" "), "Refresh clinical content, references, internal links, and metadata.");
  }
  for (const item of input.eeat) {
    upsert(item.page, item.score < 60 ? "tier_1" : "tier_2", item.issues.join(" "), "Assign clinical review and update EEAT fields.");
  }

  return [...pages.values()].sort((a, b) => tierRank(a.tier) - tierRank(b.tier));
}

export function buildClusterPerformance(
  rows: readonly SearchConsolePerformanceRow[],
  profiles: readonly SeoPageProfile[],
): ClusterPerformance[] {
  const byUrl = new Map(profiles.map((profile) => [profile.url, profile]));
  const groups = new Map<string, SearchConsolePerformanceRow[]>();
  for (const row of aggregateByPage(rows)) {
    const cluster = byUrl.get(row.page)?.cluster ?? inferClusterFromUrl(row.page);
    groups.set(cluster, [...(groups.get(cluster) ?? []), row]);
  }

  return [...groups.entries()].map(([cluster, group]) => {
    const impressions = sum(group.map((row) => row.impressions));
    const clicks = sum(group.map((row) => row.clicks));
    const clusterProfiles = profiles.filter((profile) => (profile.cluster ?? inferClusterFromUrl(profile.url)) === cluster);
    const conversions = sum(clusterProfiles.map((profile) => profile.conversionMetrics?.subscriptions ?? 0));
    const revenueCents = sum(clusterProfiles.map((profile) => profile.conversionMetrics?.revenueCents ?? 0));
    const linkedScore = average(clusterProfiles.map((profile) => Math.min(100, (profile.internalLinks?.length ?? 0) * 20)));
    return {
      cluster,
      pages: group.length,
      impressions,
      clicks,
      ctr: round(impressions > 0 ? clicks / impressions : 0),
      averagePosition: round(weightedAverage(group.map((row) => ({ value: row.position, weight: row.impressions })))),
      conversions,
      revenueCents,
      authorityScore: clamp100(Math.round((linkedScore + Math.min(100, group.length * 8) + Math.min(100, impressions / 50)) / 3)),
    };
  });
}

export function buildSeoCommandCenter(input: {
  currentRows: readonly SearchConsolePerformanceRow[];
  previousRows?: readonly SearchConsolePerformanceRow[];
  profiles?: readonly SeoPageProfile[];
}): SeoCommandCenter {
  const profiles = input.profiles ?? [];
  const currentPageRows = aggregateByPage(input.currentRows);
  const totalImpressions = sum(currentPageRows.map((row) => row.impressions));
  const totalOrganicTraffic = sum(currentPageRows.map((row) => row.clicks));
  const opportunityPages = detectPageOpportunities(input.currentRows);
  const decayFindings = input.previousRows ? detectContentDecay(input.currentRows, input.previousRows) : [];
  const authorityExpansion = detectAuthorityExpansion(input.currentRows, profiles);
  const internalLinks = buildInternalLinkRecommendations(profiles);
  const snippets = detectSnippetOpportunities(input.currentRows);
  const eeatRefresh = auditEeatRefresh(profiles);
  const refreshQueue = buildRefreshQueue({ opportunities: opportunityPages, decay: decayFindings, eeat: eeatRefresh, profiles });
  return {
    totalOrganicTraffic,
    totalImpressions,
    averageCtr: round(totalImpressions > 0 ? totalOrganicTraffic / totalImpressions : 0),
    averagePosition: round(weightedAverage(currentPageRows.map((row) => ({ value: row.position, weight: row.impressions })))),
    opportunityPages,
    decayFindings,
    authorityExpansion,
    internalLinks,
    snippets,
    eeatRefresh,
    refreshQueue,
    clusters: buildClusterPerformance(input.currentRows, profiles),
    quickWins: refreshQueue
      .filter((item) => item.tier !== "tier_3")
      .sort((a, b) => tierRank(a.tier) - tierRank(b.tier) || revenueRank(b.revenuePotential) - revenueRank(a.revenuePotential))
      .slice(0, 25),
  };
}

function queryType(query: string): AuthorityExpansionOpportunity["opportunityType"] {
  if (/\b(care plan|simulation|case study|practice question|nclex|rex-pn|cnple)\b/i.test(query)) return "internal_link";
  if (/\b(what is|definition|symptoms|signs|how to|steps|vs|versus)\b/i.test(query)) return "faq_section";
  if (/\b(bnp|troponin|abg|ecg|x-ray|medication|drug|lab|diagnostic)\b/i.test(query)) return "supporting_page";
  return "cluster_branch";
}

function recommendationForQuery(type: AuthorityExpansionOpportunity["opportunityType"], query: string): string {
  if (type === "supporting_page") return `Create or expand a supporting page targeting "${query}" and link it from the current pillar.`;
  if (type === "faq_section") return `Add an FAQ or quick-answer section for "${query}" with schema-ready wording.`;
  if (type === "internal_link") return `Add premium preview cards and internal links for "${query}" to related NurseNest learning assets.`;
  return `Add a cluster branch for "${query}" if it aligns with clinical authority and conversion strategy.`;
}

function snippetBlockForQuery(query: string): SnippetOpportunity["snippetBlock"] {
  if (/\b(vs|versus|difference|compare)\b/i.test(query)) return "comparison_table";
  if (/\b(how to|steps|procedure|calculate)\b/i.test(query)) return "step_by_step";
  if (/\b(what is|definition|meaning)\b/i.test(query)) return "definition";
  if (/\?|\b(can|does|should|when|why)\b/i.test(query)) return "faq";
  return "quick_answer";
}

function emptyPage(page: string): SearchConsolePerformanceRow {
  return { page, clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

function normalized(value: string | undefined): string {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function inferClusterFromUrl(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("heart-failure") || lower.includes("chf")) return "Heart Failure";
  if (lower.includes("copd")) return "COPD";
  if (lower.includes("diabetes") || lower.includes("dka")) return "Diabetes";
  if (lower.includes("sepsis")) return "Sepsis";
  if (lower.includes("stroke")) return "Stroke";
  if (lower.includes("respiratory") || lower.includes("rt-")) return "Respiratory Therapy";
  if (lower.includes("paramedic") || lower.includes("ems")) return "Paramedic";
  if (lower.includes("occupational-therapy") || lower.includes("ot-")) return "Occupational Therapy";
  if (lower.includes("physiotherapy") || lower.includes("pt-")) return "Physiotherapy";
  if (lower.includes("mlt") || lower.includes("laboratory")) return "Medical Laboratory Technology";
  return "Unclustered";
}

function revenuePotential(profile: SeoPageProfile | undefined): RefreshQueueItem["revenuePotential"] {
  const revenue = profile?.conversionMetrics?.revenueCents ?? 0;
  const subs = profile?.conversionMetrics?.subscriptions ?? 0;
  if (revenue >= 50000 || subs >= 5) return "high";
  if (revenue > 0 || subs > 0 || profile?.contentType === "care-plan" || profile?.contentType === "certification") return "medium";
  return "low";
}

function minTier(a: RefreshQueueItem["tier"], b: RefreshQueueItem["tier"]): RefreshQueueItem["tier"] {
  return tierRank(a) <= tierRank(b) ? a : b;
}

function tierRank(tier: RefreshQueueItem["tier"]): number {
  return tier === "tier_1" ? 1 : tier === "tier_2" ? 2 : 3;
}

function revenueRank(value: RefreshQueueItem["revenuePotential"]): number {
  return value === "high" ? 3 : value === "medium" ? 2 : 1;
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function average(values: readonly number[]): number {
  return values.length ? sum(values) / values.length : 0;
}

function weightedAverage(values: readonly { value: number; weight: number }[]): number {
  const weight = sum(values.map((item) => item.weight));
  if (weight === 0) return 0;
  return sum(values.map((item) => item.value * item.weight)) / weight;
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function clamp100(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function daysBetween(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / 86_400_000);
}

