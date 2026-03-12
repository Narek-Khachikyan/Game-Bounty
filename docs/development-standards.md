# Development standards

## Table of contents
- [Architecture overview](#architecture-overview)
- [Project principles](#project-principles)
- [Layer responsibilities](#layer-responsibilities)
- [Data contracts](#data-contracts)
- [Error handling](#error-handling)
- [Logging standards](#logging-standards)
- [Configuration management](#configuration-management)
- [Testing standards](#testing-standards)
- [Security & compliance](#security--compliance)
- [Directory layout](#directory-layout)
- [Design principles](#design-principles)
- [Failure handling & resilience](#failure-handling--resilience)

## Architecture overview
- Pattern: frontend SPA with a thin data-access layer via RTK Query.
- Core components:
  - Routing: `src/App.tsx:11`
  - Layout: `src/layouts/MainLayout.tsx:9`
  - Data fetching: `src/app/redux/features/apiSlice.ts:14`
  - Favorites sync state: `src/app/redux/features/favoriteSlice.ts:14`
- Stack and versions: source of truth is `package.json`.

## Project principles
- Keep changes localized (prefer component/module-level edits over cross-cutting rewrites).
- Prefer RTK Query for server data; prefer Redux slice actions for local state.
- No secret leakage: never commit real API keys; do not paste `.env.local` contents into issues/PRs.
- Treat `docs/` as the system of record; update docs and code together.
- For multi-step or risky changes, create or update an execution plan in `docs/exec-plans/`.
- If a review finding reveals a repeated failure mode, strengthen the harness with a doc or check.

## Layer responsibilities
- UI (components/pages/layouts)
  - Renders and handles user interaction.
  - May call RTK Query hooks and dispatch Redux actions.
- Data access (RTK Query)
  - Owns RAWG endpoints, query params, and caching behavior.
  - Prohibited: direct `fetch` calls scattered across UI when an RTK Query endpoint exists.
- State (Redux slices)
  - Owns UI-facing state and derived selectors for signed-in favorites.

## Data contracts
- RAWG response shapes are represented as TypeScript types in `src/@types/types.ts:1`.
- Update types alongside any changes to endpoint usage or UI expectations.

## Error handling
- Treat RAWG calls as unreliable: UI should handle loading/empty/error states (project-specific implementations live in `src/components/`).
- Do not throw errors across React render paths; prefer rendering a fallback UI.

## Logging standards
- Not applicable (no centralized logging/telemetry configured).
- Avoid logging API keys or user-specific data to the console.

## Configuration management
- Source: Vite env variables (`import.meta.env.*`), documented via `.env.example:1`.
- Required:
  - `VITE_API_KEY`
- Do not store secrets in code; do not commit `.env.local` with real values.

## Testing standards
- Not applicable (no test runner configured).
- Quality gates before review:
  - `npm run harness:check`
  - `npm run build`
  - `npm run lint`

## Security & compliance
- Assume the RAWG key is public when shipped to the browser (client-side env embedding).
- Firebase favorites rules must stay scoped to `request.auth.uid` for `users/{uid}/favorites`.
- Keep dependencies updated and avoid introducing new ones unless needed.

## Directory layout
- Source of truth: `src/` (see `docs/code-map.md` for the high-level layout).
- Place new UI in `src/components/` (reusable) or `src/page/` (route-level).
- Place new RAWG endpoints in `src/app/redux/features/apiSlice.ts`.
- Place new local slices under `src/app/redux/features/`.

## Design principles
- Naming: React components use `PascalCase`; hooks use `useX`.
- Keep components focused; avoid mixing data fetching, complex transforms, and layout when it can be separated cleanly.
- Pre-review validation:
  - `npm run build`
  - `npm run lint`

## Failure handling & resilience
- Prefer graceful UI fallbacks for network failures (loading, retry, empty states).
- Avoid blocking the entire app on a single failed request when partial content can still render.

## Harness maintenance
- The current project harness is documented in `docs/harness.md`.
- Architecture rules enforced mechanically are listed in `docs/architecture-invariants.md`.
- Keep plans as versioned repo artifacts under `docs/exec-plans/` instead of relying on chat-only context.
