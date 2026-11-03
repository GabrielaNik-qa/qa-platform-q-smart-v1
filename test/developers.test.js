// The developer platform (4 November): API keys, the API, webhooks and MCP. Made-up people only (test/fixture-round4.js), on a
// temporary copy; the webhooks go to a small receiver on this computer, never to the internet.
const test = require('node:test'), assert = require('node:assert/strict'), http = require('http'), crypto = require('crypto');
const { startApp, client } = require('./fixture-round4');

let app, rcv, got = [];
test.before(async () => {
  app = await startApp({ env: { WEBHOOK_ALLOW_LOCAL: '1' } });
  rcv = http.createServer((req, res) => { let b = ''; req.on('data', c => { b += c; }); req.on('end', () => { got.push({ h: req.headers, b }); res.writeHead(req.url === '/fail' ? 500 : 200); res.end('ok'); }); });
  await new Promise(ok => rcv.listen(0, '127.0.0.1', ok));
});
test.after(() => { if (app) app.stop(); if (rcv) rcv.close(); });
const call = (path, key, body, method) => fetch(app.base + path, { method: method || (body ? 'POST' : 'GET'), headers: { 'Content-Type': 'application/json', ...(key ? { Authorization: 'Bearer ' + key } : {}) }, body: body ? JSON.stringify(body) : undefined })
  .then(async r => ({ status: r.status, json: await r.json().catch(() => null) }));
const until = async (fn, ms = 4000) => { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await new Promise(r => setTimeout(r, 50)); } return false; };

test('API keys: only admins make them; the full key is shown once; each area has its own access; a switched-off key stops working', async () => {
  const a = await client(app.base, 'f.admin'), qa = await client(app.base, 'f.qa1');
  assert.equal((await qa.post('/api/devkeys', { name: 'x' })).status, 403);
  const k = await a.post('/api/devkeys', { name: 'Power BI', scopes: { reviews: 'read', stats: 'read', people: 'write', flags: 'bogus' }, limit: 5 });
  assert.equal(k.status, 200); assert.match(k.json.key, /^qs_[0-9a-f]{48}$/);
  assert.deepEqual(k.json.scopes, { reviews: 'read', people: 'read', scorecards: 'none', stats: 'read', simulations: 'none', flags: 'none' }, 'people can only be read; unknown values are no access');
  const list = (await a.get('/api/devkeys')).json; assert.ok(!JSON.stringify(list).includes(k.json.key), 'the list never holds the key'); assert.ok(!JSON.stringify(app.db().apiKeys).includes(k.json.key), 'nor does the data file');
  assert.equal((await call('/api/v1/reviews')).status, 401);
  assert.equal((await call('/api/v1/reviews', 'qs_wrong')).status, 401);
  const r = await call('/api/v1/reviews?limit=2', k.json.key); assert.equal(r.status, 200); assert.equal(r.json.data.length, 2); assert.ok(r.json.total >= 10);
  assert.ok(['id', 'agent', 'score', 'passed', 'categories', 'date'].every(x => x in r.json.data[0]));
  assert.equal((await call('/api/v1/reviews?agent=f.b1', k.json.key)).json.data.every(x => x.agent === 'f.b1'), true);
  assert.equal((await call('/api/v1/simulations', k.json.key)).status, 403, 'no access to practice calls');
  assert.equal((await call('/api/v1/reviews', k.json.key, { agent: 'f.b1', lead: 'X', date: '2026-11-03', score: 90 })).status, 403, 'read only');
  const st = await call('/api/v1/stats?team=B2B', k.json.key); assert.equal(st.status, 200); assert.ok(st.json.reviews > 0 && st.json.by_team.every(t => t.team === 'B2B'));
  assert.equal((await call('/api/v1/nothing', k.json.key)).status, 404);
  assert.equal(k.json.limit, 10, 'the smallest limit is 10 an hour'); const codes = []; for (let i = 0; i < 6; i++) codes.push((await call('/api/v1/me', k.json.key)).status);
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429], 'every request of the key counts, also the refused ones: the 11th in the hour is refused');
  await a.put('/api/devkeys/' + k.json.id, { active: false, limit: 1000 }); assert.equal((await call('/api/v1/me', k.json.key)).status, 401, 'switched off');
  assert.equal((await a.del('/api/devkeys/' + k.json.id)).status, 200);
});

test('the API adds a review with the import checks; MCP lists only the tools the key may use and answers with the same data', async () => {
  const a = await client(app.base, 'f.admin'), key = (await a.post('/api/devkeys', { name: 'Claude', scopes: { reviews: 'write', stats: 'read', people: 'read' } })).json.key;
  const add = await call('/api/v1/reviews', key, { agent: 'f.b2', lead: 'API-1', date: '2026-11-03', score: 88.5, channel: 'chat', comment: 'From the API' });
  assert.equal(add.status, 200, JSON.stringify(add.json)); assert.deepEqual([add.json.agent, add.json.score, add.json.channel, add.json.imported], ['f.b2', 88.5, 'chat', true]);
  assert.equal(app.db().evaluations.find(e => e.id === 'API-1').by, 'api:' + (await a.get('/api/devkeys')).json.find(x => x.name === 'Claude').id);
  assert.equal((await call('/api/v1/reviews', key, { agent: 'f.b2', lead: 'API-1', date: '2026-11-03', score: 88.5 })).status, 400, 'the same review twice');
  const rpc = (method, params, id = 1, k = key) => call('/mcp', k, { jsonrpc: '2.0', id, method, params });
  const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1' } });
  assert.equal(init.json.result.protocolVersion, '2025-06-18'); assert.equal(init.json.result.serverInfo.name, 'q-smart');
  assert.equal((await call('/mcp', key, { jsonrpc: '2.0', method: 'notifications/initialized' })).status, 202);
  assert.equal((await rpc('initialize', {}, 1, 'qs_nope')).status, 401);
  const names = (await rpc('tools/list')).json.result.tools.map(t => t.name);
  assert.ok(names.includes('get_stats') && names.includes('create_review') && names.includes('list_agents'));
  assert.ok(!names.includes('list_simulations'), 'no access to practice calls, so no tool for them');
  const s = await rpc('tools/call', { name: 'get_stats', arguments: { team: 'B2C' } }); assert.ok(s.json.result.structuredContent.reviews > 0);
  assert.deepEqual(JSON.parse(s.json.result.content[0].text), s.json.result.structuredContent);
  const g = await rpc('tools/call', { name: 'get_review', arguments: { id: 'API-1' } }); assert.equal(g.json.result.structuredContent.score, 88.5);
  assert.equal((await rpc('tools/call', { name: 'list_flags', arguments: {} })).json.error.code, -32602);
  assert.equal((await rpc('nope/nope')).json.error.code, -32601);
});

test('webhooks: admins only, https or nothing (no local network); events are signed; a test ping; failures are logged; the sandbox sends nothing', async () => {
  const a = await client(app.base, 'f.admin'), qa = await client(app.base, 'f.qa1'), base = `http://127.0.0.1:${rcv.address().port}`;
  assert.equal((await qa.post('/api/hooks', { url: base + '/ok', events: ['review.created'] })).status, 403);
  assert.equal((await a.post('/api/hooks', { url: 'http://example.com/x', events: ['review.created'] })).status, 400, 'https only');
  assert.equal((await a.post('/api/hooks', { url: 'https://192.168.1.10/x', events: ['review.created'] })).status, 400, 'never the local network');
  assert.equal((await a.post('/api/hooks', { url: base + '/ok', events: ['nothing'] })).status, 400, 'at least one real event');
  const h = (await a.post('/api/hooks', { name: 'Test', url: base + '/ok', events: ['review.created', 'dispute.opened', 'flag.created'] })).json; assert.match(h.secret, /^whsec_/);
  got = []; const t = await a.post('/api/hooks/' + h.id + '/test', {}); assert.deepEqual([t.json.status, t.json.ok], [200, true]);
  assert.equal(JSON.parse(got[0].b).type, 'test.ping');
  // a real event: a review saved by QA reaches the receiver, signed with the secret
  got = []; const sc = app.db().scorecards[0], ans = sc.cats.map(c => c.it.map(() => ['y', '']));
  const ev = await qa.post('/api/evaluations', { scid: sc.id, agent: 'f.b1', id: 'HOOK-1', dt: '2026-11-03', a: ans, ch: 'call' }); assert.equal(ev.status, 200, ev.text);
  assert.ok(await until(() => got.length), 'the event arrived');
  const p = JSON.parse(got[0].b), [, ts, v1] = got[0].h['q-smart-signature'].match(/^t=(\d+),v1=([0-9a-f]+)$/);
  assert.equal(p.type, 'review.created'); assert.equal(p.data.lead, 'HOOK-1'); assert.equal(p.data.score, 100); assert.equal(got[0].h['q-smart-event'], 'review.created');
  assert.equal(v1, crypto.createHmac('sha256', h.secret).update(ts + '.' + got[0].b).digest('hex'), 'the signature checks out');
  // a receiver that fails is written in the log
  const bad = (await a.post('/api/hooks', { name: 'Broken', url: base + '/fail', events: ['flag.created'] })).json;
  assert.equal((await a.post('/api/hooks/' + bad.id + '/test', {})).json.ok, false);
  assert.ok((await a.get('/api/hooks')).json.log.some(l => l.hook === bad.id && l.status === 500));
  // inside the sandbox nothing is sent
  await a.post('/api/sandbox', { from: 'copy' }); got = [];
  await a.post('/api/evaluations', { scid: sc.id, agent: 'f.b1', id: 'HOOK-SANDBOX', dt: '2026-11-03', a: ans, ch: 'call' });
  await new Promise(r => setTimeout(r, 400)); assert.equal(got.length, 0, 'the sandbox never sends events');
  await a.del('/api/sandbox'); await a.del('/api/hooks/' + h.id); await a.del('/api/hooks/' + bad.id);
});
