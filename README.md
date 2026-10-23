# Q-smart – QA platform (demo project, test data only)

A small QA scorecard platform for call centers: call reviews and scorecards, disputes, tasks and missions, coaching and
calibration, a knowledge base with quizzes, teams and users. Plain Node.js + Express on the server, plain JavaScript in the browser,
one JSON file (`data.json`) as the database.

## Run it
```
npm install express express-session bcryptjs nodemailer exceljs jszip mammoth
node seed.js          # demo reviews, knowledge base, tasks ... and the test users
node server.js        # http://localhost:3000   (set $env:PORT="3100" to use another port)
```
Windows PowerShell: use `npm.cmd` instead of `npm` if scripts are blocked.

## Check that everything still works
```
npm.cmd test
```
This runs the automatic tests in the `test` folder: the scoring rules, the pop-up preferences, who may see and change which
reviews, disputes, and the safe saving of the data file. The tests start their own copy of the server with made-up users in a
temporary folder: your `data.json` is never touched.

## Test users (password for all: `password`)
Agents, team leads and trainers are created automatically. The email is `first-initial.lastname@test.com`,
e.g. `d.petrov@test.com` (agent), `l.hart@test.com` (team lead), `i.marinova@test.com` (trainer).
Make your own admin: `node adduser.js yourname "Your#Pass1" admin --email=you@example.com Your Name`

## Optional settings (type them in the terminal before `node server.js`, never save keys in files)
| Setting | What for |
|---|---|
| `$env:SECRET="long random text"` | signs the login cookies (without it a random one is made at every start; sign-ins end when the server restarts anyway) |
| `$env:SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `PUBLIC_URL` | emails (registration, password reset, reminders) |
| `$env:ANTHROPIC_API_KEY="sk-ant-..."` | AI: analyse imported documents into articles, write quiz questions |
| `$env:DATA_FILE`, `AUDIT_FILE`, `REC_DIR` | use another copy of the data, audit log or recordings folder (for testing; normally leave them out) |

## Design
All colours, fonts, spacing, corners and shadows are set once at the top of `public/css/app.css` (the "tokens"): charcoal
`#171717` for structure, orange `#FF6B00` for the main actions, yellow `#FFD447` for highlights, coral `#FF6F91` for small details,
off-white `#F7F7F5` pages and white cards. Change a token there and every page follows. Light and dark mode both work, and
My account > Appearance still offers the other colour themes (Sport is the default). Icons are drawn as lines in `core.js` (no emoji).

## Pop-up preferences (My account > Notifications & Confirmations)
- **Welcome message and tips** ("How it works" boxes, the scoring tip on QA Entry): each has "Don't show me this again",
  and one switch turns all of them off.
- **Routine confirmations**: only moving an agent to another team and deleting one of your own notifications. They have
  "Don't ask me again"; when switched off they happen straight away and an **Undo** button stays for a few seconds.
- **Always shown, cannot be switched off**: error messages, problems with the connection or permissions, every question before
  deleting a record, unsaved-changes warnings, password / account / access changes, resolving a dispute, changing a review's score.
- "Reset dismissed messages" and "Restore default settings" bring everything back. Preferences are saved with each person's
  account (`prefs` in `data.json`), so they are the same on every browser and never affect another person.
  The list of messages that may be hidden is in `public/js/prefs.js`.

## Folders
`server.js` (accounts, teams, reviews) · `routes-work.js` (tasks, coaching, calibration) · `routes-learning.js` (knowledge base, quizzes) ·
`bootstrap.js` (starting teams, test users, skills, workspaces) · `routes-setup.js` (skills, workspaces, root causes, Auto QA categories) · `routes-autoqa.js` / `autoqa.js` (Auto QA) · `scorecard.js` (scoring rules) · `ai.js` · `public/` (the web app:
`css/app.css` the design, `js/prefs.js` the pop-up preferences, `js/modals.js` all pop-ups) · `test/` (automatic tests).


## Team rules
- Everyone belongs to a team and every team has a leader. Admins, QA, team leads and trainers are always in the **Administration** team; agents are in **B2B** or **B2C** (you can add or remove teams in Admin > Teams).
- `node adduser.js` follows this: staff go to Administration automatically, an agent needs `--team=t-b2b` or `--team=t-b2c`.
- After copying new files: restart the server, run `node seed.js` once for demo data, and press Ctrl+F5 in the browser.

## Before you upload to GitHub
The file `.gitignore` is already included. It tells Git to skip `data.json`, `audit.json`, `recordings/`, `node_modules/` and `.env`, so none of your data or settings leave your laptop. Anyone who downloads the project runs `npm install` and `node seed.js` to get a fresh copy with demo data.

## Reset demo data
Admin > the gear (System Settings) > "Reset demo data" brings the made-up data back to its starting state. Your own users, teams, scorecards and reviews stay.
