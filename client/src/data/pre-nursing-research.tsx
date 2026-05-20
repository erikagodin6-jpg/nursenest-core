import { useI18n } from "@/lib/i18n";
import {
  MicroLesson,
  CognitiveCard,
  HoverReveal,
  MatchingExercise,
  SelfCheckQuiz,
  ProgressiveReveal,
} from "@/components/interactive-learning";
import { EditableModuleText, useEditableText } from "@/components/module-edit-context";
import {
  BookOpen,
  BarChart3,
  FlaskConical,
  Lightbulb,
  Search,
  TrendingUp,
  Users,
  Shield,
  PieChart,
  Layers,
} from "lucide-react";

const foundationsQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "rf1",
    question: "A nurse reads a study that tested a new wound care protocol on 200 patients. This is an example of:",
    options: ["Quality improvement", "Evidence-based practice", "Nursing research", "Clinical audit"],
    correctIndex: 2,
    rationale: "Nursing research is the systematic investigation of phenomena relevant to nursing. Testing a new protocol on patients in a formal study is research. EBP uses existing research to guide decisions; QI focuses on improving current processes.",
  },
  {
    id: "rf2",
    question: "Which level of evidence is considered the STRONGEST?",
    options: ["Expert opinion", "Single RCT", "Systematic review of RCTs", "Case report"],
    correctIndex: 2,
    rationale: "Systematic reviews and meta-analyses of multiple RCTs sit at the top of the evidence pyramid because they synthesize findings from multiple high-quality studies, reducing bias and increasing generalizability.",
  },
  {
    id: "rf3",
    question: "A researcher measures blood pressure with a cuff that consistently reads 10 mmHg too high. This instrument has:",
    options: ["High validity, low reliability", "High reliability, low validity", "High validity, high reliability", "Low validity, low reliability"],
    correctIndex: 1,
    rationale: "The cuff is reliable (consistent readings) but not valid (not measuring the true value). Reliability = consistency; validity = accuracy. A tool can be reliable without being valid, but not valid without being reliable.",
    hint: "Think of a scale that always reads 5 lbs heavy. It's consistent but wrong.",
  },
  {
    id: "rf4",
    question: "Which type of bias occurs when participants change their behavior because they know they are being observed?",
    options: ["Selection bias", "Hawthorne effect", "Recall bias", "Publication bias"],
    correctIndex: 1,
    rationale: "The Hawthorne effect describes participants modifying their behavior simply because they are being studied. This can threaten internal validity by introducing a confounding variable.",
  },
  {
    id: "rf5",
    question: "In a study, the 'independent variable' is:",
    options: ["The outcome being measured", "The variable manipulated by the researcher", "A confounding factor", "The sample size"],
    correctIndex: 1,
    rationale: "The independent variable (IV) is what the researcher manipulates or changes. The dependent variable (DV) is the outcome measured. Example: Testing a new drug (IV) on pain levels (DV).",
  },
];

const statisticsQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "rs1",
    question: "A study reports p = 0.03. This means:",
    options: [
      "There is a 3% chance the treatment works",
      "There is a 3% probability that the observed result occurred by chance alone",
      "97% of patients improved",
      "The effect size is 3%",
    ],
    correctIndex: 1,
    rationale: "A p-value represents the probability of obtaining results at least as extreme as observed, assuming the null hypothesis is true. p = 0.03 means there's a 3% chance the result is due to random chance. It does NOT tell you the probability the treatment works.",
    hint: "P-values address the question: 'If there were truly no effect, how likely would we see this result?'",
  },
  {
    id: "rs2",
    question: "The mean, median, and mode of a dataset are all measures of:",
    options: ["Variability", "Central tendency", "Correlation", "Significance"],
    correctIndex: 1,
    rationale: "Central tendency describes where the center of a data distribution lies. Mean (average), median (middle value), and mode (most frequent value) each capture this differently. The median is most useful when data is skewed.",
  },
  {
    id: "rs3",
    question: "A 95% confidence interval for a drug's effect on blood pressure is -8 to -2 mmHg. This means:",
    options: [
      "95% of patients had their BP drop by 8 mmHg",
      "We are 95% confident the true effect lies between -8 and -2 mmHg",
      "The drug fails to lower blood pressure",
      "The p-value is 0.95",
    ],
    correctIndex: 1,
    rationale: "A 95% CI means that if we repeated the study many times, 95% of the intervals would contain the true population parameter. Since this interval doesn't cross zero and is entirely negative, the drug significantly lowers BP.",
  },
  {
    id: "rs4",
    question: "A Type I error occurs when a researcher:",
    options: [
      "Fails to detect a real effect",
      "Rejects the null hypothesis when it is actually true",
      "Uses too small a sample",
      "Reports a large effect size",
    ],
    correctIndex: 1,
    rationale: "Type I error (false positive) = concluding there IS an effect when there isn't one. Type II error (false negative) = concluding there is NO effect when there actually is one. Alpha (α) controls Type I error risk; beta (β) controls Type II.",
    hint: "Type I = 'false alarm.' Type II = 'missed detection.'",
  },
  {
    id: "rs5",
    question: "Correlation does NOT imply causation because:",
    options: [
      "Correlation coefficients are always small",
      "A third variable (confounder) may explain both",
      "Statistics cannot measure relationships",
      "Only experiments can find correlations",
    ],
    correctIndex: 1,
    rationale: "Two variables can be correlated due to a shared underlying cause (confounding variable) rather than one causing the other. Only well-designed experimental studies (like RCTs) can establish causation by controlling for confounders.",
  },
];

const designQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "rd1",
    question: "Which study design provides the STRONGEST evidence for causation?",
    options: ["Cross-sectional survey", "Case-control study", "Randomized controlled trial (RCT)", "Case report"],
    correctIndex: 2,
    rationale: "RCTs randomly assign participants to treatment or control groups, controlling for confounders. This is the gold standard for establishing cause-and-effect relationships. Random assignment ensures groups are comparable at baseline.",
  },
  {
    id: "rd2",
    question: "A researcher interviews 20 nurses about their experiences with moral distress. This is a:",
    options: ["Quantitative study", "Randomized trial", "Qualitative study", "Meta-analysis"],
    correctIndex: 2,
    rationale: "Qualitative research explores experiences, meanings, and perspectives using methods like interviews, focus groups, and observation. It answers 'how' and 'why' questions and produces narrative/thematic data rather than numerical results.",
  },
  {
    id: "rd3",
    question: "A cohort study follows 5,000 nurses over 10 years to see who develops back injuries. The main advantage is:",
    options: [
      "It's fast and cheap",
      "It can establish temporal sequence (exposure before outcome)",
      "It eliminates all bias",
      "It doesn't need a control group",
    ],
    correctIndex: 1,
    rationale: "Cohort studies follow participants forward in time, so you can confirm that the exposure preceded the outcome. This temporal sequence is necessary (but not sufficient) for establishing causation.",
  },
  {
    id: "rd4",
    question: "Internal validity refers to:",
    options: [
      "Whether results can be generalized to other populations",
      "Whether the study accurately measures what it claims to measure",
      "The size of the study sample",
      "How long the study lasted",
    ],
    correctIndex: 1,
    rationale: "Internal validity = the degree to which the study's results are due to the intervention, not confounders. External validity = generalizability to other settings/populations. Both matter, but internal validity must come first.",
  },
];

const ebpQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "re1",
    question: "Evidence-based practice integrates three components. Which is NOT one of them?",
    options: [
      "Best available research evidence",
      "Clinical expertise",
      "Hospital budget constraints",
      "Patient values and preferences",
    ],
    correctIndex: 2,
    rationale: "The three pillars of EBP are: (1) best available research evidence, (2) clinical expertise/judgment, and (3) patient values and preferences. While cost matters in healthcare, it is not one of the defining pillars of EBP.",
  },
  {
    id: "re2",
    question: "A study shows a drug reduces mortality by 50% (relative risk reduction), but the absolute risk reduction is only 0.5%. This means:",
    options: [
      "The drug is highly effective for all patients",
      "The large relative number may overstate the clinical benefit",
      "Relative and absolute risk always agree",
      "The study is flawed",
    ],
    correctIndex: 1,
    rationale: "Relative risk reduction can sound dramatic (50% reduction!) while the absolute benefit is tiny (0.5%). The NNT (number needed to treat) here would be 200 — you'd need to treat 200 patients for 1 to benefit. Always look at absolute numbers for clinical significance.",
    hint: "If baseline risk is 1% and drops to 0.5%, the relative reduction is 50% but the absolute reduction is only 0.5%.",
  },
  {
    id: "re3",
    question: "Statistical significance (p < 0.05) and clinical significance are:",
    options: [
      "Always the same thing",
      "Not necessarily the same — a result can be statistically significant but clinically unimportant",
      "Irrelevant to nursing practice",
      "Only different in qualitative research",
    ],
    correctIndex: 1,
    rationale: "A very large study can detect tiny differences that are statistically significant but clinically meaningless. For example, a drug that lowers BP by 1 mmHg may reach p < 0.05 with 10,000 participants, but 1 mmHg isn't clinically relevant.",
  },
];

const appraisalQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "ra1",
    question: "When critically appraising a study, the FIRST question to ask is:",
    options: [
      "What is the p-value?",
      "What is the research question and is the study design appropriate for it?",
      "How many participants were enrolled?",
      "Was the study published in a top journal?",
    ],
    correctIndex: 1,
    rationale: "Before examining results, assess whether the study design matches the research question. A cross-sectional survey cannot answer a causal question; an RCT is inappropriate for exploring lived experiences. Design-question alignment is fundamental.",
  },
  {
    id: "ra2",
    question: "A study funded by a pharmaceutical company reports their drug is superior. The main concern is:",
    options: [
      "The study is automatically invalid",
      "Potential funding bias and conflict of interest",
      "Company studies always have small samples",
      "The drug must be expensive",
    ],
    correctIndex: 1,
    rationale: "Industry-funded studies are more likely to report favorable results (funding bias). This doesn't automatically invalidate the study, but it should prompt closer scrutiny of methodology, selective reporting, and whether all outcomes are disclosed.",
  },
  {
    id: "ra3",
    question: "A graph shows a Y-axis starting at 95 instead of 0. This technique:",
    options: [
      "Makes the data more accurate",
      "Can visually exaggerate small differences",
      "Is required for scientific papers",
      "Has no effect on interpretation",
    ],
    correctIndex: 1,
    rationale: "Truncating the Y-axis (not starting at 0) can make small differences appear dramatic. This is a common way statistics can be visually misleading. Always check axis scales when interpreting graphs in research papers.",
  },
];

const advancedTopicsQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "at1",
    question: "A researcher recruits participants from a single hospital's waiting room during morning hours only. This is an example of:",
    options: ["Random sampling", "Stratified sampling", "Convenience sampling", "Purposive sampling"],
    correctIndex: 2,
    rationale: "Convenience sampling selects participants based on easy availability rather than random selection. Recruiting from one location at one time introduces sampling bias — the sample may not represent the broader population (e.g., excludes evening/night patients and those at other facilities).",
  },
  {
    id: "at2",
    question: "The Belmont Report principle of 'justice' in research ethics refers to:",
    options: [
      "Ensuring participants sign consent forms",
      "Fair distribution of research burdens and benefits across populations",
      "Keeping participant data confidential",
      "Maximizing the number of participants",
    ],
    correctIndex: 1,
    rationale: "Justice requires that the burdens and benefits of research are distributed equitably. Historically, vulnerable populations (e.g., prisoners, minorities) bore disproportionate research burdens while privileged groups received the benefits. Justice ensures fair participant selection and access to findings.",
    hint: "Think about WHO participates in research and WHO benefits from the results.",
  },
  {
    id: "at3",
    question: "A histogram differs from a bar chart because a histogram:",
    options: [
      "Uses horizontal bars instead of vertical bars",
      "Displays continuous numerical data with no gaps between bars",
      "Can only show categorical data",
      "Always starts the Y-axis at zero",
    ],
    correctIndex: 1,
    rationale: "Histograms display the distribution of continuous numerical data (e.g., ages, weights) with adjacent bars representing intervals. Bar charts display categorical data (e.g., blood types, diagnoses) with gaps between bars. The distinction matters for correct data interpretation.",
  },
  {
    id: "at4",
    question: "In a forest plot from a meta-analysis, a study's confidence interval that crosses the line of no effect (1.0 for ratios or 0 for differences) indicates:",
    options: [
      "The study found a statistically significant result",
      "The study did NOT find a statistically significant result",
      "The study had the largest sample size",
      "The study had high heterogeneity",
    ],
    correctIndex: 1,
    rationale: "In a forest plot, each study is represented by a point estimate and confidence interval. If the CI crosses the line of no effect (null value), the result is not statistically significant for that individual study. Studies whose CIs do not cross the null line found significant effects.",
  },
  {
    id: "at5",
    question: "An IRB (Institutional Review Board) must approve a research study BEFORE it begins primarily to:",
    options: [
      "Ensure the study will produce significant results",
      "Protect the rights and welfare of human research participants",
      "Guarantee the study receives funding",
      "Verify the statistical methods are correct",
    ],
    correctIndex: 1,
    rationale: "IRBs (or REBs in Canada) exist to protect human participants. They review research protocols for ethical concerns including informed consent processes, risk-benefit ratios, confidentiality protections, and safeguards for vulnerable populations. They do not evaluate scientific merit or funding.",
  },
];

const appliedQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "rc1",
    question: "A diagnostic test has 95% sensitivity and 60% specificity. This means:",
    options: [
      "It correctly identifies 95% of people WITH the disease",
      "It correctly identifies 95% of people WITHOUT the disease",
      "60% of positive results are true positives",
      "The test is unreliable",
    ],
    correctIndex: 0,
    rationale: "Sensitivity = true positive rate (how well the test catches disease). Specificity = true negative rate (how well it rules out disease). High sensitivity (95%) means few false negatives — good for screening. Low specificity (60%) means more false positives.",
    hint: "SPin: High Specificity rules IN disease. SNout: High Sensitivity rules OUT disease.",
  },
  {
    id: "rc2",
    question: "NNT (Number Needed to Treat) of 25 means:",
    options: [
      "25 patients must be treated to see any improvement",
      "You need to treat 25 patients for 1 additional patient to benefit",
      "The treatment works for 25% of patients",
      "25 patients were in the study",
    ],
    correctIndex: 1,
    rationale: "NNT = 1 / Absolute Risk Reduction. NNT of 25 means for every 25 patients treated, 1 additional patient will benefit who would not have without treatment. Lower NNT = more effective treatment.",
  },
  {
    id: "rc3",
    question: "A nurse reads that a new protocol 'reduces falls by 30%' but finds no confidence interval reported. The nurse should:",
    options: [
      "Implement the protocol immediately",
      "Question the precision of the estimate and look for more complete data",
      "Assume the 30% is exact",
      "Ignore the study completely",
    ],
    correctIndex: 1,
    rationale: "Without a confidence interval, you don't know the precision of the estimate. The true reduction could range widely. Critical consumers of research always look for confidence intervals, sample sizes, and measures of variability.",
  },
];

export function ResearchStatisticsModule() {
  const { t } = useI18n();
  const whyMattersContent = useEditableText("research-why-matters", "On the NCLEX, you'll encounter questions asking you to differentiate research from QI from EBP. Remember: research creates knowledge, EBP applies it, QI improves local processes.");
  const reliabilityValidityContent = useEditableText("research-reliability-validity", "Reliability = consistency (does it give the same result each time?). Validity = accuracy (does it measure what it claims to?). A bathroom scale that always reads 5 lbs too heavy is reliable but not valid. A tool must be reliable before it can be valid.");
  const clinicalExampleContent = useEditableText("research-clinical-example", "Hospital length-of-stay data is typically right-skewed (most patients stay a few days, but some stay weeks). The median is a better measure than the mean because it isn't inflated by a few very long stays.");
  const standardDeviationContent = useEditableText("research-standard-deviation", "SD measures how spread out data is from the mean. Small SD = data points cluster near the mean. Large SD = data is widely scattered. In a normal distribution, ~68% of values fall within ±1 SD, ~95% within ±2 SD, and ~99.7% within ±3 SD.");
  const pvalueMeaningContent = useEditableText("research-pvalue-meaning", "A p-value is the probability of seeing results as extreme as (or more extreme than) what was observed, IF the null hypothesis were true. p = 0.03 means: 'If there truly were no effect, there's only a 3% chance we'd see results this extreme.' It is NOT the probability the treatment works.");
  const confidenceIntervalsContent = useEditableText("research-confidence-intervals", "A 95% CI gives a range of plausible values for the true effect. If the CI for a treatment difference does NOT cross zero (for differences) or 1.0 (for ratios), the result is statistically significant. CI width reflects precision: narrow = more precise, wide = less certain.");
  const whenToUseContent = useEditableText("research-when-to-use", "Quantitative: 'Does hand hygiene education reduce infection rates?' (measurable outcome). Qualitative: 'What barriers do nurses experience with hand hygiene compliance?' (exploring experiences). Mixed methods combines both.");
  const validityThreatsContent = useEditableText("research-validity-threats", "Internal: selection bias, attrition (dropouts), maturation, history (external events), Hawthorne effect. External: narrow inclusion criteria, single-site study, volunteer bias, artificial lab setting.");
  const clinicalScenarioContent = useEditableText("research-clinical-scenario", "Research shows compression stockings reduce DVT risk (evidence). You know this patient is post-op day 1 (expertise). But the patient refuses to wear them due to discomfort (preferences). EBP means integrating all three — perhaps exploring alternatives like SCDs or patient education.");
  const statVsClinicalContent = useEditableText("research-stat-vs-clinical", "Statistical significance means the result is unlikely due to chance (p < 0.05). Clinical significance means the result is large enough to matter in practice. A drug that lowers HbA1c by 0.1% may be statistically significant with a huge sample but clinically meaningless — you wouldn't change treatment for 0.1%.");
  const snoutSpinContent = useEditableText("research-snout-spin", "SNout: Sensitivity rules OUT — if a highly sensitive test is Negative, you can rule OUT the disease. SPin: Specificity rules IN — if a highly specific test is Positive, you can rule IN the disease. This is a high-yield NCLEX concept.");
  const nntContent = useEditableText("research-nnt", "NNT = 1 ÷ Absolute Risk Reduction. It tells you how many patients must receive the treatment for ONE additional patient to benefit. NNT of 10 is excellent (treat 10, 1 benefits). NNT of 500 means marginal benefit. Always compare NNT to NNH (Number Needed to Harm).");
  const sampleSizeContent = useEditableText("research-sample-size", "Larger samples increase statistical power (the ability to detect a real effect) and produce narrower confidence intervals (more precise estimates). Small samples risk Type II errors (missing real effects) and may not capture population variability. Researchers use power analysis before a study to calculate the minimum sample needed.");
  const samplingBiasContent = useEditableText("research-sampling-bias", "Sampling bias occurs when certain members of the population are systematically more or less likely to be selected. This threatens external validity — your results may not apply to the broader population. Examples: volunteer bias (only motivated people enroll), non-response bias (those who don't respond differ from those who do), and selection bias from convenience sampling.");
  const vulnerablePopContent = useEditableText("research-vulnerable-populations", "Vulnerable populations require additional ethical protections because they have diminished capacity to give truly voluntary consent. This includes: children (require parental consent plus child assent), pregnant women, prisoners, cognitively impaired individuals, economically disadvantaged persons, and those in dependent relationships (e.g., students, employees). IRBs/REBs apply heightened scrutiny to studies involving these groups.");
  const interpretingGraphsContent = useEditableText("research-interpreting-graphs", "When reading any graph, systematically ask: (1) What variables are on each axis? (2) What are the units? (3) Does the Y-axis start at 0, or is it truncated? (4) Are the intervals equal? (5) Is the scale linear or logarithmic? (6) What is the sample size? (7) Are error bars or confidence intervals shown? Missing any of these can lead to misinterpretation.");
  const systematicReviewsPowerContent = useEditableText("research-systematic-reviews-power", "By combining data from multiple studies, systematic reviews and meta-analyses increase statistical power, improve precision of effect estimates, resolve conflicting results from individual studies, and reduce the impact of bias from any single study. They sit at the top of the evidence pyramid and are the foundation of clinical practice guidelines.");

  return (
    <div className="space-y-10" data-testid="module-research-statistics">
      <div>
        <EditableModuleText sectionKey="research-title" defaultText="Nursing Research & Statistics" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="research-desc" defaultText="Build the critical thinking skills to read, interpret, and apply research evidence in clinical nursing practice." as="p" className="text-gray-600" multiline />
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Foundations of Nursing Research</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_research.whatIsNursingResearch")}
          subtitle={t("data.pre_nursing_research.understandingThePurposeAndScope")}
          icon={<BookOpen className="w-5 h-5" />}
        >
          <p className="text-sm text-gray-600 leading-relaxed">
            Nursing research is the{" "}
            <HoverReveal
              term="systematic investigation"
              definition="A structured, organized process of inquiry using scientific methods to answer questions, test hypotheses, and generate new knowledge."
            />{" "}
            of phenomena relevant to nursing practice. It generates the evidence that guides clinical decisions, improves patient outcomes, and advances the profession.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Research</p>
              <p className="text-xs text-blue-600">Generates NEW knowledge through systematic investigation. Asks: "What is true?"</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Evidence-Based Practice</p>
              <p className="text-xs text-emerald-600">APPLIES existing research + clinical expertise + patient preferences to care decisions.</p>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Quality Improvement</p>
              <p className="text-xs text-amber-600">IMPROVES current processes using data. Focuses on systems, not generating generalizable knowledge.</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.whyThisMatters")}
            content={whyMattersContent}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_research.variablesReliabilityValidity")}
          subtitle={t("data.pre_nursing_research.coreConceptsThatUnderpinAll")}
          icon={<Search className="w-5 h-5" />}
        >
          <div className="space-y-3">
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Independent Variable (IV)</p>
              <p className="text-xs text-purple-600">What the researcher manipulates or studies. The presumed cause. Example: a new pain medication.</p>
            </div>
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
              <p className="text-xs font-semibold text-rose-700 mb-1">Dependent Variable (DV)</p>
              <p className="text-xs text-rose-600">The outcome measured. What changes as a result. Example: patient-reported pain score.</p>
            </div>
            <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
              <p className="text-xs font-semibold text-orange-700 mb-1">Confounding Variable</p>
              <p className="text-xs text-orange-600">An uncontrolled variable that may influence the outcome, threatening validity. Example: age differences between groups.</p>
            </div>
          </div>
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_research.reliabilityVsValidity")}
            content={reliabilityValidityContent}
          />
        </MicroLesson>

        <MatchingExercise
          title={t("data.pre_nursing_research.researchTerminology")}
          description={t("data.pre_nursing_research.matchEachResearchTermTo")}
          pairs={[
            { id: "rt1", term: "Null Hypothesis", definition: "States there is NO significant difference or relationship" },
            { id: "rt2", term: "Sampling Bias", definition: "Systematic error in participant selection" },
            { id: "rt3", term: "Informed Consent", definition: "Participants understand risks and voluntarily agree" },
            { id: "rt4", term: "Reliability", definition: "Consistency of measurement over time" },
            { id: "rt5", term: "Validity", definition: "Accuracy — measures what it intends to measure" },
            { id: "rt6", term: "Blinding", definition: "Concealing group assignment to reduce bias" },
          ]}
        />

        <ProgressiveReveal
          title={t("data.pre_nursing_research.levelsOfEvidencePyramid")}
          cards={[
            {
              id: "loe1",
              title: "Level 7: Expert Opinion",
              summary: "Lowest level — clinical experience and expert committees",
              detail: "Based on clinical experience and expert committees. Lowest level but still valuable when no research exists. Includes position statements and consensus guidelines.",
            },
            {
              id: "loe2",
              title: "Level 6: Single Descriptive/Qualitative Study",
              summary: "Individual qualitative studies and case reports",
              detail: "Individual qualitative studies, case reports, or descriptive studies. Provide depth of understanding but limited generalizability.",
            },
            {
              id: "loe3",
              title: "Level 5: Systematic Review of Descriptive/Qualitative Studies",
              summary: "Synthesizes multiple qualitative studies",
              detail: "Synthesizes multiple qualitative or descriptive studies on the same topic. Provides broader perspective than single studies.",
            },
            {
              id: "loe4",
              title: "Level 4: Cohort or Case-Control Studies",
              summary: "Observational studies — suggests associations",
              detail: "Observational studies that follow groups over time (cohort) or look backward from outcomes (case-control). Can suggest associations but not causation.",
            },
            {
              id: "loe5",
              title: "Level 3: Single RCT",
              summary: "Gold standard experimental design",
              detail: "A well-designed randomized controlled trial. Random assignment controls confounders. Strong evidence for cause and effect.",
            },
            {
              id: "loe6",
              title: "Level 2: Systematic Review of RCTs",
              summary: "Combines multiple RCTs systematically",
              detail: "Combines multiple RCTs systematically. Reduces bias from any single study. Very strong evidence.",
            },
            {
              id: "loe7",
              title: "Level 1: Systematic Review with Meta-Analysis of RCTs",
              summary: "Pinnacle of evidence — pooled RCT data",
              detail: "The pinnacle of evidence. Statistically pools data from multiple RCTs for a quantitative summary. Largest sample, least bias, most generalizable conclusions.",
            },
          ]}
        />

        <SelfCheckQuiz title={t("data.pre_nursing_research.knowledgeCheckResearchFoundations")} questions={foundationsQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Core Statistics for Nurses</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_research.descriptiveVsInferentialStatistics")}
          subtitle={t("data.pre_nursing_research.twoFundamentalApproachesToAnalyzing")}
          icon={<BarChart3 className="w-5 h-5" />}
        >
          <p className="text-sm text-gray-600 leading-relaxed">
            <HoverReveal
              term="Descriptive statistics"
              definition="Summarize and describe characteristics of a dataset (mean, median, mode, standard deviation, range). They tell you what the data looks like."
            />{" "}
            tell you what you see.{" "}
            <HoverReveal
              term="Inferential statistics"
              definition="Use sample data to make predictions or generalizations about a larger population. They tell you what you can conclude beyond your sample (p-values, confidence intervals, hypothesis tests)."
            />{" "}
            tell you what you can conclude.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-1">Descriptive</p>
              <p className="text-xs text-teal-600">Mean, median, mode, range, standard deviation, frequency distributions. Summarizes the sample.</p>
            </div>
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 mb-1">Inferential</p>
              <p className="text-xs text-indigo-600">P-values, confidence intervals, t-tests, chi-square, ANOVA, regression. Makes conclusions about the population.</p>
            </div>
          </div>
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_research.meanMedianModeVariability")}
          subtitle={t("data.pre_nursing_research.understandingCentralTendencyAndSpread")}
          icon={<TrendingUp className="w-5 h-5" />}
        >
          <div className="space-y-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Mean (Average)</p>
              <p className="text-xs text-blue-600">Sum of all values ÷ number of values. Sensitive to outliers. Best for normally distributed data.</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Median (Middle Value)</p>
              <p className="text-xs text-emerald-600">The 50th percentile. Not affected by extreme values. Best for skewed data (like hospital LOS).</p>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Mode (Most Frequent)</p>
              <p className="text-xs text-purple-600">The most commonly occurring value. Useful for categorical data (e.g., most common diagnosis).</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.clinicalExample")}
            content={clinicalExampleContent}
          />
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_research.standardDeviationSd")}
            content={standardDeviationContent}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_research.pvaluesSignificanceConfidenceIntervals")}
          subtitle={t("data.pre_nursing_research.theMostMisunderstoodConceptsIn")}
          icon={<Lightbulb className="w-5 h-5" />}
        >
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.whatAPvalueActuallyMeans")}
            content={pvalueMeaningContent}
          />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
              <p className="text-xs font-semibold text-green-700 mb-1">Type I Error (α)</p>
              <p className="text-xs text-green-600">False positive: concluding an effect exists when it doesn't. Controlled by setting α (usually 0.05). "The boy who cried wolf."</p>
            </div>
            <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
              <p className="text-xs font-semibold text-red-700 mb-1">Type II Error (β)</p>
              <p className="text-xs text-red-600">False negative: missing a real effect. Related to statistical power (1-β). Often caused by small sample sizes. "Missing the wolf."</p>
            </div>
          </div>
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_research.confidenceIntervals")}
            content={confidenceIntervalsContent}
          />
        </MicroLesson>

        <MatchingExercise
          title={t("data.pre_nursing_research.statisticsConceptMatching")}
          description={t("data.pre_nursing_research.matchEachStatisticalConceptTo")}
          pairs={[
            { id: "sc1", term: "P-value", definition: "Probability of results if null hypothesis is true" },
            { id: "sc2", term: "Confidence Interval", definition: "Range of plausible values for the true effect" },
            { id: "sc3", term: "Standard Deviation", definition: "Measure of data spread around the mean" },
            { id: "sc4", term: "Type I Error", definition: "False positive — detecting an effect that isn't real" },
            { id: "sc5", term: "Correlation Coefficient", definition: "Strength and direction of linear relationship (-1 to +1)" },
            { id: "sc6", term: "Normal Distribution", definition: "Symmetric bell-shaped curve where mean = median = mode" },
          ]}
        />

        <SelfCheckQuiz title={t("data.pre_nursing_research.knowledgeCheckCoreStatistics")} questions={statisticsQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-violet-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Research Design & Methodology</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_research.quantitativeVsQualitativeResearch")}
          subtitle={t("data.pre_nursing_research.twoComplementaryApproachesToKnowing")}
          icon={<FlaskConical className="w-5 h-5" />}
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-2">Quantitative</p>
              <p className="text-xs text-blue-600 mb-2">Uses numbers, measurements, and statistical analysis. Tests hypotheses. Objective. Answers "how much" and "how many."</p>
              <p className="text-xs text-blue-500 italic">Examples: RCTs, cohort studies, surveys with Likert scales</p>
            </div>
            <div className="p-4 bg-pink-50/60 rounded-xl border border-pink-100">
              <p className="text-xs font-semibold text-pink-700 mb-2">Qualitative</p>
              <p className="text-xs text-pink-600 mb-2">Uses words, themes, and narratives. Explores experiences. Subjective. Answers "how" and "why."</p>
              <p className="text-xs text-pink-500 italic">Examples: interviews, focus groups, ethnography, phenomenology</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.whenToUseEach")}
            content={whenToUseContent}
          />
        </MicroLesson>

        <ProgressiveReveal
          title={t("data.pre_nursing_research.studyDesignHierarchy")}
          cards={[
            {
              id: "sd1",
              title: "Case Report / Case Series",
              summary: "Descriptions of individual patients — generates hypotheses",
              detail: "Detailed descriptions of one or few patients. Generates hypotheses but cannot test them. No comparison group. Useful for rare conditions or new observations.",
            },
            {
              id: "sd2",
              title: "Cross-Sectional Study",
              summary: "Snapshot at one point in time",
              detail: "Snapshot at one point in time. Measures exposure and outcome simultaneously. Cannot determine temporal sequence. Example: surveying nurses' current burnout levels and staffing ratios today.",
            },
            {
              id: "sd3",
              title: "Case-Control Study",
              summary: "Looks backward from outcome to exposure",
              detail: "Starts with outcome (cases vs controls) and looks BACKWARD for exposures. Efficient for rare diseases. Susceptible to recall bias. Example: comparing past medication use in patients who developed liver failure vs those who didn't.",
            },
            {
              id: "sd4",
              title: "Cohort Study",
              summary: "Follows groups forward over time",
              detail: "Follows groups FORWARD over time. Can determine temporal sequence. Prospective or retrospective. Example: following nurses for 10 years to see who develops musculoskeletal injuries based on lifting practices.",
            },
            {
              id: "sd5",
              title: "Randomized Controlled Trial (RCT)",
              summary: "Gold standard — random assignment controls confounders",
              detail: "Gold standard for causation. Randomly assigns participants to intervention or control. Controls for known and unknown confounders. Example: randomizing patients to new wound care protocol vs standard care and comparing healing times.",
            },
            {
              id: "sd6",
              title: "Systematic Review & Meta-Analysis",
              summary: "Synthesizes multiple studies — highest evidence level",
              detail: "Synthesizes multiple studies on the same question. Systematic review uses rigorous search and appraisal. Meta-analysis adds statistical pooling of results. Highest level of evidence when done well.",
            },
          ]}
        />

        <MicroLesson
          title={t("data.pre_nursing_research.validityInResearchDesign")}
          subtitle={t("data.pre_nursing_research.canWeTrustTheResults")}
          icon={<Search className="w-5 h-5" />}
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Internal Validity</p>
              <p className="text-xs text-emerald-600">Are the results due to the intervention and not confounders? Strengthened by: randomization, blinding, control groups, standardized protocols.</p>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">External Validity</p>
              <p className="text-xs text-amber-600">Can results be generalized to other populations/settings? Strengthened by: diverse samples, real-world settings, multi-site studies.</p>
            </div>
          </div>
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_research.commonThreatsToValidity")}
            content={validityThreatsContent}
          />
        </MicroLesson>

        <SelfCheckQuiz title={t("data.pre_nursing_research.knowledgeCheckResearchDesign")} questions={designQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Evidence-Based Practice</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_research.theThreePillarsOfEbp")}
          subtitle={t("data.pre_nursing_research.integratingEvidenceExpertiseAndPatient")}
          icon={<Lightbulb className="w-5 h-5" />}
        >
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Best Research Evidence</p>
              <p className="text-xs text-blue-600">Current, valid, clinically relevant studies. Higher levels of evidence preferred.</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Clinical Expertise</p>
              <p className="text-xs text-emerald-600">The clinician's accumulated knowledge, skills, and judgment from education and experience.</p>
            </div>
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
              <p className="text-xs font-semibold text-rose-700 mb-1">Patient Preferences</p>
              <p className="text-xs text-rose-600">Individual patient values, concerns, cultural beliefs, and expectations about care.</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.clinicalScenario")}
            content={clinicalScenarioContent}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_research.clinicalVsStatisticalSignificance")}
          subtitle={t("data.pre_nursing_research.notEverySignificantPvalueMatters")}
          icon={<TrendingUp className="w-5 h-5" />}
        >
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.theDifference")}
            content={statVsClinicalContent}
          />
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 mt-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">Absolute vs Relative Risk Reduction</p>
            <p className="text-xs text-amber-600">
              Always ask for the absolute numbers. "50% risk reduction" sounds impressive, but if the baseline risk was 2% and dropped to 1%, the absolute reduction is only 1%. NNT = 100 (treat 100 patients for 1 to benefit).
            </p>
          </div>
        </MicroLesson>

        <SelfCheckQuiz title={t("data.pre_nursing_research.knowledgeCheckEvidencebasedPractice")} questions={ebpQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Search className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Critical Appraisal of Research</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_research.howToReadAResearch")}
          subtitle={t("data.pre_nursing_research.aSystematicApproachForBusy")}
          icon={<BookOpen className="w-5 h-5" />}
        >
          <ProgressiveReveal
            title={t("data.pre_nursing_research.stepsForAppraisingAStudy")}
            description={t("data.pre_nursing_research.followThisSequenceWhenEvaluating")}
            steps={[
              {
                id: "ap1",
                title: "1. Read the Abstract",
                content: "Get the big picture: What was the question? What design was used? What were the main findings? This takes 2 minutes and tells you if the full paper is worth reading.",
              },
              {
                id: "ap2",
                title: "2. Assess the Research Question",
                content: "Is the question clear and focused? Does it use a PICO format (Population, Intervention, Comparison, Outcome)? Is it clinically relevant to your practice?",
              },
              {
                id: "ap3",
                title: "3. Evaluate the Design",
                content: "Is the study design appropriate for the question? Causation questions need RCTs. Experience questions need qualitative methods. Is there a control group?",
              },
              {
                id: "ap4",
                title: "4. Examine the Sample",
                content: "How were participants selected? Is the sample representative? Is it large enough? Were there significant dropouts (attrition)? Power analysis done?",
              },
              {
                id: "ap5",
                title: "5. Scrutinize the Results",
                content: "Look beyond p-values. Check effect sizes, confidence intervals, and clinical significance. Are all outcomes reported, or only favorable ones (selective reporting)?",
              },
              {
                id: "ap6",
                title: "6. Consider Limitations & Applicability",
                content: "What biases exist? Can results apply to YOUR patient population? Do the benefits outweigh risks? Is the intervention feasible in your setting?",
              },
            ]}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_research.recognizingMisleadingStatistics")}
          subtitle={t("data.pre_nursing_research.commonTricksAndPitfallsIn")}
          icon={<Lightbulb className="w-5 h-5" />}
        >
          <div className="space-y-3">
            <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
              <p className="text-xs font-semibold text-red-700 mb-1">Truncated Y-Axis</p>
              <p className="text-xs text-red-600">Starting the Y-axis at a value other than 0 makes small differences look dramatic. Always check axis scales.</p>
            </div>
            <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
              <p className="text-xs font-semibold text-orange-700 mb-1">Cherry-Picking Data</p>
              <p className="text-xs text-orange-600">Reporting only favorable outcomes or subgroups. Look for pre-registered study protocols and intention-to-treat analysis.</p>
            </div>
            <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-100">
              <p className="text-xs font-semibold text-yellow-700 mb-1">Relative Risk Without Context</p>
              <p className="text-xs text-yellow-600">"Doubles your risk!" sounds alarming, but if baseline risk is 1 in a million, doubled is still 2 in a million. Always ask for absolute numbers.</p>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Confusing Correlation with Causation</p>
              <p className="text-xs text-purple-600">Ice cream sales and drowning rates both rise in summer — not because ice cream causes drowning, but because of the shared confounder (warm weather).</p>
            </div>
          </div>
        </MicroLesson>

        <SelfCheckQuiz title={t("data.pre_nursing_research.knowledgeCheckCriticalAppraisal")} questions={appraisalQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-cyan-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Applied Clinical Interpretation</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_research.sensitivitySpecificityPredictiveValues")}
          subtitle={t("data.pre_nursing_research.understandingDiagnosticTestPerformance")}
          icon={<Search className="w-5 h-5" />}
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
              <p className="text-xs font-semibold text-green-700 mb-1">Sensitivity (True Positive Rate)</p>
              <p className="text-xs text-green-600">How well does the test detect disease? High sensitivity → few false negatives → good for RULING OUT (SNout).</p>
            </div>
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Specificity (True Negative Rate)</p>
              <p className="text-xs text-blue-600">How well does the test exclude non-disease? High specificity → few false positives → good for RULING IN (SPin).</p>
            </div>
          </div>
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_research.snoutSpin")}
            content={snoutSpinContent}
          />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Positive Predictive Value (PPV)</p>
              <p className="text-xs text-amber-600">If the test is positive, what's the probability the patient truly has the disease? Depends on disease prevalence.</p>
            </div>
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-1">Negative Predictive Value (NPV)</p>
              <p className="text-xs text-teal-600">If the test is negative, what's the probability the patient truly doesn't have the disease? Also depends on prevalence.</p>
            </div>
          </div>
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_research.nntRiskCommunicationClinicalDecisionmaki")}
          subtitle={t("data.pre_nursing_research.translatingNumbersIntoPatientCare")}
          icon={<TrendingUp className="w-5 h-5" />}
        >
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.numberNeededToTreatNnt")}
            content={nntContent}
          />
          <div className="space-y-3 mt-3">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Risk Communication Tips</p>
              <p className="text-xs text-emerald-600">Use absolute numbers: "2 out of 100 patients experience this side effect" is clearer than "2% risk." Use natural frequencies. Avoid framing effects (presenting the same data positively or negatively to influence perception).</p>
            </div>
            <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-100">
              <p className="text-xs font-semibold text-violet-700 mb-1">Avoiding Misinterpretation</p>
              <p className="text-xs text-violet-600">Always ask: What's the baseline risk? What's the absolute difference? Is the confidence interval narrow? Is this population similar to my patient? Does clinical significance match statistical significance?</p>
            </div>
          </div>
        </MicroLesson>

        <MatchingExercise
          title={t("data.pre_nursing_research.appliedInterpretationMatching")}
          description={t("data.pre_nursing_research.matchEachClinicalResearchConcept")}
          pairs={[
            { id: "ai1", term: "NNT", definition: "Patients treated per additional benefit" },
            { id: "ai2", term: "Sensitivity", definition: "Ability of a test to detect true positives" },
            { id: "ai3", term: "Specificity", definition: "Ability of a test to identify true negatives" },
            { id: "ai4", term: "Absolute Risk Reduction", definition: "Actual difference in event rates between groups" },
            { id: "ai5", term: "Relative Risk", definition: "Ratio of event rates between exposed and unexposed" },
            { id: "ai6", term: "Odds Ratio", definition: "Ratio of odds of exposure in cases vs controls" },
          ]}
        />

        <SelfCheckQuiz title={t("data.pre_nursing_research.knowledgeCheckClinicalInterpretation")} questions={appliedQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Sampling, Ethics, Visualization & Synthesis</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_research.samplingMethods")}
          subtitle={t("data.pre_nursing_research.howParticipantsAreSelectedShapes")}
          icon={<Users className="w-5 h-5" />}
        >
          <p className="text-sm text-gray-600 leading-relaxed">
            The way a researcher selects participants from a{" "}
            <HoverReveal
              term="population"
              definition="The entire group of individuals the researcher wants to draw conclusions about (e.g., all registered nurses in Canada). Since studying every member is usually impossible, a sample is drawn."
            />{" "}
            determines whether findings can be generalized. The goal is a sample that accurately represents the target population.
          </p>

          <div className="space-y-3 mt-4">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Simple Random Sampling</p>
              <p className="text-xs text-blue-600">Every member of the population has an equal chance of being selected (like drawing names from a hat). Minimizes selection bias and supports statistical generalization. Gold standard but often impractical in clinical research.</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Stratified Sampling</p>
              <p className="text-xs text-emerald-600">The population is divided into subgroups (strata) based on a key characteristic (e.g., age, sex, diagnosis), then random samples are drawn from each stratum. Ensures proportional representation of important subgroups.</p>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Convenience Sampling</p>
              <p className="text-xs text-amber-600">Participants are selected based on easy availability (e.g., patients in your unit today). Most common in nursing research but highest risk of sampling bias. Results may not generalize beyond the immediate group.</p>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Purposive (Purposeful) Sampling</p>
              <p className="text-xs text-purple-600">Participants are deliberately chosen because they have specific characteristics or experiences relevant to the study. Common in qualitative research. Example: selecting only nurses who have experienced moral distress.</p>
            </div>
          </div>

          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.whySampleSizeMatters")}
            content={sampleSizeContent}
          />
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_research.samplingBias")}
            content={samplingBiasContent}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_research.ethicalConsiderationsInResearch")}
          subtitle={t("data.pre_nursing_research.protectingParticipantsIsANonnegotiable")}
          icon={<Shield className="w-5 h-5" />}
        >
          <p className="text-sm text-gray-600 leading-relaxed">
            Research ethics exist because of historical abuses — the Nazi experiments, the{" "}
            <HoverReveal
              term="Tuskegee Syphilis Study"
              definition="A U.S. Public Health Service study (1932–1972) that deliberately withheld treatment from African American men with syphilis without their informed consent, even after penicillin became the standard cure. This led directly to the Belmont Report and modern research ethics regulations."
            />{" "}
            , and others. Modern ethical frameworks ensure research never exploits participants.
          </p>

          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 mt-4">
            <p className="text-xs font-semibold text-indigo-700 mb-2">Informed Consent in Research</p>
            <p className="text-xs text-indigo-600">Research informed consent requires: (1) disclosure of purpose, procedures, risks, benefits, and alternatives; (2) participant comprehension; (3) voluntary agreement without coercion. Participants must know they can withdraw at any time without penalty to their care.</p>
          </div>

          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100 mt-3">
            <p className="text-xs font-semibold text-teal-700 mb-2">IRB / REB Review</p>
            <p className="text-xs text-teal-600">An Institutional Review Board (IRB) in the U.S. or Research Ethics Board (REB) in Canada must review and approve all human subjects research BEFORE data collection begins. They evaluate risk-benefit ratios, consent processes, confidentiality protections, and safeguards for vulnerable populations.</p>
          </div>

          <ProgressiveReveal
            title={t("data.pre_nursing_research.theBelmontReportThreeCore")}
            cards={[
              {
                id: "bp1",
                title: "Respect for Persons",
                summary: "Autonomy and protection of those with diminished autonomy",
                detail: "Individuals are treated as autonomous agents capable of making their own decisions. Those with diminished autonomy (children, cognitively impaired, prisoners) receive additional protections. This principle underlies informed consent — participants must be given adequate information, comprehend it, and choose freely.",
              },
              {
                id: "bp2",
                title: "Beneficence",
                summary: "Maximize benefits, minimize harms",
                detail: "Researchers have an obligation to (1) do no harm and (2) maximize possible benefits while minimizing possible harms. This requires a careful risk-benefit analysis before and during the study. If risks begin to outweigh benefits, the study must be modified or stopped. This principle led to Data Safety Monitoring Boards in clinical trials.",
              },
              {
                id: "bp3",
                title: "Justice",
                summary: "Fair distribution of research burdens and benefits",
                detail: "The benefits and burdens of research must be distributed equitably. No group should bear a disproportionate share of research risks while another group reaps the benefits. This principle arose from historical exploitation of prisoners, institutionalized individuals, and racial minorities in research. It requires fair participant selection procedures.",
              },
            ]}
          />

          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.vulnerablePopulations")}
            content={vulnerablePopContent}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_research.dataVisualizationInterpretation")}
          subtitle={t("data.pre_nursing_research.readingGraphsCorrectlyIsA")}
          icon={<PieChart className="w-5 h-5" />}
        >
          <div className="space-y-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Bar Charts</p>
              <p className="text-xs text-blue-600">Display categorical data using rectangular bars. Bar height (or length) represents frequency or value. Bars are separated by gaps. Best for comparing discrete groups (e.g., infection rates by unit, diagnoses by type). Always check: Does the Y-axis start at 0?</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Histograms</p>
              <p className="text-xs text-emerald-600">Display the distribution of continuous numerical data. Bars are adjacent (no gaps) because the X-axis represents a continuous scale divided into intervals (bins). Reveals shape of distribution: normal, skewed left, skewed right, bimodal. Example: distribution of patient ages in a study.</p>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Scatter Plots</p>
              <p className="text-xs text-purple-600">Show the relationship between two continuous variables using individual data points plotted on X-Y axes. Reveal correlations (positive, negative, none), outliers, and the strength of relationships. A trend line may be added. Example: plotting hours studied vs exam scores.</p>
            </div>
          </div>

          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_research.interpretingGraphsKeyQuestions")}
            content={interpretingGraphsContent}
          />

          <div className="space-y-3 mt-3">
            <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
              <p className="text-xs font-semibold text-red-700 mb-1">Misleading Visual: Truncated Axes</p>
              <p className="text-xs text-red-600">A Y-axis starting at 98 instead of 0 can make a temperature change from 98.6&deg;F to 99.2&deg;F appear enormous. Always look at the actual numerical difference, not just the visual size of bars or lines.</p>
            </div>
            <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
              <p className="text-xs font-semibold text-orange-700 mb-1">Misleading Visual: Unequal Intervals</p>
              <p className="text-xs text-orange-600">If X-axis intervals are 1, 2, 5, 10, 50, a linear-looking trend may actually represent exponential growth. Verify that axis intervals are consistent before drawing conclusions about rates of change.</p>
            </div>
            <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-100">
              <p className="text-xs font-semibold text-yellow-700 mb-1">Misleading Visual: 3D Charts &amp; Pictographs</p>
              <p className="text-xs text-yellow-600">Three-dimensional bar charts distort visual perception — rear bars appear smaller. Pictographs that scale both width and height make differences appear squared. Stick to simple 2D charts for accurate comparison.</p>
            </div>
          </div>
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_research.systematicReviewsMetaanalysis")}
          subtitle={t("data.pre_nursing_research.thePinnacleOfTheEvidence")}
          icon={<Layers className="w-5 h-5" />}
        >
          <p className="text-sm text-gray-600 leading-relaxed">
            A{" "}
            <HoverReveal
              term="systematic review"
              definition="A rigorous, reproducible method of identifying, appraising, and synthesizing ALL relevant studies on a specific research question. It follows a pre-defined protocol, uses comprehensive search strategies across multiple databases, and applies explicit inclusion/exclusion criteria to minimize bias."
            />{" "}
            synthesizes all available evidence on a question. When it includes statistical pooling of results, it becomes a{" "}
            <HoverReveal
              term="meta-analysis"
              definition="A statistical technique that combines the quantitative results from multiple independent studies into a single pooled estimate, increasing statistical power and providing a more precise effect size than any individual study alone."
            />.
          </p>

          <ProgressiveReveal
            title={t("data.pre_nursing_research.howASystematicReviewIs")}
            cards={[
              {
                id: "sr1",
                title: "Step 1: Formulate the Question",
                summary: "Define a focused, answerable research question using PICO",
                detail: "The review begins with a clearly defined question, typically structured using PICO (Population, Intervention, Comparison, Outcome). Example: 'In hospitalized adults (P), does early mobilization (I) compared to bed rest (C) reduce length of stay (O)?' The protocol is often registered in advance (e.g., PROSPERO database).",
              },
              {
                id: "sr2",
                title: "Step 2: Comprehensive Literature Search",
                summary: "Search multiple databases with a systematic, reproducible strategy",
                detail: "Reviewers search multiple databases (PubMed, CINAHL, Cochrane, Embase) using predefined search terms. The search strategy is documented in detail so it can be reproduced. Grey literature (dissertations, conference proceedings) may also be searched to reduce publication bias.",
              },
              {
                id: "sr3",
                title: "Step 3: Screen & Select Studies",
                summary: "Apply inclusion/exclusion criteria, usually with two independent reviewers",
                detail: "Two or more reviewers independently screen titles, abstracts, and full texts against pre-defined inclusion and exclusion criteria. Disagreements are resolved by consensus or a third reviewer. A PRISMA flow diagram documents how many studies were identified, screened, excluded (with reasons), and included.",
              },
              {
                id: "sr4",
                title: "Step 4: Extract Data & Assess Quality",
                summary: "Systematically extract results and evaluate risk of bias",
                detail: "Data from each included study is extracted into standardized forms (sample size, design, outcomes, effect sizes). Study quality is assessed using validated tools (e.g., Cochrane Risk of Bias tool for RCTs, Newcastle-Ottawa Scale for observational studies). Low-quality studies may be excluded or analyzed separately.",
              },
              {
                id: "sr5",
                title: "Step 5: Synthesize & Pool Results",
                summary: "Combine findings narratively or statistically (meta-analysis)",
                detail: "If studies are sufficiently similar (homogeneous), results are statistically pooled in a meta-analysis to produce a single summary effect size. If studies are too different (heterogeneous), a narrative synthesis describes patterns across studies. The pooled result is displayed in a forest plot.",
              },
            ]}
          />

          <div className="space-y-3 mt-4">
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 mb-1">Forest Plots</p>
              <p className="text-xs text-indigo-600">The primary visual output of a meta-analysis. Each horizontal line represents one study: the square is the point estimate (effect size), the line is the confidence interval, and the square's size reflects the study's weight. The diamond at the bottom represents the pooled (combined) effect. A vertical line of no effect (0 for mean differences, 1.0 for ratios) helps determine significance.</p>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Heterogeneity (I&sup2;)</p>
              <p className="text-xs text-amber-600">Measures how much variation across studies is due to real differences rather than chance. I&sup2; = 0% means no heterogeneity (studies agree). I&sup2; &gt; 50% suggests substantial heterogeneity — the pooled result should be interpreted cautiously. Sources include differences in populations, interventions, or outcome measures.</p>
            </div>
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-1">Pooled Effect Size</p>
              <p className="text-xs text-teal-600">The combined estimate from all studies, weighted by study size and precision. Represented by the diamond in a forest plot. A narrow diamond indicates a precise pooled estimate. If the diamond does not cross the line of no effect, the overall result is statistically significant.</p>
            </div>
          </div>

          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_research.whySystematicReviewsArePowerful")}
            content={systematicReviewsPowerContent}
          />
        </MicroLesson>

        <SelfCheckQuiz title={t("data.pre_nursing_research.knowledgeCheckAdvancedResearchTopics")} questions={advancedTopicsQuiz} />

        <MatchingExercise
          title={t("data.pre_nursing_research.advancedResearchConcepts")}
          description={t("data.pre_nursing_research.matchEachResearchConceptTo")}
          pairs={[
            { id: "ar1", term: "Convenience Sampling", definition: "Selecting participants based on easy availability" },
            { id: "ar2", term: "Belmont Report", definition: "Foundational document establishing respect, beneficence, and justice in research" },
            { id: "ar3", term: "Forest Plot", definition: "Visual display of individual and pooled results in meta-analysis" },
            { id: "ar4", term: "Heterogeneity (I\u00B2)", definition: "Measure of variation across studies beyond chance" },
            { id: "ar5", term: "Stratified Sampling", definition: "Dividing population into subgroups before random selection" },
            { id: "ar6", term: "Histogram", definition: "Graph displaying distribution of continuous data with adjacent bars" },
            { id: "ar7", term: "IRB / REB", definition: "Ethics committee that reviews research before it begins" },
            { id: "ar8", term: "Purposive Sampling", definition: "Deliberately selecting participants with specific characteristics" },
          ]}
        />
      </section>
    </div>
  );
}
