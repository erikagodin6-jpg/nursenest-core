#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "exams-japan.en.json");

const o = (k, v) => [k, v];

const entries = [
  o(
    "exams.japan.metaTitle",
    "Nursing Licensing Exams in Japan (2026 Complete Guide) | National Nursing Examination & Abroad Pathways",
  ),
  o(
    "exams.japan.metaDescription",
    "Japan nursing exam guide: Japan National Nursing Examination (看護師国家試験), MHLW context, domestic licensure, Japanese language requirements, EPA and international nurse pathways, and work abroad for Japanese nurses. Canada, Australia, UK, and NCLEX orientation.",
  ),
  o("exams.japan.title", "Nursing Licensing Exams in Japan (2026 Complete Guide)"),
  o(
    "exams.japan.lead",
    "Japan licenses first-time registered nurses through the national nursing examination system (看護師国家試験) under Ministry of Health, Labour and Welfare (MHLW) policy and related ordinances. This guide explains the Japan National Nursing Examination, how national oversight and prefectural licensing fit together, domestic education and language expectations, EPA and other international nurse mobility frameworks discussed in public materials, and pathways for Japanese-trained nurses seeking Canada, Australia, the United Kingdom, or NCLEX-RN in the United States. NurseNest does not register you for Japanese examinations; we provide English NCLEX-style practice for parallel goals.",
  ),
  o("exams.japan.eyebrow", "Updated for 2026"),
  o("exams.japan.breadcrumb", "Japan nursing exams"),
  o("exams.japan.sections.overview.title", "Nursing in Japan: national examination and licensure pathway"),
  o(
    "exams.japan.sections.overview.body",
    "Becoming a licensed nurse (看護師) in Japan typically means completing an approved nursing education programme, meeting clinical training requirements, passing the National Nursing Examination, and applying for licensure through the prefectural process described in official Japanese notices.\n\nPolicy direction is commonly associated with the MHLW; examination administration and candidate-facing schedules appear through authorised national channels. Always treat Japanese-language bulletins as authoritative for eligibility, fees, and application windows.\n\nNurseNest summarizes widely discussed mechanics for internationally mobile readers—it is not legal advice and not a substitute for official Japanese sources.",
  ),
  o("exams.japan.sections.regulator.title", "Regulator structure: MHLW, national exam, and prefectural licence"),
  o(
    "exams.japan.sections.regulator.body",
    "Public explanations usually separate national policy (MHLW and related ordinances), the standardised national examination pathway, and prefectural-level steps for initial licensure issuance after a pass. Professional associations and schools may add orientation—but official eligibility comes from Japanese legal sources.\n\nInternational readers should expect Japanese primary materials for blueprint changes, retake rules, and identity documentation.\n\nNurseNest does not interpret MHLW notices for your specific case—verify with authoritative Japanese publications.",
  ),
  o("exams.japan.sections.nationalExam.title", "Japan National Nursing Examination (看護師国家試験)"),
  o(
    "exams.japan.sections.nationalExam.body",
    "The National Nursing Examination is the national qualifying examination for first-time nurse licensure discussions in Japan. Delivery is computer-based in recent cycles; item formats and subject weighting follow official Japanese syllabi published for each sitting.\n\nEligibility ties to completion of recognised nursing education and any cohort-specific clinical training requirements announced in notices. Application windows, fees, and retake policies are cycle-specific.\n\nPassing is a major milestone; subsequent prefectural application steps define how a licence is issued in practice.\n\nIf you are also preparing for NCLEX-RN, keep Japanese national exam preparation and NCLEX preparation as separate study systems.",
  ),
  o("exams.japan.sections.languageDomestic.title", "Domestic pathway and Japanese language requirements"),
  o(
    "exams.japan.sections.languageDomestic.body",
    "Domestic licensure discussions assume Japanese-language proficiency for the national examination and for reading official notices. Technical nursing vocabulary, care process wording, and long scenario stems reward fluent academic Japanese—not conversational fluency alone.\n\nIf Japanese is not your first language, plan extended reading drills, kanji notebooks for medical terms, and timed practice aligned to official formats where permitted.\n\nNurseNest’s English NCLEX libraries do not replace Japanese national exam study; they help when your parallel goal is English RN entry exams abroad.",
  ),
  o("exams.japan.sections.epaInternational.title", "EPA and international nurse pathways (orientation)"),
  o(
    "exams.japan.sections.epaInternational.body",
    "Japan participates in international frameworks—including EPA-related nursing workforce arrangements discussed in public policy materials—that can affect how certain internationally educated candidates train and qualify for practice in Japan under specific bilateral programmes. Rules change and are role-specific; always read the Japanese notice that matches your pathway.\n\nSeparately, Japanese-trained nurses seeking work abroad use target-country regulators (NCLEX for the US, provincial colleges in Canada, Ahpra/NMBA in Australia, NMC in the UK).\n\nNurseNest focuses on transferable English clinical judgement for exams like NCLEX when abroad is your objective.",
  ),
  o("exams.japan.sections.abroad.title", "International pathways for Japanese-trained nurses (summary)"),
  o(
    "exams.japan.sections.abroad.body",
    "United States: state board NCLEX-RN eligibility, English tests, credential evaluation where required.\n\nCanada: provincial regulatory assessment and possible bridging; English/French thresholds vary.\n\nAustralia: Ahpra/NMBA qualification assessment and English evidence.\n\nUnited Kingdom: NMC registration including possible Test of Competence and English requirements.\n\nYour Japan licence and practice history become evidence—not automatic reciprocity. Harmonise romanisation and kanji readings on official documents early.\n\nNurseNest supports NCLEX-style preparation used by internationally educated nurses worldwide.",
  ),
  o("exams.japan.sections.migrationCanada.title", "Canada for Japanese nurses: college assessment and bridging"),
  o(
    "exams.japan.sections.migrationCanada.body",
    "Canada assesses internationally educated nurses province by province. Expect credential evaluation, possible bridging education, and English or French requirements depending on stream.\n\nStart early on notarised translations and consistent name spelling across transcripts and registration certificates.",
  ),
  o("exams.japan.sections.migrationAustralia.title", "Australia for Japanese nurses: AHPRA/NMBA orientation"),
  o(
    "exams.japan.sections.migrationAustralia.body",
    "Australia’s national registration uses English proficiency standards, qualification assessment, and sometimes additional requirements. Japan’s domestic examination does not replace Australian evidence rules.\n\nUse official Ahpra materials as authoritative; NurseNest’s Australia exam hub supports exam-culture orientation.",
  ),
  o("exams.japan.sections.migrationUk.title", "United Kingdom for Japanese nurses: NMC registration"),
  o(
    "exams.japan.sections.migrationUk.body",
    "The Nursing and Midwifery Council evaluates education, registration history, English proficiency, and where applicable competency testing. UK rules are independent of Japan’s national nursing examination.\n\nPlan certified translations and verify English test validity windows.",
  ),
  o("exams.japan.sections.best.title", "Checklist: domestic exam vs abroad plan"),
  o(
    "exams.japan.sections.best.body",
    "1) Download the Japanese bulletin for your cohort and confirm eligibility line-by-line.\n\n2) Train Japanese reading stamina for computer-based stems under time limits.\n\n3) If targeting NCLEX in parallel, separate study blocks so languages and blueprints do not blur.\n\n4) Schedule IELTS/OET/TOEFL with validity that matches your target regulator.\n\n5) For Canada/Australia/UK/US, start credential evaluation research early.\n\n6) Use qualified advisers for immigration steps—NurseNest focuses on exam preparation skills.",
  ),
  o("exams.japan.sections.links.title", "Study tools, lessons, and parallel NCLEX practice"),
  o(
    "exams.japan.sections.links.body",
    "Use the quick links for lessons, question banks, and study plans. Japan national exam preparation remains anchored in official Japanese materials. NurseNest’s English resources help when your parallel goal is US-style NCLEX clinical judgement.\n\nJapan-specific topic links appear before NCLEX so domestic context stays first.",
  ),
  o("exams.japan.sections.blogIntegration.title", "Japan nursing articles on NurseNest"),
  o(
    "exams.japan.sections.blogIntegration.body",
    "Long-form Japan nursing guides publish on a schedule from `japan-nursing-200.manifest.json`—tagged for discovery. Featured cards below highlight common entry points; Japanese-language posts are prioritised when you browse in Japanese locales.",
  ),
  o("exams.japan.sections.blogRoll.title", "Country-specific articles (blog)"),
  o(
    "exams.japan.sections.blogRoll.body",
    "Long-form Japan nursing guides are imported in paginated batches from the blog manifest and tagged for discovery. Use the tag page to browse titles as content rolls out—this hub stays ISR-fast.",
  ),
  o("exams.japan.links.blogCategory", "Browse Japan nursing articles (tag)"),
  o(
    "exams.japan.paginationNote",
    "Japan nursing articles ship in paginated batches from `japan-nursing-200.manifest.json`; this hub uses ISR for a fast static shell.",
  ),
  o("exams.japan.sections.faq.title", "Frequently asked questions"),
  o("exams.japan.links.rnLessonsUs", "US NCLEX-RN lessons"),
  o("exams.japan.links.rnQuestionsUs", "US NCLEX-RN questions"),
  o("exams.japan.links.pnLessonsUs", "US NCLEX-PN lessons"),
  o("exams.japan.links.pnQuestionsUs", "US NCLEX-PN questions"),
  o("exams.japan.links.npLessons", "US NP lessons"),
  o("exams.japan.links.alliedUs", "US Allied Health hub"),
  o("exams.japan.links.alliedCa", "Canada Allied Health hub"),
  o("exams.japan.links.tools", "Study tools"),
  o("exams.japan.links.lessons", "Lessons library"),
  o("exams.japan.links.questionBank", "Question bank"),
  o("exams.japan.links.studyPlan", "Study plan (sign in)"),
  o("exams.japan.links.australiaHub", "Australia nursing registration hub"),
  o("exams.japan.faq.q1", "What is the Japan National Nursing Examination?"),
  o(
    "exams.japan.faq.a1",
    "It is the national qualifying examination for first-time nurse licensure discussions in Japan (commonly called 看護師国家試験); confirm the current official Japanese bulletin for dates, fees, and eligibility.",
  ),
  o("exams.japan.faq.q2", "Who oversees nursing licensure policy in Japan?"),
  o(
    "exams.japan.faq.a2",
    "National policy is commonly associated with the MHLW; examination administration details appear through authorised national channels with Japanese notices as primary.",
  ),
  o("exams.japan.faq.q3", "Is the national exam in Japanese?"),
  o(
    "exams.japan.faq.a3",
    "Yes—expect Japanese stems and answer choices for the domestic national examination pathway.",
  ),
  o("exams.japan.faq.q4", "Can NCLEX replace the Japan National Nursing Examination for domestic licensure?"),
  o(
    "exams.japan.faq.a4",
    "No. NCLEX is the US/Canadian RN/PN entry exam culture. Domestic Japanese RN licensure follows Japanese national rules.",
  ),
  o("exams.japan.faq.q5", "What is EPA in nursing mobility discussions?"),
  o(
    "exams.japan.faq.a5",
    "EPA frameworks can include bilateral nursing workforce arrangements; eligibility is programme-specific—read the Japanese notice that matches your pathway.",
  ),
  o("exams.japan.faq.q6", "How do Japanese-trained nurses prepare for NCLEX-RN?"),
  o(
    "exams.japan.faq.a6",
    "Plan English tests, credential evaluation where required, state board eligibility, and sustained NCLEX-style practice—separate calendars from Japanese national exam study unless you deliberately separate blocks.",
  ),
  o("exams.japan.faq.q7", "What is different about Canada vs Australia?"),
  o(
    "exams.japan.faq.a7",
    "Canada is province-by-province with college-specific gap analysis; Australia uses national registration under Ahpra/NMBA with English and qualification assessment.",
  ),
  o("exams.japan.faq.q8", "What about the United Kingdom?"),
  o(
    "exams.japan.faq.a8",
    "NMC registration has its own evidence and English rules; plan TOC and documentation early.",
  ),
  o("exams.japan.faq.q9", "Can NurseNest replace official Japanese materials?"),
  o(
    "exams.japan.faq.a9",
    "No. NurseNest supports English NCLEX-style reasoning for parallel goals; official Japanese materials remain primary for the national examination.",
  ),
  o("exams.japan.faq.q10", "Where are official updates published?"),
  o(
    "exams.japan.faq.a10",
    "Use Japanese official portals for examination administration and health authorities; NurseNest does not publish binding Japanese regulatory updates.",
  ),
  o("exams.japan.faq.q11", "Does passing the national exam automatically licence me abroad?"),
  o(
    "exams.japan.faq.a11",
    "No. Foreign regulators apply their own evidence, English, and possible competency tests.",
  ),
  o("exams.japan.faq.q12", "How important is kanji and academic Japanese?"),
  o(
    "exams.japan.faq.a12",
    "Very important for reading speed and precision on national examination items.",
  ),
  o("exams.japan.faq.q13", "How do blog articles relate to this hub?"),
  o(
    "exams.japan.faq.a13",
    "Planned long-form posts use the Japan nursing manifest for batched imports; tags help you browse without slowing the hub.",
  ),
  o("exams.japan.faq.q14", "Why are NCLEX links placed after Japan topic pages?"),
  o(
    "exams.japan.faq.a14",
    "So domestic Japan examination context stays first unless you are explicitly pursuing US parallel prep.",
  ),
  o("exams.japan.faq.q15", "Are hospital employment rules the same as national exam rules?"),
  o(
    "exams.japan.faq.a15",
    "Employers can add onboarding requirements separate from national examination eligibility—read both employer and public licensing materials.",
  ),
  o(
    "exams.japan.next.title",
    "Topic guides: Japan exam, becoming a nurse, working abroad, NCLEX for Japanese nurses",
  ),
  o(
    "exams.japan.next.body",
    "Focused pages on the national nursing examination, how to become a nurse in Japan, working abroad, and NCLEX planning for Japanese-trained nurses.",
  ),
  o("exams.japan.next.linkNursingExam", "Japan National Nursing Examination deep dive"),
  o("exams.japan.next.linkHowToBecome", "How to become a nurse in Japan"),
  o("exams.japan.next.linkWorkAbroad", "Work abroad for Japanese nurses"),
  o("exams.japan.next.linkNclexJapanese", "NCLEX for Japanese nurses"),
  o("nav.japan.stripLabel", "Japan"),
  o("nav.japan.examsHub", "Japan Nursing Exams"),
  o("nav.japan.japanExam", "Japan Nursing Exam"),
  o("nav.japan.abroadPathways", "Abroad pathways"),
  o("nav.country.japan.stripLabel", "Japan"),
  o("nav.country.japan.examsHub", "Japan Nursing Exam"),
  o("nav.country.japan.nursingExam", "National exam guide"),
  o("nav.country.japan.howToBecome", "How to Become a Nurse in Japan"),
  o("nav.country.japan.workAbroad", "Work Abroad for Japanese Nurses"),
  o("nav.country.japan.nclexTopic", "NCLEX for Japanese Nurses"),
  o("nav.country.japan.blog", "Japan nursing blog"),
  o("nav.country.japan.nclexPrepUs", "US NCLEX-RN lessons (parallel prep)"),
  o("featured.japan.sectionTitle", "Featured Japan nursing reads"),
  o(
    "featured.japan.lead",
    "Start with the tag feed for manifest-planned articles; Japanese-language posts are prioritised when you browse in Japanese locales.",
  ),
  o("featured.japan.card1Title", "Japan National Nursing Examination guides"),
  o(
    "featured.japan.card1Body",
    "Bulletin orientation, eligibility reminders, and study discipline for the national exam.",
  ),
  o("featured.japan.card2Title", "Japanese nurses working abroad"),
  o(
    "featured.japan.card2Body",
    "Evidence, English tests, and realistic timelines for Canada, Australia, the UK, and the US.",
  ),
  o("featured.japan.browseTag", "Browse all Japan nursing articles"),
  o("blog.country.japan.tagName", "Japan nursing"),
  o(
    "blog.country.japan.jaPriorityNote",
    "Japanese-language posts surface first when your locale is Japanese and your country context is Japan.",
  ),
  o("blog.country.japan.relatedTitle", "Related Japan nursing posts"),
  o("quicklinks.japan.lessons", "Lessons library"),
  o("quicklinks.japan.questions", "Question bank"),
  o("quicklinks.japan.studyPlan", "Study plan"),
  o("quicklinks.japan.blogTag", "Japan nursing blog tag"),
  o("exams.japan.subpage.nursing-exam.title", "Japan National Nursing Examination: Candidate Orientation"),
  o(
    "exams.japan.subpage.nursing-exam.metaTitle",
    "Japan National Nursing Examination — National Nurse Exam",
  ),
  o(
    "exams.japan.subpage.nursing-exam.metaDescription",
    "Japan national nurse exam: MHLW context, CBT format, eligibility, and Japanese-language preparation.",
  ),
  o(
    "exams.japan.subpage.nursing-exam.body",
    "The Japan National Nursing Examination (看護師国家試験) is the national pathway nurses associate with computer-based licensure testing after approved nursing education. Administration follows Japanese official notices for application, fees, and scheduling.\n\nExpect integrated items that reward careful Japanese reading across the official blueprint.\n\nEligibility, identification rules, and retake policies change by notice—download the bulletin for your sitting.\n\nPass results feed into prefectural licensing steps described in Japanese materials.\n\nIf you are simultaneously preparing for NCLEX-RN in English, keep two separate study systems.\n\nNurseNest provides English-language NCLEX practice for parallel goals only; it does not replace Japanese national exam preparation.",
  ),
  o("exams.japan.subpage.work-abroad.title", "Work Abroad for Japanese Nurses: Canada, Australia, the UK, and the US"),
  o(
    "exams.japan.subpage.work-abroad.metaTitle",
    "Work Abroad for Japanese Nurses — Registration & Exam Pathways",
  ),
  o(
    "exams.japan.subpage.work-abroad.metaDescription",
    "High-level roadmap for Japan-trained nurses targeting NCLEX, NMC, Ahpra/NMBA, or Canadian colleges.",
  ),
  o(
    "exams.japan.subpage.work-abroad.body",
    "Working abroad starts with a target regulator. Each country uses different evidence rules, English tests, and timelines.\n\nUnited States: state board NCLEX-RN eligibility; English tests; possible credential evaluation.\n\nCanada: provincial colleges and gap analyses.\n\nAustralia: Ahpra/NMBA evidence and English requirements.\n\nUnited Kingdom: NMC registration including possible Test of Competence.\n\nYour Japan licence supports evidence packages but does not replace foreign requirements.\n\nNurseNest helps with NCLEX-style preparation when the US is on your roadmap.",
  ),
  o("exams.japan.subpage.how-to-become-a-nurse.title", "How to Become a Nurse in Japan"),
  o(
    "exams.japan.subpage.how-to-become-a-nurse.metaTitle",
    "How to Become a Nurse in Japan — Education, National Exam, and Licensure",
  ),
  o(
    "exams.japan.subpage.how-to-become-a-nurse.metaDescription",
    "Recognised nursing education, clinical training, sitting the National Nursing Examination, and prefectural licensure concepts.",
  ),
  o(
    "exams.japan.subpage.how-to-become-a-nurse.body",
    "Becoming a nurse in Japan generally means completing an approved nursing programme, fulfilling clinical training requirements announced for your cohort, passing the National Nursing Examination, and completing prefectural licensure steps described in official Japanese notices.\n\nKeep documentation consistent across school records, identification, and application portals.\n\nEmployers may add occupational health or facility onboarding—separate from the national examination.\n\nNurseNest does not place candidates into Japanese examination seats. If you are also preparing for NCLEX, use English NCLEX lessons separately from Japanese national exam study.",
  ),
  o("exams.japan.subpage.nclex-for-japanese-nurses.title", "NCLEX for Japanese Nurses: Parallel Preparation Without Mixing Blueprints"),
  o(
    "exams.japan.subpage.nclex-for-japanese-nurses.metaTitle",
    "NCLEX for Japanese Nurses — Clinical Judgement Practice",
  ),
  o(
    "exams.japan.subpage.nclex-for-japanese-nurses.metaDescription",
    "How Japan-trained nurses use NCLEX-RN lessons and questions alongside domestic national exam preparation.",
  ),
  o(
    "exams.japan.subpage.nclex-for-japanese-nurses.body",
    "NCLEX-RN is not a substitute for the Japan National Nursing Examination and does not grant Japanese RN licensure by itself. Many candidates prepare for both: use official Japanese materials for the national exam; use NurseNest’s US NCLEX-RN lessons and question bank for English clinical judgement and safety prioritisation.\n\nTypical steps toward US RN licensure include English tests, credential evaluation where required, state board NCLEX eligibility, and passing NCLEX-RN.\n\nKeep calendars separate so item styles and blueprint language do not blur.\n\nStart from the US RN hub links on the Japan exams page when you are ready to practise NCLEX-style cases.",
  ),
];

const obj = Object.fromEntries(entries);
writeFileSync(OUT, JSON.stringify(obj, null, 2) + "\n", "utf8");
console.log(`wrote ${OUT} keys ${Object.keys(obj).length}`);
