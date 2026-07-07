# Arcade Magazine Redesign

Status: completed
Owner: OpenCode
Started: 2026-07-07
Completed: 2026-07-07

## Goal
Replace the current dark bounty/dossier visual direction with a distinctive arcade magazine catalog style across the SPA while preserving existing React routing, RAWG data flow, Firebase auth, favorites behavior, and accessibility guardrails.

## Why Now
The current UI has useful product metaphors but still reads like generic AI-generated dark SaaS. The user explicitly requested a full visual reset using the repo skills, and selected an Arcade Magazine direction.

## Constraints
- Keep RAWG transport centralized in `src/app/redux/features/apiSlice.ts`.
- Keep top-level routes centralized in `src/App.tsx`.
- Do not change Firebase auth or favorites persistence behavior.
- Preserve reduced-motion handling, visible focus states, and mobile support from 320px upward.
- Prefer scoped CSS/Tailwind changes over broad component rewrites unless markup changes improve hierarchy or state clarity.

## Plan
1. Add Arcade Magazine tokens and shared primitives for paper, ink, poster, action, chip, panel, and focus states.
2. Redesign shell/header, catalog hero, filters, game cards, skeletons, and loading/empty/error states.
3. Redesign game details, related-content cards, favorites, auth, and not-found screens to use the same magazine visual grammar.
4. Run harness, lint, build, and practical visual checks; record verification results.

## Progress Log
- 2026-07-07: started Arcade Magazine redesign execution plan.
- 2026-07-07: added Arcade Magazine palette, display typography, paper/ink shared primitives, and poster-style global surfaces.
- 2026-07-07: redesigned header, catalog, filters, game cards, details, related content, favorites, auth, not-found, loading, empty, and error states.
- 2026-07-07: updated `RequireAuth` test routing to satisfy the route-centralization harness without changing app routing behavior.
- 2026-07-07: completed verification with `npm run verify`.

## Verification
- Passed: `npm run verify`
- Included: `npm run harness:check`, `npm run test:typecheck`, `npm run test`, `npm run firestore:rules:test`, `npm run lint`, and `npm run build`.
- Build warnings observed: existing Browserslist update notice, Sass legacy JS API deprecation warnings, and Vite chunk-size warning.
- Browser screenshots/manual viewport checks were not run in this session.

## Harness Follow-Ups
- No harness rule changes were needed. The existing route-centralization harness exposed JSX `<Route>` usage in a test file, which was fixed by switching that test helper to object-based `useRoutes`.
