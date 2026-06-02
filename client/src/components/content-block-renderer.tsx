import { useState } from "react";
import { CheckCircle2, XCircle, Lightbulb, AlertTriangle, BookOpen, Stethoscope, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/lib/i18n";
export type ContentBlock = {
  type: string;
  content?: string;
  level?: number;
  items?: string[];
  calloutType?: string;
  title?: string;
  rows?: string[][];
  headers?: string[];
  url?: string;
  caption?: string;
  questions?: BlockQuizQuestion[];
};

type BlockQuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  rationale?: string;
  rationaleCorrect?: string;
  rationalesIncorrect?: string[];
};

function BlockHeading({ block }: { block: ContentBlock }) {
  const { t } = useI18n();
  const level = block.level || 2;
  const text = block.content || block.title || "";
  const cls = level === 1
    ? "text-2xl font-bold text-foreground mb-5 tracking-tight"
    : level === 2
    ? "text-xl font-bold text-foreground mb-3.5 tracking-tight mt-8 first:mt-0"
    : "text-lg font-semibold text-foreground/90 mb-2.5 mt-6 first:mt-0";
  return <div className={cls} data-testid="block-heading">{text}</div>;
}

function BlockParagraph({ block }: { block: ContentBlock }) {
  return (
    <div
      className="text-[15px] text-foreground/80 leading-[1.75] mb-4 max-w-[65ch]"
      data-testid="block-paragraph"
      dangerouslySetInnerHTML={{ __html: block.content || "" }}
    />
  );
}

function BlockBulletList({ block }: { block: ContentBlock }) {
  const items = block.items || (block.content ? block.content.split("\n").filter(Boolean) : []);
  if (items.length === 0) return null;
  return (
    <ul className="space-y-2.5 mb-5 pl-1" data-testid="block-bullet-list">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[15px] text-foreground/80 leading-relaxed">
          <span className="w-1.5 h-1.5 bg-primary/70 rounded-full mt-2.5 flex-shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

function BlockNumberedList({ block }: { block: ContentBlock }) {
  const items = block.items || (block.content ? block.content.split("\n").filter(Boolean) : []);
  if (items.length === 0) return null;
  return (
    <ol className="space-y-2.5 mb-5 pl-1 list-decimal list-inside" data-testid="block-numbered-list">
      {items.map((item, i) => (
        <li key={i} className="text-[15px] text-foreground/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ol>
  );
}

const calloutStyles: Record<string, { bg: string; border: string; icon: any; textColor: string }> = {
  tip: { bg: "bg-blue-50", border: "border-blue-200", icon: Lightbulb, textColor: "text-blue-800" },
  warning: { bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle, textColor: "text-amber-800" },
  exam: { bg: "bg-purple-50", border: "border-purple-200", icon: Target, textColor: "text-purple-800" },
  clinical: { bg: "bg-emerald-50", border: "border-emerald-200", icon: Stethoscope, textColor: "text-emerald-800" },
  concept: { bg: "bg-indigo-50", border: "border-indigo-200", icon: BookOpen, textColor: "text-indigo-800" },
  "clinical-pearl": { bg: "bg-emerald-50", border: "border-emerald-200", icon: Stethoscope, textColor: "text-emerald-800" },
};

function BlockCallout({ block }: { block: ContentBlock }) {
  const style = calloutStyles[block.calloutType || "tip"] || calloutStyles.tip;
  const Icon = style.icon;
  return (
    <div className={`${style.bg}/60 ${style.border}/60 border rounded-xl p-5 mb-5 border-l-[3px]`} data-testid="block-callout">
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${style.textColor} flex-shrink-0 mt-0.5`} />
        <div>
          {block.title && <p className={`text-sm font-bold ${style.textColor} mb-1.5`}>{block.title}</p>}
          <div className="text-[15px] text-foreground/80 leading-[1.7]" dangerouslySetInnerHTML={{ __html: block.content || "" }} />
        </div>
      </div>
    </div>
  );
}

function BlockTable({ block }: { block: ContentBlock }) {
  const headers = block.headers || [];
  const rows = block.rows || [];
  if (rows.length === 0 && headers.length === 0) return null;
  return (
    <div className="overflow-x-auto mb-4 rounded-lg border border-gray-200" data-testid="block-table">
      <table className="w-full text-sm">
        {headers.length > 0 && (
          <thead>
            <tr className="bg-gray-50">
              {headers.map((h, i) => (
                <th key={i} className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b">{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 1 ? "bg-gray-50/50" : ""}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2 text-gray-700 border-b border-gray-100">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockImage({ block }: { block: ContentBlock }) {
  if (!block.url) return null;
  const altText = block.caption || "NurseNest clinical nursing illustration";
  return (
    <figure className="mb-6 rounded-xl overflow-hidden border border-gray-100 bg-gray-50/30 p-3" data-testid="block-image">
      <img src={block.url} alt={altText} title={altText} className="w-full rounded-lg max-h-[600px] object-contain" loading="lazy" />
      <figcaption className="text-xs text-gray-500 text-center mt-2.5 italic">{block.caption || altText}</figcaption>
    </figure>
  );
}

function BlockDivider() {
  return <hr className="border-gray-200 my-6" data-testid="block-divider" />;
}

function BlockQuiz({ block }: { block: ContentBlock }) {
  const questions = block.questions || [];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  if (questions.length === 0) return null;

  return (
    <div className="space-y-4 mb-4" data-testid="block-quiz">
      {block.title && <h3 className="text-lg font-semibold text-foreground mb-3">{block.title}</h3>}
      {questions.map((q, qi) => (
        <Card key={qi} className="border-gray-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-foreground/90 mb-3">{q.question}</p>
            <div className="space-y-2 mb-3">
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const revealed = showResults[qi];
                const isCorrect = oi === q.correct;
                let optCls = "border-gray-200 hover:border-primary/40 cursor-pointer";
                if (revealed && selected && isCorrect) optCls = "border-green-400 bg-green-50";
                else if (revealed && selected && !isCorrect) optCls = "border-red-400 bg-red-50";
                else if (revealed && isCorrect) optCls = "border-green-300 bg-green-50/50";
                return (
                  <button
                    key={oi}
                    onClick={() => { if (!revealed) setAnswers({ ...answers, [qi]: oi }); }}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${optCls} ${selected && !revealed ? "border-primary bg-primary/5" : ""}`}
                    data-testid={`quiz-option-${qi}-${oi}`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                    {opt}
                    {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 inline ml-2" />}
                    {revealed && selected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 inline ml-2" />}
                  </button>
                );
              })}
            </div>
            {answers[qi] !== undefined && !showResults[qi] && (
              <Button size="sm" onClick={() => setShowResults({ ...showResults, [qi]: true })} data-testid={`quiz-check-${qi}`}>
                Check Answer
              </Button>
            )}
            {showResults[qi] && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${answers[qi] === q.correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                <p className="font-medium mb-1">{answers[qi] === q.correct ? "Correct!" : "Incorrect"}</p>
                <p>{q.rationale || q.rationaleCorrect || ""}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BlockClinicalPearl({ block }: { block: ContentBlock }) {
  return (
    <div className="rationale-callout rationale-callout-pearl mb-5" data-testid="block-clinical-pearl">
      <div className="flex items-start gap-3">
        <Stethoscope className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-violet-700 mb-1.5 uppercase tracking-wider">{t("components.contentBlockRenderer.clinicalPearl")}</p>
          <p className="text-[15px] text-foreground/80 leading-[1.7]">{block.content || ""}</p>
        </div>
      </div>
    </div>
  );
}

export function ContentBlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return <p className="text-gray-400 text-sm italic">{t("components.contentBlockRenderer.noContentAvailableYet")}</p>;
  }

  return (
    <div className="space-y-1 lesson-prose" data-testid="content-blocks">
      {blocks.map((block, i) => {
        if (!block || !block.type) return null;
        switch (block.type) {
          case "heading": return <BlockHeading key={i} block={block} />;
          case "paragraph": return <BlockParagraph key={i} block={block} />;
          case "bulletList":
          case "list": return <BlockBulletList key={i} block={block} />;
          case "numberedList":
          case "numbered-list": return <BlockNumberedList key={i} block={block} />;
          case "callout": return <BlockCallout key={i} block={block} />;
          case "clinical-pearl":
          case "clinicalPearl": return <BlockClinicalPearl key={i} block={block} />;
          case "table": return <BlockTable key={i} block={block} />;
          case "image": return <BlockImage key={i} block={block} />;
          case "divider": return <BlockDivider key={i} />;
          case "quiz":
          case "quizEmbed": return <BlockQuiz key={i} block={block} />;
          default: return block.content ? <BlockParagraph key={i} block={block} /> : null;
        }
      })}
    </div>
  );
}

export function LessonObjectives({ objectives }: { objectives: string[] }) {
  if (!objectives || objectives.length === 0) return null;
  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 mb-6" data-testid="lesson-objectives">
      <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
        <Target className="w-4 h-4" /> Learning Objectives
      </h3>
      <ul className="space-y-2">
        {objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{obj}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ClinicalPearlsList({ pearls }: { pearls: string[] }) {
  if (!pearls || pearls.length === 0) return null;
  return (
    <div className="space-y-3 mb-6" data-testid="clinical-pearls">
      <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
        <Stethoscope className="w-4 h-4" /> Clinical Pearls
      </h3>
      {pearls.map((pearl, i) => (
        <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-gray-700">
          {pearl}
        </div>
      ))}
    </div>
  );
}
