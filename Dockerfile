# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && corepack prepare npm@10.9.7 --activate

WORKDIR /app

COPY nursenest-core/package.json nursenest-core/package-lock.json ./nursenest-core/

WORKDIR /app/nursenest-core
ENV NODE_ENV=development
ENV HUSKY=0

RUN npm ci --ignore-scripts --no-fund --no-audit

WORKDIR /app

COPY shared ./shared
COPY client ./client
COPY nursenest-core ./nursenest-core
COPY Dockerfile /app/Dockerfile

WORKDIR /app/nursenest-core

ENV NODE_ENV=production \
  TMPDIR=/tmp \
  NEXT_TELEMETRY_DISABLED=1 \
  RUN_HEAVY_BUILD_TASKS=false \
  SKIP_I18N_PREBUILD=1 \
  NN_APP_PLATFORM_BUILD=true \
  SENTRY_ENABLED=false \
  BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=4096 \
  NODE_OPTIONS=--max-old-space-size=4096

RUN DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:65432/nn_prisma_codegen?schema=public" npm run db:generate

RUN rm -rf .next node_modules/.cache \
  && npm run heroku-postbuild \
  && npm run build:deploy \
  && npm prune --omit=dev --no-fund --no-audit \
  && rm -rf .next/cache node_modules/.cache

FROM node:20-alpine AS runner

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