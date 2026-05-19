"use client";

import {
  CheckSquare,
  GitMerge,
  CircleDot,
  Grid3X3,
  GripVertical,
  Highlighter,
  Layers,
  MousePointerClick,
} from "lucide-react";
import type { ReactNode } from "react";

export type NclexQuestionType =
  | "mcq"
  | "sata"
  | "bowtie"
  | "matrix_mcq"
  | "matrix_mr"
  | "drag_drop"
  | "dropdown_cloze"
  | "dropdown_table"
  | "highlight_text"
  | "highlight_table"
  | "hotspot"
  | "case_study"
  | "trend"
  | "ordered_response"
  | "fill_blank"
  | "ecg_video";

type TypeMeta = {
  label: string;
  sublabel: string;
  instruction: string;
  iconClass: string;
  Icon: (props: { size?: number }) => ReactNode;
};

const TYPE_META: Record<NclexQuestionType, TypeMeta> = {
  mcq: {
    label: "MCQ",
    sublabel: "Multiple Choice",
    instruction: "Select the single best answer.",
    iconClass: "nn-nclex-type-panel__icon-wrap--mcq",
    Icon: ({ size = 18 }) => <CircleDot size={size} />,
  },
  sata: {
    label: "SATA",
    sublabel: "Select All That Apply",
    instruction: "Select all that apply. Rationale will be provided for each option.",
    iconClass: "nn-nclex-type-panel__icon-wrap--sata",
    Icon: ({ size = 18 }) => <CheckSquare size={size} />,
  },
  bowtie: {
    label: "Bowtie / Trend",
    sublabel: "Clinical Judgment",
    instruction: "Consider how the assessment leads to interventions, monitoring, and outcomes.",
    iconClass: "nn-nclex-type-panel__icon-wrap--bowtie",
    Icon: ({ size = 18 }) => <GitMerge size={size} />,
  },
  matrix_mcq: {
    label: "Matrix",
    sublabel: "Multiple Choice",
    instruction: "Select one answer per row.",
    iconClass: "nn-nclex-type-panel__icon-wrap--matrix",
    Icon: ({ size = 18 }) => <Grid3X3 size={size} />,
  },
  matrix_mr: {
    label: "Matrix",
    sublabel: "Multiple Response",
    instruction: "Select all that apply for each row.",
    iconClass: "nn-nclex-type-panel__icon-wrap--matrix",
    Icon: ({ size = 18 }) => <Grid3X3 size={size} />,
  },
  drag_drop: {
    label: "Drag & Drop",
    sublabel: "Ordered Response",
    instruction: "Drag items to arrange them in the correct order.",
    iconClass: "nn-nclex-type-panel__icon-wrap--drag",
    Icon: ({ size = 18 }) => <GripVertical size={size} />,
  },
  dropdown_cloze: {
    label: "Drop-Down",
    sublabel: "Cloze",
    instruction: "Select the correct option from each drop-down menu to complete the sentence.",
    iconClass: "nn-nclex-type-panel__icon-wrap--matrix",
    Icon: ({ size = 18 }) => <Layers size={size} />,
  },
  dropdown_table: {
    label: "Drop-Down",
    sublabel: "Table",
    instruction: "Select the correct option from each drop-down in the table.",
    iconClass: "nn-nclex-type-panel__icon-wrap--matrix",
    Icon: ({ size = 18 }) => <Layers size={size} />,
  },
  highlight_text: {
    label: "Highlight",
    sublabel: "Text",
    instruction: "Click to highlight the words or phrases that answer the question.",
    iconClass: "nn-nclex-type-panel__icon-wrap--hl",
    Icon: ({ size = 18 }) => <Highlighter size={size} />,
  },
  highlight_table: {
    label: "Highlight",
    sublabel: "Table",
    instruction: "Click to highlight the cells in the table that answer the question.",
    iconClass: "nn-nclex-type-panel__icon-wrap--hl",
    Icon: ({ size = 18 }) => <Highlighter size={size} />,
  },
  hotspot: {
    label: "Hot Spot",
    sublabel: "Click to Select",
    instruction: "Click on the area of the image that answers the question.",
    iconClass: "nn-nclex-type-panel__icon-wrap--hl",
    Icon: ({ size = 18 }) => <MousePointerClick size={size} />,
  },
  case_study: {
    label: "Case Study",
    sublabel: "Multi-Item",
    instruction: "Read the clinical scenario and answer each question using the provided information.",
    iconClass: "nn-nclex-type-panel__icon-wrap--case",
    Icon: ({ size = 18 }) => <Layers size={size} />,
  },
  trend: {
    label: "Trend",
    sublabel: "Clinical Data",
    instruction: "Analyze the trending data and select the most appropriate response.",
    iconClass: "nn-nclex-type-panel__icon-wrap--bowtie",
    Icon: ({ size = 18 }) => <GitMerge size={size} />,
  },
  ordered_response: {
    label: "Ordered",
    sublabel: "Response",
    instruction: "Place the steps in the correct order by dragging or numbering them.",
    iconClass: "nn-nclex-type-panel__icon-wrap--drag",
    Icon: ({ size = 18 }) => <GripVertical size={size} />,
  },
  fill_blank: {
    label: "Fill in",
    sublabel: "the Blank",
    instruction: "Type your numeric answer in the space provided.",
    iconClass: "nn-nclex-type-panel__icon-wrap--mcq",
    Icon: ({ size = 18 }) => <CircleDot size={size} />,
  },
  ecg_video: {
    label: "ECG",
    sublabel: "Interpretation",
    instruction: "Review the ECG tracing and answer the question.",
    iconClass: "nn-nclex-type-panel__icon-wrap--case",
    Icon: ({ size = 18 }) => <Layers size={size} />,
  },
};

/** Infer question type from question format + isSata flag */
export function inferNclexQuestionType(
  format: string | null | undefined,
  isSata: boolean,
): NclexQuestionType {
  if (isSata) return "sata";
  if (!format) return "mcq";
  const f = format.toLowerCase();
  if (f.includes("bowtie")) return "bowtie";
  if (f.includes("sata") || f.includes("multi")) return "sata";
  if (f.includes("matrix_mr") || f.includes("matrix-mr")) return "matrix_mr";
  if (f.includes("matrix")) return "matrix_mcq";
  if (f.includes("drag") || f.includes("ordered")) return "drag_drop";
  if (f.includes("cloze")) return "dropdown_cloze";
  if (f.includes("dropdown_table") || f.includes("drop_table")) return "dropdown_table";
  if (f.includes("highlight_table")) return "highlight_table";
  if (f.includes("highlight")) return "highlight_text";
  if (f.includes("hotspot") || f.includes("hot_spot")) return "hotspot";
  if (f.includes("case")) return "case_study";
  if (f.includes("trend")) return "trend";
  if (f.includes("fill") || f.includes("blank")) return "fill_blank";
  if (f.includes("ecg")) return "ecg_video";
  return "mcq";
}

export function NclexQuestionTypePanel({ type }: { type: NclexQuestionType }) {
  const meta = TYPE_META[type];
  const { Icon } = meta;

  return (
    <aside className="nn-nclex-type-panel" aria-label={`Question type: ${meta.label}`}>
      <div className={`nn-nclex-type-panel__icon-wrap ${meta.iconClass}`} aria-hidden="true">
        <Icon size={18} />
      </div>
      <div>
        <p className="nn-nclex-type-panel__type-label">{meta.label}</p>
        <p className="nn-nclex-type-panel__type-sub">{meta.sublabel}</p>
      </div>
      <div className="nn-nclex-type-panel__divider" />
      <p className="nn-nclex-type-panel__instruction">{meta.instruction}</p>
    </aside>
  );
}
