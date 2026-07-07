# Testing

## Test frameworks and locations
- Unit/integration tests: Vitest + React Testing Library.
- Test files live next to the code under test as `*.test.ts` / `*.test.tsx`; shared test helpers live in `src/test/`.

## How to run tests
- Firestore rules regression check: `npm run firestore:rules:test`
- Unit/integration tests: `npm run test`
- Test type-checking: `npm run test:typecheck`
- Harness validation: `npm run harness:check`
- Linting: `npm run lint`
- Type-check + production build: `npm run build`
- Full local verification: `npm run verify` (includes `test:typecheck`, `test`, and `firestore:rules:test`; requires Java 21+ for the emulator)

## Coverage / quality gates
- Firestore rules gate: `npm run firestore:rules:test` runs the Firestore Emulator through the bundled public Firebase CLI against the repo rules file and covers owner access, payload validation, server timestamps, update/delete behavior, and the current nested-platform validation boundary.
- The Firestore rules runner defaults to `127.0.0.1:8081` to avoid common local port conflicts; override it with `FIRESTORE_EMULATOR_HOST=<host>:<port>` when needed.
- Vitest gate: `npm run test` covers favorites reducers/selectors, auth redirect safety, protected-route auth gating, and Firestore favorites sync behavior.
- Test type gate: `npm run test:typecheck` runs TypeScript against app and test files using `tsconfig.test.json`.
- Harness gate: `npm run harness:check` validates required docs, links, and architectural boundary checks.
- Linting gate: `npm run lint` runs with `--max-warnings 0`.
- Type-checking gate: `npm run build` runs `tsc` before `vite build`.
