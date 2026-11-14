VERDICT: APPROVE

S1 [should] — RESOLVED. [userFavorites.ts:108](/Users/narek_khachikyan/.t3/worktrees/Game-Bounty/t3-6fe550cc-97ee44f14034990e/src/lib/userFavorites.ts:108) explicitly whitelists six game fields and retains platform normalization, matching Firestore’s allowed keys once `savedAt` is added.

The [regression test](/Users/narek_khachikyan/.t3/worktrees/Game-Bounty/t3-6fe550cc-97ee44f14034990e/src/lib/userFavorites.test.ts:18) exercises the actual persistence entrypoint with extra RAWG fields and asserts the exact payload.

Candidate hashes match; source delta is limited to this fix and test. Four focused tests passed independently. No new findings. No live authenticated write was performed or claimed.