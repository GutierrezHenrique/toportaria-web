# Web e2e (Playwright)

Requires backend up at `http://localhost:3333` with seed applied.

## Setup

```bash
cd ../backend
docker compose up -d
npm run prisma:deploy
npm run prisma:seed
npm run start:dev &

cd ../web
npm install
npx playwright install
npm run test:e2e
```

## Suites
- `auth.spec.ts` — login success/fail + logout
- `dashboard.spec.ts` — KPI cards + sidebar routing
- `visitors.spec.ts` — API-seeded pending visitor, full approve→check-in→check-out UI flow
- `units.spec.ts` — create unit via form

`playwright.config.ts` auto-starts `npm run dev` on port 5173 if not running.
