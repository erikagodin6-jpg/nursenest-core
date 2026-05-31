import { normalizeTopicSlugInput } from "@/lib/study/topic-slug-normalize";

export type LessonSystemNavigationTarget = {
  label: string;
  primaryTopicSlug: string;
  aliases: readonly string[];
};

const SYSTEM_ALIASES: readonly LessonSystemNavigationTarget[] = [
  {
    label: "Cardiovascular",
    primaryTopicSlug: "cardiovascular",
    aliases: ["cardiovascular", "cardiac", "cv", "heart"],
  },
  {
    label: "Respiratory",
    primaryTopicSlug: "respiratory",
    aliases: ["respiratory", "pulmonary", "airway", "gas-exchange"],
  },
  {
    label: "Neurological",
    primaryTopicSlug: "neurological",
    aliases: ["neurological", "neurologic", "neuro"],
  },
  {
    label: "Endocrine",
    primaryTopicSlug: "endocrine",
    aliases: ["endocrine", "diabetes", "diabetes-mellitus", "thyroid"],
  },
  {
    label: "Renal",
    primaryTopicSlug: "renal",
    aliases: [
      "renal",
      "renal-urinary",
      "renal_urinary",
      "renal-and-urinary",
      "renal_and_urinary",
      "renal-genitourinary",
      "renal_genitourinary",
      "urinary",
      "gu",
      "fluid-balance",
      "fluids-electrolytes",
      "fluids-electrolytes-and-acid-base",
    ],
  },
  {
    label: "Gastrointestinal",
    primaryTopicSlug: "gastrointestinal",
    aliases: ["gastrointestinal", "gi", "digestive", "nutrition"],
  },
  {
    label: "Mental Health",
    primaryTopicSlug: "mental-health",
    aliases: ["mental-health", "mental_health", "psychiatric", "psychiatry", "behavioral-health"],
  },
  {
    label: "Pediatrics",
    primaryTopicSlug: "pediatrics",
    aliases: ["pediatrics", "pediatric", "child-health", "children"],
  },
  {
    label: "Maternity",
    primaryTopicSlug: "maternity",
    aliases: [
      "maternity",
      "maternal-and-newborn",
      "maternal_newborn",
      "maternal-newborn",
      "maternal_newborn",
      "reproductive-maternal-newborn",
      "reproductive_maternal_newborn",
      "reproductive-obstetrics",
      "reproductive_obstetrics",
      "maternity-reproductive",
      "maternity_reproductive",
      "obstetrics",
      "ob",
      "newborn",
    ],
  },
] as const;

function normalizedKey(value: string | null | undefined): string {
  return normalizeTopicSlugInput(value).replace(/-/g, "_");
}

const TARGETS_BY_KEY = new Map<string, LessonSystemNavigationTarget>();
for (const target of SYSTEM_ALIASES) {
  TARGETS_BY_KEY.set(normalizedKey(target.primaryTopicSlug), target);
  TARGETS_BY_KEY.set(normalizedKey(target.label), target);
  for (const alias of target.aliases) {
    TARGETS_BY_KEY.set(normalizedKey(alias), target);
  }
}

function uniqueNonEmpty(values: Iterable<string>): string[] {
  return [...new Set([...values].map((value) => value.trim()).filter(Boolean))];
}

export function resolveLessonSystemNavigationTarget(
  value: string | null | undefined,
): LessonSystemNavigationTarget | null {
  const key = normalizedKey(value);
  return key ? TARGETS_BY_KEY.get(key) ?? null : null;
}

export function lessonSystemTopicSlugCandidates(value: string | null | undefined): string[] {
  const raw = (value ?? "").trim();
  if (!raw) return [];

  const direct = normalizeTopicSlugInput(raw);
  const target = resolveLessonSystemNavigationTarget(raw);
  if (!target) return direct ? [direct] : [];

  return uniqueNonEmpty([
    target.primaryTopicSlug,
    direct,
    ...target.aliases.flatMap((alias) => {
      const kebab = normalizeTopicSlugInput(alias);
      const underscore = kebab.replace(/-/g, "_");
      return kebab === underscore ? [kebab] : [kebab, underscore];
    }),
  ]);
}

export function primaryLessonSystemTopicSlug(value: string | null | undefined): string | null {
  const target = resolveLessonSystemNavigationTarget(value);
  if (target) return target.primaryTopicSlug;
  const normalized = normalizeTopicSlugInput(value);
  return normalized || null;
}

export function buildAppLessonsSystemHref(args: {
  pathwayId?: string | null;
  system: string | null | undefined;
  limit?: number | null;
}): string {
  const qs = new URLSearchParams();
  const slug = primaryLessonSystemTopicSlug(args.system);
  if (slug) qs.set("topicSlug", slug);
  if (args.pathwayId?.trim()) qs.set("pathwayId", args.pathwayId.trim());
  if (args.limit && args.limit > 0) qs.set("limit", String(args.limit));
  const query = qs.toString();
  return query ? `/app/lessons?${query}` : "/app/lessons";
}
