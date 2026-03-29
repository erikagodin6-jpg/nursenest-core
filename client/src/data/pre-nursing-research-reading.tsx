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
import { FileText, BarChart3, Search, BookOpen } from "lucide-react";

export function ResearchReadingModule() {
  const { t } = useI18n();
  const picoContent = useEditableText("rr-pico-content", "PICO is a framework for formulating clinical questions that can be answered through research. P = Patient/Population (Who is the patient or group?), I = Intervention (What treatment or action is being considered?), C = Comparison (What is the alternative — another treatment, placebo, or no treatment?), O = Outcome (What is the desired measurable result?). Example: In hospitalized elderly patients (P), does hourly rounding (I) compared to standard care (C) reduce fall rates (O)? A well-built PICO question guides your literature search and helps you find the most relevant evidence.");
  const biasContent = useEditableText("rr-bias-content", "Bias is any systematic error that distorts study results. Selection bias occurs when participants are not representative of the target population or are not randomly assigned. Measurement bias happens when outcomes are assessed inconsistently or when assessors know which group participants belong to (lack of blinding). Publication bias arises because studies with positive or significant results are more likely to be published, creating a skewed evidence base. Attrition bias occurs when participants drop out unevenly between groups. Understanding bias helps you evaluate whether a study's conclusions are trustworthy.");
  const significanceContent = useEditableText("rr-significance-content", "Statistical significance (p < 0.05) means the result is unlikely due to chance alone — but it does NOT mean the result is clinically important. A study might find a statistically significant blood pressure reduction of 1 mmHg with a new drug — statistically real but clinically meaningless. Clinical significance asks: Is the effect large enough to matter to patients? Always look at effect size, confidence intervals, and clinical context, not just p-values.");

  return (
    <div className="space-y-10" data-testid="module-research-reading">
      <div>
        <EditableModuleText sectionKey="rr-title" defaultText="Research Literacy & Evidence-Based Practice" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="rr-desc" defaultText="Learn to read, interpret, and critically appraise nursing research. Understand the evidence-based practice process, statistical concepts, and levels of evidence that guide clinical decision-making." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Anatomy of a Research Article" subtitle="Understanding each section's purpose" icon={<FileText className="w-5 h-5" />}>
        <EditableModuleText sectionKey="rr-article-anatomy-content" defaultText="Research articles follow a standardized structure called IMRAD: Introduction, Methods, Results, and Discussion. Understanding what each section contains helps you efficiently extract the information you need without reading every word." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_research_reading.sectionsOfAResearchArticle")}
          cards={[
            {
              id: "rr-abstract",
              title: "Abstract",
              summary: "A condensed summary of the entire study",
              detail: "The abstract provides a brief overview of the study's purpose, methods, key findings, and conclusions — typically 150-300 words. It helps you quickly decide if the full article is relevant to your clinical question. Structured abstracts with labeled sections (Background, Methods, Results, Conclusions) are easier to scan than unstructured paragraphs.",
            },
            {
              id: "rr-intro",
              title: "Introduction / Literature Review",
              summary: "Why the study was conducted",
              detail: "The introduction establishes the clinical problem, reviews existing literature, identifies gaps in knowledge, and states the study's purpose and research question or hypothesis. Look here to understand the context and rationale for the study. A strong introduction builds a logical argument for why this study needed to be done.",
            },
            {
              id: "rr-methods",
              title: "Methods",
              summary: "How the study was conducted",
              detail: "The methods section describes the study design (RCT, cohort, case-control), sample size and selection criteria, intervention details, outcome measures, and statistical analyses planned. This section is critical for evaluating study quality. Look for randomization, blinding, valid measurement tools, appropriate sample size, and ethical approval (IRB). If the methods are flawed, the results cannot be trusted.",
            },
            {
              id: "rr-results",
              title: "Results",
              summary: "What the study found — data without interpretation",
              detail: "Results present the data objectively through text, tables, and figures. Look for the primary outcome measure, p-values, confidence intervals, effect sizes, and any unexpected findings. Results should report all outcomes specified in the methods — selective reporting is a red flag. Tables and figures often contain the most important information in a concise format.",
            },
            {
              id: "rr-discussion",
              title: "Discussion / Conclusion",
              summary: "What the findings mean in clinical context",
              detail: "The discussion interprets results in context of existing literature, addresses study limitations, suggests clinical implications, and proposes future research directions. Authors may overstate findings here — compare their claims to the actual data in the results section. Strong discussions acknowledge limitations honestly and avoid causal language for non-experimental designs.",
            },
          ]}
        />
      </MicroLesson>

      <MicroLesson title="Identifying Bias in Research" subtitle="Recognizing threats to validity" icon={<Search className="w-5 h-5" />}>
        <EditableModuleText sectionKey="rr-bias-intro" defaultText="Every study has potential biases. Critical appraisal means identifying these biases and determining whether they are significant enough to invalidate the conclusions. No study is perfect — the question is whether the biases are adequately controlled." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Selection Bias</p>
            <p className="text-xs text-red-600">Occurs when study participants are not representative of the target population, or when group assignment is not truly random. Example: A study on fall prevention that only includes alert, oriented patients excludes the population at highest risk — the results may not apply to cognitively impaired patients who fall most often.</p>
          </div>
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-700 mb-1">Measurement Bias</p>
            <p className="text-xs text-orange-600">Occurs when outcomes are measured inconsistently or when the assessor knows which group a participant belongs to. Example: If the nurse assessing wound healing knows which patients received the new dressing, their assessment may be unconsciously influenced. Blinding (masking) prevents this bias.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Publication Bias</p>
            <p className="text-xs text-purple-600">Studies with positive or statistically significant results are more likely to be published. This creates a distorted evidence base where interventions appear more effective than they truly are. Systematic reviews that search for unpublished studies and trial registries help counteract this bias.</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Attrition Bias</p>
            <p className="text-xs text-blue-600">When participants drop out of a study unevenly between groups. If sicker patients leave the treatment group due to side effects, the remaining participants appear healthier — making the treatment look more effective than it is. Intention-to-treat analysis helps address this by analyzing all participants in their original groups.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_research_reading.understandingBiasInResearch")}
          content={biasContent}
        />
      </MicroLesson>

      <MicroLesson title="Statistical Concepts for Nurses" subtitle="P-values, confidence intervals, and risk measures" icon={<BarChart3 className="w-5 h-5" />}>
        <EditableModuleText sectionKey="rr-stats-content" defaultText="You do not need to be a statistician to read research — but you need to understand a few key concepts to determine whether findings are meaningful and applicable to your patients." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">P-Value (Probability Value)</p>
            <p className="text-xs text-blue-600">The p-value tells you the probability that the observed result occurred by chance alone. A p-value less than 0.05 means there is less than a 5% probability the result is due to chance — this is the conventional threshold for statistical significance. However, p = 0.049 and p = 0.051 are practically identical — the 0.05 cutoff is a convention, not a magical boundary.</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Confidence Interval (CI)</p>
            <p className="text-xs text-teal-600">A 95% confidence interval provides a range within which the true population value likely falls. Example: If a drug reduces blood pressure by 8 mmHg (95% CI: 5-11), we are 95% confident the true effect is between 5 and 11 mmHg. If the CI crosses zero (e.g., -2 to 6), the effect may be zero — the result is not statistically significant. Narrower CIs indicate more precise estimates (usually from larger samples).</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Relative Risk (RR) vs Absolute Risk Reduction (ARR) vs NNT</p>
            <p className="text-xs text-green-600">Relative Risk compares the risk between groups (e.g., 50% reduction sounds impressive). Absolute Risk Reduction shows the actual difference (e.g., from 4% to 2% = ARR of 2%). Number Needed to Treat (NNT) = 1/ARR — the number of patients you must treat for one to benefit (NNT = 50 means you treat 50 patients for one to benefit). NNT puts effectiveness in practical clinical perspective.</p>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_research_reading.statisticalVsClinicalSignificance")}
          content={significanceContent}
        />
      </MicroLesson>

      <MicroLesson title="Levels of Evidence & EBP Process" subtitle="Hierarchy of evidence and the PICO framework" icon={<BookOpen className="w-5 h-5" />}>
        <EditableModuleText sectionKey="rr-evidence-content" defaultText="Not all evidence is created equal. The evidence pyramid ranks study types by their ability to minimize bias and establish causation. Higher levels of evidence generally provide more reliable conclusions for clinical decision-making." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 mt-3">
          <p className="text-xs font-semibold text-indigo-700 mb-2">Evidence Pyramid (Highest to Lowest)</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</div>
              <span className="text-xs text-indigo-700 font-medium">Systematic Reviews & Meta-Analyses — synthesize all available evidence on a topic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold">2</div>
              <span className="text-xs text-indigo-600 font-medium">Randomized Controlled Trials (RCTs) — gold standard for testing interventions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-400 text-white text-xs flex items-center justify-center font-bold">3</div>
              <span className="text-xs text-indigo-600">Cohort Studies — follow groups over time to observe outcomes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-300 text-white text-xs flex items-center justify-center font-bold">4</div>
              <span className="text-xs text-indigo-500">Case-Control Studies — compare cases with controls retrospectively</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 text-xs flex items-center justify-center font-bold">5</div>
              <span className="text-xs text-indigo-400">Case Reports / Series — descriptions of individual cases</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">6</div>
              <span className="text-xs text-indigo-400">Expert Opinion — lowest level, based on authority not data</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 mt-3">
          <p className="text-xs font-semibold text-emerald-700 mb-1">Sensitivity vs Specificity</p>
          <p className="text-xs text-emerald-600">Sensitivity answers: If the disease IS present, will the test detect it? (True positive rate — SnNOUT: a Sensitive test, when Negative, rules OUT the disease). Specificity answers: If the disease is NOT present, will the test correctly show negative? (True negative rate — SpPIN: a Specific test, when Positive, rules IN the disease). High sensitivity tests are best for screening; high specificity tests are best for confirmation.</p>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_research_reading.thePicoFramework")}
          content={picoContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_research_reading.matchTheResearchConcept")}
        pairs={[
          { id: "rr-m1", term: "P-value", definition: "Probability the result occurred by chance" },
          { id: "rr-m2", term: "Confidence interval", definition: "Range where the true value likely falls" },
          { id: "rr-m3", term: "NNT", definition: "Number of patients treated for one to benefit" },
          { id: "rr-m4", term: "Selection bias", definition: "Non-representative study participants" },
          { id: "rr-m5", term: "Meta-analysis", definition: "Statistical combination of multiple studies" },
          { id: "rr-m6", term: "Sensitivity", definition: "Ability of a test to detect disease when present" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_research_reading.researchReadingQuiz")}
        questions={[
          {
            id: "rr1",
            question: "Which section of a research article describes how the study was conducted, including design, sample, and data collection?",
            options: ["Abstract", "Introduction", "Methods", "Discussion"],
            correctIndex: 2,
            rationale: "The methods section describes the study design, sample selection, data collection procedures, measurement tools, and statistical analyses planned. It is the key section for evaluating study quality and trustworthiness.",
          },
          {
            id: "rr2",
            question: "A p-value of 0.03 means:",
            options: ["There is a 3% chance the treatment works", "There is a 3% probability the result is due to chance", "The treatment is 97% effective", "The result is clinically significant"],
            correctIndex: 1,
            rationale: "A p-value of 0.03 means there is a 3% probability that the observed result could have occurred by chance alone, assuming the null hypothesis is true. It does NOT measure treatment effectiveness or clinical significance.",
          },
          {
            id: "rr3",
            question: "What is the highest level of evidence in the evidence pyramid?",
            options: ["Randomized controlled trials", "Expert opinion", "Systematic reviews and meta-analyses", "Cohort studies"],
            correctIndex: 2,
            rationale: "Systematic reviews and meta-analyses sit at the top of the evidence pyramid because they synthesize all available evidence on a topic, providing the most comprehensive and least biased summary of the evidence.",
          },
          {
            id: "rr4",
            question: "In a PICO question, the 'C' stands for:",
            options: ["Clinical relevance", "Comparison", "Confidence interval", "Control group"],
            correctIndex: 1,
            rationale: "In the PICO framework, C stands for Comparison — the alternative being compared to the intervention, such as standard care, placebo, or another treatment.",
          },
          {
            id: "rr5",
            question: "Publication bias occurs because:",
            options: ["Researchers publish too many studies", "Studies with positive results are more likely to be published", "Journals only accept randomized trials", "Patients refuse to participate in negative studies"],
            correctIndex: 1,
            rationale: "Publication bias occurs because studies with positive or statistically significant results are more likely to be published, creating a skewed evidence base that overestimates treatment effectiveness.",
          },
          {
            id: "rr6",
            question: "A 95% confidence interval of 2.5 to 7.8 for a blood pressure reduction means:",
            options: ["The drug works 95% of the time", "We are 95% confident the true reduction is between 2.5 and 7.8 mmHg", "The p-value is 0.95", "95% of patients will have this exact result"],
            correctIndex: 1,
            rationale: "A 95% confidence interval provides the range within which we are 95% confident the true population value falls. Since neither bound crosses zero, this result is also statistically significant.",
          },
          {
            id: "rr7",
            question: "If a treatment reduces the event rate from 10% to 5%, the absolute risk reduction (ARR) is:",
            options: ["50%", "5%", "10%", "2%"],
            correctIndex: 1,
            rationale: "ARR = control event rate minus treatment event rate = 10% - 5% = 5%. Note that the relative risk reduction would be 50% (5/10), which sounds more impressive but is less informative than the ARR.",
          },
          {
            id: "rr8",
            question: "If the ARR is 5%, the Number Needed to Treat (NNT) is:",
            options: ["5", "10", "20", "50"],
            correctIndex: 2,
            rationale: "NNT = 1/ARR = 1/0.05 = 20. This means you need to treat 20 patients with this intervention for one additional patient to benefit compared to the control group.",
          },
          {
            id: "rr9",
            question: "Measurement bias is BEST prevented by:",
            options: ["Using a larger sample size", "Blinding the outcome assessors", "Including more study sites", "Publishing in a peer-reviewed journal"],
            correctIndex: 1,
            rationale: "Measurement bias occurs when outcome assessors know which group participants belong to, potentially influencing their assessment. Blinding (masking) the assessors prevents this unconscious influence.",
          },
          {
            id: "rr10",
            question: "The 'gold standard' study design for testing the effectiveness of a clinical intervention is:",
            options: ["Case-control study", "Cross-sectional survey", "Randomized controlled trial (RCT)", "Qualitative interview study"],
            correctIndex: 2,
            rationale: "RCTs are the gold standard for testing interventions because randomization distributes known and unknown confounders equally between groups, allowing researchers to establish causation rather than just correlation.",
          },
          {
            id: "rr11",
            question: "A nurse reads a study and finds a statistically significant blood pressure reduction of 1 mmHg (p = 0.01). The nurse should conclude:",
            options: ["The drug is effective and should be used immediately", "The result is statistically significant but likely not clinically significant", "A p-value of 0.01 means the drug is 99% effective", "The study must have been poorly designed"],
            correctIndex: 1,
            rationale: "A 1 mmHg reduction, while statistically significant (unlikely due to chance), is too small to make a meaningful clinical difference for patients. Statistical significance does not equal clinical significance.",
          },
          {
            id: "rr12",
            question: "Attrition bias is MOST concerning when:",
            options: ["The sample size is very large", "Participants drop out unevenly between study groups", "The study uses validated measurement tools", "The study is published in a high-impact journal"],
            correctIndex: 1,
            rationale: "Attrition bias occurs when dropout rates differ between groups or when participants who drop out differ systematically from those who remain. This can make one group appear healthier than it truly is.",
          },
          {
            id: "rr13",
            question: "A test with high sensitivity is best used for:",
            options: ["Confirming a diagnosis", "Screening for disease", "Determining disease severity", "Predicting prognosis"],
            correctIndex: 1,
            rationale: "A highly sensitive test rarely misses true cases (few false negatives), making it ideal for screening. The mnemonic SnNOUT: a Sensitive test, when Negative, rules OUT the disease.",
          },
          {
            id: "rr14",
            question: "Which component of PICO is missing from this question: 'In adults with type 2 diabetes, does metformin reduce HbA1c levels?'",
            options: ["Patient/Population", "Intervention", "Comparison", "Outcome"],
            correctIndex: 2,
            rationale: "The question specifies Population (adults with type 2 diabetes), Intervention (metformin), and Outcome (HbA1c levels), but lacks a Comparison — compared to what? Placebo? Diet alone? Another medication?",
          },
          {
            id: "rr15",
            question: "If a confidence interval for relative risk crosses 1.0 (e.g., RR = 0.8, 95% CI: 0.6-1.2), this means:",
            options: ["The treatment is definitely effective", "The result is NOT statistically significant", "The treatment doubles the risk", "The study should be repeated"],
            correctIndex: 1,
            rationale: "For relative risk, a CI that crosses 1.0 means the true effect could be protective, harmful, or no different — the result is not statistically significant. RR = 1.0 means no difference between groups.",
          },
          {
            id: "rr16",
            question: "A cohort study differs from a randomized controlled trial because cohort studies:",
            options: ["Are always retrospective", "Do not randomly assign participants to groups", "Cannot measure outcomes", "Are higher on the evidence pyramid"],
            correctIndex: 1,
            rationale: "Cohort studies observe groups that are naturally exposed or unexposed to a factor, without randomization. This means confounding variables may influence results, making cohort studies lower on the evidence pyramid than RCTs.",
          },
          {
            id: "rr17",
            question: "The abstract of a research article is MOST useful for:",
            options: ["Evaluating study quality in detail", "Understanding the statistical analysis", "Quickly determining if the article is relevant to your question", "Identifying all potential biases"],
            correctIndex: 2,
            rationale: "The abstract provides a concise summary of the study's purpose, methods, results, and conclusions. It helps clinicians quickly determine relevance before investing time in reading the full article.",
          },
          {
            id: "rr18",
            question: "A test with high specificity (SpPIN) is best used for:",
            options: ["Screening large populations", "Ruling in (confirming) a diagnosis", "Predicting treatment response", "Measuring disease prevalence"],
            correctIndex: 1,
            rationale: "A highly specific test rarely produces false positives. SpPIN: a Specific test, when Positive, rules IN the disease. It is best used for confirmatory testing after an initial screening test.",
          },
          {
            id: "rr19",
            question: "Intention-to-treat analysis means:",
            options: ["Only analyzing participants who completed the study", "Analyzing all participants in their originally assigned groups regardless of completion", "Treating all participants with the experimental intervention", "Intending to treat but withholding treatment"],
            correctIndex: 1,
            rationale: "Intention-to-treat analysis includes all randomized participants in their original groups, even if they dropped out or switched groups. This preserves randomization and prevents attrition bias from distorting results.",
          },
          {
            id: "rr20",
            question: "The evidence-based practice process begins with:",
            options: ["Searching the literature", "Implementing a new protocol", "Asking a focused clinical question (PICO)", "Evaluating outcomes"],
            correctIndex: 2,
            rationale: "EBP begins with formulating a clear, focused clinical question using the PICO framework. Without a well-defined question, literature searches are unfocused and evidence appraisal lacks direction.",
          },
        ]}
      />
    </div>
  );
}