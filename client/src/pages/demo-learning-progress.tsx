import { NURSENEST_PALETTE } from "@/lib/brand-palette";
import { useI18n } from "@/lib/i18n";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  ArrowUp, TrendingUp, BookOpen, Brain, Clock, Target, Sparkles,
  CheckCircle2, BarChart3, Zap, ArrowRight,
} from "lucide-react";

const P = NURSENEST_PALETTE;

const performanceData = [
  { week: "Week 1", Accuracy: 61, Confidence: 48, Mastery: 35 },
  { week: "Week 2", Accuracy: 69, Confidence: 58, Mastery: 49 },
  { week: "Week 3", Accuracy: 75, Confidence: 67, Mastery: 62 },
  { week: "Week 4", Accuracy: 82, Confidence: 76, Mastery: 74 },
];

const beforeTopics = [
  { name: "Cardiovascular", before: 58, after: 84 },
  { name: "Respiratory", before: 63, after: 80 },
  { name: "Pharmacology", before: 52, after: 78 },
  { name: "Renal", before: 65, after: 85 },
  { name: "Infection", before: 60, after: 82 },
  { name: "Pediatrics", before: 68, after: 83 },
];

const weakAreas = [
  { topic: "Hyperkalemia Management", before: 42, after: 79 },
  { topic: "ECG Interpretation", before: 38, after: 76 },
  { topic: "Sepsis Recognition", before: 45, after: 81 },
  { topic: "Ventilator Alarms", before: 40, after: 74 },
];

const aiInsights = [
  "Spaced repetition intervals optimized to 1-3-7 day cycles boosted long-term retention by 34%",
  "Focused review sessions on weak pharmacology topics closed the biggest knowledge gap",
  "Priority questions targeting NCLEX-style clinical judgment improved critical thinking scores",
  "Emergency scenario pattern drills strengthened rapid assessment confidence",
  "Lesson-linked flashcards created contextual memory anchors for complex topics",
];

const studyStats = [
  { label: "Flashcards Studied", value: "284", icon: Brain },
  { label: "Questions Completed", value: "512", icon: CheckCircle2 },
  { label: "Lessons Reviewed", value: "14", icon: BookOpen },
  { label: "Adaptive Review Sessions", value: "9", icon: Zap },
  { label: "Avg Study Session", value: "32 min", icon: Clock },
];

const focusAreas = [
  "Pharmacology dosing calculations",
  "ECG rhythm recognition",
  "Critical care prioritization",
];

function SectionCard({ children, style: extraStyle, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div
      style={{
        background: P.white,
        borderRadius: "12px",
        boxShadow: "0 1px 8px rgba(46,58,89,0.05)",
        border: `1px solid ${P.border}`,
        padding: "10px 12px",
        ...extraStyle,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function StatBadge({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "16px", fontWeight: 700, color: P.text }}>{value}</div>
      <div style={{ fontSize: "9px", color: "#6b7280", marginTop: "1px" }}>{label}</div>
      <div style={{ width: "100%", height: "2px", borderRadius: "1px", background: color, marginTop: "3px" }} />
    </div>
  );
}

export default function DemoLearningProgress() {
  return (
    <div
      data-testid="demo-learning-progress-page"
      style={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "12px 20px 8px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: P.text,
        background: "#fdfcfa",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header style={{ marginBottom: "8px", flexShrink: 0 }} data-testid="header-section">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`,
            borderRadius: "8px",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <TrendingUp size={16} color={P.white} />
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0, lineHeight: 1.2 }} data-testid="text-page-title">
              Learning Progress Transformation
            </h1>
            <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>
              <span data-testid="text-student-name">{t("pages.demoLearningProgress.emilyChenDemoStudent")}</span>
              <span>•</span>
              <span data-testid="text-exam-track">{t("pages.demoLearningProgress.rnNclexPreparation")}</span>
              <span>•</span>
              <span data-testid="text-study-period">{t("pages.demoLearningProgress.3WeeksOfAdaptiveStudy")}</span>
            </div>
          </div>
        </div>
      </header>

      <SectionCard style={{ flexShrink: 0 }} data-testid="summary-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "9px", color: "#6b7280", marginBottom: "1px" }}>{t("pages.demoLearningProgress.overallAccuracyBefore")}</div>
              <div style={{ fontSize: "26px", fontWeight: 700, color: "#ef4444", lineHeight: 1 }} data-testid="text-accuracy-before">61%</div>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${P.primary}22, ${P.secondary}22)`,
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              flexShrink: 0,
            }}>
              <ArrowRight size={18} color={P.primary} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "9px", color: "#6b7280", marginBottom: "1px" }}>{t("pages.demoLearningProgress.overallAccuracyAfter")}</div>
              <div style={{ fontSize: "26px", fontWeight: 700, color: "#22c55e", lineHeight: 1 }} data-testid="text-accuracy-after">82%</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <StatBadge value="+21%" label={t("pages.demoLearningProgress.masteryImprovement")} color={P.primary} />
            <StatBadge value="284" label={t("pages.demoLearningProgress.flashcardsStudied")} color={P.secondary} />
            <StatBadge value="512" label={t("pages.demoLearningProgress.questionsCompleted")} color={P.accent} />
            <StatBadge value="14 hours" label={t("pages.demoLearningProgress.studyTime")} color={P.highlight} />
          </div>
        </div>
      </SectionCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px", flexShrink: 0 }}>
        <SectionCard data-testid="before-card">
          <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" }} />
            Before Adaptive Study
          </h3>
          <div style={{ display: "grid", gap: "3px" }}>
            {beforeTopics.map((t) => (
              <div key={t.name} style={{ display: "flex", alignItems: "center", fontSize: "10px" }}>
                <span style={{ color: "#6b7280", minWidth: "85px" }}>{t.name}</span>
                <div style={{ flex: 1, margin: "0 6px", height: "4px", borderRadius: "2px", background: P.border }}>
                  <div style={{ width: `${t.before}%`, height: "100%", borderRadius: "2px", background: "#fca5a5" }} />
                </div>
                <span style={{ fontWeight: 600, minWidth: "28px", textAlign: "right" }}>{t.before}%</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard data-testid="after-card">
          <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
            After Adaptive Study
          </h3>
          <div style={{ display: "grid", gap: "3px" }}>
            {beforeTopics.map((t) => (
              <div key={t.name} style={{ display: "flex", alignItems: "center", fontSize: "10px" }}>
                <span style={{ color: "#6b7280", minWidth: "85px" }}>{t.name}</span>
                <div style={{ flex: 1, margin: "0 6px", height: "4px", borderRadius: "2px", background: P.border }}>
                  <div style={{ width: `${t.after}%`, height: "100%", borderRadius: "2px", background: "#86efac" }} />
                </div>
                <span style={{ fontWeight: 600, minWidth: "56px", textAlign: "right" }}>
                  {t.after}%
                  <span style={{ color: "#22c55e", fontSize: "9px", marginLeft: "3px" }}>
                    +{t.after - t.before}%
                    <ArrowUp size={7} color="#22c55e" style={{ display: "inline", marginLeft: "1px" }} />
                  </span>
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "8px", marginTop: "8px", flexShrink: 0 }}>
        <SectionCard data-testid="performance-chart">
          <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "4px", display: "flex", alignItems: "center", gap: "5px" }}>
            <BarChart3 size={12} color={P.primary} />
            Performance Growth
          </h3>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#6b7280" }} />
              <YAxis domain={[30, 90]} tick={{ fontSize: 9, fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: `1px solid ${P.border}`,
                  fontSize: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              />
              <Legend iconSize={6} wrapperStyle={{ fontSize: "9px", paddingTop: "2px" }} />
              <Line type="monotone" dataKey="Accuracy" stroke={P.primary} strokeWidth={2} dot={{ r: 2.5 }} />
              <Line type="monotone" dataKey="Confidence" stroke={P.secondary} strokeWidth={2} dot={{ r: 2.5 }} />
              <Line type="monotone" dataKey="Mastery" stroke={P.accent} strokeWidth={2} dot={{ r: 2.5 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard data-testid="weak-areas-panel">
          <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px" }}>
            <Target size={12} color={P.primary} />
            Weak Areas Strengthened
          </h3>
          <div style={{ display: "grid", gap: "6px" }}>
            {weakAreas.map((w) => (
              <div key={w.topic} style={{ fontSize: "10px" }}>
                <div style={{ fontWeight: 500, marginBottom: "2px" }}>{w.topic}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ color: "#ef4444", fontWeight: 600, minWidth: "24px", fontSize: "9px" }}>{w.before}%</span>
                  <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: P.border, position: "relative" }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, height: "100%",
                      width: `${w.after}%`, borderRadius: "2px",
                      background: `linear-gradient(90deg, #fca5a5, #86efac)`,
                    }} />
                  </div>
                  <span style={{ color: "#22c55e", fontWeight: 600, minWidth: "24px", fontSize: "9px" }}>
                    {w.after}%
                    <ArrowUp size={7} color="#22c55e" style={{ display: "inline", marginLeft: "1px" }} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "8px", flex: "1 1 auto", minHeight: 0 }}>
        <SectionCard data-testid="ai-insights-panel">
          <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
            <Sparkles size={12} color={P.primary} />
            What Drove This Improvement
          </h3>
          <div style={{ display: "grid", gap: "4px" }}>
            {aiInsights.map((insight, i) => (
              <div key={i} style={{ display: "flex", gap: "4px", fontSize: "9.5px", lineHeight: "1.3", color: "#374151" }}>
                <CheckCircle2 size={10} color={P.secondary} style={{ flexShrink: 0, marginTop: "1px" }} />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard data-testid="study-activity-panel">
          <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
            <BookOpen size={12} color={P.primary} />
            Study Activity
          </h3>
          <div style={{ display: "grid", gap: "6px" }}>
            {studyStats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "6px",
                    background: `${P.primary}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={12} color={P.primary} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.1 }}>{s.value}</div>
                    <div style={{ fontSize: "8.5px", color: "#6b7280" }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard data-testid="next-target-card">
          <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
            <Target size={12} color={P.primary} />
            Next Target
          </h3>
          <div style={{
            background: `linear-gradient(135deg, ${P.primary}10, ${P.secondary}10)`,
            borderRadius: "8px",
            padding: "8px",
            marginBottom: "6px",
          }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: P.primary, lineHeight: 1 }} data-testid="text-next-target-value">88%</div>
            <div style={{ fontSize: "9px", color: "#6b7280" }}>{t("pages.demoLearningProgress.examReadinessGoal")}</div>
          </div>
          <div style={{ fontSize: "9.5px", fontWeight: 500, marginBottom: "3px" }}>{t("pages.demoLearningProgress.focusAreas")}</div>
          <div style={{ display: "grid", gap: "2px", marginBottom: "8px" }}>
            {focusAreas.map((area, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", color: "#374151" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: P.primary, flexShrink: 0 }} />
                {area}
              </div>
            ))}
          </div>
          <button
            data-testid="button-start-session"
            style={{
              width: "100%",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              background: `linear-gradient(135deg, ${P.primary}, #9d82dd)`,
              color: P.white,
              fontSize: "10px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            Start Next Adaptive Session
          </button>
        </SectionCard>
      </div>

      <div style={{ textAlign: "center", marginTop: "6px", fontSize: "9px", color: "#9ca3af", flexShrink: 0 }}>
        NurseNest.ca — Demo data for illustration purposes
      </div>
    </div>
  );
}
