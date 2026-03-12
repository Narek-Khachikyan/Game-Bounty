# RAWG Server Proxy

Status: completed
Owner: Codex
Started: 2026-03-12
Completed: 2026-03-12

## Goal
Keep the RAWG API key out of the client bundle by routing browser traffic through a same-origin server proxy in local Vite development and Netlify production.

## Why Now
Netlify deploys were failing because the old client-exposed RAWG env variable was embedded into the generated client JavaScript and then detected by Netlify secret scanning.

## Constraints
- Preserve the existing RTK Query API slice as the browser transport owner.
- Keep local development on `npm run dev`; do not require Netlify CLI.
- Update docs and harness in the same change so the new secret boundary is durable.

## Plan
1. Add a shared RAWG proxy helper plus runtime entrypoints for Vite dev and Netlify functions.
2. Switch the client API slice to `/api/rawg/*` and update configuration error handling.
3. Update redirects, docs, harness checks, and run verification.

## Progress Log
- 2026-03-12: started work after confirming Netlify was failing on secret scanning because the previous client-side RAWG key appeared in the built client bundle.
- 2026-03-12: completed the same-origin RAWG proxy, migrated the client to `/api/rawg/*`, updated docs/harness, and verified the repo with `npm run verify`.

## Verification
- `npm run harness:check`
- `npm run lint`
- `npm run build`
- `npm run verify`

## Harness Follow-Ups
- Remove the old client-side `import.meta.env` exception from `scripts/harness-check.mjs`.
- Update architecture docs so the RAWG key is documented as server-only.
