import fs from "fs";
import path from "path";
import { PROJECT_ROOT, getTimestamp, ensureDir, computeSHA256, writeChecksumFile, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";

export async function runStripeBackup(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const backupDir = path.join(PROJECT_ROOT, "backups", "stripe", timestamp);
  ensureDir(backupDir);

  const warnings: string[] = [];
  const errors: string[] = [];
  let fileCount = 0;
  const checksums: Record<string, string> = {};

  try {
    const { getUncachableStripeClient } = await import("../server/stripeClient");
    const stripe = await getUncachableStripeClient();

    const products: any[] = [];
    for await (const product of stripe.products.list({ limit: 100, active: true })) {
      products.push({
        id: product.id,
        name: product.name,
        description: product.description,
        active: product.active,
        metadata: product.metadata,
        created: product.created,
        updated: product.updated,
        default_price: product.default_price,
      });
    }
    const productsPath = path.join(backupDir, "stripe-products.json");
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    fileCount++;
    checksums["stripe-products.json"] = computeSHA256(productsPath);

    const prices: any[] = [];
    for await (const price of stripe.prices.list({ limit: 100, active: true })) {
      prices.push({
        id: price.id,
        product: price.product,
        active: price.active,
        currency: price.currency,
        unit_amount: price.unit_amount,
        recurring: price.recurring,
        type: price.type,
        metadata: price.metadata,
        created: price.created,
        nickname: price.nickname,
        lookup_key: price.lookup_key,
      });
    }
    const pricesPath = path.join(backupDir, "stripe-prices.json");
    fs.writeFileSync(pricesPath, JSON.stringify(prices, null, 2));
    fileCount++;
    checksums["stripe-prices.json"] = computeSHA256(pricesPath);

    const priceMap: Record<string, any> = {};
    for (const price of prices) {
      const product = products.find((p: any) => p.id === price.product);
      priceMap[price.id] = {
        priceId: price.id,
        productId: price.product as string,
        productName: product?.name || "unknown",
        currency: price.currency,
        unitAmount: price.unit_amount,
        recurring: price.recurring,
        type: price.type,
        nickname: price.nickname,
      };
    }
    const priceMapPath = path.join(backupDir, "stripe-price-map.json");
    fs.writeFileSync(priceMapPath, JSON.stringify(priceMap, null, 2));
    fileCount++;
    checksums["stripe-price-map.json"] = computeSHA256(priceMapPath);

    let subscriptions: any[] = [];
    try {
      for await (const sub of stripe.subscriptions.list({ limit: 100, status: "active" })) {
        // Stripe SDK typings omit period fields on some narrowed Subscription shapes; backup reads runtime API.
        const s = sub as any;
        subscriptions.push({
          id: sub.id,
          customer: sub.customer,
          status: sub.status,
          current_period_start: s.current_period_start,
          current_period_end: s.current_period_end,
          items: sub.items.data.map((item: any) => ({
            id: item.id,
            price: item.price.id,
            product: item.price.product,
          })),
          created: sub.created,
          cancel_at_period_end: sub.cancel_at_period_end,
        });
      }
    } catch (err: any) {
      warnings.push(`Could not list subscriptions: ${err.message}`);
    }
    if (subscriptions.length > 0) {
      const subsPath = path.join(backupDir, "stripe-subscriptions.json");
      fs.writeFileSync(subsPath, JSON.stringify(subscriptions, null, 2));
      fileCount++;
      checksums["stripe-subscriptions.json"] = computeSHA256(subsPath);
    }

    const manifestPath = path.join(backupDir, "stripe-manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      timestamp,
      products: products.length,
      prices: prices.length,
      subscriptions: subscriptions.length,
      checksums,
    }, null, 2));
    fileCount++;

    const existingPriceMap = path.join(PROJECT_ROOT, "stripe-price-map.json");
    if (fs.existsSync(existingPriceMap)) {
      fs.copyFileSync(existingPriceMap, path.join(backupDir, "stripe-price-map-existing.json"));
      fileCount++;
    }
  } catch (err: any) {
    errors.push(`Stripe backup failed: ${err.message}`);
  }

  const status = errors.length > 0 ? (fileCount > 0 ? "partial" : "failed") : "success";
  const result: BackupResult = {
    timestamp,
    type: "stripe",
    status,
    fileCount,
    archiveSize: 0,
    archivePath: backupDir,
    warnings,
    errors,
    duration: Date.now() - startTime,
    manifest: { checksums },
  };

  await logBackup({
    type: "stripe",
    timestamp: new Date().toISOString(),
    archivePath: backupDir,
    size: 0,
    fileCount,
    status,
  });

  return result;
}

if (process.argv[1] && process.argv[1].includes("backup-stripe")) {
  runStripeBackup()
    .then((result) => {
      console.log("Stripe backup completed:");
      console.log(`  Output: ${result.archivePath}`);
      console.log(`  Files: ${result.fileCount}`);
      console.log(`  Status: ${result.status}`);
    })
    .catch((err) => {
      console.error("Stripe backup failed:", err);
      process.exit(1);
    });
}
