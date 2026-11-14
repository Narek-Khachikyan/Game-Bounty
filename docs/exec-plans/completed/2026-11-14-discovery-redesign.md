# Discovery UI/UX redesign

Status: completed
Owner: Codex
Started: 2026-11-14
Completed: 2026-11-14

## Goal
Substantially improve game discovery, visual hierarchy, responsive behavior, and recovery while preserving details, Firebase authentication/favorites, and reduced-motion preferences. Show a comparable visual before/after and obtain independent Council approval.

## Why Now
The original first screen devotes most of its height to promotional copy. Repeated independent reviews found restricted search scope, weak error recovery, incomplete platform keyboard behavior, contrast failures, and lost context on authentication.

## Constraints
- Preserve the [architecture invariants](../../architecture-invariants.md): centralized RAWG transport, explicit persistence owners, and centralized routes.
- Keep production data honest; test fixtures used for screenshots must be identified.
- Keep Council rubric, reviewers, model settings, and threshold stable. Each reviewer must score the same candidate at least 9/10 with no unresolved blocker or major finding.
- Complete the final Sol correctness review after the Council gate.

## Plan
1. Preserve and independently assess the original baseline before implementation.
2. Implement the [UI direction](../../ui-design.md), URL discovery state (`q`, `genre`, `platform`), unrestricted filters, native platform select, and useful recovery states.
3. Verify functionality, responsive layouts, contrast, and keyboard behavior; capture comparable visual evidence.
4. Iterate through fresh Council reviews, then complete the Sol correctness audit and record final checks.

## Progress Log
- 2026-11-14: Preserved original HEAD `35e2e9287e249adeb028227f962268b10ea5e14a` as a recoverable archive at `/tmp/game-bounty-ui/baseline.tar` before edits. Baseline packet and visual evidence are recorded in `/tmp/game-bounty-ui/packet0.md`.
- 2026-11-14: All three independent Round 0 evaluations completed before implementation: A 5/10, B 5/10, C 6/10. Reviewers use GPT-6.1 Sol, priority service; A high reasoning, B/C xhigh reasoning.
- 2026-11-14: RAWG and Steam inspected as references. RAWG supports immediate search/filter/artwork comparison. Steam’s supplied featured region was blank, limiting artwork conclusions.
- 2026-11-14: Restored the required root `CLAUDE.md` pointer and removed its ignore rule so the harness entrypoint can be delivered with the change.

## Council finding ledger
| Canonical issue | Reviewer aliases | Final disposition |
| --- | --- | --- |
| Required harness entrypoint absent | A1, B1, C1 | Resolved; harness and all reviewers confirm |
| Oversized introduction delays discovery | A2, B2, C2 | Resolved; all current reviewers confirm |
| Restricted defaults and no reset | A3, B3, C3 | Resolved; all current reviewers confirm |
| Unavailable/updating states and retry | A4, B5, C4 | Resolved; all current reviewers confirm |
| Incomplete custom platform select | A5, B4, C5 | Resolved; all current reviewers confirm |
| Selected-filter and save-error contrast | A6, B6, C6 | Resolved; all current reviewers confirm |
| Authentication loses discovery/save context | A7, B7, C7 | Resolved; all current reviewers confirm |

## Verification
- Original `npm run verify` stopped at `harness:check`: missing required `CLAUDE.md`.
- Parent coordinator owns implementation checks, current screenshots, and subsequent Council/Sol results. Record those before completion.

## Harness Follow-Ups
- Keep required root entrypoints tracked; `CLAUDE.md` delegates to `AGENTS.md` to avoid duplicated rules.
- [UI visual QA guardrails](../../ui-design.md) cover repeated hierarchy, state, contrast, and context findings.

## Iteration history
| Reviewer | Round 0 — baseline | Round 1 | Round 2 | Round 2 minus baseline |
| --- | --- | --- | --- | --- |
| A | 5 | 9 | 9 | +4 |
| B | 5 | 8 | 9 | +4 |
| C | 6 | 8 | 9 | +3 |

- Round 1 resolved discovery/harness issues; B/C retained auth-focus and detail-contrast findings. Round 2 fixed those plus the explicit auth-return link. All canonical baseline findings were confirmed resolved by all three current reviewers; 10px metadata remains optional deferred polish (A8/B11/C11).
- C2 full verify passed: 29 tests plus typecheck, harness, Firestore rules, lint, build. Browser checks at 320–1440px found no settled horizontal overflow; reduced motion rendered no background video. Focus and requirements contrast have rendered evidence under `/tmp/game-bounty-ui/`.
- Final Sol audit round 1: CHANGES, S1 should — header sign-in failed to preserve discovery URL. C3 fixes the header return target and prevents nested auth return paths; dedicated tests cover successful sign-in and returning without signing in. Fresh full Council and Sol confirmation pending. Sol budget remains round 1 of 3 used.

## Final outcome
Discovery now uses a compact masthead/search, real-result artwork feature, native platform selection, unrestricted filters and reset, explicit retries/states, and URL-owned context. Shared navy surfaces, Manrope body type and Barlow Condensed headings replace the heavy paper/border presentation. Requirements and authentication focus are readable. All authentication entry points preserve the return target.

| Reviewer | Round 0 — baseline | Round 1 | Round 2 | Round 3 — final | Final minus baseline |
| --- | --- | --- | --- | --- | --- |
| A | 5 | 9 | 9 | 9 | +4 |
| B | 5 | 8 | 9 | 9 | +4 |
| C | 6 | 8 | 9 | 9 | +3 |

Panel remained Codex GPT-6.1 Sol, priority service: A high reasoning, B/C xhigh. Round 0 completed before edits. Final Council artifact C3 SHA-256 `1872cde220b398baf8cae60c940fb7c55acbb40ba6f8d390617f8fd96d2de9c3`; all three assessed this same artifact. Original and every candidate remain recoverable in `/tmp/game-bounty-ui/`. This completion update only records outcomes; it changes no reviewed behavior.

### Final correctness audit
- Sol-loop: 2 of 3 default rounds, GPT-6.1 Sol high reasoning, priority service.
- Round 1 CHANGES: S1 should, header sign-in discarded discovery context. Fixed with shared redirect builder, retaining the current auth URL on repeated clicks. Two Header integration tests added.
- Round 2 APPROVE covering current C3 behavior diff; S1 explicitly resolved. Nine focused Header/redirect tests independently passed, archive/workspace matched, diff whitespace passed. No new in-scope findings.
- Tracked task diff before Sol: 25 files, +1227/-1139; after: 25 files, +1231/-1140, plus untracked test files (183 lines total) and documentation. No dependency changes. Reviewer usage was not returned.
- Optional A8/B11/C11 metadata enlargement remains deferred; no blocker or major finding remains. No optional Sol nits were raised.

### Final validation and limits
- Full `npm run verify`: PASS — harness, test typecheck, 31 tests in 7 files, Firestore emulator rules, lint, production build. Existing build size warning remains.
- `git diff --check`: PASS. Documentation finalization followed by harness validation.
- Browser: focus outline solid 4px ice blue, requirements label contrast 10.95:1, settled viewport/scroll widths match at 320, 390, 768, 1024, 1280 and 1440px. Reduced motion renders no background video.
- Actual header sign-in/reclick/cancel return preserves the full filtered discovery URL. Credential submission is tested with the auth adapter; live Firebase authentication/favorite persistence roundtrips were not performed.
- RAWG key is absent in this environment. Loaded screenshots use the same six clearly disclosed test games/artwork, never a production fallback; real configuration-error views were also checked. RAWG and Steam references informed comparison; Steam's feature screenshot was blank, so only its navigation was evaluated.
- Standalone interactive before/after and score chart: `/tmp/game-bounty-ui/comparison.html`. Desktop/mobile originals, candidates, focus/requirements screenshots and full verification logs sit beside it. Browser preview switched to Playwright after repeated screenshot-frame errors.
- Changes remain local; no publish, merge or push was requested or performed.
