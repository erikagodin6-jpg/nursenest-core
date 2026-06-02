export interface ExamSimulatorSection {
  id: string;
  title: string;
  description: string;
  instructions?: string[];
}

export interface ExamSimulatorCopy {
  hero: { title: string; subtitle: string; ctaText: string };
  features: { title: string; description: string; icon: string }[];
  examModes: ExamSimulatorSection[];
  duringExam: { timerLabel: string; pauseText: string; flagText: string; submitText: string; reviewText: string; nextText: string; prevText: string; confidenceLevels: string[] };
  resultsScreen: { title: string; summaryLabel: string; scoreLabel: string; passThreshold: string; disciplineBreakdown: string; timeSpent: string; reviewMissed: string; retakeText: string };
  tips: string[];
  disclaimers: string[];
}

export const mltExamSimulatorCopy: ExamSimulatorCopy = {
  hero: {
    title: "MLT Exam Simulator",
    subtitle: "Practice under real exam conditions with timed, discipline-weighted questions that mirror the CSMLS and ASCP certification format.",
    ctaText: "Start Practice Exam",
  },
  features: [
    { title: "Exam-Weighted Distribution", description: "Questions distributed across disciplines according to CSMLS and ASCP exam blueprints — Hematology, Chemistry, Microbiology, Blood Banking, Urinalysis, and more.", icon: "chart" },
    { title: "Timed Simulation", description: "Practice with the same time constraints you'll face on exam day. Build your pacing strategy and learn to manage the clock effectively.", icon: "clock" },
    { title: "Detailed Rationales", description: "Every question includes a thorough rationale explaining why the correct answer is right AND why each distractor is wrong — turning mistakes into learning moments.", icon: "book" },
    { title: "Performance Analytics", description: "Track your scores by discipline, identify weak areas, and monitor improvement over time with detailed analytics dashboards.", icon: "analytics" },
    { title: "Adaptive Difficulty", description: "Questions adjust to your performance level — as you master easier concepts, the simulator introduces more challenging clinical scenarios.", icon: "trending-up" },
    { title: "Flag & Review", description: "Flag uncertain questions during the exam and review them before submission — just like the real certification test.", icon: "flag" },
  ],
  examModes: [
    { id: "full-exam", title: "Full Practice Exam", description: "150-200 questions across all disciplines, timed to match CSMLS or ASCP exam duration. The closest simulation to your actual certification test.", instructions: ["Set aside 3-4 uninterrupted hours", "Use a quiet environment without distractions", "Do not use notes or references during the exam", "Flag questions you're unsure about and review before submitting", "Review all rationales after completing the exam"] },
    { id: "discipline-exam", title: "Discipline Focus Exam", description: "25-50 questions from a single discipline. Perfect for targeted practice on your weakest areas.", instructions: ["Select the discipline you want to practice", "Questions range from recall to application level", "Review rationales immediately after each question or at the end", "Track your score improvement across multiple attempts"] },
    { id: "mini-quiz", title: "Quick Quiz (10 Questions)", description: "A fast 10-question quiz for daily practice. Great for building consistency and reinforcing knowledge during study breaks.", instructions: ["Takes approximately 10-15 minutes", "Questions are randomly selected across all disciplines", "Instant scoring with rationale review", "Perfect for daily practice streaks"] },
    { id: "missed-review", title: "Missed Questions Review", description: "Retake only the questions you previously answered incorrectly. The most efficient way to turn weaknesses into strengths.", instructions: ["Questions are pulled from your personal error history", "Focus on understanding why you missed each question", "Aim to answer correctly on the second attempt", "Questions you answer correctly are removed from the review pool"] },
    { id: "timed-challenge", title: "Speed Challenge", description: "30 questions in 30 minutes — test your ability to work quickly and accurately under pressure.", instructions: ["One minute per question average pace", "Builds exam-day time management skills", "Great for improving decision speed on familiar content", "Track your speed vs accuracy tradeoff"] },
  ],
  duringExam: {
    timerLabel: "Time Remaining",
    pauseText: "Pause Exam",
    flagText: "Flag for Review",
    submitText: "Submit Exam",
    reviewText: "Review Flagged",
    nextText: "Next Question",
    prevText: "Previous Question",
    confidenceLevels: ["Guessing", "Somewhat Confident", "Confident", "Very Confident"],
  },
  resultsScreen: {
    title: "Exam Results",
    summaryLabel: "Performance Summary",
    scoreLabel: "Overall Score",
    passThreshold: "Passing threshold: 70% (approximate — actual exam passing scores are determined by psychometric scaling)",
    disciplineBreakdown: "Score by Discipline",
    timeSpent: "Total Time",
    reviewMissed: "Review Missed Questions",
    retakeText: "Retake Exam",
  },
  tips: [
    "Read each question stem completely before looking at the answer choices — many errors come from misreading the question.",
    "Eliminate obviously wrong answers first, then choose between the remaining options.",
    "If two answers seem similar, the correct answer is usually more specific or complete.",
    "Watch for absolute words like 'always,' 'never,' and 'only' — these are often in incorrect answers.",
    "For calculation questions, double-check your units and decimal points before selecting your answer.",
    "If you're stuck, flag the question and move on — don't spend more than 90 seconds on any single question.",
    "Trust your first instinct unless you have a specific reason to change your answer.",
    "Pay attention to patient age, specimen type, and clinical context in scenario-based questions.",
    "For questions about normal ranges, remember that slight variations exist between sources — focus on clearly abnormal vs clearly normal.",
    "During your review, only change answers if you can articulate WHY the new answer is better.",
  ],
  disclaimers: [
    "This simulator is a study aid and does not guarantee certification exam results.",
    "Question content is based on published exam blueprints but questions are not sourced from actual certification exams.",
    "Passing thresholds shown are approximate — actual CSMLS and ASCP passing scores are determined by psychometric methods and may vary.",
    "Always refer to your certifying body (CSMLS or ASCP) for official exam information, eligibility requirements, and testing policies.",
  ],
};
