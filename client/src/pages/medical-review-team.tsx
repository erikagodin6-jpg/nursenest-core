import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { MEDICAL_REVIEWERS } from "@/components/medical-review-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Stethoscope,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/lib/LocaleLink";

import { useI18n } from "@/lib/i18n";
const reviewProcessSteps = [
  {
    title: "Clinical Authorship",
    description:
      "All clinical content is written by Registered Nurses with direct patient care experience and active licensure. Content is developed based on current clinical guidelines, peer-reviewed literature, and evidence-based nursing practice standards.",
  },
  {
    title: "Scope-of-Practice Review",
    description:
      "Every lesson, question, and rationale is reviewed to ensure it aligns with the appropriate scope of practice — RPN content focuses on monitoring and reporting, RN content covers assessment and protocol-based interventions, and NP material addresses prescribing and differential diagnosis.",
  },
  {
    title: "Source Verification",
    description:
      "Clinical claims, drug information, lab values, and treatment protocols are cross-referenced against recognized authorities including WHO, CDC, NIH, RNAO, and Health Canada guidelines.",
  },
  {
    title: "Regular Content Updates",
    description:
      "Published content is reviewed on a recurring basis to ensure accuracy against current clinical guidelines. Updated content is clearly marked with a 'Last medically reviewed' date.",
  },
  {
    title: "Editorial Independence",
    description:
      "NurseNest is not affiliated with NCLEX, NCSBN, CNO, or any nursing regulatory body. Our content is independently developed for educational purposes and nursing exam preparation.",
  },
];

export default function MedicalReviewTeamPage() {
  const { t } = useI18n();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Medical Review Team — NurseNest",
    "description":
      "Meet the clinical review team behind NurseNest. Learn about our evidence-based editorial process and commitment to clinically accurate nursing education.",
    "url": "https://www.nursenest.ca/medical-review-team",
    "author": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "publisher": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "Nurse",
    },
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900" data-testid="medical-review-team-page">
      <SEO
        title={t("pages.medicalReviewTeam.medicalReviewTeamNursenestClinical")}
        description={t("pages.medicalReviewTeam.meetTheClinicalReviewTeam")}
        keywords="medical review team, nursing content review, evidence-based nursing, clinical accuracy, NurseNest editorial standards, Erika Godin RN"
        canonicalPath="/medical-review-team"
        structuredData={structuredData}
      />
      <Navigation />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/30 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav />
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6" data-testid="badge-review-team">
                <ShieldCheck className="w-4 h-4" />
                Clinical Standards & Review
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight" data-testid="text-page-title">
                Medical Review Team
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto" data-testid="text-page-subtitle">
                Every piece of clinical content on NurseNest is authored and reviewed by Registered Nurses with active clinical experience. Transparency about our review process is fundamental to the trust nursing students place in our platform.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center" data-testid="heading-reviewers">
              Our Clinical Reviewers
            </h2>
            <div className="space-y-8">
              {MEDICAL_REVIEWERS.map((reviewer, i) => (
                <Card key={i} className="border-emerald-100 overflow-hidden" data-testid={`card-reviewer-${i}`}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-64 bg-gradient-to-br from-emerald-50 to-emerald-100/50 flex flex-col items-center justify-center p-8">
                        <div className="w-24 h-24 rounded-full bg-emerald-200/60 flex items-center justify-center mb-4 border-2 border-emerald-300/40">
                          <Stethoscope className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center" data-testid={`text-reviewer-name-${i}`}>
                          {reviewer.name}
                        </h3>
                        <p className="text-emerald-700 font-semibold text-sm mt-1" data-testid={`text-reviewer-credentials-${i}`}>
                          {reviewer.credentials}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 text-center" data-testid={`text-reviewer-role-${i}`}>
                          {reviewer.role}
                        </p>
                        {reviewer.linkedIn && (
                          <a
                            href={reviewer.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                            data-testid={`link-reviewer-linkedin-${i}`}
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                      <div className="flex-1 p-8">
                        <p className="text-gray-700 leading-relaxed mb-4" data-testid={`text-reviewer-bio-${i}`}>
                          {reviewer.bio}
                        </p>
                        <div className="space-y-2">
                          {[
                            "Active Registered Nurse with current licensure",
                            "Direct clinical experience in medical-surgical, community, and acute care",
                            "Former RPN with firsthand experience across exam pathways",
                            "Currently pursuing Master of Nursing (MN) degree",
                            "Oversees all clinical content accuracy and scope-of-practice alignment",
                          ].map((item, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-600">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="heading-review-process">
                Our Medical Review Process
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Every piece of clinical content goes through a structured review process before publication. Here is how we maintain accuracy and trust.
              </p>
            </div>
            <div className="space-y-6">
              {reviewProcessSteps.map((step, i) => (
                <div key={i} className="flex gap-5" data-testid={`review-step-${i}`}>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-emerald-700">{i + 1}</span>
                    </div>
                    {i < reviewProcessSteps.length - 1 && (
                      <div className="w-px flex-1 bg-emerald-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8 sm:p-10" data-testid="section-commitment">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="heading-commitment">
                    Our Commitment to Evidence-Based Nursing Education
                  </h2>
                </div>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  NurseNest is built on the principle that nursing students deserve clinically accurate, scope-appropriate, and evidence-based study resources. As a YMYL (Your Money or Your Life) healthcare education platform, we hold ourselves to the highest standards of content accuracy and transparency.
                </p>
                <p>
                  Our clinical content is grounded in current peer-reviewed literature, national clinical practice guidelines, and recognized healthcare authorities including the World Health Organization (WHO), Centers for Disease Control and Prevention (CDC), National Institutes of Health (NIH), and the Registered Nurses' Association of Ontario (RNAO).
                </p>
                <p>
                  We are committed to regularly reviewing and updating our content to reflect current standards of care. When clinical guidelines change, our content is updated accordingly. Every educational page includes a "Last medically reviewed" date so students can verify the currency of the information.
                </p>
                <p className="text-sm text-gray-500 italic">
                  NurseNest content is for educational purposes and nursing exam preparation only. It does not constitute medical advice. Always refer to current institutional protocols and clinical guidelines in practice.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50/30 to-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="heading-cta">
              Study with Confidence
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              Every lesson, practice question, and clinical rationale on NurseNest is reviewed by our clinical team. Start studying with evidence-based resources you can trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LocaleLink href="/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8" data-testid="button-register">
                  Start Studying Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/about">
                <Button size="lg" variant="outline" className="border-emerald-200 text-gray-700 hover:bg-emerald-50 px-8" data-testid="button-about">
                  About NurseNest
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
