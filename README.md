GameBounty 🎮
GameBounty is a game discovery frontend that helps users browse, search, and favorite games.

Key Features
- Search games by title
- Filter by genre and platform
- View game details (screenshots, ratings, release dates, DLC, same series)
- Manage favorites tied to a signed-in Firebase account

Tech Stack
- Vite + React + TypeScript
- Redux Toolkit + RTK Query
- Tailwind CSS + Sass
- Swiper, AOS

Developer Workflow
- `npm run dev` starts the Vite dev server
- `npm run lint` runs ESLint
- `npm run build` runs type-check + production build
- `npm run harness:check` validates the project harness, architecture invariants, and knowledge-base links
- `npm run verify` runs the full local verification sequence

Knowledge Base
- Root entrypoints: [AGENTS.md](./AGENTS.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)
- Detailed project docs: [docs/README.md](./docs/README.md)
- Long-running work plans: [docs/exec-plans/README.md](./docs/exec-plans/README.md)

Configuration
- Create `.env.local` with `VITE_API_KEY` (see `.env.example`)

Demo
- https://game-bounty.netlify.app/

Contributing
Contributions are welcome! Please open an issue or submit a pull request.
