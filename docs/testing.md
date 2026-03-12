# Testing

## Test frameworks and locations
- Unit/integration tests: Not configured (no `test` script in `package.json`).

## How to run tests
- Harness validation: `npm run harness:check`
- Linting: `npm run lint`
- Type-check + production build: `npm run build`
- Full local verification: `npm run verify`

## Coverage / quality gates
- Harness gate: `npm run harness:check` validates required docs, links, and architectural boundary checks.
- Linting gate: `npm run lint` runs with `--max-warnings 0`.
- Type-checking gate: `npm run build` runs `tsc` before `vite build`.
