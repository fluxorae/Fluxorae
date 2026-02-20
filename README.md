# Fluxorae Monorepo

Production-ready baseline for:
- `apps/web`: public website + `/app` ERP portal entry
- `apps/api`: NestJS ERP API
- `packages/db`: Prisma schema

## Local Development

1. Install dependencies:
   - `npm install`
2. Create API env:
   - `copy apps\\api\\.env.example apps\\api\\.env` (Windows)
3. Generate Prisma client:
   - `npm run db:generate`
4. Push schema to your database:
   - `npm run db:push`
5. Start API:
   - `npm run dev:api`
6. Start web:
   - `npm run dev:web`

Local URLs:
- Website: `http://localhost:3001`
- API: `http://localhost:3000/api`

## Production Build Check

- `npm run build`

## Containerized Production (Single Host)

1. Copy production env:
   - `copy .env.production.example .env.production`
2. Set secure values in `.env.production`.
3. Build and run:
   - `docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build`
4. Verify:
   - Website: `http://<server-ip>/`
   - API health: `http://<server-ip>/api/health`

The compose stack includes:
- PostgreSQL
- API container
- Web container
- Nginx reverse proxy
