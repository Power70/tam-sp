# Sprout Task Manager

Sprout Task Manager is a full-stack task management application built with React, TypeScript,
Express, PostgreSQL, Mocha, Chai, Supertest, ESLint, and Prettier.

## Project structure

```text
backend/
  src/
    config/          Environment and database configuration
    controllers/     HTTP request and response handling
    domain/          Shared task types and domain errors
    middleware/      Validation and centralized HTTP error mapping
    repositories/    Parameterized PostgreSQL queries
    routes/          Express route definitions
    services/        Business rules and task orchestration
  test/              API integration and service tests
frontend/            React and Vite application
db/schema.sql        PostgreSQL schema and seed data
```

Requirements: Node.js 20+, PostgreSQL 14+, and npm.

## How to configure environment variables

Copy the environment templates:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Update the values if your local PostgreSQL or API configuration differs. The templates define:

| File | Variable | Purpose |
| ---- | -------- | ------- |
| `backend/.env` | `PORT` | API listening port |
| `backend/.env` | `DATABASE_URL` | PostgreSQL connection string |
| `backend/.env` | `PGSSL` | Enable PostgreSQL TLS when set to `true` |
| `backend/.env` | `NODE_ENV` | Runtime environment |
| `backend/.env` | `FRONTEND_URL` | Allowed frontend origin |
| `frontend/.env` | `VITE_API_URL` | API base URL, including `/api` |

## How to install dependencies

```powershell
Set-Location backend
npm install

Set-Location ..\frontend
npm install
```

## How to set up the database

Initialize the database and seed the welcome task:

```powershell
Set-Location backend
npm run db:seed
```

## How to run the backend and frontend applications

Start both applications in separate terminals:

```powershell
Set-Location backend
npm run dev
```

```powershell
Set-Location frontend
npm run dev
```

The frontend is served at `http://localhost:5173` and the API at `http://localhost:3000`.

## Production build

Build both applications before deployment:

```powershell
Set-Location backend
npm run build

Set-Location ..\frontend
npm run build
```

Run the compiled API with `npm start` from `backend`. Serve the generated `frontend/dist`
directory from a static web server and configure `VITE_API_URL` to the deployed API base URL
before building.

## API

The backend runs on `http://localhost:3000` by default.

### `GET /health`

Returns API and database health.

### `GET /api/tasks`

Returns one page of tasks ordered by creation time, newest first. Pagination defaults to 10
tasks per page and supports an optional status filter:

```text
GET /api/tasks?status=pending&page=1&pageSize=10
```

Supported statuses are `pending`, `in_progress`, and `completed`.

The response contains `tasks`, status `counts`, and `pagination` metadata (`page`, `pageSize`,
`total`, and `totalPages`). `pageSize` must be between 1 and 100.

### `POST /api/tasks`

Creates a task:

```json
{
  "title": "Plan sprint",
  "description": "Prepare the next sprint backlog",
  "status": "pending"
}
```

The title is required and must be 1-200 characters. Description is optional but must be a
string when provided. Status defaults to `pending`.

### `PATCH /api/tasks/:id/status`

Updates a task status:

```json
{
  "status": "completed"
}
```

Errors use `{ "error": "Description of the error" }`. Validation errors return `400`, missing
tasks return `404`, and unexpected errors return `500`.

## NPM scripts

Backend scripts:

| Command                | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the API with watch mode         |
| `npm run build`        | Compile TypeScript                    |
| `npm run db:seed`      | Apply schema and seed initial data    |
| `npm run typecheck`    | Run TypeScript without emitting       |
| `npm run lint`         | Run ESLint                            |
| `npm run format:check` | Verify Prettier formatting            |
| `npm test`             | Run service and API integration tests |

Frontend scripts:

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the Vite development server |
| `npm run build`        | Create the production bundle      |
| `npm run typecheck`    | Run TypeScript without emitting   |
| `npm run lint`         | Run ESLint                        |
| `npm run format:check` | Verify Prettier formatting        |

The frontend build lazy-loads the rich-text editor so its dependencies are not part of the
initial application entry chunk.

## How to execute the automated tests

Run the backend test suite against a PostgreSQL database:

```powershell
Set-Location backend
npm test
```

### Integration test database behavior

The integration tests reset the `tasks` table before and after the test suite so that every
test starts with deterministic data. This is intentional for the assessment environment, but
it is destructive: running the tests clears all tasks in the database configured for the test
process.

For a production setup, integration tests should use a separate test database rather than the
development, staging, or production application database.

The GitHub Actions workflow in `.github/workflows/ci.yml` runs on pushes and pull requests to
`main` and `develop`. It starts PostgreSQL, applies `db/schema.sql`, then verifies backend build,
typecheck, lint, formatting, and Mocha tests. A separate frontend job verifies typecheck, lint,
formatting, and the production build.

## Architecture

- Controllers handle HTTP concerns only.
- Services contain business rules.
- Repositories contain parameterized SQL.
- Domain types and errors are centralized.
- HTTP status mapping is handled by the error middleware.
- The Express app is exported without starting a listener, keeping tests isolated.
- The frontend uses server-side pagination and status filtering.
- Rich-text descriptions are sanitized before rendering in task details.
