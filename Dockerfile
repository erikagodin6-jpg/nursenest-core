# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl bash \
  && corepack enable \
  && corepack prepare npm@10.9.7 --activate

WORKDIR /app

COPY package.json package-lock.json ./

COPY nursenest-core/package.json nursenest-core/package.json
COPY nursenest-core/package-lock.json nursenest-core/package-lock.json

ENV HUSKY=0
ENV NODE_ENV=development

RUN npm ci --ignore-scripts --no-fund --no-audit --install-links=false

# Copy remaining workspace sources (context trimmed via .dockerignore)
COPY . .

# Install app workspace dependencies
RUN DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:65432/nn_prisma_codegen?schema=public" \
  DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:65432/nn_prisma_codegen?schema=public" \
  npm --prefix nursenest-core ci --no-fund --no-audit --install-links=false
RUN nursenest-core/node_modules/.bin/prisma --version

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
ARG BUILD_NODE_MAX_OLD_SPACE_SIZE_MB

ENV NODE_ENV=production \
  TMPDIR=/tmp \
  NEXT_TELEMETRY_DISABLED=1 \
  RUN_HEAVY_BUILD_TASKS=false \
  SKIP_I18N_PREBUILD=1 \
  NN_APP_PLATFORM_BUILD=true \
  NN_LESSON_INDEX_VERIFY_MODE=manifest \
  NN_SKIP_NONESSENTIAL_BUILD_AUDITS=1 \
  NN_SKIP_HEAVY_BUILD_REPORTS=1 \
  SENTRY_ENABLED=false \
  TURBOPACK=1 \
  BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=${BUILD_NODE_MAX_OLD_SPACE_SIZE_MB:-3072} \
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

RUN DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:65432/nn_prisma_codegen?schema=public" \
  DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:65432/nn_prisma_codegen?schema=public" \
  npm --prefix nursenest-core run db:generate

RUN NODE_OPTIONS="--max-old-space-size=${BUILD_NODE_MAX_OLD_SPACE_SIZE_MB:-3072}" \
  npm --prefix nursenest-core run build:production

RUN npm run build

RUN npm prune --omit=dev --no-fund --no-audit

FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NODE_ENV=production \
  PORT=8080 \
  HOSTNAME=0.0.0.0 \
  NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/nursenest-core/scripts ./nursenest-core/scripts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/public ./public

EXPOSE 8080

CMD ["node", "scripts/start-production.mjs"]