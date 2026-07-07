# Game-Bounty Global Redesign

Status: active
Owner: OpenCode
Started: 2026-07-07
Completed: n/a

## Goal
Redesign the user-facing Game-Bounty experience around a cinematic bounty-board direction: catalog browsing should feel like scanning game contracts, detail pages should read like game intelligence dossiers, and favorites should feel like saved bounties while preserving the current React, RTK Query, Firebase, and routing behavior.

## Why Now
The current UI mixes Tailwind utilities and SCSS with repeated raw violet/white styling, hover-only card information, generic loading and empty states, and inconsistent surface language across catalog, detail, auth, favorites, and protected routes. A coordinated redesign can improve visual identity, responsive behavior, accessibility, and state consistency without changing data ownership boundaries.

## Constraints
- Preserve RAWG transport ownership in `src/app/redux/features/apiSlice.ts`.
- Preserve browser persistence ownership in `src/hooks/useBackgroundVideoGate.ts`.
- Preserve route registration in `src/App.tsx`.
- Keep Firebase auth and favorites behavior unchanged.
- Keep the background video gate respectful of reduced motion and network heuristics.
- Prefer semantic Tailwind tokens and small SCSS changes over introducing new dependencies.
- Verify with `npm run harness:check`, `npm run lint`, and `npm run build`; run `npm run verify` when practical.

## Plan
1. Add Tailwind design tokens and global CSS primitives for the bounty-board visual system.
2. Redesign the layout shell and header while preserving the animated background toggle.
3. Redesign catalog controls, game cards, and catalog loading/empty/error states.
4. Redesign game detail, compatibility/content plan, DLC, and same-series cards.
5. Redesign auth, favorites, protected-loading, and not-found states.
6. Remove fragile motion patterns, improve focus/disabled states, and update verification notes.

## Progress Log
- 2026-07-07: started work and selected `Bounty Board / Game Hunter Dossier` direction.
- 2026-07-07: added Tailwind tokens, global shell styles, redesigned header, catalog filters, game cards, detail dossier, auth, favorites, protected-loading, not-found, skeleton, and related-content states.

## Verification
- Passed: `npm run harness:check`
- Passed: `npm run lint`
- Passed: `npm run build`
- Pending: `npm run verify` if local emulator dependencies are available
- Pending manual/browser QA: desktop 1440px, tablet 768px, mobile 390px and 320px, reduced-motion path, signed-in/out auth states, favorites loading/empty/error states, detail page with and without screenshots.
- Note: `npm run build` still emits the existing large chunk warning for the bundled app JavaScript; the production build succeeds.

## Harness Follow-Ups
- No harness rule changes expected unless verification reveals a repeated design-system or accessibility failure mode that should become enforceable.
