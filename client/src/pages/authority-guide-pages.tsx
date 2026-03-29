import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useState } from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import {
  BookOpen, ChevronDown, ArrowRight, HelpCircle,
  Stethoscope, Activity, FileText, Brain, Target,
  GraduationCap, ClipboardList, CheckCircle, Layers,
  Award, Shield, Pill, Heart, AlertTriangle, Star,
  Microscope, Thermometer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
interface FAQ {
  question: string;
  answer: string;
}

interface InternalLink {
  label: string;
  url: string;
  description: string;
}

interface ContentSection {
  id: string;
  title: string;
  icon: typeof BookOpen;
  htmlContent: string;
}

interface AuthorityGuidePage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  color: string;
  colorAccent: string;
  badgeLabel: string;
  sections: ContentSection[];
  faqs: FAQ[];
  internalLinks: InternalLink[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  breadcrumbs: { name: string; url: string }[];
}

const AUTHORITY_GUIDES: Record<string, AuthorityGuidePage> = {
  "electrolytes-nursing-exam-guide": {
    slug: "electrolytes-nursing-exam-guide",
    title: "Electrolytes for Nursing Exams — Complete Study Guide",
    metaTitle: "Electrolytes for Nursing Exams | Na, K, Ca, Mg Imbalances Guide | NurseNest",
    metaDescription: "Master electrolyte imbalances for NCLEX and REx-PN exams. Comprehensive guide covering sodium, potassium, calcium, and magnesium disorders with normal values, clinical signs, nursing interventions, and exam-focused practice questions.",
    keywords: "electrolytes nursing exam, electrolyte imbalances NCLEX, hypokalemia nursing, hypernatremia, hypocalcemia, magnesium nursing, electrolyte study guide",
    heroHeading: "Electrolytes for Nursing Exams",
    heroSubheading: "Master Every Electrolyte Imbalance for NCLEX & REx-PN",
    heroDescription: "Electrolyte imbalances are among the most heavily tested topics on nursing licensing exams. This comprehensive guide covers every major electrolyte disorder — sodium, potassium, calcium, magnesium, and phosphorus — with normal values, clinical manifestations, priority nursing interventions, and exam-specific strategies to help you answer electrolyte questions confidently.",
    color: "#2563EB",
    colorAccent: "#DBEAFE",
    badgeLabel: "Authority Guide",
    sections: [
      {
        id: "overview",
        title: "Why Electrolytes Matter on Nursing Exams",
        icon: Brain,
        htmlContent: `<p>{t("pages.authorityGuidePages.electrolyteQuestionsAppearOnEvery")}</p>
<p>{t("pages.authorityGuidePages.toSucceedWithElectrolyteQuestions")}</p>
<p><strong>{t("pages.authorityGuidePages.keyPrinciple")}</strong> {t("pages.authorityGuidePages.electrolyteImbalancesRarelyOccurIn")}</p>`,
      },
      {
        id: "sodium",
        title: "Sodium Disorders (Na⁺)",
        icon: Activity,
        htmlContent: `<p><strong>{t("pages.authorityGuidePages.normalRange135145Meql")}</strong></p>
<p>{t("pages.authorityGuidePages.sodiumIsTheMostAbundant")}</p>

<h3>Hyponatremia (Na⁺ < 135 mEq/L)</h3>
<p><strong>{t("pages.authorityGuidePages.causes")}</strong> {t("pages.authorityGuidePages.siadhMostCommonExamCause")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns")}</strong> {t("pages.authorityGuidePages.confusionLethargyHeadacheNauseavomitingSe")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventions")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.fluidRestrictionDilutionalHyponatremiaSiadh")}</li>
<li>{t("pages.authorityGuidePages.hypertonicSaline3NaclFor")}</li>
<li>{t("pages.authorityGuidePages.monitorNeuroStatusEvery12")}</li>
<li>{t("pages.authorityGuidePages.correctSlowlyNoMoreThan")}</li>
<li>{t("pages.authorityGuidePages.strictIoDailyWeightsSeizure")}</li>
</ul>

<h3>Hypernatremia (Na⁺ > {t("pages.authorityGuidePages.145Meql")}</h3>
<p><strong>{t("pages.authorityGuidePages.causes2")}</strong> {t("pages.authorityGuidePages.diabetesInsipidusDehydrationExcessiveSodium")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns2")}</strong> {t("pages.authorityGuidePages.intenseThirstDryMucousMembranes")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventions2")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.administerHypotonicFluids045Ns")}</li>
<li>{t("pages.authorityGuidePages.forDiabetesInsipidusAdministerDesmopressin")}</li>
<li>{t("pages.authorityGuidePages.monitorUrineSpecificGravityNormal")}</li>
<li>{t("pages.authorityGuidePages.strictIoDailyWeightsSafety")}</li>
</ul>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTrap")}</strong> {t("pages.authorityGuidePages.doNotConfuseDilutionalHyponatremia")}</p>
</div>`,
      },
      {
        id: "potassium",
        title: "Potassium Disorders (K⁺)",
        icon: Heart,
        htmlContent: `<p><strong>{t("pages.authorityGuidePages.normalRange3550Meql")}</strong></p>
<p>{t("pages.authorityGuidePages.potassiumIsTheMostAbundant")}</p>

<h3>Hypokalemia (K⁺ < 3.5 mEq/L)</h3>
<p><strong>{t("pages.authorityGuidePages.causes3")}</strong> {t("pages.authorityGuidePages.loopAndThiazideDiureticsMost")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns3")}</strong> {t("pages.authorityGuidePages.muscleWeaknessLegCrampsDecreased")}</p>
<p><strong>{t("pages.authorityGuidePages.ecgChanges")}</strong> {t("pages.authorityGuidePages.flattenedTWavesStDepression")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventions3")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.oralPotassiumReplacementPreferredKcl")}</li>
<li>{t("pages.authorityGuidePages.ivPotassiumNeverGiveBy")}</li>
<li>{t("pages.authorityGuidePages.diluteIvPotassiumMaximumConcentration")}</li>
<li>{t("pages.authorityGuidePages.monitorEcgContinuouslyDuringIv")}</li>
<li>{t("pages.authorityGuidePages.assessForDigoxinToxicityHypokalemia")}</li>
<li>{t("pages.authorityGuidePages.checkMagnesiumLevelHypokalemiaWill")}</li>
</ul>

<h3>Hyperkalemia (K⁺ > 5.0 mEq/L)</h3>
<p><strong>{t("pages.authorityGuidePages.causes4")}</strong> {t("pages.authorityGuidePages.renalFailureMostCommonPotassiumsparing")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns4")}</strong> {t("pages.authorityGuidePages.muscleWeaknessProgressingToFlaccid")}</p>
<p><strong>{t("pages.authorityGuidePages.ecgChanges2")}</strong> {t("pages.authorityGuidePages.tallPeakedTWavesWidened")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventionsEmergency")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.calciumGluconateIvStabilizesCardiac")}</li>
<li>{t("pages.authorityGuidePages.regularInsulinD50IvDrives")}</li>
<li>{t("pages.authorityGuidePages.sodiumBicarbonateIvShiftsK")}</li>
<li>{t("pages.authorityGuidePages.kayexalateSodiumPolystyreneSulfonateExchan")}</li>
<li>{t("pages.authorityGuidePages.albuterolNebulizerShiftsKInto")}</li>
<li>{t("pages.authorityGuidePages.dialysisDefinitiveTreatmentForSevere")}</li>
<li>{t("pages.authorityGuidePages.discontinueAllPotassiumSupplementsAnd")}</li>
</ul>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTrap2")}</strong> {t("pages.authorityGuidePages.ivPotassiumPushCausesFatal")}</p>
</div>`,
      },
      {
        id: "calcium-magnesium",
        title: "Calcium & Magnesium Disorders",
        icon: Stethoscope,
        htmlContent: `<h3>{t("pages.authorityGuidePages.calciumCaNormalRange85105")}</h3>
<p>{t("pages.authorityGuidePages.calciumIsEssentialForBone")}</p>

<h4>Hypocalcemia (Ca²⁺ < 8.5 mg/dL)</h4>
<p><strong>{t("pages.authorityGuidePages.causes5")}</strong> {t("pages.authorityGuidePages.hypoparathyroidismChronicKidneyDiseasePancre")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns5")}</strong> {t("pages.authorityGuidePages.trousseausSignCarpalSpasmWith")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventions4")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.administerIvCalciumGluconateSlowly")}</li>
<li>{t("pages.authorityGuidePages.keepEmergencyAirwayEquipmentAt")}</li>
<li>{t("pages.authorityGuidePages.seizurePrecautionsContinuousCardiacMonitoring")}</li>
<li>{t("pages.authorityGuidePages.oralCalciumSupplementsWithVitamin")}</li>
<li>{t("pages.authorityGuidePages.postthyroidectomyAssessForChvosteksAnd")}</li>
</ul>

<h4>Hypercalcemia (Ca²⁺ > 10.5 mg/dL)</h4>
<p><strong>{t("pages.authorityGuidePages.causes6")}</strong> {t("pages.authorityGuidePages.hyperparathyroidismMalignancyBoneMetastases")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns6")}</strong> {t("pages.authorityGuidePages.rememberStonesBonesGroansMoans")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventions5")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.ivNormalSalineHydrationAggressive")}</li>
<li>{t("pages.authorityGuidePages.loopDiureticsFurosemideAfterAdequate")}</li>
<li>{t("pages.authorityGuidePages.calcitoninBisphosphonatesZoledronicAcidFor")}</li>
<li>{t("pages.authorityGuidePages.encourageMobilityMonitorForRenal")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.magnesiumMgNormalRange1525")}</h3>
<p>{t("pages.authorityGuidePages.magnesiumIsCriticalForNeuromuscular")}</p>

<h4>Hypomagnesemia (Mg²⁺ < 1.5 mEq/L)</h4>
<p><strong>{t("pages.authorityGuidePages.causes7")}</strong> {t("pages.authorityGuidePages.chronicAlcoholismMostCommonMalnutrition")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns7")}</strong> {t("pages.authorityGuidePages.similarToHypocalcemiaTremorsHyperactive")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventions6")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.ivMagnesiumSulfateForSevere")}</li>
<li>{t("pages.authorityGuidePages.checkAndCorrectPotassiumSimultaneously")}</li>
<li>{t("pages.authorityGuidePages.seizurePrecautionsFallPrecautionsNeuromuscul")}</li>
<li>{t("pages.authorityGuidePages.dietarySourcesGreenLeafyVegetables")}</li>
</ul>

<h4>Hypermagnesemia (Mg²⁺ > 2.5 mEq/L)</h4>
<p><strong>{t("pages.authorityGuidePages.causes8")}</strong> {t("pages.authorityGuidePages.renalFailureCannotExcreteExcessive")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns8")}</strong> {t("pages.authorityGuidePages.decreasedDtrsEarliestSignLethargy")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventions7")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.antidoteCalciumGluconateIvKeep")}</li>
<li>{t("pages.authorityGuidePages.monitorDtrsBeforeEachMagnesium")}</li>
<li>Monitor respiratory rate (hold if < 12/min) and urine output (hold if < 30 mL/hr)</li>
<li>{t("pages.authorityGuidePages.discontinueMagnesiumcontainingMedications")}</li>
</ul>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTrap3")}</strong> On preeclampsia questions, always assess DTRs, respiratory rate (>12), and urine output (>{t("pages.authorityGuidePages.30MlhrBeforeAdministeringMagnesium")}</p>
</div>`,
      },
      {
        id: "phosphorus",
        title: "Phosphorus Disorders (PO₄³⁻)",
        icon: Microscope,
        htmlContent: `<p><strong>{t("pages.authorityGuidePages.normalRange2545Mgdl")}</strong></p>
<p>{t("pages.authorityGuidePages.phosphorusHasAnInverseRelationship")}</p>

<h3>Hypophosphatemia (PO₄ < 2.5 mg/dL)</h3>
<p><strong>{t("pages.authorityGuidePages.causes9")}</strong> {t("pages.authorityGuidePages.refeedingSyndromeMostCommonlyTested")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns9")}</strong> {t("pages.authorityGuidePages.muscleWeaknessRespiratoryFailureDiaphragm")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventions8")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.oralPhosphorusSupplementsNeutraphosWith")}</li>
<li>{t("pages.authorityGuidePages.ivSodiumOrPotassiumPhosphate")}</li>
<li>{t("pages.authorityGuidePages.refeedingSyndromePreventionAdvanceNutrition")}</li>
<li>{t("pages.authorityGuidePages.monitorForAssociatedHypocalcemiaAnd")}</li>
</ul>

<h3>Hyperphosphatemia (PO₄ > 4.5 mg/dL)</h3>
<p><strong>{t("pages.authorityGuidePages.causes10")}</strong> {t("pages.authorityGuidePages.renalFailureCannotExcreteExcessive2")}</p>
<p><strong>{t("pages.authorityGuidePages.clinicalSigns10")}</strong> {t("pages.authorityGuidePages.signsOfAssociatedHypocalcemiaTetany")}</p>
<p><strong>{t("pages.authorityGuidePages.priorityNursingInterventions9")}</strong></p>
<ul>
<li>{t("pages.authorityGuidePages.phosphatebindingMedicationsCalciumCarbonate")}</li>
<li>{t("pages.authorityGuidePages.lowphosphorusDietLimitDairyCola")}</li>
<li>{t("pages.authorityGuidePages.dialysisForSevereOrRefractory")}</li>
<li>{t("pages.authorityGuidePages.monitorCalciumLevelsInverseRelationship")}</li>
</ul>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTrap4")}</strong> {t("pages.authorityGuidePages.refeedingSyndromeIsALifethreatening")}</p>
</div>`,
      },
      {
        id: "iv-fluids",
        title: "IV Fluid Therapy & Electrolytes",
        icon: Pill,
        htmlContent: `<p>{t("pages.authorityGuidePages.understandingIvFluidTonicityIs")}</p>

<h3>{t("pages.authorityGuidePages.isotonicSolutionsSameOsmolalityAs")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.09NormalSalineNs")}</strong> {t("pages.authorityGuidePages.firstlineForDehydrationBloodTransfusions")}</li>
<li><strong>{t("pages.authorityGuidePages.lactatedRingersLr")}</strong> {t("pages.authorityGuidePages.preferredForSurgicalPatientsAnd")}</li>
<li><strong>D5W</strong> {t("pages.authorityGuidePages.isotonicInTheBagBecomes")}</li>
</ul>

<h3>Hypotonic Solutions (< 275 mOsm/L)</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.045NsHalfnormalSaline")}</strong> {t("pages.authorityGuidePages.usedForHypernatremiaCellularDehydration")}</li>
<li><strong>{t("pages.authorityGuidePages.contraindications")}</strong> {t("pages.authorityGuidePages.increasedIntracranialPressureWorsensCerebral")}</li>
</ul>

<h3>Hypertonic Solutions (> {t("pages.authorityGuidePages.295Mosml")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.3Saline")}</strong> {t("pages.authorityGuidePages.usedForSevereSymptomaticHyponatremia")}</li>
<li><strong>D10W, D50W</strong> {t("pages.authorityGuidePages.usedForHypoglycemiaTreatment")}</li>
<li><strong>{t("pages.authorityGuidePages.contraindications2")}</strong> {t("pages.authorityGuidePages.dehydrationCellularShrinkageHypernatremia")}</li>
<li><strong>{t("pages.authorityGuidePages.administration")}</strong> {t("pages.authorityGuidePages.viaInfusionPumpOnlyCentral")}</li>
</ul>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTrap5")}</strong> {t("pages.authorityGuidePages.d5wIsIsotonicInThe")}</p>
</div>`,
      },
      {
        id: "exam-strategies",
        title: "Exam Strategies for Electrolyte Questions",
        icon: Target,
        htmlContent: `<p>{t("pages.authorityGuidePages.electrolyteQuestionsOnTheNclex")}</p>

<h3>{t("pages.authorityGuidePages.strategy1IdentifyTheElectrolyte")}</h3>
<p>{t("pages.authorityGuidePages.readTheLabValuesCarefully")}</p>

<h3>{t("pages.authorityGuidePages.strategy2MatchSignsTo")}</h3>
<p>{t("pages.authorityGuidePages.keyPatternRecognitionShortcuts")}</p>
<ul>
<li><strong>{t("pages.authorityGuidePages.cardiacSymptoms")}</strong> {t("pages.authorityGuidePages.ecgChangesDysrhythmiasThinkPotassium")}</li>
<li><strong>{t("pages.authorityGuidePages.neuromuscularSymptoms")}</strong> {t("pages.authorityGuidePages.tetanyTrousseausChvosteksThinkCalcium")}</li>
<li><strong>{t("pages.authorityGuidePages.neurologicalSymptoms")}</strong> {t("pages.authorityGuidePages.confusionSeizuresThinkSodiumOr")}</li>
<li><strong>{t("pages.authorityGuidePages.giSymptoms")}</strong> {t("pages.authorityGuidePages.constipationOrDiarrheaThinkPotassium")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.strategy3KnowThePriority")}</h3>
<p>{t("pages.authorityGuidePages.forEachElectrolyteKnowThe")}</p>
<ul>
<li><strong>{t("pages.authorityGuidePages.hyperkalemia")}</strong> {t("pages.authorityGuidePages.cardiacMonitoringCalciumGluconateStabilize")}</li>
<li><strong>{t("pages.authorityGuidePages.hypokalemia")}</strong> {t("pages.authorityGuidePages.replacePotassiumNeverIvPush")}</li>
<li><strong>{t("pages.authorityGuidePages.hyponatremiaSiadh")}</strong> {t("pages.authorityGuidePages.fluidRestriction")}</li>
<li><strong>{t("pages.authorityGuidePages.hypernatremia")}</strong> {t("pages.authorityGuidePages.hypotonicFluidsMonitorNeuroStatus")}</li>
<li><strong>{t("pages.authorityGuidePages.hypocalcemia")}</strong> {t("pages.authorityGuidePages.ivCalciumGluconateAirwayEquipment")}</li>
<li><strong>{t("pages.authorityGuidePages.hypermagnesemia")}</strong> {t("pages.authorityGuidePages.calciumGluconateAntidoteAssessDtrs")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.strategy4WatchForSafety")}</h3>
<p>{t("pages.authorityGuidePages.theNclexLovesPatientSafety")}</p>
<ul>
<li>{t("pages.authorityGuidePages.ivPotassiumAlwaysDilutedAlways")}</li>
<li>Magnesium sulfate: check DTRs, RR > 12, UO > {t("pages.authorityGuidePages.30MlhrCalciumGluconateAt")}</li>
<li>{t("pages.authorityGuidePages.3SalineInfusionPumpFrequent")}</li>
<li>{t("pages.authorityGuidePages.calciumGluconateSlowIvPush")}</li>
</ul>`,
      },
    ],
    faqs: [
      { question: "What are the most commonly tested electrolytes on the NCLEX?", answer: "Potassium (hypokalemia and hyperkalemia) is the most frequently tested electrolyte, followed by sodium (hyponatremia), calcium (hypocalcemia), and magnesium. Focus on ECG changes for potassium, neuromuscular signs for calcium/magnesium, and neurological signs for sodium." },
      { question: "How do I remember which IV fluid to use for electrolyte imbalances?", answer: "Use the principle of opposites: hypotonic fluids (0.45% NS) for hypertonic conditions (hypernatremia/dehydration), hypertonic fluids (3% saline) for hypotonic conditions (severe hyponatremia). Isotonic fluids (0.9% NS, LR) are for volume replacement without shifting. Remember: D5W is isotonic in the bag but hypotonic in the body." },
      { question: "Why must hypomagnesemia be corrected before hypokalemia?", answer: "Magnesium is required for the sodium-potassium ATPase pump to function properly. When magnesium is low, the pump cannot retain potassium in cells, so potassium leaks out through renal tubules faster than it can be replaced. You can give potassium all day, but levels will not normalize until magnesium is corrected first." },
      { question: "What is the Trousseau's sign and when should I assess for it?", answer: "Trousseau's sign is a carpal spasm (hand cramping into a characteristic position) that occurs when you inflate a blood pressure cuff above systolic pressure for 3 minutes. It is a sign of hypocalcemia or hypomagnesemia. Assess for it post-thyroidectomy (parathyroid damage risk) and whenever calcium levels are low." },
      { question: "Why can't you give IV potassium by push?", answer: "IV potassium push delivers a bolus of potassium directly to the heart, which can cause fatal cardiac arrest (ventricular fibrillation). Potassium must be diluted and infused slowly (maximum 10-20 mEq/hour) with continuous cardiac monitoring. This is a critical patient safety principle tested on every nursing exam." },
      { question: "How do I interpret ABGs in relation to electrolytes?", answer: "Acid-base status directly affects potassium and calcium. In acidosis, H⁺ ions move into cells and K⁺ moves out → apparent hyperkalemia. In alkalosis, the opposite occurs → apparent hypokalemia. For calcium, alkalosis decreases ionized (active) calcium even if total calcium is normal, which can cause tetany symptoms." },
    ],
    internalLinks: [
      { label: "Electrolyte & Acid-Base Study Guide", url: "/study-guide/electrolytes-acid-base-nursing-guide", description: "Comprehensive hub for electrolyte lessons" },
      { label: "Hypokalemia Lesson", url: "/lessons/hypokalemia", description: "Deep-dive on hypokalemia" },
      { label: "Hyperkalemia Lesson", url: "/lessons/hyperkalemia", description: "Emergency treatment guide" },
      { label: "Electrolyte Flashcards", url: "/flashcards", description: "Spaced-repetition flashcards" },
      { label: "Electrolyte & ABG Simulator", url: "/electrolyte-abg-simulator", description: "Interactive electrolyte practice" },
      { label: "NCLEX Practice Questions", url: "/nclex-rn-practice-questions", description: "NCLEX-style exam questions" },
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "REx-PN exam questions" },
      { label: "Lab Values Reference", url: "/lab-values", description: "Complete lab values guide" },
    ],
    ctaTitle: "Master Electrolytes with Practice Questions",
    ctaDescription: "Test your understanding of electrolyte imbalances with exam-style questions featuring detailed rationales.",
    ctaPrimaryLabel: "Start Electrolyte Questions",
    ctaPrimaryUrl: "/practice-questions",
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Study Guides", url: "https://www.nursenest.ca/exam-prep" },
      { name: "Electrolytes for Nursing Exams", url: "https://www.nursenest.ca/electrolytes-nursing-exam-guide" },
    ],
  },

  "acid-base-disorders-nursing-guide": {
    slug: "acid-base-disorders-nursing-guide",
    title: "Acid-Base Disorders Explained for Nurses — ABG Interpretation Guide",
    metaTitle: "Acid-Base Disorders for Nurses | ABG Interpretation Guide | NurseNest",
    metaDescription: "Master acid-base disorders and ABG interpretation for nursing exams. Covers respiratory and metabolic acidosis/alkalosis, compensation mechanisms, the ROME method, and clinical nursing interventions. Essential NCLEX and REx-PN study guide.",
    keywords: "acid base disorders nursing, ABG interpretation, respiratory acidosis, metabolic alkalosis, ROME method nursing, arterial blood gas nursing, acid base balance NCLEX",
    heroHeading: "Acid-Base Disorders Explained for Nurses",
    heroSubheading: "ABG Interpretation & Clinical Management Guide",
    heroDescription: "Arterial blood gas (ABG) interpretation is a fundamental nursing skill tested extensively on NCLEX and REx-PN exams. This comprehensive guide walks you through each acid-base disorder, teaches you systematic ABG interpretation using the ROME method, explains compensation mechanisms, and connects you to the clinical nursing interventions for each imbalance.",
    color: "#059669",
    colorAccent: "#D1FAE5",
    badgeLabel: "Authority Guide",
    sections: [
      {
        id: "abg-fundamentals",
        title: "ABG Fundamentals & Normal Values",
        icon: BookOpen,
        htmlContent: `<p>{t("pages.authorityGuidePages.arterialBloodGasAbgAnalysis")}</p>

<h3>{t("pages.authorityGuidePages.normalAbgValues")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.ph")}</strong> {t("pages.authorityGuidePages.735745Below735Acidosis")}</li>
<li><strong>{t("pages.authorityGuidePages.paco")}</strong> {t("pages.authorityGuidePages.3545MmhgRespiratoryComponent")}</li>
<li><strong>{t("pages.authorityGuidePages.hco")}</strong> {t("pages.authorityGuidePages.2226MeqlMetabolicComponent")}</li>
<li><strong>{t("pages.authorityGuidePages.pao")}</strong> {t("pages.authorityGuidePages.80100MmhgOxygenationNot")}</li>
<li><strong>{t("pages.authorityGuidePages.sao")}</strong> {t("pages.authorityGuidePages.95100OxygenSaturation")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.theTwoRegulators")}</h3>
<p><strong>{t("pages.authorityGuidePages.lungsRespiratory")}</strong> {t("pages.authorityGuidePages.regulateCoLevelsWithinMinutes")}</p>
<p><strong>{t("pages.authorityGuidePages.kidneysMetabolic")}</strong> {t("pages.authorityGuidePages.regulateHcoBicarbonateLevelsOver")}</p>

<p><strong>{t("pages.authorityGuidePages.keyConcept")}</strong> {t("pages.authorityGuidePages.phIsDeterminedByThe")}</p>`,
      },
      {
        id: "rome-method",
        title: "The ROME Method for ABG Interpretation",
        icon: Brain,
        htmlContent: `<p>{t("pages.authorityGuidePages.theRomeMethodIsThe")}</p>

<h3>{t("pages.authorityGuidePages.romeRespiratoryOppositeMetabolicEqual")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.respiratoryOpposite")}</strong> In respiratory disorders, pH and PaCO₂ move in opposite directions. If CO₂ is high (>45), pH is low (<7.35) → respiratory acidosis. If CO₂ is low (<35), pH is high (>{t("pages.authorityGuidePages.745RespiratoryAlkalosis")}</li>
<li><strong>{t("pages.authorityGuidePages.metabolicEqual")}</strong> In metabolic disorders, pH and HCO₃⁻ move in the same direction. If HCO₃⁻ is low (<22), pH is low (<7.35) → metabolic acidosis. If HCO₃⁻ is high (>26), pH is high (>{t("pages.authorityGuidePages.745MetabolicAlkalosis")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.stepbystepAbgInterpretation")}</h3>
<ol>
<li><strong>{t("pages.authorityGuidePages.step1LookAtPh")}</strong> Is it acidotic (<7.35) or alkalotic (>7.45)? If 7.35-7.45, check which end it is closer to — this tells you the primary disorder.</li>
<li><strong>{t("pages.authorityGuidePages.step2CheckPaco")}</strong> Is it normal (35-45), high (>45 = respiratory acidosis), or low (<35 = respiratory alkalosis)?</li>
<li><strong>{t("pages.authorityGuidePages.step3CheckHco")}</strong> Is it normal (22-26), low (<22 = metabolic acidosis), or high (>{t("pages.authorityGuidePages.26MetabolicAlkalosis")}</li>
<li><strong>{t("pages.authorityGuidePages.step4MatchThePh")}</strong> {t("pages.authorityGuidePages.whichValueCoOrHco")}</li>
<li><strong>{t("pages.authorityGuidePages.step5CheckForCompensation")}</strong> {t("pages.authorityGuidePages.isTheOtherValueAlso")}</li>
</ol>

<h3>{t("pages.authorityGuidePages.compensationTypes")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.uncompensated")}</strong> {t("pages.authorityGuidePages.phIsAbnormalOnlyOne")}</li>
<li><strong>{t("pages.authorityGuidePages.partiallyCompensated")}</strong> {t("pages.authorityGuidePages.phIsStillAbnormalBut")}</li>
<li><strong>{t("pages.authorityGuidePages.fullyCompensated")}</strong> {t("pages.authorityGuidePages.phIsWithinNormalRange")}</li>
</ul>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTip")}</strong> {t("pages.authorityGuidePages.inFullyCompensatedAbgsThe")}</p>
</div>`,
      },
      {
        id: "respiratory-acidosis",
        title: "Respiratory Acidosis",
        icon: Activity,
        htmlContent: `<p><strong>ABG pattern: pH ↓ (<7.35), PaCO₂ ↑ (>{t("pages.authorityGuidePages.45Mmhg")}</strong></p>
<p><strong>{t("pages.authorityGuidePages.mechanism")}</strong> {t("pages.authorityGuidePages.coRetentionDueToHypoventilation")}</p>

<h3>{t("pages.authorityGuidePages.causes11")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.acute")}</strong> {t("pages.authorityGuidePages.opioidsedativeOverdosePneumothoraxAirwayObs")}</li>
<li><strong>{t("pages.authorityGuidePages.chronic")}</strong> {t("pages.authorityGuidePages.copdMostCommonObesityHypoventilation")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.clinicalSigns11")}</h3>
<p>{t("pages.authorityGuidePages.headacheConfusionDrowsinessProgressingTo")}</p>

<h3>{t("pages.authorityGuidePages.priorityNursingInterventions10")}</h3>
<ul>
<li>{t("pages.authorityGuidePages.improveVentilationPositionUprightHigh")}</li>
<li>{t("pages.authorityGuidePages.opioidOverdoseAdministerNaloxoneNarcan")}</li>
<li>{t("pages.authorityGuidePages.copdLowflowO12Lmin")}</li>
<li>{t("pages.authorityGuidePages.prepareForPossibleIntubationmechanicalVentila")}</li>
<li>{t("pages.authorityGuidePages.monitorRespiratoryRateDepthAnd")}</li>
<li>{t("pages.authorityGuidePages.bronchodilatorsAlbuterolForBronchospasmSuct")}</li>
</ul>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTrap6")}</strong> {t("pages.authorityGuidePages.copdPatientsAreChronicCo")}</p>
</div>`,
      },
      {
        id: "respiratory-alkalosis",
        title: "Respiratory Alkalosis",
        icon: Activity,
        htmlContent: `<p><strong>ABG pattern: pH ↑ (>7.45), PaCO₂ ↓ (<35 mmHg)</strong></p>
<p><strong>{t("pages.authorityGuidePages.mechanism2")}</strong> {t("pages.authorityGuidePages.excessiveCoEliminationDueTo")}</p>

<h3>{t("pages.authorityGuidePages.causes12")}</h3>
<ul>
<li>{t("pages.authorityGuidePages.anxietypanicAttacksMostCommonPain")}</li>
<li>{t("pages.authorityGuidePages.hypoxemiaPePneumoniaAltitudeCompensatory")}</li>
<li>{t("pages.authorityGuidePages.mechanicalVentilationRateOrTidal")}</li>
<li>{t("pages.authorityGuidePages.cnsDisordersHeadInjuryBrain")}</li>
<li>{t("pages.authorityGuidePages.pregnancyProgesteroneStimulatesRespiration")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.clinicalSigns12")}</h3>
<p>{t("pages.authorityGuidePages.lightheadednessDizzinessTinglingnumbnessCir")}</p>

<h3>{t("pages.authorityGuidePages.priorityNursingInterventions11")}</h3>
<ul>
<li>{t("pages.authorityGuidePages.anxietyrelatedCalmReassuranceCoachedSlow")}</li>
<li>{t("pages.authorityGuidePages.treatUnderlyingCauseAnalgesicsFor")}</li>
<li>{t("pages.authorityGuidePages.mechanicalVentilationReduceRateOr")}</li>
<li>{t("pages.authorityGuidePages.ifHypoxiadrivenTreatTheHypoxemia")}</li>
<li>{t("pages.authorityGuidePages.monitorForTetanyAndCardiac")}</li>
</ul>`,
      },
      {
        id: "metabolic-acidosis",
        title: "Metabolic Acidosis",
        icon: AlertTriangle,
        htmlContent: `<p><strong>ABG pattern: pH ↓ (<7.35), HCO₃⁻ ↓ (<22 mEq/L)</strong></p>
<p><strong>{t("pages.authorityGuidePages.mechanism3")}</strong> {t("pages.authorityGuidePages.eitherTooMuchAcidProductioningestion")}</p>

<h3>{t("pages.authorityGuidePages.anionGapNaClHco")}</h3>

<h4>{t("pages.authorityGuidePages.highAnionGapMetabolicAcidosis")}</h4>
<p>{t("pages.authorityGuidePages.somethingIsAddingAcidTo")}</p>
<ul>
<li><strong>M</strong>{t("pages.authorityGuidePages.ethanolPoisoning")}</li>
<li><strong>U</strong>{t("pages.authorityGuidePages.remiaRenalFailureCannotExcrete")}</li>
<li><strong>D</strong>{t("pages.authorityGuidePages.iabeticKetoacidosisDkaMostCommonly")}</li>
<li><strong>P</strong>{t("pages.authorityGuidePages.ropyleneGlycolToxicity")}</li>
<li><strong>I</strong>{t("pages.authorityGuidePages.soniazidIronToxicity")}</li>
<li><strong>L</strong>{t("pages.authorityGuidePages.acticAcidosisSepsisShockHypoxia")}</li>
<li><strong>E</strong>{t("pages.authorityGuidePages.thyleneGlycolPoisoning")}</li>
<li><strong>S</strong>{t("pages.authorityGuidePages.alicylateAspirinToxicityLate")}</li>
</ul>

<h4>{t("pages.authorityGuidePages.normalAnionGapHyperchloremicMetabolic")}</h4>
<p>{t("pages.authorityGuidePages.bicarbonateIsBeingLostFrom")}</p>
<ul>
<li>{t("pages.authorityGuidePages.diarrheaMostCommonGiTract")}</li>
<li>{t("pages.authorityGuidePages.renalTubularAcidosis")}</li>
<li>{t("pages.authorityGuidePages.pancreaticFistuladrainage")}</li>
<li>{t("pages.authorityGuidePages.ureterosigmoidostomy")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.clinicalSigns13")}</h3>
<p>{t("pages.authorityGuidePages.kussmaulRespirationsDeepRapidBreathing")}</p>

<h3>{t("pages.authorityGuidePages.priorityNursingInterventions12")}</h3>
<ul>
<li>{t("pages.authorityGuidePages.treatTheUnderlyingCauseInsulin")}</li>
<li>IV sodium bicarbonate for pH < 7.1 (severe, life-threatening acidosis only)</li>
<li>{t("pages.authorityGuidePages.ivFluidResuscitationIsotonicCrystalloid")}</li>
<li>{t("pages.authorityGuidePages.monitorPotassiumCloselyAsAcidosis")}</li>
<li>{t("pages.authorityGuidePages.doNotSuppressKussmaulRespirations")}</li>
</ul>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTrap7")}</strong> In DKA, potassium may initially appear normal or high (acidosis pushes K⁺ out of cells). But as you correct the acidosis with insulin and fluids, K⁺ shifts back into cells causing dangerous hypokalemia. Always replace potassium when K⁺ < 5.0 before or during insulin administration.</p>
</div>`,
      },
      {
        id: "metabolic-alkalosis",
        title: "Metabolic Alkalosis",
        icon: AlertTriangle,
        htmlContent: `<p><strong>ABG pattern: pH ↑ (>7.45), HCO₃⁻ ↑ (>{t("pages.authorityGuidePages.26Meql")}</strong></p>
<p><strong>{t("pages.authorityGuidePages.mechanism4")}</strong> {t("pages.authorityGuidePages.eitherExcessiveLossOfAcid")}</p>

<h3>{t("pages.authorityGuidePages.causes13")}</h3>
<ul>
<li>{t("pages.authorityGuidePages.vomitingngSuctioningLossOfHcl")}</li>
<li>{t("pages.authorityGuidePages.excessiveSodiumBicarbonateAdministration")}</li>
<li>{t("pages.authorityGuidePages.diureticUseLoopthiazideCausesContraction")}</li>
<li>{t("pages.authorityGuidePages.cushingSyndromeCorticosteroidExcess")}</li>
<li>{t("pages.authorityGuidePages.hyperaldosteronismSodiumRetentionHAnd")}</li>
<li>{t("pages.authorityGuidePages.excessiveAntacidUse")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.clinicalSigns14")}</h3>
<p>{t("pages.authorityGuidePages.shallowSlowRespirationsCompensatoryHypoventil")}</p>

<h3>{t("pages.authorityGuidePages.priorityNursingInterventions13")}</h3>
<ul>
<li>{t("pages.authorityGuidePages.treatTheUnderlyingCauseAntiemetics")}</li>
<li>{t("pages.authorityGuidePages.ivNormalSalineForChlorideresponsive")}</li>
<li>{t("pages.authorityGuidePages.replacePotassiumHypokalemiaIsBoth")}</li>
<li>{t("pages.authorityGuidePages.acetazolamideDiamoxACarbonicAnhydrase")}</li>
<li>{t("pages.authorityGuidePages.monitorForHypoventilationAndHypoxemia")}</li>
<li>{t("pages.authorityGuidePages.monitorEcgForDysrhythmiasRelated")}</li>
</ul>`,
      },
      {
        id: "mixed-disorders",
        title: "Mixed Acid-Base Disorders & Clinical Application",
        icon: Stethoscope,
        htmlContent: `<p>{t("pages.authorityGuidePages.inClinicalPracticeAndOn")}</p>

<h3>{t("pages.authorityGuidePages.expectedCompensation")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.respiratoryAcidosisAcute")}</strong> {t("pages.authorityGuidePages.hcoIncreases1MeqlFor")}</li>
<li><strong>{t("pages.authorityGuidePages.respiratoryAcidosisChronic")}</strong> {t("pages.authorityGuidePages.hcoIncreases35MeqlFor")}</li>
<li><strong>{t("pages.authorityGuidePages.respiratoryAlkalosisAcute")}</strong> {t("pages.authorityGuidePages.hcoDecreases2MeqlFor")}</li>
<li><strong>{t("pages.authorityGuidePages.metabolicAcidosis")}</strong> {t("pages.authorityGuidePages.coDecreases12MmhgFor")}</li>
<li><strong>{t("pages.authorityGuidePages.metabolicAlkalosis")}</strong> {t("pages.authorityGuidePages.coIncreases07MmhgFor")}</li>
</ul>

<p>{t("pages.authorityGuidePages.ifTheActualCompensationIs")}</p>

<h3>{t("pages.authorityGuidePages.clinicalApplicationPracticeAbgInterpretation")}</h3>
<p><strong>{t("pages.authorityGuidePages.example1")}</strong> {t("pages.authorityGuidePages.ph728Paco55Hco")}</p>
<p><strong>{t("pages.authorityGuidePages.example2")}</strong> {t("pages.authorityGuidePages.ph732Paco30Hco")}</p>
<p><strong>{t("pages.authorityGuidePages.example3")}</strong> {t("pages.authorityGuidePages.ph748Paco28Hco")}</p>
<p><strong>{t("pages.authorityGuidePages.example4")}</strong> {t("pages.authorityGuidePages.ph750Paco46Hco")}</p>`,
      },
    ],
    faqs: [
      { question: "How do I quickly interpret ABGs on the NCLEX?", answer: "Use the ROME method: Respiratory = Opposite (pH and CO₂ move in opposite directions), Metabolic = Equal (pH and HCO₃ move in the same direction). First check pH (acidotic or alkalotic?), then check which value (CO₂ or HCO₃) matches the pH direction. Finally, check if the other value is abnormal to determine compensation." },
      { question: "What is the difference between respiratory and metabolic acidosis?", answer: "Respiratory acidosis is caused by CO₂ retention from hypoventilation (COPD, opioid overdose, pneumonia). Metabolic acidosis is caused by either excessive acid production (DKA, lactic acidosis) or bicarbonate loss (diarrhea). The ABG differentiates them: respiratory = high CO₂ with normal HCO₃; metabolic = low HCO₃ with normal CO₂." },
      { question: "What is compensation in acid-base disorders?", answer: "Compensation is the body's attempt to normalize pH when an acid-base disorder occurs. If the primary disorder is respiratory, the kidneys compensate by adjusting HCO₃ (takes hours to days). If the primary disorder is metabolic, the lungs compensate by adjusting CO₂ (takes minutes). Full compensation returns pH to normal range; partial compensation moves pH toward normal but it remains abnormal." },
      { question: "What is the anion gap and when do I use it?", answer: "Anion gap = Na - (Cl + HCO₃). Normal is 8-12 mEq/L. Calculate it whenever you see metabolic acidosis to determine the cause. High anion gap = acid is being added (DKA, lactic acidosis, renal failure, poisoning — use MUDPILES mnemonic). Normal anion gap = bicarbonate is being lost (diarrhea, renal tubular acidosis)." },
      { question: "Why do COPD patients retain CO₂?", answer: "In COPD, the airways are narrowed and alveoli are damaged (emphysema). This impairs the ability to exhale CO₂ effectively. Over time, the body adapts to chronically elevated CO₂ levels, and the respiratory drive shifts from CO₂-mediated (normal) to hypoxia-mediated. This is why high-flow O₂ is dangerous in COPD — it removes the hypoxic drive, causing hypoventilation and further CO₂ retention." },
      { question: "How does DKA cause metabolic acidosis?", answer: "In DKA, insulin deficiency prevents glucose from entering cells. The body breaks down fat for energy, producing ketone bodies (beta-hydroxybutyrate, acetoacetate) which are acids. These ketoacids accumulate faster than the kidneys can excrete them, overwhelming the bicarbonate buffer system and causing a high anion gap metabolic acidosis." },
    ],
    internalLinks: [
      { label: "Electrolytes & Acid-Base Study Guide", url: "/study-guide/electrolytes-acid-base-nursing-guide", description: "Complete electrolyte and acid-base hub" },
      { label: "Electrolytes for Nursing Exams", url: "/electrolytes-nursing-exam-guide", description: "Electrolyte imbalances guide" },
      { label: "Electrolyte & ABG Simulator", url: "/electrolyte-abg-simulator", description: "Interactive ABG practice" },
      { label: "Respiratory Acidosis Lesson", url: "/lessons/respiratory-acidosis", description: "Deep-dive on respiratory acidosis" },
      { label: "Metabolic Acidosis Lesson", url: "/lessons/metabolic-acidosis", description: "Metabolic acidosis guide" },
      { label: "NCLEX Practice Questions", url: "/nclex-rn-practice-questions", description: "Exam-style practice questions" },
      { label: "Lab Values Reference", url: "/lab-values", description: "Complete lab values guide" },
      { label: "Flashcard Decks", url: "/flashcards", description: "Spaced-repetition flashcards" },
    ],
    ctaTitle: "Practice ABG Interpretation",
    ctaDescription: "Test your ABG interpretation skills with our interactive simulator and exam-style practice questions.",
    ctaPrimaryLabel: "Open ABG Simulator",
    ctaPrimaryUrl: "/electrolyte-abg-simulator",
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Study Guides", url: "https://www.nursenest.ca/exam-prep" },
      { name: "Acid-Base Disorders", url: "https://www.nursenest.ca/acid-base-disorders-nursing-guide" },
    ],
  },

  "nursing-clinical-assessment-guide": {
    slug: "nursing-clinical-assessment-guide",
    title: "Nursing Clinical Assessment Guide — Head-to-Toe Assessment for Exams",
    metaTitle: "Nursing Clinical Assessment Guide | Head-to-Toe Assessment | NurseNest",
    metaDescription: "Complete nursing clinical assessment guide for NCLEX and REx-PN exams. Covers systematic head-to-toe assessment, vital signs interpretation, focused assessments, documentation standards, and clinical decision-making frameworks used in professional nursing practice.",
    keywords: "nursing clinical assessment, head to toe assessment nursing, nursing physical assessment, vital signs interpretation, focused assessment nursing, clinical assessment NCLEX, nursing assessment guide",
    heroHeading: "Nursing Clinical Assessment Guide",
    heroSubheading: "Master Systematic Assessment for Exams & Clinical Practice",
    heroDescription: "Clinical assessment is the foundation of all nursing care and a core competency tested on every nursing licensing exam. This comprehensive guide covers systematic head-to-toe assessment, vital signs interpretation, focused assessments for common conditions, and the clinical decision-making frameworks that help you connect assessment findings to nursing interventions.",
    color: "#7C3AED",
    colorAccent: "#EDE9FE",
    badgeLabel: "Authority Guide",
    sections: [
      {
        id: "assessment-overview",
        title: "Clinical Assessment on Nursing Exams",
        icon: BookOpen,
        htmlContent: `<p>{t("pages.authorityGuidePages.clinicalAssessmentQuestionsCompriseApproximate")}</p>

<p>{t("pages.authorityGuidePages.assessmentQuestionsOnNursingExams")}</p>
<ul>
<li><strong>{t("pages.authorityGuidePages.pattern1Recognition")}</strong> {t("pages.authorityGuidePages.whichAssessmentFindingIndicatesOr")}</li>
<li><strong>{t("pages.authorityGuidePages.pattern2Priority")}</strong> {t("pages.authorityGuidePages.whichAssessmentFindingRequiresImmediate")}</li>
<li><strong>{t("pages.authorityGuidePages.pattern3Interpretation")}</strong> {t("pages.authorityGuidePages.basedOnTheseAssessmentFindings")}</li>
<li><strong>{t("pages.authorityGuidePages.pattern4Followup")}</strong> {t("pages.authorityGuidePages.afterThisInterventionTheNurse")}</li>
</ul>

<p><strong>{t("pages.authorityGuidePages.keyPrinciple2")}</strong> {t("pages.authorityGuidePages.alwaysAssessBeforeInterveningOn")}</p>`,
      },
      {
        id: "head-to-toe",
        title: "Systematic Head-to-Toe Assessment",
        icon: ClipboardList,
        htmlContent: `<p>{t("pages.authorityGuidePages.aSystematicHeadtotoeAssessmentEnsures")}</p>

<h3>{t("pages.authorityGuidePages.neurologicalAssessment")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.levelOfConsciousness")}</strong> {t("pages.authorityGuidePages.alertVerbalPainUnresponsiveAvpu")}</li>
<li><strong>{t("pages.authorityGuidePages.orientation")}</strong> {t("pages.authorityGuidePages.personPlaceTimeSituationDocumented")}</li>
<li><strong>{t("pages.authorityGuidePages.pupils")}</strong> {t("pages.authorityGuidePages.perrlaPupilsEqualRoundReactive")}</li>
<li><strong>{t("pages.authorityGuidePages.motorsensory")}</strong> {t("pages.authorityGuidePages.equalStrengthBilaterallySensationIntact")}</li>
<li><strong>{t("pages.authorityGuidePages.cranialNerves")}</strong> {t("pages.authorityGuidePages.facialSymmetryCnViiSwallowing")}</li>
<li><strong>{t("pages.authorityGuidePages.redFlags")}</strong> {t("pages.authorityGuidePages.suddenUnilateralWeaknessSlurredSpeech")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.cardiovascularAssessment")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.heartSounds")}</strong> {t("pages.authorityGuidePages.s1MitraltricuspidClosureS2Aorticpulmonic")}</li>
<li><strong>{t("pages.authorityGuidePages.peripheralCirculation")}</strong> Pulses (radial, pedal, posterior tibial — rate, rhythm, quality), capillary refill (<3 seconds), skin color/temperature</li>
<li><strong>{t("pages.authorityGuidePages.edemaAssessment")}</strong> {t("pages.authorityGuidePages.scale1To4Pitting")}</li>
<li><strong>{t("pages.authorityGuidePages.jvd")}</strong> {t("pages.authorityGuidePages.assessAt45DistensionAbove")}</li>
<li><strong>{t("pages.authorityGuidePages.redFlags2")}</strong> {t("pages.authorityGuidePages.chestPainIrregularRhythmAbsent")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.respiratoryAssessment")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.inspection")}</strong> {t("pages.authorityGuidePages.rate1220minDepthPatternRegular")}</li>
<li><strong>{t("pages.authorityGuidePages.auscultation")}</strong> {t("pages.authorityGuidePages.allLungFieldsAnteriorlyAnd")}</li>
<li><strong>{t("pages.authorityGuidePages.adventitiousSounds")}</strong> {t("pages.authorityGuidePages.cracklesFluidatelectasisWheezesBronchospas")}</li>
<li><strong>{t("pages.authorityGuidePages.oxygenSaturation")}</strong> {t("pages.authorityGuidePages.spo951008892ForCopd")}</li>
<li><strong>{t("pages.authorityGuidePages.redFlags3")}</strong> SpO₂ < 90%, respiratory rate > 30 or < 8, stridor, tracheal deviation, absent breath sounds</li>
</ul>

<h3>{t("pages.authorityGuidePages.gastrointestinalAssessment")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.assessmentOrder")}</strong> {t("pages.authorityGuidePages.inspectAuscultatePercussPalpateAuscultate")}</li>
<li><strong>{t("pages.authorityGuidePages.bowelSounds")}</strong> {t("pages.authorityGuidePages.normal530minInAllFour")}</li>
<li><strong>{t("pages.authorityGuidePages.abdomen")}</strong> {t("pages.authorityGuidePages.softNontenderNondistendedReboundTendernes")}</li>
<li><strong>{t("pages.authorityGuidePages.redFlags4")}</strong> {t("pages.authorityGuidePages.rigidboardlikeAbdomenReboundTendernessAbse")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.genitourinaryAssessment")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.urineOutput")}</strong> Normal: ≥0.5 mL/kg/hr (≥30 mL/hr for most adults). Oliguria: < 400 mL/day. Anuria: < 100 mL/day</li>
<li><strong>{t("pages.authorityGuidePages.urineCharacteristics")}</strong> {t("pages.authorityGuidePages.clearPaleYellowToAmber")}</li>
<li><strong>{t("pages.authorityGuidePages.redFlags5")}</strong> {t("pages.authorityGuidePages.anuriaGrossHematuriaSuprapubicDistension")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.integumentaryAssessment")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.skin")}</strong> {t("pages.authorityGuidePages.colorTemperatureMoistureTurgorTest")}</li>
<li><strong>{t("pages.authorityGuidePages.wounds")}</strong> {t("pages.authorityGuidePages.sizeDepthDrainageSerousSanguineous")}</li>
<li><strong>{t("pages.authorityGuidePages.pressureInjuryStaging")}</strong> {t("pages.authorityGuidePages.stage1NonblanchableErythemaThrough")}</li>
<li><strong>{t("pages.authorityGuidePages.redFlags6")}</strong> {t("pages.authorityGuidePages.newPressureInjurySignsOf")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.musculoskeletalAssessment")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.rom")}</strong> {t("pages.authorityGuidePages.activeAndPassiveRangeOf")}</li>
<li><strong>{t("pages.authorityGuidePages.strength")}</strong> {t("pages.authorityGuidePages.05NoContractionTo55")}</li>
<li><strong>{t("pages.authorityGuidePages.neurovascularChecks")}</strong> {t("pages.authorityGuidePages.5PsPainPallorPulselessness")}</li>
<li><strong>{t("pages.authorityGuidePages.redFlags7")}</strong> {t("pages.authorityGuidePages.asymmetricWeaknessCompartmentSyndromeSigns")}</li>
</ul>`,
      },
      {
        id: "vital-signs",
        title: "Vital Signs Interpretation",
        icon: Thermometer,
        htmlContent: `<p>{t("pages.authorityGuidePages.vitalSignsAreTheMost")}</p>

<h3>{t("pages.authorityGuidePages.normalAdultVitalSigns")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.temperature")}</strong> {t("pages.authorityGuidePages.365375c977995fOralTympanicAnd")}</li>
<li><strong>{t("pages.authorityGuidePages.heartRate")}</strong> 60-100 bpm. Bradycardia < 60. Tachycardia > 100.</li>
<li><strong>{t("pages.authorityGuidePages.respiratoryRate")}</strong> 12-20 breaths/min. Tachypnea > 20. Bradypnea < 12.</li>
<li><strong>{t("pages.authorityGuidePages.bloodPressure")}</strong> <120/80 mmHg (normal). 120-129/<80 (elevated). 130-139/80-89 (Stage 1 HTN). ≥140/≥90 (Stage 2 HTN). ≥180/≥120 (hypertensive crisis).</li>
<li><strong>{t("pages.authorityGuidePages.oxygenSaturation2")}</strong> {t("pages.authorityGuidePages.95100CopdTarget8892")}</li>
<li><strong>{t("pages.authorityGuidePages.pain")}</strong> {t("pages.authorityGuidePages.oftenConsideredThe5thVital")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.vitalSignPatternsToRecognize")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.cushingsTriad")}</strong> {t("pages.authorityGuidePages.increasedIcpHypertensionWideningPulse")}</li>
<li><strong>{t("pages.authorityGuidePages.becksTriad")}</strong> {t("pages.authorityGuidePages.cardiacTamponadeHypotensionJvdMuffled")}</li>
<li><strong>{t("pages.authorityGuidePages.shockPattern")}</strong> {t("pages.authorityGuidePages.hypotensionTachycardiaTachypneaAlteredMe")}</li>
<li><strong>{t("pages.authorityGuidePages.sepsisPattern")}</strong> Temperature > 38.3°C or < 36°C + Heart rate > 90 + Respiratory rate > {t("pages.authorityGuidePages.20AlteredMentalStatus")}</li>
<li><strong>{t("pages.authorityGuidePages.neurogenicShock")}</strong> {t("pages.authorityGuidePages.hypotensionBradycardiaDiffersFromOther")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.orthostaticPosturalVitalSigns")}</h3>
<p>{t("pages.authorityGuidePages.measureBpAndHrSupine")}</p>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTip2")}</strong> {t("pages.authorityGuidePages.whenAnExamQuestionPresents")}</p>
</div>`,
      },
      {
        id: "focused-assessments",
        title: "Focused Assessments for Common Conditions",
        icon: Target,
        htmlContent: `<p>{t("pages.authorityGuidePages.focusedAssessmentsAreTargetedEvaluations")}</p>

<h3>{t("pages.authorityGuidePages.cardiacAssessmentFocus")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.heartFailure")}</strong> {t("pages.authorityGuidePages.dailyWeightSameTimeSame")}</li>
<li><strong>{t("pages.authorityGuidePages.mi")}</strong> {t("pages.authorityGuidePages.painAssessmentPqrstVitalSigns")}</li>
<li><strong>{t("pages.authorityGuidePages.anticoagulation")}</strong> {t("pages.authorityGuidePages.signsOfBleedingBruisingGum")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.respiratoryAssessmentFocus")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.asthma")}</strong> {t("pages.authorityGuidePages.peakFlowMeasurementWorkOf")}</li>
<li><strong>{t("pages.authorityGuidePages.pneumonia")}</strong> {t("pages.authorityGuidePages.breathSoundsCracklesBronchialSputum")}</li>
<li><strong>{t("pages.authorityGuidePages.postchestTube")}</strong> {t("pages.authorityGuidePages.drainageAmountcolorTidalingInWater")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.neurologicalAssessmentFocus")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.stroke")}</strong> {t("pages.authorityGuidePages.fastFaceDroopingArmWeakness")}</li>
<li><strong>{t("pages.authorityGuidePages.increasedIcp")}</strong> {t("pages.authorityGuidePages.gcsTrendingPupilReactivityAnd")}</li>
<li><strong>{t("pages.authorityGuidePages.postcraniotomy")}</strong> {t("pages.authorityGuidePages.neuroChecksEvery12Hours")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.endocrineAssessmentFocus")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.dka")}</strong> Blood glucose (>{t("pages.authorityGuidePages.300KetonesAbgMetabolicAcidosis")}</li>
<li><strong>{t("pages.authorityGuidePages.hypoglycemia")}</strong> Blood glucose (<70), diaphoresis, tremors, confusion, tachycardia, level of consciousness</li>
<li><strong>{t("pages.authorityGuidePages.thyroidStorm")}</strong> {t("pages.authorityGuidePages.temperatureHyperthermiaHrSevereTachycardia")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.postoperativeAssessmentFocus")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.generalPostop")}</strong> {t("pages.authorityGuidePages.abcsFirstThenVitalSigns")}</li>
<li><strong>{t("pages.authorityGuidePages.postthyroidectomy")}</strong> {t("pages.authorityGuidePages.respiratoryStatusAirwaySwellingVoice")}</li>
<li><strong>{t("pages.authorityGuidePages.posthipReplacement")}</strong> {t("pages.authorityGuidePages.neurovascularChecksAbductionPillowpositioning")}</li>
</ul>`,
      },
      {
        id: "documentation",
        title: "Assessment Documentation Standards",
        icon: FileText,
        htmlContent: `<p>{t("pages.authorityGuidePages.documentationIsALegalRecord")}</p>

<h3>{t("pages.authorityGuidePages.documentationPrinciples")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.objective")}</strong> {t("pages.authorityGuidePages.documentWhatYouSeeHear")}</li>
<li><strong>{t("pages.authorityGuidePages.timely")}</strong> {t("pages.authorityGuidePages.documentAsCloseToThe")}</li>
<li><strong>{t("pages.authorityGuidePages.specific")}</strong> {t("pages.authorityGuidePages.useMeasurableTermsWound3")}</li>
<li><strong>{t("pages.authorityGuidePages.complete")}</strong> {t("pages.authorityGuidePages.includeRelevantNegativesNoJvd")}</li>
<li><strong>{t("pages.authorityGuidePages.legibleAndAccurate")}</strong> {t("pages.authorityGuidePages.useApprovedAbbreviationsOnlyIf")}</li>
</ul>

<h3>{t("pages.authorityGuidePages.commonDocumentationFrameworks")}</h3>
<ul>
<li><strong>{t("pages.authorityGuidePages.sbar")}</strong> {t("pages.authorityGuidePages.situationBackgroundAssessmentRecommendation")}</li>
<li><strong>{t("pages.authorityGuidePages.dar")}</strong> {t("pages.authorityGuidePages.dataActionResponseFocusedCharting")}</li>
<li><strong>{t("pages.authorityGuidePages.soap")}</strong> {t("pages.authorityGuidePages.subjectiveObjectiveAssessmentPlanProblem")}</li>
<li><strong>{t("pages.authorityGuidePages.headtotoe")}</strong> {t("pages.authorityGuidePages.systematicDocumentationByBodySystem")}</li>
</ul>

<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
<p class="text-sm text-amber-800"><strong>{t("pages.authorityGuidePages.examTip3")}</strong> {t("pages.authorityGuidePages.onDocumentationQuestionsChooseThe")}</p>
</div>`,
      },
      {
        id: "clinical-decision-making",
        title: "Clinical Decision-Making Frameworks",
        icon: Brain,
        htmlContent: `<p>{t("pages.authorityGuidePages.assessmentIsOnlyValuableIf")}</p>

<h3>{t("pages.authorityGuidePages.abcsAirwayBreathingCirculation")}</h3>
<p>{t("pages.authorityGuidePages.theMostFundamentalPrioritizationFramework")}</p>

<h3>{t("pages.authorityGuidePages.maslowsHierarchyOfNeeds")}</h3>
<p>{t("pages.authorityGuidePages.afterAddressingAbcsPrioritizePhysiological")}</p>

<h3>{t("pages.authorityGuidePages.nursingProcess")}</h3>
<p>{t("pages.authorityGuidePages.assessmentDiagnosisPlanningImplementation")}</p>

<h3>{t("pages.authorityGuidePages.acuteVsChronic")}</h3>
<p>{t("pages.authorityGuidePages.newonsetAcuteFindingsGenerallyTake")}</p>

<h3>{t("pages.authorityGuidePages.expectedVsUnexpected")}</h3>
<p>{t("pages.authorityGuidePages.unexpectedFindingsRequireActionExpected")}</p>

<h3>{t("pages.authorityGuidePages.stableVsUnstable")}</h3>
<p>{t("pages.authorityGuidePages.unstablePatientsAlwaysTakePriority")}</p>`,
      },
    ],
    faqs: [
      { question: "What is the correct order for abdominal assessment?", answer: "Inspect, Auscultate, Percuss, Palpate. Unlike other body systems, the abdomen is auscultated BEFORE palpation or percussion because touching the abdomen can stimulate or alter bowel sounds, giving inaccurate findings. This is a commonly tested concept on nursing exams." },
      { question: "How do I prioritize assessment findings on the NCLEX?", answer: "Use ABCs first (Airway > Breathing > Circulation), then Maslow's Hierarchy (physiological > safety > psychosocial). New/acute findings take priority over chronic/expected findings. Unexpected findings take priority over expected findings. When in doubt, assess before intervening — unless there is an immediate life threat." },
      { question: "What is the Glasgow Coma Scale?", answer: "The GCS measures level of consciousness using three components: Eye opening (1-4), Verbal response (1-5), and Motor response (1-6). Total score ranges from 3 (deep coma) to 15 (fully alert). A GCS of 8 or below indicates severe brain injury and usually requires intubation. GCS trending (changes over time) is more important than a single measurement." },
      { question: "What are Trousseau's and Chvostek's signs?", answer: "Trousseau's sign is carpal spasm (hand cramping) that occurs when a blood pressure cuff is inflated above systolic pressure for 3 minutes. Chvostek's sign is facial muscle twitching when the facial nerve is tapped just anterior to the ear. Both signs indicate hypocalcemia or hypomagnesemia. Always assess for these post-thyroidectomy." },
      { question: "How often should I perform assessments?", answer: "This depends on patient acuity and institutional policy. For stable patients: full assessment every shift with vital signs every 4-8 hours. For acute patients: focused assessment every 1-2 hours with continuous monitoring. Post-procedure: typically every 15 minutes x4, then every 30 minutes x2, then every hour x4, then routine." },
      { question: "What is SBAR and when do I use it?", answer: "SBAR is a structured communication framework: Situation (what is happening now), Background (relevant history), Assessment (what you think is going on), Recommendation (what you think should be done). Use SBAR when calling a provider about a patient concern. On the NCLEX, SBAR-formatted answers demonstrate professional communication skills." },
    ],
    internalLinks: [
      { label: "Clinical Skills Hub", url: "/clinical-skills", description: "Comprehensive clinical skills resources" },
      { label: "Case Simulations", url: "/case-simulations", description: "Interactive clinical case simulations" },
      { label: "Nursing Clinical Scenarios", url: "/nursing-clinical-scenarios", description: "Practice clinical judgment" },
      { label: "NCLEX Practice Questions", url: "/nclex-rn-practice-questions", description: "NCLEX-style exam questions" },
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "REx-PN exam questions" },
      { label: "Lab Values Reference", url: "/lab-values", description: "Complete lab values guide" },
      { label: "Study Lessons", url: "/lessons", description: "Pathophysiology lessons" },
      { label: "Mock Exams", url: "/mock-exams", description: "Full-length practice exams" },
    ],
    ctaTitle: "Practice Assessment Skills",
    ctaDescription: "Apply your assessment knowledge with clinical simulations and exam-style practice questions.",
    ctaPrimaryLabel: "Start Case Simulations",
    ctaPrimaryUrl: "/case-simulations",
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Study Guides", url: "https://www.nursenest.ca/exam-prep" },
      { name: "Clinical Assessment Guide", url: "https://www.nursenest.ca/nursing-clinical-assessment-guide" },
    ],
  },
};

function SectionHeading({ id, title, icon: Icon, color }: { id: string; title: string; icon: typeof BookOpen; color: string }) {
  const { t } = useI18n();
  return (
    <h2 id={id} className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 scroll-mt-24" data-testid={`heading-${id}`}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {title}
    </h2>
  );
}

function GuideTOC({ sections, color }: { sections: ContentSection[]; color: string }) {
  return (
    <nav className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24" data-testid="nav-guide-toc">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4" style={{ color }} /> Table of Contents
      </h3>
      <ul className="space-y-1.5">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5 border-l-2 border-transparent hover:border-gray-400 pl-3"
              data-testid={`toc-link-${s.id}`}
            >
              {s.title}
            </a>
          </li>
        ))}
        <li>
          <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5 border-l-2 border-transparent hover:border-gray-400 pl-3" data-testid="toc-link-faq">
            FAQ
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default function AuthorityGuidePage({ slug }: { slug: string }) {
  const page = AUTHORITY_GUIDES[slug];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-guide-not-found">{t("pages.authorityGuidePages.guideNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.authorityGuidePages.theStudyGuideYouAre")}</p>
          <LocaleLink href="/exam-prep">
            <Button data-testid="button-back-to-guides">{t("pages.authorityGuidePages.browseStudyGuides")}</Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  const faqStructuredData = buildFaqStructuredData(page.faqs);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.metaTitle,
    "description": page.metaDescription,
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
    "datePublished": "2025-06-01",
    "dateModified": new Date().toISOString().split("T")[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/${page.slug}`,
    },
    "wordCount": 3000,
    "articleSection": "Nursing Education",
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": page.title,
    "description": page.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "sameAs": PARENT_EDUCATIONAL_ORG.sameAs,
    },
    "educationalLevel": "Professional",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "Nursing Students",
    },
    "inLanguage": "en",
    "isAccessibleForFree": true,
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`page-authority-guide-${page.slug}`}>
      <Navigation />
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/${page.slug}`}
        structuredData={articleSchema}
        additionalStructuredData={[faqStructuredData, courseSchema]}
        breadcrumbs={page.breadcrumbs}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${page.colorAccent}60, white, ${page.colorAccent}30)` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav items={page.breadcrumbs} />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white" style={{ backgroundColor: page.color }} data-testid="badge-guide-type">
              <BookOpen className="w-3 h-3 mr-1" /> {page.badgeLabel}
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-guide-title">
              {page.heroHeading}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-guide-description">
              {page.heroDescription}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <LocaleLink href={page.ctaPrimaryUrl}>
                <Button className="text-white" style={{ backgroundColor: page.color }} data-testid="button-hero-guide-cta">
                  {page.ctaPrimaryLabel} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64 shrink-0">
            <GuideTOC sections={page.sections} color={page.color} />
          </div>

          <div className="flex-1 min-w-0">
            {page.sections.map((section, idx) => (
              <section key={section.id} id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-${section.id}`}>
                <SectionHeading id={`heading-${section.id}`} title={section.title} icon={section.icon} color={page.color} />
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div
                    className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-sm prose-h4:mt-4 prose-h4:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-li:leading-relaxed prose-ul:my-3 prose-ol:my-3 prose-strong:text-gray-900 [&_.exam-trap]:bg-amber-50 [&_.exam-trap]:border [&_.exam-trap]:border-amber-200 [&_.exam-trap]:rounded-lg [&_.exam-trap]:p-4 [&_.exam-trap]:my-4"
                    dangerouslySetInnerHTML={{ __html: section.htmlContent }}
                  />
                </div>

                {idx === 2 && (
                  <div className="my-8 rounded-xl p-6 text-center" style={{ backgroundColor: `${page.color}10`, borderLeft: `4px solid ${page.color}` }} data-testid="cta-mid-practice">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pages.authorityGuidePages.testYourKnowledge")}</h3>
                    <p className="text-sm text-gray-600 mb-4">{t("pages.authorityGuidePages.practiceWithExamstyleQuestionsAnd")}</p>
                    <LocaleLink href="/practice-questions">
                      <Button className="text-white" style={{ backgroundColor: page.color }} data-testid="button-cta-mid-practice">
                        Start Practice Questions <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </LocaleLink>
                  </div>
                )}

                {idx === 4 && (
                  <div className="my-8 rounded-xl p-6 text-center" style={{ backgroundColor: `${page.color}10`, borderLeft: `4px solid ${page.color}` }} data-testid="cta-mid-flashcards">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pages.authorityGuidePages.reviewWithFlashcards")}</h3>
                    <p className="text-sm text-gray-600 mb-4">{t("pages.authorityGuidePages.reinforceKeyConceptsWithSpacedrepetition")}</p>
                    <LocaleLink href="/flashcards">
                      <Button className="text-white" style={{ backgroundColor: page.color }} data-testid="button-cta-mid-flashcards">
                        Explore Flashcards <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </LocaleLink>
                  </div>
                )}
              </section>
            ))}

            <section id="internal-links" className="mb-12 scroll-mt-24" data-testid="section-guide-links">
              <SectionHeading id="heading-guide-links" title={t("pages.authorityGuidePages.relatedResources")} icon={Layers} color={page.color} />
              <div className="grid sm:grid-cols-2 gap-3">
                {page.internalLinks.map((link, i) => (
                  <LocaleLink key={i} href={link.url}>
                    <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-guide-resource-${i}`}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${page.color}15` }}>
                          <BookOpen className="w-4 h-4" style={{ color: page.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{link.label}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{link.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
            </section>

            <section id="faq" className="mb-12 scroll-mt-24" data-testid="section-faq">
              <SectionHeading id="heading-faq" title={t("pages.authorityGuidePages.frequentlyAskedQuestions")} icon={HelpCircle} color={page.color} />
              <div className="space-y-3">
                {page.faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`faq-item-${i}`}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      data-testid={`button-faq-${i}`}
                    >
                      <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-center mb-12" data-testid="section-bottom-cta">
              <h3 className="text-xl font-bold text-white mb-2">{page.ctaTitle}</h3>
              <p className="text-gray-300 mb-6 text-sm">{page.ctaDescription}</p>
              <LocaleLink href={page.ctaPrimaryUrl}>
                <Button className="text-white" style={{ backgroundColor: page.color }} data-testid="button-bottom-guide-cta">
                  {page.ctaPrimaryLabel} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
            </div>

            <EndOfContentLeadCapture leadMagnetType="study_guide" source="authority_guide" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function AuthorityGuideBySlug({ slug }: { slug: string }) {
  return <AuthorityGuidePage slug={slug} />;
}
