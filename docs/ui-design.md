# UI design and visual QA

## Discovery experience
Game-Bounty helps players find a game, inspect its details, and save it across devices. Search, genre/platform filters and the results heading precede conditional artwork, so loading or hiding the spotlight cannot move the discovery controls. The spotlight is the first unfiltered result, with factual platform and Metacritic information; it is omitted from the grid to prevent repetition. Filtered pages prioritize the grid.

Discovery choices belong in the URL as `q`, `genre`, `platform` and optional `page`. Pagination uses the centralized RAWG endpoint, always retains filters and ignores upstream navigation URLs except for whether a next page exists. Changing a filter resets pagination. The response's optional `next` controls continuation. Previous-page navigation remains available after a page failure. Native platform selection, unrestricted genre choices, named removable filters and a clear-filter action preserve keyboard access.

Preserve the return target through every authentication entry point, including header, card actions and the explicit return link. Clicking Sign in while on auth retains the original target. Discovery and header regression tests cover these journeys.

## Visual direction
- Kind: software application for game discovery, with gaming artwork. Keep the catalog central instead of adopting a marketing landing-page scaffold.
- Canvas `#0a0a0a`, surface `#151515`, borders `#343434`; text `#efefef`, secondary text `#aaaaaa`.
- Crimson `#b11226` marks primary actions and the brand; light rose `#f4b8bf` provides accessible text links and focus rings.
- Familjen Grotesk carries headings and body; IBM Plex Mono is limited to catalog labels and factual counters.
- Product-stage composition: large editorial heading, grouped search/platform controls, horizontal genre index, factual feature and artwork grid. Mobile uses a compact feature and genre disclosure.
- Cards use readable metadata and a secondary save row with a distinct accessible action name. Artwork failure preserves the frame and game identity through the shared GameArtwork component.
- The unmodified design-taste motion layer gives linked cards a small lift and artwork a zoom. A dealt cursor spotlight on the intro rests under reduced motion and touch; the one-time entrance follows React mounting. Route unmount removes moment listeners.

## Visual QA guardrails
For discovery/shared styles inspect 1440×900, 1280×800, 1024×768, 820×1180, 768×1024 and 390×844; check 320px for overflow. Use long titles, many platforms and absent scores. Search, filters and useful game identity or catalog status should be reachable promptly. Keep controls and the results heading stationary when uncached requests begin, finish or fail.

Exercise keyboard selection, focus visibility, reduced motion, loading, updating, empty, catalog-error, individual-filter-error, image-error and save-error states. Normal-sized text needs 4.5:1 contrast. Distinguish unavailable data from zero results and provide recovery. Test pagination past 12 matches and filter reset after advancing.

When live RAWG data is unavailable, identify QA fixtures in the evidence report and keep identical data/viewports on both sides. Preserve an unmodified source archive and baseline before task-driven edits. Review against actual reference screenshots with provenance; never invent starting scores. Marketing-specific section-height checks are reported separately from application acceptance checks; do not stretch catalog rows into full viewport sections to satisfy them. Visual evidence supplements [Testing](./testing.md).

The spotlight retains the same save/remove control as grid cards through SaveGameAction, including its focusable game target after authentication. On compact screens the spotlight’s save control is a 44px plus/minus button with a game-specific accessible name; pending operations show an ellipsis and announce their state. Save-button focus rings are inset to remain visible inside card frames. Theme utility colors and detail badges use the same neutral/crimson system.

Keep the desktop intro and feature compact enough to reveal alternative game artwork in the first viewport, including when the genre list wraps. Loading placeholders must scale to grid tracks and use the current neutral palette.

Desktop grid cards put game names above their artwork so alternatives are identifiable as soon as the row enters view; mobile keeps artwork first.

Firestore writes whitelist the six GameData fields in the persistence owner, including for full RAWG spotlight results. A transport regression test supplies extra RAWG fields and verifies that they never reach the stored document.
