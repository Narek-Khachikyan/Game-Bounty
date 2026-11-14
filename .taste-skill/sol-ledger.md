# Sol correctness ledger

Model codex/gpt-6.1-sol, high, priority. Budget3 rounds total, not restarted after Council return.

- Round1 candidate2: CHANGES. S1 [should] full RAWG result in spotlight leaks extra fields through persistence spread; Firestore hasOnly rejects save. Fixed in persistence owner by whitelisting six fields and preserving platform normalization. Regression test supplies slug/rating/ratings_count/nested metadata and checks actual setDoc payload. Full verify now42 tests. Confirmed resolved by Sol round2.
- Optional Council polish: card header whitespace (A6/B2/C-09) and desktop action height (B9) deferred; no blocker/major. Do not extend correctness scope for these.
- Round2 candidate3: APPROVE. S1 resolved; four focused tests independently passed, current hashes match, no new findings. Same task base and diff command as sol-brief.md. Two of three review rounds used. No code edits after approval. No pushes. Token usage not returned.
