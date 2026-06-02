import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  SMART_FORMULA_ITEMS,
  SMART_FORMULA_SUBCATEGORY_LABELS,
  searchSmartFormulaItems,
  type SmartFormulaSubcategory,
} from "@/lib/formula-sheet/smart-formula-sheet";

const root = process.cwd();

describe("Smart Formula Sheet", () => {
  it("covers required medication math and clinical formula categories", () => {
    const required: SmartFormulaSubcategory[] = [
      "dosage_calculations",
      "iv_rates",
      "drip_factors",
      "infusion_calculations",
      "abg_interpretation",
      "ecg_intervals",
      "hemodynamic_values",
      "lab_references",
    ];
    for (const subcategory of required) {
      assert.ok(SMART_FORMULA_SUBCATEGORY_LABELS[subcategory], `${subcategory} should have a label`);
      assert.ok(
        SMART_FORMULA_ITEMS.some((item) => item.subcategory === subcategory),
        `${subcategory} should have at least one formula item`,
      );
    }
  });

  it("supports search and favorites-first ordering", () => {
    assert.equal(searchSmartFormulaItems("drip")[0]?.id, "gravity-drip-rate");
    assert.equal(searchSmartFormulaItems("ABG")[0]?.id, "abg-basic-interpretation");
    assert.equal(searchSmartFormulaItems("", ["map-formula"])[0]?.id, "map-formula");
  });

  it("keeps formulas educational and safety-aware", () => {
    for (const item of SMART_FORMULA_ITEMS) {
      assert.ok(item.formula.length >= 12, `${item.id} should include a formula or reference`);
      assert.ok(item.useWhen.length >= 30, `${item.id} should explain use case`);
      assert.ok(item.steps.length >= 2, `${item.id} should include quick-use steps`);
      assert.ok(item.safetyNote.length >= 40, `${item.id} should include a safety note`);
      assert.ok(item.searchTerms.length >= 3, `${item.id} should include search terms`);
    }
  });

  it("is accessible from Study Tools with a direct route and no-navigation slide-over launcher", () => {
    const routes = readFileSync(join(root, "src/lib/study-tools/study-tool-routes.ts"), "utf8");
    const shell = readFileSync(join(root, "src/components/study-tools/study-tools-activity-shell.tsx"), "utf8");
    const component = readFileSync(join(root, "src/components/formula-sheet/smart-formula-sheet.tsx"), "utf8");
    const learnerLayout = readFileSync(join(root, "src/app/(app)/app/(learner)/layout.tsx"), "utf8");
    const page = readFileSync(
      join(root, "src/app/(app)/app/(learner)/(study-tools)/study-tools/formula-sheet/page.tsx"),
      "utf8",
    );

    assert.match(routes, /formulaSheet:\s*"\/app\/study-tools\/formula-sheet"/);
    assert.match(shell, /SmartFormulaSheetLauncher/);
    assert.match(shell, /Formula sheet/);
    assert.match(learnerLayout, /SmartFormulaSheetLauncher compact/);
    assert.match(component, /createPortal/);
    assert.match(component, /data-nn-smart-formula-sheet-drawer/);
    assert.match(component, /aria-label="Smart Formula Sheet"/);
    assert.match(component, /aria-label="Open formula sheet"/);
    assert.match(component, /localStorage/);
    assert.match(page, /SmartFormulaSheetPanel embedded/);
    assert.doesNotMatch(component, /#[0-9a-fA-F]{3,8}\b/);
  });
});
