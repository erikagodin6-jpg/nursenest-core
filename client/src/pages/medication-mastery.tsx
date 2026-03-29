import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { EducationalIntegrity } from "@/components/educational-integrity";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Pill,
  Heart,
  Brain,
  Gauge,
  Wind,
  Droplets,
  Syringe,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ShieldAlert,
  BookOpen,
  Zap,
  Target,
  Info,
  Lock,
  Sparkles,
  Bone,
  Stethoscope,
  ShieldCheck,
  Baby,
} from "lucide-react";
import { medications, moaCategories, medBodySystems } from "@/data/medications";
import type { Medication } from "@/data/medications-types";

import { useI18n } from "@/lib/i18n";
const systemIcons: Record<string, any> = {
  Cardiovascular: Heart,
  Respiratory: Wind,
  Neurological: Brain,
  Endocrine: Gauge,
  Renal: Droplets,
  Hematology: Syringe,
  Musculoskeletal: Bone,
  GI: Stethoscope,
  "Anti-infective": ShieldCheck,
  Maternity: Baby,
};

const severityConfig: Record<string, { bg: string; text: string }> = {
  common: { bg: "bg-gray-50", text: "text-gray-600" },
  serious: { bg: "bg-amber-50", text: "text-amber-700" },
  "life-threatening": { bg: "bg-red-50", text: "text-red-700" },
};

function MedCard({ med, isExpanded, onToggle }: { med: Medication; isExpanded: boolean; onToggle: () => void }) {
  const Icon = systemIcons[med.bodySystem] || Pill;

  return (
    <Card className="border border-gray-100 bg-white overflow-hidden" data-testid={`card-med-${med.id}`}>
      <div
        className="p-5 sm:p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary/70" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{med.genericName}</h3>
                <p className="text-xs text-gray-400">{med.brandNames.join(" / ")}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary font-semibold">
                {med.drugClass}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-medium">
                {med.moaCategory}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-medium">
                {med.bodySystem}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 mt-1">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {!isExpanded && (
          <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed">
            {med.mechanismOfAction.summary}
          </p>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="p-5 sm:p-6 space-y-6">
            <section>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="w-3.5 h-3.5" />
                Mechanism of Action
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{med.mechanismOfAction.summary}</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("pages.medicationMastery.receptorpathway")}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{med.mechanismOfAction.receptorPathway}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("pages.medicationMastery.cellularDetail")}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{med.mechanismOfAction.cellularDetail}</p>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t("pages.medicationMastery.indications")}</h4>
              <div className="flex flex-wrap gap-1.5">
                {med.indications.map((ind, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    {ind}
                  </span>
                ))}
              </div>
            </section>

            {med.blackBoxWarnings && med.blackBoxWarnings.length > 0 && (
              <section className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Black Box Warning
                </h4>
                {med.blackBoxWarnings.map((w, i) => (
                  <p key={i} className="text-sm text-red-800 leading-relaxed">{w}</p>
                ))}
              </section>
            )}

            <section>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Side Effects: Why They Happen
              </h4>
              <div className="space-y-2">
                {med.sideEffects.map((se, i) => {
                  const sev = severityConfig[se.severity];
                  return (
                    <div key={i} className={`rounded-lg p-3 ${sev.bg}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className={`text-sm font-semibold ${sev.text}`}>{se.effect}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${sev.text}`}>
                          {se.severity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{se.mechanism}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {med.keyInteractions && med.keyInteractions.length > 0 && (
              <section>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Key Drug Interactions
                </h4>
                <div className="space-y-2">
                  {med.keyInteractions.map((int, i) => (
                    <div key={i} className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-amber-800">{int.drug}</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">INTERACTION</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-1"><span className="font-semibold">{t("pages.medicationMastery.consequence")}</span> {int.consequence}</p>
                      <p className="text-xs text-gray-600"><span className="font-semibold">{t("pages.medicationMastery.mechanism")}</span> {int.mechanism}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                Nursing Considerations
              </h4>
              <div className="space-y-2">
                {med.nursingConsiderations.map((nc, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <ChevronRight className="w-3.5 h-3.5 text-primary/50 flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-700 leading-relaxed">{nc}</p>
                  </div>
                ))}
              </div>
            </section>

            {med.relatedLessons.length > 0 && (
              <section>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  Related Lessons
                </h4>
                <div className="flex flex-wrap gap-2">
                  {med.relatedLessons.map((lesson) => (
                    <LocaleLink key={lesson.id} href={`/lessons/${lesson.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full text-xs gap-1 h-7">
                        {lesson.title}
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </LocaleLink>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

const paidTiers = ["rpn", "rn", "np", "admin", "all_access"];

export default function MedicationMasteryPage() {
  const { t } = useI18n();
  const { user, effectiveTier } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMOA, setSelectedMOA] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [expandedMed, setExpandedMed] = useState<string | null>(null);
  const hasPaidAccess = paidTiers.includes(effectiveTier);

  const filteredMeds = useMemo(() => {
    return medications.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        m.genericName.toLowerCase().includes(q) ||
        m.brandNames.some((b) => b.toLowerCase().includes(q)) ||
        m.drugClass.toLowerCase().includes(q) ||
        m.indications.some((ind) => ind.toLowerCase().includes(q)) ||
        m.moaCategory.toLowerCase().includes(q);
      const matchesMOA = !selectedMOA || m.moaCategory === selectedMOA;
      const matchesSystem = !selectedSystem || m.bodySystem === selectedSystem;
      return matchesSearch && matchesMOA && matchesSystem;
    });
  }, [searchQuery, selectedMOA, selectedSystem]);

  if (!hasPaidAccess) {
    return (
      <div className={`min-h-screen bg-warmwhite flex flex-col font-sans ${user?.tier !== "admin" ? "select-none" : ""}`}>
        <SEO
          title={t("pages.medicationMastery.medicationMasteryMechanismfirstDrugExplorer")}
          description={t("pages.medicationMastery.understandMedicationsThroughTheirMechanisms")}
          keywords="medication mechanism of action, pharmacology nursing, drug side effects explained"
          canonicalPath="/medication-mastery"
          ogType="website"
        />
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <BreadcrumbNav />
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary/60" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.medicationMastery.medicationMastery")}</h1>
              <p className="text-lg text-gray-600 mb-2">{t("pages.medicationMastery.premiumInteractiveTool")}</p>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                The mechanism-first drug explorer is available exclusively for RPN, RN, and NP subscribers. Understand medications through their receptor pathways and predict clinical effects from first principles.
              </p>
              <LocaleLink href="/pricing">
                <Button className="rounded-full px-8 h-12 gap-2 bg-primary text-white hover:brightness-110 shadow-lg" data-testid="button-upgrade-med-mastery">
                  <Sparkles className="w-4 h-4" />
                  View Subscription Plans
                </Button>
              </LocaleLink>
              {!user && (
                <p className="text-xs text-gray-400 mt-4">
                  Already subscribed? <LocaleLink href="/login" className="text-primary hover:underline">{t("pages.medicationMastery.signIn")}</LocaleLink> to access.
                </p>
              )}
            </div>
          </div>
        </main>
        <AdminEditButton />
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-warmwhite flex flex-col font-sans ${user?.tier !== "admin" ? "select-none" : ""}`} onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}>
      <SEO
        title={t("pages.medicationMastery.medicationMasteryMechanismfirstDrugExplorer2")}
        description={t("pages.medicationMastery.understandMedicationsThroughTheirMechanisms2")}
        keywords="medication mechanism of action, pharmacology nursing, drug side effects explained, nursing pharmacology, drug interactions nursing"
        canonicalPath="/medication-mastery"
        ogType="website"
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav />
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Pill className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900" data-testid="text-page-title">
                Medication Mastery
              </h1>
              <p className="text-sm text-primary font-semibold uppercase tracking-wider mt-0.5">
                Mechanism-First Drug Explorer
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mt-4">
            Every side effect has a reason. Every drug interaction has a mechanism. Stop memorizing 
            disconnected facts: understand drugs through their receptor pathways and predict 
            clinical effects from first principles.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={t("pages.medicationMastery.searchByNameClassOr")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 bg-white"
              data-testid="input-search-meds"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSystem === null && selectedMOA === null ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => { setSelectedSystem(null); setSelectedMOA(null); }}
              data-testid="button-filter-all"
            >
              All
            </Button>
            {medBodySystems.map((sys) => {
              const Icon = systemIcons[sys] || Pill;
              return (
                <Button
                  key={sys}
                  variant={selectedSystem === sys ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs gap-1.5"
                  onClick={() => { setSelectedSystem(selectedSystem === sys ? null : sys); setSelectedMOA(null); }}
                  data-testid={`button-filter-${sys.toLowerCase()}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {sys}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {moaCategories.map((cat) => (
              <Button
                key={cat}
                variant={selectedMOA === cat ? "default" : "ghost"}
                size="sm"
                className="rounded-full text-xs"
                onClick={() => { setSelectedMOA(selectedMOA === cat ? null : cat); setSelectedSystem(null); }}
                data-testid={`button-filter-moa-${cat.toLowerCase().replace(/\s/g, '-')}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-6" data-testid="text-med-count">
          {filteredMeds.length} {filteredMeds.length === 1 ? "medication" : "medications"}
        </div>

        <div className="space-y-4">
          {filteredMeds.map((med) => (
            <MedCard
              key={med.id}
              med={med}
              isExpanded={expandedMed === med.id}
              onToggle={() => setExpandedMed(expandedMed === med.id ? null : med.id)}
            />
          ))}
        </div>

        {filteredMeds.length === 0 && (
          <div className="text-center py-20">
            <Pill className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{t("pages.medicationMastery.noMedicationsMatchYourSearch")}</p>
            <p className="text-gray-300 text-sm mt-1">{t("pages.medicationMastery.tryADifferentDrugName")}</p>
          </div>
        )}

        <div className="mt-12 p-6 bg-emerald-50 rounded-xl border border-emerald-200" data-testid="section-related-pharma-links">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Related Pharmacology Resources
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <LocaleLink href="/pharmacology">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer" data-testid="link-to-pharma-hub">
                <Pill className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium text-gray-900">{t("pages.medicationMastery.pharmacologyCrashCourse")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-auto shrink-0" />
              </div>
            </LocaleLink>
            <LocaleLink href="/herbal-supplements">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer" data-testid="link-to-herbal-hub">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium text-gray-900">{t("pages.medicationMastery.herbalSupplementsSafety")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-auto shrink-0" />
              </div>
            </LocaleLink>
            <LocaleLink href="/nclex-pharmacology">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer" data-testid="link-to-nclex-pharma">
                <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium text-gray-900">{t("pages.medicationMastery.nclexPharmacology")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-auto shrink-0" />
              </div>
            </LocaleLink>
          </div>
        </div>

        <EducationalIntegrity variant="footer" className="mt-16" />
      </main>
      <AdminEditButton />
      <Footer />
    </div>
  );
}
