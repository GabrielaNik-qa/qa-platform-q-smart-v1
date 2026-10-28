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

test('screen-reader names follow the language too (the check boxes of Notification rules in Bulgarian and French)', async ({ browser }) => {
  const { page, ctx, errors } = await personPage(browser, 'f.admin');
  await page.evaluate(() => setLang('bg')); await go(page, 'notifs');
  const bg = await page.locator('table input[type=checkbox]').first().getAttribute('aria-label');
  expect(bg).toMatch(/[А-я]/); expect(bg).toContain('Администратор');
  await page.evaluate(() => setLang('fr')); await go(page, 'perms');
  expect(await page.locator('table input[type=checkbox]').first().getAttribute('aria-label')).toContain('Administrateur');
  await page.evaluate(() => setLang('en'));
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
