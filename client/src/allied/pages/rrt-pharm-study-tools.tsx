import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronRight, AlertTriangle, Brain, Zap, BookOpen, Lock,
  ChevronDown, ChevronUp, Pill, Shield, Lightbulb, Clock,
  CheckCircle2, XCircle, Star, ArrowRight
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  HIGH_YIELD_SIDE_EFFECTS,
  BRONCHODILATOR_VS_CONTROLLER,
  DELIVERY_DEVICE_COMPARISON,
  TMC_PHARM_TRAPS,
  PHARM_MNEMONICS,
  ONE_MINUTE_REVIEW_CARDS,
} from "@/data/rrt-pharm-study-tools";

const FREE_TRAP_LIMIT = 5;
const FREE_MNEMONIC_LIMIT = 4;
const FREE_REVIEW_LIMIT = 4;
const FREE_SIDE_EFFECT_LIMIT = 5;

function PremiumBanner() {
  const { t } = useI18n();
  return (
    <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white text-center" data-testid="premium-banner">
      <Lock className="w-6 h-6 mx-auto mb-2 opacity-80" />
      <h3 className="text-lg font-bold mb-1">{t("allied.rrtPharmStudyTools.unlockAllStudyTools")}</h3>
      <p className="text-blue-100 text-sm mb-3">{t("allied.rrtPharmStudyTools.getFullAccessToAll")}</p>
      <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors" data-testid="link-upgrade-premium">
        Upgrade to Pro <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function Breadcrumb({ current }: { current: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap" aria-label={t("allied.rrtPharmStudyTools.breadcrumb")} data-testid="breadcrumb-nav">
      <Link href="/allied-health" className="hover:text-teal-600">{t("allied.rrtPharmStudyTools.alliedHealth")}</Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <Link href="/allied-health/rrt" className="hover:text-teal-600">RRT</Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <Link href="/allied-health/rrt/pharmacology" className="hover:text-teal-600">{t("allied.rrtPharmStudyTools.pharmacology")}</Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <span className="text-blue-700 font-medium">{current}</span>
    </nav>
  );
}

export function RrtPharmQuickSheets() {
  return (
    <div data-testid="rrt-pharm-quick-sheets">
      <AlliedSEO
        title={t("allied.rrtPharmStudyTools.rrtPharmacologyQuickSheetsHighyield")}
        description={t("allied.rrtPharmStudyTools.highyieldRespiratoryPharmacologyQuickReferenc")}
        keywords="RRT pharmacology quick sheet, respiratory drug side effects, bronchodilator vs controller, inhaler comparison chart, NBRC TMC pharmacology review"
        canonicalPath="/allied-health/rrt/pharmacology/quick-sheets"
      />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <Breadcrumb current="Quick Sheets" />

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3" data-testid="badge-quick-sheets">
            <Zap className="w-4 h-4" />
            High-Yield Quick Sheets
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" data-testid="text-page-title">
            Pharmacology Quick Reference
          </h1>
          <p className="text-gray-600">{t("allied.rrtPharmStudyTools.essentialComparisonChartsAndSideeffect")}</p>
        </div>

        <section className="mb-12" data-testid="section-side-effects">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            High-Yield Side Effects Chart
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden" data-testid="table-side-effects">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b">{t("allied.rrtPharmStudyTools.medication")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b">{t("allied.rrtPharmStudyTools.keySideEffects")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b hidden sm:table-cell">{t("allied.rrtPharmStudyTools.clinicalTip")}</th>
                </tr>
              </thead>
              <tbody>
                {HIGH_YIELD_SIDE_EFFECTS.map((entry, i) => {
                  const isLocked = i >= FREE_SIDE_EFFECT_LIMIT;
                  return (
                    <tr key={i} className={`border-b border-gray-100 ${isLocked ? "opacity-40 blur-[2px] select-none" : ""}`} data-testid={`row-side-effect-${i}`}>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{entry.drug}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {entry.sideEffects.map((se, j) => (
                            <span key={j} className="inline-block px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs">{se}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{entry.clinicalTip}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {HIGH_YIELD_SIDE_EFFECTS.length > FREE_SIDE_EFFECT_LIMIT && <PremiumBanner />}
        </section>

        <section className="mb-12" data-testid="section-bronchodilator-comparison">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-500" />
            Bronchodilator vs Controller Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden" data-testid="table-broncho-vs-controller">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b">{t("allied.rrtPharmStudyTools.feature")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-blue-700 border-b">{t("allied.rrtPharmStudyTools.bronchodilatorReliever")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-indigo-700 border-b">{t("allied.rrtPharmStudyTools.controllerMaintenance")}</th>
                </tr>
              </thead>
              <tbody>
                {BRONCHODILATOR_VS_CONTROLLER.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100" data-testid={`row-comparison-${i}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.feature}</td>
                    <td className="px-4 py-3 text-gray-700">{row.bronchodilator}</td>
                    <td className="px-4 py-3 text-gray-700">{row.controller}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section data-testid="section-delivery-devices">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-500" />
            Inhaled Drug Delivery Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden" data-testid="table-delivery-devices">
              <thead>
                <tr className="bg-cyan-50">
                  <th className="text-left px-3 py-3 font-semibold text-gray-700 border-b">{t("allied.rrtPharmStudyTools.device")}</th>
                  <th className="text-left px-3 py-3 font-semibold text-gray-700 border-b">{t("allied.rrtPharmStudyTools.particleSize")}</th>
                  <th className="text-left px-3 py-3 font-semibold text-gray-700 border-b">{t("allied.rrtPharmStudyTools.lungDeposition")}</th>
                  <th className="text-left px-3 py-3 font-semibold text-gray-700 border-b hidden md:table-cell">{t("allied.rrtPharmStudyTools.advantages")}</th>
                  <th className="text-left px-3 py-3 font-semibold text-gray-700 border-b hidden lg:table-cell">{t("allied.rrtPharmStudyTools.bestFor")}</th>
                </tr>
              </thead>
              <tbody>
                {DELIVERY_DEVICE_COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100" data-testid={`row-device-${i}`}>
                    <td className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap">{row.device}</td>
                    <td className="px-3 py-3 text-gray-700">{row.particleSize}</td>
                    <td className="px-3 py-3 text-gray-700">{row.lungDeposition}</td>
                    <td className="px-3 py-3 text-gray-600 hidden md:table-cell">{row.advantages}</td>
                    <td className="px-3 py-3 text-gray-600 hidden lg:table-cell">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link href="/allied-health/rrt/pharmacology" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700" data-testid="link-back-hub">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Pharmacology Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RrtPharmTraps() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div data-testid="rrt-pharm-traps">
      <AlliedSEO
        title={t("allied.rrtPharmStudyTools.topTmcPharmacologyTrapsCommon")}
        description={t("allied.rrtPharmStudyTools.avoidTheMostCommonPharmacology")}
        keywords="TMC pharmacology traps, RRT exam mistakes, NBRC common errors, respiratory therapy exam tips, TMC pharmacology pitfalls"
        canonicalPath="/allied-health/rrt/pharmacology/traps"
      />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Breadcrumb current="TMC Traps" />

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-3" data-testid="badge-traps">
            <AlertTriangle className="w-4 h-4" />
            Exam Pitfalls
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" data-testid="text-page-title">
            Top TMC Pharmacology Traps
          </h1>
          <p className="text-gray-600">The {TMC_PHARM_TRAPS.length} most commonly tested exam pitfalls — know these to avoid losing easy points.</p>
        </div>

        <div className="space-y-4">
          {TMC_PHARM_TRAPS.map((trap, i) => {
            const isLocked = i >= FREE_TRAP_LIMIT;
            const isExpanded = expandedId === trap.id;

            if (isLocked) {
              return (
                <div key={trap.id} className="bg-gray-50 rounded-xl border border-gray-200 p-5 opacity-50 blur-[1px]" data-testid={`trap-card-${trap.id}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-medium">Trap #{trap.id}</span>
                      <h3 className="font-semibold text-gray-700">{trap.trap}</h3>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={trap.id} className="bg-white rounded-xl border border-gray-200 hover:border-red-200 transition-colors" data-testid={`trap-card-${trap.id}`}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : trap.id)}
                  className="w-full p-5 text-left flex items-start gap-3"
                  data-testid={`button-toggle-trap-${trap.id}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 font-bold text-sm">#{trap.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium mb-1">{trap.category}</span>
                    <h3 className="font-semibold text-gray-900">{trap.trap}</h3>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3" data-testid={`trap-detail-${trap.id}`}>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-red-600 uppercase">{t("allied.rrtPharmStudyTools.wrongAnswer")}</span>
                        <p className="text-gray-700 text-sm">{trap.wrongAnswer}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-green-600 uppercase">{t("allied.rrtPharmStudyTools.correctAnswer")}</span>
                        <p className="text-gray-700 text-sm">{trap.correctAnswer}</p>
                      </div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-900">
                      <strong>{t("allied.rrtPharmStudyTools.why")}</strong> {trap.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {TMC_PHARM_TRAPS.length > FREE_TRAP_LIMIT && <PremiumBanner />}

        <div className="mt-10 text-center">
          <Link href="/allied-health/rrt/pharmacology" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700" data-testid="link-back-hub">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Pharmacology Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RrtPharmMnemonics() {
  return (
    <div data-testid="rrt-pharm-mnemonics">
      <AlliedSEO
        title={t("allied.rrtPharmStudyTools.rrtPharmacologyMnemonicsMemoryAids")}
        description={t("allied.rrtPharmStudyTools.masterRespiratoryPharmacologyWithProven")}
        keywords="RRT mnemonics, respiratory therapy memory aids, TMC exam mnemonics, pharmacology mnemonics, NBRC study aids"
        canonicalPath="/allied-health/rrt/pharmacology/mnemonics"
      />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Breadcrumb current="Mnemonics" />

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-3" data-testid="badge-mnemonics">
            <Brain className="w-4 h-4" />
            Memory Aids
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" data-testid="text-page-title">
            Pharmacology Mnemonics
          </h1>
          <p className="text-gray-600">{PHARM_MNEMONICS.length} proven memory aids to lock in key pharmacology concepts for exam day.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PHARM_MNEMONICS.map((m, i) => {
            const isLocked = i >= FREE_MNEMONIC_LIMIT;
            return (
              <div
                key={m.id}
                className={`rounded-xl border p-5 ${isLocked ? "opacity-40 blur-[1px] border-gray-200 bg-gray-50" : "border-gray-200 bg-white hover:border-purple-200 hover:shadow-sm transition-all"}`}
                data-testid={`mnemonic-card-${m.id}`}
              >
                {isLocked ? (
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">{m.name}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">{m.topic}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{m.name}</h3>
                    <p className="text-sm text-purple-600 font-medium mb-3">{m.letters}</p>
                    <ul className="space-y-1 mb-3">
                      {m.expansion.map((line, j) => (
                        <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                          <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          {line}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">{m.context}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {PHARM_MNEMONICS.length > FREE_MNEMONIC_LIMIT && <PremiumBanner />}

        <div className="mt-10 text-center">
          <Link href="/allied-health/rrt/pharmacology" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700" data-testid="link-back-hub">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Pharmacology Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RrtPharmOneMinuteReview() {
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const categories = [...new Set(ONE_MINUTE_REVIEW_CARDS.map(c => c.category))];
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const freeIds = new Set(ONE_MINUTE_REVIEW_CARDS.slice(0, FREE_REVIEW_LIMIT).map(c => c.id));

  const filtered = activeCategory === "All"
    ? ONE_MINUTE_REVIEW_CARDS
    : ONE_MINUTE_REVIEW_CARDS.filter(c => c.category === activeCategory);

  return (
    <div data-testid="rrt-pharm-one-minute">
      <AlliedSEO
        title={t("allied.rrtPharmStudyTools.oneminuteReviewCardsRrtPharmacology")}
        description={t("allied.rrtPharmStudyTools.rapidfirePharmacologyReviewCardsFor")}
        keywords="RRT one minute review, respiratory therapy rapid study, TMC pharmacology cards, quick drug review, NBRC exam rapid review"
        canonicalPath="/allied-health/rrt/pharmacology/one-minute-review"
      />
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <Breadcrumb current="One-Minute Review" />

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3" data-testid="badge-one-minute">
            <Clock className="w-4 h-4" />
            Rapid Study
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" data-testid="text-page-title">
            One-Minute Review Cards
          </h1>
          <p className="text-gray-600">{ONE_MINUTE_REVIEW_CARDS.length} rapid review cards — each one takes about 60 seconds to master.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6" data-testid="category-filters">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeCategory === "All" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            data-testid="button-category-all"
          >
            All ({ONE_MINUTE_REVIEW_CARDS.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((card, i) => {
            const isLocked = !freeIds.has(card.id);
            const isFlipped = flippedId === card.id;

            if (isLocked) {
              return (
                <div key={card.id} className="rounded-xl border border-gray-200 bg-gray-50 p-5 opacity-40 blur-[1px]" data-testid={`review-card-${card.id}`}>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-500 text-sm">{card.title}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={card.id}
                onClick={() => setFlippedId(isFlipped ? null : card.id)}
                className="rounded-xl border border-gray-200 bg-white hover:border-amber-200 hover:shadow-md transition-all cursor-pointer p-5"
                data-testid={`review-card-${card.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">{card.category}</span>
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{card.title}</h3>

                {!isFlipped ? (
                  <ul className="space-y-1.5">
                    {card.keyFacts.map((fact, j) => (
                      <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-blue-700 text-xs font-semibold mb-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Exam Tip
                    </div>
                    <p className="text-sm text-blue-900">{card.examTip}</p>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3 text-center">
                  {isFlipped ? "Click to see key facts" : "Click to see exam tip"}
                </p>
              </div>
            );
          })}
        </div>

        {ONE_MINUTE_REVIEW_CARDS.length > FREE_REVIEW_LIMIT && <PremiumBanner />}

        <div className="mt-10 text-center">
          <Link href="/allied-health/rrt/pharmacology" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700" data-testid="link-back-hub">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Pharmacology Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
