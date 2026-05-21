/**
 * URL helpers for `/app/flashcards` hub + `/app/flashcards/custom` study entry.
 * Query keys are stable for share/back/refresh.
 */

export type FlashcardsHubMode = "all" | "starred" | "weak" | "incorrect" | "unstudied";

export function parseHubSystemsFromSearchParams(sp: URLSearchParams): string[] {
  const norm = (s: string) => s.trim().toLowerCase().replace(/-/g, "_");
  const multi = sp.get("systems")?.trim();
  if (multi) {
    return multi
      .split(",")
      .map((s) => norm(s))
      .filter(Boolean);
  }
  const one = sp.get("system")?.trim();
  return one ? [norm(one)] : [];
}

export function parseHubMode(sp: URLSearchParams): FlashcardsHubMode {
  const raw = (sp.get("mode") ?? "all").trim().toLowerCase();
  if (raw === "starred" || raw === "weak" || raw === "incorrect" || raw === "unstudied") return raw;
  return "all";
}

export function buildAppFlashcardsHubHref(args: {
  pathwayId: string;
  systems?: readonly string[];
  mode?: FlashcardsHubMode;
  q?: string | null;
}): string {
  const q = new URLSearchParams();
  q.set("pathwayId", args.pathwayId);
  if (args.systems?.length) q.set("systems", [...new Set(args.systems)].join(","));
  if (args.mode && args.mode !== "all") q.set("mode", args.mode);
  const qt = args.q?.trim();
  if (qt) q.set("q", qt);
  const s = q.toString();
  return s ? `/app/flashcards?${s}` : "/app/flashcards";
}

/**
 * Builds `/app/flashcards/custom` query for the existing custom-session API contract.
 */
export function buildAppFlashcardsCustomStudyHref(args: {
  pathwayId: string;
  systems?: readonly string[];
  mode?: FlashcardsHubMode;
  /** Starred card ids (pathway-safe: server intersects with pathway inventory). */
  starredStateIds?: readonly string[];
  cardLimit?: number | "all";
  shuffle?: boolean;
}): string {
  const q = new URLSearchParams();
  q.set("pathwayId", args.pathwayId);
  q.set("includeCards", "1");
  q.set("shuffle", args.shuffle === false ? "0" : "1");
  q.set("cardLimit", args.cardLimit === "all" ? "all" : String(args.cardLimit ?? 50));

  if (args.systems?.length) {
    q.set("categories", [...new Set(args.systems)].join(","));
  }

  const mode = args.mode ?? "all";
  if (mode === "weak") q.set("weakOnly", "1");
  if (mode === "incorrect") q.set("incorrectOnly", "1");
  if (mode === "unstudied") q.set("notStudiedOnly", "1");
  if (mode === "starred") {
    q.set("starredOnly", "1");
    if (args.starredStateIds?.length) {
      q.set("stateIds", args.starredStateIds.slice(0, 500).join(","));
    }
  }

  return `/app/flashcards/custom?${q.toString()}`;
}
