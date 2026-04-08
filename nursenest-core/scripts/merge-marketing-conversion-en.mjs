/**
 * One-time merge of marketing/conversion strings into public/i18n/en.json.
 * Run: node scripts/merge-marketing-conversion-en.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, "../public/i18n/en.json");

const patch = {
  "home.hero.mainTitle": "RN, PN, NP, and Allied exam prep for US and Canada",
  "home.hero.newSubheadline":
    "Train in your exact pathway with rationale-first question sets, region-correct exam labels, and readiness tracking built for pass-level decisions.",
  "home.hero.quickEntryLabel": "Jump in without hunting menus",
  "home.hero.trustMicroBadge": "US & Canadian scopes kept separate",
  "home.hero.authorityBadge": "Rationale on every scored option",
  "home.hero.ctaPrimary": "Start free trial",
  "home.hero.ctaSecondary": "Browse exam question banks",
  "home.hero.ctaProofLine": "20,000+ pathway-scoped questions with clinical rationales and readiness tracking.",
  "home.hero.ctaInstant": "Start practicing instantly",
  "home.hero.ctaInstantHint":
    "Opens a short practice path. Free account, no card to start your preview runs.",
  "home.hero.urgencyMicrocopy":
    "Pick RN, PN, NP, or allied and your country first so stems, delegation language, and lesson tags stay aligned to that registration.",
  "home.hero.regionPathwayHint":
    "Country changes pathway labels and exam naming (for example, NCLEX-PN vs REx-PN).",

  "home.howItWorks.title": "How it works",
  "home.howItWorks.sub": "Three steps from sign-up to a study rhythm you can keep until test day.",
  "home.howItWorks.step1Title": "Choose your exam and region",
  "home.howItWorks.step1Body":
    "RN, PN, NP, or allied, US or Canada. The bank, lessons, and scope language match what you will sit for.",
  "home.howItWorks.step2Title": "Train with questions and rationales",
  "home.howItWorks.step2Body":
    "Every scored option explains why it passes or fails clinically. Misses roll into categories you can target with the next set.",
  "home.howItWorks.step3Title": "Let the planner and readiness guide reps",
  "home.howItWorks.step3Body":
    "Add your exam date for pacing, use flashcards for weak facts, and read readiness as a next-study signal, not a guarantee.",

  "home.featuresStack.title": "What actually ships with your subscription",
  "home.featuresStack.lead":
    "Bank, lessons, flashcards, planner, and dashboard share the same tags and weak-area lists. Fewer spreadsheets, fewer “wait, which app was that topic in?” moments.",
  "home.featuresStack.questionBankTitle": "Question bank",
  "home.featuresStack.questionBankBody":
    "Pathway-scoped items with category tags. Subscribers get the full pool for their tier, plus rationales and history that do not vanish when you close the tab.",
  "home.featuresStack.lessonsTitle": "Lessons",
  "home.featuresStack.lessonsBody":
    "Blueprint-style modules for your track. We reach for them when one section keeps failing, not as a substitute for doing stems.",
  "home.featuresStack.flashcardsTitle": "Flashcards",
  "home.featuresStack.flashcardsBody":
    "You miss a question on Tuesday; related cards can show up again Friday. Memorization and application in the same week, without a separate deck app.",
  "home.featuresStack.plannerTitle": "Adaptive study planner",
  "home.featuresStack.plannerBody":
    "You set blocks around exam day and real shifts. When categories drift, the planner gets opinionated about what to run next.",
  "home.featuresStack.readinessTitle": "Readiness (the plain kind)",
  "home.featuresStack.readinessBody":
    "Blends recent accuracy, volume, and optional test-date pacing. A “what should I do now?” line, not a black-box pass predictor.",
  "home.featuresStack.ctaQuestions": "Open practice questions",
  "home.featuresStack.ctaPricing": "Compare plans",
  "home.featuresStack.ctaSignIn": "Sign in to continue",

  "home.gateway.title": "Start from the exam you are registered for",
  "home.gateway.subtitle":
    "Nursing and allied hubs link the same-pathway question bank, lessons, and pricing. Pick US or Canada first so scope and delegation language match your authorization.",
  "home.gateway.regionHint": "Filters content to this region",
  "home.gateway.badgePrimary": "Nursing: licensure & progression",
  "home.gateway.quickLinks": "Practice, lessons, and hubs",
  "home.gateway.frictionNote":
    "A free account opens starter runs and previews. A paid plan unlocks the full bank for your tier, lesson depth, timed mocks, saved history, and weak-area tools.",

  "nav.marketingExplore": "Who we help",
  "nav.examHubsMobile": "Pick your exam",
  "nav.chooseYourExam": "Choose your exam",
  "nav.examStrip.rn": "NCLEX-RN",
  "nav.examStrip.pnUS": "NCLEX-PN",
  "nav.examStrip.pnCA": "REx-PN",
  "nav.examStrip.npUS": "NP (US certifications)",
  "nav.examStrip.npCA": "NP (CNPLE)",
  "nav.examStrip.alliedUS": "Allied health",
  "nav.examStrip.alliedCA": "Allied health",

  "home.quickEntry.rnQuestions": "NCLEX-RN questions",
  "home.quickEntry.pnQuestionsUS": "NCLEX-PN questions",
  "home.quickEntry.pnQuestionsCA": "REx-PN questions",
  "home.quickEntry.npQuestionsUS": "NP practice questions (US)",
  "home.quickEntry.npQuestionsCA": "CNPLE / NP questions",
  "home.quickEntry.alliedUS": "Allied health questions (US)",
  "home.quickEntry.alliedCA": "Allied health questions (Canada)",
  "home.quickEntry.studyTools": "Study tools",

  "home.gateway.nursing.title": "NCLEX-RN",
  "home.gateway.nursing.introUS":
    "Clinical judgment practice for US RN candidates: NGN-style stems, rationales per option, and full-length mocks when you are ready.",
  "home.gateway.nursing.introCA":
    "Canadian RN registration: same high-stakes reasoning skills, scoped to your NCLEX-RN track and Canadian lesson hubs.",
  "home.gateway.nursing.ctaPrimary": "Run NCLEX-RN questions",
  "home.gateway.nursing.ctaPrimaryDesc": "Starts in your selected region",
  "home.gateway.nursing.link.seoOverview": "NCLEX-RN prep overview",
  "home.gateway.nursing.link.lessons": "RN lessons",
  "home.gateway.nursing.link.timedMocks": "Timed practice exams",

  "home.gateway.practical.titleUS": "NCLEX-PN (LVN/LPN)",
  "home.gateway.practical.titleCA": "REx-PN (Canada PN)",
  "home.gateway.practical.introUS":
    "PN-level safety and pharmacology stems with lesson support, not RN material squeezed into an LPN label.",
  "home.gateway.practical.introCA":
    "REx-PN is its own exam. Use the Canadian PN bank and lessons built for REx-PN, not a relabeled US mix.",
  "home.gateway.practical.ctaUS": "Run NCLEX-PN questions",
  "home.gateway.practical.ctaCA": "Run REx-PN questions",
  "home.gateway.practical.ctaDesc": "Pathway-filtered bank",
  "home.gateway.practical.link.lessons": "PN lessons",
  "home.gateway.practical.link.hub": "PN exam hub",
  "home.gateway.practical.link.seoOverview": "PN prep overview",

  "home.gateway.np.title": "Nurse practitioner",
  "home.gateway.np.introUS":
    "FNP and AGPCNP each have dedicated lessons and banks. Pick the board you are sitting. Do not cross-train on the wrong blueprint.",
  "home.gateway.np.introCA":
    "Canadian NP: start from the CNPLE hub. US FNP/AGPCNP stays available if you sit US certification exams.",
  "home.gateway.np.ctaUS": "Open NP question bank (US)",
  "home.gateway.np.ctaCA": "Open CNPLE questions",
  "home.gateway.np.ctaDescUS": "US NP clinical cases",
  "home.gateway.np.ctaDescCA": "Canadian NP track",
  "home.gateway.np.link.seoOverview": "NP certification overview (US)",
  "home.gateway.np.link.seoOverviewCa": "CNPLE / NP prep overview",
  "home.gateway.np.link.fnpLessons": "FNP lessons",
  "home.gateway.np.link.agpcnpLessons": "AGPCNP lessons",
  "home.gateway.np.link.caHub": "Canadian NP hub",
  "home.gateway.np.link.fnpLessonsUs": "FNP lessons (US)",
  "home.gateway.np.link.agpcnpLessonsUs": "AGPCNP lessons (US)",

  "home.gateway.allied.title": "Allied health exams",
  "home.gateway.allied.intro":
    "Same pathway model as nursing: open your regional question bank first, then use the hub for lessons and context. The careers brochure lists supported certifications if you are still choosing an exam.",
  "home.gateway.allied.ctaPrimary": "Open allied question bank",
  "home.gateway.allied.ctaDesc": "Region-scoped bank",
  "home.gateway.allied.link.hub": "Allied exam hub",
  "home.gateway.allied.link.brochure": "Supported careers & exams (brochure)",

  "home.gateway.tools.title": "Tools & new grad",
  "home.gateway.tools.intro":
    "Dose calculators, lesson index, timed exams (sign in), and first-year roadmaps when you need a break from board mode.",
  "home.gateway.tools.ctaPrimary": "Use study tools",
  "home.gateway.tools.link.examLessons": "Exam lesson hubs",
  "home.gateway.tools.link.roadmap": "New graduate roadmap",
  "home.gateway.tools.link.newGradSupport": "New graduate support",
  "home.gateway.tools.link.flashcards": "Flashcards (sign in)",
  "home.gateway.tools.link.practiceExams": "Practice exams (sign in)",

  "home.conversion.sampleRnQuestionRun": "NCLEX-RN question run",

  "pages.pricing.examChoose.subtitleUS": "US terminology and exam naming",
  "pages.pricing.examChoose.subtitleCA": "Canadian terminology and exam naming",

  "pages.pricing.examCard.rnUS": "RN (NCLEX-RN)",
  "pages.pricing.examCard.rnCA": "RN (NCLEX-RN)",
  "pages.pricing.examCard.pnUS": "PN (NCLEX-PN)",
  "pages.pricing.examCard.pnCA": "PN (REx-PN)",
  "pages.pricing.examCard.npUS": "NP (US certifications)",
  "pages.pricing.examCard.npCA": "NP (CNPLE)",
  "pages.pricing.examCard.alliedUS": "Allied health (US)",
  "pages.pricing.examCard.alliedCA": "Allied health (Canada)",

  "pages.pricing.examBlurb.rnUS": "NCLEX-style client-needs question flow with readiness guidance.",
  "pages.pricing.examBlurb.rnCA": "Canadian RN-style preparation with system-based remediation.",
  "pages.pricing.examBlurb.pnUS": "Practical-nursing scope and delegation-focused prep.",
  "pages.pricing.examBlurb.pnCA": "Canadian REx-PN terminology and entry-to-practice focus.",
  "pages.pricing.examBlurb.npUS": "Advanced differential, pharmacotherapy, and management-focused cases (US boards).",
  "pages.pricing.examBlurb.npCA": "Canadian NP entry and CNPLE-aligned clinical management practice.",
  "pages.pricing.examBlurb.alliedUS": "Role-specific pathways with practical exam-style drills.",
  "pages.pricing.examBlurb.alliedCA": "Role-specific pathways with Canadian scope and exam-style drills.",

  "home.conversion.whyHeading": "Why we did not want three tabs open",
  "home.conversion.whySub":
    "Topic tags tie the bank, lessons, and flashcards together. Weak-area lists, planner nudges, and readiness all point at the same gaps.",

  "home.conversion.why1Title": "Banks that match your registration",
  "home.conversion.why1Body":
    "RN, PN, NP, and allied pools stay separated. You should not be drilling US delegation language the night before a Canadian sit.",

  "home.conversion.why2Title": "Rationales that walk each option",
  "home.conversion.why2Body":
    "After you submit, see why the keyed answer is safest and where each distractor fails clinically. Elimination practice, not letter bingo.",

  "home.conversion.why3Title": "Mocks sitting next to category accuracy",
  "home.conversion.why3Body":
    "Timed exams and CAT-style runs (where enabled) live beside category stats. Move from drills to full-length sessions without exporting CSVs.",

  "home.conversion.why4Title": "A readiness signal you can explain out loud",
  "home.conversion.why4Body":
    "The dashboard mixes accuracy, streaks, and optional exam-date pacing. Study signals you can justify to yourself, not a board score guarantee.",

  "home.conversion.previewHeading": "Inside the learner experience",
  "home.conversion.previewSub":
    "Dashboard for next steps and weak topics; bank for timed or untimed sets. Screenshots trail the live app slightly by design.",
  "home.conversion.previewCaptionDash": "Dashboard: next steps, streaks, and weak-topic nudges",
  "home.conversion.previewCaptionBank": "Question bank: stems, rationales, and session progress",
  "home.conversion.previewSignupHint": "Create a free account to open starter runs and see how rationales render on your device.",

  "home.conversion.pathwaysHeading": "Pathway hubs (Canada & United States)",
  "home.conversion.pathwaysSub":
    "Each hub connects questions, lessons, and pathway-specific pricing. Open the track that matches your registration.",

  "home.conversion.sampleHeading": "Try content before you subscribe",
  "home.conversion.sampleSub":
    "Public practice runs and lesson hubs are available without pay. Full bank depth, timed mocks with saved scores, and full history unlock on the plan for your tier.",
  "home.conversion.sampleBank": "Practice run",
  "home.conversion.sampleGo": "Open →",
  "home.conversion.sampleLessons": "Lesson hub",
  "home.conversion.sampleLessonsDesc": "Blueprint-aligned lessons for your pathway.",
  "home.conversion.sampleTimed": "Timed mocks",
  "home.conversion.sampleTimedDesc": "Full-length sessions live in the app after sign-in and checkout.",
  "home.conversion.sampleSignIn": "Sign in for mocks →",

  "home.conversion.faqHeading": "Stuff people ask before they pay",

  "home.conversion.faq1q": "What is included in a paid plan versus a free account?",
  "home.conversion.faq1a":
    "Free accounts can open starter question runs and public lesson hubs. Paid plans unlock the full bank for your tier, full lesson depth, timed mock exams with score history, flashcards tied to weak topics, planner and readiness views, and cross-session progress.",

  "home.conversion.faq2q": "Is NurseNest affiliated with NCLEX, NCSBN, or my provincial college?",
  "home.conversion.faq2a":
    "No. NurseNest is independent exam prep. Content is written for clinical judgment and exam-style framing; it is not endorsed by licensing or certification bodies.",

  "home.conversion.faq3q": "Will I see US and Canadian scope mixed together?",
  "home.conversion.faq3a":
    "You choose region and pathway up front. Banks and lessons filter to that context so delegation and scope language match the registration you are preparing for.",

  "home.conversion.faq4q": "What does “readiness” on the dashboard mean?",
  "home.conversion.faq4a":
    "Readiness blends recent accuracy, study volume, and optional exam-date pacing. It is a signal for what to study next, not a prediction of pass or fail.",

  "home.conversion.faq5q": "How do flashcards relate to the question bank?",
  "home.conversion.faq5a":
    "Missed items can feed weak-topic flashcard queues so facts you got wrong resurface on a schedule instead of fading after one session.",

  "home.conversion.faq6q": "Can I cancel my subscription?",
  "home.conversion.faq6a":
    "Yes. Manage billing from your account. You typically keep access through the period you already paid for; see current Terms for details.",

  "home.conversion.finalTitle": "Want the full loop, not just a preview?",
  "home.conversion.finalSub":
    "Free accounts open starter runs. Paid plans bring the full bank, timed mocks with saved scores, and history for your pathway.",
  "home.conversion.ctaSignup": "Start free trial",
  "home.conversion.ctaPricing": "View plans & pricing",
  "home.conversion.ctaTryFree": "Try RN practice questions",

  "pages.pricing.h1":
    "Pricing tied to your exam pathway, not a generic content bundle",
  "pages.pricing.intro":
    "Choose your segment and country. After checkout, that tier unlocks the full question bank, lessons, timed sessions, flashcards, planner, readiness, and score history for your registration context, without mixing in other scopes.",

  "pages.pricing.hero.trustLine":
    "Checkout is secure (Stripe). Access is tier-scoped server-side: what you bought is what appears in the bank and mocks.",
  "pages.pricing.hero.ctaTry5": "Run a short practice set first",
  "pages.pricing.hero.ctaWeak": "Open lesson hubs for weak systems",
  "pages.pricing.hero.ctaTry5Sub": "Public starter runs do not require a card.",
  "pages.pricing.hero.regionHint": "Pick the country that matches your registration and billing.",

  "pages.pricing.proof.title": "What a paid plan unlocks in the app",
  "pages.pricing.proof.line1": "Full question bank and rationales for the tier you purchased",
  "pages.pricing.proof.line2": "Lesson depth, timed mocks, and flashcards scoped to that pathway",
  "pages.pricing.proof.line3": "Saved sessions, streaks, planner, and readiness in one learner shell",

  "pages.pricing.micro.worry": "Unsure you are in the right bank?",
  "pages.pricing.micro.marks": "Choose RN, PN, NP, or allied and your country before you compare prices.",
  "pages.pricing.micro.lift": "Term lengths show total price and per-month equivalent before you pay.",

  "pages.pricing.get.title": "What you use after checkout",
  "pages.pricing.get.lead":
    "The same login covers lessons, the question bank, flashcards, study planner, readiness dashboard, and exam mode, filtered to the tier you paid for.",
  "pages.pricing.get.b0": "Pathway-scoped question bank with option-by-option rationales",
  "pages.pricing.get.b1": "Lesson modules aligned to your pathway tags",
  "pages.pricing.get.b2": "Spaced flashcards and weak-topic decks tied to your misses",
  "pages.pricing.get.b3": "Planner plus readiness signals (stronger when you add an exam date)",
  "pages.pricing.get.afterLesson": "After a lesson block,",
  "pages.pricing.get.linkLessons": "open matching questions",
  "pages.pricing.get.linkQuestions": "or queue a weak-topic set",
  "pages.pricing.get.afterQuestions": "When category scores stabilize,",
  "pages.pricing.get.linkExams": "schedule a timed mock",
  "pages.pricing.get.linkTools": "Clinical calculators stay free to use.",

  "pages.pricing.use.title": "How learners actually use the week",
  "pages.pricing.use.afterShiftTitle": "After a shift",
  "pages.pricing.use.afterShiftBody":
    "A short timed block with rationales. Note the weak category for a longer session on your day off.",
  "pages.pricing.use.weekendTitle": "Weekend block",
  "pages.pricing.use.weekendBody":
    "A lesson on a fragile system, then a half-length mock; review only what you flagged.",

  "pages.pricing.risk.title": "What we do not promise",
  "pages.pricing.risk.b0":
    "No prep product can guarantee a pass. Your form and preparation determine the outcome.",
  "pages.pricing.risk.b1": "Readiness and analytics are study aids, not certifications.",
  "pages.pricing.risk.b2": "Confirm eligibility, fees, and rules with your board directly.",

  "pages.pricing.objections.title": "Questions before you pay",

  "pages.pricing.objections.q0": "Can I try before I subscribe?",
  "pages.pricing.objections.a0":
    "Yes. Starter question runs and public lesson hubs are available without paying. Full bank depth, timed mocks with saved scores, and full history unlock with the plan that matches your tier.",

  "pages.pricing.objections.q1": "Will my content get mixed across countries or roles?",
  "pages.pricing.objections.a1":
    "No. You choose country and pathway; items and lessons stay filtered to that registration context.",

  "pages.pricing.objections.q2": "Is readiness a pass prediction?",
  "pages.pricing.objections.a2":
    "No. It combines recent performance signals to suggest what to study next. It is not a pass/fail forecast.",

  "pages.pricing.objections.q3": "How does cancellation work?",
  "pages.pricing.objections.a3":
    "Cancel from your account billing area. Access usually continues through the period you already paid for; see Terms for the current policy.",

  "pages.pricing.compare.title": "NurseNest vs piecing together separate tools",
  "pages.pricing.compare.colNn": "NurseNest",
  "pages.pricing.compare.colTypical": "Typical fragmented prep",
  "pages.pricing.compare.row0": "Single learner shell for bank, lessons, mocks, planner",
  "pages.pricing.compare.nn0": "Yes: one account and shared topic tags",
  "pages.pricing.compare.ty0": "Often 2–3 vendors and manual tracking",
  "pages.pricing.compare.row1": "Rationale depth on distractors",
  "pages.pricing.compare.nn1": "In-product for scored items",
  "pages.pricing.compare.ty1": "Often thin or paywalled explanations",
  "pages.pricing.compare.row2": "Weak-area routing across sessions",
  "pages.pricing.compare.nn2": "Category and miss patterns feed next steps",
  "pages.pricing.compare.ty2": "Score-only or spreadsheet DIY",
  "pages.pricing.compare.row3": "Exam-style stems (incl. NGN-style where relevant)",
  "pages.pricing.compare.nn3": "Aligned to pathway framing",
  "pages.pricing.compare.ty3": "Mixed quality or generic pools",
  "pages.pricing.compare.row4": "Timed mocks on the same platform",
  "pages.pricing.compare.nn4": "Yes, with tier-scoped pools",
  "pages.pricing.compare.ty4": "Often a separate purchase or none",

  "pages.pricing.plan.outcomeA": "Full bank, lessons, and mocks for your purchased tier",
  "pages.pricing.plan.outcomeB": "Flashcards and weak-topic routing from your misses",
  "pages.pricing.plan.outcomeC": "Planner, readiness, and history in the learner dashboard",
  "pages.pricing.plan.bestValue": "Best value",
  "pages.pricing.plan.mostPopular": "Most popular",

  "pages.pricing.duration.position.monthly": "Flexible if your test window is still moving",
  "pages.pricing.duration.position.3month": "Fits many 10–12 week sprint schedules",
  "pages.pricing.duration.position.6month": "Room for school, work, and steady reps",
  "pages.pricing.duration.position.yearly": "Lowest per-month cost for long-horizon prep",

  "pages.pricing.checkout.startPlan": "Continue to secure checkout",
  "pages.pricing.billing.recurringDisclosure":
    "Paid plans renew automatically on each billing date until you cancel. You can cancel from your account billing portal before the next charge; access continues through the end of the paid period.",
  "pages.pricing.checkout.recurringShort":
    "Subscriptions renew until canceled. See Terms, Privacy, and Refund Policy.",
  "pages.pricing.checkout.policyAckStart": "I agree to the ",
  "pages.pricing.checkout.policyTermsLabel": "Terms of Service",
  "pages.pricing.checkout.policyAckBetween1": ", the ",
  "pages.pricing.checkout.policyPrivacyLabel": "Privacy Policy",
  "pages.pricing.checkout.policyAckBetween2": ", and the ",
  "pages.pricing.checkout.policyRefundLabel": "Refund Policy",
  "pages.pricing.checkout.policyAckEnd": ".",
  "pages.pricing.checkout.mustAcceptPolicies":
    "Please confirm the Terms, Privacy Policy, and Refund Policy before continuing to checkout.",
  "pages.pricing.cta.startPractice": "Try another practice set",

  "pages.pricing.social.passRateLine":
    "Learners who keep a weekly rhythm (questions, rationales, then timed blocks) often feel steadier as test day approaches. Your results depend on how consistently you use the tools.",
  "pages.pricing.social.pricingFooterLine":
    "One subscription covers the bank, lessons, mocks, and performance history for your tier so you are not stitching vendors together the week before the exam.",

  "home.productProof.title": "Proof in the product",
  "home.productProof.sub":
    "The counts on the homepage pull from the live library. The panels below are a static example of how rationales and category tags read after a set.",
  "home.productProof.sessionLabel": "Session report",
  "home.productProof.sessionPctExample": "68%",
  "home.productProof.sessionSub": "Last 20 items · Pharmacology (example bucket)",
  "home.productProof.needsReview": "Needs review",
  "home.productProof.priorityRisk": "Priority risk",
  "home.productProof.priorityExample": "Fluid deficit / perfusion (sample tag)",
  "home.productProof.trend": "Trend",
  "home.productProof.trendExample": "+6% vs last set",
  "home.productProof.chartCaption": "Bars are example score blocks, not live data.",
  "home.productProof.rationaleLabel": "Rationale",
  "home.productProof.rationaleTitle": "After a wrong answer",
  "home.productProof.rationaleBody":
    "A strong rationale names the decision rule, cites the cue in the stem, and states why the distractors fail. You should see that pattern on every scored item, not a generic pep talk.",
  "home.productProof.stemLabel": "Clinical stem",
  "home.productProof.stemQuote":
    "“Adult post-op day 2 after bowel resection. BP 92/58, HR 112, urine 15 mL last hour. Next step?”",
  "home.productProof.stemNote": "This is where students often rush past volume status.",
  "home.productProof.statsLine": "{{questions}} practice items · {{lessons}} lessons in rotation (pathway mix varies)",
};

const raw = fs.readFileSync(enPath, "utf8");
const bundle = JSON.parse(raw);
Object.assign(bundle, patch);
fs.writeFileSync(enPath, JSON.stringify(bundle));
console.log(`Merged ${Object.keys(patch).length} keys into ${enPath}`);
