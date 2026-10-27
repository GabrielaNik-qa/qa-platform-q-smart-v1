const express = require('express'), session = require('express-session');
const bcrypt = require('bcryptjs'), fs = require('fs'), path = require('path');
const crypto = require('crypto'), nodemailer = require('nodemailer'), ExcelJS = require('exceljs');
const { DEFAULT_SC, build } = require('./scorecard');
const { ensureBootstrap, uname, ADMIN_TEAM } = require('./bootstrap');
const wfm = require('./wf');                                    // workforce rules: work calendars, shifts, the rota

const FILE = process.env.DATA_FILE ? path.resolve(process.env.DATA_FILE) : path.join(__dirname, 'data.json');   // <- this file IS the database (DATA_FILE = use another copy, e.g. for the tests)
const DEFAULT_PASSWORD = 'password';                       // every user created in the app starts with this and must change it at first login
const ROLES = ['admin', 'qa', 'lead', 'trainer', 'agent'];
const STAFF = ['admin', 'qa', 'lead', 'trainer'];          // everyone who is not an agent
const FLAGS = ['', 'green', 'red'];
const LEGACY = ['Greeting & Introduction', 'Vocabulary & Professionalism', 'Empathy & Active Listening', 'Documentation & Reasoning',
  'Persuasion & Objection Handling', 'Process Adherence', 'Closing & Positive Outcome'];
const hex = n => crypto.randomBytes(n).toString('hex');
const iso = () => new Date().toISOString();

// ------------------------------------------------------------------ database
function save(db) {                                       // write a copy first, then swap it in: a crash half-way never leaves a broken data.json
  const s = JSON.stringify(db, null, 2), tmp = FILE + '.tmp';
  try { fs.writeFileSync(tmp, s); fs.renameSync(tmp, FILE); }
  catch (e) { fs.writeFileSync(FILE, s); try { fs.unlinkSync(tmp); } catch (x) { /* nothing left to clean */ } }   // e.g. OneDrive briefly locks the file
}
function load() {
  if (!fs.existsSync(FILE)) require('./seed').restore();      // a new folder starts with the data saved in seed.js
  const db = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : { users: [], evaluations: [] };
  let dirty = false;
  if (!Array.isArray(db.scorecards) || !db.scorecards.length) db.scorecards = [DEFAULT_SC];
  for (const k of ['notifications', 'registrations', 'tasks', 'taskTpl', 'sessions', 'calibrations', 'kbFolders', 'kbArticles', 'newsletters', 'quizzes', 'attempts', 'simulations', 'qflags'])
    if (!Array.isArray(db[k])) db[k] = [];
  if (!db.kbReads) db.kbReads = {};
  if (!db.settings) db.settings = { pass: 85, teams: {} };
  if (!db.oldTeams) db.oldTeams = {};
  db.evaluations.forEach(e => {
    if (!e.cs && Array.isArray(e.c)) {   // records from earlier versions: a percent per category, no item answers
      if (e.c.length === 6) {
        e.c = [e.c[0], e.c[2], Math.round(e.c.reduce((x, y) => x + y) / 6), e.c[3], e.c[4], e.c[1], e.c[5]];
        e.sc = Math.round(e.c.reduce((x, y) => x + y) / 7);
      }
      e.cs = LEGACY.map((n, k) => ({ n, e: e.c[k], m: 100, it: [] })); e.scn = 'Imported';
    }
    delete e.c;
    e.fl = e.fl === true ? 'red' : (e.fl || '');
    if (!e.rid) { e.rid = 'r' + hex(6); dirty = true; }
    if (typeof e.id !== 'string') e.id = String(e.id);
    if (e.seen === undefined) e.seen = null;
  });
  if (ensureBootstrap(db)) dirty = true;
  if (dirty) save(db);
  return db;
}
const link = v => /^https?:\/\//i.test(String(v || '')) ? String(v).slice(0, 300) : '';
// a review is about one kind of conversation; old reviews without a type are calls
const CHANNELS = ['call', 'chat', 'email', 'other'], CHN = { call: 'call', chat: 'chat', email: 'email', other: 'conversation' };
const chOf = v => CHANNELS.includes(v) ? v : 'call';
// the extra fields of chats, emails and other conversations (a call keeps its recording link and file)
const chFields = (b, ch) => ch === 'call' ? { cl: '', tx: '', subj: '', chn: '' } : { cl: link(b.cl), tx: str(b.tx, 20000), subj: ch === 'email' ? str(b.subj, 200) : '', chn: ch === 'other' ? str(b.chn, 40) : '' };
const bad = (res, msg) => res.status(400).json({ error: msg });
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const list = (v, n = 20, m = 40) => (Array.isArray(v) ? v : String(v || '').split(',')).map(x => str(x, m)).filter(Boolean).slice(0, n);

// ------------------------------------------------------------------ email, notifications, limits
const BASE = process.env.PUBLIC_URL || 'http://localhost:' + (process.env.PORT || 3000);
const mailer = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }) : null;
async function mail(to, subject, text, key, vars = {}, html) {
  if (!to) return;
  const t = key && ((load().settings || {}).mailtpl || {})[key], fill = s => String(s).replace(/\{(\w+)\}/g, (m, k) => vars[k] != null ? vars[k] : m);
  if (t && (t.subject || t.body)) { if (t.subject) subject = fill(t.subject); if (t.body) text = fill(t.body); }
  try {
    if (mailer) { await mailer.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text, ...(html ? { html } : {}) }); console.log('Email sent to ' + to + ': ' + subject); }
    else console.log('[no SMTP configured] Email to ' + to + ' - ' + subject + '\n' + text + '\n');
  } catch (e) { console.error('Mail failed:', e.message); }
}
function notify(db, to, type, text, extra = {}) {
  const u = db.users.find(x => x.username === to); if (u && (((db.settings || {}).notifOff || {})[type] || []).includes(u.role)) return;
  db.notifications.unshift({ id: 'n' + hex(5), to, type, text, at: iso(), read: false, ...extra });
  if (db.notifications.length > 5000) db.notifications.length = 5000;
}
const staffUsers = db => db.users.filter(u => u.role === 'admin' || u.role === 'qa');
const userBy = (db, username) => db.users.find(u => u.username === username);
const hits = {};
function limited(key, max, ms) {
  const now = Date.now(); hits[key] = (hits[key] || []).filter(t => now - t < ms);
  if (hits[key].length >= max) return true;
  hits[key].push(now);
  if (Object.keys(hits).length > 5000) for (const k in hits) if (!hits[k].some(t => now - t < 36e5)) delete hits[k];   // forget old visitors so the list cannot grow forever
  return false;
}
const recent = (key, ms) => (hits[key] || []).filter(t => Date.now() - t < ms).length;   // how many times, without counting this one
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const pwBad = p => {
  p = String(p || '');
  if (p.length < 6) return 'The password must be at least 6 characters';
  if (!/[a-z]/.test(p) || !/[A-Z]/.test(p)) return 'Use both uppercase and lowercase letters';
  if (!/\d/.test(p)) return 'Include at least one number';
  if (!/[^A-Za-z0-9]/.test(p)) return 'Include at least one special character';
  return '';
};
// first letter of the first name + "." + last name, lowercase, no accents or spaces
const plain = t => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const makeUsername = (first, last) => plain(first).slice(0, 1) + '.' + plain(last);
// first and last name come as two fields; the full name is always "First Last" (older callers may still send only a full name)
const nameParts = b => {
  let f = str(b.firstName, 40), l = str(b.lastName, 40);
  if (!f && !l) { const p = str(b.name, 80).split(/\s+/); f = p[0] || ''; l = p.slice(1).join(' '); }
  return { firstName: f, lastName: l, name: (f + ' ' + l).trim() };
};
const validEmail = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
// pop-up preferences of one person: tips they switched off and whether routine confirmations are asked (errors and safeguards are never stored here)
const PREF_ID = /^[a-z][a-z0-9.-]{1,39}$/;
const LANGS = ['en', 'bg', 'fr'];
const cleanPrefs = p => {
  p = p && typeof p === 'object' ? p : {};
  const off = {};
  Object.entries(p.off && typeof p.off === 'object' && !Array.isArray(p.off) ? p.off : {}).slice(0, 100).forEach(([k, v]) => { if (PREF_ID.test(k)) off[k] = String(v || '').slice(0, 30); });
  const out = { info: p.info !== false, confirm: p.confirm !== false, off };
  if (LANGS.includes(p.lang)) out.lang = p.lang;                  // the language of the app (My account > Language); nothing saved = English
  // the columns each person shows in a table, in their order: { calls: ['id', 'ag', 'sc'] } (short lowercase keys only)
  const cols = {};
  Object.entries(p.cols && typeof p.cols === 'object' && !Array.isArray(p.cols) ? p.cols : {}).slice(0, 20).forEach(([k, v]) => {
    if (/^[a-z]{1,20}$/.test(k) && Array.isArray(v)) cols[k] = [...new Set(v.filter(c => typeof c === 'string' && /^[a-z]{1,12}$/.test(c)))].slice(0, 30);
  });
  if (Object.keys(cols).length) out.cols = cols;
  return out;
};
const pub = u => ({ username: u.username, name: u.name, firstName: u.firstName || '', lastName: u.lastName || '', email: u.email || '', role: u.role, team: u.team || '', title: u.title || '', mustChange: !!u.mustChange, layouts: u.layouts || {}, prefs: cleanPrefs(u.prefs), views: u.views || {},
  empId: u.empId || '', empType: u.empType || 'full', hours: u.hours || 40, manager: u.manager || '', cal: u.cal || '', shift: u.shift || '', pattern: u.pattern || '', birthday: u.birthday || '', showBday: !!u.showBday, ecName: u.ecName || '', ecPhone: u.ecPhone || '', ecRel: u.ecRel || '' });
// skills and languages can only be picked from the catalog (Admin > Skills); unknown names are dropped, spelling is normalised
const pick = (v, catalog) => { const out = []; (Array.isArray(v) ? v : String(v || '').split(',')).forEach(x => { const m = (catalog || []).find(c => c.toLowerCase() === String(x).trim().toLowerCase()); if (m && !out.includes(m)) out.push(m); }); return out; };
const rosterPub = u => ({ username: u.username, name: u.name, role: u.role, team: u.team || '', title: u.title || '', desc: u.desc || '', languages: u.languages || [], skills: u.skills || [], start: u.start || '', active: u.active !== false });

// ------------------------------------------------------------------ app + sessions
const app = express();
// the real visitor IP is read from the tunnel's X-Forwarded-For header only when the request comes from this computer (cloudflared runs here);
// a visitor on the network cannot fake their address to get around the sign-in limits. TRUST_PROXY = another setting, e.g. 1 behind a hosted proxy.
const TP = process.env.TRUST_PROXY;
app.set('trust proxy', /^\d+$/.test(TP || '') ? Number(TP) : TP === 'true' ? true : TP || 'loopback');
app.disable('x-powered-by');
app.use((req, res, next) => {   // basic browser protections: no framing by other sites (clickjacking), no guessing of file types; data answers are never cached
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN', 'Referrer-Policy': 'same-origin' });
  if (req.path.startsWith('/api/')) res.set('Cache-Control', 'no-store');
  next();
});
app.use((req, res, next) => {   // a change sent by another website (CSRF) is refused, also from a neighbouring site of the same domain; the app itself sends "same-origin"
  const from = req.get('sec-fetch-site');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && from && from !== 'same-origin' && from !== 'none') return res.status(403).json({ error: 'Requests from other websites are not allowed' });
  next();
});
app.use(session({
  secret: process.env.SECRET || hex(32),      // without $env:SECRET a random one is made at every start (sign-ins live in memory and end at a restart anyway)
  resave: false, saveUninitialized: false, rolling: true,
  cookie: { httpOnly: true, sameSite: 'lax', secure: 'auto', maxAge: 12 * 36e5 }   // 'auto': HTTPS-only when opened through HTTPS (the tunnel); signed out after 12 hours without use
}));
// only signed-in staff may send large data (imports, backups); an agent never needs more than a few hundred KB (an Excel file of their own reviews)
const bigJson = express.json({ limit: '25mb' }), midJson = express.json({ limit: '2mb' }), smallJson = express.json({ limit: '100kb' });
app.use((req, res, next) => { const u = req.session && req.session.user; (!u ? smallJson : u.role === 'agent' ? midJson : bigJson)(req, res, next); });
const AUDIT = require('./audit');
app.use(AUDIT.middleware);
// the account as it is saved right now (re-read only when data.json changed), so a deactivated user or a changed role takes effect at once, not at the next login
let UC = { key: null, users: null };
function liveUser(username) {
  let key = ''; try { const s = fs.statSync(FILE); key = s.mtimeMs + ':' + s.size; } catch (e) {}
  if (key !== UC.key || !UC.users) UC = { key, users: new Map(load().users.map(u => [u.username, u])) };
  return UC.users.get(username);
}
// false = the account is gone or deactivated, or its password was changed / reset after this sign-in (the sign-in is ended and 401 is sent)
function refreshSession(req, res) {
  const cur = liveUser(req.session.user.username);
  if (!cur || cur.active === false || (cur.pwv || 0) !== (req.session.pwv || 0)) { req.session.destroy(() => res.status(401).json({ error: 'login required' })); return false; }
  const s = req.session.user;
  if (s.role !== cur.role || s.team !== (cur.team || '') || s.name !== cur.name || s.mustChange !== !!cur.mustChange) req.session.user = pub(cur);
  return true;
}
const authed = (req, res, next) => !req.session.user ? res.status(401).json({ error: 'login required' }) : refreshSession(req, res) && next();
// must be logged in (and have finished the first-login password change) and, optionally, have one of the roles
const need = (...roles) => (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: 'login required' });
  if (!refreshSession(req, res)) return;
  const u = req.session.user;
  if (u.mustChange) return res.status(403).json({ error: 'You must set a new password first', mustChange: true });
  if (roles.length && !roles.includes(u.role)) return res.status(403).json({ error: 'not allowed' });
  next();
};
AUDIT.routes(app, need);
// puts back the data saved in seed.js (same as running "node seed.js"); the current data is kept in data.backup.json
app.post('/api/demo/reset', need('admin'), (req, res) => {
  try { require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'seed.js')], { cwd: __dirname, stdio: 'ignore' }); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: 'The reset failed - run "node seed.js" in the terminal to see why' }); }
});
// what the browser receives of the system settings: e-mail templates and notification rules are only for admins
const setOut = (db, u) => { const s = { ...db.settings, oldTeams: db.oldTeams, wf: wfm.settingsOf(db.settings.wf, wfm.localDay()) }; delete s.ai; if (u.role !== 'admin') { delete s.mailtpl; delete s.notifOff; } return s; };
const ctx = { newEval, FILE, DIR: __dirname, app, load, save, need, authed, bad, hex, iso, str, list, pick, notify, userBy, staffUsers, mail, BASE, ROLES, STAFF, express, ADMIN_TEAM, pub, limited, setOut,
  scopeOf: (db, u) => scopeOf(db, u), seesUser: (db, u, username, team) => seesUser(db, u, username, team) };
// a password version: changing or resetting a password ends the sign-ins made with the old one (see refreshSession)
const newPw = (u, pw) => { u.hash = bcrypt.hashSync(String(pw), 10); u.pwv = (u.pwv || 0) + 1; };
const DUMMY = bcrypt.hashSync(hex(8), 10);   // checked when the account does not exist, so a wrong username takes as long as a wrong password

// ------------------------------------------------------------------ login / account
app.post('/api/login', (req, res) => {
  if (limited('login:' + req.ip, 30, 9e5)) return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
  const { username, password } = req.body || {};
  const id = String(username || '').trim().toLowerCase(), db = load();
  const u = db.users.find(x => x.username === id || (x.email || '').toLowerCase() === id);   // username OR email
  const fail = 'fail:' + (u ? u.username : id);                                               // wrong passwords are also counted per account, whatever the address
  if (recent(fail, 9e5) >= 10) return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
  if (u && u.active !== false && bcrypt.compareSync(String(password || ''), u.hash)) {   // a fresh session id at every sign-in (an id planted before the sign-in is useless)
    delete hits[fail];
    return req.session.regenerate(err => { if (err) return res.status(500).json({ error: 'Could not sign in, try again' }); req.session.user = pub(u); req.session.pwv = u.pwv || 0; res.json(req.session.user); });
  }
  if (!u) bcrypt.compareSync(String(password || ''), DUMMY);
  if (u && u.active === false && bcrypt.compareSync(String(password || ''), u.hash)) return res.status(403).json({ error: 'This account is deactivated. Please contact the administrator.' });
  const r = db.registrations.find(x => (x.username === id || x.email === id) && x.status !== 'approved' && bcrypt.compareSync(String(password || ''), x.hash));
  if (r) return res.status(403).json({ error: r.status === 'pending'
    ? 'Your registration is still pending approval by an administrator.'
    : 'Your registration was declined. Please contact the administrator of the application.' });
  limited(fail, 10, 9e5);
  res.status(401).json({ error: 'Wrong username/email or password' });
});
app.post('/api/logout', (req, res) => req.session.destroy(() => res.json({ ok: 1 })));
app.get('/api/me', authed, (req, res) => {
  const u = load().users.find(x => x.username === req.session.user.username);
  if (!u || u.active === false) return req.session.destroy(() => res.status(401).json({ error: 'login required' }));
  req.session.user = pub(u); res.json(req.session.user);
});
app.put('/api/profile', need(), (req, res) => {
  const db = load(), u = userBy(db, req.session.user.username), b = req.body || {};
  const np = nameParts(b), email = str(b.email, 120).toLowerCase();
  if (!np.firstName) return bad(res, 'Enter your first name');
  if (!np.lastName) return bad(res, 'Enter your last name');
  if (email && !validEmail(email)) return bad(res, 'Enter a valid email address');
  if (email && db.users.some(x => x !== u && (x.email || '').toLowerCase() === email)) return bad(res, 'That email is already used by another account');
  Object.assign(u, np); u.email = email;
  if (b.desc !== undefined) u.desc = str(b.desc, 600);
  if (b.languages !== undefined) u.languages = list(b.languages);
  if (b.skills !== undefined) u.skills = list(b.skills);
  if (b.phone !== undefined) u.phone = str(b.phone, 40);
  if (b.birthday !== undefined) u.birthday = DAY.test(b.birthday || '') ? b.birthday : '';
  if (b.showBday !== undefined) u.showBday = b.showBday === true;
  if (b.ecName !== undefined) u.ecName = str(b.ecName, 80);
  if (b.ecPhone !== undefined) u.ecPhone = str(b.ecPhone, 40);
  if (b.ecRel !== undefined) u.ecRel = str(b.ecRel, 40);
  save(db); req.session.user = pub(u); res.json(req.session.user);
});
// a new password ends the person's other sign-ins (someone else may be using one); the sign-in that changed it stays
app.post('/api/password', need(), (req, res) => {
  const { current, next } = req.body || {};
  const db = load(), u = userBy(db, req.session.user.username), key = 'pw:' + req.session.user.username;
  if (recent(key, 9e5) >= 10) return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });   // the current password cannot be guessed here either
  if (!u || !bcrypt.compareSync(String(current || ''), u.hash)) { limited(key, 10, 9e5); return bad(res, 'Your current password is wrong'); }
  const pe = pwBad(next); if (pe) return bad(res, pe);
  if (bcrypt.compareSync(String(next), u.hash)) return bad(res, 'The new password cannot be the same as your current password');
  delete hits[key]; newPw(u, next); u.mustChange = false; save(db); req.session.pwv = u.pwv; res.json({ ok: 1 });
});
app.post('/api/password/first', authed, (req, res) => {   // the pop-up every new user sees at their first login
  if (!req.session.user.mustChange) return bad(res, 'Your password was already changed');
  const next = (req.body || {}).next, pe = pwBad(next); if (pe) return bad(res, pe);
  const db = load(), u = userBy(db, req.session.user.username);
  if (bcrypt.compareSync(String(next), u.hash)) return bad(res, 'Please choose a different password than the temporary one');
  newPw(u, next); u.mustChange = false; save(db);
  req.session.pwv = u.pwv; req.session.user = pub(u); res.json(req.session.user);
});
// My account > Notifications & Confirmations. Only ever changes the person who is signed in.
//   { info: true|false }      welcome messages and tips on / off       { confirm: true|false }  routine confirmations on / off
//   { dismiss: ['tip.roots'] } "Don't show me this again"               { restore: ['tip.roots'] } show one again
//   { clear: true }            show every dismissed message again        { defaults: true }         everything back to the start
//   { cols: { page: 'calls', keys: ['id', 'ag', 'sc'] } }  the columns shown in a table, in that order (keys: null = the standard columns)
app.put('/api/prefs', need(), (req, res) => {
  const db = load(), u = userBy(db, req.session.user.username), b = req.body || {};
  if (!u) return res.status(401).json({ error: 'login required' });
  const p = b.defaults ? cleanPrefs({ lang: (u.prefs || {}).lang }) : cleanPrefs(u.prefs);   // "Restore default settings" keeps the chosen language
  if (b.lang !== undefined) { if (!LANGS.includes(b.lang)) return bad(res, 'Unknown language'); p.lang = b.lang; }
  if (typeof b.info === 'boolean') p.info = b.info;
  if (typeof b.confirm === 'boolean') p.confirm = b.confirm;
  if (b.clear) p.off = {};
  for (const id of list(b.restore, 30, 40)) delete p.off[id];
  for (const id of list(b.dismiss, 30, 40)) { if (!PREF_ID.test(id)) return bad(res, 'Unknown message'); p.off[id] = iso(); }
  if (Object.keys(p.off).length > 100) return bad(res, 'Too many dismissed messages');
  if (b.cols !== undefined) {                                     // { cols: { page: 'calls', keys: ['id', 'ag'] } } — keys null = the standard columns again
    const c = b.cols || {}, page = String(c.page || '');
    if (!/^[a-z]{1,20}$/.test(page) || (c.keys !== null && !Array.isArray(c.keys))) return bad(res, 'Unknown table');
    const all = { ...(p.cols || {}) }; if (c.keys === null) delete all[page]; else all[page] = c.keys;
    const cols = cleanPrefs({ cols: all }).cols; if (cols) p.cols = cols; else delete p.cols;
  }
  u.prefs = p; save(db); req.session.user = pub(u); res.json(req.session.user);
});

// ------------------------------------------------------------------ registration (needs admin approval)
app.post('/api/register', (req, res) => {
  if (limited('reg:' + req.ip, 6, 36e5)) return res.status(429).json({ error: 'Too many registrations from this connection. Try again later.' });
  const b = req.body || {}, db = load();
  const first = str(b.firstName, 40), last = str(b.lastName, 40), email = str(b.email, 120).toLowerCase();
  if (!first) return bad(res, 'Enter your first name');
  if (!last) return bad(res, 'Enter your last name');
  if (!validEmail(email)) return bad(res, 'Enter a valid email address');
  const name = first + ' ' + last, username = makeUsername(first, last);   // e.g. Gabriela Pencheva -> g.pencheva
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) return bad(res, 'Your first and last name must contain letters or numbers so a username can be made');
  if (db.users.some(u => u.username.toLowerCase() === username) || db.registrations.some(r => r.status === 'pending' && r.username === username))
    return res.status(409).json({ error: 'The username ' + username + ' already exists. Please contact the administrator.' });
  if (db.users.some(u => (u.email || '').toLowerCase() === email) || db.registrations.some(r => r.status === 'pending' && r.email === email))
    return res.status(409).json({ error: 'That email address is already registered' });
  const reg = { id: 'g' + hex(5), username, name, firstName: first, lastName: last, email, hash: bcrypt.hashSync(DEFAULT_PASSWORD, 10), at: iso(), status: 'pending' };
  db.registrations.push(reg);
  db.users.filter(u => u.role === 'admin').forEach(a => notify(db, a.username, 'reg', `${name} (@${username}) has requested access to the platform`, { reg: reg.id }));
  save(db); res.json({ ok: 1 });
  mail(email, 'Your registration is pending approval',
    `Hi ${name},\n\nThank you for registering. Your registration is pending approval by an administrator.\nYou will receive another email as soon as it has been reviewed.\n`);
});
app.get('/api/registrations', need('admin'), (req, res) =>
  res.json(load().registrations.filter(r => r.status === 'pending').map(({ hash, ...r }) => r).reverse()));
app.post('/api/registrations/:id/approve', need('admin'), (req, res) => {
  const db = load(), r = db.registrations.find(x => x.id === req.params.id && x.status === 'pending'), b = req.body || {};
  if (!r) return res.status(404).json({ error: 'not found' });
  if (db.users.some(u => u.username === r.username)) return res.status(409).json({ error: 'That username is already taken' });
  const role = ROLES.includes(b.role) ? b.role : 'agent';
  const team = role === 'agent' ? b.team : ADMIN_TEAM;
  if (!db.teams.some(t => t.id === team && (role !== 'agent' ? true : t.id !== ADMIN_TEAM))) return bad(res, 'Choose the team of this agent first');
  db.users.push({ username: r.username, name: r.name, firstName: r.firstName || nameParts(r).firstName, lastName: r.lastName || nameParts(r).lastName, email: r.email, role, team, title: '', desc: '', languages: [], skills: [], phone: '', start: '', active: true, hash: bcrypt.hashSync(DEFAULT_PASSWORD, 10), mustChange: true });
  if (role !== 'agent' && role !== 'admin' && db.workspaces[0]) db.workspaces[0].staff.push(r.username);
  r.status = 'approved'; r.by = req.session.user.username; r.decided = iso();
  db.notifications = db.notifications.filter(n => !(n.type === 'reg' && n.reg === r.id));
  save(db); res.json({ ok: 1 });
  mail(r.email, 'Your registration has been approved',
    `Hi ${r.name},\n\nGood news - your registration has been approved. You can now log in:\n${BASE}\n\nUsername: ${r.username}\nInitial password: ${DEFAULT_PASSWORD}\n\nYou will be asked to choose a new password the first time you log in.\n`, 'approved', { name: r.name, link: BASE, username: r.username });
});
app.post('/api/registrations/:id/decline', need('admin'), (req, res) => {
  const db = load(), r = db.registrations.find(x => x.id === req.params.id && x.status === 'pending');
  if (!r) return res.status(404).json({ error: 'not found' });
  r.status = 'declined'; r.by = req.session.user.username; r.decided = iso();
  db.notifications = db.notifications.filter(n => !(n.type === 'reg' && n.reg === r.id));
  save(db); res.json({ ok: 1 });
  mail(r.email, 'Your registration was declined',
    `Hi ${r.name},\n\nUnfortunately your registration has been declined. Please contact the administrator of the application if you have any questions.\n`);
});

// ------------------------------------------------------------------ workspace scope: admins see everything, everybody else only their workspace
function scopeOf(db, u) {
  if (u.role === 'admin' || !(db.workspaces || []).length) return null;
  const mine = db.workspaces.filter(w => u.role === 'agent' ? w.teams.includes(u.team) : (w.staff || []).includes(u.username));
  const teams = new Set([ADMIN_TEAM]), sc = new Set();
  if (u.role === 'agent' && u.team) teams.add(u.team);
  mine.forEach(w => { w.teams.forEach(x => teams.add(x)); (w.scorecards || []).forEach(x => sc.add(x)); });
  return { teams, sc };
}
const inScope = (db, u, ev) => { const s = scopeOf(db, u); if (!s) return true; const us = userBy(db, ev.agent); return s.teams.has(us ? us.team : ev.tid); };
// a record about one person (flag, task, session ...) is in this person's workspace; team = the team saved on the record, for people who were deleted
const seesUser = (db, u, username, team) => { const s = scopeOf(db, u); if (!s) return true; const x = userBy(db, username); return s.teams.has(x ? x.team : team || ''); };

// ------------------------------------------------------------------ teams (admin) and the roster everybody can read
app.get('/api/roster', need(), (req, res) => { const db = load(), s = scopeOf(db, req.session.user); res.json(db.users.filter(u => !s || s.teams.has(u.team)).map(rosterPub)); });
app.get('/api/teams', need(), (req, res) => { const db = load(), s = scopeOf(db, req.session.user); res.json(db.teams.filter(t => !s || s.teams.has(t.id))); });
const teamBody = (b, db, cur) => {
  const name = str(b.name, 60); if (!name) throw new Error('Give the team a name');
  if (db.teams.some(t => t !== cur && t.name.toLowerCase() === name.toLowerCase())) throw new Error('A team with this name already exists');
  const lead = str(b.lead, 40), lu = userBy(db, lead);
  if (!lu || lu.active === false || !['lead', 'admin', 'qa', 'trainer'].includes(lu.role)) throw new Error('Every team needs a team lead. Choose one.');
  return { name, desc: str(b.desc, 600), lead, languages: pick(b.languages, db.languages), skills: pick(b.skills, db.skills), region: str(b.region, 80), hours: str(b.hours, 60), channels: list(b.channels), notes: str(b.notes, 1000), color: /^#[0-9a-f]{6}$/i.test(b.color || '') ? b.color : '#2563eb' };
};
app.post('/api/teams', need('admin'), (req, res) => {
  const db = load(), b = req.body || {};
  try {
    const t = { id: 't-' + hex(3), ...teamBody(b, db), created: iso() }; db.teams.push(t);
    const ws = db.workspaces.find(w => w.id === b.workspace) || db.workspaces[0]; if (ws) ws.teams.push(t.id);
    save(db); res.json(t);
  } catch (e) { bad(res, e.message); }
});
app.put('/api/teams/:id', need('admin'), (req, res) => {
  const db = load(), t = db.teams.find(x => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'not found' });
  try { Object.assign(t, teamBody(req.body || {}, db, t)); save(db); res.json(t); } catch (e) { bad(res, e.message); }
});
app.delete('/api/teams/:id', need('admin'), (req, res) => {
  const db = load(), t = db.teams.find(x => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'not found' });
  if (t.system) return bad(res, 'The Administration team is built in and cannot be deleted');
  if (db.users.some(u => u.team === t.id)) return bad(res, 'Move the members of this team to another team first');
  if (db.teams.filter(x => !x.system).length <= 1) return bad(res, 'At least one working team is required');
  db.oldTeams[t.id] = t.name; db.workspaces.forEach(w => { w.teams = w.teams.filter(x => x !== t.id); });
  db.teams = db.teams.filter(x => x !== t); delete db.settings.teams[t.id]; save(db); res.json({ ok: 1 });
});

// ------------------------------------------------------------------ users (admin)
app.get('/api/users', need('admin'), (req, res) => { const db = load(); res.json(db.users.map(({ hash, reset, pwv, ...u }) => ({ ...u, workspaces: u.role === 'agent' ? db.workspaces.filter(w => w.teams.includes(u.team)).map(w => w.id) : db.workspaces.filter(w => (w.staff || []).includes(u.username)).map(w => w.id) }))); });
const userBody = (b, db, cur) => {
  const np = nameParts(b); if (!np.firstName) throw new Error('Enter the first name'); if (!np.lastName) throw new Error('Enter the last name');
  const email = str(b.email, 120).toLowerCase();
  if (email && !validEmail(email)) throw new Error('Enter a valid email address');
  if (email && db.users.some(u => u !== cur && (u.email || '').toLowerCase() === email)) throw new Error('That email is already used by another account');
  const role = ROLES.includes(b.role) ? b.role : (cur ? cur.role : 'agent');
  let team = b.team === undefined ? (cur ? cur.team : '') : b.team;
  if (role !== 'agent') team = ADMIN_TEAM;                                   // admins, QA, team leads and trainers always sit in the Administration team
  else if (!db.teams.some(t => t.id === team && t.id !== ADMIN_TEAM)) throw new Error('Choose a team. Every agent must belong to a team.');
  const start = /^\d{4}-\d{2}-\d{2}$/.test(b.start || '') ? b.start : '';
  return { ...np, email, role, team, title: str(b.title, 80), desc: str(b.desc, 600), languages: pick(b.languages, db.languages), skills: pick(b.skills, db.skills), phone: str(b.phone, 40), start, active: b.active === undefined ? (cur ? cur.active !== false : true) : !!b.active, ...empBody(b, db, cur, np.name) };
};
// employment (Workforce): employee ID, type and hours, reporting manager, work calendar, usual shift or repeating pattern,
// status and leaving date, and the private details (birthday, emergency contact) only admins and the person see
const EMPTYPES = ['full', 'part', 'contract', 'intern'], EMPSTATUS = ['active', 'leave', 'left'];
const empBody = (b, db, cur, name) => {
  const W = wfm.settingsOf(db.settings.wf, wfm.localDay()), has = (l, id) => typeof id === 'string' && l.some(x => x.id === id), d = v => DAY.test(typeof v === 'string' ? v : '') ? v : '';
  const empId = str(b.empId, 30), manager = str(b.manager, 40), hours = Number(b.hours), status = EMPSTATUS.includes(b.empStatus) ? b.empStatus : 'active', pattern = has(W.patterns, b.pattern) ? b.pattern : '';
  if (empId && db.users.some(u => u !== cur && u.empId === empId)) throw new Error('That employee ID is already used by ' + db.users.find(u => u !== cur && u.empId === empId).name);
  if (manager && (manager === (cur && cur.username) || !db.users.some(u => u.username === manager && u.role !== 'agent'))) throw new Error('Choose the reporting manager from the list');
  return { empId, empType: EMPTYPES.includes(b.empType) ? b.empType : 'full', hours: b.hours !== '' && b.hours !== null && Number.isFinite(hours) && hours >= 1 && hours <= 60 ? Math.round(hours * 2) / 2 : 40,
    manager, cal: has(W.calendars, b.cal) ? b.cal : '', location: str(b.location, 80), shift: has(W.shifts, b.shift) ? b.shift : '', pattern, patStart: pattern ? d(b.patStart) || wfm.localDay() : '',
    empStatus: status, exitDate: status === 'left' ? d(b.exitDate) || wfm.localDay() : '', exitReason: status === 'left' ? str(b.exitReason, 200) : '',
    birthday: d(b.birthday), ecName: str(b.ecName, 80), ecPhone: str(b.ecPhone, 40), ecRel: str(b.ecRel, 40) };
};
const setStaffWs = (db, username, role, ids) => {                          // staff belong to workspaces explicitly, agents through their team
  db.workspaces.forEach(w => { w.staff = (w.staff || []).filter(x => x !== username); });
  if (role === 'agent' || role === 'admin') return;
  const want = (Array.isArray(ids) ? ids : []).filter(id => db.workspaces.some(w => w.id === id)); if (!want.length && db.workspaces[0]) want.push(db.workspaces[0].id);
  want.forEach(id => db.workspaces.find(w => w.id === id).staff.push(username));
};
const leadsTeam = (db, username) => db.teams.find(t => t.lead === username);
app.post('/api/users', need('admin'), (req, res) => {
  const db = load(), b = req.body || {};
  try {
    let username = str(b.username, 30).toLowerCase() || uname(nameParts(b).name);
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) throw new Error('Username: 3-30 characters, letters, numbers, dots, dashes or underscores');
    if (db.users.some(u => u.username === username)) { if (b.username) throw new Error('That username already exists'); let n = 2; while (db.users.some(u => u.username === username + n)) n++; username += n; }
    const u = { username, ...userBody(b, db), hash: bcrypt.hashSync(DEFAULT_PASSWORD, 10), mustChange: true, teamHistory: [] };
    db.users.push(u); setStaffWs(db, username, u.role, b.workspaces); save(db); res.json({ ok: 1, username });
    mail(u.email, 'Your account has been created', `Hi ${u.name},\n\nAn account was created for you.\n\nAddress: ${BASE}\nUsername: ${username}\nTemporary password: ${DEFAULT_PASSWORD}\n\nYou will be asked to choose a new password the first time you log in.\n`, 'account', { name: u.name, link: BASE, username, password: DEFAULT_PASSWORD });
  } catch (e) { bad(res, e.message); }
});
app.put('/api/users/:username', need('admin'), (req, res) => {
  const db = load(), u = userBy(db, req.params.username), b = req.body || {};
  if (!u) return res.status(404).json({ error: 'not found' });
  try {
    const nb = userBody({ ...u, ...b }, db, u);
    if (u.role === 'admin' && nb.role !== 'admin' && db.users.filter(x => x.role === 'admin' && x.active !== false).length < 2) throw new Error('There must be at least one admin');
    if (u.username === req.session.user.username && nb.active === false) throw new Error('You cannot deactivate your own account');
    const lt = leadsTeam(db, u.username);
    if (lt && (nb.active === false || nb.role === 'agent')) throw new Error(`${u.name} is the team lead of ${lt.name}. Choose another team lead for it first.`);
    if (nb.team !== (u.team || '')) { (u.teamHistory = u.teamHistory || []).push({ from: u.team || '', to: nb.team, at: iso(), by: req.session.user.name }); }
    Object.assign(u, nb); setStaffWs(db, u.username, u.role, b.workspaces !== undefined ? b.workspaces : db.workspaces.filter(w => (w.staff || []).includes(u.username)).map(w => w.id)); save(db);
    if (req.session.user.username === u.username) req.session.user = pub(u);
    res.json({ ok: 1 });
  } catch (e) { bad(res, e.message); }
});
app.delete('/api/users/:username', need('admin'), (req, res) => {
  const db = load(), u = userBy(db, req.params.username);
  if (!u) return res.status(404).json({ error: 'not found' });
  if (u.username === req.session.user.username) return bad(res, 'You cannot delete your own account');
  if (u.role === 'admin' && db.users.filter(x => x.role === 'admin').length < 2) return bad(res, 'There must be at least one admin');
  const lt = leadsTeam(db, u.username); if (lt) return bad(res, `${u.name} is the team lead of ${lt.name}. Choose another team lead for it first.`);
  db.users = db.users.filter(x => x !== u); db.workspaces.forEach(w => { w.staff = (w.staff || []).filter(x => x !== u.username); });
  db.notifications = db.notifications.filter(n => n.to !== u.username);
  save(db); res.json({ ok: 1 });
});
app.post('/api/users/:username/reset', need('admin'), (req, res) => {   // the person is signed out everywhere and chooses a new password at the next sign-in
  const db = load(), u = userBy(db, req.params.username);
  if (!u) return res.status(404).json({ error: 'not found' });
  newPw(u, DEFAULT_PASSWORD); u.mustChange = true; save(db); res.json({ ok: 1 });
});

// ------------------------------------------------------------------ dashboard layouts: every role has a default view (set by admins), everybody can personalise their own
// a page name is a short simple word (dash, autoqa): never a name every JavaScript object already has (__proto__, constructor ...),
// which would change the server for everybody; and at most 20 pages with their own layout or views, so the data file cannot be filled up
const okPage = p => /^[a-z][a-z0-9]{0,19}$/.test(p) && !(p in Object.prototype);
const roomFor = (o, page) => Object.hasOwn(o, page) || Object.keys(o).length < 20;
app.put('/api/layout', need(), (req, res) => {                                  // my own layout of one page
  const db = load(), u = userBy(db, req.session.user.username), items = cleanLayout((req.body || {}).items), page = str((req.body || {}).page, 20);
  if (!okPage(page) || !items) return bad(res, 'Bad layout');
  u.layouts = u.layouts || {};
  if ((req.body || {}).reset) delete u.layouts[page]; else { if (!roomFor(u.layouts, page)) return bad(res, 'Too many pages'); u.layouts[page] = items; }
  save(db); req.session.user = pub(u); res.json(req.session.user);
});
app.put('/api/layouts/:role', need('admin'), (req, res) => {                    // the default view of a role
  const db = load(), items = cleanLayout((req.body || {}).items), page = str((req.body || {}).page, 20);
  if (!ROLES.includes(req.params.role) || !okPage(page) || !items) return bad(res, 'Bad layout');
  db.settings.layouts = db.settings.layouts || {}; if (!roomFor(db.settings.layouts, page)) return bad(res, 'Too many pages');
  db.settings.layouts[page] = db.settings.layouts[page] || {};
  if ((req.body || {}).reset) delete db.settings.layouts[page][req.params.role]; else db.settings.layouts[page][req.params.role] = items;
  save(db); res.json(setOut(db, req.session.user));
});
// a widget on a page: k = its own key (the same widget can be added twice), id = the kind of widget, size and height, an own title and own filters (review type, team, period).
// Keys and ids go inside onclick="..." on the page, so they keep only letters, numbers, - and _ (a shared view must not be able to carry code to other people)
const safeId = (v, n) => str(v, n).replace(/[^\w-]/g, '');
// a widget is as wide as any number of the 60 columns (old layouts used 3 … 12) and as high as its content, or a height in px chosen by dragging
const wSize = s => { s = Math.round(Number(s)); return s >= 1 && s <= 60 ? s : 30; }, wHigh = h => { h = Math.round(Number(h)); return h >= 90 ? Math.min(h, 1400) : undefined; };
const cleanLayout = a => Array.isArray(a) && a.length <= 80 ? a.filter(x => x && typeof x === 'object').map(x => ({ k: safeId(x.k, 40) || undefined, id: safeId(x.id, 30), size: wSize(x.size), h: wHigh(x.h), on: x.on !== false, ar: x.ar === true || undefined, title: str(x.title, 60) || undefined,
  f: x.f && typeof x.f === 'object' ? { c: CHANNELS.includes(x.f.c) ? x.f.c : '', t: safeId(x.f.t, 40), p: safeId(x.f.p, 10) } : undefined })).filter(x => x.id) : null;
// named dashboard views: personal ones (everybody) and shared ones (admins and QA) that are shown to chosen roles or to everyone
const cleanViews = (a, shared) => Array.isArray(a) && a.length <= 20 ? a.filter(v => v && typeof v === 'object').map(v => ({ id: safeId(v.id, 20) || 'v' + hex(4), name: str(v.name, 40) || 'My view', items: cleanLayout(v.items) || [], ...(shared ? { roles: list(v.roles, 6, 10).filter(r => r === 'all' || ROLES.includes(r)), by: str(v.by, 60) } : {}) })) : null;
app.put('/api/views', need(), (req, res) => {
  const db = load(), u = userBy(db, req.session.user.username), page = str((req.body || {}).page, 20), views = cleanViews((req.body || {}).views);
  if (!okPage(page) || !views) return bad(res, 'Bad views');
  u.views = u.views || {}; if (!roomFor(u.views, page)) return bad(res, 'Too many pages');
  u.views[page] = views; save(db); req.session.user = pub(u); res.json(req.session.user);
});
app.put('/api/shared-views', need('admin', 'qa'), (req, res) => {
  const db = load(), page = str((req.body || {}).page, 20), views = cleanViews((req.body || {}).views, true);
  if (!okPage(page) || !views) return bad(res, 'Bad views');
  db.settings.views = db.settings.views || {}; if (!roomFor(db.settings.views, page)) return bad(res, 'Too many pages');
  db.settings.views[page] = views; save(db); res.json(setOut(db, req.session.user));
});

// ------------------------------------------------------------------ system settings (pass rate thresholds)
app.get('/api/settings', need(), (req, res) => res.json(setOut(load(), req.session.user)));
app.put('/api/settings', need('admin'), (req, res) => {
  const b = req.body || {}, db = load(), pass = Number(b.pass);
  if (!(pass >= 1 && pass <= 100)) return bad(res, 'The pass rate must be between 1 and 100');
  const teams = {};
  for (const [k, v] of Object.entries(b.teams || {})) {
    if (v === null || v === '') continue;
    const n = Number(v);
    if (!db.teams.some(t => t.id === k) || !(n >= 1 && n <= 100)) return bad(res, 'Each team pass rate must be between 1 and 100');
    teams[k] = n;
  }
  db.settings = { ...db.settings, pass, teams }; save(db); res.json(setOut(db, req.session.user));
});

// ------------------------------------------------------------------ notifications (each user only sees their own)
app.get('/api/notifications', need(), (req, res) =>
  res.json(load().notifications.filter(n => n.to === req.session.user.username).slice(0, 200)));
app.post('/api/notifications/read', need(), (req, res) => {
  const db = load(); db.notifications.forEach(n => { if (n.to === req.session.user.username) n.read = true; });
  save(db); res.json({ ok: 1 });
});
app.delete('/api/notifications/:id', need(), (req, res) => {
  const db = load(), n = db.notifications.find(x => x.id === req.params.id && x.to === req.session.user.username);
  if (!n) return res.status(404).json({ error: 'not found' });
  db.notifications = db.notifications.filter(x => x !== n); save(db); res.json({ ok: 1 });
});

// "show me how notifications look": creates one example of every kind for the person who asks
app.post('/api/notifications/sample', need(), (req, res) => {
  if (limited('sample:' + req.session.user.username, 3, 36e5)) return res.status(429).json({ error: 'You have already created example notifications. Try again later.' });   // the list of all notifications is capped, so it must not be flooded
  const db = load(), u = req.session.user, ev = db.evaluations.find(e => canSee(u, e) && inScope(db, u, e)) || {}, id = ev.id || '4312345', rid = ev.rid;
  const S = [['review', `You received a new call review for Lead #${id} (score 92%)`, { rid, lead: id }], ['dispute', `Alex Example has disputed the review for Lead #${id}`, { rid, lead: id }], ['msg', `Alex Example wrote in the dispute for Lead #${id}: "Could we listen to the call again?"`, { rid, lead: id }],
    ['resolved', `Your dispute for Lead #${id} was resolved: score kept`, { rid, lead: id }], ['remind', `Reminder: please open your call review for Lead #${id}`, { rid, lead: id }], ['task', 'New mission: Listen to 3 recorded calls (due ' + new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10) + ')', {}],
    ['taskdone', 'Alex Example completed: Update your CRM notes', {}], ['quiz', 'New quiz: Weekly quiz (due Friday)', {}], ['news', 'Newsletter: Monthly update', {}], ['cal', 'Lena Hart invited you to the calibration "Monthly calibration"', {}], ['reg', 'Sam Newcomer (@s.newcomer) has requested access to the platform', {}]];
  S.forEach(([type, text, extra]) => notify(db, u.username, type, text, { ...extra, sample: true }));
  save(db); res.json({ ok: 1, count: S.length });
});

// ------------------------------------------------------------------ evaluations
const lday = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const evDate = dt => dt === lday(new Date()) ? new Date().toISOString() : new Date(dt + 'T12:00:00').toISOString();
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const isOwner = (u, ev) => u.role === 'agent' && ev.agent === u.username;
const canSee = (u, ev) => u.role !== 'agent' || isOwner(u, ev);          // agents only see their own reviews
const leadId = v => String(v == null ? '' : v).trim();
const findEv = (db, rid) => db.evaluations.find(e => e.rid === rid);
// a review this person may open or change: the same rule as the list (their own workspace; agents only their own reviews)
const evOf = (db, u, rid) => { const ev = findEv(db, rid); return ev && canSee(u, ev) && inScope(db, u, ev) ? ev : null; };
const agentInScope = (db, u, au) => { const s = scopeOf(db, u); return !s || s.teams.has(au.team); };

// recMissing = the review points to an audio file that is not in the recordings folder (the player would show 0 seconds)
app.get('/api/evaluations', need(), (req, res) => { const db = load(), u = req.session.user; res.json(db.evaluations.filter(e => canSee(u, e) && inScope(db, u, e)).map(e => e.rec && !fs.existsSync(path.join(REC, path.basename(e.rec))) ? { ...e, recMissing: true } : e)); });

// a new review (QA Entry, or an AI draft approved by a person): checks everything, scores it and tells the agent; the caller saves
function newEval(db, user, b) {
  const scope = scopeOf(db, user), sc = db.scorecards.find(s => s.id === b.scid);
  if (!sc || (scope && !scope.sc.has(sc.id))) return { err: 'Choose a scorecard' };
  const au = db.users.find(x => x.username === b.agent && x.role === 'agent' && x.active !== false);
  if (!au || !agentInScope(db, user, au)) return { err: 'Choose an agent' };
  const id = leadId(b.id);
  if (!id || id.length > 60) return { err: 'Enter the lead ID (up to 60 characters)' };
  if (!DAY.test(b.dt || '')) return { err: 'Choose the date' };
  const ch = chOf(b.ch);
  let r; try { r = build(sc, b.a); } catch (err) { return { err: 'The answers do not match the scorecard' }; }
  const ev = {
    rid: 'r' + hex(6), id, agent: au.username, agn: au.name, tid: au.team, d: evDate(b.dt), sc: r.sc, cs: r.cs, scid: sc.id, scn: sc.name, st: 'ok',
    fl: FLAGS.includes(b.fl) ? b.fl : '', cp: str(b.cp, 80), cm: str(b.cm, 1000),
    lk: link(b.lk), rl: ch === 'call' ? link(b.rl) : '', ch, ...chFields(b, ch), rv: user.name, by: user.username, seen: null,
    at: iso(), ...(Number(b.rt) > 0 ? { rt: Math.min(4 * 3600, Math.round(Number(b.rt))) } : {})   // when it was reviewed, and how long QA Entry took (seconds, at most 4 hours)
  };
  db.evaluations.unshift(ev);
  notify(db, au.username, 'review', `You received a new ${CHN[ch]} review for Lead #${id} (score ${r.sc}%)`, { rid: ev.rid, lead: id });
  return { ev };
}
app.post('/api/evaluations', need('admin', 'qa'), (req, res) => { const db = load(), r = newEval(db, req.session.user, req.body || {}); if (r.err) return bad(res, r.err); save(db); res.json(r.ev); });

app.put('/api/evaluations/:rid', need('admin', 'qa'), (req, res) => {
  const db = load(), ev = evOf(db, req.session.user, req.params.rid), b = req.body || {};
  if (!ev) return res.status(404).json({ error: 'not found' });
  const oldSc = ev.sc;
  if (b.a !== undefined) {
    if (!ev.cs.some(c => c.it.length)) return bad(res, 'This older record has no item answers, so its scores cannot be edited');
    try {
      const r = build({ cats: ev.cs.map(c => ({ n: c.n, k: c.k, it: c.it.map(i => ({ t: i.t, p: i.p, k: i.k, cp: i.cp })) })) }, b.a);
      ev.cs = r.cs; ev.sc = r.sc;
    } catch (err) { return bad(res, 'The answers do not match the scorecard'); }
  }
  if (b.id !== undefined) { const id = leadId(b.id); if (!id || id.length > 60) return bad(res, 'Enter the lead ID (up to 60 characters)'); ev.id = id; }
  if (b.agent !== undefined && b.agent !== ev.agent) {
    const au = db.users.find(x => x.username === b.agent && x.role === 'agent');
    if (!au || !agentInScope(db, req.session.user, au)) return bad(res, 'Choose an agent');
    ev.agent = au.username; ev.agn = au.name; ev.tid = au.team;
  }
  if (b.dt !== undefined) {
    if (!DAY.test(b.dt)) return bad(res, 'Choose the date');
    if (lday(new Date(ev.d)) !== b.dt) ev.d = evDate(b.dt);
  }
  if (b.fl !== undefined) ev.fl = FLAGS.includes(b.fl) ? b.fl : '';
  if (b.cp !== undefined) ev.cp = str(b.cp, 80);
  if (b.cm !== undefined) ev.cm = str(b.cm, 1000);
  if (b.lk !== undefined) ev.lk = link(b.lk);
  if (b.rl !== undefined) ev.rl = link(b.rl);
  if (b.ch !== undefined) { ev.ch = chOf(b.ch); Object.assign(ev, chFields(b, ev.ch)); if (ev.ch !== 'call') ev.rl = ''; }
  if (ev.sc !== oldSc) notify(db, ev.agent, 'review', `Your review for Lead #${ev.id} was updated (score ${ev.sc}%)`, { rid: ev.rid, lead: ev.id });
  save(db); res.json(ev);
});

app.delete('/api/evaluations/:rid', need('admin', 'qa'), (req, res) => {
  const db = load(), ev = evOf(db, req.session.user, req.params.rid);
  if (!ev) return res.status(404).json({ error: 'not found' });
  db.evaluations = db.evaluations.filter(e => e !== ev);
  db.notifications = db.notifications.filter(n => n.rid !== ev.rid);
  save(db);
  if (ev.rec) try { fs.unlinkSync(path.join(REC, path.basename(ev.rec))); } catch (e) {}
  res.json({ ok: 1 });
});

app.post('/api/evaluations/:rid/seen', need('agent'), (req, res) => {           // the agent opening the review marks it as seen
  const db = load(), ev = findEv(db, req.params.rid);
  if (!ev || !isOwner(req.session.user, ev)) return res.status(404).json({ error: 'not found' });
  if (!ev.seen) { ev.seen = iso(); save(db); }
  res.json({ seen: ev.seen });
});
app.post('/api/evaluations/:rid/remind', need('admin', 'qa'), (req, res) => {   // QA reminds the agent to open the review
  const db = load(), ev = evOf(db, req.session.user, req.params.rid);
  if (!ev) return res.status(404).json({ error: 'not found' });
  if (ev.seen) return bad(res, 'The agent has already seen this review');
  const u = userBy(db, ev.agent);
  if (!u || u.active === false) return bad(res, 'This agent no longer has an active account, so there is nobody to remind');
  if (ev.rm && Date.now() - new Date(ev.rm) < 6e5) return bad(res, 'A reminder was already sent a moment ago');
  notify(db, u.username, 'remind', `Reminder: please open your call review for Lead #${ev.id}`, { rid: ev.rid, lead: ev.id });
  mail(u.email, 'Reminder: you have a call review waiting', `Hi ${u.name},\n\nPlease open your call review for Lead #${ev.id}:\n${BASE}\n`, 'reminder', { name: u.name, link: BASE, lead: ev.id });
  ev.rm = iso(); save(db); res.json({ ok: 1 });
});

// ---- disputes: the agent disagrees, QA and the agent talk in a thread, QA resolves it
app.post('/api/evaluations/:rid/dispute', need('agent'), (req, res) => {
  const db = load(), ev = findEv(db, req.params.rid), u = req.session.user;
  if (!ev || !isOwner(u, ev)) return res.status(404).json({ error: 'not found' });
  if (ev.dp) return bad(res, 'This review has already been disputed');
  const text = str((req.body || {}).text, 1000);
  if (!text) return bad(res, 'Write the reason for your dispute');
  ev.dp = { status: 'open', at: iso(), msgs: [{ u: u.username, n: u.name, r: 'agent', t: text, at: iso() }] };
  ev.st = 'disputed';
  staffUsers(db).forEach(s => notify(db, s.username, 'dispute', `${u.name} has disputed the review for Lead #${ev.id}`, { rid: ev.rid, lead: ev.id }));
  save(db); res.json(ev);
});
app.post('/api/evaluations/:rid/dispute/msg', need(), (req, res) => {
  const db = load(), u = req.session.user, ev = evOf(db, u, req.params.rid);
  if (!ev || !ev.dp) return res.status(404).json({ error: 'not found' });
  const staff = u.role === 'admin' || u.role === 'qa';
  if (!staff && !isOwner(u, ev)) return res.status(403).json({ error: 'not allowed' });
  if (ev.dp.status !== 'open') return bad(res, 'This dispute is already resolved');
  const text = str((req.body || {}).text, 1000);
  if (!text) return bad(res, 'Write a message first');
  ev.dp.msgs.push({ u: u.username, n: u.name, r: u.role, t: text, at: iso() });
  const to = staff ? [userBy(db, ev.agent)].filter(Boolean) : staffUsers(db);
  to.forEach(x => { if (x.username !== u.username) notify(db, x.username, 'msg', `${u.name} wrote in the dispute for Lead #${ev.id}: "${text.slice(0, 70)}"`, { rid: ev.rid, lead: ev.id }); });
  save(db); res.json(ev);
});
app.post('/api/evaluations/:rid/dispute/resolve', need('admin', 'qa'), (req, res) => {
  const db = load(), u = req.session.user, ev = evOf(db, u, req.params.rid), b = req.body || {};
  if (!ev || !ev.dp) return res.status(404).json({ error: 'not found' });
  if (ev.dp.status !== 'open') return bad(res, 'This dispute is already resolved');
  const outcome = b.outcome === 'changed' ? 'changed' : 'kept', note = str(b.note, 500);
  ev.dp.status = 'resolved'; ev.dp.res = { outcome, note, by: u.name, at: iso() };
  ev.dp.msgs.push({ u: u.username, n: u.name, r: u.role, sys: 1, t: `Dispute resolved - score ${outcome === 'kept' ? 'kept' : 'changed'}${note ? ': ' + note : ''}`, at: iso() });
  ev.st = 'ok';
  notify(db, ev.agent, 'resolved', `Your dispute for Lead #${ev.id} was resolved: score ${outcome === 'kept' ? 'kept' : 'changed'}`, { rid: ev.rid, lead: ev.id });
  save(db); res.json(ev);
});

// ------------------------------------------------------------------ scorecards (everyone reads, only admins change)
const cleanSC = b => {
  const name = str(b.name, 80);
  if (!name) throw new Error('Give the scorecard a name');
  if (!Array.isArray(b.cats) || !b.cats.length || b.cats.length > 20) throw new Error('Add at least one category');
  let total = 0;
  const cats = b.cats.map(c => {
    const n = str(c.n, 80);
    if (!n) throw new Error('Every category needs a name');
    if (!Array.isArray(c.it) || !c.it.length || c.it.length > 30) throw new Error('Category "' + n + '" needs at least one item');
    const it = c.it.map(i => {
      const t = str(i.t, 300), p = Number(i.p);
      if (!t) throw new Error('Every item needs a description');
      if (!Number.isInteger(p) || p < 0 || p > 100) throw new Error('Points must be whole numbers from 0 to 100');
      total += p; return { t, p, k: !!i.k, cp: !!i.cp };
    });
    return { n, k: !!c.k, it };
  });
  if (total !== 100) throw new Error('Total points must equal 100 (currently ' + total + ')');
  // tags: free words (Calls, Chats, B2C, Retention ...) that show what the scorecard is for and filter the list. They never limit which reviews it can score.
  const tags = []; (Array.isArray(b.tags) ? b.tags : String(b.tags || '').split(',')).forEach(t => { t = str(t, 30); if (t && tags.length < 12 && !tags.some(x => x.toLowerCase() === t.toLowerCase())) tags.push(t); });
  const chs = (Array.isArray(b.chs) ? b.chs : []).filter(c => CHANNELS.includes(c));     // older scorecards: the review types they were first made for (kept, shown as tags while they have none)
  return { name, desc: str(b.desc, 200), tags, chs: [...new Set(chs)], cats };
};
app.get('/api/scorecards', need(), (req, res) => { const db = load(), s = scopeOf(db, req.session.user); res.json(db.scorecards.filter(c => !s || s.sc.has(c.id))); });
app.post('/api/scorecards', need('admin'), (req, res) => {
  try { const db = load(), s = cleanSC(req.body || {}); s.id = 'sc-' + hex(4); db.scorecards.push(s); const ws = db.workspaces.find(w => w.id === (req.body || {}).workspace) || db.workspaces[0]; if (ws) ws.scorecards.push(s.id); save(db); res.json(s); } catch (err) { bad(res, err.message); }
});
app.put('/api/scorecards/:id', need('admin'), (req, res) => {
  const db = load(), cur = db.scorecards.find(s => s.id === req.params.id);
  if (!cur) return res.status(404).json({ error: 'not found' });
  try { Object.assign(cur, cleanSC(req.body || {})); save(db); res.json(cur); } catch (err) { bad(res, err.message); }
});
app.delete('/api/scorecards/:id', need('admin'), (req, res) => {
  const db = load();
  if (db.scorecards.length <= 1) return bad(res, 'At least one scorecard is required');
  if (!db.scorecards.some(s => s.id === req.params.id)) return res.status(404).json({ error: 'not found' });
  db.scorecards = db.scorecards.filter(s => s.id !== req.params.id); db.workspaces.forEach(w => { w.scorecards = w.scorecards.filter(x => x !== req.params.id); }); save(db); res.json({ ok: 1 });
});

// ------------------------------------------------------------------ Excel export: the page sends the rows it is showing, we return a real .xlsx file
// only plain text, numbers and yes/no become cells: an object could be turned into a formula or a link inside Excel (spreadsheet injection)
const cellOf = v => typeof v === 'number' ? (Number.isFinite(v) ? v : null) : typeof v === 'boolean' ? v : v == null || typeof v === 'object' ? null : String(v).slice(0, 32000);
// dc = the column that holds the dates (Call Reviews: 1, Quick Flags: 2, reports: none = -1); only a real YYYY-MM-DD value in it becomes an Excel date
app.post('/api/export/call-reviews', need(), async (req, res) => {
  const b = req.body || {}, raw = b.rows, pf = Number(b.pf), pt = Number(b.pt), dc = b.dc === undefined ? 1 : Number(b.dc), name = str(b.name, 30) || 'Call Reviews', u = req.session.user;
  if (!Array.isArray(raw) || !raw.length || raw.length > 20000) return res.status(400).json({ error: 'bad rows' });
  const rows = raw.map(r => (Array.isArray(r) ? r : []).slice(0, 200).map(cellOf));
  if (!b.again && STAFF.includes(u.role)) {   // the Export centre (staff only) keeps a copy, but never a big one inside the data file
    const db = load(), keep = rows.length <= 5001 && JSON.stringify(rows).length <= 2e6; db.exports = Array.isArray(db.exports) ? db.exports : [];
    db.exports.unshift({ id: 'x' + hex(5), name, n: rows.length - 1, pf, pt, dc, by: u.username, byName: u.name, at: iso(), rows: keep ? rows : null }); db.exports = db.exports.slice(0, 200); save(db);
  }
  const wb = new ExcelJS.Workbook(), ws = wb.addWorksheet(name.replace(/[\\/?*[\]:]/g, ' '));
  rows.forEach((r, i) => ws.addRow(r.map((v, j) => (i && j === dc && typeof v === 'string' && DAY.test(v)) ? new Date(v + 'T12:00:00') : v)));
  ws.eachRow((row, n) => row.eachCell((c, j) => {
    c.font = { name: 'Calibri', size: 12, bold: n === 1 };
    if (n > 1 && j - 1 === dc && c.value instanceof Date) c.numFmt = 'mm/dd/yyyy';
    if (n > 1 && j - 1 >= pf && j - 1 <= pt && typeof c.value === 'number') c.numFmt = 'General"%"';
  }));
  const nC = rows[0].length, wide = { 5: 34, [nC - 2]: 30, [nC - 1]: 40, [nC]: 40 };
  ws.columns.forEach((col, i) => { col.width = wide[i + 1] || Math.min(34, Math.max(11, String(rows[0][i]).length + 4)); });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="Export.xlsx"');
  await wb.xlsx.write(res); res.end();
});

// ------------------------------------------------------------------ forgot / reset password (we only email a one-time link, never a password)
app.post('/api/forgot', async (req, res) => {
  const now = Date.now();
  if (limited('forgot:' + req.ip, 5, 9e5)) return res.status(429).json({ error: 'Too many requests, try again later' });
  const id = str((req.body || {}).identifier, 120).toLowerCase();
  const db = load(), u = id && db.users.find(x => x.username === id || (x.email || '').toLowerCase() === id);
  if (u && u.email && limited('forgot-acct:' + u.username, 3, 36e5)) console.log('Reset requested again for ' + u.username + ': no new e-mail (at most 3 per hour)');   // nobody can flood a mailbox
  else if (u && u.email) {
    const token = crypto.randomBytes(32).toString('hex');
    u.reset = { h: sha(token), exp: now + 36e5 }; save(db);          // link is valid for 1 hour
    const url = `${BASE}/?reset=${token}&u=${encodeURIComponent(u.username)}`;
    await mail(u.email, 'Reset your password', `Hi ${u.name},\n\nChoose a new password here (valid for 1 hour):\n${url}\n\nIf you did not ask for this, ignore this email.`, 'reset', { name: u.name, link: url });
  } else console.log('Reset requested, but no account with an email address matched "' + id + '"');
  res.json({ ok: 1 });   // same answer whether or not the account exists
});
app.post('/api/reset', (req, res) => {
  const { username, token, password } = req.body || {};
  const db = load(), u = userBy(db, String(username || '').toLowerCase());
  const ok = u && u.reset && u.reset.exp > Date.now() && typeof token === 'string' &&
    crypto.timingSafeEqual(Buffer.from(sha(token)), Buffer.from(u.reset.h));
  if (!ok) return bad(res, 'This reset link is invalid or has expired');
  const pe = pwBad(password); if (pe) return bad(res, pe);
  if (bcrypt.compareSync(String(password), u.hash)) return bad(res, 'For security, the new password cannot be the same as your current password');
  newPw(u, password); u.mustChange = false; delete u.reset; save(db); res.json({ ok: 1 });   // every sign-in made before the reset ends
});

// ------------------------------------------------------------------ call recordings
// The audio files live in ONE folder outside the project (Documents\Q-smart recordings), so every copy of the project plays the same files.
// Set RECORDINGS_DIR to use another folder (REC_DIR is used by the tests). Files from an old "recordings" folder inside the project are copied there once.
const REC = path.resolve(process.env.REC_DIR || process.env.RECORDINGS_DIR || path.join(require('os').homedir(), 'Documents', 'Q-smart recordings'));
try { fs.mkdirSync(REC, { recursive: true }); const old = path.join(__dirname, 'recordings'); if (!process.env.REC_DIR && fs.existsSync(old)) fs.readdirSync(old).forEach(f => { const t = path.join(REC, f); if (!fs.existsSync(t)) fs.copyFileSync(path.join(old, f), t); }); } catch (e) { console.log('Recordings folder problem:', e.message); }
const EXT = { 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/wave': 'wav',
  'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/aac': 'aac', 'audio/ogg': 'ogg', 'audio/webm': 'webm' };
const EXTS = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'webm'];
app.post('/api/evaluations/:rid/recording', need('admin', 'qa'), express.raw({ type: () => true, limit: '100mb' }), (req, res) => {
  const db = load(), ev = evOf(db, req.session.user, req.params.rid);
  const q = String(req.query.ext || '').toLowerCase(), ext = EXT[String(req.headers['content-type']).split(';')[0]] || (EXTS.includes(q) ? q : '');   // some browsers send no audio type: the file name decides
  if (!ev) return res.status(404).json({ error: 'evaluation not found' });
  if (!ext) return res.status(415).json({ error: 'unsupported audio type' });
  if (!Buffer.isBuffer(req.body) || !req.body.length) return res.status(400).json({ error: 'empty file' });
  fs.mkdirSync(REC, { recursive: true });
  const name = String(ev.rid).replace(/[^\w-]/g, '') + '-' + Date.now() + '.' + ext;   // only letters and numbers: the file always lands in the recordings folder
  fs.writeFileSync(path.join(REC, name), req.body);
  if (ev.rec) fs.rm(path.join(REC, path.basename(ev.rec)), () => {});      // the old file is replaced
  ev.rec = name; save(db); res.json({ rec: name });
});
app.delete('/api/evaluations/:rid/recording', need('admin', 'qa'), (req, res) => {
  const db = load(), ev = evOf(db, req.session.user, req.params.rid);
  if (!ev) return res.status(404).json({ error: 'evaluation not found' });
  if (ev.rec) fs.rm(path.join(REC, path.basename(ev.rec)), () => {});
  ev.rec = ''; save(db); res.json({ ok: 1 });
});
app.get('/api/recordings/:file', need(), (req, res) => {
  const db = load(), f = path.basename(req.params.file), ev = db.evaluations.find(e => e.rec === f);
  if (!ev || !canSee(req.session.user, ev) || !inScope(db, req.session.user, ev)) return res.status(404).json({ error: 'not found' });
  if (!fs.existsSync(path.join(REC, f))) return res.status(404).json({ error: 'The recording file is missing' });
  res.sendFile(path.join(REC, f), { dotfiles: 'allow' });   // the folder path may contain a "." folder (e.g. .claude); the file name itself was checked above
});

// ------------------------------------------------------------------ the other modules
require('./routes-work')(ctx);
require('./routes-more')(ctx);        // reports, planning, performance, compliance & CX, backups, admin settings        // tasks, coaching sessions, calibrations
require('./routes-learning')(ctx);    // knowledge base, quizzes, newsletter, import, ZIP export
require('./routes-setup')(ctx);       // skills, workspaces, categories, root causes, Auto QA categories
require('./routes-autoqa')(ctx);      // Auto QA conversations and scoring
require('./routes-ai')(ctx);          // AI and voice settings: keys (encrypted), model, monthly budget, test
require('./routes-wf')(ctx);          // Workforce: work calendars, shifts and patterns, the rota of every team
const att = require('./routes-att')(ctx);   // Workforce: check-ins, the status of every day, corrections, time off and balances
require('./routes-today')({ ...ctx, att });   // Workforce: Team today, the morning brief, the Bradford score, attendance reports
require('./routes-cap')({ ...ctx, att });     // Workforce: Capacity planning, the fair split of the leads of every campaign among the agents

app.use(express.static(path.join(__dirname, 'public')));
// any error that reaches this point: a short message for the browser (the details, with the folder paths of this computer, only go to the terminal)
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(req.method + ' ' + req.path + ':', err);
  if (res.headersSent) return next(err);
  res.status(status).json({ error: status === 404 ? 'not found' : status === 413 ? 'This is too large' : status < 500 ? 'The request could not be read' : 'Something went wrong on the server' });
});
const PORT = process.env.PORT || 3000;
const srv = app.listen(PORT, () => console.log('Running on http://localhost:' + srv.address().port));   // PORT=0 picks any free port (used by the tests)
