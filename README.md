# Realtime Dashboard

A full-stack real-time monitoring dashboard built with **Node.js** (backend) and **React + Vite** (frontend). This project fetches metrics from multiple endpoints and displays them live using **WebSockets**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Architecture Diagram](#architecture-diagram)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install Dependencies](#install-dependencies)
  - [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- Real-time updates from multiple server endpoints
- WebSocket-based communication between backend and frontend
- Aggregated metrics per region
- Type-safe shared types using a `shared` package
- CI pipeline with lint, format, test, build, and deploy steps

---

## Tech Stack

- **Backend:** Node.js, Express, WebSocket, TypeScript
- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Testing:** Vitest, Testing Library
- **CI/CD:** GitHub Actions / GitLab CI, Render for hosting

---

## Monorepo Structure

```
packages/
  backend/         # Node.js backend service
  frontend/        # React + Vite frontend
  shared/          # Shared TypeScript types
```

---

## Architecture Diagram

```text
+-----------------+          WebSocket           +----------------+
|                 |<---------------------------->|                |
|   Backend API   |                              |   Frontend     |
| (Node + Express)|                              | (React + Vite) |
|                 |---------------------------->|                |
|   Polls metrics |          REST / Fetch        |  Displays UI   |
|   every 15s     |                              |  with live     |
|                 |                              |  updates       |
+-----------------+                              +----------------+
```

- Backend fetches metrics from external endpoints.
- Metrics are broadcasted to all connected frontend clients via WebSockets.
- Frontend displays region summaries and live updates.

---

## Getting Started

### Prerequisites

- Node.js v18+
- `pnpm` installed globally
- Git

### Install Dependencies

```bash
pnpm install --frozen-lockfile
```

### Running Locally

**Backend**

```bash
pnpm --filter backend start
```

**Frontend**

```bash
pnpm --filter frontend dev
```

Frontend connects automatically to:

```text
ws://localhost:3000
```

---

## Environment Variables

### Backend

Create a `.env` or `.env.production`:

```env
PORT=3000
```

### Frontend

Create `.env` (for dev) and `.env.production`:

```env
VITE_WS_URL=ws://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
```

> On Render, set `VITE_WS_URL` to your backend's live URL.

> **Note:** `.env` and `.env.production` should be **gitignored**.

---

## Scripts

Run these commands from the monorepo root:

```bash
# Lint
pnpm run lint

# Format
pnpm exec prettier --check .

# Test
pnpm run test
pnpm run test:watch
pnpm run test:coverage

# Build
pnpm --filter backend build
pnpm --filter frontend build

# Dev
pnpm --filter backend start
pnpm --filter frontend dev
```

---

## Testing

- Uses **Vitest** and **Testing Library** for unit and integration tests.
- CI pipeline automatically runs tests on PRs and pushes.

---

## CI/CD Pipeline

- **Lint** → **Format** → **Test** → **Build** → **Deploy**
- Configured with GitHub Actions.
- Deploys backend and frontend automatically to **Render**.

---

## Deployment

**Backend**

- Deploy as a Render Web Service.
- Build Command:

```bash
pnpm install --frozen-lockfile && pnpm --filter backend build
```

- Start Command:

```bash
pnpm --filter backend start
```

**Frontend**

- Deploy as a Render Web Service.
- Build Command:

```bash
pnpm install --frozen-lockfile && pnpm --filter frontend build
```

- Environment Variable:

```env
VITE_WS_URL=<your-backend-live-url>
```

---

## License

MIT © Your Name

