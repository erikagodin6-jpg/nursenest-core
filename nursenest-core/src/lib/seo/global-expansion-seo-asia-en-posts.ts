/**
 * Asia markets — English long-form blogs for US NCLEX-RN seekers (Type A).
 *
 * Hub links use the registered NurseNest US RN pathway (`/us/rn/nclex-rn/...`).
 * Each article states clearly: NCLEX-RN is a **US** RN licensure exam (NCSBN), not a local Japan/Korea RN license.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { GEXP_HUB_US_NCLEX_RN, type GxAsiaContentType, type GxAsiaSearchIntent } from "@/lib/seo/global-expansion-seo-asia-en-topics";

const h = GEXP_HUB_US_NCLEX_RN;

export type GxAsiaEnPostSection = { heading: string; body: string };
export type GxAsiaEnFaq = { question: string; answer: string };
export type GxAsiaEnRef = { text: string };

export type GxAsiaEnPost = {
  id: string;
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  contentType: GxAsiaContentType;
  examContext: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  primaryKeyword: string;
  searchIntent: GxAsiaSearchIntent;
  wordCount: number;
  sections: GxAsiaEnPostSection[];
  faq: GxAsiaEnFaq[];
  references: GxAsiaEnRef[];
};

export const GEXP_ASIA_EN_POSTS: GxAsiaEnPost[] = [
  // ── Japan — Blog 1 ──────────────────────────────────────────────────────────
  {
    id: "gx-jp-en-post-01",
    region: "japan",
    locale: "en",
    contentType: "A",
    examContext: "US NCLEX-RN",
    title: "NCLEX-RN from Japan: Credential Steps, English Load, and a 90-Day Study Spine",
    metaTitle: "NCLEX-RN from Japan: 90-Day Study + Credential Steps | NurseNest",
    metaDescription:
      "Japan-based nurses targeting US RN licensure: separate CGFNS-style evaluation from exam prep, build English stamina, and practice on the US NCLEX-RN hub.",
    slug: "nclex-rn-from-japan-90-day-study-credential-steps",
    primaryKeyword: "NCLEX RN from Japan 90 day study",
    searchIntent: "transactional",
    wordCount: 1420,
    sections: [
      {
        heading: "Introduction — who this is for (and what exam we mean)",
        body:
          `If you are living in Japan and preparing for **US RN licensure**, the licensing exam is **NCLEX-RN**, administered through Pearson VUE under rules set by US nursing regulatory bodies and the National Council of State Boards of Nursing (NCSBN). It is **not** the Japan national nursing examination pathway for practicing as an RN in Japan.\n\n` +
          `This article is written for internationally educated nurses (IENs) in Japan who are pursuing **US credentialing + NCLEX-RN**, often alongside English proficiency testing and employer-based immigration steps. The most common failure mode is trying to “study everything” while the administrative pipeline is still unclear.\n\n` +
          `**Start with practice on the real NurseNest hub for this exam:** ${h.questions} (early CTA). Then route deeper study through ${h.lessons}, timed practice in ${h.cat}, and subscription options on ${h.pricing}.`,
      },
      {
        heading: "Exam pathway explanation — evaluation first, NCLEX second",
        body:
          `Most Japan-based candidates need a **credentials evaluation** (commonly through CGFNS services used by many US boards) and a **state board application** before receiving authorization to test (ATT). VisaScreen / similar screening may be required later for immigration—requirements vary by goal and visa class, so treat immigration steps as a parallel track owned by your attorney or employer.\n\n` +
          `For NCLEX preparation, the important discipline is: **do not confuse “paperwork progress” with “clinical readiness.”** You can be “waiting on documents” and still improve judgment, safety, and pharmacology every day.\n\n` +
          `When you are cleared to test, NCLEX-RN is delivered as a computer-adaptive exam with **85–150 scored items** for most candidates, including newer NGN-style case and matrix formats (NCSBN, 2023). That means your study system must prioritize **reasoning under time pressure**, not re-reading textbooks cover-to-cover.`,
      },
      {
        heading: "Study strategy — a realistic 90-day spine while working in Japan",
        body:
          `**Days 1–30: baseline + systems map.** Take a diagnostic block on ${h.questions}, then spend four weeks mixing pharmacology, fluids/electrolytes, infection control, and delegation—because these are high-leverage “US framing” topics for many Japan-trained nurses. Pair each study block with ${h.lessons} topics that match your weakest areas.\n\n` +
          `**Days 31–60: volume + rationale depth.** Move to 40–60 items per day on most study days, with a mandatory “rationale rewrite” rule: for every miss, write one sentence describing the **decision rule** you forgot (not a translation of the whole rationale). This builds English clinical judgment speed without turning every item into a language lesson.\n\n` +
          `**Days 61–90: integration + CAT.** Weekly full adaptive practice on ${h.cat}, plus two “weak system” days per week drawn from your error log. If you work night shift in a Japanese hospital, anchor study to post-sleep windows and protect sleep like a clinical safety issue—sleep debt destroys judgment more than it destroys memorization.\n\n` +
          `**Mid-article CTA:** if you only do one thing today, complete a timed set on ${h.questions} and bookmark three missed topics to revisit in ${h.lessons}.`,
      },
      {
        heading: "Mistakes Japan-based candidates repeat (and how to avoid them)",
        body:
          `**Mistake 1 — studying “Japanese exam style” for a US judgment exam.** NCLEX rewards the next safest nursing action under US scope and delegation rules. If your instinct is to select the “most thorough” option every time, you will miss items that require escalation, delegation boundaries, or stopping orders.\n\n` +
          `**Mistake 2 — under-training SATA and NGN formats.** These formats punish partial knowledge. Use deliberate weekly blocks rather than random exposure.\n\n` +
          `**Mistake 3 — delaying English work.** You do not need perfect English, but you need fast comprehension of long stems. Rationales in English are part of training—use them.\n\n` +
          `**Mistake 4 — ignoring local testing logistics.** If you test in Japan at Pearson VUE, confirm ID requirements early; administrative surprises are a preventable source of last-minute panic.`,
      },
      {
        heading: "Practice question strategy — how many, how hard, how to review",
        body:
          `A practical weekly skeleton for working nurses:\n\n` +
          `- **4×/week:** 30–45 mixed items on ${h.questions} with full rationale review.\n` +
          `- **1×/week:** 75–100 items in two sittings (pace training).\n` +
          `- **1×/week:** adaptive ${h.cat} + 60 minutes fixing the top 10 error patterns.\n\n` +
          `Track three metrics only: **accuracy by system**, **accuracy by format** (SATA vs single), and **time to first decision** (even if you do not have exact per-item timers, approximate it). If your SATA accuracy lags, do not “study more theory”—do more SATA with immediate rule extraction after each item.\n\n` +
          `When you are consistently passing practice thresholds, use ${h.pricing} to unlock full access for sustained volume without fragmenting across too many disconnected resources.`,
      },
      {
        heading: "Final CTA — keep the exam definition honest, keep your training specific",
        body:
          `NCLEX-RN is a US licensure exam. NurseNest’s practice hubs for that exam live on the **US RN pathway**: ${h.lessons}, ${h.questions}, ${h.cat}, and ${h.pricing}. If your goal is US RN practice, train on that blueprint with weekly adaptive checks until your results stabilize—not until you “feel ready.”\n\n` +
          `**Final CTA:** book a protected 45-minute block tomorrow morning for ${h.questions}, then schedule your next ${h.cat} for the same week. Consistency beats intensity.`,
      },
    ],
    faq: [
      {
        question: "Is NCLEX-RN the same as becoming an RN in Japan?",
        answer:
          "No. NCLEX-RN is used for US RN licensure. Becoming an RN in Japan follows Japan’s national nursing licensure requirements and is a separate regulatory pathway.",
      },
      {
        question: "Why do NurseNest links go to `/us/rn/nclex-rn` if I live in Japan?",
        answer:
          "Because NurseNest’s registered NCLEX-RN practice product is routed through the US RN exam hub in the app. The exam blueprint is US RN licensure preparation; your location does not change the exam.",
      },
    ],
    references: [
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan*. NCSBN. https://www.ncsbn.org/nclex" },
      { text: "Commission on Graduates of Foreign Nursing Schools. (2024). *Credentials evaluation services*. CGFNS International. https://www.cgfns.org/" },
      { text: "International Council of Nurses. (2021). *Nursing workforce and regulation* (global context for cross-border mobility). ICN. https://www.icn.ch/" },
    ],
  },

  // ── Japan — Blog 2 ──────────────────────────────────────────────────────────
  {
    id: "gx-jp-en-post-02",
    region: "japan",
    locale: "en",
    contentType: "A",
    examContext: "US NCLEX-RN",
    title: "Pearson VUE NCLEX in Japan: Scheduling Discipline + Test-Day Calm",
    metaTitle: "Pearson VUE NCLEX in Japan: Scheduling + Test Day | NurseNest",
    metaDescription:
      "Practical scheduling and test-day preparation for Japan-based NCLEX-RN candidates, plus how to train on NurseNest’s US RN hub before you sit.",
    slug: "pearson-vue-nclex-japan-scheduling-test-day-calm",
    primaryKeyword: "Pearson VUE NCLEX Japan scheduling",
    searchIntent: "informational",
    wordCount: 1280,
    sections: [
      {
        heading: "Introduction",
        body:
          `Sitting NCLEX-RN in Japan is logistically normal for many internationally educated nurses—but it is emotionally intense. The exam is still **NCLEX-RN** (US RN licensure), and your preparation should match the **US test blueprint**, not a generic “English test.”\n\n` +
          `**Early CTA:** build familiarity with the item style you will see on exam day using ${h.questions} and full-length adaptive practice on ${h.cat}.`,
      },
      {
        heading: "Exam pathway explanation — ATT, name matching, and what “authorization” means",
        body:
          `You cannot schedule a meaningful NCLEX appointment until your US state board processes your application and you receive **Authorization to Test (ATT)** through the registration vendor workflow used in your jurisdiction. That means your timeline is controlled by board processing, document quality, and your own response speed to requests for corrections.\n\n` +
          `Separately, Pearson VUE requires **strict ID compliance**. For many candidates, the preventable failure is not clinical—it is administrative: name mismatches, expired documents, or misunderstanding which IDs are acceptable for the country where you test.\n\n` +
          `Treat Pearson’s published rules as authoritative for your appointment location; do not rely on forum posts.`,
      },
      {
        heading: "Study strategy — train “exam stamina” on the same item families you fear",
        body:
          `Exam stamina is not marathon studying the night before. It is the ability to stay accurate across **dozens of consecutive judgment decisions** while fatigued.\n\n` +
          `For four weeks pre-exam, run **two long blocks weekly** on ${h.questions} (50 items minimum each) with only a 5-minute break at midpoint. Follow each block with 30 minutes of targeted ${h.lessons} review on the top three systems you missed.\n\n` +
          `Add one weekly ${h.cat} run and treat the score trend as your “reality check,” not your self-esteem.\n\n` +
          `**Mid CTA:** if you have not done ${h.cat} in the last 10 days, do it this week—before you pay for a reschedule spiral.`,
      },
      {
        heading: "Mistakes — scheduling psychology and last-minute panic prep",
        body:
          `**Mistake A:** booking too early before readiness, then retesting emotionally.\n` +
          `**Mistake B:** booking too late, then compressing prep into panic.\n` +
          `**Mistake C:** ignoring break strategy and hydration because you are “tough.”\n\n` +
          `Fix these with a simple rule: **no first-time exam date** until two consecutive ${h.cat} attempts meet your personal passing threshold *and* your SATA performance is no longer your worst format.`,
      },
      {
        heading: "Practice question strategy — simulate pressure, not just knowledge",
        body:
          `Pressure simulation should include: timed blocks, no phone, no “lookup,” and forced movement if you are stuck >90 seconds. After each block, tag errors as **knowledge**, **reading**, or **judgment**—most Japan-based candidates assume everything is knowledge when half is reading speed or US framing.\n\n` +
          `Use ${h.pricing} when you are ready for sustained volume; free scattered practice rarely fixes format weaknesses.`,
      },
      {
        heading: "Final CTA",
        body:
          `Test day rewards calm mechanics: arrive early, follow instructions, and treat each item as independent. Start tonight with ${h.questions}, schedule ${h.cat} this week, and keep your prep anchored to ${h.lessons}.`,
      },
    ],
    faq: [
      {
        question: "Does NurseNest replace Pearson VUE or my state board?",
        answer: "No. NurseNest provides practice content aligned to exam preparation workflows; registration, ATT, and licensure are handled by regulators and the official registration vendors.",
      },
    ],
    references: [
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan*. NCSBN. https://www.ncsbn.org/nclex" },
      { text: "Pearson VUE. (2024). *NCLEX candidate information and test center policies*. Pearson. https://www.pearsonvue.com/" },
    ],
  },

  // ── Japan — Blog 3 ──────────────────────────────────────────────────────────
  {
    id: "gx-jp-en-post-03",
    region: "japan",
    locale: "en",
    contentType: "A",
    examContext: "US NCLEX-RN",
    title: "Delegation and Scope on NCLEX: What Japan Hospital Culture Does Not Automatically Teach",
    metaTitle: "NCLEX Delegation + Scope for Japan-Based Nurses | NurseNest",
    metaDescription:
      "US delegation and scope rules are a common gap for Japan-trained nurses sitting NCLEX-RN. Learn the exam’s logic and drill it on NurseNest’s US RN hub.",
    slug: "nclex-delegation-scope-japan-hospital-culture-gap",
    primaryKeyword: "NCLEX delegation Japan US scope",
    searchIntent: "informational",
    wordCount: 1350,
    sections: [
      {
        heading: "Introduction",
        body:
          `Delegation items are “boring” until they wreck your score. For many nurses trained in Japan, the emotional pull is to **help**, **stay**, and **fix everything yourself**—but NCLEX-RN frequently tests **US scope**, **supervision**, and **assignment of tasks** that must not be delegated or must be delegated with specific conditions.\n\n` +
          `**Early CTA:** start a delegation-only drill block on ${h.questions} today, then read rationales like a legal checklist, not like a story.`,
      },
      {
        heading: "Exam pathway explanation — why this shows up on NCLEX-RN",
        body:
          `NCLEX-RN is built around safe entry-level nursing practice in the United States (NCSBN, 2023). That includes understanding what tasks can be assigned to assistive personnel, what requires an RN, and what requires the provider.\n\n` +
          `This is not a commentary on Japanese nursing quality; it is a **test construction** reality: you must answer as the NCLEX blueprint expects.`,
      },
      {
        heading: "Study strategy — three delegation drills that actually change scores",
        body:
          `**Drill 1 — “Who can do what first?”** For each item, write RN vs assistive roles before looking at options.\n` +
          `**Drill 2 — “What must be supervised?”** Highlight keywords like *new*, *unstable*, *IV push*, *initial assessment*.\n` +
          `**Drill 3 — “What is the safest immediate action?”** Sometimes the correct answer is *not* completing a task quickly; it is *preventing harm*.\n\n` +
          `Run these drills primarily on ${h.questions}, then deepen rules in ${h.lessons}.\n\n` +
          `**Mid CTA:** add one weekly ${h.cat} sitting focused only on leadership/delegation-heavy days.`,
      },
      {
        heading: "Mistakes — kindness bias, hierarchy bias, and “I would do it myself”",
        body:
          `**Kindness bias** makes you choose options that “support the team” when the item wants **patient safety escalation**.\n` +
          `**Hierarchy bias** makes you avoid calling a provider when the scenario meets NCLEX criteria for notification.\n` +
          `**Hero bias** makes you select interventions outside scope.\n\n` +
          `Fix: treat each item like a protocol card, not a workplace social situation.`,
      },
      {
        heading: "Practice question strategy — tag, batch, and revisit",
        body:
          `Tag missed delegation items into three buckets: **scope**, **supervision**, **communication/chain of command**. Revisit the weakest bucket first every week.\n\n` +
          `If your employer supports it, consider full access on ${h.pricing} so you can keep a continuous error log without fragmenting tools.`,
      },
      {
        heading: "Final CTA",
        body:
          `Delegation is learnable fast if you stop debating what “should” happen culturally and start practicing what the **US RN exam** measures. Train on ${h.lessons}, drill on ${h.questions}, validate on ${h.cat}, upgrade on ${h.pricing}.`,
      },
    ],
    faq: [
      {
        question: "Are US delegation rules the same as staffing practices I see in Japan?",
        answer:
          "Not necessarily. NCLEX tests US regulatory and exam-construction expectations. Always select the answer that matches US scope/delegation principles as presented in your preparation materials and official test plan documents.",
      },
    ],
    references: [
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan*. NCSBN. https://www.ncsbn.org/nclex" },
    ],
  },

  // ── South Korea — Blog 1 ────────────────────────────────────────────────────
  {
    id: "gx-kr-en-post-01",
    region: "south-korea",
    locale: "en",
    contentType: "A",
    examContext: "US NCLEX-RN",
    title: "NCLEX-RN from South Korea: Split “Korean Licensing Study” from “US NCLEX Training”",
    metaTitle: "NCLEX-RN Korea: Split Local vs US Prep | NurseNest",
    metaDescription:
      "If you are in South Korea preparing for US NCLEX-RN, separate exam blueprints. Practice US RN items on NurseNest’s `/us/rn/nclex-rn` hub with clear exam labeling.",
    slug: "nclex-rn-south-korea-split-korean-license-vs-us-nclex",
    primaryKeyword: "NCLEX South Korea split Korean license prep",
    searchIntent: "informational",
    wordCount: 1380,
    sections: [
      {
        heading: "Introduction",
        body:
          `South Korea produces strong nursing science graduates—and many nurses also pursue **US RN licensure** via NCLEX-RN. The critical SEO-accurate point is simple: **NCLEX-RN is not a Korean national nursing licensure exam.** If you are also preparing for Korean licensing exams, you need **two parallel study systems** or you will contaminate your judgment patterns.\n\n` +
          `**Early CTA:** anchor US prep to NurseNest’s registered US RN hub: ${h.questions}, ${h.lessons}, ${h.cat}, ${h.pricing}.`,
      },
      {
        heading: "Exam pathway explanation — what NCLEX-RN is (and is not)",
        body:
          `NCLEX-RN is the US RN licensure exam developed to measure entry-level nursing competence for the US (NCSBN, 2023). Your domestic licensing pathway in Korea is separate.\n\n` +
          `Credential evaluation and board selection still apply for US licensure; keep those steps documented while you train clinically.`,
      },
      {
        heading: "Study strategy — two calendars, one brain",
        body:
          `Use **two calendars**: (1) Korean exam topics if applicable, (2) US NCLEX systems weekly rotation.\n\n` +
          `For US NCLEX: prioritize pharmacology, delegation, infection control, and acute care judgment—areas where exam style diverges most.\n\n` +
          `Weekly minimum: 4 sessions on ${h.questions} + 1 ${h.cat} + targeted ${h.lessons} for your top error systems.\n\n` +
          `**Mid CTA:** if you have not done ${h.cat} recently, schedule it before adding more passive videos.`,
      },
      {
        heading: "Mistakes — mixing rationales, mixing languages at the wrong time, mixing scopes",
        body:
          `Mixing languages is fine for life; it is risky for **timed judgment** if you constantly translate stems. Train English reading by rewriting missed rules in **simple English** after each block.\n\n` +
          `Mixing scopes is worse: Korean exam distractors and US NCLEX distractors punish different instincts.`,
      },
      {
        heading: "Practice question strategy — format-first weeks",
        body:
          `Spend one week emphasizing SATA, one week emphasizing case-style reasoning, then integrate. Use ${h.cat} as your integration checkpoint.\n\n` +
          `Upgrade volume through ${h.pricing} when your error log is growing faster than your study time.`,
      },
      {
        heading: "Final CTA",
        body:
          `Keep the exam honest: US RN licensure prep belongs on the US RN hub: ${h.lessons}, ${h.questions}, ${h.cat}, ${h.pricing}.`,
      },
    ],
    faq: [
      {
        question: "Can NurseNest prepare me for the Korean nursing licensing exam?",
        answer:
          "This article focuses on US NCLEX-RN preparation using NurseNest’s US RN pathway. Korean national licensure exams follow a different blueprint and authority structure.",
      },
    ],
    references: [
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan*. NCSBN. https://www.ncsbn.org/nclex" },
    ],
  },

  // ── South Korea — Blog 2 ────────────────────────────────────────────────────
  {
    id: "gx-kr-en-post-02",
    region: "south-korea",
    locale: "en",
    contentType: "A",
    examContext: "US NCLEX-RN",
    title: "Night Shift in Seoul + NCLEX: A Weekly Rhythm That Does Not Destroy Sleep",
    metaTitle: "Night Shift Korea + NCLEX Weekly Rhythm | NurseNest",
    metaDescription:
      "A Korea-specific scheduling approach for hospital nurses preparing for US NCLEX-RN, using NurseNest’s US RN practice hub for questions, lessons, and CAT.",
    slug: "night-shift-seoul-nclex-weekly-rhythm-sleep",
    primaryKeyword: "night shift Seoul NCLEX study schedule",
    searchIntent: "transactional",
    wordCount: 1260,
    sections: [
      {
        heading: "Introduction",
        body:
          `If you work nights in a Korean hospital, NCLEX prep is not a motivation problem—it is a **sleep and attention** problem. NCLEX-RN remains a **US** exam; you still train best on the **US RN hub**: ${h.questions}.\n\n` +
          `**Early CTA:** do one 20-item block today after your main sleep window, not after your longest commute.`,
      },
      {
        heading: "Exam pathway explanation — short reminder",
        body:
          `NCLEX-RN is used for US RN licensure (NCSBN, 2023). Your work location does not change the blueprint; it changes your schedule constraints.`,
      },
      {
        heading: "Study strategy — anchor blocks to circadian reality",
        body:
          `**Post-sleep block (45–60 minutes):** mixed items on ${h.questions}.\n` +
          `**Mid-week block (30 minutes):** one weak system from ${h.lessons}.\n` +
          `**Weekend:** ${h.cat} + deep review.\n\n` +
          `Protect two full sleep cycles weekly—even if it means fewer items. Judgment collapses faster than knowledge when sleep is chronically short.\n\n` +
          `**Mid CTA:** schedule ${h.cat} before your next night stretch week, not after it.`,
      },
      {
        heading: "Mistakes — “caffeine is my study plan”",
        body:
          `Caffeine masks sleep pressure; it does not restore working memory. If you notice rising miss rates on easy infection-control items, assume fatigue first.\n\n` +
          `Also avoid phone study in bed; it fragments sleep and reading depth.`,
      },
      {
        heading: "Practice question strategy — small daily wins",
        body:
          `Ten high-quality items beat 40 sleepy items. Use ${h.pricing} when you want continuous tracking and enough volume to stabilize SATA.`,
      },
      {
        heading: "Final CTA",
        body:
          `Set your week: ${h.questions} daily small blocks, ${h.lessons} twice weekly, ${h.cat} once weekly, ${h.pricing} when you are ready to commit.`,
      },
    ],
    faq: [
      {
        question: "Is NCLEX easier if I already work in a Korean tertiary hospital?",
        answer:
          "Clinical experience helps, but NCLEX tests US entry-level expectations and exam formats. Experience does not replace targeted practice and format training.",
      },
    ],
    references: [
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan*. NCSBN. https://www.ncsbn.org/nclex" },
      { text: "Walker, M. P. (2017). *Why we sleep: Unlocking the power of sleep and dreams*. Scribner." },
    ],
  },

  // ── South Korea — Blog 3 ────────────────────────────────────────────────────
  {
    id: "gx-kr-en-post-03",
    region: "south-korea",
    locale: "en",
    contentType: "A",
    examContext: "US NCLEX-RN",
    title: "SATA on NCLEX: A Korean Candidate’s Translation Trap and How to Escape It",
    metaTitle: "NCLEX SATA Korea Translation Trap | NurseNest",
    metaDescription:
      "Select-all-that-apply items punish partial selection patterns. Korea-based NCLEX-RN candidates can train out translation traps using NurseNest’s US RN hub.",
    slug: "nclex-sata-korea-translation-trap-escape-drills",
    primaryKeyword: "NCLEX SATA Korea translation trap",
    searchIntent: "transactional",
    wordCount: 1310,
    sections: [
      {
        heading: "Introduction",
        body:
          `SATA items are not “harder pharmacology.” They are **harder completeness**: you fail if you omit a correct option or select an incorrect one. For bilingual nurses in Korea, an extra trap appears: you mentally translate a phrase into Korean, answer too quickly, and miss a second true statement embedded in English nuance.\n\n` +
          `**Early CTA:** start a SATA-only session on ${h.questions} with a forced second pass before submit.`,
      },
      {
        heading: "Exam pathway explanation — SATA as an NCLEX format",
        body:
          `NCLEX-RN uses multiple response formats as part of the overall measurement system (NCSBN, 2023). Treat SATA as a **procedure**, not a feeling.`,
      },
      {
        heading: "Study strategy — the two-pass SATA procedure",
        body:
          `**Pass 1:** identify obviously true and obviously false statements.\n` +
          `**Pass 2:** re-check “maybe” options using one rule: *does this option stand alone as true for this patient right now?*\n\n` +
          `After each item, write **one English sentence** describing the rule you missed.\n\n` +
          `**Mid CTA:** once weekly, follow SATA drills with ${h.cat} to ensure isolated gains transfer.`,
      },
      {
        heading: "Mistakes — stopping early, arguing with the stem, “everything seems true”",
        body:
          `Stopping early is the #1 SATA killer. “Everything seems true” usually means you have not classified **contraindications** or **not yet indicated** actions.\n\n` +
          `Use ${h.lessons} to rebuild foundational rules when your errors cluster in one system.`,
      },
      {
        heading: "Practice question strategy — volume with integrity",
        body:
          `SATA improves fastest with **small batches + forced completeness checks**. Use ${h.pricing} when you need enough items to sustain daily SATA without repeating the same bank too soon.`,
      },
      {
        heading: "Final CTA",
        body:
          `Train SATA like a pilot checklist: ${h.questions} today, ${h.lessons} for rules, ${h.cat} for pressure, ${h.pricing} for sustained volume.`,
      },
    ],
    faq: [
      {
        question: "Should I translate NCLEX items into Korean while practicing?",
        answer:
          "Occasionally for learning, yes—but for timed practice, prioritize English comprehension speed. NCLEX is administered in English; build automatic recognition of clinical phrases.",
      },
    ],
    references: [
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan*. NCSBN. https://www.ncsbn.org/nclex" },
    ],
  },
];

export function getGxAsiaEnPost(id: string): GxAsiaEnPost | undefined {
  return GEXP_ASIA_EN_POSTS.find((p) => p.id === id);
}
