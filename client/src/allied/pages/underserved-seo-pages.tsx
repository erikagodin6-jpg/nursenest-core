import { useState } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, CheckCircle2, ChevronDown, Award, BarChart3,
  BookOpen, Brain, Target, Users, ShieldCheck, Hand,
  FileText, GraduationCap, Briefcase, TrendingUp, Clock,
  Heart, Shield, Star, Zap, HelpCircle, MapPin, Activity,
} from "lucide-react";

type ProfessionSlug =
  | "social-worker"
  | "psychotherapist"
  | "addictions-counsellor"
  | "occupational-therapy"
  | "physical-therapy"
  | "health-info-mgmt";
type PageType = "exam-prep" | "career-guide" | "study-guide" | "practice-questions";

interface UnderservedSEOPageProps {
  profession: ProfessionSlug;
  pageType: PageType;
}

const PROFESSION_CONFIG: Record<ProfessionSlug, {
  label: string;
  shortName: string;
  color: string;
  colorAccent: string;
  colorTailwind: string;
  Icon: typeof Brain;
  examNames: string[];
  domains: string[];
  features: string[];
  dashboardPath: string;
  qbankPath: string;
  flashcardsPath: string;
  mockExamsPath: string;
}> = {
  "social-worker": {
    label: "Licensed Clinical Social Worker",
    shortName: "Social Work",
    color: "#00ACC1",
    colorAccent: "#E0F7FA",
    colorTailwind: "cyan",
    Icon: Users,
    examNames: ["ASWB Clinical", "ASWB Masters", "ASWB Advanced Generalist"],
    domains: [
      "Human Behavior & Development",
      "Assessment & Diagnosis",
      "Intervention & Treatment Planning",
      "Ethics & Professional Practice",
      "Community Resources & Advocacy",
      "Crisis Intervention",
      "Diversity & Cultural Competence",
      "Research & Evidence-Based Practice",
    ],
    features: [
      "ASWB exam-aligned content",
      "DSM-5-TR diagnostic criteria",
      "Evidence-based interventions",
      "Ethics & boundary scenarios",
      "Case vignette practice",
      "Detailed rationales",
    ],
    dashboardPath: "/allied-health/social-work/dashboard",
    qbankPath: "/qbank?career=social-worker",
    flashcardsPath: "/allied-health/social-work/flashcards",
    mockExamsPath: "/allied-health/social-work/mock-exams",
  },
  psychotherapist: {
    label: "Registered Psychotherapist / Counselor",
    shortName: "Psychotherapy",
    color: "#5C6BC0",
    colorAccent: "#E8EAF6",
    colorTailwind: "indigo",
    Icon: Brain,
    examNames: ["CRPO Registration Exam", "NCE", "CMHCE", "CCC Exam"],
    domains: [
      "Therapeutic Modalities",
      "Psychopathology & DSM-5",
      "Assessment & Diagnosis",
      "Ethics & Boundaries",
      "Treatment Planning",
      "Crisis Intervention",
      "Group Counseling",
      "Professional Development",
    ],
    features: [
      "CRPO & NCE exam-aligned",
      "CBT, DBT, EMDR modalities",
      "Ethical dilemma scenarios",
      "Clinical case vignettes",
      "Canadian & US regulatory content",
      "Therapeutic relationship focus",
    ],
    dashboardPath: "/allied-health/psychotherapy/dashboard",
    qbankPath: "/qbank?career=psychotherapist",
    flashcardsPath: "/allied-health/psychotherapy/flashcards",
    mockExamsPath: "/allied-health/psychotherapy/mock-exams",
  },
  "addictions-counsellor": {
    label: "Addictions Counsellor",
    shortName: "Addictions Counseling",
    color: "#558B2F",
    colorAccent: "#DCEDC8",
    colorTailwind: "green",
    Icon: ShieldCheck,
    examNames: ["IC&RC ADC", "CASAC", "CCAC"],
    domains: [
      "Pharmacology of Substances",
      "Assessment & Screening",
      "Treatment Planning",
      "Counseling Approaches",
      "Relapse Prevention",
      "Co-occurring Disorders",
      "Ethics & Professional Practice",
      "Group Counseling",
    ],
    features: [
      "IC&RC ADC exam-aligned",
      "Motivational interviewing practice",
      "Substance identification drills",
      "Co-occurring disorders coverage",
      "Relapse prevention models",
      "Ethical scenario practice",
    ],
    dashboardPath: "/allied-health/addictions/dashboard",
    qbankPath: "/qbank?career=addictions-counsellor",
    flashcardsPath: "/allied-health/addictions/flashcards",
    mockExamsPath: "/allied-health/addictions/mock-exams",
  },
  "occupational-therapy": {
    label: "Occupational Therapy",
    shortName: "Occupational Therapy",
    color: "#6A1B9A",
    colorAccent: "#E1BEE7",
    colorTailwind: "purple",
    Icon: Hand,
    examNames: ["NBCOT OTR", "NOTCE"],
    domains: [
      "Evaluation & Assessment",
      "Intervention Planning & Implementation",
      "Professional Practice & Ethics",
      "Psychosocial & Mental Health",
      "Pediatrics & Development",
      "ADL/IADL Performance",
      "Cognitive Rehabilitation",
      "Assistive Technology",
    ],
    features: [
      "NBCOT OTR exam-aligned",
      "NOTCE (Canada) content",
      "Clinical case analysis",
      "SMART goal writing practice",
      "Pediatric development coverage",
      "Evidence-based practice focus",
    ],
    dashboardPath: "/allied-health/occupational-therapy/dashboard",
    qbankPath: "/qbank?career=occupational-therapy",
    flashcardsPath: "/allied-health/occupational-therapy/flashcards",
    mockExamsPath: "/allied-health/occupational-therapy/mock-exams",
  },
  "physical-therapy": {
    label: "Physical Therapy",
    shortName: "Physical Therapy",
    color: "#00897B",
    colorAccent: "#B2DFDB",
    colorTailwind: "teal",
    Icon: Activity,
    examNames: ["NPTE", "PCE (Canada)"],
    domains: [
      "Musculoskeletal",
      "Neuromuscular & Nervous Systems",
      "Cardiovascular & Pulmonary",
      "Other Systems",
      "Equipment & Devices; Therapeutic Modalities",
      "Safety & Professional Responsibilities",
      "Research & Evidence-Based Practice",
    ],
    features: [
      "NPTE-style clinical cases",
      "Special tests & interventions",
      "Cardiopulmonary rehab scenarios",
      "Ethics & jurisprudence drills",
    ],
    dashboardPath: "/allied-health/physical-therapy/dashboard",
    qbankPath: "/qbank?career=physical-therapy",
    flashcardsPath: "/allied-health/physical-therapy/flashcards",
    mockExamsPath: "/allied-health/physical-therapy/mock-exams",
  },
  "health-info-mgmt": {
    label: "Health Information Management",
    shortName: "Health Information",
    color: "#1565C0",
    colorAccent: "#BBDEFB",
    colorTailwind: "blue",
    Icon: FileText,
    examNames: ["RHIA", "RHIT", "CCS (coding)"],
    domains: [
      "Data Content, Structure & Standards",
      "Information Protection",
      "Informatics, Analytics & Data Use",
      "Revenue Management",
      "Compliance",
      "Leadership",
    ],
    features: [
      "AHIMA-style competency coverage",
      "Privacy, HIPAA & release of information",
      "Revenue cycle & coding concepts",
      "Data quality & registry basics",
    ],
    dashboardPath: "/allied-health/health-info-mgmt/dashboard",
    qbankPath: "/qbank?career=health-info-mgmt",
    flashcardsPath: "/allied-health/health-info-mgmt/flashcards",
    mockExamsPath: "/allied-health/health-info-mgmt/mock-exams",
  },
};

interface PageContent {
  title: string;
  metaDesc: string;
  keywords: string;
  h1: string;
  heroSub: string;
  sections: { heading: string; content: string }[];
  faqs: { q: string; a: string }[];
}

function getPageContent(profession: ProfessionSlug, pageType: PageType): PageContent | null {

  const cfg = PROFESSION_CONFIG[profession];
  const exams = cfg.examNames.join(", ");

  const contentMap: Record<string, Record<string, PageContent>> = {
    "social-worker": {
      "exam-prep": {
        title: `Social Work Exam Prep | ASWB Clinical & Masters Study Platform`,
        metaDesc: `Complete ASWB exam preparation for Clinical, Masters, and Advanced Generalist levels. Practice questions, mock exams, flashcards, and personalized study plans for social work licensing.`,
        keywords: `ASWB exam prep, social work exam, LCSW exam, social work licensing, ASWB clinical exam, ASWB masters exam, social work practice questions`,
        h1: "Social Work Exam Prep",
        heroSub: "The most comprehensive ASWB exam preparation platform. Covering Clinical, Masters, and Advanced Generalist levels with adaptive learning, case vignettes, and detailed analytics.",
        sections: [
          { heading: "ASWB Exam-Aligned Content", content: "Every question and study resource is mapped to the official ASWB exam content outlines. Whether you're preparing for the Clinical, Masters, or Advanced Generalist exam, our content mirrors the domain distribution and question styles you'll encounter on test day. Domains include Human Development, Assessment & Diagnosis, Psychotherapy & Clinical Interventions, Ethics, and Professional Relationships." },
          { heading: "DSM-5-TR Diagnostic Practice", content: "Master differential diagnosis with DSM-5-TR-aligned case vignettes. Practice identifying disorders across the full diagnostic spectrum — from mood and anxiety disorders to personality disorders and neurodevelopmental conditions. Each case includes presenting symptoms, relevant history, and diagnostic reasoning explanations that build clinical judgment." },
          { heading: "Ethics & Boundaries Deep Dive", content: "The ASWB exams heavily test ethical decision-making. Our platform includes hundreds of ethics scenarios covering dual relationships, informed consent, confidentiality limits, duty to warn, HIPAA compliance, and the NASW Code of Ethics. Practice navigating complex situations where multiple ethical principles may conflict." },
          { heading: "Evidence-Based Intervention Matching", content: "Learn to match the right evidence-based intervention to each client presentation. Practice with CBT, DBT, motivational interviewing, solution-focused therapy, psychodynamic approaches, trauma-informed care, and family systems interventions. Each question includes rationales explaining why specific interventions are most appropriate for the clinical scenario." },
        ],
        faqs: [
          { q: "Which ASWB exam levels does this cover?", a: "We cover the ASWB Clinical, Masters, and Advanced Generalist exams. Each level has dedicated question pools with appropriate difficulty and content focus. The Clinical exam receives the deepest content coverage." },
          { q: "How many practice questions are available?", a: "Our question bank includes 25 ASWB-aligned questions with detailed rationales and is actively expanding. Questions cover exam domains with case vignettes, ethical scenarios, and diagnostic reasoning problems." },
          { q: "Is this useful for Canadian social work licensing?", a: "Yes. While primarily aligned with ASWB exams, our content covers core social work competencies applicable to Canadian provincial registration exams. Ethical scenarios include both NASW and CASW frameworks." },
          { q: "How are rationales structured?", a: "Each rationale explains the correct answer, why each distractor is incorrect, the relevant clinical reasoning, applicable ethical principles, and connections to evidence-based practice guidelines." },
          { q: "Is there a free trial?", a: "Yes. Take our free diagnostic assessment to evaluate your readiness. Free users also get access to sample questions from each domain and limited flashcard access." },
        ],
      },
      "career-guide": {
        title: `Social Work Career Guide | Education, Licensing & Salary Info`,
        metaDesc: `Complete career guide for social workers. Education requirements, licensing pathways (LCSW, LMSW), salary data, job outlook, and work environments for aspiring social workers.`,
        keywords: `social work career, LCSW career path, social work salary, social work education requirements, social work licensing, MSW degree, social work job outlook`,
        h1: "Social Work Career Guide",
        heroSub: "Everything you need to know about building a career in social work — from education requirements and licensing pathways to salary expectations and career advancement opportunities.",
        sections: [
          { heading: "Education Requirements", content: "A career in social work typically begins with a Bachelor of Social Work (BSW) or a Master of Social Work (MSW) from a CSWE-accredited program. The BSW prepares you for generalist practice, while the MSW opens doors to clinical practice, supervision roles, and specialized settings. Many MSW programs offer advanced standing for BSW graduates, reducing completion time to one year. Field placements (internships) are required at both levels, providing hands-on clinical experience." },
          { heading: "Licensing Pathway", content: "Social work licensing varies by state/province but generally follows a progression: Licensed Bachelor Social Worker (LBSW) → Licensed Master Social Worker (LMSW) → Licensed Clinical Social Worker (LCSW). The LCSW requires an MSW, 2-3 years of supervised clinical experience (typically 3,000+ hours), and passing the ASWB Clinical exam. In Canada, registration is through provincial regulatory bodies (e.g., OCSWSSW in Ontario, BCCSW in BC). All paths require passing a standardized exam and maintaining continuing education credits." },
          { heading: "Salary & Compensation", content: "Social work salaries vary by setting, specialization, and location. Entry-level BSW positions typically start at $40,000-$50,000 USD. LMSWs earn $50,000-$65,000, while LCSWs in clinical practice earn $60,000-$85,000+. Private practice social workers can earn significantly more. Highest-paying settings include hospitals, federal government, and private practice. Canadian social workers earn comparable salaries in CAD, with provincial variations. Benefits often include health insurance, retirement plans, and continuing education stipends." },
          { heading: "Job Outlook & Work Environments", content: "The Bureau of Labor Statistics projects 7% growth for social workers through 2032 — faster than average for all occupations. Demand is strongest in healthcare, mental health, and substance abuse settings. Social workers practice in hospitals, community mental health centers, schools, child welfare agencies, VA centers, private practice, hospice, corrections, and policy organizations. Telehealth has expanded practice options, allowing remote clinical work across state lines where interstate compacts apply." },
        ],
        faqs: [
          { q: "Do I need an MSW to become a social worker?", a: "Not necessarily. A BSW qualifies you for generalist social work roles. However, an MSW is required for clinical practice, the LCSW credential, private practice, and most supervisory positions. The MSW significantly expands career options and earning potential." },
          { q: "How long does it take to become an LCSW?", a: "Typically 6-8 years total: 4 years for a BSW or bachelor's degree, 2 years for an MSW (1 year with advanced standing), and 2-3 years of supervised clinical experience. The timeline varies by state licensing requirements." },
          { q: "What is the ASWB exam?", a: "The Association of Social Work Boards (ASWB) administers standardized licensing exams at four levels: Bachelors, Masters, Advanced Generalist, and Clinical. Most states require passing the appropriate ASWB exam for licensure. The exam consists of 170 multiple-choice questions over 4 hours." },
          { q: "Can social workers have a private practice?", a: "Yes, LCSWs can establish independent private practices in most states. This requires full clinical licensure, malpractice insurance, and adherence to state regulations. Many social workers combine private practice with agency work." },
        ],
      },
      "study-guide": {
        title: `Social Work Study Guide | ASWB Exam Blueprint & Study Strategies`,
        metaDesc: `Comprehensive social work study guide with ASWB exam blueprint overview, key topics, study strategies, and links to practice questions and flashcards for LCSW exam prep.`,
        keywords: `ASWB study guide, social work exam study plan, LCSW study guide, social work exam topics, ASWB exam blueprint, social work exam strategies`,
        h1: "Social Work Study Guide",
        heroSub: "A complete study guide covering the ASWB exam blueprint, essential topics, proven study strategies, and curated resources to help you pass your social work licensing exam.",
        sections: [
          { heading: "ASWB Exam Blueprint Overview", content: "The ASWB Clinical exam covers four major content areas: Human Development, Diversity, and Behavior in the Environment (25%); Assessment and Intervention Planning (28%); Interventions with Clients/Client Systems (27%); and Professional Relationships, Values, and Ethics (20%). Understanding this blueprint is crucial for allocating study time effectively. Each domain includes sub-topics that map to specific competencies tested on the exam." },
          { heading: "Key Topics to Master", content: "Focus your study on high-yield areas: DSM-5-TR diagnostic criteria and differential diagnosis, evidence-based treatment modalities (CBT, DBT, motivational interviewing), crisis intervention and safety planning, ethical decision-making frameworks (NASW Code of Ethics), psychopharmacology basics, human development theories (Erikson, Piaget, Kohlberg), systems theory, biopsychosocial assessment, and cultural competence. These topics appear frequently across multiple exam domains." },
          { heading: "Effective Study Strategies", content: "Start with a diagnostic assessment to identify your baseline. Create a 8-12 week study schedule that progressively covers each domain. Use active recall and spaced repetition — practice answering questions rather than passively reading. Focus on understanding clinical reasoning, not memorizing facts. Practice with case vignettes that require you to apply knowledge to real-world scenarios. Review rationales for both correct and incorrect answers to deepen understanding." },
          { heading: "Practice Resources & Next Steps", content: "Integrate multiple study modalities: use our question bank for active practice, flashcard decks for concept reinforcement, mock exams for timing and endurance, and study plan generator for personalized scheduling. Track your performance across domains to identify persistent weak areas. Aim for consistent 75%+ accuracy across all domains before scheduling your exam date." },
        ],
        faqs: [
          { q: "How long should I study for the ASWB exam?", a: "Most candidates study for 8-12 weeks, dedicating 10-15 hours per week. The optimal timeline depends on your clinical experience, time since MSW completion, and baseline knowledge level. Our diagnostic assessment helps determine your recommended study duration." },
          { q: "What is the pass rate for the ASWB Clinical exam?", a: "The national pass rate for the ASWB Clinical exam is approximately 75-80% for first-time test takers. Candidates who use structured study plans with practice questions tend to perform above average." },
          { q: "Should I study differently for the Masters vs Clinical exam?", a: "Yes. The Masters exam focuses more on generalist practice and macro-level interventions, while the Clinical exam emphasizes clinical assessment, diagnosis, psychotherapy modalities, and advanced ethical reasoning. Tailor your study plan to the specific exam level." },
          { q: "What are the best study resources?", a: "Combine our ASWB-aligned question bank, spaced repetition flashcards, and mock exams with review of the NASW Code of Ethics, DSM-5-TR, and your MSW course materials. Active practice with case vignettes is the single most effective study strategy." },
        ],
      },
      "practice-questions": {
        title: `Free Social Work Practice Questions | ASWB Exam Prep`,
        metaDesc: `Practice ASWB exam questions with detailed rationales. Free social work licensing exam prep questions covering ethics, assessment, diagnosis, and clinical interventions.`,
        keywords: `social work practice questions, ASWB practice test, free social work exam questions, LCSW practice questions, social work exam prep free, ASWB sample questions`,
        h1: "Free Social Work Practice Questions",
        heroSub: "Try free ASWB-aligned practice questions with detailed rationales. Test your knowledge of clinical assessment, ethical decision-making, DSM-5 diagnosis, and evidence-based interventions.",
        sections: [
          { heading: "Case Vignette Questions", content: "Our practice questions use realistic clinical vignettes — the same format you'll see on the ASWB exam. Each scenario presents a client with specific presenting problems, history, and context. You must apply clinical knowledge to select the most appropriate assessment, diagnosis, intervention, or ethical response. Rationales explain the clinical reasoning behind each answer choice." },
          { heading: "Ethics & Professional Practice", content: "Approximately 20% of the ASWB exam tests ethical reasoning. Our free practice set includes ethical dilemma scenarios involving confidentiality limits, dual relationships, informed consent, duty to warn, supervisor-supervisee boundaries, and cultural sensitivity. Each question references the relevant NASW Code of Ethics principles." },
          { heading: "Assessment & Diagnosis Practice", content: "Practice differential diagnosis with cases requiring you to distinguish between similar presentations — major depressive disorder vs persistent depressive disorder, generalized anxiety vs social anxiety, PTSD vs acute stress disorder. Questions test your ability to apply DSM-5-TR criteria accurately and consider biopsychosocial factors in assessment." },
          { heading: "Intervention Selection", content: "Test your knowledge of evidence-based interventions. Questions present clinical scenarios and ask you to select the most appropriate therapeutic approach. Practice matching CBT to depression and anxiety, DBT to borderline personality features, motivational interviewing to ambivalence, and trauma-informed approaches to PTSD presentations." },
        ],
        faqs: [
          { q: "How many free practice questions are available?", a: "Free users get access to sample questions spanning ASWB exam domains. Our question bank has 1,000+ ASWB-aligned questions across 20 content domains with new questions added regularly." },
          { q: "Are these questions like the real ASWB exam?", a: "Yes. Our questions follow the ASWB exam format — multiple-choice with four answer options, clinical case vignettes, and ethical scenario-based reasoning. Difficulty levels match the actual exam experience." },
          { q: "Do I need to create an account for free questions?", a: "No account required for the sample question set. Creating a free account unlocks the diagnostic assessment, progress tracking, and additional free content across all study tools." },
          { q: "How detailed are the rationales?", a: "Each rationale is 400+ words and explains: why the correct answer is best, why each distractor is incorrect, the underlying clinical reasoning, relevant ethical principles, and connections to evidence-based practice guidelines." },
        ],
      },
    },
    psychotherapist: {
      "exam-prep": {
        title: `Psychotherapy Exam Prep | CRPO, NCE & Counseling Certification`,
        metaDesc: `Complete psychotherapy and counseling exam preparation for CRPO Registration Exam, NCE, CMHCE, and CCC certification. Practice questions, mock exams, and study plans.`,
        keywords: `psychotherapy exam prep, CRPO exam, NCE exam prep, counseling exam, psychotherapist certification, CMHCE exam, counseling practice questions`,
        h1: "Psychotherapy & Counseling Exam Prep",
        heroSub: "Comprehensive exam preparation for psychotherapists and counselors. Covering CRPO Registration Exam (Canada), NCE, CMHCE, and CCC certification with adaptive learning and clinical case scenarios.",
        sections: [
          { heading: "Multi-Exam Coverage", content: "Our platform covers multiple psychotherapy and counseling certification exams. Canadian students preparing for the CRPO Registration Exam get content aligned with Ontario's regulatory standards. US students preparing for the National Counselor Examination (NCE), Clinical Mental Health Counseling Exam (CMHCE), or Canadian Certified Counsellor (CCC) exam get exam-specific content with appropriate scope and focus." },
          { heading: "Therapeutic Modality Mastery", content: "Deep coverage of all major therapeutic approaches: Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), Eye Movement Desensitization and Reprocessing (EMDR), Person-Centered Therapy, Solution-Focused Brief Therapy, Psychodynamic Therapy, Narrative Therapy, and Family Systems approaches. Practice applying each modality to appropriate client presentations through clinical case vignettes." },
          { heading: "Ethics & Regulatory Standards", content: "Psychotherapy exams heavily test ethical knowledge. Our platform covers informed consent, confidentiality and its limits, dual relationships, scope of practice boundaries, mandatory reporting obligations, record-keeping standards, and professional competence requirements. Content addresses both Canadian (CRPO Standards) and US (ACA Code of Ethics) regulatory frameworks." },
          { heading: "Clinical Assessment Skills", content: "Master mental status examination, risk assessment (suicide, homicide, self-harm), intake assessment processes, treatment planning, and outcome measurement. Practice with standardized assessment tools and learn when and how to apply validated screening instruments in clinical practice." },
        ],
        faqs: [
          { q: "Which psychotherapy exams does this cover?", a: "We cover the CRPO Registration Exam (Ontario, Canada), National Counselor Examination (NCE), Clinical Mental Health Counseling Exam (CMHCE), and Canadian Certified Counsellor (CCC) exam. Content is tagged by exam relevance for focused study." },
          { q: "How many practice questions are available?", a: "Our question bank includes 400+ exam-aligned questions covering all major content domains, with new questions added weekly. Each question includes detailed clinical rationales." },
          { q: "Is the content clinically accurate?", a: "All content is developed by licensed psychotherapists and counselors, reviewed against current practice standards, and updated when clinical guidelines change. Treatment recommendations align with evidence-based practice." },
          { q: "How does this differ from generic psychology prep?", a: "Our content is specifically designed for psychotherapy and counseling certification exams — not general psychology. Questions focus on therapeutic practice, clinical decision-making, and professional ethics rather than academic psychology knowledge." },
        ],
      },
      "career-guide": {
        title: `Psychotherapist Career Guide | Education, Licensing & Salary`,
        metaDesc: `Career guide for psychotherapists and counselors. Education requirements, licensing pathways, salary information, job outlook, and practice settings for mental health professionals.`,
        keywords: `psychotherapist career, counselor career path, psychotherapy salary, mental health counselor education, psychotherapy licensing, registered psychotherapist`,
        h1: "Psychotherapist & Counselor Career Guide",
        heroSub: "Your complete guide to a career in psychotherapy and counseling — from master's degree programs and supervised practice to licensing, specialization, and private practice opportunities.",
        sections: [
          { heading: "Education Requirements", content: "Becoming a registered psychotherapist or licensed counselor requires a master's degree in counseling, psychotherapy, psychology, or a related field from an accredited program. In Canada, the CRPO requires a master's degree with specific coursework in psychotherapy theory, ethics, and supervised clinical practice. In the US, licensed professional counselors (LPCs) need a master's in counseling from a CACREP-accredited program. Programs typically take 2-3 years and include 600-1,000 hours of supervised clinical practicum." },
          { heading: "Licensing & Registration", content: "In Ontario, Canada, psychotherapists register with the College of Registered Psychotherapists of Ontario (CRPO) by passing the Registration Exam and meeting education and experience requirements. In the US, counselors pursue state-specific licensure (LPC, LMHC, LCPC) requiring a master's degree, 2,000-4,000 supervised clinical hours, and passing the NCE or NCMHCE. Most jurisdictions require continuing education for license renewal. Some states offer reciprocity through interstate compacts." },
          { heading: "Salary & Compensation", content: "Entry-level counselors typically earn $45,000-$55,000 USD. Licensed counselors with 3-5 years of experience earn $55,000-$75,000. Private practice psychotherapists can earn $80,000-$120,000+ depending on caseload and specialization. In Canada, registered psychotherapists earn $50,000-$90,000 CAD, with private practice income varying by location and clientele. Specializations in trauma, couples therapy, or EMDR often command higher rates." },
          { heading: "Work Environments & Specializations", content: "Psychotherapists work in community mental health centers, hospitals, private practice, employee assistance programs (EAPs), college counseling centers, addiction treatment facilities, and telehealth platforms. Popular specializations include trauma and PTSD, couples and family therapy, child and adolescent therapy, addiction counseling, eating disorders, and LGBTQ+ affirming therapy. Telehealth has significantly expanded geographic reach and scheduling flexibility." },
        ],
        faqs: [
          { q: "What's the difference between a psychotherapist and a psychologist?", a: "Psychotherapists typically hold a master's degree and focus on providing therapy. Psychologists hold a doctoral degree (PhD or PsyD) and can conduct psychological testing, research, and therapy. In many jurisdictions, 'psychotherapist' is a regulated title requiring specific registration." },
          { q: "How long does it take to become a licensed counselor?", a: "Typically 5-7 years: 4 years for a bachelor's degree, 2-3 years for a master's degree, and 1-2 years of supervised post-graduate clinical experience. Timeline varies by state/province and program structure." },
          { q: "Can I practice across state/provincial lines?", a: "Telehealth has expanded options, but you generally need to be licensed in the state/province where your client is located. Some US states participate in counseling compacts allowing multi-state practice. In Canada, provincial registration is required." },
          { q: "Is private practice viable as a new graduate?", a: "Most new graduates work in agencies or group practices first to accumulate supervised hours for full licensure. Private practice typically begins after achieving independent licensure (3-5 years post-graduation), though some start part-time while employed elsewhere." },
        ],
      },
      "study-guide": {
        title: `Psychotherapy Exam Study Guide | CRPO & NCE Prep Strategies`,
        metaDesc: `Study guide for psychotherapy and counseling exams. Exam blueprint, key topics, study strategies, and practice resources for CRPO Registration Exam and NCE certification.`,
        keywords: `psychotherapy study guide, CRPO exam study plan, NCE study guide, counseling exam topics, psychotherapy exam strategies, counseling certification prep`,
        h1: "Psychotherapy Exam Study Guide",
        heroSub: "A structured study guide covering exam blueprints, essential therapeutic concepts, proven study strategies, and curated resources for psychotherapy and counseling certification exams.",
        sections: [
          { heading: "Exam Blueprint Overview", content: "The CRPO Registration Exam tests six competency areas: therapeutic process, professional responsibilities, ethical and legal issues, diversity and social context, clinical assessment, and crisis intervention. The NCE covers eight content areas: professional counseling orientation, social/cultural diversity, human growth/development, career development, counseling/helping relationships, group counseling, assessment/testing, and research/program evaluation. Understanding your specific exam's blueprint is essential for effective study planning." },
          { heading: "High-Yield Topics", content: "Focus on therapeutic modalities (CBT, DBT, Person-Centered, Solution-Focused), ethical decision-making models, DSM-5-TR diagnostic categories, crisis assessment and safety planning, multicultural counseling competencies, group therapy stages and dynamics, and research methodology basics. These topics appear across multiple exam domains and represent the highest-value study areas for maximizing your score." },
          { heading: "Study Strategies for Clinicians", content: "Use active recall through practice questions rather than passive reading. Apply the teach-back method — explain therapeutic concepts as if to a client or colleague. Create concept maps linking theories to techniques to appropriate client presentations. Study in 90-minute focused blocks with breaks. Use spaced repetition flashcards for terminology and diagnostic criteria. Schedule weekly practice exams to build test-taking stamina and identify persistent gaps." },
          { heading: "Connecting Study to Practice", content: "Leverage your clinical experience during study. When reviewing therapeutic modalities, connect concepts to actual clients you've worked with. When studying ethics, recall real dilemmas you've navigated. This integration of academic knowledge and clinical experience strengthens both recall and clinical judgment — exactly what licensing exams test." },
        ],
        faqs: [
          { q: "How long should I study for the CRPO exam?", a: "Most candidates study for 8-12 weeks, dedicating 10-15 hours per week. Candidates with recent clinical practicum experience may need less time. Our diagnostic assessment helps determine your optimal study timeline." },
          { q: "What's the best way to study therapeutic modalities?", a: "Create comparison charts for each modality covering: founder/origin, key concepts, techniques, appropriate client populations, and evidence base. Then practice applying each modality through clinical case vignettes rather than memorizing definitions." },
          { q: "Should I focus on one exam at a time?", a: "Yes. While there's significant content overlap between the CRPO, NCE, and CMHCE, each exam has unique emphases. Focus your study on your target exam's specific blueprint and question format." },
          { q: "How do I know when I'm ready to take the exam?", a: "Aim for consistent 75%+ accuracy across all domains in practice exams. Use our mock exam readiness indicator, which analyzes your performance trends and provides a data-driven recommendation for scheduling your exam date." },
        ],
      },
      "practice-questions": {
        title: `Free Psychotherapy Practice Questions | CRPO & NCE Exam Prep`,
        metaDesc: `Free psychotherapy and counseling practice questions with detailed rationales. CRPO, NCE, and CMHCE exam prep covering therapeutic modalities, ethics, and clinical assessment.`,
        keywords: `psychotherapy practice questions, free NCE practice test, CRPO practice questions, counseling exam questions free, psychotherapy exam prep free, NCE sample questions`,
        h1: "Free Psychotherapy Practice Questions",
        heroSub: "Try free psychotherapy and counseling exam practice questions with detailed clinical rationales. Test your knowledge of therapeutic modalities, ethical reasoning, and clinical assessment.",
        sections: [
          { heading: "Therapeutic Modality Questions", content: "Practice identifying appropriate therapeutic approaches for diverse client presentations. Questions cover CBT techniques for anxiety and depression, DBT skills for emotional dysregulation, EMDR for trauma processing, motivational interviewing for ambivalence, and person-centered approaches for building therapeutic alliance. Each rationale explains the theoretical basis and clinical evidence supporting the correct intervention." },
          { heading: "Ethical Reasoning Scenarios", content: "Navigate complex ethical situations commonly tested on psychotherapy exams. Practice with scenarios involving confidentiality breaches, dual relationship boundary issues, mandatory reporting obligations, informed consent complications, and scope of practice limitations. Questions reference both Canadian (CRPO Standards of Practice) and US (ACA Code of Ethics) ethical frameworks." },
          { heading: "Clinical Assessment Questions", content: "Test your ability to conduct and interpret clinical assessments. Questions cover mental status examination components, suicide risk assessment protocols, intake assessment best practices, treatment planning methodology, and appropriate use of standardized screening instruments. Practice making clinical decisions based on assessment findings." },
          { heading: "Multicultural Counseling Competence", content: "Exam questions increasingly test cultural competence and awareness. Practice with scenarios involving culturally diverse clients, addressing power dynamics in the therapeutic relationship, adapting interventions for different cultural contexts, and recognizing how social determinants of health influence mental health presentations." },
        ],
        faqs: [
          { q: "How many free practice questions can I access?", a: "Free users get 20+ sample questions covering all major exam domains. Premium access unlocks the full 400+ question bank with filtering by domain, difficulty, and exam type, plus performance analytics." },
          { q: "Are questions aligned with specific exams?", a: "Yes. Questions are tagged for CRPO, NCE, CMHCE, and CCC exam relevance. You can filter by your target exam to focus on the most relevant content areas and question formats." },
          { q: "Do rationales reference specific ethical codes?", a: "Yes. Ethics question rationales cite the specific NASW, ACA, or CRPO standard being tested and explain how it applies to the clinical scenario. This helps you learn the underlying ethical principles, not just memorize rules." },
          { q: "Can I track my performance on free questions?", a: "Creating a free account enables basic performance tracking, including domain-level accuracy and question history. Premium members get detailed analytics, trend visualization, and personalized study recommendations." },
        ],
      },
    },
    "addictions-counsellor": {
      "exam-prep": {
        title: `Addictions Counseling Exam Prep | IC&RC ADC & CASAC Certification`,
        metaDesc: `Complete addictions counseling exam preparation for IC&RC ADC, CASAC, and CCAC certification. Practice questions, mock exams, and study plans for substance abuse counselors.`,
        keywords: `addictions counseling exam prep, IC&RC ADC exam, CASAC exam, addiction counselor certification, substance abuse counselor exam, CCAC exam prep`,
        h1: "Addictions Counseling Exam Prep",
        heroSub: "Comprehensive certification exam preparation for addictions counselors. Covering IC&RC ADC, CASAC, and CCAC exams with motivational interviewing practice, substance pharmacology, and clinical case scenarios.",
        sections: [
          { heading: "IC&RC ADC Exam-Aligned Content", content: "Our content is mapped to the International Certification & Reciprocity Consortium (IC&RC) Alcohol and Drug Counselor (ADC) exam domains. Coverage includes clinical evaluation, treatment planning, counseling approaches, case management, client education, professional responsibilities, and ethical practice. Questions reflect the cognitive levels and format used on the actual certification exam." },
          { heading: "Substance Pharmacology Coverage", content: "Master the pharmacology of commonly abused substances: alcohol, opioids, stimulants (cocaine, methamphetamine), benzodiazepines, cannabis, hallucinogens, and emerging synthetic drugs. Understand mechanisms of action, withdrawal timelines, medical complications, medication-assisted treatment options (methadone, buprenorphine, naltrexone), and drug interaction considerations essential for clinical practice." },
          { heading: "Motivational Interviewing Practice", content: "Motivational interviewing (MI) is a cornerstone skill tested on addictions counseling exams. Practice applying OARS skills (Open questions, Affirmations, Reflective listening, Summaries), identifying and responding to change talk, navigating resistance with empathy, and progressing through stages of change. Case vignettes present realistic client interactions requiring MI technique application." },
          { heading: "Co-Occurring Disorders Integration", content: "Modern addictions practice requires competence in co-occurring mental health and substance use disorders. Our platform covers integrated assessment, dual diagnosis treatment planning, medication interactions, relapse prevention with co-occurring conditions, and appropriate referral decision-making for complex presentations." },
        ],
        faqs: [
          { q: "Which addictions counseling exams does this cover?", a: "We cover the IC&RC ADC (Alcohol and Drug Counselor), CASAC (Credentialed Alcoholism and Substance Abuse Counselor), and CCAC (Canadian Certified Addictions Counsellor) exams. Content is tagged by exam relevance for focused study." },
          { q: "How many practice questions are available?", a: "Our question bank includes 350+ exam-aligned questions covering all certification domains, with new questions added regularly. Each question includes detailed rationales with clinical reasoning and evidence-based practice references." },
          { q: "Does this cover medication-assisted treatment (MAT)?", a: "Yes. Comprehensive coverage of MAT including methadone maintenance, buprenorphine (Suboxone), naltrexone (Vivitrol), disulfiram (Antabuse), and acamprosate. Questions test understanding of indications, contraindications, and counselor roles in MAT programs." },
          { q: "Is there content on harm reduction approaches?", a: "Yes. Our platform covers harm reduction philosophy, naloxone distribution, safer use strategies, and the spectrum of treatment approaches from abstinence-based to harm reduction models. Content reflects current best practices and evolving clinical standards." },
        ],
      },
      "career-guide": {
        title: `Addictions Counselor Career Guide | Education, Certification & Salary`,
        metaDesc: `Career guide for addictions counselors. Education requirements, certification pathways (CASAC, ADC, CCAC), salary data, job outlook, and treatment settings.`,
        keywords: `addictions counselor career, CASAC career path, addiction counselor salary, substance abuse counselor education, addictions certification, addiction counselor job outlook`,
        h1: "Addictions Counselor Career Guide",
        heroSub: "Your complete guide to a career in addictions counseling — from education and certification pathways to salary expectations, work environments, and career advancement opportunities.",
        sections: [
          { heading: "Education Requirements", content: "Entry paths into addictions counseling vary more widely than many health professions. Some states allow certification with an associate degree or bachelor's degree plus supervised experience, while others require a master's degree. Common degree programs include addiction studies, counseling, social work, and psychology. CACREP-accredited programs with addiction counseling specializations provide the strongest preparation. Many programs include specific coursework in pharmacology of substances, counseling techniques for addiction, group dynamics, and ethics in substance abuse treatment." },
          { heading: "Certification Pathways", content: "The IC&RC ADC is the most widely recognized national credential, accepted in 30+ states. CASAC certification is New York-specific but well-regarded. The CCAC serves Canadian practitioners. Each credential requires a combination of education hours (typically 270-600 hours of addiction-specific coursework), supervised experience (2,000-6,000 hours), and passing a standardized exam. Many counselors pursue additional credentials like CADC, MAC, or NCAC as they advance." },
          { heading: "Salary & Compensation", content: "Entry-level addictions counselors typically earn $35,000-$45,000 USD. With certification and 3-5 years of experience, salaries range from $45,000-$60,000. Clinical supervisors and program directors earn $65,000-$85,000+. Private practice addiction counselors can earn more. Government positions (VA, federal corrections) often offer higher salaries and better benefits. Canadian addictions counselors earn comparable salaries in CAD. The opioid crisis and expanded insurance coverage for substance abuse treatment have increased demand and compensation." },
          { heading: "Work Settings & Job Outlook", content: "Addictions counselors work in residential treatment centers, outpatient clinics, detox facilities, hospitals, criminal justice settings, employee assistance programs, community health centers, and private practice. The Bureau of Labor Statistics projects 22% growth for substance abuse counselors through 2032 — much faster than average. The ongoing opioid epidemic, expanded Medicaid coverage, and growing recognition of addiction as a medical condition continue to drive demand. Telehealth has emerged as an effective delivery model for addiction counseling." },
        ],
        faqs: [
          { q: "Can I become an addictions counselor without a degree?", a: "Some states allow certification with an associate degree or even a high school diploma plus extensive supervised experience and education hours. However, a bachelor's or master's degree provides more career options, higher salary potential, and easier pathway to clinical licensure." },
          { q: "What is the IC&RC ADC credential?", a: "The International Certification & Reciprocity Consortium Alcohol and Drug Counselor credential is the most portable addictions certification in the US, recognized in 30+ states. It requires education, supervised experience, and passing a standardized exam." },
          { q: "Is there demand for addictions counselors?", a: "Yes, very strong demand. The BLS projects 22% growth through 2032. The opioid crisis, expanded insurance coverage (including parity laws), and growing de-stigmatization of addiction treatment continue to drive hiring across all practice settings." },
          { q: "Can addictions counselors prescribe medication-assisted treatment?", a: "No. Addictions counselors cannot prescribe medications. They work alongside physicians, nurse practitioners, or physician assistants who prescribe MAT medications like buprenorphine and naltrexone. Counselors provide the psychosocial component of integrated treatment." },
        ],
      },
      "study-guide": {
        title: `Addictions Counseling Study Guide | IC&RC ADC Exam Blueprint & Strategies`,
        metaDesc: `Study guide for addictions counseling exams. IC&RC ADC exam blueprint, key topics, pharmacology review, study strategies, and practice resources for certification prep.`,
        keywords: `addictions counseling study guide, IC&RC ADC study plan, addiction counselor exam topics, CASAC study guide, substance abuse counselor exam strategies`,
        h1: "Addictions Counseling Study Guide",
        heroSub: "A structured study guide covering the IC&RC ADC exam blueprint, essential substance abuse topics, pharmacology review, counseling techniques, and proven study strategies.",
        sections: [
          { heading: "IC&RC ADC Exam Blueprint", content: "The IC&RC ADC exam covers 12 core function areas: screening, intake, orientation, assessment, treatment planning, counseling (individual), counseling (group), case management, crisis intervention, client education, referral, and report/record keeping. Additionally, it tests transdisciplinary foundations including understanding of addiction, treatment knowledge, application to practice, and professional readiness. Understanding the weighting of each area helps optimize your study time." },
          { heading: "Pharmacology Essentials", content: "Master the pharmacology tested on addictions exams: mechanisms of tolerance, dependence, and withdrawal for each drug class; withdrawal timelines and medical management protocols; medication-assisted treatment options and their mechanisms; drug interactions; and the neuroscience of addiction (dopamine pathways, reward circuitry, neuroplasticity). Create comparison tables for each substance class covering effects, withdrawal symptoms, and treatment approaches." },
          { heading: "Counseling Techniques & Models", content: "Study the major counseling approaches used in addiction treatment: Motivational Interviewing (stages of change, OARS skills, decisional balance), Cognitive Behavioral Therapy (functional analysis, skills training), 12-Step Facilitation, Contingency Management, Matrix Model, Relapse Prevention (Marlatt's model), and Trauma-Informed Care. Focus on when each approach is most appropriate and how to integrate multiple modalities in treatment planning." },
          { heading: "Study Plan & Test Preparation", content: "Begin with a diagnostic assessment to identify your strongest and weakest domains. Create an 8-10 week study schedule allocating time proportionally to exam blueprint weights. Use active recall through practice questions daily. Study pharmacology in focused blocks using comparison tables. Practice applying counseling techniques through case vignettes. Take at least 3 full-length mock exams before your test date, analyzing performance trends across domains." },
        ],
        faqs: [
          { q: "How long should I study for the IC&RC ADC exam?", a: "Most candidates study for 8-10 weeks, dedicating 10-12 hours per week. Candidates with extensive clinical experience may need less time. Use our diagnostic assessment to determine your personalized study timeline." },
          { q: "What's the hardest part of the ADC exam?", a: "Many candidates find the pharmacology and co-occurring disorders sections most challenging. The exam also tests nuanced ethical decision-making and clinical judgment — not just factual recall. Consistent practice with case vignettes is the best preparation for these questions." },
          { q: "Should I memorize withdrawal timelines?", a: "Yes, withdrawal timelines are frequently tested. Know the onset, peak, and duration of withdrawal for alcohol, opioids, benzodiazepines, and stimulants. Also know which withdrawals are medically dangerous and require supervised detoxification." },
          { q: "How do I study for the counseling techniques section?", a: "Rather than memorizing technique definitions, practice applying them. Use case vignettes that require you to choose the appropriate counseling approach and explain your clinical reasoning. Understanding when to use MI vs CBT vs trauma-informed care is more important than reciting definitions." },
        ],
      },
      "practice-questions": {
        title: `Free Addictions Counseling Practice Questions | ADC Exam Prep`,
        metaDesc: `Free addictions counseling practice questions with detailed rationales. IC&RC ADC, CASAC, and CCAC exam prep covering substance pharmacology, counseling techniques, and ethics.`,
        keywords: `addictions counseling practice questions, free ADC exam questions, CASAC practice test, addiction counselor exam prep free, substance abuse counselor practice questions`,
        h1: "Free Addictions Counseling Practice Questions",
        heroSub: "Try free addictions counseling exam questions with detailed rationales. Test your knowledge of substance pharmacology, motivational interviewing, treatment planning, and ethical practice.",
        sections: [
          { heading: "Substance Pharmacology Questions", content: "Practice identifying substances based on clinical presentations, withdrawal symptoms, and laboratory findings. Questions cover alcohol, opioids, stimulants, benzodiazepines, cannabis, hallucinogens, and polysubstance use. Rationales explain pharmacological mechanisms, withdrawal management protocols, and medication-assisted treatment considerations for each substance class." },
          { heading: "Counseling Technique Application", content: "Apply motivational interviewing, CBT, and other counseling techniques to realistic client scenarios. Questions present clients at various stages of change and ask you to select the most appropriate therapeutic response. Practice identifying change talk, rolling with resistance, and using open-ended questions effectively in addictions counseling contexts." },
          { heading: "Treatment Planning & Case Management", content: "Test your ability to develop comprehensive treatment plans for diverse client presentations. Questions cover initial assessment, problem prioritization, goal setting, level-of-care determination, referral decision-making, and discharge planning. Practice integrating client strengths, social supports, and co-occurring conditions into holistic treatment plans." },
          { heading: "Ethics & Professional Practice", content: "Navigate ethical scenarios specific to addictions counseling: mandatory reporting of child abuse when revealed during treatment, confidentiality in group therapy settings, managing boundaries with clients in recovery, 42 CFR Part 2 (substance abuse treatment records privacy), and ethical use of drug testing results. Questions reference IC&RC and relevant state/provincial ethical standards." },
        ],
        faqs: [
          { q: "How many free practice questions are available?", a: "Free users get 20+ sample questions spanning all ADC exam domains. Premium access unlocks the full 350+ question bank with performance tracking, domain filtering, and personalized study recommendations." },
          { q: "Are questions based on real clinical scenarios?", a: "Yes. Questions present realistic client vignettes requiring clinical reasoning and decision-making. Scenarios reflect the diversity of clients and situations encountered in addiction treatment settings." },
          { q: "Do rationales explain pharmacology concepts?", a: "Yes. Pharmacology question rationales explain the mechanism of action, clinical significance, and treatment implications. They connect pharmacological knowledge to counseling practice and clinical decision-making." },
          { q: "Will these questions help with both US and Canadian exams?", a: "Yes. Core addictions counseling competencies overlap significantly across IC&RC ADC, CASAC, and CCAC exams. Questions are tagged by exam relevance so you can focus on your target certification." },
        ],
      },
    },
    "occupational-therapy": {
      "exam-prep": {
        title: `Occupational Therapy Exam Prep | NBCOT OTR & NOTCE Study Platform`,
        metaDesc: `Complete occupational therapy exam preparation for NBCOT OTR and NOTCE certification. Practice questions, mock exams, flashcards, and personalized study plans for OT students.`,
        keywords: `occupational therapy exam prep, NBCOT OTR exam, NOTCE exam prep, OT certification, occupational therapist exam, OT practice questions, NBCOT study`,
        h1: "Occupational Therapy Exam Prep",
        heroSub: "The most comprehensive occupational therapy certification exam preparation platform. Covering NBCOT OTR (USA) and NOTCE (Canada) with adaptive learning, clinical case analysis, and detailed performance analytics.",
        sections: [
          { heading: "NBCOT OTR & NOTCE Coverage", content: "Our platform covers both major OT certification exams. NBCOT OTR content follows the official exam blueprint covering evaluation, intervention planning, implementation, and professional standards. NOTCE (National Occupational Therapy Certification Examination) content addresses Canadian practice standards, including provincial regulatory requirements and Canadian healthcare system contexts. Switch between exam tracks based on your certification goal." },
          { heading: "Clinical Case Analysis", content: "OT certification exams rely heavily on clinical reasoning scenarios. Our platform presents detailed client cases spanning pediatric development, adult rehabilitation, geriatric care, mental health, and workplace ergonomics. Each case requires you to evaluate the client, identify appropriate assessments, develop intervention plans, select evidence-based activities, and determine functional outcomes. Practice the clinical reasoning process that mirrors real OT practice." },
          { heading: "Domain-Specific Test Banks", content: "Deep coverage across all OT practice domains: Evaluation & Assessment (standardized tests, clinical observations, occupational profiles), Intervention Planning & Implementation (activity analysis, grading/adapting, therapeutic use of self), Professional Practice (ethics, documentation, evidence-based practice), and specialized areas including pediatrics, psychosocial OT, hand therapy, assistive technology, and cognitive rehabilitation." },
          { heading: "SMART Goal Writing Practice", content: "Documentation and goal writing are critical OT competencies tested on certification exams. Practice writing measurable, client-centered SMART goals for diverse practice settings. Learn to connect evaluation findings to specific, time-bound intervention goals that reflect meaningful occupational outcomes rather than component skill improvements." },
        ],
        faqs: [
          { q: "Does this cover both NBCOT and NOTCE?", a: "Yes. Our platform covers both the NBCOT OTR exam (USA) and NOTCE (Canada). Content is tagged by exam relevance, and you can switch between exam tracks to access region-specific content and practice standards." },
          { q: "How many OT practice questions are available?", a: "Our question bank includes 400+ OT exam-aligned questions with detailed rationales, growing weekly. Questions cover all exam domains with clinical case scenarios, activity analysis problems, and professional practice questions." },
          { q: "Are pediatric OT topics covered?", a: "Yes, extensively. Pediatric coverage includes developmental milestones, sensory processing, school-based OT, early intervention, pediatric standardized assessments (PDMS-2, BOT-2, SPM), and play-based intervention approaches." },
          { q: "Is there a free trial?", a: "Yes. Take our free diagnostic assessment to evaluate your readiness. Free users also get access to sample questions from each domain and limited flashcard access." },
          { q: "How does the mock exam work?", a: "Full-length mock exams simulate the NBCOT OTR testing experience with 200 questions over 4 hours. Questions are weighted to match the official exam blueprint. After completion, you receive domain-level scoring, time management analysis, and targeted remediation recommendations." },
        ],
      },
      "career-guide": {
        title: `Occupational Therapy Career Guide | Education, Licensing & Salary`,
        metaDesc: `Career guide for occupational therapists. Education requirements (OTD/MOT), licensing pathways, salary information, job outlook, and practice settings for aspiring OTs.`,
        keywords: `occupational therapy career, OT career path, occupational therapist salary, OT education requirements, OT licensing, OTD degree, occupational therapy job outlook`,
        h1: "Occupational Therapy Career Guide",
        heroSub: "Everything you need to know about building a career in occupational therapy — from doctoral/master's programs and fieldwork to licensing, specializations, and salary expectations.",
        sections: [
          { heading: "Education Requirements", content: "As of 2027, entry-level occupational therapy practice in the US requires a doctoral degree (OTD) from an ACOTE-accredited program. Currently, both Master of Occupational Therapy (MOT/MSOT) and OTD graduates are eligible for NBCOT certification. Programs typically take 2.5-3.5 years and include extensive fieldwork (Level I and Level II). In Canada, a master's degree (MSc OT) from a CAOT-accredited program is the entry requirement. Programs include foundational sciences, OT theory, clinical skills, and supervised fieldwork placements across practice settings." },
          { heading: "Licensing & Certification", content: "In the US, occupational therapists must pass the NBCOT OTR exam and obtain state licensure. Most states require the NBCOT certification for initial licensure. Continuing education requirements vary by state but typically require 24-36 PDUs per renewal cycle. In Canada, OTs must pass the NOTCE and register with their provincial regulatory college. Board certifications in specialty areas (hand therapy CHT, pediatrics, driving rehabilitation) are available for experienced practitioners seeking advanced credentials." },
          { heading: "Salary & Compensation", content: "Occupational therapists earn strong salaries relative to the education investment. Entry-level OTs typically start at $65,000-$80,000 USD. Experienced OTs earn $80,000-$95,000, with specialized roles (hand therapy, neonatal ICU) exceeding $100,000. Travel OT positions offer $90,000-$120,000+ with housing stipends. Canadian OTs earn $65,000-$95,000 CAD depending on setting and province. Benefits typically include health insurance, retirement plans, continuing education allowances, and flexible scheduling options." },
          { heading: "Practice Settings & Specializations", content: "OTs work across the lifespan in diverse settings: hospitals (acute care, inpatient rehabilitation), outpatient clinics, schools, skilled nursing facilities, home health, mental health programs, hand therapy clinics, pediatric development centers, and private practice. Growing areas include ergonomics consulting, telehealth OT, technology accessibility, driver rehabilitation, and community health. The BLS projects 12% growth for OTs through 2032 — much faster than average — driven by aging populations and increasing recognition of OT's role in chronic disease management." },
        ],
        faqs: [
          { q: "Do I need a doctoral degree to practice OT?", a: "Currently, both MOT/MSOT and OTD graduates can sit for the NBCOT exam and practice as OTs. ACOTE mandated that all new programs be at the doctoral level by July 2027, but existing master's programs received extensions. In Canada, a master's degree remains the entry-level requirement." },
          { q: "What is the NBCOT OTR exam?", a: "The National Board for Certification in Occupational Therapy (NBCOT) OTR exam is a 200-question, 4-hour computer-delivered test required for initial OT certification in the US. It tests clinical simulation and multiple-choice items across all OT practice domains." },
          { q: "How competitive is OT school admission?", a: "OT programs are moderately competitive, typically requiring a GPA of 3.0-3.5, prerequisite courses in anatomy, physiology, psychology, and statistics, observation hours (40-100+), GRE scores (some programs), and strong personal statements demonstrating understanding of OT philosophy." },
          { q: "Can OTs specialize in specific areas?", a: "Yes. Board certifications include Certified Hand Therapist (CHT), Board Certified in Pediatrics (BCP), and specialty certifications in driving rehabilitation, environmental modification, and low vision. Specialization typically requires 3-5 years of focused practice experience." },
        ],
      },
      "study-guide": {
        title: `Occupational Therapy Study Guide | NBCOT Exam Blueprint & Strategies`,
        metaDesc: `OT study guide with NBCOT OTR exam blueprint overview, key topics, study strategies, and links to practice questions and flashcards for occupational therapy certification.`,
        keywords: `NBCOT study guide, occupational therapy exam study plan, OT exam topics, NBCOT exam blueprint, OT study strategies, occupational therapy certification prep`,
        h1: "Occupational Therapy Study Guide",
        heroSub: "A comprehensive study guide covering the NBCOT OTR exam blueprint, essential OT concepts, evidence-based study strategies, and curated resources to help you pass your OT certification exam.",
        sections: [
          { heading: "NBCOT Exam Blueprint Overview", content: "The NBCOT OTR exam covers four domains: Evaluation and Assessment (25%), Analysis and Interpretation (20%), Intervention Management (38%), and Competency and Practice Management (17%). The largest domain — Intervention Management — tests your ability to select, implement, and modify evidence-based interventions across practice settings. Understanding these weightings helps you allocate study time strategically, focusing most effort on intervention planning and clinical reasoning." },
          { heading: "Essential Topics to Master", content: "Focus on high-yield areas: activity analysis and grading/adapting techniques, standardized assessment tools (FIM, COPM, AMPS, BOT-2), frames of reference (biomechanical, rehabilitative, neurodevelopmental, MOHO), upper extremity rehabilitation, pediatric developmental milestones and intervention approaches, cognitive rehabilitation strategies, psychosocial OT interventions, wheelchair/seating assessment, splinting principles, and documentation/SOAP note writing." },
          { heading: "Study Strategies for OT Students", content: "Begin with a diagnostic assessment to identify your baseline across all domains. Create a 10-14 week study plan prioritizing your weakest areas while maintaining coverage of strengths. Use clinical reasoning case studies rather than rote memorization — the NBCOT emphasizes application over recall. Practice with clinical simulation items (CSIs) which present multi-step client scenarios requiring sequential decision-making. Study in groups to discuss clinical reasoning processes and compare approaches." },
          { heading: "Fieldwork Integration", content: "Your Level II fieldwork experiences are invaluable study resources. Review your fieldwork cases and connect them to exam content domains. Reflect on evaluation processes you used, intervention approaches you implemented, and clinical reasoning decisions you made. The NBCOT tests the same competencies your fieldwork supervisors assessed — your clinical experiences provide authentic context for exam preparation." },
        ],
        faqs: [
          { q: "How long should I study for the NBCOT exam?", a: "Most candidates study for 10-14 weeks, dedicating 15-20 hours per week. Candidates who recently completed fieldwork may need less time. Our diagnostic assessment provides a personalized study timeline recommendation based on your baseline performance." },
          { q: "What are Clinical Simulation Items (CSIs)?", a: "CSIs are multi-part questions that present a clinical scenario and require you to make sequential decisions — similar to real OT practice. You might evaluate a client, select assessments, interpret findings, and plan interventions across several connected questions. Our mock exams include CSI practice." },
          { q: "Should I study differently for the NOTCE vs NBCOT?", a: "The NOTCE focuses on Canadian practice contexts, healthcare system navigation, and provincial regulatory standards. The NBCOT emphasizes US practice standards and healthcare models. Core OT competencies overlap significantly, but regulatory and system-specific content differs. Tailor your study to your target exam." },
          { q: "What study tools are most effective for the NBCOT?", a: "Combine practice questions for active recall, clinical case studies for reasoning development, flashcards for assessment tool knowledge, and mock exams for timing practice. Our platform integrates all four modalities with smart remediation linking." },
        ],
      },
      "practice-questions": {
        title: `Free Occupational Therapy Practice Questions | NBCOT OTR Exam Prep`,
        metaDesc: `Free OT practice questions with detailed rationales. NBCOT OTR and NOTCE exam prep covering evaluation, intervention planning, pediatrics, and professional practice.`,
        keywords: `OT practice questions, free NBCOT practice test, occupational therapy exam questions free, NBCOT OTR practice questions, OT exam prep free, occupational therapy sample questions`,
        h1: "Free Occupational Therapy Practice Questions",
        heroSub: "Try free NBCOT-aligned OT practice questions with detailed clinical rationales. Test your knowledge of evaluation, intervention planning, clinical reasoning, and professional practice.",
        sections: [
          { heading: "Evaluation & Assessment Questions", content: "Practice selecting appropriate standardized assessments for diverse client populations. Questions cover the Functional Independence Measure (FIM), Canadian Occupational Performance Measure (COPM), Assessment of Motor and Process Skills (AMPS), and population-specific tools for pediatric, adult rehabilitation, and geriatric clients. Rationales explain assessment selection reasoning and interpretation of results." },
          { heading: "Intervention Planning Questions", content: "Test your ability to develop evidence-based intervention plans. Questions present client scenarios requiring activity analysis, grading and adapting activities, selecting appropriate frames of reference, and designing occupation-based interventions. Practice planning across settings including acute care, inpatient rehab, outpatient, school-based, and home health contexts." },
          { heading: "Pediatric OT Questions", content: "Practice with pediatric cases covering developmental delay, sensory processing differences, autism spectrum disorder, cerebral palsy, and school-based OT. Questions test knowledge of developmental milestones, pediatric assessments (PDMS-2, SPM), play-based intervention approaches, and IEP goal development. Each rationale connects OT theory to developmental principles." },
          { heading: "Clinical Reasoning Scenarios", content: "Multi-step clinical reasoning questions present realistic OT practice scenarios. Evaluate clients, select assessments, interpret findings, plan interventions, and determine discharge readiness. These questions mirror the Clinical Simulation Items (CSIs) on the NBCOT exam and build the sequential decision-making skills essential for certification success." },
        ],
        faqs: [
          { q: "How many free OT practice questions are available?", a: "Free users get 25+ sample questions covering all NBCOT exam domains. Premium access unlocks the full 400+ question bank with clinical simulation items, domain filtering, performance tracking, and personalized study recommendations." },
          { q: "Are questions formatted like the NBCOT exam?", a: "Yes. Questions include both standard multiple-choice items and clinical simulation items (CSIs) that mirror the NBCOT OTR exam format. Difficulty levels span the range tested on the actual exam." },
          { q: "Do questions cover Canadian OT practice?", a: "Yes. Questions tagged for NOTCE relevance address Canadian practice standards, healthcare system contexts, and provincial regulatory requirements alongside NBCOT-aligned content." },
          { q: "How detailed are the rationales?", a: "Each rationale is 400+ words explaining: the correct clinical reasoning, why each distractor is incorrect, relevant OT frames of reference, evidence-based practice connections, and test-taking strategy tips for similar questions." },
        ],
      },
    },
    "physical-therapy": {
      "career-guide": {
        title: `Physical Therapy Career Guide | Education, Licensing & Salary`,
        metaDesc: `Career guide for physical therapists. DPT education, NPTE licensing, salary ranges, practice settings, and specialization paths for aspiring PTs.`,
        keywords: `physical therapy career, DPT requirements, NPTE licensing, physical therapist salary, PT education, physical therapy job outlook`,
        h1: "Physical Therapy Career Guide",
        heroSub:
          "Plan your path to licensure—from CAPTE-accredited DPT programs and clinical education to the NPTE, state licensure, residencies/fellowships, and high-demand practice settings.",
        sections: [
          {
            heading: "Education & Clinical Training",
            content:
              "Entry-level practice in the United States requires a Doctor of Physical Therapy (DPT) from a CAPTE-accredited program. Coursework covers musculoskeletal, neuromuscular, cardiopulmonary, and integumentary systems; therapeutic exercise; manual therapy; pharmacology; imaging; and evidence-based practice. Full-time clinical education (typically 30+ weeks) builds patient management skills across inpatient, outpatient, neuro, ortho, and acute care. Canadian pathways differ by province but similarly emphasize master's-level training and national/clinical exams.",
          },
          {
            heading: "Licensure & the NPTE",
            content:
              "After graduation, candidates sit for the National Physical Therapy Examination (NPTE) administered by FSBPT, then apply for licensure in each state of practice. Requirements include jurisprudence exams in some jurisdictions, background checks, and continuing competence. Maintaining licensure requires ongoing CEUs. Understanding scope of practice, referral relationships, and documentation standards is essential from day one.",
          },
          {
            heading: "Salary, Demand & Practice Settings",
            content:
              "PTs work in outpatient orthopedics, hospitals, home health, skilled nursing, schools, sports medicine, and telehealth. Compensation varies by setting, geography, experience, and specialization. Demand remains strong due to aging populations, chronic disease management, and value-based care emphasizing mobility and fall prevention.",
          },
          {
            heading: "Specialization & Advancement",
            content:
              "Board certification (e.g., orthopedics, neurology, sports, pediatrics), residency and fellowship training, cash-based practices, and leadership roles in clinics or health systems are common advancement routes. Many PTs pursue teaching, research, or hybrid clinical-educator positions.",
          },
        ],
        faqs: [
          { q: "Do I need a doctorate to practice as a PT in the US?", a: "Yes. The DPT is the required entry-level degree for licensure in the United States." },
          { q: "What exam do I take for US licensure?", a: "Graduates typically take the NPTE through FSBPT, then complete state-specific licensure steps." },
          { q: "Can PTs specialize?", a: "Yes—through residencies, fellowships, and ABPTS board certification in focused practice areas." },
        ],
      },
    },
    "health-info-mgmt": {
      "career-guide": {
        title: `Health Information Management Career Guide | RHIA, RHIT & Coding Pathways`,
        metaDesc: `Career guide for health information professionals. Education for RHIA/RHIT, CCS coding, privacy & compliance roles, salaries, and digital health career paths.`,
        keywords: `health information management career, RHIA, RHIT, medical coding career, HIM salary, health informatics jobs, HIPAA career`,
        h1: "Health Information Management Career Guide",
        heroSub:
          "Navigate accredited HIM programs, AHIMA credentials, coding and revenue-cycle roles, privacy & security careers, and the shift toward analytics, informatics, and interoperability.",
        sections: [
          {
            heading: "Education & Core Credentials",
            content:
              "Health Information Management blends clinical knowledge with data governance, coding, privacy, and analytics. CAHIIM-accredited programs support eligibility for AHIMA credentials such as RHIA and RHIT. Coding specialists often pursue CCS or CCA and build expertise in ICD-10-CM/PCS, CPT, and payer rules. Informatics-focused roles may emphasize data standards (HL7 FHIR), EHR build, and quality reporting.",
          },
          {
            heading: "Privacy, Security & Compliance",
            content:
              "HIM professionals operationalize HIPAA minimum necessary standards, authorization workflows, breach analysis, release of information, and audit responses. Risk analysis, security rule safeguards, and policy management intersect with IT and legal teams—creating hybrid compliance career ladders.",
          },
          {
            heading: "Revenue Cycle & Data Integrity",
            content:
              "Accurate documentation, coder–clinician collaboration, CDI programs, and denial management protect revenue integrity. HIM leads DRG/APC accuracy initiatives, registry abstraction, and clinical documentation improvement that ties clinical facts to coded data.",
          },
          {
            heading: "Salary Outlook & Career Paths",
            content:
              "Roles span acute hospitals, payers, vendors, consulting, and public health. Compensation varies by credential, setting, and geography. Growth areas include clinical informatics, analytics, privacy officer tracks, and data quality leadership for value-based care programs.",
          },
        ],
        faqs: [
          { q: "What is the difference between RHIA and RHIT?", a: "RHIA aligns with baccalaureate-level HIM leadership curricula; RHIT historically aligns with associate-level programs—verify current AHIMA eligibility requirements for your program." },
          { q: "Is HIM only about medical coding?", a: "No—HIM spans data integrity, privacy, release of information, informatics, analytics, and compliance in addition to coding." },
          { q: "Are remote HIM jobs available?", a: "Many coding, ROI, audit, and informatics roles support remote or hybrid models depending on employer policies." },
        ],
      },
    },
  };

  return contentMap[profession]?.[pageType] ?? null;
}

function FAQSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3" data-testid="faq-section">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-${i}`}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-800 text-sm pr-4">{faq.q}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function UnderservedSEOPage({ profession, pageType }: UnderservedSEOPageProps) {
  const { t } = useI18n();
  const cfg = PROFESSION_CONFIG[profession];
  const content = getPageContent(profession, pageType);

  if (!content) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.underservedSeoPages.pageNotFound")}</h1>
        <p className="text-gray-600">{t("allied.underservedSeoPages.thisPageDoesntExistYet")}</p>
        <Link href={`/${profession}`} className="inline-block mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back">
          Back to {cfg.shortName}
        </Link>
      </div>
    );
  }

  const canonicalPath = `/${profession}-${pageType}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": content.h1,
    "description": content.metaDesc,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "NurseNest Allied",
      "sameAs": "https://www.nursenest.ca/allied-health",
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT10W",
    },
  };

  const ProfIcon = cfg.Icon;

  return (
    <>
      <AlliedSEO
        title={content.title}
        description={content.metaDesc}
        keywords={content.keywords}
        canonicalPath={canonicalPath}
        structuredData={courseSchema}
        additionalStructuredData={[faqSchema]}
      />
      <div className="max-w-5xl mx-auto px-4" data-testid={`seo-page-${profession}-${pageType}`}>
        <section className="py-16 text-center" data-testid="seo-hero">
          <div className="flex items-center justify-center gap-2 text-sm font-medium mb-4" style={{ color: cfg.color }}>
            <ProfIcon className="w-4 h-4" />
            <span>{cfg.label}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="seo-h1">
            {content.h1}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            {content.heroSub}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={cfg.dashboardPath} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold transition-colors shadow-lg" style={{ backgroundColor: cfg.color }} data-testid="cta-start-studying">
              Start Studying Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white border rounded-xl font-semibold transition-colors" style={{ color: cfg.color, borderColor: cfg.color + "40" }} data-testid="cta-view-plans">
              View Plans
            </Link>
          </div>
        </section>

        <section className="py-8" data-testid="feature-badges">
          <div className="flex flex-wrap justify-center gap-3">
            {cfg.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: cfg.colorAccent, color: cfg.color }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {feat}
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 space-y-10" data-testid="seo-content-sections">
          {content.sections.map((sec, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-8" data-testid={`section-${i}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{sec.heading}</h2>
              <p className="text-gray-600 leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </section>

        <section className="py-12" data-testid="domains-covered">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("allied.underservedSeoPages.topicsCovered")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cfg.domains.map((domain, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg" data-testid={`domain-badge-${i}`}>
                <Target className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
                <span className="text-sm text-gray-700">{domain}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12" data-testid="internal-links">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Explore {cfg.shortName} Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href={cfg.qbankPath} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-center" data-testid="link-qbank">
              <Target className="w-6 h-6 mx-auto mb-2" style={{ color: cfg.color }} />
              <div className="text-sm font-medium text-gray-800">{t("allied.underservedSeoPages.testBank")}</div>
              <div className="text-xs text-gray-500 mt-1">{t("allied.underservedSeoPages.practiceQuestions")}</div>
            </Link>
            <Link href={cfg.mockExamsPath} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-center" data-testid="link-mock-exams">
              <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">{t("allied.underservedSeoPages.mockExams")}</div>
              <div className="text-xs text-gray-500 mt-1">{t("allied.underservedSeoPages.fulllengthPracticeTests")}</div>
            </Link>
            <Link href={cfg.flashcardsPath} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-center" data-testid="link-flashcards">
              <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">{t("allied.underservedSeoPages.flashcards")}</div>
              <div className="text-xs text-gray-500 mt-1">{t("allied.underservedSeoPages.spacedRepetitionCards")}</div>
            </Link>
            <Link href={`/${profession}`} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-center" data-testid="link-career-hub">
              <GraduationCap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">{t("allied.underservedSeoPages.careerHub")}</div>
              <div className="text-xs text-gray-500 mt-1">{t("allied.underservedSeoPages.careerInformation")}</div>
            </Link>
          </div>
        </section>

        {pageType !== "practice-questions" && (
          <section className="py-12" data-testid="related-pages">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("allied.underservedSeoPages.relatedStudyResources")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pageType !== "exam-prep" && (
                <Link href={`/${profession}-exam-prep`} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="link-exam-prep">
                  <div className="text-sm font-semibold text-gray-800 mb-1">{t("allied.underservedSeoPages.examPrepGuide")}</div>
                  <div className="text-xs text-gray-500">{t("allied.underservedSeoPages.completeExamPreparationOverview")}</div>
                </Link>
              )}
              {pageType !== "career-guide" && (
                <Link href={`/${profession}-career-guide`} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="link-career-guide">
                  <div className="text-sm font-semibold text-gray-800 mb-1">{t("allied.underservedSeoPages.careerGuide")}</div>
                  <div className="text-xs text-gray-500">{t("allied.underservedSeoPages.educationLicensingSalary")}</div>
                </Link>
              )}
              {pageType !== "study-guide" && (
                <Link href={`/${profession}-study-guide`} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="link-study-guide">
                  <div className="text-sm font-semibold text-gray-800 mb-1">{t("allied.underservedSeoPages.studyGuide")}</div>
                  <div className="text-xs text-gray-500">{t("allied.underservedSeoPages.examBlueprintStudyStrategies")}</div>
                </Link>
              )}
            </div>
          </section>
        )}

        {pageType === "practice-questions" && (
          <section className="py-12" data-testid="related-pages">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("allied.underservedSeoPages.continueYourPreparation")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href={`/${profession}-exam-prep`} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="link-exam-prep">
                <div className="text-sm font-semibold text-gray-800 mb-1">{t("allied.underservedSeoPages.fullExamPrep")}</div>
                <div className="text-xs text-gray-500">{t("allied.underservedSeoPages.completeCertificationStudyPlatform")}</div>
              </Link>
              <Link href={`/${profession}-study-guide`} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="link-study-guide">
                <div className="text-sm font-semibold text-gray-800 mb-1">{t("allied.underservedSeoPages.studyGuide2")}</div>
                <div className="text-xs text-gray-500">{t("allied.underservedSeoPages.examBlueprintStudyStrategies2")}</div>
              </Link>
              <Link href={`/${profession}-career-guide`} className="p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="link-career-guide">
                <div className="text-sm font-semibold text-gray-800 mb-1">{t("allied.underservedSeoPages.careerGuide2")}</div>
                <div className="text-xs text-gray-500">{t("allied.underservedSeoPages.educationLicensingSalaryInfo")}</div>
              </Link>
            </div>
          </section>
        )}

        <section className="py-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("allied.underservedSeoPages.frequentlyAskedQuestions")}</h2>
          <FAQSection faqs={content.faqs} />
        </section>

        <section className="py-12 text-center" data-testid="seo-bottom-cta">
          <div className="rounded-2xl border p-10" style={{ backgroundColor: cfg.colorAccent + "40", borderColor: cfg.color + "20" }}>
            <Award className="w-12 h-12 mx-auto mb-4" style={{ color: cfg.color }} />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Pass Your {cfg.shortName} Certification?</h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Join thousands of {cfg.shortName.toLowerCase()} students using NurseNest to prepare for their certification exam with confidence.
            </p>
            <Link href={cfg.dashboardPath} className="inline-flex items-center gap-2 px-8 py-3 text-white rounded-xl font-semibold transition-colors shadow-lg" style={{ backgroundColor: cfg.color }} data-testid="cta-bottom">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export function OTQuestionBankPage() {
  return <UnderservedSEOPage profession="occupational-therapy" pageType="practice-questions" />;
}

export function OTMockExamsPage() {
  return <UnderservedSEOPage profession="occupational-therapy" pageType="exam-prep" />;
}

export function OTStudyPlanPage() {
  return <UnderservedSEOPage profession="occupational-therapy" pageType="study-guide" />;
}
