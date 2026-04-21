# DigitalOcean App Platform — deterministic production image for Next.js standalone.
# Build context: repository root (must include nursenest-core/, shared/, client/ for path aliases).
# Pin Node to match nursenest-core/package.json engines (>=22 <23).
#
# One compile: build:compile only (no heroku-postbuild / buildpack second path).
# Post-build: build:deploy (standalone verify + static sync + prune).
#
# DO NOT add parallel webpack workers here; low-memory env matches .do spec.

ARG NODE_VERSION=22.22.1

# --- deps: reproducible install ---
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app
ENV CI=1
ENV HUSKY=0
ENV npm_config_fund=false
ENV npm_config_audit=false

COPY shared ./shared
COPY client ./client
COPY nursenest-core/package.json nursenest-core/package-lock.json ./nursenest-core/
WORKDIR /app/nursenest-core
RUN npm ci

# --- builder: one production compile ---
FROM deps AS builder
WORKDIR /app/nursenest-core
COPY nursenest-core/ ./

ARG BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=4096
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV RUN_HEAVY_BUILD_TASKS=false
ENV SKIP_I18N_PREBUILD=1
ENV SENTRY_ENABLED=false
ENV NN_FORCE_SINGLE_BUILD_WORKER=1
ENV NN_APP_PLATFORM_BUILD=1
ENV BUILD_WEBPACK_PARALLELISM=1
ENV TMPDIR=/tmp
ENV NODE_OPTIONS=--max-old-space-size=${BUILD_NODE_MAX_OLD_SPACE_SIZE_MB}
ENV BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=${BUILD_NODE_MAX_OLD_SPACE_SIZE_MB}

# Prisma client — generate only (no DB connection). run-prisma-with-env requires DATABASE_URL.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
RUN npm run db:generate

RUN npm run verify:bootstrap-probe-pathname \
  && npm run build:compile \
  && npm run build:deploy

# --- runner: standalone + bootstrap entry ---
FROM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app/nursenest-core
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Full post-build tree (standalone + pruned node_modules + public + start scripts).
COPY --from=builder /app/nursenest-core ./

EXPOSE 8080
CMD ["npm", "run", "start"]
