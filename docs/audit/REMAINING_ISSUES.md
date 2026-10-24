# Q-SMART – Remaining issues

Audit date: 2026-10-24 · Ordered by severity. "Block launch" means a launch as a commercial product for several customer companies.
None of these block today's use as a personal portfolio project with test data.

| ID | Severity | Block launch? |
|---|---|---|
| R-1 | High | Yes |
| R-2 | High | Yes |
| R-3 | High | Yes |
| R-4 | High | Yes |
| R-5 | Medium | Yes (until resolved) |
| R-6 | Medium | Yes, if workspaces are sold as separation |
| R-7 | Medium | No (recommended) |
| R-8 | Medium | Yes for admins (MFA) |
| R-9 | Medium | No |
| R-10 | Low | No |
| R-11 | Low | No |
| R-12 | Low | No |
| R-13 | Low | No |
| R-14 | Low | No |
| R-15 | Low | No |
| R-16 | Low | No |
| R-17 | Low | No |
| R-18 | Info | No |
| R-19 | Info | No |
| R-20 | Info | No |

---

### R-1 · No separation between customer companies (multi-tenancy)
- **Evidence:** no company or tenant field exists in `data.json`, the routes or the session. Workspaces always show everything to admins, and catalogs and settings are global.
- **Impact:** two customers on one server would see each other's people, reviews and recordings.
- **Next step:** add tenants during the SQLite move (SAAS_READINESS.md §1), with cross-tenant tests. Until then, run one server and one data folder per customer.

### R-2 · Every new account starts with the password "password"
- **Evidence:** `DEFAULT_PASSWORD = 'password'` in `server.js` is used by "create user", "approve registration" and "reset password", and the e-mail includes it. Usernames are predictable (first initial + last name).
- **Impact:** anyone who guesses the username can sign in before the real person and choose the new password (account takeover).
- **Next step:** e-mail a one-time invitation / reset link (the reset-link code already exists) instead of a password. For admin-created accounts without e-mail, show a random one-time password once.

### R-3 · JSON file database
- **Evidence:** `load()` reads and parses the whole 880 KB file on every request, and `save()` rewrites it.
- **Impact:**
  - Slow at 500 agents.
  - With two server processes, changes overwrite each other.
  - A crash can lose the last change (`save` falls back to a direct write when OneDrive locks the file).
- **Next step:** the planned SQLite migration with transactions, keeping all current data (CLAUDE.md).

### R-4 · Sign-ins kept in server memory
- **Evidence:** `express-session` default MemoryStore.
- **Impact:** everyone is signed out at every restart. Only one process is possible. The store is not meant for production.
- **Next step:** a SQLite or Redis session store together with R-3.

### R-5 · Real data and password hashes in `seed.js` (tracked in Git)
- **Evidence:**
  - `seed.js` holds the full data (17 users, emails, reviews), and *Admin > Backups > Update seed* writes the live data into it.
  - 2 user records have password hashes that do **not** match the test password, so they protect real passwords.
  - The file is pushed to GitHub (`origin`), and the repository's visibility could not be checked.
- **Impact:** if the repository is public, those hashes can be attacked offline (bcrypt makes this slow but not impossible). Names and e-mails are published too.
- **Next step:**
  - Check that the GitHub repository is private.
  - Change the passwords of those two accounts if it ever was public.
  - Keep only made-up demo data with the test password in `seed.js`.
  - Removing the file from Git *history* also needs a history rewrite; ask before doing that.

### R-6 · Workspace rules not applied everywhere
- **Evidence:** organisation-wide for:
  - every staff role: goals, improvement plans, recognition, risks, complaints, surveys, shared reports, calibrations, task templates, knowledge base, quizzes and newsletters
  - all QA and admins: dispute notifications
  - task creation: a task can be assigned to any active user
- **Impact:** none today (one workspace). With several workspaces, staff see the other workspaces' records in these modules.
- **Next step:** apply `seesUser` to `routes-more.js` collections and calibrations, and decide which learning content is shared on purpose.

### R-7 · No Content-Security-Policy or HSTS
- **Evidence:** `public/index.html` and every page use inline `onclick="…"` handlers. No `Content-Security-Policy` or `Strict-Transport-Security` header is sent.
- **Impact:** if an escaping mistake ever slips in, nothing stops the injected script.
- **Next step:** move the handlers to `addEventListener` (a large refactor), then add a strict CSP. Turn on HSTS in Cloudflare.

### R-8 · Weak password rules, no two-factor sign-in
- **Evidence:** `pwBad` in `server.js` requires 6 characters with mixed case, a digit and a symbol.
- **Impact:** short passwords are guessable. Admin accounts have a single factor.
- **Next step:** at least 8 (better 12) characters, a breached-password check, and MFA (at least for admins). The messages need translations (bg, fr).

### R-9 · No retention, deletion or personal-data export
- **Evidence:**
  - Nothing is deleted automatically.
  - Deleting a user keeps their reviews.
  - The audit log stores IP addresses.
  - Recordings and backups are unencrypted plain files.
- **Impact:** GDPR obligations (storage limitation, right of access and erasure) cannot be met yet.
- **Next step:** see SAAS_READINESS.md §3.

### R-10 · Scoring rules that need a business decision
- **Evidence:** `test/scorecard-rules.test.js` "CURRENT BEHAVIOUR" tests: a missing answer counts as Yes, and an all-N/A review scores 0% (counted as a fail). QA Entry starts every item as Yes.
- **Impact:** a forgotten item gives full points, and an all-N/A review lowers the pass rate.
- **Next step:** decide the rules. The tests then need updating.

### R-11 · Quiz answers are shown after every attempt, and retakes are unlimited
- **Evidence:** `/api/quizzes/:id/attempt` and `/api/kb/articles/:id/test` return the correct answers each time.
- **Impact:** an agent can pass by retrying.
- **Next step:** decide whether to show answers only after passing, or to limit attempts.

### R-12 · Admin settings readable by every role
- **Evidence:** `GET /api/settings` returns e-mail templates and notification rules to agents too. No secrets are stored there.
- **Next step:** send `mailtpl` and `notifOff` only to admins.

### R-13 · Integration links are not checked
- **Evidence:** *Admin > Integrations* saves any text. The links are shown to everyone.
- **Impact:** an admin (trusted) could save a `javascript:` link.
- **Next step:** accept only `https://` links on the server.

### R-14 · Word / PDF import limits
- **Evidence:** `.docx` files are unpacked by `mammoth` with no size limit apart from the 25 MB request. PDFs go to the AI as they are.
- **Impact:** a "zip bomb" Word file from a staff member could use a lot of memory, and documents can contain prompt injection. AI output is only a draft that a person reviews before saving.
- **Next step:** limit the unpacked size and handle import in a worker.

### R-15 · Recording upload content is not checked
- **Evidence:** only the type or extension is checked, up to 100 MB. Files are served with an audio type and `nosniff`, so they cannot run as a web page.
- **Next step:** check the file's first bytes, and add a malware scan for a hosted product.

### R-16 · Open registration
- **Evidence:** anyone who can reach the site can request an account (6 per address per hour). An admin must approve each request.
- **Next step:** invitation-only per customer company after tenants exist.

### R-17 · Account lock-out by a stranger
- **Evidence:** the new per-account limit (10 wrong passwords per 15 minutes) also blocks the real owner during that time.
- **Next step:** accept the trade-off, or add a CAPTCHA / e-mail unlock after the limit.

### R-18 · No automated browser tests or linter
- **Evidence:** only API and unit tests exist. The browser checks in this audit were manual scripts.
- **Next step:** Playwright tests for sign-in, QA Entry, disputes, reports and admin users. ESLint in `npm test`.

### R-19 · Moderate `uuid` advisory through `exceljs`
- **Evidence:** `npm audit`. It cannot be triggered here (see TEST_RESULTS.md).
- **Next step:** update `exceljs` when a version without the advisory exists.

### R-20 · Not tested in this audit
- Live SMTP e-mail, live AI, the Cloudflare tunnel and TLS settings, a dynamic scanner (ZAP), load tests, real mobile devices, screen readers.
- **Next step:** an independent penetration test and a staging environment with real e-mail and AI before launch.
