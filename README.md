# Q-smart – QA platform (demo project, test data only)

A small QA scorecard platform for call centers: call reviews and scorecards, disputes, tasks and missions, coaching and
calibration, a knowledge base with quizzes, teams and users. Plain Node.js + Express on the server, plain JavaScript in the browser,
one JSON file (`data.json`) as the database.

## Run it
```
npm install express express-session bcryptjs nodemailer exceljs jszip mammoth
node seed.js          # puts back all the saved data (users, reviews, knowledge base, tasks ...)
node server.js        # http://localhost:3000   (set $env:PORT="3100" to use another port)
```
Windows PowerShell: use `npm.cmd` instead of `npm` if scripts are blocked.

## Test users (password for all: `password`)
Agents, team leads and trainers are created automatically. The email is `first-initial.lastname@test.com`,
e.g. `d.petrov@test.com` (agent), `l.hart@test.com` (team lead), `i.marinova@test.com` (trainer).
Make your own admin: `node adduser.js yourname "Your#Pass1" admin --email=you@example.com Your Name`

## Optional settings (type them in the terminal before `node server.js`, never save keys in files)
| Setting | What for |
|---|---|
| `$env:SECRET="long random text"` | signs the login cookies |
| `$env:SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `PUBLIC_URL` | emails (registration, password reset, reminders) |
| `$env:ANTHROPIC_API_KEY="sk-ant-..."` | AI: analyse imported documents into articles, write quiz questions |

## Folders
`server.js` (accounts, teams, reviews) · `routes-work.js` (tasks, coaching, calibration) · `routes-learning.js` (knowledge base, quizzes) ·
`bootstrap.js` (starting teams, test users, skills, workspaces) · `routes-setup.js` (skills, workspaces, root causes, Auto QA categories) · `routes-autoqa.js` / `autoqa.js` (Auto QA) · `scorecard.js` (scoring rules) · `ai.js` · `public/` (the web app).


## Team rules
- Everyone belongs to a team and every team has a leader. Admins, QA, team leads and trainers are always in the **Administration** team; agents are in **B2B** or **B2C** (you can add or remove teams in Admin > Teams).
- `node adduser.js` follows this: staff go to Administration automatically, an agent needs `--team=t-b2b` or `--team=t-b2c`.
- After copying new files: restart the server, run `node seed.js` if you want the saved data back, and press Ctrl+F5 in the browser.

## Before you upload to GitHub
The file `.gitignore` is already included. It tells Git to skip `data.json`, `audit.json`, `recordings/`, `node_modules/` and `.env`, so none of your data or settings leave your laptop. Anyone who downloads the project runs `npm install` and `node seed.js` to get the saved data.

## Reset demo data
Admin > the gear (System Settings) > "Reset demo data" brings the made-up data back to its starting state. Your own users, teams, scorecards and reviews stay.
