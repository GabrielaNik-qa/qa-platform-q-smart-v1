// AI and voice settings (Admin › Integrations): the Claude API key, the model, the monthly budget, and the voice keys for later.
// Keys are kept encrypted (AES-256-GCM). The encryption key lives in its own file next to the data (".qsmart-key", or
// $env:KEY_SECRET), so data.json and its backups never hold a usable API key. A key is never sent back to the browser:
// the page only sees whether it is set and its last 4 characters.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ai = require('./ai');

module.exports = ({ FILE, app, load, save, need, bad }) => {
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
      voice: VOICES.includes(c.voice) ? c.voice : 'browser', elevenVoice: c.elevenVoice || '', keys: { anthropic: k('anthropic'), elevenlabs: k('elevenlabs'), openai: k('openai') }, enabled: ai.enabled() };
  };
  app.get('/api/ai/settings', need('admin'), (req, res) => res.json(show(load())));
  // { model, budget, voice, elevenVoice, anthropicKey, elevenKey, openaiKey } — a key: text to set it, "" to remove it, left out to keep it
  app.put('/api/ai/settings', need('admin'), (req, res) => {
    const b = req.body || {}, db = load(), c = { ...conf(db) };
    if (b.model !== undefined) { if (!MODELS.some(m => m[0] === b.model)) return bad(res, 'Choose one of the models in the list'); c.model = b.model; }
    if (b.budget !== undefined) { const n = Number(b.budget); if (!Number.isFinite(n) || n < 0 || n > 100000) return bad(res, 'The budget must be a number from 0 (no limit) to 100000'); c.budget = Math.round(n * 100) / 100; }
    if (b.voice !== undefined) { if (!VOICES.includes(b.voice)) return bad(res, 'Unknown voice provider'); c.voice = b.voice; }
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
};
