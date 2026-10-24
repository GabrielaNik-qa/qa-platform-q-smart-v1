# Q-SMART – Remaining issues

Audit dates: 2026-10-24 (round 1 and round 2) · Ordered by severity. "Block launch" means a launch as a commercial product for several customer companies.
None of these block today's use as a personal portfolio project with test data. (R-12 from round 1 was fixed in round 2, see S-26.)

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
| R-9 | Medium | Yes (legal) |
| R-21 | Medium | No |
| R-10 | Low | No |
| R-11 | Low | No |
| R-13 | Low | No |
| R-14 | Low | No |
| R-15 | Low | No |
| R-16 | Low | No |
| R-17 | Low | No |
| R-18 | Low | No |
| R-22 | Low | No |
| R-23 | Low | No (decide before launch) |
| R-24 | Low | No (decide before launch) |
| R-25 | Low | No |
| R-19 | Info | No |
| R-20 | Info | No |

---

### R-1 · No separation between customer companies (multi-tenancy)
- **Evidence:** no company or tenant field exists in the data, the routes or the session. Admins see everything, and catalogs and settings are global.
- **Impact:** two customers on one server would see each other's people, reviews and recordings.
- **Next step:** add tenants during the SQLite move (SAAS_READINESS.md §1), with cross-tenant tests. Until then, run one server and one data folder per customer.

### R-2 · Every new account starts with the password "password"
- **Evidence:** `DEFAULT_PASSWORD = 'password'` is used for create user, approve registration and admin reset, and the e-mail contains it. Usernames are predictable.
- **Also:** the registration e-mail address is never verified. Someone can register with another person's e-mail address and then know the username and the starting password.
- **Impact:** account takeover before the real person signs in.
- **Next step:** a one-time invitation / reset link (that code already exists) instead of a password, and e-mail verification at registration.

### R-3 · JSON file database
- **Evidence:**
  - Every request reads the whole `data.json` file and every change rewrites it.
  - **Measured:** at one year of data for 500 agents (73 MB), *every* request takes about 0.4 s, and saving any change about 1.7 s, during which nobody else is served.
  - `adduser.js` writes the same file directly, so running it while the server runs can overwrite changes.
- **Impact:** slow and unreliable at the target size. Several processes are impossible.
- **Next step:** the planned SQLite migration with transactions, keeping all current data. Page the reviews list on the server (the admin list alone was 36 MB).

### R-4 · Sign-ins kept in server memory
- **Evidence:** `express-session`'s default MemoryStore.
- **Impact:** everyone is signed out at every restart, only one process is possible, and memory grows with abandoned sessions.
- **Next step:** a SQLite or Redis session store together with R-3.

### R-5 · Real data and password hashes in `seed.js` (tracked in Git)
- **Evidence:**
  - Only the latest version of `seed.js` (commit `70a2ec9`) holds the full data. Older versions had no hashes.
  - 2 user records protect real passwords, not the test password.
  - One approved registration has a real-looking personal e-mail address.
  - *Admin > Backups > Update seed* writes the live data into this file.
  - The repository's visibility could not be checked.
- **Next step:**
  - Check that the GitHub repository is private.
  - If it ever was public, change those two passwords.
  - Keep only made-up demo data in `seed.js`.
  - Removing the file from Git *history* needs a history rewrite; ask before doing that.

### R-6 · Workspace rules not applied everywhere
- **Evidence:** organisation-wide for staff: goals, improvement plans, recognition, risks, complaints, surveys, shared reports, calibrations, task templates, knowledge base, quizzes and newsletters. Dispute notifications go to all QA and admins. (Tasks, sessions, flags, simulations, Auto QA, learning progress and reports were fixed in this audit.)
- **Impact:** none today (one workspace).
- **Next step:** apply `seesUser` to the `routes-more.js` collections and calibrations, and decide which learning content is shared on purpose.

### R-7 · No Content-Security-Policy or HSTS
- **Evidence:** inline `onclick="…"` handlers on every page.
- **Impact:** if an escaping mistake ever slips in (S-13 was one), nothing stops the injected script.
- **Next step:** move the handlers to `addEventListener` (a large refactor), then add a strict CSP. Turn on HSTS in Cloudflare.

### R-8 · Weak password rules, no two-factor sign-in
- **Evidence:** at least 6 characters with mixed case, a digit and a symbol.
- **Next step:** at least 8 (better 12) characters, a breached-password check, and MFA for admins. The messages need Bulgarian and French translations.

### R-9 · No retention, deletion or personal-data export
- **Evidence:**
  - Nothing is deleted automatically, and deleting a user keeps their reviews.
  - The audit log stores IP addresses.
  - Recordings and backups are unencrypted files.
  - Without SMTP, e-mails are printed to the server console, including reset links and the starting password.
- **Next step:** SAAS_READINESS.md §3. Print e-mails to the console only outside production.

### R-21 · Importing the same CSAT file twice doubles the answers
- **Evidence:** the survey import (`/api/c/surveys` with a list) adds every line with no duplicate check.
- **Impact:** "Number of answers" doubles. The averages stay the same only when the files are identical.
- **Next step (decision):** two real answers can look identical, so automatic removal is not safe. Options: treat "same lead ID + same date + same agent" as one answer, or warn when the same file was already imported.

### R-10 · Scoring rules that need a business decision
- Missing answers count as "Yes", and QA Entry starts every item as "Yes".
- An all-N/A review scores 0% (a fail).
- Team statistics follow the agent's current team.
- See FUNCTIONAL_AUDIT.md.

### R-11 · Quiz answers are shown after every attempt, and retakes are unlimited
- **Next step:** show answers only after passing, or limit attempts.

### R-13 · Integration links are not checked
- **Evidence:** *Admin > Integrations* saves any text, and the links are shown to everyone.
- **Next step:** accept only `https://` links on the server.

### R-14 · Word / PDF import limits
- **Evidence:** `.docx` files are unpacked by `mammoth` without a size limit (25 MB request). PDFs go to the AI as they are.
- **Next step:** limit the unpacked size and process imports in a worker. AI output is always a draft a person reviews before saving.

### R-15 · Recording upload content is not checked
- **Evidence:** the type or extension is checked, up to 100 MB. Files are served as audio with `nosniff`.
- **Next step:** check the file's first bytes, and add a malware scan for a hosted product.

### R-16 · Open registration
- **Next step:** invitation-only per customer company after tenants exist.

### R-17 · Account lock-out by a stranger
- **Evidence:** 10 wrong passwords lock an account for 15 minutes, for its owner too.
- **Next step:** accept the trade-off, or add a CAPTCHA / e-mail unlock.

### R-18 · No automated browser tests or linter
- **Evidence:** the browser checks of both rounds were scripted by hand and are not in the repository. One mistake made during this audit (a broken `comply.js`) was caught only by the browser check.
- **Next step:** Playwright tests for sign-in, QA Entry, disputes, reports, views and admin users. ESLint in `npm test`.

### R-22 · The Excel library looks unmaintained
- **Evidence:** `exceljs` 4.4.0 is the latest version. It brings 6 deprecated packages (`fstream`, `glob@7`, `inflight`, `lodash.isequal`, `rimraf@2`, `uuid@8`), plus the moderate `uuid` advisory (cannot be triggered here).
- **Next step:** watch for updates, or plan a switch to a maintained library.

### R-23 · Scheduled reports can be sent to any address
- **Evidence:** the report owner types the recipients freely, including addresses outside the company. The data is now limited to the owner's workspace (S-2).
- **Next step (decision):** allow only company domains or user accounts as recipients.

### R-24 · Google Fonts
- **Evidence:** `index.html` loads fonts from `fonts.googleapis.com`, which sends every visitor's IP address to Google.
- **Next step:** serve the fonts from the app itself.

### R-25 · A password typed into the username field ends up in the audit log
- **Evidence:** failed sign-ins store the typed username, so someone who types their password into that field leaves it in the log, which admins can read.
- **Next step:** store failed sign-ins only for existing usernames or e-mails.

### R-19 · Moderate `uuid` advisory through `exceljs`
- Cannot be triggered here (TEST_RESULTS.md).

### R-20 · Not tested in this audit
- Live SMTP e-mail, live AI, the Cloudflare tunnel and TLS settings, a dynamic scanner (ZAP), load tests, real mobile devices, screen readers and colour contrast.
- **Next step:** an independent penetration test and a staging environment with real e-mail and AI before launch.
