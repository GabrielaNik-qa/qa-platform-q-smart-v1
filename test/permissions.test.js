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
