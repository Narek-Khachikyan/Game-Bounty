# Architecture Invariants

This document captures the stable boundaries that should not drift casually. If a change needs to break one, update this file and the corresponding harness check deliberately.

## Invariants
1. RAWG transport stays centralized in `src/app/redux/features/apiSlice.ts`.
Reason: browser network behavior, cache semantics, and API key handling should stay in one place.
Enforcement: `npm run harness:check` blocks direct `fetch(...)` usage and `import.meta.env` access elsewhere in `src/`.

2. Browser persistence stays limited to the explicit persistence owners.
Reason: persisted browser state should have very few owners to avoid divergent storage formats.
Current owners:
- `src/hooks/useBackgroundVideoGate.ts` for the background-video preference
Favorites persistence is not browser-local anymore; it lives in Cloud Firestore via the signed-in Firebase user.
Enforcement: `npm run harness:check` blocks `localStorage` usage elsewhere in tracked `src/` files.

3. The top-level route tree stays centralized in `src/App.tsx`.
Reason: route registration is a core navigation concern and should stay easy to audit.
Enforcement: `npm run harness:check` blocks JSX `<Route ...>` declarations outside `src/App.tsx`.

4. The project harness must keep working entrypoints.
Reason: agents need a predictable way to find the system of record.
Enforcement: `npm run harness:check` validates required docs and internal Markdown links across root entrypoints and the knowledge base.

## Human-Enforced Rules
- Non-trivial changes should have an execution plan in `docs/exec-plans/`.
- Any repeated bug or review finding should trigger a harness update, not only a code patch.
