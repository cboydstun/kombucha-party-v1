# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

Three-part monorepo, no workspace tooling — each part has its own `package.json` and `node_modules`:

- **root** — orchestration only. No app code. Just `prettier` and a `format` script.
- **`server/`** — Express 5 API + static host (ESM, `"type": "module"`).
- **`client/`** — React 19 + Vite 8 SPA (Tailwind 4, react-router 7).

`server/` and `client/` are effectively separate projects; run npm commands from inside whichever one you're touching.

## Commands

Server (`cd server`):

- `npm run dev` — nodemon, port 8080
- `npm start` — plain node
- `npm test` — Jest (native ESM, no Babel) + supertest; see `server/README.md`

Client (`cd client`):

- `npm run dev` — Vite HMR dev server; proxies `/api` → `http://localhost:8080` (see `vite.config.js`)
- `npm run build` — production build to `client/dist/`
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm test` — Jest (jsdom + React Testing Library, via `babel-jest`; see `client/CLAUDE.md`)

Root: `npm run format` — Prettier over the tree.

## How the pieces connect

**Serving model:** `server/app.js` holds the Express app — it serves `client/dist/` as static files and has an SPA catch-all fallback to `index.html`. `server/index.js` is the entry point: it connects to MongoDB and calls `listen()`. The split exists so tests can import the app without a database or a bound port. So for a production-like run you must `cd client && npm run build` first, then start the server — it serves the built React app _and_ the API from port 8080. During active frontend work, use the Vite dev server instead and let its proxy forward `/api` to the running Express server.

**API:** all routes under `/api/v1` — `healthRoutes`, `blogRoutes`, `auth`. Blog reads are public; writes (`POST/PUT/PATCH/DELETE`) require `authMiddleware`.

**Auth (real implementation):** MongoDB-backed. `authController` registers users with bcrypt-hashed passwords and issues JWTs (`jwt.sign`, 1h expiry) signed with `JWT_SECRET`. `authMiddleware` reads `Authorization: Bearer <token>` and verifies the JWT. On the client, `AuthContext` stores the token in `localStorage`.

**Database:** Mongoose → MongoDB Atlas via `MONGODB_URI` (`server/data/database.js`). Models: `User`, `Blog`.

**Client state:** two React contexts wrap the app in `main.jsx` — `AuthProvider` then `CartProvider`. Routes are centralized in `src/router.jsx`; `App.jsx` is the shell (nav + `<Outlet>`). Cart is a `useReducer` store keyed by `product.id`.

**Checkout:** Stripe. `client/api/create-checkout-session.js` is a **Vercel serverless function** (Node runtime) — note it lives in the _client_, separate from the Express server. It loads `products.json` server-side so prices are never trusted from the client; the browser sends only `{ id, qty }`.

## Environment & leftovers

Env vars the code actually reads: `PORT`, `MONGODB_URI`, `JWT_SECRET` (server), `STRIPE_SECRET_KEY` (client `api/` serverless fn), plus `VITE_*` keys at client build time. `server/.env.example` lists the server ones.

`server/db.json` is a leftover from an earlier flat-file design and is unused — the app is fully MongoDB-backed now. Safe to ignore; delete if cleaning up.

## Conventions

- **JSX, not TypeScript.** No `tsconfig`, no type-check step. `@types/react` is editor-only.
- Client `src/assets/` = imported assets; `client/public/` = served verbatim at site root (e.g. `/icons.svg`).
- ESLint `react-refresh/only-export-components` is on — context files disable it inline to co-locate hooks with providers. Match that pattern.
- ESLint applies browser globals to `src/`, Node globals to `client/api/`.
