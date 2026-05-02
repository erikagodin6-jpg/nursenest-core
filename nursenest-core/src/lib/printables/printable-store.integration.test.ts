import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { PrintableAccessSource, PrintableDownloadSource } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getPrintableAnalyticsSummary, getPrintableProductAnalytics } from "@/lib/printables/printable-analytics.server";
import { userHasPaidPrintableAccess } from "@/lib/printables/printable-entitlement";

async function integrationDbAvailable(): Promise<boolean> {
  try {
    await prisma.printableProduct.count();
    return true;
  } catch {
    return false;
  }
}

test(
  "printable analytics aggregates download counts and sources (DB)",
  { timeout: 30_000 },
  async (t) => {
    if (!(await integrationDbAvailable())) {
      t.skip("printable_products / DB unavailable");
      return;
    }

    const suffix = randomBytes(8).toString("hex");
    const fileAsset = await prisma.mediaAsset.create({
      data: {
        publicUrl: `https://test.invalid/printable-int-${suffix}.pdf`,
        storageKey: `printable-int/${suffix}.pdf`,
        filename: `doc-${suffix}.pdf`,
        mimeType: "application/pdf",
        kind: "pdf",
        fileSizeBytes: 12,
      },
    });

    const product = await prisma.printableProduct.create({
      data: {
        slug: `int-${suffix}`,
        title: `Integration ${suffix}`,
        description: "test",
        category: "test",
        pathwayId: "all",
        roleTrack: "rn",
        fileAssetId: fileAsset.id,
        isFree: true,
        isPremiumIncluded: false,
        priceCents: 0,
        isPublished: true,
        version: 1,
      },
    });

    try {
      await prisma.printableDownloadEvent.createMany({
        data: [
          {
            printableProductId: product.id,
            userId: null,
            pathwayId: "all",
            source: PrintableDownloadSource.LEARNER,
          },
          {
            printableProductId: product.id,
            userId: null,
            pathwayId: "all",
            source: PrintableDownloadSource.LEARNER,
          },
          {
            printableProductId: product.id,
            userId: null,
            pathwayId: null,
            source: PrintableDownloadSource.ADMIN_PREVIEW,
          },
        ],
      });

      const per = await getPrintableProductAnalytics(product.id);
      assert.equal(per.totalDownloads, 3);
      assert.equal(per.uniqueUsersDownloaded, 0);
      assert.equal(per.downloadsBySource.LEARNER, 2);
      assert.equal(per.downloadsBySource.ADMIN_PREVIEW, 1);

      const sum = await getPrintableAnalyticsSummary();
      assert.ok(sum.totalDownloads >= 3);
      assert.ok(Array.isArray(sum.downloadsByDay));
      assert.ok(sum.downloadsByDay.length >= 1);
      assert.ok(sum.mostDownloaded.some((m) => m.printableProductId === product.id));
    } finally {
      await prisma.printableDownloadEvent.deleteMany({ where: { printableProductId: product.id } });
      await prisma.printableProduct.delete({ where: { id: product.id } });
      await prisma.mediaAsset.delete({ where: { id: fileAsset.id } });
    }
  },
);

test(
  "userHasPaidPrintableAccess reflects PrintableAccess rows (DB)",
  { timeout: 30_000 },
  async (t) => {
    if (!(await integrationDbAvailable())) {
      t.skip("printable_products / DB unavailable");
      return;
    }

    const user = await prisma.user.findFirst({ select: { id: true } });
    if (!user) {
      t.skip("no users row for access test");
      return;
    }

    const suffix = randomBytes(8).toString("hex");
    const fileAsset = await prisma.mediaAsset.create({
      data: {
        publicUrl: `https://test.invalid/printable-acc-${suffix}.pdf`,
        storageKey: `printable-acc/${suffix}.pdf`,
        filename: `acc-${suffix}.pdf`,
        mimeType: "application/pdf",
        kind: "pdf",
        fileSizeBytes: 10,
      },
    });

    const product = await prisma.printableProduct.create({
      data: {
        slug: `acc-${suffix}`,
        title: `Access ${suffix}`,
        description: "test",
        category: "test",
        pathwayId: "all",
        roleTrack: "rn",
        fileAssetId: fileAsset.id,
        isFree: false,
        isPremiumIncluded: false,
        priceCents: 100,
        isPublished: true,
        version: 1,
      },
    });

    try {
      assert.equal(await userHasPaidPrintableAccess(user.id, product.id), false);
      await prisma.printableAccess.create({
        data: {
          printableProductId: product.id,
          userId: user.id,
          source: PrintableAccessSource.PURCHASE,
        },
      });
      assert.equal(await userHasPaidPrintableAccess(user.id, product.id), true);
    } finally {
      await prisma.printableAccess.deleteMany({ where: { printableProductId: product.id } });
      await prisma.printableProduct.delete({ where: { id: product.id } });
      await prisma.mediaAsset.delete({ where: { id: fileAsset.id } });
    }
  },
);
