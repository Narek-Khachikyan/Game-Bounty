# Quality Scorecard

This is the standing quality document for the repo. It records where the project is strong, where it is weak, and what should be cleaned up next.

## Current Scorecard
- Knowledge base coverage: B
The repo now has compact root entrypoints, source-of-truth docs, and plan templates. The remaining gap is keeping them fresh as features evolve.

- Architecture boundary enforcement: B
The highest-value boundaries now have automated checks: transport, env access, storage, route registration, and harness link integrity.

- Runtime resilience: C
The app guards against a missing API key and persists favorites safely, but it still depends directly on a third-party API and has no automated UI fallback checks.

- Testing and regression prevention: D
There is still no automated test runner. Current protection is limited to harness validation, linting, type-checking, and manual checks.

## Garbage-Collection Queue
- Add a lightweight test runner with at least route-shell and favorites persistence smoke coverage.
- Decide whether the game detail route should move from `src/components/` into `src/page/` for clearer route ownership.
- Expand documented performance checks around the background video asset and bundle size changes.

## How To Use This Doc
- Update it when a repeated defect, review theme, or fragile area becomes visible.
- Prefer concrete next actions over vague quality statements.
