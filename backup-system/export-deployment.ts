import fs from "fs";
import path from "path";
import { logBackup } from "./backup-logger";

const ROOT = path.resolve(import.meta.dirname, "..");

const DEPLOYMENT_DIRS = [
  "client",
  "server",
  "shared",
  "script",
  "scripts",
  "public",
  "migrations",
  "backup-system",
];

const DEPLOYMENT_FILES = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "drizzle.config.ts",
  "vite.config.ts",
  "postcss.config.js",
  "components.json",
  "vite-plugin-meta-images.ts",
  "gen_sw.js",
];

const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".cache",
  "dist",
  ".git",
  ".local",
  "backups",
  "exports",
]);

function copyDirRecursive(src: string, dest: string, fileCount: { count: number }, errors: string[]) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, fileCount, errors);
    } else {
      try {
        fs.copyFileSync(srcPath, destPath);
        fileCount.count++;
      } catch (err: any) {
        errors.push(`Failed to copy ${srcPath}: ${err.message}`);
      }
    }
  }
}

const DEPLOYMENT_README = `# NurseNest Deployment Guide

## Prerequisites
- Node.js 20+ installed
- PostgreSQL 15+ database available
- npm or yarn package manager

## Step-by-Step Restore Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
Copy \`.env.example\` to \`.env\` and fill in all required values:
\`\`\`bash
cp .env.example .env
# Edit .env with your actual values
\`\`\`

### 3. Set Up the Database
Ensure your PostgreSQL database is running and DATABASE_URL is set in \`.env\`.

Run database migrations:
\`\`\`bash
npx drizzle-kit push
\`\`\`

### 4. Build the Application
\`\`\`bash
npm run build
\`\`\`

### 5. Start the Application
\`\`\`bash
npm run start
\`\`\`

The application will start on the configured port (default: 5000).

## Environment Variables
See \`.env.example\` for a complete list of required environment variables.

## Database
- Uses PostgreSQL with Drizzle ORM
- Schema defined in \`shared/schema.ts\`
- Migrations stored in \`migrations/\`

## Directory Structure
- \`client/\` - React frontend (Vite)
- \`server/\` - Express.js backend
- \`shared/\` - Shared types and schemas
- \`migrations/\` - Database migrations
- \`public/\` - Static assets

## Troubleshooting
- If the build fails, ensure Node.js 20+ is installed
- If database errors occur, verify DATABASE_URL and run migrations
- Check that all environment variables in .env.example are configured
`;

export async function runDeploymentExport(): Promise<{
  outputDir: string;
  fileCount: number;
  timestamp: string;
}> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputDir = path.join(ROOT, "exports", "deployment", timestamp);
  fs.mkdirSync(outputDir, { recursive: true });

  const fileCount = { count: 0 };
  const errors: string[] = [];

  for (const dir of DEPLOYMENT_DIRS) {
    const srcDir = path.join(ROOT, dir);
    if (fs.existsSync(srcDir)) {
      copyDirRecursive(srcDir, path.join(outputDir, dir), fileCount, errors);
    }
  }

  for (const file of DEPLOYMENT_FILES) {
    const srcPath = path.join(ROOT, file);
    if (fs.existsSync(srcPath)) {
      try {
        fs.copyFileSync(srcPath, path.join(outputDir, file));
        fileCount.count++;
      } catch (err: any) {
        errors.push(`Failed to copy ${srcPath}: ${err.message}`);
      }
    }
  }

  const envExampleSrc = path.join(ROOT, ".env.example");
  if (fs.existsSync(envExampleSrc)) {
    fs.copyFileSync(envExampleSrc, path.join(outputDir, ".env.example"));
    fileCount.count++;
  }

  fs.writeFileSync(path.join(outputDir, "DEPLOYMENT_README.md"), DEPLOYMENT_README);
  fileCount.count++;

  const status = errors.length > 0 ? "partial" : "success";

  await logBackup({
    type: "deployment",
    timestamp: new Date().toISOString(),
    archivePath: outputDir,
    size: 0,
    fileCount: fileCount.count,
    status,
  });

  return { outputDir, fileCount: fileCount.count, timestamp: new Date().toISOString(), errors };
}

if (process.argv[1] && process.argv[1].includes("export-deployment")) {
  runDeploymentExport()
    .then((result) => {
      console.log("Deployment export completed:");
      console.log(`  Output: ${result.outputDir}`);
      console.log(`  Files: ${result.fileCount}`);
      console.log(`  Timestamp: ${result.timestamp}`);
    })
    .catch((err) => {
      console.error("Deployment export failed:", err);
      process.exit(1);
    });
}
