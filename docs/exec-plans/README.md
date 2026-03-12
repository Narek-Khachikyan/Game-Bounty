# Execution Plans

Execution plans are repo artifacts for non-trivial work. They let future contributors recover the intent, sequencing, verification steps, and follow-up harness changes without needing hidden chat context.

## When To Create A Plan
- The task spans multiple files or layers.
- The sequence matters.
- There is meaningful risk, cleanup, or verification work to track.
- You expect the work to continue across multiple sessions.

## Workflow
1. Copy [TEMPLATE.md](./TEMPLATE.md) into `active/` with a dated descriptive filename.
2. Keep the plan updated as the work progresses.
3. Record verification and any harness follow-ups before marking it complete.
4. Move the finished plan into `completed/`.

## Directories
- [active/README.md](./active/README.md)
- [completed/README.md](./completed/README.md)
