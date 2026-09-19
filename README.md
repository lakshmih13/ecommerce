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

## Next steps

- **Level 3**: full deployment + WebSocket-based live stock/order notifications.
