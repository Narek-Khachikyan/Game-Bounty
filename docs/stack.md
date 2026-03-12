# Stack

## Languages
- TypeScript (source: `tsconfig.json:1`)
- CSS + Sass/SCSS (source: `package.json:1` includes `sass`)

## UI framework
- React 18 (source: `package.json:1`)
- React Router v6 (source: `package.json:1`, routes in `src/App.tsx:11`)

## State management / data fetching
- Redux Toolkit (source: `package.json:1`)
- RTK Query (source: `src/app/redux/features/apiSlice.ts:1`)

## Styling
- Tailwind CSS (source: `tailwind.config.js:1`, `src/index.css:1`)
- Autoprefixer + PostCSS (source: `postcss.config.js:1`)

## UI/UX libraries
- Swiper (carousel) (source: `package.json:1`)
- AOS (scroll animations) (source: `src/layouts/MainLayout.tsx:6`)
- react-content-loader (skeleton loaders) (source: `package.json:1`)

## External services
- RAWG API (`https://api.rawg.io/api`) via same-origin proxy (`server/rawgProxy.js:1`)

## Build tooling
- Vite (source: `package.json:1`, `vite.config.ts:1`)
- ESLint (source: `package.json:1`, `.eslintrc.cjs:1`)
