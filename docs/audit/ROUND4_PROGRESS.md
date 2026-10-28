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
| 1 Map | Done for the server: 219 routes read from the code (role matrix); new modules read line by line (att, today, cap, wf, ai, org). Inventory written in PROJECT_INVENTORY.md (Round 4). |
| 2 Baseline | Done: 168 tests pass on q-smart-v1; Node 24.11.0, npm 11.6.1, Windows 11; ESLint added (`npm.cmd run lint`, 0 problems after fixing 15 duplicate translation entries). |
| 3 Multi-role | Server: role matrix now covers all 218 routes (guards like `need(...QA)` were skipped before). Browser: every page of every role opened on the copy (admin 68, QA 49, lead 45, trainer 44, agent 25 pages), 0 console errors, 0 failed requests; forbidden and odd addresses (`#users`, `#constructor`, `#%00`…) show the dashboard. IDOR tests for time off, attendance, capacity, AI, Q-Intelligence (pentest-round4*.test.js). |
| 4 BAU | Partly: the routines are written in BAU_SCENARIOS.md; the steps covered by API tests are marked; full click-through in the browser not done for every routine. |
| 5 Functional | Partly: existing calculation tests kept (scores, attendance, leave, Bradford, capacity); no new calculation defects found in the code read. |
| 6 Security | Done for the planned checks: S-29, S-30 (cross-workspace AI data), deep JSON 500, R-13, R-15, R-25, R-26, R-9, CSP, Origin check, personal data download. ZAP not installed (not run). |
| 7 Speed | Measured before/after on normal (4.5 MB) and large (449 MB) data; gzip for API answers and page files; one disk read per reviews list instead of one per review; speed check test added. |
| 8 Localization | New server messages translated; duplicates removed; server messages without a translation listed in LOCALIZATION_AUDIT.md. |
| 9 Regression | Full suite after every change; R-/S-/F- checklist in REMAINING_ISSUES.md (Round 4). |
| 10 E2E | Playwright: see TEST_RESULTS.md (Round 4). |
| 11 A11y | Quick checks only (see FUNCTIONAL_AUDIT.md, Round 4). |
| 12 Reliability | Write-then-rename kept; 20 parallel saves all kept; health route and clean shutdown added. |

## Commits on q-smart-v1-audit

1. `0f72aae` AI insights, topics and the AI trainer quiz no longer read the other workspace's data (S-29, S-30).
2. `7c37fcf` Safer sign-in log, uploads, links, copies for Excel and browser protections.
3. `325c1ee` Code checker and the shared-names check.
4. (next) Speed: compression, the recordings check, the speed test, the large data generator.

## Next steps for a new session

- Read this file, then `docs/audit/DECISIONS_FOR_YOU.md` (Round 4) for the questions waiting for Gabriela.
- Start the copy with the launch entries `fake-ai` and `q-smart-round4` (ports 3298 and 3200).
