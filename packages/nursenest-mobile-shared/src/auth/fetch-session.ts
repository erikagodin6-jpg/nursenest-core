import { apiPaths } from "../api-paths.js";
import { buildOriginUrl } from "./credentials-sign-in.js";
import type { NurseNestSession } from "../session-types.js";

export async function fetchAuthSession(origin: string, cookieJar: string | null): Promise<NurseNestSession | null> {
  const url = buildOriginUrl(origin, apiPaths.authSession);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(cookieJar ? { Cookie: cookieJar } : {}),
    },
  });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  try {
    const json = (await res.json()) as NurseNestSession;
    if (!json?.user?.id) return null;
    return json;
  } catch {
    return null;
  }
}
