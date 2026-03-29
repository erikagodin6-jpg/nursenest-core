#!/usr/bin/env npx tsx
/**
 * HTTP smoke + core flow checks against a running NurseNest server.
 *
 * Prerequisites:
 *   - Server already listening (e.g. `npm run dev` in another terminal)
 *   - Real DATABASE_URL on the server so DB-backed routes work
 *
 * Usage:
 *   VERIFY_API_BASE=http://127.0.0.1:5000 npx tsx scripts/verify-core-api.ts
 *   VERIFY_STRICT=1  — fail on unexpected status codes / malformed JSON for checked routes
 *
 * Optional learner auth (JWT or any resolveAuthUser-accepted token):
 *   VERIFY_BEARER=<token>
 *   VERIFY_USER_ID=<uuid>   — progress + deck query helpers (must match token user when required)
 *   VERIFY_LESSON_SLUG=...
 *   VERIFY_EXAM_TEMPLATE_ID=...
 *   VERIFY_FLASHCARD_DECK_ID=...
 *   VERIFY_EXPECT_ENTITLED=true|false  — flashcard-bank: expect 200 vs 403
 *
 * Optional admin:
 *   VERIFY_ADMIN_BEARER=<admin JWT or SERVER_API_KEY>
 *   VERIFY_ADMIN_RUN_SEEDS=1  — POST /api/admin/run-seeds (heavy; off by default)
 */
const BASE = (process.env.VERIFY_API_BASE || "http://127.0.0.1:5000").replace(/\/$/, "");
const STRICT = process.env.VERIFY_STRICT === "1";
const TIMEOUT_MS = Math.min(Math.max(parseInt(process.env.VERIFY_TIMEOUT_MS || "120000", 10) || 120000, 5000), 300000);

const VERIFY_BEARER = process.env.VERIFY_BEARER?.trim();
const VERIFY_USER_ID = process.env.VERIFY_USER_ID?.trim();
const VERIFY_ADMIN_BEARER = process.env.VERIFY_ADMIN_BEARER?.trim();
const VERIFY_LESSON_SLUG = process.env.VERIFY_LESSON_SLUG?.trim();
const VERIFY_EXAM_TEMPLATE_ID = process.env.VERIFY_EXAM_TEMPLATE_ID?.trim();
const VERIFY_FLASHCARD_DECK_ID = process.env.VERIFY_FLASHCARD_DECK_ID?.trim();
const VERIFY_ADMIN_RUN_SEEDS = process.env.VERIFY_ADMIN_RUN_SEEDS === "1";

const expectEntitledRaw = process.env.VERIFY_EXPECT_ENTITLED?.trim().toLowerCase();
const VERIFY_EXPECT_ENTITLED: boolean | null =
  expectEntitledRaw === "true" ? true : expectEntitledRaw === "false" ? false : null;

function abortSignal() {
  return AbortSignal.timeout(TIMEOUT_MS);
}

type HeaderMap = Record<string, string>;

function mergeHeaders(...parts: (HeaderMap | undefined)[]): HeaderMap {
  return Object.assign({}, ...parts.filter(Boolean) as HeaderMap[]);
}

function learnerHeaders(): HeaderMap {
  if (!VERIFY_BEARER) return {};
  return { Authorization: `Bearer ${VERIFY_BEARER}` };
}

function adminHeaders(): HeaderMap {
  if (!VERIFY_ADMIN_BEARER) return {};
  return { Authorization: `Bearer ${VERIFY_ADMIN_BEARER}` };
}

async function req(method: string, path: string, init?: RequestInit): Promise<Response> {
  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
  return fetch(url, { method, ...init, signal: abortSignal() });
}

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { __parseError: true, raw: text.slice(0, 200) };
  }
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

async function main() {
  const failures: string[] = [];
  const warns: string[] = [];

  const must = (name: string, ok: boolean, detail?: string) => {
    if (!ok) failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
  };

  const should = (name: string, ok: boolean, detail?: string) => {
    if (!ok) {
      if (STRICT) failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
      else warns.push(`${name}${detail ? ` — ${detail}` : ""}`);
    }
  };

  const expectStatuses = (name: string, res: Response, allowed: number[], detail?: string) => {
    const ok = allowed.includes(res.status);
    if (STRICT) must(name, ok, detail || `got ${res.status}`);
    else should(name, ok, detail || `got ${res.status}`);
    return ok;
  };

  console.log(`[verify-core-api] Base URL: ${BASE}`);
  console.log(
    `[verify-core-api] Modes: STRICT=${STRICT}, learner=${Boolean(VERIFY_BEARER)}, admin=${Boolean(VERIFY_ADMIN_BEARER)}`,
  );

  let r = await req("GET", "/healthz");
  must("GET /healthz → 200", r.status === 200, `got ${r.status}`);

  r = await req("GET", "/api/test");
  must("GET /api/test → 200", r.status === 200, `got ${r.status}`);

  r = await req("GET", "/api/lessons/meta");
  must("GET /api/lessons/meta → 200", r.status === 200, `got ${r.status}`);
  if (r.ok) {
    const j: unknown = await r.json();
    must("GET /api/lessons/meta JSON array", Array.isArray(j), `type ${typeof j}`);
  }

  r = await req("GET", "/api/encyclopedia?limit=1");
  should("GET /api/encyclopedia?limit=1", r.status === 200, `got ${r.status}`);

  r = await req("GET", "/api/flashcard-preview/config");
  should("GET /api/flashcard-preview/config", r.status === 200, `got ${r.status}`);
  if (r.ok) {
    const j = await readJson(r);
    if (STRICT && !isRecord(j)) must("flashcard-preview/config JSON object", false, String(typeof j));
  }

  if (VERIFY_LESSON_SLUG) {
    r = await req("GET", `/api/lessons/content/${encodeURIComponent(VERIFY_LESSON_SLUG)}`);
    should(`GET /api/lessons/content (${VERIFY_LESSON_SLUG})`, [200, 403, 404].includes(r.status), `got ${r.status}`);
  } else {
    console.log("[verify-core-api] Set VERIFY_LESSON_SLUG to test lesson content by slug.");
  }

  r = await req("GET", "/api/lessons/search?q=ab");
  expectStatuses("GET /api/lessons/search?q=ab", r, [200], `got ${r.status}`);
  if (r.ok) {
    const j = await readJson(r);
    must("GET /api/lessons/search returns array", Array.isArray(j), typeof j);
  }

  r = await req("GET", "/api/lessons/content/__nursenest_verify_missing_slug__");
  expectStatuses("GET bad lesson slug → 4xx", r, [403, 404], `got ${r.status} (want 403/404, not 5xx)`);
  if (r.status >= 500) must("bad lesson slug not 5xx", false, `got ${r.status}`);

  r = await req("GET", "/sitemap-index.xml");
  should("GET /sitemap-index.xml", r.status === 200, `got ${r.status}`);
  if (r.ok) {
    const ct = r.headers.get("content-type") || "";
    should("sitemap content-type xml", ct.includes("xml"), ct);
  }

  // ----- Authenticated learner flows -----
  if (VERIFY_BEARER) {
    const L = learnerHeaders();

    const previewStatusUrl = VERIFY_USER_ID
      ? `/api/flashcard-preview/status?userId=${encodeURIComponent(VERIFY_USER_ID)}`
      : "/api/flashcard-preview/status";
    r = await req("GET", previewStatusUrl, { headers: mergeHeaders(L) });
    expectStatuses("GET /api/flashcard-preview/status (auth)", r, [200, 401, 404], `got ${r.status}`);
    if (r.status === 200) {
      const j = await readJson(r);
      if (STRICT && isRecord(j)) {
        must("preview status has isPremium", typeof j.isPremium === "boolean", JSON.stringify(Object.keys(j)));
      }
    }

    r = await req("GET", "/api/flashcard-bank?limit=2", { headers: mergeHeaders(L) });
    if (VERIFY_EXPECT_ENTITLED === true) {
      must("GET /api/flashcard-bank entitled → 200", r.status === 200, `got ${r.status}`);
    } else if (VERIFY_EXPECT_ENTITLED === false) {
      must("GET /api/flashcard-bank not entitled → 403", r.status === 403, `got ${r.status}`);
    } else {
      expectStatuses("GET /api/flashcard-bank", r, [200, 401, 403], `got ${r.status}`);
    }
    if (r.status === 200) {
      const j = await readJson(r);
      if (STRICT && isRecord(j)) {
        must("flashcard-bank.items array", Array.isArray(j.items), typeof j.items);
        must("flashcard-bank.total number", typeof j.total === "number", typeof j.total);
      }
    } else if (r.status === 403) {
      const j = await readJson(r);
      if (STRICT) must("flashcard-bank 403 JSON", isRecord(j) && typeof j.error === "string", String(j));
    }

    if (VERIFY_FLASHCARD_DECK_ID) {
      const q = VERIFY_USER_ID ? `?userId=${encodeURIComponent(VERIFY_USER_ID)}` : "";
      r = await req("GET", `/api/decks/${encodeURIComponent(VERIFY_FLASHCARD_DECK_ID)}${q}`, {
        headers: mergeHeaders(L),
      });
      expectStatuses(`GET /api/decks/:id (${VERIFY_FLASHCARD_DECK_ID})`, r, [200, 403, 404], `got ${r.status}`);
      if (r.status === 200) {
        const j = await readJson(r);
        if (STRICT && isRecord(j)) must("deck has id", typeof j.id === "string", Object.keys(j).join(","));
      }

      r = await req("GET", `/api/decks/${encodeURIComponent(VERIFY_FLASHCARD_DECK_ID)}/cards${q}`, {
        headers: mergeHeaders(L),
      });
      expectStatuses(`GET /api/decks/:id/cards`, r, [200, 403, 404], `got ${r.status}`);
      if (r.status === 200) {
        const j = await readJson(r);
        must("deck cards array or object", Array.isArray(j) || isRecord(j), typeof j);
      }
    } else {
      console.log("[verify-core-api] Set VERIFY_FLASHCARD_DECK_ID to test deck + cards.");
    }

    if (VERIFY_USER_ID) {
      r = await req("GET", `/api/progress/${encodeURIComponent(VERIFY_USER_ID)}`, { headers: mergeHeaders(L) });
      expectStatuses("GET /api/progress/:userId", r, [200], `got ${r.status}`);
      if (r.status === 200) {
        const j = await readJson(r);
        must("progress list/array", Array.isArray(j), typeof j);
      }

      r = await req("GET", `/api/flashcard-usage/${encodeURIComponent(VERIFY_USER_ID)}`, { headers: mergeHeaders(L) });
      expectStatuses("GET /api/flashcard-usage/:userId", r, [200, 401, 403], `got ${r.status}`);
      if (r.status === 200) {
        const j = await readJson(r);
        if (STRICT && isRecord(j)) {
          must("usage.limit number", typeof j.limit === "number", typeof j.limit);
        }
      }
    } else {
      console.log("[verify-core-api] Set VERIFY_USER_ID for progress + flashcard-usage checks.");
    }

    r = await req("GET", "/api/v1/dashboard/summary", { headers: mergeHeaders(L) });
    // 200 = full summary; 500 = structured degradation (DASHBOARD_SUMMARY_ERROR) from server resilience layer
    expectStatuses("GET /api/v1/dashboard/summary", r, [200, 500], `got ${r.status}`);
    if (r.status === 200) {
      const j = await readJson(r);
      if (STRICT && isRecord(j)) {
        must("dashboard has user", isRecord(j.user), "user");
        must("dashboard has progress", isRecord(j.progress), "progress");
      }
    } else if (r.status === 500) {
      const j = await readJson(r);
      if (STRICT) {
        must(
          "dashboard 500 includes DASHBOARD_SUMMARY_ERROR",
          isRecord(j) && j.code === "DASHBOARD_SUMMARY_ERROR",
          String(j),
        );
      }
    }

    if (VERIFY_EXAM_TEMPLATE_ID) {
      r = await req("POST", "/api/exam/start", {
        method: "POST",
        headers: mergeHeaders(L, { "Content-Type": "application/json" }),
        body: JSON.stringify({ templateId: VERIFY_EXAM_TEMPLATE_ID, pageSize: 15 }),
      });
      const examStartBody = await readJson(r);
      const examPoolEmptyCoherent =
        r.status === 422 &&
        isRecord(examStartBody) &&
        examStartBody.code === "QUESTION_POOL_EMPTY";
      const examStartOk =
        [200, 404, 503].includes(r.status) || examPoolEmptyCoherent;
      if (STRICT) {
        must("POST /api/exam/start", examStartOk, `got ${r.status}`);
      } else {
        should("POST /api/exam/start", examStartOk, `got ${r.status}`);
      }
      if (examPoolEmptyCoherent) {
        console.log(
          "[verify-core-api] POST /api/exam/start → 422 QUESTION_POOL_EMPTY (coherent empty pool); skipping exam E2E.",
        );
      } else if (r.status === 200) {
        const j = examStartBody;
        if (!isRecord(j) || typeof j.attemptId !== "string") {
          must("exam start payload", false, JSON.stringify(j).slice(0, 200));
        } else {
          const attemptId = j.attemptId;
          const totalQ = typeof j.totalQuestions === "number" ? j.totalQuestions : 0;

          r = await req(
            "GET",
            `/api/exam/${encodeURIComponent(attemptId)}/questions?page=1`,
            { headers: mergeHeaders(L) },
          );
          expectStatuses("GET /api/exam/:attemptId/questions", r, [200], `got ${r.status}`);
          if (r.status === 200) {
            const qj = await readJson(r);
            if (STRICT && isRecord(qj)) {
              must("questions.page number", typeof qj.page === "number", typeof qj.page);
              must("questions.questions array", Array.isArray(qj.questions), typeof qj.questions);
            }
            const first =
              isRecord(qj) && Array.isArray(qj.questions) && qj.questions.length > 0
                ? (qj.questions[0] as unknown)
                : null;
            const qid = isRecord(first) && typeof first.id === "string" ? first.id : null;

            if (qid && totalQ > 0) {
              r = await req("POST", `/api/exam/${encodeURIComponent(attemptId)}/answer`, {
                method: "POST",
                headers: mergeHeaders(L, { "Content-Type": "application/json" }),
                body: JSON.stringify({ questionId: qid, selectedIndex: 0 }),
              });
              expectStatuses("POST /api/exam/:attemptId/answer", r, [200], `got ${r.status}`);
            } else {
              should("exam first question present", Boolean(qid), "no question id to submit");
            }
          }

          r = await req("POST", `/api/exam/${encodeURIComponent(attemptId)}/submit`, {
            method: "POST",
            headers: mergeHeaders(L, { "Content-Type": "application/json" }),
            body: "{}",
          });
          expectStatuses("POST /api/exam/:attemptId/submit", r, [200, 422], `got ${r.status}`);
          if (r.status === 200) {
            const sj = await readJson(r);
            if (STRICT && isRecord(sj)) must("submit has score", typeof sj.score === "number", Object.keys(sj).join(","));
          }
        }
      }
    } else {
      console.log("[verify-core-api] Set VERIFY_EXAM_TEMPLATE_ID for exam E2E.");
    }
  } else {
    console.log("[verify-core-api] Set VERIFY_BEARER (+ optional VERIFY_USER_ID, slugs, template) for authenticated checks.");
  }

  // ----- Admin -----
  if (VERIFY_ADMIN_BEARER) {
    const A = adminHeaders();

    // Lazy admin routes: ensureAdminRoutes() registers handlers during the first /api/admin
    // request; Express continues the current request down-stack, so the new handlers are not
    // hit until a follow-up request.
    await req("GET", "/api/admin/content-health", { headers: mergeHeaders(A) });

    r = await req("GET", "/api/admin/content-health", { headers: mergeHeaders(A) });
    expectStatuses("GET /api/admin/content-health", r, [200, 401, 403], `got ${r.status}`);
    if (r.status === 200) {
      const j = await readJson(r);
      if (STRICT && isRecord(j)) must("content-health.summary", isRecord(j.summary), "summary");
    }

    r = await req("GET", "/api/admin/ai-ops/status", { headers: mergeHeaders(A) });
    expectStatuses("GET /api/admin/ai-ops/status", r, [200, 401, 403], `got ${r.status}`);

    if (VERIFY_ADMIN_RUN_SEEDS) {
      r = await req("POST", "/api/admin/run-seeds", {
        headers: mergeHeaders(A),
        method: "POST",
        body: "{}",
      });
      expectStatuses("POST /api/admin/run-seeds", r, [200, 207, 401, 403], `got ${r.status}`);
      if (r.status === 200 || r.status === 207) {
        const j = await readJson(r);
        if (STRICT && isRecord(j)) {
          must("run-seeds results object", isRecord(j.results), typeof j.results);
        }
      }
    } else {
      console.log("[verify-core-api] Skipping POST /api/admin/run-seeds (set VERIFY_ADMIN_RUN_SEEDS=1 to run).");
    }
  } else {
    r = await req("POST", "/api/admin/run-seeds", { method: "POST", body: "{}" });
    must("POST /api/admin/run-seeds without admin → 401/403", r.status === 401 || r.status === 403, `got ${r.status}`);
    console.log("[verify-core-api] Set VERIFY_ADMIN_BEARER for admin checks; VERIFY_ADMIN_RUN_SEEDS=1 to run seeds.");
  }

  for (const w of warns) console.warn("[verify-core-api] WARN:", w);
  if (failures.length) {
    console.error("[verify-core-api] FAILED:\n", failures.join("\n"));
    process.exit(1);
  }
  console.log("[verify-core-api] OK");
  process.exit(0);
}

main().catch((e) => {
  console.error("[verify-core-api] Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
