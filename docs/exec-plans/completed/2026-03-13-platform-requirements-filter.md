# Platform Requirements Filter

Status: completed
Owner: Codex
Started: 2026-03-13
Completed: 2026-03-13

## Goal
Limit the game-detail compatibility cards to platforms that expose both minimum and recommended system requirements.

## Why Now
The compatibility module currently renders every platform returned by RAWG, even when a platform is missing one side of the requirements pair and cannot support the intended comparison UX.

## Constraints
- Keep RAWG requirement source priority stable, but choose the first block in that order that includes both `minimum` and `recommended` before falling back to a partial block.
- Leave the top platform badges on the detail page untouched.
- Keep docs in `docs/` aligned with the UI behavior in the same change.
- Run `npm run harness:check` after doc updates and `npm run verify` before handoff.

## Plan
1. Filter compatibility cards to platforms with non-empty `minimum` and `recommended` fields.
2. Preserve the existing selected-platform-first ordering for the remaining cards.
3. Update docs and verify the repo.

## Progress Log
- 2026-03-13: reviewed the compatibility module and confirmed that platform badges and compatibility cards are rendered separately.
- 2026-03-13: implemented complete-requirements filtering and updated the empty state copy.
- 2026-03-13: updated docs to reflect the narrower compatibility-card behavior and queued verification.
- 2026-03-13: adjusted the requirements helper after review feedback so compatibility cards use the first complete RAWG requirements block instead of hiding platforms behind a partial higher-priority block.

## Verification
- `npm run harness:check`
- `npm run verify`

## Harness Follow-Ups
- If future review feedback changes the definition of a "complete" requirements block or the fallback order, update the UI helper, project facts, and this execution note together.
