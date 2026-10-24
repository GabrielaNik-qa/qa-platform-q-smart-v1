// Security regression tests (audit of October 2026). The real server is started on a free port with a temporary data file
// of made-up people in two workspaces (A and B); your data.json, recordings and backups are never touched.
// Each test tries something a person should NOT be able to do and checks that it is refused and that nothing changed.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const bcrypt = require('bcryptjs'), JSZip = require('jszip');
const { DEFAULT_SC } = require('../scorecard');
const RPT = require('../public/js/rpt-engine.js');

const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'qsmart-sec-')), DATA = path.join(DIR, 'data.json');
const H = bcrypt.hashSync('password', 4);
const person = (username, name, role, team) => ({ username, name, email: username + '@test.com', role, team, title: '', desc: '', languages: [], skills: [], phone: '', start: '', active: true, hash: H, mustChange: false });
fs.writeFileSync(DATA, JSON.stringify({
  boot: 5,
  users: [person('t.admin', 'Test Admin', 'admin', 't-admin'), person('q.alpha', 'Quinn Alpha', 'qa', 't-admin'), person('q.beta', 'Quinn Beta', 'qa', 't-admin'),
    person('l.alpha', 'Lee Alpha', 'lead', 't-admin'), person('l.beta', 'Lee Beta', 'lead', 't-admin'), person('z.victim', 'Zed Victim', 'qa', 't-admin'),
    person('a.one', 'Ana One', 'agent', 't-a'), person('a.two', 'Ben Two', 'agent', 't-b')],
  teams: [{ id: 't-admin', name: 'Administration', lead: 't.admin', system: true }, { id: 't-a', name: 'Team A', lead: 'l.alpha' }, { id: 't-b', name: 'Team B', lead: 'l.beta' }],
  workspaces: [{ id: 'w-a', name: 'A', teams: ['t-a'], scorecards: ['sc-default'], staff: ['q.alpha', 'l.alpha', 'z.victim'] }, { id: 'w-b', name: 'B', teams: ['t-b'], scorecards: ['sc-default'], staff: ['q.beta', 'l.beta'] }],
  scorecards: [DEFAULT_SC], evaluations: [], settings: { pass: 85, teams: {} }, skills: [], languages: [], rootCauses: [], categories: [],
  autoCats: [{ id: 'ac1', name: 'Greeting', pos: ['hello'], neg: [], weight: 1, enabled: true }], conversations: []
}));

let BASE = '', srv = null, OUT = '';
test.before(async () => {
  srv = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: '0', DATA_FILE: DATA, AUDIT_FILE: path.join(DIR, 'audit.json'), REC_DIR: path.join(DIR, 'rec'), BACKUPS_DIR: path.join(DIR, 'backups'), SECRET: 'test-only', SMTP_HOST: '', ANTHROPIC_API_KEY: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
  srv.stdout.on('data', d => { OUT += d; });
  BASE = await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('the server did not start')), 15000);
    srv.stdout.on('data', d => { const m = String(d).match(/http:\/\/localhost:(\d+)/); if (m) { clearTimeout(t); ok('http://localhost:' + m[1]); } });
    srv.on('exit', c => no(new Error('the server stopped: ' + c)));
  });
});
test.after(() => { if (srv) srv.kill(); try { fs.rmSync(DIR, { recursive: true, force: true }); } catch (e) { /* temp folder */ } });

// a signed-in person: keeps the session cookie between calls; extra headers can be added per call
async function as(username, password = 'password') {
  let cookie = '';
  const call = async (method, url, body, headers = {}) => {
    const r = await fetch(BASE + url, { method, headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), ...headers }, body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
    const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0];
    const buf = Buffer.from(await r.arrayBuffer()); let json = null; try { json = JSON.parse(buf.toString('utf8')); } catch (e) { /* not JSON */ }
    return { status: r.status, json, buf, headers: r.headers };
  };
  const login = await call('POST', '/api/login', { username, password });
  return { login, call, get: u => call('GET', u), post: (u, b = {}, h) => call('POST', u, b, h), put: (u, b, h) => call('PUT', u, b, h), del: u => call('DELETE', u) };
}
const allYes = () => DEFAULT_SC.cats.map(c => c.it.map(() => ['y', '', '']));
const db = () => JSON.parse(fs.readFileSync(DATA, 'utf8'));
const wait = ms => new Promise(r => setTimeout(r, ms));

// one review in each workspace, used by several tests
let RA = '', RB = '';
test('setup: one review in workspace A and one in workspace B', async () => {
  const adm = await as('t.admin');
  RA = (await adm.post('/api/evaluations', { scid: 'sc-default', agent: 'a.one', id: 'A-1', dt: '2026-10-01', a: allYes() })).json.rid;
  RB = (await adm.post('/api/evaluations', { scid: 'sc-default', agent: 'a.two', id: 'B-1', dt: '2026-10-01', a: allYes() })).json.rid;
  assert.ok(RA && RB);
});

// ---------------------------------------------------------------- access control between workspaces
test('a QA specialist cannot delete the call recording of a review in another workspace', async () => {
  const adm = await as('t.admin');
  const up = await adm.call('POST', '/api/evaluations/' + RB + '/recording?ext=mp3', 'ID3-fake-audio', { 'Content-Type': 'audio/mpeg' });
  assert.equal(up.status, 200);
  const r = await (await as('q.alpha')).del('/api/evaluations/' + RB + '/recording');
  assert.equal(r.status, 404);
  assert.ok(db().evaluations.find(e => e.rid === RB).rec, 'the recording is still attached');
  assert.equal((await (await as('q.beta')).del('/api/evaluations/' + RB + '/recording')).status, 200, 'the QA of workspace B still can');
});

test('Auto QA conversations of another workspace cannot be corrected, re-linked or deleted', async () => {
  const c = (await (await as('t.admin')).post('/api/autoqa/conversations', { agent: 'a.two', text: 'hello there', date: '2026-10-01' })).json;
  const qa = await as('q.alpha');
  assert.ok(!(await qa.get('/api/autoqa')).json.conversations.some(x => x.id === c.id), 'not in the list');
  assert.equal((await qa.put('/api/autoqa/conversations/' + c.id + '/edit', { cat: 'ac1', score: 1 })).status, 404);
  assert.equal((await qa.put('/api/autoqa/conversations/' + c.id + '/link', { rid: RA })).status, 404);
  assert.equal((await qa.del('/api/autoqa/conversations/' + c.id)).status, 404);
  const saved = db().conversations.find(x => x.id === c.id);
  assert.ok(saved && !saved.edits && !saved.rid, 'nothing changed');
});

test('quick flags, tasks, coaching sessions and simulations of another workspace are not listed', async () => {
  const adm = await as('t.admin');
  const fl = (await adm.post('/api/qflags', { agent: 'a.two', lead: 'B-9', date: '2026-10-01', type: 'red', cm: 'B only' })).json;
  const tk = (await adm.post('/api/tasks', { title: 'B task', assignees: ['a.two'] })).json[0];
  const ss = (await adm.post('/api/sessions', { kind: 'coaching', date: '2026-10-01', agents: ['a.two'], notes: 'B notes' })).json;
  const sm = (await adm.post('/api/simulations', { agent: 'a.two', score: 50 })).json;
  const lead = await as('l.alpha');
  assert.ok(!(await lead.get('/api/qflags')).json.some(x => x.id === fl.id));
  assert.ok(!(await lead.get('/api/tasks')).json.some(x => x.id === tk.id));
  assert.ok(!(await lead.get('/api/sessions')).json.some(x => x.id === ss.id));
  assert.ok(!(await lead.get('/api/simulations')).json.some(x => x.id === sm.id));
  assert.ok(!(await lead.get('/api/kb/progress')).json.some(x => x.username === 'a.two'));
  assert.equal((await lead.put('/api/qflags/' + fl.id, { cm: 'changed' })).status, 404);
  assert.equal(db().qflags.find(x => x.id === fl.id).cm, 'B only');
  assert.equal((await lead.post('/api/qflags', { agent: 'a.two', lead: 'B-10', date: '2026-10-01' })).status, 400, 'cannot flag an agent of another workspace');
  const lb = await as('l.beta');                                                       // the people of workspace B still see their own
  assert.ok((await lb.get('/api/qflags')).json.some(x => x.id === fl.id));
  assert.ok((await lb.get('/api/tasks')).json.some(x => x.id === tk.id));
  assert.ok((await lb.get('/api/sessions')).json.some(x => x.id === ss.id));
});

test('a scheduled report can only be sent by its owner (or an admin), and only contains the owner\'s workspace', async () => {
  const la = await as('l.alpha');
  const rep = (await la.post('/api/c/reports', { name: 'Alpha weekly', cfg: { src: 'reviews', metrics: ['count'], period: { p: 'all' } }, schedule: { freq: 'none', to: 'alpha@example.com' } })).json;
  assert.equal((await (await as('l.beta')).post('/api/c/reports/' + rep.id + '/send')).status, 404, 'another team lead cannot trigger it');
  OUT = '';
  assert.equal((await la.post('/api/c/reports/' + rep.id + '/send')).status, 200);
  await wait(200);
  assert.match(OUT, /All time · 1 records/, 'only the review of workspace A is counted (there are 2 in total)');
});

// ---------------------------------------------------------------- exports
test('an Excel export never contains formulas or links sent by the browser (spreadsheet injection)', async () => {
  const ag = await as('a.one');
  const rows = [['Lead', 'Date', 'Note', 'Link'], ['A-1', '2026-10-01', { formula: 'cmd|\' /C calc\'!A0' }, { text: 'click', hyperlink: 'javascript:alert(1)' }], ['A-2', '2026-10-02', '=1+1', 5]];
  const r = await ag.post('/api/export/call-reviews', { rows, pf: 99, pt: 99, name: 'Mine' });
  assert.equal(r.status, 200);
  const sheet = await (await JSZip.loadAsync(r.buf)).file('xl/worksheets/sheet1.xml').async('string');
  assert.ok(!/<f>/.test(sheet), 'no formula cells');
  assert.ok(!/hyperlink/i.test(sheet), 'no hyperlinks');
  const saved = db().exports[0].rows;
  assert.ok(saved.flat().every(v => v === null || ['string', 'number', 'boolean'].includes(typeof v)), 'the Export centre copy holds plain values only');
});

// ---------------------------------------------------------------- sessions, sign-in and browser protections
test('a request sent from another website is refused even with a valid sign-in (CSRF)', async () => {
  const q = await as('q.alpha');
  const r = await q.put('/api/prefs', { info: false }, { 'Sec-Fetch-Site': 'cross-site' });
  assert.equal(r.status, 403);
  assert.notEqual((db().users.find(u => u.username === 'q.alpha').prefs || {}).info, false, 'nothing was saved');
  assert.equal((await q.put('/api/prefs', { info: true }, { 'Sec-Fetch-Site': 'same-origin' })).status, 200, 'the app itself still works');
});

test('the sign-in cookie expires after a period without use', async () => {
  const q = await as('q.alpha');
  assert.match(q.login.headers.get('set-cookie'), /Expires=|Max-Age=/i);
});

test('one account cannot be guessed at forever, even from many addresses', async () => {
  let last;
  for (let i = 0; i < 11; i++) last = await (await as('z.victim', 'wrong-' + i)).login;
  assert.equal(last.status, 429);
  assert.equal((await as('z.victim')).login.status, 429, 'locked for a while, even with the right password');
  assert.equal((await as('q.alpha')).login.status, 200, 'other accounts are not affected');
});

test('people who are not signed in cannot send large requests', async () => {
  const big = JSON.stringify({ username: 'x', password: 'y', pad: 'a'.repeat(300 * 1024) });
  const r = await fetch(BASE + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: big });
  assert.equal(r.status, 413);
});

test('the "show me how notifications look" button cannot be used to flood the notification list', async () => {
  const ag = await as('a.one');
  const codes = [];
  for (let i = 0; i < 4; i++) codes.push((await ag.post('/api/notifications/sample')).status);
  assert.deepEqual(codes, [200, 200, 200, 429]);
});

test('unknown record types are refused instead of being created', async () => {
  const adm = await as('t.admin');
  assert.equal((await adm.put('/api/c/evaluations/A-1', { sc: 0 })).status, 404);
  assert.equal((await adm.put('/api/c/__proto__/x', {})).status, 404);
  assert.equal(db().evaluations.find(e => e.rid === RA).sc, 100);
});

test('an improvement plan whose goals are not a list is refused (it would break the page for everybody)', async () => {
  const adm = await as('t.admin');
  assert.equal((await adm.post('/api/c/pips', { agent: 'a.one', title: 'Plan', goals: 'not a list' })).status, 400);
  const ok = await adm.post('/api/c/pips', { agent: 'a.one', title: 'Plan', goals: [{ t: 'Average above 85%', done: false }] });
  assert.equal(ok.status, 200);
  assert.equal((await adm.put('/api/c/pips/' + ok.json.id, { goals: [1, 2] })).status, 400);
  assert.equal((await adm.put('/api/c/pips/' + ok.json.id, { goals: [{ t: 'Average above 85%', done: true }] })).status, 200, 'ticking a goal still works');
});

// ---------------------------------------------------------------- output encoding
test('report e-mails show names and titles as text, never as HTML', () => {
  const res = RPT.run({ src: 'reviews', metrics: ['count'], rows: 'campaign', period: { p: 'all' } },
    { ev: [{ d: '2026-10-01T12:00:00Z', agent: 'x', sc: 90, cp: '<img src=x onerror=alert(1)>' }], users: [], teams: [] });
  const html = RPT.toHtml(res, '<script>alert(1)</script>');
  assert.ok(!/<img|<script/i.test(html));
  assert.match(html, /&#60;script&#62;alert\(1\)/, 'shown as text');
});
