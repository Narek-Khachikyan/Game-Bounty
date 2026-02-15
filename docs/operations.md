# Operations

## Common tasks
- Dev server: `npm run dev`
- Production build: `npm run build`
- Preview build locally: `npm run preview`
- Lint: `npm run lint`

## Maintenance routines
- Not applicable (no database or migrations in this repo).

## Troubleshooting
- RAWG calls failing: verify `VITE_API_KEY` is set (see `.env.example:1`).
- Routes 404 on deploy: ensure SPA redirects exist (see `public/_redirects:1` for Netlify).
- Styling not applying: verify Tailwind content globs in `tailwind.config.js:1` include the file location.

