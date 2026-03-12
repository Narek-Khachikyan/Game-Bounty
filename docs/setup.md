# Setup

## Prerequisites
- Node.js 20 or newer.
- npm.

## Install
- `npm install`

The repository standardizes on `npm` and the checked-in `package-lock.json`. The root `.nvmrc` pins the deploy/runtime expectation to Node 20 for local shells and Netlify.

## Environment variables and secrets
- `VITE_API_KEY` — RAWG API key (see `.env.example:1`).
- Do not commit real API keys; prefer `.env.local` for local dev.

## Firebase
- The client uses the Firebase project configured in `src/lib/firebase.ts:1`.
- In the Firebase console for project `gamebounty-35933`, enable:
  - Authentication → Sign-in method → `Email/Password`
  - Authentication → Sign-in method → `Google`
- Create a Cloud Firestore database for the same project if it does not exist yet.
- Deploy the rules from `firestore.rules:1` so users can read and write only `users/{uid}/favorites/{favoriteId}`.
- For local development, ensure `localhost` is present in Firebase Authentication authorized domains.

## Run (development)
- `npm run dev`
- Default local URL: `http://localhost:5173/`
- If port `5173` is already occupied, Vite will print the next available local URL in the terminal.

## Build / preview
- `npm run build`
- `npm run preview`

## Lint
- `npm run lint`

## Harness validation
- `npm run harness:check`
- `npm run verify`
