import { LocaleLink } from "@/lib/LocaleLink";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  GraduationCap,
  Heart,
  BookOpen,
  Shield,
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  Award,
  Stethoscope,
  Globe,
  Clock,
} from "lucide-react";

const milestones = [
  { year: "2021", label: "Platform concept developed from first-hand exam prep frustration" },
  { year: "2022", label: "First clinical lesson modules and question banks created" },
  { year: "2023", label: "Expanded to cover RPN, RN, and NP pathways with tier-specific content" },
  { year: "2024", label: "Adaptive exam engine, mock exams, and spaced repetition system launched" },
  { year: "2025", label: "1,400+ lessons and 3,700+ practice questions across all tiers" },
  { year: "2026", label: "Allied health verticals, region-aware content, and advanced analytics" },
];

const values = [
  {
    icon: Target,
    title: "Clinically Accurate",
    description: "Every lesson, question, and rationale is grounded in current evidence-based nursing practice and verified by an experienced registered nurse.",
  },
  {
    icon: Users,
    title: "Built for How Nurses Learn",
    description: "Content is organized by body system, written in clear language, and designed around the way nursing students actually study and retain information.",
  },
  {
    icon: Globe,
    title: "Canadian and U.S. Ready",
    description: "Lab values, medications, and clinical standards are presented for both Canadian and American nursing contexts, so nothing gets lost in translation.",
  },
  {
    icon: Shield,
    title: "Scope-Appropriate Content",
    description: "RPN lessons focus on monitoring and reporting. RN content covers protocol-based assessment. NP material includes prescribing and differential diagnosis.",
  },
];

const editorialPrinciples = [
  "All clinical content is authored and reviewed by a practicing Registered Nurse with direct experience in the RPN-to-RN pathway.",
  "Practice questions are original works created to reflect exam-style reasoning, not copied from any exam body or third-party source.",
  "Content is regularly reviewed and updated to reflect current clinical guidelines and nursing education standards.",
  "NurseNest is not affiliated with NCLEX, NCSBN, CNO, or any nursing regulatory body. All references to exam formats are for educational context only.",
  "Drug information, lab values, and clinical data are presented for educational purposes and do not constitute clinical recommendations.",
];

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900" data-testid="about-page">
      <SEO
        title={t("pages.about.aboutNursenestOurMissionStory")}
        description={t("pages.about.nursenestIsANursingEducation")}
        keywords="about NurseNest, nursing education, Erika Godin RN, NCLEX prep, REx-PN study, nursing exam preparation, evidence-based nursing education"
        canonicalPath="/about"
      />
      <Navigation />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#BFA6F6]/10 via-white to-[#AEE3E1]/10 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav />
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BFA6F6]/10 text-[#BFA6F6] text-sm font-medium mb-6" data-testid="badge-about">
                <Heart className="w-4 h-4" />
                Our Story
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2E3A59] mb-6 leading-tight" data-testid="text-about-title">
                Built by a Nurse,{" "}
                <span className="text-[#BFA6F6]">{t("pages.about.forNursingStudents")}</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto" data-testid="text-about-subtitle">
                NurseNest was created because studying for nursing licensing exams should not require decoding content designed for a different country's clinical standards.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-12 items-start">
              <div className="md:col-span-2 flex flex-col items-center text-center" data-testid="section-founder">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#BFA6F6]/20 to-[#AEE3E1]/20 flex items-center justify-center mb-6 border-2 border-[#BFA6F6]/20">
                  <Stethoscope className="w-16 h-16 text-[#BFA6F6]" />
                </div>
                <h2 className="text-xl font-bold text-[#2E3A59] mb-1" data-testid="text-founder-name">{t("pages.about.erikaGodinRn")}</h2>
                <p className="text-sm text-[#BFA6F6] font-medium mb-1">{t("pages.about.founderOfNursenest")}</p>
                <p className="text-sm text-gray-500">{t("pages.about.formerRpnMasterOfNursing")}</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 rounded-full bg-[#BFA6F6]/10 text-[#BFA6F6] text-xs font-medium">{t("pages.about.registeredNurse")}</span>
                  <span className="px-3 py-1 rounded-full bg-[#AEE3E1]/20 text-[#2E3A59] text-xs font-medium">{t("pages.about.formerRpn")}</span>
                  <span className="px-3 py-1 rounded-full bg-[#BFA6F6]/10 text-[#BFA6F6] text-xs font-medium">{t("pages.about.mnStudent")}</span>
                </div>
              </div>

              <div className="md:col-span-3 space-y-5" data-testid="section-founder-story">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2E3A59]">{t("pages.about.whyNursenestExists")}</h2>
                <p className="text-gray-700 leading-relaxed">
                  NurseNest was founded by Erika Godin, a practicing Registered Nurse who began her career as a Registered Practical Nurse (RPN). Having personally navigated multiple licensing exam pathways — from the REx-PN to the NCLEX-RN — Erika experienced firsthand the challenges that Canadian nursing students face when preparing with platforms designed primarily for American clinical standards.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Popular exam preparation platforms like UWorld and Archer focus on U.S. measurements, lab values, and clinical protocols. For Canadian students preparing for exams like the REx-PN, this creates unnecessary confusion around units, drug names, and clinical expectations that differ between the two countries.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  After five years of development, NurseNest provides clinically accurate, organized, evidence-based nursing education resources designed around how nurses actually learn. Every lesson is scope-appropriate, every question is original, and every rationale is written to build genuine clinical reasoning rather than rote memorization.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Erika is currently pursuing a Master of Nursing degree, and her ongoing clinical practice and academic work directly inform the quality and accuracy of NurseNest's content.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-gradient-to-b from-warmwhite to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2E3A59] mb-4" data-testid="text-values-heading">{t("pages.about.whatGuidesOurContent")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.about.thePrinciplesBehindEveryLesson")}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <Card key={v.title} className="border-[#BFA6F6]/10 hover:border-[#BFA6F6]/25 transition-colors" data-testid={`card-value-${v.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    <CardContent className="p-6 flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-[#BFA6F6]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2E3A59] mb-1">{v.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AEE3E1]/20 text-[#2E3A59] text-sm font-medium mb-4">
                  <Shield className="w-4 h-4 text-[#AEE3E1]" />
                  Editorial Standards
                </div>
                <h2 className="text-3xl font-bold text-[#2E3A59] mb-4" data-testid="text-editorial-heading">{t("pages.about.ourCommitmentToAccuracy")}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  As a healthcare education platform, we hold ourselves to strict editorial standards. Transparency about who creates our content and how it is reviewed is fundamental to the trust nursing students place in NurseNest.
                </p>
              </div>
              <div className="space-y-4" data-testid="section-editorial-principles">
                {editorialPrinciples.map((p, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#AEE3E1] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-gradient-to-b from-warmwhite to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2E3A59] mb-4" data-testid="text-platform-heading">{t("pages.about.thePlatformAtAGlance")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, stat: "1,400+", label: "Clinical Lessons" },
                { icon: Target, stat: "3,700+", label: "Practice Questions" },
                { icon: GraduationCap, stat: "3", label: "Exam Pathways" },
                { icon: Clock, stat: "5", label: "Years in Development" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="border-[#BFA6F6]/10 text-center" data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <CardContent className="p-6">
                      <Icon className="w-8 h-8 text-[#BFA6F6] mx-auto mb-3" />
                      <p className="text-2xl font-bold text-[#2E3A59]">{s.stat}</p>
                      <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2E3A59] mb-4" data-testid="text-timeline-heading">{t("pages.about.ourJourney")}</h2>
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-[#BFA6F6]/20 hidden sm:block" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div key={m.year} className="flex gap-6 items-start" data-testid={`milestone-${m.year}`}>
                    <div className="relative z-10 w-16 h-16 rounded-full bg-[#BFA6F6]/10 flex items-center justify-center flex-shrink-0 border-2 border-[#BFA6F6]/20">
                      <span className="text-sm font-bold text-[#BFA6F6]">{m.year}</span>
                    </div>
                    <div className="pt-3">
                      <p className="text-gray-700 leading-relaxed">{m.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#BFA6F6]/5 to-[#AEE3E1]/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#2E3A59] mb-4" data-testid="text-cta-heading">{t("pages.about.startStudyingWithConfidence")}</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              Whether you are preparing for the REx-PN, NCLEX-RN, or NP certification, NurseNest gives you the tools to study smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LocaleLink href="/register">
                <Button size="lg" className="bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white px-8" data-testid="button-about-register">
                  Start Studying Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/contact">
                <Button size="lg" variant="outline" className="border-[#BFA6F6]/30 text-[#2E3A59] hover:bg-[#BFA6F6]/5 px-8" data-testid="button-about-contact">
                  Contact Us
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>

      <AdminEditButton pageName="about" />
      <Footer />
    </div>
  );
}
