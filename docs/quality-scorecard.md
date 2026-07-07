# Quality Scorecard

This is the standing quality document for the repo. It records where the project is strong, where it is weak, and what should be cleaned up next.

## Current Scorecard
- Knowledge base coverage: B
The repo now has compact root entrypoints, source-of-truth docs, and plan templates. The remaining gap is keeping them fresh as features evolve.

- Architecture boundary enforcement: B
The highest-value boundaries now have automated checks: transport, env access, storage, route registration, harness link integrity, and the Firestore verification path's use of public Firebase tool surfaces.

- Runtime resilience: C
The app guards against a missing API key, auth-gates personal favorites, syncs favorites through Firestore, announces key error/loading states, and lets the game detail route keep primary content available when secondary RAWG content fails. It still depends directly on third-party services and needs broader automated UI fallback checks.

- Testing and regression prevention: C
Vitest + React Testing Library now cover favorites reducers/selectors, auth redirect helpers, `RequireAuth`, and `FavoritesSync`, alongside Firestore rules, harness validation, linting, and type-checking. Browser-level route and responsive smoke coverage is still missing.

## Garbage-Collection Queue
- Add browser-level route-shell smoke coverage for `/`, `/game/:id`, `/favorites`, `/auth`, and `*`.
- Add responsive UI smoke checks for the header, filter controls, auth page, and card content on mobile-width viewports.
- Expand automated coverage into auth form validation, favorites page states, and game detail retry/partial-failure behavior.
- Expand documented performance checks around the 9.39 MB background video asset and the current large JS chunk reported by `npm run build`.
- Decide whether route-level code splitting should be introduced for heavy detail/auth surfaces after measuring `npm run analyze` output.

## How To Use This Doc
- Update it when a repeated defect, review theme, or fragile area becomes visible.
- Prefer concrete next actions over vague quality statements.
