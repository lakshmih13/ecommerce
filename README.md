# Codveda E-Commerce Catalog — Level 1 (Basic)

PERN-stack product catalog for the Codveda Technology Full-Stack Development internship.

## Tasks covered
- **Task 1 — Setup Development Environment**: see steps below.
- **Task 2 — Build a Simple REST API**: `backend/` (Express + PostgreSQL, full CRUD on `products`).
- **Task 3 — Frontend with HTML, CSS, and JavaScript**: `frontend-vanilla/` (fetches and manages products via the API).

## 1. Setup Development Environment

1. Install [Node.js](https://nodejs.org) (LTS) — includes npm.
2. Install [PostgreSQL](https://www.postgresql.org/download/) and make sure the `psql` CLI works.
3. Install [Git](https://git-scm.com) and [VS Code](https://code.visualstudio.com).
4. Create a GitHub repo and push this project:
   ```bash
   cd codveda-ecommerce
   git init
   git add .
   git commit -m "Level 1: REST API + vanilla JS frontend"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## 2. Database

```bash
# create the database
createdb codveda_ecommerce

# load schema + seed data
psql -U postgres -d codveda_ecommerce -f backend/db/schema.sql
```

## 3. Backend (REST API)

```bash
cd backend
npm install
cp .env.example .env   # fill in your Postgres credentials
npm run dev            # starts on http://localhost:5000
```

Endpoints:
| Method | Route | Description |
|---|---|---|
| GET | /api/products | List all products |
| GET | /api/products/:id | Get one product |
| POST | /api/products | Create a product |
| PUT | /api/products/:id | Update a product |
| DELETE | /api/products/:id | Delete a product |

Test with Postman/Thunder Client, or just open `frontend-vanilla/index.html`.

## 4. Frontend

Open `frontend-vanilla/index.html` directly in a browser (or serve it with the VS Code
Live Server extension). It talks to the API at `http://localhost:5000`.

## Level 2 (Intermediate): React frontend + JWT Auth

Covers:
- **Task 1 — Frontend with a JavaScript Framework**: `frontend-react/` (Vite + React, replaces the vanilla frontend).
- **Task 2 — Authentication and Authorization**: signup/login with bcrypt + JWT, role-based access (admin vs. user) enforced on the backend and reflected in the UI.

### 1. Update the database

The users table is new — reload the schema (safe to re-run, it uses `CREATE TABLE IF NOT EXISTS` and `ON CONFLICT DO NOTHING`):

```bash
psql -U postgres -d codveda_ecommerce -f backend/db/schema.sql
```

### 2. Update the backend

```bash
cd backend
npm install        # picks up bcrypt + jsonwebtoken
```

Add these two lines to `backend/.env` (see `.env.example`):
```
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
```

Restart the server (`npm run dev`). New endpoints:

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | — | Create an account. **First user to sign up becomes admin automatically.** |
| POST | /api/auth/login | — | Log in, returns a JWT |
| GET | /api/auth/me | Bearer token | Returns the logged-in user |
| POST/PUT/DELETE | /api/products... | Bearer token, admin role | Now protected — only admins can modify products |
| GET | /api/products... | — | Still public, anyone can browse |

### 3. Run the React frontend

```bash
cd frontend-react
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Sign up — your first account is an admin, so you'll see the Add/Edit/Delete form. Sign up a second account from an incognito window to see the read-only viewer experience.

The old `frontend-vanilla/` still works independently against the same API (product browsing only, since it has no login).

## Level 3 (Advanced): Full Deployment + Real-Time WebSockets

Covers:
- **Task 1 — Build a Full-Stack Application (PERN)**: the app is now fully integrated (auth, DB, frontend), hardened with `helmet` + `compression` + `morgan`, and containerized for deployment.
- **Task 2 — WebSockets for Real-Time Communication**: `socket.io` pushes live product create/update/delete events and low-stock alerts to every connected browser — no polling or manual refresh needed.

### 1. Update dependencies

```bash
cd backend && npm install   # adds socket.io, helmet, compression, morgan
cd ../frontend-react && npm install   # adds socket.io-client
```

### 2. What's new

- Any admin action (add/edit/delete a product) now broadcasts instantly to every open browser tab — try it: open the catalog in two windows, one as admin, one as a regular user, and watch changes appear live in both with a toast notification.
- A "● Live / ○ Reconnecting..." badge shows the WebSocket connection status.
- Editing a product's stock to 5 or below triggers a low-stock notification.
- The API URLs are now configurable via `frontend-react/.env` (`VITE_API_URL`, `VITE_SOCKET_URL`) instead of being hardcoded, so the same build works locally and once deployed.

Run it the same way as before (`npm run dev` in both `backend/` and `frontend-react/`) — no new setup steps for local dev beyond `npm install`.

### 3. Run everything with Docker (optional, easiest full-stack deploy)

If you have Docker Desktop installed:

```bash
docker compose up --build
```

This spins up PostgreSQL (schema auto-loaded), the backend on port 5000, and the frontend (built + served by nginx) on port 5173 — one command, no manual `.env` juggling.

### 4. Deploying for real (free-tier hosting)

A common free-tier combo for a PERN app:

| Piece | Where | Notes |
|---|---|---|
| PostgreSQL | [Render](https://render.com) or [Neon](https://neon.tech) | Both have free Postgres instances; copy the connection details into your backend's env vars |
| Backend (Express + Socket.io) | [Render](https://render.com) Web Service | Set `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `JWT_SECRET`, and `CLIENT_ORIGIN` (your deployed frontend URL) as environment variables there |
| Frontend (React/Vite) | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Set `VITE_API_URL` and `VITE_SOCKET_URL` to your deployed backend's URL in the project's environment variable settings, then deploy |

General steps for any of these:
1. Push this repo to GitHub (already done).
2. Connect the repo to Render (backend) — set the root directory to `backend`, build command `npm install`, start command `node src/server.js`, and add the env vars above.
3. Connect the repo to Vercel/Netlify (frontend) — set the root directory to `frontend-react`, build command `npm run build`, output directory `dist`, and add the `VITE_*` env vars pointing at your Render backend URL.
4. Once both are live, update the backend's `CLIENT_ORIGIN` env var to the deployed frontend URL (for CORS) and redeploy.

This part depends on accounts/services outside this environment, so it isn't run automatically here — but everything above (Dockerfiles, compose file, env-based config) is already set up to make it a straightforward click-through once you have accounts on those platforms.

## Redesign + Cart & Checkout (extra feature)

The React frontend has been restyled (warm paper background, stamped price tags, Fraunces + IBM Plex Sans typography) and gained a full cart/checkout flow:

- Logged-in non-admin users see an **Add to Cart** button on each product instead of edit/delete controls.
- The cart icon in the header opens a slide-out drawer to adjust quantities and place an order.
- Placing an order hits a new `POST /api/orders` endpoint, decrements stock, and broadcasts an `order:created` WebSocket event.
- Admins see a live "New order" toast the instant anyone checks out, and can view all orders on the new **Orders** page (`/orders`, admin-only nav link).

### Setup for this update

```bash
# reload the schema — adds the new orders table, safe to re-run
psql -U postgres -d codveda_ecommerce -f backend/db/schema.sql
# (or paste backend/db/schema.sql into pgAdmin/Neon's SQL editor)

cd backend && npm install   # no new backend deps, just restart it
cd ../frontend-react && npm install   # no new frontend deps either
```

Restart both `npm run dev` processes to pick up the code changes. New routes:

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/orders | Bearer token (any logged-in user) | Place an order from cart items |
| GET | /api/orders | Bearer token, admin role | List all orders |

## Running the whole application (quick reference)

```bash
# 1. Database — load once (or after schema changes)
psql -U postgres -d codveda_ecommerce -f backend/db/schema.sql

# 2. Backend
cd backend
npm install
npm run dev          # http://localhost:5000

# 3. Frontend (in a separate terminal)
cd frontend-react
npm install
npm run dev           # http://localhost:5173
```

Open `http://localhost:5173`, sign up (first account = admin), and:
- As **admin**: add/edit/delete products, see live order notifications, check the Orders page.
- As a **second account** (regular user, e.g. in an incognito window): browse, add to cart, and check out.
