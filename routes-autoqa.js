// Auto QA: conversations (transcripts) rated automatically by the Auto QA categories.
const ai = require('./ai');
const { scoreConv } = require('./autoqa');
module.exports = ({ app, load, save, need, bad, hex, iso, str, userBy, scopeOf }) => {
  const EDIT = ['admin', 'qa'], DAY = /^\d{4}-\d{2}-\d{2}$/;
  const visible = (db, u) => { const s = scopeOf(db, u); return db.conversations.filter(c => { if (u.role === 'agent') return c.agent === u.username; const us = userBy(db, c.agent); return !s || s.teams.has(us ? us.team : ''); }); };
  app.get('/api/autoqa', need(), (req, res) => { const db = load(); res.json({ cats: db.autoCats, conversations: visible(db, req.session.user), ai: ai.enabled() }); });
  app.post('/api/autoqa/conversations', need(...EDIT), (req, res) => {
    const db = load(), b = req.body || {}, text = str(b.text, 30000);
    const ag = userBy(db, str(b.agent, 40)); if (!ag || ag.role !== 'agent') return bad(res, 'Choose the agent');
    if (!text) return bad(res, 'Paste the conversation'); if (!DAY.test(b.date || '')) return bad(res, 'Choose the date');
    const c = { id: 'cv' + hex(4), agent: ag.username, agn: ag.name, date: b.date, text, rid: str(b.rid, 40), auto: scoreConv(text, db.autoCats.filter(x => x.enabled !== false)), by: req.session.user.name, created: iso() };
    db.conversations.unshift(c); save(db); res.json(c);
  });
  app.post('/api/autoqa/run', need(...EDIT), async (req, res) => {                // (re)rate every conversation with the current categories
    const db = load(), mode = (req.body || {}).mode === 'ai' ? 'ai' : 'rules', cats = db.autoCats.filter(x => x.enabled !== false);
    try {
      let n = 0;
      for (const c of db.conversations) { if (mode === 'ai' && n >= 40) break; c.auto = mode === 'ai' ? await ai.scoreConversation(c.text, cats) : scoreConv(c.text, cats); n++; }
      save(db); res.json({ ok: 1, count: n, mode });
    } catch (e) { bad(res, e.message); }
  });
  app.put('/api/autoqa/conversations/:id/edit', need(...EDIT), (req, res) => {    // a reviewer corrects one Auto QA score ("modified")
    const db = load(), c = db.conversations.find(x => x.id === req.params.id), b = req.body || {}; if (!c) return res.status(404).json({ error: 'not found' });
    if (!db.autoCats.some(x => x.id === b.cat)) return bad(res, 'Unknown category'); const s = Number(b.score); if (!(s >= 0 && s <= 100)) return bad(res, 'The score must be between 0 and 100');
    c.edits = c.edits || {}; if (b.clear) delete c.edits[b.cat]; else c.edits[b.cat] = Math.round(s); c.editedBy = req.session.user.name; save(db); res.json(c);
  });
  app.put('/api/autoqa/conversations/:id/link', need(...EDIT), (req, res) => {    // connect the conversation to a manual review (used for the accuracy score)
    const db = load(), c = db.conversations.find(x => x.id === req.params.id), rid = str((req.body || {}).rid, 40); if (!c) return res.status(404).json({ error: 'not found' });
    if (rid && !db.evaluations.some(e => e.rid === rid)) return bad(res, 'No such review'); c.rid = rid; save(db); res.json(c);
  });
  app.delete('/api/autoqa/conversations/:id', need(...EDIT), (req, res) => { const db = load(); db.conversations = db.conversations.filter(c => c.id !== req.params.id); save(db); res.json({ ok: 1 }); });
};
