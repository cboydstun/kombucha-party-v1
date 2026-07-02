# Kombucha Party

A full-stack e-commerce site for a kombucha brand — product catalog, cart, Stripe checkout, a blog with authenticated authoring, and contact/FAQ pages.

## Stack

- **Client** — React 19 + Vite 8 SPA, Tailwind 4, react-router 7. Vercel Analytics + Formspree.
- **Server** — Express 5 API (ESM) that also serves the built client. MongoDB via Mongoose, JWT auth, bcrypt, Helmet.
- **Payments** — Stripe Checkout, driven by a Vercel serverless function in the client (`client/api/`).
- **Deploy** — Render (`render.yaml`), single web service.

## Layout

Three-part monorepo, no workspace tooling — each part has its own `package.json` and `node_modules`. Run npm commands from inside the part you're touching.

```
.              # orchestration only — prettier + format script
├── server/    # Express API + static host for the built client
└── client/    # React + Vite SPA (includes Stripe serverless fn in api/)
```

## How the pieces connect

**Serving model** — `server/index.js` serves `client/dist/` as static files with an SPA catch-all fallback to `index.html`, and mounts the API on the same port (8080). For a production-like run, build the client first, then start the server. During frontend work, use the Vite dev server and let its proxy forward `/api` → `http://localhost:8080`.

**API** — all routes under `/api/v1`: `healthRoutes`, `blogRoutes`, `auth`. Blog reads are public; writes (`POST/PUT/PATCH/DELETE`) require `authMiddleware`.

**Auth** — MongoDB-backed. Registration hashes passwords with bcrypt; login issues a JWT (1h expiry) signed with `JWT_SECRET`. `authMiddleware` verifies `Authorization: Bearer <token>`. The client stores the token in `localStorage` via `AuthContext`.

**Cart & checkout** — cart is a `useReducer` store (`CartContext`) keyed by `product.id`. Checkout posts `{ id, qty }` to `client/api/create-checkout-session.js`, which loads `products.json` server-side so prices are never trusted from the browser.

## Getting started

Prereqs: Node, a MongoDB Atlas connection string, and a Stripe secret key.

**Server** (`cd server`):

```bash
npm install
cp .env.example .env   # fill in PORT, MONGODB_URI, JWT_SECRET
npm run dev            # nodemon, port 8080
```

**Client** (`cd client`):

```bash
npm install
npm run dev            # Vite HMR dev server, proxies /api → :8080
```

Open the Vite URL. The API must be running for auth, blog, and checkout to work.

### Production-like run

```bash
cd client && npm run build   # → client/dist/
cd ../server && npm start     # serves the built app + API on :8080
```

## Environment

| Var                 | Where                       | Purpose                         |
| ------------------- | --------------------------- | ------------------------------- |
| `PORT`              | server                      | API/static port (default 8080)  |
| `MONGODB_URI`       | server                      | MongoDB Atlas connection string |
| `JWT_SECRET`        | server                      | JWT signing secret              |
| `STRIPE_SECRET_KEY` | client `api/` serverless fn | Stripe Checkout                 |
| `VITE_*`            | client (build time)         | Client-side config              |

## Scripts

- Root — `npm run format` (Prettier over the tree)
- Server — `npm run dev`, `npm start`
- Client — `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

No test runner is configured in either part.

## Conventions

- JSX, not TypeScript — no type-check step (`@types/react` is editor-only).
- `client/src/assets/` = imported assets; `client/public/` = served verbatim at site root.
- Routes centralized in `client/src/router.jsx`; `App.jsx` is the shell (nav + `<Outlet>`).
