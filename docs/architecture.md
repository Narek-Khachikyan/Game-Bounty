# Architecture

## System shape
- Static-hosted SPA that reaches RAWG through a same-origin proxy while managing session auth with Firebase Authentication plus account-scoped favorites in Cloud Firestore.
- Stable architecture rules and mechanical boundaries live in [./architecture-invariants.md](./architecture-invariants.md).

## Main modules and responsibilities
- Routing
  - Defines the route tree under `MainLayout` (`src/App.tsx:11`).
  - Routes:
    - `/` → `src/page/Games.tsx`
    - `/game/:id` → `src/components/GameCardInfo/GameCardInfo.tsx`
    - `/favorites` → `src/page/Favorites.tsx`
    - `/auth` → `src/page/Auth.tsx`
- Layout
  - `MainLayout` renders background video + header + `<Outlet />` (`src/layouts/MainLayout.tsx:14`).
- Authentication
  - Firebase runtime is initialized in `src/lib/firebase.ts:1`.
  - `AuthProvider` restores session state and exposes sign-in/sign-out actions to the app shell (`src/context/AuthProvider.tsx:1`).
  - `src/page/Auth.tsx:1` owns the Email/Password and Google sign-in UI.
- Data layer (RAWG)
  - RTK Query API slice defines endpoints for games/genres/platforms/details/screenshots/DLC/series (`src/app/redux/features/apiSlice.ts:14`).
  - Browser requests stay same-origin at `/api/rawg/*` and never embed the RAWG key in the client bundle.
  - Server-side RAWG key injection is centralized in `server/rawgProxy.js:1`, reused by the Vite dev server (`vite.config.ts:1`) and the Netlify Function (`netlify/functions/rawg.js:1`).
- Favorites data
  - Firestore CRUD and snapshot subscription live in `src/lib/userFavorites.ts:1`.
  - `FavoritesSync` mirrors the signed-in user's Firestore favorites into the Redux slice (`src/components/FavoritesSync/FavoritesSync.tsx:1`).
  - `/favorites` is auth-protected and favorites actions redirect guests to `/auth` with a `next` return path.
- Store wiring
  - Redux store combines RTK Query reducer and favorites slice; adds RTK Query middleware (`src/app/store.ts:1`).

## Data flow (typical)
- App bootstraps → `AuthProvider` subscribes to Firebase auth state → header/auth page render session-aware UI.
- Page/component renders → calls RTK Query hook (e.g. `useGetGamesDataQuery`) → RTK Query performs a same-origin fetch to `/api/rawg/*` → the server proxy appends the RAWG key and calls RAWG → component renders results.
- Signed-in user changes a favorite → UI calls Firestore CRUD → Firestore snapshot updates → `FavoritesSync` replaces Redux favorites state.
- Guest opens `/favorites` or clicks a favorites action → app redirects to `/auth?next=...` until sign-in succeeds.

## Deployment topology
- Static Vite build output served by a static host.
- Netlify routes `/api/rawg/*` to the `rawg` function before the SPA fallback (`public/_redirects:1`).
- Local `npm run dev` and `npm run preview` use Vite middleware to serve the same `/api/rawg/*` contract without requiring Netlify CLI.
