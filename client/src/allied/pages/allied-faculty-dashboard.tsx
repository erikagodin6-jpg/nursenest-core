import { useState } from "react";
import { useRegion } from "@/allied/use-region";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, Users, Target, TrendingUp, AlertTriangle, Download,
  Globe, ChevronDown, Activity, BookOpen, Shield, FileText,
  ThermometerSun, Stethoscope, Microscope, Truck, Pill, ScanLine
} from "lucide-react";

type Career = {
  label: string;
  slug: string;
  icon: typeof Stethoscope;
  domains: string[];
};

const FACULTY_CAREERS: Career[] = [
  {
    label: "Pharmacy Tech",
    slug: "pharmacy-tech",
    icon: Pill,
    domains: [
      "Medication Safety", "Pharmacy Law", "Pharmacology", "Sterile Compounding",
      "Inventory Management", "Prescription Processing", "Patient Communication", "Quality Assurance"
    ],
  },
  {
    label: "RRT",
    slug: "rrt",
    icon: ThermometerSun,
    domains: [
      "Gas Exchange Physiology", "Oxygen Delivery Systems", "ABG Interpretation", "Acid-Base Disorders",
      "Mechanical Ventilation", "ARDS Management", "Airway Management", "Ventilator Troubleshooting"
    ],
  },
  {
    label: "Paramedic",
    slug: "paramedic",
    icon: Truck,
    domains: [
      "Trauma Assessment", "ACLS Pharmacology", "Stroke Recognition", "Sepsis Management",
      "Airway Emergencies", "Pediatric Emergencies", "Field Triage", "Cardiac Arrest"
    ],
  },
  {
    label: "MLT",
    slug: "mlt",
    icon: Microscope,
    domains: [
      "Hematology", "Coagulation", "Blood Banking", "Clinical Microbiology",
      "Clinical Chemistry", "Quality Control", "Urinalysis", "Immunology"
    ],
  },
  {
    label: "Imaging",
    slug: "imaging",
    icon: ScanLine,
    domains: [
      "Radiographic Positioning", "Image Acquisition", "Radiation Protection", "Patient Care",
      "Equipment Operation", "Image Evaluation", "Digital Imaging", "Anatomy Cross-Section"
    ],
  },
];

function getDomainSeverity(score: number): {
color: string; bg: string; label: string } {
  if (score > 75) return { color: "text-green-700", bg: "bg-green-100", label: "On Track" };
  if (score >= 60) return { color: "text-amber-700", bg: "bg-amber-100", label: "At Risk" };
  return { color: "text-red-700", bg: "bg-red-100", label: "Critical" };
}

function getCareerDomainScores(career: Career): { domain: string; score: number }[] {
  const seedMap: Record<string, number[]> = {
    "pharmacy-tech": [82, 71, 64, 58, 77, 69, 73, 66],
    rrt: [76, 68, 55, 62, 71, 49, 74, 60],
    paramedic: [79, 63, 72, 54, 67, 58, 81, 70],
    mlt: [85, 73, 61, 57, 78, 66, 70, 64],
    imaging: [80, 74, 69, 56, 72, 63, 77, 65],
  };
  const scores = seedMap[career.slug] || career.domains.map(() => 65);
  return career.domains.map((d, i) => ({ domain: d, score: scores[i] }));
}

const AT_RISK_STUDENTS: Record<string, { name: string; domain: string; score: number; recommendation: string }[]> = {
  "pharmacy-tech": [
    { name: "J. Rivera", domain: "Sterile Compounding", score: 42, recommendation: "Assign USP 797 compounding simulation lab" },
    { name: "M. Okafor", domain: "Pharmacy Law", score: 48, recommendation: "Schedule DEA schedule classification review" },
    { name: "K. Patel", domain: "Pharmacology", score: 51, recommendation: "Focus on drug interaction case studies" },
    { name: "L. Chen", domain: "Quality Assurance", score: 53, recommendation: "Complete error-prevention worksheet series" },
    { name: "A. Brooks", domain: "Inventory Management", score: 55, recommendation: "Pair with inventory rotation lab partner" },
  ],
  rrt: [
    { name: "T. Nguyen", domain: "ARDS Management", score: 38, recommendation: "Assign ARDS Net protocol simulation" },
    { name: "S. Williams", domain: "ABG Interpretation", score: 44, recommendation: "Complete 50-ABG practice set with rationales" },
    { name: "R. Martinez", domain: "Ventilator Troubleshooting", score: 49, recommendation: "Schedule ventilator simulator lab session" },
    { name: "P. Johnson", domain: "Acid-Base Disorders", score: 52, recommendation: "Review Henderson-Hasselbalch application cases" },
    { name: "D. Kim", domain: "Airway Management", score: 54, recommendation: "Repeat intubation skills checkoff" },
  ],
  paramedic: [
    { name: "C. Thompson", domain: "Sepsis Management", score: 40, recommendation: "Assign prehospital sepsis screening protocol drill" },
    { name: "B. Garcia", domain: "Pediatric Emergencies", score: 45, recommendation: "Complete Broselow tape and weight-based dosing lab" },
    { name: "N. Davis", domain: "ACLS Pharmacology", score: 50, recommendation: "Review push-dose pressor indications and dosing" },
    { name: "E. Wilson", domain: "Airway Emergencies", score: 52, recommendation: "Schedule surgical airway simulation session" },
    { name: "H. Brown", domain: "Cardiac Arrest", score: 56, recommendation: "Run 3 full megacode scenarios with debrief" },
  ],
  mlt: [
    { name: "F. Anderson", domain: "Clinical Microbiology", score: 41, recommendation: "Assign Gram stain identification practice set" },
    { name: "G. Lee", domain: "Blood Banking", score: 47, recommendation: "Complete crossmatch troubleshooting case series" },
    { name: "I. Taylor", domain: "Quality Control", score: 50, recommendation: "Review Westgard rules with control chart exercises" },
    { name: "W. Moore", domain: "Urinalysis", score: 53, recommendation: "Complete microscopic sediment identification module" },
    { name: "V. Jackson", domain: "Clinical Chemistry", score: 55, recommendation: "Focus on electrolyte panel critical value recognition" },
  ],
  imaging: [
    { name: "Q. Harris", domain: "Patient Care", score: 39, recommendation: "Assign contrast reaction emergency protocol drill" },
    { name: "U. Martin", domain: "Anatomy Cross-Section", score: 46, recommendation: "Complete cross-sectional anatomy atlas review" },
    { name: "X. White", domain: "Image Evaluation", score: 50, recommendation: "Review repeat analysis and quality criteria" },
    { name: "Y. Robinson", domain: "Radiation Protection", score: 52, recommendation: "Complete ALARA principle case study series" },
    { name: "Z. Clark", domain: "Equipment Operation", score: 56, recommendation: "Schedule generator troubleshooting lab" },
  ],
};

const CAREER_ANALYTICS: Record<string, { label: string; value: string }[]> = {
  "pharmacy-tech": [
    { label: "PTCE Pass Rate (Cohort)", value: "81%" },
    { label: "Avg Compounding Score", value: "74%" },
    { label: "Law & Regulation Mastery", value: "69%" },
    { label: "Top Deficiency", value: "Sterile Compounding" },
  ],
  rrt: [
    { label: "TMC Pass Rate (Cohort)", value: "78%" },
    { label: "Avg Ventilator Mgmt Score", value: "71%" },
    { label: "ABG Mastery", value: "64%" },
    { label: "Top Deficiency", value: "ARDS Protocols" },
  ],
  paramedic: [
    { label: "NREMT Pass Rate (Cohort)", value: "83%" },
    { label: "Avg Trauma Score", value: "76%" },
    { label: "Pharmacology Mastery", value: "67%" },
    { label: "Top Deficiency", value: "Pediatric Emergencies" },
  ],
  mlt: [
    { label: "ASCP/CSMLS Pass Rate", value: "79%" },
    { label: "Avg Hematology Score", value: "82%" },
    { label: "Microbiology Mastery", value: "63%" },
    { label: "Top Deficiency", value: "Clinical Microbiology" },
  ],
  imaging: [
    { label: "ARRT Pass Rate (Cohort)", value: "85%" },
    { label: "Avg Positioning Score", value: "78%" },
    { label: "Radiation Safety Mastery", value: "71%" },
    { label: "Top Deficiency", value: "Patient Care Procedures" },
  ],
};

function buildHistogram(): { range: string; count: number }[] {
  return [
    { range: "90-100", count: 4 },
    { range: "80-89", count: 9 },
    { range: "70-79", count: 14 },
    { range: "60-69", count: 11 },
    { range: "50-59", count: 6 },
    { range: "40-49", count: 3 },
  ];
}

export default function AlliedFacultyDashboard() {
  const { region, setRegion, regionLabel } = useRegion();
  const [selectedCareerIdx, setSelectedCareerIdx] = useState(0);
  const [careerDropdownOpen, setCareerDropdownOpen] = useState(false);

  const career = FACULTY_CAREERS[selectedCareerIdx];
  const domainScores = getCareerDomainScores(career);
  const atRiskStudents = AT_RISK_STUDENTS[career.slug] || AT_RISK_STUDENTS["pharmacy-tech"];
  const careerAnalytics = CAREER_ANALYTICS[career.slug] || CAREER_ANALYTICS["pharmacy-tech"];
  const histogram = buildHistogram();
  const maxHistCount = Math.max(...histogram.map(h => h.count));

  const CareerIcon = career.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="faculty-dashboard-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-faculty-title">
            Faculty Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t("allied.alliedFacultyDashboard.cohortPerformanceOverviewAndAtrisk")}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg" data-testid="faculty-region-toggle">
            <Globe className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-gray-700">{regionLabel}</span>
            <button
              onClick={() => setRegion(region === "US" ? "CA" : "US")}
              className="ml-1 px-2 py-0.5 text-xs font-medium text-teal-600 bg-teal-50 rounded hover:bg-teal-100 transition-colors"
              data-testid="button-faculty-switch-region"
            >
              Switch to {region === "US" ? "Canada" : "US"}
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setCareerDropdownOpen(!careerDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-teal-300 transition-colors"
              data-testid="button-career-filter"
            >
              <CareerIcon className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-gray-700">{career.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {careerDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20" data-testid="career-filter-dropdown">
                {FACULTY_CAREERS.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.slug}
                      onClick={() => { setSelectedCareerIdx(i); setCareerDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-teal-50 transition-colors ${i === selectedCareerIdx ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-700"}`}
                      data-testid={`button-career-${c.slug}`}
                    >
                      <Icon className="w-4 h-4" />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-active-students">
          <Users className="w-6 h-6 text-teal-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">47</div>
          <div className="text-sm text-gray-500">{t("allied.alliedFacultyDashboard.activeStudents")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-avg-readiness">
          <Target className="w-6 h-6 text-teal-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">68%</div>
          <div className="text-sm text-gray-500">{t("allied.alliedFacultyDashboard.avgReadiness")}</div>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
            <div className="h-2 rounded-full bg-teal-500" style={{ width: "68%" }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-avg-mock-score">
          <BarChart3 className="w-6 h-6 text-teal-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">72%</div>
          <div className="text-sm text-gray-500">{t("allied.alliedFacultyDashboard.avgMockScore")}</div>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
            <div className="h-2 rounded-full bg-teal-500" style={{ width: "72%" }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-pass-probability">
          <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">84%</div>
          <div className="text-sm text-gray-500">{t("allied.alliedFacultyDashboard.passProbability")}</div>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
            <div className="h-2 rounded-full bg-green-500" style={{ width: "84%" }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6" data-testid="domain-heatmap">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-500" />
            Domain Performance Heatmap - {career.label}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {domainScores.map(({ domain, score }) => {
              const severity = getDomainSeverity(score);
              return (
                <div
                  key={domain}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg ${severity.bg}`}
                  data-testid={`heatmap-domain-${domain.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <span className={`text-sm font-medium ${severity.color}`}>{domain}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${severity.bg} ${severity.color} font-medium`}>
                      {severity.label}
                    </span>
                    <span className={`text-sm font-bold ${severity.color}`}>{score}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
              <span>{t("allied.alliedFacultyDashboard.criticalLt60")}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200" />
              <span>{t("allied.alliedFacultyDashboard.atRisk6075")}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
              <span>{t("allied.alliedFacultyDashboard.onTrackGt75")}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="career-analytics-panel">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CareerIcon className="w-5 h-5 text-teal-500" />
            {career.label} Analytics
          </h3>
          <div className="space-y-3">
            {careerAnalytics.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-bold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 px-3 py-2 bg-teal-50 rounded-lg">
            <div className="text-xs text-teal-600 font-medium mb-1">Region: {regionLabel}</div>
            <div className="text-xs text-gray-500">
              {region === "US"
                ? "Analytics aligned with US certification standards"
                : "Analytics aligned with Canadian certification standards"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8" data-testid="at-risk-table">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          At-Risk Students - {career.label}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-at-risk">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-medium text-gray-500">{t("allied.alliedFacultyDashboard.student")}</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">{t("allied.alliedFacultyDashboard.weakDomain")}</th>
                <th className="text-center py-2 px-3 font-medium text-gray-500">{t("allied.alliedFacultyDashboard.score")}</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">{t("allied.alliedFacultyDashboard.recommendation")}</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((student, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors" data-testid={`row-student-${idx}`}>
                  <td className="py-2.5 px-3 font-medium text-gray-800">{student.name}</td>
                  <td className="py-2.5 px-3 text-gray-600">{student.domain}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${student.score < 50 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {student.score}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">{student.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="score-distribution">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-500" />
            Mock Exam Score Distribution
          </h3>
          <div className="space-y-2">
            {histogram.map(({ range, count }) => (
              <div key={range} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-16 text-right font-mono">{range}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                  <div
                    className="h-5 rounded-full bg-teal-500 transition-all flex items-center justify-end pr-2"
                    style={{ width: `${(count / maxHistCount) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400 text-center">
            Total cohort: 47 students | Mean: 72% | Median: 74%
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="export-panel">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-500" />
            Reports & Exports
          </h3>
          <div className="space-y-3">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              data-testid="button-export-csv"
            >
              <Download className="w-5 h-5 text-teal-600" />
              <div>
                <div className="text-sm font-medium text-gray-800">{t("allied.alliedFacultyDashboard.csvPerformanceReport")}</div>
                <div className="text-xs text-gray-500">{t("allied.alliedFacultyDashboard.studentScoresDomainMasteryAnd")}</div>
              </div>
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              data-testid="button-export-pdf"
            >
              <Download className="w-5 h-5 text-teal-600" />
              <div>
                <div className="text-sm font-medium text-gray-800">{t("allied.alliedFacultyDashboard.pdfAccreditationReport")}</div>
                <div className="text-xs text-gray-500">{t("allied.alliedFacultyDashboard.formattedForProgramAccreditationReview")}</div>
              </div>
            </button>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-500" />
              Quick Stats
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center px-3 py-2 bg-teal-50 rounded-lg">
                <div className="text-lg font-bold text-teal-700">5</div>
                <div className="text-xs text-gray-500">{t("allied.alliedFacultyDashboard.atriskStudents")}</div>
              </div>
              <div className="text-center px-3 py-2 bg-teal-50 rounded-lg">
                <div className="text-lg font-bold text-teal-700">
                  {domainScores.filter(d => d.score < 60).length}
                </div>
                <div className="text-xs text-gray-500">{t("allied.alliedFacultyDashboard.criticalDomains")}</div>
              </div>
              <div className="text-center px-3 py-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-700">
                  {domainScores.filter(d => d.score > 75).length}
                </div>
                <div className="text-xs text-gray-500">{t("allied.alliedFacultyDashboard.strongDomains")}</div>
              </div>
              <div className="text-center px-3 py-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-700">12</div>
                <div className="text-xs text-gray-500">{t("allied.alliedFacultyDashboard.mockExamsRun")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Faculty dashboard data is aggregated from student practice activity. Scores are estimates and do not guarantee certification outcomes.
        </p>
      </div>
    </div>
  );
}
