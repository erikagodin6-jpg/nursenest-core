# syntax=docker/dockerfile:1
#
# Deterministic build + run (DigitalOcean App Platform, repo-root context).
# Monorepo paths: next.config `outputFileTracingRoot` is the repo parent of `nursenest-core/`
# (needs `shared/`, `client/` for `@shared/*` / `@legacy-client/*`).
#
# Build pipeline (same `package.json` scripts as the Node buildpack path):
#   1) `npm ci` in `nursenest-core/` (includes devDependencies: prisma, tsx, typescript, eslint-config-next, …)
#   2) `npm run db:generate` (Prisma client; one-off synthetic DATABASE_URL on the RUN line only — never bake DATABASE_URL into the image ENV)
#   3) `npm run heroku-postbuild` → hints + verify + `NN_POSTBUILD_NEXT_BUILD=1 npm run build` → `build:compile` / `next build`
#   4) `npm run build:deploy` → verify standalone + static sync + post-build prune
#   5) `npm prune --omit=dev` (matches former App Platform `build_command` tail)
#   6) `rm -rf .next/cache` — shrink runtime image (Docker layer cache covers deps; not DO buildpack cache)
#
# Run: `npm run start` → `scripts/start-standalone.mjs` (bootstrap + `.next/standalone/**/server.js`).

FROM node:22.22.2-alpine AS builder

RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && corepack prepare npm@10.9.7 --activate

WORKDIR /app

# Layer cache: lockfile only
COPY nursenest-core/package.json nursenest-core/package-lock.json ./nursenest-core/

WORKDIR /app/nursenest-core
ENV NODE_ENV=development
ENV HUSKY=0
RUN npm ci --omit=dev --ignore-scripts --no-fund --no-audit

WORKDIR /app
COPY shared ./shared
COPY client ./client
COPY nursenest-core ./nursenest-core

WORKDIR /app/nursenest-core

ENV NODE_ENV=production \
  TMPDIR=/tmp \
  NEXT_TELEMETRY_DISABLED=1 \
  RUN_HEAVY_BUILD_TASKS=false \
  SKIP_I18N_PREBUILD=1 \
  NN_APP_PLATFORM_BUILD=true \
  NN_FORCE_SINGLE_BUILD_WORKER=true \
  SENTRY_ENABLED=false \
  BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=4096 \
  NODE_OPTIONS=--max-old-space-size=4096 \
  BUILD_WEBPACK_PARALLELISM=1

# **Never** add image-wide `ARG DATABASE_URL=…` + `ENV DATABASE_URL=…` — Docker would freeze that value into
# the runtime layer and override DigitalOcean App Platform `DATABASE_URL` (RUN_TIME) / `.env.local`.
# Prisma `generate` only needs a syntactically valid URL on this RUN line (ephemeral); use a non-placeholder
# host/port (65432 + dedicated db name) so it does not match the runtime-banned substring `127.0.0.1:5432/postgres`.
RUN DATABASE_URL="postgresql://nn_prisma_codegen:nn_prisma_codegen@127.0.0.1:65432/nn_prisma_codegen?schema=public" npm run db:generate \
  && npm run heroku-postbuild \
  && npm run build:deploy \
  && npm prune --omit=dev --no-fund --no-audit \
  && rm -rf .next/cache

FROM node:22.22.2-alpine AS runner

RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && corepack prepare npm@10.9.7 --activate

WORKDIR /app/nursenest-core

ENV NODE_ENV=production \
  PORT=8080 \
  HOSTNAME=0.0.0.0 \
  NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/nursenest-core/.next ./.next
COPY --from=builder /app/nursenest-core/public ./public
COPY --from=builder /app/nursenest-core/scripts ./scripts
COPY --from=builder /app/nursenest-core/package.json ./package.json
COPY --from=builder /app/nursenest-core/package-lock.json ./package-lock.json
COPY --from=builder /app/nursenest-core/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "run", "start"]
