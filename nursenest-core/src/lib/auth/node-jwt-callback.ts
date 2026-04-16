import "server-only";

import type { JWT } from "next-auth/jwt";
import { authCallbacks } from "@/lib/auth-callbacks";
import { getSessionIdentityPayload } from "@/lib/auth/session-identity-from-db";
import { prisma } from "@/lib/db";

/** Derive from the concrete callback — `NextAuthConfig["callbacks"]["jwt"]` is optional in typings. */
type JwtParams = Parameters<NonNullable<typeof authCallbacks.jwt>>[0];

/** Throttle DB reads on hot paths (session polling) while still invalidating stale JWTs quickly after password change. */
const CREDENTIAL_CHECK_THROTTLE_MS = 120_000;

/**
 * Node-only JWT callback: DB-backed `session.update()` merges (ignores client-supplied identity),
 * and `credentialVersion` invalidates sessions after password change / reset.
 *
 * Edge (`auth-middleware`) uses {@link authCallbacks} without this layer — cookies are still
 * validated; RSC/API routes run the full Node stack.
 */
export async function nodeJwtCallback(params: JwtParams): Promise<JWT> {
  const inner = authCallbacks.jwt;
  if (!inner) throw new Error("authCallbacks.jwt missing");
  const token = (await inner(params)) as JWT & { credentialCheckedAt?: number };

  if (params.user) {
    return token;
  }

  if (params.trigger === "update" && typeof token.sub === "string" && token.sub.length > 0) {
    const identity = await getSessionIdentityPayload(token.sub);
    if (identity) {
      token.tier = identity.tier ?? token.tier;
      token.country = identity.country ?? token.country;
      token.subscriptionStatus = identity.subscriptionStatus;
      token.role = identity.role;
      token.credentialVersion = identity.credentialVersion;
    }
    return invalidateIfCredentialMismatch(token, true);
  }

  return invalidateIfCredentialMismatch(token, false);
}

async function invalidateIfCredentialMismatch(
  token: JWT & { credentialCheckedAt?: number },
  forceCheck: boolean,
): Promise<JWT> {
  if (typeof token.sub !== "string" || token.sub.length === 0) return token;

  const now = Date.now();
  const ext = token;
  const last = typeof ext.credentialCheckedAt === "number" ? ext.credentialCheckedAt : 0;
  if (!forceCheck && now - last < CREDENTIAL_CHECK_THROTTLE_MS) {
    return token;
  }
  ext.credentialCheckedAt = now;

  try {
    const row = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { credentialVersion: true },
    });
    const tv = typeof token.credentialVersion === "number" ? token.credentialVersion : 0;
    if (!row || row.credentialVersion !== tv) {
      return { ...token, exp: Math.floor(Date.now() / 1000) - 10_000 };
    }
  } catch {
    /* availability: do not block session if DB is briefly unavailable */
  }
  return token;
}
