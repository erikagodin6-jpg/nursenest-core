import { useState } from "react";
import { AlliedSEO } from "@/allied/allied-seo";
import { HubHero, ContentCard, FilterChip, FinalCTASection } from "./components";
import { FileText, Target } from "lucide-react";
import { paramedicQuestions } from "@/data/career-questions/paramedic-questions";

import { useI18n } from "@/lib/i18n";
const CATEGORIES = Array.from(new Set(paramedicQuestions.map(q => q.category))).sort();

const EXAM_SETS = [
  { title: "Full-Length Paramedic Mock Exam", description: "Complete timed exam covering all domains with adaptive difficulty. Blueprint-weighted to match your certification exam format.", difficulty: "Mixed", track: "All Tracks", badge: "Free + Pro", href: "/allied-health/paramedic/exam-launcher" },
  { title: "Trauma Management Practice Set", description: "50 questions focused on trauma assessment, hemorrhage control, and transport decisions. XABCDE primary survey, secondary survey, and field triage.", difficulty: "Intermediate", track: "PCP + ACP", badge: "Pro", href: "/qbank?career=paramedic&category=Trauma%20Management" },
  { title: "Cardiac & ACLS Practice Set", description: "Questions covering cardiac arrest algorithms, dysrhythmia recognition, 12-lead interpretation, and post-ROSC care.", difficulty: "Advanced", track: "ACP", badge: "Pro", href: "/qbank?career=paramedic&category=Cardiology%2FECG" },
  { title: "Medical Emergencies Practice Set", description: "Stroke recognition, sepsis management, diabetic emergencies, toxicology, and environmental emergencies.", difficulty: "Intermediate", track: "PCP + ACP", badge: "Pro", href: "/qbank?career=paramedic&category=Medical%20Emergencies" },
  { title: "Pharmacology Practice Set", description: "Drug dosages, mechanisms of action, contraindications, and clinical pharmacology across the paramedic formulary.", difficulty: "Intermediate", track: "PCP + ACP", badge: "Pro", href: "/qbank?career=paramedic&category=Pharmacology" },
  { title: "Pediatric & OB Emergencies Set", description: "Pediatric assessment, PALS algorithms, neonatal resuscitation, and obstetric emergency management.", difficulty: "Advanced", track: "ACP", badge: "Pro", href: "/qbank?career=paramedic&category=Pediatric%20Emergencies" },
  { title: "Airway Management Practice Set", description: "Basic and advanced airway techniques, RSI pharmacology, difficult airway algorithms, and ventilator management.", difficulty: "Mixed", track: "PCP + ACP", badge: "Pro", href: "/qbank?career=paramedic&category=Airway%20Management" },
  { title: "Operations & EMS Systems Set", description: "MCI management, triage systems, communication, documentation, and EMS system operations.", difficulty: "Foundational", track: "All Tracks", badge: "Pro", href: "/qbank?career=paramedic&category=Operations%2FEMS%20Systems" },
];

const DIFFICULTY_FILTERS = ["All", "Foundational", "Intermediate", "Advanced", "Mixed"];
const TRACK_FILTERS = ["All Tracks", "PCP", "ACP", "PCP + ACP"];

export default function ParamedicExamsHub() {
  const { t } = useI18n();
  const [diffFilter, setDiffFilter] = useState("All");
  const [trackFilter, setTrackFilter] = useState("All Tracks");

  const filtered = EXAM_SETS.filter(e => {
    const matchDiff = diffFilter === "All" || e.difficulty === diffFilter;
    const matchTrack = trackFilter === "All Tracks" || e.track.includes(trackFilter);
    return matchDiff && matchTrack;
  });

  return (
    <div data-testid="paramedic-exams-hub">
      <AlliedSEO
        title={t("allied.paramedicParamedicExamsHub.paramedicPracticeExamsMockTests")}
        description={t("allied.paramedicParamedicExamsHub.takeFulllengthParamedicMockExams")}
        keywords="paramedic practice exam, paramedic mock exam, NREMT practice test, paramedic test prep, EMS mock exam, paramedic certification exam"
        canonicalPath="/allied-health/paramedic/exams"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Paramedic Practice Exams",
          "description": "Full-length paramedic mock exams and domain-specific practice sets with blueprint weighting and adaptive difficulty.",
          "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" }
        }}
      />

      <HubHero
        title={t("allied.paramedicParamedicExamsHub.paramedicPracticeExams")}
        subtitle={t("allied.paramedic_exams_hub.fulllengthMockExamsAndFocused")}
        breadcrumbs={[
          { label: "Paramedic", href: "/allied-health/paramedic" },
          { label: "Exams" },
        ]}
      />

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t("allied.paramedicParamedicExamsHub.difficulty")}</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_FILTERS.map(f => (
                <FilterChip key={f} label={f} active={diffFilter === f} onClick={() => setDiffFilter(f)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t("allied.paramedicParamedicExamsHub.track")}</p>
            <div className="flex flex-wrap gap-2">
              {TRACK_FILTERS.map(f => (
                <FilterChip key={f} label={f} active={trackFilter === f} onClick={() => setTrackFilter(f)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm text-gray-500">{filtered.length} practice exams available · {paramedicQuestions.length} total questions across {CATEGORIES.length} categories</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(exam => (
              <ContentCard
                key={exam.title}
                title={exam.title}
                description={exam.description}
                meta={`${exam.difficulty} · ${exam.track}`}
                href={exam.href}
                badge={exam.badge}
                icon={FileText}
              />
            ))}
          </div>
        </div>
      </section>

      <FinalCTASection
        title={t("allied.paramedicParamedicExamsHub.readyToTestYourParamedic")}
        subtitle={t("allied.paramedic_exams_hub.startWithAFreeDiagnostic")}
        primaryCTA={{ label: "Start Free Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "View Pricing", href: "/allied-health/pricing" }}
      />
    </div>
  );
}
