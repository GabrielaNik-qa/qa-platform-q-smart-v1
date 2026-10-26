// Every action of the server, tried by every role (admin, QA, team lead, trainer, agent) and by someone who is not signed in,
// with an empty body and with a body full of wrong types. The routes are read from the source files, so a new route is
// covered by itself. Rules: the server never answers 500 (no crash on bad input), a role that a route does not allow gets 403,
// and nobody who is not signed in gets past a protected route (401). Runs on a temporary data file of made-up people.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const bcrypt = require('bcryptjs');
const { DEFAULT_SC } = require('../scorecard');

const ROOT = path.join(__dirname, '..'), ROLES = ['admin', 'qa', 'lead', 'trainer', 'agent'];
// ---- the routes: method, path and which roles the guard lets in (null = public, [] = anybody signed in)
function routes() {
  const out = [];
  for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8'), edit = (src.match(/const EDIT = (\[[^\]]*\])/) || [])[1], EDIT = edit ? JSON.parse(edit.replace(/'/g, '"')) : null;
    for (const m of src.matchAll(/app\.(get|post|put|delete|patch)\(\s*'(\/api\/[^']*)'\s*,\s*([^\n]*)/g)) {
      const g = m[3]; let roles = null;
      if (/^authed\b/.test(g) || /^need\(\)/.test(g)) roles = [];
      else if (/^need\(\.\.\.EDIT\)/.test(g)) roles = EDIT;
      else if (/^need\(((?:'[a-z]+'(?:,\s*)?)+)\)/.test(g)) roles = g.match(/^need\(((?:'[a-z]+'(?:,\s*)?)+)\)/)[1].match(/[a-z]+/g);
      out.push({ f, method: m[1].toUpperCase(), path: m[2], roles });
    }
  }
  return out;
}

const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'qsmart-roles-')), DATA = path.join(DIR, 'data.json');
const H = bcrypt.hashSync('password', 4);
const person = (username, role, team) => ({ username, name: username, email: username + '@test.com', role, team, title: '', desc: '', languages: [], skills: [], phone: '', start: '', active: true, hash: H, mustChange: false });
fs.writeFileSync(DATA, JSON.stringify({
  boot: 5,
  users: [person('r.admin', 'admin', 't-admin'), person('r.qa', 'qa', 't-admin'), person('r.lead', 'lead', 't-admin'), person('r.trainer', 'trainer', 't-admin'), person('r.agent', 'agent', 't-a')],
  teams: [{ id: 't-admin', name: 'Administration', lead: 'r.admin', system: true }, { id: 't-a', name: 'Team A', lead: 'r.lead' }],
  workspaces: [{ id: 'w-1', name: 'Main', teams: ['t-a'], scorecards: ['sc-default'], staff: ['r.qa', 'r.lead', 'r.trainer'] }],
  scorecards: [DEFAULT_SC], evaluations: [], settings: { pass: 85, teams: {} }, skills: [], languages: [], rootCauses: [], categories: [], autoCats: [], conversations: []
}));

let BASE = '', srv = null;
test.before(async () => {
  srv = spawn(process.execPath, ['server.js'], { cwd: ROOT, env: { ...process.env, PORT: '0', DATA_FILE: DATA, AUDIT_FILE: path.join(DIR, 'audit.json'), REC_DIR: path.join(DIR, 'rec'), BACKUPS_DIR: path.join(DIR, 'backups'), SMTP_HOST: '', ANTHROPIC_API_KEY: '' } });
  BASE = await new Promise((ok, no) => {
    const t = setTimeout(() => no(new Error('the server did not start')), 15000);
    srv.stdout.on('data', d => { const m = String(d).match(/http:\/\/localhost:(\d+)/); if (m) { clearTimeout(t); ok('http://localhost:' + m[1]); } });
    srv.on('exit', c => no(new Error('the server stopped: ' + c)));
  });
});
test.after(() => { if (srv) srv.kill(); try { fs.rmSync(DIR, { recursive: true, force: true }); } catch (e) { /* temp folder */ } });

let NADDR = 0;
async function client(username) {
  let cookie = ''; const addr = '10.77.' + (++NADDR >> 8 & 255) + '.' + (NADDR & 255);
  const call = async (method, url, body) => {
    const r = await fetch(BASE + url, { method, redirect: 'manual', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': addr, ...(cookie ? { Cookie: cookie } : {}) }, body: method === 'GET' || body === undefined ? undefined : JSON.stringify(body) });
    const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0];
    await r.arrayBuffer(); return r.status;
  };
  if (username) assert.equal(await call('POST', '/api/login', { username, password: 'password' }), 200, username + ' can sign in');
  return call;
}
// wrong types for the field names the routes read (an object where text is expected, text where a list is expected …)
const JUNK = { name: {}, title: [], text: 5, t: {}, desc: [], items: 'x', views: 'x', page: {}, id: [], rid: {}, username: {}, agent: [], scid: {}, cats: 'x', it: 'x', a: 'x', cs: 'x',
  tags: 7, d: {}, dt: [], date: {}, status: {}, role: [], roles: 'x', team: {}, teams: 'x', email: [], password: {}, keys: 'x', cols: 'x', checklist: 'x', q: {}, answers: 'x', ch: {}, lang: {}, f: 'x', size: {}, h: [] };
const SKIP = new Set(['POST /api/logout']);   // would end the session in the middle of the run (it is tested on its own in the other files)

test('every route: no crash on empty or wrong-type input, 403 for roles it does not allow, 401 when not signed in', async t => {
  const all = routes().filter(r => !SKIP.has(r.method + ' ' + r.path));
  assert.ok(all.length > 100, 'found ' + all.length + ' routes');
  const callers = { none: await client(null) };
  for (const r of ROLES) callers[r] = await client('r.' + r);
  const crashes = [], leaks = [], seen = {};
  for (const r of all) {
    const url = r.path.replace(/:[A-Za-z]+/g, 'zz-none');
    for (const who of ['none', ...ROLES]) for (const body of r.method === 'GET' ? [undefined] : [{}, JUNK]) {
      const st = await callers[who](r.method, url, body), tag = `${r.method} ${r.path} as ${who}${body === JUNK ? ' (wrong types)' : ''} → ${st}  [${r.f}]`;
      seen[st] = (seen[st] || 0) + 1;
      if (st >= 500) crashes.push(tag);
      if (who === 'none' && r.roles !== null && st !== 401) leaks.push(tag + ' (expected 401)');
      if (who !== 'none' && r.roles && r.roles.length && !r.roles.includes(who) && st !== 403) leaks.push(tag + ' (expected 403)');
    }
  }
  t.diagnostic(`${all.length} routes, answers: ${Object.entries(seen).map(([k, v]) => k + ' ×' + v).join(', ')}`);
  // what the accepted requests saved: names, titles and texts must still be plain text (no list or object slipped through)
  const bad = [], walk = (v, p) => { if (Array.isArray(v)) v.forEach((x, i) => walk(x, p + '[' + i + ']')); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => { if (['name', 'title', 'text', 'desc', 't', 'n'].includes(k) && x != null && typeof x !== 'string' && !(k === 'n' && typeof x === 'number')) bad.push(p + '.' + k + ' = ' + JSON.stringify(x).slice(0, 40)); walk(x, p + '.' + k); }); };
  walk(JSON.parse(fs.readFileSync(DATA, 'utf8')), 'db');
  assert.deepEqual(bad, [], 'wrong types were saved:\n' + bad.join('\n'));
  assert.deepEqual(crashes, [], 'server errors:\n' + crashes.join('\n'));
  assert.deepEqual(leaks, [], 'routes that let in the wrong people:\n' + leaks.join('\n'));
});
