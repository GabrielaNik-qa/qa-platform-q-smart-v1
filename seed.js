// Usage: node seed.js
// Adds made-up demo data so every page has something to show. Run it again to refresh ONLY the demo data (anything you created yourself stays):
//   * 150 call reviews for the test agents
//   * a few knowledge base folders and articles (with a lesson test), a weekly quiz and a newsletter
//   * sample tasks, a daily mission, a coaching session, a one-to-one and a calibration
// The test users (agents, team leads, trainers) are created automatically: password "password", email  first-initial.lastname@test.com
const fs = require('fs'), F = process.env.DATA_FILE || 'data.json';   // DATA_FILE: the same copy the server uses (Reset demo data in a test copy never touches the real file)
const { DEFAULT_SC, build } = require('./scorecard');
const B = require('./bootstrap');
const { scoreConv } = require('./autoqa');
const db = fs.existsSync(F) ? JSON.parse(fs.readFileSync(F, 'utf8')) : { users: [], evaluations: [] };
for (const k of ['notifications', 'registrations', 'tasks', 'taskTpl', 'sessions', 'calibrations', 'kbFolders', 'kbArticles', 'newsletters', 'quizzes', 'attempts', 'conversations']) if (!Array.isArray(db[k])) db[k] = [];
if (!db.oldTeams) db.oldTeams = {};
if (!db.kbReads) db.kbReads = {}; if (!db.settings) db.settings = { pass: 85, teams: {} };
if (!Array.isArray(db.scorecards) || !db.scorecards.length) db.scorecards = [DEFAULT_SC];
B.ensureBootstrap(db);   // creates the teams, the test users, the skills catalog, workspaces, root causes and Auto QA categories when they are missing
for (const k of ['evaluations', 'kbFolders', 'kbArticles', 'newsletters', 'quizzes', 'tasks', 'taskTpl', 'sessions', 'calibrations', 'conversations']) db[k] = db[k].filter(x => !x.demo);

const iso = d => d.toISOString(), now = new Date(), hex = n => Math.random().toString(16).slice(2, 2 + n);
const dayStr = n => { const d = new Date(now.getTime() + n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const agents = db.users.filter(u => u.role === 'agent' && u.active !== false && B.AGENTS0.some(n => B.uname(n) === u.username));

// ---- call reviews
let s = 7; const r = () => (s = s * 16807 % 2147483647) / 2147483647;
const yes = [.93, .94, .90, .95, .92, .85, .97];   // chance of a "Yes" per category (same order as the default scorecard)
const CP = ['alpha fr vip 120+', 'beta fr regulars 30-60', 'gamma en vip 120+', 'delta en regulars 30-60', 'omega fr new 0-30'];
const CM = ['', '', '', '', 'Should have left a voicemail message', '', 'Great rapport with the customer', '', '', 'Missed an upsell opportunity'];
const RV = ['Lena Hart', 'Marc Duval'];
const out = [];
for (let i = 0; i < 150; i++) {
  const u = agents[i % agents.length];
  const a = DEFAULT_SC.cats.map((c, ci) => c.it.map(() => { const x = r(); return [x < yes[ci] ? 'y' : x > .985 ? 'na' : 'n', r() < .04 ? 'Could be improved here' : '']; }));
  const { cs, sc } = build(DEFAULT_SC, a);
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - Math.floor(i / 8), 9 + i % 9, (i * 13) % 60);
  const disputed = i % 17 === 0;
  out.push({ rid: 'rdemo' + String(i).padStart(3, '0'), id: String(4000000 + Math.floor(r() * 999999)), agent: u.username, agn: u.name, tid: u.team, d: iso(d), sc, cs,
    scid: DEFAULT_SC.id, scn: DEFAULT_SC.name, st: disputed ? 'disputed' : 'ok', fl: sc < 80 ? 'red' : sc >= 98 && i % 3 === 0 ? 'green' : '',
    cp: CP[i % 5], cm: CM[i % 10], lk: '', rl: '', rv: RV[i % 2], by: 'demo', demo: true,
    seen: i % 3 === 0 ? null : iso(new Date(d.getTime() + 36e5 * (2 + i % 20))),
    ...(disputed ? { dp: { status: 'open', at: iso(d), msgs: [{ u: u.username, n: u.name, r: 'agent', t: 'I do not agree with this score. Could we go through the call again?', at: iso(d) }] } } : {}) });
}
db.evaluations = [...db.evaluations, ...out].sort((a, b) => b.d.localeCompare(a.d));

// ---- Auto QA: a made-up transcript for most reviews. The wording follows how well the agent did, so the automatic score is close to
//      (but not the same as) the human score, which gives the Auto QA dashboard something real to compare.
const cap = x => x[0].toUpperCase() + x.slice(1), FILL = ['how can I help you today?', 'let me look at that for you.', 'I will take care of it.', 'we can sort this out.'], NEUT = ['Yes?', 'Okay.', 'Right, one moment.', 'Hmm, let me see.'];
const pctOf = (rv, name, sc) => { const x = (rv.cs || []).find(c => c.n === name); return x && x.m ? x.e / x.m * 100 : sc; };
const pickOf = a => a[Math.floor(r() * a.length)];
function transcript(p) {
  const lines = ['Customer: Hi, I have a question about my plan and the price.'];
  db.autoCats.forEach(c => {
    const q = p(c), good = r() < q / 100 * .9 + .05, bad = (c.neg || []).length && r() < (100 - q) / 250;
    lines.push('Agent: ' + (good && (c.pos || []).length ? cap(pickOf(c.pos)) + ', ' + pickOf(FILL) : pickOf(NEUT)) + (bad ? ' ' + cap(pickOf(c.neg)) + '.' : ''));
    lines.push('Customer: ' + pickOf(['I see.', 'It seems expensive.', 'Okay, and then?', 'That is not what I expected.']));
  });
  return lines.join('\n');
}
const convs = [];
out.slice(0, 130).forEach((rv, i) => { const u = db.users.find(x => x.username === rv.agent), text = transcript(c => c.maps ? pctOf(rv, c.maps, rv.sc) : rv.sc);
  convs.push({ id: 'cvdemo' + String(i).padStart(3, '0'), agent: rv.agent, agn: u ? u.name : '', date: rv.d.slice(0, 10), text, rid: rv.rid, auto: scoreConv(text, db.autoCats), by: 'Auto QA', created: rv.d, demo: true }); });
for (let i = 0; i < 25; i++) { const u = agents[i % agents.length], d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i % 14), 10, i), q = 55 + r() * 45, text = transcript(() => q);
  convs.push({ id: 'cvdemo' + String(130 + i).padStart(3, '0'), agent: u.username, agn: u.name, date: d.toISOString().slice(0, 10), text, rid: '', auto: scoreConv(text, db.autoCats), by: 'Auto QA', created: d.toISOString(), demo: true }); }
convs.slice(0, 160).filter((_, i) => i % 11 === 3).forEach(c => { const cat = db.autoCats[(c.id.length + 2) % db.autoCats.length]; c.edits = { [cat.id]: Math.max(0, Math.min(100, (c.auto.scores[cat.id] || { s: 70 }).s + (r() < .5 ? -25 : 20))) }; c.editedBy = 'Demo reviewer'; });
db.conversations = [...convs, ...db.conversations].sort((a, b) => b.date.localeCompare(a.date));

// ---- knowledge base demo content
const fid = () => 'fdemo' + hex(4), aid = () => 'ademo' + hex(4);
const fOnb = { id: fid(), name: 'Onboarding', parent: '', color: '#2563eb', icon: '📘', desc: 'Everything a new agent reads in the first week', req: { on: true, teams: [] }, created: iso(now), demo: true };
const fSales = { id: fid(), name: 'Sales skills', parent: '', color: '#7c3aed', icon: '💡', desc: 'Techniques for better conversations', req: { on: false, teams: [] }, created: iso(now), demo: true };
const fObj = { id: fid(), name: 'Objection handling', parent: fSales.id, color: '#e11d48', icon: '🎯', desc: '', req: { on: false, teams: [] }, created: iso(now), demo: true };
const art = (title, folder, topics, body, quiz, req) => ({ id: aid(), title, folder, topics, body, req: req || { on: false, teams: [] }, quiz: quiz || null, author: 'Iva Marinova', authorU: 'i.marinova', created: iso(now), updated: iso(now), demo: true });
db.kbFolders.push(fOnb, fSales, fObj);
db.kbArticles.push(
  art('How to greet a customer', fOnb.id, ['Greeting & Introduction'], '## The first 10 seconds\n\nA warm greeting sets the tone for the whole call.\n\n- Smile before you pick up\n- Say your name and the company\n- Ask how you can help\n\n> Tip: match the energy of the customer, calm or upbeat.',
    { pass: 70, questions: [{ q: 'What should you say in the first seconds?', opts: ['Your name and the company', 'Nothing until the customer speaks', 'The price'], a: 0, why: 'Introduce yourself and the company.' }, { q: 'How should your energy be?', opts: ['Always loud', 'Matched to the customer', 'Flat'], a: 1, why: 'Adapt tone to the customer.' }] }, { on: true, teams: [] }),
  art('Active listening checklist', fOnb.id, ['Empathy & Active Listening'], '## Listen first\n\n1. Let the customer finish\n2. Paraphrase the concern\n3. Use reassuring language\n\n**Never interrupt**, even if you know the answer.'),
  art('Handling "it is too expensive"', fObj.id, ['Persuasion & Objection Handling', 'Price'], '## Steps\n\n1. Acknowledge the concern\n2. Ask what they compare it with\n3. Show the value, not a discount\n4. Confirm the next step\n\nSee also the closing checklist.'),
  art('Closing the call well', fSales.id, ['Closing & Positive Outcome'], '## Closing\n\n- Recap what was agreed\n- Confirm the next contact\n- Thank the customer\n\n**Always** document the call in the CRM.'));
const kbA = db.kbArticles.filter(a => a.demo);
db.quizzes.push({ id: 'qdemo1', title: 'Weekly quiz: listening and closing', desc: 'Five minutes, based on this week\'s articles', kind: 'weekly', topics: ['Empathy & Active Listening'], articles: kbA.slice(1, 4).map(a => a.id), pass: 70, due: dayStr(5), assign: { all: true, teams: [], users: [] }, status: 'published', by: 'Iva Marinova', created: iso(now), demo: true,
  questions: [{ q: 'What do you do first when a customer raises a concern?', opts: ['Interrupt with the solution', 'Let them finish and paraphrase', 'Change the subject'], a: 1, why: 'Listen first.' }, { q: 'What should you always do after a call?', opts: ['Document it in the CRM', 'Nothing', 'Call back at once'], a: 0, why: 'Documentation matters.' }] });
db.newsletters.push({ id: 'ndemo1', month: dayStr(0).slice(0, 7), title: 'Monthly update', intro: 'Here is what changed this month in the knowledge base.', items: [{ title: 'New guide: handling price objections', text: 'A short guide with four steps.', aid: kbA[2].id }, { title: 'Weekly quiz is live', text: 'Take it before Friday.', aid: '' }], published: true, by: 'Iva Marinova', created: iso(now), demo: true });

// ---- tasks, mission, sessions, calibration
const lead = db.users.find(u => u.role === 'lead'), trainer = db.users.find(u => u.role === 'trainer');
const stat = ['todo', 'doing', 'review', 'done'];
agents.slice(0, 6).forEach((u, i) => db.tasks.push({ id: 'kdemo' + i, group: 'gdemo' + i, title: ['Listen to 3 recorded calls', 'Update your CRM notes', 'Read the objection guide', 'Prepare feedback for your one-to-one', 'Practice the closing script', 'Shadow a senior colleague'][i], desc: 'Demo task', type: i % 2 ? 'mission' : 'task', priority: ['low', 'med', 'high'][i % 3], points: 10 + i * 5, due: dayStr(i - 1), status: stat[i % 4], assignee: u.username, labels: ['demo'], checklist: [{ t: 'Step 1', done: i % 4 === 3 }, { t: 'Step 2', done: false }], created: iso(now), by: lead.username, completed: i % 4 === 3 ? iso(now) : null, demo: true }));
db.taskTpl.push({ id: 'pdemo1', title: 'Daily mission: review yesterday\'s feedback', desc: 'Open your latest review and write one thing you will do differently.', points: 5, priority: 'med', freq: 'daily', weekday: 1, users: [], teams: db.teams.filter(t => !t.system).map(t => t.id), checklist: [], labels: ['daily'], active: true, by: lead.username, created: iso(now), demo: true });
db.sessions.push({ id: 'sdemo1', kind: 'coaching', date: dayStr(-3), title: 'Objection handling workshop', agents: agents.slice(0, 3).map(u => u.username), topics: ['Persuasion & Objection Handling'], focus: ['Persuasion & Objection Handling'], notes: 'Role-played price objections. Good progress.', goals: 'Reduce "No" answers on objection items', actions: [{ t: 'Practice 3 objections per day', owner: agents[0].username, due: dayStr(4), done: false, taskId: '' }], follow: dayStr(14), status: 'done', by: trainer.username, byName: trainer.name, created: iso(now), updated: iso(now), demo: true },
  { id: 'sdemo2', kind: 'o2o', date: dayStr(-1), title: 'One-to-one', agents: [agents[1].username], topics: [], focus: [], notes: 'Talked about workload and goals.', goals: 'Raise the pass rate to 90%', actions: [], follow: dayStr(14), status: 'done', by: lead.username, byName: lead.name, created: iso(now), updated: iso(now), demo: true });
db.calibrations.push({ id: 'cdemo1', title: 'Monthly calibration', date: dayStr(2), status: 'planned', participants: [lead.username, trainer.username, 'qa.demo'].filter(x => db.users.some(u => u.username === x)), teams: db.teams.filter(t => !t.system).slice(0, 2).map(t => t.id), reviews: [], notes: 'Agenda: scoring of empathy, objection handling.', entries: {}, decisions: [{ t: 'Agree on how to score "Handled sensitive situations"', owner: trainer.username, due: dayStr(7), done: false }], by: lead.username, created: iso(now), updated: iso(now), demo: true });

fs.writeFileSync(F, JSON.stringify(db, null, 2));
console.log('Added ' + out.length + ' demo reviews, ' + convs.length + ' Auto QA conversations, ' + kbA.length + ' articles, 1 quiz, 1 newsletter, tasks, sessions and a calibration.');
console.log('Test users: password "password" - e.g. d.petrov@test.com (agent), l.hart@test.com (team lead), i.marinova@test.com (trainer)');
