# Fluxorae Website

Next.js app for:
- Public website pages
- Lead capture form -> `POST /api/crm/leads/website`
- ERP entry routes under `/app`

## Local Run

1. Ensure API is running on `http://localhost:3000/api`.
2. Set env:
   - `copy .env.example .env.local`
3. Start:
   - `npm run dev:web`

## Production Build

- `npm run build:web`
- `docker build -f apps/web/Dockerfile .`
