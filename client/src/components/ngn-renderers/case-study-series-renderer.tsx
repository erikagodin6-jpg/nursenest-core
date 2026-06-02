import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, FileText, Activity, FlaskConical, Pill, ClipboardList } from "lucide-react";
import type {
  CaseStudySeriesPayload,
  CaseStudySeriesResponse,
  CaseStudyTab,
  CaseStudySubQuestion,
  NGNUserResponse,
} from "@/lib/ngn-question-types";
import { createDefaultResponse } from "./ngn-default-response";
import { useI18n } from "@/lib/i18n";
const LazyNGNQuestionDispatcher = lazy(() =>
  import("./ngn-question-dispatcher").then(m => ({ default: m.NGNQuestionDispatcher }))
);

interface CaseStudySeriesRendererProps {
  payload: CaseStudySeriesPayload;
  response: CaseStudySeriesResponse;
  onResponseChange: (response: CaseStudySeriesResponse) => void;
  disabled?: boolean;
}

function TabContentDisplay({ tab }: { tab: CaseStudyTab }) {
  const { t } = useI18n();
  return (
    <div className="space-y-4" data-testid={`case-tab-content-${tab.id}`}>
      {tab.content && (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{tab.content}</p>
      )}
      {tab.vitals && Object.keys(tab.vitals).length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Vitals
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(tab.vitals).map(([key, val]) => (
              <div key={key} className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                <span className="text-xs text-blue-600 font-medium">{key}</span>
                <p className="text-sm font-semibold text-blue-900">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab.labs && Object.keys(tab.labs).length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
            <FlaskConical className="w-3 h-3" /> Labs
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(tab.labs).map(([key, val]) => (
              <div key={key} className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                <span className="text-xs text-purple-600 font-medium">{key}</span>
                <p className="text-sm font-semibold text-purple-900">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab.meds && tab.meds.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
            <Pill className="w-3 h-3" /> Medications
          </h5>
          <ul className="space-y-1">
            {tab.meds.map((med, i) => (
              <li key={i} className="text-sm text-gray-700 bg-amber-50 rounded-lg px-3 py-1.5 border border-amber-100">
                {med}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const tabIcons: Record<string, React.ReactNode> = {
  vitals: <Activity className="w-3.5 h-3.5" />,
  labs: <FlaskConical className="w-3.5 h-3.5" />,
  meds: <Pill className="w-3.5 h-3.5" />,
  history: <ClipboardList className="w-3.5 h-3.5" />,
};

function SubQuestionRenderer({
  subQuestion,
  subResponse,
  onSubResponseChange,
  index,
  total,
  disabled,
}: {
  subQuestion: CaseStudySubQuestion;
  subResponse?: NGNUserResponse;
  onSubResponseChange: (resp: NGNUserResponse) => void;
  index: number;
  total: number;
  disabled?: boolean;
}) {
  const defaultResponse = subResponse || createDefaultResponse(subQuestion.questionType);

  return (
    <div className="space-y-3" data-testid={`case-sub-question-${subQuestion.id}`}>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-xs">
          Question {index + 1} of {total}
        </Badge>
        <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs">
          {subQuestion.questionType.replace(/_/g, " ")}
        </Badge>
      </div>
      <p className="text-base font-medium text-gray-900 leading-relaxed">{subQuestion.stem}</p>
      <Suspense fallback={<div className="p-2 text-sm text-gray-400">{t("components.ngnRenderersCaseStudySeriesRenderer.loading")}</div>}>
        <LazyNGNQuestionDispatcher
          questionType={subQuestion.questionType}
          payload={subQuestion.itemPayload}
          response={defaultResponse}
          onResponseChange={onSubResponseChange}
          disabled={disabled}
        />
      </Suspense>
    </div>
  );
}

export function CaseStudySeriesRenderer({
  payload,
  response,
  onResponseChange,
  disabled = false,
}: CaseStudySeriesRendererProps) {
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const subQ = payload.subQuestions[currentSubIndex];

  const handleSubResponseChange = (subId: string, subResp: NGNUserResponse) => {
    const next = {
      ...response,
      subResponses: { ...response.subResponses, [subId]: subResp },
    };
    onResponseChange(next);
  };

  return (
    <div className="space-y-4" data-testid="renderer-case-study-series">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{t("components.ngnRenderersCaseStudySeriesRenderer.patientScenario")}</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{payload.patientSummary}</p>
      </div>

      {payload.tabs.length > 0 && (
        <Tabs defaultValue={payload.tabs[0]?.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <TabsList className="w-full justify-start bg-slate-50 border-b border-slate-200 rounded-none px-2 py-1 h-auto flex-wrap">
            {payload.tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
                data-testid={`case-tab-trigger-${tab.id}`}
              >
                {tabIcons[tab.id.toLowerCase()] || <FileText className="w-3.5 h-3.5" />}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {payload.tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="p-4 m-0">
              <TabContentDisplay tab={tab} />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        {subQ && (
          <SubQuestionRenderer
            subQuestion={subQ}
            subResponse={response.subResponses[subQ.id]}
            onSubResponseChange={(resp) => handleSubResponseChange(subQ.id, resp)}
            index={currentSubIndex}
            total={payload.subQuestions.length}
            disabled={disabled}
          />
        )}

        {payload.subQuestions.length > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSubIndex((i) => Math.max(0, i - 1))}
              disabled={currentSubIndex === 0}
              data-testid="button-case-prev-sub"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-xs text-gray-500">
              {currentSubIndex + 1} / {payload.subQuestions.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSubIndex((i) => Math.min(payload.subQuestions.length - 1, i + 1))}
              disabled={currentSubIndex === payload.subQuestions.length - 1}
              data-testid="button-case-next-sub"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
