# Project Facts

Last verified against the repository on 2026-03-13.

This file records current-state facts. Put durable rules in `docs/architecture-invariants.md`, not here.

## Product And Runtime
- App type: single-package frontend SPA
- Bootstrap entrypoint: `src/main.tsx`
- Route tree owner: `src/App.tsx`
- Shared layout: `src/layouts/MainLayout.tsx`
- External systems of record: RAWG REST API, Firebase Authentication, Cloud Firestore

## Data And State
- Server data layer: RTK Query in `src/app/redux/features/apiSlice.ts`
- RAWG proxy owner: `server/rawgProxy.js`
- Auth state owner: `src/context/AuthProvider.tsx`
- Favorites UI state owner: `src/app/redux/features/favoriteSlice.ts`
- Favorites sync owner: `src/components/FavoritesSync/FavoritesSync.tsx`
- Favorites persistence transport: `src/lib/userFavorites.ts`
- Background-video preference persistence owner: `src/hooks/useBackgroundVideoGate.ts`
- Server environment variable used by RAWG proxy: `RAWG_API_KEY`

## User-Facing Routes
- `/` renders the game discovery page
- `/game/:id` renders the game detail view and accepts an optional `platform` query param to preserve catalog platform focus
- `/favorites` renders the signed-in user's saved favorites view
- `/auth` renders the Firebase sign-in page
- `*` renders the not-found page

## Tooling
- Package manager files present: `package-lock.json`
- Repo Node.js runtime declaration: `.nvmrc` with Node `20`
- Build tool: Vite
- Language: TypeScript
- Lint tool: ESLint
- Styling: Tailwind CSS plus Sass/CSS

## Verification Commands
- `npm run harness:check`
- `npm run lint`
- `npm run build`
- `npm run verify`
