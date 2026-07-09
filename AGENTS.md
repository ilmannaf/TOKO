# AGENTS

## Purpose
This repository has a split frontend and backend design.
AI coding agents should prioritize backend endpoint behavior and frontend endpoint usage when making changes.

## Key areas
- `backend/` contains the Express API server and database connection.
- `frontend/` contains static HTML/JS pages that call backend endpoints directly.

## Backend entrypoint
- `backend/server.js` starts the server.
- Run locally from the repo root with:
  - `cd backend && npm install`
  - `npm run dev`

## API endpoints
The backend exposes these primary endpoints:

### Auth
- `POST /api/auth/register`
  - Registers a new user.
  - Expects `{ nama, email, password }` in JSON body.
- `POST /api/auth/login`
  - Authenticates a user.
  - Expects `{ email, password }` in JSON body.
- `GET /api/auth/me`
  - Returns the current user profile.
  - Requires `Authorization: Bearer <token>` header.

### Orders
- `POST /api/orders`
  - Creates a new order.
  - Expects order metadata plus `items` array.
- `GET /api/orders/:nomor`
  - Fetches a specific order by order number.
- `GET /api/orders/user/:user_id`
  - Fetches orders belonging to a user.
- `PATCH /api/orders/:nomor/status`
  - Updates order status.
  - Accepts `{ status }` in JSON body.

## Frontend endpoint usage
- `frontend/js/auth.js` uses `http://localhost:3000/api/auth` as the auth base URL.
- `frontend/login.html` and `frontend/register.html` call `/api/auth/login` and `/api/auth/register`.
- `frontend/Checkout.html` posts to `http://localhost:3000/api/orders`.
- `frontend/Tracking.html` fetches `http://localhost:3000/api/orders/:nomor`.

## Environment variables
The backend reads configuration from `.env` via `dotenv` in `backend/server.js` and `backend/database/database.js`.
- `PORT`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Guidance for AI agents
- Treat backend routes as authoritative source of endpoint contracts.
- Preserve existing endpoint paths and response shapes when editing frontend code.
- Prefer backend changes in `backend/` and frontend static UI changes in `frontend/`.
- If adding endpoints or changing request formats, update both the backend route and the frontend fetch usage.

## Notes
- There is no top-level `package.json`; backend package management is under `backend/`.
- The app currently uses `http://localhost:3000` hard-coded in the frontend.
