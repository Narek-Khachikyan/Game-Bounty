# Reduce repeated RAWG requests

Status: completed
Owner: Codex
Started: 2026-11-14
Completed: 2026-11-14

## Goal
Reduce repeated API traffic without changing catalog content, and show measured before/after counts.

## Constraints
- Keep RAWG credentials server-side and transport centralized.
- Bound cache lifetime and size; preserve retries after failures.
- Full-stop: open a reviewed PR and leave it unmerged.

## Plan
1. Audit request owners and record baseline behavior.
2. Normalize catalog cache identity, extend client retention, cache/coalesce public proxy reads.
3. Prove call reductions with controlled tests; run verify, independent Sol review, and PR checks.

## Progress Log
- 2026-11-14: audited transport. Existing RTK subscriptions already deduplicate; default unused retention is 60 seconds. Proxy previously forwards every call.

## Verification
- Baseline `c627416`: new client regressions fail in four intended cases (observed 2 fetches rather than 1); optimized client passes all six tests.
- Controlled catalog return after 120 seconds: games + genres + platforms = 6 browser fetches before, 3 after including initial load (50% reduction).
- Controlled equivalent whitespace/page-one searches: 2 browser fetches before, 1 after.
- Direct Node benchmark loads baseline proxy from `git show c627416:server/rawgProxy.js` as a data module, stubs fetch with successful JSON, then consumes 10 concurrent + 10 sequential identical GET responses: 20 upstream calls before, 1 after (95% reduction). Same warm process and TTL; no live quota consumed.
- Proxy regressions cover bounded eviction, expiry, independent response bodies, query/key/Accept isolation, errors, non-JSON and non-GET bypass, concurrent failed body reads.
- `npm run verify` passed: 52 tests, Firestore rules, test typecheck, harness, lint and production build. Eight proxy tests now pass after review fix (14 focused API tests total).
- Sol round 1 (`gpt-6.1-sol`, high): S1 should — HTTP 200 malformed JSON could be cached and defeat Retry. Fixed by parsing before insertion; regression confirms 502 then healthy upstream retry. No declined findings. Round 2 approved with S1 resolved and no new findings; usage not exposed.
- Final `npm run verify` passed on the reviewed behavior: 54 tests across 12 files, plus Firestore rules, harness, test typecheck, lint and build.
- Review diff tracked 6 files / 142 insertions and 3 deletions before review; final tracked diff 6 files / 143 insertions and 3 deletions plus new proxy tests and plan. No declined findings.
- Guardrail: proxy tests now assert malformed JSON is never retained.

## Harness Follow-Ups
- Document cache boundaries and regression checks in architecture/testing docs.
