# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the repo

There is no test runner configured yet; `package.json` has no `test` script and no testing dependencies are installed.

## Architecture

Single-page React 19 app bootstrapped with Vite 8. The entry chain is `index.html` → `src/main.jsx` (mounts `<App>` into `#root` under `<StrictMode>`) → `src/App.jsx`. The codebase is currently the default Vite starter scaffold — `App.jsx` is the only real component.

Key conventions to match existing code:

- **JSX, not TypeScript.** Source files are `.jsx`/`.js`. `@types/react` is installed for editor support, but there is no `tsconfig.json` and no type-checking step.
- Static assets imported into components live in `src/assets/`; files served verbatim at the site root (referenced via absolute paths like `/icons.svg`) live in `public/`.
- ESLint uses the flat-config format in `eslint.config.js` (`@eslint/js` recommended + `react-hooks` + `react-refresh`), ignores `dist/`, and assumes browser globals. The `react-refresh/only-export-components` rule means component files should export only components.
