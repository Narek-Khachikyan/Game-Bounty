# UI design and visual QA

## Discovery experience
Game-Bounty helps players find a game, inspect its details, and save it across devices. Search, filter access, and catalog status take precedence over introductory copy. Artwork from the current results provides the main visual focus; featured games must remain traceable to those results.

Discovery choices belong in the URL as `q`, `genre`, and `platform`, so returning from details or authentication preserves context. Offer unrestricted genre/platform choices and a clear-filter action. Native selection controls provide the platform picker’s keyboard behavior. Preserve the return target through every authentication entry point, including the header, card actions, and the explicit return link; clicking Sign in while already on auth must retain the original target. Header and discovery regression tests cover these journeys.

## Visual direction
- Canvas: deep navy `#101722`; raised surface: slate `#182332`; separator: `#304056`.
- Primary text: cloud `#f1f5fb`; secondary text: mist `#afbdd0`; action: ice blue `#a7ceff`.
- Accent: warm amber `#efbc78`, reserved for the brand mark and small illustrative accents.
- Type: Barlow Condensed for cinematic headings; Manrope for body text and controls.
- Layout: compact header, left-aligned discovery heading and prominent search, genre navigation beside a landscape feature and artwork grid. Mobile keeps search full width and filter access compact.

The memorable element is game artwork. Keep surrounding controls quiet, labels literal, and text readable without hover. Counts and recommendation claims must reflect available data.

## Visual QA guardrails
For changes to discovery or shared styles, inspect 1280×800 desktop and 390×844 mobile views, including long game titles. Search and filter access plus content or catalog status should be reachable in the first viewport. Check for horizontal overflow and obscured focus outlines.

Exercise keyboard selection, visible focus, reduced motion, and loading, updating, empty, catalog-error, individual-filter-error, and save-error states. Normal-sized text, including selected filters and alerts, needs at least 4.5:1 contrast against its rendered background. Failures must distinguish unavailable data from zero results and provide a suitable recovery action.

When live RAWG data is unavailable, use clearly identified test fixtures for visual comparison and keep the same data and viewport on both sides. Preserve an unmodified baseline before redesign work. Visual evidence supplements the checks documented in [Testing](./testing.md).
