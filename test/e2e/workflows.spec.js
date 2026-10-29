// Main workflows in the browser, checked on the page and in the saved data: a review the agent sees and disputes and QA
// resolves, check-in / break / check-out, a time-off request approved by the team lead, the Excel export, phone width,
// dark mode. Data is sometimes prepared through the app's own API, but every result is checked on the page.
const { test, expect } = require('@playwright/test');
const JSZip = require('jszip');
const { personPage, go, api, db } = require('./helpers');

const today = () => new Date().toISOString().slice(0, 10);

test('a review: QA saves it, the agent sees it and disputes it, QA resolves it with a new score', async ({ browser }) => {
  const q = await personPage(browser, 'f.qa1');
  const sc = (await api(q.page, '/api/scorecards')).json[0];
  const a = sc.cats.map((c, ci) => c.it.map((x, ii) => [ci === 0 && ii === 0 ? 'n' : 'y', '', '']));
  const made = await api(q.page, '/api/evaluations', { scid: sc.id, agent: 'f.c3', id: 'E2E-REVIEW-1', dt: today(), ch: 'call', a, cm: 'E2E: good call' });
  expect(made.status).toBe(200);
  const rid = made.json.rid, score = made.json.sc;
  expect(score).toBeLessThan(100);

  const ag = await personPage(browser, 'f.c3');
  await go(ag.page, 'calls');
  await expect(ag.page.locator('body')).toContainText('E2E-REVIEW-1');
  const d = await api(ag.page, '/api/evaluations/' + rid + '/dispute', { text: 'E2E: I did greet the customer' });
  expect(d.status).toBe(200);
  await go(q.page, 'disputes');
  await expect(q.page.locator('body')).toContainText('E2E-REVIEW-1');
  const r = await api(q.page, '/api/evaluations/' + rid + '/dispute/resolve', { outcome: 'changed', note: 'E2E: you are right' });
  expect(r.status, JSON.stringify(r.json)).toBe(200);
  const saved = db().evaluations.find(e => e.rid === rid);
  expect([saved.dp.status, saved.dp.res.outcome, saved.st]).toEqual(['resolved', 'changed', 'ok']);
  expect(db().notifications.some(n => n.to === 'f.c3' && n.type === 'resolved' && n.rid === rid), 'the agent is told').toBe(true);
  await ag.page.reload(); await ag.page.waitForFunction(() => typeof ME !== 'undefined' && ME);
  await go(ag.page, 'disputes');
  await expect(ag.page.locator('body')).toContainText('E2E-REVIEW-1');
  expect([...q.errors, ...ag.errors]).toEqual([]);
  await q.ctx.close(); await ag.ctx.close();
});

test('attendance: the agent checks in, takes a break, comes back and checks out with the buttons', async ({ browser }) => {
  // at any hour: on this copy the shifts last the whole day (after the end of a shift the day is closed and the break button goes)
  const ad = await personPage(browser, 'f.admin');
  const shifts = (await api(ad.page, '/api/settings')).json.wf.shifts.map(x => ({ ...x, start: '00:00', end: '23:59' }));
  expect((await api(ad.page, '/api/wf/settings', { shifts }, 'PUT')).status).toBe(200); await ad.ctx.close();
  const { page, ctx, errors } = await personPage(browser, 'f.b2');
  await go(page, 'att');
  for (const [button, action] of [['Check in', 'in'], ['Start a break', 'break'], ['End the break', 'back'], ['Check out', 'out']]) {
    await page.getByRole('button', { name: button, exact: false }).first().click();
    await page.waitForFunction(a => { const r = ((ATTD || {}).today || {}); return a === 'in' ? !!r.in : a === 'out' ? !!r.out : true; }, action);
  }
  const rec = Object.values(db().att || {}).map(d => d['f.b2']).filter(Boolean).pop();
  expect(rec.in).toBeTruthy(); expect(rec.out).toBeTruthy(); expect(rec.brk.length).toBe(1); expect(rec.brk[0].e).toBeTruthy();
  expect(rec.log.map(l => l.what)).toEqual(['in', 'break', 'back', 'out']);
  expect(errors).toEqual([]);
  await ctx.close();
});

test('time off: the agent asks for a day, the team lead approves it with the button, the balance goes down', async ({ browser }) => {
  const ag = await personPage(browser, 'f.b3');
  const before = (await api(ag.page, '/api/leave')).json.balances.find(b => b.id === 'lt-annual' || b.lt === 'lt-annual');
  const d = new Date(Date.now() + 28 * 864e5); d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7));
  const req = await api(ag.page, '/api/leave', { lt: 'lt-annual', from: d.toISOString().slice(0, 10), to: d.toISOString().slice(0, 10) });
  expect(req.status, JSON.stringify(req.json)).toBe(200); expect(req.json.status).toBe('pending');
  const ld = await personPage(browser, 'f.lead1');
  await go(ld.page, 'leave');
  await ld.page.getByRole('tab', { name: /Requests/ }).click();                 // the team lead's "Requests" tab
  await expect(ld.page.locator('body')).toContainText('Agent B3');
  await ld.page.locator(`button[onclick="lvDecide('${req.json.id}',true)"]`).click();
  await expect.poll(() => db().leaves.find(L => L.id === req.json.id).status).toBe('approved');
  const after = (await api(ag.page, '/api/leave')).json.balances.find(b => b.id === 'lt-annual' || b.lt === 'lt-annual');
  expect(JSON.stringify(after)).not.toBe(JSON.stringify(before));
  expect([...ag.errors, ...ld.errors]).toEqual([]);
  await ag.ctx.close(); await ld.ctx.close();
});

test('the Excel export of the reviews holds the same reviews and numbers as the page', async ({ browser }) => {
  const { page, ctx, errors } = await personPage(browser, 'f.qa2');
  await page.evaluate(() => setLang('bg'));                              // exports are always in English, whatever the screen language
  await go(page, 'calls');
  const shown = await page.evaluate(() => EV.length);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.evaluate(() => xp(EV, 'Call Reviews'))]);
  const z = await JSZip.loadAsync(require('fs').readFileSync(await dl.path()));
  const sheet = await z.file('xl/worksheets/sheet1.xml').async('string'), rows = (sheet.match(/<row /g) || []).length;
  expect(rows).toBe(shown + 1);                                            // the header and one row per review
  const strings = await z.file('xl/sharedStrings.xml').async('string');
  for (const id of await page.evaluate(() => EV.slice(0, 3).map(e => String(e.id)))) expect(strings).toContain(id);
  for (const h of ['Lead ID', 'Agent', 'Total Score (%)', 'Status', 'Completed']) expect(strings, h + ' in English').toContain(h);
  expect(strings).not.toMatch(/[А-я]{4}/);                               // nothing of the Bulgarian screen
  await page.evaluate(() => setLang('en'));
  expect(errors).toEqual([]);
  await ctx.close();
});

// Gabriela's decision (28 October): under 760 px (a phone) the app asks people to use the Q-SMART mobile app (coming later);
// a tablet (768 px) shows the pages with the compact menu
test('phone width (390 px) shows the "use the mobile app" screen; tablet width (768 px) shows the agent pages with no sideways scrolling', async ({ browser }) => {
  const ph = await personPage(browser, 'f.c2', { viewport: { width: 390, height: 844 } });
  await expect(ph.page.getByText('Use the Q-SMART mobile app')).toBeVisible();
  await ph.page.evaluate(() => setLang('bg'));
  await expect(ph.page.getByText('Използвайте мобилното приложение Q-SMART')).toBeVisible();
  await ph.page.evaluate(() => setLang('en'));
  expect(await ph.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await ph.ctx.close();
  const { page, ctx, errors } = await personPage(browser, 'f.c2', { viewport: { width: 768, height: 1024 } });
  for (const p of ['dash', 'calls', 'att', 'leave', 'tasks', 'kb', 'cap']) {
    await go(page, p);
    await expect(page.getByText('Use the Q-SMART mobile app')).toBeHidden();
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(over, p + ' is wider than the tablet by ' + over + ' px').toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
  await ctx.close();
});

test('dark mode and light mode switch the colours and are remembered', async ({ browser }) => {
  const { page, ctx, errors } = await personPage(browser, 'f.tr2');
  await page.evaluate(() => th('dark'));
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.reload(); await page.waitForFunction(() => typeof ME !== 'undefined' && ME);
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  await page.evaluate(() => th('light'));
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe(darkBg);
  await page.evaluate(() => th('system'));
  expect(errors).toEqual([]);
  await ctx.close();
});

// task templates (29 October, ideas from the team's other tool): steps as rows (title, description, minutes, ↑ ↓, + Add step),
// a category, ten colours (White = none), ready-made templates; a task made from a template keeps its colour and category
test('a task template: ready-made, steps as rows, category and colour; the task made from it keeps them', async ({ browser }) => {
  const a = await personPage(browser, 'f.admin', { viewport: { width: 1366, height: 900 } });
  await go(a.page, 'tasks'); await a.page.evaluate(() => { TV.tab = 'tpl'; TV.lib = 'tpl'; render(); });
  await expect(a.page.getByRole('heading', { name: 'Ready-made templates' })).toBeVisible();
  await a.page.locator('.tktc button.pb', { hasText: 'Add' }).first().click();
  await expect(a.page.locator('.fst .fsr')).toHaveCount(11);
  await a.page.getByRole('button', { name: '+ Add step' }).click(); await expect(a.page.locator('.fst .fsr')).toHaveCount(12);
  const last = a.page.locator('.fst .fsr').last();
  await last.getByLabel('Step title').fill('Write the day report'); await last.getByLabel('Description').fill('Two lines are enough'); await last.getByLabel('Minutes').fill('15');
  await last.getByRole('button', { name: 'Move up' }).click();
  await expect(a.page.locator('.fst .fsr').nth(10).getByLabel('Step title')).toHaveValue('Write the day report');
  await a.page.getByRole('button', { name: 'Colour Teal' }).click();
  await a.page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect.poll(async () => (await api(a.page, '/api/task-templates')).json.length).toBeGreaterThan(0);
  const t = (await api(a.page, '/api/task-templates')).json.find(x => x.title === 'Daily morning routine');
  expect([t.category, t.color, t.checklist.length, t.checklist[10]]).toEqual(['Daily', '#14b8a6', 12, { t: 'Write the day report', min: 15, d: 'Two lines are enough' }]);
  // a task from it: the colour and the category come along, and the card shows the category
  await a.page.evaluate(id => useTpl(id), t.id);
  await expect(a.page.locator('.sw button[aria-pressed=true]')).toHaveAttribute('title', 'Teal');   // the New task form starts with the template's colour
  const made = await api(a.page, '/api/tasks', { title: 'From the template', type: 'task', priority: 'med', color: '#14b8a6', category: 'Daily', checklist: [{ t: 'One', d: 'first', min: 5 }], assignees: ['f.b1'] }, 'POST');
  expect(made.status).toBe(200);
  const task = (await api(a.page, '/api/tasks')).json.find(x => x.title === 'From the template');
  expect([task.color, task.category, task.checklist[0].d]).toEqual(['#14b8a6', 'Daily', 'first']);
  expect(a.errors).toEqual([]); await a.ctx.close();
});
