import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import {
  Leaf,
  AlertTriangle,
  Droplets,
  Brain,
  Shield,
  Pill,
  Heart,
  ArrowRight,
  BookOpen,
  Scissors,
  Baby,
  Beaker,
  Activity,
  Gauge,
  FileText,
  Target,
  Lightbulb,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

const bleedingRiskHerbs = [
  { id: "ginkgo-biloba", name: "Ginkgo Biloba", mechanism: "PAF antagonism", stop: "2 weeks pre-op" },
  { id: "garlic-supplement", name: "Garlic (Allium sativum)", mechanism: "Thromboxane inhibition", stop: "7–10 days pre-op" },
  { id: "ginseng-supplement", name: "Ginseng (Panax ginseng)", mechanism: "Platelet aggregation inhibition", stop: "7 days pre-op" },
  { id: "omega-3-fatty-acids", name: "Omega-3 / Fish Oil", mechanism: "Reduced TXA2 at >3 g/day", stop: "7 days pre-op" },
  { id: "turmeric-curcumin", name: "Turmeric / Curcumin", mechanism: "Thromboxane inhibition (high dose)", stop: "2 weeks pre-op" },
  { id: "cranberry-supplement", name: "Cranberry", mechanism: "CYP2C9 inhibition → ↑warfarin", stop: "Moderate intake" },
  { id: "chamomile-supplement", name: "Chamomile", mechanism: "Coumarin content → ↑warfarin", stop: "7 days pre-op" },
];

const cnsDepressantHerbs = [
  { id: "valerian-root", name: "Valerian Root", mechanism: "GABA-A receptor agonist — taper, do not abrupt stop", risk: "Additive with benzodiazepines" },
  { id: "kava-supplement", name: "Kava", mechanism: "GABA-A + sodium channel blockade", risk: "Hepatotoxicity + CNS depression" },
  { id: "chamomile-supplement", name: "Chamomile", mechanism: "Apigenin → GABA-A binding", risk: "Mild additive sedation" },
  { id: "melatonin-supplement", name: "Melatonin", mechanism: "MT1/MT2 receptor agonist", risk: "Additive with sedatives" },
];

const cyp450Herbs = [
  { id: "st-johns-wort", name: "St. John's Wort", effect: "Induces CYP3A4, CYP2C9, CYP1A2, P-gp", drugs: "Warfarin, cyclosporine, OCs, digoxin, HIV PIs" },
  { id: "cranberry-supplement", name: "Cranberry", effect: "Inhibits CYP2C9", drugs: "Warfarin (↑INR)" },
  { id: "echinacea-supplement", name: "Echinacea", effect: "Inhibits intestinal CYP3A4", drugs: "Cyclosporine, some statins" },
  { id: "garlic-supplement", name: "Garlic", effect: "Induces CYP3A4 (variable)", drugs: "Saquinavir (↓50%)" },
];

const bpBloodSugarHerbs = [
  { id: "ginseng-supplement", name: "Ginseng (Panax ginseng)", effect: "Lowers blood glucose; variable BP effects", risk: "Additive hypoglycemia with insulin/sulfonylureas" },
  { id: "garlic-supplement", name: "Garlic (Allium sativum)", effect: "Mild BP reduction", risk: "Additive hypotension with antihypertensives" },
  { id: "ginkgo-biloba", name: "Ginkgo Biloba", effect: "May lower blood pressure", risk: "Additive with antihypertensives" },
  { id: "evening-primrose-oil", name: "Evening Primrose Oil", effect: "May lower blood pressure", risk: "Monitor BP with antihypertensives" },
];

const specialPopulationHerbs = [
  { id: "echinacea-supplement", name: "Echinacea", concern: "Immune stimulant — contraindicated in transplant & autoimmune patients" },
  { id: "melatonin-supplement", name: "Melatonin", concern: "Immunostimulatory — avoid in transplant recipients" },
  { id: "saw-palmetto", name: "Saw Palmetto", concern: "Anti-androgenic — contraindicated in pregnancy; may affect PSA screening" },
  { id: "black-cohosh", name: "Black Cohosh", concern: "Hepatotoxicity risk — limit use to 6 months; LFT monitoring" },
  { id: "evening-primrose-oil", name: "Evening Primrose Oil", concern: "Lowers seizure threshold — avoid in epilepsy & with phenothiazines" },
  { id: "kava-supplement", name: "Kava", concern: "Hepatotoxic — banned in several countries; never combine with alcohol" },
];

const seoPages = [
  { slug: "herbal-supplements-that-interact-with-medications", title: "Herbal Supplements That Interact with Medications" },
  { slug: "herbal-supplements-nurses-should-ask-patients-about", title: "Herbal Supplements Nurses Should Ask About" },
  { slug: "common-herbal-supplement-drug-interactions", title: "Common Herbal Supplement Drug Interactions" },
  { slug: "patient-teaching-about-herbal-supplements", title: "Patient Teaching About Herbal Supplements" },
  { slug: "herbal-supplements-that-increase-bleeding-risk", title: "Herbal Supplements That Increase Bleeding Risk" },
];

export default function HerbalSupplementsHub() {
  const { t } = useI18n();
  const [, navigate] = useLocation();

  return (
    <>
      <SEO
        title={t("pages.herbalSupplementsHub.herbalSupplementsMedicationInteractionsNur")}
        description={t("pages.herbalSupplementsHub.comprehensiveNursingGuideToHerbal")}
        keywords="herbal supplements nursing, herb drug interactions, 4 Gs bleeding herbs, herbal medication safety, NCLEX pharmacology"
        canonicalPath="/lessons/herbal-supplements-hub"
      />
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white py-16 lg:py-20" data-testid="herbal-hub-hero">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <button onClick={() => navigate("/")} className="hover:text-white/80 transition-colors">{t("pages.herbalSupplementsHub.home")}</button>
              <span>/</span>
              <button onClick={() => navigate("/pharmacology")} className="hover:text-white/80 transition-colors">{t("pages.herbalSupplementsHub.pharmacology")}</button>
              <span>/</span>
              <span className="text-white/90">{t("pages.herbalSupplementsHub.herbalSupplements")}</span>
            </nav>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600/30 flex items-center justify-center shrink-0">
                <Leaf className="w-8 h-8 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight" data-testid="text-hub-title">
                  Herbal Supplements & Medication Safety
                </h1>
                <p className="text-white/70 text-lg mt-2 max-w-3xl">
                  Comprehensive nursing guide to herbal supplement interactions, perioperative safety, and patient education. Master the content tested on NCLEX-RN, REx-PN, and NP board exams.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              <div className="bg-white/10 rounded-xl p-3 text-center" data-testid="stat-lessons">
                <div className="text-2xl font-bold">15</div>
                <div className="text-xs text-white/70">{t("pages.herbalSupplementsHub.herbLessons")}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center" data-testid="stat-questions">
                <div className="text-2xl font-bold">75+</div>
                <div className="text-xs text-white/70">{t("pages.herbalSupplementsHub.practiceQuestions")}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center" data-testid="stat-interactions">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-xs text-white/70">{t("pages.herbalSupplementsHub.drugInteractions")}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center" data-testid="stat-guides">
                <div className="text-2xl font-bold">5</div>
                <div className="text-xs text-white/70">{t("pages.herbalSupplementsHub.seoGuides")}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
          <section data-testid="section-key-concept">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">{t("pages.herbalSupplementsHub.keyExamConceptThe4")}</h3>
                    <p className="text-amber-800 leading-relaxed">
                      <strong>{t("pages.herbalSupplementsHub.ginkgoGarlicGingerGinseng")}</strong> — all increase bleeding risk through platelet aggregation inhibition.
                      Report use to the surgical team preoperatively and to the prescriber in anticoagulated patients.
                      All should be discontinued before elective surgery per ASA guidelines.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section data-testid="section-most-dangerous">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.mostDangerousStJohnsWort")}</h2>
            </div>
            <LocaleLink href="/lessons/st-johns-wort">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <Leaf className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900" data-testid="text-sjw-title">{t("pages.herbalSupplementsHub.stJohnsWortHypericumPerforatum")}</h3>
                      <p className="text-gray-600 mt-1 leading-relaxed">
                        The single most dangerous herbal supplement for drug interactions. Induces CYP3A4, CYP2C9, CYP1A2, and P-glycoprotein — affects ~50% of all prescribed medications.
                        Causes serotonin syndrome with SSRIs and transplant rejection by reducing cyclosporine levels.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">{t("pages.herbalSupplementsHub.cyp3a4Inducer")}</span>
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">{t("pages.herbalSupplementsHub.serotoninSyndrome")}</span>
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">{t("pages.herbalSupplementsHub.transplantRejection")}</span>
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">{t("pages.herbalSupplementsHub.contraceptiveFailure")}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 shrink-0 mt-2" />
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
          </section>

          <section data-testid="section-bleeding-risk">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-rose-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.bleedingRiskHerbs")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bleedingRiskHerbs.map((herb) => (
                <LocaleLink key={herb.id} href={`/lessons/${herb.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-bleeding-${herb.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Droplets className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm">{herb.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{herb.mechanism}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-medium">
                            {herb.stop}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>

          <section data-testid="section-cns-depressants">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.sedativeCnsDepressantHerbs")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cnsDepressantHerbs.map((herb) => (
                <LocaleLink key={herb.id} href={`/lessons/${herb.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-cns-${herb.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Brain className="w-4 h-4 text-purple-500 mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm">{herb.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{herb.mechanism}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                            {herb.risk}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>

          <section data-testid="section-cyp450">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Beaker className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.cyp450EnzymeInteractions")}</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {cyp450Herbs.map((herb) => (
                <LocaleLink key={herb.id} href={`/lessons/${herb.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-cyp-${herb.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Beaker className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{herb.name}</h3>
                          <p className="text-xs text-blue-600 font-medium mt-0.5">{herb.effect}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Affected drugs: {herb.drugs}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>

          <section data-testid="section-bp-blood-sugar">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.bloodPressureBloodSugarEffects")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bpBloodSugarHerbs.map((herb) => (
                <LocaleLink key={herb.id} href={`/lessons/${herb.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-bp-bs-${herb.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Activity className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm">{herb.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{herb.effect}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                            {herb.risk}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>

          <section data-testid="section-special-populations">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.specialPopulationConcerns")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specialPopulationHerbs.map((herb) => (
                <LocaleLink key={herb.id} href={`/lessons/${herb.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-special-${herb.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm">{herb.name}</h3>
                          <p className="text-xs text-gray-600 mt-0.5">{herb.concern}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>

          <section data-testid="section-surgery">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.surgeryAnesthesiaSafety")}</h2>
            </div>
            <LocaleLink href="/lessons/surgery-anesthesia-herbal-safety">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-indigo-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <Scissors className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900" data-testid="text-surgery-title">{t("pages.herbalSupplementsHub.surgeryAnesthesiaHerbalSupplementSafety")}</h3>
                      <p className="text-gray-600 mt-1 leading-relaxed">
                        ASA guidelines for perioperative herbal discontinuation. Covers bleeding risk assessment, anesthesia interactions,
                        preoperative screening protocols, and specific timelines for each supplement category.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">{t("pages.herbalSupplementsHub.asaGuidelines")}</span>
                        <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">{t("pages.herbalSupplementsHub.preopTimelines")}</span>
                        <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">{t("pages.herbalSupplementsHub.anesthesiaSafety")}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 shrink-0 mt-2" />
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
          </section>

          <section data-testid="section-documentation-teaching">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.documentationPatientTeaching")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card className="border-teal-200" data-testid="card-doc-reconciliation">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{t("pages.herbalSupplementsHub.medicationReconciliation")}</h3>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" /><span>{t("pages.herbalSupplementsHub.askOpenendedWhatSupplementsVitamins")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" /><span>{t("pages.herbalSupplementsHub.includeTeasTopicalProductsAnd")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" /><span>{t("pages.herbalSupplementsHub.useCulturallySensitiveNonjudgmentalLanguage")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" /><span>{t("pages.herbalSupplementsHub.screenForThe4Gs")}</span></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-teal-200" data-testid="card-doc-documentation">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{t("pages.herbalSupplementsHub.whatToDocument")}</h3>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" /><span>{t("pages.herbalSupplementsHub.specificProductNamesDosesFrequency")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" /><span>{t("pages.herbalSupplementsHub.reasonForUseAndDuration")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" /><span>{t("pages.herbalSupplementsHub.flagIdentifiedInteractionsForPrescriber")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" /><span>{t("pages.herbalSupplementsHub.updateMedicationListAtEvery")}</span></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section data-testid="section-exam-highyield">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.highyieldExamPoints")}</h2>
            </div>
            <div className="space-y-3">
              <Card className="border-red-200 bg-red-50/30" data-testid="card-highyield-sjw">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-red-900 text-sm">{t("pages.herbalSupplementsHub.examTrapStJohnsWort")}</h3>
                      <p className="text-xs text-red-800 mt-1">{t("pages.herbalSupplementsHub.stJohnsWortIsThe")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-amber-200 bg-amber-50/30" data-testid="card-highyield-4gs">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-amber-900 text-sm">{t("pages.herbalSupplementsHub.examTipThe4Gs")}</h3>
                      <p className="text-xs text-amber-800 mt-1">{t("pages.herbalSupplementsHub.ginkgoGarlicGingerGinsengAll")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-blue-50/30" data-testid="card-highyield-preop">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-blue-900 text-sm">{t("pages.herbalSupplementsHub.commonMistakePreopSupplementTiming")}</h3>
                      <p className="text-xs text-blue-800 mt-1">{t("pages.herbalSupplementsHub.asaRecommendsStoppingAllHerbals")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-purple-200 bg-purple-50/30" data-testid="card-highyield-disclosure">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-purple-900 text-sm">{t("pages.herbalSupplementsHub.examTrapPatientNondisclosure")}</h3>
                      <p className="text-xs text-purple-800 mt-1">{t("pages.herbalSupplementsHub.over50OfAdultsUse")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section data-testid="section-pharmacology-links">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Pill className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.relatedPharmacologyResources")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <LocaleLink href="/pharmacology">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid="link-pharma-hub">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Pill className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{t("pages.herbalSupplementsHub.pharmacologyCrashCourse")}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{t("pages.herbalSupplementsHub.5dayIntensiveCoveringAllDrug")}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </LocaleLink>
              <LocaleLink href="/medication-mastery">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid="link-med-mastery">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Beaker className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{t("pages.herbalSupplementsHub.medicationMastery")}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{t("pages.herbalSupplementsHub.mechanismfirstDrugExplorer")}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </LocaleLink>
              <LocaleLink href="/nclex-pharmacology">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid="link-nclex-pharma">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{t("pages.herbalSupplementsHub.nclexPharmacology")}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{t("pages.herbalSupplementsHub.examfocusedDrugReview")}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </LocaleLink>
            </div>
          </section>

          <section data-testid="section-seo-guides">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementsHub.educationalGuides")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {seoPages.map((page) => (
                <LocaleLink key={page.slug} href={`/herbal-supplements/${page.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-seo-${page.slug}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{page.title}</h3>
                          <p className="text-xs text-emerald-600 mt-1">{t("pages.herbalSupplementsHub.readGuide")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl p-8 text-white text-center" data-testid="section-cta">
            <h2 className="text-2xl font-bold mb-3">{t("pages.herbalSupplementsHub.readyToMasterHerbalSupplement")}</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Access all 15 herb lessons, 75+ practice questions, and clinical simulations. Prepare with confidence for your nursing exam.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6"
                onClick={() => navigate("/pricing")}
                data-testid="button-cta-pricing"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-6"
                onClick={() => navigate("/free-practice")}
                data-testid="button-cta-practice"
              >
                Try Free Practice Questions
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
