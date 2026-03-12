# Firebase Authentication

Status: blocked
Owner: Codex
Started: 2026-03-12
Completed: n/a

## Goal
Add Firebase-backed authentication to the SPA so users can sign in with Email/Password or Google while keeping the existing RAWG browsing flow intact.

## Why Now
The project currently has no authentication layer, and the requested Firebase credentials and providers need to be wired into the client app in a way that matches the existing Vite + React architecture.

## Constraints
- Preserve the current route-tree ownership in `src/App.tsx`.
- Keep docs in `docs/` aligned with any runtime or dependency changes.
- Avoid introducing new direct browser persistence owners in app code unless deliberately documented.
- Finish only after both Email/Password and Google auth flows are implemented or a concrete blocker is identified.

## Plan
1. Map the existing route/layout/header/store structure and identify the least invasive integration points for auth state and auth UI.
2. Add Firebase initialization and auth state wiring, then build a user-facing auth screen and header/session affordances for Email/Password and Google sign-in.
3. Update source-of-truth docs, run verification, and capture any follow-up harness implications before handoff.

## Progress Log
- 2026-03-12: started work and reviewed architecture docs, route tree, store wiring, and header entry points.
- 2026-03-12: added Firebase SDK wiring, auth provider/session hook, `/auth` route, and header session controls.
- 2026-03-12: updated architecture/setup/operations docs and ran `npm run verify`.
- 2026-03-12: manual browser sanity checks confirmed `/auth` renders, Email/Password reaches Firebase and returns expected auth errors, and Google sign-in is blocked locally until the current app domain is added to Firebase authorized domains.

## Verification
- `npm run verify`
- Playwright sanity check on `http://127.0.0.1:4173/auth`

## Harness Follow-Ups
- Update the architecture/docs entries that describe runtime dependencies, routes, and external services if auth is added successfully.
- Remove the blocked status after Firebase Authentication authorized domains are configured for the active app origin.
