# Candidate checks

Application acceptance checks: preserve URL search/genre/platform/page; account return targets and favorites behavior; no overflow or obscured controls at 320–1440; responsive game identity and metadata; image error recovery; stable controls/heading on uncached filter fetch; normal text contrast 4.5:1; relevant verify passes.

`npm run verify`: PASS, 37 tests, test typecheck, Firestore rules, lint, harness and production build. Existing bundle warning remains (~845KB versus baseline ~841KB). No data/auth backend was replaced.

Baseline design checker: 45 FAIL / 21 WARN on original. The landing-page checker expects one/two-screen sections, an app-frame marketing demo, a wrap scaffold and few repeated actions. These checks do not describe a working multi-route game catalog. Current raw gate result is recorded separately, never passed off as application acceptance. No kit files edited; no checker waivers used. Fix genuine overflow, contrast, focus, image and control failures regardless of checker fit.

Visual fixture: same nine games/art as baseline; dates/platforms are synthetic test values, not asserted production facts. Local live RAWG key unavailable. Authenticated write flows use existing test coverage, not invented live verification. Fonts load from Google Fonts; art from configured API in production, Steam CDN in QA fixture. Original source under baseline/source.tar.
