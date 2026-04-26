import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import {
  assertPlainMarketingOverrideText,
  getMarketingPublicContentKeyDef,
  isMarketingPublicContentEditableKey,
  normalizeMarketingPublicContentLocale,
} from "@/lib/marketing/marketing-public-content-policy";
import {
  MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG,
  marketingPublicContentOverrideLocaleTag,
} from "@/lib/marketing/load-marketing-public-content-overrides";
import {
  logMarketingPublicContentSaveAttempt,
  logMarketingPublicContentSaveResult,
} from "@/lib/marketing/marketing-public-content-observability";

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

const bodySchema = z.discriminatedUnion("action", [upsertSchema, resetSchema]);

function revalidateSurfacesForKey(locale: string, messageKey: string): void {
  const def = getMarketingPublicContentKeyDef(messageKey);
  if (!def) return;

  const loc = normalizeMarketingPublicContentLocale(locale);

  try {
    if (def.surface === "home" || def.surface === "registry") {
      revalidatePath("/");
      if (loc !== "en") revalidatePath(`/${loc}`);
    }

    if (def.surface === "pricing") {
      revalidatePath("/pricing");
      if (loc !== "en") revalidatePath(`/${loc}/pricing`);
    }
  } catch {
    // revalidatePath can throw in some contexts; tag invalidation still applies.
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
      revalidateTag(MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG);
      revalidateTag(marketingPublicContentOverrideLocaleTag(locale));
      revalidateSurfacesForKey(locale, messageKey);
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

  try {
    assertPlainMarketingOverrideText(body.value, def.maxLen);
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
        value: body.value,
        previousValue: null,
        isPublished: true,
        updatedByUserId: admin.userId,
      },
      update: {
        value: body.value,
        previousValue: existing?.value ?? null,
        surface: def.surface,
        isPublished: true,
        updatedByUserId: admin.userId,
      },
    });

    await prisma.marketingPublicContentOverrideRevision.create({
      data: {
        messageKey,
        locale,
        value: body.value,
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
    revalidateTag(MARKETING_PUBLIC_CONTENT_OVERRIDE_CACHE_TAG);
    revalidateTag(marketingPublicContentOverrideLocaleTag(locale));
    revalidateSurfacesForKey(locale, messageKey);
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
