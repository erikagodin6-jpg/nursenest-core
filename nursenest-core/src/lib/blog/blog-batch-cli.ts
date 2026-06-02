import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { BLOG_TOPIC_BANK, TOPIC_CATEGORY_RANGES } from "@/lib/blog/blog-topic-bank";

export type BlogBatchCliArgs = {
  count: number;
  pathwayId: string;
  strategy: string;
  minWords: number;
  publish: boolean;
  dryRun: boolean;
  requireApaReferences: boolean;
  minReferences: number;
  requireInternalLinks: boolean;
  validateInternalLinks: boolean;
  paywallSafeLinks: boolean;
  publishOnlyIfValid: boolean;
  includeFaqs: boolean;
  includeClinicalPearls: boolean;
};

function parseBool(raw: string | undefined, fallback: boolean): boolean {
  if (raw == null || raw === "") return fallback;
  const v = raw.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return fallback;
}

function parseIntFlag(raw: string | undefined, fallback: number, min: number): number {
  const n = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, n);
}

function argValue(argv: string[], key: string): string | undefined {
  const eq = argv.find((arg) => arg.startsWith(`${key}=`));
  if (eq) return eq.slice(key.length + 1);
  const i = argv.findIndex((arg) => arg === key);
  if (i >= 0) return argv[i + 1];
  return undefined;
}

export function parseBlogBatchCliArgs(argv: string[]): BlogBatchCliArgs {
  const dryRun = parseBool(argValue(argv, "--dryRun"), false);
  const publish = dryRun ? false : parseBool(argValue(argv, "--publish"), false);
  return {
    count: parseIntFlag(argValue(argv, "--count"), 1, 1),
    pathwayId: (argValue(argv, "--pathway") ?? "ca-rn-nclex-rn").trim(),
    strategy: (argValue(argv, "--strategy") ?? "long-tail-nclex").trim(),
    minWords: parseIntFlag(argValue(argv, "--minWords"), 1500, 1200),
    publish,
    dryRun,
    requireApaReferences: parseBool(argValue(argv, "--requireApaReferences"), true),
    minReferences: parseIntFlag(argValue(argv, "--minReferences"), 4, 1),
    requireInternalLinks: parseBool(argValue(argv, "--requireInternalLinks"), true),
    validateInternalLinks: parseBool(argValue(argv, "--validateInternalLinks"), true),
    paywallSafeLinks: parseBool(argValue(argv, "--paywallSafeLinks"), true),
    publishOnlyIfValid: parseBool(argValue(argv, "--publishOnlyIfValid"), true),
    includeFaqs: parseBool(argValue(argv, "--includeFaqs"), true),
    includeClinicalPearls: parseBool(argValue(argv, "--includeClinicalPearls"), true),
  };
}

export function resolveBatchPathway(pathwayId: string): {
  pathwayId: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  tier: "rn" | "rpn" | "pn" | "np" | "allied";
} {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    throw new Error(`Unknown pathway: ${pathwayId}`);
  }
  const country = pathway.countrySlug === "canada" ? "CA" : pathway.countrySlug === "us" ? "US" : "unspecified";
  const tier =
    pathway.roleTrack === "rpn"
      ? "rpn"
      : pathway.roleTrack === "lpn"
        ? "pn"
        : pathway.roleTrack === "np"
          ? "np"
          : pathway.roleTrack === "allied"
            ? "allied"
            : "rn";
  return {
    pathwayId: pathway.id,
    exam: pathway.shortName,
    country,
    tier,
  };
}

export function selectBatchTopics(args: { count: number; strategy: string }): string[] {
  const strategy = args.strategy.trim().toLowerCase();
  if (strategy === "long-tail-nclex") {
    const { start, end } = TOPIC_CATEGORY_RANGES.D;
    return BLOG_TOPIC_BANK.slice(start, end + 1).slice(0, args.count);
  }
  if (strategy === "question-seo") {
    const { start, end } = TOPIC_CATEGORY_RANGES.A;
    return BLOG_TOPIC_BANK.slice(start, end + 1).slice(0, args.count);
  }
  throw new Error(`Unsupported blog batch strategy: ${args.strategy}`);
}
