import {
  defaultNpCertificationPathwayId,
  normalizeNpCertificationPathwayId,
  NP_CERTIFICATION_PATHWAY_COOKIE,
} from "@/lib/np/np-certification-pathways";

type CookieStoreLike = {
  get(name: string): { value?: string } | undefined;
};

export function selectedNpCertificationPathwayIdFromCookieStore(
  cookieStore: CookieStoreLike | null | undefined,
): string | null {
  return normalizeNpCertificationPathwayId(cookieStore?.get(NP_CERTIFICATION_PATHWAY_COOKIE)?.value);
}

export function resolveNpCertificationPathwayId(args: {
  cookieStore?: CookieStoreLike | null;
  queryPathwayId?: string | string[] | null;
  profilePathwayId?: string | null;
  requireExplicitSelection?: boolean;
}): string | null {
  const query = Array.isArray(args.queryPathwayId) ? args.queryPathwayId[0] : args.queryPathwayId;
  const explicit = normalizeNpCertificationPathwayId(query) ?? selectedNpCertificationPathwayIdFromCookieStore(args.cookieStore);
  if (explicit) return explicit;
  if (args.requireExplicitSelection) return null;
  return normalizeNpCertificationPathwayId(args.profilePathwayId) ?? defaultNpCertificationPathwayId();
}

export function npCertificationPathwayCookieOptions() {
  return {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
