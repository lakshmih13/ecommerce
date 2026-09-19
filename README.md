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

## Next steps

- **Level 2**: rebuild the frontend in React and add JWT authentication.
- **Level 3**: full deployment + WebSocket-based live stock/order notifications.
