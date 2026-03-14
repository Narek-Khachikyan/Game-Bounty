# Harness Guide

This repository follows the harness-engineering pattern: we do not rely on prompt memory alone. We keep durable repo knowledge, execution plans, and mechanical checks in the codebase so agents can navigate and extend the project reliably.

## Harness Components
- Root entrypoints: `AGENTS.md`, `CLAUDE.md`, and `ARCHITECTURE.md`
- Knowledge base: `docs/README.md` plus the topical docs it indexes
- Stable boundaries: `docs/architecture-invariants.md`
- Quality backlog: `docs/quality-scorecard.md`
- Execution memory: `docs/exec-plans/`
- Mechanical verification: `npm run harness:check`

## Maintenance Loop
1. Use the docs to understand the current system.
2. For non-trivial work, create or update a plan in `docs/exec-plans/`.
3. Change code and docs together.
4. Run `npm run harness:check` plus normal build/lint validation.
5. If a bug, review comment, or confusing handoff exposes a missing guardrail, improve the harness.

## What Goes Where
- Stable, long-lived project knowledge belongs in `docs/`.
- Task-specific sequencing belongs in `docs/exec-plans/`.
- Active quality gaps and cleanup targets belong in `docs/quality-scorecard.md`.
- Mechanical rules belong in `scripts/harness-check.mjs` and should be documented in `docs/architecture-invariants.md`.
- Verification scripts should prefer public tool entrypoints; the harness currently blocks private `firebase-tools/lib/*` imports in repo-owned scripts.
