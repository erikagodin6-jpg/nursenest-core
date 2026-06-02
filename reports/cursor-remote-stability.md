# Cursor Remote SSH stability (NurseNest)

## Why this happens

Cursor / VS Code on a remote VM runs a **Node-based server** (under `~/.cursor-server/`). The **`extensionHost`** loads extensions and language services; the **`fileWatcher`** subscribes to filesystem events across the **workspace root**. If that root is too large (for example you opened `/root` instead of the clone) or the repo contains huge generated trees (`node_modules`, `.next`, i18n shards, Playwright output, etc.), the watcher and indexer work **much harder than your app**. The VM can look "healthy" in `htop` while **editor processes** sit at **>100% CPU and >1GB RAM** — that is an **editor / indexing / watch** problem, not NurseNest production capacity.

## Folders that must never be fully indexed or watched

These are excluded via **`.cursorignore`** (Cursor / AI indexing) and **`.vscode/settings.json`** (`files.watcherExclude`, `search.exclude`, and `files.exclude` where safe):

- `node_modules`, `.next`, `.turbo`, `.cache`, `.tmp` (and common `tmp` / `temp`)
- `coverage`, `dist`, build output dirs (`build/`, `nursenest-core/build/`, `client/build/`)
- `playwright-report`, `test-results`, `blob-report`
- `reports` (large JSON reports — still **search/watcher** excluded; keep this doc open via path or terminal if needed)
- `public/i18n` shards (`nursenest-core/public/i18n`, etc.)
- `generated-indexes` trees
- `.prisma`, `prisma/migrations` (many files; use `prisma/schema.prisma` for schema work)
- `logs`, `*.log`

**Do not** widen excludes to `src/`, `app/`, `components/`, `scripts/`, `tests/`, or `prisma/schema.prisma` — those are required for development.

## You must open only the clone root (e.g. `/root/nursenest-core`)

- **Always** use **File → Open Folder** on the **repository root** (the directory that contains this file’s parent `reports/` and `nursenest-core/`).
- **Never** use `/root` (or any parent of many projects) as the workspace folder. Cursor will attach watchers to **everything** under that path.

## Recover when Cursor freezes or spikes CPU/RAM

1. **Reload the window** first: Command Palette → **Developer: Reload Window**.
2. From the clone root, run:

   ```bash
   npm run cursor:recover
   ```

   This script **only SIGTERM** processes whose command line is under **`.cursor-server`** and whose type is **`extensionHost`** or **`fileWatcher`**. It does **not** kill your app `node`/`npm` servers, Prisma CLI in your repo, or other userland tools unless they incorrectly reuse those exact flags (they do not).

   It then clears **safe** caches under `~/.cursor-server/data/` (`CachedExtensionVSIXs`, `CachedData` contents only — not your git clone).

3. **Reconnect** if needed and confirm the opened folder is **`…/nursenest-core`**, not `/root`.

4. **Inspect** before/after process lists printed by the script; follow up with:

   ```bash
   npm run cursor:diagnose
   ```

## Commands

| Command | Purpose |
|--------|---------|
| `npm run cursor:diagnose` | Memory, disk, heavy dirs, top Node/Cursor processes, `.cursorignore` / VS Code exclude sanity, cwd vs `/root` warning. |
| `npm run cursor:recover` | Kill runaway Cursor `extensionHost` / `fileWatcher` only; clear safe server caches; print top processes before/after. |
| `npm run validate:editor-stability` | CI/local guard — fails if stability excludes or this document regress. |
| `npm run cursor:validate-remote-config` | Same as `validate:editor-stability` (back-compat alias). |

## Production / deploy impact

These files are **editor and tooling only**. They do **not** change application runtime code, database schema, DigitalOcean build scripts, or deployed behavior.

