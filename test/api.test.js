// Starts the real server on a throw-away COPY of the seed data (your data.json is never touched) and checks the important rules through the API.
const test = require('node:test'), assert = require('node:assert');
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const bcrypt = require('bcryptjs');
const { DATA } = require('../seed');

const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'qsmart-test-')), FILE = path.join(DIR, 'data.json');
const PORT = 3300 + Math.floor(Math.random() * 600), BASE = 'http://localhost:' + PORT;
const hash = bcrypt.hashSync('password', 4);
const db0 = JSON.parse(JSON.stringify(DATA));
const staff = (username, role) => ({ username, name: 'Test ' + role, email: username + '@test.com', role, team: 't-admin', title: '', desc: '', languages: [], skills: [], phone: '', start: '', active: true, hash, mustChange: false });
db0.users.push(staff('t.admin', 'admin'), staff('t.qa', 'qa'), staff('t.qa2', 'qa'), staff('t.lead', 'lead'));
db0.workspaces.forEach(w => w.staff.push('t.qa', 't.qa2', 't.lead'));
const AGENT = db0.users.find(u => u.role === 'agent' && u.active !== false && db0.teams.some(t => t.id === u.team)).username;
db0.users.find(u => u.username === AGENT).hash = hash;
fs.writeFileSync(FILE, JSON.stringify(db0));
const readDb = () => JSON.parse(fs.readFileSync(FILE, 'utf8'));

let srv;
test.before(async () => {
  srv = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT, DATA_FILE: FILE, AUDIT_FILE: path.join(DIR, 'audit.json'), RECORDINGS_DIR: path.join(DIR, 'rec'), SMTP_HOST: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((ok, no) => { srv.stdout.on('data', d => /Running on/.test(d) && ok()); srv.on('exit', c => no(new Error('server exited ' + c))); setTimeout(() => no(new Error('server did not start')), 15000); });
});
test.after(() => { srv && srv.kill(); fs.rmSync(DIR, { recursive: true, force: true }); });

// a tiny browser: keeps its own sign-in cookie
const client = () => {
  let cookie = '';
  const call = async (method, url, body) => {
    const r = await fetch(BASE + url, { method, headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0];
    const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch (e) {}
    return { status: r.status, json, headers: r.headers, cookie };
  };
  return { call, get: u => call('GET', u), post: (u, b) => call('POST', u, b || {}), put: (u, b) => call('PUT', u, b || {}), login: (u, p = 'password') => call('POST', '/api/login', { username: u, password: p }), cookie: () => cookie };
};
const allYes = sc => sc.cats.map(c => c.it.map(() => ['y']));

test('basic browser protections are sent and the server type is hidden', async () => {
  const r = await client().get('/');
  assert.strictEqual(r.headers.get('x-content-type-options'), 'nosniff');
  assert.strictEqual(r.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.strictEqual(r.headers.get('x-powered-by'), null);
});

test('every sign-in gets a new session id', async () => {
  const c = client();
  assert.strictEqual((await c.login(AGENT)).status, 200); const first = c.cookie();
  assert.strictEqual((await c.login(AGENT)).status, 200);
  assert.notStrictEqual(c.cookie(), first);
});

test('wrong password is refused', async () => {
  assert.strictEqual((await client().login(AGENT, 'nope')).status, 401);
});

test('QA creates a review: the server calculates the score, the agent only sees their own reviews', async () => {
  const qa = client(), ag = client(); await qa.login('t.qa'); await ag.login(AGENT);
  const sc = (await qa.get('/api/scorecards')).json[0];
  const a = allYes(sc); a[0][0] = ['n', 'missed', 'Knowledge gap'];
  const r = await qa.post('/api/evaluations', { scid: sc.id, agent: AGENT, id: 'T-1001', dt: '2026-10-01', a, sc: 100 });
  assert.strictEqual(r.status, 200);
  const lost = sc.cats[0].it[0].p, total = sc.cats.reduce((s, c) => s + c.it.reduce((x, i) => x + i.p, 0), 0);
  assert.strictEqual(r.json.sc, Math.round((total - lost) / total * 1000) / 10, 'the score sent by the browser is ignored');
  assert.strictEqual((await qa.post('/api/evaluations', { scid: sc.id, agent: AGENT, id: 'T-1002', dt: '2026-10-01', a: [[['y']]] })).status, 400);
  assert.strictEqual((await ag.post('/api/evaluations', { scid: sc.id, agent: AGENT, id: 'T-1003', dt: '2026-10-01', a: allYes(sc) })).status, 403);
  const mine = (await ag.get('/api/evaluations')).json;
  assert.ok(mine.length > 0 && mine.every(e => e.agent === AGENT));
  assert.ok(mine.some(e => e.rid === r.json.rid));
});

test('quick flags keep their CRM and recording links (regression)', async () => {
  const lead = client(); await lead.login('t.lead');
  const r = await lead.post('/api/qflags', { agent: AGENT, lead: 'T-2001', date: '2026-10-02', type: 'red', lk: 'https://crm.example.com/lead/1', rl: 'https://rec.example.com/1', cm: 'test' });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.lk, 'https://crm.example.com/lead/1');
  assert.strictEqual(r.json.rl, 'https://rec.example.com/1');
  assert.strictEqual((await lead.post('/api/qflags', { agent: AGENT, lead: 'T-2002', date: '2026-10-02', lk: 'javascript:alert(1)' })).json.lk, '');
  assert.strictEqual(readDb().qflags.find(f => f.id === r.json.id).lk, 'https://crm.example.com/lead/1');
});

test('a deactivated user is signed out at once, not at the next login', async () => {
  const adm = client(), ag = client(); await adm.login('t.admin'); await ag.login(AGENT);
  assert.strictEqual((await ag.get('/api/evaluations')).status, 200);
  assert.strictEqual((await adm.put('/api/users/' + AGENT, { active: false })).status, 200);
  assert.strictEqual((await ag.get('/api/evaluations')).status, 401);
  assert.strictEqual((await ag.get('/api/me')).status, 401);
  await adm.put('/api/users/' + AGENT, { active: true });
});

test('a changed role takes effect at once', async () => {
  const adm = client(), qa = client(); await adm.login('t.admin'); await qa.login('t.qa2');
  assert.strictEqual((await qa.get('/api/calibrations')).status, 200);
  assert.strictEqual((await qa.post('/api/evaluations', {})).status, 400, 'QA may create reviews (400 = form incomplete)');
  assert.strictEqual((await adm.put('/api/users/t.qa2', { role: 'trainer' })).status, 200);
  assert.strictEqual((await qa.post('/api/evaluations', {})).status, 403, 'a trainer may not');
  assert.strictEqual((await qa.get('/api/me')).json.role, 'trainer');
});

test('a password reset by the admin forces the new password pop-up on the open session', async () => {
  const adm = client(), ld = client(); await adm.login('t.admin'); await ld.login('t.lead');
  assert.strictEqual((await adm.post('/api/users/t.lead/reset')).status, 200);
  const r = await ld.get('/api/tasks');
  assert.strictEqual(r.status, 403); assert.strictEqual(r.json.mustChange, true);
  const fresh = 'Lead#Pass9'; assert.strictEqual((await ld.post('/api/password/first', { next: fresh })).status, 200);
  assert.strictEqual((await ld.get('/api/tasks')).status, 200);
});

test('a saved Excel export can only be opened again by the person who made it (or an admin)', async () => {
  const qa = client(), adm = client(); await qa.login('t.qa'); await adm.login('t.admin');
  const rows = [['Lead', 'Date', 'Score'], ['L1', '2026-10-01', 90]];
  const x = await qa.call('POST', '/api/export/call-reviews', { rows, pf: 2, pt: 2, name: 'Mine' });
  assert.strictEqual(x.status, 200);
  const id = readDb().exports.find(e => e.by === 't.qa').id;
  assert.strictEqual((await qa.get('/api/exports/' + id)).status, 200);
  assert.strictEqual((await adm.get('/api/exports/' + id)).status, 200);
  const qa3 = client(); await qa3.login('t.qa2');   // t.qa2 is a trainer now (previous test) - still staff, but not the owner
  assert.strictEqual((await qa3.get('/api/exports/' + id)).status, 404);
});

test('the database file is always complete JSON and no temporary file is left behind', () => {
  assert.doesNotThrow(() => readDb());
  assert.ok(!fs.existsSync(FILE + '.tmp'));
});
