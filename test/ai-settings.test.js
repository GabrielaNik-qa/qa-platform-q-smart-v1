// Admin › Integrations › AI and voice: keys are stored encrypted and never sent back, a wrong key or a busy service gives a clear
// message (no crash), every request counts towards the monthly budget and the AI pauses when it is used up.
// The AI service is a small fake on this computer (ANTHROPIC_BASE_URL): no real AI is called and nothing is paid.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http'), { spawn } = require('child_process');
const bcrypt = require('bcryptjs');
const { DEFAULT_SC } = require('../scorecard');

const GOOD = 'sk-ant-good-key-1234567890ABCD', WRONG = 'sk-ant-wrong-key-000000000000';
const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'qsmart-ai-')), DATA = path.join(DIR, 'data.json');
const H = bcrypt.hashSync('password', 4), db = () => JSON.parse(fs.readFileSync(DATA, 'utf8'));
const person = (username, role) => ({ username, name: username, email: username + '@test.com', role, team: 't-admin', title: '', desc: '', languages: [], skills: [], phone: '', start: '', active: true, hash: H, mustChange: false });
fs.writeFileSync(DATA, JSON.stringify({ boot: 5, users: [person('k.admin', 'admin'), person('k.qa', 'qa'), { ...person('k.agent', 'agent'), team: 't-a' }], teams: [{ id: 't-admin', name: 'Administration', lead: 'k.admin', system: true }, { id: 't-a', name: 'Team A', lead: 'k.admin' }], workspaces: [],
  scorecards: [DEFAULT_SC], evaluations: [], settings: { pass: 85, teams: {} }, skills: [], languages: [], rootCauses: [], categories: [], autoCats: [], conversations: [] }));

let BASE = '', srv = null, fake = null, CALLS = 0;
test.before(async () => {
  fake = http.createServer((req, res) => {                    // answers like the Claude Messages API
    let b = ''; req.on('data', d => { b += d; }); req.on('end', () => {
      CALLS++; const ok = req.headers['x-api-key'] === GOOD;
      res.writeHead(ok ? 200 : 401, { 'Content-Type': 'application/json' });
      const reviewer = ok && /quality reviewer/.test(JSON.parse(b).system || '');   // the AI QA reviewer: the first item No, the rest Yes
      const text = reviewer ? JSON.stringify({ answers: DEFAULT_SC.cats.map((c, ci) => c.it.map((i, ii) => ({ a: ci === 0 && ii === 0 ? 'n' : 'y', cm: ci === 0 && ii === 0 ? 'No greeting at the start' : '' }))), comment: 'Good call, greet the customer first.', confidence: 82 }) : 'OK';
      res.end(JSON.stringify(ok ? { content: [{ type: 'text', text }], usage: { input_tokens: 10000, output_tokens: 10000 }, stop_reason: 'end_turn', model: JSON.parse(b).model } : { error: { message: 'invalid x-api-key' } }));
    });
  });
  await new Promise(ok => fake.listen(0, '127.0.0.1', ok));
  srv = spawn(process.execPath, ['server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: '0', DATA_FILE: DATA, AUDIT_FILE: path.join(DIR, 'audit.json'), REC_DIR: path.join(DIR, 'rec'), BACKUPS_DIR: path.join(DIR, 'backups'), ANTHROPIC_API_KEY: '', KEY_SECRET: '', ANTHROPIC_BASE_URL: 'http://127.0.0.1:' + fake.address().port } });
  BASE = await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('the server did not start')), 15000);
    srv.stdout.on('data', d => { const m = String(d).match(/http:\/\/localhost:(\d+)/); if (m) { clearTimeout(t); ok('http://localhost:' + m[1]); } });
    srv.on('exit', c => no(new Error('the server stopped: ' + c)));
  });
});
test.after(() => { if (srv) srv.kill(); if (fake) fake.close(); try { fs.rmSync(DIR, { recursive: true, force: true }); } catch (e) { /* temp folder */ } });

let NADDR = 0;
async function as(username) {
  let cookie = ''; const addr = '10.88.0.' + (++NADDR);
  const call = async (method, url, body) => {
    const r = await fetch(BASE + url, { method, headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': addr, ...(cookie ? { Cookie: cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0];
    const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch (e) { /* not JSON */ }
    return { status: r.status, json };
  };
  assert.equal((await call('POST', '/api/login', { username, password: 'password' })).status, 200);
  return { get: u => call('GET', u), put: (u, b) => call('PUT', u, b), post: (u, b = {}) => call('POST', u, b) };
}

test('the admin manages the AI key, model and budget; keys are encrypted and never come back; the budget is kept', async () => {
  const a = await as('k.admin');
  let s = (await a.get('/api/ai/settings')).json;
  assert.equal(s.enabled, false); assert.equal(s.keys.anthropic.set, false);
  assert.equal((await a.post('/api/ai/test')).status, 400, 'no key yet');
  assert.equal((await a.put('/api/ai/settings', { anthropicKey: 'short' })).status, 400);
  assert.equal((await a.put('/api/ai/settings', { model: 'gpt-4' })).status, 400);
  assert.equal((await a.put('/api/ai/settings', { budget: -1 })).status, 400);
  assert.equal((await a.put('/api/ai/settings', { voice: 'robot' })).status, 400);

  // a wrong key: saved encrypted, a clear message from the test, no crash
  s = (await a.put('/api/ai/settings', { anthropicKey: WRONG })).json;
  assert.deepEqual([s.keys.anthropic.set, s.keys.anthropic.last4, s.enabled], [true, '0000', true]);
  assert.ok(!JSON.stringify(s).includes(WRONG), 'the key is not sent back');
  let raw = fs.readFileSync(DATA, 'utf8'); assert.ok(!raw.includes(WRONG) && /"key":\s*"v1:/.test(raw), 'only the encrypted key is in the data file');
  const t1 = await a.post('/api/ai/test'); assert.equal(t1.status, 400); assert.match(t1.json.error, /not accepted/);

  // the right key, the cheapest model and a tiny budget: two requests fit, the third is refused before calling the AI
  s = (await a.put('/api/ai/settings', { anthropicKey: GOOD, model: 'claude-haiku-5-5', budget: 0.01, voice: 'elevenlabs', elevenKey: 'xi-eleven-key-123456789012345', elevenVoice: 'Rachel' })).json;
  assert.deepEqual([s.model, s.budget, s.voice, s.elevenVoice, s.keys.elevenlabs.set], ['claude-haiku-5-5', 0.01, 'elevenlabs', 'Rachel', true]);
  const t2 = await a.post('/api/ai/test'); assert.equal(t2.status, 200); assert.equal(t2.json.model, 'claude-haiku-5-5');
  s = (await a.get('/api/ai/settings')).json; assert.equal(s.usage.calls, 1); assert.equal(s.usage.usd, 0.006, '10,000 tokens in and out with Haiku 5.5');
  assert.equal((await a.post('/api/ai/test')).status, 200);
  const before = CALLS, t4 = await a.post('/api/ai/test');
  assert.equal(t4.status, 400); assert.match(t4.json.error, /budget is used up/); assert.equal(CALLS, before, 'the AI was not called');
  raw = fs.readFileSync(DATA, 'utf8'); assert.ok(!raw.includes(GOOD) && !raw.includes('xi-eleven-key'), 'no readable key in the data file');
  assert.ok(fs.existsSync(path.join(DIR, '.qsmart-key')), 'the encryption key sits next to this copy of the data, not in the project');

  // removing the key switches the AI off
  s = (await a.put('/api/ai/settings', { anthropicKey: '' })).json;
  assert.deepEqual([s.keys.anthropic.set, s.enabled], [false, false]);
  assert.equal((await (await as('k.qa')).get('/api/ai/settings')).status, 403, 'only admins see the AI settings');
});

test('the AI QA reviewer drafts a review on the company scorecard; a person approves it (with changes) or rejects it; the similarity is kept', async () => {
  const a = await as('k.admin'), T = ['Agent: Hello, how can I help?', 'Customer: My order is late.', 'Agent: I am sorry, let me check it for you right away.'].join('\n');
  await a.put('/api/ai/settings', { anthropicKey: GOOD, model: 'claude-sonnet-5-5', budget: 0, playbook: 'Three reviews per agent per category per month.' });
  const base = { agent: 'k.agent', id: 'L-77', dt: '2026-10-20', ch: 'chat', scid: 'sc-default' };
  assert.equal((await a.post('/api/ai/drafts', { ...base, tx: 'too short' })).status, 400);
  assert.equal((await a.post('/api/ai/drafts', { ...base, agent: 'k.qa', tx: T })).status, 400, 'only agents are reviewed');
  const d = (await a.post('/api/ai/drafts', { ...base, tx: T })).json;
  assert.equal(d.status, 'draft'); assert.equal(d.a[0][0][0], 'n'); assert.equal(d.a[0][0][1], 'No greeting at the start'); assert.equal(d.conf, 82); assert.ok(d.sc > 0 && d.sc < 100);
  assert.equal((await a.get('/api/ai/drafts')).json.length, 1);
  // the reviewer disagrees on one item: the first item was done after all
  const fin = d.a.map((row, ci) => row.map((x, ii) => ci === 0 && ii === 0 ? ['y', ''] : x));
  const ap = await a.post('/api/ai/drafts/' + d.id + '/approve', { a: fin, cm: 'Well done.' });
  assert.equal(ap.status, 200); assert.equal(ap.json.ev.sc, 100); assert.equal(ap.json.ev.ai.draft, d.id);
  const n = d.a.flat().length; assert.equal(ap.json.draft.sim.items, Math.round((n - 1) / n * 1000) / 10, 'all items but one agree');
  assert.equal(ap.json.draft.sim.cats[0], 50); assert.equal(ap.json.draft.status, 'approved');
  assert.ok(db().evaluations.some(e => e.rid === ap.json.ev.rid && e.cm === 'Well done.' && e.by === 'k.admin'), 'a normal review was made');
  assert.equal((await a.post('/api/ai/drafts/' + d.id + '/approve', {})).status, 400, 'decided only once');
  const d2 = (await a.post('/api/ai/drafts', { ...base, id: 'L-78', tx: T })).json;
  const rj = await a.post('/api/ai/drafts/' + d2.id + '/reject', { why: 'Wrong call' });
  assert.deepEqual([rj.status, rj.json.status, rj.json.why], [200, 'rejected', 'Wrong call']);
  assert.equal((await (await as('k.qa')).post('/api/ai/drafts/' + d2.id + '/approve', {})).status, 400, 'a rejected draft cannot be approved later');
  assert.equal((await (await as('k.agent')).get('/api/ai/drafts')).status, 403, 'agents never see AI drafts');
});
