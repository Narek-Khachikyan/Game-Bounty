# Quality Scorecard

This is the standing quality document for the repo. It records where the project is strong, where it is weak, and what should be cleaned up next.

## Current Scorecard
- Knowledge base coverage: B
The repo now has compact root entrypoints, source-of-truth docs, and plan templates. The remaining gap is keeping them fresh as features evolve.

- Architecture boundary enforcement: B
The highest-value boundaries now have automated checks: transport, env access, storage, route registration, harness link integrity, and the Firestore verification path's use of public Firebase tool surfaces.

- Runtime resilience: C
The app guards against a missing API key, auth-gates personal favorites, and syncs favorites through Firestore, but it still depends directly on third-party services and has no automated UI fallback checks.

- Testing and regression prevention: D
There is still no general-purpose app test runner, but Firestore favorites rules now have dedicated emulator-based regression coverage alongside harness validation, linting, and type-checking.

## Garbage-Collection Queue
- Add a lightweight test runner with at least route-shell and account-favorites sync smoke coverage.
- Add responsive UI smoke checks for the header, filter controls, auth page, and card content on mobile-width viewports.
- Expand automated coverage beyond Firestore rules into route-shell and account-favorites UI behavior.
- Decide whether the game detail route should move from `src/components/` into `src/page/` for clearer route ownership.
- Expand documented performance checks around the background video asset and bundle size changes.

## How To Use This Doc
- Update it when a repeated defect, review theme, or fragile area becomes visible.
- Prefer concrete next actions over vague quality statements.
