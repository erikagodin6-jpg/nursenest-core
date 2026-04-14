/**
 * Fast HTTP smoke: homepage cookie → hub → lessons → lesson detail → CTAs (no browser).
 * Run: BASE_URL=http://127.0.0.1:3000 npx tsx scripts/qa-lesson-flows.mts
 * Browser regression: npm run qa:lesson-flows:browser
 */
import {
  assertUrlAllowedForPathway,
  isAllowedRelatedMarketingPath,
  LESSON_FLOW_PATHWAY_QA,
} from "../src/lib/qa/lesson-flow-pathways";
import { MARKETING_REGION_COOKIE } from "../src/lib/region/marketing-region-cookie";

const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

type IssueKind =
  | "ok"
  | "broken"
  | "wrong_destination"
  | "missing_cta"
  | "unexpected_region"
  | "retry_recovered";

function extractPrimaryLessonHref(html: string, lessonsPrefix: string): string | null {
  const base = lessonsPrefix.replace(/\/$/, "");
  const patterns = [
    /<a[^>]*href="([^"]+)"[^>]*data-nn-qa-primary-lesson="true"/,
    /<a[^>]*data-nn-qa-primary-lesson="true"[^>]*href="([^"]+)"/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      const path = m[1].split("?")[0];
      const depth = path.split("/").filter(Boolean).length;
      const baseDepth = base.split("/").filter(Boolean).length;
      if (path.startsWith(`${base}/`) && depth >= baseDepth + 1 && !path.endsWith("/lessons")) {
        return path;
      }
    }
  }
  return extractFirstLessonDetailHref(html, lessonsPrefix);
}

function extractFirstLessonDetailHref(html: string, lessonsPrefix: string): string | null {
  const base = lessonsPrefix.replace(/\/$/, "");
  const esc = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`href="(${esc}/[^"#?]+)"`, "g");
  const baseDepth = base.split("/").filter(Boolean).length;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const path = m[1];
    if (path === base || path.endsWith("/lessons")) continue;
    if (path.includes("/lessons/topics/")) continue;
    if (path.includes("/lessons?")) continue;
    const depth = path.split("/").filter(Boolean).length;
    if (path.startsWith(`${base}/`) && depth === baseDepth + 1) return path;
  }
  return null;
}

async function fetchPathOk(path: string): Promise<boolean> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchStatus(
  path: string,
  init?: RequestInit,
  maxBytes: number | null = 6_000_000,
): Promise<{ status: number; finalUrl: string; html: string }> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { redirect: "manual", ...init });
  } catch {
    return { status: 0, finalUrl: url, html: "" };
  }
  let status = res.status;
  let finalUrl = url;
  let html = "";
  const clip = (raw: ArrayBuffer) => {
    const s = new TextDecoder().decode(raw);
    return maxBytes != null && s.length > maxBytes ? s.slice(0, maxBytes) : s;
  };
  if (status >= 300 && status < 400) {
    const loc = res.headers.get("location");
    if (loc) {
      const next = new URL(loc, url).toString();
      const r2 = await fetch(next, { redirect: "follow" });
      status = r2.status;
      finalUrl = r2.url;
      try {
        const b = await r2.arrayBuffer();
        html = clip(b);
      } catch {
        html = "";
        status = 599;
      }
      return { status, finalUrl, html };
    }
  }
  try {
    const buf = await res.arrayBuffer();
    html = clip(buf);
  } catch {
    html = "";
    status = 599;
  }
  if (res.redirected) finalUrl = res.url;
  return { status, finalUrl, html };
}

async function fetchStatusRetry(
  path: string,
  init?: RequestInit,
  maxBytes?: number | null,
): Promise<{ status: number; finalUrl: string; html: string; recovered: boolean }> {
  let last: { status: number; finalUrl: string; html: string } = { status: 0, finalUrl: "", html: "" };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      last = await fetchStatus(path, init, maxBytes);
      if (last.status !== 599 && last.html.length > 0) {
        return { ...last, recovered: attempt > 0 };
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return { ...last, recovered: false };
}

function lessonShellNotes(html: string, lessonsPath: string): string[] {
  const notes: string[] = [];
  if (!html.includes("lesson-study-loop-heading") && !html.includes("After this lesson")) {
    notes.push("missing study loop section");
  }
  if (!html.includes("/questions") && !html.includes("Question hub")) {
    notes.push("missing practice / questions hub cues");
  }
  const catHint = html.includes("/cat") || html.includes("CAT") || html.includes("practice-tests");
  if (!catHint) notes.push("missing CAT / practice exam cues");

  const lp = lessonsPath.replace(/\/$/, "");
  const crumbRe = new RegExp(`href="${lp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
  if (!crumbRe.test(html)) notes.push("breadcrumb may not link to lessons hub");
  return notes;
}

async function main() {
  const rows: string[] = [];
  const failures: string[] = [];
  const counts: Record<IssueKind, number> = {
    ok: 0,
    broken: 0,
    wrong_destination: 0,
    missing_cta: 0,
    unexpected_region: 0,
    retry_recovered: 0,
  };

  for (const [cookieVal, expectSubstr] of [
    ["US", "/us/rn/nclex-rn"],
    ["CA", "/canada/rn/nclex-rn"],
  ] as const) {
    const home = await fetchStatusRetry("/", { headers: { Cookie: `${MARKETING_REGION_COOKIE}=${cookieVal}` } }, 8_000_000);
    if (home.recovered) counts.retry_recovered++;
    const regionOk =
      home.status === 200 && home.html.includes(`data-nn-marketing-region="${cookieVal}"`) && home.html.includes(expectSubstr);
    const kind: IssueKind = home.status === 200 && regionOk ? "ok" : "unexpected_region";
    counts[kind]++;
    rows.push(
      `homepage+${cookieVal} | ${kind} | RN card + region marker ${regionOk ? "ok" : "fail"} | status=${home.status}`,
    );
    if (kind !== "ok") {
      failures.push(`homepage cookie=${cookieVal}: status=${home.status} expected ${expectSubstr} + data-nn-marketing-region`);
    }
  }

  for (const cfg of LESSON_FLOW_PATHWAY_QA) {
    const label = cfg.pathwayId;
    const hubPath = cfg.hubPath;
    const lessonsPath = cfg.lessonsPath;

    const hubRes = await fetchStatusRetry(hubPath, undefined, 4_000_000);
    if (hubRes.recovered) counts.retry_recovered++;
    const hubOk = hubRes.status === 200;

    const lessonsRes = await fetchStatusRetry(lessonsPath, undefined, 10_000_000);
    if (lessonsRes.recovered) counts.retry_recovered++;
    const lessonsOk = lessonsRes.status === 200;
    const lessonHref = lessonsOk ? extractPrimaryLessonHref(lessonsRes.html, lessonsPath) : null;

    let detailKind: IssueKind = "broken";
    let detailNotes = "";

    if (!lessonHref) {
      detailNotes = lessonsOk ? "no primary / lesson detail link on hub" : `lessons hub HTTP ${lessonsRes.status}`;
    } else {
      const d = await fetchStatusRetry(lessonHref, undefined, 10_000_000);
      if (d.recovered) counts.retry_recovered++;
      if (d.status !== 200) {
        detailNotes = `lesson ${lessonHref} → ${d.status}`;
      } else {
        const navLesson = assertUrlAllowedForPathway(d.finalUrl, cfg);
        if (!navLesson.ok) {
          detailKind = "wrong_destination";
          detailNotes = navLesson.reason ?? "lesson URL not allowed";
        } else {
          const shellNotes = lessonShellNotes(d.html, lessonsPath);
          const hubEsc = hubPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

          const qMatch = d.html.match(new RegExp(`href="(${hubEsc}/questions[^"]*)"`));
          const qHref = qMatch?.[1];
          let qOk = false;
          if (qHref) {
            const qNav = assertUrlAllowedForPathway(new URL(qHref, BASE).href, cfg);
            if (!qNav.ok) {
              detailKind = "wrong_destination";
              detailNotes = `question hub: ${qNav.reason ?? "nav"}`;
            } else {
              qOk = await fetchPathOk(qHref);
              if (!qOk) shellNotes.push("question hub HEAD not ok");
            }
          } else {
            shellNotes.push("no question hub href in lesson HTML");
          }

          const lpEsc = lessonsPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const relatedRe = new RegExp(`href="(${lpEsc}/[^"]+)"`, "g");
          let rel: RegExpExecArray | null;
          let relatedOk = false;
          while (detailKind !== "wrong_destination" && (rel = relatedRe.exec(d.html)) !== null) {
            const rp = rel[1].split("?")[0];
            if (rp === lessonHref.split("?")[0]) continue;
            if (rp === lessonsPath || rp === `${lessonsPath}/`) continue;
            const pathname = new URL(rp, BASE).pathname;
            if (!isAllowedRelatedMarketingPath(pathname, cfg)) continue;
            const rNav = assertUrlAllowedForPathway(new URL(rp, BASE).href, cfg);
            if (!rNav.ok) {
              detailKind = "wrong_destination";
              detailNotes = `related: ${rNav.reason ?? ""}`;
              break;
            }
            relatedOk = await fetchPathOk(rp);
            if (relatedOk) break;
          }
          if (detailKind !== "wrong_destination" && !relatedOk) {
            const topicRe = new RegExp(`href="(${lpEsc}/topics/[^"]+)"`, "i");
            const tm = d.html.match(topicRe);
            if (tm?.[1]) {
              const pathname = new URL(tm[1], BASE).pathname;
              if (isAllowedRelatedMarketingPath(pathname, cfg)) {
                const tNav = assertUrlAllowedForPathway(new URL(tm[1], BASE).href, cfg);
                if (!tNav.ok) {
                  detailKind = "wrong_destination";
                  detailNotes = `topic link: ${tNav.reason ?? ""}`;
                } else {
                  relatedOk = await fetchPathOk(tm[1]);
                }
              }
            }
          }
          /* relatedOk is optional (NP may surface topic clusters only); do not fail smoke on related alone */

          let catOk = false;
          if (detailKind !== "wrong_destination") {
            const catMatch = d.html.match(new RegExp(`href="(${hubEsc}/(cat|practice)[^"]*)"`));
            if (catMatch?.[1]) {
              const cNav = assertUrlAllowedForPathway(new URL(catMatch[1], BASE).href, cfg);
              if (!cNav.ok) {
                detailKind = "wrong_destination";
                detailNotes = `CAT: ${cNav.reason ?? ""}`;
              } else {
                catOk = await fetchPathOk(catMatch[1]);
                if (!catOk) shellNotes.push("CAT/practice HEAD not ok");
              }
            } else if (/href="[^"]*\/app\/practice-tests[^"]*"/.test(d.html)) {
              catOk = true;
            } else {
              shellNotes.push("no CAT / practice exam href pattern");
            }
          }

          if (detailKind !== "wrong_destination") {
            const shellSerious = shellNotes.some(
              (n) =>
                n.includes("breadcrumb") ||
                n.includes("study loop") ||
                n.includes("questions hub") ||
                n.includes("question hub") ||
                n.includes("CAT") ||
                n.includes("practice exam"),
            );
            const softProblem = shellSerious || !qOk || !catOk;
            detailKind = softProblem ? "missing_cta" : "ok";
            detailNotes = [
              shellNotes.join("; ") || "ok",
              `qHub=${qOk}`,
              `related=${relatedOk}`,
              `cat=${catOk}`,
            ].join(" | ");
          }
        }
      }
    }

    if (!hubOk || !lessonsOk) {
      detailKind = "broken";
    }

    counts[detailKind]++;

    rows.push(
      [label, hubOk ? "ok" : `broken (${hubRes.status})`, lessonsOk ? "ok" : `broken (${lessonsRes.status})`, detailKind, detailNotes].join(
        " | ",
      ),
    );

    if (!hubOk || !lessonsOk || detailKind === "broken" || detailKind === "unexpected_region") {
      failures.push(
        `${label}: ${[!hubOk ? `hub ${hubRes.status}` : "", !lessonsOk ? `lessons ${lessonsRes.status}` : "", detailKind, detailNotes].filter(Boolean).join(" · ")}`,
      );
    } else if (detailKind === "wrong_destination" || detailKind === "missing_cta") {
      failures.push(`(warn) ${label}: ${detailKind} · ${detailNotes}`);
    }
  }

  console.log("=== QA lesson flows (HTTP) — pathway | hub | lessons | detail | notes ===\n");
  for (const r of rows) console.log(r);
  console.log("\n=== Summary ===\n");
  for (const k of Object.keys(counts) as IssueKind[]) {
    if (counts[k] > 0) console.log(`${k}: ${counts[k]}`);
  }
  console.log("\n=== Failures / warnings ===\n", failures.length ? failures.join("\n") : "(none)");

  const hardFails = failures.filter((f) => !f.startsWith("(warn)"));
  if (hardFails.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
