# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the repo
- `npm test` / `npm run test:watch` — Jest

## Testing

Jest + jsdom + React Testing Library. Because `package.json` is `"type": "module"` and Jest can't consume Vite's ESM/JSX directly, tests run through a `babel-jest` transform layer with **`.cjs` config files** (`babel.config.cjs`, `jest.config.cjs`) — an ESM Babel config would break under `type: module`. Vite's own build is untouched by this.

Tests live next to their source as `*.test.{js,jsx}` under `src/`. `src/setupTests.js` loads `@testing-library/jest-dom` matchers and polyfills `TextEncoder`/`TextDecoder`, which jsdom omits but `react-router` needs at import time. CSS imports map to `identity-obj-proxy`; static assets map to `__mocks__/fileMock.cjs`.

`src/components/ProductCard.test.jsx` is the reference example — a component render wrapped in `MemoryRouter` + `CartProvider`.

## Architecture

Single-page React 19 app bootstrapped with Vite 8. Entry chain: `index.html` → `src/main.jsx` → `src/App.jsx`. `main.jsx` wraps the app in `AuthProvider` then `CartProvider`, then renders `<RouterProvider>`. Routes live in `src/router.jsx`; `App.jsx` is the layout shell (nav + `<Outlet>`). Pages in `src/pages/`, shared components in `src/components/`, contexts in `src/context/`.

The Vite dev server proxies `/api` → `http://localhost:8080` (the Express server in `../server`). Stripe checkout is a Vercel serverless function at `api/create-checkout-session.js` (Node runtime — ESLint applies Node globals to `api/`). See the root `CLAUDE.md` for how client and server connect.

Key conventions to match existing code:

- **JSX, not TypeScript.** Source files are `.jsx`/`.js`. `@types/react` is installed for editor support, but there is no `tsconfig.json` and no type-checking step.
- Static assets imported into components live in `src/assets/`; files served verbatim at the site root (referenced via absolute paths like `/icons.svg`) live in `public/`.
- ESLint uses the flat-config format in `eslint.config.js` (`@eslint/js` recommended + `react-hooks` + `react-refresh`), ignores `dist/`, and assumes browser globals. The `react-refresh/only-export-components` rule means component files should export only components.
