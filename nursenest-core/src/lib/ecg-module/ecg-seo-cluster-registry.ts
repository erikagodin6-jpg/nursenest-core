/**
 * ECG SEO Cluster Registry — Unified Source of Truth
 *
 * This file is the single authoritative source from which ALL of these derive:
 *   - Cluster routes (/ecg/[topic]) → sitemap entries
 *   - Internal-link generation (pillar page → cluster links)
 *   - Breadcrumb generation
 *   - Topic CTA rendering
 *
 * Migration from ecg-seo-cluster.ts:
 *   This registry extends EcgClusterTopic with:
 *   - tier: maps to ECG platform tier (core_ecg, advanced_ecg, pediatric_ecg)
 *   - schemaType: the schema.org type(s) for this cluster page
 *   - sitemapPriority: sitemap priority weight
 *   - internalLinkLabel: the label used when other pages link to this cluster
 *   - prerequisiteSlug: if this topic should follow another (for internal linking order)
 *
 * Architecture rules:
 *   1. Every slug must be unique across the registry.
 *   2. Every slug must be kebab-case.
 *   3. No slug may conflict with a marketing page path (/ecg-interpretation, /ecg-telemetry-mastery, etc.).
 *   4. All cluster pages must have sitemapPriority > 0 to appear in the sitemap.
 *   5. Contract test (ecg-route-existence.contract.test.ts) validates that all cluster
 *      slugs generate routes with existing page files.
 */

import type { EcgClusterTopic } from "./ecg-seo-cluster";
import type { EcgPlatformTier } from "./ecg-platform-taxonomy";

// ─── Extended cluster entry type ───────────────────────────────────────────────

export type EcgClusterRegistryEntry = EcgClusterTopic & {
  /** Platform tier — determines sitemap segment and educational framing. */
  tier: EcgPlatformTier;
  /** Schema.org types for this cluster page. */
  schemaTypes: ReadonlyArray<"Article" | "FAQPage" | "Course">;
  /** Sitemap priority (0.0–1.0). Must be > 0 for sitemapped entries. */
  sitemapPriority: number;
  /**
   * The label used when the /ecg pillar page links to this cluster topic.
   * Should be concise (< 40 chars) and clearly describe the topic.
   */
  internalLinkLabel: string;
  /** Slug of the topic this one should follow in reading order (for sequential internal linking). */
  prerequisiteSlug?: string;
};

// ─── Registry ─────────────────────────────────────────────────────────────────

// Re-export the existing cluster for backward compat —
// the full registry is assembled below.
export { ECG_CLUSTER_TOPICS, getEcgClusterTopic, getAllEcgClusterSlugs } from "./ecg-seo-cluster";

/**
 * NEW cluster topics added in the platform hardening sprint (2026-05-15).
 * These extend the existing 10 topics with core rhythms, pediatric content,
 * and critical care patterns.
 */
const ADDITIONAL_CLUSTER_TOPICS: EcgClusterRegistryEntry[] = [
  {
    slug: "sinus-tachycardia",
    title: "Sinus Tachycardia — ECG Recognition & Clinical Causes",
    description:
      "Sinus tachycardia ECG features, clinical causes, and nursing assessment. Rate > 100, upright P waves, distinction from SVT and atrial flutter.",
    h1: "Sinus tachycardia: ECG recognition, causes, and nursing assessment",
    keywords: ["sinus tachycardia ECG nursing", "sinus tachycardia vs SVT", "tachycardia ECG nursing"],
    sections: [
      {
        id: "ecg-features",
        heading: "ECG features of sinus tachycardia",
        content:
          "Sinus tachycardia is defined by: (1) rate > 100 bpm, (2) upright sinus P-waves before every QRS in lead II, (3) consistent PR interval (normal or slightly shortened at very fast rates), (4) narrow QRS unless bundle branch block or aberrancy is present. The rhythm is regular, though at very fast rates the RR intervals may become slightly variable. The rate typically responds to clinical state — it decreases when the underlying cause is treated.",
      },
      {
        id: "causes",
        heading: "Clinical causes and nursing assessment",
        content:
          "Sinus tachycardia is ALWAYS physiologically driven — the SA node is responding to sympathetic stimulation or reduced vagal tone. Common causes include: fever (each degree C raises HR by ~8–10 bpm), pain, anxiety, dehydration/hypovolemia, anemia, hypoxia, pulmonary embolism, sepsis, thyrotoxicosis, stimulant medications (epinephrine, dopamine, albuterol), and hyperdynamic cardiac states post-surgery. The nursing assessment must identify the CAUSE — treating the rate without treating the cause is insufficient and potentially dangerous.",
      },
    ],
    faq: [
      { question: "How do you distinguish sinus tachycardia from SVT?", answer: "Sinus tachycardia has identifiable upright P-waves before every QRS and a rate that responds to the patient's clinical state. SVT is typically > 150 bpm, has absent or retrograde P-waves, is regular with a fixed rate regardless of activity, and terminates abruptly. At rates 140–180, the distinction can be difficult — if P-waves are identified, it is sinus tachycardia." },
      { question: "Should you give beta-blockers for sinus tachycardia?", answer: "Not as a first line. Sinus tachycardia is compensatory — the heart is working harder for a reason. Giving beta-blockers reduces the compensatory response and can mask or worsen the underlying condition (e.g., rate control in tachycardia from hypovolemia reduces cardiac output further). Identify and treat the cause first." },
    ],
    tier: "core_ecg",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.72,
    internalLinkLabel: "Sinus Tachycardia",
  },
  {
    slug: "sinus-bradycardia",
    title: "Sinus Bradycardia — ECG Features & Clinical Significance",
    description:
      "Sinus bradycardia ECG recognition, causes, and when to escalate. Rate < 60, sinus P-waves, Mobitz vs vagal distinction, and ACLS pacing threshold.",
    h1: "Sinus bradycardia: ECG features, causes, and escalation thresholds",
    keywords: ["sinus bradycardia ECG nursing", "bradycardia causes nursing", "atropine bradycardia nursing"],
    sections: [
      {
        id: "ecg-features",
        heading: "ECG features and recognition",
        content: "Sinus bradycardia: rate < 60 bpm, upright sinus P-waves before every QRS, consistent PR interval, narrow QRS. The rhythm is regular. All P-waves conduct — there are no dropped beats (which would indicate AV block). The key question for clinical management is not the rate alone, but whether the patient is symptomatic and whether the cause is reversible.",
      },
      {
        id: "causes-escalation",
        heading: "Causes and escalation",
        content: "Benign causes (no treatment): athletes (high vagal tone), sleeping, inferior MI with nodal artery ischemia (usually resolves), medications (beta-blockers, calcium channel blockers, digoxin). Treatment-requiring causes: hemodynamically significant bradycardia (hypotension, syncope, chest pain, altered mentation) — atropine 0.5mg IV. Mobitz II and complete heart block presenting as slow rhythm: prepare for pacing, atropine unreliable.",
      },
    ],
    faq: [
      { question: "When does sinus bradycardia require atropine?", answer: "When symptomatic: hypotension, syncope, altered consciousness, chest pain from ischemia. Asymptomatic sinus bradycardia in a well-perfused, alert patient (even at 45 bpm) does not require intervention. Atropine 0.5mg IV is first-line for hemodynamically significant bradycardia, up to 3mg total." },
      { question: "Is atropine effective for Mobitz II?", answer: "Atropine is a vagolytic — it works at the AV node. Mobitz II is an infranodal block (bundle branches), where atropine has limited and unpredictable effect. Do not rely on atropine for Mobitz II — prepare for transcutaneous pacing." },
    ],
    tier: "core_ecg",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.72,
    internalLinkLabel: "Sinus Bradycardia",
    prerequisiteSlug: "sinus-tachycardia",
  },
  {
    slug: "respiratory-sinus-arrhythmia",
    title: "Respiratory Sinus Arrhythmia — Normal Pediatric ECG Variant",
    description:
      "Respiratory sinus arrhythmia explained: normal physiologic R-R variation in children, distinction from AFib and PACs, vagal tone, and when to reassure vs escalate.",
    h1: "Respiratory sinus arrhythmia: normal pediatric ECG variation, not arrhythmia",
    keywords: ["respiratory sinus arrhythmia nursing", "RSA ECG children", "irregular rhythm children normal"],
    sections: [
      {
        id: "mechanism",
        heading: "Mechanism and clinical significance",
        content: "Respiratory sinus arrhythmia is a normal physiologic variation in heart rate caused by vagal tone fluctuations during the respiratory cycle. During inspiration, venous return increases, activating the Bainbridge reflex, which inhibits vagal tone — heart rate increases, R-R shortens. During expiration, vagal tone is restored — heart rate slows, R-R lengthens. The result is a smooth sinusoidal variation in R-R intervals that correlates exactly with the respiratory cycle. This is a sign of healthy autonomic function and is most prominent in children and athletes.",
      },
      {
        id: "distinguishing",
        heading: "Distinguishing RSA from AFib and PACs",
        content: "RSA: uniform upright sinus P-waves before every QRS, no dropped beats, smooth gradual R-R variation linked to breathing. AFib: no organized P-waves, chaotic random R-R variation without respiratory correlation. PACs: premature beats with abnormal P-wave morphology — RSA has no premature beats. Confirm by observing the child breathe: if the rate speeds up with inspiration and slows with expiration, it is RSA.",
      },
    ],
    faq: [
      { question: "Does RSA require treatment?", answer: "No. RSA is a normal physiologic finding. The correct clinical response is documentation as a normal variant and reassurance to the patient and family. No monitoring escalation, no cardiology referral, no intervention." },
      { question: "When does RSA require escalation?", answer: "RSA alone almost never requires escalation. The one exception: if the longest R-R pause within RSA exceeds 2.5 seconds, document and notify the provider — this warrants investigation for underlying SA node dysfunction. RSA with pauses ≤ 2.5 seconds is always benign." },
    ],
    tier: "pediatric_ecg",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.72,
    internalLinkLabel: "Respiratory Sinus Arrhythmia",
  },
  {
    slug: "svt-recognition",
    title: "SVT Recognition — Supraventricular Tachycardia for Nurses",
    description:
      "SVT ECG recognition, vagal maneuvers, adenosine administration, and cardioversion thresholds. Narrow-complex tachycardia differential for RN and NP nurses.",
    h1: "SVT recognition: narrow-complex tachycardia, vagal maneuvers, and adenosine for nurses",
    keywords: ["SVT recognition nursing", "supraventricular tachycardia nursing", "adenosine SVT nursing", "narrow complex tachycardia nursing"],
    sections: [
      {
        id: "ecg-features",
        heading: "SVT ECG features",
        content: "SVT (typically AVNRT in adults) presents as: (1) regular narrow-complex tachycardia at 150–250 bpm, (2) P-waves absent or retrograde (buried in or after the QRS as pseudo-S wave in inferior leads), (3) abrupt onset and termination ('all or nothing'), (4) rate does not vary with activity. Narrow QRS (< 120ms) unless aberrant conduction is present. The key discriminators from sinus tachycardia: absence of identifiable sinus P-waves, rate fixed regardless of state, abrupt onset history.",
      },
      {
        id: "management",
        heading: "Management: vagal maneuvers and adenosine",
        content: "Hemodynamically stable: vagal maneuvers first (Valsalva, carotid sinus massage for older adults, carotid massage or modified Valsalva with leg elevation). Then adenosine 6mg IV rapid bolus + immediate 20mL NS flush via proximal IV. Second dose: 12mg. Adenosine terminates AVNRT/AVRT abruptly by blocking AV node conduction. Hemodynamically unstable: synchronized cardioversion 50–100J. Never give adenosine for WPW with rapid preexcited AFib.",
      },
    ],
    faq: [
      { question: "Why must adenosine be given as a rapid push?", answer: "Adenosine has a half-life of under 10 seconds — it is metabolized almost immediately. If given slowly or through a distal IV site, it is broken down before reaching the AV node in therapeutic concentration. Rapid bolus push + immediate 20mL NS flush through the most proximal IV available is essential for efficacy." },
      { question: "What is the modified Valsalva maneuver?", answer: "Standard Valsalva: patient bears down against a closed glottis. Modified (2015 REVERT trial): standard Valsalva in a semi-recumbent position, followed immediately by placing the patient supine with legs raised to 45°. This enhances venous return and vagal response, increasing termination rate from ~17% to ~43%." },
    ],
    tier: "core_ecg",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.75,
    internalLinkLabel: "SVT Recognition",
  },
  {
    slug: "atrial-fibrillation-nursing",
    title: "Atrial Fibrillation — ECG Recognition & Nursing Management",
    description:
      "AFib ECG recognition, irregularly irregular R-R intervals, absent P-waves, rate control vs rhythm control, anticoagulation priorities, and cardioversion indications for nurses.",
    h1: "Atrial fibrillation for nurses: ECG recognition, rate control, and anticoagulation priorities",
    keywords: ["atrial fibrillation ECG nursing", "AFib rate control nursing", "AFib cardioversion nursing", "atrial fibrillation anticoagulation nursing"],
    sections: [
      {
        id: "ecg-recognition",
        heading: "AFib ECG recognition",
        content: "Atrial fibrillation: (1) irregularly irregular R-R intervals — no two consecutive R-R intervals are equal, (2) absent organized P-waves — replaced by fine fibrillatory baseline (350–600 atrial impulses/min), (3) narrow QRS unless bundle branch block or aberrant conduction. The 'irregularly irregular' pattern is the defining feature — even single brief periods of regularity should prompt re-evaluation.",
      },
      {
        id: "clinical-priorities",
        heading: "Clinical priorities: rate control, rhythm control, anticoagulation",
        content: "Acute priorities: (1) hemodynamic assessment — unstable (hypotension, altered mentation) → synchronized cardioversion; stable → pharmacologic rate control. (2) Duration assessment — onset < 48 hours → lower stroke risk, cardioversion safer; unknown or > 48 hours → anticoagulate before cardioversion. Rate control targets: resting HR < 80–110 bpm. IV metoprolol or diltiazem for rapid control; avoid non-dihydropyridine CCBs in HFrEF. Anticoagulation: CHA₂DS₂-VASc score drives decision. Score ≥ 2 (men) or ≥ 3 (women) → anticoagulation indicated.",
      },
    ],
    faq: [
      { question: "What is AFib with RVR?", answer: "AFib with rapid ventricular response (RVR) is atrial fibrillation where the ventricular rate exceeds 100–110 bpm. It causes increased oxygen demand, decreased diastolic filling time, and reduced cardiac output. It requires rate control. Causes of RVR: new-onset trigger (infection, PE, thyrotoxicosis, alcohol, post-surgery), medication non-compliance, or breakthrough RVR despite rate-control therapy." },
      { question: "When is cardioversion safe without anticoagulation?", answer: "If AFib onset is definitely < 48 hours (confirmed by history and documentation) and the patient has no structural heart disease or thrombus risk factors, cardioversion can be performed without prolonged anticoagulation. TEE (transesophageal echo) to rule out left atrial appendage thrombus allows earlier cardioversion in longer-duration AFib. In all cases, post-cardioversion anticoagulation continues for at least 4 weeks." },
    ],
    tier: "core_ecg",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.78,
    internalLinkLabel: "Atrial Fibrillation",
  },
  {
    slug: "av-block-overview",
    title: "AV Block — Complete Guide for Nurses (1st, 2nd, 3rd Degree)",
    description:
      "AV block guide for nurses: first-degree, Mobitz I (Wenckebach), Mobitz II, and complete (third-degree) heart block ECG features, clinical significance, and pacing indications.",
    h1: "AV block for nurses: first-degree through complete heart block — ECG features and pacing decisions",
    keywords: ["AV block nursing", "heart block ECG nursing", "Wenckebach nursing", "complete heart block nursing", "pacemaker AV block nursing"],
    sections: [
      {
        id: "first-second-degree",
        heading: "First-degree and second-degree AV blocks",
        content: "First-degree: PR > 200ms, all beats conduct — usually benign. Second-degree Mobitz I (Wenckebach): progressive PR prolongation until dropped beat, reset — nodal level, usually benign. Second-degree Mobitz II: constant PR before sudden dropped QRS — infranodal, DANGEROUS, requires pacemaker evaluation regardless of symptoms. 2:1 block: PR analysis impossible; QRS width discriminates (narrow → likely Mobitz I, wide → likely Mobitz II).",
      },
      {
        id: "complete-heart-block",
        heading: "Complete (third-degree) heart block: AV dissociation and escape rhythms",
        content: "Complete heart block: P-waves march at sinus rate, QRS complexes march at escape rhythm rate, completely dissociated. Junctional escape (AV node block): 40–60 bpm, narrow QRS, more stable. Ventricular escape (infranodal): 20–40 bpm, wide QRS, less reliable, can stop abruptly. Causes: inferior MI (usually reversible), anterior MI (often permanent), Lyme carditis, drugs, degenerative conduction disease. Management: transcutaneous pacing for hemodynamic compromise while arranging transvenous.",
      },
    ],
    faq: [
      { question: "Which AV block is an emergency?", answer: "Mobitz II and complete heart block with symptoms (syncope, hypotension, hemodynamic compromise) are emergencies. They require immediate preparation for transcutaneous pacing and urgent cardiology consultation. Mobitz II can progress to complete heart block without warning — asymptomatic does not mean safe." },
      { question: "Is atropine effective for all AV blocks?", answer: "No. Atropine blocks vagal tone at the AV node — effective for first-degree and Mobitz I (nodal blocks). Ineffective and potentially harmful in Mobitz II and complete heart block (infranodal) — may increase sinus rate without improving ventricular rate. Prepare for pacing instead." },
    ],
    tier: "core_ecg",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.78,
    internalLinkLabel: "AV Block",
    prerequisiteSlug: "heart-block-interpretation",
  },
  {
    slug: "pea-asystole",
    title: "PEA and Asystole — ACLS Non-Shockable Arrest Rhythms",
    description:
      "PEA and asystole for nurses: clinical diagnosis, ACLS algorithm, reversible cause search (6 Hs and 5 Ts), epinephrine dosing, and distinguishing fine VF from asystole.",
    h1: "PEA and asystole: non-shockable arrest rhythms, clinical diagnosis, and ACLS management",
    keywords: ["PEA nursing ACLS", "asystole ECG nursing", "non-shockable arrest nursing", "6Hs 5Ts ACLS nursing"],
    sections: [
      {
        id: "pea",
        heading: "PEA: clinical diagnosis, not an ECG pattern alone",
        content: "Pulseless electrical activity presents as organized electrical activity on the ECG monitor in the absence of a detectable pulse. The ECG may show sinus rhythm, bradycardia, wide-complex rhythm, or any organized pattern — and still represent a pulseless state. The diagnosis requires both: (1) organized electrical activity on monitor AND (2) confirmed absence of pulse. Management: CPR + epinephrine 1mg IV q3–5min + aggressive search for reversible causes. The 6 Hs: hypovolemia, hypoxia, hydrogen ion (acidosis), hypo/hyperkalemia, hypothermia. The 5 Ts: tension pneumothorax, tamponade, toxins, thrombosis-PE, thrombosis-coronary.",
      },
      {
        id: "asystole",
        heading: "Asystole: confirm in two leads before withholding defibrillation",
        content: "Asystole is a flat or near-flat baseline in all leads — no organized electrical activity. Critical rule: confirm in TWO leads before declaring asystole. Fine VF (low-amplitude chaotic activity) can appear as a flat line in a single lead and is SHOCKABLE. A perpendicular lead often reveals fibrillatory activity. Do NOT defibrillate asystole — it will not help and delays CPR. Give epinephrine 1mg IV q3–5min. Atropine was removed from the ACLS asystole algorithm in 2010 — do not use atropine for arrest.",
      },
    ],
    faq: [
      { question: "What is the most common reversible cause of PEA?", answer: "In the hospital, the most common causes are hypovolemia (acute hemorrhage, third-spacing) and hypoxia (respiratory failure, airway obstruction). In the community, massive PE and tension pneumothorax are common. The 6H/5T mnemonic is the systematic search — assess and treat all simultaneously during CPR." },
      { question: "Should atropine be given for asystole?", answer: "No. Atropine was removed from the ACLS asystole and PEA algorithm in the 2010 AHA guidelines update because evidence showed no benefit in these rhythms. Current ACLS uses only epinephrine for asystole and PEA." },
    ],
    tier: "core_ecg",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.78,
    internalLinkLabel: "PEA and Asystole",
  },
  {
    slug: "stemi-recognition",
    title: "STEMI Recognition — 12-Lead ECG for Nurses",
    description:
      "STEMI recognition for nurses: ST elevation territory, reciprocal changes, posterior STEMI, De Winter T-waves, Wellens syndrome, and cath lab activation criteria.",
    h1: "STEMI recognition: 12-lead ECG territory, reciprocal changes, and missed patterns for nurses",
    keywords: ["STEMI recognition nursing", "STEMI ECG nursing", "posterior STEMI nursing", "STEMI localization nursing", "cath lab activation nursing"],
    sections: [
      {
        id: "stemi-basics",
        heading: "STEMI recognition: territory and reciprocal changes",
        content: "STEMI diagnosis: ≥ 2mm ST elevation in ≥ 2 contiguous leads, or new LBBB with clinical presentation. Territory: Inferior (II, III, aVF) — RCA territory. Anterior (V1–V4) — LAD territory. Lateral (I, aVL, V5–V6) — circumflex territory. Reciprocal ST depression in the anatomically opposite leads is the most reliable confirmation of STEMI (e.g., inferior STEMI: ST elevation II/III/aVF + reciprocal ST depression in aVL). Right-sided leads (V4R) for RV infarction in inferior STEMI: nitrates contraindicated if ST elevation in V4R.",
      },
      {
        id: "stemi-equivalents",
        heading: "STEMI equivalents: posterior STEMI, De Winter T-waves, Wellens syndrome",
        content: "Posterior STEMI (most commonly missed): ST DEPRESSION in V1–V3 (not elevation) + dominant R wave in V2. Requires posterior leads V7–V9 to reveal ST elevation. De Winter T-waves: J-point depression with tall symmetric precordial T-waves — proximal LAD occlusion without classic ST elevation, equal emergency to STEMI. Wellens syndrome: biphasic (Type A) or deeply inverted (Type B) T-waves in V2–V3 in a pain-FREE patient — proximal LAD critical stenosis, often post-ischemic reperfusion. Requires urgent cardiology despite normal ST.",
      },
    ],
    faq: [
      { question: "Can LBBB be a STEMI equivalent?", answer: "New LBBB with typical chest pain symptoms can be a STEMI equivalent requiring cath lab activation. The Sgarbossa criteria help diagnose superimposed ischemia: concordant ST elevation ≥ 1mm (same direction as QRS), concordant ST depression ≥ 1mm in V1–V3, and excessively discordant ST elevation ≥ 5mm. Any concordant ST change in LBBB should be treated with the same urgency as overt STEMI." },
      { question: "Why is posterior STEMI so commonly missed?", answer: "Posterior STEMI shows ST DEPRESSION (not elevation) in V1–V3 on the standard 12-lead because the posterior wall is not directly recorded — V1–V3 are the electrically opposite view. The mirrored ST depression is often attributed to subendocardial ischemia or NSTEMI. Posterior leads V7, V8, V9 reveal the true ST elevation. Any patient with ST depression V1–V3 and chest pain requires posterior leads before STEMI is excluded." },
    ],
    tier: "advanced_ecg",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.78,
    internalLinkLabel: "STEMI Recognition",
  },
  {
    slug: "hyperkalemia-ecg-nursing",
    title: "Hyperkalemia ECG Changes — Peaked T Waves to Sine Wave Guide",
    description:
      "Hyperkalemia ECG progression for nurses: peaked T waves, P wave flattening, QRS widening, sine wave pattern. IV calcium first-line treatment and clinical recognition.",
    h1: "Hyperkalemia ECG changes for nurses: peaked T waves, QRS widening, and the sine-wave emergency",
    keywords: ["hyperkalemia ECG nursing", "peaked T waves hyperkalemia nursing", "hyperkalemia treatment nursing", "electrolyte ECG nursing"],
    sections: [
      {
        id: "ecg-progression",
        heading: "ECG progression of hyperkalemia",
        content: "Mild (K+ 5.5–6.5): peaked narrow-base symmetric T-waves — most prominent V2–V5. Moderate (6.5–7.5): P-wave flattening and widening, PR prolongation, QRS beginning to widen. Severe (> 7.5): progressive QRS widening merging with T-wave — the sine-wave pattern. This is a preterminal ECG. VF or asystole follows without immediate treatment. Clinical context: renal failure, rhabdomyolysis, metabolic acidosis, medications (ACE inhibitors, potassium-sparing diuretics).",
      },
      {
        id: "treatment",
        heading: "Treatment: calcium first, then potassium removal",
        content: "IV calcium gluconate or calcium chloride FIRST — stabilizes the myocardial membrane by raising the threshold potential. Does not lower K+ but prevents immediate lethal arrhythmia. Effect within minutes. Then: insulin + dextrose (shifts K+ intracellularly, 15–30 min onset). Sodium bicarbonate for concurrent acidosis. Kayexalate, Lokelma, or dialysis for definitive K+ removal. Critical teaching point: do NOT defibrillate a hyperkalemia sine-wave first — give calcium first, stabilize the membrane, then manage the arrhythmia.",
      },
    ],
    faq: [
      { question: "How do hyperkalemia peaked T-waves differ from STEMI hyperacute T-waves?", answer: "Hyperkalemia T-waves: symmetric, narrow-base, 'tent' or 'church steeple' shape, diffuse across multiple leads, appear in the context of renal failure or medications. STEMI hyperacute T-waves: asymmetric, broad-based, focal to a coronary territory, appear with other ischemic changes (ST changes, QRS changes). Clinical context is essential — the ECG findings alone can be very similar." },
      { question: "Does hyperkalemia mimic other arrhythmias?", answer: "Yes. Severe hyperkalemia with P-wave flattening and QRS widening mimics junctional rhythm or complete heart block. Very severe (sine-wave) resembles VT or VF. Always check serum electrolytes in any patient with new wide-complex rhythm or new bradycardia who has risk factors for hyperkalemia (CKD, diabetes, ACE inhibitor use, acidosis, recent blood transfusion)." },
    ],
    tier: "advanced_ecg",
    schemaTypes: ["Article", "FAQPage"],
    sitemapPriority: 0.75,
    internalLinkLabel: "Hyperkalemia ECG",
  },
];

// ─── Public API ─────────────────────────────────────────────────────────────────

/** All additional cluster topics added in the platform hardening sprint. */
export const ADDITIONAL_ECG_CLUSTER_TOPICS: ReadonlyArray<EcgClusterRegistryEntry> = ADDITIONAL_CLUSTER_TOPICS;

/** All additional cluster slugs from the platform hardening sprint. */
export function getAdditionalEcgClusterSlugs(): string[] {
  return ADDITIONAL_CLUSTER_TOPICS.map((t) => t.slug);
}

/** Look up an additional cluster entry by slug. */
export function getAdditionalEcgClusterTopic(slug: string): EcgClusterRegistryEntry | undefined {
  return ADDITIONAL_CLUSTER_TOPICS.find((t) => t.slug === slug);
}

/** All cluster slugs: original + additional. */
export function getAllEcgClusterSlugsFromRegistry(): string[] {
  const { getAllEcgClusterSlugs } = require("./ecg-seo-cluster");
  return [...getAllEcgClusterSlugs(), ...getAdditionalEcgClusterSlugs()];
}

/**
 * Validates the registry has no duplicate slugs and all slugs are kebab-case.
 * Called by contract tests.
 */
export function validateEcgClusterRegistry(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  const allSlugs = getAllEcgClusterSlugsFromRegistry();
  const kebab = /^[a-z0-9-]+$/;

  for (const slug of allSlugs) {
    if (seen.has(slug)) errors.push(`Duplicate slug: "${slug}"`);
    if (!kebab.test(slug)) errors.push(`Non-kebab-case slug: "${slug}"`);
    seen.add(slug);
  }

  return errors;
}
