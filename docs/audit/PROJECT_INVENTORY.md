# Q-SMART – Project inventory

Audit date: 2026-10-24 · Branch: `q-smart-full-audit` · Starting commit: `a1da4aa` ("Translate the new sections into Bulgarian and French")

## Starting point (Git)

| Item | Finding |
|---|---|
| `main` | `a1da4aa` |
| `q-smart-latest` | No reference with exactly this name exists. `q-smart-latest-23-10-26` points to the same commit as `main` (`a1da4aa`). |
| Remote | `origin` = github.com/GabrielaNik-qa/qa-platform-q-smart-v7 (`origin/main` = `a1da4aa`, `origin/V7` = `afc6b56`). Nothing was pushed by this audit. |
| Uncommitted work | Only the untracked `.claude/` folder (Claude Code settings and a leftover worktree folder). It was kept as it was. A second launch entry, `q-smart-audit`, was added to `.claude/launch.json` for the throw-away test server. |
| Baseline tests | 79 of 79 passing (`npm.cmd test`, ~15 s). |

## Architecture

- **Server:** Node.js 24 + Express 5 in one process (`server.js`). It listens on `PORT` (3000 by default; the launch configuration uses 3100) and is shared through a Cloudflare Tunnel.
- **Front end:** plain JavaScript in `public/js` (about 30 files, about 600 KB without translations), with one HTML page (`public/index.html`) and hash routing (`#dash`, `#calls`, …).
- **Database:** one JSON file, `data.json` (about 880 KB, 17 users, 152 reviews). Every request reads the whole file and every change rewrites it (written to `data.json.tmp` first, then renamed). `DATA_FILE` points the server at a different copy.
- **Other storage:**
  - `audit.json`: audit log, at most 5,000 entries, written 0.4 s after each change.
  - Call recordings: `Documents\Q-smart recordings`, or `RECORDINGS_DIR`/`REC_DIR`.
  - Backups: `backups/`, or `BACKUPS_DIR`.
  - `seed.js`: a full copy of the data, kept in Git.
- **Sessions:** `express-session` with its default in-memory store. Every sign-in ends when the server restarts.
- **Background job:** the scheduled-report e-mailer runs every 10 minutes (`routes-more.js`).
- **External services, all optional:** SMTP through nodemailer, and the Anthropic API (`ai.js`, only when `ANTHROPIC_API_KEY` is set).
- **Languages:** English, Bulgarian and French (`public/js/i18n`).

## Roles

`admin`, `qa`, `lead` (team lead), `trainer`, `agent`. All staff sit in the built-in **Administration** team. Agents belong to a working team.

**Workspaces** split the data inside one organisation:
- Admins see everything.
- Staff see the teams of the workspaces they belong to.
- Agents see only their own records.

Workspaces are **not** separate customer organisations (see SAAS_READINESS.md). The real data has one workspace.

## Modules, files and API routes

| Module | Server file | Main routes | Front-end files |
|---|---|---|---|
| Sign-in, account, registration, password reset | server.js | `/api/login`, `/api/logout`, `/api/me`, `/api/profile`, `/api/password`, `/api/password/first`, `/api/prefs`, `/api/register`, `/api/registrations/*`, `/api/forgot`, `/api/reset` | core.js, main.js, modals.js, prefs.js |
| Users, teams, roster | server.js | `/api/users/*`, `/api/teams/*`, `/api/roster` | admin.js |
| Reviews (evaluations), disputes, recordings | server.js | `/api/evaluations/*` (create, change, delete, seen, remind, dispute, dispute/msg, dispute/resolve, recording), `/api/recordings/:file` | entry.js, reviews.js, modals.js, flags.js |
| Scorecards and scoring | server.js, scorecard.js | `/api/scorecards/*` | scorecards.js, entry.js |
| Settings, layouts, saved views, notifications | server.js | `/api/settings`, `/api/settings/x/:key`, `/api/layout(s)`, `/api/views`, `/api/shared-views`, `/api/notifications/*` | widgets.js, admin2.js, main.js |
| Excel export and Export centre | server.js, routes-more.js | `/api/export/call-reviews`, `/api/exports/*` | reviews.js, flags.js, reports.js |
| Tasks, missions, templates | routes-work.js | `/api/tasks/*`, `/api/task-templates/*` | tasks.js |
| Coaching, one-to-ones, calibration | routes-work.js | `/api/sessions/*`, `/api/calibrations/*` | work.js |
| Quick flags, call simulator | routes-work.js | `/api/qflags/*`, `/api/simulations` | flags.js, pages.js |
| Reports (builder, saved, scheduled) | routes-more.js, public/js/rpt-engine.js | `/api/c/reports`, `/api/c/reports/:id/send` | reports.js, rpt-engine.js |
| Performance (goals, improvement plans, recognition), Compliance & CX (risks, complaints, CSAT) | routes-more.js | `/api/c/:col` for goals, pips, kudos, risks, complaints, surveys | perf.js, comply.js |
| Planning (review planner, workload, calendar) | routes-more.js (settings `planner`) | `/api/settings/x/planner` | planning.js |
| Backups and data | routes-more.js | `/api/backups/*`, `/api/seed/refresh`, `/api/demo/reset` | admin2.js |
| Knowledge base, quizzes, newsletter, AI import, ZIP export | routes-learning.js, ai.js, public/js/md.js | `/api/kb/*`, `/api/quizzes/*`, `/api/ai/*` | learn.js, md.js |
| Skills, workspaces, root causes, categories, Auto QA categories | routes-setup.js | `/api/skills`, `/api/workspaces/*`, `/api/root-causes/*`, `/api/categories/*`, `/api/auto-cats/*` | admin.js, scorecards.js |
| Auto QA | routes-autoqa.js, autoqa.js, ai.js | `/api/autoqa/*` | autoqa.js |
| Audit log | audit.js | `/api/audit` | admin2.js |

The full who-can-do-what table is in SECURITY_AUDIT.md (permission matrix).

## Dependencies (direct)

| Package | Version | Use |
|---|---|---|
| express | 5.3.0 | web server |
| express-session | 1.19.0 | sign-in sessions |
| bcryptjs | 3.0.3 | password hashing |
| exceljs | 4.4.0 | Excel export |
| jszip | 3.10.2 | ZIP export |
| mammoth | 1.13.0 | Word import |
| nodemailer | 10.2.0 | e-mail |

The front end loads Google Fonts. Everything else is served by the app itself.

## Existing tests (before the audit)

These use `node:test`, with no extra test framework. 9 files, 79 tests:
- scoring rules
- pop-up preferences
- HTML escaping
- translations
- Markdown and syntax
- Auto QA
- two API suites that start the real server on a temporary copy of the data

There are no browser (end-to-end) tests, no linter and no build step.

## Current limitations (summary)

- Single-file JSON database, single process, sessions kept in memory. The move to SQLite is planned in CLAUDE.md.
- No separation between customer organisations (no tenants).
- Every new or reset account starts with the password `password`.
- No linter or static-analysis tool is configured.

Details, priorities and next steps are in REMAINING_ISSUES.md.
