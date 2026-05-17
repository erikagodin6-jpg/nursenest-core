import { headers } from "next/headers";

export type EcosystemHost = "main" | "allied" | "newgrad";

export const ECOSYSTEM_HOST_HEADER = "x-nn-ecosystem";

export function resolveEcosystemFromHost(host: string | null | undefined): EcosystemHost {
  const normalized = (host ?? "").toLowerCase().trim();

  if (normalized.startsWith("allied.")) return "allied";
  if (normalized.startsWith("newgrad.") || normalized.startsWith("new-grad.")) return "newgrad";

  return "main";
}

export async function resolveEcosystemHost(): Promise<EcosystemHost> {
  try {
    const h = await headers();
    const forwarded = h.get(ECOSYSTEM_HOST_HEADER);
    if (forwarded === "allied" || forwarded === "newgrad" || forwarded === "main") return forwarded;

    return resolveEcosystemFromHost(h.get("x-forwarded-host") ?? h.get("host"));
  } catch {
    return "main";
  }
}

export function ecosystemDisplayName(ecosystem: EcosystemHost): string {
  switch (ecosystem) {
    case "allied":
      return "NurseNest Allied Health";
    case "newgrad":
      return "NurseNest New Grad";
    default:
      return "NurseNest";
  }
}

export function ecosystemRootPath(ecosystem: EcosystemHost): string {
  switch (ecosystem) {
    case "allied":
      return "/allied-health";
    case "newgrad":
      return "/new-grad";
    default:
      return "/";
  }
}
