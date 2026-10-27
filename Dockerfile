# Hosted marketing-expert over Streamable HTTP (src/http.ts). scan_source and verify_quotes stay local over stdio.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci --ignore-scripts
COPY src ./src
COPY scripts/build-info.mjs scripts/archive-commit.txt ./scripts/
RUN npx tsc && node scripts/build-info.mjs

FROM node:24-alpine
WORKDIR /app
# The update check would tell callers to git pull a checkout they don't have; redeploy instead.
ENV NODE_ENV=production PORT=3000 MARKETING_EXPERT_DATA_DIR=/data MARKETING_EXPERT_UPDATE_CHECK=0
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --omit=optional --ignore-scripts && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY knowledge ./knowledge
COPY prompts ./prompts
# Business profiles. Mount a volume here; a new named volume takes this directory's owner, so node can write it.
RUN mkdir -p /data && chown node:node /data
VOLUME /data
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "dist/http.js"]
