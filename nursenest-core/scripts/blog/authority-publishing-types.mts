export type AuthorityLane = "ecg" | "cnple" | "rexpn" | "nclex" | "rt" | "pathophysiology";

export type AuthorityLink = {
  label: string;
  href: string;
};

export type AuthorityTopic = {
  lane: AuthorityLane;
  slug: string;
  title: string;
  targetKeyword: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  internalLinks: AuthorityLink[];
  clinicalFocus: string;
  learnerIntent: string;
};

export function slugifyAuthorityTopic(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 95);
}

export function buildAuthorityTopic(args: {
  lane: AuthorityLane;
  title: string;
  category: string;
  tags: string[];
  internalLinks: AuthorityLink[];
  clinicalFocus: string;
  learnerIntent: string;
}): AuthorityTopic {
  const targetKeyword = args.title.replace(/:/g, "").replace(/\s+/g, " ").trim();
  const slug = `${args.lane}-${slugifyAuthorityTopic(args.title)}`;
  return {
    lane: args.lane,
    slug,
    title: args.title,
    targetKeyword,
    category: args.category,
    tags: args.tags,
    seoTitle: `${args.title} | NurseNest`,
    seoDescription: `${args.title} explained for nursing and allied health learners with exam-focused clinical reasoning, assessment priorities, and NurseNest study links.`,
    internalLinks: args.internalLinks,
    clinicalFocus: args.clinicalFocus,
    learnerIntent: args.learnerIntent,
  };
}

export function buildDailyAuthorityPublishingPlan(args: {
  startDate: string;
  days: number;
  lanes: Record<AuthorityLane, AuthorityTopic[]>;
}): { date: string; topics: AuthorityTopic[] }[] {
  const start = new Date(`${args.startDate}T12:00:00Z`);
  const out: { date: string; topics: AuthorityTopic[] }[] = [];
  for (let day = 0; day < args.days; day += 1) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + day);
    const date = d.toISOString().slice(0, 10);
    out.push({
      date,
      topics: [
        args.lanes.ecg[day % args.lanes.ecg.length]!,
        args.lanes.cnple[day % args.lanes.cnple.length]!,
        args.lanes.rt[day % args.lanes.rt.length]!,
        args.lanes.pathophysiology[day % args.lanes.pathophysiology.length]!,
        day % 2 === 0 ? args.lanes.rexpn[day % args.lanes.rexpn.length]! : args.lanes.nclex[day % args.lanes.nclex.length]!,
      ],
    });
  }
  return out;
}
