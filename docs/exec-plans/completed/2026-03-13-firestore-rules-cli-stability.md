# Firestore Rules CLI Stability

Status: completed
Owner: Codex
Started: 2026-03-13
Completed: 2026-03-13

## Goal
Remove the Firestore rules verification dependency on private `firebase-tools` internals so `npm run firestore:rules:test` and `npm run verify` stay stable across normal `firebase-tools` upgrades.

## Why Now
A review finding highlighted that the new verification path imports `firebase-tools/lib/emulator/downloadableEmulators`, which is not a public API and can break on routine dependency updates.

## Constraints
- Preserve the existing Firestore rules regression coverage and Java 21 requirement.
- Keep `docs/` as the system of record and update the relevant guardrails in the same change.
- Add a harness check so private `firebase-tools/lib/*` imports do not come back unnoticed.

## Plan
1. Replace the emulator bootstrap script with a public `firebase emulators:exec` flow and keep the rules check compatible with the CLI-provided emulator host.
2. Add a harness rule and invariant/doc updates that forbid repo-owned verification code from importing private `firebase-tools` internals.
3. Run `npm run harness:check` and `npm run verify` when practical, then archive the plan under `docs/exec-plans/completed/`.

## Progress Log
- 2026-03-13: reviewed the harness docs, current Firestore rules runner, and the review finding about private `firebase-tools` imports.
- 2026-03-13: replaced the private `firebase-tools/lib/*` emulator bootstrap with a temporary public `firebase emulators:exec` configuration and made the rules check consume the CLI-provided emulator host.
- 2026-03-13: added a harness guardrail against private `firebase-tools/lib/*` imports in repo-owned scripts and updated the source-of-truth docs.
- 2026-03-13: passed `npm run harness:check` and `npm run verify` on the final implementation.

## Verification
- `npm run harness:check`
- `npm run verify`

## Harness Follow-Ups
- Document the public Firebase CLI verification path and the new guardrail against private `firebase-tools/lib/*` imports.
