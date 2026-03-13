# Platform Compatibility & Content Plan

Status: completed
Owner: Codex
Started: 2026-03-13
Completed: 2026-03-13

## Goal
Add a richer game-detail module that explains per-platform release context and requirements, while also surfacing DLC and same-series recommendations without introducing new RAWG transport paths.

## Why Now
The detail page already fetches the underlying RAWG data, but it does not yet turn that data into a clear player decision aid or preserve the user's platform context from catalog browsing.

## Constraints
- Keep RAWG API access centralized in `src/app/redux/features/apiSlice.ts`.
- Preserve the route tree owner in `src/App.tsx`; only extend route behavior with query params.
- Keep docs in `docs/` aligned with runtime behavior in the same change.
- Run `npm run harness:check` after doc updates and `npm run verify` before handoff.

## Plan
1. Carry the selected platform from the catalog into `/game/:id` via an optional `platform` query param.
2. Refactor the detail page into a hybrid compatibility/content module that renders platform requirements, DLC, and same-series recommendations from existing RTK Query hooks.
3. Update execution/docs artifacts and run verification before handoff.

## Progress Log
- 2026-03-13: reviewed the existing game detail page, RTK Query endpoints, and platform filter flow.
- 2026-03-13: created `codex/platform-compatibility-content-plan` and implemented platform query-param linking plus the new compatibility/content module.
- 2026-03-13: updated project facts/code map docs and queued full verification.

## Verification
- `npm run harness:check`
- `npm run verify`

## Harness Follow-Ups
- Keep the documented optional `platform` query param in sync if the detail route behavior changes again.
- If review feedback reveals new route/query drift risks, extend harness checks or docs accordingly.
