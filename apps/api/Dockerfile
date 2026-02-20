FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/db/schema.prisma packages/db/schema.prisma

RUN npm ci --workspace apps/api --include-workspace-root

COPY apps/api apps/api
COPY packages/db packages/db

RUN npm run db:generate --workspace apps/api
RUN npm run build --workspace apps/api
RUN npm prune --omit=dev --workspace apps/api --include-workspace-root

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/db/schema.prisma ./packages/db/schema.prisma

EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]
