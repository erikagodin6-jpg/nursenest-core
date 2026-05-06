# Cursor Remote SSH stability (NurseNest)

This repo is large. Cursor / VS Code `extensionHost` and file-watcher processes can spike CPU and RAM if the workspace root is too broad or generated trees are watched. This document matches the repo-level excludes in `.cursorignore` and `.vscode/settings.json`.

## 1. Open the correct folder

- **Always** open the clone root as the remote workspace folder, for example: `/root/nursenest-core` (or your actual clone path ending in `nursenest-core`).
- **Do not** open `/root`, `/home/you`, or a parent directory that contains many other projects, Docker contexts, or home-folder noise. Cursor will try to watch and index everything under that root.

Verify from a terminal in the remote:

```bash
cd /root/nursenest-core && npm run cursor:diagnose
```

If you see a warning that `process.cwd()` is `/root` or not the repo root, reconnect and **File → Open Folder…** on the repo directory only.

## 2. What this repo excludes (by design)

Heavy or generated paths are excluded from **Cursor indexing** (`.cursorignore`), **file watching**, **search**, and (for generated-only trees) **Explorer** via `.vscode/settings.json`:

- `node_modules`, `.next`, `.turbo`, `.cache`, `.tmp`, `tmp`, `temp`
- `coverage`, `dist`, `build` output dirs (explicit paths — not arbitrary `**/build` that could match source)
- `playwright-report`, `test-results`, `blob-report`
- `reports`, `logs`, `*.log`
- `public/i18n` and `nursenest-core/public/i18n` (large compiled i18n shards)
- `generated-indexes` trees
- `prisma/migrations` (many files; `prisma/schema.prisma` remains available for development)
- `.prisma`, `.vercel`, `.digitalocean`

**Not** excluded: `src`, `app`, `components`, `prisma/schema.prisma`, `package.json`, `scripts`, `tests`, and static assets under `public/` outside `i18n/`.

## 3. If Cursor freezes or CPU spikes

### Kill runaway processes (remote host)

List heavy Node / Cursor-related processes:

```bash
ps -eo pid,pcpu,rss,args --sort=-rss | head -n 25
```

Stop a specific high-CPU PID (replace `<pid>`):

```bash
kill <pid>
```

If unresponsive:

```bash
kill -9 <pid>
```

On a shared dev VM, prefer killing your own `cursor-server` / `extensionHost` / `fileWatcher` children rather than unrelated services.

### Reload the window

In Cursor: **Developer: Reload Window** (Command Palette). This restarts the extension host without rebooting the remote.

### Clear Cursor remote server data (last resort)

Corrupted or bloated remote server installs can be reset **on the remote machine** (you will re-download extensions):

1. Close Cursor / disconnect SSH.
2. On the remote, remove the Cursor Server / VS Code Server directory for this user (exact path varies by Cursor build; common patterns include `~/.cursor-server` or under `~/.cursor/`). Follow current Cursor documentation for "clear remote server" if paths differ.
3. Reconnect; the client will reinstall the server binary.

**Do not** delete your git clone or `node_modules` unless you intend to reinstall dependencies.

## 4. Verify excludes after changes

```bash
npm run cursor:diagnose
npm run cursor:validate-remote-config
```

`cursor:diagnose` prints memory, top Node-related processes, and whether `.cursorignore` / watcher + search excludes look present.

`cursor:validate-remote-config` exits with a non-zero code if required patterns or settings are missing — use it in CI or before merging editor-config changes.

## 5. Local artifact cleanup (optional)

```bash
npm run cursor:clean
```

Removes common local build/test output (`.next`, coverage, Playwright reports, etc.) **without** touching source, schema, migrations on disk, or tracked placeholders. See `scripts/cursor-clean.mjs`.

## 6. Production / build impact

These files affect **editor behavior only**. They do not change Next.js routes, DigitalOcean build scripts, database schema, or runtime code paths.
