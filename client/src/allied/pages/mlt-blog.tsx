import { Link, useParams } from "wouter";
import { ChevronRight, BookOpen, Calendar, Tag, ArrowRight, FlaskConical } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { MLT_DISCIPLINES } from "@shared/mlt-taxonomy";

import { useI18n } from "@/lib/i18n";
const STUB_ARTICLES = [
  {
    slug: "csmls-vs-ascp-certification-comparison",
    title: "CSMLS vs ASCP: A Complete Certification Comparison for Lab Professionals",
    excerpt: "Understand the key differences between Canadian CSMLS and American ASCP certification pathways, including exam format, scoring, and career implications.",
    discipline: "General",
    date: "2026-03-01",
    readTime: "8 min read",
  },
  {
    slug: "hematology-cbc-interpretation-guide",
    title: "Mastering CBC Interpretation: A Hematology Study Guide for MLT Students",
    excerpt: "Learn to interpret complete blood counts with confidence. Covers RBC indices, WBC differentials, platelet parameters, and common hematological abnormalities.",
    discipline: "Hematology",
    date: "2026-02-25",
    readTime: "12 min read",
  },
  {
    slug: "clinical-chemistry-electrolyte-panels",
    title: "Electrolyte Panels in Clinical Chemistry: What Every MLT Student Should Know",
    excerpt: "A comprehensive review of electrolyte testing including sodium, potassium, chloride, and bicarbonate — with SI and conventional unit conversions.",
    discipline: "Clinical Chemistry",
    date: "2026-02-18",
    readTime: "10 min read",
  },
  {
    slug: "microbiology-gram-stain-technique",
    title: "Gram Stain Technique and Interpretation: From Bench to Exam",
    excerpt: "Step-by-step guide to Gram staining with clinical correlations. Covers common organisms, troubleshooting, and exam-style questions.",
    discipline: "Microbiology",
    date: "2026-02-10",
    readTime: "9 min read",
  },
  {
    slug: "blood-banking-abo-rh-typing",
    title: "ABO and Rh Typing: Transfusion Science Fundamentals for MLT Certification",
    excerpt: "Master forward and reverse typing, Rh determination, antibody screening, and crossmatching procedures for your certification exam.",
    discipline: "Transfusion Science",
    date: "2026-02-05",
    readTime: "11 min read",
  },
  {
    slug: "urinalysis-body-fluids-review",
    title: "Urinalysis and Body Fluids: High-Yield Review for MLT Exams",
    excerpt: "Physical, chemical, and microscopic urinalysis review. Includes CSF analysis, synovial fluid, and serous fluid examination.",
    discipline: "Urinalysis & Body Fluids",
    date: "2026-01-28",
    readTime: "10 min read",
  },
  {
    slug: "quality-control-westgard-rules-explained",
    title: "Westgard Rules Explained: A Practical QC Guide for Lab Technologists",
    excerpt: "Master all six Westgard multi-rules with visual examples, Levey-Jennings chart interpretation, and real-world troubleshooting scenarios for daily QC.",
    discipline: "Laboratory Operations",
    date: "2026-01-20",
    readTime: "11 min read",
  },
  {
    slug: "molecular-diagnostics-pcr-primer",
    title: "PCR and Molecular Diagnostics: What Every MLT Student Needs to Know",
    excerpt: "From conventional PCR to real-time qPCR and NGS — understand the molecular methods transforming clinical laboratory medicine and certification exams.",
    discipline: "Molecular Diagnostics",
    date: "2026-01-15",
    readTime: "13 min read",
  },
  {
    slug: "blood-bank-antibody-identification",
    title: "Antibody Identification Panels: Step-by-Step Guide for MLT Students",
    excerpt: "Learn the systematic approach to antibody panel interpretation, rule-out technique, and clinically significant antibody recognition for blood bank certification questions.",
    discipline: "Transfusion Science",
    date: "2026-01-10",
    readTime: "14 min read",
  },
  {
    slug: "specimen-collection-order-of-draw",
    title: "Order of Draw and Specimen Collection: The Pre-Analytical Guide",
    excerpt: "Complete guide to venipuncture order of draw, tube selection, specimen rejection criteria, and pre-analytical variables that affect laboratory results.",
    discipline: "Specimen Collection",
    date: "2026-01-05",
    readTime: "9 min read",
  },
  {
    slug: "histotechnology-special-stains-guide",
    title: "Special Stains in Histotechnology: From H&E to Immunohistochemistry",
    excerpt: "Visual guide to histology special stains including PAS, GMS, Masson Trichrome, Congo Red, and IHC markers for tumor classification and diagnosis.",
    discipline: "Histotechnology",
    date: "2025-12-28",
    readTime: "12 min read",
  },
  {
    slug: "parasitology-ova-parasites-exam-guide",
    title: "Parasitology for the MLT Exam: O&P, Blood Parasites, and Fungal ID",
    excerpt: "High-yield parasitology and mycology review covering O&P examination, malaria identification, dimorphic fungi, and opportunistic infections for certification.",
    discipline: "Parasitology & Mycology",
    date: "2025-12-20",
    readTime: "11 min read",
  },
  {
    slug: "coagulation-cascade-mixing-studies",
    title: "Coagulation Testing Beyond PT and aPTT: Mixing Studies, DIC, and Factor Assays",
    excerpt: "Advanced coagulation concepts for MLT certification — mixing study algorithms, DIC scoring, lupus anticoagulant paradox, and Bethesda assay interpretation.",
    discipline: "Hemostasis / Coagulation",
    date: "2025-12-15",
    readTime: "13 min read",
  },
  {
    slug: "immunology-serology-hiv-hepatitis-testing",
    title: "HIV and Hepatitis Testing Algorithms: Serology for MLT Certification",
    excerpt: "Master the 4th-generation HIV algorithm, hepatitis B serological profiles, syphilis testing, and ANA patterns for your CSMLS or ASCP certification exam.",
    discipline: "Immunology / Serology",
    date: "2025-12-10",
    readTime: "12 min read",
  },
  {
    slug: "mlt-study-strategies-exam-day-tips",
    title: "MLT Exam Study Strategies: Evidence-Based Tips for CSMLS and ASCP Success",
    excerpt: "Proven study techniques for MLT certification exams including spaced repetition, active recall, practice question strategies, and exam-day time management.",
    discipline: "General",
    date: "2025-12-05",
    readTime: "8 min read",
  },
];

function MltBlogIndex() {
  const { t } = useI18n();
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 2, "name": "MLT Exam Prep", "item": "https://www.nursenest.ca/allied-health/mlt" },
      { "@type": "ListItem", "position": 3, "name": "Blog", "item": "https://www.nursenest.ca/allied-health/mlt/blog" },
    ],
  };

  return (
    <div data-testid="mlt-blog-index">
      <AlliedSEO
        title={t("allied.mltBlog.mltBlogMedicalLaboratoryScience")}
        description={t("allied.mltBlog.expertArticlesOnMedicalLaboratory")}
        keywords="MLT blog, medical laboratory science articles, CSMLS exam tips, ASCP study guide, hematology articles, clinical chemistry blog, lab tech blog"
        canonicalPath="/allied-health/mlt/blog"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "MLT Blog — NurseNest Allied",
          "description": "Expert articles on medical laboratory science topics and exam preparation.",
          "publisher": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" },
        }}
        additionalStructuredData={[breadcrumbStructuredData]}
      />

      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
            <Link href="/" className="hover:text-purple-600">{t("allied.mltBlog.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-700 font-medium">{t("allied.mltBlog.blog")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-blog-title">
            MLT Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Expert articles on medical laboratory science topics, exam preparation strategies, discipline deep-dives, and study tips for CSMLS and ASCP certification.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.mltBlog.browseByDiscipline")}</h2>
            <div className="flex flex-wrap gap-2">
              {MLT_DISCIPLINES.slice(0, 10).map(d => (
                <span key={d} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium" data-testid={`tag-${d}`}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {STUB_ARTICLES.map((article, i) => (
              <Link key={article.slug} href={`/allied-health/mlt/blog/${article.slug}`} className="block" data-testid={`link-article-${i}`}>
                <article className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-purple-200 transition-all">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium">{article.discipline}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-700" data-testid={`text-article-title-${i}`}>{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-purple-600 text-sm font-medium mt-3">
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.mltBlog.relatedResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/allied-health/mlt/canada/exam-prep" className="text-sm text-purple-600 hover:underline" data-testid="link-canada-prep">{t("allied.mltBlog.csmlsExamPrep")}</Link>
            <Link href="/allied-health/mlt/usa/exam-prep" className="text-sm text-purple-600 hover:underline" data-testid="link-usa-prep">{t("allied.mltBlog.ascpExamPrep")}</Link>
            <Link href="/allied-health/mlt" className="text-sm text-purple-600 hover:underline" data-testid="link-mlt-hub">{t("allied.mltBlog.mltHub")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function MltBlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const article = STUB_ARTICLES.find(a => a.slug === slug);
  const relatedArticles = STUB_ARTICLES.filter(a => a.slug !== slug).slice(0, 3);

  const titleText = article ? article.title : slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const descriptionText = article ? article.excerpt : `Read this expert article on medical laboratory science — ${titleText}.`;

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 2, "name": "MLT Exam Prep", "item": "https://www.nursenest.ca/allied-health/mlt" },
      { "@type": "ListItem", "position": 3, "name": "Blog", "item": "https://www.nursenest.ca/allied-health/mlt/blog" },
      { "@type": "ListItem", "position": 4, "name": titleText, "item": `https://www.nursenest.ca/allied-health/mlt/blog/${slug}` },
    ],
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": titleText,
    "description": descriptionText,
    "url": `https://www.nursenest.ca/allied-health/mlt/blog/${slug}`,
    "datePublished": article?.date || "2026-01-01",
    "author": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" },
    "publisher": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.nursenest.ca/allied-health/mlt/blog/${slug}` },
  };

  return (
    <div data-testid="mlt-blog-post">
      <AlliedSEO
        title={`${titleText} | MLT Blog — NurseNest Allied`}
        description={descriptionText}
        canonicalPath={`/allied-health/mlt/blog/${slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={[breadcrumbStructuredData]}
      />

      <section className="relative py-10 sm:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50/30 to-white" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
            <Link href="/" className="hover:text-purple-600">{t("allied.mltBlog.home2")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/allied-health/mlt/blog" className="hover:text-purple-600">{t("allied.mltBlog.blog2")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-700 font-medium truncate max-w-[200px]">{titleText}</span>
          </div>

          {article && (
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium">{article.discipline}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
              <span>{article.readTime}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" data-testid="text-post-title">{titleText}</h1>
          <p className="text-lg text-gray-600">{descriptionText}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              This article provides a comprehensive overview of key concepts for MLT/MLS certification preparation.
              Whether you're preparing for the CSMLS exam in Canada or the ASCP BOC exam in the United States,
              understanding these foundational topics is essential for exam success.
            </p>
            <div className="bg-purple-50 rounded-xl p-6 my-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-500" />
                Key Takeaways
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Understand the foundational concepts and their clinical significance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Practice with exam-style questions aligned to your certification track
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Review lab values in both SI and conventional units for comprehensive preparation
                </li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For targeted practice on this topic, try our discipline-specific question banks and flashcard decks.
              Each question includes detailed rationales to deepen your understanding.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/allied-health/mlt/canada/exam-prep" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors" data-testid="link-canada-prep">
              CSMLS Exam Prep <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/allied-health/mlt/usa/exam-prep" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors border border-purple-200" data-testid="link-usa-prep">
              ASCP Exam Prep <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t("allied.mltBlog.relatedArticles")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((related, i) => (
                <Link key={related.slug} href={`/allied-health/mlt/blog/${related.slug}`} className="block" data-testid={`link-related-${i}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all h-full">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{related.discipline}</span>
                    <h3 className="font-semibold text-gray-900 text-sm mt-3 mb-2 line-clamp-2">{related.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{related.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Link href="/allied-health/mlt/blog" className="text-purple-600 font-medium hover:underline" data-testid="link-back-blog">{t("allied.mltBlog.backToAllArticles")}</Link>
        </div>
      </section>
    </div>
  );
}

export default function MltBlog({ isPost = false }: { isPost?: boolean }) {
  if (isPost) return <MltBlogPost />;
  return <MltBlogIndex />;
}
