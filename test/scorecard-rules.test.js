// The scoring rules of a review, written down as tests. They describe how the app scores TODAY - change them only when the rules change on purpose.
const test = require('node:test'), assert = require('node:assert');
const { build, DEFAULT_SC } = require('../scorecard');

// a small scorecard: 2 categories, 100 points
const SC = { cats: [
  { n: 'A', it: [{ t: 'a1', p: 30 }, { t: 'a2', p: 20, k: true }] },   // a2 = critical item
  { n: 'B', k: true, it: [{ t: 'b1', p: 40 }, { t: 'b2', p: 10 }] }    // B = critical category
] };
const ans = (a, b) => [a.map(x => [x]), b.map(x => [x])];

test('the default scorecard has 100 points', () => {
  assert.strictEqual(DEFAULT_SC.cats.reduce((s, c) => s + c.it.reduce((x, i) => x + i.p, 0), 0), 100);
});
test('all Yes = 100%, a plain No loses only its points', () => {
  assert.strictEqual(build(SC, ans(['y', 'y'], ['y', 'y'])).sc, 100);
  assert.strictEqual(build(SC, ans(['n', 'y'], ['y', 'y'])).sc, 70);
});
test('N/A items are left out of the possible points', () => {
  const r = build(SC, ans(['na', 'y'], ['y', 'y']));          // 70 of 70 possible
  assert.strictEqual(r.sc, 100);
  assert.strictEqual(r.cs[0].m, 20);
  assert.strictEqual(build(SC, ans(['na', 'y'], ['y', 'n'])).sc, 0, 'a No in the critical category still zeroes the review');
});
test('score is rounded to one decimal', () => {
  const sc = { cats: [{ n: 'X', it: [{ t: '1', p: 1 }, { t: '2', p: 2 }] }] };
  assert.strictEqual(build(sc, [[['y'], ['n']]]).sc, 33.3);
});
test('critical item answered No: its category scores 0 points, the rest still counts', () => {
  const r = build(SC, ans(['y', 'n'], ['y', 'y']));
  assert.strictEqual(r.cs[0].e, 0);
  assert.strictEqual(r.cs[0].z, 1);
  assert.strictEqual(r.sc, 50);                                  // 50 of 100
  assert.strictEqual(r.zero, false);
});
test('critical category with any No: the whole review is 0%', () => {
  const r = build(SC, ans(['y', 'y'], ['y', 'n']));
  assert.strictEqual(r.sc, 0);
  assert.strictEqual(r.zero, true);
  assert.ok(r.cs.every(c => c.e === 0 && c.z === 1));
});
test('root causes are kept only for No answers; comments are cut at 300 characters', () => {
  const r = build(SC, [[['n', 'c'.repeat(400), 'Knowledge gap'], ['y', '', 'Ignored']], [['y'], ['y']]]);
  assert.strictEqual(r.cs[0].it[0].rc, 'Knowledge gap');
  assert.strictEqual(r.cs[0].it[1].rc, '');
  assert.strictEqual(r.cs[0].it[0].cm.length, 300);
});
test('answers that do not match the scorecard are rejected', () => {
  assert.throws(() => build(SC, [[['y']]]));
  assert.throws(() => build(SC, ans(['y'], ['y', 'y'])));
  assert.throws(() => build(SC, 'nope'));
});
// The two rules below are how the app behaves today. They are open questions for the owner (see the audit report) - NOT confirmed business rules.
test('CURRENT BEHAVIOUR: a missing or unknown answer is counted as Yes', () => {
  assert.strictEqual(build(SC, [[[], ['maybe']], [[], []]]).sc, 100);
});
test('CURRENT BEHAVIOUR: a review where everything is N/A scores 0%', () => {
  assert.strictEqual(build(SC, ans(['na', 'na'], ['na', 'na'])).sc, 0);
});
