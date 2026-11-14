# Discovery redesign

Status: completed
Owner: Codex
Started: 2026-11-14
Completed: 2026-11-14

## Goal
Substantially redesign the game catalog into a recognizable editorial discovery interface while preserving search, filters, account favorites and navigation context.

## Constraints
- Keep RAWG transport, persistence and route ownership intact.
- Preserve the original baseline and compare identical QA fixtures and viewports.
- Council: GPT-6.1 Sol A high, B/C xhigh, priority service; all three must reach 9/10 on the same candidate. Then Sol correctness audit.
- This is a working catalog. Do not replace it with a marketing landing page or force catalog rows into viewport-sized sections.

## Plan
1. Capture baseline, reference screenshots and independent Round 0 reviews.
2. Rebuild discovery composition, cards and shared styling; improve result continuation and stable filter controls.
3. Verify behavior and responsive states; iterate with Council and complete Sol audit.
4. Show before/after evidence and record limitations.

## Progress Log
- 2026-11-14: Baseline source archived under `.taste-skill/baseline`; clean incoming HEAD recorded. `npm run verify` passed (31 tests). Steam and RAWG screenshots captured.
- 2026-11-14: Round 0 complete: A 6, B 6.6, C 6.6. Shared findings: generic identity, repeated feature, separated controls, tiny metadata. A1/B3 continuation accepted. C03 stable controls and C05 art fallback accepted. All findings pending reviewer confirmation after implementation.
- Design kind: software, gaming discovery catalog. Deal: black-crimson (neutral black lets cover art lead; crimson gives actions a recognizable identity), Familjen Grotesk / IBM Plex Mono, product-stage composition, cursor-spotlight. Adapt stage into an actual catalog feature; compact mobile and keep controls before dynamic content. Existing app route structure overrides the landing-page scaffold.
- Voice: facts only; game names and supplied metadata carry the page; no invented recommendations, counts, ratings or marketing claims.

## Verification
- Baseline: `npm run verify` PASS; existing large bundle warning.
- Current `npm run verify`: PASS42 tests, types, Firestore rules, harness, lint and production build.
- Responsive screenshots:1440/1024/820/768/390; loading320/600/1200; full19 genres1024; reduced motion390/1440. Same nine-game fixture preserved for comparison; live RAWG unavailable locally.
- Council rounds baseline/A-B-C:6/6.6/6.6; R1:8.6/8.8/8.4; R2:9/9/9; final R3:9/9/9. GPT-6.1 Sol settings remained fixed. No final blocker/major. Optional card-header and button-height polish deferred.
- Sol correctness:2 rounds, CHANGES then APPROVE on final candidate3. Corrected full RAWG object leakage by whitelisting persisted game fields, regression tested. No behavior edits after approval.
- Design-skill gate:OPEN28 at round limit, no waivers or checker modifications. Open marketing-scaffold/layout findings retained, including optional action-height inconsistency. Actual overflow, collisions, tap sizes, assets, contrast and focus checks pass.
- Performance:6 FAIL/6 WARN due existing optional video and full-resolution QA images; no performance pass claimed. CLS .092 desktop/.000 mobile, no broken requests or WebGL contexts. Existing large-bundle warning retained.
- Evidence, exact source archives, full reviews, score history, raw open findings and interactive before/after: `.taste-skill/`. Final report `.taste-skill/report.md`; comparison `.taste-skill/comparison.html`.
- No commit, push or publication requested/performed.

## Harness Follow-Ups
- Update UI design system and QA guidance, including image failure and stable controls.
- Add focused pagination/filter regression coverage.

## Completion Notes
The source-of-truth UI guide documents the neutral/crimson system, stable controls, pagination, image fallback, save feedback and responsive QA. The persistence invariant and regression test prevent full API objects from leaking extra Firestore keys. Final source hashes and archives are retained; post-review updates are reporting-only.
