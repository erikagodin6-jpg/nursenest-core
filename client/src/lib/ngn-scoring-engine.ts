import type {
  NGNQuestionType,
  NGNUserResponse,
  NGNCorrectResponse,
  NGNItemPayload,
  ScoringRule,
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
  BowtieCorrectResponse,
  DragDropClozePayload,
  DropdownClozePayload,
  DropdownTablePayload,
  MatrixSinglePayload,
  MatrixMultiPayload,
  MultiResponseGroupingPayload,
  TrendPayload,
  HighlightTextPayload,
  BowtiePayload,
  DragDropRationalePayload,
  DropdownRationalePayload,
  CaseStudySeriesPayload,
  CaseStudySeriesResponse,
  CaseStudySeriesCorrectResponse,
  LabInterpretationPayload,
  LabInterpretationResponse,
  ImageHotspotPayload,
  ImageHotspotResponse,
  CalculationNumericPayload,
  CalculationNumericResponse,
  MatchingGridPayload,
  MatchingGridResponse,
} from "./ngn-question-types";

export interface ScoringBreakdownItem {
  itemId: string;
  earned: number;
  max: number;
  correct: boolean;
}

export interface ScoringResult {
  earnedPoints: number;
  maxPoints: number;
  breakdown: ScoringBreakdownItem[];
}

export interface CompletionResult {
  complete: boolean;
  missingItems: string[];
}

function scoreDragDropCloze(
  user: DragDropClozeResponse,
  correct: DragDropClozeResponse,
  rule: ScoringRule
): ScoringResult {
  const blanks = Object.keys(correct.placements);
  const breakdown: ScoringBreakdownItem[] = blanks.map((blankId) => {
    const isCorrect = user.placements[blankId] === correct.placements[blankId];
    return {
      itemId: blankId,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    };
  });
  return finalizeScore(breakdown, rule);
}

function scoreDragDropRationale(
  user: DragDropRationaleResponse,
  correct: DragDropRationaleResponse,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  const causeCorrect = user.selectedCause === correct.selectedCause;
  breakdown.push({
    itemId: "cause",
    earned: causeCorrect ? rule.perItemPoints : 0,
    max: rule.perItemPoints,
    correct: causeCorrect,
  });
  correct.selectedEffects.forEach((effectId, i) => {
    const isCorrect = user.selectedEffects.includes(effectId);
    breakdown.push({
      itemId: `effect-${i}`,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    });
  });
  const extraEffects = user.selectedEffects.filter(
    (e) => !correct.selectedEffects.includes(e)
  );
  extraEffects.forEach((_, i) => {
    breakdown.push({
      itemId: `extra-effect-${i}`,
      earned: 0,
      max: 0,
      correct: false,
    });
  });
  return finalizeScore(breakdown, rule);
}

function scoreDropdownCloze(
  user: DropdownClozeResponse,
  correct: DropdownClozeResponse,
  rule: ScoringRule
): ScoringResult {
  const keys = Object.keys(correct.selections);
  const breakdown: ScoringBreakdownItem[] = keys.map((key) => {
    const isCorrect = user.selections[key] === correct.selections[key];
    return {
      itemId: key,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    };
  });
  return finalizeScore(breakdown, rule);
}

function scoreDropdownRationale(
  user: DropdownRationaleResponse,
  correct: DropdownRationaleResponse,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  const causeCorrect = user.selectedCause === correct.selectedCause;
  breakdown.push({
    itemId: "cause",
    earned: causeCorrect ? rule.perItemPoints : 0,
    max: rule.perItemPoints,
    correct: causeCorrect,
  });
  correct.selectedEffects.forEach((effectId, i) => {
    const isCorrect = user.selectedEffects.includes(effectId);
    breakdown.push({
      itemId: `effect-${i}`,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    });
  });
  return finalizeScore(breakdown, rule);
}

function scoreDropdownTable(
  user: DropdownTableResponse,
  correct: DropdownTableResponse,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  for (const rowId of Object.keys(correct.cellSelections)) {
    const correctRow = correct.cellSelections[rowId];
    const userRow = user.cellSelections[rowId] || {};
    for (const colId of Object.keys(correctRow)) {
      const isCorrect = userRow[colId] === correctRow[colId];
      breakdown.push({
        itemId: `${rowId}-${colId}`,
        earned: isCorrect ? rule.perItemPoints : 0,
        max: rule.perItemPoints,
        correct: isCorrect,
      });
    }
  }
  return finalizeScore(breakdown, rule);
}

function scoreMatrixSingle(
  user: MatrixSingleResponse,
  correct: MatrixSingleResponse,
  rule: ScoringRule
): ScoringResult {
  const rows = Object.keys(correct.selections);
  const breakdown: ScoringBreakdownItem[] = rows.map((rowId) => {
    const isCorrect = user.selections[rowId] === correct.selections[rowId];
    return {
      itemId: rowId,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    };
  });
  return finalizeScore(breakdown, rule);
}

function scoreMatrixMulti(
  user: MatrixMultiResponse,
  correct: MatrixMultiResponse,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  for (const rowId of Object.keys(correct.selections)) {
    const correctCols = correct.selections[rowId] || [];
    const userCols = user.selections[rowId] || [];
    correctCols.forEach((colId, i) => {
      const isCorrect = userCols.includes(colId);
      breakdown.push({
        itemId: `${rowId}-correct-${i}`,
        earned: isCorrect ? rule.perItemPoints : 0,
        max: rule.perItemPoints,
        correct: isCorrect,
      });
    });
    const extras = userCols.filter((c) => !correctCols.includes(c));
    extras.forEach((_, i) => {
      breakdown.push({
        itemId: `${rowId}-extra-${i}`,
        earned: 0,
        max: 0,
        correct: false,
      });
    });
  }
  return finalizeScore(breakdown, rule);
}

function scoreMultiResponseGrouping(
  user: MultiResponseGroupingResponse,
  correct: MultiResponseGroupingResponse,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  for (const groupId of Object.keys(correct.groupSelections)) {
    const correctItems = correct.groupSelections[groupId] || [];
    const userItems = user.groupSelections[groupId] || [];
    correctItems.forEach((itemId, i) => {
      const isCorrect = userItems.includes(itemId);
      breakdown.push({
        itemId: `${groupId}-${i}`,
        earned: isCorrect ? rule.perItemPoints : 0,
        max: rule.perItemPoints,
        correct: isCorrect,
      });
    });
    const extras = userItems.filter((item) => !correctItems.includes(item));
    extras.forEach((_, i) => {
      breakdown.push({
        itemId: `${groupId}-extra-${i}`,
        earned: 0,
        max: 0,
        correct: false,
      });
    });
  }
  return finalizeScore(breakdown, rule);
}

function scoreTrend(
  user: TrendResponse,
  correct: TrendResponse,
  payload: TrendPayload,
  rule: ScoringRule
): ScoringResult {
  return scoreNGNQuestion(
    payload.embeddedItem.questionType,
    user.embeddedResponse,
    correct.embeddedResponse as NGNCorrectResponse,
    payload.embeddedItem.scoringRule
  );
}

function scoreHighlightText(
  user: HighlightTextResponse,
  correct: HighlightTextResponse,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  correct.selectedSpanIds.forEach((spanId, i) => {
    const isCorrect = user.selectedSpanIds.includes(spanId);
    breakdown.push({
      itemId: spanId,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    });
  });
  const extras = user.selectedSpanIds.filter(
    (s) => !correct.selectedSpanIds.includes(s)
  );
  extras.forEach((spanId) => {
    breakdown.push({
      itemId: `extra-${spanId}`,
      earned: 0,
      max: 0,
      correct: false,
    });
  });
  return finalizeScore(breakdown, rule);
}

function scoreBowtie(
  user: BowtieResponse,
  correct: BowtieCorrectResponse,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  correct.correctConditions.forEach((cId, i) => {
    const isCorrect = user.selectedConditions.includes(cId);
    breakdown.push({
      itemId: `condition-${i}`,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    });
  });
  correct.correctActions.forEach((aId, i) => {
    const isCorrect = user.selectedActions.includes(aId);
    breakdown.push({
      itemId: `action-${i}`,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    });
  });
  correct.correctMonitors.forEach((mId, i) => {
    const isCorrect = user.selectedMonitors.includes(mId);
    breakdown.push({
      itemId: `monitor-${i}`,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    });
  });
  return finalizeScore(breakdown, rule);
}

function scoreCaseStudySeries(
  user: CaseStudySeriesResponse,
  correct: CaseStudySeriesCorrectResponse,
  payload: CaseStudySeriesPayload,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  for (const subQ of payload.subQuestions) {
    const subUser = user.subResponses[subQ.id];
    const subCorrect = correct.subResponses[subQ.id];
    if (!subUser || !subCorrect) {
      breakdown.push({
        itemId: `sub-${subQ.id}`,
        earned: 0,
        max: subQ.scoringRule.perItemPoints,
        correct: false,
      });
      continue;
    }
    const subResult = scoreNGNQuestion(
      subQ.questionType,
      subUser,
      subCorrect,
      subQ.scoringRule,
      subQ.itemPayload
    );
    for (const b of subResult.breakdown) {
      breakdown.push({
        ...b,
        itemId: `sub-${subQ.id}-${b.itemId}`,
      });
    }
  }
  return finalizeScore(breakdown, rule);
}

function scoreLabInterpretation(
  user: LabInterpretationResponse,
  correct: LabInterpretationResponse,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  correct.selectedOptionIds.forEach((optId, i) => {
    const isCorrect = user.selectedOptionIds.includes(optId);
    breakdown.push({
      itemId: `lab-opt-${i}`,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    });
  });
  const extras = user.selectedOptionIds.filter(
    (id) => !correct.selectedOptionIds.includes(id)
  );
  extras.forEach((_, i) => {
    breakdown.push({
      itemId: `lab-extra-${i}`,
      earned: 0,
      max: 0,
      correct: false,
    });
  });
  return finalizeScore(breakdown, rule);
}

function scoreImageHotspot(
  user: ImageHotspotResponse,
  correct: ImageHotspotResponse,
  rule: ScoringRule
): ScoringResult {
  const breakdown: ScoringBreakdownItem[] = [];
  correct.selectedRegionIds.forEach((regionId, i) => {
    const isCorrect = user.selectedRegionIds.includes(regionId);
    breakdown.push({
      itemId: `region-${regionId}`,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    });
  });
  const extras = user.selectedRegionIds.filter(
    (id) => !correct.selectedRegionIds.includes(id)
  );
  extras.forEach((id) => {
    breakdown.push({
      itemId: `extra-region-${id}`,
      earned: 0,
      max: 0,
      correct: false,
    });
  });
  return finalizeScore(breakdown, rule);
}

function scoreCalculationNumeric(
  user: CalculationNumericResponse,
  correct: CalculationNumericResponse,
  payload: CalculationNumericPayload,
  rule: ScoringRule
): ScoringResult {
  const userVal = user.numericAnswer;
  const correctVal = payload.expectedAnswer;
  const tolerance = payload.tolerance;
  const isCorrect =
    userVal !== null &&
    user.selectedUnit === payload.unit &&
    Math.abs(userVal - correctVal) <= tolerance;
  const breakdown: ScoringBreakdownItem[] = [
    {
      itemId: "calculation",
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    },
  ];
  return finalizeScore(breakdown, rule);
}

function scoreMatchingGrid(
  user: MatchingGridResponse,
  correct: MatchingGridResponse,
  rule: ScoringRule
): ScoringResult {
  const keys = Object.keys(correct.matches);
  const breakdown: ScoringBreakdownItem[] = keys.map((key) => {
    const isCorrect = user.matches[key] === correct.matches[key];
    return {
      itemId: `match-${key}`,
      earned: isCorrect ? rule.perItemPoints : 0,
      max: rule.perItemPoints,
      correct: isCorrect,
    };
  });
  return finalizeScore(breakdown, rule);
}

function finalizeScore(
  breakdown: ScoringBreakdownItem[],
  rule: ScoringRule
): ScoringResult {
  const maxPoints = breakdown.reduce((sum, b) => sum + b.max, 0);
  if (!rule.partialCredit) {
    const allCorrect = breakdown.every((b) => b.correct || b.max === 0);
    return {
      earnedPoints: allCorrect ? maxPoints : 0,
      maxPoints,
      breakdown,
    };
  }
  const earnedPoints = breakdown.reduce((sum, b) => sum + b.earned, 0);
  return { earnedPoints, maxPoints, breakdown };
}

export function scoreNGNQuestion(
  questionType: NGNQuestionType,
  userResponse: NGNUserResponse,
  correctResponse: NGNCorrectResponse,
  scoringRule: ScoringRule,
  itemPayload?: NGNItemPayload
): ScoringResult {
  switch (questionType) {
    case "DRAG_DROP_CLOZE":
      return scoreDragDropCloze(
        userResponse as DragDropClozeResponse,
        correctResponse as DragDropClozeResponse,
        scoringRule
      );
    case "DRAG_DROP_RATIONALE":
      return scoreDragDropRationale(
        userResponse as DragDropRationaleResponse,
        correctResponse as DragDropRationaleResponse,
        scoringRule
      );
    case "DROPDOWN_CLOZE":
      return scoreDropdownCloze(
        userResponse as DropdownClozeResponse,
        correctResponse as DropdownClozeResponse,
        scoringRule
      );
    case "DROPDOWN_RATIONALE":
      return scoreDropdownRationale(
        userResponse as DropdownRationaleResponse,
        correctResponse as DropdownRationaleResponse,
        scoringRule
      );
    case "DROPDOWN_TABLE":
      return scoreDropdownTable(
        userResponse as DropdownTableResponse,
        correctResponse as DropdownTableResponse,
        scoringRule
      );
    case "MATRIX_SINGLE":
      return scoreMatrixSingle(
        userResponse as MatrixSingleResponse,
        correctResponse as MatrixSingleResponse,
        scoringRule
      );
    case "MATRIX_MULTI":
      return scoreMatrixMulti(
        userResponse as MatrixMultiResponse,
        correctResponse as MatrixMultiResponse,
        scoringRule
      );
    case "MULTI_RESPONSE_GROUPING":
      return scoreMultiResponseGrouping(
        userResponse as MultiResponseGroupingResponse,
        correctResponse as MultiResponseGroupingResponse,
        scoringRule
      );
    case "TREND":
      return scoreTrend(
        userResponse as TrendResponse,
        correctResponse as TrendResponse,
        itemPayload as TrendPayload,
        scoringRule
      );
    case "HIGHLIGHT_TEXT":
      return scoreHighlightText(
        userResponse as HighlightTextResponse,
        correctResponse as HighlightTextResponse,
        scoringRule
      );
    case "BOWTIE":
      return scoreBowtie(
        userResponse as BowtieResponse,
        correctResponse as BowtieCorrectResponse,
        scoringRule
      );
    case "CASE_STUDY_SERIES":
      return scoreCaseStudySeries(
        userResponse as CaseStudySeriesResponse,
        correctResponse as CaseStudySeriesCorrectResponse,
        itemPayload as CaseStudySeriesPayload,
        scoringRule
      );
    case "LAB_INTERPRETATION":
      return scoreLabInterpretation(
        userResponse as LabInterpretationResponse,
        correctResponse as LabInterpretationResponse,
        scoringRule
      );
    case "IMAGE_HOTSPOT":
      return scoreImageHotspot(
        userResponse as ImageHotspotResponse,
        correctResponse as ImageHotspotResponse,
        scoringRule
      );
    case "CALCULATION_NUMERIC":
      return scoreCalculationNumeric(
        userResponse as CalculationNumericResponse,
        correctResponse as CalculationNumericResponse,
        itemPayload as CalculationNumericPayload,
        scoringRule
      );
    case "MATCHING_GRID":
      return scoreMatchingGrid(
        userResponse as MatchingGridResponse,
        correctResponse as MatchingGridResponse,
        scoringRule
      );
    default:
      return { earnedPoints: 0, maxPoints: 0, breakdown: [] };
  }
}

export function validateCompletion(
  questionType: NGNQuestionType,
  itemPayload: NGNItemPayload,
  userResponse: NGNUserResponse
): CompletionResult {
  const missingItems: string[] = [];

  switch (questionType) {
    case "DRAG_DROP_CLOZE": {
      const payload = itemPayload as DragDropClozePayload;
      const response = userResponse as DragDropClozeResponse;
      for (const blank of payload.blanks) {
        if (!response.placements[blank.id]) {
          missingItems.push(`blank-${blank.id}`);
        }
      }
      break;
    }
    case "DRAG_DROP_RATIONALE": {
      const payload = itemPayload as DragDropRationalePayload;
      const response = userResponse as DragDropRationaleResponse;
      if (!response.selectedCause) {
        missingItems.push("cause");
      }
      if (response.selectedEffects.length < payload.effectsCount) {
        missingItems.push(
          `effects (need ${payload.effectsCount}, have ${response.selectedEffects.length})`
        );
      }
      break;
    }
    case "DROPDOWN_CLOZE": {
      const payload = itemPayload as DropdownClozePayload;
      const response = userResponse as DropdownClozeResponse;
      for (const dd of payload.dropdowns) {
        if (!response.selections[dd.id]) {
          missingItems.push(`dropdown-${dd.id}`);
        }
      }
      break;
    }
    case "DROPDOWN_RATIONALE": {
      const payload = itemPayload as DropdownRationalePayload;
      const response = userResponse as DropdownRationaleResponse;
      if (!response.selectedCause) {
        missingItems.push("cause");
      }
      if (response.selectedEffects.length < payload.effectsCount) {
        missingItems.push(
          `effects (need ${payload.effectsCount}, have ${response.selectedEffects.length})`
        );
      }
      break;
    }
    case "DROPDOWN_TABLE": {
      const payload = itemPayload as DropdownTablePayload;
      const response = userResponse as DropdownTableResponse;
      for (const row of payload.rows) {
        for (const cell of row.cells) {
          if (
            !response.cellSelections[row.id] ||
            !response.cellSelections[row.id][cell.columnId]
          ) {
            missingItems.push(`cell-${row.id}-${cell.columnId}`);
          }
        }
      }
      break;
    }
    case "MATRIX_SINGLE": {
      const payload = itemPayload as MatrixSinglePayload;
      const response = userResponse as MatrixSingleResponse;
      if (payload.requireAllRowsAnswered) {
        for (const row of payload.rows) {
          if (!response.selections[row.id]) {
            missingItems.push(`row-${row.id}`);
          }
        }
      }
      break;
    }
    case "MATRIX_MULTI": {
      const payload = itemPayload as MatrixMultiPayload;
      const response = userResponse as MatrixMultiResponse;
      for (const row of payload.rows) {
        const selected = response.selections[row.id] || [];
        if (selected.length < payload.selectionRule.perRowMin) {
          missingItems.push(
            `row-${row.id} (need min ${payload.selectionRule.perRowMin})`
          );
        }
      }
      break;
    }
    case "MULTI_RESPONSE_GROUPING": {
      const payload = itemPayload as MultiResponseGroupingPayload;
      const response = userResponse as MultiResponseGroupingResponse;
      if (payload.requireAtLeastOnePerGroup) {
        for (const group of payload.groups) {
          const selected = response.groupSelections[group.id] || [];
          if (selected.length === 0) {
            missingItems.push(`group-${group.id}`);
          }
        }
      }
      break;
    }
    case "TREND": {
      const payload = itemPayload as TrendPayload;
      const response = userResponse as TrendResponse;
      if (!response.embeddedResponse) {
        missingItems.push("embedded-item");
      } else {
        const sub = validateCompletion(
          payload.embeddedItem.questionType,
          payload.embeddedItem.itemPayload,
          response.embeddedResponse
        );
        missingItems.push(...sub.missingItems.map((m) => `embedded-${m}`));
      }
      break;
    }
    case "HIGHLIGHT_TEXT": {
      const response = userResponse as HighlightTextResponse;
      if (response.selectedSpanIds.length === 0) {
        missingItems.push("highlight-selection");
      }
      break;
    }
    case "BOWTIE": {
      const payload = itemPayload as BowtiePayload;
      const response = userResponse as BowtieResponse;
      if (response.selectedConditions.length < payload.slots.conditionCount) {
        missingItems.push(
          `conditions (need ${payload.slots.conditionCount}, have ${response.selectedConditions.length})`
        );
      }
      if (response.selectedActions.length < payload.slots.actionCount) {
        missingItems.push(
          `actions (need ${payload.slots.actionCount}, have ${response.selectedActions.length})`
        );
      }
      if (response.selectedMonitors.length < payload.slots.monitorCount) {
        missingItems.push(
          `monitors (need ${payload.slots.monitorCount}, have ${response.selectedMonitors.length})`
        );
      }
      break;
    }
    case "CASE_STUDY_SERIES": {
      const payload = itemPayload as CaseStudySeriesPayload;
      const response = userResponse as CaseStudySeriesResponse;
      for (const subQ of payload.subQuestions) {
        const subResp = response.subResponses[subQ.id];
        if (!subResp) {
          missingItems.push(`sub-question-${subQ.id}`);
        } else {
          const sub = validateCompletion(subQ.questionType, subQ.itemPayload, subResp);
          missingItems.push(...sub.missingItems.map((m) => `sub-${subQ.id}-${m}`));
        }
      }
      break;
    }
    case "LAB_INTERPRETATION": {
      const payload = itemPayload as LabInterpretationPayload;
      const response = userResponse as LabInterpretationResponse;
      const needed = payload.embeddedQuestion.selectCount || 1;
      if (response.selectedOptionIds.length < needed) {
        missingItems.push(
          `lab-selection (need ${needed}, have ${response.selectedOptionIds.length})`
        );
      }
      break;
    }
    case "IMAGE_HOTSPOT": {
      const payload = itemPayload as ImageHotspotPayload;
      const response = userResponse as ImageHotspotResponse;
      if (response.selectedRegionIds.length === 0) {
        missingItems.push("hotspot-selection");
      } else if (response.selectedRegionIds.length < payload.maxSelections) {
        missingItems.push(
          `hotspot-selection (need ${payload.maxSelections}, have ${response.selectedRegionIds.length})`
        );
      }
      break;
    }
    case "CALCULATION_NUMERIC": {
      const response = userResponse as CalculationNumericResponse;
      if (response.numericAnswer === null || response.numericAnswer === undefined) {
        missingItems.push("numeric-answer");
      }
      if (!response.selectedUnit) {
        missingItems.push("unit-selection");
      }
      break;
    }
    case "MATCHING_GRID": {
      const payload = itemPayload as MatchingGridPayload;
      const response = userResponse as MatchingGridResponse;
      for (const item of payload.columnA) {
        if (!response.matches[item.id]) {
          missingItems.push(`match-${item.id}`);
        }
      }
      break;
    }
  }

  return {
    complete: missingItems.length === 0,
    missingItems,
  };
}
