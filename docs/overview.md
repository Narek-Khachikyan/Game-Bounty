# Overview

## Purpose and scope
- Game discovery frontend for browsing/searching games, signing in with Firebase, and saving favorites.
- Uses the RAWG public API as the system of record for game data and Firebase Authentication for user sessions.

## High-level capabilities
- Search games by title (RAWG search query param).
- Filter games by genre and platform.
- View game details (screenshots, ratings, release date, DLC, same series).
- Sign in with Email/Password or Google through Firebase Authentication.
- Manage a local favorites list (in Redux state).

## Primary entry points
- UI: React SPA mounted at `src/main.tsx:9` with routing in `src/App.tsx:1`.
- Data fetching: RTK Query endpoints in `src/app/redux/features/apiSlice.ts:14`.
- Authentication: Firebase auth wiring in `src/context/AuthProvider.tsx:1`.

## Project shape
- Single-package frontend app (not a monorepo): single `package.json` at repo root.

## Key directories
- `src/app/`: Redux store + slices + typed hooks.
- `src/context/`: app-level providers for cross-route runtime state such as Firebase auth.
- `src/page/`: route-level pages (`Games`, `Favorites`, `NotFound`).
- `src/lib/`: third-party client runtime initialization such as Firebase.
- `src/layouts/`: layout wrappers (`MainLayout`).
- `src/components/`: reusable UI building blocks (cards, filters, header, skeletons).
- `src/@types/`: TypeScript types for RAWG API responses.
- `src/assets/`: images/video assets used by the UI.
- `public/`: static assets and SPA redirect rules (`public/_redirects:1`).
