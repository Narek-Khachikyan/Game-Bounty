# Setup

## Prerequisites
- Node.js 20 or newer.
- npm.

## Install
- `npm install`

The repository standardizes on `npm` and the checked-in `package-lock.json`. The root `.nvmrc` pins the deploy/runtime expectation to Node 20 for local shells and Netlify.

## Environment variables and secrets
- `RAWG_API_KEY` — RAWG API key used only by the server-side proxy (see `.env.example:1`).
- Do not commit real API keys; prefer `.env.local` for local dev.

## Firebase
- The client uses the Firebase project configured in `src/lib/firebase.ts:1`.
- In the Firebase console for project `gamebounty-35933`, enable:
  - Authentication → Sign-in method → `Email/Password`
  - Authentication → Sign-in method → `Google`
- Create a Cloud Firestore database for the same project if it does not exist yet.
- Deploy the rules from `firestore.rules:1` so users can only access their own `users/{uid}/favorites/{favoriteId}` documents and only write the validated favorite shape with a server-authored `savedAt`.
- For local development, ensure `localhost` is present in Firebase Authentication authorized domains.

## Run (development)
- `npm run dev`
- Default local URL: `http://localhost:5173/`
- The Vite dev server reads `RAWG_API_KEY` from your local environment and proxies browser requests through `/api/rawg/*`.
- If port `5173` is already occupied, Vite will print the next available local URL in the terminal.

## Build / preview
- `npm run build`
- `npm run preview`
- The local preview server keeps the same `/api/rawg/*` proxy contract, so RAWG-backed pages can be checked without Netlify CLI.

## Lint
- `npm run lint`

## Harness validation
- `npm run firestore:rules:test`
- `npm run harness:check`
- `npm run verify` (includes `firestore:rules:test`, so it also requires Java 21+)

The Firestore rules check requires a local Java 21+ runtime because the current Firestore Emulator jar no longer starts on Java 17. The repo runs that check through the bundled public `firebase emulators:exec` CLI flow rather than private `firebase-tools` module imports.
