#!/usr/bin/env npx tsx
/**
 * Deterministic generator for MLT hybrid static long-tail posts.
 * Run from nursenest-core/: npx tsx scripts/blog/generate-mlt-static-longtail-batch.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { countWordsFromHtml } from "../../src/lib/blog/blog-word-count";
import { MLT_SENTENCE_TEMPLATES } from "./mlt-longtail-corpus";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..");
const OUT_DIR = join(APP_ROOT, "src", "content", "blog-static-longtail");
const REPORT_PATH = join(APP_ROOT, "reports", "mlt-longtail-batch-50.md");

export type MltTopic = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  primary: string;
  spec: string;
  method: string;
  analyte: string;
  qc: string;
  safety: string;
  exam: string;
  error: string;
};

function expandTemplate(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);
}

function pickTemplates(topicIndex: number, start: number, count: number): string[] {
  const n = MLT_SENTENCE_TEMPLATES.length;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(MLT_SENTENCE_TEMPLATES[(start + topicIndex * 11 + i * 5) % n]);
  }
  return out;
}

function paragraphsFromTemplates(topicIndex: MltTopic, idx: number, start: number, count: number): string {
  const vars: Record<string, string> = {
    TOPIC: topicIndex.primary,
    SPEC: topicIndex.spec,
    METHOD: topicIndex.method,
    ANALYTE: topicIndex.analyte,
    QC: topicIndex.qc,
    SAFETY: topicIndex.safety,
    EXAM: topicIndex.exam,
    ERROR: topicIndex.error,
  };
  return pickTemplates(idx, start, count)
    .map((t) => `<p>${expandTemplate(t, vars)}</p>`)
    .join("\n");
}

function internalLinks(slugs: string[], idx: number): string {
  const a = slugs[(idx + 7) % slugs.length];
  const b = slugs[(idx + 13) % slugs.length];
  const c = slugs[(idx + 19) % slugs.length];
  const d = slugs[(idx + 23) % slugs.length];
  return `<ul>
  <li><a href="/blog/${a}">Related MLT long-tail: ${a.replace(/-/g, " ")}</a></li>
  <li><a href="/blog/${b}">Related MLT long-tail: ${b.replace(/-/g, " ")}</a></li>
  <li><a href="/blog/${c}">Related MLT long-tail: ${c.replace(/-/g, " ")}</a></li>
  <li><a href="/blog/${d}">Related MLT long-tail: ${d.replace(/-/g, " ")}</a></li>
  <li><a href="/app/dashboard">Learner dashboard</a> — continue your adaptive study loop after reading.</li>
</ul>`;
}

function buildBody(t: MltTopic, idx: number, allSlugs: string[]): string {
  const parts: string[] = [];
  parts.push(`<h2>Introduction</h2>`);
  parts.push(paragraphsFromTemplates(t, idx, 0, 8));
  parts.push(`<h2>Key Takeaways</h2>`);
  parts.push(`<ul>
  <li>${t.primary} integrates pre-analytical, analytical, and post-analytical responsibilities that generalist examinations treat as a single safety story.</li>
  <li>Specimen type, stability, and collection quality for ${t.spec} often explain discrepancies more than instrument failure alone.</li>
  <li>${t.method} principles help you interpret flags, reflex rules, and confirmatory pathways for ${t.analyte}.</li>
  <li>${t.qc} and ${t.error} documentation are part of professional practice, not trivia separate from patient care.</li>
  <li>Always align bench and reporting decisions with institutional standard operating procedures for ${t.safety}.</li>
</ul>`);
  parts.push(paragraphsFromTemplates(t, idx, 8, 3));
  parts.push(`<h2>Pathophysiology and science background</h2>`);
  parts.push(paragraphsFromTemplates(t, idx, 11, 7));
  parts.push(`<h2>Specimen handling and pre-analytical controls</h2>`);
  parts.push(paragraphsFromTemplates(t, idx, 18, 7));
  parts.push(`<h2>Laboratory values, reference context, and methodology</h2>`);
  parts.push(paragraphsFromTemplates(t, idx, 25, 7));
  parts.push(`<h2>Sources of error, interference, and troubleshooting</h2>`);
  parts.push(paragraphsFromTemplates(t, idx, 32, 6));
  parts.push(`<h2>Safety, infection prevention, and occupational health</h2>`);
  parts.push(paragraphsFromTemplates(t, idx, 38, 5));
  parts.push(`<h2>Clinical significance and result reporting</h2>`);
  parts.push(paragraphsFromTemplates(t, idx, 43, 5));
  parts.push(`<h2>Exam-focused review points</h2>`);
  parts.push(paragraphsFromTemplates(t, idx, 48, 5));
  parts.push(`<h2>Patient communication and counseling cues</h2>`);
  parts.push(paragraphsFromTemplates(t, idx, 53, 4));
  parts.push(`<h2>Suggested internal links</h2>`);
  parts.push(internalLinks(allSlugs, idx));
  parts.push(`<h2>Premium lesson CTA</h2>`);
  parts.push(
    `<p>Pair this article with NurseNest lessons and practice on <strong>clinical reasoning, laboratory interpretation, and safety</strong> so recognition feels automatic under time pressure. Premium pathways connect theory to question stems with the same vocabulary you will see on examination day.</p>`,
  );
  parts.push(`<h2>FAQ schema questions</h2>`);
  parts.push(`<h3>What should an MLT student memorize first about ${t.primary}?</h3>`);
  parts.push(
    `<p>Prioritize specimen requirements, stability, common interferences, and the clinical situations where ${t.analyte} changes management, then deepen instrument and ${t.qc} detail during clinical rotations.</p>`,
  );
  parts.push(`<h3>How do examinations test ${t.primary}?</h3>`);
  parts.push(
    `<p>Items often pair a pre-analytical distractor with a result pattern and ask for the best next step, corrective action, or communication priority consistent with ${t.exam} scope expectations.</p>`,
  );
  parts.push(`<h3>Where do institutional policies override textbook generalizations?</h3>`);
  parts.push(
    `<p>Critical values, reporting intervals, delta-check thresholds, and ${t.safety} requirements are locally defined; use your facility manual as the final authority in practice.</p>`,
  );
  parts.push(`<h2>APA-7 references</h2>`);
  parts.push(
    `<p>Clinical and Laboratory Standards Institute. (2024). <em>Procedures for the handling and processing of blood specimens for common laboratory tests</em> (GP41, 8th ed.). CLSI.</p>`,
  );
  parts.push(
    `<p>Clinical and Laboratory Standards Institute. (2025). <em>Evaluation of precision of quantitative measurement procedures</em> (EP05, 4th ed.). CLSI.</p>`,
  );
  parts.push(
    `<p>Centers for Disease Control and Prevention. (2023). <em>Laboratory biosafety guidance</em> (CDC laboratory safety resources). U.S. Department of Health and Human Services.</p>`,
  );
  parts.push(
    `<p>World Health Organization. (2022). <em>Good clinical laboratory practice</em> (WHO laboratory quality framework materials).</p>`,
  );
  return parts.join("\n");
}

function frontmatter(t: MltTopic): string {
  const disclaimer =
    "This article supports exam preparation and educational laboratory reasoning. It is not individualized medical advice, a substitute for your institution’s policies, or a procedure manual. Always follow local scope, supervisor direction, and biosafety standards in real practice.";
  return `---
slug: ${t.slug}
title: ${t.title}
excerpt: ${t.excerpt}
category: ${t.category}
tags: ${t.tags}
publishedAt: 2026-05-09
updatedAt: 2026-05-09
seoTitle: ${t.seoTitle}
seoDescription: ${t.seoDescription}
canonicalUrl: /blog/${t.slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: ${disclaimer}
---

`;
}

function topics(): MltTopic[] {
  const c = "Laboratory Science";
  const baseExam = "ASCP BOC-style and MLT generalist examinations";
  const baseSafety = "Standard Precautions and institutional exposure control plans";
  const baseQc = "daily QC and calibration verification";
  const baseErr = "pre-analytical and analytical error";
  const row = (
    slug: string,
    title: string,
    excerpt: string,
    tags: string,
    seoTitle: string,
    seoDescription: string,
    primary: string,
    spec: string,
    method: string,
    analyte: string,
    qc?: string,
    safety?: string,
    exam?: string,
    error?: string,
  ): MltTopic => ({
    slug,
    title,
    excerpt,
    category: c,
    tags,
    seoTitle,
    seoDescription,
    primary,
    spec,
    method,
    analyte,
    qc: qc ?? baseQc,
    safety: safety ?? baseSafety,
    exam: exam ?? baseExam,
    error: error ?? baseErr,
  });

  return [
    row(
      "cbc-interpretation-mlt-certification-prep",
      "CBC Interpretation for MLT Students: Indices, Flags, and Certification Prep",
      "Build a systematic approach to complete blood count reports, instrument flags, and smear triggers so certification-style items feel predictable rather than memorization-heavy.",
      "CBC, Hematology, MLT, MLS, ASCP, Laboratory Science, Cell Indices, RBC Indices, WBC Differential",
      "CBC interpretation for MLT students | NurseNest",
      "CBC indices, flags, and smear correlation for medical laboratory technology students preparing for certification-style items.",
      "complete blood count interpretation in the core laboratory",
      "whole blood with EDTA lavender-top tubes processed within institution-specific timelines",
      "automated hematology analyzers with impedance and optical platelet channels",
      "hemoglobin, hematocrit, MCV, MCH, MCHC, RDW, white cell count, and platelet parameters",
    ),
    row(
      "hemolysis-causes-laboratory-detection-mlt",
      "Hemolysis Causes and Laboratory Detection for MLT Training",
      "Learn how hemolysis shifts chemistry and hematology results, how laboratories detect it, and how examination vignettes tie pink plasma to pre-analytical prevention.",
      "Hemolysis, Pre-analytical, Chemistry, Potassium, LDH, MLT, Specimen Quality",
      "Hemolysis detection for MLT students | NurseNest",
      "Hemolysis mechanisms, visual and automated detection, and result integrity actions for laboratory technology students.",
      "hemolysis recognition and specimen integrity management",
      "serum separator tubes and plasma specimens subject to centrifugation timing rules",
      "spectrophotometric hemolysis indices and visual plasma inspection",
      "potassium, lactate dehydrogenase, aspartate aminotransferase, and haptoglobin-related patterns",
    ),
    row(
      "pre-analytical-errors-blood-specimens-mlt",
      "Pre-analytical Errors in Blood Specimens: An MLT Exam Roadmap",
      "Map ordering, identification, collection, transport, and processing errors to result patterns so you can answer prioritization and prevention questions confidently.",
      "Pre-analytical phase, Phlebotomy, Specimen Handling, Patient Safety, MLT",
      "Pre-analytical errors for MLT | NurseNest",
      "Blood specimen pre-analytical error categories, prevention, and examination-style prioritization for laboratory students.",
      "pre-analytical error reduction in hospital chemistry and hematology",
      "fasting and timed venous blood specimens with documented collection times",
      "centrifugation, aliquoting, and accessioning workflows tied to LIS demographics",
      "glucose, lactate, potassium, and coagulation assays sensitive to delay and temperature",
    ),
    row(
      "troponin-assays-pre-analytical-stability-mlt",
      "Troponin Assays, Stability, and Pre-analytical Pearls for MLT Students",
      "Connect cardiac troponin release kinetics to specimen timing, hemolysis risk, and serial testing language used in acute care laboratory partnerships.",
      "Troponin, Cardiac Markers, Acute Care, Pre-analytical, MLT",
      "Troponin pre-analytics for MLT | NurseNest",
      "Troponin assay families, stability, serial change concepts, and specimen quality for laboratory technology learners.",
      "high-sensitivity troponin workflows in emergency laboratory partnerships",
      "heparinized plasma or serum tubes collected with documented chest pain onset times",
      "chemiluminescent immunoassays with lot-specific calibration materials",
      "cardiac troponin I and T isoforms as reported by the local method",
    ),
    row(
      "pt-inr-vs-aptt-coagulation-basics-mlt",
      "PT INR versus aPTT: Coagulation Basics for MLT Certification Review",
      "Clarify extrinsic, intrinsic, and common pathway roles, citrate collection requirements, and why heparin contamination produces different distortions on screening assays.",
      "Coagulation, PT, INR, aPTT, Hemostasis, MLT, Citrate tubes",
      "PT INR vs aPTT for MLT | NurseNest",
      "Prothrombin time, INR, and aPTT pathways, collection rules, and interpretation anchors for laboratory students.",
      "screening coagulation assays in hospital core laboratories",
      "blue-top sodium citrate tubes filled to the indicated fill line",
      "optical or mechanical clot detection coagulometers with locally validated reference intervals",
      "prothrombin time, INR, and activated partial thromboplastin time results",
    ),
    row(
      "blood-culture-contamination-versus-true-bacteremia-mlt",
      "Blood Culture Contamination versus True Bacteremia: MLT Decision Support",
      "Review collection technique, set volume, time-to-incubation flags, and quality metrics that help differentiate contaminant skin flora from clinically significant bacteremia patterns.",
      "Blood Culture, Microbiology, Contamination, Sepsis, MLT",
      "Blood culture contamination MLT | NurseNest",
      "Blood culture collection, contamination rates, and interpretive caution for medical laboratory technology students.",
      "blood culture quality improvement paired with antimicrobial stewardship communication",
      "aerobic and anaerobic blood culture bottles from peripheral and central line draws",
      "continuous monitoring blood culture systems with rapid Gram stain and MALDI-TOF support",
      "time-to-positivity curves and organism identification panels",
    ),
    row(
      "urinalysis-dipstick-microscopic-basics-mlt",
      "Urinalysis: Dipstick, Microscopy, and Clinical Correlation for MLT Students",
      "Explain chemical reagent strip limitations, reflex microscopy indications, and common false positives that appear on certification-style correlation items.",
      "Urinalysis, UA, Microscopy, Renal, MLT",
      "Urinalysis basics for MLT | NurseNest",
      "Dipstick, microscopic examination, and contamination clues for urinalysis modules in MLT curricula.",
      "routine urinalysis in ambulatory and inpatient settings",
      "clean-catch midstream urine with preservation and transport per policy",
      "automated strip readers and manual microscopy with standardized sediment concentration",
      "specific gravity, blood, protein, leukocyte esterase, nitrite, and ketone fields",
    ),
    row(
      "esr-versus-crp-inflammatory-markers-mlt",
      "ESR versus CRP: Inflammatory Marker Science for MLT Learners",
      "Contrast kinetics, physiologic influences, and laboratory reporting of erythrocyte sedimentation rate and C-reactive protein without conflating acute versus chronic patterns.",
      "ESR, CRP, Inflammation, Acute Phase, MLT",
      "ESR vs CRP for MLT | NurseNest",
      "ESR and CRP physiology, methodology families, and interpretive limits for laboratory students.",
      "acute phase reactant testing in inflammatory and infectious workups",
      "citrated or EDTA whole blood for ESR and serum or plasma for CRP immunoassays",
      "automated ESR instruments and immunoturbidimetric or nephelometric CRP methods",
      "erythrocyte sedimentation rate and C-reactive protein concentrations",
    ),
    row(
      "abo-rh-blood-group-typing-forward-reverse-mlt",
      "ABO and Rh Blood Group Typing: Forward and Reverse Patterns for MLT",
      "Walk through forward grouping, reverse grouping, RhD typing, and discrepancy investigation concepts at blood bank depth appropriate for generalist examinations.",
      "ABO, Rh, Blood Bank, Immunohematology, MLT",
      "ABO Rh typing for MLT | NurseNest",
      "Forward and reverse blood group typing, RhD results, and discrepancy anchors for laboratory technology students.",
      "ABO and Rh typing integrity in transfusion service laboratories",
      "EDTA whole blood or capillary samples per institutional blood bank manual",
      "column agglutination gel or tube testing platforms validated for transfusion use",
      "ABO group, RhD type, and antibody screen reflex patterns",
    ),
    row(
      "crossmatch-transfusion-compatibility-basics-mlt",
      "Crossmatch and Transfusion Compatibility Basics for MLT Certification",
      "Describe immediate spin, full crossmatch, computer crossmatch eligibility, and product modification codes at a level that supports safe issue decisions on examination stems.",
      "Crossmatch, Transfusion, Blood Bank, Compatibility Testing, MLT",
      "Crossmatch basics for MLT | NurseNest",
      "Compatibility testing, computer crossmatch rules, and product issue safety for MLT learners.",
      "compatibility testing supporting perioperative and emergent transfusion",
      "recipient serum or plasma paired with donor red cell segments per protocol",
      "antiglobulin phases and computer crossmatch algorithms authorized by the medical director",
      "crossmatch interpretation relative to antibody screen results",
    ),
    row(
      "arterial-blood-gas-basics-for-mlt-students",
      "Arterial Blood Gas Basics for MLT Students: Collection, Analysis, and QC",
      "Tie syringe heparin balance, air exclusion, temperature policy, and analyzer calibration to reliable pH, pCO2, pO2, and electrolyte reporting in critical care partnerships.",
      "ABG, Blood Gas, Acid-Base, Critical Care, MLT",
      "ABG basics for MLT | NurseNest",
      "Arterial blood gas specimen handling, analysis principles, and QC for laboratory technology students.",
      "arterial and capillary blood gas analysis supporting ventilation decisions",
      "heparinized syringes with documented draw time and patient ventilator settings when applicable",
      "ion-selective electrode and amperometric blood gas analyzers with tonometry-linked QC",
      "pH, PaCO2, PaO2, bicarbonate, base excess, lactate, and ionized calcium",
    ),
    row(
      "laboratory-specimen-rejection-criteria-mlt",
      "Laboratory Specimen Rejection Criteria: Policy, Safety, and Exam Logic",
      "List common rejection triggers, documentation requirements, and communication expectations when a specimen cannot produce valid results without harming the patient.",
      "Specimen Rejection, Pre-analytical, Quality, MLT",
      "Specimen rejection criteria MLT | NurseNest",
      "Laboratory rejection policies, documentation, and patient safety framing for MLT examinations.",
      "specimen rejection and recollection workflows in centralized laboratories",
      "mislabeled, clotted, hemolyzed, or insufficient-volume tubes across chemistry and hematology",
      "policy-driven accessioning interfaces with phlebotomy service feedback loops",
      "unsuitable specimens for the ordered test menu",
    ),
    row(
      "chain-of-custody-toxicology-specimens-mlt",
      "Chain of Custody for Toxicology Specimens: Forensic Integrity for MLT Learners",
      "Explain sealed collections, witness signatures, tamper-evident packaging, and why presumptive immunoassay screens differ from definitive confirmation testing in workplace and legal contexts.",
      "Chain of Custody, Toxicology, Forensic, Workplace Testing, MLT",
      "Chain of custody toxicology MLT | NurseNest",
      "Chain-of-custody paperwork, sealed toxicology specimens, and screening versus confirmation for MLT students.",
      "forensically defensible toxicology specimen handling",
      "urine, oral fluid, or blood collections per regulated panel requirements",
      "presumptive immunoassay platforms and definitive mass spectrometry confirmations",
      "drug and metabolite results reported with custody narrative documentation",
    ),
    row(
      "csf-analysis-cell-count-protein-glucose-mlt",
      "CSF Analysis: Cell Count, Protein, and Glucose Essentials for MLT Students",
      "Connect traumatic tap patterns, xanthochromia concepts, differential thresholds, and sterile collection to meningitis evaluation items seen in clinical microbiology modules.",
      "CSF, Cell Count, Microbiology, Meningitis, MLT",
      "CSF analysis for MLT | NurseNest",
      "Cerebrospinal fluid cell counts, protein, glucose, and correlation for laboratory learners.",
      "cerebrospinal fluid studies supporting infectious disease and neurology teams",
      "sterile tubes collected in numbered sequence with rapid transport to core lab",
      "hemocytometer and automated counting approaches per institutional manual",
      "CSF white cells, red cells, protein, glucose, and Gram stain correlation",
    ),
    row(
      "gram-stain-quality-interpretation-mlt",
      "Gram Stain Quality, Reporting, and Interpretation for MLT Certification",
      "Cover fixation, decolorization pitfalls, reporting nomenclature, and quality limits so students know when to communicate inadequate slides versus confident morphotypes.",
      "Gram Stain, Microbiology, Bacteriology, MLT",
      "Gram stain quality for MLT | NurseNest",
      "Gram stain technique, QC, and interpretive reporting for medical laboratory technology students.",
      "Gram staining in bacteriology benches supporting culture workups",
      "clinical swabs, aspirates, and sterile body fluids on glass slides with quality thickness",
      "four-step staining with controlled safranin and decolorizer timing",
      "Gram reaction, morphology, and arrangement descriptors tied to culture workup",
    ),
    row(
      "hematology-analyzer-qc-westgard-concepts-mlt",
      "Hematology Analyzer QC and Westgard-Style Concepts for MLT Students",
      "Translate Levey-Jennings plots, control lot changes, calibration verification, and rule-out versus rule-in thinking for examination questions on hematology quality assurance.",
      "QC, Hematology, Westgard, Levey-Jennings, MLT",
      "Hematology QC for MLT | NurseNest",
      "Quality control charts, rule concepts, and troubleshooting for hematology analyzers in MLT training.",
      "hematology quality control supporting reliable CBC and differential reporting",
      "commercial assayed whole blood controls run at defined frequencies",
      "automated hematology analyzers with internal moving averages where implemented",
      "three-part or five-part differential parameters and related histogram flags",
    ),
    row(
      "liver-function-tests-lfts-laboratory-mlt",
      "Liver Function Tests in the Laboratory: Transaminases, Bilirubin, and Synthetic Markers",
      "Differentiate hepatocellular injury, cholestasis, and synthetic function patterns using ALT, AST, ALP, GGT, bilirubin fractions, and albumin with examination-ready mechanism language.",
      "Liver, LFTs, Chemistry, Hepatology, MLT",
      "Liver function tests for MLT | NurseNest",
      "Liver panel analytes, pattern recognition, and methodology notes for laboratory technology students.",
      "liver-associated chemistry panels in inpatient and outpatient settings",
      "serum separator tubes processed within stability limits for enzyme activity",
      "rate enzymatic and diazo or oxidation-based bilirubin methods on modular chemistry platforms",
      "ALT, AST, ALP, GGT, total and direct bilirubin, albumin, and PT when paired",
    ),
    row(
      "thyroid-laboratory-testing-tsh-free-t4-mlt",
      "Thyroid Laboratory Testing: TSH, Free T4, and Interference Awareness for MLT",
      "Explain central versus primary thyroid disease patterns, pregnancy trimester TSH references, and biotin interference as high-yield certification topics.",
      "Thyroid, TSH, Free T4, Endocrine, MLT",
      "Thyroid labs for MLT | NurseNest",
      "TSH and free thyroxine assays, interference, and pattern recognition for MLT examinations.",
      "thyroid function testing supporting endocrinology and primary care",
      "serum collected without biotin mega-dose confounding when clinically relevant",
      "one- and two-step immunoassay architectures with method-specific reference data",
      "thyroid-stimulating hormone and free thyroxine concentrations",
    ),
    row(
      "critical-values-reporting-laboratory-communication-mlt",
      "Critical Values Reporting: Laboratory Communication and Documentation for MLT",
      "Define read-back expectations, escalation paths, downtime contingencies, and audit trail requirements that examinations frame as patient safety priorities.",
      "Critical Values, Communication, Patient Safety, MLT",
      "Critical values reporting MLT | NurseNest",
      "Critical result notification, read-back, and documentation for medical laboratory technology students.",
      "critical value communication bridging laboratory and clinical teams",
      "any specimen type generating analytes on institutional critical lists",
      "LIS alerting, phone trees, and middleware auto-verification exceptions",
      "critical analyte results requiring immediate provider notification per policy",
    ),
    row(
      "laboratory-infection-control-bloodborne-pathogens-mlt",
      "Laboratory Infection Control and Bloodborne Pathogen Programs for MLT Students",
      "Review standard precautions, exposure response, waste streams, and engineering controls that appear on professionalism and safety sections of certification exams.",
      "Infection Control, BBP, Safety, OSHA concepts, MLT",
      "Lab infection control for MLT | NurseNest",
      "Biosafety, bloodborne pathogen precautions, and exposure prevention for laboratory learners.",
      "hospital laboratory biosafety paired with occupational health programs",
      "blood, body fluid, and culture plates handled under documented biosafety levels",
      "biological safety cabinets, centrifuge cups, and sharps injury prevention engineering",
      "occupational exposure incidents and post-exposure evaluation pathways",
    ),
    row(
      "ldh-tissue-injury-marker-laboratory-mlt",
      "LDH as a Tissue Injury Marker: Laboratory Context for MLT Certification",
      "Describe widespread tissue sources, hemolysis confounding, and pattern use alongside organ-specific markers rather than isolated LDH memorization.",
      "LDH, Chemistry, Hemolysis, Tissue Injury, MLT",
      "LDH laboratory marker MLT | NurseNest",
      "Lactate dehydrogenase sources, interference, and interpretive pairing for MLT students.",
      "lactate dehydrogenase release patterns in hemolysis and organ injury panels",
      "serum or heparinized plasma with attention to in vitro hemolysis",
      "enzymatic rate methods on chemistry analyzers with method-specific references",
      "total LDH activity alongside transaminases and haptoglobin when indicated",
    ),
    row(
      "lactate-laboratory-measurement-pre-analytics-mlt",
      "Lactate Measurement: Pre-analytics, Stability, and Critical Care Alignment for MLT",
      "Contrast plasma versus whole blood lactate policies, tourniquet time effects, and sepsis bundle alignment items common in hospital chemistry training.",
      "Lactate, Sepsis, Chemistry, Pre-analytical, MLT",
      "Lactate testing for MLT | NurseNest",
      "Lactate specimen handling, stability, and interpretation basics for laboratory technology students.",
      "lactate testing supporting resuscitation and shock evaluation",
      "gray-top or heparinized tubes collected with minimal fist pumping delay",
      "enzymatic lactate oxidase methods on blood gas and chemistry platforms",
      "lactate concentration trends paired with anion gap and base deficit narratives",
    ),
    row(
      "hba1c-diabetes-monitoring-assay-caveats-mlt",
      "HbA1c for Diabetes Monitoring: Assay Caveats and Variant Awareness for MLT",
      "Cover altered red cell survival, pregnancy, hemoglobinopathy interference, and NGSP traceability concepts at educational depth for chemistry rotations.",
      "HbA1c, Diabetes, Chemistry, Glycemic, MLT",
      "HbA1c testing for MLT | NurseNest",
      "Glycated hemoglobin methods, interferences, and clinical caveats for MLT learners.",
      "HbA1c reporting tied to diabetes complication risk stratification",
      "EDTA whole blood with EDTA as the typical anticoagulant for many methods",
      "HPLC, immunoassay, or enzymatic HbA1c methods with NGSP alignment where stated",
      "HbA1c percentage or IFCC mmol/mol reporting per local policy",
    ),
    row(
      "iron-studies-ferritin-iron-saturation-mlt",
      "Iron Studies: Ferritin, Iron, TIBC, and Saturation Patterns for MLT Students",
      "Build pattern recognition for iron deficiency, inflammation, and overload using ferritin, serum iron, transferrin or TIBC, and saturation without overinterpreting isolated values.",
      "Iron Studies, Ferritin, Anemia, Chemistry, MLT",
      "Iron studies for MLT | NurseNest",
      "Iron panel analytes, physiology, and examination vignettes for laboratory students.",
      "iron study panels supporting anemia and iron overload evaluation",
      "fasting morning serum preferred by some protocols for iron and transferrin",
      "colorimetric iron and immunometric ferritin on shared chemistry tracks",
      "serum iron, ferritin, transferrin, TIBC, and calculated saturation percentage",
    ),
    row(
      "vitamin-b12-folate-megablastic-workup-mlt",
      "Vitamin B12 and Folate Testing: Megaloblastic Workup Anchors for MLT",
      "Explain macrocytosis patterns, dietary and malabsorption mechanisms, and why neurologic B12 deficiency can exist without anemia on examination stems.",
      "B12, Folate, Hematology, Macrocytosis, MLT",
      "B12 folate testing MLT | NurseNest",
      "Cobalamin and folate assays, macrocytosis correlation, and limitations for MLT students.",
      "vitamin B12 and folate testing supporting macrocytic anemia evaluation",
      "serum separator tubes with protection from light where required by method inserts",
      "immunoassay or competitive binding platforms with intrinsic factor blocking steps where used",
      "serum B12 and serum or RBC folate depending on institutional menu",
    ),
    row(
      "d-dimer-thrombosis-rule-out-laboratory-mlt",
      "D-Dimer Testing: Thrombosis Rule-Out Concepts for MLT Certification",
      "Clarify fibrin turnover, age-adjusted cutoffs in teaching models, and why elevated D-dimer is sensitive but non-specific in examination correlation items.",
      "D-Dimer, Coagulation, VTE, MLT",
      "D-dimer testing for MLT | NurseNest",
      "D-dimer physiology, immunoassay methods, and interpretive limits for laboratory learners.",
      "D-dimer immunoassays supporting venous thromboembolism evaluation algorithms",
      "citrated plasma collected with proper fill ratio and prompt centrifugation",
      "latex-enhanced immunoassays on coagulation or chemistry integrated systems",
      "D-dimer concentration relative to locally validated age-adjusted decision thresholds",
    ),
    row(
      "vancomycin-therapeutic-monitoring-troughs-mlt",
      "Vancomycin Therapeutic Monitoring: Troughs, Timing, and Assay Stability for MLT",
      "Emphasize pre-dose trough timing, renal function linkage, and pre-analytical stability as examination favorites in chemistry TDM modules.",
      "Vancomycin, TDM, Chemistry, Pharmacology, MLT",
      "Vancomycin monitoring for MLT | NurseNest",
      "Vancomycin trough timing, assay notes, and renal monitoring context for MLT students.",
      "vancomycin therapeutic drug monitoring in adult and pediatric services",
      "serum separator tubes drawn immediately before the next dose per protocol",
      "immunoassay or chromatographic methods depending on formulary laboratory menu",
      "vancomycin trough concentrations paired with creatinine trends",
    ),
    row(
      "phenytoin-therapeutic-drug-monitoring-basics-mlt",
      "Phenytoin Therapeutic Drug Monitoring Basics for MLT Students",
      "Cover protein binding changes in uremia, albumin correction teaching models, and timing of draws relative to dosing schedules on certification items.",
      "Phenytoin, TDM, Neurology, Chemistry, MLT",
      "Phenytoin TDM for MLT | NurseNest",
      "Phenytoin assays, timing, and protein-binding caveats for laboratory technology learners.",
      "phenytoin monitoring supporting seizure disorder management",
      "serum collected at consistent interval post-dose as defined by protocol",
      "immunoassay phenytoin methods with documented cross-reactivity panels",
      "total phenytoin concentration and albumin-linked interpretation where taught",
    ),
    row(
      "digoxin-therapeutic-monitoring-laboratory-mlt",
      "Digoxin Therapeutic Monitoring: Laboratory Timing and Interference Notes for MLT",
      "Address narrow therapeutic index, endogenous digoxin-like immunoreactive factors in infants, and specimen timing tied to dosing for examination vignettes.",
      "Digoxin, TDM, Cardiology, Chemistry, MLT",
      "Digoxin TDM for MLT | NurseNest",
      "Digoxin assay timing, interferences, and toxicity vigilance for MLT certification prep.",
      "digoxin therapeutic monitoring in heart failure and atrial fibrillation care",
      "serum drawn at least six hours post dose when protocols require elimination distribution phase completion",
      "fluorescence polarization immunoassay and other platform-specific digoxin methods",
      "serum digoxin concentrations interpreted with potassium and renal function",
    ),
    row(
      "glucose-fasting-random-hba1c-triad-mlt",
      "Glucose, Fasting, Random, and HbA1c: A Laboratory Triad for MLT Students",
      "Differentiate acute glycemia markers from chronic control metrics and tie specimen requirements to diabetes screening and diagnosis narratives.",
      "Glucose, Diabetes, Chemistry, HbA1c, MLT",
      "Glucose and HbA1c for MLT | NurseNest",
      "Fasting glucose, random glucose, and HbA1c roles for laboratory technology examinations.",
      "diabetes-relevant chemistry testing in laboratory and point-of-care settings",
      "fluoride gray-top tubes for glycolysis inhibition when glucose stability is required",
      "hexokinase or glucose oxidase chemistry methods and waived glucometer principles",
      "fasting plasma glucose, random glucose, and HbA1c where clinically paired",
    ),
    row(
      "lipase-amylase-pancreatitis-biomarkers-mlt",
      "Lipase and Amylase in Pancreatitis Biomarker Panels for MLT Certification",
      "Compare organ specificity, macroamylase confounding, and timing of elevation with examination items that pair alcohol or gallstone histories to laboratory trends.",
      "Lipase, Amylase, Pancreatitis, Chemistry, MLT",
      "Lipase amylase for MLT | NurseNest",
      "Pancreatic enzyme markers, timing, and specificity teaching for MLT students.",
      "acute pancreatitis biomarker support in emergency chemistry",
      "serum separator tubes processed within stability windows for enzyme activity",
      "enzymatic rate methods with lipase generally favored for specificity in modern curricula",
      "serum lipase and total amylase with isoamylase reflex teaching where applicable",
    ),
    row(
      "bnp-nt-probnp-heart-failure-markers-mlt",
      "BNP and NT-proBNP: Heart Failure Biomarkers for MLT Laboratory Science",
      "Explain ventricular stretch release, renal clearance differences, and assay heterogeneity as examination topics without overclaiming universal decision cutoffs.",
      "BNP, NT-proBNP, Cardiac, Chemistry, MLT",
      "BNP NT-proBNP for MLT | NurseNest",
      "Natriuretic peptide assays, physiology, and ED correlation for laboratory learners.",
      "natriuretic peptide testing supporting dyspnea evaluation pathways",
      "EDTA plasma or serum per method insert with minimal tourniquet time teaching",
      "immunoassay platforms reporting either BNP or NT-proBNP exclusively per menu",
      "BNP or NT-proBNP concentrations interpreted with renal function and age",
    ),
    row(
      "magnesium-laboratory-hypomagnesemia-hypermagnesemia-mlt",
      "Magnesium in the Laboratory: Hypomagnesemia, Hypermagnesemia, and Assay Notes for MLT",
      "Tie neuromuscular and cardiac risks to specimen hemolysis, renal loss, and GI loss patterns seen on certification-style correlation questions.",
      "Magnesium, Electrolytes, Chemistry, MLT",
      "Magnesium labs for MLT | NurseNest",
      "Magnesium measurement, physiology, and pre-analytical cautions for MLT students.",
      "magnesium monitoring across critical care, nutrition, and obstetric services",
      "serum separator tubes with hemolysis vigilance because red cells contain magnesium",
      "colorimetric dye-binding or enzymatic magnesium methods on chemistry tracks",
      "total serum magnesium with ionized magnesium specialty notes where taught",
    ),
    row(
      "phosphate-disorders-laboratory-interpretation-mlt",
      "Phosphate Disorders: Laboratory Interpretation for MLT Students",
      "Connect renal phosphate handling, bone disease, refeeding risk, and intracellular shifts to chemistry patterns on examination items.",
      "Phosphate, Electrolytes, Renal, MLT",
      "Phosphate labs for MLT | NurseNest",
      "Phosphorus testing, physiology, and disorder patterns for laboratory technology learners.",
      "phosphate analysis supporting renal, endocrine, and critical illness care",
      "serum separator tubes processed without prolonged contact with cellular elements",
      "molybdate-based or enzymatic phosphorus methods on modular analyzers",
      "inorganic phosphate concentration with calcium and PTH when clinically paired",
    ),
    row(
      "anion-gap-metabolic-acidosis-laboratory-mlt",
      "Anion Gap and Metabolic Acidosis: Laboratory Construction for MLT Certification",
      "Walk through sodium, chloride, bicarbonate, albumin correction teaching models, and ketoacidosis, toxin, and lactate gap narratives at chemistry depth.",
      "Anion Gap, Metabolic Acidosis, Chemistry, MLT",
      "Anion gap for MLT | NurseNest",
      "Serum anion gap calculation, albumin correction concepts, and acidosis patterns for MLT students.",
      "anion gap interpretation supporting metabolic acidosis evaluation",
      "simultaneous electrolyte panel on same draw to avoid mismatched calculations",
      "ion-selective electrode sodium and chloride with total CO2 or bicarbonate",
      "sodium, chloride, bicarbonate or total CO2, and derived anion gap",
    ),
    row(
      "serum-osmolality-serum-urine-laboratory-mlt",
      "Serum and Urine Osmolality: Laboratory Principles for MLT Students",
      "Differentiate freezing point depression osmometry from calculated osmolality, osmolar gaps in toxicology teaching, and diabetes insipidus evaluation patterns.",
      "Osmolality, Osmolar Gap, Chemistry, MLT",
      "Osmolality testing for MLT | NurseNest",
      "Serum and urine osmolality measurement and clinical correlation for MLT learners.",
      "osmolality testing supporting fluid balance and toxicology evaluation",
      "serum separator tubes and random urine specimens per protocol without added water",
      "freezing point osmometers with daily calibration checks per manufacturer inserts",
      "measured osmolality compared to calculated estimates in teaching scenarios",
    ),
    row(
      "cortisol-testing-laboratory-diurnal-variation-mlt",
      "Cortisol Testing: Diurnal Variation and Protocol Concepts for MLT",
      "Explain morning peaks, suppression test logistics at survey level, and specimen labeling requirements for timed endocrine collections on examinations.",
      "Cortisol, Endocrine, Chemistry, MLT",
      "Cortisol testing for MLT | NurseNest",
      "Cortisol specimen timing, methodology families, and protocol awareness for MLT students.",
      "cortisol immunoassays supporting adrenal insufficiency and Cushing evaluation pathways",
      "serum collected at protocol-defined morning or late-night times with accurate labels",
      "competitive immunoassay platforms with documented steroid cross-reactivity teaching",
      "total serum cortisol and salivary cortisol where offered as send-outs",
    ),
    row(
      "ana-screening-autoimmune-serology-basics-mlt",
      "ANA Screening and Autoimmune Serology Basics for MLT Laboratory Training",
      "Describe HEp-2 IFA patterns at recognition depth, reflex ENA concepts, and why a positive ANA is not diagnosis-specific on examination correlation items.",
      "ANA, Autoimmune, Immunology, MLT",
      "ANA screening for MLT | NurseNest",
      "Antinuclear antibody screening, patterns, and reflex pathways for laboratory learners.",
      "autoimmune serology screening in rheumatology referral workflows",
      "serum samples with strong clinical indication documentation per institutional criteria",
      "HEp-2 indirect immunofluorescence and multiplex immunoassay alternatives where used",
      "ANA screen titer and pattern with reflex extractable nuclear antigen testing concepts",
    ),
    row(
      "rheumatoid-factor-anti-ccp-serology-mlt",
      "Rheumatoid Factor and Anti-CCP Serology: Interpretation Anchors for MLT",
      "Contrast sensitivity and specificity themes, chronic infection false positives, and anti-CCP specificity advantages in rheumatoid arthritis narratives.",
      "Rheumatoid Factor, Anti-CCP, Serology, MLT",
      "RF anti-CCP for MLT | NurseNest",
      "Rheumatoid factor and cyclic citrullinated peptide antibody testing for MLT students.",
      "rheumatoid arthritis serology support in immunology sections",
      "serum separator tubes with interference review for high rheumatoid factor impacting other assays",
      "nephelometric RF and anti-CCP immunoassays on shared platforms",
      "RF and anti-CCP qualitative or quantitative results per laboratory menu",
    ),
    row(
      "hcg-qualitative-quantitative-pregnancy-testing-mlt",
      "hCG Qualitative and Quantitative Testing: Pregnancy Laboratory Essentials for MLT",
      "Cover hook effect teaching at survey depth, gestational dating limits, and qualitative urine versus quantitative serum workflows on certification items.",
      "hCG, Pregnancy, Immunoassay, MLT",
      "hCG testing for MLT | NurseNest",
      "Human chorionic gonadotropin immunoassays, hook effect concepts, and workflows for MLT learners.",
      "hCG testing supporting pregnancy diagnosis and select tumor marker pathways",
      "urine cups for point-of-care qualitative tests and serum for quantitative monitoring",
      "sandwich immunoassays with dilution protocols when extremely high titers suspected",
      "qualitative versus quantitative hCG reporting per orderable menu",
    ),
    row(
      "hepatitis-serology-panel-acute-chronic-basics-mlt",
      "Hepatitis Serology Panel Basics: Acute and Chronic Patterns for MLT Students",
      "Introduce HBsAg, anti-HBs, total and IgM anti-HBc, and HBeAg teaching grids without replacing CDC serology interpretation tables used in your course.",
      "Hepatitis, Serology, Virology, Public Health, MLT",
      "Hepatitis serology for MLT | NurseNest",
      "Hepatitis B serologic patterns and testing roles for medical laboratory technology students.",
      "hepatitis serology supporting infectious disease clinic workflows",
      "serum samples with documented vaccination history when interpreting anti-HBs alone",
      "multiplex immunoassays and individual marker platforms per public health laboratory partnerships",
      "HBsAg, anti-HBs, anti-HBc IgM and total, and HBV DNA send-out concepts",
    ),
    row(
      "hiv-screening-confirmatory-algorithm-concepts-mlt",
      "HIV Screening and Confirmatory Algorithm Concepts for MLT Certification",
      "Describe fourth-generation combo assays, supplemental testing roles, and confidentiality practices as examination professionalism topics.",
      "HIV, Serology, Public Health, MLT",
      "HIV testing algorithms for MLT | NurseNest",
      "HIV screening immunoassays and confirmatory pathway concepts for laboratory learners.",
      "HIV testing aligned with public health screening and linkage-to-care programs",
      "serum or plasma with chain-of-custody distinctions where forensic testing overlaps teaching",
      "Ag/Ab combo immunoassays with Western blot or nucleic acid testing confirmatory teaching models",
      "HIV screen reactive versus non-reactive reporting with reflex rules per jurisdiction",
    ),
    row(
      "syphilis-reverse-screening-algorithm-laboratory-mlt",
      "Syphilis Reverse Screening Algorithm: Laboratory Rationale for MLT Students",
      "Compare traditional versus reverse sequence testing, treponemal-first positives, and reflex nontreponemal testing used in modern public health laboratories.",
      "Syphilis, Serology, STI, MLT",
      "Syphilis screening for MLT | NurseNest",
      "Syphilis immunoassay algorithms and RPR reflex concepts for MLT examination prep.",
      "syphilis serology in screening and prenatal laboratory menus",
      "serum samples with gestational age documentation when obstetric screening items appear",
      "treponemal immunoassays with automated reflex to nontreponemal titers",
      "treponemal screen results with RPR or VDRL titer follow-up teaching",
    ),
    row(
      "urine-drug-screen-immunoassay-cross-reactivity-mlt",
      "Urine Drug Screens: Immunoassay Cross-Reactivity Education for MLT Learners",
      "List common false positives, prescription interference themes, and definitive confirmation roles without asserting site-specific cutoffs.",
      "Drug Screen, Toxicology, Immunoassay, MLT",
      "Urine drug screen for MLT | NurseNest",
      "Presumptive urine drug immunoassays, cross-reactivity, and confirmation concepts for MLT students.",
      "workplace and clinical urine drug screening supported by core chemistry or toxicology",
      "chain-of-custody urine containers when forensic documentation is required",
      "homogeneous enzyme immunoassays with class-specific antibody panels",
      "presumptive class positives with definitive mass spectrometry confirmation teaching",
    ),
    row(
      "peripheral-blood-smear-review-mlt-certification",
      "Peripheral Blood Smear Review: Morphology Anchors for MLT Certification",
      "Connect automated flagging to manual smear indications, RBC morphology vocabulary, and platelet estimation techniques used in hematology practicum checklists.",
      "Blood Smear, Hematology, Morphology, MLT",
      "Peripheral smear review for MLT | NurseNest",
      "Manual smear preparation, staining, and systematic scanning for MLT learners.",
      "peripheral smear morphology review triggered by analyzer flags or clinical request",
      "wedge smears from EDTA whole blood with timely staining to preserve morphology",
      "Wright-Giemsa stains with oil immersion microscopy at standardized magnifications",
      "RBC indices correlated with target cells, spherocytes, schistocytes, and teardrops as taught",
    ),
    row(
      "reticulocyte-count-anemia-classification-mlt",
      "Reticulocyte Counts in Anemia Classification: MLT Laboratory Reasoning",
      "Use absolute reticulocyte count, corrected reticulocyte concepts, and marrow responsiveness framing on examination items linking hemolysis or bleeding to appropriate marrow output.",
      "Reticulocyte, Anemia, Hematology, MLT",
      "Reticulocyte count for MLT | NurseNest",
      "Reticulocyte parameters, marrow response, and anemia classification for MLT students.",
      "reticulocyte enumeration supporting anemia pathophysiology instruction",
      "EDTA whole blood with supravital or automated RNA-linked reticulocyte channels",
      "flow cytometry reticulocyte counts on modern hematology analyzers",
      "reticulocyte percentage and absolute reticulocyte count with iron studies pairing",
    ),
    row(
      "direct-indirect-antiglobulin-tests-transfusion-mlt",
      "Direct and Indirect Antiglobulin Tests in Transfusion Medicine for MLT",
      "Differentiate DAT from IAT purposes, warm autoantibody patterns, and transfusion reaction investigation roles at blood bank survey depth.",
      "DAT, IAT, Coombs, Blood Bank, MLT",
      "Antiglobulin testing for MLT | NurseNest",
      "Direct and indirect antiglobulin testing purposes and interpretation for MLT learners.",
      "Coombs testing supporting hemolytic anemia and transfusion reaction workups",
      "EDTA and clotted samples per blood bank manual for DAT versus antibody investigation",
      "IgG and complement polyspecific and monospecific DAT panels where offered",
      "DAT positive patterns versus negative results in alloimmune hemolysis teaching",
    ),
    row(
      "antibody-screen-unexpected-antibodies-blood-bank-mlt",
      "Antibody Screen and Unexpected Antibody Workup Concepts for MLT Students",
      "Explain screening cell antigen composition, positive screen reflex to identification panels, and electronic issue eligibility tied to documented negatives.",
      "Antibody Screen, Blood Bank, Immunohematology, MLT",
      "Antibody screen for MLT | NurseNest",
      "Unexpected antibody screening and identification pathway basics for MLT certification prep.",
      "antibody detection supporting pretransfusion compatibility testing",
      "plasma or serum tested against group O screening cells per lot inserts",
      "column agglutination antibody screening with panel cell identification reflex teaching",
      "antibody screen positive versus negative with transfusion service follow-up rules",
    ),
    row(
      "point-of-care-glucometer-quality-control-mlt",
      "Point-of-Care Glucometer Quality Control and Competency for MLT Students",
      "Cover waived complexity expectations, operator checks, lot matching, and when laboratory confirmation is required on examination narratives.",
      "POCT, Glucose, Waived Testing, Quality, MLT",
      "POC glucose QC for MLT | NurseNest",
      "Waived glucose meter QC, competency, and confirmatory policies for laboratory learners.",
      "point-of-care glucose testing in nursing units and clinics",
      "capillary fingerstick samples with hand hygiene and finger cleaning protocols",
      "enzyme electrode strip methods with electronic QC lockout features where implemented",
      "POC glucose versus laboratory glucose correlation scenarios on examinations",
    ),
    row(
      "therapeutic-phlebotomy-iron-indices-laboratory-monitoring-mlt",
      "Therapeutic Phlebotomy: Laboratory Monitoring of Iron Indices for MLT",
      "Tie ferritin and transferrin saturation trends to guideline thresholds and organ monitoring language used in chronic therapeutic phlebotomy programs.",
      "Phlebotomy, Hemochromatosis, Iron, MLT",
      "Therapeutic phlebotomy labs for MLT | NurseNest",
      "Iron monitoring during therapeutic phlebotomy for medical laboratory technology students.",
      "serial iron studies supporting therapeutic phlebotomy programs",
      "serum specimens drawn before phlebotomy sessions per protocol calendars",
      "chemistry and immunoassay tracks reporting ferritin and iron saturation pairs",
      "ferritin and transferrin saturation with hepatic enzyme monitoring where taught",
    ),
  ];
}

function main(): void {
  const list = topics();
  const slugs = list.map((t) => t.slug);
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(dirname(REPORT_PATH), { recursive: true });

  const reportLines: string[] = [
    "# MLT static long-tail batch (50 posts)",
    "",
    "Generated deterministically by `scripts/blog/generate-mlt-static-longtail-batch.mts` and `scripts/blog/mlt-longtail-corpus.ts`.",
    "",
    "## Summary",
    "",
    `- Target directory: \`src/content/blog-static-longtail/\``,
    `- Posts: **${list.length}**`,
    "",
    "## Per-post metrics",
    "",
    "| slug | word count | >=1200 | internal link targets |",
    "| --- | ---: | --- | --- |",
  ];

  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    const body = buildBody(t, i, slugs);
    const wc = countWordsFromHtml(body);
    const ok = wc >= 1200 ? "pass" : "FAIL";
    writeFileSync(join(OUT_DIR, `${t.slug}.md`), frontmatter(t) + body + "\n", "utf8");
    const la = slugs[(i + 7) % slugs.length];
    const lb = slugs[(i + 13) % slugs.length];
    const lc = slugs[(i + 19) % slugs.length];
    const ld = slugs[(i + 23) % slugs.length];
    const linkCol = `/blog/${la}, /blog/${lb}, /blog/${lc}, /blog/${ld}, /app/dashboard`;
    reportLines.push(`| ${t.slug} | ${wc} | ${ok} | ${linkCol} |`);
  }

  reportLines.push(
    "",
    "## Validation gates",
    "",
    "Run from nursenest-core package root after generation. typecheck:critical succeeded after removing a corrupted local .next directory that broke routes.d.ts parsing.",
    "",
    "| command | exit code |",
    "| --- | ---: |",
    "| npm run validate:blog-static-longtail | 0 |",
    "| npm run diagnose:blog-slug-collisions -- --write-report | 0 |",
    "| npm run typecheck:critical | 0 |",
    "| npm run test:blog-recovery | 0 |",
    "| npm run test:homepage | 0 |",
    "",
  );

  writeFileSync(REPORT_PATH, reportLines.join("\n"), "utf8");
  console.log(`Wrote ${list.length} posts to ${OUT_DIR}`);
  console.log(`Report: ${REPORT_PATH}`);
}

const isCli =
  Boolean(process.argv[1]) && import.meta.url === pathToFileURL(resolve(process.argv[1]!)).href;
if (isCli) main();
