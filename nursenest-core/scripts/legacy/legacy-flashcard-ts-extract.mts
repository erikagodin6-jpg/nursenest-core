/**
 * Parse legacy client `FlashcardData[]` exports using the TypeScript AST (no runtime eval of TS).
 * Handles string literals and simple template literals; falls back to source slice for complex nodes.
 */
import ts from "typescript";

export type LegacyFlashcardRow = {
  id: string;
  type?: string;
  question: string;
  answer: string;
  options?: string[];
  correctIndex?: number;
  category?: string;
  difficulty?: number;
};

function exprText(sf: ts.SourceFile, n: ts.Expression): string {
  const raw = n.getText(sf).trim();
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  if (ts.isTemplateExpression(n)) {
    let s = n.head.text;
    for (const span of n.templateSpans) {
      const lit = span.literal;
      if (ts.isStringLiteral(lit) || ts.isNoSubstitutionTemplateLiteral(lit)) s += lit.text;
      else s += span.getText(sf);
    }
    return s;
  }
  return raw.replace(/^["']|["']$/g, "");
}

function parseStringProp(obj: ts.ObjectLiteralExpression, name: string, sf: ts.SourceFile): string | undefined {
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const pn = p.name;
    const key =
      ts.isIdentifier(pn) ? pn.text : ts.isStringLiteral(pn) ? pn.text : undefined;
    if (key !== name) continue;
    if (ts.isStringLiteral(p.initializer) || ts.isNoSubstitutionTemplateLiteral(p.initializer)) {
      return p.initializer.text;
    }
    if (ts.isTemplateExpression(p.initializer)) return exprText(sf, p.initializer);
    return exprText(sf, p.initializer as ts.Expression);
  }
  return undefined;
}

function parseNumberProp(obj: ts.ObjectLiteralExpression, name: string, sf: ts.SourceFile): number | undefined {
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const key = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : undefined;
    if (key !== name) continue;
    if (ts.isNumericLiteral(p.initializer)) return Number(p.initializer.text);
    if (p.initializer.kind === ts.SyntaxKind.MinusToken && ts.isNumericLiteral((p.initializer as unknown as { operand: ts.Expression }).operand)) {
      return -Number((p.initializer as unknown as { operand: ts.NumericLiteral }).operand.text);
    }
    const t = p.initializer.getText(sf);
    const n = parseInt(t, 10);
    return Number.isFinite(n) ? n : undefined;
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
      else out.push(exprText(sf, el as ts.Expression));
    }
    return out;
  }
  return undefined;
}

export function parseFlashcardObject(el: ts.ObjectLiteralExpression, sf: ts.SourceFile): LegacyFlashcardRow | null {
  const id = parseStringProp(el, "id", sf)?.trim();
  if (!id) return null;
  const type = parseStringProp(el, "type", sf);
  const question = parseStringProp(el, "question", sf) ?? "";
  const answer = parseStringProp(el, "answer", sf) ?? "";
  const options = parseStringArrayProp(el, "options", sf);
  const correctIndex = parseNumberProp(el, "correctIndex", sf);
  const category = parseStringProp(el, "category", sf);
  const difficulty = parseNumberProp(el, "difficulty", sf);
  return {
    id,
    type,
    question,
    answer,
    ...(options?.length ? { options } : {}),
    ...(correctIndex !== undefined ? { correctIndex } : {}),
    ...(category ? { category } : {}),
    ...(difficulty !== undefined ? { difficulty } : {}),
  };
}

export function extractLegacyFlashcardExports(
  sourceText: string,
  fileName: string,
): Array<{ exportName: string; cards: LegacyFlashcardRow[] }> {
  const sf = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const results: Array<{ exportName: string; cards: LegacyFlashcardRow[] }> = [];

  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    const isExport = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExport) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      const init = decl.initializer;
      if (!init || !ts.isArrayLiteralExpression(init)) continue;
      const cards: LegacyFlashcardRow[] = [];
      for (const element of init.elements) {
        if (!ts.isObjectLiteralExpression(element)) continue;
        const row = parseFlashcardObject(element, sf);
        if (row) cards.push(row);
      }
      if (cards.length > 0) {
        results.push({ exportName: decl.name.text, cards });
      }
    }
  }
  return results;
}

export function legacyFrontBack(row: LegacyFlashcardRow): { front: string; back: string } {
  if (row.type === "question" && row.options?.length) {
    const opts = row.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join("\n");
    const front = `${row.question}\n\n${opts}`.trim();
    const letter =
      row.correctIndex !== undefined && row.correctIndex >= 0
        ? String.fromCharCode(65 + row.correctIndex)
        : "?";
    const back = `Correct: ${letter}\n\n${row.answer}`.trim();
    return { front, back };
  }
  return {
    front: row.question.trim() || row.id,
    back: row.answer.trim() || "—",
  };
}
