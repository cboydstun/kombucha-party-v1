# KombuchaParty.store — MVP Milestones

**Stack:** React + Vite · Deployed on Vercel

---

## M1 · Project scaffold & data layer

_Est. 1–2 hrs · Foundation_

- Init Vite + React project, push to GitHub
- Add `data.json` with the 5 products, import as module
- Connect repo to Vercel — auto-deploy on `main`
- Set up component folder structure (`/components`, `/data`, `/pages`)

---

## M2 · Product listing page

_Est. 2–3 hrs · Core UI_

- `ProductCard` component — name, description, price
- `ProductGrid` component mapping over `data.json`
- Global CSS / Tailwind base styles, responsive grid (mobile-first)
- `/` homepage renders the product grid

---

## M3 · Product detail & cart state

_Est. 3–4 hrs · Interactivity_

- `ProductDetail` page or modal — full description, price, CTA
- Cart state via `useState` / `useContext` — add/remove items
- Cart summary component — item count, subtotal
- Client-side routing with React Router (`/` and `/cart`)

> **Note:** Add a `slug` or `id` field to each product in `data.json` before wiring up routing — otherwise React Router has nothing clean to key off of.

---

## M4 · Checkout flow

_Est. 3–5 hrs · Revenue-critical_

- Integrate Stripe Checkout (hosted page) — recommended over Shopify Buy SDK for a simple MVP
- Order confirmation / success page
- Vercel env vars for API keys — never committed to repo
- Optional: post-purchase email via Stripe webhook + Resend

---

## M5 · Polish & launch

_Est. 2–3 hrs · Ship it_

- Point `kombuchaparty.store` domain to Vercel
- Final responsive QA — mobile, tablet, desktop
- Lighthouse audit — fix any perf / accessibility flags
- Add Google Analytics or Plausible for basic traffic visibility
