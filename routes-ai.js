// AI and voice settings (Admin › Integrations): the Claude API key, the model, the monthly budget, and the voice keys for later.
// Keys are kept encrypted (AES-256-GCM). The encryption key lives in its own file next to the data (".qsmart-key", or
// $env:KEY_SECRET), so data.json and its backups never hold a usable API key. A key is never sent back to the browser:
// the page only sees whether it is set and its last 4 characters.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ai = require('./ai');

module.exports = ({ FILE, app, load, save, need, bad, newEval, scopeOf, limited, hex, iso, str }) => {
  const KEYFILE = path.join(path.dirname(path.resolve(FILE)), '.qsmart-key');
  const MASTER = (() => {
    if (process.env.KEY_SECRET) return crypto.createHash('sha256').update(process.env.KEY_SECRET).digest();
    try { const k = Buffer.from(fs.readFileSync(KEYFILE, 'utf8').trim(), 'hex'); if (k.length === 32) return k; } catch (e) { /* first start: made below */ }
    const k = crypto.randomBytes(32); try { fs.writeFileSync(KEYFILE, k.toString('hex'), { mode: 0o600 }); } catch (e) { /* read-only folder: keys must be typed again after a restart */ }
    return k;
  })();
  const seal = s => { const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', MASTER, iv), e = Buffer.concat([c.update(String(s), 'utf8'), c.final()]); return 'v1:' + Buffer.concat([iv, c.getAuthTag(), e]).toString('base64'); };
  const unseal = s => { if (!s || !String(s).startsWith('v1:')) return ''; try { const b = Buffer.from(String(s).slice(3), 'base64'), d = crypto.createDecipheriv('aes-256-gcm', MASTER, b.subarray(0, 12)); d.setAuthTag(b.subarray(12, 28)); return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8'); } catch (e) { return ''; } };

  const MODELS = [['claude-opus-5-5', 'Claude Opus 5.5 — best quality'], ['claude-sonnet-5-5', 'Claude Sonnet 5.5 — balanced'], ['claude-haiku-5-5', 'Claude Haiku 5.5 — fastest and cheapest']];
  const VOICES = ['browser', 'elevenlabs', 'openai'], KEYS = { anthropic: 'key', elevenlabs: 'elevenKey', openai: 'openaiKey' };
  const month = () => new Date().toISOString().slice(0, 7);
  const conf = db => (db.settings || {}).ai || {};
  // what the AI cost this month, in its own small file: a request that saves the data after an AI call can never wipe it out
  const UFILE = path.join(path.dirname(path.resolve(FILE)), 'ai-usage.json');
  const usage = () => { try { const u = JSON.parse(fs.readFileSync(UFILE, 'utf8')); if (u.month === month()) return u; } catch (e) { /* nothing spent yet */ } return { month: month(), usd: 0, calls: 0 }; };
  const addUse = usd => { const u = usage(); try { fs.writeFileSync(UFILE, JSON.stringify({ month: u.month, usd: Math.round((u.usd + usd) * 1e6) / 1e6, calls: u.calls + 1 })); } catch (e) { /* not fatal */ } };
  // the AI module asks for its settings at every request (a change in Admin › Integrations works at once) and reports what it spent
  ai.setConfig(() => {
    const db = load(), c = conf(db);
    return { key: unseal(c.key) || process.env.ANTHROPIC_API_KEY || '', model: MODELS.some(m => m[0] === c.model) ? c.model : (process.env.ANTHROPIC_MODEL || 'claude-opus-5-5'), budget: Number(c.budget) || 0, used: usage().usd };
  }, addUse);

  const show = db => {
    const c = conf(db), k = n => { const v = unseal(c[KEYS[n]]); return { set: !!v, last4: v ? v.slice(-4) : '', env: !v && n === 'anthropic' && !!process.env.ANTHROPIC_API_KEY }; };
    return { model: ai.MODEL(), models: MODELS.map(([id, name]) => ({ id, name, price: ai.PRICE[id] })), budget: Number(c.budget) || 0, usage: usage(),
      playbook: c.playbook || '', voice: VOICES.includes(c.voice) ? c.voice : 'browser', elevenVoice: c.elevenVoice || '', keys: { anthropic: k('anthropic'), elevenlabs: k('elevenlabs'), openai: k('openai') }, enabled: ai.enabled() };
  };
  app.get('/api/ai/settings', need('admin'), (req, res) => res.json(show(load())));
  // { model, budget, voice, elevenVoice, anthropicKey, elevenKey, openaiKey } — a key: text to set it, "" to remove it, left out to keep it
  app.put('/api/ai/settings', need('admin'), (req, res) => {
    const b = req.body || {}, db = load(), c = { ...conf(db) };
    if (b.model !== undefined) { if (!MODELS.some(m => m[0] === b.model)) return bad(res, 'Choose one of the models in the list'); c.model = b.model; }
    if (b.budget !== undefined) { const n = Number(b.budget); if (!Number.isFinite(n) || n < 0 || n > 100000) return bad(res, 'The budget must be a number from 0 (no limit) to 100000'); c.budget = Math.round(n * 100) / 100; }
    if (b.voice !== undefined) { if (!VOICES.includes(b.voice)) return bad(res, 'Unknown voice provider'); c.voice = b.voice; }
    if (b.playbook !== undefined) c.playbook = str(b.playbook, 4000);   // the company's rules the AI team follows
    if (b.elevenVoice !== undefined) c.elevenVoice = String(b.elevenVoice || '').trim().slice(0, 80);
    for (const [field, slot] of [['anthropicKey', 'key'], ['elevenKey', 'elevenKey'], ['openaiKey', 'openaiKey']]) {
      if (b[field] === undefined) continue;
      const v = typeof b[field] === 'string' ? b[field].trim() : null;
      if (v === null || (v && (v.length < 20 || v.length > 300 || /\s/.test(v)))) return bad(res, 'That key does not look right: paste the whole key, without spaces');
      if (v) c[slot] = seal(v); else delete c[slot];
    }
    db.settings = db.settings || {}; db.settings.ai = c; save(db); res.json(show(db));
  });
  // checks the key and the model with a tiny request (a fraction of a cent)
  app.post('/api/ai/test', need('admin'), async (req, res) => {
    if (!ai.enabled()) return bad(res, 'Add the Claude API key first');
    try { res.json(await ai.ping()); } catch (e) { bad(res, e.message); }
  });

  // ---- AI QA reviewer: drafts on the company scorecard; a person approves them (maybe after changing answers) or rejects them.
  // Approving makes a normal review (the agent is told, it counts everywhere) and keeps how much the person agreed with the AI.
  const { build } = require('./scorecard'), QA = ['admin', 'qa'];
  const mineD = (db, u) => { const s = scopeOf(db, u); return (db.aiDrafts || []).filter(d => { if (!s) return true; const au = db.users.find(x => x.username === d.agent); return !!au && s.teams.has(au.team); }); };
  const simOf = (aiA, fin) => { let n = 0, same = 0; const cats = aiA.map((row, ci) => { let cn = 0, cs = 0; row.forEach((x, ii) => { n++; cn++; if (((fin[ci] || [])[ii] || [])[0] === x[0]) { same++; cs++; } }); return cn ? Math.round(cs / cn * 1000) / 10 : null; }); return { items: n ? Math.round(same / n * 1000) / 10 : null, n, cats }; };
  app.get('/api/ai/drafts', need(...QA), (req, res) => res.json(mineD(load(), req.session.user).slice(0, 300)));
  app.post('/api/ai/drafts', need(...QA), async (req, res) => {
    const b = req.body || {}; let db = load(), text = str(b.tx, 40000), agent = b.agent, date = b.dt, conv = null;
    if (b.conv !== undefined) { conv = (db.conversations || []).find(c => c.id === b.conv); if (!conv) return res.status(404).json({ error: 'not found' }); text = conv.text; agent = conv.agent; date = conv.date; }
    const s = scopeOf(db, req.session.user), sc = db.scorecards.find(x => x.id === b.scid), au = db.users.find(x => x.username === agent && x.role === 'agent' && x.active !== false);
    if (!sc || (s && !s.sc.has(sc.id))) return bad(res, 'Choose a scorecard');
    if (!au || (s && !s.teams.has(au.team))) return bad(res, 'Choose an agent');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return bad(res, 'Choose the date');
    const lead = str(b.id, 60) || (conv ? conv.id : ''); if (!lead) return bad(res, 'Enter the lead ID');
    if (String(text || '').trim().length < 40) return bad(res, 'Paste the transcript (at least a few lines)');
    if (!ai.enabled()) return bad(res, 'Connect the AI (Admin › Integrations) to draft reviews with AI.');
    if (limited('ai-draft:' + req.session.user.username, 40, 36e5)) return res.status(429).json({ error: 'Too many AI drafts in one hour. Try again later.' });
    let r, prev; try { r = await ai.reviewDraft({ text, sc, playbook: conf(db).playbook }); prev = build(sc, r.a); } catch (e) { return bad(res, e.message || 'The AI answer did not fit the scorecard. Try again.'); }
    db = load();                                                                 // a fresh copy: the AI took a while to answer
    const d = { id: 'd' + hex(5), agent: au.username, agn: au.name, lead, ch: ['call', 'chat', 'email', 'other'].includes(b.ch) ? b.ch : 'call', dt: date, scid: sc.id, scn: sc.name, tx: text, conv: conv ? conv.id : '',
      a: r.a, cm: r.comment, conf: r.confidence, sc: prev.sc, model: ai.MODEL(), at: iso(), by: req.session.user.username, status: 'draft' };
    db.aiDrafts = [d, ...(db.aiDrafts || [])].slice(0, 500); save(db); res.json(d);
  });
  app.post('/api/ai/drafts/:id/approve', need(...QA), (req, res) => {
    const db = load(), b = req.body || {}, d = mineD(db, req.session.user).find(x => x.id === req.params.id);
    if (!d) return res.status(404).json({ error: 'not found' });
    if (d.status !== 'draft') return bad(res, 'This draft was already decided');
    const r = newEval(db, req.session.user, { scid: d.scid, agent: d.agent, id: d.lead, dt: d.dt, ch: d.ch, a: b.a !== undefined ? b.a : d.a, cm: b.cm !== undefined ? str(b.cm, 1000) : d.cm, tx: d.tx });
    if (r.err) return bad(res, r.err);
    const sim = simOf(d.a, r.ev.cs.map(c => c.it.map(i => [i.a])));
    r.ev.ai = { draft: d.id, model: d.model, aiSc: d.sc, sim: sim.items };
    Object.assign(d, { status: 'approved', rid: r.ev.rid, fsc: r.ev.sc, sim, decided: iso(), dby: req.session.user.username });
    if (d.conv) { const c = (db.conversations || []).find(x => x.id === d.conv); if (c && !c.rid) c.rid = r.ev.rid; }   // AutoQA can compare with this review too
    save(db); res.json({ draft: d, ev: r.ev });
  });
  app.post('/api/ai/drafts/:id/reject', need(...QA), (req, res) => {
    const db = load(), d = mineD(db, req.session.user).find(x => x.id === req.params.id);
    if (!d) return res.status(404).json({ error: 'not found' });
    if (d.status !== 'draft') return bad(res, 'This draft was already decided');
    Object.assign(d, { status: 'rejected', why: str((req.body || {}).why, 300), decided: iso(), dby: req.session.user.username }); save(db); res.json(d);
  });
};
