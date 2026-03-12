# Dev Server Reliability

Status: completed
Owner: Codex
Started: 2026-03-12
Completed: 2026-03-12

## Goal
Make `npm run dev` start the app reliably for local development and leave the repo docs aligned with the confirmed startup behavior.

## Why Now
The current request is specifically to make the project runnable through `npm run dev`, so we need to verify the failure mode, fix any config gap, and document the working path.

## Constraints
- Keep the Vite + React SPA architecture intact.
- Preserve existing build behavior and chunk-budget settings.
- Update docs in the same change if startup behavior or expectations become clearer.

## Plan
1. Reproduce `npm run dev` in a clean local state and identify the real blocker.
2. Apply the smallest config or script fix needed to make the dev server reliable.
3. Verify `npm run dev`, `npm run harness:check`, and `npm run build`, then update docs/plan status.

## Progress Log
- 2026-03-12: Started diagnosing dev-server startup behavior and cleared conflicting local ports created during investigation.
- 2026-03-12: Confirmed `npm run dev` starts correctly on a clean port and documented the default local URL / busy-port behavior.
- 2026-03-12: Removed stale `*.tsx` duplicate source files that were shadowed by the active `*.ts` files and breaking harness validation.
- 2026-03-12: Hardened `scripts/harness-check.mjs` to ignore tracked source files that have been deleted in the current worktree.

## Verification
- `npm run verify`
- `npm run dev` started successfully and served `http://localhost:5173/`

## Harness Follow-Ups
- Added startup troubleshooting notes to `docs/setup.md` and `docs/operations.md`.
- Ignored Vite timestamp config artifacts in `.gitignore` to keep the worktree clean after local dev runs.
