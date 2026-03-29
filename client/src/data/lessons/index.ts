import type { LessonContent } from "./types";
import { cardiovascularLessons } from "./cardiovascular";
import { respiratoryLessons } from "./respiratory";
import { neurologicalLessons } from "./neurological";
import { gastrointestinalLessons } from "./gastrointestinal";
import { renalLessons } from "./renal";
import { endocrineLessons } from "./endocrine";
import { hematologyLessons } from "./hematology";
import { pediatricsLessons } from "./pediatrics";
import { neonatalLessons } from "./neonatal";
import { maternityLessons } from "./maternity";
import { proceduresLessons } from "./procedures";
import { pharmacologyLessons } from "./pharmacology";
import { skinInfectionsLessons } from "./skin-infections";
import { assessmentLessons } from "./assessment";
import { infectionControlLessons } from "./infection-control";
import { advancedNpLessons } from "./advanced-np";
import { emergencyLessons } from "./emergency";
import { mentalHealthLessons } from "./mental-health";
import { orthopedicLessons } from "./orthopedic";
import { oncologyLessons } from "./oncology";
import { obMedicationsLessons } from "./ob-medications";
import { pediatricInfectionsLessons } from "./pediatric-infections";
import { poisoningLessons } from "./poisoning";
import { eyeEarLessons } from "./eye-ear";
import { giAdvancedLessons } from "./gi-advanced";
import { nutritionLessons } from "./nutrition";
import { painManagementLessons } from "./pain-management";
import { labFundamentalsLessons } from "./lab-fundamentals";
import { bioterrorismLessons } from "./bioterrorism";
import { maternityComplicationsLessons } from "./maternity-complications";
import { postpartumNeonatalLessons } from "./postpartum-neonatal";
import { vaccinesLessons } from "./vaccines";
import { fundamentalsLessons } from "./fundamentals";
import { delegationLessons } from "./delegation";
import { clinicalScenariosLessons } from "./clinical-scenarios";
import { electrolytePotassiumLessons } from "./electrolyte-potassium";
import { rpnExtraBank } from "./extra-questions-rpn";
import { rnExtraBank } from "./extra-questions-rn";
import { npExtraBank } from "./extra-questions-np";
import { medMathLessons } from "./med-math-lessons";
import { reproductiveLessons } from "./reproductive";
import { reproductiveRpnLessons } from "./reproductive-rpn";
import { reproductiveNpLessons } from "./reproductive-np";
import { arrhythmiaLessons } from "./arrhythmias";
import { dermatologyLessons } from "./dermatology";
import { respiratoryExpansionLessons } from "./respiratory-expansion";
import { respiratoryMissingRpnLessons } from "./respiratory-missing-rpn";
import { respiratoryMissingRnLessons } from "./respiratory-missing-rn";
import { respiratoryMissingNpLessons } from "./respiratory-missing-np";
import { npClinicalUnitLessons } from "./np-clinical-units";
import { uploadedClinicalNpLessons } from "./uploaded-clinical-np";
import { palliativeCareLessons } from "./palliative-care";
import { communityNursingLessons } from "./community-nursing";
import { painWoundCareLessons } from "./pain-wound-care";
import { coreFundamentalsLessons } from "./core-fundamentals";
import { delegationPrioritizationLessons } from "./delegation-prioritization";
import { cardiovascularExpandedLessons } from "./cardiovascular-expanded";
import { respiratoryExpandedLessons } from "./respiratory-expanded";
import { neurologicalExpandedLessons } from "./neurological-expanded";
import { renalGiExpandedLessons } from "./renal-gi-expanded";
import { endocrineImmuneExpandedLessons } from "./endocrine-immune-expanded";
import { hematologyExpandedLessons } from "./hematology-expanded";
import { heentSkinLessons } from "./heent-skin";
import { musculoskeletalExpandedLessons } from "./musculoskeletal-expanded";
import { pediatricsExpandedLessons } from "./pediatrics-expanded";
import { maternityExpandedLessons } from "./maternity-expanded";
import { neonatalExpandedLessons } from "./neonatal-expanded";
import { mentalHealthExpandedLessons } from "./mental-health-expanded";
import { infectionsProceduresLessons } from "./infections-procedures";
import { assessmentSkillsLessons } from "./assessment-skills";
import { fluidElectrolytesLessons } from "./fluid-electrolytes";
import { nutritionSupplementsLessons } from "./nutrition-supplements";
import { safetyEthicsLessons } from "./safety-ethics";
import { gerontologyLessons } from "./gerontology";
import { oncologyExpandedLessons } from "./oncology-expanded";
import { toxicologyEnvironmentalLessons } from "./toxicology-environmental";
import { criticalCareLessons } from "./critical-care";
import { hemodialysisLessons } from "./hemodialysis";
import { positioningToxoLessons } from "./positioning-toxo";
import { ethicsComprehensiveLessons } from "./ethics-comprehensive";
import { therapeuticCommunicationLessons } from "./therapeutic-communication";
import { labsDiagnosticsLessons } from "./labs-diagnostics";
import { leadershipManagementLessons } from "./leadership-management";
import { healthPromotionScreeningLessons } from "./health-promotion-screening";
import { legalEdgeCasesLessons } from "./legal-edge-cases";
import { maternalNewbornAdvancedLessons } from "./maternal-newborn-advanced";
import { cardiacRespiratoryCriticalLessons } from "./cardiac-respiratory-critical";
import { delegationByLicenseLessons } from "./delegation-by-license";
import { informaticsDocumentationLessons } from "./informatics-documentation";
import { nursingCalculationsLessons } from "./nursing-calculations";
import { culturalSafetyEquityLessons } from "./cultural-safety-equity";
import { pharmacologyNpPrescribingLessons } from "./pharmacology-np-prescribing";
import { pharmacologyCardioRespLessons } from "./pharmacology-cardio-resp";
import { pharmacologyInfectiousPsychLessons } from "./pharmacology-infectious-psych";
import { pharmacologyGiRenalSpecialtyLessons } from "./pharmacology-gi-renal-specialty";
import { npPathoExpansionLessons } from "./np-patho-expansion";
import { npGeneratedBatch7 } from "./np-generated-batch-7";
import { npCurriculumBatch1 } from "./np-curriculum-batch-1";
import { npContentExpansionPathoLessons } from "./np-content-expansion-patho";
import { npContentExpansionPatho2Lessons } from "./np-content-expansion-patho-2";
import { npContentExpansionDxLessons } from "./np-content-expansion-dx";
import { npContentExpansionRxLessons } from "./np-content-expansion-rx";
import { npContentExpansionMiscLessons } from "./np-content-expansion-misc";

import { rpnPathoCardiovascularLessons } from "./rpn-patho-cardiovascular";
import { rpnPathoHematologyEndocrineLessons } from "./rpn-patho-hematology-endocrine";
import { rpnPathoNeurologyLessons } from "./rpn-patho-neurology";
import { rpnPathoMusculoskeletalLessons } from "./rpn-patho-musculoskeletal";
import { rpnPathoImmunologyLessons } from "./rpn-patho-immunology";
import { rpnPathoStressMetabolismLessons } from "./rpn-patho-stress-metabolism";
import { rnPathoCardioNeuroLessons } from "./rn-patho-cardio-neuro";

import { rrtLessons } from "./rrt-lessons";
import { paramedicLessons } from "./paramedic-lessons";
import { mltLessons } from "./mlt-lessons";

import { imagingLessons } from "./imaging-lessons";
import { socialWorkerLessons } from "./social-worker-lessons";
import { psychotherapistLessons } from "./psychotherapist-lessons";
import { addictionsCounsellorLessons } from "./addictions-counsellor-lessons";
import { occupationalTherapyLessons } from "./occupational-therapy-lessons";
import { otaCoreLessons } from "./ota-core-lessons";
import { ptaCoreLessons } from "./pta-core-lessons";
import { paramedicLessonsExpanded } from "./paramedic-lessons-expanded";
import { rrtLessonsExpanded } from "./rrt-lessons-expanded";
import { rrtLessonsExpanded2 } from "./rrt-lessons-expanded-2";
import { rrtLessonsExpanded3 } from "./rrt-lessons-expanded-3";
import { mltLessonsExpanded } from "./mlt-lessons-expanded";
import { mltLessonsExpanded2 } from "./mlt-lessons-expanded-2";

import { rrtCardiacCriticalCareLessons } from "./rrt-cardiac-critical-care";
import { paramedicCardiacCriticalCareLessons } from "./paramedic-cardiac-critical-care";
import { imagingCardiacLessons } from "./imaging-cardiac-lessons";
import { dmsSonographyUsLessons } from "./dms-sonography-us-lessons";
import { dmsSonographyCaLessons } from "./dms-sonography-ca-lessons";
import { surgicalTechCardiacLessons } from "./surgical-tech-cardiac-lessons";
import { surgicalTechSterileTechniqueLessons } from "./surgical-tech-sterile-technique";
import { surgicalTechOrProtocolsLessons } from "./surgical-tech-or-protocols";
import { surgicalTechInstrumentsLessons } from "./surgical-tech-instruments";
import { surgicalTechProceduresLessons } from "./surgical-tech-procedures";
import { surgicalTechPositioningLessons } from "./surgical-tech-positioning";
import { surgicalTechInfectionPreventionLessons } from "./surgical-tech-infection-prevention";
import { surgicalTechAnesthesiaBasicsLessons } from "./surgical-tech-anesthesia-basics";
import { surgicalTechComplicationsLessons } from "./surgical-tech-complications";
import { echoCoreLesson } from "./echo-core-lessons";

import { alliedHealthFoundations1Lessons } from "./allied-health-foundations-1";
import { alliedHealthFoundations2Lessons } from "./allied-health-foundations-2";
import { alliedHealthFoundations3Lessons } from "./allied-health-foundations-3";

import { npFreeBatch1Lessons } from "./np-free-batch-1";
import { npFreeBatch2Lessons } from "./np-free-batch-2";
import { npFreeBatch3Lessons } from "./np-free-batch-3";

import { icuLessonsBatch1 } from "./icu-lessons-batch-1";
import { icuLessonsBatch2 } from "./icu-lessons-batch-2";
import { icuLessonsBatch3 } from "./icu-lessons-batch-3";
import { icuLessonsBatch4 } from "./icu-lessons-batch-4";
import { icuLessonsBatch5 } from "./icu-lessons-batch-5";
import { icuLessonsBatch6 } from "./icu-lessons-batch-6";
import { picuLessonsBatch1 } from "./picu-lessons-batch-1";
import { picuLessonsBatch2 } from "./picu-lessons-batch-2";
import { picuLessonsBatch3 } from "./picu-lessons-batch-3";
import { picuLessonsBatch4 } from "./picu-lessons-batch-4";
import { icuCriticalCareExpansionLessons } from "./icu-critical-care-expansion";
import { emergencyHemorrhageExpansionLessons } from "./emergency-hemorrhage-expansion";
import { rrtCardiacExpansionLessons } from "./rrt-cardiac-expansion";
import { rrtPulmonaryDiseasesLessons } from "./rrt-pulmonary-diseases";
import { rrtPharmacologyExpandedLessons } from "./rrt-pharmacology-expanded";
import { rrtNeonatalExpandedLessons } from "./rrt-neonatal-expanded";
import { rrtCriticalCareAdvancedLessons } from "./rrt-critical-care-advanced";

import { generatedBatch001Lessons } from "./generated-batch-001";
import { generatedBatch002Lessons } from "./generated-batch-002";
import { generatedBatch003Lessons } from "./generated-batch-003";
import { generatedBatch004Lessons } from "./generated-batch-004";
import { generatedBatch005Lessons } from "./generated-batch-005";
import { generatedBatch006Lessons } from "./generated-batch-006";
import { generatedBatch007Lessons } from "./generated-batch-007";
import { generatedBatch008Lessons } from "./generated-batch-008";
import { generatedBatch009Lessons } from "./generated-batch-009";
import { generatedBatch010Lessons } from "./generated-batch-010";
import { generatedBatch011Lessons } from "./generated-batch-011";
import { generatedBatch012Lessons } from "./generated-batch-012";
import { generatedBatch013Lessons } from "./generated-batch-013";
import { generatedBatch014Lessons } from "./generated-batch-014";
import { generatedBatch015Lessons } from "./generated-batch-015";
import { generatedBatch016Lessons } from "./generated-batch-016";
import { generatedBatch017Lessons } from "./generated-batch-017";
import { generatedBatch018Lessons } from "./generated-batch-018";
import { generatedBatch019Lessons } from "./generated-batch-019";
import { generatedBatch020Lessons } from "./generated-batch-020";
import { generatedBatch021Lessons } from "./generated-batch-021";
import { generatedBatch022Lessons } from "./generated-batch-022";
import { generatedBatch023Lessons } from "./generated-batch-023";
import { generatedBatch024Lessons } from "./generated-batch-024";
import { generatedBatch025Lessons } from "./generated-batch-025";
import { generatedBatch026Lessons } from "./generated-batch-026";
import { generatedBatch027Lessons } from "./generated-batch-027";
import { generatedBatch028Lessons } from "./generated-batch-028";
import { generatedBatch029Lessons } from "./generated-batch-029";
import { generatedBatch030Lessons } from "./generated-batch-030";
import { generatedBatch031Lessons } from "./generated-batch-031";
import { generatedBatch032Lessons } from "./generated-batch-032";
import { generatedBatch033Lessons } from "./generated-batch-033";
import { generatedBatch034Lessons } from "./generated-batch-034";
import { generatedBatch035Lessons } from "./generated-batch-035";
import { generatedBatch036Lessons } from "./generated-batch-036";
import { generatedBatch037Lessons } from "./generated-batch-037";
import { generatedBatch038Lessons } from "./generated-batch-038";
import { generatedBatch039Lessons } from "./generated-batch-039";
import { generatedBatch040Lessons } from "./generated-batch-040";
import { generatedBatch041Lessons } from "./generated-batch-041";
import { generatedBatch042Lessons } from "./generated-batch-042";
import { generatedBatch043Lessons } from "./generated-batch-043";
import { generatedBatch044Lessons } from "./generated-batch-044";
import { generatedBatch045Lessons } from "./generated-batch-045";
import { generatedBatch046Lessons } from "./generated-batch-046";
import { generatedBatch047Lessons } from "./generated-batch-047";
import { generatedBatch048Lessons } from "./generated-batch-048";
import { generatedBatch049Lessons } from "./generated-batch-049";
import { generatedBatch050Lessons } from "./generated-batch-050";
import { generatedBatch051Lessons } from "./generated-batch-051";
import { generatedBatch052Lessons } from "./generated-batch-052";
import { generatedBatch053Lessons } from "./generated-batch-053";
import { generatedBatch054Lessons } from "./generated-batch-054";
import { generatedBatch055Lessons } from "./generated-batch-055";
import { generatedBatch056Lessons } from "./generated-batch-056";
import { generatedBatch057Lessons } from "./generated-batch-057";
import { generatedBatch058Lessons } from "./generated-batch-058";
import { generatedBatch059Lessons } from "./generated-batch-059";
import { generatedBatch060Lessons } from "./generated-batch-060";
import { generatedBatch061Lessons } from "./generated-batch-061";
import { generatedBatch062Lessons } from "./generated-batch-062";
import { generatedBatch063Lessons } from "./generated-batch-063";
import { generatedBatch064Lessons } from "./generated-batch-064";
import { generatedBatch065Lessons } from "./generated-batch-065";
import { generatedBatch066Lessons } from "./generated-batch-066";
import { generatedBatch067Lessons } from "./generated-batch-067";
import { generatedBatch068Lessons } from "./generated-batch-068";
import { generatedBatch069Lessons } from "./generated-batch-069";
import { generatedBatch070Lessons } from "./generated-batch-070";
import { generatedBatch071Lessons } from "./generated-batch-071";
import { generatedBatch072Lessons } from "./generated-batch-072";
import { generatedBatch073Lessons } from "./generated-batch-073";
import { generatedBatch074Lessons } from "./generated-batch-074";
import { generatedBatch075Lessons } from "./generated-batch-075";
import { generatedBatch076Lessons } from "./generated-batch-076";
import { generatedBatch077Lessons } from "./generated-batch-077";
import { generatedBatch078Lessons } from "./generated-batch-078";
import { generatedBatch079Lessons } from "./generated-batch-079";
import { generatedBatch080Lessons } from "./generated-batch-080";
import { generatedBatch081Lessons } from "./generated-batch-081";
import { generatedBatch082Lessons } from "./generated-batch-082";
import { generatedBatch083Lessons } from "./generated-batch-083";
import { generatedBatch084Lessons } from "./generated-batch-084";
import { generatedBatch085Lessons } from "./generated-batch-085";
import { generatedBatch086Lessons } from "./generated-batch-086";
import { generatedBatch087Lessons } from "./generated-batch-087";
import { generatedBatch088Lessons } from "./generated-batch-088";
import { generatedBatch089Lessons } from "./generated-batch-089";
import { generatedBatch090Lessons } from "./generated-batch-090";
import { generatedBatch091Lessons } from "./generated-batch-091";
import { generatedBatch092Lessons } from "./generated-batch-092";
import { generatedBatch093Lessons } from "./generated-batch-093";
import { generatedBatch094Lessons } from "./generated-batch-094";
import { generatedBatch095Lessons } from "./generated-batch-095";
import { generatedBatch096Lessons } from "./generated-batch-096";
import { generatedBatch097Lessons } from "./generated-batch-097";
import { generatedBatch098Lessons } from "./generated-batch-098";
import { generatedBatch099Lessons } from "./generated-batch-099";
import { generatedBatch100Lessons } from "./generated-batch-100";
import { generatedBatch101Lessons } from "./generated-batch-101";
import { generatedBatch102Lessons } from "./generated-batch-102";
import { generatedBatch103Lessons } from "./generated-batch-103";
import { generatedBatch104Lessons } from "./generated-batch-104";
import { generatedBatch105Lessons } from "./generated-batch-105";
import { generatedBatch106Lessons } from "./generated-batch-106";
import { generatedBatch107Lessons } from "./generated-batch-107";
import { generatedBatch108Lessons } from "./generated-batch-108";
import { generatedBatch109Lessons } from "./generated-batch-109";
import { generatedBatch110Lessons } from "./generated-batch-110";
import { generatedBatch111Lessons } from "./generated-batch-111";
import { generatedBatch112Lessons } from "./generated-batch-112";
import { generatedBatch113Lessons } from "./generated-batch-113";
import { generatedBatch114Lessons } from "./generated-batch-114";
import { generatedBatch115Lessons } from "./generated-batch-115";
import { generatedBatch116Lessons } from "./generated-batch-116";
import { generatedBatch117Lessons } from "./generated-batch-117";
import { generatedBatch118Lessons } from "./generated-batch-118";
import { generatedBatch119Lessons } from "./generated-batch-119";
import { generatedBatch120Lessons } from "./generated-batch-120";
import { generatedBatch121Lessons } from "./generated-batch-121";
import { generatedBatch122Lessons } from "./generated-batch-122";
import { generatedBatch123Lessons } from "./generated-batch-123";
import { generatedBatch124Lessons } from "./generated-batch-124";
import { generatedBatch125Lessons } from "./generated-batch-125";
import { generatedBatch126Lessons } from "./generated-batch-126";
import { generatedBatch127Lessons } from "./generated-batch-127";
import { generatedBatch128Lessons } from "./generated-batch-128";
import { generatedBatch129Lessons } from "./generated-batch-129";
import { generatedBatch130Lessons } from "./generated-batch-130";
import { generatedBatch131Lessons } from "./generated-batch-131";
import { generatedBatch132Lessons } from "./generated-batch-132";
import { generatedBatch133Lessons } from "./generated-batch-133";
import { generatedBatch134Lessons } from "./generated-batch-134";
import { generatedBatch135Lessons } from "./generated-batch-135";
import { generatedBatch136Lessons } from "./generated-batch-136";
import { generatedBatch137Lessons } from "./generated-batch-137";
import { generatedBatch138Lessons } from "./generated-batch-138";
import { generatedBatch139Lessons } from "./generated-batch-139";
import { generatedBatch140Lessons } from "./generated-batch-140";
import { generatedBatch141Lessons } from "./generated-batch-141";
import { generatedBatch142Lessons } from "./generated-batch-142";
import { generatedBatch143Lessons } from "./generated-batch-143";
import { generatedBatch144Lessons } from "./generated-batch-144";

import { clinicalConditionsBatchALessons } from "./clinical-conditions-batch-a";
import { clinicalConditionsBatchBLessons } from "./clinical-conditions-batch-b";
import { clinicalConditionsBatchCLessons } from "./clinical-conditions-batch-c";
import { clinicalConditionsBatchDLessons } from "./clinical-conditions-batch-d";
import { clinicalConditionsBatchELessons } from "./clinical-conditions-batch-e";
import { clinicalConditionsBatchFLessons } from "./clinical-conditions-batch-f";
import { clinicalConditionsBatchGLessons } from "./clinical-conditions-batch-g";
import { clinicalConditionsBatchHLessons } from "./clinical-conditions-batch-h";
import { clinicalConditionsBatchILessons } from "./clinical-conditions-batch-i";
import { clinicalConditionsBatchJLessons } from "./clinical-conditions-batch-j";
import { clinicalConditionsBatchKLessons } from "./clinical-conditions-batch-k";
import { clinicalConditionsBatchLLessons } from "./clinical-conditions-batch-l";
import { clinicalConditionsBatchMLessons } from "./clinical-conditions-batch-m";
import { clinicalConditionsBatchNLessons } from "./clinical-conditions-batch-n";
import { clinicalConditionsBatchOLessons } from "./clinical-conditions-batch-o";
import { clinicalConditionsBatchPLessons } from "./clinical-conditions-batch-p";
import { bloodTransfusionReactionLessons } from "./blood-transfusion-reactions";
import { bloodTransfusionReactionTypeLessons } from "./blood-transfusion-reaction-types";
import { bloodTransfusionReactionTypesExtendedLessons } from "./blood-transfusion-reaction-types-extended";
import { cbiLessons } from "./continuous-bladder-irrigation";
import { rnExpandedLessons } from "./rn-expanded-content";
import { npExpandedLessons } from "./np-expanded-content";
import { npCvContent } from "./np-cv-content";
import { npRespContent } from "./np-resp-content";
import { npNeuroContent } from "./np-neuro-content";
import { npEndoContent } from "./np-endo-content";
import { rnIncompleteBatch1Lessons } from "./rn-incomplete-batch-1";
import { rnIncompleteBatch2Lessons } from "./rn-incomplete-batch-2";
import { rnIncompleteBatch3Lessons } from "./rn-incomplete-batch-3";
import { rnIncompleteBatch4Lessons } from "./rn-incomplete-batch-4";
import { rnIncompleteBatch5Lessons } from "./rn-incomplete-batch-5";
import { rnIncompleteBatch6Lessons } from "./rn-incomplete-batch-6";
import { rnIncompleteBatch7Lessons } from "./rn-incomplete-batch-7";
import { rnInfectiousDiseaseExpansionLessons } from "./rn-infectious-disease-expansion";
import { rnShockCriticalCareLessons } from "./rn-shock-critical-care";

import { npClinicalBatch4Lessons } from "./np-clinical-batch-4";
import { npClinicalBatch5Lessons } from "./np-clinical-batch-5";
import { npClinicalBatch6Lessons } from "./np-clinical-batch-6";
import { npClinicalBatch7Lessons } from "./np-clinical-batch-7";
import { npClinicalBatch8Lessons } from "./np-clinical-batch-8";
import { npClinicalBatch9Lessons } from "./np-clinical-batch-9";

import { rnContentBatch001Lessons } from "./rn-content-batch-001";
import { rnContentBatch002Lessons } from "./rn-content-batch-002";
import { rnContentBatch003Lessons } from "./rn-content-batch-003";
import { rnContentBatch004Lessons } from "./rn-content-batch-004";
import { rnContentBatch005Lessons } from "./rn-content-batch-005";
import { rnContentBatch006Lessons } from "./rn-content-batch-006";
import { rnContentBatch007Lessons } from "./rn-content-batch-007";
import { rnContentBatch008Lessons } from "./rn-content-batch-008";
import { rpnContentBatch001Lessons } from "./rpn-content-batch-001";
import { rpnContentBatch002Lessons } from "./rpn-content-batch-002";
import { rpnContentBatch003Lessons } from "./rpn-content-batch-003";
import { rpnContentBatch004Lessons } from "./rpn-content-batch-004";
import { rpnContentBatch005Lessons } from "./rpn-content-batch-005";
import { rpnContentBatch006Lessons } from "./rpn-content-batch-006";
import { rpnContentBatch007Lessons } from "./rpn-content-batch-007";
import { rpnContentBatch008Lessons } from "./rpn-content-batch-008";
import { rpnContentBatch009Lessons } from "./rpn-content-batch-009";
import { rpnContentBatch010Lessons } from "./rpn-content-batch-010";
import { rpnContentBatch011Lessons } from "./rpn-content-batch-011";
import { rpnContentBatch012Lessons } from "./rpn-content-batch-012";
import { rpnContentBatch013Lessons } from "./rpn-content-batch-013";
import { rpnContentBatch014Lessons } from "./rpn-content-batch-014";
import { rpnContentBatch015Lessons } from "./rpn-content-batch-015";
import { rpnContentBatch016Lessons } from "./rpn-content-batch-016";
import { rpnContentBatch017Lessons } from "./rpn-content-batch-017";
import { rpnContentBatch018Lessons } from "./rpn-content-batch-018";
import { rpnContentBatch019Lessons } from "./rpn-content-batch-019";
import { rpnContentBatch020Lessons } from "./rpn-content-batch-020";
import { rpnContentBatch021Lessons } from "./rpn-content-batch-021";
import { rpnContentBatch022Lessons } from "./rpn-content-batch-022";
import { rpnContentBatch023Lessons } from "./rpn-content-batch-023";
import { rpnContentBatch024Lessons } from "./rpn-content-batch-024";
import { rpnContentBatch025Lessons } from "./rpn-content-batch-025";
import { rpnContentBatch026Lessons } from "./rpn-content-batch-026";
import { rpnContentBatch027Lessons } from "./rpn-content-batch-027";
import { rpnContentBatch028Lessons } from "./rpn-content-batch-028";
import { rpnContentBatch029Lessons } from "./rpn-content-batch-029";
import { rpnContentBatch030Lessons } from "./rpn-content-batch-030";
import { rpnContentBatch031Lessons } from "./rpn-content-batch-031";
import { rpnContentBatch032Lessons } from "./rpn-content-batch-032";
import { rpnContentBatch033Lessons } from "./rpn-content-batch-033";
import { rpnContentBatch034Lessons } from "./rpn-content-batch-034";
import { rpnContentBatch035Lessons } from "./rpn-content-batch-035";
import { rpnContentBatch036Lessons } from "./rpn-content-batch-036";
import { rpnContentBatch037Lessons } from "./rpn-content-batch-037";
import { rpnContentBatch038Lessons } from "./rpn-content-batch-038";
import { rpnContentBatch039Lessons } from "./rpn-content-batch-039";
import { rpnContentBatch040Lessons } from "./rpn-content-batch-040";
import { rpnContentBatch041Lessons } from "./rpn-content-batch-041";
import { rpnContentBatch042Lessons } from "./rpn-content-batch-042";
import { rpnContentBatch043Lessons } from "./rpn-content-batch-043";
import { rnRespiratoryRenalExpansionLessons } from "./rn-respiratory-renal-expansion";
import { rnArrhythmiasExpansionLessons } from "./rn-arrhythmias-expansion";
import { rnChdAnticoagExpansionLessons } from "./rn-chd-anticoag-expansion";
import { rnGiCancerPedsIntegLessons } from "./rn-gi-cancer-peds-integ";

import { npToxicologyContentLessons } from "./np-toxicology-content";
import { npRareGeneticContentLessons } from "./np-rare-genetic-content";
import { npCriticalCareContentLessons } from "./np-critical-care-content";
import { npRheumatologyContentLessons } from "./np-rheumatology-content";
import { npAssessmentContentALessons } from "./np-assessment-content-a";
import { npAssessmentContentBLessons } from "./np-assessment-content-b";
import { npAssessmentContentCLessons } from "./np-assessment-content-c";
import { rnPathoEndocrineHemeMskLessons } from "./rn-patho-endocrine-heme-msk";
import { herbalSupplementsLessons } from "./herbal-supplements";
import { lessonRepairBatch } from "./lesson-repair-batch";
import { mltLessonRepairBatch } from "./mlt-lesson-repair-batch";
import { rnMskExpansionLessons } from "./rn-msk-expansion";
import { rnHeentExpansionLessons } from "./rn-heent-expansion";
import { rnSafetyForensicExpansionLessons } from "./rn-safety-forensic-expansion";
import { rnInfectionControlExpansionLessons } from "./rn-infection-control-expansion";
import { missingBatch01Lessons } from "./missing-batch-01";
import { missingBatch02Lessons } from "./missing-batch-02";
import { missingBatch03Lessons } from "./missing-batch-03";
import { missingBatch04Lessons } from "./missing-batch-04";
import { missingBatch05Lessons } from "./missing-batch-05";
import { missingBatch06Lessons } from "./missing-batch-06";
import { missingBatch07Lessons } from "./missing-batch-07";
import { missingBatch08Lessons } from "./missing-batch-08";
import { missingBatch09Lessons } from "./missing-batch-09";
import { missingBatch10Lessons } from "./missing-batch-10";
import { missingBatch11Lessons } from "./missing-batch-11";

export type { LessonContent } from "./types";

function countQuestions(lessons: Record<string, LessonContent>): number {
  let count = 0;
  for (const lesson of Object.values(lessons)) {
    if (lesson.quiz) count += lesson.quiz.length;
    if (lesson.preTest) count += lesson.preTest.length;
    if (lesson.postTest) count += lesson.postTest.length;
  }
  return count;
}

function isPlaceholder(lesson: LessonContent): boolean {
  const cellVal = (lesson as any).cellular;
  const content = typeof cellVal === "string" ? cellVal : cellVal?.content || "";
  if (content.includes("[WRITE YOUR") || content.includes("[PLACEHOLDER") || content.length < 20) return true;

  const genericRiskFactors = [
    "Advanced age or extremes of age",
    "Family history of",
    "Sedentary lifestyle and poor nutritional status",
    "Chronic comorbidities (hypertension, diabetes, obesity)",
    "Tobacco, alcohol, or substance use",
    "Immunocompromised state or prolonged medication use",
  ];
  const rf = lesson.riskFactors || [];
  const genericRfCount = rf.filter((r: string) =>
    genericRiskFactors.some(g => r.startsWith(g) || r.includes(g))
  ).length;
  if (genericRfCount >= 3) return true;

  const meds = lesson.medications || [];
  const genericMedNames = ["Levetiracetam", "Metformin", "Acetaminophen"];
  const title = (lesson.title || "").toLowerCase();
  for (const med of meds) {
    if (genericMedNames.includes(med.name)) {
      const isRelevant =
        (med.name === "Levetiracetam" && (title.includes("seizure") || title.includes("epilep") || title.includes("anticonvulsant"))) ||
        (med.name === "Metformin" && (title.includes("diabet") || title.includes("metformin") || title.includes("glucose") || title.includes("endocrin"))) ||
        (med.name === "Acetaminophen" && (title.includes("pain") || title.includes("fever") || title.includes("analges") || title.includes("acetaminophen")));
      if (!isRelevant && meds.length === 1) return true;
    }
  }

  const genericNursingActions = [
    "Perform comprehensive assessment and interpret findings for changes in condition",
    "Implement evidence-based interventions and evaluate outcomes per established protocols",
    "Reinforce patient teaching as delegated regarding condition management",
    "Order and interpret diagnostic studies for changes in condition",
    "Prescribe pharmacological and non-pharmacological therapies per established protocols",
    "Formulate differential diagnosis and treatment plan based on assessment findings",
    "Counsel patients on disease management and prevention regarding condition management",
    "Document all interventions, assessments, and patient responses accurately",
  ];
  const na = lesson.nursingActions || [];
  const genericNaCount = na.filter((a: string) =>
    genericNursingActions.some(g => a.startsWith(g))
  ).length;
  if (genericNaCount >= 2) return true;

  const genericAssessmentFindings = [
    "Changes in vital signs including temperature, pulse, blood pressure, and respirations",
    "Alterations in level of consciousness, orientation, or cognitive function",
    "Pain assessment using validated tools (onset, location, duration, character, severity)",
    "Skin assessment including color, turgor, moisture, integrity, and temperature",
    "Functional status changes including mobility, self-care ability, and nutritional intake",
  ];
  const af = lesson.assessmentFindings || [];
  const genericAfCount = af.filter((a: string) =>
    genericAssessmentFindings.some(g => a.startsWith(g))
  ).length;
  if (genericAfCount >= 4) return true;

  if (content.includes("The nurse practitioner applies advanced clinical reasoning to the assessment and management") &&
      content.includes("integrating comprehensive pathophysiological knowledge with evidence-based diagnostic")) return true;

  const boilerplateRf = [
    "Age-related risk factors specific to",
    "Genetic predisposition and family history",
    "Modifiable lifestyle factors (smoking, obesity, sedentary behavior)",
    "Medication-related risk (polypharmacy, drug interactions)",
    "Environmental and occupational exposures",
    "Nutritional deficiencies or excesses",
    "Psychosocial factors (chronic stress, socioeconomic status)",
    "Previous history of related conditions",
  ];
  const boilerplateRfCount = rf.filter((r: string) =>
    boilerplateRf.some(g => r.startsWith(g) || r === g)
  ).length;
  if (boilerplateRfCount >= 4) return true;

  const boilerplateDiag = [
    "Order comprehensive history and physical examination focused on",
    "Order CBC with differential, CMP, and targeted serology",
    "Order imaging studies appropriate to clinical presentation",
    "Calculate risk stratification score using validated clinical tools",
    "Order specialty-specific diagnostic studies as indicated",
    "Consider referral for advanced diagnostic procedures if indicated",
  ];
  const diag = lesson.diagnostics || [];
  const boilerplateDiagCount = diag.filter((d: string) =>
    boilerplateDiag.some(g => d.startsWith(g))
  ).length;
  if (boilerplateDiagCount >= 3) return true;

  const boilerplateMgmt = [
    "Initiate evidence-based first-line pharmacotherapy for",
    "Implement non-pharmacological interventions as adjunct therapy",
    "Titrate medications based on clinical response and lab monitoring",
    "Coordinate multidisciplinary care team involvement",
    "Develop patient-specific treatment plan with shared decision-making",
    "Implement guideline-directed escalation protocols if initial therapy fails",
  ];
  const mgmt = lesson.management || [];
  const boilerplateMgmtCount = mgmt.filter((m: string) =>
    boilerplateMgmt.some(g => m.startsWith(g))
  ).length;
  if (boilerplateMgmtCount >= 3) return true;

  for (const med of meds) {
    if (typeof med.type === "string" && med.type.startsWith("First-Line Agent for")) return true;
    if (typeof med.type === "string" && med.type.startsWith("Second-Line/Adjunctive Agent for")) return true;
  }

  const genericQuizPatterns = [
    "Which assessment finding requires immediate intervention",
    "Which nursing action is most appropriate when managing a patient with",
    "What is the best initial nursing response",
  ];
  const quiz = lesson.quiz || [];
  if (quiz.length > 0) {
    const genericQuizCount = quiz.filter((q) =>
      genericQuizPatterns.some(p => q.question.includes(p))
    ).length;
    if (genericQuizCount >= 2 && quiz.length <= 3) return true;
  }

  const batchGenericRiskFactors = [
    "Age-related risk factors specific to",
    "Genetic predisposition and family history",
    "Modifiable lifestyle factors (smoking, obesity, sedentary behavior)",
    "Medication-related risk (polypharmacy, drug interactions)",
    "Psychosocial factors (chronic stress, socioeconomic status)",
    "Previous history of related conditions",
  ];
  const batchRfCount = rf.filter((r: string) =>
    batchGenericRiskFactors.some(g => r.startsWith(g) || r === g)
  ).length;
  if (batchRfCount >= 4) return true;

  const batchGenericNursing = [
    "Perform systematic assessment using standardized tools for",
    "Implement evidence-based nursing interventions for symptom management",
    "Assess pain and implement multimodal pain management strategies",
    "Coordinate care transitions and discharge planning",
  ];
  const batchNaCount = na.filter((a: string) =>
    batchGenericNursing.some(g => a.startsWith(g) || a === g)
  ).length;
  if (batchNaCount >= 3) return true;

  const batchGenericMgmt = [
    "Initiate evidence-based first-line pharmacotherapy for",
    "Implement non-pharmacological interventions as adjunct therapy",
    "Implement guideline-directed escalation protocols if initial therapy fails",
    "Plan appropriate follow-up intervals and outcome measurements",
  ];
  const batchMgmt = lesson.management || [];
  const batchMgmtCount = batchMgmt.filter((m: string) =>
    batchGenericMgmt.some(g => m.startsWith(g) || m === g)
  ).length;
  if (batchMgmtCount >= 3) return true;

  const hasBoilerplateMedName = meds.some((med: any) =>
    med.name.startsWith("First-Line Agent for ") || med.name.startsWith("Adjunct Therapy for ")
  );
  if (hasBoilerplateMedName && (batchRfCount >= 2 || batchNaCount >= 2 || batchMgmtCount >= 2)) {
    return true;
  }

  if (quiz.length === 1 && quiz[0].question.includes("A 58-year-old patient presents with symptoms consistent with")) {
    const opts = quiz[0].options || [];
    if (opts.some((o: string) => o === "Prescribe empiric treatment without further evaluation")) return true;
  }

  return false;
}

function safeMerge(
  target: Record<string, LessonContent>,
  ...sources: Record<string, LessonContent>[]
): Record<string, LessonContent> {
  const supplementFields: (keyof LessonContent)[] = [
    'riskFactors', 'diagnostics', 'management', 'nursingActions', 'assessmentFindings', 'medications'
  ];
  for (const source of sources) {
    for (const [id, lesson] of Object.entries(source)) {
      if (isPlaceholder(lesson)) continue;
      const existing = target[id];
      if (existing && !isPlaceholder(existing)) {
        for (const field of supplementFields) {
          const existingVal = existing[field];
          const newVal = lesson[field];
          if ((!existingVal || (Array.isArray(existingVal) && existingVal.length === 0)) && newVal && (Array.isArray(newVal) ? newVal.length > 0 : true)) {
            (existing as any)[field] = newVal;
          }
        }
        continue;
      }
      target[id] = lesson;
    }
  }
  return target;
}

export const contentMap: Record<string, LessonContent> = safeMerge({},
  rnPathoEndocrineHemeMskLessons,
  npClinicalBatch4Lessons,
  npClinicalBatch5Lessons,
  npClinicalBatch6Lessons,
  npClinicalBatch7Lessons,
  npClinicalBatch8Lessons,
  npClinicalBatch9Lessons,
  generatedBatch112Lessons,
  cardiovascularLessons,
  respiratoryLessons,
  neurologicalLessons,
  gastrointestinalLessons,
  renalLessons,
  endocrineLessons,
  hematologyLessons,
  pediatricsLessons,
  neonatalLessons,
  maternityLessons,
  proceduresLessons,
  pharmacologyLessons,
  skinInfectionsLessons,
  assessmentLessons,
  infectionControlLessons,
  advancedNpLessons,
  emergencyLessons,
  mentalHealthLessons,
  orthopedicLessons,
  oncologyLessons,
  obMedicationsLessons,
  pediatricInfectionsLessons,
  poisoningLessons,
  eyeEarLessons,
  giAdvancedLessons,
  nutritionLessons,
  painManagementLessons,
  labFundamentalsLessons,
  bioterrorismLessons,
  maternityComplicationsLessons,
  postpartumNeonatalLessons,
  vaccinesLessons,
  fundamentalsLessons,
  delegationLessons,
  clinicalScenariosLessons,
  electrolytePotassiumLessons,
  rpnExtraBank,
  rnExtraBank,
  npExtraBank,
  medMathLessons,
  reproductiveLessons,
  reproductiveRpnLessons,
  reproductiveNpLessons,
  arrhythmiaLessons,
  dermatologyLessons,
  respiratoryExpansionLessons,
  respiratoryMissingRpnLessons,
  respiratoryMissingRnLessons,
  respiratoryMissingNpLessons,
  npClinicalUnitLessons,
  uploadedClinicalNpLessons,
  palliativeCareLessons,
  communityNursingLessons,
  painWoundCareLessons,
  coreFundamentalsLessons,
  delegationPrioritizationLessons,
  cardiovascularExpandedLessons,
  respiratoryExpandedLessons,
  neurologicalExpandedLessons,
  renalGiExpandedLessons,
  endocrineImmuneExpandedLessons,
  hematologyExpandedLessons,
  heentSkinLessons,
  musculoskeletalExpandedLessons,
  pediatricsExpandedLessons,
  maternityExpandedLessons,
  neonatalExpandedLessons,
  mentalHealthExpandedLessons,
  infectionsProceduresLessons,
  assessmentSkillsLessons,
  fluidElectrolytesLessons,
  nutritionSupplementsLessons,
  safetyEthicsLessons,
  gerontologyLessons,
  oncologyExpandedLessons,
  toxicologyEnvironmentalLessons,
  criticalCareLessons,
  hemodialysisLessons,
  positioningToxoLessons,
  ethicsComprehensiveLessons,
  therapeuticCommunicationLessons,
  labsDiagnosticsLessons,
  leadershipManagementLessons,
  healthPromotionScreeningLessons,
  legalEdgeCasesLessons,
  maternalNewbornAdvancedLessons,
  cardiacRespiratoryCriticalLessons,
  delegationByLicenseLessons,
  informaticsDocumentationLessons,
  nursingCalculationsLessons,
  culturalSafetyEquityLessons,
  pharmacologyNpPrescribingLessons,
  pharmacologyCardioRespLessons,
  pharmacologyInfectiousPsychLessons,
  pharmacologyGiRenalSpecialtyLessons,
  bloodTransfusionReactionLessons,
  bloodTransfusionReactionTypeLessons,
  bloodTransfusionReactionTypesExtendedLessons,
  clinicalConditionsBatchALessons,
  clinicalConditionsBatchBLessons,
  clinicalConditionsBatchCLessons,
  clinicalConditionsBatchDLessons,
  clinicalConditionsBatchELessons,
  clinicalConditionsBatchFLessons,
  clinicalConditionsBatchGLessons,
  clinicalConditionsBatchHLessons,
  clinicalConditionsBatchILessons,
  clinicalConditionsBatchJLessons,
  clinicalConditionsBatchKLessons,
  clinicalConditionsBatchLLessons,
  clinicalConditionsBatchMLessons,
  clinicalConditionsBatchNLessons,
  clinicalConditionsBatchOLessons,
  clinicalConditionsBatchPLessons,
  cbiLessons,
  rrtLessons,
  paramedicLessons,
  mltLessons,
  imagingLessons,
  socialWorkerLessons,
  psychotherapistLessons,
  addictionsCounsellorLessons,
  occupationalTherapyLessons,
  otaCoreLessons,
  ptaCoreLessons,
  paramedicLessonsExpanded,
  rrtLessonsExpanded,
  rrtLessonsExpanded2,
  rrtLessonsExpanded3,
  mltLessonsExpanded,
  mltLessonsExpanded2,
  rrtCardiacCriticalCareLessons,
  paramedicCardiacCriticalCareLessons,
  imagingCardiacLessons,
  surgicalTechCardiacLessons,
  surgicalTechSterileTechniqueLessons,
  surgicalTechOrProtocolsLessons,
  surgicalTechInstrumentsLessons,
  surgicalTechProceduresLessons,
  surgicalTechPositioningLessons,
  surgicalTechInfectionPreventionLessons,
  surgicalTechAnesthesiaBasicsLessons,
  surgicalTechComplicationsLessons,
  echoCoreLesson,
  generatedBatch001Lessons,
  generatedBatch002Lessons,
  generatedBatch003Lessons,
  generatedBatch004Lessons,
  generatedBatch005Lessons,
  generatedBatch006Lessons,
  generatedBatch007Lessons,
  generatedBatch008Lessons,
  generatedBatch009Lessons,
  generatedBatch010Lessons,
  generatedBatch011Lessons,
  generatedBatch012Lessons,
  generatedBatch013Lessons,
  generatedBatch014Lessons,
  generatedBatch015Lessons,
  generatedBatch016Lessons,
  generatedBatch017Lessons,
  generatedBatch018Lessons,
  generatedBatch019Lessons,
  generatedBatch020Lessons,
  generatedBatch021Lessons,
  generatedBatch022Lessons,
  generatedBatch023Lessons,
  generatedBatch024Lessons,
  generatedBatch025Lessons,
  generatedBatch026Lessons,
  generatedBatch027Lessons,
  generatedBatch028Lessons,
  generatedBatch029Lessons,
  generatedBatch030Lessons,
  generatedBatch031Lessons,
  generatedBatch032Lessons,
  generatedBatch033Lessons,
  generatedBatch034Lessons,
  generatedBatch035Lessons,
  generatedBatch036Lessons,
  generatedBatch037Lessons,
  generatedBatch038Lessons,
  generatedBatch039Lessons,
  generatedBatch040Lessons,
  generatedBatch041Lessons,
  generatedBatch042Lessons,
  generatedBatch043Lessons,
  generatedBatch044Lessons,
  generatedBatch045Lessons,
  generatedBatch046Lessons,
  generatedBatch047Lessons,
  generatedBatch048Lessons,
  generatedBatch049Lessons,
  generatedBatch050Lessons,
  generatedBatch051Lessons,
  generatedBatch052Lessons,
  generatedBatch053Lessons,
  generatedBatch054Lessons,
  generatedBatch055Lessons,
  generatedBatch056Lessons,
  generatedBatch057Lessons,
  generatedBatch058Lessons,
  generatedBatch059Lessons,
  generatedBatch060Lessons,
  generatedBatch061Lessons,
  generatedBatch062Lessons,
  generatedBatch063Lessons,
  generatedBatch064Lessons,
  generatedBatch065Lessons,
  generatedBatch066Lessons,
  generatedBatch067Lessons,
  generatedBatch068Lessons,
  generatedBatch069Lessons,
  generatedBatch070Lessons,
  generatedBatch071Lessons,
  generatedBatch072Lessons,
  generatedBatch073Lessons,
  generatedBatch074Lessons,
  generatedBatch075Lessons,
  generatedBatch076Lessons,
  generatedBatch077Lessons,
  generatedBatch078Lessons,
  generatedBatch079Lessons,
  generatedBatch080Lessons,
  generatedBatch081Lessons,
  generatedBatch082Lessons,
  generatedBatch083Lessons,
  generatedBatch084Lessons,
  generatedBatch085Lessons,
  generatedBatch086Lessons,
  generatedBatch087Lessons,
  generatedBatch088Lessons,
  generatedBatch089Lessons,
  generatedBatch090Lessons,
  generatedBatch091Lessons,
  generatedBatch092Lessons,
  generatedBatch093Lessons,
  generatedBatch094Lessons,
  generatedBatch095Lessons,
  generatedBatch096Lessons,
  generatedBatch097Lessons,
  generatedBatch098Lessons,
  generatedBatch099Lessons,
  generatedBatch100Lessons,
  generatedBatch101Lessons,
  generatedBatch102Lessons,
  generatedBatch103Lessons,
  generatedBatch104Lessons,
  generatedBatch105Lessons,
  generatedBatch106Lessons,
  generatedBatch107Lessons,
  generatedBatch108Lessons,
  generatedBatch109Lessons,
  generatedBatch110Lessons,
  generatedBatch111Lessons,
  generatedBatch113Lessons,
  generatedBatch114Lessons,
  generatedBatch115Lessons,
  generatedBatch116Lessons,
  generatedBatch117Lessons,
  generatedBatch118Lessons,
  generatedBatch119Lessons,
  generatedBatch120Lessons,
  generatedBatch121Lessons,
  generatedBatch122Lessons,
  generatedBatch123Lessons,
  generatedBatch124Lessons,
  generatedBatch125Lessons,
  generatedBatch126Lessons,
  generatedBatch127Lessons,
  generatedBatch128Lessons,
  generatedBatch129Lessons,
  generatedBatch130Lessons,
  generatedBatch131Lessons,
  generatedBatch132Lessons,
  generatedBatch133Lessons,
  generatedBatch134Lessons,
  generatedBatch135Lessons,
  generatedBatch136Lessons,
  generatedBatch137Lessons,
  generatedBatch138Lessons,
  generatedBatch139Lessons,
  generatedBatch140Lessons,
  generatedBatch141Lessons,
  generatedBatch142Lessons,
  generatedBatch143Lessons,
  generatedBatch144Lessons,
  rnExpandedLessons,
  npExpandedLessons,
  npCvContent,
  npRespContent,
  npNeuroContent,
  npEndoContent,
  icuLessonsBatch1,
  icuLessonsBatch2,
  icuLessonsBatch3,
  icuLessonsBatch4,
  icuLessonsBatch5,
  icuLessonsBatch6,
  picuLessonsBatch1,
  picuLessonsBatch2,
  picuLessonsBatch3,
  picuLessonsBatch4,
  icuCriticalCareExpansionLessons,
  emergencyHemorrhageExpansionLessons,
  rrtCardiacExpansionLessons,
  alliedHealthFoundations1Lessons,
  alliedHealthFoundations2Lessons,
  alliedHealthFoundations3Lessons,
  rnContentBatch001Lessons,
  rnContentBatch002Lessons,
  rnContentBatch003Lessons,
  rnContentBatch004Lessons,
  rnContentBatch005Lessons,
  rnContentBatch006Lessons,
  rnContentBatch007Lessons,
  rnContentBatch008Lessons,
  rpnContentBatch001Lessons,
  rpnContentBatch002Lessons,
  rpnContentBatch003Lessons,
  rpnContentBatch004Lessons,
  rpnContentBatch005Lessons,
  rpnContentBatch006Lessons,
  rpnContentBatch007Lessons,
  rpnContentBatch008Lessons,
  rpnContentBatch009Lessons,
  rpnContentBatch010Lessons,
  rpnContentBatch011Lessons,
  rpnContentBatch012Lessons,
  rpnContentBatch013Lessons,
  rpnContentBatch014Lessons,
  rpnContentBatch015Lessons,
  rpnContentBatch016Lessons,
  rpnContentBatch017Lessons,
  rpnContentBatch018Lessons,
  rpnContentBatch019Lessons,
  rpnContentBatch020Lessons,
  rpnContentBatch021Lessons,
  rpnContentBatch022Lessons,
  rpnContentBatch023Lessons,
  rpnContentBatch024Lessons,
  rpnContentBatch025Lessons,
  rpnContentBatch026Lessons,
  rpnContentBatch027Lessons,
  rpnContentBatch028Lessons,
  rpnContentBatch029Lessons,
  rpnContentBatch030Lessons,
  rpnContentBatch031Lessons,
  rpnContentBatch032Lessons,
  rpnContentBatch033Lessons,
  rpnContentBatch034Lessons,
  rpnContentBatch035Lessons,
  rpnContentBatch036Lessons,
  npFreeBatch1Lessons,
  npFreeBatch2Lessons,
  npFreeBatch3Lessons,
  rpnPathoCardiovascularLessons,
  rpnPathoHematologyEndocrineLessons,
  rpnPathoNeurologyLessons,
  rpnPathoMusculoskeletalLessons,
  rpnPathoImmunologyLessons,
  rpnPathoStressMetabolismLessons,
  rnIncompleteBatch1Lessons,
  rnIncompleteBatch2Lessons,
  rnIncompleteBatch3Lessons,
  rnIncompleteBatch4Lessons,
  rnIncompleteBatch5Lessons,
  rnIncompleteBatch6Lessons,
  rnIncompleteBatch7Lessons,
  npPathoExpansionLessons,
  rnInfectiousDiseaseExpansionLessons,
  rnPathoCardioNeuroLessons,
  npToxicologyContentLessons,
  npRareGeneticContentLessons,
  npCriticalCareContentLessons,
  npRheumatologyContentLessons,
  npAssessmentContentALessons,
  npAssessmentContentBLessons,
  npAssessmentContentCLessons,
  npGeneratedBatch7,
  npCurriculumBatch1,
  npContentExpansionPathoLessons,
  npContentExpansionPatho2Lessons,
  npContentExpansionDxLessons,
  npContentExpansionRxLessons,
  npContentExpansionMiscLessons,
  rnRespiratoryRenalExpansionLessons,
  rnShockCriticalCareLessons,
  rnArrhythmiasExpansionLessons,
  rnChdAnticoagExpansionLessons,
  rnGiCancerPedsIntegLessons,
  rrtPulmonaryDiseasesLessons,
  rrtPharmacologyExpandedLessons,
  rrtNeonatalExpandedLessons,
  rrtCriticalCareAdvancedLessons,
  dmsSonographyUsLessons,
  dmsSonographyCaLessons,
  herbalSupplementsLessons,
  rnMskExpansionLessons,
  rnHeentExpansionLessons,
  rnSafetyForensicExpansionLessons,
  rnInfectionControlExpansionLessons,
  rpnContentBatch037Lessons,
  rpnContentBatch038Lessons,
  rpnContentBatch039Lessons,
  rpnContentBatch040Lessons,
  rpnContentBatch041Lessons,
  rpnContentBatch042Lessons,
  rpnContentBatch043Lessons,
  missingBatch01Lessons,
  missingBatch02Lessons,
  missingBatch03Lessons,
  missingBatch04Lessons,
  missingBatch05Lessons,
  missingBatch06Lessons,
  missingBatch07Lessons,
  missingBatch08Lessons,
  missingBatch09Lessons,
  missingBatch10Lessons,
  missingBatch11Lessons,
  lessonRepairBatch,
  mltLessonRepairBatch,
);


let npBatchesLoaded = false;
let npBatchesLoading: Promise<void> | null = null;

export async function loadNpGeneratedBatches(): Promise<void> {
  if (npBatchesLoaded) return;
  if (npBatchesLoading) return npBatchesLoading;

  npBatchesLoading = Promise.all([
    import("./np-generated-batch-1"),
    import("./np-generated-batch-2"),
    import("./np-generated-batch-3"),
    import("./np-generated-batch-4"),
    import("./np-generated-batch-5"),
    import("./np-generated-batch-6"),
    import("./np-generated-batch-7"),
  ]).then(([b1, b2, b3, b4, b5, b6, b7]) => {
    safeMerge(
      contentMap,
      b1.npGeneratedBatch1,
      b2.npGeneratedBatch2,
      b3.npGeneratedBatch3,
      b4.npGeneratedBatch4,
      b5.npGeneratedBatch5,
      b6.npGeneratedBatch6,
      b7.npGeneratedBatch7,
    );
    npBatchesLoaded = true;
  });

  return npBatchesLoading;
}

export function hasLessonContent(lessonId: string): boolean {
  const lesson = contentMap[lessonId];
  if (!lesson) return false;
  const parts: string[] = [];
  const cellular = typeof lesson.cellular === "string" ? lesson.cellular : lesson.cellular?.content || "";
  parts.push(cellular);
  if (lesson.riskFactors) parts.push(...lesson.riskFactors);
  if (lesson.diagnostics) parts.push(...lesson.diagnostics);
  if (lesson.management) parts.push(...lesson.management);
  if (lesson.nursingActions) parts.push(...lesson.nursingActions);
  if (lesson.assessmentFindings) parts.push(...lesson.assessmentFindings);
  if (lesson.pearls) parts.push(...lesson.pearls);
  if (Array.isArray(lesson.signs)) {
    parts.push(...lesson.signs);
  } else if (lesson.signs) {
    parts.push(...(lesson.signs.left || []), ...(lesson.signs.right || []));
  }
  if (lesson.lifespan) parts.push(typeof lesson.lifespan === "string" ? lesson.lifespan : lesson.lifespan.content || "");
  const totalLength = parts.join(" ").trim().length;
  return totalLength >= 200;
}

export function filterAvailableLessons<T extends { id: string }>(diseases: T[]): T[] {
  return diseases.filter((d) => hasLessonContent(d.id));
}

export const lessonCount = Object.keys(contentMap).length;
export const questionCount = countQuestions(contentMap);
