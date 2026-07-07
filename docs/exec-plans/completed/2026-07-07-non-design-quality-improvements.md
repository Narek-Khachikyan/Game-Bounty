# Non-Design Quality Improvements

Status: completed
Owner: OpenCode
Started: 2026-07-07
Completed: 2026-07-07

## Goal
Improve project quality outside visual design by adding a real frontend test gate, strengthening auth/favorites accessibility and sync resilience, and clarifying game-detail route ownership.

## Why Now
The quality scorecard called out testing and runtime resilience as the weakest areas, while the game detail route was still owned from `src/components/` despite being route-level behavior.

## Constraints
- Preserve existing Vite + React + Redux + RTK Query architecture.
- Keep RAWG transport centralized in `src/app/redux/features/apiSlice.ts`.
- Keep route declarations centralized in `src/App.tsx`.
- Avoid broad visual redesign work.

## Plan
1. Add Vitest + React Testing Library with app/test type-check separation.
2. Cover favorites reducers/selectors, auth redirect helpers, protected-route gating, and favorites sync.
3. Add low-risk accessibility/resilience states for auth and favorites UI.
4. Move game detail route ownership to `src/page/GameDetails.tsx` and make secondary content load/fail independently.
5. Update docs and run verification.

## Progress Log
- 2026-07-07: created `quality/non-design-improvements` branch.
- 2026-07-07: added Vitest scripts, setup, fixtures, and 21 tests across 5 files.
- 2026-07-07: added ARIA live/error states and concrete favorite action labels.
- 2026-07-07: moved game detail route ownership to `src/page/GameDetails.tsx` and added retry/partial-failure handling.
- 2026-07-07: updated docs and scorecard to reflect current state and remaining gaps.
- 2026-07-07: made the Firestore rules test runner honor `FIRESTORE_EMULATOR_HOST` and default to `127.0.0.1:8081` after local port `8080` was occupied by another app.

## Verification
- `npm run test:typecheck`
- `npm run test`
- `npm run lint`
- `npm run build`
- `npm run harness:check`
- `npm run verify` attempted if local Java/Firestore emulator requirements are available.

## Harness Follow-Ups
- Updated `scripts/harness-check.mjs` so `npm run verify` must include Vitest test type-checking and Vitest tests before Firestore rules, linting, and build.
- Updated `scripts/run-firestore-rules-test.mjs` so local port conflicts can be handled without editing code by setting `FIRESTORE_EMULATOR_HOST`.
- Future quality work should add browser-level smoke tests for routes, responsive states, and accessibility checks.
- `npm run build` still reports a large JS chunk and includes a 9.39 MB background video asset; performance measurement/code-splitting remains a follow-up.
