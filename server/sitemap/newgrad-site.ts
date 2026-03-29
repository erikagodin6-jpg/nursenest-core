import {
  getNewGradBase, getSiteBase, todayDate, simpleUrl
} from "./helpers";

export async function generateNewGradPages(): Promise<string[]> {
  const base = getNewGradBase();
  const siteBase = getSiteBase();
  const now = todayDate();
  const urls: string[] = [];

  urls.push(simpleUrl(`${base}/`, now, "weekly", "1.0"));

  const hubPages = [
    { path: "/interview-lab", priority: "0.9", freq: "weekly" },
    { path: "/resume-builder", priority: "0.9", freq: "weekly" },
    { path: "/cover-letter", priority: "0.9", freq: "weekly" },
    { path: "/first-90-days", priority: "0.9", freq: "monthly" },
    { path: "/clinical-confidence", priority: "0.9", freq: "weekly" },
    { path: "/pricing", priority: "0.8", freq: "monthly" },
  ];
  for (const page of hubPages) {
    urls.push(simpleUrl(`${base}${page.path}`, now, page.freq, page.priority));
  }

  const seoPages = [
    "new-grad-rn-interview-questions", "new-grad-rn-resume-guide",
    "new-grad-rn-cover-letter-examples", "first-90-days-as-a-new-nurse",
    "new-grad-rn-clinical-confidence", "new-grad-rn-job-search-guide",
    "new-nurse-orientation-survival-guide", "nursing-interview-behavioral-questions",
    "nursing-interview-clinical-scenarios", "new-grad-nurse-salary-guide",
    "nursing-specialties-for-new-grads", "night-shift-survival-guide-new-nurse",
    "preceptor-relationship-guide-new-nurse", "new-grad-rn-time-management",
    "imposter-syndrome-new-nurse", "new-grad-rn-skills-checklist",
    "new-grad-nurse-survival-guide",
  ];
  for (const slug of seoPages) {
    urls.push(simpleUrl(`${base}/${slug}`, now, "monthly", "0.8"));
  }

  const seoHubPages = [
    { path: "/new-grad", priority: "0.9", freq: "weekly" },
    { path: "/resumes-cover-letters", priority: "0.9", freq: "weekly" },
    { path: "/interview-prep", priority: "0.9", freq: "weekly" },
    { path: "/personal-statements", priority: "0.9", freq: "weekly" },
    { path: "/resources", priority: "0.9", freq: "weekly" },
  ];
  for (const page of seoHubPages) {
    urls.push(simpleUrl(`${siteBase}${page.path}`, now, page.freq, page.priority));
  }

  const seoContentArticles = [
    "resumes-cover-letters/new-grad-nursing-resume-example",
    "resumes-cover-letters/healthcare-resume-templates",
    "resumes-cover-letters/ats-resume-tips-new-graduates",
    "resumes-cover-letters/cover-letter-examples-healthcare",
    "resumes-cover-letters/resume-mistakes-to-avoid",
    "interview-prep/top-nursing-interview-questions",
    "interview-prep/behavioral-interview-questions-healthcare",
    "interview-prep/tell-me-about-yourself-best-answer",
    "interview-prep/star-method-explained",
    "interview-prep/common-interview-mistakes",
    "resources/what-to-expect-first-nursing-job",
    "resources/transition-student-to-nurse",
    "resources/time-management-new-nurses",
    "resources/clinical-confidence-tips",
    "personal-statements/nursing-school-personal-statement-examples",
    "personal-statements/scholarship-application-tips",
  ];
  for (const slug of seoContentArticles) {
    urls.push(simpleUrl(`${siteBase}/${slug}`, now, "monthly", "0.8"));
  }

  urls.push(simpleUrl(`${siteBase}/jobs`, now, "daily", "0.9"));

  try {
    const { pool } = await import("../storage");
    const slugsResult = await pool.query(`SELECT slug FROM job_listings WHERE status = 'published' ORDER BY posted_at DESC`);
    for (const row of slugsResult.rows) {
      urls.push(simpleUrl(`${siteBase}/jobs/${row.slug}`, now, "weekly", "0.7"));
    }
  } catch {}

  urls.push(simpleUrl(`${siteBase}/newgrad`, now, "weekly", "1.0"));
  const careerHubPages = [
    { path: "/newgrad/guides", priority: "0.9", freq: "weekly" },
    { path: "/newgrad/career", priority: "0.9", freq: "weekly" },
    { path: "/newgrad/interview", priority: "0.9", freq: "weekly" },
    { path: "/newgrad/resume", priority: "0.9", freq: "weekly" },
    { path: "/newgrad/workplace", priority: "0.8", freq: "monthly" },
    { path: "/newgrad/burnout", priority: "0.8", freq: "monthly" },
    { path: "/newgrad/salary", priority: "0.9", freq: "monthly" },
    { path: "/newgrad/professional-development", priority: "0.8", freq: "monthly" },
    { path: "/newgrad/certifications", priority: "0.9", freq: "weekly" },
    { path: "/newgrad/certifications/bls", priority: "0.9", freq: "weekly" },
    { path: "/newgrad/certifications/acls", priority: "0.9", freq: "weekly" },
    { path: "/newgrad/certifications/pals", priority: "0.9", freq: "weekly" },
    { path: "/newgrad/certifications/tncc", priority: "0.8", freq: "monthly" },
    { path: "/newgrad/certifications/nrp", priority: "0.8", freq: "monthly" },
    { path: "/newgrad/certifications/cen", priority: "0.8", freq: "monthly" },
    { path: "/newgrad/certifications/ccrn", priority: "0.8", freq: "monthly" },
  ];
  for (const page of careerHubPages) {
    urls.push(simpleUrl(`${siteBase}${page.path}`, now, page.freq, page.priority));
  }

  return urls;
}
