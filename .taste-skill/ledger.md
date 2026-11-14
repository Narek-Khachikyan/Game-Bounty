# Council ledger

Model: codex / gpt-6.1-sol. A high, B/C xhigh. All serviceTier priority. Required threshold 9 each.

| Reviewer | Round 0 — baseline | Round 1 | Round 2 | Round 3 — final | Final minus baseline |
|---|---:|---:|---:|---:|---:|
| A | 6 | 8.6 | 9 | 9 | +3 |
| B | 6.6 | 8.8 | 9 | 9 | +2.4 |
| C | 6.6 | 8.4 | 9 | 9 | +2.4 |

Full baseline reports: review-0-A.md, review-0-B.md, review-0-C.md. Baseline archive and screenshots: baseline/. References: references/steam.png and references/rawg.png. Round 0 checks passed, source frozen through all baseline reviews.

Canonical findings (aliases): identity A4/B1/C01; feature and hierarchy A2/B2/C02; metadata A3/B4/C04; continuation A1/B3; filter labels A5/B5; stable controls C03; artwork fallback C05. All accepted; dispositions are recorded by round below. No rejected findings.

## Round 1 — candidate 1
A 8.6 (+2.6 baseline); B 8.8 (+2.2); C 8.4 (+1.8). All identity/metadata/continuation/filter-label/artwork findings resolved by relevant reviewer. Feature duplication and control placement resolved, but B2/C-02 remain open for desktop density regression (alias A6). New: compact busy feedback A7/B7; removal glyph A8/C-07; skeleton track sizing C-06; loading theme B6/C-08; clipped save focus B8. All accepted for Round2, pending reviewer confirmation. Source archive and screenshots preserved under candidate-1-*; full reports review-1-A/B/C.md.

## Round 2 — candidate 2 preparation
Compact desktop intro/controls/feature; names now precede grid artwork on desktop so multiple alternatives can be identified immediately. Mobile composition preserved. Pending save state now exposes ellipsis, aria-busy and live progress/success feedback, with delayed-save/removal/error tests. Favorites uses explicit remove glyph; save focus is inset. Skeletons scale to tracks, use neutral theme and have no shimmer. All fixes pending fresh reviewer confirmation.


## Round 2 — completed
A/B/C each9 on candidate2. All blockers/majors resolved; only optional density/header reservation and action-height nits remained. Raw gate OPEN28 and image/video performance debt disclosed separately, no false pass claimed. Sol full audit then found S1 should: extra RAWG keys rejected by Firestore.

## Round 3 — candidate3 final Council
A/B/C each9 after persistence whitelist fix,42-test verification and fresh full review. Visual source/assets unchanged from candidate2, explicitly reused exact screenshots. All earlier major findings confirmed resolved. Optional A6/B2/C-09 header reservation and B9 action heights deferred; not falsely closed. Score changes versus Round2:0/0/0; final-minus-baseline:+3/+2.4/+2.4. R3 original runs were cancelled by server restart before evaluation; automatically resumed runs produced the recorded final reports. No scores invented for cancelled runs.

Current source preserved as candidate-3-source.tar. Fresh Sol correctness recheck Round2 APPROVE on candidate3; S1 resolved, no new findings. Two of three Sol rounds used. No new behavior edits during reviews.
