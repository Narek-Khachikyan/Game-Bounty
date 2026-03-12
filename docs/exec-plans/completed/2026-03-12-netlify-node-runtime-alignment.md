# Netlify Node Runtime Alignment

Status: completed
Owner: Codex
Started: 2026-03-12
Completed: 2026-03-12

## Goal
Make Netlify deploy previews install and build this SPA reliably by aligning the repo's declared Node.js runtime and package-manager expectations with the current Firebase dependency tree.

## Why Now
Deploy Preview for PR #2 is failing during dependency installation because Netlify selected Yarn on Node 18, while the Firebase dependency tree now includes packages that require Node 20 or newer.

## Constraints
- Keep the existing SPA deployment shape intact.
- Preserve the project harness and keep docs synchronized with repository behavior.
- Prefer the smallest change that fixes both the immediate Netlify failure and the mixed package-manager ambiguity.

## Plan
1. Add repo-level runtime/package-manager guidance that Netlify will honor during deploys.
2. Update source-of-truth docs to reflect the supported Node.js and package-manager path.
3. Run repository verification and record the outcome before handoff.

## Progress Log
- 2026-03-12: started work after confirming Netlify failed on Yarn install with Node 18 against `firebase@12.10.0` transitives that require Node 20+.
- 2026-03-12: added `.nvmrc`, declared the Node engine in `package.json`, removed `yarn.lock`, and updated setup/operations/current-state docs to standardize on Node 20 + npm.
- 2026-03-12: ran `npm run verify` successfully after the repo/runtime alignment changes.

## Verification
- `npm run verify`

## Harness Follow-Ups
- Keep setup and current-state facts aligned with the chosen package-manager and Node.js runtime.
