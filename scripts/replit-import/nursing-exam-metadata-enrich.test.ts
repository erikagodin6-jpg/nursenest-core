import { describe, test, expect } from "vitest";
import { enrichNursingExamItemMetadata, clearManualMappingCache } from "./nursing-exam-metadata-enrich";

describe("nursing-exam-metadata-enrich", () => {
  test("explicit tier/exam on item is unchanged", () => {
    clearManualMappingCache();
    const item = { tier: "rn", exam: "NCLEX_RN", stem: "hello world question stem?", options: { A: "a", B: "b" } };
    const { audit } = enrichNursingExamItemMetadata(item as Record<string, unknown>, {
      sourceFileName: "ai_cache.json",
      exportDirAbs: "/tmp/export",
      cacheKey: "anything",
      rowIndex: 0,
      outputItemIndex: 0,
      parentRow: {},
    }, null);
    expect(audit.originalTier).toBe("rn");
    expect(audit.originalExam).toBe("NCLEX_RN");
    expect(audit.tierSource).toBe("explicit_item_field");
    expect(audit.examSource).toBe("explicit_item_field");
  });

  test("cache_key nclex-rn infers rn + NCLEX_RN", () => {
    clearManualMappingCache();
    const item = {
      stem: "another stem for question here?",
      options: { A: "a", B: "b", C: "c", D: "d" },
    };
    const { merged, audit } = enrichNursingExamItemMetadata(item as Record<string, unknown>, {
      sourceFileName: "ai_cache.json",
      exportDirAbs: "/tmp/export",
      cacheKey: "batch-nclex-rn-001",
      rowIndex: 0,
      outputItemIndex: 0,
      parentRow: {},
    }, null);
    expect(merged.tier).toBe("rn");
    expect(merged.exam).toBe("NCLEX_RN");
    expect(audit.tierSource).toBe("inferred_rule");
    expect(audit.ambiguous).toBe(false);
  });
});
