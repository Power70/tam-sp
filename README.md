# Sprout Task Manager

A small task manager with a React/Vite frontend, Express API, and PostgreSQL persistence.

## Requirements

- Node.js 20+
- PostgreSQL 14+

## Setup

1. Create a database named `sprout_tasks`.
2. Apply [`db/schema.sql`](./db/schema.sql).
3. Copy [`backend/.env.example`](./backend/.env.example) to `backend/.env` and update `DATABASE_URL`.
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

The backend keeps HTTP concerns in controllers, business validation in services, and parameterized SQL in repositories. `src/app.js` exports the Express application without starting a listener, which keeps route tests isolated and makes deployment wiring explicit. The frontend centralizes API calls in `taskApi.js` and uses `useTasks` for loading, filtering, and mutation state.

## Testing

Run the backend route and service-facing tests with:

```sh
cd backend
npm test
```

The current tests stub repository calls, so they do not require a running PostgreSQL instance.
