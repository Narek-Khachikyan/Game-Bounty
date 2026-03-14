# Operations

## Common tasks
- Dev server: `npm run dev`
- Production build: `npm run build`
- Analyze bundle output (generates `dist/bundle-stats.html`): `npm run analyze`
- Firestore rules regression check: `npm run firestore:rules:test`
- Preview build locally: `npm run preview`
- Lint: `npm run lint`
- Harness check: `npm run harness:check`
- Full local verification: `npm run verify` (runs harness validation, the Firestore rules regression suite, lint, and build)

## Deployment runtime
- Netlify should use Node 20 from the repo root `.nvmrc`.
- The repository standardizes on `npm` with `package-lock.json`; avoid reintroducing `yarn.lock` unless the project intentionally switches package managers.

## Performance budget
- Initial route chunk budget is configured in `vite.config.ts` using `build.chunkSizeWarningLimit = 350` (kB).
- `npm run build` and `npm run analyze` will surface warnings if emitted chunks exceed the budget.

## Maintenance routines
- Keep `docs/` aligned with code changes, especially architecture, setup, and quality docs.
- Move long-running work through `docs/exec-plans/active/` and archive finished plans under `docs/exec-plans/completed/`.
- When a repeat defect appears, strengthen the harness instead of relying on memory.
- Keep `scripts/run-firestore-rules-test.mjs:1` and `scripts/firestore-rules-check.mjs:1` aligned with `firestore.rules:1` when the favorites storage contract changes, and keep the runner on public Firebase CLI entrypoints instead of private `firebase-tools` internals.

## Troubleshooting
- RAWG calls failing locally: verify `RAWG_API_KEY` is set in the server environment that launched `npm run dev` (see `.env.example:1`).
- Netlify RAWG deploy failures: verify `RAWG_API_KEY` is set in Netlify environment variables for the relevant deploy contexts.
- Firebase sign-in failing: verify `Email/Password` and `Google` providers are enabled in the Firebase console and that `localhost` is listed in authorized domains.
- Favorites not loading or saving: verify Cloud Firestore is enabled for the Firebase project, the rules in `firestore.rules:1` are deployed, and favorite writes still match the validated document shape.
- Local Firestore rules check fails: ensure Java 21+ is available for the Firestore Emulator, then rerun `npm run firestore:rules:test` so the bundled Firebase CLI can start the emulator.
- Google popup fails immediately: allow browser popups for the local app origin and retry.
- `npm run dev` opens on `http://localhost:5173/` by default; if that port is busy, use the alternative local URL that Vite prints or stop the stale process that already owns the port.
- Routes or RAWG proxying fail on deploy: ensure `public/_redirects:1` still routes `/api/rawg/*` before the SPA fallback.
- Netlify dependency install fails with a Firebase Node engine error: verify the deploy is using Node 20+ and that the repo still uses `npm` rather than an accidental `yarn.lock`.
- Styling not applying: verify Tailwind content globs in `tailwind.config.js:1` include the file location.
