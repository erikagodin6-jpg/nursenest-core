import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

const ARTICLE_TEMPLATES = [
  {
    templateKey: "how-to-become",
    displayName: "How to Become a [Profession]",
    description: "Comprehensive career guide covering education, certifications, and steps to enter the profession.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "overview", heading: "Career Overview", type: "text" },
      { key: "education", heading: "Education & Training Requirements", type: "text" },
      { key: "certification", heading: "Certification & Licensing", type: "text" },
      { key: "skills", heading: "Essential Skills & Knowledge", type: "text" },
      { key: "career-outlook", heading: "Career Outlook & Job Market", type: "text" },
      { key: "study-strategies", heading: "Study Strategies for Success", type: "text" },
      { key: "nursenest-tools", heading: "NurseNest Study Tools", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a comprehensive 'How to Become' career guide. Cover the full path from education requirements to certification, including prerequisite courses, degree programs, clinical rotations, and licensing exams. Include salary expectations and job outlook data. Emphasize practical steps a student can take today.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "salary-guide",
    displayName: "Salary Guide for [Profession]",
    description: "Detailed salary breakdown by experience, location, specialty, and certifications.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "overview", heading: "Salary Overview", type: "text" },
      { key: "by-experience", heading: "Salary by Experience Level", type: "text" },
      { key: "by-location", heading: "Salary by Location", type: "text" },
      { key: "by-specialty", heading: "Salary by Specialty", type: "text" },
      { key: "certifications-impact", heading: "How Certifications Affect Salary", type: "text" },
      { key: "negotiation-tips", heading: "Salary Negotiation Tips", type: "text" },
      { key: "nursenest-tools", heading: "Prepare with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a detailed salary guide with real salary ranges by experience level (entry, mid, senior), geographic region (US states/provinces), and specialty areas. Include factors that increase earning potential such as certifications, advanced degrees, and high-demand settings.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "certification-guide",
    displayName: "Certification Guide for [Profession]",
    description: "Complete guide to professional certification exams, eligibility, and preparation strategies.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "overview", heading: "Certification Overview", type: "text" },
      { key: "eligibility", heading: "Eligibility Requirements", type: "text" },
      { key: "exam-format", heading: "Exam Format & Structure", type: "text" },
      { key: "content-domains", heading: "Content Domains & Blueprint", type: "text" },
      { key: "study-strategies", heading: "Study Strategies & Timeline", type: "text" },
      { key: "practice-resources", heading: "Practice Resources", type: "text" },
      { key: "nursenest-tools", heading: "Study with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a comprehensive certification exam guide. Cover the specific certification body, exam eligibility, application process, exam blueprint/content domains, question format, passing score, and recertification requirements. Provide a realistic study timeline and strategies.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "exam-prep-tips",
    displayName: "Exam Prep Tips for [Profession]",
    description: "Targeted exam preparation strategies, study schedules, and test-day tips.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "overview", heading: "Exam Overview", type: "text" },
      { key: "study-schedule", heading: "Recommended Study Schedule", type: "text" },
      { key: "high-yield-topics", heading: "High-Yield Topics to Focus On", type: "text" },
      { key: "study-techniques", heading: "Effective Study Techniques", type: "text" },
      { key: "common-mistakes", heading: "Common Mistakes to Avoid", type: "text" },
      { key: "test-day-tips", heading: "Test Day Tips", type: "text" },
      { key: "nursenest-tools", heading: "Practice with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write actionable exam preparation tips specific to this profession's certification exam. Include a week-by-week study schedule, high-yield topics based on the exam blueprint, proven study techniques (active recall, spaced repetition, practice testing), and test-day strategies.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "day-in-the-life",
    displayName: "A Day in the Life of a [Profession]",
    description: "Realistic overview of daily responsibilities, work environments, and career satisfaction.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "morning-routine", heading: "Morning Routine & Start of Shift", type: "text" },
      { key: "core-responsibilities", heading: "Core Daily Responsibilities", type: "text" },
      { key: "work-environment", heading: "Work Environment & Settings", type: "text" },
      { key: "challenges", heading: "Challenges & Rewards", type: "text" },
      { key: "career-satisfaction", heading: "Career Satisfaction & Growth", type: "text" },
      { key: "advice", heading: "Advice from Experienced Professionals", type: "text" },
      { key: "nursenest-tools", heading: "Start Your Journey with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a vivid, realistic 'day in the life' article. Describe typical daily activities, patient interactions, documentation tasks, and teamwork. Cover different work settings (hospitals, clinics, labs, etc.). Include both challenges and rewarding aspects to give a balanced view.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "scope-of-practice",
    displayName: "Scope of Practice for [Profession]",
    description: "Detailed breakdown of legal scope, permitted procedures, and state/provincial variations.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "overview", heading: "Scope of Practice Overview", type: "text" },
      { key: "permitted-procedures", heading: "Permitted Procedures & Activities", type: "text" },
      { key: "supervision", heading: "Supervision Requirements", type: "text" },
      { key: "state-variations", heading: "State & Provincial Variations", type: "text" },
      { key: "legal-considerations", heading: "Legal Considerations", type: "text" },
      { key: "advancement", heading: "Expanding Your Scope", type: "text" },
      { key: "nursenest-tools", heading: "Study with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a detailed scope of practice guide. Cover what procedures and activities are legally permitted, supervision requirements, state-by-state or province-by-province variations, common misconceptions, and how scope may expand with additional certifications or experience.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "skills-competencies",
    displayName: "Essential Skills & Competencies for [Profession]",
    description: "Core clinical and soft skills needed for success in the profession.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "clinical-skills", heading: "Core Clinical Skills", type: "text" },
      { key: "technical-skills", heading: "Technical & Equipment Skills", type: "text" },
      { key: "soft-skills", heading: "Communication & Soft Skills", type: "text" },
      { key: "critical-thinking", heading: "Critical Thinking & Problem Solving", type: "text" },
      { key: "developing-skills", heading: "How to Develop These Skills", type: "text" },
      { key: "assessment", heading: "Self-Assessment Checklist", type: "text" },
      { key: "nursenest-tools", heading: "Build Skills with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a comprehensive skills and competencies guide. Cover clinical/technical skills specific to the profession, communication skills, critical thinking, and documentation skills. Include practical ways to develop and demonstrate each skill, especially for students and new graduates.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "continuing-education",
    displayName: "Continuing Education Guide for [Profession]",
    description: "CE requirements, renewal timelines, and professional development opportunities.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "requirements", heading: "CE Requirements by Certification", type: "text" },
      { key: "renewal-timeline", heading: "Renewal Timeline & Deadlines", type: "text" },
      { key: "approved-providers", heading: "Approved CE Providers", type: "text" },
      { key: "specialization", heading: "Specialization & Advanced Certifications", type: "text" },
      { key: "online-options", heading: "Online CE Options", type: "text" },
      { key: "tracking", heading: "Tracking & Documentation", type: "text" },
      { key: "nursenest-tools", heading: "Learn with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a practical continuing education guide. Cover specific CE credit requirements for the profession's certification(s), renewal cycles, approved provider organizations, online vs in-person options, specialty-specific CE opportunities, and tips for tracking credits.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "career-advancement",
    displayName: "Career Advancement Paths for [Profession]",
    description: "Growth opportunities, specializations, and leadership pathways.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "advancement-paths", heading: "Career Advancement Paths", type: "text" },
      { key: "specializations", heading: "Specialization Options", type: "text" },
      { key: "leadership", heading: "Leadership & Management Roles", type: "text" },
      { key: "education-pathways", heading: "Advanced Education Pathways", type: "text" },
      { key: "salary-growth", heading: "Salary Growth Potential", type: "text" },
      { key: "action-plan", heading: "Your Career Advancement Action Plan", type: "text" },
      { key: "nursenest-tools", heading: "Advance with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a career advancement guide covering vertical and lateral growth opportunities. Include specialization options, management tracks, advanced degrees, additional certifications that unlock new roles, and realistic timelines for career progression.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "clinical-procedures",
    displayName: "Key Clinical Procedures for [Profession]",
    description: "Step-by-step guides for essential clinical procedures and protocols.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "overview", heading: "Procedures Overview", type: "text" },
      { key: "safety-protocols", heading: "Safety Protocols & Standards", type: "text" },
      { key: "core-procedures", heading: "Core Procedures Step-by-Step", type: "text" },
      { key: "documentation", heading: "Documentation Requirements", type: "text" },
      { key: "common-errors", heading: "Common Errors & How to Avoid Them", type: "text" },
      { key: "exam-relevance", heading: "Exam-Relevant Procedure Knowledge", type: "text" },
      { key: "nursenest-tools", heading: "Practice with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write detailed clinical procedure guides specific to this profession. Cover the most important procedures students must know, including step-by-step instructions, safety protocols, patient preparation, documentation, and common errors. Emphasize exam-relevant procedure knowledge.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "job-search-guide",
    displayName: "Job Search Guide for [Profession]",
    description: "Job hunting strategies, resume tips, interview prep, and workplace evaluation.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "job-market", heading: "Current Job Market Overview", type: "text" },
      { key: "resume-tips", heading: "Resume & Cover Letter Tips", type: "text" },
      { key: "interview-prep", heading: "Interview Preparation", type: "text" },
      { key: "work-settings", heading: "Work Settings & Employers", type: "text" },
      { key: "evaluating-offers", heading: "Evaluating Job Offers", type: "text" },
      { key: "first-job-tips", heading: "First Job Success Tips", type: "text" },
      { key: "nursenest-tools", heading: "Prepare with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a practical job search guide for new graduates and career changers. Cover where to find job openings, resume and cover letter tips specific to this profession, common interview questions, evaluating different work settings and employers, and tips for success in the first job.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "state-requirements",
    displayName: "State-by-State Requirements for [Profession]",
    description: "Licensing requirements, reciprocity agreements, and state-specific regulations.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "overview", heading: "Licensing Overview", type: "text" },
      { key: "common-requirements", heading: "Common Requirements Across States", type: "text" },
      { key: "state-variations", heading: "Key State-by-State Variations", type: "text" },
      { key: "reciprocity", heading: "Reciprocity & Compact Agreements", type: "text" },
      { key: "application-process", heading: "Application Process", type: "text" },
      { key: "tips", heading: "Tips for Multi-State Practice", type: "text" },
      { key: "nursenest-tools", heading: "Study with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a comprehensive state-by-state licensing requirements guide. Cover common requirements, notable state-specific variations, reciprocity or compact agreements, application processes, fees, and tips for professionals who want to practice in multiple states.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "study-resources",
    displayName: "Best Study Resources for [Profession]",
    description: "Curated list of textbooks, online courses, practice exams, and study tools.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "textbooks", heading: "Recommended Textbooks", type: "text" },
      { key: "online-courses", heading: "Online Courses & Programs", type: "text" },
      { key: "practice-exams", heading: "Practice Exams & Question Banks", type: "text" },
      { key: "flashcards", heading: "Flashcard Resources", type: "text" },
      { key: "study-apps", heading: "Study Apps & Tools", type: "text" },
      { key: "study-plan", heading: "Creating an Effective Study Plan", type: "text" },
      { key: "nursenest-tools", heading: "Study with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a comprehensive study resources guide. Cover the best textbooks, online courses, practice exams, flashcard tools, and mobile apps for this profession's certification exam. Include free and paid options, and explain why each resource is valuable for exam preparation.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "professional-organizations",
    displayName: "Professional Organizations for [Profession]",
    description: "Key professional associations, membership benefits, and networking opportunities.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "major-orgs", heading: "Major Professional Organizations", type: "text" },
      { key: "membership-benefits", heading: "Membership Benefits", type: "text" },
      { key: "student-memberships", heading: "Student Memberships & Discounts", type: "text" },
      { key: "conferences", heading: "Conferences & Events", type: "text" },
      { key: "networking", heading: "Networking & Career Resources", type: "text" },
      { key: "getting-involved", heading: "Getting Involved", type: "text" },
      { key: "nursenest-tools", heading: "Learn with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a guide to professional organizations relevant to this profession. Cover the major national/international organizations, their missions, membership benefits (CE credits, publications, advocacy, job boards), student discounts, annual conferences, and how involvement can benefit one's career.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
  {
    templateKey: "vs-comparison",
    displayName: "[Profession A] vs [Profession B] Comparison",
    description: "Side-by-side comparison of two related allied health professions.",
    sectionStructure: [
      { key: "intro", heading: "Introduction", type: "text" },
      { key: "overview", heading: "At-a-Glance Comparison", type: "text" },
      { key: "education", heading: "Education & Training Comparison", type: "text" },
      { key: "scope", heading: "Scope of Practice Differences", type: "text" },
      { key: "salary", heading: "Salary & Benefits Comparison", type: "text" },
      { key: "job-outlook", heading: "Job Outlook & Demand", type: "text" },
      { key: "which-is-right", heading: "Which Career Is Right for You?", type: "text" },
      { key: "nursenest-tools", heading: "Explore with NurseNest", type: "cta" },
      { key: "faqs", heading: "Frequently Asked Questions", type: "faq" },
      { key: "related-links", heading: "Related Resources", type: "links" },
    ],
    promptInstructions: "Write a balanced comparison article between this profession and a closely related one. Compare education requirements, scope of practice, daily responsibilities, salary ranges, job outlook, and career advancement. Help readers decide which path suits them best.",
    defaultInternalLinkTargets: {
      hub: "/{professionSlug}",
      studyPathway: "/{professionSlug}/study-plan",
      questionBank: "/{professionSlug}/questions",
      flashcards: "/{professionSlug}/flashcards",
      mockExams: "/{professionSlug}/mock-exams",
      caseStudies: "/{professionSlug}/sims",
    },
  },
];

let templatesSeeded = false;

async function seedTemplates(): Promise<void> {
  if (templatesSeeded) return;
  try {
    const existing = await pool.query("SELECT COUNT(*)::int AS c FROM allied_article_templates");
    if (parseInt(existing.rows[0]?.c || "0") >= 15) {
      templatesSeeded = true;
      return;
    }

    for (const t of ARTICLE_TEMPLATES) {
      await pool.query(
        `INSERT INTO allied_article_templates (template_key, display_name, description, section_structure, prompt_instructions, default_internal_link_targets, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         ON CONFLICT (template_key) DO UPDATE SET
           display_name = EXCLUDED.display_name,
           description = EXCLUDED.description,
           section_structure = EXCLUDED.section_structure,
           prompt_instructions = EXCLUDED.prompt_instructions,
           default_internal_link_targets = EXCLUDED.default_internal_link_targets,
           updated_at = NOW()`,
        [
          t.templateKey,
          t.displayName,
          t.description,
          JSON.stringify(t.sectionStructure),
          t.promptInstructions,
          JSON.stringify(t.defaultInternalLinkTargets),
        ]
      );
    }
    templatesSeeded = true;
    console.log("[Allied Articles] 15 article templates seeded");
  } catch (err: any) {
    console.error("[Allied Articles] Seed error:", err.message);
  }
}

function generateArticleSlug(professionSlug: string, templateKey: string): string {
  return `${professionSlug}-${templateKey}`;
}

function buildInternalLinks(professionSlug: string, professionName: string, linkTargets: any): any[] {
  const links: any[] = [];
  const baseUrl = `https://www.nursenest.ca`;

  if (linkTargets.hub) {
    links.push({
      label: `${professionName} Hub`,
      url: `${baseUrl}${linkTargets.hub.replace("{professionSlug}", professionSlug)}`,
      context: "profession-hub",
    });
  }
  if (linkTargets.studyPathway) {
    links.push({
      label: `${professionName} Study Pathway`,
      url: `${baseUrl}${linkTargets.studyPathway.replace("{professionSlug}", professionSlug)}`,
      context: "study-pathway",
    });
  }
  if (linkTargets.questionBank) {
    links.push({
      label: `${professionName} Practice Questions`,
      url: `${baseUrl}${linkTargets.questionBank.replace("{professionSlug}", professionSlug)}`,
      context: "question-bank",
    });
  }
  if (linkTargets.flashcards) {
    links.push({
      label: `${professionName} Flashcards`,
      url: `${baseUrl}${linkTargets.flashcards.replace("{professionSlug}", professionSlug)}`,
      context: "flashcards",
    });
  }
  if (linkTargets.mockExams) {
    links.push({
      label: `${professionName} Mock Exams`,
      url: `${baseUrl}${linkTargets.mockExams.replace("{professionSlug}", professionSlug)}`,
      context: "mock-exams",
    });
  }
  if (linkTargets.caseStudies) {
    links.push({
      label: `${professionName} Case Studies`,
      url: `${baseUrl}${linkTargets.caseStudies.replace("{professionSlug}", professionSlug)}`,
      context: "case-studies",
    });
  }
  return links;
}

async function generateArticle(professionSlug: string, templateKey: string): Promise<any> {
  await seedTemplates();

  const profResult = await pool.query("SELECT * FROM professions WHERE slug = $1", [professionSlug]);
  const profession = profResult.rows[0];
  if (!profession) throw new Error(`Profession not found: ${professionSlug}`);

  const tplResult = await pool.query("SELECT * FROM allied_article_templates WHERE template_key = $1 AND is_active = true", [templateKey]);
  const template = tplResult.rows[0];
  if (!template) throw new Error(`Template not found or inactive: ${templateKey}`);

  const sectionStructure = template.section_structure || [];
  const linkTargets = template.default_internal_link_targets || {};
  const professionName = profession.name;
  const slug = generateArticleSlug(professionSlug, templateKey);

  const existingArticle = await pool.query("SELECT id FROM allied_health_articles WHERE slug = $1", [slug]);
  if (existingArticle.rows.length > 0) {
    throw new Error(`Article already exists for ${professionSlug} + ${templateKey}. Delete or update the existing article.`);
  }

  const internalLinks = buildInternalLinks(professionSlug, professionName, linkTargets);

  const sectionInstructions = sectionStructure
    .filter((s: any) => s.type !== "faq" && s.type !== "links")
    .map((s: any) => `- "${s.key}": heading "${s.heading}" (type: ${s.type})`)
    .join("\n");

  const openai = getOpenAI();

  const systemPrompt = `You are an expert allied health educator and SEO content strategist writing for NurseNest (www.nursenest.ca/allied-health).
You create comprehensive, evergreen, educational articles about allied health careers and certification exams.

${template.prompt_instructions}

IMPORTANT GUIDELINES:
- Write for the profession: ${professionName}
- Target audience: students, aspiring professionals, and current practitioners
- Tone: authoritative, educational, encouraging
- Length: 1800-2500 words across all sections combined
- Include specific, actionable information (not generic advice)
- Reference real certification bodies, exam names, and organizations
- All content must be factually accurate and current`;

  const userPrompt = `Generate a complete structured article for: "${template.display_name.replace("[Profession]", professionName)}"

Profession: ${professionName} (slug: ${professionSlug})
Exam Names: ${(profession.exam_names || []).join(", ") || "N/A"}

The article must have these content sections:
${sectionInstructions}

Return valid JSON with this exact structure:
{
  "title": "Full article title",
  "metaTitle": "SEO title (max 60 chars)",
  "metaDescription": "SEO meta description (max 155 chars)",
  "primaryKeyword": "main target keyword",
  "secondaryKeywords": ["keyword2", "keyword3", "keyword4", "keyword5"],
  "contentSections": [
    { "key": "section-key", "heading": "Section Heading", "body": "Full section content in HTML", "type": "text" }
  ],
  "faqItems": [
    { "question": "FAQ question?", "answer": "Detailed answer." }
  ],
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Article title",
    "description": "Article description",
    "author": { "@type": "Organization", "name": "NurseNest" },
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" }
  }
}

Requirements:
- contentSections: Generate one object for each section key listed above. The body should be rich HTML with <p>, <ul>, <ol>, <strong>, <em> tags.
- faqItems: Generate 5-8 unique, relevant FAQ items with detailed answers
- Ensure metaTitle is under 60 characters
- Ensure metaDescription is under 155 characters
- primaryKeyword should be a realistic, searchable term
- secondaryKeywords should be 4-6 related search terms`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 8000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content returned from AI generation");

  const parsed = JSON.parse(content);

  if (!parsed.title || typeof parsed.title !== "string") {
    throw new Error("AI output missing required 'title' field");
  }
  if (!Array.isArray(parsed.contentSections) || parsed.contentSections.length === 0) {
    throw new Error("AI output missing or empty 'contentSections' array");
  }
  for (const section of parsed.contentSections) {
    if (!section.key || !section.heading || typeof section.body !== "string") {
      throw new Error(`Invalid content section: missing key, heading, or body`);
    }
    section.body = section.body
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
      .replace(/on\w+\s*=\s*'[^']*'/gi, "");
  }
  if (!Array.isArray(parsed.faqItems)) {
    parsed.faqItems = [];
  }
  for (const faq of parsed.faqItems) {
    if (!faq.question || !faq.answer) {
      throw new Error("Invalid FAQ item: missing question or answer");
    }
  }

  const canonicalUrl = `https://www.nursenest.ca/allied-health/${professionSlug}/${slug}`;
  const breadcrumbItems = [
    { name: "Home", url: "https://www.nursenest.ca" },
    { name: professionName, url: `https://www.nursenest.ca/allied-health/${professionSlug}` },
    { name: parsed.title || template.display_name.replace("[Profession]", professionName), url: canonicalUrl },
  ];

  const result = await pool.query(
    `INSERT INTO allied_health_articles
     (profession_slug, article_type, title, slug, meta_title, meta_description, canonical_url,
      primary_keyword, secondary_keywords, content_sections, faq_items, internal_links,
      schema_markup_json, breadcrumb_items, status, country_scope)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'draft', 'ALL')
     RETURNING *`,
    [
      professionSlug,
      templateKey,
      parsed.title || template.display_name.replace("[Profession]", professionName),
      slug,
      parsed.metaTitle || null,
      parsed.metaDescription || null,
      canonicalUrl,
      parsed.primaryKeyword || null,
      parsed.secondaryKeywords || [],
      JSON.stringify(parsed.contentSections || []),
      JSON.stringify(parsed.faqItems || []),
      JSON.stringify(internalLinks),
      JSON.stringify(parsed.schemaMarkup || null),
      JSON.stringify(breadcrumbItems),
    ]
  );

  return snakeToCamel(result.rows[0]);
}

export function registerAlliedArticleRoutes(app: Express) {
  app.get("/api/admin/allied-article-templates", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      await seedTemplates();
      const result = await pool.query("SELECT * FROM allied_article_templates ORDER BY display_name ASC");
      res.json(result.rows.map(snakeToCamel));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/allied-article-templates/:key", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const result = await pool.query("SELECT * FROM allied_article_templates WHERE template_key = $1", [req.params.key]);
      if (!result.rows[0]) return res.status(404).json({ error: "Template not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/allied-article-templates", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { templateKey, displayName, description, sectionStructure, promptInstructions, defaultInternalLinkTargets } = req.body;
      if (!templateKey || !displayName) return res.status(400).json({ error: "templateKey and displayName are required" });

      const result = await pool.query(
        `INSERT INTO allied_article_templates (template_key, display_name, description, section_structure, prompt_instructions, default_internal_link_targets)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [templateKey, displayName, description || null, JSON.stringify(sectionStructure || []), promptInstructions || null, JSON.stringify(defaultInternalLinkTargets || {})]
      );
      res.json(snakeToCamel(result.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/allied-article-templates/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { id } = req.params;
      const { displayName, description, sectionStructure, promptInstructions, defaultInternalLinkTargets, isActive } = req.body;

      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (displayName !== undefined) { setClauses.push(`display_name = $${idx++}`); values.push(displayName); }
      if (description !== undefined) { setClauses.push(`description = $${idx++}`); values.push(description); }
      if (sectionStructure !== undefined) { setClauses.push(`section_structure = $${idx++}`); values.push(JSON.stringify(sectionStructure)); }
      if (promptInstructions !== undefined) { setClauses.push(`prompt_instructions = $${idx++}`); values.push(promptInstructions); }
      if (defaultInternalLinkTargets !== undefined) { setClauses.push(`default_internal_link_targets = $${idx++}`); values.push(JSON.stringify(defaultInternalLinkTargets)); }
      if (isActive !== undefined) { setClauses.push(`is_active = $${idx++}`); values.push(isActive); }

      if (setClauses.length === 0) return res.status(400).json({ error: "No fields to update" });

      setClauses.push(`updated_at = NOW()`);
      values.push(id);

      const result = await pool.query(
        `UPDATE allied_article_templates SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
        values
      );
      if (!result.rows[0]) return res.status(404).json({ error: "Template not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/allied-articles", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { profession, type, status } = req.query;
      let query = "SELECT * FROM allied_health_articles WHERE 1=1";
      const params: any[] = [];
      let idx = 1;

      if (profession) { query += ` AND profession_slug = $${idx++}`; params.push(profession); }
      if (type) { query += ` AND article_type = $${idx++}`; params.push(type); }
      if (status) { query += ` AND status = $${idx++}`; params.push(status); }
      query += " ORDER BY created_at DESC";

      const result = await pool.query(query, params);
      res.json(result.rows.map(snakeToCamel));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/allied-articles/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const result = await pool.query("SELECT * FROM allied_health_articles WHERE id = $1", [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: "Article not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/allied-articles/generate", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { professionSlug, templateKey } = req.body;
      if (!professionSlug || !templateKey) {
        return res.status(400).json({ error: "professionSlug and templateKey are required" });
      }
      const article = await generateArticle(professionSlug, templateKey);
      res.json(article);
    } catch (err: any) {
      console.error("[Allied Articles] Generation error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/allied-articles/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { id } = req.params;
      const fields = req.body;

      const allowedFields: Record<string, string> = {
        title: "title",
        metaTitle: "meta_title",
        metaDescription: "meta_description",
        canonicalUrl: "canonical_url",
        primaryKeyword: "primary_keyword",
        secondaryKeywords: "secondary_keywords",
        featuredOrder: "featured_order",
        countryScope: "country_scope",
      };

      const jsonFields: Record<string, string> = {
        contentSections: "content_sections",
        faqItems: "faq_items",
        internalLinks: "internal_links",
        schemaMarkupJson: "schema_markup_json",
        breadcrumbItems: "breadcrumb_items",
      };

      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;

      for (const [camel, snake] of Object.entries(allowedFields)) {
        if (fields[camel] !== undefined) {
          setClauses.push(`${snake} = $${idx++}`);
          values.push(fields[camel]);
        }
      }
      for (const [camel, snake] of Object.entries(jsonFields)) {
        if (fields[camel] !== undefined) {
          setClauses.push(`${snake} = $${idx++}`);
          values.push(JSON.stringify(fields[camel]));
        }
      }

      if (setClauses.length === 0) return res.status(400).json({ error: "No fields to update" });

      setClauses.push(`updated_at = NOW()`);
      values.push(id);

      const result = await pool.query(
        `UPDATE allied_health_articles SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
        values
      );
      if (!result.rows[0]) return res.status(404).json({ error: "Article not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/allied-articles/:id/publish", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const result = await pool.query(
        `UPDATE allied_health_articles SET status = 'published', published_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
        [req.params.id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: "Article not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/allied-articles/:id/unpublish", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const result = await pool.query(
        `UPDATE allied_health_articles SET status = 'unpublished', updated_at = NOW() WHERE id = $1 RETURNING *`,
        [req.params.id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: "Article not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/allied-articles/:professionSlug", async (req: Request, res: Response) => {
    try {
      const { professionSlug } = req.params;
      const result = await pool.query(
        `SELECT id, profession_slug, article_type, title, slug, meta_title, meta_description, canonical_url,
                primary_keyword, faq_items, breadcrumb_items, published_at, created_at
         FROM allied_health_articles
         WHERE profession_slug = $1 AND status = 'published'
         ORDER BY featured_order ASC NULLS LAST, published_at DESC`,
        [professionSlug]
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/allied-articles/:professionSlug/:articleSlug", async (req: Request, res: Response) => {
    try {
      const { professionSlug, articleSlug } = req.params;
      const fullSlug = `${professionSlug}-${articleSlug}`;

      let result = await pool.query(
        "SELECT * FROM allied_health_articles WHERE slug = $1 AND status = 'published'",
        [fullSlug]
      );

      if (!result.rows[0]) {
        result = await pool.query(
          "SELECT * FROM allied_health_articles WHERE slug = $1 AND profession_slug = $2 AND status = 'published'",
          [articleSlug, professionSlug]
        );
      }

      if (!result.rows[0]) return res.status(404).json({ error: "Article not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
