# Sprout Task Manager

A small task manager with a React/Vite frontend, Express API, and PostgreSQL persistence.

## Requirements

- Node.js 20+
- PostgreSQL 14+

## Setup

1. Create a database named `sprout_tasks`.
2. Apply the schema and seed the initial data:

   ```sh
   cd backend
   npm install
   npm run db:seed
   ```

   The command is safe to run repeatedly; [`db/schema.sql`](./db/schema.sql) uses defensive DDL and idempotent seed data.

3. Copy [`backend/.env.example`](./backend/.env.example) to `backend/.env` and update `DATABASE_URL`. `PORT`, `NODE_ENV`, `DATABASE_URL`, and `FRONTEND_URL` are required when starting the server.
4. Install and start the API:

   ```sh
   cd backend
   npm install
   npm start
   ```

5. In another terminal, install and start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

Open `http://localhost:5173`.

## Architecture

The backend keeps HTTP concerns in controllers, business validation in services, and parameterized SQL in repositories. `src/app.ts` exports the Express application without starting a listener, which keeps route tests isolated and makes deployment wiring explicit. The frontend centralizes API calls in `taskApi.ts` and uses `useTasks.ts` for loading, filtering, and mutation state. TypeScript source is compiled to `backend/dist` for production execution.

## Testing

Run the backend unit and PostgreSQL integration tests with:

```sh
cd backend
npm test
```

The integration tests create the schema from [`db/schema.sql`](./db/schema.sql) before running, so the local database does not need a separate manual schema step. CI provisions a PostgreSQL 16 service and runs the complete Mocha suite.

The unit suite covers title and status validation, normalization, default values, missing records, repository failures, malformed JSON, invalid IDs, unknown routes, and request-body shape errors. The integration suite covers persistence, all supported status filters, status transitions, health checks, database constraints, invalid filters, boundary-length titles, missing records, and null/array request bodies.
