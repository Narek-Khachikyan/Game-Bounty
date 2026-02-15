# Operations

## Common tasks
- Dev server: `npm run dev`
- Production build: `npm run build`
- Analyze bundle output (generates `dist/bundle-stats.html`): `npm run analyze`
- Preview build locally: `npm run preview`
- Lint: `npm run lint`

## Performance budget
- Initial route chunk budget is configured in `vite.config.ts` using `build.chunkSizeWarningLimit = 350` (kB).
- `npm run build` and `npm run analyze` will surface warnings if emitted chunks exceed the budget.

## Maintenance routines
- Not applicable (no database or migrations in this repo).

## Troubleshooting
- RAWG calls failing: verify `VITE_API_KEY` is set (see `.env.example:1`).
- Routes 404 on deploy: ensure SPA redirects exist (see `public/_redirects:1` for Netlify).
- Styling not applying: verify Tailwind content globs in `tailwind.config.js:1` include the file location.
