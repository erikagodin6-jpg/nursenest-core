/**
 * Parse legacy `client/src/data/advanced-questions/*-mcq-*.ts` and `*-sata-*.ts` exports.
 */
import ts from "typescript";

export type LegacyAdvancedQuestion = {
  id: string;
  stem: string;
  options: string[];
  questionType: "mcq" | "sata";
  correctAnswer?: number;
  correctAnswers?: number[];
  rationale: string;
  bodySystem?: string;
  difficulty: number;
  tier?: string;
  tags: string[];
  blueprintCategory?: string;
};

function parseStringProp(obj: ts.ObjectLiteralExpression, name: string, sf: ts.SourceFile): string | undefined {
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const key = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : undefined;
    if (key !== name) continue;
    const init = p.initializer;
    if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) return init.text;
    if (ts.isTemplateExpression(init)) return init.getText(sf).replace(/^`|`$/g, "").replace(/\\`/g, "`");
    return init.getText(sf);
  }
  return undefined;
}

function parseNumberProp(obj: ts.ObjectLiteralExpression, name: string): number | undefined {
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const key = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : undefined;
    if (key !== name) continue;
    if (ts.isNumericLiteral(p.initializer)) return Number(p.initializer.text);
    if (ts.isPrefixUnaryExpression(p.initializer) && p.initializer.operator === ts.SyntaxKind.MinusToken) {
      const op = p.initializer.operand;
      if (ts.isNumericLiteral(op)) return -Number(op.text);
    }
  }
  return undefined;
}

function parseStringArrayProp(obj: ts.ObjectLiteralExpression, name: string, sf: ts.SourceFile): string[] | undefined {
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const key = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : undefined;
    if (key !== name) continue;
    if (!ts.isArrayLiteralExpression(p.initializer)) return undefined;
    const out: string[] = [];
    for (const el of p.initializer.elements) {
      if (ts.isStringLiteral(el) || ts.isNoSubstitutionTemplateLiteral(el)) out.push(el.text);
      else out.push(el.getText(sf));
    }
    return out;
  }
  return undefined;
}

function parseNumberArrayProp(obj: ts.ObjectLiteralExpression, name: string): number[] | undefined {
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const key = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : undefined;
    if (key !== name) continue;
    if (!ts.isArrayLiteralExpression(p.initializer)) return undefined;
    const out: number[] = [];
    for (const el of p.initializer.elements) {
      if (ts.isNumericLiteral(el)) out.push(Number(el.text));
      else if (ts.isPrefixUnaryExpression(el) && el.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(el.operand)) {
        out.push(-Number(el.operand.text));
      } else {
        return undefined;
      }
    }
    return out.length ? out : undefined;
  }
  return undefined;
}

function parseQuestionTypeRaw(el: ts.ObjectLiteralExpression, sf: ts.SourceFile): string {
  for (const p of el.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const key = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : undefined;
    if (key !== "questionType") continue;
    const init = p.initializer;
    const raw = init.getText(sf).replace(/\s+as\s+const\s*$/i, "").trim();
    return raw.replace(/^["']|["']$/g, "").toLowerCase();
  }
  return "";
}

export function parseAdvancedQuestionObject(el: ts.ObjectLiteralExpression, sf: ts.SourceFile): LegacyAdvancedQuestion | null {
  const id = parseStringProp(el, "id", sf)?.trim();
  const stem = parseStringProp(el, "stem", sf)?.trim();
  const options = parseStringArrayProp(el, "options", sf);
  const qt = parseQuestionTypeRaw(el, sf);
  const rationale = parseStringProp(el, "rationale", sf) ?? "";
  const bodySystem = parseStringProp(el, "bodySystem", sf)?.trim();
  const blueprintCategory = parseStringProp(el, "blueprintCategory", sf)?.trim();
  const tier = parseStringProp(el, "tier", sf)?.trim();
  const tags = parseStringArrayProp(el, "tags", sf) ?? [];
  const difficulty = parseNumberProp(el, "difficulty") ?? 3;

  if (!id || !stem || !options?.length) return null;

  if (qt === "mcq" || qt === "multiple_choice") {
    const correctAnswer = parseNumberProp(el, "correctAnswer");
    if (correctAnswer === undefined) return null;
    return {
      id,
      stem,
      options,
      questionType: "mcq",
      correctAnswer,
      rationale,
      bodySystem,
      difficulty,
      tier,
      tags,
      blueprintCategory,
    };
  }

  if (qt === "sata" || qt === "select_all_that_apply") {
    const correctAnswers = parseNumberArrayProp(el, "correctAnswers");
    if (!correctAnswers?.length) return null;
    return {
      id,
      stem,
      options,
      questionType: "sata",
      correctAnswers,
      rationale,
      bodySystem,
      difficulty,
      tier,
      tags,
      blueprintCategory,
    };
  }

  return null;
}

export function extractLegacyAdvancedQuestionExports(
  sourceText: string,
  fileName: string,
): Array<{ exportName: string; questions: LegacyAdvancedQuestion[] }> {
  const sf = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const results: Array<{ exportName: string; questions: LegacyAdvancedQuestion[] }> = [];

  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    const isExport = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExport) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      const init = decl.initializer;
      if (!init || !ts.isArrayLiteralExpression(init)) continue;
      const questions: LegacyAdvancedQuestion[] = [];
      for (const element of init.elements) {
        if (!ts.isObjectLiteralExpression(element)) continue;
        const q = parseAdvancedQuestionObject(element, sf);
        if (q) questions.push(q);
      }
      if (questions.length) results.push({ exportName: decl.name.text, questions });
    }
  }
  return results;
}
