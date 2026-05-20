import { SeoHubPage } from "@/components/seo-content-template";

import { useI18n } from "@/lib/i18n";
const SITE_DOMAIN = "https://www.nursenest.ca";

export default function SeoHubInterview() {
  const { t } = useI18n();
  return (
    <SeoHubPage
      title={t("pages.seoHubInterview.interviewPrepForNewGraduate")}
      subtitle={t("pages.seo_hub_interview.masterNursingInterviewQuestionsWith")}
      seoTitle="Interview Prep — Nursing Interview Questions & Practice | NurseNest"
      seoDescription="Prepare for nursing interviews with 100+ practice questions, STAR-method examples, behavioral interview strategies, and timed mock interview simulators. Expert-reviewed content for new graduate nurses."
      seoKeywords="nursing interview prep, nursing interview questions, new grad nurse interview, STAR method nursing, behavioral interview nursing, mock nursing interview, healthcare interview preparation"
      canonicalPath="/interview-prep"
      heroColor="purple"
      breadcrumbs={[
        { name: "Home", url: SITE_DOMAIN },
        { name: "Interview Prep", url: `${SITE_DOMAIN}/interview-prep` },
      ]}
      sections={[
        {
          title: "Interview Question Guides",
          links: [
            { title: "Top Nursing Interview Questions", href: "/interview-prep/top-nursing-interview-questions", description: "The most frequently asked questions with expert-reviewed sample answers" },
            { title: "Behavioral Interview Questions", href: "/interview-prep/behavioral-interview-questions-healthcare", description: "STAR-format examples for teamwork, advocacy, and conflict resolution" },
            { title: "Tell Me About Yourself", href: "/interview-prep/tell-me-about-yourself-best-answer", description: "Craft the perfect opening answer with our proven framework" },
            { title: "STAR Method Explained", href: "/interview-prep/star-method-explained", description: "Master the Situation-Task-Action-Result answer structure" },
            { title: "Common Interview Mistakes", href: "/interview-prep/common-interview-mistakes", description: "Avoid the errors that cost new grads job offers" },
          ],
        },
        {
          title: "Related Career Prep",
          links: [
            { title: "New Grad Resume Guide", href: "/resumes-cover-letters/new-grad-nursing-resume-example", description: "Build a resume that gets you the interview" },
            { title: "Cover Letter Examples", href: "/resumes-cover-letters/cover-letter-examples-healthcare", description: "Complete your application package" },
            { title: "First Nursing Job Guide", href: "/resources/what-to-expect-first-nursing-job", description: "Know what happens after you're hired" },
          ],
        },
      ]}
      toolLinks={[
        { title: "Interview Question Bank", href: "/newgrad/interview", description: "100+ categorized questions with detailed STAR-format answers" },
        { title: "Mock Interview Simulator", href: "/newgrad/mock-interview", description: "Timed practice interviews with scoring and review" },
        { title: "Workplace Scenarios", href: "/newgrad/scenarios", description: "Practice clinical and professional scenarios" },
        { title: "Simulation Sets", href: "/newgrad/simulation-sets", description: "Structured sequential practice sets" },
      ]}
      faqs={[
        { question: "How should I prepare for a nursing interview?", answer: "Start by reviewing the most common nursing interview questions. Practice answering using the STAR method (Situation, Task, Action, Result). Research the hospital and unit, prepare thoughtful questions for the interviewer, and do at least one mock interview before your actual appointment." },
        { question: "What is the STAR method?", answer: "STAR stands for Situation, Task, Action, Result. It's a structured framework for answering behavioral interview questions by describing a specific situation, your task or responsibility, the actions you took, and the outcome. Healthcare employers prefer STAR-structured answers because they provide clear evidence of competency." },
        { question: "How many interview questions should I prepare?", answer: "Prepare at least 15–20 questions across behavioral, clinical, and motivational categories. Build a library of 8–10 clinical stories from your rotations that can be adapted for multiple questions. Practice until your answers are 60–90 seconds each." },
        { question: "What questions should I ask the interviewer?", answer: "Ask about the nurse residency program, patient-to-nurse ratios, unit culture and teamwork, professional development opportunities, and how the unit supports new graduate nurses. Avoid salary and scheduling questions in the first interview." },
      ]}
    />
  );
}
