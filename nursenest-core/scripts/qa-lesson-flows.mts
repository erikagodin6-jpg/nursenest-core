/**
 * Runtime QA: pathway lesson hubs → detail → CTAs (no browser; HTTP + HTML heuristics).
 * Run with dev server: BASE_URL=http://127.0.0.1:3000 npx tsx scripts/qa-lesson-flows.mts
 */
import { buildExamPathwayPath, getExamPathwayById } from "../src/lib/exam-pathways/exam-product-registry";
import { marketingExamHubPath } from "../src/lib/marketing/country-exam-offerings";
import type { MarketingRegionToggle } from "../src/lib/marketing/marketing-entry-routes";
import { MARKETING_REGION_COOKIE } from "../src/lib/region/marketing-region-cookie";

const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const PATHWAY_IDS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-np-fnp",
  "ca-np-cnple",
] as const;

type FlowStatus = "working" | "redirect_ok" | "broken" | "wrong_destination";

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

/** Lightweight reachability check (avoids multi‑MB RSC bodies). */
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
): Promise<{ status: number; finalUrl: string; html: string }> {
  let last: { status: number; finalUrl: string; html: string } = { status: 0, finalUrl: "", html: "" };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      last = await fetchStatus(path, init, maxBytes);
      if (last.status !== 599 && last.html.length > 0) return last;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return last;
}

function checkLessonPage(html: string, lessonsPath: string, hubPath: string): { ok: boolean; notes: string[] } {
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
  return { ok: notes.length === 0, notes };
}

async function main() {
  const rows: string[] = [];
  const failures: string[] = [];

  // Homepage exam cards respect marketing region cookie (NursenestRegionRoot + cookie).
  for (const [cookieVal, expectSubstr] of [
    ["US", "/us/rn/nclex-rn"],
    ["CA", "/canada/rn/nclex-rn"],
  ] as const) {
    const home = await fetchStatusRetry(
      "/",
      {
        headers: { Cookie: `${MARKETING_REGION_COOKIE}=${cookieVal}` },
      },
      8_000_000,
    );
    const ok = home.status === 200 && home.html.includes(expectSubstr);
    rows.push(`homepage+${cookieVal} | exam card RN hub | ${ok ? "working" : "broken"} | expect ${expectSubstr}`);
    if (!ok) failures.push(`homepage cookie=${cookieVal}: status=${home.status} missing ${expectSubstr}`);
  }

  for (const id of PATHWAY_IDS) {
    const p = getExamPathwayById(id);
    if (!p) {
      failures.push(`${id}: pathway missing in registry`);
      continue;
    }
    const hubPath = buildExamPathwayPath(p);
    const lessonsPath = buildExamPathwayPath(p, "lessons");
    const label = id;

    // hub → lessons
    const hubRes = await fetchStatusRetry(hubPath, undefined, 4_000_000);
    const hubOk = hubRes.status === 200;
    const lessonsRes = await fetchStatusRetry(lessonsPath, undefined, 10_000_000);
    const lessonsOk = lessonsRes.status === 200;
    const lessonHref = lessonsOk ? extractFirstLessonDetailHref(lessonsRes.html, lessonsPath) : null;

    let detailStatus: FlowStatus = "broken";
    let detailNotes = "";
    if (!lessonHref) {
      detailStatus = lessonsOk ? "broken" : "broken";
      detailNotes = lessonsOk ? "no lesson detail link found on hub" : `lessons hub HTTP ${lessonsRes.status}`;
    } else {
      const d = await fetchStatusRetry(lessonHref, undefined, 10_000_000);
      if (d.status !== 200) {
        detailStatus = "broken";
        detailNotes = `lesson ${lessonHref} → ${d.status}`;
      } else {
        const chk = checkLessonPage(d.html, lessonsPath, hubPath);
        const notes = [...chk.notes];
        const hubEsc = hubPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const qMatch = d.html.match(new RegExp(`href="(${hubEsc}/questions[^"]*)"`));
        const qHref = qMatch?.[1];
        let qOk = false;
        if (qHref) {
          qOk = await fetchPathOk(qHref);
          if (!qOk) notes.push("question hub HEAD not ok");
        } else notes.push("no question hub href in lesson HTML");

        const lpEsc = lessonsPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const relatedRe = new RegExp(`href="(${lpEsc}/[^"]+)"`, "g");
        let rel: RegExpExecArray | null;
        let relatedOk = false;
        while ((rel = relatedRe.exec(d.html)) !== null) {
          const rp = rel[1];
          if (rp.split("?")[0] === lessonHref) continue;
          if (rp === lessonsPath || rp === `${lessonsPath}/`) continue;
          relatedOk = await fetchPathOk(rp);
          break;
        }
        if (!relatedOk) notes.push("related lesson or topic cluster link not verified");

        let catOk = false;
        const catMatch = d.html.match(new RegExp(`href="(${hubEsc}/(cat|practice)[^"]*)"`));
        if (catMatch?.[1]) {
          catOk = await fetchPathOk(catMatch[1]);
          if (!catOk) notes.push("CAT/practice HEAD not ok");
        } else if (/href="[^"]*\/app\/practice-tests[^"]*"/.test(d.html)) {
          catOk = true;
        } else notes.push("no CAT / practice exam href pattern");

        const shellOk = chk.ok;
        const deepOk = qOk && relatedOk && catOk;
        detailStatus = shellOk && deepOk ? "working" : !shellOk || !qOk ? "broken" : "wrong_destination";
        detailNotes = [notes.join("; ") || "ok", `qHub=${qOk}`, `related=${relatedOk}`, `cat=${catOk}`].join(" | ");
      }
    }

    const homeCardRegion: MarketingRegionToggle = p.countrySlug === "us" ? "US" : "CA";
    const cardId = p.roleTrack === "rpn" || p.roleTrack === "lpn" ? "pn" : p.roleTrack === "np" ? "np" : "rn";
    const expectedFromCard = marketingExamHubPath(homeCardRegion, cardId as "rn" | "pn" | "np");
    const homeMatches = expectedFromCard === hubPath;

    rows.push(
      [
        label,
        hubOk ? "working" : `broken (${hubRes.status})`,
        lessonsOk ? "working" : `broken (${lessonsRes.status})`,
        lessonHref ? detailStatus : "broken",
        homeMatches ? "card href matches hub" : `check: card=${expectedFromCard} hub=${hubPath}`,
        detailNotes,
      ].join(" | "),
    );

    if (!hubOk || !lessonsOk || detailStatus === "broken") {
      failures.push(
        `${label}: ${[!hubOk ? `hub ${hubRes.status}` : "", !lessonsOk ? `lessons ${lessonsRes.status}` : "", detailStatus, detailNotes].filter(Boolean).join(" · ")}`,
      );
    } else if (detailStatus === "wrong_destination") {
      failures.push(`(warn) ${label}: ${detailNotes}`);
    }
  }

  console.log("=== QA summary (pathway | hub | lessons | detail+CTAs | home card | notes) ===\n");
  for (const r of rows) console.log(r);
  console.log("\n=== Failures ===\n", failures.length ? failures.join("\n") : "(none)");

  const hardFails = failures.filter((f) => !f.startsWith("(warn)"));
  if (hardFails.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
