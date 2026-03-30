# Droplet deployment (NurseNest Core)

Read the full guide: **[docs/droplet-migration-plan.md](../../docs/droplet-migration-plan.md)**.

## Two supported paths

| Path | Script | Use when |
|------|--------|----------|
| **Build on Droplet** | `deploy-app.sh` | Enough RAM (about **2 GB+**), you `git pull` on the server and want one command to install, build, migrate, and reload PM2. |
| **CI artifact** | `deploy-artifact.sh` | **Low memory** (often **1 GB**), build and optional `npm ci` happen on CI or another Linux host; the Droplet unpacks a tarball under **`releases/`**, migrates, reloads PM2, then updates **`current`**. |

The build-on-Droplet flow stays the default in this README; the migration plan documents both in detail.

## Quick reference (build on Droplet)

1. On a fresh Ubuntu Droplet, copy this folder and run:
   ```bash
   sudo bash deploy/droplet/bootstrap-ubuntu.sh
   ```
2. Clone the repository (must include the `shared/` folder and `nursenest-core/` app directory).
3. Copy `env.production.template` to a secure path, fill in secrets, then either:
   - Symlink as `nursenest-core/.env.production`, or
   - Set `NURSE_NEST_ENV_FILE` to that file before `deploy-app.sh`.
4. Edit and install `Caddyfile.example` (replace domain, email).
5. Run:
   ```bash
   export NURSE_NEST_REPO_ROOT=/var/www/nursenest/repo
   bash deploy/droplet/deploy-app.sh
   ```
6. Validate:
   ```bash
   bash deploy/droplet/validate-droplet.sh https://your.domain
   ```

Default app path: `$NURSE_NEST_REPO_ROOT/nursenest-core` (the inner package).

## Artifact deploy (summary)

1. On a **Linux** build host with **Node 20.x**, from monorepo root (after `npm run build:deploy` in `nursenest-core/`):
   ```bash
   cd nursenest-core && npm ci && npm run build:deploy && cd ..
   tar -czf nursenest-release.tgz shared nursenest-core
   ```
   Prefer including **`nursenest-core/node_modules`** from that host so the Droplet can set **`NURSE_NEST_SKIP_NPM_CI=1`**.

2. Copy the tarball to the Droplet (e.g. `/var/www/nursenest/incoming/`).

3. Keep **`deploy-artifact.sh`** in a fixed location (e.g. `/var/www/nursenest/bin/deploy-artifact.sh`), not only inside a release that might not exist on first deploy.

4. Run:
   ```bash
   export NURSE_NEST_ARTIFACT=/var/www/nursenest/incoming/nursenest-release.tgz
   export NURSE_NEST_ENV_FILE=/var/www/nursenest/env/.env.production
   export NURSE_NEST_SKIP_NPM_CI=1   # when node_modules is inside the tarball
   bash /var/www/nursenest/bin/deploy-artifact.sh
   ```

Optional env vars: **`NURSE_NEST_RELEASE_ROOT`** (default `/var/www/nursenest/releases`), **`NURSE_NEST_CURRENT_LINK`** (default `/var/www/nursenest/current`).

Rollback: point **`current`** at the previous timestamp directory and **`pm2 startOrReload .../ecosystem.config.cjs`** for that tree (see migration plan §9).

## Reboot persistence

After PM2 runs your app successfully:

```bash
pm2 save
sudo env PATH=$PATH pm2 startup systemd -u "$(whoami)" --hp "$HOME"
# Run the command the tool prints, then:
bash deploy/droplet/check-boot-persistence.sh
```

`bootstrap-ubuntu.sh` enables Caddy at boot; after edits use `sudo systemctl reload caddy`.
