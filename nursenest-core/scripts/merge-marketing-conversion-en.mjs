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
  "home.hero.mainTitle":
    "Pass your nursing exam with a fully guided system — not just a question bank",
  "home.hero.newSubheadline":
    "Pathway-scoped questions with option-level rationales, spaced flashcards, an adaptive study planner, and readiness tracking in one learner shell. Lessons and timed mocks sit beside the bank so you rehearse judgment, not isolated facts.",
  "home.hero.quickEntryLabel": "Jump in without hunting menus",
  "home.hero.trustMicroBadge": "US & Canadian scopes kept separate",
  "home.hero.authorityBadge": "Rationale on every scored option",
  "home.hero.ctaPrimary": "Start free trial",
  "home.hero.ctaSecondary": "Browse practice questions",
  "home.hero.ctaInstant": "Start practicing instantly",
  "home.hero.ctaInstantHint": "Opens a short practice path—free account, no card to start your preview runs.",
  "home.hero.urgencyMicrocopy":
    "Pick RN, PN, NP, or allied and your country first—stems, delegation language, and lesson tags stay aligned to that registration.",

  "home.howItWorks.title": "How it works",
  "home.howItWorks.sub": "Three steps from sign-up to a study rhythm you can keep until test day.",
  "home.howItWorks.step1Title": "Choose your exam and region",
  "home.howItWorks.step1Body":
    "RN, PN, NP, or allied—US or Canada—so the bank, lessons, and scope language match what you will sit for.",
  "home.howItWorks.step2Title": "Train with questions and rationales",
  "home.howItWorks.step2Body":
    "Every scored option explains why it passes or fails clinically. Misses roll into categories you can target with the next set.",
  "home.howItWorks.step3Title": "Let the planner and readiness guide reps",
  "home.howItWorks.step3Body":
    "Add your exam date for pacing, use flashcards for weak facts, and read readiness as a next-study signal—not a guarantee.",

  "home.featuresStack.title": "What you get in one subscription",
  "home.featuresStack.lead":
    "Bank, lessons, cards, planner, and dashboard are wired together—same tags, same weak-area lists, no tab-hopping between vendors.",
  "home.featuresStack.questionBankTitle": "Question bank",
  "home.featuresStack.questionBankBody":
    "Pathway-scoped items with category tags; subscribers get the full pool for their tier plus full rationales and history.",
  "home.featuresStack.lessonsTitle": "Lessons",
  "home.featuresStack.lessonsBody":
    "Blueprint-aligned modules for your track—use them when a category keeps failing, not as a substitute for stems.",
  "home.featuresStack.flashcardsTitle": "Flashcards",
  "home.featuresStack.flashcardsBody":
    "Spaced repetition for weak-topic facts pulled from your misses so memorization meets application the same week.",
  "home.featuresStack.plannerTitle": "Adaptive study planner",
  "home.featuresStack.plannerBody":
    "Schedule blocks around your exam date and shift workload; the planner nudges what to run next when your categories drift.",
  "home.featuresStack.readinessTitle": "Readiness system",
  "home.featuresStack.readinessBody":
    "Blends recent accuracy, volume, and pacing—so you know what to study next, not a black-box score.",
  "home.featuresStack.ctaQuestions": "Open practice questions",
  "home.featuresStack.ctaPricing": "Compare plans",

  "home.gateway.title": "Start from the exam you are registered for",
  "home.gateway.subtitle":
    "Nursing and allied hubs link the same-pathway question bank, lessons, and pricing. Pick US or Canada first so scope and delegation language match your authorization.",
  "home.gateway.regionHint": "Filters content to this region",
  "home.gateway.badgePrimary": "Nursing: licensure & progression",
  "home.gateway.quickLinks": "Practice, lessons, and hubs",
  "home.gateway.frictionNote":
    "A free account opens starter runs and previews. A paid plan unlocks the full bank for your tier, lesson depth, timed mocks, saved history, and weak-area tools.",

  "home.conversion.whyHeading": "Why use NurseNest instead of three different apps",
  "home.conversion.whySub":
    "Topic tags connect the bank, lessons, and flashcards—so weak-area lists, your planner, and readiness signals point at the same gaps.",

  "home.conversion.why1Title": "Pathway-scoped banks",
  "home.conversion.why1Body":
    "RN, PN, NP, and allied pools stay separated. You are not studying US delegation language when you sit a Canadian exam—or PN pharmacology mixed into RN management stems.",

  "home.conversion.why2Title": "Distractor-level rationales",
  "home.conversion.why2Body":
    "Each item explains why the keyed answer is safest and where each wrong option fails clinically—so you practice elimination, not letter memorization.",

  "home.conversion.why3Title": "Mocks and adaptive-style practice together",
  "home.conversion.why3Body":
    "Timed exams and CAT-style runs (where enabled) live next to category accuracy—so you move from drills to full-length sessions without exporting spreadsheets.",

  "home.conversion.why4Title": "Readiness you can explain to yourself",
  "home.conversion.why4Body":
    "The dashboard blends accuracy, streaks, and optional exam-date pacing—study signals to prioritize your next block, not a board score guarantee.",

  "home.conversion.previewHeading": "Inside the learner experience",
  "home.conversion.previewSub":
    "Dashboard for next steps and weak topics; bank for timed or untimed sets. Screenshots track the live product as it evolves.",
  "home.conversion.previewCaptionDash": "Dashboard: next steps, streaks, and weak-topic nudges",
  "home.conversion.previewCaptionBank": "Question bank: stems, rationales, and session progress",
  "home.conversion.previewSignupHint": "Create a free account to open starter runs and see how rationales render on your device.",

  "home.conversion.pathwaysHeading": "Pathway hubs (Canada & United States)",
  "home.conversion.pathwaysSub":
    "Each hub connects questions, lessons, and pathway-specific pricing—open the track that matches your registration.",

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

  "home.conversion.faqHeading": "Straight answers before you commit",

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
    "Readiness blends recent accuracy, study volume, and optional exam-date pacing. It is a signal for what to study next—not a prediction of pass or fail.",

  "home.conversion.faq5q": "How do flashcards relate to the question bank?",
  "home.conversion.faq5a":
    "Missed items can feed weak-topic flashcard queues so facts you got wrong resurface on a schedule instead of fading after one session.",

  "home.conversion.faq6q": "Can I cancel my subscription?",
  "home.conversion.faq6a":
    "Yes—manage billing from your account. You typically keep access through the period you already paid for; see current Terms for details.",

  "home.conversion.finalTitle": "Ready to prep with the full system?",
  "home.conversion.finalSub":
    "Start a free trial to unlock starter runs, then upgrade for the full bank, timed mocks, and saved progress for your pathway.",
  "home.conversion.ctaSignup": "Start free trial",
  "home.conversion.ctaPricing": "View plans & pricing",
  "home.conversion.ctaTryFree": "Try RN practice questions",

  "pages.pricing.h1": "Pricing tied to your exam pathway—not a generic content bundle",
  "pages.pricing.intro":
    "Choose your segment and country. After checkout, that tier unlocks the full question bank, lessons, timed sessions, flashcards, planner, readiness, and score history for your registration context—without mixing in other scopes.",

  "pages.pricing.hero.trustLine":
    "Checkout is secure (Stripe). Access is tier-scoped server-side—what you bought is what appears in the bank and mocks.",
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
    "The same login covers lessons, the question bank, flashcards, study planner, readiness dashboard, and exam mode—filtered to the tier you paid for.",
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
    "A short timed block with rationales—note the weak category for a longer session on your day off.",
  "pages.pricing.use.weekendTitle": "Weekend block",
  "pages.pricing.use.weekendBody":
    "A lesson on a fragile system, then a half-length mock; review only what you flagged.",

  "pages.pricing.risk.title": "What we do not promise",
  "pages.pricing.risk.b0": "No prep product can guarantee a pass—your form and preparation determine the outcome.",
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
  "pages.pricing.compare.nn0": "Yes—one account and shared topic tags",
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
  "pages.pricing.cta.startPractice": "Try another practice set",

  "pages.pricing.social.passRateLine":
    "Learners who keep a weekly rhythm—questions, rationales, then timed blocks—often feel steadier as test day approaches. Your results depend on how consistently you use the tools.",
  "pages.pricing.social.pricingFooterLine":
    "One subscription covers the bank, lessons, mocks, and performance history for your tier so you are not stitching vendors together the week before the exam.",

  "home.productProof.title": "Proof in the product",
  "home.productProof.sub":
    "Live library scale updates on the homepage; session panels below illustrate how rationales and category tags behave after each set.",
  "home.productProof.sessionLabel": "Session report",
  "home.productProof.sessionSub": "Last 20 items · example category",
  "home.productProof.needsReview": "Needs review",
  "home.productProof.priorityRisk": "Priority risk",
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
