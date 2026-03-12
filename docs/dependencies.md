# Dependencies

## First-party packages/services
- Not applicable (single-package frontend app).

## Third-party dependencies (high impact)
- `react`, `react-dom` — UI runtime.
- `react-router-dom` — routing.
- `@reduxjs/toolkit`, `react-redux` — state + RTK Query.
- `firebase` — Firebase app bootstrap, Authentication SDK, and Firestore SDK.
- `tailwindcss`, `postcss`, `autoprefixer` — styling toolchain.
- `sass` — SCSS compilation.
- `swiper` — carousels/sliders.
- `aos` — scroll animations.
- `react-content-loader` — skeleton UI loaders.

## Critical runtime dependencies
- RAWG API availability + key (`src/app/redux/features/apiSlice.ts:17`, `.env.example:1`).
- Firebase Authentication project configuration and enabled providers (`src/lib/firebase.ts:1`).
- Cloud Firestore database availability and deployed rules for `users/{uid}/favorites/{favoriteId}` (`src/lib/userFavorites.ts:1`, `firestore.rules:1`).
