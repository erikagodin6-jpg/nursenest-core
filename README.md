# NurseNest (monorepo workspace)

## Canonical Git remote (only target for push / deploy)

| Item | Value |
|------|--------|
| **Repository** | `https://github.com/erikagodin6-jpg/nursenest-core` |
| **Branch** | `main` |
| **App source** | `nursenest-core/` (`source_dir` for DigitalOcean App Platform) |

Clone and run Git commands from **this repository root** (the folder that contains `nursenest-core/` and `.git/`).

Do **not** add a second remote for “backup” or “old monolith” without renaming `origin` — keep **`origin`** = the URL above only.

See `nursenest-core/README.md` for app documentation.

**Git:** set `git config remote.pushDefault origin` in each clone so `git push` targets `origin` only. Never commit `.git/config` — it is local. Run `git remote -v` before pushing from unfamiliar machines.

**DigitalOcean:** production Next.js deploy uses repo `erikagodin6-jpg/nursenest-core`, branch `main`, `source_dir: nursenest-core` (see `.do/app-nursenest-core-next.yaml`). The GHCR workflow in `.github/workflows/` builds a **container image from this same repo** — it is not a separate deploy repository.
