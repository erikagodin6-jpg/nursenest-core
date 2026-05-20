import { SeoHubPage } from "@/components/seo-content-template";

import { useI18n } from "@/lib/i18n";
const SITE_DOMAIN = "https://www.nursenest.ca";

export default function SeoHubNewGrad() {
  const { t } = useI18n();
  return (
    <SeoHubPage
      title={t("pages.seoHubNewGrad.newGraduateHealthcareCareerHub")}
      subtitle={t("pages.seo_hub_new_grad.everythingNewGraduateNursesAnd")}
      seoTitle="New Grad Career Hub — Resume, Interview & Career Resources | NurseNest"
      seoDescription="Complete career hub for new graduate nurses: resume templates, interview prep with 100+ questions, clinical confidence guides, salary negotiation tools, and first-year survival resources. Start free."
      seoKeywords="new grad nurse career, new graduate nurse resources, new nurse career hub, nursing career development, new grad healthcare career, nursing job preparation"
      canonicalPath="/new-grad"
      heroColor="blue"
      breadcrumbs={[
        { name: "Home", url: SITE_DOMAIN },
        { name: "New Grad Career Hub", url: `${SITE_DOMAIN}/new-grad` },
      ]}
      sections={[
        {
          title: "Resume & Application Resources",
          links: [
            { title: "New Grad Nursing Resume Example", href: "/resumes-cover-letters/new-grad-nursing-resume-example", description: "Step-by-step resume writing guide with real examples" },
            { title: "Healthcare Resume Templates", href: "/resumes-cover-letters/healthcare-resume-templates", description: "ATS-tested templates for every specialty" },
            { title: "ATS Resume Tips", href: "/resumes-cover-letters/ats-resume-tips-new-graduates", description: "Beat applicant tracking systems" },
            { title: "Cover Letter Examples", href: "/resumes-cover-letters/cover-letter-examples-healthcare", description: "Specialty-specific cover letter frameworks" },
            { title: "Resume Mistakes to Avoid", href: "/resumes-cover-letters/resume-mistakes-to-avoid", description: "Common errors that cost interviews" },
            { title: "Resume Bullet Bank", href: "/newgrad/resume", description: "Copy-paste clinical rotation bullets" },
          ],
        },
        {
          title: "Interview Preparation",
          links: [
            { title: "Top Nursing Interview Questions", href: "/interview-prep/top-nursing-interview-questions", description: "Most-asked questions with sample answers" },
            { title: "Behavioral Interview Questions", href: "/interview-prep/behavioral-interview-questions-healthcare", description: "STAR-format examples and practice" },
            { title: "Tell Me About Yourself", href: "/interview-prep/tell-me-about-yourself-best-answer", description: "Nail the opening question" },
            { title: "STAR Method Explained", href: "/interview-prep/star-method-explained", description: "Master the answer framework" },
            { title: "Common Interview Mistakes", href: "/interview-prep/common-interview-mistakes", description: "Avoid costly errors" },
            { title: "Interview Question Bank", href: "/newgrad/interview", description: "Practice with 100+ categorized questions" },
          ],
        },
        {
          title: "Career Guides & First-Year Resources",
          links: [
            { title: "First Nursing Job Guide", href: "/resources/what-to-expect-first-nursing-job", description: "Everything about your first 90 days" },
            { title: "Student to Nurse Transition", href: "/resources/transition-student-to-nurse", description: "Navigate the identity change" },
            { title: "Time Management for New Nurses", href: "/resources/time-management-new-nurses", description: "Master your first patient assignments" },
            { title: "Clinical Confidence Tips", href: "/resources/clinical-confidence-tips", description: "Build skills systematically" },
            { title: "Survival Guide", href: "/newgrad/survival-guide", description: "Complete first-year survival guide" },
            { title: "Burnout Prevention", href: "/newgrad/burnout", description: "Protect your well-being" },
          ],
        },
        {
          title: "Personal Statements & Applications",
          links: [
            { title: "Personal Statement Examples", href: "/personal-statements/nursing-school-personal-statement-examples", description: "Real examples with expert analysis" },
            { title: "Scholarship Application Tips", href: "/personal-statements/scholarship-application-tips", description: "Win nursing scholarships" },
            { title: "Personal Statement Bank", href: "/newgrad/resume#personal-statements", description: "Browse prompt examples" },
          ],
        },
      ]}
      toolLinks={[
        { title: "Interview Question Bank", href: "/newgrad/interview", description: "100+ categorized interview questions with STAR answers" },
        { title: "Mock Interview Simulator", href: "/newgrad/mock-interview", description: "Timed practice interviews with scoring" },
        { title: "Resume Bullet Bank", href: "/newgrad/resume", description: "Copy-paste clinical rotation descriptions" },
        { title: "Workplace Scenarios", href: "/newgrad/scenarios", description: "Practice clinical decision-making" },
        { title: "Salary Negotiation Guide", href: "/newgrad/salary", description: "Know your worth and negotiate effectively" },
        { title: "Certification Prep", href: "/newgrad/certifications", description: "BLS, ACLS, PALS study guides" },
      ]}
      faqs={[
        { question: "What resources does NurseNest offer for new graduate nurses?", answer: "NurseNest provides a comprehensive career hub including 100+ interview questions with sample answers, resume templates and bullet banks, cover letter frameworks, mock interview simulators, workplace scenario practice, salary guides, certification prep, clinical reference guides, and first-year survival resources." },
        { question: "Are these new grad resources free?", answer: "Many resources are free including career guides, resume tips, and sample interview questions. Premium features like the full interview question bank, mock interview simulator, and downloadable templates are available with a New Grad Toolkit subscription." },
        { question: "How do I prepare for my first nursing interview?", answer: "Start with our Top Nursing Interview Questions guide, then practice using the STAR method with our behavioral question examples. Use the Interview Question Bank to drill specific categories, and take a timed mock interview when you're ready for full simulation." },
        { question: "What should I include in my new grad nursing resume?", answer: "Include a targeted professional summary, education with GPA (if 3.5+), licenses and certifications, clinical rotations with specific details, nursing skills, and professional memberships. Use our resume examples and templates for formatting guidance." },
      ]}
    />
  );
}
