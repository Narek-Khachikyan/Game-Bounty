# Favorites Hardening

Status: completed
Owner: Codex
Started: 2026-03-13
Completed: 2026-03-13

## Goal
Harden Firestore-backed favorites by validating the document shape in rules, switching `savedAt` writes to Firebase server time, removing index-based screenshot keys, and documenting the new storage/testing contract.

## Why Now
Recent review findings showed the current implementation only validates favorite ownership, trusts client clocks for ordering, and uses a non-ideal React list key for screenshots.

## Constraints
- Keep the existing SPA, routing, store wiring, and RTK Query architecture intact.
- Treat `docs/` as the system of record and update it in the same change.
- Add regression protection for Firestore rules without introducing a full app test runner.

## Plan
1. Tighten `firestore.rules` and the favorites transport so the storage contract is validated and `savedAt` comes from `serverTimestamp()`.
2. Normalize favorites reads for sorting, clean up screenshot rendering keys, and add Firestore Emulator checks.
3. Update docs, run `npm run verify`, and archive this plan under `docs/exec-plans/completed/`.

## Progress Log
- 2026-03-13: reviewed the existing favorites transport, rules, docs, and testing gaps.
- 2026-03-13: created a dedicated implementation branch for this hardening pass.
- 2026-03-13: tightened Firestore rules, switched favorites writes to `serverTimestamp()`, normalized favorites read sorting, and removed index-based screenshot keys.
- 2026-03-13: added a Firestore Emulator regression script with explicit Java 21 diagnostics and updated the knowledge base to match the new storage contract.

## Verification
- `npm run verify`
- `npm run firestore:rules:test` (blocked locally: Java 17 installed, Firestore Emulator now requires Java 21+)

## Harness Follow-Ups
- Document the validated Firestore favorites contract and the rules emulator verification flow.
