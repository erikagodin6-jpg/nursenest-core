import type {
  NGNQuestionType,
  NGNUserResponse,
  CaseStudySeriesResponse,
  LabInterpretationResponse,
  ImageHotspotResponse,
  CalculationNumericResponse,
  MatchingGridResponse,
  DragDropClozeResponse,
  DragDropRationaleResponse,
  DropdownClozeResponse,
  DropdownRationaleResponse,
  DropdownTableResponse,
  MatrixSingleResponse,
  MatrixMultiResponse,
  MultiResponseGroupingResponse,
  TrendResponse,
  HighlightTextResponse,
  BowtieResponse,
} from "@/lib/ngn-question-types";

export function createDefaultResponse(questionType: NGNQuestionType): NGNUserResponse {
  switch (questionType) {
    case "DRAG_DROP_CLOZE":
      return { placements: {} } as DragDropClozeResponse;
    case "DRAG_DROP_RATIONALE":
      return { selectedCause: "", selectedEffects: [] } as DragDropRationaleResponse;
    case "DROPDOWN_CLOZE":
      return { selections: {} } as DropdownClozeResponse;
    case "DROPDOWN_RATIONALE":
      return { selectedCause: "", selectedEffects: [] } as DropdownRationaleResponse;
    case "DROPDOWN_TABLE":
      return { cellSelections: {} } as DropdownTableResponse;
    case "MATRIX_SINGLE":
      return { selections: {} } as MatrixSingleResponse;
    case "MATRIX_MULTI":
      return { selections: {} } as MatrixMultiResponse;
    case "MULTI_RESPONSE_GROUPING":
      return { groupSelections: {} } as MultiResponseGroupingResponse;
    case "TREND":
      return { embeddedResponse: {} as NGNUserResponse } as TrendResponse;
    case "HIGHLIGHT_TEXT":
      return { selectedSpanIds: [] } as HighlightTextResponse;
    case "BOWTIE":
      return { selectedConditions: [], selectedActions: [], selectedMonitors: [] } as BowtieResponse;
    case "CASE_STUDY_SERIES":
      return { subResponses: {} } as CaseStudySeriesResponse;
    case "LAB_INTERPRETATION":
      return { selectedOptionIds: [] } as LabInterpretationResponse;
    case "IMAGE_HOTSPOT":
      return { selectedRegionIds: [] } as ImageHotspotResponse;
    case "CALCULATION_NUMERIC":
      return { numericAnswer: null, selectedUnit: "" } as CalculationNumericResponse;
    case "MATCHING_GRID":
      return { matches: {} } as MatchingGridResponse;
    default:
      return { placements: {} } as DragDropClozeResponse;
  }
}
