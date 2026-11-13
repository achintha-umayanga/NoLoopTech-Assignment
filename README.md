# Task Manager

Full-stack Task Manager application with a **NestJS + Prisma (SQLite)** backend (`api/`) and a **Next.js 14 + RTK Query + Tailwind CSS** frontend (`web/`).

---

## Prerequisites

- **Node.js**: `v20.x` or newer (tested with Node `v20.20.2` in Docker and `v24.19.0` locally; Node 22+ avoids `EBADENGINE` warnings from `@nestjs/schematics`)
- **Package Manager**: **npm** (included with Node.js; `package-lock.json` is provided for both `api/` and `web/`)
- **Database**: **SQLite** (no separate database server required — managed via Prisma)
- **Docker & Docker Compose** *(optional, only needed if running via containers)*

---

## Quick Start (Local Development from a Fresh Clone)

> Because `.env` files and SQLite `*.db` files are ignored by `.gitignore`, you must create the `.env` files and initialize the SQLite database before starting the servers.

### 1. Clone the repository

```bash
git clone https://github.com/achintha-umayanga/NoLoopTech-Assignment.git
cd NoLoopTech-Assignment
```

### 2. Backend Setup (`api/`)

Open a terminal in the `api` directory:

```bash
cd api
```

#### Install dependencies

```bash
npm ci
```

#### Configure environment variables

Create `api/.env` with the following contents:

```env
PORT=4000
DATABASE_URL="file:./dev.db"
CORS_ORIGIN="http://localhost:3000"
```

| Variable | Description | Default / Example |
| --- | --- | --- |
| `PORT` | Port the NestJS API listens on | `4000` |
| `DATABASE_URL` | Prisma SQLite connection string (relative to `api/prisma/`) | `"file:./dev.db"` |
| `CORS_ORIGIN` | Allowed frontend origin for CORS requests | `"http://localhost:3000"` |

#### Initialize the SQLite database

Generate the Prisma Client and push the schema to create `api/prisma/dev.db`:

```bash
npx prisma generate
npx prisma db push
```

#### Start the backend

```bash
npm run start:dev
```

For a production build instead of watch mode:

```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:4000` (e.g. `GET http://localhost:4000/tasks`).

---

### 3. Frontend Setup (`web/`)

Open a **second terminal** in the `web` directory:

```bash
cd web
```

#### Install dependencies

```bash
npm ci
```

#### Configure environment variables

Create `web/.env` with the following contents:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for backend API requests from the browser | `http://localhost:4000` |

#### Start the frontend

```bash
npm run dev
```

For a production build instead of dev mode:

```bash
npm run build
npm run start
```

The web app will be available at **http://localhost:3000**.

---

## Alternative: Run with Docker Compose

Make sure Docker Desktop (or the Docker daemon) is running and ports `3000` and `4000` are free. From the repository root, run:

```bash
docker compose up --build
```

- **Web UI**: http://localhost:3000
- **API**: http://localhost:4000
- SQLite data is persisted in the `api-data` Docker volume at `/app/data/tasks.db`, and `prisma db push` runs automatically on container startup.


## Useful Scripts & Endpoints

### Backend (`api/`)
- `npm run start:dev` — Start NestJS in watch mode
- `npm run build` — Compile TypeScript to `dist/`
- `npm run start:prod` — Run compiled production server (`node dist/main`)
- `npm run test` — Run Jest unit tests

### Frontend (`web/`)
- `npm run dev` — Start Next.js dev server
- `npm run build` — Build production bundle
- `npm run start` — Start production Next.js server

### API Endpoints (`/tasks`)
- `GET /tasks` — List tasks (supports `status`, `sortBy`, `sortOrder` query params)
- `GET /tasks/:id` — Get a single task by ID
- `POST /tasks` — Create a task
- `PATCH /tasks/:id` — Update a task
- `DELETE /tasks/:id` — Delete a task

## How I used AI

- **Tool Used**: Antigravity

Overall, I barely needed AI tools for this application since it is fairly barebones with no complex query requirements. My main uses were:

- **Implementation Planning**: Generated an implementation plan upfront to avoid missing any requirements or functionality and to stay on track while building the project.
- **UI Improvements**: Used AI suggestions to achieve a cleaner, more polished UI.
- **Docker Setup**: Generated the Docker and Docker Compose configurations.