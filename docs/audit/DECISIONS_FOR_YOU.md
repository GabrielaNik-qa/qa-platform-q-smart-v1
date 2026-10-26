# Decisions for you, and answers to your 18 points

Written on 26 October 2026 while you were asleep. Everything below is on the branch `q-smart-full-audit`.
Nothing was merged into `main` and nothing was pushed.

---

## A. Things that need your OK (I did not do them)

### A1. The side menu: separate panels with a "Back" button (your points 2 and 10) — ✅ BUILT after your yes

Built on 26 October as proposed. "Admin ›" reads **"Set-up ›"** for QA, team leads and trainers, because they only have the scorecard pages in it. The sections inside both panels fold and unfold like the main menu, and in the icons-only menu resting the mouse on an icon opens its list. The proposal was:

**How it would work** (like Modjo's settings, or Facebook's menus):

```
MAIN MENU                          ADMIN PANEL (after clicking "Admin ›")
─────────────                      ──────────────────────────────────────
Home                               ← Back to the main menu
Quality                            PEOPLE
Analytics                            Users · Teams · Workspaces · Skills
Coaching                           QUALITY SET-UP
Performance                          Scorecards · Categories · Root causes · Auto QA
Planning                           SYSTEM
Compliance & CX                      Roles & permissions · Integrations · Notification rules
Reports                              Email templates · Backups & data · Audit log · System settings
───────────
🎓 Learning ›                      LEARNING PANEL (after clicking "Learning ›")
⚙ Admin ›                         ← Back · My Learning · Knowledge Base · Quizzes · Newsletter
                                   PRACTICE: Transcripts · Call Simulator
```

- The main menu keeps only the everyday work, so it gets much shorter.
- "Learning ›" and "Admin ›" sit at the bottom. They only show for the people who can use them.
- If you open an admin page from a link, the Admin panel opens by itself. "← Back" returns you to the last page you were on.
- Agents would see an even shorter main menu: their dashboard, their reviews, their coaching and Learning.
- Optional, like Ringover: in the narrow icons-only sidebar, the small pop-out menu opens when you rest the mouse on an icon, with no click needed.

**Your choice:**
- **Yes:** build it like this.
- **Only Admin:** build only the Admin panel.
- **No:** keep the current sidebar.

### A2. Merge the work into `main`

All the work is on the branch `q-smart-full-audit`. You said "Not yet" twice, so I left it. When you are happy, say **"merge"**.

### A3. Restart your own server

Your server on port 3100 still runs the old code. The new features need a restart:
- widget sizes
- saved columns
- scorecard tags
- the category-name fix

In the terminal where it runs, press Ctrl+C, then run `npm.cmd start`.

### A4. Use the same Filters and Columns on the other tables

The Reviews table now has the Zendesk-style **Filters** side panel and **Columns** chooser. It is built so the same parts can go on these tables too:
- Users
- Disputes
- Quick Flags
- Teams
- Tasks list

Say yes and I will add them.

### A5. Kainami: upload a recording and try simulator scenarios "from your name"

I did not do this, for two reasons:
- It needs a real recording file from you.
- Every simulator exercise there is paid from the other admin's API credit.

If you want it, give me the file, say which scenarios, and confirm it is OK to spend his credit.

### A6. SaaS: one database per company, or one shared database

Please choose before the SQLite step. My recommendation is in **C1** below.

### A7. AI features: model, voices and the API key

These come after SQLite, as your CLAUDE.md says. My recommendation is in **C4**. You give the key when you are ready. It will be kept on the server, never in the page.

---

## B. What was done, point by point

| # | Your point | Status |
|---|---|---|
| 3 | Clicking a group's name, not only its icon, opens its first page | Done (earlier) |
| 4 | The guide no longer disappears. Wide tables get a second scrollbar on top, and it shows **only when the bottom one is off the screen** | Done |
| 5 | **Reviews: a "Filters" button** opens a side panel with every filter. Filters in use show as chips with ✕. **"Columns"**: tick the columns you want and drag them into your order; it is saved in your account. 100 rows per page | Done (other tables wait for A4) |
| 6 | **Dashboard**: "Date is …" chip plus "+ Filter". Other filters appear only when used, each with ✕. **Widgets of any width and height**: drag the right edge, the bottom edge or the corner; double-click for automatic height. The 1/5 and 1/4 sizes are gone | Done |
| 7 | **Dashboard / Views tabs**: your own views live in their own tab, so the main dashboard never gets messed up | Done |
| 8 | **Tasks**: Compact cards like Jira (⌄ opens one card), Detailed, or List view. Your choice is remembered | Done |
| 9 | Drop-downs restyled | Done (earlier) |
| 11 | Disputes: a long message stays on one line with "…"; the eye shows all of it | Done (earlier) |
| 12 | **Scorecards module**: tabs with counts (Scorecards, Categories, Root causes, Auto QA). Categories as cards or table, with search, how many scorecards use each one, and its average in the reviews. Root causes get a chart | Done |
| 12 | **Bug found and fixed**: the 7 library categories in your real data had no visible name. They were saved in an older format, and "Add from library" copied them without a name | Fixed |
| 13 | Analytics › Agents: type chips for All, Calls, Chats, E-mails and Other | Done (earlier) |
| 14 | Agents chart: one wider bar per period (weeks inside a month, months inside a year). Resting the mouse shows the average, the categories and the reviews. Bars are pale until you point at them | Done (earlier) |
| 15 | The Administration team is hidden from analytics, filters and reviews. It is built in for every future company | Done (earlier) |
| 16 | **Team Review**: ⌄ folds a team card to its key numbers (team lead, reviews, average, pass rate). The "All agents" table folds too. Views: Cards, Compact or Table | Done |
| 17 | **Category Stats**: one modern tile per category. **Click a tile** to open a pop-up with:<br>• the score by team<br>• the items answered "No"<br>• the best agents and those who need support<br>• the lowest reviews<br>Mistakes and root causes open their own pop-ups too | Done |
| — | Demo reviews of every type in seed.js and data.json (3 per agent, per type, per month). Free **tags** on scorecards, so any scorecard works for any conversation | Done (earlier) |

Every change was tested in the browser on a copy of your data, never on your real data.json. All automated tests pass (135).

### The audit again: every action, every role

- **Server:** all 142 server actions were tried by admin, QA, team lead, trainer, agent and by someone not signed in, with empty and with wrong input.
  - Nothing crashed.
  - No role got into something it should not.
  - Nothing wrong was saved.
  - This is now a permanent automatic test.
- **Browser:** every page (48) was opened as each role.
  - No page had an error.
  - Each role is sent away from exactly the pages it may not use.
  - An agent sees only their own reviews and conversations.
- **Problem found and fixed:** the admin action "Refresh seed.js" (Backups) could write a test copy's made-up people into the project's **seed.js**. The new test did exactly that once.
  - seed.js was put back from the saved version straight away: 17 users and 842 reviews, as before.
  - Your **data.json was never touched**.
  - The action now refuses unless the app runs on its own data.json, and the test checks after every run that seed.js and data.json are unchanged.
- The details are in TEST_RESULTS.md, FUNCTIONAL_AUDIT.md, SECURITY_AUDIT.md and REMAINING_ISSUES.md (round 3 at the end of each).

---

## C. Answers

### C1. How companies get their own profile, team and database (point 1)

For companies of 50 to 500 people, I recommend this:

1. **One app, many companies.** Each company gets its own web address, for example `acme.q-smart.app`, and its own data.
2. **One SQLite file per company** (`acme.db`, `beta.db` …), plus one small "main" database. The main one holds the list of companies, their plan and their billing.
   - Data of two companies can never mix.
   - A backup, a data export or deleting a company is just one file.
   - A big customer can later move to its own server.
   - The alternative is one shared database (PostgreSQL) with a company number on every row. It is cheaper with hundreds of companies, but one coding mistake can show one company's data to another.
3. **Sign-up for a new company:**
   1. company name and web address
   2. the first admin
   3. the **built-in Administration team**, made automatically
   4. invite people by e-mail link
   5. choose starter scorecards
   6. set the pass rate
4. **Also needed before selling:**
   - **Money and contracts:** paid plans per seat (Stripe), Terms of Service, Privacy Policy and a GDPR data-processing agreement.
   - **Customer data:** "export all my data" and "delete my company".
   - **Sign-in for bigger customers:** Google or Microsoft single sign-on.
   - **Reliability:** daily off-site backups, uptime monitoring, a status page and a support e-mail.
   - **Limits per company:** users, storage and AI use.

The audit file **SAAS_READINESS.md** has the full checklist.

### C2. Too many menus (points 2 and 10)

See the proposal in **A1**.

### C3. Ideas to make the interface simpler (point 7)

- **Done:**
  - Views in their own tab.
  - One "Filters" button with chips, instead of rows of drop-downs. It is on Reviews and the dashboard so far.
  - Details moved into pop-ups (Category Stats), so cards show fewer numbers.
  - Each person's choices are remembered: views, columns, compact or detailed, folded or open.
- **Next ideas:**
  - Admin and Learning panels (A1).
  - The same Filters and Columns on every table (A4).
  - A shorter menu for agents.
  - A "Recently opened" list in Ctrl+K search.
  - Empty pages that explain what to do first (as the guide does now).

### C4. Transcripts and the AI coach: how much will testing cost? (point 18)

**Claude prices** (official, per 1 million tokens, in / out). One token is about ¾ of a word.
- Claude Opus 5.5: $4 / $20
- Claude Sonnet 5.5: $2 / $10
- Claude Haiku 5.5: $0.10 / $0.50

**What one action costs, roughly:**

| Action | Haiku 5.5 | Sonnet 5.5 | Opus 5.5 |
|---|---|---|---|
| AI scoring of one 10-minute call transcript (about 4,000 tokens in, 1,500 out) | about $0.001 | about $0.02 | about $0.05 |
| One typed role-play coaching exercise (about 20 turns plus final feedback) | under $0.01 | about $0.05–0.15 | about $0.15–0.30 |

So **testing 100 exercises with Sonnet costs about $5–15**. Set a monthly spending limit on the key in the Anthropic Console while testing. "Prompt caching" (re-using the unchanged start of each message) makes long exercises cheaper.

**Voice.** Claude works with text. A spoken simulator needs speech-to-text plus a voice. These are third-party estimates, so check each pricing page before you buy:
- **ElevenLabs voices:** about $0.04–0.10 per 1,000 characters, roughly $0.03–0.08 per minute of speech. A complete ElevenLabs voice agent is about $0.08 per minute, plus the AI model ([devtoollab](https://devtoollab.com/blog/elevenlabs-alternatives), [ModelsLab](https://modelslab.com/elevenlabs-api-pricing.md), [HappyRobot](https://www.happyrobot.ai/hub/elevenlabs-pricing), [getmacha](https://www.getmacha.com/blog/elevenlabs-agents-pricing-explained)).
- **OpenAI Realtime voice:** about $32 / $64 per million audio tokens, roughly $0.06–0.11 per minute. The "mini" model is about $0.02–0.05 per minute ([Fora Soft](https://www.forasoft.com/article/openai-realtime-api-pricing), [eesel](https://www.eesel.ai/blog/gpt-realtime-mini-pricing)).
- **Google Gemini Live voice:** about $3 / $12 per million audio tokens, roughly $0.02–0.03 per minute ([Fora Soft](https://www.forasoft.com/learn/ai-for-video-engineering/articles-ai/real-cost-of-ai-in-video-products-gemini-openai-pricing), [Bifrost calculator](https://www.getmaxim.ai/bifrost/llm-cost-calculator/provider/gemini/model/gemini-live-2.5-flash-preview-native-audio-09-2025)).
- **Free, for testing:**
  - The speech built into Chrome and Edge (the "Web Speech API"). It turns speech into text and reads text aloud, with no key and no cost; the quality is fine for tests.
  - Free open-source models you run yourself: **Whisper** turns speech into text; **Piper** or **Kokoro** read text aloud. You only pay for the computer that runs them.

**My recommendation:**
1. **Free start:** simulator with the browser's speech, Claude Haiku 5.5 playing the customer, and Sonnet 5.5 writing the feedback and score.
2. **For paying customers:** ElevenLabs voices as a "premium voices" option.
3. **Settings:** the admin chooses the model and the voice in Admin › Integrations, with a monthly AI budget per company. The app shows how much has been used.

---

## D. Suggested order of work

1. **Now:** your answers to A1–A7, then merge into `main`.
2. **Before SQLite:**
   - the same Filters and Columns on the other tables
   - the Admin and Learning panels (if you say yes)
   - final look of the scorecard editor
3. **SQLite step:**
   - one database per company
   - sign-in per company address
   - sign-up for a new company with the built-in Administration team
   - backups per company
4. **AI step** (with your key):
   - AI scoring of transcripts (AutoQA with Claude)
   - recording upload with speech-to-text
   - the coaching simulator, with free voices first and premium voices later
   - a budget per company
5. **Before selling:** billing, legal pages, single sign-on, monitoring.

---

## E. Your answers of 26 October, and what happened

| Item | Your answer | Status |
|---|---|---|
| A1 Admin and Learning panels with "Back" | Do it | ✅ Built. Sections fold like the main menu; in the icons-only menu, resting the mouse on an icon opens its list |
| A2 Merge into `main` | No | Nothing merged, nothing pushed |
| A4 Filters and Columns on all tables, plus a copy for Excel | Yes | ✅ Every table has a small toolbar: Filter (text plus a drop-down per column), Columns, sort by clicking a title, and **Copy** (paste straight into Excel). Reviews copies every matching row of all pages |
| A5 Kainami recording test | Later | Not done. The places for the keys are ready (next line) |
| API keys and settings | Make sure they exist and nothing breaks | ✅ Admin › Integrations › **AI and voice**: Claude key, model, monthly budget with usage, "Test the connection", voice provider, ElevenLabs and OpenAI keys. Keys are stored encrypted and never shown again in full. Tested with a fake AI service: a wrong key, a busy service and an empty budget give clear messages, and nothing crashes |
| A6 One database per company | Explain the steps; do it after the app set-up | See **G** below |

## F. The new dashboard and the AI team — waiting for your yes

The three pictures in the chat show:
1. **Team pulse**, the new "Overall" dashboard, which answers three questions at a glance:
   - **How is my team doing?** One plain sentence plus four numbers: average, pass rate, review plan, disputes.
   - **What needs me now?** A list with one button per item (decide, plan coaching, review now, remind).
   - **Where is it coming from?** A heat map of agents by categories, where a click opens those reviews.

   Below them is the weekly trend against the target.
2. **Dashboards**, a page of its own:
   - **Ready-made dashboards:** Overall, Team lead, QA specialist, Trainer, Agent, Performance and KPIs, Speed and workload, Analytics, AI and automation, Learning.
   - **Yours:** your own dashboards, named however you like, which can be shared or set as your home page.
3. **AI team**: an AI QA reviewer, AI team lead, AI trainer and AI analyst. Each works by your company's playbook and either drafts for a person to approve or acts automatically. AutoQA shows human and AI scores side by side, with a **similarity rate**.

**Update:** you said yes to 1 and 2, and both are built (Home › Dashboard › Dashboards). From the AI team (3), the **AI QA reviewer** is built: AutoQA › AI reviewer (drafts for approval, similarity rate), with the company playbook in Admin › Integrations. The AI team lead, trainer and analyst come next.

### How the AI team would work

1. **AI workers are like colleagues:**
   - Each has a profile in the app (with an "AI" badge).
   - It appears as the reviewer, author or coach on what it does.
   - Agents can dispute an AI review like any other.
2. **Playbooks: your company's rules in plain words.** For example:
   - "3 reviews per agent, per category, per month"
   - "Critical fail when the identity is not checked"
   - "Coaching after 2 weeks below target"

   Together with the scorecards and the knowledge base, they are what the AI follows.
3. **Tasks and schedules.** The AI workers take tasks from the same task board, either given by a person or triggered by a rule:
   - every night: review the new scripted calls
   - every Monday at 08:00: send the team summary
4. **Two modes per worker:**
   - **Drafts for approval** (the default): a person checks and publishes.
   - **Automatic**: publishes on its own when it is sure enough. Anything unsure goes to a person.
5. **Human vs AI in AutoQA:**
   - The same conversation is reviewed by both, with a similarity rate per category and overall.
   - Big disagreements go to a "check" list.
   - Every human decision is kept as an example, so the AI gets closer to your way of scoring.
6. **Safety and cost:**
   - the monthly budget (already built)
   - a log of every AI action
   - an on/off switch per worker
   - the AI never deletes anything
7. **Order of building:**
   1. AI QA reviewer on transcripts, with drafts for approval and the similarity rate. The AI rating in AutoQA already exists.
   2. AI analyst reports.
   3. AI team lead summaries and coaching drafts.
   4. AI trainer: quizzes (already possible with AI) and role-plays.
   5. Voice simulator: free browser voice first, ElevenLabs later.

## G. One database per company — the steps (after you finish the app set-up)

1. **Finish the set-up** with your own company, as now.
2. **Move to SQLite.**
   - Each company gets its own database file, for example `companies/acme.db`.
   - A small `main.db` holds the list of companies, their plan and their billing.
3. **Bring your data across.**
   - Your current data.json becomes the first company's file, in a one-time import.
   - The import is first tested on a copy and compared number by number: users, reviews, scores.
4. **One web address per company**, for example `acme.q-smart.app`. The app opens the file of the company in the address, so people of one company can never see another.
5. **Sign-up for a new company:**
   1. company name and address
   2. first admin
   3. the built-in Administration team, made by itself
   4. starter scorecards
   5. invite people by e-mail link
6. **Backups per company.** Each file is copied every day, kept for 30 days and also stored off the server. One company can be restored without touching the others.
7. **Updates.** When a new version adds something, every company file is updated by itself at start-up.
8. **Limits and billing per company:** number of users, storage and AI budget, linked to the plan they pay for.

**Why one file per company?**
- One company's data can never show up for another.
- A backup, a data export or deleting a company is one file.
- A very large customer can later get its own server.

The cost is a little more work for updates (step 7), which the app does by itself.

---

## H. AI team lead (built 26 October)

Where: **AutoQA › AI team lead** (admin, QA, team leads and trainers; agents never see it). Also a card on the **Team lead** dashboard.

- **Agents at risk** is worked out from the reviews, without AI and at no cost. An agent is at risk when:
  - they are below target for 2 weeks,
  - their score is falling,
  - they had a critical fail,
  - or they have several open disputes.
- **Weekly summary:** the AI writes it from the numbers only. Use the button, or switch on "Every Monday from 08:00…" in Admin › Integrations (it is off now). The team lead and the admins get a notification.
- **Coaching plan drafts:** the AI drafts a plan for one agent. A person checks it and can change anything. On approval, a normal coaching session (a one-to-one when a team lead approves) is created, and every action becomes a task for the agent. Reject creates nothing.
- **Privacy:** people limited to some teams see and write summaries only for their own teams.

**To decide (no rush):**
1. Should the Monday summary be on by default for new companies?
2. Should a trainer also be able to write summaries? Now only admin, QA and team leads can.
