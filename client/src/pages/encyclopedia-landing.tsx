import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Heart, Wind, Microscope, Radio, Users, Activity,
  ArrowRight, GraduationCap, Stethoscope, Pill, Siren, Ambulance
} from "lucide-react";
import { ENCYCLOPEDIA_PROFESSIONS } from "@shared/schema";

import { useI18n } from "@/lib/i18n";
interface ProfessionStats {
  profession: string;
  entryCount: number;
  publishedCount: number;
  categories: string[];
}

const PROFESSION_ICONS: Record<string, typeof Heart> = {
  nursing: Heart,
  paramedic: Ambulance,
  "pharmacy-tech": Pill,
  rrt: Wind,
  mlt: Microscope,
  imaging: Radio,
  "social-worker": Users,
  "critical-care": Activity,
  "emergency-nursing": Siren,
};

const PROFESSION_COLORS: Record<string, string> = {
  nursing: "from-rose-500 to-pink-500",
  paramedic: "from-orange-500 to-red-500",
  "pharmacy-tech": "from-emerald-500 to-green-500",
  rrt: "from-cyan-500 to-blue-500",
  mlt: "from-purple-500 to-indigo-500",
  imaging: "from-blue-500 to-indigo-500",
  "social-worker": "from-teal-500 to-cyan-500",
  "critical-care": "from-red-500 to-rose-500",
  "emergency-nursing": "from-amber-500 to-orange-500",
};

const PROFESSION_BG: Record<string, string> = {
  nursing: "bg-rose-50 border-rose-200 hover:border-rose-400",
  paramedic: "bg-orange-50 border-orange-200 hover:border-orange-400",
  "pharmacy-tech": "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
  rrt: "bg-cyan-50 border-cyan-200 hover:border-cyan-400",
  mlt: "bg-purple-50 border-purple-200 hover:border-purple-400",
  imaging: "bg-blue-50 border-blue-200 hover:border-blue-400",
  "social-worker": "bg-teal-50 border-teal-200 hover:border-teal-400",
  "critical-care": "bg-red-50 border-red-200 hover:border-red-400",
  "emergency-nursing": "bg-amber-50 border-amber-200 hover:border-amber-400",
};

export default function EncyclopediaLandingPage() {
  const { t } = useI18n();
  const { data: professionStats } = useQuery<ProfessionStats[]>({
    queryKey: ["/api/encyclopedia/professions"],
    queryFn: async () => {
      const res = await fetch("/api/encyclopedia/professions");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const statsMap = new Map<string, ProfessionStats>();
  if (professionStats) {
    for (const s of professionStats) {
      statsMap.set(s.profession, s);
    }
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "NurseNest Encyclopedia",
    description: "Comprehensive clinical encyclopedias for healthcare professionals including nursing, paramedicine, pharmacy, respiratory therapy, and more.",
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    hasPart: ENCYCLOPEDIA_PROFESSIONS.map(p => ({
      "@type": "CollectionPage",
      name: `${p.label} Encyclopedia`,
      url: `https://www.nursenest.ca/${p.slug}-encyclopedia`,
    })),
  };

  return (
    <>
      <Navigation />
      <SEO
        title={t("pages.encyclopediaLanding.healthcareEncyclopediaClinicalReferenceFor")}
        description={t("pages.encyclopediaLanding.exploreComprehensiveClinicalEncyclopediasFor")}
        keywords="healthcare encyclopedia, nursing encyclopedia, clinical reference, medical terminology, exam prep, paramedic encyclopedia, pharmacy tech reference"
        canonicalPath="/encyclopedia"
        structuredData={collectionSchema}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Encyclopedia", url: "https://www.nursenest.ca/encyclopedia" },
        ]}
      />

      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "/" },
              { name: "Encyclopedia", url: "" },
            ]}
          />

          <section className="text-center py-12 sm:py-16" data-testid="section-hero">
            <div className="inline-flex items-center gap-2 text-sm text-primary font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>{t("pages.encyclopediaLanding.clinicalKnowledgeBase")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }} data-testid="heading-landing-title">
              NurseNest Encyclopedia
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed" data-testid="text-landing-description">
              Comprehensive, evidence-based clinical reference encyclopedias for healthcare professionals.
              Every topic covers assessment, management, clinical pearls, and exam preparation.
            </p>
          </section>

          <section className="py-8" data-testid="section-professions">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Browse by Profession
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ENCYCLOPEDIA_PROFESSIONS.map(prof => {
                const Icon = PROFESSION_ICONS[prof.slug] || BookOpen;
                const stats = statsMap.get(prof.slug);
                const colorBg = PROFESSION_BG[prof.slug] || "bg-gray-50 border-gray-200 hover:border-gray-400";
                const gradientColor = PROFESSION_COLORS[prof.slug] || "from-gray-500 to-gray-600";

                return (
                  <Link
                    key={prof.slug}
                    href={`/${prof.slug}-encyclopedia`}
                    className={`group block border rounded-xl p-5 transition-all hover:shadow-md ${colorBg}`}
                    data-testid={`card-profession-${prof.slug}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
                          {prof.label}
                        </h3>
                        {stats ? (
                          <p className="text-sm text-gray-500">
                            {stats.publishedCount} topic{stats.publishedCount !== 1 ? "s" : ""} · {stats.categories?.length || 0} categor{(stats.categories?.length || 0) !== 1 ? "ies" : "y"}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400">{t("pages.encyclopediaLanding.comingSoon")}</p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary mt-1 shrink-0 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="py-12" data-testid="section-features">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              What Every Entry Includes
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Stethoscope, title: "Clinical Overview", desc: "Clear, concise explanations of pathophysiology, etiology, and clinical significance." },
                { icon: Activity, title: "Signs & Assessment", desc: "Key signs, symptoms, and assessment strategies with clinical reasoning." },
                { icon: GraduationCap, title: "Exam Preparation", desc: "Clinical pearls, common exam pitfalls, and frequently tested concepts." },
                { icon: BookOpen, title: "Management Guide", desc: "Evidence-based management, interventions, and pharmacological treatments." },
                { icon: Users, title: "Cross-Profession Links", desc: "See how topics connect across different healthcare professions." },
                { icon: ArrowRight, title: "Related Content", desc: "Direct links to practice questions, flashcards, and study materials." },
              ].map((feature, i) => (
                <div key={i} className="text-center p-4" data-testid={`feature-${i}`}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-8">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 text-center" data-testid="section-cta">
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Start Your Exam Preparation
              </h3>
              <p className="text-gray-600 mb-4">
                Combine encyclopedia knowledge with practice questions, flashcards, and mock exams.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/start-free">
                  <Button data-testid="button-cta-start-free">{t("pages.encyclopediaLanding.getStartedFree")}</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" data-testid="button-cta-pricing">{t("pages.encyclopediaLanding.viewPlans")}</Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
