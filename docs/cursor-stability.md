# Cursor / VS Code stability (indexing and watchers)

This repo is large. Heavy indexing and file watchers can make Cursor disconnect or exhaust memory on remote or constrained machines.

## Clear safe build and test artifacts

From the **repository root**:

```bash
npm run cursor:clean
```

This removes only ephemeral directories (when present): `.next`, `coverage`, `test-results`, `playwright-report`, `blob-report`, and `.turbo` — at the root and under `nursenest-core/`. It does **not** delete application source, `prisma/`, migrations, `public/` assets, lesson content, media uploads, or the `reports/` tree (that folder mixes generated output with tracked audit files). If this is a git checkout, the script runs `git restore test-results/.last-run.json` so a tiny tracked Playwright placeholder at the repo root is not left missing.

For a lighter clear that keeps most of `.next` and all of `node_modules`, use the app package’s `clean:light` (see `docs/dev/cursor-stability.md`).

## After cleanup: restart Cursor

1. Stop `next dev`, Playwright, and other watch processes.
2. Run `npm run cursor:clean` at the repo root.
3. **Reload the window**: Command Palette → “Developer: Reload Window”, or reconnect the remote SSH session.

## If Cursor still crashes or disconnects

- **Do not open the entire monorepo** as the workspace if you only need the Next.js app. Open a smaller folder scope so the indexer does less work.
- This layout has a nested app at **`nursenest-core/`** (DigitalOcean `source_dir`). If you mostly edit that app, open **`nursenest-core`** as the workspace root in Cursor instead of the parent repo when possible.

## Builds vs indexing

- Avoid starting a **full production `next build`** while Cursor is still indexing or right after opening the repo; it competes for CPU, disk, and memory with the TypeScript server and indexer.

## Related configuration

- **`.cursorignore`** — reduces what Cursor indexes (e.g. `node_modules`, `.next`, coverage, Playwright output, generated lesson indexes).
- **`.vscode/settings.json`** — `files.watcherExclude`, `search.exclude`, optional `files.exclude`, and `typescript.tsserver.maxTsServerMemory` (Cursor honors many of these).

Additional SSH and Node heap notes live in **`docs/dev/cursor-stability.md`**.
