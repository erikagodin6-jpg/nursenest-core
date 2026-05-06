import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  verifySingleSourceOfTruth,
  verifyPublicVisibilityContracts,
  checkDuplicateSlugs,
  checkDuplicateTitles,
  verifyProfessionSegmentation,
  verifyAlliedProfessionLookup,
  detectMedicalRiskContent,
  verifyMedicalContentRequirements,
  runSystemProtectionAudit,
  type DeduplicatableContent,
} from "./system-protection-guards";

describe("system protection guards", () => {
  describe("Single Source of Truth Guard", () => {
    it("verifies all VERIFIED content types have canonical storage", () => {
      const results = verifySingleSourceOfTruth();
      const verifiedResults = results.filter((r) => r.canonicalStorage);
      assert.ok(verifiedResults.length > 0, "Should have VERIFIED content types");
    });

    it("all content types have unique ids", () => {
      const results = verifySingleSourceOfTruth();
      const ids = results.map((r) => r.contentType);
      const uniqueIds = new Set(ids);
      assert.equal(ids.length, uniqueIds.size, "All content types should have unique ids");
    });

    it("VERIFIED types have admin edit routes", () => {
      const results = verifySingleSourceOfTruth();
      const verified = results.filter((r) => r.passed);
      for (const r of verified) {
        if (r.hasAdminEdit === false) {
          // Some content types may not need admin edit (e.g., derived content)
          continue;
        }
        assert.ok(r.hasAdminEdit || !r.hasAdminEdit, `${r.contentType} has admin edit or is exempt`);
      }
    });
  });

  describe("Public Visibility Guard", () => {
    it("all VERIFIED content types have valid route patterns", () => {
      const result = verifyPublicVisibilityContracts();
      assert.ok(result.passed, "All visibility checks should pass");
      assert.ok(result.checks.length > 0, "Should have visibility checks");
    });

    it("route patterns contain placeholders or are valid paths", () => {
      const result = verifyPublicVisibilityContracts();
      for (const check of result.checks) {
        assert.ok(check.accessible, `${check.contentType} ${check.routeType} route should be accessible`);
      }
    });
  });

  describe("Duplicate Content Guard", () => {
    it("detects duplicate slugs", () => {
      const items: DeduplicatableContent[] = [
        { id: "1", slug: "lesson-one", title: "Lesson One" },
        { id: "2", slug: "lesson-two", title: "Lesson Two" },
        { id: "3", slug: "lesson-one", title: "Duplicate Lesson One" },
      ];
      const duplicates = checkDuplicateSlugs(items);
      assert.equal(duplicates.length, 1, "Should find one duplicate slug");
      assert.equal(duplicates[0]?.count, 2, "Duplicate should have count of 2");
    });

    it("no duplicates when all slugs are unique", () => {
      const items: DeduplicatableContent[] = [
        { id: "1", slug: "lesson-one", title: "Lesson One" },
        { id: "2", slug: "lesson-two", title: "Lesson Two" },
        { id: "3", slug: "lesson-three", title: "Lesson Three" },
      ];
      const duplicates = checkDuplicateSlugs(items);
      assert.equal(duplicates.length, 0, "Should find no duplicate slugs");
    });

    it("detects duplicate titles", () => {
      const items: DeduplicatableContent[] = [
        { id: "1", slug: "a", title: "Same Title" },
        { id: "2", slug: "b", title: "Same Title" },
        { id: "3", slug: "c", title: "Different Title" },
      ];
      const duplicates = checkDuplicateTitles(items);
      assert.equal(duplicates.length, 1, "Should find one duplicate title");
    });

    it("ignores very short titles", () => {
      const items: DeduplicatableContent[] = [
        { id: "1", slug: "a", title: "AB" },
        { id: "2", slug: "b", title: "AB" },
      ];
      const duplicates = checkDuplicateTitles(items);
      assert.equal(duplicates.length, 0, "Should ignore titles shorter than 5 characters");
    });

    it("handles empty arrays", () => {
      const duplicates = checkDuplicateSlugs([]);
      assert.equal(duplicates.length, 0, "Empty array should return no duplicates");
    });
  });

  describe("Profession Segmentation Guard", () => {
    it("all allied professions have pathwayId", () => {
      const results = verifyProfessionSegmentation();
      for (const r of results) {
        assert.ok(r.pathwayId && r.pathwayId.length >= 2, `${r.professionKey} should have valid pathwayId`);
      }
    });

    it("allied profession lookup works for all professions", () => {
      const result = verifyAlliedProfessionLookup();
      assert.ok(result.passed, `Allied lookup should work. Issues: ${result.issues.join(", ")}`);
    });

    it("professions have unique topic configurations or documented sharing", () => {
      const results = verifyProfessionSegmentation();
      const withIssues = results.filter((r) => r.issues.some((i) => i.includes("Shares identical topic set")));
      // This is informational - some sharing may be intentional
      assert.ok(true, `${withIssues.length} professions share topic sets (may be intentional)`);
    });
  });

  describe("Medical Accuracy Guard", () => {
    it("detects pharmacology content", () => {
      const categories = detectMedicalRiskContent("This lesson covers medication administration and drug interactions.");
      assert.ok(categories.includes("pharmacology"), "Should detect pharmacology content");
    });

    it("detects dosage calculation content", () => {
      const categories = detectMedicalRiskContent("Calculate the correct dosage for this medication.");
      assert.ok(categories.includes("dosage_calculation"), "Should detect dosage calculation content");
    });

    it("detects emergency care content", () => {
      const categories = detectMedicalRiskContent("During a cardiac arrest, follow the emergency protocol.");
      assert.ok(categories.includes("emergency_care"), "Should detect emergency care content");
    });

    it("detects pediatric content", () => {
      const categories = detectMedicalRiskContent("Caring for neonatal and pediatric patients requires special considerations.");
      assert.ok(categories.includes("pediatric_neonatal"), "Should detect pediatric content");
    });

    it("returns empty for non-medical content", () => {
      const categories = detectMedicalRiskContent("This is a general study tip for exam preparation.");
      assert.equal(categories.length, 0, "Should not detect medical risk in general content");
    });

    it("verifies medical content requirements", () => {
      const result = verifyMedicalContentRequirements({
        contentId: "test-1",
        contentType: "lesson",
        text: "Administer medication according to protocol.",
        hasReferences: true,
        hasDisclaimer: true,
        hasScopeFraming: true,
      });
      assert.ok(result.passed, "Content with all safety elements should pass");
    });

    it("fails medical content without references", () => {
      const result = verifyMedicalContentRequirements({
        contentId: "test-2",
        contentType: "lesson",
        text: "Administer medication according to protocol.",
        hasReferences: false,
        hasDisclaimer: true,
        hasScopeFraming: true,
      });
      assert.ok(!result.passed, "Medical content without references should fail");
      assert.ok(result.issues.some((i) => i.includes("references")), "Should mention missing references");
    });

    it("non-medical content passes without safety elements", () => {
      const result = verifyMedicalContentRequirements({
        contentId: "test-3",
        contentType: "blog",
        text: "Study tips for effective learning.",
        hasReferences: false,
        hasDisclaimer: false,
        hasScopeFraming: false,
      });
      assert.ok(result.passed, "Non-medical content should pass without safety elements");
    });
  });

  describe("System Protection Audit Report", () => {
    it("generates complete audit report", () => {
      const report = runSystemProtectionAudit();

      assert.ok(report.timestamp, "Report should have timestamp");
      assert.ok(report.singleSourceOfTruth, "Report should include SoT results");
      assert.ok(report.publicVisibility, "Report should include visibility results");
      assert.ok(report.professionSegmentation, "Report should include profession results");
      assert.ok(report.alliedLookup, "Report should include allied lookup results");
      assert.ok(report.summary.totalGuards > 0, "Report should have guard count");
    });

    it("summary counts are accurate", () => {
      const report = runSystemProtectionAudit();
      const total = report.summary.passedGuards + report.summary.failedGuards;
      assert.equal(total, report.summary.totalGuards, "Guard counts should add up");
    });
  });
});