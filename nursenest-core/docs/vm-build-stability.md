# VM Build Stability

This VM can complete `next build`, but it is sensitive to concurrent Node.js memory pressure.

## Root Cause

- The build failures were environmental OOM kills, not route or rendering bugs.
- The VM has about `7.8GiB` RAM.
- `next build` can overlap badly with local `next dev`, `.next/dev/build/postcss.js`, `npm exec tsc --noEmit`, `node_modules/.bin/tsc --noEmit`, and large `tsserver` memory spikes.
- Temporary swap at `/swapfile-cursor-build` was enough to let the production build complete.

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
- Browser automation processes unless they are part of the current build pressure

If TypeScript server memory balloons into multiple GiB, restart the editor or the TypeScript server instead of leaving it to compete with `next build`.

## Recommended Build Workflow

For clean production verification on this VM:

1. Stop any repo-local `next dev` process.
2. Stop any manual `typecheck` or other long-running validation terminals.
3. Confirm swap is available if the VM is under pressure: `swapon --show`
4. Run `rm -rf .next`
5. Run `AUTH_SECRET=test-secret npm run build`
6. Confirm `.next/BUILD_ID` exists.
7. Start production with `PORT=<port> AUTH_SECRET=test-secret npm run start`
8. Run only the targeted verification needed for the change.

Avoid running `next dev`, `next start`, and `typecheck` in parallel on this VM while a production build is in flight.

## Hook Policy

- `git push` must stay lightweight on this VM.
- Do not add `build`, `typecheck`, or large test suites to Husky `pre-push`.
- Run targeted verification manually before push instead.

## Temporary Swap

Current temporary swap file:

- Path: `/swapfile-cursor-build`

Cleanup guidance:

- Do not remove the swap file while swap usage is still elevated or while builds, dev servers, or typecheck jobs are active.
- Safe removal should wait for a quiet state with ample free RAM and no active build-related Node.js processes.
- If cleanup is needed later, prefer doing it after a reboot or after confirming memory has stayed stable for a while.

## Smallest Safe Long-Term Mitigation

Best default for this VM:

- Keep a small persistent swap file, around `2G` to `4G`.
- Keep `pre-push` non-blocking.
- Run production builds without concurrent local dev or watch-style validation processes.

If the team wants to build while keeping dev server, editor indexing, and typecheck active at the same time, move to a slightly larger VM.
