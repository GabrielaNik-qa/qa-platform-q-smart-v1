# Q-SMART – Security audit

Audit date: 2026-10-24 · Branch: `q-smart-full-audit` · Base commit `a1da4aa`

> **This is not a professional penetration test.** It is a code review plus targeted tests run against a local copy of the app
> with made-up data. Before any commercial launch, an independent penetration test is strongly recommended, especially because
> the app holds employee performance data and links to customer call recordings.

## Scope and method

- **In scope:**
  - Every server route in `server.js`, `routes-*.js`, `audit.js` and `ai.js`.
  - The shared report engine (`public/js/rpt-engine.js`) and the Markdown renderer (`public/js/md.js`).
  - How the front end shows the data people type.
  - Dependencies and the Git history.
- **Environment:** local only.
  - Automated tests start the server on a random port with a temporary data file of invented people.
  - Browser tests used a throw-away copy of the data on port 3199, with separate recordings, backups and audit-log folders.
  - The real `data.json` was only read (to make that copy). It was never changed.
- **References:** OWASP Top 10 (2021) and OWASP ASVS 4.0 levels 1–2, used as checklists.
- **Tools that were really run:**
  - `node:test` security tests (new file `test/security.test.js`)
  - `npm audit`
  - `node --check` on every JavaScript file
  - a regex secret scan over all 25 Git revisions
  - scripted browser checks in the Claude desktop app's browser pane
- **Tools not available:**
  - OWASP ZAP and other dynamic scanners (not installed)
  - ESLint and other static analysers (not configured)
  - `gh` CLI (so the GitHub repository's visibility could not be checked)

## Permission matrix (as enforced by the server after this audit)

"ws" means only the records of people in the user's own workspaces. Admins always see everything. A dash means refused.

| Resource / action | admin | qa | lead | trainer | agent |
|---|---|---|---|---|---|
| Read reviews | all | ws | ws | ws | own |
| Create / change / delete review, upload / delete recording, remind | ✓ | ws | – | – | – |
| Open a dispute | – | – | – | – | own review |
| Write in a dispute | ✓ | ws | – | – | own |
| Resolve a dispute | ✓ | ws | – | – | – |
| Play a recording | if the review is visible | same | same | same | own |
| Read scorecards | all | ws | ws | ws | ws |
| Change scorecards, categories, Auto QA categories | ✓ | – | – | – | – |
| Root causes | ✓ | ✓ | – | – | – |
| Users, teams, workspaces, skills, registrations, backups, audit log, system settings, reset data | ✓ | – | – | – | – |
| Review planner setting | ✓ | ✓ | – | – | – |
| Quick flags: read | all | ws | ws | ws | own |
| Quick flags: write | ✓ | ws | ws | ws | – |
| Tasks: read | all | ws | ws | ws | own |
| Tasks: create / edit / delete | ✓ | ws | ws | ws | – |
| Tasks: tick checklist, change status, pin | ✓ | ws | ws | ws | own |
| Coaching sessions: read | all | ws | ws | ws | own |
| One-to-ones: write | ✓ | ws | ws | – | – |
| Coaching, group, training: write | ✓ | ws | – | ws | – |
| Sign a session | – | – | – | – | own |
| Calibrations | ✓ | participants | participants | participants | – |
| Simulations: read | all | ws | ws | ws | own |
| Knowledge base, quizzes, newsletter: read | ✓ | ✓ | ✓ | ✓ | ✓ (answers hidden) |
| Knowledge base, quizzes, newsletter: write | ✓ | ✓ | ✓ | ✓ | – |
| Learning progress | all | ws | ws | ws | – |
| Reports (saved): read | all | own + shared | own + shared | own + shared | – |
| Reports: change | ✓ | own | own | own | – |
| Reports: send now | ✓ | own | own | own | – |
| Goals: read | ✓ | ✓ | ✓ | ✓ | own / own team |
| Goals: write | ✓ | ✓ | ✓ | – | – |
| Improvement plans: read | ✓ | ✓ | ✓ | ✓ | own |
| Improvement plans: write | ✓ | ✓ | ✓ | ✓ | acknowledge + note on own |
| Recognition | ✓ | ✓ | ✓ | ✓ | ✓ (change own) |
| Risks, complaints | ✓ | ✓ | ✓ | ✓ | – |
| Surveys (CSAT): read | ✓ | ✓ | ✓ | ✓ | own |
| Surveys (CSAT): write | ✓ | ✓ | ✓ | – | – |
| Export centre | all | own | own | own | – |
| Make an Excel file | ✓ | ✓ | ✓ | ✓ | ✓ (only from data they send) |
| Auto QA: read | all | ws | ws | ws | own |
| Auto QA: write | ✓ | ws | – | – | – |
| AI import, AI quiz | ✓ | ✓ | ✓ | ✓ | – |

Hiding pages in *Admin > Roles & permissions* only changes the menu, and the page itself says so. All the rules above are checked on the server.

## Confirmed vulnerabilities – fixed

Severity is for the current single-organisation use. All fixes have regression tests in `test/security.test.js`. Each test failed before its fix and passes after it.

| ID | Severity | Problem | Evidence (before the fix) | Fix |
|---|---|---|---|---|
| S-1 | **High** | **Workspace isolation gaps.** Staff of workspace A could read, and in places change, the records of workspace B: quick flags (read, create, change, delete), tasks (read, change, delete), coaching sessions (read, change, delete), simulations and learning progress (read), Auto QA conversations (correct, re-link, delete, re-rate), and deleting a review's call recording. The rest of the app (reviews, roster, teams, scorecards) already enforced workspaces. | A QA user of workspace A deleted the recording of a workspace-B review (status 200 instead of 404). A team lead of A saw B's flags, tasks, sessions and simulations. | Added the same workspace rule (`seesUser`) to these routes. The recording delete now uses the same check as the other review actions. |
| S-2 | **High** | **Scheduled reports leaked data across workspaces.** Any staff member could press "send now" on any saved report, including another person's private one. The report e-mail was built from *all* data, ignoring the owner's workspace, and goes to e-mail addresses the owner typed in, which can be outside the company. | A lead of workspace B sent workspace A's private report (200). A report owned by a workspace-A lead counted 2 reviews (A and B) instead of 1. | Only the owner or an admin can send it. The data is limited to the owner's workspace. Reports of deleted or deactivated owners are no longer sent. |
| S-3 | **Medium** | **HTML injection in reports.** The report table HTML did not escape names, campaigns, categories or the title. This affects scheduled e-mails and the "Print / PDF" window, which opens on the app's own address, so it is stored XSS for anyone who prints a report. Agent names come from the public registration form. | `<img onerror>` in a campaign name came out as a live tag. | `toHtml` escapes every value. |
| S-4 | **Medium** | **Spreadsheet (formula) injection in Excel exports.** The export accepted any JSON. Objects such as `{formula: …}` or `{hyperlink: 'javascript:…'}` became live formulas or links in the `.xlsx`. Agents may call this route, and the copy kept for the Export centre is visible to admins. | The generated sheet XML contained `<f>` formula cells. | Every cell is reduced to plain text, a number or yes/no. Text is still stored as text, which Excel never runs. |
| S-5 | **Medium** | **Password guessing.** The only limit was 30 attempts per IP address per 15 minutes. The IP was read from the `X-Forwarded-For` header of *any* client, so someone reaching the server directly (for example on the local network) could fake a new address for each attempt. | 11 wrong passwords in a row for one account all got "wrong password" (401) and never "too many attempts" (429). That the address could be faked is from code review (`trust proxy 1` trusts one forwarding hop from any client). | The header is trusted only when the connection comes from this computer, where the Cloudflare tunnel runs. This can be changed with `TRUST_PROXY`. Each account also allows at most 10 wrong passwords per 15 minutes. |
| S-6 | Low | **Sign-ins never expired** while the browser stayed open, and the server kept them in memory forever. | The cookie had no `Expires`/`Max-Age`. | A sign-in now ends after 12 hours without use (refreshed on every request). |
| S-7 | Low | **Large requests before sign-in.** Anyone could send 25 MB JSON bodies to sign-in or registration. | A 300 KB body was accepted for parsing (401, not 413). | The limit is 100 KB before sign-in and 25 MB after. |
| S-8 | Low | **Notification flooding.** The "show me how notifications look" button had no limit. Notifications are capped at 5,000 for the whole app, so one person could push everybody else's notifications out. | 4 calls in a row all succeeded. | At most 3 per person per hour. |
| S-9 | Low (extra protection) | **CSRF** relied only on `SameSite=Lax` cookies, which already stop the classic attack in current browsers, so this was not exploitable. | A change marked `Sec-Fetch-Site: cross-site` was accepted. | Any change request a browser marks as coming from another website is refused. |
| S-10 | Low | **Unknown record types.** `/api/c/<anything>` touched in-memory objects (including `__proto__`) before refusing. Nothing was saved. | `/api/c/evaluations/…` reached the permission check. | Unknown collection names get "not found" straight away. |
| S-11 | Low | **AI requests** had no time limit and no usage limit, so they could hang or run up the bill. | Code review. AI was not connected during the audit. | 3-minute timeout. At most 30 AI requests per person per hour and 5 AI re-rating runs per person per hour. *Only reviewed in code, not tested with a live key.* |
| S-12 | High (library) | **body-parser 2.3.0** (used by Express) is vulnerable to a denial of service with compressed request bodies. | `npm audit` | Updated to 2.4.0 (lockfile only, same major version). |

## Checked and found sound (with the test or evidence)

- **Agents cannot reach staff or admin data.** In the browser, signed in as an agent, 12 privileged API calls were all refused with 403: users, audit log, backups, data download, create review, system settings, permissions, Export centre, reset data, complaints, calibrations, registrations. The agent received only their own review.
- **No stored XSS found in the screens.**
  - Trap text that records itself if it ever runs as code was placed in about 40 fields: names, comments, titles, notes, dispute messages, knowledge-base articles, quiz text, tasks, flags, reports, calendar items, notifications and integration links.
  - As admin: all 49 pages, plus the view and edit pop-ups on 21 pages, including the trap review's own pop-up. As agent: all 17 of the agent's pages.
  - The trap never ran. The trap text appeared on screen as plain text.
- **Markdown renderer:** escapes everything first and only creates `https://` and `http://` links. A `javascript:` link was shown as text.
- **Passwords:** stored as bcrypt hashes (cost 10) and never logged. The audit log never stores passwords.
- **Session:** a new session id at every sign-in (existing test). The cookie is `HttpOnly` and `SameSite=Lax`, and `Secure` when the app is opened over HTTPS.
- **Password reset:** a 256-bit random token, stored only as a SHA-256 hash, valid for 1 hour, compared in constant time. The answer is the same whether or not the account exists.
- **Path traversal:**
  - Backup file names must match `^[\w.-]+\.json$`.
  - Recordings use only the base name, and the file must belong to a review the person can see.
- **Injection:**
  - There is no SQL database and no shell command built from user input. The only child process is `node seed.js` with fixed arguments.
  - JSON keys starting with `_` or `$` are dropped, which blocks `__proto__` prototype pollution.
  - Pop-up preference ids must match a strict pattern.
- **Error messages** never include file paths or stack traces (existing test).
- **Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: same-origin`, and no `X-Powered-By`.
- **Secrets in Git:** a pattern scan of all 25 revisions found no API keys or private keys. `.env`, `data.json`, `audit.json`, recordings and backups are git-ignored.

## Open findings (not fixed in this audit)

Details, impact and next steps are in REMAINING_ISSUES.md.

| ID | Severity | Summary |
|---|---|---|
| R-1 | **High – launch blocker** | No separation between customer organisations (multi-tenancy). |
| R-2 | **High – launch blocker** | Every new, approved or reset account starts with the password `password`, and it is e-mailed. Usernames are predictable, so an account can be taken over before its owner signs in. |
| R-3 / R-4 | **High – launch blocker** | The JSON file database and the in-memory sessions are not safe for several server processes or for production load. |
| R-5 | **Medium** | `seed.js` is tracked in Git and contains the full data, including the password hashes of 2 accounts that use a real password (not the test password). The repository's visibility could not be checked. |
| R-6 | Medium | Workspace rules are still not applied to goals, improvement plans, recognition, risks, complaints, surveys, calibrations, knowledge base and task templates (organisation-wide). No effect today because there is one workspace. |
| R-7 | Medium | No Content-Security-Policy: the front end uses inline `onclick` handlers, so a strict policy needs a refactor. No HSTS header (can be set in Cloudflare). |
| R-8 | Medium | Weak password rules (6 characters minimum), no two-factor sign-in. |
| R-17 | Low | The new per-account limit lets someone who knows a username lock that account for 15 minutes. |

## Tests that were not performed, and why

- **Real e-mail delivery (SMTP) and real AI calls:** no credentials were used. The code paths were reviewed, and the no-SMTP / no-AI fallbacks were exercised.
- **OWASP ZAP or another dynamic scanner:** not installed. Recommended against a staging copy.
- **Proof that a faked `X-Forwarded-For` is now ignored:** the automated tests connect from this computer, which is the trusted tunnel address, so they cannot show it. Covered by code review.
- **Load, stress and multi-process tests:** not run. The architecture limits are already known (R-3).
- **Cloudflare tunnel settings, TLS, hosting:** outside the repository.
- **Malicious Word/PDF files** (zip bombs, hostile PDFs sent to the AI): not tested. Imports are limited to staff and 25 MB.

## Residual risk and recommendation

The confirmed problems found here are fixed and covered by tests. Still, the app is **not ready** to be sold to independent companies until R-1 to R-4 are resolved. After that, an independent penetration test should be done before going live.
