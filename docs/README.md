# Game-Bounty docs

Executive summary: Game-Bounty is a Vite + React + TypeScript single-page app for discovering games via the RAWG API, with search/filters, game detail pages, and a local favorites list.

## Table of contents
- [Overview](./overview.md)
- [Stack](./stack.md)
- [Architecture](./architecture.md)
- [Code map](./code-map.md)
- [Setup](./setup.md)
- [Operations](./operations.md)
- [Testing](./testing.md)
- [Dependencies](./dependencies.md)
- [Risks](./risks.md)
- [AI agents guide](./ai-agents-guide.md)
- [Development standards](./development-standards.md)

## Quick facts
- Type: frontend SPA
- Entry points: `src/main.tsx:1`, `src/App.tsx:1`
- State: Redux Toolkit + RTK Query (`src/app/store.ts:1`, `src/app/redux/features/apiSlice.ts:1`)
- Styling: Tailwind + Sass (`tailwind.config.js:1`, `src/index.css:1`)
- External API: RAWG (`src/app/redux/features/apiSlice.ts:17`)
- Deploy: static build; Netlify SPA redirects (`public/_redirects:1`)

