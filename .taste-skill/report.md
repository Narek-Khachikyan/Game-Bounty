GATE: OPEN 28 (rounds used up)

# Game-Bounty redesign review record

The discovery interface and shared theme were substantially redesigned. The application review and raw marketing-scaffold check are separate results; the latter did not pass. No checker files were modified and no waivers were used. Full open findings are appended below.

## Deliverable and evidence
- Original incoming artifact: commit7a2bf91285548147cb0287102841019397958607, recoverable baseline/source.tar and baseline/commit.txt. No task-driven code fixes preceded Round0 reviews.
- Same default visual QA fixture on both sides: nine games, identical Steam CDN imagery, 1440×900 and390×844. Repeated dates/platforms are synthetic QA values. They are not production claims.
- Reference screenshots: Steam https://store.steampowered.com/ via T3 browser (1280×800 viewport, image uses device pixels); RAWG https://rawg.io/ via skill headless browser at1440×900, both captured2026-11-14. No reference copy, code or signature effect reused.
- Current visual artifact: candidate-2 loaded widths1440/1024/820/768/390; loading320/600/1200; full19-genres1024; reduced-motion390/1440. Candidate3 differs only in persistence field projection, its regression test and documentation. UI hashes remain identical. candidate-3-source.tar preserves current application source.
- comparison.html provides desktop/mobile before/after views and synchronized scrolling.

## Design system
Kind: software application, gaming discovery catalog. Palette: dealt black-crimson, near-black neutral surfaces and restrained crimson actions, pale rose for accessible focus/link contrast. Pairing: Familjen Grotesk and IBM Plex Mono. Composition: product-stage feature adapted to a live catalog, horizontal genre index, grouped search/platform controls and four-column desktop grid. Mobile keeps a genre disclosure and compact separated text/art feature. No marketing screens were inserted.

The unmodified skill motion/hover kit and dealt cursor-spotlight run after React mounts. The existing optional ambient video remains. No new WebGL effect or scene. Voice: facts only, game names and API metadata; no invented recommendation/social proof. Copy lint:0 FAIL,0 WARN. No new coined name, assumed production facts, client asset placeholders or .example contact/form stand-ins. Existing Firebase account forms remain connected; the canonical production domain has not been supplied.

## Functional improvements
- Controls/results heading remain ahead of conditional artwork.
- Spotlight is excluded from grid duplication, retains its save action and focus return target.
- Metadata uses readable sizing, explicit Metacritic attribution and human dates; active filters have names and individual removal.
- URL pagination retains filters and resets when filters change; a failed later page retains previous-page recovery.
- Artwork failures preserve frame and game identity.
- Save states have pending glyph, aria-busy, explicit accessible names and live feedback; focus rings remain inside card frames.
- Loading placeholders scale to columns, match the neutral theme and have no shimmer.
- Sol's save regression was fixed by whitelisting six fields in the persistence owner; a test sends a full RAWG object with extra/nested fields and checks the actual Firestore write payload.

## Verification
`npm run verify` PASS:42 tests across11 files, test typecheck, Firestore rules, harness, lint and production build. Logs:/tmp/game-bounty-round-3-verify.log. Final source hashes in candidate-3-hashes.txt.

The final raw consistency report passes assets, overflow/spill, collisions, tap sizes, text/button contrast, image drawing, effect mounting, focus rings, keyboard-focus visibility and hidden-focus checks at its checked widths. It retains40 individual consistency failures combined into28 gate findings, largely fixed viewport sections/wrap/CTA/card-variety/alignment expectations, plus the disclosed optional button-height issue. Layout checker findings at five widths are retained in candidate-2-layout.log; it did not pass.

Performance: candidate-2-perf.log reports6 FAIL/6 WARN across desktop/mobile. Total transfer about12,992KiB includes the unchanged9,169.8KiB optional video and2,838.9KiB of full-resolution Steam QA images. Image bytes and oversized-image checks fail. JS weight remains a warning. No broken requests, overflow or WebGL contexts; three-run CLS .092 desktop/.000 mobile. These measurements use the built production artifact with the same QA data. This is not a performance pass or a live RAWG measurement.

Live RAWG credentials and authenticated browser writes were unavailable. Persistence/auth behavior is supported by tests and rules verification, not claimed live account execution. Browser preview screenshot failures for RAWG were disclosed; skill headless capture provided the accessible reference.

## Council and Sol
The stable panel is codex/gpt-6.1-sol: A high, B/C xhigh; all serviceTier priority. Threshold9 EACH, stable equal-weight rubric. Full reports review-0/1/2/3-A/B/C.md, scores/ledger records retained. Round3 completed9/9/9 on candidate3. Sol round1 requested the persistence fix; round2 returned APPROVE covering candidate3, closed S1 and found no new issues. Four focused tests passed independently. Total Sol rounds:2 of3; model gpt-6.1-sol high/priority. Token usage was not returned.


| Reviewer | Round 0 — baseline | Round 1 | Round 2 | Round 3 — final | Final minus baseline |
|---|---:|---:|---:|---:|---:|
| A | 6 | 8.6 | 9 | 9 | +3 |
| B | 6.6 | 8.8 | 9 | 9 | +2.4 |
| C | 6.6 | 8.4 | 9 | 9 | +2.4 |


Optional deferred findings:116px desktop header reservation (A6/B2/C-09) and unequal desktop View/Save heights(B9). All were classified minor; preserving the assessed candidate avoids extending the successful design loop for optional polish.

No commit, push, publication or merge requested or performed.

## Raw open gate findings

gate: checking http://127.0.0.1:5180/ (software); this takes a few minutes on a CPU Chrome
gate: rounds used up; 28 FAIL open
  FAIL hero-fill        main#main-content > div.discovery-controls "Search games ⌕ Platform All platforms PC"  [1440, 390]
       the next section shows on the first screen: it starts at 245px on a 900px screen (the hero ends at 231px)
       fix: let the hero fill the first screen alone (min-height: 100svh, less above it): nothing of the next section on load
  FAIL flush            article#game-1850570 > div.card__container "Metacritic 85 17 Sept 2020 Death Strandi"  [1440]
       its last line sits 0px above the lower edge of section, where the ground changes to the footer
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL card-layout      div.discovery-layout > div.discovery-results > section > div.games__content "Metacritic 97  [1440]
       8 of 8 cards drawn one way (one panel, ground, placement and fragment): copies of one card
       fix: a card layout at most twice on a page: build the other sections another way
  FAIL button-styles    section#game-292030 > div.featured-game__content > div.feature-actions > a.feature-link.bt  [1440]
       a button pair at two heights: "View game ↗" 47px beside "Save game" 52px
       fix: one primary and one secondary button: one shape, one height per size, one label size
  FAIL cta              main#main-content > div.discovery-intro.hero  [1440, 390]
       the hero has no button (the nav's does not count)
       fix: add the action: a button in the hero, one on every priced item, one in the closing section
  FAIL heading-scale    section#game-292030 > div.featured-game__content > h2 "The Witcher 3: Wild Hunt"  [1440]
       h2 headings in 2 sizes, 28px ("Discover games") to 43.9px (x1.57)
       fix: size headings by level: the h1 largest, one size per level, each level below the one above
  FAIL section-gaps     main#main-content > div.discovery-layout > div.discovery-results > section / main#main-con  [1440, 390]
       70px between these sections, +218% against the median 22px
       fix: use one gap between sections (all within 25% of each other)
  FAIL hero-screen      main#main-content > div.discovery-intro.hero "Game-Bounty / The catalogGame discovery."  [1440]
       the hero ends at 231px on a 900px screen, 669px above the fold: it ends at the fold, 1px either way (SR-1)
       fix: make the hero exactly one screen (height: 100svh, its content fitted inside), never taller or shorter
  FAIL hero-screen      main#main-content > div.discovery-controls "Search games⌕PlatformAll platformsPCPlay"  [1440]
       669px of the next section shows on the first screen (from 231px on a 900px screen): nothing below the hero shows at load (SR-1)
       fix: end the hero at the fold so nothing of the next section shows at load (hero height: 100svh)
  FAIL section-height   main#main-content > div.discovery-controls "Search games⌕PlatformAll platformsPCPlay"  [1440]
       the section is 102px tall (0.1 screens), 799px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
       fix: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit
  FAIL section-air      main#main-content > div.discovery-controls / main#main-content > div.discovery-layout  [1440]
       29px of air between the content of these two sections: 128-480px (64-600px WARN) (SR-3)
       fix: keep 128-480px of air between the content of neighbouring sections (112-420px on a phone): the sections' padding (--padt, --padb)
  FAIL section-air      main#main-content > div.discovery-layout > div.discovery-results > footer.catalog-footer "  [1440]
       a top border across 100% of the container, between the section's content: sections and their parts are told apart by air and ground, not lines (SR-3)
       fix: take the rule out: sections and their parts are parted by their ground and the air between them
  FAIL one-section      main#main-content > div.discovery-controls "Search games⌕PlatformAll platformsPCPlay"  [1440]
       the screen at scroll 105px (the top of section 1) shows 102px of section 2 and the content of 3 sections, over 24px each beside section 3: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
       fix: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks
  FAIL one-heading      section#game-292030 > div.featured-game__content > h2 "The Witcher 3: Wild Hunt"  [1440]
       the section holds 2 h2 headings: one per section, first in its .wrap (SR-5)
       fix: give each section one h2, first in its .wrap, and the hero only its h1
  FAIL container-edges  div#root > div.mainWrapper > header.header "Skip to contentGBGame-BountyDiscoverSave"  [1440]
       the nav's content runs 20px from the left and 48px from the right (read from its outermost blocks: no .wrap): the page's container starts at 48px; 20 and 48px are not one margin; the margin is 64-120px at 1440px (one con
       fix: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone
  FAIL container-edges  main#main-content > div.discovery-intro.hero "Game-Bounty / The catalogGame discovery."  [1440]
       the content of section 1 runs 48px from the left and 48px from the right (read from its outermost blocks: no .wrap): the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (and 2 more like it: "S
       fix: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone
  FAIL container-edges  div#root "Skip to contentGBGame-BountyDiscoverSave"  [1440]
       a <div> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
       fix: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing
  FAIL container-edges  div#root > div.mainWrapper > header.header > a.skip-link "Skip to content"  [1440]
       a box runs 20-160px, outside the container lines of the nav at 48-1392px: full width is for background layers and grounds only (SR-6)
       fix: keep it inside the container lines (.wrap): full width is for background layers and grounds only
  FAIL container-edges  section#game-292030 > div.featured-game__content > p.catalog-kicker "Catalog spotlight / 0  [1440]
       3 text blocks start on a left line at x 73, 25px from the container's left: text starts on the container's left, or on one split line (x 618, 732, 846) (also "The Witcher 3: Wild Hunt", "Metacritic 92") (and 2 more like 
       fix: start the text on the container's left, or on the one split line every split shares
  FAIL container-edges  main#main-content > div.discovery-controls > label.catalog-search > span.search-field "⌕"  [1440]
       a box over half the container wide runs 48-1128px, not on the container's lines at 48-1392px (SR-6)
       fix: run the picture or box from the container's left line to its right line, or put it in a row or a split
  FAIL split-pair       section#game-292030 "Catalog spotlight / 01The Witcher 3: Wil"  [1440]
       the two columns of the split start 21px apart at the top (centred on each other): a split's columns are top-aligned, 8px either way (SR-8)
       fix: top-align both columns of the split (align-items: start)
  FAIL flush            div.discovery-layout > aside.discovery-sidebar > div.genre-browser > button.genre-mobile-t  [390]
       its first line sits 0px under the top edge of aside.discovery-sidebar, where the ground changes
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL flush            article#game-1086940 > div.card__container "Metacritic 96 17 Sept 2020 Baldur’s Gate"  [390]
       its last line sits 0px above the lower edge of section, where the ground changes to the footer
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL edge-left        div.discovery-intro.hero p.discovery-lead "Find a game. Check the details.K"  [1440]
       starts at x 1165.8; the lines are 48 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        div.discovery-layout p "9 games on this page"  [1440, 390]
       starts at x 243.5; the lines are 48 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        div.discovery-layout p.catalog-kicker "Catalog spotlight / 01"  [1440, 390]
       starts at x 73; the lines are 48 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        div.discovery-layout h2 "The Witcher 3: Wild Hunt"  [1440, 390]
       starts at x 73; the lines are 48 and the column starts
       fix: start it on the .wrap left line
  FAIL edge-left        footer.catalog-footer p "Game data and imagery from RAWG."  [390]
       starts at x 172.7; the lines are 16 and the column starts
       fix: start it on the .wrap left line
  11 WARN (not blocking), first: flush main#main-content > div.discovery-contro; flush div#genre-options > button:nth-of-type(1; copy-actions (the page); section-gaps main#main-content > div.discovery-intro.; section-gaps main#main-content > div.discovery-contro
Stop fixing: put these open FAILs and the waivers in your report, then finish.
GATE: OPEN 28 (rounds used up)
