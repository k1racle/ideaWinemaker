# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NUXT_PUBLIC_SITE_URL=https://ideawinemaker.ru
ENV NUXT_PUBLIC_SITE_URL=${NUXT_PUBLIC_SITE_URL}

RUN npm run build \
  && npm prune --omit=dev

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production \
  HOST=0.0.0.0 \
  PORT=3000 \
  NUXT_DATABASE_PATH=/app/data/ideawinemaker.sqlite \
  DATABASE_BACKUP_DIR=/app/data/backups \
  RUN_DB_SEED=true

WORKDIR /app

RUN groupadd --system ideawinemaker \
  && useradd --system --gid ideawinemaker --home-dir /app --shell /usr/sbin/nologin ideawinemaker \
  && mkdir -p /app/data/backups \
  && chown -R ideawinemaker:ideawinemaker /app

COPY --from=build --chown=ideawinemaker:ideawinemaker /app/.output ./.output
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/node_modules ./node_modules
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/package.json ./package.json
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/drizzle ./drizzle
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/scripts ./scripts
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/server ./server
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/shared ./shared

USER ideawinemaker

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/wines').then(response => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["sh", "-c", "node scripts/migrate-database.ts && if [ \"${RUN_DB_SEED:-true}\" = \"true\" ]; then node scripts/seed-database.ts; fi && exec node .output/server/index.mjs"]
