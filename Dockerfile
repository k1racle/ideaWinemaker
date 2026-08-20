# syntax=docker/dockerfile:1

# The full Debian image includes the native build toolchain required when an
# npm package has no prebuilt binary for the server architecture.
FROM node:24-bookworm AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci \
  --no-audit \
  --no-fund \
  --fetch-retries=5 \
  --fetch-retry-factor=2 \
  --fetch-retry-mintimeout=10000 \
  --fetch-retry-maxtimeout=120000

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
  NUXT_INITIAL_DATABASE_PATH=/app/database/bootstrap-content.sqlite \
  DATABASE_BACKUP_DIR=/app/data/backups

WORKDIR /app

RUN groupadd --system ideawinemaker \
  && useradd --system --gid ideawinemaker --home-dir /app --shell /usr/sbin/nologin ideawinemaker \
  && mkdir -p /app/data/backups \
  && chown -R ideawinemaker:ideawinemaker /app

COPY --from=build --chown=ideawinemaker:ideawinemaker /app/.output ./.output
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/node_modules ./node_modules
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/package.json ./package.json
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/database ./database
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/drizzle ./drizzle
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/scripts ./scripts
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/server ./server
COPY --from=build --chown=ideawinemaker:ideawinemaker /app/shared ./shared

USER ideawinemaker

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/wines').then(response => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
