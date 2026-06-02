#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "exams-france.en.json");

const o = (k, v) => [k, v];

const entries = [
  o(
    "exams.france.metaTitle",
    "Nursing Registration in France (2026 Complete Guide) | Recognition, Language & EU Pathways",
  ),
  o(
    "exams.france.metaDescription",
    "France nursing guide: nurse registration, recognition for foreign diplomas, French language requirements, EU vs non-EU pathways, and work as a nurse in France. Migration options toward Canada and Australia.",
  ),
  o("exams.france.title", "Nursing Registration in France (2026 Complete Guide)"),
  o(
    "exams.france.lead",
    "French nursing practice is organised around national diplomas, registration with the relevant authority (Ordre infirmier), and—when you trained abroad—recognition of your qualification (réunion, équivalence, or other procedures depending on your file). This guide explains the recognition-based system, domestic versus international routes, French language expectations, EU versus third-country pathways, and high-level options when French-trained nurses consider Canada or Australia. NurseNest does not submit registration files for you; we provide learning tools and English NCLEX-style practice only for parallel US-style goals.",
  ),
  o("exams.france.eyebrow", "Updated for 2026"),
  o("exams.france.breadcrumb", "France nursing registration"),
  o("exams.france.sections.overview.title", "Nursing practice and registration in France (orientation)"),
  o(
    "exams.france.sections.overview.body",
    "In France, the profession of infirmier/infirmière is regulated. Access to the title and to practice is tied to recognised diplomas, registration with the Ordre infirmier, and compliance with national rules that evolve over time.\n\nThere is no single “NCLEX for France” that replaces the full regulatory pathway: internationally educated nurses typically need qualification recognition and language evidence aligned to official requirements.\n\nAlways rely on French official sources and the Ordre for your situation—NurseNest offers educational orientation only.",
  ),
  o("exams.france.sections.recognitionSystem.title", "A recognition-based system for internationally educated nurses"),
  o(
    "exams.france.sections.recognitionSystem.body",
    "If you trained outside France, your route usually involves comparing your programme to French requirements and obtaining a decision on recognition or required compensation (additional training, exams, or adaptation depending on the case).\n\nDocuments, translations, and curriculum mapping matter: keep names consistent across transcripts and identity papers.\n\nTimelines vary by dossier complexity and administrative workload—plan in months.\n\nNurseNest cannot lodge files with the Ordre or ministries on your behalf.",
  ),
  o("exams.france.sections.domesticInternational.title", "Domestic French training versus international applicants"),
  o(
    "exams.france.sections.domesticInternational.body",
    "Graduates of French nursing programmes follow national diploma routes and Ordre registration steps aligned with domestic education.\n\nInternationally educated candidates route through recognition procedures and any compensation measures defined for their profile.\n\nDo not assume a foreign licence automatically transfers—expect evidence-based review.",
  ),
  o("exams.france.sections.languageRequirements.title", "French language requirements for practice"),
  o(
    "exams.france.sections.languageRequirements.body",
    "Safe nursing in France requires professional French: patient communication, documentation, medication safety, and teamwork. Authorities and employers typically expect strong French proficiency; exact certificates and levels depend on your pathway and local expectations.\n\nSeparate French study from English NCLEX preparation so exam languages and item styles do not blur.\n\nNurseNest’s English question banks do not replace French language evidence for French registration.",
  ),
  o("exams.france.sections.euVsNonEu.title", "EU/EEA versus third-country pathways (high level)"),
  o(
    "exams.france.sections.euVsNonEu.body",
    "EU/EEA qualification mobility can benefit from EU professional recognition principles when training meets defined conditions; French specifics and language requirements still apply.\n\nThird-country nurses often face full dossier review, residence and work permissions outside NurseNest’s scope, and potentially longer evidence requirements.\n\nVerify immigration rules with official sources—this hub stays registration-oriented.",
  ),
  o("exams.france.sections.abroadMigration.title", "France abroad: Canada and Australia (orientation)"),
  o(
    "exams.france.sections.abroadMigration.body",
    "French-trained nurses exploring Canada typically work with provincial regulatory colleges, credential evaluation, and English or French tests depending on stream.\n\nAustralia uses national registration (Ahpra/NMBA) with English proficiency and qualification assessment.\n\nYour French registration and practice history become evidence packages—not automatic reciprocity. Start early on certified translations and consistent name spelling.\n\nNurseNest supports NCLEX-style preparation when the United States is a parallel objective; see country hubs for Canada and Australia for exam-culture orientation.",
  ),
  o("exams.france.sections.best.title", "Checklist before you build a timeline"),
  o(
    "exams.france.sections.best.body",
    "1) Identify the Ordre and official procedures for your training country.\n\n2) Collect diplomas, transcripts, and registration history with certified translations as required.\n\n3) Map French language evidence accepted for your pathway.\n\n4) Separate French registration preparation from any parallel NCLEX goal.\n\n5) Track validity windows for language tests and documents.\n\n6) Use qualified advisers for visas and work permissions—NurseNest focuses on learning tools.",
  ),
  o("exams.france.sections.links.title", "France topic guides first—then global lessons"),
  o(
    "exams.france.sections.links.body",
    "Use the France pages below for registration, how to become a nurse in France, and working abroad. NurseNest’s US NCLEX-style libraries appear after France-specific routes so domestic context stays first.\n\nIf you are not pursuing US exams, you can ignore NCLEX links.",
  ),
  o("exams.france.sections.blogIntegration.title", "France nursing articles on NurseNest"),
  o(
    "exams.france.sections.blogIntegration.body",
    "Long-form France nursing guides publish on a schedule from `france-nursing-200.manifest.json`—tagged for discovery. Featured cards prioritise France entry points; French-language posts lead when you browse in French locales.",
  ),
  o(
    "exams.france.paginationNote",
    "France nursing articles ship in paginated batches from `france-nursing-200.manifest.json`; this hub uses ISR for a fast static shell.",
  ),
  o("exams.france.links.rnLessonsUs", "US NCLEX-RN lessons"),
  o("exams.france.links.rnQuestionsUs", "US NCLEX-RN questions"),
  o("exams.france.links.pnLessonsUs", "US NCLEX-PN lessons"),
  o("exams.france.links.pnQuestionsUs", "US NCLEX-PN questions"),
  o("exams.france.links.npLessons", "US NP lessons"),
  o("exams.france.links.alliedUs", "US Allied Health hub"),
  o("exams.france.links.alliedCa", "Canada Allied Health hub"),
  o("exams.france.links.tools", "Study tools"),
  o("exams.france.faq.q1", "Is there one national nursing exam like NCLEX for all nurses in France?"),
  o(
    "exams.france.faq.a1",
    "No. French pathways centre on diplomas, Ordre registration, and—when applicable—recognition of foreign qualifications—not a single US-style exam for everyone.",
  ),
  o("exams.france.faq.q2", "What does recognition mean for foreign nurses?"),
  o(
    "exams.france.faq.a2",
    "It means your training is assessed against French requirements; you may receive full recognition, be asked for additional training, or need to meet other conditions.",
  ),
  o("exams.france.faq.q3", "Do I need fluent French?"),
  o(
    "exams.france.faq.a3",
    "Professional French is typically required for safe practice and registration discussions—confirm exact expectations for your pathway.",
  ),
  o("exams.france.faq.q4", "Are EU and non-EU processes identical?"),
  o(
    "exams.france.faq.a4",
    "Not always. EU/EEA mobility rules can apply when conditions are met; third-country applicants often follow different evidence and residence steps.",
  ),
  o("exams.france.faq.q5", "Can NurseNest submit my Ordre application?"),
  o(
    "exams.france.faq.a5",
    "No. We provide educational content and optional NCLEX-style practice for parallel goals—we do not file paperwork with French authorities.",
  ),
  o("exams.france.faq.q6", "Is NCLEX valid for French registration?"),
  o(
    "exams.france.faq.a6",
    "NCLEX is for US RN/PN pathways. It does not replace French diploma and Ordre requirements.",
  ),
  o("exams.france.faq.q7", "How long does recognition take?"),
  o(
    "exams.france.faq.a7",
    "Timelines vary widely—plan for multi-month processing and avoid relying on informal averages.",
  ),
  o("exams.france.faq.q8", "Where are official rules published?"),
  o(
    "exams.france.faq.a8",
    "Use French official sources and the Ordre infirmier for authoritative updates. NurseNest does not publish binding regulatory changes.",
  ),
  o("exams.france.faq.q9", "Can I work while recognition is pending?"),
  o(
    "exams.france.faq.a9",
    "Depends on residence status, employer, and local rules—verify with official guidance and qualified advisers.",
  ),
  o("exams.france.faq.q10", "Why are NCLEX links below France topics on this page?"),
  o(
    "exams.france.faq.a10",
    "So France registration and French language stay primary; NCLEX is optional parallel prep for a different exam culture.",
  ),
  o("exams.france.faq.q11", "How do blog articles relate to this hub?"),
  o(
    "exams.france.faq.a11",
    "Planned posts import from the France nursing manifest in batches; tags help you browse without slowing the hub.",
  ),
  o("exams.france.faq.q12", "Does this hub cover salaries and hospital hiring?"),
  o(
    "exams.france.faq.a12",
    "This page focuses on registration mechanics; see manifest themes for jobs and workplace topics as articles publish.",
  ),
  o("exams.france.faq.q13", "What about moving from France to Canada?"),
  o(
    "exams.france.faq.a13",
    "Expect provincial college assessment, language tests, and possible bridging—use official Canadian sources and the Canada hub for orientation.",
  ),
  o("exams.france.faq.q14", "What about Australia?"),
  o(
    "exams.france.faq.a14",
    "Ahpra/NMBA qualification assessment and English evidence are typical—see official Australian materials.",
  ),
  o("exams.france.faq.q15", "Does NurseNest guarantee registration success?"),
  o(
    "exams.france.faq.a15",
    "No. Outcomes depend on authorities and your dossier—we provide learning support, not legal or immigration services.",
  ),
  o(
    "exams.france.next.title",
    "Topic guides: nurse registration, how to become a nurse, working abroad",
  ),
  o(
    "exams.france.next.body",
    "Focused pages on nurse registration in France, how to become a nurse in France, and work abroad options for French-trained nurses.",
  ),
  o("exams.france.next.linkNurseRegistration", "Nurse registration in France"),
  o("exams.france.next.linkHowToBecome", "How to become a nurse in France"),
  o("exams.france.next.linkWorkAbroad", "Work abroad from France"),
  o("nav.france.stripLabel", "France"),
  o("nav.france.examsHub", "France Nursing"),
  o("nav.france.registration", "Registration"),
  o("nav.france.pathways", "Pathways"),
  o("nav.country.france.stripLabel", "France"),
  o("nav.country.france.examsHub", "France nursing hub"),
  o("nav.country.france.nurseRegistration", "Nurse registration in France"),
  o("nav.country.france.howToBecome", "How to become a nurse in France"),
  o("nav.country.france.workAbroad", "Work abroad (France nurses)"),
  o("nav.country.france.blog", "France nursing blog"),
  o("nav.country.france.frenchResources", "French-language hub (FR locale)"),
  o("nav.country.france.nclexPrepUs", "US NCLEX-RN lessons (parallel only)"),
  o("featured.france.sectionTitle", "Featured France nursing reads"),
  o(
    "featured.france.lead",
    "France-first articles from the manifest; French posts lead when you browse in French locales.",
  ),
  o("featured.france.card1Title", "Registration & recognition"),
  o(
    "featured.france.card1Body",
    "Ordre steps, foreign diploma recognition, and language milestones discussed in long-form posts.",
  ),
  o("featured.france.card2Title", "Jobs & migration planning"),
  o(
    "featured.france.card2Body",
    "France nursing jobs plus Canada and Australia pathway orientation as content rolls out.",
  ),
  o("featured.france.browseTag", "Browse all France nursing articles"),
  o("blog.country.france.tagName", "France nursing"),
  o(
    "blog.country.france.frPriorityNote",
    "French-language posts surface first when your locale is French and your country context is France.",
  ),
  o("blog.country.france.relatedTitle", "Related France nursing posts"),
  o("quicklinks.france.lessons", "Lessons library"),
  o("quicklinks.france.questions", "Question bank"),
  o("quicklinks.france.studyPlan", "Study plan"),
  o("quicklinks.france.blogTag", "France nursing blog tag"),
  o("exams.france.sections.faq.title", "Frequently asked questions"),
  o("exams.france.subpage.nurse-registration.title", "Nurse Registration in France"),
  o(
    "exams.france.subpage.nurse-registration.metaTitle",
    "Nurse Registration in France — Ordre & Recognition Overview",
  ),
  o(
    "exams.france.subpage.nurse-registration.metaDescription",
    "How registration works for French and foreign-trained nurses: Ordre infirmier, diplomas, and recognition concepts.",
  ),
  o(
    "exams.france.subpage.nurse-registration.body",
    "Registration as an infirmier/infirmière in France is tied to recognised diplomas and inscription with the Ordre infirmier, with procedures that differ for domestically trained and internationally educated nurses.\n\nForeign-trained candidates should expect qualification recognition steps and French language expectations aligned to official guidance.\n\nEmployers and hospitals add occupational health and onboarding requirements separate from core registration rules.\n\nNurseNest summarises common public-domain mechanics—verify every requirement with authoritative French sources.",
  ),
  o("exams.france.subpage.how-to-become-a-nurse.title", "How to Become a Nurse in France"),
  o(
    "exams.france.subpage.how-to-become-a-nurse.metaTitle",
    "How to Become a Nurse in France — Diplomas & Training Pathways",
  ),
  o(
    "exams.france.subpage.how-to-become-a-nurse.metaDescription",
    "Domestic nursing education routes and what internationally educated candidates usually need for recognition.",
  ),
  o(
    "exams.france.subpage.how-to-become-a-nurse.body",
    "Becoming a nurse in France for domestic students generally means completing an approved French nursing programme, meeting clinical education requirements, and following national diploma and Ordre registration steps.\n\nInternationally educated applicants instead pursue recognition of prior learning and diplomas, with possible compensatory measures.\n\nCareer planning should separate French registration goals from parallel NCLEX preparation in English.\n\nNurseNest does not place students into French programmes or registration slots.",
  ),
  o("exams.france.subpage.work-abroad.title", "Work Abroad for French-Trained Nurses"),
  o(
    "exams.france.subpage.work-abroad.metaTitle",
    "Work Abroad from France — Canada, Australia, US Pathways",
  ),
  o(
    "exams.france.subpage.work-abroad.metaDescription",
    "High-level orientation for French-trained nurses considering Canada, Australia, or NCLEX countries.",
  ),
  o(
    "exams.france.subpage.work-abroad.body",
    "Working abroad starts with a target country’s regulator. Canada is province-specific; Australia uses Ahpra/NMBA; the United States uses state boards and NCLEX eligibility.\n\nYour French registration and experience support evidence but do not replace foreign requirements.\n\nPlan language tests, credential evaluation, and translation early.\n\nNurseNest can support NCLEX-style preparation when the US is on your roadmap; use dedicated country hubs for Canada and Australia.",
  ),
];

const obj = Object.fromEntries(entries);
writeFileSync(OUT, JSON.stringify(obj, null, 2) + "\n", "utf8");
console.log(`wrote ${OUT} keys ${Object.keys(obj).length}`);
