import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calendar, Clock, Target, CheckCircle, ChevronRight, ArrowLeft, Mail, GraduationCap } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface StudyWeek {
  week: number;
  phase: string;
  topics: { name: string; hours: number; activities: string[] }[];
}

interface StudyPlanResult {
  id: string;
  plan: {
    examType: string;
    examName: string;
    examDate: string | null;
    hoursPerWeek: number;
    confidenceLevel: string;
    intensity: string;
    totalWeeks: number;
    weeks: StudyWeek[];
    recommendedResources: { type: string; label: string; link: string }[];
  };
}

const phaseColors: Record<string, string> = {
  Foundation: "bg-blue-50 border-blue-200 text-blue-800",
  "Deep Study": "bg-purple-50 border-purple-200 text-purple-800",
  "Review & Practice": "bg-green-50 border-green-200 text-green-800",
};

export default function ImagingStudyPlanGenerator() {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const [examType, setExamType] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<StudyPlanResult | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/imaging/study-plans", {
        examType,
        examDate: examDate || null,
        hoursPerWeek: Number(hoursPerWeek),
        confidenceLevel,
        email: email || null,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      if (!email) setShowEmailCapture(true);
    },
  });

  const emailCaptureMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/imaging/leads", {
        email,
        source: "study_plan_generator",
        trigger: "study_plan",
        examType,
      });
    },
    onSuccess: () => setShowEmailCapture(false),
  });

  if (result) {
    const plan = result.plan;
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button onClick={() => setResult(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6" data-testid="button-back-to-form">
            <ArrowLeft className="w-4 h-4" /> Generate New Plan
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-plan-title">Your {plan.examName} Study Plan</h1>
            <p className="text-gray-600">{plan.totalWeeks} weeks • {plan.hoursPerWeek} hours/week • {plan.intensity} intensity</p>
          </div>

          {showEmailCapture && (
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-8 h-8 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{t("pages.imagingStudyPlanGenerator.saveYourStudyPlan")}</h3>
                    <p className="text-sm text-gray-600 mb-3">{t("pages.imagingStudyPlanGenerator.enterYourEmailToSave")}</p>
                    <div className="flex gap-2">
                      <Input placeholder={t("pages.imagingStudyPlanGenerator.youremailcom")} value={email} onChange={(e) => setEmail(e.target.value)} className="max-w-xs" data-testid="input-email-save-plan" />
                      <Button onClick={() => emailCaptureMutation.mutate()} disabled={!email || emailCaptureMutation.isPending} data-testid="button-save-plan-email">
                        {emailCaptureMutation.isPending ? "Saving..." : "Save Plan"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">{plan.totalWeeks}</div>
                <div className="text-sm text-gray-500">{t("pages.imagingStudyPlanGenerator.weeksTotal")}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900">{plan.hoursPerWeek * plan.totalWeeks}</div>
                <div className="text-sm text-gray-500">{t("pages.imagingStudyPlanGenerator.totalStudyHours")}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900 capitalize">{plan.intensity}</div>
                <div className="text-sm text-gray-500">{t("pages.imagingStudyPlanGenerator.studyIntensity")}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 mb-8">
            {plan.weeks.map((week) => (
              <Card key={week.week} className={`border ${phaseColors[week.phase] || "bg-gray-50"}`}>
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Week {week.week}</CardTitle>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/70">{week.phase}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="grid md:grid-cols-2 gap-3">
                    {week.topics.map((topic, ti) => (
                      <div key={ti} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-900">{topic.name}</span>
                          <span className="text-xs text-gray-500">{topic.hours}h</span>
                        </div>
                        <ul className="space-y-1">
                          {topic.activities.map((act, ai) => (
                            <li key={ai} className="flex items-start gap-1.5 text-xs text-gray-600">
                              <CheckCircle className="w-3 h-3 mt-0.5 text-green-500 shrink-0" />
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Recommended Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {plan.recommendedResources.map((res, i) => (
                  <button key={i} onClick={() => navigate(res.link)} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left" data-testid={`link-resource-${i}`}>
                    <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{res.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={() => navigate("/radiography-readiness-quiz")} variant="outline" className="mr-3" data-testid="button-take-quiz">
              Take Readiness Quiz
            </Button>
            <Button onClick={() => navigate("/medical-imaging")} data-testid="button-explore-imaging">
              Explore Medical Imaging
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-page-title">{t("pages.imagingStudyPlanGenerator.medicalImagingStudyPlanGenerator")}</h1>
          <p className="text-gray-600 max-w-md mx-auto">{t("pages.imagingStudyPlanGenerator.getAPersonalizedWeekbyweekStudy")}</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">{t("pages.imagingStudyPlanGenerator.examType")}</Label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger data-testid="select-exam-type">
                  <SelectValue placeholder={t("pages.imagingStudyPlanGenerator.selectYourExam")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arrt-radiography">{t("pages.imagingStudyPlanGenerator.arrtRadiography")}</SelectItem>
                  <SelectItem value="camrt-radiography">{t("pages.imagingStudyPlanGenerator.camrtRadiography")}</SelectItem>
                  <SelectItem value="arrt-ct">{t("pages.imagingStudyPlanGenerator.arrtCt")}</SelectItem>
                  <SelectItem value="arrt-mri">{t("pages.imagingStudyPlanGenerator.arrtMri")}</SelectItem>
                  <SelectItem value="general">{t("pages.imagingStudyPlanGenerator.generalRadiographyReview")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">{t("pages.imagingStudyPlanGenerator.examDateOptional")}</Label>
              <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} data-testid="input-exam-date" />
              <p className="text-xs text-gray-500 mt-1">{t("pages.imagingStudyPlanGenerator.leaveBlankForADefault")}</p>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">{t("pages.imagingStudyPlanGenerator.studyHoursPerWeek")}</Label>
              <Select value={hoursPerWeek} onValueChange={setHoursPerWeek}>
                <SelectTrigger data-testid="select-hours-per-week">
                  <SelectValue placeholder={t("pages.imagingStudyPlanGenerator.hoursAvailablePerWeek")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">{t("pages.imagingStudyPlanGenerator.5Hoursweek")}</SelectItem>
                  <SelectItem value="10">{t("pages.imagingStudyPlanGenerator.10Hoursweek")}</SelectItem>
                  <SelectItem value="15">{t("pages.imagingStudyPlanGenerator.15Hoursweek")}</SelectItem>
                  <SelectItem value="20">{t("pages.imagingStudyPlanGenerator.20Hoursweek")}</SelectItem>
                  <SelectItem value="25">{t("pages.imagingStudyPlanGenerator.25Hoursweek")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">{t("pages.imagingStudyPlanGenerator.currentConfidenceLevel")}</Label>
              <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                <SelectTrigger data-testid="select-confidence-level">
                  <SelectValue placeholder={t("pages.imagingStudyPlanGenerator.howConfidentAreYou")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("pages.imagingStudyPlanGenerator.lowINeedALot")}</SelectItem>
                  <SelectItem value="medium">{t("pages.imagingStudyPlanGenerator.mediumIKnowSomeTopics")}</SelectItem>
                  <SelectItem value="high">{t("pages.imagingStudyPlanGenerator.highJustNeedARefresher")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">{t("pages.imagingStudyPlanGenerator.emailOptionalSaveYourPlan")}</Label>
              <Input type="email" placeholder={t("pages.imagingStudyPlanGenerator.youremailcom2")} value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-email" />
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!examType || !hoursPerWeek || !confidenceLevel || generateMutation.isPending}
              onClick={() => generateMutation.mutate()}
              data-testid="button-generate-plan"
            >
              {generateMutation.isPending ? "Generating..." : "Generate My Study Plan"}
            </Button>

            {generateMutation.isError && (
              <p className="text-red-500 text-sm text-center" data-testid="text-error">{t("pages.imagingStudyPlanGenerator.somethingWentWrongPleaseTry")}</p>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">{t("pages.imagingStudyPlanGenerator.notSureWhereYouStand")}</p>
          <Button variant="outline" onClick={() => navigate("/radiography-readiness-quiz")} data-testid="button-take-readiness-quiz">
            Take the Radiography Readiness Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
