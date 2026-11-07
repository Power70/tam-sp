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

## Local setup

Requirements: Node.js 20+, PostgreSQL 14+, and npm.

Create a database, copy `backend/.env.example` to `backend/.env`, and set the PostgreSQL
connection details. Then install dependencies:

```powershell
Set-Location backend
npm install

Set-Location ..\frontend
npm install
```

Initialize the database and seed the welcome task:

```powershell
Set-Location backend
npm run db:seed
```

Start the backend with `npm run dev` and the frontend with `npm run dev` from their respective
directories.

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

The title is required and must be 1-200 characters. Description is optional and status defaults
to `pending`.

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

## Architecture

- Controllers handle HTTP concerns only.
- Services contain business rules.
- Repositories contain parameterized SQL.
- Domain types and errors are centralized.
- HTTP status mapping is handled by the error middleware.
- The Express app is exported without starting a listener, keeping tests isolated.
