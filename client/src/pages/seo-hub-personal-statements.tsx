import { SeoHubPage } from "@/components/seo-content-template";

import { useI18n } from "@/lib/i18n";
const SITE_DOMAIN = "https://www.nursenest.ca";

export default function SeoHubPersonalStatements() {
  const { t } = useI18n();
  return (
    <SeoHubPage
      title={t("pages.seoHubPersonalStatements.personalStatementsApplicationEssaysFor")}
      subtitle={t("pages.seo_hub_personal_statements.expertGuidanceForWritingNursing")}
      seoTitle="Personal Statements — Nursing School Application Essays & Examples | NurseNest"
      seoDescription="Write winning nursing school personal statements and scholarship essays. Includes real examples, expert frameworks, editing guides, and tips for BSN, MSN, and DNP program applications."
      seoKeywords="nursing personal statement, nursing school application essay, scholarship essay nursing, nursing school essay examples, BSN application essay, nursing program personal statement"
      canonicalPath="/personal-statements"
      heroColor="indigo"
      breadcrumbs={[
        { name: "Home", url: SITE_DOMAIN },
        { name: "Personal Statements", url: `${SITE_DOMAIN}/personal-statements` },
      ]}
      sections={[
        {
          title: "Personal Statement Guides",
          links: [
            { title: "Nursing School Personal Statement Examples", href: "/personal-statements/nursing-school-personal-statement-examples", description: "Real examples with expert analysis and the 4-part writing framework" },
            { title: "Scholarship Application Tips", href: "/personal-statements/scholarship-application-tips", description: "Strategies for winning nursing scholarships and writing financial need statements" },
          ],
        },
        {
          title: "Related Application Resources",
          links: [
            { title: "New Grad Resume Guide", href: "/resumes-cover-letters/new-grad-nursing-resume-example", description: "Build a matching resume for your application" },
            { title: "Cover Letter Examples", href: "/resumes-cover-letters/cover-letter-examples-healthcare", description: "Complete your application package" },
            { title: "Personal Statement & Scholarship Prompt Bank", href: "/newgrad/resume#personal-statements", description: "Browse prompts with writing tips and sample openings" },
          ],
        },
      ]}
      toolLinks={[
        { title: "Personal Statement Bank", href: "/newgrad/resume#personal-statements", description: "Browse prompts with writing tips and sample openings" },
        { title: "Resume Bullet Bank", href: "/newgrad/resume", description: "Build supporting application materials" },
        { title: "Career Hub", href: "/newgrad", description: "Complete career preparation tools" },
      ]}
      faqs={[
        { question: "How long should a nursing school personal statement be?", answer: "Follow the program's guidelines exactly. Most programs request 500–1000 words (1–2 pages). If no length is specified, aim for 600–800 words. Quality and specificity matter more than length." },
        { question: "What should I write about in my nursing personal statement?", answer: "Write about specific experiences that led you to nursing, demonstrate self-awareness about the profession's challenges, show evidence of qualities like empathy and critical thinking, and explain why the specific program you're applying to is the right fit." },
        { question: "Can I mention personal health experiences?", answer: "Yes, if handled carefully. Focus on what the experience taught you about nursing and patient-centered care rather than centering the essay on medical details or trauma. Show how it shaped your professional goals." },
        { question: "How many drafts should I write?", answer: "Plan for at least 4–5 drafts. Start with a brain dump, then structure using a framework, strengthen examples, polish prose, and get outside feedback. Great personal statements are rewritten, not written." },
      ]}
    />
  );
}
