# Code map

## Directory map (top paths)
- `src/main.tsx` — React root render + router + Redux provider (`src/main.tsx:9`).
- `src/App.tsx` — route definitions (`src/App.tsx:11`).
- `src/app/` — Redux store + typed hooks.
- `src/app/redux/features/apiSlice.ts` — RAWG RTK Query endpoints (`src/app/redux/features/apiSlice.ts:14`).
- `src/app/redux/features/favoriteSlice.ts` — favorites state (`src/app/redux/features/favoriteSlice.ts:14`).
- `src/components/FavoritesSync/FavoritesSync.tsx` — mirrors Firestore favorites into Redux (`src/components/FavoritesSync/FavoritesSync.tsx:1`).
- `src/components/GameContentPlan/GameContentPlan.tsx` — renders filtered platform compatibility cards plus DLC and same-series recommendations on the game detail page (`src/components/GameContentPlan/GameContentPlan.tsx:1`).
- `src/components/RequireAuth/RequireAuth.tsx` — auth gate for protected route content (`src/components/RequireAuth/RequireAuth.tsx:1`).
- `src/lib/userFavorites.ts` — Firestore favorites CRUD + subscription transport (`src/lib/userFavorites.ts:1`).
- `src/page/` — route-level pages.
- `src/layouts/` — layout wrappers (`src/layouts/MainLayout.tsx:9`).
- `src/components/` — reusable components (cards, filters, header, skeletons).
- `src/@types/types.ts` — RAWG response types.
- `server/rawgProxy.js` — shared RAWG proxy logic for local dev and Netlify (`server/rawgProxy.js:1`).
- `netlify/functions/rawg.js` — production RAWG proxy entrypoint for Netlify (`netlify/functions/rawg.js:1`).
- `public/_redirects` — Netlify routing configuration for RAWG proxy + SPA fallback (`public/_redirects:1`).

## Important config files
- `package.json` — scripts + dependency versions.
- `vite.config.ts` — Vite config.
- `tsconfig.json` — TypeScript compiler options (strict, noEmit, bundler mode).
- `tailwind.config.js` / `postcss.config.js` — styling toolchain config.
- `.eslintrc.cjs` — lint rules and plugins.

## Notable scripts
- `npm run dev` — run Vite dev server.
- `npm run build` — typecheck + build (`tsc && vite build`).
- `npm run preview` — preview production build.
- `npm run lint` — lint `src/` with max warnings 0.

## Ignored paths and rationale (documentation sampling)
- `node_modules/`, `node_modules 2/` — dependency vendor content.
- `dist/` — build output.
