# Risks

## Security / secrets
- `VITE_API_KEY` is a client-exposed key (Vite embeds `import.meta.env.*` into the browser bundle). Treat it as a public token and apply RAWG key restrictions/rotation as needed.
- `.env.local` exists in the repo root; ensure it is ignored and not committed to shared remotes if it contains real secrets.

## Reliability
- No automated tests; regressions are likely to be caught late.
- RAWG API rate limits/outages directly impact the UI.
- Firebase Authentication provider misconfiguration or missing authorized domains will block sign-in flows.
- Cloud Firestore misconfiguration or undeployed rules will block account favorites from loading or saving.

## Maintainability
- Strict TS + ESLint settings may block builds/lints on unused code (`tsconfig.json:1`, `package.json:1`).
- A large video background asset (`src/assets/bgVideo.mp4`) may impact load performance on slower connections.

## External dependencies
- Global font import from Google Fonts in `src/index.css:1` requires network access at runtime.
