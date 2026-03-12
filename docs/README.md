# Game-Bounty Knowledge Base

Executive summary: Game-Bounty is a Vite + React + TypeScript SPA for browsing RAWG data, viewing detailed game pages, and storing favorites locally in the browser.

This directory is the project system of record for humans and coding agents. Root files stay short and point here; durable project knowledge lives here.

## Recommended Read Order
- [Overview](./overview.md)
- [Architecture](./architecture.md)
- [Architecture invariants](./architecture-invariants.md)
- [Development standards](./development-standards.md)
- [Setup](./setup.md)
- [Operations](./operations.md)
- [Testing](./testing.md)
- [Quality scorecard](./quality-scorecard.md)
- [Execution plans](./exec-plans/README.md)
- [Project facts](./references/project-facts.md)
- [Code map](./code-map.md)
- [Dependencies](./dependencies.md)
- [Risks](./risks.md)
- [Harness guide](./harness.md)
- [AI agents guide](./ai-agents-guide.md)

## Source-Of-Truth Map
- Stable system shape: [../ARCHITECTURE.md](../ARCHITECTURE.md) and [./architecture.md](./architecture.md)
- Non-negotiable repo constraints: [./architecture-invariants.md](./architecture-invariants.md)
- Verified current-state facts: [./references/project-facts.md](./references/project-facts.md)
- Ongoing quality gaps and cleanup queue: [./quality-scorecard.md](./quality-scorecard.md)
- Multi-step implementation plans: [./exec-plans/README.md](./exec-plans/README.md)

## Maintenance Rules
- Update the relevant source-of-truth doc in the same change as code.
- If code needs to break an invariant, update the invariant and the harness check deliberately.
- If a bug slips through, add or strengthen a guardrail in docs, plans, or automation.
- Keep root instruction files lightweight; expand detail here instead of duplicating guidance.
