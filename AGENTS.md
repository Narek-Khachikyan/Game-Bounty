# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React + TypeScript frontend. Core paths:
- `src/` application code. Entry points live in `src/main.tsx` and `src/App.tsx`.
- `src/app/` Redux Toolkit setup (store, RTK Query slices).
- `src/components/`, `src/layouts/`, `src/page/` for UI composition.
- `src/hooks/`, `src/utils/`, `src/@types/` for shared logic and types.
- `src/assets/` for images; `src/GlobalStyles/` and `src/index.css` for global styling.
- `public/` static assets, `dist/` build output.

## Build, Test, and Development Commands
- `npm run dev` starts the local Vite dev server with HMR.
- `npm run build` runs TypeScript compile then builds production assets.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint on `src/` with strict warnings (max 0).
There is no test script configured yet.

## Coding Style & Naming Conventions
- Follow existing formatting: files primarily use tabs for indentation with spaces for alignment.
- React components use `PascalCase` filenames (e.g., `GameCardInfo.tsx`).
- Hooks use `useX` naming (e.g., `useGetGamesDataQuery`).
- Keep styles consistent: Tailwind utility classes plus Sass (`.scss`) where present.
- Run `npm run lint` before submitting changes.

## Testing Guidelines
- No automated tests are set up. If you add tests, prefer `*.test.tsx` or `__tests__/` adjacent to the feature.
- When introducing a test runner, add a script in `package.json` and document it here.

## Commit & Pull Request Guidelines
- Commit history uses short, descriptive messages (e.g., “Update README.md”). Keep messages concise and imperative.
- PRs should include: a short summary, how you tested (`npm run lint`, manual checks), and screenshots for UI changes.

## Security & Configuration Tips
- API requests use the RAWG API key via `VITE_API_KEY` (see `src/app/redux/features/apiSlice.tsx`).
- Don’t commit real API keys; prefer local `.env` files and sanitize before sharing.
