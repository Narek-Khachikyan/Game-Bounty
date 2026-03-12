# Project Facts

Last verified against the repository on 2026-03-12.

This file records current-state facts. Put durable rules in `docs/architecture-invariants.md`, not here.

## Product And Runtime
- App type: single-package frontend SPA
- Bootstrap entrypoint: `src/main.tsx`
- Route tree owner: `src/App.tsx`
- Shared layout: `src/layouts/MainLayout.tsx`
- External system of record: RAWG REST API

## Data And State
- Server data layer: RTK Query in `src/app/redux/features/apiSlice.ts`
- Local durable state: favorites slice in `src/app/redux/features/favoriteSlice.ts`
- Favorites persistence owner: `src/app/store.ts`
- Background-video preference persistence owner: `src/hooks/useBackgroundVideoGate.ts`
- Environment variable used by runtime: `VITE_API_KEY`

## User-Facing Routes
- `/` renders the game discovery page
- `/game/:id` renders the game detail view
- `/favorites` renders the saved favorites view
- `*` renders the not-found page

## Tooling
- Package manager files present: `package-lock.json`, `yarn.lock`
- Build tool: Vite
- Language: TypeScript
- Lint tool: ESLint
- Styling: Tailwind CSS plus Sass/CSS

## Verification Commands
- `npm run harness:check`
- `npm run lint`
- `npm run build`
- `npm run verify`
