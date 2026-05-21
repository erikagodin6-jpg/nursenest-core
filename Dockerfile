# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && corepack prepare npm@10.9.7 --activate

WORKDIR /app

COPY nursenest-core/package.json nursenest-core/package-lock.json ./nursenest-core/
COPY nursenest-core/scripts/shims/server-only ./nursenest-core/scripts/shims/server-only

WORKDIR /app/nursenest-core
ENV NODE_ENV=development
ENV HUSKY=0

RUN npm ci --ignore-scripts --no-fund --no-audit

WORKDIR /app

COPY shared ./shared
COPY client ./client
COPY nursenest-core ./nursenest-core
COPY scripts ./scripts
COPY script ./script
COPY tools ./tools

WORKDIR /app/nursenest-core

ARG NN_BUILD_COMMIT
ARG NN_BUILD_BRANCH
ARG SOURCE_COMMIT
ARG SOURCE_VERSION
ARG SOURCE_BRANCH
ARG DIGITALOCEAN_GIT_COMMIT_SHA
ARG DIGITALOCEAN_GIT_BRANCH
ARG GITHUB_SHA
ARG GITHUB_REF_NAME
ARG VERCEL_GIT_COMMIT_SHA
ARG VERCEL_GIT_COMMIT_REF
ARG BUILD_WEBPACK_PARALLELISM
ARG NN_FORCE_SINGLE_BUILD_WORKER
ARG NN_TIMED_INCLUDE_NPM_PRUNE

ENV NODE_ENV=production \
  TMPDIR=/tmp \
  NEXT_TELEMETRY_DISABLED=1 \
  RUN_HEAVY_BUILD_TASKS=false \
  SKIP_I18N_PREBUILD=1 \
  NN_APP_PLATFORM_BUILD=true \
  NN_LOW_MEMORY_BUILD=1 \
  NN_LESSON_INDEX_VERIFY_MODE=manifest \
  NN_SKIP_NONESSENTIAL_BUILD_AUDITS=1 \
  NN_SKIP_HEAVY_BUILD_REPORTS=1 \
  SENTRY_ENABLED=false \
  BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=2816 \
  BUILD_WEBPACK_PARALLELISM=1 \
  NN_FORCE_SINGLE_BUILD_WORKER=true \
  NN_BUILD_COMMIT=${NN_BUILD_COMMIT} \
  NN_BUILD_BRANCH=${NN_BUILD_BRANCH} \
  SOURCE_COMMIT=${SOURCE_COMMIT} \
  SOURCE_VERSION=${SOURCE_VERSION} \
  SOURCE_BRANCH=${SOURCE_BRANCH} \
  DIGITALOCEAN_GIT_COMMIT_SHA=${DIGITALOCEAN_GIT_COMMIT_SHA} \
  DIGITALOCEAN_GIT_BRANCH=${DIGITALOCEAN_GIT_BRANCH} \
  GITHUB_SHA=${GITHUB_SHA} \
  GITHUB_REF_NAME=${GITHUB_REF_NAME} \
  VERCEL_GIT_COMMIT_SHA=${VERCEL_GIT_COMMIT_SHA} \
  VERCEL_GIT_COMMIT_REF=${VERCEL_GIT_COMMIT_REF}

RUN DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:65432/nn_prisma_codegen?schema=public" npm run db:generate

# Never pass production DATABASE_URL/AUTH_SECRET into image layers — compile uses prisma-safe stubs.
RUN BUILD_WEBPACK_PARALLELISM="${BUILD_WEBPACK_PARALLELISM:-1}" \
  NN_FORCE_SINGLE_BUILD_WORKER="${NN_FORCE_SINGLE_BUILD_WORKER:-true}" \
  NN_TIMED_INCLUDE_NPM_PRUNE="${NN_TIMED_INCLUDE_NPM_PRUNE}" \
  rm -rf .next .turbo node_modules/.cache \
  && npm run heroku-postbuild \
  && npm run build:deploy \
  && tar -C .next -czf .next-standalone-runtime.tar.gz standalone \
  && rm -rf .next/standalone \
  && npm prune --omit=dev --no-fund --no-audit \
  && rm -rf .next/cache .turbo node_modules/.cache

FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app/nursenest-core

ENV NODE_ENV=production \
  PORT=8080 \
  HOSTNAME=0.0.0.0 \
  NODE_MAX_OLD_SPACE_SIZE_MB=1280 \
  NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/nursenest-core/.next-standalone-runtime.tar.gz ./.next-standalone-runtime.tar.gz
RUN mkdir -p .next && tar -xzf .next-standalone-runtime.tar.gz -C .next && rm .next-standalone-runtime.tar.gz
COPY --from=builder /app/nursenest-core/public ./public
COPY --from=builder /app/nursenest-core/scripts ./scripts
COPY --from=builder /app/scripts ../scripts
COPY --from=builder /app/script ../script
COPY --from=builder /app/nursenest-core/package.json ./package.json

EXPOSE 8080

CMD ["node", "scripts/start-standalone.mjs"]
