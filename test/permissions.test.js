// Roles & permissions (29 October): per-person access, saved templates and "Reset to default". Made-up people only
// (test/fixture-round4.js), on a temporary copy.
const test = require('node:test'), assert = require('node:assert/strict');
const { startApp, client } = require('./fixture-round4');

let app;
test.before(async () => { app = await startApp(); });
test.after(() => { if (app) app.stop(); });

test('per-person access: only admins save it, each person only receives their own choices, odd names are dropped', async () => {
  const a = await client(app.base, 'f.admin'), b1 = await client(app.base, 'f.b1'), qa = await client(app.base, 'f.qa1');
  assert.equal((await qa.put('/api/settings/x/permu', { value: { dash: { 'f.b1': false } } })).status, 403, 'a QA cannot change permissions');
  const r = await a.put('/api/settings/x/permu', { value: { dash: { 'f.b1': false, 'f.c1': true, 'x"><img': true, __proto__x: true }, calls: { 'f.b2': 'yes' }, '<bad>': { 'f.b1': true } } });
  assert.equal(r.status, 200);
  assert.deepEqual(r.json.permu, { dash: { 'f.b1': false, 'f.c1': true }, calls: {} }, 'only page names and usernames, only yes / no');
  assert.deepEqual((await b1.get('/api/settings')).json.permu, { dash: { 'f.b1': false } }, 'f.b1 sees only their own choice');
  assert.equal((await b1.get('/api/settings')).json.permtpl, undefined, 'templates are for admins only');
  // more than 60 pages are kept (the general cleaning keeps 60 entries per list)
  const many = Object.fromEntries(Array.from({ length: 90 }, (_, i) => ['page' + i, ['admin', 'qa', 'nobody']]));
  const p = await a.put('/api/settings/x/perm', { value: many });
  assert.equal(Object.keys(p.json.perm).length, 90); assert.deepEqual(p.json.perm.page5, ['admin', 'qa'], 'only real roles');
});

test('templates keep their name, id and date; Reset to default empties the roles and the personal choices but keeps the templates', async () => {
  const a = await client(app.base, 'f.admin');
  const t = await a.put('/api/settings/x/permtpl', { value: [{ id: 'pt1', name: '  Summer team ', at: '2026-10-29T10:00:00.000Z', perm: { dash: ['admin'] }, permu: { dash: { 'f.b1': true } } }, { name: '' }] });
  assert.equal(t.status, 200);
  assert.deepEqual(t.json.permtpl[0], { id: 'pt1', name: 'Summer team', at: '2026-10-29T10:00:00.000Z', perm: { dash: ['admin'] }, permu: { dash: { 'f.b1': true } } });
  assert.equal(t.json.permtpl[1].name, 'Template'); assert.ok(t.json.permtpl[1].id, 'a template without an id gets one');
  await a.put('/api/settings/x/perm', { value: {} }); const r = await a.put('/api/settings/x/permu', { value: {} });
  assert.deepEqual([r.json.perm, r.json.permu, r.json.permtpl.length], [{}, {}, 2]);
});

// Admin › GOVERNANCE registers (3 November): admins only; a link must be https://; the accessibility statement needs a text
test('the governance registers: only admins read and write them; links must be https://; a statement needs a text', async () => {
  const a = await client(app.base, 'f.admin'), qa = await client(app.base, 'f.qa1'), b1 = await client(app.base, 'f.b1');
  for (const c of ['ropa', 'subproc', 'dpas', 'consents', 'aireg', 'ainotices', 'breaches', 'a11y']) {
    for (const x of [qa, b1]) { assert.equal((await x.get('/api/c/' + c)).status, 403, c); assert.equal((await x.post('/api/c/' + c, { title: 'x' })).status, 403, c); }
    assert.equal((await a.get('/api/c/' + c)).status, 200, c);
  }
  const r = await a.post('/api/c/breaches', { title: 'Laptop lost', found: '2026-11-03', foundAt: '09:30', risk: 'high', authority: 'todo', status: 'open' });
  assert.equal(r.status, 200); assert.equal(r.json.title, 'Laptop lost'); assert.equal(r.json.by, 'f.admin');
  assert.equal((await a.post('/api/c/dpas', { party: 'Supplier', link: 'javascript:alert(1)' })).status, 400);
  assert.equal((await a.post('/api/c/dpas', { party: 'Supplier', link: 'https://files.example/dpa.pdf' })).status, 200);
  assert.equal((await a.post('/api/c/a11y', { status: 'partial', text: '  ' })).status, 400);
});

// Help Center, pins and reviewer checks (3 November)
test('Help Center: everybody reads, staff write; pins: an agent sees only their own; reviewer checks: staff only; video links must be https://', async () => {
  const a = await client(app.base, 'f.admin'), tr1 = await client(app.base, 'f.tr1'), b1 = await client(app.base, 'f.b1'), b2 = await client(app.base, 'f.b2');
  for (const c of ['faq', 'gloss', 'videos', 'tours']) { assert.equal((await b1.get('/api/c/' + c)).status, 200, c); assert.equal((await b1.post('/api/c/' + c, { q: 'x' })).status, 403, c); }
  assert.equal((await tr1.post('/api/c/faq', { q: 'How do I dispute a review?', a: 'Open it and press Dispute.' })).status, 200, 'a trainer writes the FAQ');
  assert.equal((await a.post('/api/c/videos', { title: 'Tour', link: 'http://plain.example' })).status, 400);
  await a.post('/api/c/pins', { rid: 'r1', agent: 'f.b1', note: 'The greeting at 00:10', status: 'todo' }); await a.post('/api/c/pins', { rid: 'r2', agent: 'f.b2', note: 'Another agent', status: 'todo' });
  assert.deepEqual((await b1.get('/api/c/pins')).json.map(x => x.agent), ['f.b1']); assert.deepEqual((await b2.get('/api/c/pins')).json.map(x => x.agent), ['f.b2']);
  assert.equal((await b1.post('/api/c/pins', { note: 'x' })).status, 403);
  assert.equal((await b1.get('/api/c/revqa')).status, 403); assert.equal((await tr1.post('/api/c/revqa', { rid: 'r1' })).status, 403, 'a trainer reads the checks but does not write them');
  assert.equal((await a.post('/api/c/revqa', { rid: 'r1', fair: 'yes', follows: 'no' })).status, 200);
});

// Tools & settings (3 November): sidebar, branding and regional settings for admins only and checked; feature requests with one vote each
test('sidebar, branding and regional settings: admins only, odd values dropped; feature requests: one vote per person; announcements: admins write', async () => {
  const a = await client(app.base, 'f.admin'), b1 = await client(app.base, 'f.b1'), qa = await client(app.base, 'f.qa1');
  assert.equal((await qa.put('/api/settings/x/sidebar', { value: { hide: ['home'] } })).status, 403);
  const s = await a.put('/api/settings/x/sidebar', { value: { hide: ['planning', '<img>'], order: ['coaching', 'home'], compact: ['app:tr'], apps: ['tr', 'qi'], views: [{ name: 'Agents', roles: ['agent', 'boss'], hide: ['reports'] }] } });
  assert.equal(s.status, 200); assert.deepEqual(s.json.sidebar.hide, ['planning']); assert.deepEqual(s.json.sidebar.views[0].roles, ['agent']); assert.ok(s.json.sidebar.views[0].id);
  assert.deepEqual((await b1.get('/api/settings')).json.sidebar.views[0].hide, ['reports'], 'everybody receives the layout');
  assert.equal((await a.put('/api/settings/x/brand', { value: { name: 'Acme', color: '#3b82f6', logo: 'data:image/svg+xml;base64,PHN2Zz4=' } })).status, 400, 'no SVG logos');
  const br = await a.put('/api/settings/x/brand', { value: { name: 'Acme', color: 'red', logo: 'data:image/png;base64,iVBORw0KGgo=' } });
  assert.deepEqual(br.json.brand, { name: 'Acme', color: '', logo: 'data:image/png;base64,iVBORw0KGgo=' });
  assert.deepEqual((await a.put('/api/settings/x/region', { value: { date: 'ymd', time: '99' } })).json.region, { date: 'ymd', time: 'auto' });
  const idea = (await b1.post('/api/c/ideas', { title: 'Dark mode for the reports' })).json;
  assert.deepEqual((await qa.post('/api/ideas/' + idea.id + '/vote')).json.votes, ['f.qa1']);
  assert.deepEqual((await a.post('/api/ideas/' + idea.id + '/vote')).json.votes, ['f.qa1', 'f.admin']);
  assert.deepEqual((await qa.post('/api/ideas/' + idea.id + '/vote')).json.votes, ['f.admin'], 'a second click takes the vote back');
  assert.equal((await qa.put('/api/c/ideas/' + idea.id, { title: 'Changed' })).status, 403, 'only its author or an admin changes an idea');
  assert.equal((await a.put('/api/c/ideas/' + idea.id, { status: 'planned' })).json.status, 'planned');
  assert.equal((await qa.post('/api/c/announce', { text: 'x' })).status, 403); assert.equal((await a.post('/api/c/announce', { text: 'Training on Friday' })).status, 200);
  assert.equal((await b1.get('/api/c/announce')).json[0].text, 'Training on Friday');
  await a.put('/api/settings/x/sidebar', { value: {} }); await a.put('/api/settings/x/brand', { value: {} }); await a.put('/api/settings/x/region', { value: {} });
});

// Contact support (3 November): a request with a file; a person sees their own, admins see all and set the status; only safe files
test('contact support: a request with a picture; the sender and the admins see it; only pictures, PDF and text under 1 MB', async () => {
  const a = await client(app.base, 'f.admin'), b1 = await client(app.base, 'f.b1'), b2 = await client(app.base, 'f.b2');
  const png = Buffer.from('89504e470d0a1a0a', 'hex').toString('base64');
  assert.equal((await b1.post('/api/support', { email: 'not an e-mail', subject: 'x', desc: 'y' })).status, 400);
  assert.equal((await b1.post('/api/support', { email: 'b1@example.com', subject: 'x', desc: 'y', file: { name: 'a.html', type: 'text/html', data: png } })).status, 400, 'no web pages');
  const r = await b1.post('/api/support', { email: 'b1@example.com', subject: 'The export button does nothing', type: 'problem', desc: 'On Reviews, nothing happens.', file: { name: 'screen.png', type: 'image/png', data: png } });
  assert.equal(r.status, 200); assert.equal(r.json.file.name, 'screen.png'); assert.equal(r.json.file.path, undefined, 'where the file is kept is not shown');
  assert.equal((await b1.get('/api/support')).json.length, 1); assert.equal((await b2.get('/api/support')).json.length, 0, 'another agent sees nothing');
  assert.equal((await b2.get('/api/support/' + r.json.id + '/file')).status, 404); const f = await b1.get('/api/support/' + r.json.id + '/file'); assert.equal(f.status, 200); assert.equal(f.headers.get('content-type'), 'image/png');
  assert.equal((await b1.put('/api/support/' + r.json.id, { status: 'closed' })).status, 403);
  assert.equal((await a.put('/api/support/' + r.json.id, { status: 'answered' })).json.status, 'answered');
  assert.ok((await a.get('/api/support')).json.some(x => x.id === r.json.id));
});
