import fs from "fs";
import path from "path";
import pg from "pg";

const PROJECT_ROOT = path.resolve(process.cwd());

export interface ManifestResult {
  timestamp: string;
  envManifest: { name: string; description: string; required: boolean; hasValue: boolean }[];
  stripeConfig: any;
  assetInventory: { type: string; count: number; details: any[] }[];
  criticalFiles: { path: string; exists: boolean; sizeBytes: number }[];
}

const ENV_DESCRIPTIONS: Record<string, { description: string; required: boolean }> = {
  DATABASE_URL: { description: "PostgreSQL database connection string", required: true },
  STRIPE_SECRET_KEY: { description: "Stripe secret API key for payment processing", required: true },
  STRIPE_PUBLISHABLE_KEY: { description: "Stripe publishable key for client-side payment", required: true },
  VITE_STRIPE_PUBLIC_KEY: { description: "Stripe public key exposed to Vite frontend", required: false },
  STRIPE_WEBHOOK_SECRET: { description: "Stripe webhook signing secret for event verification", required: true },
  AI_INTEGRATIONS_OPENAI_API_KEY: { description: "OpenAI API key for AI content generation", required: false },
  AI_INTEGRATIONS_OPENAI_BASE_URL: { description: "OpenAI API base URL", required: false },
  RESEND_API_KEY: { description: "Resend API key for transactional email delivery", required: false },
  TWILIO_ACCOUNT_SID: { description: "Twilio account SID for SMS notifications", required: false },
  TWILIO_AUTH_TOKEN: { description: "Twilio auth token for SMS API authentication", required: false },
  TWILIO_PHONE_NUMBER: { description: "Twilio phone number for sending SMS", required: false },
  SESSION_SECRET: { description: "Express session signing secret", required: true },
  ADMIN_SECRET: { description: "Admin authentication secret key", required: true },
  TEST_DATABASE_URL: { description: "Test database URL for restore dry-runs", required: false },
  REPL_ID: { description: "Replit project ID (auto-set)", required: false },
  REPL_SLUG: { description: "Replit project slug (auto-set)", required: false },
  REPLIT_DEPLOYMENT: { description: "Deployment flag (1 = production)", required: false },
  NODE_ENV: { description: "Node.js environment (development/production)", required: false },
  PUBLIC_OBJECT_SEARCH_PATHS: { description: "Object storage public search paths", required: false },
  PRIVATE_OBJECT_DIR: { description: "Object storage private directory path", required: false },
};

export async function generateManifests(): Promise<ManifestResult> {
  const timestamp = new Date().toISOString();

  const envManifest = generateEnvManifest();
  const stripeConfig = await exportStripeConfig();
  const assetInventory = await generateAssetInventory();
  const criticalFiles = generateCriticalFileInventory();

  const outputDir = path.join(PROJECT_ROOT, "backups", "manifests");
  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, "env-manifest.json"),
    JSON.stringify({ timestamp, variables: envManifest }, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "stripe-config.json"),
    JSON.stringify({ timestamp, config: stripeConfig }, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "asset-inventory.json"),
    JSON.stringify({ timestamp, assets: assetInventory }, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "critical-files.json"),
    JSON.stringify({ timestamp, files: criticalFiles }, null, 2)
  );

  return { timestamp, envManifest, stripeConfig, assetInventory, criticalFiles };
}

function generateEnvManifest(): ManifestResult["envManifest"] {
  const manifest: ManifestResult["envManifest"] = [];

  for (const [name, meta] of Object.entries(ENV_DESCRIPTIONS)) {
    manifest.push({
      name,
      description: meta.description,
      required: meta.required,
      hasValue: !!process.env[name],
    });
  }

  for (const key of Object.keys(process.env)) {
    if (!ENV_DESCRIPTIONS[key] && !key.startsWith("npm_") && !key.startsWith("__") && !key.startsWith("HOME") && !key.startsWith("PATH") && !key.startsWith("SHELL")) {
      if (key.includes("KEY") || key.includes("SECRET") || key.includes("TOKEN") || key.includes("URL") || key.includes("STRIPE") || key.includes("REPLIT") || key.includes("REPL_")) {
        manifest.push({
          name: key,
          description: "Auto-detected environment variable",
          required: false,
          hasValue: true,
        });
      }
    }
  }

  return manifest;
}

async function exportStripeConfig(): Promise<any> {
  try {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

    const products = await pool.query(
      `SELECT id, name, description, active, metadata FROM stripe_products ORDER BY created_at DESC LIMIT 100`
    ).catch(() => ({ rows: [] }));

    const prices = await pool.query(
      `SELECT id, product_id, unit_amount, currency, type, recurring_interval, active, metadata FROM stripe_prices ORDER BY created_at DESC LIMIT 200`
    ).catch(() => ({ rows: [] }));

    const subscriptions = await pool.query(
      `SELECT status, COUNT(*)::int AS count FROM stripe_subscriptions GROUP BY status`
    ).catch(() => ({ rows: [] }));

    await pool.end();

    return {
      products: products.rows,
      prices: prices.rows,
      subscriptionSummary: subscriptions.rows,
      exportedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return { error: err.message, exportedAt: new Date().toISOString() };
  }
}

async function generateAssetInventory(): Promise<ManifestResult["assetInventory"]> {
  const inventory: ManifestResult["assetInventory"] = [];

  try {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

    const images = await pool.query(`SELECT COUNT(*)::int AS cnt FROM image_assets`).catch(() => ({ rows: [{ cnt: 0 }] }));
    const questions = await pool.query(`SELECT COUNT(*)::int AS cnt FROM exam_questions`).catch(() => ({ rows: [{ cnt: 0 }] }));
    const lessons = await pool.query(`SELECT COUNT(*)::int AS cnt FROM lessons`).catch(() => ({ rows: [{ cnt: 0 }] }));
    const flashcardDecks = await pool.query(`SELECT COUNT(*)::int AS cnt FROM flashcard_decks`).catch(() => ({ rows: [{ cnt: 0 }] }));
    const flashcards = await pool.query(`SELECT COUNT(*)::int AS cnt FROM deck_flashcards`).catch(() => ({ rows: [{ cnt: 0 }] }));
    const users = await pool.query(`SELECT COUNT(*)::int AS cnt FROM users`).catch(() => ({ rows: [{ cnt: 0 }] }));
    const blogs = await pool.query(`SELECT COUNT(*)::int AS cnt FROM content_items`).catch(() => ({ rows: [{ cnt: 0 }] }));

    inventory.push(
      { type: "image_assets", count: images.rows[0]?.cnt || 0, details: [] },
      { type: "exam_questions", count: questions.rows[0]?.cnt || 0, details: [] },
      { type: "lessons", count: lessons.rows[0]?.cnt || 0, details: [] },
      { type: "flashcard_decks", count: flashcardDecks.rows[0]?.cnt || 0, details: [] },
      { type: "deck_flashcards", count: flashcards.rows[0]?.cnt || 0, details: [] },
      { type: "users", count: users.rows[0]?.cnt || 0, details: [] },
      { type: "content_items", count: blogs.rows[0]?.cnt || 0, details: [] },
    );

    await pool.end();
  } catch {}

  return inventory;
}

function generateCriticalFileInventory(): ManifestResult["criticalFiles"] {
  const criticalPaths = [
    "server/routes.ts",
    "server/storage.ts",
    "server/platform-resilience.ts",
    "server/stripeClient.ts",
    "server/admin-auth.ts",
    "server/backup-routes.ts",
    "shared/schema.ts",
    "client/src/App.tsx",
    "client/index.html",
    "package.json",
    "tsconfig.json",
    "drizzle.config.ts",
    ".replit",
    "replit.nix",
  ];

  return criticalPaths.map(p => {
    const fullPath = path.join(PROJECT_ROOT, p);
    const exists = fs.existsSync(fullPath);
    let sizeBytes = 0;
    if (exists) {
      try {
        sizeBytes = fs.statSync(fullPath).size;
      } catch {}
    }
    return { path: p, exists, sizeBytes };
  });
}

if (process.argv[1] && process.argv[1].includes("generate-manifests")) {
  generateManifests()
    .then((result) => {
      console.log("\nManifest Generation Report");
      console.log("=".repeat(50));
      console.log(`  Environment variables: ${result.envManifest.length}`);
      console.log(`  Required vars with values: ${result.envManifest.filter(v => v.required && v.hasValue).length}/${result.envManifest.filter(v => v.required).length}`);
      console.log(`  Asset types: ${result.assetInventory.length}`);
      console.log(`  Critical files: ${result.criticalFiles.filter(f => f.exists).length}/${result.criticalFiles.length} present`);
      console.log(`  Stripe products: ${result.stripeConfig?.products?.length || 0}`);
    })
    .catch((err) => {
      console.error("Manifest generation failed:", err);
      process.exit(1);
    });
}
