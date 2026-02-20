# Fluxorae ERP API

## Local Run

1. Install dependencies from repo root:
   - `npm install`
2. Copy env:
   - `cp .env.example .env` (or create `.env` manually on Windows)
3. Generate Prisma client:
   - `npm run db:generate --workspace apps/api`
4. Push schema:
   - `npm run db:push --workspace apps/api`
5. Start API:
   - `npm run dev:api`

Base URL: `http://localhost:3000/api`

Health endpoint: `GET /api/health`

## Production Notes

- Use strong `JWT_SECRET` and set `NODE_ENV=production`.
- Configure `CORS_ORIGINS` with only trusted domains.
- Build:
  - `npm run build:api`
- Container image:
  - `docker build -f apps/api/Dockerfile .`
