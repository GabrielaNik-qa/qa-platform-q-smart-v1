// ===================== Q-smart front end: core (constants, state, helpers, API) =====================
const ROLE = { admin: 'Admin', qa: 'QA Specialist', lead: 'Team Lead', trainer: 'Trainer', agent: 'Agent' };
const STAFFR = ['admin', 'qa', 'lead', 'trainer'];                 // everybody who is not an agent
// teams and people come from the server (Admin > Teams / Users). An agent is a user with the role "agent" that belongs to a team.
let TEAMS = [], ROSTER = [];
const tn = id => { const t = TEAMS.find(x => x.id === id); return t ? t.name : ((SET.oldTeams || {})[id] || 'No team'); };
const tcol = id => (TEAMS.find(x => x.id === id) || {}).color || '#64748b';
const an = u => { const r = ROSTER.find(x => x.username === u); return r ? r.name : ''; };
const teamOf = u => { const r = ROSTER.find(x => x.username === u); return r ? r.team : ''; };
const AGENTS = () => ROSTER.filter(r => r.role === 'agent' && r.active).sort((a, b) => a.name.localeCompare(b.name));
const agn = e => an(e.agent) || e.agn || e.agent || '—';
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const $ = q => document.querySelector(q), $$ = q => [...document.querySelectorAll(q)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const f = d => d.toLocaleDateString('en-GB'), fdt = d => new Date(d).toLocaleString('en-GB');
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const ds = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const ini = n => String(n || '?').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();

// ---------------------------------------------------------------- state
const EV = [];                                   // call reviews (agents only receive their own)
let ME = null, SCS = [], USR = [], REG = [], NF = [], SET = { pass: 85, teams: {} };
let ERR = '', MSG = '', AUTH = new URLSearchParams(location.search).has('reset') ? 'reset' : '';
let route = location.hash.slice(1) || 'dash';
// dashboard filters (T = team id, '' = all teams)
let P = 'all', T = '', DF = ds(-30), DT = ds(0);
// call reviews filters (FT = team id, FA = agent username, '' = all)
let FC = '';                                     // review type filter of Call Reviews ('' = all types)
let Q = '', FT = '', FA = '', FP = 'month', F1 = ds(-30), F2 = ds(0), FS = '', FSC = null, FF = '', SK = 'd', SD = -1, PS = 10, PN = 1, KQ = false;
// overlays: review popup, notifications, account, system settings, resolve dispute, confirm, player, generic form
let MD = null, NO = false, NU = 0, AC = null, SYS = false, RSV = null, CFM = null, PLY = null, DRF = '', FM = null;
// QA entry form + scorecard editor
let ENT = null, ENT0 = '', EDITID = '', SE = null;
// data of the other sections (loaded when you open them)
let SKL = { skills: [], languages: [], counts: { skills: {}, languages: {} } }, WSP = [], RCS = [], CATLIB = [], ACAT = [], AQC = [], AQI = { ai: false };
let AUD = [], TASKS = [], TPLS = [], SESS = [], CALS = [], KB = { folders: [], articles: [], reads: {}, newsletters: [], attempts: [] }, QZ = [], QATT = [], PROG = [], AIS = { enabled: false };
// misc preferences
let TI = 0, COL = LS.get('qa_col', false), SND = LS.get('qa_sound', 'on') === 'on', SNDS = LS.get('qa_snd_style', 'beep'), VOL = LS.get('qa_vol', 50);
let THM = LS.get('qa_theme', 'system');
let CH = [['c', "Hi, I'm interested, but honestly your price is too high."]];
const RP = ["I need to think about it.", "Your competitor is cheaper.", "Okay, what happens next?"];

// ---------------------------------------------------------------- pass rate thresholds (set in System Settings)
const PASSG = () => +SET.pass || 85;
const PT = tm => { const v = SET.teams && SET.teams[tm]; return (v === undefined || v === null || v === '') ? PASSG() : +v; };
const isPass = e => e.sc >= PT(e.tm);
let THR = null;                                   // a team's own pass rate while a team-specific view is drawn
const gthr = () => THR != null ? THR : PASSG();
const col = v => v >= gthr() ? 'var(--ok)' : v >= 70 ? 'var(--ac)' : v >= 50 ? 'var(--wn)' : 'var(--bad)';
const scol = (v, tm) => { const p = tm == null ? PASSG() : PT(tm); return v >= p ? 'var(--ok)' : v >= Math.min(70, p) ? 'var(--wn)' : 'var(--bad)'; };

// ---------------------------------------------------------------- html helpers
const bar = (v, c = 'var(--ok)') => `<div class=bar><i style="width:${Math.min(100, Math.max(0, v))}%;background:${c}"></i></div>`;
const card = (t, b, x = '') => `<section class="card ${x}">${t ? `<h3>${t}</h3>` : ''}${b}</section>`;
const tbl = (h, rows) => `<div class=sc><table><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table></div>`;
const pill = (t, c = 'ok') => `<span class="pill ${c}">${t}</span>`;
const sp = (v, tm) => { const p = tm == null ? PASSG() : PT(tm); return pill(v + '%', v >= p ? 'ok' : v >= Math.min(70, p) ? 'wn' : 'bad'); };
const head = (t, s, x = '') => `<header class=hd><div><h1>${t}</h1><p class=mu style="margin:4px 0 0">${s}</p></div>${x}</header>`;
const svg = (d, s = 16) => `<svg class=ico width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="url(#lg)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const IC = {
  eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  pen: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>'),
  bin: svg('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>'),
  flag: svg('<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
  dl: svg('<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>'),
  play: svg('<path d="M7 4l13 8-13 8z"/>'),
  ch_call: svg('<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>', 14),
  ch_chat: svg('<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>', 14),
  ch_email: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', 14),
  ch_other: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>', 14),
  link: svg('<path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7"/>'),
  bell: svg('<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>', 18),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', 18),
  moon: svg('<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>', 18),
  mon: svg('<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>', 18),
  vol: svg('<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/>', 18),
  mute: svg('<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/>', 18),
  gear: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>', 18),
  out: svg('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>', 18),
  chev: svg('<path d="M15 6l-6 6 6 6"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'), check: svg('<path d="M5 13l4 4L19 7"/>'), x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  up: svg('<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>'), zip: svg('<path d="M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"/>'), more: svg('<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'),
  grid: svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'), list: svg('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
  // main menu groups
  g_home: svg('<path d="M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2z"/>', 22), g_quality: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>', 22),
  g_sc: svg('<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 13l2 2 4-4"/>', 22), g_analytics: svg('<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>', 22),
  g_coaching: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>', 22), g_learning: svg('<path d="M12 6c-2-1.5-5-2-9-2v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2zM12 6v14"/>', 22),
  g_tools: svg('<path d="M21 7l-5 5-3-3 5-5a5 5 0 00-6 7L3 19l2 2 8-8a5 5 0 008-6z"/>', 22), g_admin: svg('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>', 22)
};
const mark = (id, s) => `<svg width="${s}" height="${s}" viewBox="0 0 34 34" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ecfa6"/><stop offset="1" stop-color="#2f8fe6"/></linearGradient></defs><circle cx="16" cy="16" r="11" fill="none" stroke="url(#${id})" stroke-width="4"/><path d="M22 22l8 8" stroke="url(#${id})" stroke-width="4" stroke-linecap="round"/></svg>`;

// ---------------------------------------------------------------- toast + confirmation pop-up ("Are you sure?")
function toast(msg, err) {
  const t = document.createElement('div'); t.className = 'toast' + (err ? ' err' : ''); t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 3400);
}
// ask('Title', 'Text', onYes, {yes:'Yes, delete', no:'Cancel', danger:true, onNo:fn})
function ask(title, text, fn, o = {}) { CFM = { title, text, fn, yes: o.yes || 'Yes', no: o.no || 'No', danger: o.danger, onNo: o.onNo }; render(); }
function cfY() { const c = CFM; CFM = null; render(); if (c && c.fn) c.fn(); }
function cfN() { const c = CFM; CFM = null; render(); if (c && c.onNo) c.onNo(); }

// ---------------------------------------------------------------- theme, accent colour, sounds
// named themes: accent colour + sidebar colours (light / dark mode is chosen separately)
const THEMES = {
  classic: { n: 'Classic', ac: '#2563eb', sb: '#0b1626', sb2: '#0b1626', d: 'The original blue' },
  ocean: { n: 'Ocean', ac: '#0284c7', sb: '#06243a', sb2: '#0b4a6e', d: 'Deep sea blues' },
  forest: { n: 'Forest', ac: '#15803d', sb: '#0b2216', sb2: '#16472c', d: 'Calm greens' },
  ruby: { n: 'Ruby', ac: '#be123c', sb: '#2a0a14', sb2: '#561227', d: 'Bold crimson' },
  serendipity: { n: 'Serendipity', ac: '#c026d3', sb: '#2a1038', sb2: '#5a1f66', d: 'Pink and purple' },
  sunrise: { n: 'Sunrise', ac: '#ea580c', sb: '#2b1408', sb2: '#5a2c10', d: 'Warm orange' },
  lavender: { n: 'Lavender', ac: '#7c3aed', sb: '#1c1236', sb2: '#3b2670', d: 'Soft violet' },
  mint: { n: 'Mint', ac: '#0d9488', sb: '#062925', sb2: '#0e4f48', d: 'Fresh teal' },
  midnight: { n: 'Midnight', ac: '#6366f1', sb: '#090b1f', sb2: '#1b1f4a', d: 'Indigo night' },
  graphite: { n: 'Graphite', ac: '#475569', sb: '#0f141c', sb2: '#232b38', d: 'Quiet greys' }
};
let THN = LS.get('qa_themename', 'classic');
function applyTheme() {
  const r = document.documentElement, T0 = THEMES[THN] || THEMES.classic;
  if (THM === 'light' || THM === 'dark') r.dataset.theme = THM; else delete r.dataset.theme;
  r.style.setProperty('--ac', T0.ac); r.style.setProperty('--sb', T0.sb); r.style.setProperty('--sb2', T0.sb2);
}
function th(x) { THM = x || 'system'; LS.set('qa_theme', THM); applyTheme(); if (ME) render(); }
function setTheme(k) { THN = k; LS.set('qa_themename', k); applyTheme(); render(); }
function beep(force) {
  if (!SND && !force) return;
  try {
    const A = new (window.AudioContext || window.webkitAudioContext)(), g = A.createGain(); g.connect(A.destination);
    g.gain.value = (VOL / 100) * 0.2;
    const tone = (fr, t0, d, type) => { const o = A.createOscillator(); o.type = type || 'sine'; o.frequency.value = fr; o.connect(g); o.start(A.currentTime + t0); o.stop(A.currentTime + t0 + d); };
    if (SNDS === 'chime') { tone(660, 0, .15); tone(880, .15, .25); }
    else if (SNDS === 'bell') { tone(1046, 0, .5, 'triangle'); tone(1568, 0, .3, 'triangle'); }
    else tone(880, 0, .13);
  } catch (e) {}
}
function tsnd() { SND = !SND; LS.set('qa_sound', SND ? 'on' : 'off'); render(); }

// ---------------------------------------------------------------- API
async function api(u, b, m) {
  const r = await fetch(u, { method: m || (b ? 'POST' : 'GET'), headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined });
  if (r.status === 401 && ME && u !== '/api/login') { ME = null; MSG = 'Your session expired. Please sign in again.'; render(); }
  return r;
}
async function errOf(r, fallback) { const j = await r.json().catch(() => ({})); return j.error || fallback; }

// loads what the page needs (always the core data, plus the data of the section you are in); returns true when something changed
let LASTSIG = '';
async function load() {
  const g = async u => { try { const r = await api(u); return r.ok ? await r.text() : null; } catch (e) { return null; } };
  const adm = ME && ME.role === 'admin', ed = ME && STAFFR.includes(ME.role);
  const want = [['ev', '/api/evaluations'], ['sc', '/api/scorecards'], ['nf', '/api/notifications'], ['set', '/api/settings'], ['tm', '/api/teams'], ['ro', '/api/roster']];
  if (adm) want.push(['us', '/api/users'], ['rg', '/api/registrations']);
  if (route === 'tasks') { want.push(['tk', '/api/tasks']); if (ed) want.push(['tp', '/api/task-templates']); }
  if (route === 'agents') want.push(['se', '/api/sessions'], ['tk', '/api/tasks'], ['sm', '/api/simulations']);
  if (route === 'sim') want.push(['sm', '/api/simulations']);
  if (['coach', 'o2o', 'acad'].includes(route) || (route === 'dash' && ME && ME.role === 'agent')) want.push(['se', '/api/sessions']);
  if (route === 'audit' && adm) want.push(['au', '/api/audit']);
  if (route === 'tasks' || route === 'coach' || route === 'dash') want.push(['tk', '/api/tasks']);
  if (route === 'cal') want.push(['ca', '/api/calibrations']);
  if (['kb', 'news', 'acad', 'coach', 'quiz'].includes(route)) want.push(['kb', '/api/kb']);
  if (route === 'dash' && ME && ME.role === 'agent') want.push(['kb', '/api/kb'], ['qz', '/api/quizzes']);
  if (['quiz', 'acad'].includes(route)) want.push(['qz', '/api/quizzes']);
  if (['kb', 'acad', 'coach'].includes(route) && ed) want.push(['pg', '/api/kb/progress']);
  if (['kb', 'quiz'].includes(route)) want.push(['ai', '/api/ai/status']);
  want.push(['sk', '/api/skills'], ['rc', '/api/root-causes'], ['qf', '/api/qflags']);
  if (['users', 'teams', 'wsp', 'sco', 'skills', 'dash'].includes(route)) want.push(['ws', '/api/workspaces']);
  if (['sco', 'scat'].includes(route)) want.push(['cl', '/api/categories']);
  if (['autoqa', 'aqcats', 'aqlist', 'aqgaps', 'dash'].includes(route)) want.push(['ac', '/api/auto-cats']);
  if (['autoqa', 'aqlist', 'aqgaps'].includes(route)) want.push(['aq', '/api/autoqa']);
  const got = await Promise.all(want.map(w => g(w[1]))), R = {};
  want.forEach((w, k) => { R[w[0]] = got[k]; });
  const sig = got.join('|'), changed = sig !== LASTSIG; LASTSIG = sig;
  if (R.ro) ROSTER = JSON.parse(R.ro);
  if (R.tm) TEAMS = JSON.parse(R.tm);
  if (R.ev) EV.splice(0, EV.length, ...JSON.parse(R.ev).map(x => ({ ...x, d: new Date(x.d), tm: teamOf(x.agent) || x.tid || '', tmh: x.tid || '' })));   // tm = the agent's CURRENT team, tmh = the team at review time
  if (R.sc) SCS = JSON.parse(R.sc);
  if (R.nf) NF = JSON.parse(R.nf);
  if (R.set) SET = JSON.parse(R.set);
  if (R.us) USR = JSON.parse(R.us);
  if (R.rg) REG = JSON.parse(R.rg);
  if (R.tk) TASKS = JSON.parse(R.tk);
  if (R.tp) TPLS = JSON.parse(R.tp);
  if (R.se) SESS = JSON.parse(R.se);
  if (R.sm) SIMS = JSON.parse(R.sm);
  if (R.qf) QF = JSON.parse(R.qf);
  if (R.au) AUD = JSON.parse(R.au);
  if (R.ca) CALS = JSON.parse(R.ca);
  if (R.kb) KB = JSON.parse(R.kb);
  if (R.qz) { const q = JSON.parse(R.qz); QZ = q.quizzes; QATT = q.attempts; }
  if (R.pg) PROG = JSON.parse(R.pg);
  if (R.ai) AIS = JSON.parse(R.ai);
  if (R.sk) SKL = JSON.parse(R.sk);
  if (R.rc) RCS = JSON.parse(R.rc);
  if (R.ws) WSP = JSON.parse(R.ws);
  if (R.cl) CATLIB = JSON.parse(R.cl);
  if (R.ac) ACAT = JSON.parse(R.ac);
  if (R.aq) { const j = JSON.parse(R.aq); ACAT = j.cats; AQC = j.conversations.map(c => ({ ...c, dt: new Date(c.date + 'T12:00:00') })); AQI = { ai: j.ai }; }
  return changed;
}

// ---------------------------------------------------------------- generic form pop-up (used by teams, users, folders, tasks, sessions ...)
// openForm({title, fields:[{k,l,t,o,req,ph,hint,show,re}], d:{...}, save: async d => 'error text' | undefined, w, extra: () => html, yes:'Save'})
function openForm(o) { FM = { w: 560, yes: 'Save', ...o, d: JSON.parse(JSON.stringify(o.d || {})) }; render(); }
function fmSet(k, v, re) { FM.d[k] = v; if (re) render(); }
function fmTog(k, v, on) { const a = FM.d[k] = FM.d[k] || []; const i = a.indexOf(v); if (on && i < 0) a.push(v); if (!on && i >= 0) a.splice(i, 1); }
function fmLines(k, s) { FM.d[k] = s.split('\n').map(x => x.trim()).filter(Boolean); }
function fmChips(k, s) { FM.d[k] = s.split(',').map(x => x.trim()).filter(Boolean); }
// ---- picker: selected values appear as bubbles, a drop-down adds more from the catalog (admins can also create a new one)
let ACD = {}, PKN = null;                                                  // ACD: values being edited in My account; PKN: "create new" box that is open
const pkObj = scope => scope === 'fm' ? FM.d : ACD;
const pkOpts = kind => (kind === 'languages' ? SKL.languages : SKL.skills) || [];
function pkHtml(scope, k, kind) {
  const sel = pkObj(scope)[k] || [], opts = pkOpts(kind).filter(x => !sel.includes(x)), one = kind === 'languages' ? 'language' : 'skill', open = PKN && PKN.scope === scope && PKN.k === k;
  return `<div class=pk><div class=pkb>${sel.map(x => `<span class=tg>${esc(x)} <a href="javascript:void(0)" onclick="pkDel('${scope}','${k}','${esc(x).replace(/&#39;/g, '')}')" title="Remove">×</a></span>`).join('') || `<small class=mu>No ${kind} chosen</small>`}</div>`
    + (open ? `<div class=row style="gap:6px;margin-top:6px"><input id=pkn placeholder="New ${one}" style="flex:1" onkeydown='if(event.key=="Enter")pkMake("${scope}","${k}","${kind}")'><button type=button class=btn onclick="pkMake('${scope}','${k}','${kind}')">Create</button><button type=button class=ib onclick="PKN=null;render()">Cancel</button></div>`
      : `<select style="margin-top:6px" onchange="pkAdd('${scope}','${k}','${kind}',this.value)"><option value="">+ Add ${one}…</option>${opts.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('')}${ME && ME.role === 'admin' ? `<option value="__new__">＋ Create a new ${one}…</option>` : ''}</select>`) + `</div>`;
}
function pkAdd(scope, k, kind, v) { if (!v) return; if (v === '__new__') { PKN = { scope, k, kind }; render(); setTimeout(() => { const i = $('#pkn'); if (i) i.focus(); }, 30); return; } const o = pkObj(scope); o[k] = o[k] || []; if (!o[k].includes(v)) o[k].push(v); render(); }
function pkDel(scope, k, v) { const o = pkObj(scope); o[k] = (o[k] || []).filter(x => x !== v); render(); }
async function pkMake(scope, k, kind) {
  const name = ($('#pkn').value || '').trim(); if (!name) return;
  const r = await api('/api/skills', { kind: kind === 'languages' ? 'language' : 'skill', name }); if (!r.ok) return toast(await errOf(r, 'Could not create it'), true);
  const j = await r.json(); const s = await api('/api/skills'); if (s.ok) SKL = await s.json();
  const o = pkObj(scope); o[k] = o[k] || []; if (!o[k].includes(j.name)) o[k].push(j.name); PKN = null; render(); toast('Created and added');
}
// ---- table / boxes switch for the admin lists
let VW = LS.get('qa_views', {});
const vw = k => VW[k] || 'table';
const vwSet = (k, v) => { VW[k] = v; LS.set('qa_views', VW); render(); };
const vwBtn = k => `<div class=sg style="height:38px"><button class="${vw(k) === 'table' ? 'on' : ''}" onclick="vwSet('${k}','table')" title="Table view">${IC.list}</button><button class="${vw(k) === 'boxes' ? 'on' : ''}" onclick="vwSet('${k}','boxes')" title="Boxes view">${IC.grid}</button></div>`;

const SWATCH = ['#2563eb', '#7c3aed', '#0d9488', '#e11d48', '#ea580c', '#16a34a', '#ca8a04', '#475569'];
const EMOJI = ['📁', '📘', '📗', '📙', '📕', '📒', '🧭', '💡', '🎯', '🚀', '⭐', '🔥', '🛠️', '📞', '💬', '🎓', '🧠', '🏆', '📊', '✅', '❤️', '🔒', '🌍', '🧩'];
function fmField(f) {
  if (f.show && !f.show(FM.d)) return '';
  const v = FM.d[f.k], L = `${esc(f.l || '')}${f.req ? ' <i class=rq>*</i>' : ''}`, hint = f.hint ? `<small class=mu>${esc(f.hint)}</small>` : '';
  const k = f.k, opts = typeof f.o === 'function' ? f.o(FM.d) : (f.o || []);
  if (f.t === 'textarea') return `<label>${L}<textarea rows=${f.rows || 3} placeholder="${esc(f.ph || '')}" oninput="fmSet('${k}',this.value)">${esc(v)}</textarea>${hint}</label>`;
  if (f.t === 'select') return `<label>${L}<select onchange="fmSet('${k}',this.value,${f.re ? 1 : 0})">${opts.map(([a, b]) => `<option value="${esc(a)}" ${String(v) === String(a) ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select>${hint}</label>`;
  if (f.t === 'multi') return `<div><b style="font-size:12px">${L}</b><div class=chk>${opts.map(([a, b]) => `<label class=rad><input type=checkbox ${(v || []).includes(a) ? 'checked' : ''} onchange="fmTog('${k}','${esc(a)}',this.checked)"> ${esc(b)}</label>`).join('') || '<small class=mu>Nothing to choose from yet</small>'}</div>${hint}</div>`;
  if (f.t === 'lines') return `<label>${L}<textarea rows=${f.rows || 3} placeholder="${esc(f.ph || 'one per line')}" oninput="fmLines('${k}',this.value)">${esc((v || []).join('\n'))}</textarea>${hint}</label>`;
  if (f.t === 'picker') return `<div><b style="font-size:12px">${L}</b>${pkHtml('fm', k, f.kind)}</div>`;
  if (f.t === 'chips') return `<label>${L}<input placeholder="${esc(f.ph || 'separate with commas')}" value="${esc((v || []).join(', '))}" oninput="fmChips('${k}',this.value)">${hint}</label>`;
  if (f.t === 'checkbox') return `<label class=rad><input type=checkbox ${v ? 'checked' : ''} onchange="fmSet('${k}',this.checked,${f.re ? 1 : 0})"> <span>${L}${hint ? '<br>' + hint : ''}</span></label>`;
  if (f.t === 'color') return `<div><b style="font-size:12px">${L}</b><div class=sw>${SWATCH.map(c => `<button type=button class="${v === c ? 'on' : ''}" style="background:${c}" onclick="fmSet('${k}','${c}',1)"></button>`).join('')}</div></div>`;
  if (f.t === 'icon') return `<div><b style="font-size:12px">${L}</b><div class=emo>${EMOJI.map(c => `<button type=button class="${v === c ? 'on' : ''}" onclick="fmSet('${k}','${c}',1)">${c}</button>`).join('')}</div></div>`;
  return `<label>${L}<input ${f.id ? 'id=' + f.id : ''} type="${f.t || 'text'}" placeholder="${esc(f.ph || '')}" value="${esc(v)}" ${f.max ? 'maxlength=' + f.max : ''} oninput="fmSet('${k}',this.value,${f.re ? 1 : 0});${f.on ? f.on + '(this.value)' : ''}">${hint}</label>`;
}
async function fmSave() {
  const f = FM; const err = await f.save(f.d);
  if (typeof err === 'string') return toast(err, true);
  if (FM === f) FM = null; render();
}
const FMM = () => OVL(`<div class=mh><h2>${esc(FM.title)}</h2>${X('FM=null;render()')}</div><div class=mb><div class=form style="max-width:none">${(FM.fields || []).map(fmField).join('')}</div>${FM.extra ? FM.extra(FM.d) : ''}<div style="display:flex;gap:8px;justify-content:flex-end"><button class=ib onclick="FM=null;render()">Cancel</button><button class=btn onclick="fmSave()">${esc(FM.yes)}</button></div></div>`, 'FM=null;render()', FM.w, 70);

// ---------------------------------------------------------------- password rules (the same checks run on the server)
const PWR = [['At least 6 characters', p => p.length >= 6], ['Uppercase and lowercase letters', p => /[a-z]/.test(p) && /[A-Z]/.test(p)], ['A number', p => /\d/.test(p)], ['A special character (e.g. ! @ # $)', p => /[^A-Za-z0-9]/.test(p)]];
const pwOk = p => PWR.every(r => r[1](p));
const pwBox = (withMatch = true) => `<ul class=pwl id=pwl>${PWR.map(r => `<li>○ ${r[0]}</li>`).join('')}${withMatch ? '<li>○ Both passwords match</li>' : ''}</ul>`;
function pwUpd() {
  const a = $('#pn1'), b = $('#pn2'), l = $('#pwl'); if (!a || !l) return;
  const p = a.value, one = x => `<li class="${x[1] ? 'ok' : ''}">${x[1] ? '✓' : '○'} ${x[0]}</li>`;
  l.innerHTML = PWR.map(r => one([r[0], r[1](p)])).join('') + (b ? one(['Both passwords match', !!b.value && b.value === p]) : '');
}

// ---------------------------------------------------------------- review types: a review can be about a call, a chat, an email or another conversation
// (old reviews have no type: they are calls). Every scorecard says which types it is used for (chs; old scorecards: calls).
const CHS = ['call', 'chat', 'email', 'other'];
const CHN = { call: 'Call', chat: 'Chat', email: 'Email', other: 'Other' }, CHP = { call: 'Calls', chat: 'Chats', email: 'Emails', other: 'Other' };
const CHC = { call: 'var(--ac)', chat: '#8b5cf6', email: '#f59e0b', other: '#14b8a6' };
const chOf = e => (e && e.ch) || 'call';
const scChs = s => (s && s.chs && s.chs.length) ? s.chs : ['call'];
const chTag = (ch, short) => `<span class=cht style="--c:${CHC[ch]}" title="${CHN[ch]}">${IC['ch_' + ch]}${short ? '' : ' ' + CHN[ch]}</span>`;
// "All types / Calls / Chats / Emails / Other" buttons with how many reviews and their average; only types that have reviews are shown
const chChips = (list, cur, fn) => { const c = k => list.filter(e => !k || chOf(e) === k); const used = CHS.filter(k => c(k).length);
  return used.length < 2 && !cur ? '' : `<div class=chchips>${['', ...used].map(k => { const l = c(k), a = avg(l.map(e => e.sc)); return `<button class="chchip ${cur === k ? 'on' : ''}" style="--c:${k ? CHC[k] : 'var(--ac)'}" onclick="${fn}('${k}')">${k ? IC['ch_' + k] : ''}${k ? CHP[k] : 'All types'} <b>(${l.length})</b>${l.length ? `<b class=chav>${a.toFixed(0)}%</b>` : ''}</button>`; }).join('')}</div>`; };
const chSel = (cur, on) => `<select onchange="${on}"><option value="">All types</option>${CHS.map(k => `<option value=${k} ${cur === k ? 'selected' : ''}>${CHP[k]}</option>`).join('')}</select>`;
