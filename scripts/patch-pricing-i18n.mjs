/**
 * One-off merge of pricing conversion copy into en.json (no em dashes in UI strings).
 * Run: node scripts/patch-pricing-i18n.mjs
 */
import fs from "node:fs";

const path = new URL("../public/i18n/en.json", import.meta.url).pathname;
const o = JSON.parse(fs.readFileSync(path, "utf8"));

const patch = {
  "pages.pricing.h1": "Know exactly what to study before your exam",
  "pages.pricing.intro":
    "Start with a quick test. See your weak areas. Build a plan that actually improves your score.",
  "pages.pricing.description":
    "NurseNest plans by exam pathway and country: practice questions, lessons, timed exams, and score history. Try free questions before you subscribe.",
  "pages.pricing.institutionalBanner":
    "Programs and schools: volume licensing, cohort seats, and admin-friendly rollout. See institutional pricing.",
  "pages.pricing.hero.trustLine": "Used by nursing students preparing for NCLEX, REx-PN, and NP exams",
  "pages.pricing.hero.ctaTry5": "Try 5 questions free",
  "pages.pricing.hero.ctaTry5Sub": "No account required to start",
  "pages.pricing.hero.ctaWeak": "See your weak areas",
  "pages.pricing.hero.regionHint": "Links use your region preference from the header toggle when you are signed out.",

  "pages.pricing.proof.title": "What actually changes when you use this",
  "pages.pricing.proof.line1": "You stop guessing which topics to review",
  "pages.pricing.proof.line2": "You see why your answer was wrong right after you submit",
  "pages.pricing.proof.line3": "You can track weak categories over time instead of one overall percent",

  "pages.pricing.get.title": "What you actually get",
  "pages.pricing.get.lead":
    "After each question you get a scored item, a rationale, and a category tag. That is how the report learns what to nag you about next.",
  "pages.pricing.get.b0": "Question bank: pathway-scoped items with rationales tied to the stem",
  "pages.pricing.get.b1": "Score report: category flags and rolling accuracy, not vanity metrics",
  "pages.pricing.get.b2": "Progress: you see whether misses are random or repeating in one topic",
  "pages.pricing.get.b3": "Timed exams: full-length or section mocks when you are ready to test pace",
  "pages.pricing.get.afterLesson":
    "After reviewing a lesson, try practice questions on the same topic so the stem style matches what you just read.",
  "pages.pricing.get.afterQuestions":
    "When questions feel shaky, open timed practice exams to see if the problem is knowledge or time.",
  "pages.pricing.get.linkLessons": "Exam lesson hubs",
  "pages.pricing.get.linkQuestions": "Start practice questions",
  "pages.pricing.get.linkExams": "Practice exams (sign in)",
  "pages.pricing.get.linkTools": "Study tools",

  "pages.pricing.use.title": "How people actually use this",
  "pages.pricing.use.afterShiftTitle": "After a long shift",
  "pages.pricing.use.afterShiftBody":
    "Ten questions, skim rationales on misses, save one topic for the weekend. No heroics, just reps.",
  "pages.pricing.use.weekendTitle": "Weekend review",
  "pages.pricing.use.weekendBody":
    "One mock exam, read the category breakdown, then Monday you drill only what dropped.",

  "pages.pricing.objections.title": "Before you subscribe",
  "pages.pricing.objections.q0": "Do I need this if I already studied?",
  "pages.pricing.objections.a0":
    "If you already know every weak category and your timed scores are stable, you might not. Most people use NurseNest to find the gaps they stopped noticing.",
  "pages.pricing.objections.q1": "What if I fail practice tests?",
  "pages.pricing.objections.a1":
    "That is signal, not verdict. The point is to fail in practice and read why, then rerun the same category until the pattern changes.",
  "pages.pricing.objections.q2": "How is this different from free question banks?",
  "pages.pricing.objections.a2":
    "Same-day rationales, pathway-scoped banks, and reports that tie misses to categories. Free PDFs rarely give you that loop in one place.",
  "pages.pricing.objections.q3": "Can I cancel?",
  "pages.pricing.objections.a3":
    "Yes. Billing is through Stripe; you can cancel from your account before the next renewal. See checkout for current terms.",

  "pages.pricing.risk.title": "Try before you commit",
  "pages.pricing.risk.b0": "Start with free questions on many pathways",
  "pages.pricing.risk.b1": "Cancel anytime before renewal",
  "pages.pricing.risk.b2": "Secure checkout with Stripe",

  "pages.pricing.compare.title": "NurseNest vs typical question banks",
  "pages.pricing.compare.colNn": "NurseNest",
  "pages.pricing.compare.colTypical": "Typical free banks",
  "pages.pricing.compare.row0": "Adaptive or filtered practice modes",
  "pages.pricing.compare.row1": "Rationale depth tied to each distractor",
  "pages.pricing.compare.row2": "Weak-area tracking by category",
  "pages.pricing.compare.row3": "Clinical judgment and priority-style stems",
  "pages.pricing.compare.row4": "Timed exam simulations on the same platform",
  "pages.pricing.compare.nn0": "Yes, pathway-scoped",
  "pages.pricing.compare.nn1": "Yes, in product",
  "pages.pricing.compare.nn2": "Yes, in reports",
  "pages.pricing.compare.nn3": "Yes, exam-style",
  "pages.pricing.compare.nn4": "Yes, when included in tier",
  "pages.pricing.compare.ty0": "Varies",
  "pages.pricing.compare.ty1": "Often thin or missing",
  "pages.pricing.compare.ty2": "Rarely structured",
  "pages.pricing.compare.ty3": "Mixed quality",
  "pages.pricing.compare.ty4": "Often separate or none",

  "pages.pricing.duration.position.monthly": "Best for a short ramp before a date you already picked",
  "pages.pricing.duration.position.3month": "Best when your exam window is one season away",
  "pages.pricing.duration.position.6month": "Best for steady building without cramming",
  "pages.pricing.duration.position.yearly": "Best for full exam prep and lowest monthly cost",

  "pages.pricing.plan.outcomesHeading": "What you are buying",
  "pages.pricing.plan.outcomeA": "Spot weak areas quickly",
  "pages.pricing.plan.outcomeB": "Practice exam-style questions with rationales",
  "pages.pricing.plan.outcomeC": "Track progress over time in categories",

  "pages.pricing.checkout.startPlan": "Start this plan",
  "pages.pricing.micro.worry": "Most people wait too long to test weak areas",
  "pages.pricing.micro.marks": "You will see where you are losing marks",
  "pages.pricing.micro.lift": "This is where scores usually improve once you repeat the same category",

  "pages.pricing.social.passRateLine":
    "Learners who keep a weekly rhythm (questions, rationales, timed blocks) tend to feel steadier as the test date gets close.",
  "pages.pricing.social.pricingFooterLine":
    "One subscription covers the bank, lessons, timed practice, and performance history so you are not stitching together three different sites.",

  "pages.pricing.narrative.variant.urgencyLine":
    "Lock in a weekly question-and-rationale rhythm now. Consistent reps beat last-minute cramming.",

  "pages.pricing.narrative.allied.headlineUrgency":
    "Allied health exam prep anchored in clinical reasoning. Start your pass-focused sprint.",
  "pages.pricing.narrative.lvn_lpn.headlineUrgency":
    "NCLEX-PN prep that prioritizes safety and scope. Start your pass-focused sprint.",
  "pages.pricing.narrative.np.headlineUrgency":
    "NP exam prep with differential depth and management rigor. Start your advanced-practice sprint.",
  "pages.pricing.narrative.rn.headlineUrgency":
    "NCLEX-RN readiness: judgment, pharmacology, and stamina. Start your pass-focused sprint.",
  "pages.pricing.narrative.rpn.headlineUrgency":
    "Pass the REx-PN with practice that feels like exam day. Start your pass-focused sprint.",
};

Object.assign(o, patch);
fs.writeFileSync(path, JSON.stringify(o));
console.log("Patched", Object.keys(patch).length, "keys");
