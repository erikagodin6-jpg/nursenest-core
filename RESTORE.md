# NurseNest Restore & Recovery Guide

## Overview

This document provides step-by-step instructions for restoring NurseNest from a backup. The backup system produces component-level backups (database, content, assets, code, environment config, Stripe mappings, object storage inventory) that can be restored independently or together.

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ database accessible
- npm package manager
- Access to backup files (in `backups/` directory or downloaded archive)
- Stripe account credentials (for payment functionality)
- OpenAI API key (for AI features, optional)

## Backup Directory Structure

```
backups/
├── db/                          # Database dumps (SQL or JSON)
│   └── <timestamp>/
│       ├── database-full.sql    # Full pg_dump (if available)
│       ├── tables/              # JSON table exports (fallback)
│       ├── db-manifest.json     # Table structure and row counts
│       ├── checksums.json       # SHA-256 checksums
│       ├── schema.ts            # Drizzle schema snapshot
│       └── migrations/          # Migration SQL files
├── content/                     # Content table exports
│   └── <timestamp>/
│       ├── content_items.json
│       ├── exam_questions.json
│       ├── flashcard_decks.json
│       ├── ... (all content tables)
│       ├── content-manifest.json
│       └── checksums.json
├── assets/                      # Static assets
│   └── <timestamp>/
│       ├── public/
│       ├── attached_assets/
│       └── translations/
├── stripe/                      # Stripe product/price snapshots
│   └── <timestamp>/
│       ├── stripe-products.json
│       ├── stripe-prices.json
│       ├── stripe-price-map.json
│       └── stripe-subscriptions.json
├── object-storage/              # GCS bucket inventory
│   └── <timestamp>/
│       └── object-storage-inventory.json
├── env-inventory/               # Environment variable checklist
│   └── <timestamp>/
│       └── env-inventory.json
├── render/                      # Built dist/ payload
│   └── <timestamp>/
│       ├── dist/
│       └── render-manifest.json
├── code/                        # Source code archives
│   ├── nursenest-source-<ts>.tar.gz
│   └── nursenest-source-<ts>.tar.gz.sha256
└── logs/
    └── backup-history.json
```

## Step-by-Step Recovery

### Step 1: Verify Backup Integrity

Before restoring, verify the backup is complete and uncorrupted:

```bash
npx tsx backup-system/backup-verify.ts [path-to-backups]
```

Or via API (if server is running):
```bash
curl -X POST http://localhost:5000/api/admin/backup/verify \
  -H "Content-Type: application/json"
```

This checks:
- All required components are present
- SHA-256 checksums match for all files
- Content manifest row counts match exported data

### Step 2: Extract Code Archive (if restoring from scratch)

If restoring to a new environment:

```bash
tar xzf backups/code/nursenest-source-<timestamp>.tar.gz
cd <extracted-directory>
npm install
```

Verify the archive checksum:
```bash
sha256sum -c backups/code/nursenest-source-<timestamp>.tar.gz.sha256
```

### Step 3: Set Up Environment Variables

Generate a `.env` template from the backup inventory:

```bash
npx tsx backup-system/restore-config.ts
```

This creates `.env.restored` with all variable names categorized. Edit it:

1. Fill in `DATABASE_URL` with your PostgreSQL connection string
2. Set `SESSION_SECRET` to a new random string (32+ characters)
3. Configure Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`)
4. Set `OPENAI_API_KEY` if using AI features
5. Configure email settings (`SMTP_HOST`, etc.) if applicable
6. Rename `.env.restored` to `.env`

Use `--dry-run` to preview without writing files:
```bash
npx tsx backup-system/restore-config.ts --dry-run
```

### Step 4: Restore Database

#### Option A: From SQL Dump (preferred)

```bash
npx tsx backup-system/restore-db.ts
```

This automatically finds the latest backup and restores via `psql`. Preview first:

```bash
npx tsx backup-system/restore-db.ts --dry-run
```

#### Option B: From Migrations + Content

If no SQL dump is available:

```bash
# Apply schema migrations
npx drizzle-kit push

# Then restore content
npx tsx backup-system/restore-content.ts
```

#### Option C: Manual SQL Import

```bash
psql $DATABASE_URL < backups/db/<timestamp>/database-full.sql
```

### Step 5: Restore Content Data

If you used Option A above, content is already included in the SQL dump. Otherwise:

```bash
npx tsx backup-system/restore-content.ts
```

Preview first:
```bash
npx tsx backup-system/restore-content.ts --dry-run
```

This imports all content tables: content_items, exam_questions, flashcard_decks, allied_questions, case_studies, imaging_questions, digital_products, lessons, seo_pages, and more.

### Step 6: Restore Static Assets

```bash
npx tsx backup-system/restore-assets.ts
```

Preview first:
```bash
npx tsx backup-system/restore-assets.ts --dry-run
```

### Step 7: Stripe Reconfiguration

The Stripe backup contains product/price mappings but **does not** contain Stripe secret keys or webhook secrets. You must:

1. Log into your Stripe Dashboard
2. Verify the products and prices match `backups/stripe/<timestamp>/stripe-products.json`
3. If products are missing, recreate them in Stripe
4. Update `stripe-price-map.json` in the project root with current price IDs
5. Configure webhook endpoint pointing to your new deployment URL:
   - Endpoint: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
6. Set `STRIPE_WEBHOOK_SECRET` in `.env`

### Step 8: Object Storage Reconnection

If using Replit Object Storage:

1. Review the inventory at `backups/object-storage/<timestamp>/object-storage-inventory.json`
2. Set `PUBLIC_OBJECT_SEARCH_PATHS` and `PRIVATE_OBJECT_DIR` in `.env`
3. If files were downloaded locally during backup, upload them back to the storage bucket

### Step 9: Build and Start

```bash
npm run build
npm run start
```

### Step 10: Verify Deployment

Run the restore test to validate everything is working:

```bash
npx tsx backup-system/restore-test.ts
```

Manual verification checklist:

- [ ] Application starts without errors on port 5000
- [ ] GET `/api/health` returns 200
- [ ] Login/registration works
- [ ] Content pages load (lessons, question banks, flashcards)
- [ ] Stripe checkout flow works (test mode)
- [ ] AI tutor responds (if OpenAI configured)
- [ ] Translations load correctly
- [ ] SEO pages render (sitemap.xml, robots.txt)
- [ ] Admin dashboard accessible

## Using the Render Payload for Fast Rollback

If you need to quickly rollback to a known-good build without rebuilding:

```bash
cp -r backups/render/<timestamp>/dist/ dist/
npm run start
```

## Restore via Admin API

All restore operations can also be triggered via the admin API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/backup/full` | POST | Run full backup |
| `/api/admin/backup/db` | POST | Database backup only |
| `/api/admin/backup/content` | POST | Content export only |
| `/api/admin/backup/assets` | POST | Assets backup only |
| `/api/admin/backup/stripe` | POST | Stripe snapshot |
| `/api/admin/backup/object-storage` | POST | Object storage inventory |
| `/api/admin/backup/env-inventory` | POST | Environment variable audit |
| `/api/admin/backup/render` | POST | Render payload backup |
| `/api/admin/backup/code-archive` | POST | Source code archive |
| `/api/admin/backup/verify` | POST | Verify backup integrity |
| `/api/admin/backup/retention` | POST | Run retention cleanup |
| `/api/admin/backup/restore-test` | POST | Non-destructive restore test |
| `/api/admin/backup/history` | GET | Backup history |
| `/api/admin/backup/latest` | GET | Latest backup info |
| `/api/admin/backup/download` | GET | Download latest archive |
| `/api/admin/backup/status` | GET | Backup system status |

## Retention Policy

The backup system automatically keeps the last 7 backups per component type and removes older ones. Retention is enforced at the end of each full backup run.

To manually trigger retention cleanup:
```bash
npx tsx backup-system/retention.ts [keep-count]
```

## Troubleshooting

### Database restore fails with "relation does not exist"
Run migrations first: `npx drizzle-kit push`

### pg_dump not available
The system automatically falls back to JSON table exports. These can be restored via the content restore script.

### Checksum verification fails
The backup file may be corrupted. Try using an older backup from the same component directory.

### Stripe prices don't match
Products/prices may have been updated in Stripe after the backup. Compare `stripe-price-map.json` with the Stripe Dashboard and update accordingly.

### Content restore shows "table does not exist"
Ensure database migrations have been applied before restoring content.

### Object storage files not accessible
Verify `PUBLIC_OBJECT_SEARCH_PATHS` is correctly configured and the storage bucket exists.

### Session errors after restore
Generate a new `SESSION_SECRET` value. Old sessions will be invalidated.
