# AI agents guide

## Coding conventions
- TypeScript + React function components; keep changes small and consistent with existing patterns.
- Follow ESLint + TypeScript strictness; validate with `npm run build` and `npm run lint`.
- Styling is primarily Tailwind utilities, with some Sass/CSS files when needed.

## Where to make changes safely
- Routes/pages: `src/page/` and `src/App.tsx:11`.
- Shared UI: `src/components/`.
- Global layout: `src/layouts/MainLayout.tsx:9`.
- API calls: `src/app/redux/features/apiSlice.ts:14`.
- Local state: `src/app/redux/features/favoriteSlice.ts:14`.
- Types: `src/@types/types.ts:1`.

## Guardrails
- Do not read or commit secret `.env` values; use `.env.example` for variable names only.
- Prefer updating/adding RTK Query endpoints over ad-hoc fetch calls, to keep caching consistent.
- Avoid touching build output (`dist/`) or vendor dirs (`node_modules/`).

