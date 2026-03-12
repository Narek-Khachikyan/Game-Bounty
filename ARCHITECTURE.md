# ARCHITECTURE.md

This file is intentionally short. It is the root architectural entrypoint into the project harness; detailed knowledge lives under `docs/`.

## System Summary
- Runtime: client-side Vite + React + TypeScript SPA
- Data source: RAWG REST API via RTK Query over a same-origin server proxy
- Account favorites: Firebase Authentication + Cloud Firestore synced into Redux UI state
- Deployment shape: static build with SPA redirects

## Primary Entry Points
- App bootstrap: `src/main.tsx`
- Route tree: `src/App.tsx`
- Layout shell: `src/layouts/MainLayout.tsx`
- RAWG transport: `src/app/redux/features/apiSlice.ts`
- RAWG proxy owners: `server/rawgProxy.js`, `vite.config.ts`, `netlify/functions/rawg.js`
- Favorites sync: `src/components/FavoritesSync/FavoritesSync.tsx`
- Favorites persistence transport: `src/lib/userFavorites.ts`

## Read Next
- [docs/README.md](./docs/README.md)
- [docs/architecture.md](./docs/architecture.md)
- [docs/architecture-invariants.md](./docs/architecture-invariants.md)
- [docs/references/project-facts.md](./docs/references/project-facts.md)

## Non-Negotiable Rule
- If implementation changes system behavior or structure, update the matching source-of-truth doc in `docs/` in the same change.
