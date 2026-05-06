import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import {
  assertMarketingOverrideSeoGuards,
  getMarketingPublicContentKeyDef,
  isMarketingPublicContentEditableKey,
  listMarketingPublicContentSlots,
  normalizeMarketingPublicContentLocale,
} from "@/lib/marketing/marketing-public-content-policy";
import { revalidatePathsForMarketingSurface } from "@/lib/marketing/marketing-public-content-revalidate";
import {
  MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG,
  marketingPublicContentOverrideLocaleTag,
} from "@/lib/marketing/load-marketing-public-content-overrides";
import {
  logMarketingPublicContentSaveAttempt,
  logMarketingPublicContentSaveResult,
} from "@/lib/marketing/marketing-public-content-observability";
import { getMarketingPublicContentDefaultCatalogValue } from "@/lib/marketing/marketing-public-content-default-catalog";

const noStoreJsonInit = { headers: { "Cache-Control": "no-store" } } as const;

const upsertSchema = z
  .object({
    action: z.literal("upsert"),
    messageKey: z.string().min(1).max(320),
    locale: z.string().min(1).max(32),
    value: z.string().min(0).max(20_000),
  })
  .strict();

const resetSchema = z
  .object({
    action: z.literal("reset"),
    messageKey: z.string().min(1).max(320),
    locale: z.string().min(1).max(32),
  })
  .strict();

const saveDraftSchema = z
  .object({
    action: z.literal("save_draft"),
    messageKey: z.string().min(1).max(320),
    locale: z.string().min(1).max(32),
    value: z.string().min(0).max(20_000),
  })
  .strict();

const publishDraftSchema = z
  .object({
    action: z.literal("publish_draft"),
    messageKey: z.string().min(1).max(320),
    locale: z.string().min(1).max(32),
  })
  .strict();

const discardDraftSchema = z
  .object({
    action: z.literal("discard_draft"),
    messageKey: z.string().min(1).max(320),
    locale: z.string().min(1).max(32),
  })
  .strict();

const bodySchema = z.discriminatedUnion("action", [
  upsertSchema,
  resetSchema,
  saveDraftSchema,
  publishDraftSchema,
  discardDraftSchema,
]);

function revalidateAfterMutation(locale: string, messageKey: string): void {
  const def = getMarketingPublicContentKeyDef(messageKey);
  if (!def) return;
  revalidatePathsForMarketingSurface(def.surface, locale);
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) {
    const denied = gate.response.clone();
    denied.headers.set("Cache-Control", "no-store");
    return denied;
  }

  const url = new URL(req.url);
  const locale = normalizeMarketingPublicContentLocale(url.searchParams.get("locale") ?? "en");
  const messageKeyFilter = (url.searchParams.get("messageKey") ?? "").trim();

  try {
    const slots = listMarketingPublicContentSlots();
    const filterLc = messageKeyFilter.toLowerCase();
    const defaultsByKey = Object.fromEntries(
      slots.map((s) => [s.messageKey, getMarketingPublicContentDefaultCatalogValue(s.messageKey, locale)]),
    );
    const filteredSlots =
      messageKeyFilter.length > 0
        ? slots.filter((s) => {
            const defVal = defaultsByKey[s.messageKey] ?? "";
            return (
              s.messageKey.toLowerCase().includes(filterLc) ||
              s.route.toLowerCase().includes(filterLc) ||
              s.sectionKey.toLowerCase().includes(filterLc) ||
              s.fieldKey.toLowerCase().includes(filterLc) ||
              defVal.toLowerCase().includes(filterLc)
            );
          })
        : slots;

    const rows = await prisma.marketingPublicContentOverride.findMany({
      where: { locale },
      select: {
        messageKey: true,
        value: true,
        draftValue: true,
        isPublished: true,
        updatedAt: true,
        publishedAt: true,
      },
    });
    const byKey = Object.fromEntries(rows.map((r) => [r.messageKey, r]));

    const revisions = await prisma.marketingPublicContentOverrideRevision.findMany({
      where: messageKeyFilter
        ? {
            locale,
            messageKey: { contains: messageKeyFilter, mode: "insensitive" },
          }
        : { locale },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        messageKey: true,
        locale: true,
        value: true,
        action: true,
        createdAt: true,
        actorUserId: true,
      },
    });

    const slotsOut = filteredSlots.map((s) => ({
      ...s,
      defaultCatalogValue: defaultsByKey[s.messageKey] ?? "",
    }));

    return NextResponse.json(
      {
        ok: true,
        locale,
        slots: slotsOut,
        overrides: byKey,
        revisions,
      },
      noStoreJsonInit,
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to load page copy data",
        code: "db_error",
        detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
      },
      { status: 500, ...noStoreJsonInit },
    );
  }
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);

  if (!gate.ok) {
    const denied = gate.response.clone();
    denied.headers.set("Cache-Control", "no-store");
    return denied;
  }

  const admin = gate.admin;
  const actorPrefix = typeof admin.userId === "string" ? admin.userId.slice(0, 8) : "";

  let raw: unknown;

  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON", code: "invalid_json" },
      { status: 400, ...noStoreJsonInit },
    );
  }

  const parsed = bodySchema.safeParse(raw);

  if (!parsed.success) {
    logMarketingPublicContentSaveResult({
      result: "validation_error",
      messageKeyPrefix: "(parse)",
      locale: "(unknown)",
      surface: "(unknown)",
      actorPrefix,
      detail: parsed.error.message.slice(0, 200),
    });

    return NextResponse.json(
      {
        error: "Invalid payload",
        code: "validation_error",
        issues: parsed.error.flatten(),
      },
      { status: 400, ...noStoreJsonInit },
    );
  }

  const body = parsed.data;
  const messageKey = typeof body.messageKey === "string" ? body.messageKey : "";
  const messageKeyPrefix = messageKey.slice(0, 64);
  const locale = normalizeMarketingPublicContentLocale(body.locale);

  if (!isMarketingPublicContentEditableKey(messageKey)) {
    logMarketingPublicContentSaveResult({
      result: "validation_error",
      messageKeyPrefix,
      locale,
      surface: "(disallowed)",
      actorPrefix,
    });

    return NextResponse.json(
      {
        error: "Key is not allowlisted for marketing overrides",
        code: "key_not_allowed",
      },
      { status: 400, ...noStoreJsonInit },
    );
  }

  const def = getMarketingPublicContentKeyDef(messageKey);

  if (!def) {
    logMarketingPublicContentSaveResult({
      result: "validation_error",
      messageKeyPrefix,
      locale,
      surface: "(missing_def)",
      actorPrefix,
    });

    return NextResponse.json(
      {
        error: "Marketing override key definition not found",
        code: "key_definition_missing",
      },
      { status: 400, ...noStoreJsonInit },
    );
  }

  logMarketingPublicContentSaveAttempt({
    messageKeyPrefix,
    locale,
    surface: def.surface,
    actorPrefix,
  });

  if (body.action === "reset") {
    try {
      const existing = await prisma.marketingPublicContentOverride.findUnique({
        where: {
          messageKey_locale: {
            messageKey,
            locale,
          },
        },
        select: { value: true },
      });

      await prisma.marketingPublicContentOverride.deleteMany({
        where: {
          messageKey,
          locale,
        },
      });

      await prisma.marketingPublicContentOverrideRevision.create({
        data: {
          messageKey,
          locale,
          value: existing?.value ?? "",
          action: "reset",
          actorUserId: admin.userId,
        },
      });
    } catch (e) {
      logMarketingPublicContentSaveResult({
        result: "db_error",
        messageKeyPrefix,
        locale,
        surface: def.surface,
        actorPrefix,
        detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
      });

      return NextResponse.json(
        { error: "Database error", code: "db_error" },
        { status: 500, ...noStoreJsonInit },
      );
    }

    try {
      revalidateTag(MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG, "default");
      revalidateTag(marketingPublicContentOverrideLocaleTag(locale), "default");
      revalidateAfterMutation(locale, messageKey);
    } catch (e) {
      logMarketingPublicContentSaveResult({
        result: "revalidate_error",
        messageKeyPrefix,
        locale,
        surface: def.surface,
        actorPrefix,
        detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
      });

      return NextResponse.json(
        {
          error: "Saved but cache revalidation failed",
          code: "revalidate_failed",
        },
        { status: 500, ...noStoreJsonInit },
      );
    }

    logMarketingPublicContentSaveResult({
      result: "ok",
      messageKeyPrefix,
      locale,
      surface: def.surface,
      actorPrefix,
    });

    return NextResponse.json(
      {
        ok: true,
        action: "reset",
        messageKey,
        locale,
      },
      noStoreJsonInit,
    );
  }

  if (body.action === "discard_draft") {
    try {
      await prisma.marketingPublicContentOverride.updateMany({
        where: { messageKey, locale },
        data: { draftValue: null },
      });

      await prisma.marketingPublicContentOverrideRevision.create({
        data: {
          messageKey,
          locale,
          value: "",
          action: "discard_draft",
          actorUserId: admin.userId,
        },
      });
    } catch (e) {
      logMarketingPublicContentSaveResult({
        result: "db_error",
        messageKeyPrefix,
        locale,
        surface: def.surface,
        actorPrefix,
        detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
      });
      return NextResponse.json({ error: "Database error", code: "db_error" }, { status: 500, ...noStoreJsonInit });
    }

    try {
      revalidateTag(MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG, "default");
      revalidateTag(marketingPublicContentOverrideLocaleTag(locale), "default");
    } catch {
      /* non-fatal */
    }

    return NextResponse.json({ ok: true, action: "discard_draft", messageKey, locale }, noStoreJsonInit);
  }

  if (body.action === "save_draft") {
    const trimmed = body.value.trim();
    if (!trimmed) {
      /** Empty draft clears staging (same as discard). */
      try {
        await prisma.marketingPublicContentOverride.updateMany({
          where: { messageKey, locale },
          data: { draftValue: null },
        });
      } catch {
        /* ignore */
      }
      return NextResponse.json({ ok: true, action: "save_draft", messageKey, locale, cleared: true }, noStoreJsonInit);
    }

    try {
      assertMarketingOverrideSeoGuards(messageKey, trimmed, def);
    } catch (e) {
      logMarketingPublicContentSaveResult({
        result: "validation_error",
        messageKeyPrefix,
        locale,
        surface: def.surface,
        actorPrefix,
        detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
      });
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Validation failed", code: "text_invalid" },
        { status: 400, ...noStoreJsonInit },
      );
    }

    try {
      const existing = await prisma.marketingPublicContentOverride.findUnique({
        where: { messageKey_locale: { messageKey, locale } },
      });

      if (!existing) {
        await prisma.marketingPublicContentOverride.create({
          data: {
            messageKey,
            locale,
            surface: def.surface,
            value: "",
            draftValue: trimmed,
            previousValue: null,
            isPublished: false,
            publishedAt: null,
            updatedByUserId: admin.userId,
          },
        });
      } else {
        await prisma.marketingPublicContentOverride.update({
          where: { messageKey_locale: { messageKey, locale } },
          data: {
            draftValue: trimmed,
            surface: def.surface,
            updatedByUserId: admin.userId,
          },
        });
      }

      await prisma.marketingPublicContentOverrideRevision.create({
        data: {
          messageKey,
          locale,
          value: trimmed,
          action: "save_draft",
          actorUserId: admin.userId,
        },
      });
    } catch (e) {
      logMarketingPublicContentSaveResult({
        result: "db_error",
        messageKeyPrefix,
        locale,
        surface: def.surface,
        actorPrefix,
        detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
      });
      return NextResponse.json({ error: "Database error", code: "db_error" }, { status: 500, ...noStoreJsonInit });
    }

    return NextResponse.json({ ok: true, action: "save_draft", messageKey, locale }, noStoreJsonInit);
  }

  if (body.action === "publish_draft") {
    let nextValue = "";
    try {
      const row = await prisma.marketingPublicContentOverride.findUnique({
        where: { messageKey_locale: { messageKey, locale } },
      });
      nextValue = (row?.draftValue ?? "").trim();
      if (!nextValue) {
        return NextResponse.json(
          { error: "No draft to publish", code: "no_draft" },
          { status: 400, ...noStoreJsonInit },
        );
      }
      assertMarketingOverrideSeoGuards(messageKey, nextValue, def);

      await prisma.marketingPublicContentOverride.upsert({
        where: { messageKey_locale: { messageKey, locale } },
        create: {
          messageKey,
          locale,
          surface: def.surface,
          value: nextValue,
          draftValue: null,
          previousValue: null,
          isPublished: true,
          publishedAt: new Date(),
          updatedByUserId: admin.userId,
        },
        update: {
          previousValue: row?.value ?? null,
          value: nextValue,
          draftValue: null,
          surface: def.surface,
          isPublished: true,
          publishedAt: new Date(),
          updatedByUserId: admin.userId,
        },
      });

      await prisma.marketingPublicContentOverrideRevision.create({
        data: {
          messageKey,
          locale,
          value: nextValue,
          action: "publish_draft",
          actorUserId: admin.userId,
        },
      });
    } catch (e) {
      logMarketingPublicContentSaveResult({
        result: "db_error",
        messageKeyPrefix,
        locale,
        surface: def.surface,
        actorPrefix,
        detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
      });
      return NextResponse.json({ error: "Database error", code: "db_error" }, { status: 500, ...noStoreJsonInit });
    }

    try {
      revalidateTag(MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG, "default");
      revalidateTag(marketingPublicContentOverrideLocaleTag(locale), "default");
      revalidateAfterMutation(locale, messageKey);
    } catch (e) {
      logMarketingPublicContentSaveResult({
        result: "revalidate_error",
        messageKeyPrefix,
        locale,
        surface: def.surface,
        actorPrefix,
        detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
      });
      return NextResponse.json(
        { error: "Saved but cache revalidation failed", code: "revalidate_failed" },
        { status: 500, ...noStoreJsonInit },
      );
    }

    return NextResponse.json({ ok: true, action: "publish_draft", messageKey, locale }, noStoreJsonInit);
  }

  /** Immediate publish (legacy inline editor). */
  const publishedValue = body.value.trim();
  if (!publishedValue) {
    return NextResponse.json(
      { error: "Published text cannot be empty. Use Revert to default to clear an override.", code: "empty_value" },
      { status: 400, ...noStoreJsonInit },
    );
  }

  try {
    assertMarketingOverrideSeoGuards(messageKey, publishedValue, def);
  } catch (e) {
    logMarketingPublicContentSaveResult({
      result: "validation_error",
      messageKeyPrefix,
      locale,
      surface: def.surface,
      actorPrefix,
      detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
    });

    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Validation failed",
        code: "text_invalid",
      },
      { status: 400, ...noStoreJsonInit },
    );
  }

  try {
    const existing = await prisma.marketingPublicContentOverride.findUnique({
      where: {
        messageKey_locale: {
          messageKey,
          locale,
        },
      },
      select: { value: true },
    });

    await prisma.marketingPublicContentOverride.upsert({
      where: {
        messageKey_locale: {
          messageKey,
          locale,
        },
      },
      create: {
        messageKey,
        locale,
        surface: def.surface,
        value: publishedValue,
        draftValue: null,
        previousValue: null,
        isPublished: true,
        publishedAt: new Date(),
        updatedByUserId: admin.userId,
      },
      update: {
        value: publishedValue,
        draftValue: null,
        previousValue: existing?.value ?? null,
        surface: def.surface,
        isPublished: true,
        publishedAt: new Date(),
        updatedByUserId: admin.userId,
      },
    });

    await prisma.marketingPublicContentOverrideRevision.create({
      data: {
        messageKey,
        locale,
        value: publishedValue,
        action: "upsert",
        actorUserId: admin.userId,
      },
    });
  } catch (e) {
    logMarketingPublicContentSaveResult({
      result: "db_error",
      messageKeyPrefix,
      locale,
      surface: def.surface,
      actorPrefix,
      detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
    });

    return NextResponse.json(
      { error: "Database error", code: "db_error" },
      { status: 500, ...noStoreJsonInit },
    );
  }

  try {
    revalidateTag(MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG, "default");
    revalidateTag(marketingPublicContentOverrideLocaleTag(locale), "default");
    revalidateAfterMutation(locale, messageKey);
  } catch (e) {
    logMarketingPublicContentSaveResult({
      result: "revalidate_error",
      messageKeyPrefix,
      locale,
      surface: def.surface,
      actorPrefix,
      detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
    });

    return NextResponse.json(
      {
        error: "Saved but cache revalidation failed",
        code: "revalidate_failed",
      },
      { status: 500, ...noStoreJsonInit },
    );
  }

  logMarketingPublicContentSaveResult({
    result: "ok",
    messageKeyPrefix,
    locale,
    surface: def.surface,
    actorPrefix,
  });

  return NextResponse.json(
    {
      ok: true,
      action: "upsert",
      messageKey,
      locale,
    },
    noStoreJsonInit,
  );
}
