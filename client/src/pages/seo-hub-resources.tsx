import { SeoHubPage } from "@/components/seo-content-template";

import { useI18n } from "@/lib/i18n";
const SITE_DOMAIN = "https://www.nursenest.ca";

export default function SeoHubResources() {
  const { t } = useI18n();
  return (
    <SeoHubPage
      title={t("pages.seoHubResources.careerResourcesForNewGraduate")}
      subtitle={t("pages.seo_hub_resources.comprehensiveGuidesForNavigatingYour")}
      seoTitle="Career Resources — New Graduate Nurse Guides & Tools | NurseNest"
      seoDescription="Navigate your first year of nursing with comprehensive career resources. Guides for clinical confidence, time management, workplace navigation, burnout prevention, and professional development for new graduate nurses."
      seoKeywords="new nurse resources, new graduate nurse guides, first year nursing tips, nursing career resources, new nurse confidence, nursing career development, new grad nurse support"
      canonicalPath="/resources"
      heroColor="green"
      breadcrumbs={[
        { name: "Home", url: SITE_DOMAIN },
        { name: "Resources", url: `${SITE_DOMAIN}/resources` },
      ]}
      sections={[
        {
          title: "First-Year Guides",
          links: [
            { title: "What to Expect in Your First Nursing Job", href: "/resources/what-to-expect-first-nursing-job", description: "Complete guide to your first 90 days and beyond" },
            { title: "Transition from Student to Nurse", href: "/resources/transition-student-to-nurse", description: "Navigate the role change with proven strategies" },
            { title: "Time Management for New Nurses", href: "/resources/time-management-new-nurses", description: "Master shift organization and patient prioritization" },
            { title: "Clinical Confidence Tips", href: "/resources/clinical-confidence-tips", description: "Build competence and overcome imposter syndrome" },
          ],
        },
        {
          title: "Career Development",
          links: [
            { title: "Career Planning", href: "/newgrad/career", description: "Plan your nursing career path and advancement" },
            { title: "Salary Negotiation", href: "/newgrad/salary", description: "Know your worth and negotiate effectively" },
            { title: "Professional Development", href: "/newgrad/professional-development", description: "Continuing education and leadership growth" },
            { title: "Certification Prep", href: "/newgrad/certifications", description: "BLS, ACLS, PALS, and specialty certification guides" },
          ],
        },
        {
          title: "Workplace Navigation",
          links: [
            { title: "Workplace Dynamics", href: "/newgrad/workplace", description: "Navigate team relationships and hospital culture" },
            { title: "Burnout Prevention", href: "/newgrad/burnout", description: "Recognize signs and build resilience strategies" },
            { title: "Clinical References", href: "/newgrad/clinical-references", description: "Quick-reference guides for bedside nursing" },
            { title: "Survival Guide", href: "/newgrad/survival-guide", description: "Complete first-year survival toolkit" },
          ],
        },
      ]}
      toolLinks={[
        { title: "Interview Question Bank", href: "/newgrad/interview", description: "Practice for your next opportunity" },
        { title: "Workplace Scenarios", href: "/newgrad/scenarios", description: "Practice clinical decision-making" },
        { title: "Mock Interview Simulator", href: "/newgrad/mock-interview", description: "Timed practice with scoring" },
        { title: "Resume Bullet Bank", href: "/newgrad/resume", description: "Build your professional documents" },
        { title: "Simulation Sets", href: "/newgrad/simulation-sets", description: "Structured skill-building practice" },
        { title: "Career Hub", href: "/newgrad", description: "All new grad resources in one place" },
      ]}
      faqs={[
        { question: "What should I expect in my first year of nursing?", answer: "Your first year includes orientation (2–4 weeks), preceptored practice (8–12 weeks), and gradually independent practice. Expect a learning curve, emotional ups and downs, and steady growth in clinical confidence. Most nurses feel significantly more confident by month 9–12." },
        { question: "How do I manage time as a new nurse?", answer: "Use pre-shift preparation, brain sheets, and task clustering. Arrive early to review charts, create a prioritized task list, group tasks by patient room, and build buffer time for unexpected events. Most nurses develop efficient time management by month 3–4." },
        { question: "How can I build clinical confidence?", answer: "Confidence comes from competence. Practice systematic assessments, master your unit's most common medications, learn emergency procedures, and keep a journal of skills mastered and positive feedback. Each shift adds to your experience." },
        { question: "Is it normal to feel overwhelmed as a new graduate?", answer: "Absolutely. Over 70% of new graduates report feeling overwhelmed during their first 6 months. This is a recognized phenomenon called 'transition shock.' It typically improves significantly by months 8–12. Lean on your support system and be patient with yourself." },
      ]}
    />
  );
}
