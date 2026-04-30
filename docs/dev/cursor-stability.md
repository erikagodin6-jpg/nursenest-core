# Cursor and remote SSH stability (local development)

This document is for **local** workflows only. It does not change CI, Dockerfiles, or DigitalOcean App Platform specs.

## Clear safe caches (`clean:light`)

From the app package directory (`nursenest-core/` for the Next.js app):

```bash
npm run clean:light
```

This removes only **cache** directories (`.next/cache`, `node_modules/.cache`, `.turbo`). It does **not** delete `.next/standalone`, `.next/static`, or `node_modules`. The script is idempotent.

Optional confirmation:

```bash
npm run clean:verify
```

## When to restart Cursor remote

If the remote workspace feels sluggish, SSH drops, or Node processes accumulate memory after long `next dev` / `next build` sessions:

1. Run `npm run clean:light` in `nursenest-core/`.
2. Stop the dev server and any watch processes.
3. Reload the Cursor window or reconnect the remote session if the SSH tunnel is unstable.

## SSH client recommendations

Unstable multiplexed sessions can make remote development flaky. Prefer a dedicated connection for heavy builds:

- Set `ControlMaster no` for the host you use with Cursor remote (or avoid aggressive `ControlPersist` for that host).
- Keep the session alive with `ServerAliveInterval` (e.g. `60`) and `ServerAliveCountMax` (e.g. `3`) in `~/.ssh/config` for that host.

Example block (adjust `Host` and paths to your setup):

```
Host my-nursenest-dev
  HostName your.server.example
  User youruser
  ControlMaster no
  ServerAliveInterval 60
  ServerAliveCountMax 3
```

## Node heap logging in builds

Production Next compiles go through `scripts/run-next-prod-build.mjs`, which runs `scripts/ensure-node-memory.mjs` once per compile to log merged `NODE_OPTIONS` and optional low-memory warnings.

**Avoid double runs:** do not prepend `node scripts/ensure-node-memory.mjs && …` to `package.json` scripts whose only job is to invoke `run-next-prod-build.mjs` (for example `build:compile` or a `build` script that is only `node scripts/run-buildpack-build.mjs`). The guard already runs at the start of `run-next-prod-build.mjs`. Prepend it only for flows that do **not** go through that file (for example `next dev`, or legacy `tsx` build wrappers in this repo).
