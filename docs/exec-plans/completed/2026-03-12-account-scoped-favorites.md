# Account-Scoped Favorites

Status: completed
Owner: Codex
Started: 2026-03-12
Completed: 2026-03-12

## Goal
Move favorites from a single shared browser-local list to Firebase-backed per-user favorites keyed by `uid`, while requiring sign-in before favorites can be viewed or changed.

## Why Now
Authentication now exists in the app, so the current shared `localStorage` favorites behavior is incorrect for multi-user usage and leaks one user's saved games into another user's session on the same device.

## Constraints
- Keep RAWG transport centralized in RTK Query.
- Keep route declarations centralized in `src/App.tsx`.
- Update the harness/docs in the same change because the persistence owner and runtime dependencies are changing.
- Do not introduce new scattered storage owners in `src/`.

## Plan
1. Replace `localStorage` favorites persistence with Firestore CRUD + snapshot sync keyed by Firebase `uid`.
2. Gate `/favorites` and favorites mutations behind auth, while preserving redirect-back behavior after sign-in.
3. Update docs/guardrails, verify with `npm run verify`, and document the Firestore rules requirement.

## Progress Log
- 2026-03-12: reviewed store persistence, favorites UI flow, auth provider, and route tree to map the smallest integration surface.
- 2026-03-12: replaced shared browser-local favorites persistence with Firebase-backed per-user favorites transport and Redux sync.
- 2026-03-12: protected `/favorites`, added auth redirect-back flow, updated docs/guardrails, and added repo-visible Firestore rules.
- 2026-03-12: ran `npm run verify` and a Playwright smoke check for guest redirect from `/favorites` to `/auth?next=%2Ffavorites`.

## Verification
- `npm run verify`
- Playwright smoke check of guest redirect on `http://127.0.0.1:4173/favorites`

## Harness Follow-Ups
- Update architecture docs and storage invariants to reflect Firestore-backed account favorites.
- Add repo-visible Firestore rules guidance so the required backend policy is not hidden in chat.
