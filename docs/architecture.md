# Architecture

## System shape
- Client-only SPA that calls the RAWG REST API directly from the browser.

## Main modules and responsibilities
- Routing
  - Defines the route tree under `MainLayout` (`src/App.tsx:11`).
  - Routes:
    - `/` → `src/page/Games.tsx`
    - `/game/:id` → `src/components/GameCardInfo/GameCardInfo.tsx`
    - `/favorites` → `src/page/Favorites.tsx`
- Layout
  - `MainLayout` renders background video + header + `<Outlet />` (`src/layouts/MainLayout.tsx:14`).
- Data layer (RAWG)
  - RTK Query API slice defines endpoints for games/genres/platforms/details/screenshots/DLC/series (`src/app/redux/features/apiSlice.ts:14`).
  - Uses `VITE_API_KEY` for authentication (`src/app/redux/features/apiSlice.ts:12`).
- Local state (favorites)
  - Redux slice stores favorites list and derived count (`src/app/redux/features/favoriteSlice.ts:14`).
- Store wiring
  - Redux store combines RTK Query reducer and favorites slice; adds RTK Query middleware (`src/app/store.ts:5`).

## Data flow (typical)
- Page/component renders → calls RTK Query hook (e.g. `useGetGamesDataQuery`) → RTK Query performs fetch against RAWG → component renders results.
- Favorites interactions dispatch `addItem/removeItem/clearFavorites` to update local Redux state.

## Deployment topology
- Static Vite build output served by a static host.
- Netlify-style SPA routing via `public/_redirects:1`.

