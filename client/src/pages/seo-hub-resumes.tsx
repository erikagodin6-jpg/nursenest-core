import { SeoHubPage } from "@/components/seo-content-template";

import { useI18n } from "@/lib/i18n";
const SITE_DOMAIN = "https://www.nursenest.ca";

export default function SeoHubResumes() {
  const { t } = useI18n();
  return (
    <SeoHubPage
      title={t("pages.seoHubResumes.resumesCoverLettersForHealthcare")}
      subtitle={t("pages.seo_hub_resumes.expertcraftedResumeGuidesAtsoptimizedTem")}
      seoTitle="Resumes & Cover Letters — Healthcare Resume Templates & Guides | NurseNest"
      seoDescription="Build a winning healthcare resume with ATS-optimized templates, real new grad nursing resume examples, cover letter frameworks, and expert writing guides. Free resources for nurses and healthcare professionals."
      seoKeywords="healthcare resume, nursing resume template, new grad nurse resume, cover letter healthcare, ATS resume tips, nursing cover letter examples, healthcare job application"
      canonicalPath="/resumes-cover-letters"
      heroColor="pink"
      breadcrumbs={[
        { name: "Home", url: SITE_DOMAIN },
        { name: "Resumes & Cover Letters", url: `${SITE_DOMAIN}/resumes-cover-letters` },
      ]}
      sections={[
        {
          title: "Resume Guides & Examples",
          links: [
            { title: "New Grad Nursing Resume Example", href: "/resumes-cover-letters/new-grad-nursing-resume-example", description: "Complete resume writing guide with real examples and expert commentary" },
            { title: "Healthcare Resume Templates", href: "/resumes-cover-letters/healthcare-resume-templates", description: "ATS-tested templates for med-surg, ICU, ER, pediatrics, and L&D" },
            { title: "ATS Resume Tips for New Graduates", href: "/resumes-cover-letters/ats-resume-tips-new-graduates", description: "Optimize your resume for applicant tracking systems" },
            { title: "Resume Mistakes to Avoid", href: "/resumes-cover-letters/resume-mistakes-to-avoid", description: "Common errors that cost new grads interview opportunities" },
          ],
        },
        {
          title: "Cover Letters & Application Materials",
          links: [
            { title: "Cover Letter Examples Healthcare", href: "/resumes-cover-letters/cover-letter-examples-healthcare", description: "Specialty-specific cover letter frameworks with real examples" },
            { title: "Personal Statement Examples", href: "/personal-statements/nursing-school-personal-statement-examples", description: "Nursing school application essays with expert analysis" },
            { title: "Scholarship Application Tips", href: "/personal-statements/scholarship-application-tips", description: "Strategies for winning nursing scholarships" },
          ],
        },
      ]}
      toolLinks={[
        { title: "Resume Bullet Bank", href: "/newgrad/resume", description: "100+ copy-paste clinical rotation descriptions organized by category" },
        { title: "Cover Letter Bank", href: "/newgrad/resume#cover-letters", description: "Specialty-specific cover letter examples with key elements" },
        { title: "Interview Question Bank", href: "/newgrad/interview", description: "Prepare for what comes after the resume" },
      ]}
      faqs={[
        { question: "How long should a new grad nursing resume be?", answer: "One page. As a new graduate, focus on quality over quantity. Include your professional summary, education, certifications, clinical rotations, skills, and memberships — all on a single, well-organized page." },
        { question: "What's the best resume format for nursing?", answer: "Use a clean, single-column format with standard section headers. Chronological or combination formats work best. Avoid creative designs with sidebars, graphics, or tables — they don't parse well through ATS software." },
        { question: "Should I include a cover letter with every application?", answer: "Yes, unless the posting explicitly says not to include one. Cover letters demonstrate genuine interest in the specific position and give you space to tell stories that don't fit on your resume." },
        { question: "How do I make my resume ATS-friendly?", answer: "Use standard section headers, include keywords from the job posting, avoid graphics and tables, use a simple font like Calibri or Arial, save as PDF, and spell out abbreviations on first use (e.g., 'Basic Life Support (BLS)')." },
      ]}
    />
  );
}
