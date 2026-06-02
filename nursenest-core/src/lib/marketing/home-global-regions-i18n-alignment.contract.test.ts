/**
 * Contract: homepage global-regions EN copy must not name expansion hubs as live
 * unless `listPublishedHomeGlobalRegionCardIds` includes that hub (see `published-regional-marketing-urls.ts`).
 */
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  HOME_GLOBAL_REGION_EXPANSION_CARD_IDS,
  listPublishedHomeGlobalRegionCardIds,
} from "./published-regional-marketing-urls";

/** Test file: `src/lib/marketing/*.test.ts` → repo root is three levels up. */
const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const pagesEnPath = path.join(pkgRoot, "public", "i18n", "en", "pages.json");

const EXPANSION_REGION_WORD: Record<(typeof HOME_GLOBAL_REGION_EXPANSION_CARD_IDS)[number], string> = {
  ph: "Philippines",
  me: "Middle East",
  cn: "China",
};

test("EN global regions subtitle does not name unpublished expansion hubs", () => {
  const pages = JSON.parse(readFileSync(pagesEnPath, "utf8")) as Record<string, string>;
  const subtitle = pages["pages.home.globalRegions.subtitle"];
  assert.ok(subtitle && subtitle.length > 40, "subtitle must be present");
  const ids = listPublishedHomeGlobalRegionCardIds();
  for (const id of HOME_GLOBAL_REGION_EXPANSION_CARD_IDS) {
    if (!ids.includes(id)) {
      const word = EXPANSION_REGION_WORD[id];
      assert.ok(
        !subtitle.includes(word),
        `pages.home.globalRegions.subtitle must not name "${word}" when ${id} is not in published ids (${ids.join(",")})`,
      );
    }
  }
});

test("EN global regions title avoids false worldwide universality", () => {
  const pages = JSON.parse(readFileSync(pagesEnPath, "utf8")) as Record<string, string>;
  const title = pages["pages.home.globalRegions.title"];
  assert.ok(title && title.length > 10, "title must be present");
  assert.ok(!/\bworldwide\b/i.test(title), `title must not use "worldwide" as a universality claim: ${title}`);
});

test("Published homepage region cards are a subset of configured marketing cards", () => {
  const ids = listPublishedHomeGlobalRegionCardIds();
  const allowed = new Set<string>(["us", "ca", ...HOME_GLOBAL_REGION_EXPANSION_CARD_IDS]);
  for (const id of ids) {
    assert.ok(allowed.has(id), `unexpected region card id: ${id}`);
  }
});
