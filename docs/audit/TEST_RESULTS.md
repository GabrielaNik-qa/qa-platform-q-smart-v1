# Q-SMART – Test results

Audit date: 2026-10-24 · Branch: `q-smart-full-audit`

Environment:
- Windows 11 Pro, PowerShell
- Node.js v24.11.0, npm 11.6.1
- Project folder inside OneDrive

## Commands and results

| # | When | Command | Result |
|---|---|---|---|
| 1 | Baseline | `npm.cmd test` | **79 tests, 79 passed**, 0 failed, 0 skipped (15.4 s) |
| 2 | Baseline | `npm.cmd audit` | 3 vulnerabilities: 1 high (`body-parser` < 2.4.0, DoS with compressed bodies), 2 moderate (`uuid` < 11.1.1 through `exceljs`) |
| 3 | Baseline | Secret-pattern scan of all 25 Git revisions (Anthropic, AWS, GitHub and Slack key formats, private keys) | 0 hits |
| 4 | Before fixes | `node --test test/security.test.js` (new file) | 13 tests: 1 passed (setup), **12 failed**, each for the expected reason (see SECURITY_AUDIT.md, "Evidence") |
| 5 | After fixes | `node --test test/security.test.js` | **14 tests, 14 passed** (one test added for F-2) |
| 6 | After fixes | `npm.cmd audit fix` (without `--force`) | `body-parser` 2.3.0 → 2.4.0 in `package-lock.json`. The installed copy then had to be reinstalled because the folder still held 2.3.0 |
| 7 | Final | `npm.cmd test` | **93 tests, 93 passed**, 0 failed, 0 skipped, 0 cancelled |
| 8 | Final | `node --check` on every `.js` file in the project root and `public/js` | 0 syntax errors |
| 9 | Final | `npm.cmd audit` | 2 moderate (`uuid` through `exceljs`): see below |
| 10 | Final | `git diff` review | Only intended files changed. No secrets, no test artifacts. `data.json` is untouched |

There is no linter, formatter or build step in the project. `node --check` and the existing test "every JavaScript file compiles" are the only static checks. ESLint is recommended (REMAINING_ISSUES.md).

## Remaining dependency advisories

- **Package:** `uuid` < 11.1.1, moderate severity ("missing buffer bounds check in v3/v5/v6 when buf is provided"), pulled in by `exceljs` 4.4.0.
- **Can it be triggered here?** No. `exceljs` only calls `uuid.v4()` without a buffer (`node_modules/exceljs/lib/xlsx/xform/sheet/cf-ext/cf-rule-ext-xform.js`).
- **Why it was not fixed:** the only automatic fix downgrades `exceljs` to 3.4.0, a breaking change.
- **Decision:** accepted. Re-check when `exceljs` releases an update.

## Browser tests (scripted, throw-away data copy on port 3199)

| Check | Result |
|---|---|
| All 49 pages as admin | Opened. No JavaScript errors, no broken text |
| All 17 pages of the agent menu as agent | Opened. No JavaScript errors, no broken text |
| View and edit pop-ups on 21 pages (including the review that holds trap text) | Opened, no errors |
| Stored XSS traps in about 40 fields | **0 executed.** The trap text showed as plain text |
| 12 staff/admin API calls made as an agent | 12 × 403 |
| Agent's review list | Only their own review |
| Dashboard vs report engine vs independent calculation | Identical: 153 reviews, 92.5% average, 87.6% pass rate |
| Stored score vs answers (153 reviews) | 0 differences |
| Call Simulator after fix F-1 | 1 good reply of 2 saved 50% (was always 0%) |
| Improvement plans page | Crashed on a malformed plan (from the audit's own test data) → server check added (F-2). The page then opened without errors |
| Width 375 px | The intended "screen too narrow" message, no sideways scrolling |
| Width 768 px (29 pages) | No page wider than the screen |

These browser checks were run by hand in this session. They are **not** saved as automated tests in the repository.

## Not performed

| Check | Why |
|---|---|
| OWASP ZAP or other dynamic scanner | Not installed |
| ESLint or other static analysis | Not configured in the project |
| Live e-mail (SMTP) and live AI (Anthropic) | No credentials used. The no-SMTP and no-AI fallbacks ran |
| Faked `X-Forwarded-For` from another machine | Tests run on this computer, which is the trusted tunnel address. Covered by code review |
| Load, stress and concurrency tests | Out of scope for a local JSON-file app. Limits documented |
| Real phones and tablets, screen readers, full keyboard-only pass | Not available or not done |
| GitHub repository visibility | `gh` CLI not installed |

## Remaining failures

None. All 93 automated tests pass. The open items are design and architecture limits, not failing tests (REMAINING_ISSUES.md).
