# Sprout Task Manager

Sprout Task Manager is a full-stack task management application built with:

- **Frontend:** React, TypeScript, and Vite
- **Backend:** Express, TypeScript, and Node.js
- **Database:** PostgreSQL
- **Testing:** Mocha, Chai, Sinon, and Supertest
- **Quality tooling:** ESLint, Prettier, and TypeScript

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer
- npm

## Project structure

```text
backend/
  src/
    config/          Environment and database configuration
    controllers/     HTTP request and response handling
    domain/          Shared task types, statuses, and domain errors
    middleware/      Validation and centralized HTTP error mapping
    repositories/    Parameterized PostgreSQL queries
    routes/          Express route definitions
    scripts/         Database setup and seed scripts
    services/        Business rules and task orchestration
  test/              Unit and PostgreSQL integration tests
frontend/
  src/
    api/             Typed API client
    components/      React UI components
    hooks/           Task state and async operation management
db/
  schema.sql         PostgreSQL schema, constraints, index, and seed data
```

## Local setup

### 1. Create the database

Create a PostgreSQL database:

```sql
CREATE DATABASE sprout_tasks;
```

### 2. Configure the backend

Copy the environment template:

```powershell
Copy-Item backend/.env.example backend/.env
```

Update `backend/.env` with your PostgreSQL connection details:

```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/sprout_tasks
PGSSL=false
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

The backend requires `PORT`, `DATABASE_URL`, `NODE_ENV`, and `FRONTEND_URL`.

### 3. Install dependencies

```powershell
Set-Location backend
npm install

Set-Location ..\frontend
npm install
```

### 4. Initialize and seed PostgreSQL

From `backend`:

```powershell
npm run db:seed
```

This applies [`db/schema.sql`](./db/schema.sql) and inserts the welcome task. The operation is idempotent and safe to repeat.

### 5. Start the application

Start the backend in one terminal:

```powershell
Set-Location backend
npm run dev
```

Start the frontend in another terminal:

```powershell
Set-Location frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API

The backend runs on `http://localhost:3000` by default.

### `GET /health`

Checks API and PostgreSQL availability.

Successful response:

```json
{
  "status": "ok",
  "database": "ok"
}
```

### `GET /api/tasks`

Returns tasks ordered by creation time, newest first.

Optional status filter:

```text
GET /api/tasks?status=pending
```

Supported statuses are `pending`, `in_progress`, and `completed`.

### `POST /api/tasks`

Creates a task.

Request:

```json
{
  "title": "Plan sprint",
  "description": "Prepare the next sprint backlog",
  "status": "pending"
}
```

`title` is required and must be 1-200 characters. `description` is optional and `status` defaults to `pending`.

### `PATCH /api/tasks/:id/status`

Updates a task status.

Request:

```json
{
  "status": "completed"
}
```

### Error responses

Errors use a consistent JSON shape:

```json
{
  "error": "Description of the error"
}
```

Validation errors return `400`, missing tasks return `404`, and unexpected server errors return `500`.

## NPM scripts

### Backend

Run from `backend`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with watch mode |
| `npm run build` | Compile TypeScript to `dist` |
| `npm start` | Run the compiled API |
| `npm run db:seed` | Apply schema and seed initial data |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run lint` | Run ESLint |
| `npm run format` | Format source files with Prettier |
| `npm run format:check` | Verify Prettier formatting |
| `npm test` | Run unit and PostgreSQL integration tests |

### Frontend

Run from `frontend`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production bundle |
| `npm run preview` | Preview the production bundle |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run lint` | Run ESLint |
| `npm run format` | Format source files with Prettier |
| `npm run format:check` | Verify Prettier formatting |

## Testing and quality gates

Run the backend checks:

```powershell
Set-Location backend
npm run typecheck
npm run lint
npm run format:check
npm test
```

Run the frontend checks:

```powershell
Set-Location frontend
npm run typecheck
npm run lint
npm run format:check
npm run build
```

The integration tests apply the database schema automatically before execution. GitHub Actions also provisions PostgreSQL 16 and runs backend and frontend quality gates on pushes and pull requests targeting `main` or `develop`.

## Architecture principles

- Controllers handle HTTP concerns only.
- Services contain business rules and orchestration.
- Repositories contain parameterized SQL only.
- Domain types, statuses, normalization, and domain errors are centralized under [`backend/src/domain`](./backend/src/domain).
- HTTP status mapping is centralized in [`backend/src/middleware/errorHandler.ts`](./backend/src/middleware/errorHandler.ts).
- `app.ts` exports the Express application without starting a server, keeping tests isolated.
- The frontend uses a typed API client and a shared hook for task loading and mutations.
