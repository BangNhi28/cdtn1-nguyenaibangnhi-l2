# Deployment Guide — Smart CRM L2 (Prototype v1.0)

**Author:** Nguyen Ai Bang Nhi · MSSV 2374802010368 · SE track  
**Repository:** `https://github.com/BangNhi28/cdtn1-nguyenaibangnhi-l2`

This guide describes how to run the L2 warranty intake prototype with **at most two shell commands** using Docker (recommended). Manual Node.js deployment is documented in the root `README.md`.

---

## 1. Prerequisites

- **Docker** 24+ with Docker Compose v2 (`docker compose …`)
- **Git** (to clone the public repo)
- **Ports:** host port **3001** must be free
- **Secrets:** do not commit `.env`. For Docker quick start, SQLite is used inside the container (no Aiven password required). For cloud MySQL, copy `.env.example` to `.env` and set `MYSQL_*` before building (see §5).

---

## 2. Quick start (two commands)

From the repository root:

```bash
git clone https://github.com/BangNhi28/cdtn1-nguyenaibangnhi-l2.git
cd cdtn1-nguyenaibangnhi-l2
```

**Command 1** — prepare environment file (SQLite defaults):

```bash
cp .env.example .env
```

On Windows CMD: `copy .env.example .env`

**Command 2** — build and start:

```bash
docker compose up -d --build
```

Open **http://localhost:3001** → login page. Sample users: `nv1` / `123456`, `ql1` / `123456`.

The container runs `migrate` → `seed` → `start` on boot. Data is stored in the named volume `smartcrm-data`.

---

## 3. Health check and smoke test

| Check | Command / URL | Expected |
|--------|----------------|----------|
| Health | `curl -s http://localhost:3001/api/health` | `{"ok":true,"db":"sqlite"}` |
| Login | `POST /api/login` JSON `{"username":"nv1","password":"123456"}` | HTTP 200 + `token` |
| Protected API | `GET /api/tickets` without `Authorization` | HTTP 401 |
| UI | Browser → `/login.html` | Form loads; after login, ticket list shows `BH-000001/2026` |

Docker healthcheck polls `/api/health` every 30s (see `Dockerfile` and `docker-compose.yml`).

Stop stack: `docker compose down`. Remove data volume: `docker compose down -v` (resets DB).

---

## 4. CI / quality gate

GitHub Actions workflow `.github/workflows/ci.yml` runs on push/PR to `main`:

```bash
npm ci && npm test
```

Expected: **18 tests pass**, **11 suites**, **0 failures** (SQLite in-memory, no external DB).

---

## 5. Production notes (optional MySQL)

To point the app at **Aiven MySQL** instead of SQLite:

1. Set `MYSQL_PASSWORD` (and host/user/database) in `.env`.
2. Leave `docker-compose.yml` as-is only if you inject env vars, **or** run locally: `npm install && npm run migrate && npm run seed && npm start`.
3. Never commit `.env` or paste real passwords into issues/PDFs.

Rotate Aiven credentials if they were ever exposed. Use read-only monitoring on `/api/health` only from trusted networks.

### Security when moving beyond localhost (Session 15 / SE track)

- **HTTPS:** Terminate TLS on a reverse proxy (nginx, Caddy, cloud load balancer). Set `TRUST_PROXY=1` so Express reads `X-Forwarded-Proto`. Do not put tokens or passwords in query strings.
- **CORS:** If the UI is hosted on another origin, set `CORS_ORIGINS` (comma-separated) in `.env`. Do not use `origin: '*'` with credentials.
- **Auth:** This prototype uses in-memory Bearer tokens after `POST /api/login`. Production should use short-lived JWT access tokens + hashed refresh storage; document any change in `docs/api-docs/API.md`.
- **Secrets:** Only via environment variables (`.env`, not committed). See `docs/checklist-bao-mat.md` for the seven mandatory self-check items.

### Public demo (Render + optional Vercel)

The prototype is a Node/Express app with static files in `public/`. **Render** hosts the full app (this is the URL to put on the BT3 cover). **Vercel** can host only the UI; it cannot run SQLite/Express sessions reliably.

1. Push `main` to GitHub.
2. Render → New Web Service → this repo → Node, build `npm ci`, start `npm run migrate && npm run seed && npm start`, Node 22. Do **not** set `MYSQL_PASSWORD` (use SQLite).
3. Open `https://<service>.onrender.com/api/health` then `/login.html` (`nv1` / `123456`).
4. Optional Vercel: Root Directory `public`; set `window.SMARTCRM_API` in `public/js/env.js` to the Render origin; on Render set `CORS_ORIGINS` to the Vercel origin.

Free Render may sleep after idle; open the URL 1–2 minutes before grading.

**Release tag:** after BT3 submission, tag `v1.0` on the commit that includes this deployment pack:

```bash
git tag -a v1.0 -m "BT3: test, Docker pack, deployment docs"
git push origin v1.0
```

---

## Document map

| File | Purpose |
|------|---------|
| `docs/test-plan.md` | Scope and test types |
| `docs/test-report.md` | 12 manual/auto cases with evidence |
| `docs/bug-log.md` | Defects and fix commits |
| `docs/checklist-bao-mat.md` | Security self-check |
| `docs/api-docs/API.md` | REST reference (English) |
