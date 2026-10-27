# Round 4 – running log

Started 2026-10-28. Branch `q-smart-v1-audit`, made from `q-smart-v1` at `3440283` (2026-10-27 22:34, "Remove every company mention…").
If this session stops, the next one continues from this file.

## Safety set-up (§1)

- Real files fingerprinted at the start (size, SHA-256; content never read or printed):

  | File | Size | SHA-256 (first 16) |
  |---|---|---|
  | data.json | 4,557,295 | 67C759EFD8A8B752 |
  | seed.js | 2,274,036 | 70AC11D12EC67868 |
  | audit.json | 8,452 | 28F93FB5F7E302FC |
  | .qsmart-key | 64 | 044ECC8AD3CBFA06 |

- Throw-away folder: `%TEMP%\qsmart-round4-test` (new and empty at the start), with its own `data.json` (from `seed.js`, written by a
  script that refuses the project folder), `audit.json`, `rec\`, `backups\` and its own `.qsmart-key` (made by the app at first start).
  In the copy only, every test user's password was set to `password` (the real seed holds two real password hashes, R-5).
- Ports: 3199 and 3299 were still held by test servers left running by yesterday's audit session (started 27 Oct 22:09 and 22:30).
  They were not stopped (another session's processes). Round 4 uses **3200** for the app and **3298** for the fake AI instead.
  `.claude/launch.json`: new entries `q-smart-round4` and `fake-ai`; `q-smart` and the old `q-smart-audit` untouched.
- Checked before testing: the server writes only to `DATA_FILE`, `AUDIT_FILE`, `REC_DIR`, `BACKUPS_DIR` and the folder of `DATA_FILE`
  (`.qsmart-key`, `ai-usage.json`). "Reset data" runs `seed.js` with the same `DATA_FILE`; "Refresh seed.js" refuses on a copy (S-28).
  `adduser.js` and `seed.js` run by hand would use the real file unless `DATA_FILE` is set – never run in this round.

## Git (§2)

- Uncommitted on `q-smart-v1` at the start: only `.claude/` (untracked on purpose).
- Other branches: `main`, `q-smart-full-audit`, `q-smart-latest-23-10-26` and `origin/V7` have nothing that `q-smart-v1` lacks.
  `origin/main` (GitHub) has 17 commits of an older line of work (24 Oct: registration with first/last name, reports, planning,
  accessibility…) that split off at `020ac44`; most of those features were rebuilt later on `q-smart-v1`. Not merged.
- Baseline on `q-smart-v1`: `npm.cmd test` → 168 tests, 168 passed, 0 failed, 46.4 s.

## Status by phase

| Phase | Status |
|---|---|
| 1 Map | in progress |
