#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "exams-china.en.json");

const o = (k, v) => [k, v];

const entries = [
  o("exams.china.metaTitle", "Nursing Licensing Exams in China (2026 Complete Guide) | NNQE & Abroad Pathways"),
  o(
    "exams.china.metaDescription",
    "China nursing exam guide: National Nurse Qualification Examination (NNQE), National Health Commission context, eligibility, domestic licensure vs international migration, and NCLEX for Chinese nurses. Pathways to Canada, Australia, UK, and Gulf.",
  ),
  o("exams.china.title", "Nursing Licensing Exams in China (2026 Complete Guide)"),
  o(
    "exams.china.lead",
    "China regulates nursing practice through national education requirements and the National Nurse Qualification Examination (护士执业资格考试, NNQE)—typically a computer-based test aligned to official syllabi. This guide explains how domestic licensure discussions fit together under National Health Commission–aligned administration, who is eligible, how the domestic pathway differs from international migration routes, and how Chinese-trained nurses plan English tests and regulator evidence for Canada, Australia, the United Kingdom, the United States, and Gulf destinations. NurseNest does not register you for Chinese examinations; we provide NCLEX-style practice for parallel goals.",
  ),
  o("exams.china.eyebrow", "Updated for 2026"),
  o("exams.china.breadcrumb", "China nursing exams"),
  o("exams.china.sections.overview.title", "Nursing in China: national licensure pathway"),
  o(
    "exams.china.sections.overview.body",
    "China’s nurse licensing conversation usually refers to completing an approved nursing education programme, satisfying internship or practice requirements announced for your cohort, and passing the National Nurse Qualification Examination as part of practice eligibility discussions. After a pass, candidates follow administrative registration steps published for their context.\n\nNational policy direction and health workforce oversight are commonly associated with the National Health Commission (NHC) in public materials; examination administration details appear through authorised examination and health authority channels. Always treat Chinese-language bulletins and the official candidate portal as authoritative for dates, fees, and identity rules.\n\nNurseNest summarizes widely discussed mechanics for internationally mobile readers comparing systems—it is not legal advice and not a substitute for official Chinese sources.",
  ),
  o("exams.china.sections.nnqe.title", "National Nurse Qualification Examination (NNQE)"),
  o(
    "exams.china.sections.nnqe.body",
    "The NNQE is the flagship computer-based qualifying examination pathway that nursing graduates and eligible candidates use when discussing nurse practice access under China’s national health professional examination system. Items are aligned to published syllabi; formats and weighting evolve—download the bulletin for your exact sitting.\n\nEligibility is cohort-specific: recognised education completion, required internship or practice documentation, identity consistency, and any additional conditions announced for your application cycle must match what you submit online.\n\nOutcomes are reported through official channels; a pass feeds into subsequent qualification and registration steps as defined administratively. Retake intervals, annual windows, and cooling-off rules change—read the notice for your year.\n\nIf you are also preparing for NCLEX-RN, keep two study systems: NNQE materials for domestic rules; NurseNest RN lessons and questions for US-style clinical judgement practice.",
  ),
  o("exams.china.sections.regulator.title", "Regulator structure, eligibility, and what “passing” means"),
  o(
    "exams.china.sections.regulator.body",
    "Candidates typically encounter three layers in explanations: national health administration policy direction, examination organisation through authorised national examination channels, and local or institutional steps after results. Your school’s counselling office and employer HR teams may add checklists—treat them as supplements to official bulletins.\n\nEligibility audits commonly review transcripts, internship completion, identification, and ethical conduct declarations. International students or cross-province applicants should pay extra attention to documentation consistency.\n\n“Passing” the NNQE is a major milestone but not the entire story: follow-through registration, continuing education expectations, and employer onboarding may still apply.\n\nNurseNest does not interpret Chinese regulatory notices for your specific case—verify with authoritative Chinese sources.",
  ),
  o("exams.china.sections.domesticVsIntl.title", "Domestic pathway vs international nurse migration"),
  o(
    "exams.china.sections.domesticVsIntl.body",
    "Domestic pathway: finish recognised education, meet practice requirements, pass the NNQE, then complete registration steps defined in Chinese administrative materials for your jurisdiction and employer context.\n\nInternational migration: target-country regulators assess your education and practice history, English or other language tests, possible competency exams, and visa/employer steps. A Chinese licence and examination pass are supporting evidence—they rarely substitute for a foreign regulator’s entire checklist.\n\nPlanning both tracks at once is common: keep calendars separate (NNQE bulletin dates vs NCLEX eligibility timelines), and keep document names consistent across transcripts, passports, and registration certificates.\n\nNurseNest focuses on transferable clinical reasoning for exams like NCLEX when the United States or Canada is your objective.",
  ),
  o("exams.china.sections.allied.title", "Allied health pathways (where relevant)"),
  o(
    "exams.china.sections.allied.body",
    "China’s health workforce includes multiple professions with separate national examination and registration systems. Nursing candidates should avoid mixing allied health rumours into NNQE preparation—use the bulletin that matches your profession.\n\nIf you are also exploring international allied routes, compare country-specific competency and language rules; NurseNest hosts Allied Health hubs for US/Canada study modes separate from nursing.",
  ),
  o("exams.china.sections.migrationCanada.title", "China to Canada: nursing registration highlights"),
  o(
    "exams.china.sections.migrationCanada.body",
    "Canada assesses internationally educated nurses province by province. Expect credential evaluation, possible bridging education, English or French thresholds, and employer-sponsored pathways that vary by stream.\n\nYour China education and licensure history become evidence in a gap analysis—not automatic reciprocity. Start early on notarised translations and name harmonisation.\n\nNurseNest offers NCLEX-RN–style practice frequently used by internationally trained nurses; align any study with your college’s current checklist.",
  ),
  o("exams.china.sections.migrationAustralia.title", "China to Australia: AHPRA/NMBA orientation"),
  o(
    "exams.china.sections.migrationAustralia.body",
    "Australia’s nursing registration sits with the Nursing and Midwifery Board of Australia under the national scheme; English evidence, qualification assessment, and sometimes additional requirements apply to internationally educated applicants.\n\nChina’s domestic NNQE does not replace Australian evidence rules. Budget for assessment fees, possible bridging, and timeline uncertainty.\n\nUse NurseNest’s Australia exam hub for big-picture orientation alongside official Ahpra materials.",
  ),
  o("exams.china.sections.migrationUk.title", "China to the United Kingdom: NMC registration"),
  o(
    "exams.china.sections.migrationUk.body",
    "The Nursing and Midwifery Council (NMC) evaluates education, registration history, English proficiency, and where applicable Test of Competence components. UK rules are independent of China’s NNQE.\n\nPrepare certified translations, verify English test validity windows, and plan for possible skills assessment costs.\n\nNurseNest supports NCLEX-style reasoning practice for nurses also targeting the United States; NMC processes remain separate.",
  ),
  o("exams.china.sections.migrationGulf.title", "China to Gulf states: licensing and exams"),
  o(
    "exams.china.sections.migrationGulf.body",
    "Gulf jurisdictions often use health authority licensing, dataflow-style primary source verification, and Prometric-style assessments depending on role and emirate. Requirements change frequently—verify with the target regulator and your employer’s credentialing team.\n\nChinese licence evidence may help demonstrate professional standing but does not remove local exams or Arabic/English thresholds where required.\n\nSee NurseNest’s Middle East exam hub for Prometric and Gulf orientation pages.",
  ),
  o("exams.china.sections.abroad.title", "United States and cross-border mobility (summary)"),
  o(
    "exams.china.sections.abroad.body",
    "United States: CGFNS-related services may apply depending on state board rules; English proficiency; NCLEX-RN eligibility through a state board of nursing remains the common RN entry assessment culture.\n\nCanada, Australia, and the UK are detailed in the sections above. Wherever you aim, build a single document vault with consistent spelling, transcripts, and registration certificates.\n\nNurseNest provides NCLEX-RN lessons and questions used by internationally educated nurses worldwide.",
  ),
  o("exams.china.sections.best.title", "Checklist: domestic exam vs abroad plan"),
  o(
    "exams.china.sections.best.body",
    "1) Download the NNQE bulletin for your cycle and confirm eligibility line-by-line.\n\n2) Keep internship and practice evidence ready in the formats the portal requests.\n\n3) If targeting NCLEX, schedule English tests with validity that matches board rules.\n\n4) For Canada/Australia/UK/Gulf, start credential evaluation research early and budget translation costs.\n\n5) Separate study blocks so NNQE blueprint content does not blur into NCLEX item styles.\n\n6) Use qualified advisers for immigration steps—NurseNest focuses on exam reasoning skills.",
  ),
  o("exams.china.sections.links.title", "Study tools and parallel NCLEX practice"),
  o(
    "exams.china.sections.links.body",
    "Use the quick links below for lessons, question banks, and study plans. NNQE preparation remains anchored in official Chinese materials; NurseNest’s English resources help when your parallel goal is US-style NCLEX clinical judgement.",
  ),
  o("exams.china.sections.blogIntegration.title", "China nursing articles on NurseNest"),
  o(
    "exams.china.sections.blogIntegration.body",
    "Long-form China nursing guides publish on a schedule from the blog manifest—tagged for discovery. Browse the tag to see titles as batches import; featured cards below highlight common entry points.",
  ),
  o("exams.china.paginationNote", "China nursing articles ship in paginated batches from `china-nursing-200.manifest.json`; this hub uses ISR for a fast shell."),
  o("exams.china.sections.faq.title", "Frequently asked questions"),
  o("exams.china.links.rnLessonsUs", "US NCLEX-RN lessons"),
  o("exams.china.links.rnQuestionsUs", "US NCLEX-RN questions"),
  o("exams.china.links.pnLessonsUs", "US NCLEX-PN lessons"),
  o("exams.china.links.pnQuestionsUs", "US NCLEX-PN questions"),
  o("exams.china.links.npLessons", "US NP lessons"),
  o("exams.china.links.alliedUs", "US Allied Health hub"),
  o("exams.china.links.alliedCa", "Canada Allied Health hub"),
  o("exams.china.links.tools", "Study tools"),
  o("exams.china.links.lessons", "Lessons library"),
  o("exams.china.links.questionBank", "Question bank"),
  o("exams.china.links.studyPlan", "Study plan (sign in)"),
  o("exams.china.links.middleEastHub", "Middle East nursing exams hub"),
  o("exams.china.links.australiaHub", "Australia nursing registration hub"),
];

const faqs = [
  [
    "What is the National Nurse Qualification Examination (NNQE)?",
    "It is the widely recognised national qualifying examination pathway for nurse practice eligibility discussions in China, typically computer-based with multiple-choice style items; confirm the current bulletin for your cohort.",
  ],
  [
    "Who oversees nursing policy at the national level in public materials?",
    "The National Health Commission is commonly cited for national health administration direction; examination administration details appear through authorised examination channels.",
  ],
  [
    "Is China’s NNQE the same as NCLEX?",
    "No. NCLEX is the US/Canadian RN/PN entry licensing assessment culture. China’s NNQE follows Chinese syllabi and administrative rules.",
  ],
  [
    "Can NurseNest replace official Chinese NNQE materials?",
    "No. NurseNest supports transferable clinical reasoning for exams like NCLEX; official Chinese bulletins and authorised materials remain primary for NNQE preparation.",
  ],
  [
    "How do Chinese-trained nurses prepare for NCLEX-RN?",
    "Plan English tests, credential evaluation where required, state board eligibility, and sustained practice with NCLEX-style items—parallel to, not mixed with, NNQE study unless your schedule deliberately separates blocks.",
  ],
  [
    "What is different about registering in Canada vs the United States?",
    "Canada is province-by-province with college-specific gap analysis; the US uses state boards and NCLEX eligibility. Both require evidence packages and often English tests.",
  ],
  [
    "Does passing the NNQE automatically register me in Australia or the UK?",
    "No. Australia (Ahpra/NMBA) and the UK (NMC) have independent evidence, English, and possible competency test requirements.",
  ],
  [
    "What should I know about Gulf licensing?",
    "Requirements vary by country and employer; dataflow verification and authority exams are common. Verify current regulator notices.",
  ],
  [
    "Is the NNQE always computer-based?",
    "National materials have emphasized computer-based delivery in recent cycles; confirm modalities in the official notice for your sitting.",
  ],
  [
    "What if I fail the NNQE?",
    "Retake policies are cycle-specific—read official guidance on resitting, waiting periods, and fees.",
  ],
  [
    "Do I need English for the NNQE itself?",
    "Domestic administration language expectations are defined in Chinese official materials. English tests matter primarily for international pathways (e.g., NCLEX, NMC, Ahpra).",
  ],
  [
    "Where should I read authoritative updates?",
    "National Health Commission and authorised examination authority publications in Chinese. NurseNest does not publish binding regulatory updates for China.",
  ],
  [
    "How do allied health exams relate to nursing?",
    "Different professions have different national examinations—do not assume allied rumours apply to NNQE eligibility.",
  ],
  [
    "Can I study for NNQE and NCLEX at the same time?",
    "Many candidates do, but use separate calendars and materials to avoid blueprint confusion.",
  ],
  [
    "How do blog articles relate to this hub?",
    "Planned long-form posts use the China nursing manifest for batched imports; tags help you browse without slowing the hub.",
  ],
];

for (let i = 0; i < faqs.length; i += 1) {
  entries.push(o(`exams.china.faq.q${i + 1}`, faqs[i][0]));
  entries.push(o(`exams.china.faq.a${i + 1}`, faqs[i][1]));
}

entries.push(
  o("exams.china.next.title", "Topic guides"),
  o(
    "exams.china.next.body",
    "Focused pages on the NNQE, how to become a nurse in China, working abroad, and NCLEX planning for Chinese-trained nurses.",
  ),
  o("exams.china.next.linkNursingExam", "NNQE deep dive"),
  o("exams.china.next.linkWorkAbroad", "Work abroad roadmap"),
  o("exams.china.next.linkHowToBecome", "How to become a nurse in China"),
  o("exams.china.next.linkNclexChinese", "NCLEX for Chinese nurses"),
);

entries.push(
  o("nav.china.stripLabel", "China"),
  o("nav.china.examsHub", "China Nursing Exams"),
  o("nav.china.nursingExam", "China Nursing Exam"),
  o("nav.china.workAbroad", "Work Abroad"),
);

entries.push(
  o("nav.country.china.stripLabel", "China"),
  o("nav.country.china.examsHub", "China Nursing Exam"),
  o("nav.country.china.nursingExam", "NNQE guide"),
  o("nav.country.china.howToBecome", "How to Become a Nurse in China"),
  o("nav.country.china.workAbroad", "Work Abroad for Chinese Nurses"),
  o("nav.country.china.nclexTopic", "NCLEX for Chinese Nurses"),
  o("nav.country.china.blog", "China nursing blog"),
  o("nav.country.china.nclexPrepUs", "US NCLEX-RN lessons (parallel prep)"),
);

entries.push(
  o("featured.china.sectionTitle", "Featured China nursing reads"),
  o("featured.china.lead", "Start with the tag feed for manifest-planned articles; Simplified and Traditional Chinese posts are prioritised when you browse in Chinese locales."),
  o("featured.china.card1Title", "National Nurse Qualification Examination guides"),
  o("featured.china.card1Body", "Syllabus orientation, eligibility reminders, and study discipline for the NNQE."),
  o("featured.china.card2Title", "Chinese nurses working abroad"),
  o("featured.china.card2Body", "Evidence, English tests, and realistic timelines for Canada, Australia, UK, US, and Gulf moves."),
  o("featured.china.browseTag", "Browse all China nursing articles"),
);

entries.push(
  o("blog.country.china.tagName", "China nursing"),
  o("blog.country.china.zhPriorityNote", "Chinese-language posts surface first when your locale is Chinese and your country context is China."),
  o("blog.country.china.relatedTitle", "Related China nursing posts"),
);

entries.push(
  o("quicklinks.china.lessons", "Lessons library"),
  o("quicklinks.china.questions", "Question bank"),
  o("quicklinks.china.studyPlan", "Study plan"),
  o("quicklinks.china.blogTag", "China nursing blog tag"),
);

const sub = {
  "nursing-exam": {
    title: "National Nurse Qualification Examination (NNQE) Orientation",
    metaTitle: "China Nursing Exam — National Nurse Qualification Examination (NNQE)",
    metaDescription:
      "NNQE overview: computer-based format, National Health Commission context, eligibility, and how results connect to practice qualification steps.",
    body: "The NNQE (护士执业资格考试) is the central examination conversation for nursing graduates seeking practice eligibility under China’s national health professional administration.\n\nDelivery is typically computer-based with multiple-choice style items aligned to official syllabi. Download the bulletin for your sitting year.\n\nEligibility ties to recognised education, internship or practice documentation, and accurate identity information in the official application flow.\n\nAfter results, follow registration instructions for your administrative context. NurseNest does not replace official preparation resources.\n\nIf you also target NCLEX-RN, use our RN lessons and questions separately to train US-style prioritisation.",
  },
  "work-abroad": {
    title: "China-Trained Nurses: Working in Canada, the US, the UK, Australia, and the Gulf",
    metaTitle: "Chinese Nurses Working Abroad — Registration & Exam Pathways",
    metaDescription:
      "High-level roadmap for China-trained nurses targeting NMBA/Ahpra, NMC, NCLEX, Canadian colleges, or Gulf licensing.",
    body: "Working abroad starts with a target regulator. Each country uses different evidence rules, English tests, and timelines.\n\nUnited States: NCLEX-RN eligibility through a state board; possible CGFNS-related steps; English thresholds vary by state.\n\nCanada: provincial colleges and gap analyses; bridging may be required.\n\nAustralia: Ahpra/NMBA evidence and English requirements.\n\nUnited Kingdom: NMC registration including possible Test of Competence.\n\nGulf: authority-specific licensing, dataflow verification, and exams depending on role and location.\n\nYour Chinese licence supports evidence packages but does not replace foreign requirements. NurseNest helps with NCLEX-style preparation when the US is on your roadmap.",
  },
  "how-to-become-a-nurse": {
    title: "How to Become a Nurse in China",
    metaTitle: "How to Become a Nurse in China — Education, NNQE, and Registration",
    metaDescription:
      "Outline of recognised nursing education, internship expectations, NNQE sitting, and post-pass registration concepts.",
    body: "Becoming a nurse in China generally means completing an approved nursing programme, fulfilling internship or practice requirements announced for your cohort, passing the NNQE, and completing administrative registration steps described in official notices.\n\nKeep documentation consistent across school records, identification, and application portals. Follow your bulletin’s photo, fee, and deadline rules exactly.\n\nEmployers may add occupational health or facility-specific onboarding—those are separate from the national examination.\n\nNurseNest does not place candidates into Chinese exam seats. If you are also preparing for NCLEX, use English-language NCLEX lessons separately from NNQE study.",
  },
  "nclex-for-chinese-nurses": {
    title: "NCLEX for Chinese Nurses: Parallel Preparation Without Mixing Blueprints",
    metaTitle: "NCLEX for Chinese Nurses — Clinical Judgement Practice",
    metaDescription:
      "How Chinese-trained nurses use NCLEX-RN lessons and questions alongside domestic NNQE preparation.",
    body: "NCLEX-RN is not a substitute for the NNQE and does not grant Chinese licensure by itself. Many candidates prepare for both: use official Chinese materials for NNQE; use NurseNest’s US NCLEX-RN lessons and question bank for English clinical judgement and safety prioritisation.\n\nTypical steps toward US RN licensure include English tests, credential evaluation where required, state board NCLEX eligibility, and passing NCLEX-RN.\n\nKeep calendars separate so item styles and blueprint language do not blur. Align any practice with your state board’s current checklist.\n\nStart from the US RN hub links below when you are ready to practise NCLEX-style cases.",
  },
};

for (const [slug, v] of Object.entries(sub)) {
  entries.push(o(`exams.china.subpage.${slug}.title`, v.title));
  entries.push(o(`exams.china.subpage.${slug}.metaTitle`, v.metaTitle));
  entries.push(o(`exams.china.subpage.${slug}.metaDescription`, v.metaDescription));
  entries.push(o(`exams.china.subpage.${slug}.body`, v.body));
}

const obj = Object.fromEntries(entries);
writeFileSync(OUT, JSON.stringify(obj, null, 2), "utf8");
console.log("wrote", OUT, "keys", Object.keys(obj).length);
