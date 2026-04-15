/**
 * Parse legacy `CareerQuestion[]` exports (compact object literals) via TypeScript AST.
 */
import ts from "typescript";

export type LegacyCareerQuestion = {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  difficulty: number;
  category: string;
  topic: string;
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

export function parseCareerQuestionObject(el: ts.ObjectLiteralExpression, sf: ts.SourceFile): LegacyCareerQuestion | null {
  const id = parseStringProp(el, "id", sf)?.trim();
  const stem = parseStringProp(el, "stem", sf)?.trim();
  const options = parseStringArrayProp(el, "options", sf);
  const correctIndex = parseNumberProp(el, "correctIndex");
  const rationale = parseStringProp(el, "rationale", sf) ?? "";
  const difficulty = parseNumberProp(el, "difficulty") ?? 3;
  const category = parseStringProp(el, "category", sf) ?? "General";
  const topic = parseStringProp(el, "topic", sf) ?? "";
  if (!id || !stem || !options?.length || correctIndex === undefined) return null;
  return { id, stem, options, correctIndex, rationale, difficulty, category, topic };
}

export function extractLegacyCareerQuestionExports(
  sourceText: string,
  fileName: string,
): Array<{ exportName: string; questions: LegacyCareerQuestion[] }> {
  const sf = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const results: Array<{ exportName: string; questions: LegacyCareerQuestion[] }> = [];

  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    const isExport = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExport) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      const init = decl.initializer;
      if (!init || !ts.isArrayLiteralExpression(init)) continue;
      const questions: LegacyCareerQuestion[] = [];
      for (const element of init.elements) {
        if (!ts.isObjectLiteralExpression(element)) continue;
        const q = parseCareerQuestionObject(element, sf);
        if (q) questions.push(q);
      }
      if (questions.length) results.push({ exportName: decl.name.text, questions });
    }
  }
  return results;
}
