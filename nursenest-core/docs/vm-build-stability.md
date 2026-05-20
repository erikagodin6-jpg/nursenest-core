# VM Build Stability

This VM can complete `next build`, but it is sensitive to concurrent Node.js memory pressure.

## Root Cause

- The failed builds were environmental OOM kills, not route, redirect, rendering, or user-facing app bugs.
- The VM has about `7.8GiB` RAM, which is enough for the app but tight for overlapping build and editor workloads.
- `next build` is vulnerable when it overlaps with repo-local `next dev`, `.next/dev/build/postcss.js`, `npm run typecheck`, `npm exec tsc --noEmit`, `node_modules/.bin/tsc --noEmit`, and large `tsserver` spikes from the editor.

## Current Persistent Mitigation

- Persistent swap target for this VM: `2G` to `4G`
- Active swap file: `/swapfile-cursor-build`
- Current size: `4G`
- Persistence: `/etc/fstab` now includes `/swapfile-cursor-build none swap sw 0 0`

Why this setup:

- `4G` is small enough to stay low-risk on this VM and large enough to absorb build spikes without immediately OOM-killing Node.js.
- Reusing the already-active swap file was safer than forcing a live swap migration while pages were resident.

## Safe To Stop Before Production Builds

Safe to stop before `npm run build` on this VM:

- Repo-local `next dev` shells such as `npm run dev`
- `next-server (v16.2.1)` processes serving local dev builds
- `.next/dev/build/postcss.js` child processes
- Manual or background `npm run typecheck`
- `npm exec tsc --noEmit`
- `node_modules/.bin/tsc --noEmit`

Usually do not kill these as part of a normal build workflow:

- Cursor server / extension host
- Browser automation processes unless they are clearly the source of current build pressure

If TypeScript server memory balloons into multiple GiB, restart the editor or the TypeScript server instead of leaving it to compete with `next build`.

## Check Before Building

Use the lightweight operator helper:

```bash
bash scripts/ops/check-build-memory.sh
```

It reports:

- current RAM totals
- active swap devices/files
- risky concurrent build-related processes

It does not kill anything.

Manual spot checks:

```bash
free -h
swapon --show
ps -eo pid,ppid,%mem,%cpu,cmd --sort=-%mem | sed -n '1,25p'
```

## Recommended Build Workflow

For a safe production verification build on this VM:

1. Run `bash scripts/ops/check-build-memory.sh`
2. Stop any repo-local `next dev` process.
3. Stop any manual `typecheck` or other long-running validation terminals.
4. Confirm swap is active with `swapon --show`
5. Run `rm -rf .next`
6. Run `AUTH_SECRET=test-secret npm run build`
7. Confirm `.next/BUILD_ID` exists.
8. Start production with `PORT=<port> AUTH_SECRET=test-secret npm run start`
9. Run only the targeted verification needed for the change.
10. Stop the production server when verification is done.

Avoid running `next dev`, `next start`, and manual `typecheck` in parallel on this VM while a production build is in flight.

## Hook Policy

- `git push` must stay lightweight on this VM.
- Do not add `build`, `typecheck`, or large test suites to Husky `pre-push`.
- Run targeted verification manually before push instead.
- `.husky/pre-push` should remain non-blocking.

## Swap Cleanup Or Migration

Current live swap file:

- Path: `/swapfile-cursor-build`

Do not remove or migrate it while any of these are true:

- `swapon --show` still reports non-zero usage for `/swapfile-cursor-build`
- a production build, local dev server, or manual typecheck is running
- the machine is under visible memory pressure

Safe quiet-window migration plan if a standard path such as `/swapfile` is preferred later:

1. Wait for a quiet window with no active build-related Node.js processes.
2. Confirm RAM has remained comfortably free for a while.
3. `swapoff /swapfile-cursor-build`
4. Remove the old file.
5. Create the replacement persistent swap file.
6. Update `/etc/fstab`.
7. Re-enable swap and verify with `swapon --show`.

If there is no strong operational reason to rename it, keeping `/swapfile-cursor-build` is acceptable because it is already active and now persistent.

## Smallest Safe Long-Term Mitigation

Best default for this VM:

- Keep a small persistent swap file, `2G` to `4G`
- Keep `pre-push` non-blocking
- Run production builds without concurrent local dev or watch-style validation processes

If the team wants to build while keeping dev server, editor indexing, and typecheck active at the same time, move to a slightly larger VM.
