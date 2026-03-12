# AGENTS.md

This repository uses a harness-style setup: the root files route agents into the real knowledge base, while detailed project knowledge lives under `docs/`.

## Read This First
1. [ARCHITECTURE.md](./ARCHITECTURE.md)
2. [docs/README.md](./docs/README.md)
3. [docs/architecture-invariants.md](./docs/architecture-invariants.md)
4. For multi-step work, open or create a plan in [docs/exec-plans/README.md](./docs/exec-plans/README.md)

## Working Rules
- Treat `docs/` as the project system of record. Keep code and docs in sync in the same change.
- Preserve the invariants in [docs/architecture-invariants.md](./docs/architecture-invariants.md).
- Run `npm run harness:check` when changing docs, structure, or guardrails.
- Run `npm run verify` before handoff when practical.
- If a bug or review comment exposes a missing guardrail, update the harness as well as the code fix.

Project-specific details intentionally live in the linked docs instead of being duplicated here.
