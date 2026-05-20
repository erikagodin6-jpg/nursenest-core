#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "exams-korea.en.json");

const o = (k, v) => [k, v];

const entries = [
  o(
    "exams.korea.metaTitle",
    "Nursing Licensing Exams in South Korea (2026 Complete Guide) | KHPLEI & International Pathways",
  ),
  o(
    "exams.korea.metaDescription",
    "Korea nursing exam guide: Korean Nursing Licensing Examination, Korea Health Personnel Licensing Examination Institute (KHPLEI), eligibility, Korean-language barrier, domestic licensure, and work abroad for Korean nurses. NCLEX for Korean nurses, Australia, UK, and US pathways.",
  ),
  o("exams.korea.title", "Nursing Licensing Exams in South Korea (2026 Complete Guide)"),
  o(
    "exams.korea.lead",
    "South Korea licenses registered nurses through a national examination system delivered in Korean under the national health personnel licensing framework associated with the Korea Health Personnel Licensing Examination Institute (KHPLEI / 보건의료인국가시험) and Ministry of Health and Welfare policy. This guide explains the Korean Nursing Licensing Examination, how KHPLEI fits into the national structure, why the Korean-language barrier shapes preparation, the domestic licensure process, RN scope and advanced practice context at a high level, and international pathways for Korean-trained nurses—including English tests and NCLEX when the United States is your goal. NurseNest does not register you for Korean exams; we provide English NCLEX-style practice for parallel objectives.",
  ),
  o("exams.korea.eyebrow", "Updated for 2026"),
  o("exams.korea.breadcrumb", "Korea nursing exams"),
  o("exams.korea.sections.overview.title", "Nursing in South Korea: national licensure pathway"),
  o(
    "exams.korea.sections.overview.body",
    "Becoming a licensed nurse in Korea typically means completing an approved bachelor-level nursing programme (or equivalent pathway recognised for your cohort), satisfying clinical training requirements announced in official notices, passing the national nursing licensing examination, and completing domestic registration steps described in Korean administrative materials.\n\nPublic discussions reference national health workforce policy under the Ministry of Health and Welfare and examination administration through authorised national channels. Always treat Korean-language bulletins and the official candidate portal as authoritative for eligibility, fees, schedules, and identity rules.\n\nNurseNest summarizes widely discussed mechanics for internationally mobile readers comparing systems—it is not legal advice and not a substitute for official Korean sources.",
  ),
  o("exams.korea.sections.khplei.title", "KHPLEI and Korea’s national licensing examination structure"),
  o(
    "exams.korea.sections.khplei.body",
    "The Korea Health Personnel Licensing Examination Institute (often abbreviated KHPLEI in English materials; Korean: 보건의료인국가시험원) operates national licensing examinations for multiple health professions under the national health personnel examination system. Nursing is one profession within that system; schedules, application rules, and candidate communications are published through Korean official channels.\n\nThink of three layers commonly described in orientation materials: national policy direction, standardised national examination administration, and post-pass registration and professional standing steps defined domestically. Exact English spellings of institution names can vary—match the Korean name on the site you use to register.\n\nNurseNest does not interpret KHPLEI notices for your specific case—verify with authoritative Korean publications.",
  ),
  o("exams.korea.sections.exam.title", "Korean Nursing Licensing Examination (national nurse exam)"),
  o(
    "exams.korea.sections.exam.body",
    "The Korean Nursing Licensing Examination is the national computer-based test that eligible graduates typically associate with RN licensure discussions in Korea. Item styles, blueprint weighting, and subject emphasis are defined in official Korean syllabi; download the bulletin for your sitting year.\n\nEligibility ties to recognised nursing education completion and any internship, practical training, or cohort-specific requirements announced for your application cycle. Identity checks, fee schedules, and retake cooling-off rules are cycle-specific.\n\nPassing is a major milestone toward licensure, but licence issuance and employer onboarding can include additional administrative steps.\n\nIf you are also preparing for NCLEX-RN, keep Korean national exam preparation and NCLEX preparation as separate study systems with different languages and item-writing conventions.",
  ),
  o("exams.korea.sections.language.title", "Korean-language barrier and the domestic licensure process"),
  o(
    "exams.korea.sections.language.body",
    "Domestic licensure is discussed primarily in Korean. The national examination expects fluent academic Korean: medical terminology, nursing-process phrasing, and careful reading of long stems under time pressure. Conversational Korean alone is rarely enough for consistent performance.\n\nIf Korean is not your first language, budget extra months for vocabulary notebooks, timed reading drills, and official-style practice where permitted. English summaries of Korean rules can lag or drift—prefer primary Korean notices for eligibility changes.\n\nNurseNest’s English NCLEX libraries do not replace Korean national exam study; they support parallel goals in English when you are also pursuing US/Canada/UK RN entry exams.",
  ),
  o("exams.korea.sections.domesticProcess.title", "Domestic licensure process (high-level orientation)"),
  o(
    "exams.korea.sections.domesticProcess.body",
    "After completing recognised education and meeting practical training requirements, candidates apply through official flows published for the national examination. Score reporting, any required practical competency elements announced for your pathway, and subsequent registration steps are described in Korean administrative guidance.\n\nEmployers may add occupational health screening, facility onboarding, and continuing education expectations—these are not substitutes for national examination rules but often coexist in real hiring workflows.\n\nKeep one consistent romanisation of your name across transcripts, identification, and registration documents to reduce administrative friction.\n\nNurseNest does not place candidates into Korean examination seats.",
  ),
  o("exams.korea.sections.rnScope.title", "RN scope and advanced practice context (orientation)"),
  o(
    "exams.korea.sections.rnScope.body",
    "South Korea differentiates general nursing licensure from advanced practice nursing roles that require additional graduate education, national examinations, and separate registration concepts. New graduates targeting general RN practice should anchor preparation to the national nursing licensing examination blueprint rather than advanced practice rumours.\n\nIf you are exploring advanced practice later, treat it as a distinct training and examination pathway with its own bulletins.\n\nFor international comparison only: US NP preparation on NurseNest is separate from Korean RN national exam preparation.",
  ),
  o("exams.korea.sections.abroad.title", "International pathways for Korean-trained nurses"),
  o(
    "exams.korea.sections.abroad.body",
    "United States: Korean-trained nurses commonly pursue credential evaluation where required, meet a state board’s NCLEX eligibility rules, satisfy English proficiency thresholds, and pass NCLEX-RN. A Korean licence supports evidence packages but does not replace US regulator requirements.\n\nCanada: provincial colleges assess international credentials; bridging education or exams may follow gap analyses.\n\nAustralia: Ahpra/NMBA pathways require English evidence and qualification assessment; see NurseNest’s Australia hub for orientation.\n\nUnited Kingdom: NMC registration includes education evidence, English tests, and possible Test of Competence components.\n\nWherever you aim, harmonise names early and budget certified translations.\n\nNurseNest supports NCLEX-style preparation widely used by internationally educated nurses.",
  ),
  o("exams.korea.sections.migrationAustralia.title", "Australia for Korean nurses: AHPRA/NMBA orientation"),
  o(
    "exams.korea.sections.migrationAustralia.body",
    "Australia’s national registration scheme uses English proficiency standards, qualification assessment, and sometimes additional requirements for internationally educated nurses. Korean licensure history becomes supporting evidence—not automatic reciprocity.\n\nStart early on document consistency and validity windows for English tests. Use official Ahpra materials as authoritative; NurseNest’s Australia exam hub helps with exam-culture orientation.",
  ),
  o("exams.korea.sections.migrationUk.title", "United Kingdom for Korean nurses: NMC registration"),
  o(
    "exams.korea.sections.migrationUk.body",
    "The Nursing and Midwifery Council evaluates nursing education, registration history, English proficiency, and where applicable competency testing. UK rules are independent of Korea’s national nursing examination.\n\nPlan certified translations and verify English test validity periods against NMC rules.",
  ),
  o("exams.korea.sections.best.title", "Checklist: domestic exam vs abroad plan"),
  o(
    "exams.korea.sections.best.body",
    "1) Download the Korean bulletin for your cohort and confirm eligibility line-by-line.\n\n2) Train Korean reading stamina for computer-based stems under time limits.\n\n3) If targeting NCLEX in parallel, separate study blocks so languages and blueprints do not blur.\n\n4) Schedule IELTS/OET/TOEFL with validity that matches your target regulator.\n\n5) For Australia/UK/US/Canada, start credential evaluation research early.\n\n6) Use qualified advisers for immigration steps—NurseNest focuses on exam preparation skills.",
  ),
  o("exams.korea.sections.links.title", "Study tools, lessons, and parallel NCLEX practice"),
  o(
    "exams.korea.sections.links.body",
    "Use the quick links for lessons, question banks, and study plans. Korean national exam preparation remains anchored in official Korean materials. NurseNest’s English resources help when your parallel goal is US-style NCLEX clinical judgement.\n\nNCLEX links are grouped after Korea-specific topic pages so domestic candidates see Korean exam context first.",
  ),
  o("exams.korea.sections.blogIntegration.title", "Korea nursing articles on NurseNest"),
  o(
    "exams.korea.sections.blogIntegration.body",
    "Long-form Korea nursing guides publish on a schedule from `korea-nursing-200.manifest.json`—tagged for discovery. Featured cards below highlight common entry points; Korean-language posts are prioritised when you browse in Korean locales.",
  ),
  o("exams.korea.sections.blogRoll.title", "Country-specific articles (blog)"),
  o(
    "exams.korea.sections.blogRoll.body",
    "Long-form Korea nursing guides are imported in paginated batches from the blog manifest and tagged for discovery. Use the tag page to browse titles as content rolls out—this hub stays ISR-fast.",
  ),
  o("exams.korea.links.blogCategory", "Browse Korea nursing articles (tag)"),
  o(
    "exams.korea.paginationNote",
    "Korea nursing articles ship in paginated batches from `korea-nursing-200.manifest.json`; this hub uses ISR for a fast static shell.",
  ),
  o("exams.korea.sections.faq.title", "Frequently asked questions"),
  o("exams.korea.links.rnLessonsUs", "US NCLEX-RN lessons"),
  o("exams.korea.links.rnQuestionsUs", "US NCLEX-RN questions"),
  o("exams.korea.links.pnLessonsUs", "US NCLEX-PN lessons"),
  o("exams.korea.links.pnQuestionsUs", "US NCLEX-PN questions"),
  o("exams.korea.links.npLessons", "US NP lessons"),
  o("exams.korea.links.alliedUs", "US Allied Health hub"),
  o("exams.korea.links.alliedCa", "Canada Allied Health hub"),
  o("exams.korea.links.tools", "Study tools"),
  o("exams.korea.links.lessons", "Lessons library"),
  o("exams.korea.links.questionBank", "Question bank"),
  o("exams.korea.links.studyPlan", "Study plan (sign in)"),
  o("exams.korea.links.australiaHub", "Australia nursing registration hub"),
  o("exams.korea.faq.q1", "What is the Korean Nursing Licensing Examination?"),
  o(
    "exams.korea.faq.a1",
    "It is the national computer-based examination pathway for nurse licensure discussions in Korea under the national health personnel licensing system; confirm the current official Korean bulletin for names, dates, and eligibility.",
  ),
  o("exams.korea.faq.q2", "What is KHPLEI’s role?"),
  o(
    "exams.korea.faq.a2",
    "The Korea Health Personnel Licensing Examination Institute administers national licensing examinations for health professions, including nursing, within published Korean frameworks.",
  ),
  o("exams.korea.faq.q3", "Is the exam in Korean?"),
  o(
    "exams.korea.faq.a3",
    "Yes—expect Korean stems and answer choices. English-only study is not a substitute for Korean reading skills on the national exam.",
  ),
  o("exams.korea.faq.q4", "Is NCLEX accepted instead of the Korean exam?"),
  o(
    "exams.korea.faq.a4",
    "No. NCLEX is the US/Canadian RN/PN entry exam culture. Korean RN licensure follows Korean national rules.",
  ),
  o("exams.korea.faq.q5", "Can NurseNest replace official Korean materials?"),
  o(
    "exams.korea.faq.a5",
    "No. NurseNest supports English NCLEX-style reasoning for parallel goals; official Korean materials remain primary for the Korean national exam.",
  ),
  o("exams.korea.faq.q6", "How do Korean nurses prepare for NCLEX-RN?"),
  o(
    "exams.korea.faq.a6",
    "Plan English tests, credential evaluation where required, state board eligibility, and sustained NCLEX-style practice—separate calendars from Korean national exam study unless you deliberately separate blocks.",
  ),
  o("exams.korea.faq.q7", "What is different about Australia vs the UK?"),
  o(
    "exams.korea.faq.a7",
    "Australia uses Ahpra/NMBA evidence rules; the UK uses NMC rules. Both are independent of Korea’s national nursing exam.",
  ),
  o("exams.korea.faq.q8", "How important is Korean fluency for the national exam?"),
  o(
    "exams.korea.faq.a8",
    "Critical—allocate vocabulary work and timed Korean reading practice, especially if Korean is not your first language.",
  ),
  o("exams.korea.faq.q9", "Does NurseNest publish official Korean regulatory updates?"),
  o(
    "exams.korea.faq.a9",
    "No. Use Korean official portals for authoritative updates; NurseNest summarizes exam-preparation orientation only.",
  ),
  o("exams.korea.faq.q10", "Where should I read about RN vs advanced practice?"),
  o(
    "exams.korea.faq.a10",
    "Use Korean official education and licensing notices for role definitions; avoid mixing RN national exam study with graduate advanced-practice rumours.",
  ),
  o("exams.korea.faq.q11", "Can I work abroad with only a Korean licence?"),
  o(
    "exams.korea.faq.a11",
    "A Korean licence supports evidence packages but foreign regulators still require their own checks, exams, and English evidence.",
  ),
  o("exams.korea.faq.q12", "What English tests are common for migration?"),
  o(
    "exams.korea.faq.a12",
    "IELTS Academic, OET, and TOEFL appear frequently—match the test and score to your target regulator’s validity rules.",
  ),
  o("exams.korea.faq.q13", "How do blog articles relate to this hub?"),
  o(
    "exams.korea.faq.a13",
    "Planned long-form posts use the Korea nursing manifest for batched imports; tags help you browse without slowing the hub.",
  ),
  o("exams.korea.faq.q14", "Why are NCLEX links placed after Korea topic pages?"),
  o(
    "exams.korea.faq.a14",
    "So domestic Korean exam context and Korea-specific guides stay first unless you are explicitly pursuing US parallel prep.",
  ),
  o("exams.korea.faq.q15", "What salary topics belong in official planning?"),
  o(
    "exams.korea.faq.a15",
    "Salary ranges change by employer, region, and experience—treat employer offers and Korean labour market sources as primary; NurseNest focuses on exam preparation.",
  ),
  o(
    "exams.korea.next.title",
    "Topic guides: Korean exam, becoming a nurse, working abroad, NCLEX for Korean nurses",
  ),
  o(
    "exams.korea.next.body",
    "Focused pages on the national nursing exam, how to become a nurse in Korea, working abroad, and NCLEX planning for Korean-trained nurses.",
  ),
  o("exams.korea.next.linkNursingExam", "Korean Nursing Licensing Examination deep dive"),
  o("exams.korea.next.linkHowToBecome", "How to become a nurse in Korea"),
  o("exams.korea.next.linkWorkAbroad", "Work abroad for Korean nurses"),
  o("exams.korea.next.linkNclexKorean", "NCLEX for Korean nurses"),
  o("nav.korea.stripLabel", "Korea"),
  o("nav.korea.examsHub", "Korea Nursing Exams"),
  o("nav.korea.koreaExam", "Korean Nursing Exam"),
  o("nav.korea.abroadPathways", "Abroad pathways"),
  o("nav.country.korea.stripLabel", "Korea"),
  o("nav.country.korea.examsHub", "Korean Nursing Exam"),
  o("nav.country.korea.nursingExam", "National exam guide"),
  o("nav.country.korea.howToBecome", "How to Become a Nurse in Korea"),
  o("nav.country.korea.workAbroad", "Work Abroad for Korean Nurses"),
  o("nav.country.korea.nclexTopic", "NCLEX for Korean Nurses"),
  o("nav.country.korea.blog", "Korea nursing blog"),
  o("nav.country.korea.nclexPrepUs", "US NCLEX-RN lessons (parallel prep)"),
  o("featured.korea.sectionTitle", "Featured Korea nursing reads"),
  o(
    "featured.korea.lead",
    "Start with the tag feed for manifest-planned articles; Korean-language posts are prioritised when you browse in Korean locales.",
  ),
  o("featured.korea.card1Title", "Korean Nursing Licensing Examination guides"),
  o(
    "featured.korea.card1Body",
    "Syllabus orientation, eligibility reminders, and study discipline for the national exam.",
  ),
  o("featured.korea.card2Title", "Korean nurses working abroad"),
  o(
    "featured.korea.card2Body",
    "Evidence, English tests, and realistic timelines for the US, Canada, Australia, and the UK.",
  ),
  o("featured.korea.browseTag", "Browse all Korea nursing articles"),
  o("blog.country.korea.tagName", "Korea nursing"),
  o(
    "blog.country.korea.koPriorityNote",
    "Korean-language posts surface first when your locale is Korean and your country context is Korea.",
  ),
  o("blog.country.korea.relatedTitle", "Related Korea nursing posts"),
  o("quicklinks.korea.lessons", "Lessons library"),
  o("quicklinks.korea.questions", "Question bank"),
  o("quicklinks.korea.studyPlan", "Study plan"),
  o("quicklinks.korea.blogTag", "Korea nursing blog tag"),
  o("exams.korea.subpage.nursing-exam.title", "Korean Nursing Licensing Examination: Candidate Orientation"),
  o(
    "exams.korea.subpage.nursing-exam.metaTitle",
    "Korean Nursing Licensing Examination — National Nurse Exam (Korea)",
  ),
  o(
    "exams.korea.subpage.nursing-exam.metaDescription",
    "Korean national nurse licensing exam: KHPLEI context, computer-based format, eligibility, and Korean-language preparation.",
  ),
  o(
    "exams.korea.subpage.nursing-exam.body",
    "The Korean Nursing Licensing Examination is the national pathway nurses associate with computer-based RN licensure testing after approved nursing education. Administration sits within Korea’s national health personnel examination system; the Korea Health Personnel Licensing Examination Institute publishes candidate-facing registration information in Korean.\n\nExpect integrated items that reward careful Korean reading, including pharmacology, medical–surgical scenarios, community health, fundamentals, and ethics aligned to the official blueprint.\n\nEligibility, fees, identification rules, and retake policies change by notice—download the bulletin for your exact examination date.\n\nPass results feed into subsequent licensing steps with domestic authorities.\n\nIf you are simultaneously preparing for NCLEX-RN in English, keep two separate study systems.\n\nNurseNest provides English-language NCLEX practice for parallel goals only; it does not replace Korean national exam preparation.",
  ),
  o("exams.korea.subpage.work-abroad.title", "Work Abroad for Korean Nurses: US, Canada, Australia, and the UK"),
  o(
    "exams.korea.subpage.work-abroad.metaTitle",
    "Work Abroad for Korean Nurses — Registration & Exam Pathways",
  ),
  o(
    "exams.korea.subpage.work-abroad.metaDescription",
    "High-level roadmap for Korea-trained nurses targeting NCLEX, NMC, or Ahpra/NMBA pathways.",
  ),
  o(
    "exams.korea.subpage.work-abroad.body",
    "Working abroad begins with a target regulator. Each country uses different evidence rules, English tests, and timelines.\n\nUnited States: NCLEX-RN eligibility through a state board; possible credential evaluation steps; English thresholds vary by state.\n\nCanada: provincial colleges and gap analyses; bridging may be required.\n\nAustralia: Ahpra/NMBA evidence and English requirements.\n\nUnited Kingdom: NMC registration including possible Test of Competence.\n\nYour Korean licence supports evidence packages but does not replace foreign requirements.\n\nNurseNest helps with NCLEX-style preparation when the US is on your roadmap.",
  ),
  o("exams.korea.subpage.how-to-become-a-nurse.title", "How to Become a Nurse in Korea"),
  o(
    "exams.korea.subpage.how-to-become-a-nurse.metaTitle",
    "How to Become a Nurse in Korea — Education, National Exam, and Registration",
  ),
  o(
    "exams.korea.subpage.how-to-become-a-nurse.metaDescription",
    "Recognised nursing education, clinical training expectations, sitting the national nursing licensing examination, and post-pass registration concepts.",
  ),
  o(
    "exams.korea.subpage.how-to-become-a-nurse.body",
    "Becoming a nurse in Korea generally means completing an approved nursing programme, fulfilling clinical training requirements announced for your cohort, passing the Korean Nursing Licensing Examination, and completing administrative registration steps described in official Korean notices.\n\nKeep documentation consistent across school records, identification, and application portals. Follow bulletin rules for photos, fees, and deadlines exactly.\n\nEmployers may add occupational health or facility onboarding—separate from the national examination.\n\nNurseNest does not place candidates into Korean examination seats. If you are also preparing for NCLEX, use English NCLEX lessons separately from Korean national exam study.",
  ),
  o("exams.korea.subpage.nclex-for-korean-nurses.title", "NCLEX for Korean Nurses: Parallel Preparation Without Mixing Blueprints"),
  o(
    "exams.korea.subpage.nclex-for-korean-nurses.metaTitle",
    "NCLEX for Korean Nurses — Clinical Judgement Practice",
  ),
  o(
    "exams.korea.subpage.nclex-for-korean-nurses.metaDescription",
    "How Korea-trained nurses use NCLEX-RN lessons and questions alongside domestic national exam preparation.",
  ),
  o(
    "exams.korea.subpage.nclex-for-korean-nurses.body",
    "NCLEX-RN is not a substitute for the Korean national nursing examination and does not grant Korean RN licensure by itself. Many candidates prepare for both: use official Korean materials for the national exam; use NurseNest’s US NCLEX-RN lessons and question bank for English clinical judgement and safety prioritisation.\n\nTypical steps toward US RN licensure include English tests, credential evaluation where required, state board NCLEX eligibility, and passing NCLEX-RN.\n\nKeep calendars separate so item styles and blueprint language do not blur.\n\nStart from the US RN hub links on the Korea exams page when you are ready to practise NCLEX-style cases.",
  ),
];

const obj = Object.fromEntries(entries);
writeFileSync(OUT, JSON.stringify(obj, null, 2) + "\n", "utf8");
console.log(`wrote ${OUT} keys ${Object.keys(obj).length}`);
