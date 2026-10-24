# Q-SMART – Functional audit

Audit date: 2026-10-24 · Branch: `q-smart-full-audit`

## How the features were tested

1. **Automated API tests:**
   - 79 existing tests.
   - 14 new security and robustness tests.
   - All of them start the real server on a temporary copy of made-up data.
2. **Browser walk-through:**
   - Data: a throw-away copy of the real data plus 3 audit accounts (admin, lead, agent).
   - As admin: every page opened.
   - As agent: every page in the agent's menu opened.
   - View and edit pop-ups opened on 21 pages.
   - Checked for JavaScript errors, broken text (`undefined`, `NaN`, `[object Object]`, "went wrong") and pages wider than the screen.
3. **Independent recalculation:** the headline numbers were calculated three separate ways from the raw data and compared.

"Opened" means the page or pop-up loaded and showed the data without errors. It does **not** mean every button on it was clicked through.
The table says which features also had their create, change and delete workflow tested.

## Results per feature

| Feature | What was checked | Result |
|---|---|---|
| Sign-in, sign-out, wrong password, deactivated user, role change, password reset by admin | Existing API tests, plus the new per-account limit and session expiry tests | Pass |
| Registration with first and last name, automatic username | Code review, existing tests | Pass |
| Pop-up preferences, language | Existing API tests | Pass |
| QA Entry and scoring | Existing unit tests: all Yes = 100%; No removes only its points; N/A is left out; critical item makes its category 0; critical category makes the review 0%; rounding to 1 decimal. Browser: page opens | Pass |
| Reviews list, review pop-up, edit, workspace rules | API tests: create, change, delete, cross-workspace refusal. Browser: list and pop-up, including a review with trap text | Pass |
| Disputes (open, message, resolve) | API tests, including other agents and other workspaces being refused. Browser: Disputes page | Pass |
| Call recordings | API tests: upload, delete, and the new cross-workspace refusal | Pass (after fix S-1) |
| Quick flags | API tests: links kept, workspace rules (new). Browser: page and edit pop-up | Pass (after fix S-1) |
| Scorecards, categories, root causes, Auto QA categories | Browser: pages open. Scorecard rules unit tests | Pass |
| Dashboard, Agents, Team review, Category stats | Browser: pages open. Numbers recalculated independently, see below | Pass |
| Report builder, Saved & scheduled, Export centre | API: Excel export (existing), owner-only sending and workspace limit (new). Browser: pages open | Pass (after fixes S-2, S-3, S-4) |
| Tasks, missions, templates | API: checklist with a broken item (existing), workspace rules (new). Browser: board and edit pop-up | Pass |
| Coaching, one-to-one, calibration | API: workspace rules (new). Browser: pages and session pop-ups | Pass |
| Goals, improvement plans, recognition | Browser: pages and form pop-ups. API: improvement plan goals check (new) | **Defect found and fixed (F-2)** |
| Review planner, QA workload, calendar | Browser: pages open | Pass (opened only) |
| Compliance, risk register, complaints, CSAT | API: survey score and date checks (existing). Browser: pages and form pop-ups | Pass |
| Knowledge base, My learning, quizzes, newsletter | Browser: pages and article pop-up (with trap text). Existing tests: Word and HTML import | Pass |
| Auto QA | API: workspace rules (new). Browser: page, list and gaps views | Pass (after fix S-1) |
| Transcripts | Browser: page opens | Pass. The transcript text is built into the page as an example; it is not real data |
| Call simulator | Browser: two replies typed as an agent, then "Finish & save score" | **Defect found and fixed (F-1)** |
| Users, teams, workspaces, skills, permissions, integrations, notification rules, backups, e-mail templates, audit log | Browser as admin: all pages. API: backup download and restore (existing). As agent: every admin API refused (403) | Pass |
| Screen sizes | 375 px wide: the intended "screen too narrow" message shows. 768 px (tablet): 29 pages checked, none wider than the screen. Desktop: all pages | Pass |

## Numbers recalculated independently

From the throw-away copy (153 reviews), "all time", all teams:

| Source | Reviews | Average | Pass rate |
|---|---|---|---|
| Calculated directly from `/api/evaluations` with the pass marks from `/api/settings` | 153 | 92.5% | 87.6% |
| The dashboard's own functions (`avg`, `isPass`) | 153 | 92.5% | 87.6% |
| The report engine (Report builder and scheduled e-mails) | 153 | 92.5% | 87.6% |

All three agree.

Pass/fail rule:
- A review **passes when its score is equal to or above** the pass mark.
- The pass mark is the team's own value if it has one, otherwise the global value (85% by default).
- The dashboard and the report engine use the same rule.

Stored scores were also checked against their answers: for all 153 reviews, the stored score matches the score recalculated from the category points.

## Defects found and fixed

| ID | Priority | Defect | Cause | Fix | How it was checked |
|---|---|---|---|---|---|
| F-1 | P2 | **Call Simulator always saved 0%.** | The scoring counted coach messages starting with "✔", but the coach writes "Coach: good, …". The tips had the same problem (and a typo, `^ℹs*`). | `public/js/pages.js` now compares with the exact coach messages, which stay in English and are translated only on screen. | Browser, as an agent: one good and one weak reply saved **50%** with one tip. Before the fix it was always 0%. |
| F-2 | P3 | **One malformed improvement plan crashed the Improvement plans page for everybody** ("g.filter is not a function"). | The server accepted any value for `goals`. The page expects a list of `{t, done}` items. | `routes-more.js` refuses plans whose goals are not a list of items. The page itself never sends anything else. | New API test. The page opened without errors in the browser. |

Security fixes S-1 to S-12 are listed in SECURITY_AUDIT.md.

## Regression tests added

`test/security.test.js` has 14 tests: one setup step and 13 checks. Each check failed before its fix and passes after it. The security tests cover:

- workspace isolation for recordings, Auto QA, flags, tasks, sessions, simulations and learning progress
- report sending and report data
- Excel injection
- CSRF
- session expiry
- per-account password-guessing limit
- the size limit before sign-in
- notification flooding
- unknown record types
- report HTML escaping

The robustness test covers improvement plan goals.

The Call Simulator fix (F-1) runs in the browser and is not covered by an automated test. It was checked by hand in the browser (see above).

## Business rules that need a decision (not changed)

Both rules are already recorded as "CURRENT BEHAVIOUR" in `test/scorecard-rules.test.js`.

1. **A missing or unknown answer counts as "Yes".** A review sent with empty answers scores 100%.
   - QA Entry starts every item as "Yes" (`public/js/entry.js`) and always sends an answer for every item.
   - So the server rule only matters for direct API use or future imports.
   - Starting every item as "Yes" also means an item the reviewer forgets to change gives full points. Decide whether that is wanted.
2. **A review where every item is N/A scores 0%,** so it counts as a fail in the pass rate.

Two more rules worth deciding:

3. **Quiz and lesson-test results show the correct answers after every attempt, and retakes are unlimited,** so an agent can pass by retrying.
4. **Deleting a user keeps their reviews.** They show the stored name, and reports group them under the old team.

## Outstanding functional limitations

- No automated browser (end-to-end) tests exist. The browser checks in this audit were scripted by hand and are not in the repository.
- No live e-mail delivery or AI features were tested (no keys were used).
- Accessibility was not audited in depth: no screen reader test and no full keyboard-only walk-through.
- Dark mode and the alternative colour themes were not visually reviewed page by page.
