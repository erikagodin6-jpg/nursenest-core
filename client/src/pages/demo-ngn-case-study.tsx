// Demo screenshot component - NOT real learner data.

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User, Heart, Beaker, FileText, ClipboardList, Clock,
  AlertTriangle, ChevronRight, Activity, Stethoscope,
} from "lucide-react";
import { DemoPageWrapper, SectionCard } from "@/components/demo-shared";
import { ngnCaseStudyData as d } from "@/data/demo-screenshot-data";

import { useI18n } from "@/lib/i18n";
export default function DemoNgnCaseStudy() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("vitals");

  if (!user || !isAdmin) return <DemoPageWrapper><div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">{t("pages.demoNgnCaseStudy.adminAccessRequired")}</p></div></DemoPageWrapper>;

  const tabs = [
    { id: "vitals", label: "Vital Signs", icon: <Heart className="w-3 h-3" /> },
    { id: "labs", label: "Lab Results", icon: <Beaker className="w-3 h-3" /> },
    { id: "notes", label: "Nursing Notes", icon: <FileText className="w-3 h-3" /> },
    { id: "orders", label: "Provider Orders", icon: <ClipboardList className="w-3 h-3" /> },
  ];

  return (
    <DemoPageWrapper>
      <div className="border-b border-slate-100 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-violet-700">NurseNest</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">{t("pages.demoNgnCaseStudy.ngnCaseStudy")}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono font-semibold">12:34</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5 space-y-5">
            <SectionCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">{d.patientName}</h2>
                  <p className="text-xs text-slate-500">{d.age}yo {d.sex} - {d.admissionDiagnosis}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="px-3 py-2 rounded-lg bg-rose-50/50 border border-rose-100/60">
                  <p className="text-[10px] text-slate-400">{t("pages.demoNgnCaseStudy.allergies")}</p>
                  <p className="text-slate-700 font-medium">{d.allergies}</p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-emerald-50/50 border border-emerald-100/60">
                  <p className="text-[10px] text-slate-400">{t("pages.demoNgnCaseStudy.codeStatus")}</p>
                  <p className="text-slate-700 font-medium">{d.codeStatus}</p>
                </div>
              </div>
            </SectionCard>

            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                    activeTab === tab.id ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}>{tab.icon} {tab.label}</button>
              ))}
            </div>

            {activeTab === "vitals" && (
              <SectionCard>
                <div className="flex items-center gap-2 mb-3"><Activity className="w-4 h-4 text-rose-500" /><h3 className="text-sm font-semibold text-slate-700">{t("pages.demoNgnCaseStudy.vitalSigns")}</h3></div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(d.vitals).map(([key, val]) => {
                    const labels: Record<string, string> = { temp: "Temp", hr: "HR", rr: "RR", bp: "BP", spo2: "SpO2", pain: "Pain" };
                    const isAbnormal = ["hr", "rr", "spo2", "temp"].includes(key);
                    return (
                      <div key={key} className={cn("px-3 py-2.5 rounded-lg border text-center",
                        isAbnormal ? "bg-rose-50/60 border-rose-100" : "bg-white border-slate-100"
                      )}>
                        <p className="text-[10px] text-slate-400 font-medium">{labels[key] || key}</p>
                        <p className={cn("text-sm font-bold", isAbnormal ? "text-rose-600" : "text-slate-700")}>{val}</p>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {activeTab === "labs" && (
              <SectionCard>
                <div className="flex items-center gap-2 mb-3"><Beaker className="w-4 h-4 text-sky-500" /><h3 className="text-sm font-semibold text-slate-700">{t("pages.demoNgnCaseStudy.labResults")}</h3></div>
                <div className="space-y-1.5">
                  {d.labs.map((lab) => (
                    <div key={lab.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                      <span className="text-sm text-slate-700 font-medium">{lab.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{lab.value}</span>
                        <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold",
                          lab.flag === "High" ? "bg-rose-100 text-rose-600" :
                          lab.flag === "Low" ? "bg-amber-100 text-amber-600" :
                          "bg-emerald-100 text-emerald-600"
                        )}>{lab.flag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {activeTab === "notes" && (
              <SectionCard>
                <div className="flex items-center gap-2 mb-3"><FileText className="w-4 h-4 text-violet-500" /><h3 className="text-sm font-semibold text-slate-700">{t("pages.demoNgnCaseStudy.nursingNotes")}</h3></div>
                <div className="space-y-3">
                  {d.nursingNotes.map((note, i) => (
                    <div key={i} className="pl-4 border-l-2 border-violet-200">
                      <p className="text-[10px] text-violet-600 font-semibold mb-0.5">{note.time}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{note.note}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {activeTab === "orders" && (
              <SectionCard>
                <div className="flex items-center gap-2 mb-3"><ClipboardList className="w-4 h-4 text-emerald-500" /><h3 className="text-sm font-semibold text-slate-700">{t("pages.demoNgnCaseStudy.providerOrders")}</h3></div>
                <div className="space-y-1.5">
                  {d.providerOrders.map((order, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                      <span className="text-xs text-slate-700 font-medium">{order}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          <div className="col-span-12 lg:col-span-7 space-y-5">
            <SectionCard>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">{t("pages.demoNgnCaseStudy.bowtieItem")}</span>
                <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 text-[10px] font-bold">{t("pages.demoNgnCaseStudy.clinicalJudgment")}</span>
              </div>
              <h2 className="text-base font-semibold text-slate-800 leading-relaxed mb-5">
                Based on the patient data provided, complete the clinical judgment model for {d.patientName}'s care.
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-600 text-center py-1.5 bg-rose-50 rounded-lg">{t("pages.demoNgnCaseStudy.actionsToTake")}</h4>
                  {["Increase O2 to 4L NC", "Position in high Fowler's", "Administer prescribed bronchodilator", "Monitor ABG results", "Notify provider of SpO2"].map((a, i) => (
                    <div key={i} className={cn("px-3 py-2 rounded-lg border text-xs text-slate-700 cursor-pointer transition-colors",
                      i < 3 ? "bg-violet-50 border-violet-200 font-medium" : "bg-white border-slate-100 hover:border-violet-200"
                    )}>{a}</div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-600 text-center py-1.5 bg-amber-50 rounded-lg">{t("pages.demoNgnCaseStudy.potentialConditions")}</h4>
                  {["Acute respiratory failure", "COPD exacerbation", "Pneumonia", "Pulmonary embolism", "Heart failure"].map((c, i) => (
                    <div key={i} className={cn("px-3 py-2 rounded-lg border text-xs text-slate-700 cursor-pointer transition-colors",
                      i === 1 ? "bg-violet-50 border-violet-200 font-medium" : "bg-white border-slate-100 hover:border-violet-200"
                    )}>{c}</div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-600 text-center py-1.5 bg-emerald-50 rounded-lg">{t("pages.demoNgnCaseStudy.parametersToMonitor")}</h4>
                  {["SpO2 and respiratory rate", "ABG values", "Breath sounds", "Sputum characteristics", "Mental status"].map((p, i) => (
                    <div key={i} className={cn("px-3 py-2 rounded-lg border text-xs text-slate-700 cursor-pointer transition-colors",
                      i < 2 ? "bg-violet-50 border-violet-200 font-medium" : "bg-white border-slate-100 hover:border-violet-200"
                    )}>{p}</div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" className="rounded-xl text-xs font-semibold h-9 gap-1.5 border-slate-200 text-slate-600">
                <Stethoscope className="w-3.5 h-3.5" /> Review Patient Data
              </Button>
              <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-5 h-9 gap-1.5 shadow-md shadow-violet-200/40">
                Submit Answer <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </DemoPageWrapper>
  );
}
