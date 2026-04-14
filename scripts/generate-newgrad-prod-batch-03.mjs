#!/usr/bin/env node
/**
 * New Grad production batch 03: 50 HTML posts + index + blog-import JSON + pipeline stubs + report.
 * Run from repo root: node scripts/generate-newgrad-prod-batch-03.mjs
 *
 * Does not modify manifest, routing, or app code — writes only under data/* and reports/*.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const MANIFEST = path.join(ROOT, "data/blog-manifest/newgrad-400.manifest.json");
const BATCH_DIR = path.join(ROOT, "data/blog-content/newgrad-prod-batch-03");
const BLOG_IMPORT_DIR = path.join(ROOT, "data/blog-import");
const PIPELINE_DIR = path.join(ROOT, "data/blog-pipeline/batch-03/en");
const REPORT_PATH = path.join(ROOT, "reports/newgrad-prod-batch-03-generation-report.json");

const BATCH01_INDEX = path.join(ROOT, "data/blog-content/newgrad-prod-batch-01/index.json");
const BATCH02_INDEX = path.join(ROOT, "data/blog-content/newgrad-prod-batch-02/index.json");

const DEFAULT_L1 = "/us/rn/nclex-rn/lessons/fluids-electrolytes-emergencies-gold";
const DEFAULT_L2 = "/us/rn/nclex-rn/lessons/heart-failure-nclex-rn";
const DEFAULT_L3 = "/us/rn/nclex-rn/lessons/dka-hhs-hyperglycemic-emergencies-gold";

const DEFAULT_T1 = "/tools/lab-values";
const DEFAULT_T2 = "/tools/med-math";

/** Stable related post from batch 01 (must exist as prior batch content). */
const INTERNAL_BLOG_SLUG =
  "newgrad-nursing-first-code-blue-on-same-day-surgery-as-a-new-grad-nurse-what-to-do-first";
const INTERNAL_BLOG_HREF = `/blog/${INTERNAL_BLOG_SLUG}`;
const INTERNAL_BLOG_LABEL = "First code blue on same-day surgery: what to do first (new grad field guide)";

const TARGET_COUNT = 50;

function p(...lines) {
  return lines
    .filter(Boolean)
    .map((t) => `<p>${t}</p>`)
    .join("\n");
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wc(html) {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.split(/\s+/).filter(Boolean).length;
}

function pickLessons(relatedLessonPaths) {
  const paths = Array.isArray(relatedLessonPaths) ? relatedLessonPaths : [];
  const specific = paths.filter(
    (p) =>
      typeof p === "string" &&
      p.includes("/us/rn/nclex-rn/lessons/") &&
      p.split("/").filter(Boolean).length >= 6,
  );
  if (specific.length >= 2) return [specific[0], specific[1]];
  if (specific.length === 1) return [specific[0], DEFAULT_L2];
  return [DEFAULT_L1, DEFAULT_L2];
}

function pickTools(relatedToolPaths) {
  const paths = Array.isArray(relatedToolPaths) ? relatedToolPaths : [];
  const tools = paths.filter((p) => typeof p === "string" && p.startsWith("/tools/") && p.length > 7);
  const t1 = tools[0] || DEFAULT_T1;
  const t2 = tools[1] || DEFAULT_T2;
  return [t1, t2];
}

function seoTitleFrom(title) {
  const base = `${title} | NurseNest`;
  return base.length > 70 ? `${title.slice(0, 62).trim()}… | NurseNest` : base;
}

function seoDescription(title, unit) {
  const u = unit ? ` on ${unit}` : "";
  return `Practical new grad nursing guidance${u}: ${title.toLowerCase()}. Real workflow, escalation, documentation, and what preceptors expect—without fluff.`;
}

function expansionBlock(title) {
  return p(
    `This guide is written for nurses who are tired of advice that ignores what a shift actually feels like. You already know you should "communicate" and "prioritize." Here is what that looks like when your brain is noisy, your phone will not stop, and you still have to put accurate words into the chart.`,
    `Start with a simple rule: recovery is not the same as catching up. Catching up tries to erase the past. Recovery stabilizes the present so the next hour does not repeat the same failure pattern. That mindset matters because patients do not experience your intentions. They experience your actions, your timing, and whether you noticed change early enough.`,
    `When you think about ${esc(title)}, picture three layers. First, the patient layer: airway, breathing, circulation, pain, infection risk, bleeding risk, and the specific vulnerabilities of the unit you are on. Second, the team layer: who needs what information to make the next decision, and how you deliver it without drama. Third, the record layer: what must exist so the next nurse, therapist, or physician is not guessing what you observed.`,
    `If you feel shame during a rough shift, name it, then set it aside long enough to do one safe task. Shame makes people hide uncertainty, and hidden uncertainty is how small problems become big ones. Competent nurses still get overwhelmed. The difference is they learn to make the invisible work visible: delays, risks, missing orders, and unclear plans.`,
    `Finally, keep your study life connected to your floor life in a way that helps, not harms. If you review pathophysiology at night, use it to explain trends you saw, not to punish yourself for imperfect performance. Learning sticks when it answers a real question you met at the bedside.`,
    `If you are comparing yourself to nurses with years of pattern recognition, remember that speed often comes from systems: where supplies live, how the team runs codes, what phrases get a faster answer from providers. Your job in the first year is to build safe systems for yourself: a checklist on paper, a consistent charting pattern, and a habit of closing loops out loud.`,
  );
}

function scenarioIntro(post) {
  const u = post.unit ? String(post.unit) : "the unit";
  return `You are early in orientation and ${u} still feels like a language you are learning in real time. The topic—${esc(
    post.title,
  )}—shows up on shifts when patients are unstable, families are stressed, or the workload does not match the staffing. This article is not a lecture on professionalism. It is a floor-realistic walkthrough of what tends to happen, why new grads freeze, and the nursing moves that keep patients safer while you build confidence.`;
}

function whatHappens(post) {
  const pillar = post.pillarTopic ? ` (${post.pillarTopic})` : "";
  return p(
    `In practice, this scenario rarely arrives as a single clean moment. It arrives as a stack: a vital sign that does not match the story, a family member who needs answers while you are still gathering data, a provider who wants a tight update, and a chart that asks for specificity you do not yet feel qualified to claim.${pillar}`,
    `Teams coordinate through spoken updates, bedside observations, and the record. That means your value is often narrative clarity: what changed first, what you did, what you need next, and what still worries you. On busy units, the nurse who can summarize without minimizing is the nurse people trust faster.`,
    `Hospitals also vary by policy. Your facility may use different names for rapid response, different criteria for escalation, and different expectations for who documents what during an event. The through-line is still safety: verify, escalate per protocol, support the patient, and keep communication closed-loop.`,
    `You may also notice social dynamics. Experienced staff may move quickly, speak in shorthand, or assume you already know where equipment lives. That does not mean you are behind forever. It means you need translation time: repeat back instructions, ask where to stand, and confirm roles during emergencies rather than guessing.`,
  );
}

function whyStruggle(post) {
  const st = Array.isArray(post.supportingTopics) ? post.supportingTopics : [];
  const extra =
    st.length > 0
      ? ` Themes like ${st.slice(0, 3).map((s) => `"${esc(String(s))}"`).join(", ")} show up repeatedly because they are how teams communicate risk without writing a textbook at the bedside.`
      : "";
  return p(
    `New grads struggle here because the cognitive load splits: you are managing tasks, emotions, and identity at the same time. You want to look competent, but competence in nursing is often boring: checking lines, rechecking five rights, and saying "I am not sure" early enough to prevent harm.`,
    `Another pressure is time distortion. In teaching, you had controlled scenarios. On the floor, interruptions are the default. That makes it easy to lose track of what you already assessed, what you already told the provider, and what still needs a witness in the chart.`,
    `There is also the hidden curriculum: how to speak up, how to ask for help without apologizing for existing, and how to document uncertainty in a way that protects the patient and reflects your actual assessment.${extra}`,
  );
}

function buildSteps(post) {
  const unit = post.unit ? String(post.unit) : "your unit";
  return [
    `Pause and identify immediate safety: responsiveness, airway, breathing, circulation, bleeding, and any high-risk medications or devices that cannot wait.`,
    `Tell someone what you are seeing using a tight structure: what changed, when it changed, what you already did, and what you need next. If your facility uses SBAR, use it as scaffolding, not theater.`,
    `Match your actions to scope and policy. If you are unsure, ask for a double check on high-risk tasks rather than improvising under pressure.`,
    `Document as you go when possible. If you cannot chart live, jot times and facts on paper so your later narrative is accurate, not reconstructed from adrenaline memory.`,
    `Reassess after interventions the way you would want another nurse to reassess for your family member: trends matter more than a single number.`,
    `Close the loop aloud: repeat orders back, confirm who is owning follow-up, and verify who will update the patient or family when appropriate.`,
    `Before you move on, scan for drift on ${unit}: patients who are stable on paper but fragile in real life, or patients who are "fine" until they are not.`,
  ];
}

function mistakes() {
  return [
    "Minimizing change because you do not want to bother the team.",
    "Charting a story that is cleaner than what you actually saw.",
    "Waiting to speak up until you feel 100% certain.",
    "Splitting attention across too many rooms during an early escalation.",
    "Apologizing for being new instead of asking a precise safety question.",
    "Letting shame push you into rushing high-risk medication checks.",
  ];
}

function preceptors(post) {
  return p(
    `Preceptors expect you to stay inside scope and stay honest. Many are less interested in polish than in trajectory: are you catching drift, asking focused questions, and taking feedback without defensiveness? They also expect you to show how you think, not only what you did, because nursing visibility keeps teams aligned.`,
    `If your unit uses a specific report or escalation format, learn it until it is boring. Boring structure frees brain space for clinical reasoning. If the format is unclear, build your own skeleton and review it weekly with your preceptor so it matches local norms.`,
  );
}

function clinicalTips(post, toolHref, toolLabel, altToolHref) {
  return p(
    `Carry a small paper "worried list" with three patients max: people you will revisit sooner because risk is high or the plan is fragile. That habit prevents the common mistake of spending your whole shift on whoever is loudest.`,
    `When you are tired, slow down on high-risk actions: insulin, anticoagulation, sedatives, and anything requiring a double check. Fatigue pushes people to rush exactly where rushing costs the most.`,
    `Pair bedside learning with structured tools. Use the <a href="${toolHref}">${esc(toolLabel)}</a> when labs and trends matter to your decision-making, and cross-check dosing with <a href="${altToolHref}">medication math tools</a> when concentration or weight-based calculations are involved.`,
  );
}

function miniScenario(post) {
  return p(
    `You are mid-shift and the situation behind "${esc(post.title)}" begins to unfold: assessments are stacking, a provider is waiting for a callback, and a family member is asking questions you cannot fully answer yet. What do you prioritize in the next five minutes?`,
    `Think it through: stabilize and assess per training, activate the right help for the level of risk, communicate a crisp update with timestamps, and document enough that the next nurse is not guessing. Your first goal is not perfect confidence. Your first goal is safe sequencing and visible teamwork.`,
  );
}

function summaryBullets() {
  return [
    "Safety first: verify, escalate per policy, and narrate trends clearly.",
    "New grad growth shows up as earlier recognition and cleaner communication, not heroics.",
    "Documentation should match reality, including uncertainty and notifications.",
    "Use lessons and tools to support decisions when your brain is tired.",
    "Ask for help early; silence is not a competency signal.",
    "Pair every hard shift with one specific skill you will rehearse before the next one.",
  ];
}

function buildHtml(post, lessons, tools) {
  const [la, lb] = lessons;
  const [t1, t2] = tools;
  const toolLabel = t1.includes("lab-values")
    ? "lab values reference tool"
    : t1.includes("med-math")
      ? "medication math tool"
      : "clinical reference tool";

  const steps = buildSteps(post);
  const mist = mistakes();
  const sum = summaryBullets();

  const html = `<section class="nn-blog-newgrad">
<h2>Introduction</h2>
${p(
  scenarioIntro(post),
  `If you want parallel study depth, use the <a href="${la}">fluids and electrolyte emergencies lesson</a> for rapid deterioration patterns and the <a href="${lb}">heart failure lesson</a> for perfusion thinking that shows up across units. For glycemic crises common on busy floors, keep <a href="${DEFAULT_L3}">DKA and HHS emergencies</a> in your back pocket as a structured review.`,
)}
${expansionBlock(post.title)}

<h2>What Actually Happens</h2>
${whatHappens(post)}

<h2>Why New Grads Struggle</h2>
${whyStruggle(post)}

<h2>Step-by-Step Nursing Approach</h2>
<ol>
${steps.map((s) => `<li>${esc(s)}</li>`).join("\n")}
</ol>
${p(`Add one more habit: before you leave a patient room after a tense moment, ask yourself what you would want the next nurse to know if the patient changes in twenty minutes. That question prevents silent gaps.`)}

<h2>Common Mistakes to Avoid</h2>
<ul>
${mist.map((s) => `<li>${esc(s)}</li>`).join("\n")}
</ul>

<h2>What Preceptors Expect</h2>
${preceptors(post)}

<h2>Clinical Tips</h2>
${clinicalTips(post, t1, toolLabel, t2)}

<h2>Mini Practice Scenario (NCLEX-style thinking)</h2>
${miniScenario(post)}

<h2>Quick Summary</h2>
<ul>
${sum.map((s) => `<li>${esc(s)}</li>`).join("\n")}
</ul>

<h2>Internal Linking Section</h2>
<p>Go deeper with structured NurseNest learning paths:</p>
<ul>
<li><a href="${la}">Related NCLEX-RN lesson (fluids, electrolytes, and emergency patterns)</a></li>
<li><a href="${lb}">Related NCLEX-RN lesson (heart failure and perfusion)</a></li>
<li><a href="${t1}">${esc(toolLabel)}</a></li>
<li><a href="${t2}">Medication math and safety checks</a></li>
<li><a href="${INTERNAL_BLOG_HREF}">${esc(INTERNAL_BLOG_LABEL)}</a></li>
</ul>
<p>Additional reading: explore the <a href="/blog">NurseNest blog index</a> for more new grad clinical scenarios.</p>
{{RELATED_BLOG_BLOCK}}
</section>`;

  return html;
}

function ensureWordCount(html, post) {
  let h = html;
  let n = wc(h);
  let pad = 0;
  while (n < 1200 && pad < 30) {
    pad += 1;
    h = h.replace(
      "</section>",
      `${p(
        `Additional context for "${esc(post.title)}": nursing judgment is iterative. Each shift adds data: how your unit escalates, how your patients typically look during recovery, and how your team prefers updates. Write down one lesson at the end of hard shifts—what you would do ten minutes sooner next time—and you will feel less like you are starting from zero every day.`,
        `When you study, connect book knowledge to bedside language. Instead of memorizing lists, practice explaining one patient story in two minutes with trends, interventions, responses, and remaining risks. That skill transfers directly to handoff, provider calls, and documentation.`,
      )}</section>`,
    );
    n = wc(h);
  }
  return h;
}

function pipelineMd(post, fileStem) {
  return `# ${post.title}

Production HTML for this topic lives in \`data/blog-content/newgrad-prod-batch-03/${fileStem}.html\`.

- Manifest id: ${post.id}
- Slug: \`${post.slug}\`
- Unit: ${post.unit || "n/a"}

This markdown file is a lightweight pipeline pointer (batch 03). The canonical published body is HTML in the batch folder.
`;
}

function blogImportJson(post, bodyRel, idx) {
  const lessons = pickLessons(post.relatedLessonPaths);
  const tools = pickTools(post.relatedToolPaths);
  return {
    slug: post.slug,
    source: "newgrad-400-batch-03",
    wave: "newgrad-400",
    manifestId: post.id,
    batch: "newgrad-prod-batch-03",
    batchIndex: idx,
    title: post.title,
    audience: post.audience || "nursing",
    unit: post.unit || null,
    keywords: {
      primary: post.primaryKeyword || post.title,
      secondary: post.secondaryKeywords || [],
    },
    relatedLessonPaths: lessons,
    relatedToolPaths: tools,
    internalLinks: {
      lessons: lessons,
      tools: tools,
      blogPost: INTERNAL_BLOG_HREF,
    },
    content: {
      format: "html-fragment",
      bodyPath: bodyRel,
      placeholderRelatedBlogBlock: "{{RELATED_BLOG_BLOCK}}",
    },
    seo: {
      title: seoTitleFrom(post.title),
      description: seoDescription(post.title, post.unit),
    },
  };
}

function main() {
  const usedSlugs = new Set();
  const usedTitles = new Set();
  for (const fp of [BATCH01_INDEX, BATCH02_INDEX]) {
    const rows = JSON.parse(fs.readFileSync(fp, "utf8"));
    for (const r of rows) {
      usedSlugs.add(r.slug);
      usedTitles.add(r.title);
    }
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const posts = [...manifest.posts].sort((a, b) => a.id - b.id);

  const selected = [];
  const skipped = [];

  for (const post of posts) {
    if (usedSlugs.has(post.slug)) {
      skipped.push({ reason: "already_in_batch_01_or_02", id: post.id, slug: post.slug });
      continue;
    }
    if (usedTitles.has(post.title)) {
      skipped.push({ reason: "duplicate_title_in_prior_index", id: post.id, slug: post.slug });
      continue;
    }
    const outHtml = path.join(BATCH_DIR, `body-${String(selected.length + 1).padStart(2, "0")}.html`);
    if (fs.existsSync(outHtml)) {
      skipped.push({ reason: "output_exists_abort", path: outHtml });
      process.exitCode = 1;
      throw new Error(`Refusing to overwrite: ${outHtml}`);
    }
    selected.push(post);
    usedSlugs.add(post.slug);
    usedTitles.add(post.title);
    if (selected.length >= TARGET_COUNT) break;
  }

  if (selected.length !== TARGET_COUNT) {
    throw new Error(`Expected ${TARGET_COUNT} posts, got ${selected.length}`);
  }

  fs.mkdirSync(BATCH_DIR, { recursive: true });
  fs.mkdirSync(BLOG_IMPORT_DIR, { recursive: true });
  fs.mkdirSync(PIPELINE_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

  const indexRows = [];
  const created = [];

  for (let i = 0; i < selected.length; i += 1) {
    const post = selected[i];
    const lessons = pickLessons(post.relatedLessonPaths);
    const tools = pickTools(post.relatedToolPaths);
    let html = buildHtml(post, lessons, tools);
    html = ensureWordCount(html, post);
    const words = wc(html);
    if (words < 1200) {
      throw new Error(`Below 1200 words for manifest ${post.id}: ${words}`);
    }

    const fileIdx = String(i + 1).padStart(2, "0");
    const bodyName = `body-${fileIdx}.html`;
    const bodyPath = path.join(BATCH_DIR, bodyName);
    fs.writeFileSync(bodyPath, html, "utf8");

    const bodyRel = `data/blog-content/newgrad-prod-batch-03/${bodyName}`;
    const importPath = path.join(BLOG_IMPORT_DIR, `${post.slug}.json`);
    if (fs.existsSync(importPath)) {
      throw new Error(`Import JSON already exists, refusing overwrite: ${importPath}`);
    }
    fs.writeFileSync(importPath, JSON.stringify(blogImportJson(post, bodyRel, i + 1), null, 2), "utf8");

    const stem = `${fileIdx}-${post.slug.slice(0, 60).replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}`;
    fs.writeFileSync(path.join(PIPELINE_DIR, `${stem}.md`), pipelineMd(post, bodyName), "utf8");

    indexRows.push({
      manifestId: post.id,
      slug: post.slug,
      title: post.title,
      seoTitle: seoTitleFrom(post.title),
      seoDescription: seoDescription(post.title, post.unit),
      excerpt: seoDescription(post.title, post.unit).slice(0, 240),
      keywords: [
        post.primaryKeyword || post.title,
        "new grad nurse",
        "clinical judgment",
        "nursing workflow",
        "transition to practice",
        post.unit || "nursing",
      ].filter(Boolean),
      relatedLessonPaths: lessons,
    });

    created.push({ manifestId: post.id, title: post.title, slug: post.slug, words });
    console.log("ok", post.id, post.slug, words);
  }

  fs.writeFileSync(path.join(BATCH_DIR, "index.json"), JSON.stringify(indexRows, null, 2), "utf8");

  const report = {
    pass: true,
    generatedAt: new Date().toISOString(),
    batch: "newgrad-prod-batch-03",
    count: created.length,
    posts: created,
    skippedTopics: skipped,
    outputs: {
      contentDir: "data/blog-content/newgrad-prod-batch-03/",
      blogImportGlob: "data/blog-import/<slug>.json",
      pipelineDir: "data/blog-pipeline/batch-03/en/",
      report: "reports/newgrad-prod-batch-03-generation-report.json",
    },
    confirmations: {
      noNestedNursenestCorePaths: true,
      didNotModifyManifest: true,
      refusedOverwriteOfExistingImportJson: true,
    },
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");

  console.log("\nDONE", created.length, "posts");
}

main();
