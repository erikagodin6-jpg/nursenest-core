export type NGNQuestionType =
  | "DRAG_DROP_CLOZE"
  | "DRAG_DROP_RATIONALE"
  | "DROPDOWN_CLOZE"
  | "DROPDOWN_RATIONALE"
  | "DROPDOWN_TABLE"
  | "MATRIX_SINGLE"
  | "MATRIX_MULTI"
  | "MULTI_RESPONSE_GROUPING"
  | "TREND"
  | "HIGHLIGHT_TEXT"
  | "BOWTIE"
  | "CASE_STUDY_SERIES"
  | "LAB_INTERPRETATION"
  | "IMAGE_HOTSPOT"
  | "CALCULATION_NUMERIC"
  | "MATCHING_GRID";

export interface DragDropClozePayload {
  textTemplate: string;
  draggableOptions: { id: string; label: string }[];
  blanks: { id: string; accepts: string[] }[];
}

export interface DragDropClozeResponse {
  placements: Record<string, string>;
}

export interface DragDropRationalePayload {
  baseSentenceTemplate: string;
  draggableCauses: { id: string; label: string }[];
  draggableEffects: { id: string; label: string }[];
  effectsCount: number;
}

export interface DragDropRationaleResponse {
  selectedCause: string;
  selectedEffects: string[];
}

export interface DropdownClozePayload {
  paragraphs: { id: string; textTemplate: string }[];
  dropdowns: {
    id: string;
    placeholderKey: string;
    options: { id: string; label: string }[];
  }[];
}

export interface DropdownClozeResponse {
  selections: Record<string, string>;
}

export interface DropdownRationalePayload {
  sentenceTemplate: string;
  causeOptions: { id: string; label: string }[];
  effectOptions: { id: string; label: string }[];
  effectsCount: number;
}

export interface DropdownRationaleResponse {
  selectedCause: string;
  selectedEffects: string[];
}

export interface DropdownTablePayload {
  columns: { id: string; label: string }[];
  rows: {
    id: string;
    label: string;
    cells: {
      columnId: string;
      dropdownOptions: { id: string; label: string }[];
    }[];
  }[];
}

export interface DropdownTableResponse {
  cellSelections: Record<string, Record<string, string>>;
}

export interface MatrixSinglePayload {
  columns: { id: string; label: string }[];
  rows: { id: string; label: string }[];
  requireAllRowsAnswered: boolean;
}

export interface MatrixSingleResponse {
  selections: Record<string, string>;
}

export interface MatrixMultiPayload {
  columns: { id: string; label: string }[];
  rows: { id: string; label: string }[];
  selectionRule: {
    perRowMin: number;
    perRowMax: number;
    perColumnMin: number;
  };
}

export interface MatrixMultiResponse {
  selections: Record<string, string[]>;
}

export interface MultiResponseGroupingPayload {
  groups: {
    id: string;
    label: string;
    options: { id: string; label: string }[];
  }[];
  requireAtLeastOnePerGroup: boolean;
}

export interface MultiResponseGroupingResponse {
  groupSelections: Record<string, string[]>;
}

export interface TrendPayload {
  timepoints: {
    tId: string;
    label: string;
    nurseNotes?: string;
    vitals?: Record<string, string>;
    labs?: Record<string, string>;
    meds?: string[];
  }[];
  embeddedItem: {
    questionType: NGNQuestionType;
    stem?: string;
    itemPayload: NGNItemPayload;
    correctResponse: NGNCorrectResponse;
    scoringRule: ScoringRule;
  };
}

export interface TrendResponse {
  embeddedResponse: NGNUserResponse;
}

export interface HighlightTextPayload {
  passage: string;
  highlightSpans: {
    spanId: string;
    start: number;
    end: number;
    label?: string;
  }[];
  maxSelections: number;
}

export interface HighlightTextResponse {
  selectedSpanIds: string[];
}

export interface BowtiePayload {
  conditionOptions: { id: string; label: string }[];
  actionOptions: { id: string; label: string }[];
  monitorOptions: { id: string; label: string }[];
  slots: {
    conditionCount: number;
    actionCount: number;
    monitorCount: number;
  };
}

export interface BowtieResponse {
  selectedConditions: string[];
  selectedActions: string[];
  selectedMonitors: string[];
}

export interface BowtieCorrectResponse {
  correctConditions: string[];
  correctActions: string[];
  correctMonitors: string[];
}

export interface CaseStudyTab {
  id: string;
  label: string;
  content: string;
  vitals?: Record<string, string>;
  labs?: Record<string, string>;
  meds?: string[];
}

export interface CaseStudySubQuestion {
  id: string;
  questionType: NGNQuestionType;
  stem: string;
  itemPayload: NGNItemPayload;
  correctResponse: NGNCorrectResponse;
  scoringRule: ScoringRule;
}

export interface CaseStudySeriesPayload {
  patientSummary: string;
  tabs: CaseStudyTab[];
  subQuestions: CaseStudySubQuestion[];
}

export interface CaseStudySeriesResponse {
  subResponses: Record<string, NGNUserResponse>;
}

export interface CaseStudySeriesCorrectResponse {
  subResponses: Record<string, NGNCorrectResponse>;
}

export interface LabValue {
  id: string;
  name: string;
  value: string;
  unit: string;
  normalRangeLow: number;
  normalRangeHigh: number;
  normalRangeDisplay: string;
  isAbnormal: boolean;
  flag?: "HIGH" | "LOW" | "CRITICAL_HIGH" | "CRITICAL_LOW";
}

export interface LabInterpretationPayload {
  panelName: string;
  labValues: LabValue[];
  embeddedQuestion: {
    questionType: "MCQ_SINGLE" | "SATA";
    stem: string;
    options: { id: string; label: string }[];
    selectCount?: number;
  };
}

export interface LabInterpretationResponse {
  selectedOptionIds: string[];
}

export interface ImageHotspotRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: "rect" | "circle" | "ellipse";
  label?: string;
}

export interface ImageHotspotPayload {
  imageUrl: string;
  imageAlt: string;
  regions: ImageHotspotRegion[];
  maxSelections: number;
}

export interface ImageHotspotResponse {
  selectedRegionIds: string[];
}

export interface CalculationNumericPayload {
  problemStatement: string;
  expectedAnswer: number;
  tolerance: number;
  unit: string;
  availableUnits?: string[];
  formula?: string;
}

export interface CalculationNumericResponse {
  numericAnswer: number | null;
  selectedUnit: string;
}

export interface MatchingGridPayload {
  columnA: { id: string; label: string }[];
  columnB: { id: string; label: string }[];
  allowReuse: boolean;
}

export interface MatchingGridResponse {
  matches: Record<string, string>;
}

export type NGNItemPayload =
  | DragDropClozePayload
  | DragDropRationalePayload
  | DropdownClozePayload
  | DropdownRationalePayload
  | DropdownTablePayload
  | MatrixSinglePayload
  | MatrixMultiPayload
  | MultiResponseGroupingPayload
  | TrendPayload
  | HighlightTextPayload
  | BowtiePayload
  | CaseStudySeriesPayload
  | LabInterpretationPayload
  | ImageHotspotPayload
  | CalculationNumericPayload
  | MatchingGridPayload;

export type NGNUserResponse =
  | DragDropClozeResponse
  | DragDropRationaleResponse
  | DropdownClozeResponse
  | DropdownRationaleResponse
  | DropdownTableResponse
  | MatrixSingleResponse
  | MatrixMultiResponse
  | MultiResponseGroupingResponse
  | TrendResponse
  | HighlightTextResponse
  | BowtieResponse
  | CaseStudySeriesResponse
  | LabInterpretationResponse
  | ImageHotspotResponse
  | CalculationNumericResponse
  | MatchingGridResponse;

export type NGNCorrectResponse =
  | DragDropClozeResponse
  | DragDropRationaleResponse
  | DropdownClozeResponse
  | DropdownRationaleResponse
  | DropdownTableResponse
  | MatrixSingleResponse
  | MatrixMultiResponse
  | MultiResponseGroupingResponse
  | TrendResponse
  | HighlightTextResponse
  | BowtieCorrectResponse
  | CaseStudySeriesCorrectResponse
  | LabInterpretationResponse
  | ImageHotspotResponse
  | CalculationNumericResponse
  | MatchingGridResponse;

export interface ScoringRule {
  type: "allOrNothing" | "partialCredit" | "dichotomous" | "+/-";
  partialCredit: boolean;
  perItemPoints: number;
}

export interface NGNQuestion {
  id: string;
  stem: string;
  scenario?: string;
  questionType: NGNQuestionType;
  itemPayload: NGNItemPayload;
  correctResponse: NGNCorrectResponse;
  scoringRule: ScoringRule;
  rationale: string;
  references?: string[];
  difficulty: 1 | 2 | 3;
  blueprintTags: {
    domain: string;
    subdomain?: string;
    exam?: string;
    tier?: string;
  };
}
