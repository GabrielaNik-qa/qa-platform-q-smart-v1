// The Markdown renderer must never let an article inject HTML or scripts, and every file must at least compile.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), vm = require('vm');
const { md } = require('../public/js/md.js');

test('HTML in an article is shown as text, never run', () => {
  const out = md('<script>alert(1)</script>\n<img src=x onerror=alert(1)>');
  assert.ok(!out.includes('<script>') && !out.includes('<img'));
  assert.ok(out.includes('&#60;script&#62;'));
});
test('only http(s) links become links', () => {
  assert.ok(!md('[x](javascript:alert(1))').includes('<a '));
  assert.ok(md('[site](https://example.com)').includes('<a href="https://example.com" target="_blank" rel="noopener">site</a>'));
});
test('a link cannot break out of its href', () => {
  const out = md('[x](https://a.com/"onmouseover="alert(1))');
  assert.ok(!/href="[^"]*"onmouseover=/.test(out));
});
test('headings, lists and code blocks', () => {
  assert.equal(md('## Title'), '<h2>Title</h2>');
  assert.equal(md('- a\n- b'), '<ul>\n<li>a</li>\n<li>b</li>\n</ul>');
  assert.ok(md('```\n<b>\n```').includes('&#60;b&#62;'));
});

const ROOT = path.join(__dirname, '..');
const jsFiles = dir => fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.js')).map(f => path.join(dir, f));
test('every JavaScript file compiles', () => {
  for (const f of [...jsFiles('.'), ...jsFiles('public/js'), ...jsFiles('test')]) {
    assert.doesNotThrow(() => new vm.Script(fs.readFileSync(path.join(ROOT, f), 'utf8'), { filename: f }), f);
  }
});
test('the page loads every script and the stylesheet that exist', () => {
  const html = fs.readFileSync(path.join(ROOT, 'public/index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="((?:js|css)\/[^"?]+)/g)].map(m => m[1]);
  assert.ok(refs.includes('css/app.css') && refs.includes('js/prefs.js'));
  for (const r of refs) assert.ok(fs.existsSync(path.join(ROOT, 'public', r)), r);
  for (const f of jsFiles('public/js')) assert.ok(refs.includes('js/' + path.basename(f)), 'not loaded by the page: ' + f);
});
