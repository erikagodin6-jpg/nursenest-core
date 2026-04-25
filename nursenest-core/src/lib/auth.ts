// (imports unchanged — keep yours)

const isProd = process.env.NODE_ENV === "production";

/* =========================
   HELPERS (centralized)
   ========================= */

function reject(code: string): null {
  if (authCredentialDiagnosticCodesEnabled()) {
    const err = new CredentialsSignin();
    err.code = code;
    throw err;
  }
  return null;
}

function rejectRateLimited(): never {
  const err = new CredentialsSignin();
  err.code = "rate_limit_exceeded";
  throw err;
}

function safeRememberMe(input: unknown): boolean {
  if (typeof input !== "string") return true;

  const v = input.trim().toLowerCase();

  if (["false", "0", "off", "no"].includes(v)) return false;
  if (["true", "1", "on", "yes"].includes(v)) return true;

  // default = short session (safer)
  return false;
}

async function safeUserUpdateLastLogin(userId: string, ip: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginIp: ip !== "unknown" ? ip.slice(0, 64) : null,
        lastLoginAt: new Date(),
      },
    });
  } catch (e) {
    safeServerLog("auth", "last_login_update_failed", {
      userIdPrefix: userId.slice(0, 8),
    });
  }
}

/* =========================
   AUTH CONFIG
   ========================= */

export const authConfig: NextAuthConfig = {
  basePath: PINNED_AUTH_BASE_PATH,
  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: JWT_SESSION_MAX_AGE_SEC,
    updateAge: JWT_SESSION_UPDATE_AGE_SEC,
  },

  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Stay signed in", type: "text" },
      },

      async authorize(credentials, request) {
        const ip = clientIpFromRequest(request);
        const emailRaw = String(credentials.email ?? "");
        const password = String(credentials.password ?? "");

        const emailSanitized = sanitizeRawLoginIdentifier(emailRaw);
        const emailLower = normalizeLoginIdentifier(emailSanitized);

        const idHash = emailLower
          ? hashLoginIdentifierForLog(emailLower)
          : "";

        if (!emailLower || !password) {
          recordCredentialsLoginFailure("missing_fields", request);
          return reject("missing_credentials");
        }

        /* =========================
           USER LOOKUP
           ========================= */

        let user: CredentialsUserRow | null = null;

        try {
          user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: { equals: emailLower, mode: "insensitive" } },
                { username: { equals: emailLower, mode: "insensitive" } },
              ],
            },
            select: CREDENTIALS_USER_SELECT,
          });
        } catch (e) {
          safeServerLogCritical("auth", "db_error", {}, e);
          recordCredentialsLoginFailure("db_error", request);
          return reject("db_error");
        }

        if (!user) {
          recordCredentialsLoginFailure("not_found", request);
          return reject("user_missing");
        }

        /* =========================
           PASSWORD CHECK
           ========================= */

        const hash = normalizeStoredPasswordHash(user.passwordHash);

        if (!hash) {
          recordCredentialsLoginFailure("no_password_hash", request);
          return reject("no_password_hash");
        }

        let passwordOk = false;

        try {
          passwordOk = await compare(password, hash);
        } catch {
          recordCredentialsLoginFailure("system_error", request);
          return reject("system_error");
        }

        if (!passwordOk) {
          recordCredentialsLoginFailure("bad_password", request);
          return reject("password_invalid");
        }

        /* =========================
           SUCCESS
           ========================= */

        await clearLoginFailures(`login-lock:${idHash || ip}`);

        await safeUserUpdateLastLogin(user.id, ip);

        const rememberMe = safeRememberMe(credentials.rememberMe);

        let subscriptionStatus: SessionSubscriptionStatus = "none";

        try {
          const ua = await getUserAccess(user.id);
          subscriptionStatus = subscriptionStatusForSession(ua);
        } catch {
          // tolerate DB failure — do not block login
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          country: user.country,
          tier: user.tier,
          alliedProfessionKey: user.alliedProfessionKey ?? null,
          subscriptionStatus,
          credentialVersion: user.credentialVersion ?? 0,
          rememberMe,
        };
      },
    }),
  ],

  callbacks: {
    ...authCallbacks,
    jwt: nodeJwtCallback,
  },
};

/* =========================
   HANDLERS
   ========================= */

const { auth, signIn, signOut } = NextAuth(authConfig);

export { auth, signIn, signOut };

export const handlers = {
  GET: (req: NextRequest) =>
    Auth(reqWithEnvURL(req), { ...authConfig, trustHost: true }),

  POST: (req: NextRequest) =>
    Auth(reqWithEnvURL(req), { ...authConfig, trustHost: true }),
};