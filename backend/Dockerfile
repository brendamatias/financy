FROM node:22-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN npm ci

FROM deps AS dev

ENV NODE_ENV=development

COPY . .

EXPOSE 4000

CMD ["sh", "docker-entrypoint.sh"]

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

RUN mkdir -p /app/data && chown -R node:node /app

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

USER node

RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "docker-entrypoint.sh"]
