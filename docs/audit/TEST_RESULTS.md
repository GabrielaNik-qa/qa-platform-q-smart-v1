# Q-SMART – Test results

Audit dates: 2026-10-24 (round 1 and round 2, maximum depth) · Branch: `q-smart-full-audit`

Environment:
- Windows 11 Pro, PowerShell
- Node.js v24.11.0, npm 11.6.1
- Project folder inside OneDrive

## Round 1

| # | Command | Result |
|---|---|---|
| 1 | `npm.cmd test` (baseline) | **79 tests, 79 passed** (15.4 s) |
| 2 | `npm.cmd audit` (baseline) | 3 vulnerabilities: 1 high (`body-parser` < 2.4.0), 2 moderate (`uuid` through `exceljs`) |
| 3 | Secret-pattern scan of all 25 Git revisions | 0 hits |
| 4 | `node --test test/security.test.js` before the fixes | 13 tests: 1 passed (setup), **12 failed**, each for the expected reason |
| 5 | Same, after the fixes | 14 of 14 passed (one test added for F-2) |
| 6 | `npm.cmd audit fix` (without `--force`) | `body-parser` 2.3.0 → 2.4.0 |
| 7 | `npm.cmd test` | **93 of 93 passed** |
| 8 | Browser walk (admin 49 pages, agent 17 pages, pop-ups on 21 pages) | 0 trap texts executed, 1 page error (F-2, fixed) |

## Round 2 (maximum depth)

| # | Command / check | Result |
|---|---|---|
| 9 | History check: `data.json`, `audit.json`, `.env`, backups or recordings ever committed? | Never |
| 10 | Real-password hashes in each historical `seed.js` | Only the latest version (`70a2ec9`) has them: 2 accounts. It also has a registration with a real-looking personal e-mail |
| 11 | 21 new security tests before the fixes | **20 failed** for the expected reasons. 1 passed: the forwarded-address test, which covers the round-1 fix S-5 |
| 12 | Markdown timing before / after | `md("[".repeat(200000))`: **17,557 ms → 1.2 ms** |
| 13 | HTML import timing before / after (about 300 KB crafted file) | **14,004 ms → 23 ms** |
| 14 | Prototype pollution probe (throw-away server) | After one `__proto__` layout: `/api/c/admin` and `/api/skills` answered **500** for admin and agent. Fixed: refused (400) |
| 15 | Translation pattern timing (crafted 6,000-character text, Bulgarian + French) | Worst case 141 ms. The new test failed at 76 ms without the fix and passes with it |
| 16 | `node --test test/workflows-more.test.js` (new) | **14 of 14 passed** on the first run (these confirm existing behaviour) |
| 17 | Supply chain: `package-lock.json` (256 packages) | All from `registry.npmjs.org` with sha512 integrity. 0 install scripts. 6 deprecated packages, all through `exceljs` 4.4.0 (latest version). `npm outdated`: `nodemailer` 10.2.0 → 10.2.1 available (no advisory) |
| 18 | Bounded scalability measurement (made-up data, throw-away server, one request at a time) | See below |
| 19 | Final `npm.cmd test` | **129 tests, 129 passed**, 0 failed, 0 skipped, 0 cancelled (15.3 s) |
| 20 | Final `node --check` on all 51 JavaScript files | 0 syntax errors |
| 21 | Final `npm.cmd audit` | 2 moderate (`uuid` through `exceljs`): cannot be triggered here, see below |
| 22 | Final `git diff` review | Only intended files. No secrets (only made-up test passwords inside the tests). `data.json` untouched |

### Scalability measurement (item 18)

| Made-up data | `data.json` | Smallest request (`/api/me`) | All reviews (admin) | Saving any small change |
|---|---|---|---|---|
| 521 people, 3,000 reviews (≈ 3 months for 500 agents) | 18.5 MB | 111 ms | 231 ms (9 MB answer) | **980 ms** |
| 521 people, 12,000 reviews (≈ 1 year for 500 agents) | 73.3 MB | 384 ms | 700 ms (36 MB answer) | **1,732 ms** |

The server handles one request at a time, so these delays add up for everybody. This is the measured reason for the planned SQLite move (R-3).

### Browser re-test (round 2, new trap texts in about 30 more places)

| Check | Result |
|---|---|
| Hostile shared view, **old** `widgets.js` | **3 traps executed**: view id (click), widget key (mouse-over), team name (on display). Proof of S-13 |
| Same data, **fixed** `widgets.js` | 0 executed. The view still works and both widgets are drawn |
| Admin: 48 pages, 122 pop-ups, ≈ 69,500 elements hovered or focused | 0 executed, 0 page errors, 0 broken text |
| QA: 36 pages, 91 pop-ups, ≈ 48,300 elements | 0 executed, 0 errors. 12 admin calls refused (403); planner setting allowed |
| Team lead: 32 pages, 87 pop-ups, ≈ 35,400 elements | 0 executed, 0 errors |
| Agent: 17 pages, 23 pop-ups | 0 executed, 0 errors. Export centre and shared views refused, bulk import refused, only own reviews |
| Ctrl+K search "O'Brien" | Opens Reviews with that search (F-7) |
| `#constructor`, `#__proto__`, `#toString` | Dashboard shown (F-9) |
| Red-flag and "Open risk case" buttons on a lead ID with `'`, `\` and a line break | Open with the exact text (F-8) |
| Export payloads | Quick Flags sends date column 2, Report builder sends none (F-3, F-4) |
| Widget "review type" filter | Kept after saving (F-6) |
| Password changed from another session | This browser was signed out: "Your session expired. Please sign in again." (S-14) |
| Accessibility scan: 46 admin pages, 17 agent pages | 0 controls without a name, 0 clickable elements unreachable by keyboard |

### Defect introduced during the audit

A comment placed in the middle of a line in `public/js/comply.js` (round 2) stopped that file from loading. The browser test caught it (the Compliance page showed the dashboard). It was fixed, all 51 files were re-checked with `node --check`, and the four pages were reopened. It was never committed.

## Remaining dependency advisories

- **Package:** `uuid` < 11.1.1, moderate severity, pulled in by `exceljs`.
- **Why it cannot be triggered here:** it only affects `v3`/`v5`/`v6` with a buffer, and `exceljs` only calls `uuid.v4()` without one.
- **Why it was not fixed:** the only automatic fix downgrades `exceljs` to 3.4.0, a breaking change.
- **Decision:** accepted. See R-22 for the maintenance concern.

## Not performed

| Check | Why |
|---|---|
| OWASP ZAP or other dynamic scanner | Not installed |
| ESLint or other static analysis | Not configured in the project |
| Live e-mail (SMTP) and live AI (Anthropic) | No credentials used |
| Load and stress tests | Only the bounded measurement above (one request at a time) |
| Real phones and tablets, screen readers, colour contrast | Not available or not done |
| GitHub repository visibility | `gh` CLI not installed |

## Remaining failures

None. All 129 automated tests pass. The open items are design and architecture limits, not failing tests (REMAINING_ISSUES.md).

## Round 3 (26 October 2026): every action, every role

**Automated tests: 135, all passing** (`npm test`, about 16 seconds). New in this round:

| Test | What it proves |
|---|---|
| `role-matrix.test.js` | All **142 server routes** (read from the source, so new routes are covered by themselves) are tried by admin, QA, team lead, trainer, agent and a signed-out visitor, with an empty body and with a body of wrong types: no 500 anywhere, **459 correct 403s**, **253 correct 401s**, nothing of a wrong type saved, and the project's `seed.js` / `data.json` come out byte for byte the same |
| `md-and-syntax.test.js` › no two page scripts declare the same top-level name | a clash silently stops a whole page from loading (it happened once during this round) |
| `workflows-more.test.js` › widget sizes, table columns, old-style library categories | the new dashboard sizes and saved columns are cleaned by the server; categories saved by the seed come back with their name |

**Browser sweep (copy of the real data, port 3199):** every page (48) opened as each role:

| Role | Pages that open | Script errors | Pages sent back to the dashboard (as the rules say) |
|---|---|---|---|
| Admin | 48 | 0 | none |
| QA | 38 | 0 | the 10 admin pages |
| Team lead | 34 | 0 | QA Entry, scorecard set-up (3), admin pages |
| Trainer | 32 | 0 | as team lead + Review planner, QA workload |
| Agent | 19 | 0 | everything for staff; the agent sees only their own reviews and AutoQA conversations |

New features checked by hand in the browser:
- dashboard chips (add, choose, ✕, Reset), widget resize by mouse (width snaps to the grid, height free, saved), Dashboard / Views tabs
- Reviews Filters panel (live count) and Columns (hide, show, drag, saved on the server, survives a reload, fast clicks)
- tasks Compact / Detailed / List
- Team Review fold and views
- Category Stats tiles and the three pop-ups
- scorecard tabs, category search, cards / table
- top scrollbar only while the bottom one is off screen

`npm audit --omit=dev`: unchanged since round 2 (the moderate `uuid` advisory through `exceljs`, R-19).
