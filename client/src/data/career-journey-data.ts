import type { CareerConfig } from "@shared/careers";
import { CAREER_CONFIGS } from "@shared/careers";

export interface JourneyStep {
  id: string;
  number: number;
  title: string;
  description: string;
  platform: "nursenest" | "newgrad" | "applynest";
  links: { label: string; href: string }[];
  icon: string;
  color: string;
}

export interface JourneyConfig {
  slug: string;
  professionName: string;
  shortName: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  steps: JourneyStep[];
}

function buildNursingJourney(): JourneyConfig {
  return {
    slug: "nursing",
    professionName: "Registered Nurse",
    shortName: "RN",
    tagline: "From Student to Confident RN",
    heroTitle: "Your Path to Becoming a Registered Nurse",
    heroDescription: "Follow the complete journey from nursing school exam prep through licensure, new grad transition, and career launch. Every step links to the tools and resources you need.",
    seoTitle: "Become an RN - Your Complete Nursing Career Path | NurseNest",
    seoDescription: "Step-by-step guide to becoming a registered nurse. From NCLEX-RN exam prep to new grad transition and career launch. Practice questions, clinical tools, resume builder, and interview prep.",
    seoKeywords: "become an RN, nursing career path, NCLEX-RN journey, new grad nurse, nursing career guide, RN career steps",
    steps: [
      {
        id: "exam-prep",
        number: 1,
        title: "Master Your Exam Content",
        description: "Build a strong clinical foundation with lessons, flashcards, and question banks aligned to the NCLEX-RN test plan. Cover all body systems and nursing domains.",
        platform: "nursenest",
        icon: "BookOpen",
        color: "blue",
        links: [
          { label: "Browse NCLEX-RN Lessons", href: "/lessons?tier=rn" },
          { label: "RN Test Bank", href: "/free-practice" },
          { label: "Pharmacology Flashcards", href: "/flashcards" },
          { label: "Clinical Simulations", href: "/case-simulations" },
        ],
      },
      {
        id: "pass-exam",
        number: 2,
        title: "Pass Your Licensing Exam",
        description: "Test your readiness with full-length adaptive mock exams, track your performance by domain, and identify weak areas before exam day.",
        platform: "nursenest",
        icon: "Target",
        color: "emerald",
        links: [
          { label: "NCLEX-RN Study Hub", href: "/nclex-rn" },
          { label: "Mock Exam Simulator", href: "/nclex-rn/mock-exam" },
          { label: "Study Plan", href: "/study-plan" },
          { label: "Performance Dashboard", href: "/dashboard" },
        ],
      },
      {
        id: "transition",
        number: 3,
        title: "Navigate Your New Grad Transition",
        description: "Prepare for your first year with clinical confidence builders, unit-specific guides, and orientation survival tools designed for new graduate nurses.",
        platform: "newgrad",
        icon: "GraduationCap",
        color: "indigo",
        links: [
          { label: "New Grad Nursing Hub", href: "/new-grad/nursing" },
          { label: "First 90 Days Roadmap", href: "/new-grad#first-90-days" },
          { label: "Clinical Skills Guides", href: "/clinical-skills" },
          { label: "Clinical Confidence Builder", href: "/new-grad#clinical-confidence" },
        ],
      },
      {
        id: "career-launch",
        number: 4,
        title: "Land Your First Nursing Job",
        description: "Stand out in a competitive job market with ATS-optimized resume templates, STAR framework interview prep, and cover letter generators built for healthcare.",
        platform: "applynest",
        icon: "Briefcase",
        color: "purple",
        links: [
          { label: "Interview Prep Lab", href: "/new-grad#interview-lab" },
          { label: "Resume Builder", href: "/new-grad#resume-builder" },
          { label: "Cover Letter Generator", href: "/new-grad#cover-letter" },
          { label: "New Grad Hub", href: "/new-grad" },
        ],
      },
    ],
  };
}

function buildRpnJourney(): JourneyConfig {
  return {
    slug: "rpn",
    professionName: "Registered Practical Nurse",
    shortName: "RPN/LVN",
    tagline: "From Student to Licensed Practical Nurse",
    heroTitle: "Your Path to Becoming an RPN/LVN",
    heroDescription: "Follow the step-by-step journey from practical nursing exam prep through licensure, new grad transition, and your first job. Every resource you need, in order.",
    seoTitle: "Become an RPN/LVN - Practical Nursing Career Path | NurseNest",
    seoDescription: "Step-by-step guide to becoming a registered practical nurse or licensed vocational nurse. REx-PN and NCLEX-PN exam prep, new grad transition tools, and career resources.",
    seoKeywords: "become an RPN, become an LVN, practical nursing career path, REx-PN journey, NCLEX-PN career guide",
    steps: [
      {
        id: "exam-prep",
        number: 1,
        title: "Build Your Foundations",
        description: "Study with RPN-scope lessons, medication safety drills, and foundational care content matched to your practical nursing exam blueprint.",
        platform: "nursenest",
        icon: "BookOpen",
        color: "blue",
        links: [
          { label: "RPN Lessons", href: "/lessons?tier=rpn" },
          { label: "Practice Questions", href: "/free-practice" },
          { label: "Flashcards", href: "/flashcards" },
          { label: "Med Math Practice", href: "/med-math" },
        ],
      },
      {
        id: "pass-exam",
        number: 2,
        title: "Pass the REx-PN / NCLEX-PN",
        description: "Take full-length adaptive mock exams aligned to your exam framework. Track your readiness across competency domains and target weak areas.",
        platform: "nursenest",
        icon: "Target",
        color: "emerald",
        links: [
          { label: "REx-PN Study Hub", href: "/rex-pn" },
          { label: "NCLEX-PN Study Hub", href: "/nclex-pn" },
          { label: "Mock Exam Simulator", href: "/rex-pn/mock-exam" },
          { label: "Performance Dashboard", href: "/dashboard" },
        ],
      },
      {
        id: "transition",
        number: 3,
        title: "Thrive in Your First Year",
        description: "Navigate orientation with unit-specific guides, clinical quick-reference tools, and a week-by-week first-year roadmap.",
        platform: "newgrad",
        icon: "GraduationCap",
        color: "indigo",
        links: [
          { label: "New Grad Nursing Hub", href: "/new-grad/nursing" },
          { label: "First 90 Days Guide", href: "/new-grad#first-90-days" },
          { label: "Clinical Skills", href: "/clinical-skills" },
        ],
      },
      {
        id: "career-launch",
        number: 4,
        title: "Launch Your Nursing Career",
        description: "Create a standout resume, prepare for behavioral interviews, and build cover letters tailored to practical nursing positions.",
        platform: "applynest",
        icon: "Briefcase",
        color: "purple",
        links: [
          { label: "Interview Prep", href: "/new-grad#interview-lab" },
          { label: "Resume Builder", href: "/new-grad#resume-builder" },
          { label: "New Grad Hub", href: "/new-grad" },
        ],
      },
    ],
  };
}

function buildProfessionJourney(
  slug: string,
  config: CareerConfig,
  newGradSlug: string,
  examHubHref: string,
  mockExamHref: string,
): JourneyConfig {
  return {
    slug,
    professionName: config.name,
    shortName: config.shortName,
    tagline: `From Student to ${config.shortName} Professional`,
    heroTitle: `Your Path to Becoming a ${config.shortName}`,
    heroDescription: `Follow the complete journey from ${config.shortName} exam prep through certification, new grad transition, and career launch. Step-by-step resources for every stage.`,
    seoTitle: `Become a ${config.shortName} - Complete ${config.name} Career Path | NurseNest`,
    seoDescription: `Step-by-step guide to becoming a ${config.shortName}. ${config.examNames.join(", ")} exam prep, new grad transition tools, clinical guides, and career resources.`,
    seoKeywords: `become a ${config.shortName}, ${config.name} career path, ${config.examNames[0]} journey, new grad ${config.shortName}, ${config.name} career guide`,
    steps: [
      {
        id: "exam-prep",
        number: 1,
        title: "Master Your Exam Content",
        description: `Build expertise across ${config.domains.slice(0, 4).join(", ")}, and more. Study with ${config.shortName}-specific lessons, flashcards, and question banks.`,
        platform: "nursenest",
        icon: "BookOpen",
        color: "blue",
        links: [
          { label: `${config.shortName} Lessons`, href: `${config.routePrefix}/question-bank` },
          { label: "Practice Questions", href: `${config.routePrefix}/question-bank` },
          { label: "Flashcards", href: `${config.routePrefix}/flashcards` },
        ],
      },
      {
        id: "pass-exam",
        number: 2,
        title: `Pass the ${config.examNames[0]}`,
        description: `Take full-length mock exams aligned to the ${config.examNames[0]} blueprint. Track your performance and identify weak areas before test day.`,
        platform: "nursenest",
        icon: "Target",
        color: "emerald",
        links: [
          { label: `${config.shortName} Study Hub`, href: examHubHref },
          { label: "Mock Exams", href: mockExamHref },
          { label: "Study Plan", href: `${config.routePrefix}/study-plan` },
        ],
      },
      {
        id: "transition",
        number: 3,
        title: "Navigate Your New Grad Transition",
        description: `Prepare for your first year with clinical confidence tools, survival guides, and orientation resources designed for new graduate ${config.shortName} professionals.`,
        platform: "newgrad",
        icon: "GraduationCap",
        color: "indigo",
        links: [
          { label: `New Grad ${config.shortName} Hub`, href: `/new-grad/${newGradSlug}` },
          { label: "First Year Guide", href: `/new-grad/${newGradSlug}` },
        ],
      },
      {
        id: "career-launch",
        number: 4,
        title: `Land Your First ${config.shortName} Job`,
        description: "Build a healthcare-optimized resume, prepare for interviews with STAR framework answers, and access career development resources.",
        platform: "applynest",
        icon: "Briefcase",
        color: "purple",
        links: [
          { label: "Interview Prep", href: "/new-grad#interview-lab" },
          { label: "Resume Builder", href: "/new-grad#resume-builder" },
          { label: "Career Resources", href: "/new-grad" },
        ],
      },
    ],
  };
}

export const JOURNEY_CONFIGS: Record<string, JourneyConfig> = {
  nursing: buildNursingJourney(),
  rpn: buildRpnJourney(),
  paramedic: buildProfessionJourney(
    "paramedic",
    CAREER_CONFIGS.paramedic,
    "paramedic",
    "/paramedic",
    "/paramedic/mock-exams",
  ),
  rrt: buildProfessionJourney(
    "rrt",
    CAREER_CONFIGS.rrt,
    "respiratory-therapy",
    "/rrt",
    "/rrt/mock-exams",
  ),
  mlt: buildProfessionJourney(
    "mlt",
    CAREER_CONFIGS.mlt,
    "mlt",
    "/mlt",
    "/mlt/mock-exams",
  ),
  imaging: buildProfessionJourney(
    "imaging",
    CAREER_CONFIGS.imaging,
    "imaging",
    "/imaging",
    "/imaging/mock-exams",
  ),
  "pharmacy-tech": buildProfessionJourney(
    "pharmacy-tech",
    CAREER_CONFIGS.pharmacyTech,
    "pharmacy-tech",
    "/pharmacy-tech",
    "/pharmacy-tech/mock-exams",
  ),
  "occupational-therapy": buildProfessionJourney(
    "occupational-therapy",
    CAREER_CONFIGS.occupationalTherapy,
    "occupational-therapy",
    "/occupational-therapy",
    "/occupational-therapy/mock-exams",
  ),
};

export const GENERIC_JOURNEY: JourneyConfig = {
  slug: "healthcare",
  professionName: "Healthcare Professional",
  shortName: "Healthcare",
  tagline: "From Student to Licensed Professional",
  heroTitle: "Your Healthcare Career Path",
  heroDescription: "See the full journey from exam preparation to career launch. Whether you're studying for your licensing exam, transitioning to your first job, or building your professional career — NurseNest connects every step.",
  seoTitle: "Your Healthcare Career Path - Student to Professional Journey | NurseNest",
  seoDescription: "Follow the complete healthcare career journey: exam prep, licensure, new grad transition, and career launch. NurseNest connects every stage with the right tools and resources.",
  seoKeywords: "healthcare career path, nursing career journey, healthcare career guide, exam prep to career, student to professional, healthcare career steps",
  steps: [
    {
      id: "exam-prep",
      number: 1,
      title: "Master Your Exam Content",
      description: "Build a strong clinical foundation with profession-specific lessons, practice questions, flashcards, and clinical simulations. Study at the right depth for your exam.",
      platform: "nursenest",
      icon: "BookOpen",
      color: "blue",
      links: [
        { label: "Browse All Lessons", href: "/lessons" },
        { label: "Test Bank", href: "/free-practice" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "Clinical Simulations", href: "/case-simulations" },
      ],
    },
    {
      id: "pass-exam",
      number: 2,
      title: "Pass Your Licensing Exam",
      description: "Test your readiness with full-length mock exams, adaptive practice tests, and domain-level performance tracking. Know exactly when you're ready.",
      platform: "nursenest",
      icon: "Target",
      color: "emerald",
      links: [
        { label: "Mock Exams", href: "/mock-exams" },
        { label: "Study Plan", href: "/study-plan" },
        { label: "Performance Dashboard", href: "/dashboard" },
        { label: "Exam Hubs", href: "/nclex-rn" },
      ],
    },
    {
      id: "transition",
      number: 3,
      title: "Navigate Your New Grad Transition",
      description: "Prepare for your first year with profession-specific guides, clinical confidence tools, unit-specific resources, and orientation survival checklists.",
      platform: "newgrad",
      icon: "GraduationCap",
      color: "indigo",
      links: [
        { label: "New Grad Hub", href: "/new-grad" },
        { label: "First Year Guides", href: "/new-grad" },
        { label: "Clinical Skills", href: "/clinical-skills" },
      ],
    },
    {
      id: "career-launch",
      number: 4,
      title: "Land Your First Healthcare Job",
      description: "Stand out with ATS-optimized resume templates, STAR framework interview prep, tailored cover letters, and career coaching tools.",
      platform: "applynest",
      icon: "Briefcase",
      color: "purple",
      links: [
        { label: "Interview Prep Lab", href: "/new-grad#interview-lab" },
        { label: "Resume Builder", href: "/new-grad#resume-builder" },
        { label: "Cover Letter Generator", href: "/new-grad#cover-letter" },
        { label: "Career Resources", href: "/new-grad" },
      ],
    },
  ],
};

export function getJourneyConfig(slug: string): JourneyConfig | undefined {
  return JOURNEY_CONFIGS[slug];
}

export function getAllJourneySlugs(): string[] {
  return Object.keys(JOURNEY_CONFIGS);
}
