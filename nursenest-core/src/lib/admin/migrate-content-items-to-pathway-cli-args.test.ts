import { describe, expect, test } from "vitest";
import { parseMigrationCliArgs } from "@/lib/admin/migrate-content-items-to-pathway-cli-args";

describe("parseMigrationCliArgs", () => {
  test("defaults to dry run and apply false", () => {
    const o = parseMigrationCliArgs([]);
    expect(o.dryRun).toBe(true);
    expect(o.apply).toBe(false);
    expect(o.limit).toBe(50);
    expect(o.pathwayId).toBeNull();
  });

  test("parses limit pathwayId and apply", () => {
    const o = parseMigrationCliArgs(["--limit=10", "--pathwayId=ca-rn-nclex-rn", "--apply=true", "--dryRun=false"]);
    expect(o.limit).toBe(10);
    expect(o.pathwayId).toBe("ca-rn-nclex-rn");
    expect(o.apply).toBe(true);
    expect(o.dryRun).toBe(false);
  });
});
