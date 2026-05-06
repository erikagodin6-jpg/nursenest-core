/**
 * DB-backed flow checks for marketing public content overrides (draft vs published).
 * Skips when DATABASE_URL is unset or not configured.
 */
import assert from "node:assert/strict";
import type { TestContext } from "node:test";
import { describe, it } from "node:test";
import { Prisma } from "@prisma/client";
import { MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS } from "@/lib/marketing/marketing-public-content-policy";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

const dbUrl = Boolean(process.env.DATABASE_URL?.trim());
const itDb = dbUrl && isDatabaseUrlConfigured() ? it : it.skip;

const MESSAGE_KEY = "pages.home.sampleQuestion.sectionTitle" as keyof typeof MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS;
const LOCALE = "en";
const SURFACE = MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS[MESSAGE_KEY].surface;

async function publishedValueMap(prisma: {
  marketingPublicContentOverride: {
    findMany: (args: unknown) => Promise<Array<{ messageKey: string; value: string }>>;
  };
}) {
  const keys = Object.keys(MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS);
  const rows = await prisma.marketingPublicContentOverride.findMany({
    where: { locale: LOCALE, isPublished: true, messageKey: { in: keys } },
    select: { messageKey: true, value: true },
  });
  return Object.fromEntries(rows.map((r) => [r.messageKey, r.value]));
}

function skipIfDraftColumnMissing(t: TestContext, e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  if (
    msg.includes("draft_value") ||
    msg.includes("Unknown column") ||
    (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2022")
  ) {
    t.skip("Database schema missing marketing_public_content_overrides.draft_value (apply migrations)");
    return true;
  }
  return false;
}

describe("marketing public content admin flow (DATABASE_URL)", () => {
  itDb("draft never appears in published-only map; publish updates map; discard clears draft; reset removes row", async (t) => {
    const { prisma } = await import("@/lib/db");
    const actor = await prisma.user.findFirst({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
      select: { id: true },
    });
    if (!actor) {
      // eslint-disable-next-line no-console -- test visibility
      console.warn("[marketing-public-content-admin-flow] skip: no ADMIN user in DB");
      return;
    }

    await prisma.marketingPublicContentOverrideRevision.deleteMany({
      where: { messageKey: MESSAGE_KEY, locale: LOCALE },
    });
    await prisma.marketingPublicContentOverride.deleteMany({
      where: { messageKey: MESSAGE_KEY, locale: LOCALE },
    });

    const baseline = `NN_PAGE_COPY_TEST_BASELINE_${Date.now()}`;
    const draftText = `NN_PAGE_COPY_TEST_DRAFT_${Date.now()}`;
    const publishedFromDraft = `NN_PAGE_COPY_TEST_PUBLISHED_${Date.now()}`;

    try {
      await prisma.marketingPublicContentOverride.create({
        data: {
          messageKey: MESSAGE_KEY,
          locale: LOCALE,
          surface: SURFACE,
          value: baseline,
          draftValue: null,
          previousValue: null,
          isPublished: true,
          publishedAt: new Date(),
          updatedByUserId: actor.id,
        },
      });
    } catch (e) {
      if (skipIfDraftColumnMissing(t, e)) return;
      throw e;
    }

    let pub = await publishedValueMap(prisma);
    assert.equal(pub[MESSAGE_KEY], baseline);

    try {
      await prisma.marketingPublicContentOverride.update({
        where: { messageKey_locale: { messageKey: MESSAGE_KEY, locale: LOCALE } },
        data: { draftValue: draftText },
      });
    } catch (e) {
      if (skipIfDraftColumnMissing(t, e)) return;
      throw e;
    }
    pub = await publishedValueMap(prisma);
    assert.equal(
      pub[MESSAGE_KEY],
      baseline,
      "staged draft must not change the published-only map used for public pages",
    );

    await prisma.marketingPublicContentOverride.update({
      where: { messageKey_locale: { messageKey: MESSAGE_KEY, locale: LOCALE } },
      data: {
        value: publishedFromDraft,
        draftValue: null,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    pub = await publishedValueMap(prisma);
    assert.equal(pub[MESSAGE_KEY], publishedFromDraft);

    await prisma.marketingPublicContentOverride.update({
      where: { messageKey_locale: { messageKey: MESSAGE_KEY, locale: LOCALE } },
      data: { draftValue: "SHOULD_DISCARD" },
    });
    await prisma.marketingPublicContentOverride.update({
      where: { messageKey_locale: { messageKey: MESSAGE_KEY, locale: LOCALE } },
      data: { draftValue: null },
    });
    const rowAfterDiscard = await prisma.marketingPublicContentOverride.findUnique({
      where: { messageKey_locale: { messageKey: MESSAGE_KEY, locale: LOCALE } },
    });
    assert.equal(rowAfterDiscard?.draftValue, null);
    assert.equal(rowAfterDiscard?.value, publishedFromDraft);
    pub = await publishedValueMap(prisma);
    assert.equal(pub[MESSAGE_KEY], publishedFromDraft);

    await prisma.marketingPublicContentOverride.deleteMany({
      where: { messageKey: MESSAGE_KEY, locale: LOCALE },
    });
    await prisma.marketingPublicContentOverrideRevision.deleteMany({
      where: { messageKey: MESSAGE_KEY, locale: LOCALE },
    });
    pub = await publishedValueMap(prisma);
    assert.equal(pub[MESSAGE_KEY], undefined);
  });

  itDb("unpublished row with draft does not surface in published map", async (t) => {
    const { prisma } = await import("@/lib/db");
    const actor = await prisma.user.findFirst({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
      select: { id: true },
    });
    if (!actor) return;

    await prisma.marketingPublicContentOverrideRevision.deleteMany({
      where: { messageKey: MESSAGE_KEY, locale: LOCALE },
    });
    await prisma.marketingPublicContentOverride.deleteMany({
      where: { messageKey: MESSAGE_KEY, locale: LOCALE },
    });

    try {
      await prisma.marketingPublicContentOverride.create({
        data: {
          messageKey: MESSAGE_KEY,
          locale: LOCALE,
          surface: SURFACE,
          value: "",
          draftValue: "SECRET_DRAFT_NOT_PUBLIC",
          previousValue: null,
          isPublished: false,
          publishedAt: null,
          updatedByUserId: actor.id,
        },
      });
    } catch (e) {
      if (skipIfDraftColumnMissing(t, e)) return;
      throw e;
    }

    const pub = await publishedValueMap(prisma);
    assert.equal(pub[MESSAGE_KEY], undefined);

    await prisma.marketingPublicContentOverride.deleteMany({
      where: { messageKey: MESSAGE_KEY, locale: LOCALE },
    });
    await prisma.marketingPublicContentOverrideRevision.deleteMany({
      where: { messageKey: MESSAGE_KEY, locale: LOCALE },
    });
  });
});
