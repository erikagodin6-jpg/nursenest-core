import type { Request, Response, NextFunction } from "express";

export type Region = "US" | "CA";
export type RegionScope = "US_ONLY" | "CA_ONLY" | "BOTH";

declare global {
  namespace Express {
    interface Request {
      region?: Region;
    }
  }
}

/* -------------------------
   REGION DETECTION
------------------------- */

export function getEffectiveRegion(hostname: string): Region {
  const h = (hostname || "").toLowerCase();

  try {
    if (h.endsWith(".ca") || h.includes(".ca:")) return "CA";
    if (h.endsWith(".us") || h.includes(".us:")) return "US";

    const envRegion = process.env.DEFAULT_REGION;
    if (envRegion === "CA") return "CA";

    return "US";
  } catch (err) {
    console.error("[Region] Error determining region:", err);
    return "US";
  }
}

/* -------------------------
   REGION MIDDLEWARE
------------------------- */

export function regionMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const host = req.hostname || req.headers.host || "localhost";
    req.region = getEffectiveRegion(String(host));
  } catch (err) {
    console.error("[Region] Middleware error:", err);
    req.region = "US";
  }

  next();
}

/* -------------------------
   REGION LOGIC HELPERS
------------------------- */

export function getAllowedRegionScopes(
  tier: string | null | undefined,
  region: Region
): RegionScope[] {
  const t = (tier || "free").toLowerCase();

  try {
    switch (t) {
      case "np":
      case "prenursing":
      case "rpn":
      case "rn":
      case "lvn":
      case "admin":
      case "free":
      default:
        return ["BOTH", `${region}_ONLY` as RegionScope];
    }
  } catch (err) {
    console.error("[Region] getAllowedRegionScopes error:", err);
    return ["BOTH", `${region}_ONLY` as RegionScope];
  }
}

export function buildRegionFilter(region: Region): string {
  return `region_scope IN ('BOTH', '${region}_ONLY')`;
}

export function isRegionAllowed(
  itemScope: RegionScope | string | null | undefined,
  region: Region
): boolean {
  try {
    const scope = (itemScope || "BOTH") as RegionScope;

    if (scope === "BOTH") return true;
    if (scope === "CA_ONLY" && region === "CA") return true;
    if (scope === "US_ONLY" && region === "US") return true;

    return false;
  } catch (err) {
    console.error("[Region] isRegionAllowed error:", err);
    return true; // fail open (safer than blocking)
  }
}

export function getDefaultRegionScope(
  tier: string | null | undefined,
  region: Region
): RegionScope {
  try {
    const t = (tier || "free").toLowerCase();

    if (t === "np" || t === "prenursing") {
      return "BOTH";
    }

    return `${region}_ONLY` as RegionScope;
  } catch (err) {
    console.error("[Region] getDefaultRegionScope error:", err);
    return "BOTH";
  }
}

export function canChangeRegionScope(
  tier: string | null | undefined,
  status: string | null | undefined
): boolean {
  try {
    const t = (tier || "free").toLowerCase();

    if (t === "np" || t === "prenursing" || t === "free" || t === "admin") {
      return true;
    }

    if (status === "published") {
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Region] canChangeRegionScope error:", err);
    return true;
  }
}