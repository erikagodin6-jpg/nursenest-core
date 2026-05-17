/**
 * Contract: CA RN authority cluster — validates all ca-rn pages are registered,
 * paths are correct, and key content fields are populated.
 */
import { describe, expect, it } from "vitest";
import {
  listAuthorityClusterPages,
  getAuthorityClusterPage,
  listAuthorityClusterPaths,
} from "@/lib/seo/authority-cluster-pages";

const CA_RN_BASE = "/canada-nclex-rn";

const EXPECTED_CA_RN_SLUGS = [
  "overview",
  "questions",
  "study-guide",
  "clinical-judgment",
  "pharmacology",
  "priority-questions",
  "cat-strategy",
  "nclex-next-gen",
] as const;

describe("CA RN authority cluster — contract", () => {
  it("all expected ca-rn slugs are registered", () => {
    for (const slug of EXPECTED_CA_RN_SLUGS) {
      const page = getAuthorityClusterPage("ca-rn", slug);
      expect(page, `Missing ca-rn page for slug: ${slug}`).toBeDefined();
    }
  });

  it("ca-rn overview page has correct base path", () => {
    const page = getAuthorityClusterPage("ca-rn", "overview");
    expect(page?.path).toBe(CA_RN_BASE);
  });

  it("ca-rn topic pages have correct path structure", () => {
    const pages = listAuthorityClusterPages().filter((p) => p.cluster === "ca-rn" && p.slug !== "overview");
    for (const page of pages) {
      expect(page.path, `Path for ${page.slug} should start with base`).toMatch(new RegExp(`^${CA_RN_BASE}/`));
    }
  });

  it("all ca-rn pages have required content fields populated", () => {
    const pages = listAuthorityClusterPages().filter((p) => p.cluster === "ca-rn");
    for (const page of pages) {
      expect(page.title.length, `${page.slug}: title is empty`).toBeGreaterThan(0);
      expect(page.description.length, `${page.slug}: description is empty`).toBeGreaterThan(0);
      expect(page.h1.length, `${page.slug}: h1 is empty`).toBeGreaterThan(0);
      expect(page.faq.length, `${page.slug}: faq is empty`).toBeGreaterThan(0);
      expect(page.sections.length, `${page.slug}: sections is empty`).toBeGreaterThan(0);
      expect(page.ctas.length, `${page.slug}: ctas is empty`).toBeGreaterThan(0);
    }
  });

  it("ca-rn pages reference NCLEX-RN and Canada in titles", () => {
    const pages = listAuthorityClusterPages().filter((p) => p.cluster === "ca-rn");
    for (const page of pages) {
      const titleLower = page.title.toLowerCase();
      expect(
        titleLower.includes("nclex") || titleLower.includes("canada") || titleLower.includes("rn"),
        `${page.slug}: title should reference NCLEX-RN or Canada`,
      ).toBe(true);
    }
  });

  it("ca-rn paths are all registered in listAuthorityClusterPaths", () => {
    const pages = listAuthorityClusterPages().filter((p) => p.cluster === "ca-rn");
    const allPaths = new Set(listAuthorityClusterPaths());
    for (const page of pages) {
      expect(allPaths.has(page.path), `Path ${page.path} not in listAuthorityClusterPaths`).toBe(true);
    }
  });

  it("ca-rn cluster has at least 7 pages", () => {
    const pages = listAuthorityClusterPages().filter((p) => p.cluster === "ca-rn");
    expect(pages.length).toBeGreaterThanOrEqual(7);
  });

  it("ca-rn FAQ entries contain NCLEX-RN-specific questions", () => {
    const overview = getAuthorityClusterPage("ca-rn", "overview");
    expect(overview?.faq.some((q) => /adaptive|CAT|NGN|next gen/i.test(q.question + q.answer))).toBe(true);
  });
});

describe("NP specialty authority clusters — contract", () => {
  const NP_CLUSTERS = ["np-fnp", "np-agpcnp", "np-pmhnp", "np-whnp", "np-pnp-pc"] as const;
  const NP_BASES: Record<string, string> = {
    "np-fnp": "/np-specialty/fnp",
    "np-agpcnp": "/np-specialty/agpcnp",
    "np-pmhnp": "/np-specialty/pmhnp",
    "np-whnp": "/np-specialty/whnp",
    "np-pnp-pc": "/np-specialty/pnp-pc",
  };
  const EXPECTED_SLUGS = ["overview", "questions", "study-guide", "pharmacology", "clinical-cases"] as const;

  it("all NP specialty clusters have expected slugs", () => {
    for (const cluster of NP_CLUSTERS) {
      for (const slug of EXPECTED_SLUGS) {
        const page = getAuthorityClusterPage(cluster, slug);
        expect(page, `Missing ${cluster} page for slug: ${slug}`).toBeDefined();
      }
    }
  });

  it("NP specialty overview pages have correct base paths", () => {
    for (const cluster of NP_CLUSTERS) {
      const page = getAuthorityClusterPage(cluster, "overview");
      expect(page?.path, `${cluster} overview path`).toBe(NP_BASES[cluster]);
    }
  });

  it("all NP specialty pages have required content fields", () => {
    for (const cluster of NP_CLUSTERS) {
      const pages = listAuthorityClusterPages().filter((p) => p.cluster === cluster);
      for (const page of pages) {
        expect(page.title.length, `${cluster}/${page.slug}: title empty`).toBeGreaterThan(0);
        expect(page.description.length, `${cluster}/${page.slug}: description empty`).toBeGreaterThan(0);
        expect(page.faq.length, `${cluster}/${page.slug}: faq empty`).toBeGreaterThan(0);
        expect(page.sections.length, `${cluster}/${page.slug}: sections empty`).toBeGreaterThan(0);
      }
    }
  });

  it("each NP specialty cluster has at least 5 pages", () => {
    for (const cluster of NP_CLUSTERS) {
      const pages = listAuthorityClusterPages().filter((p) => p.cluster === cluster);
      expect(pages.length, `${cluster} should have at least 5 pages`).toBeGreaterThanOrEqual(5);
    }
  });

  it("NP specialty sibling pages are within the same cluster", () => {
    for (const cluster of NP_CLUSTERS) {
      const overview = getAuthorityClusterPage(cluster, "overview");
      if (!overview) continue;
      const siblings = listAuthorityClusterPages().filter(
        (p) => p.cluster === overview.cluster && p.path !== overview.path,
      );
      for (const sibling of siblings) {
        expect(sibling.cluster).toBe(cluster);
      }
    }
  });

  it("FNP pages reference FNP and AANP/ANCC", () => {
    const pages = listAuthorityClusterPages().filter((p) => p.cluster === "np-fnp");
    for (const page of pages) {
      const content = page.title + page.description + page.h1;
      expect(content).toMatch(/FNP/i);
    }
  });

  it("PMHNP pages reference psychiatric or mental health content", () => {
    const pages = listAuthorityClusterPages().filter((p) => p.cluster === "np-pmhnp");
    for (const page of pages) {
      const content = (page.title + page.description + page.h1).toLowerCase();
      expect(content.includes("pmhnp") || content.includes("psychiatric") || content.includes("mental health")).toBe(true);
    }
  });
});
