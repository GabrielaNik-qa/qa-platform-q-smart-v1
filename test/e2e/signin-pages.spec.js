// Sign-in for every role through the real form, the language switch, and every page of every role opened in the browser
// with no error. Forbidden and odd addresses never show a page the role may not have.
const { test, expect } = require('@playwright/test');
const { personPage, signIn, go, api } = require('./helpers');

const PEOPLE = { admin: 'f.admin', qa: 'f.qa1', lead: 'f.lead1', trainer: 'f.tr1', agent: 'f.b1' };

test('a wrong password shows a clear message; a deactivated person cannot sign in', async ({ browser }) => {
  const { page, ctx } = await personPage(browser, null);
  await page.locator('#lu').fill('f.b1'); await page.locator('#lp').fill('wrong'); await page.locator('button.sbtn').click();
  await expect(page.locator('#lge')).toContainText('Wrong username/email or password');
  await page.locator('#lu').fill('f.gone'); await page.locator('#lp').fill('password'); await page.locator('button.sbtn').click();
  await expect(page.locator('#lge')).toContainText('deactivated');
  await ctx.close();
});

for (const [role, who] of Object.entries(PEOPLE)) {
  test(`${role}: signs in, opens every page allowed with no error, and is kept out of the others`, async ({ browser }) => {
    const { page, ctx, errors } = await personPage(browser, who);
    expect(await page.evaluate(() => ME.role)).toBe(role);
    const pages = await page.evaluate(() => Object.keys(PG).filter(p => canRoute(p))), all = await page.evaluate(() => Object.keys(PG));
    expect(pages.length).toBeGreaterThan(role === 'agent' ? 15 : 35);
    for (const p of pages) {
      await go(page, p);
      const text = (await page.locator('main, #app, body').first().innerText()).trim();
      expect(text.length, p + ' has content').toBeGreaterThan(40);
    }
    for (const p of [...all.filter(p => !pages.includes(p)), 'constructor', '__proto__', 'toString']) {
      await page.evaluate(r => { location.hash = '#' + r; }, p);
      await page.waitForFunction(r => route !== r || !Object.keys(PG).includes(r), p);
      expect(await page.evaluate(() => route === 'dash' || !Object.keys(PG).includes(route) || canRoute(route)), p + ' is not shown').toBe(true);
    }
    expect(errors, 'no error on any page').toEqual([]);
    await ctx.close();
  });
}

test('the fonts come from the app itself: titles in Barlow Condensed, text in Barlow, Bulgarian letters in Fira Sans, nothing asked from Google', async ({ browser }) => {
  const { page, ctx, errors } = await personPage(browser, 'f.qa1');
  await go(page, 'dash');
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => ({ title: document.fonts.check('700 30px "Barlow Condensed"'), text: document.fonts.check('400 15px Barlow', 'Quality'),
    files: performance.getEntriesByType('resource').filter(e => /\.woff2/.test(e.name)).map(e => new URL(e.name).origin + new URL(e.name).pathname) }));
  expect(r.title, 'Barlow Condensed is loaded').toBe(true); expect(r.text, 'Barlow is loaded').toBe(true);
  expect(r.files.length).toBeGreaterThan(0);
  for (const f of r.files) expect(f.startsWith(process.env.E2E_BASE + '/fonts/'), f).toBe(true);
  await page.evaluate(() => setLang('bg')); await go(page, 'calls');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('400 15px "Fira Sans"', 'Оценки')), 'the Cyrillic letters of Fira Sans are loaded').toBe(true);
  await page.evaluate(() => setLang('en'));
  expect(errors, 'no error, and no request to another site').toEqual([]);
  await ctx.close();
});

test('screen-reader names follow the language too (the check boxes of Notification rules in Bulgarian and French)', async ({ browser }) => {
  const { page, ctx, errors } = await personPage(browser, 'f.admin');
  await page.evaluate(() => setLang('bg')); await go(page, 'notifs');
  const bg = await page.locator('table input[type=checkbox]').first().getAttribute('aria-label');
  expect(bg).toMatch(/[А-я]/); expect(bg).toContain('Администратор');
  await page.evaluate(() => setLang('fr')); await go(page, 'perms');
  expect(await page.locator('table input[type=checkbox]').first().getAttribute('aria-label')).toContain('Administrateur');
  // a text box: its name and its example follow the language, what people typed in it never changes ("Yes" stays "Yes")
  expect((await api(page, '/api/org', { words: { types: ['Yes', 'Reactivation'], topics: [], vocab: [] } }, 'PUT')).status).toBe(200);
  await page.reload(); await page.waitForFunction(() => typeof ME !== 'undefined' && ME);
  await page.evaluate(() => setLang('bg')); await go(page, 'words');
  const box = page.locator('#wd-types');
  expect(await box.getAttribute('aria-label')).toBe('Видове разговори');
  expect(await page.locator('#wd-topics').getAttribute('placeholder')).toBe('Конкуренти | марка А, марка Б, друг сайт');
  expect(await box.inputValue()).toBe('Yes\nReactivation');
  await page.evaluate(() => setLang('en'));
  expect(await box.getAttribute('aria-label')).toBe('Call types');
  expect(errors).toEqual([]);
  await ctx.close();
});

test('the language: chosen on the sign-in screen, saved with the account, the same after signing out and in again', async ({ browser }) => {
  const { page, ctx, errors } = await personPage(browser, null, { lang: 'Български' });
  await signIn(page, 'f.c1');
  await expect(page.locator('body')).toContainText('Табло за качество');          // "Quality Dashboard"
  await expect(page.locator('body')).toContainText('Начало');                     // "Home" in the menu
  expect(await page.evaluate(() => I18N.lang)).toBe('bg');
  expect((await api(page, '/api/me')).json.prefs.lang).toBe('bg');
  await page.evaluate(() => out()); await expect(page.locator('#lu')).toBeVisible();
  await page.getByRole('button', { name: 'English', exact: true }).click();      // somebody else could pick English on this computer…
  await signIn(page, 'f.c1');
  expect(await page.evaluate(() => I18N.lang), '…the account keeps Bulgarian').toBe('bg');
  await page.evaluate(() => setLang('fr'));
  await expect(page.locator('body')).toContainText('Tableau de bord qualité');
  expect((await api(page, '/api/me')).json.prefs.lang).toBe('fr');
  await page.evaluate(() => setLang('en'));
  expect(errors).toEqual([]);
  await ctx.close();
});
