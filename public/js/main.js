// ===================== Sign-in / register screens, sidebar, router, start-up =====================
const WAVE = (() => { let b = ''; for (let i = 0; i < 50; i++) { const h = 14 + 96 * Math.abs(Math.sin(i * .33 + .4)) * (.35 + .65 * Math.abs(Math.sin(i * .12 + 1.2))); b += `<rect x="${(i * 9.2).toFixed(1)}" y="${((120 - h) / 2).toFixed(1)}" width="5.2" height="${h.toFixed(1)}" rx="2.6" fill="url(#wg)"/>`; } return `<svg viewBox="0 0 460 120" width="100%" style="max-width:460px" aria-hidden="true"><defs><linearGradient id="wg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="120"><stop offset="0" stop-color="#3ecfa6"/><stop offset=".5" stop-color="#2f8fe6"/><stop offset="1" stop-color="#1f6f95"/></linearGradient></defs>${b}</svg>`; })();
const EYE = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
let LU = '';
const tp = id => { const i = $('#' + id); i.type = i.type === 'password' ? 'text' : 'password'; };
const en = fn => `onkeydown='if(event.key=="Enter")${fn}()'`;
const pwf = (id, label, extra = '') => `<label>${label}<div class=pw><input id=${id} type=password ${extra}><button type=button class=eye onclick="tp('${id}')" aria-label="Show or hide password">${EYE}</button></div></label>`;
const LG = () => {
  const m = MSG ? `<small style="color:#0f9b72">${esc(MSG)}</small>` : '';
  const f = AUTH === 'forgot' ? `<h1>Reset your password</h1><p class=lgs style="margin-top:-6px;line-height:1.5">Enter your email address or username: we will send you a link to choose a new password.</p><label>Email address or username<input class=wh id=lu placeholder="Enter your email" ${en('forgot')}></label>${m}<div id=lge></div><button class=sbtn onclick=forgot()>Send Reset Email</button><a class=lgk href="#" onclick="AUTH='';MSG='';render();return false">← Back to login</a>`
    : AUTH === 'reset' ? `<h1>New password</h1><p class=lgs>Choose a strong password.</p>${pwf('pn1', 'New password', 'oninput="pwUpd()"')}${pwf('pn2', 'Confirm new password', 'oninput="pwUpd()" ' + en('reset'))}${pwBox()}<div id=lge></div><button class=sbtn onclick=reset()>Save password</button>`
    : AUTH === 'register' ? `<h1>Create account</h1><p class=lgs style="margin-top:-6px;line-height:1.5">Your registration will be reviewed by an administrator. You will get an email when it is approved.</p><label>Full name<input id=rn></label><label>Email address<input id=re type=email></label><label>Username<input id=ru placeholder="e.g. j.smith" autocomplete=username></label>${pwf('pn1', 'Password', 'oninput="pwUpd()"')}${pwf('pn2', 'Confirm password', 'oninput="pwUpd()" ' + en('register'))}${pwBox()}<div id=rge></div><button class=sbtn onclick=register()>Request access</button><a class=lgk href="#" onclick="AUTH='';MSG='';render();return false">← Back to login</a>`
    : `<h1 style="margin-bottom:8px">Sign in</h1><label>Username or email<input id=lu autocomplete=username value="${esc(LU)}" oninput="LU=this.value" ${en('login')}></label>${pwf('lp', 'Password', en('login'))}${m}<div id=lge></div><button class=sbtn onclick=login()>Sign In</button><a class=lgk href="#" onclick="AUTH='forgot';MSG='';render();return false">Forgot your password?</a><button class=rgb onclick="AUTH='register';MSG='';render()">Register</button>`;
  return `<div class=lg><aside class=lgl><div class=lgb>${mark('mg', 34)}<b>Q-SMART</b></div><div class=lgm><div class=lgw>${WAVE}</div><div class=lgt><h2>Quality Assurance<br>Platform</h2><p>Call Center Quality Assurance</p></div></div></aside><section class=lgr><div class=lgf>${f}</div></section></div>`;
};
const lerr = (id, m) => { const e = $(id); if (e) e.innerHTML = `<small style="color:#dc2626">${esc(m)}</small>`; };
async function login() {
  const r = await api('/api/login', { username: $('#lu').value, password: $('#lp').value });
  if (r.ok) { MSG = ''; LU = ''; await boot(); if (ME && location.hash !== '#dash') location.hash = 'dash'; } else lerr('#lge', await errOf(r, 'Could not sign in'));
}
async function register() {
  const p = $('#pn1').value;
  if (!pwOk(p)) return lerr('#rge', 'The password does not meet the requirements');
  if (p !== $('#pn2').value) return lerr('#rge', 'The two passwords do not match');
  const r = await api('/api/register', { name: $('#rn').value, email: $('#re').value, username: $('#ru').value, password: p });
  if (!r.ok) return lerr('#rge', await errOf(r, 'Could not register'));
  AUTH = ''; MSG = 'Registration received! It is pending approval by an administrator. We emailed you a confirmation.'; render();
}
async function forgot() { await api('/api/forgot', { identifier: $('#lu').value.trim() }); MSG = 'If that account has an email address, a reset link has been sent.'; render(); }
async function reset() {
  const q = new URLSearchParams(location.search), p = $('#pn1').value;
  if (!pwOk(p)) return lerr('#lge', 'The password does not meet the requirements');
  if (p !== $('#pn2').value) return lerr('#lge', 'The two passwords do not match');
  const r = await api('/api/reset', { username: q.get('u'), token: q.get('reset'), password: p });
  if (r.ok) { history.replaceState(null, '', '/'); AUTH = ''; MSG = 'Password changed. Please sign in.'; render(); } else lerr('#lge', await errOf(r, 'Reset failed'));
}
async function out() { await api('/api/logout', {}); ME = null; MSG = ''; ENT = null; EDITID = ''; KBE = null; render(); }

// ---------------------------------------------------------------- sidebar (arrow button is fixed, double-click opens AND closes it)
function applySb() {
  document.documentElement.classList.toggle('co', COL); const s = $('#sb'); if (s) s.classList.toggle('co', COL);
  const b = $('#sbt'); if (b && !b.innerHTML) b.innerHTML = IC.chev;
}
function toggleSb() { COLP = !COL; COL = COLP || innerWidth <= 1100; LS.set('qa_col', COLP); FLY = null; OG = null; UMN = false; applySb(); if (ME) render(); }
// narrow screens: the sidebar becomes compact by itself, and goes back to your choice when the window is wide again
addEventListener('resize', () => { const c = COLP || innerWidth <= 1100; if (c !== COL) { COL = c; FLY = null; OG = null; UMN = false; applySb(); if (ME) render(); } });
function sbDbl(e) { if (!ME || e.target.closest('a,button,.usr,select,input')) return; toggleSb(); }
// ---------------------------------------------------------------- menu: a few main groups with drop-downs (a pop-out list when the sidebar is collapsed)
let OG = null, FLY = null, FLYY = 100;
const gOpen = g => !COL && (OG === null ? groupOf(route) === g.id : OG === g.id);
// clicking a group's icon opens its first page; when the sidebar is closed its pop-out menu stays open too
let PENDFLY = null;
function gGo(id, ev) {
  ev.stopPropagation(); UMN = false; const g = groupsFor().find(x => x.id === id); if (!g || !g.items.length) return;
  const y = ev.currentTarget.closest('.gh').getBoundingClientRect().top, first = g.items[0][0];
  if (COL) { if (route === first) { FLY = FLY === id ? null : id; FLYY = y; render(); } else { PENDFLY = { id, y }; location.hash = first; } return; }
  OG = id; if (route === first) render(); else location.hash = first;
}
function tgG(id, ev) { if (COL) { FLY = FLY === id ? null : id; FLYY = ev.currentTarget.getBoundingClientRect().top; } else OG = (gOpen({ id }) ? '' : id); render(); }
const NAVH = () => groupsFor().map(g => { const act = groupOf(route) === g.id, open = gOpen(g);
  return `<div class="grp ${open ? 'open' : ''} ${act ? 'act' : ''}"><button class=gh onclick="${COL ? `gGo('${g.id}',event)` : `tgG('${g.id}',event)`}" title="${g.name}"><i onclick="gGo('${g.id}',event)" title="Open ${g.items[0][1]}">${IC[g.icon]}</i><span>${g.name}</span><em>›</em></button>${open ? `<div class=sub>${g.items.map(([k, n]) => `<a href="#${k}" class="${k === route ? 'on' : ''}">${n}</a>`).join('')}</div>` : ''}${COL && FLY === g.id ? `<div class=fly style="--fy:${FLYY}px"><b>${g.name}</b>${g.items.map(([k, n]) => `<a href="#${k}" class="${k === route ? 'on' : ''}">${n}</a>`).join('')}</div>` : ''}</div>`; }).join('');
document.addEventListener('click', e => { if ((FLY || UMN) && !e.target.closest('.fly,.gh,.av2')) { FLY = null; UMN = false; render(); } });
let UMN = false;                                           // the small "me" menu of the compact sidebar
const THL = [['light', 'Light', IC.sun], ['dark', 'Dark', IC.moon], ['system', 'System', IC.mon]];
const thmBtns = () => `<div class=thm>${THL.map(([k, l, s]) => `<button class="${THM === k ? 'on' : ''}" data-m="${k}" onclick="th('${k}')" title="${l} mode"><span class=ti>${s}</span></button>`).join('')}</div>`;
const cycleTh = () => th({ light: 'dark', dark: 'system', system: 'light' }[THM] || 'light');
function umTog(ev) { ev.stopPropagation(); UMN = !UMN; FLY = null; FLYY = ev.currentTarget.getBoundingClientRect().bottom; render(); }
const FOOT = () => COL
  ? `<div class="ft ftc"><button class="thc1" data-m="${THM}" onclick="cycleTh()" title="${(THL.find(x => x[0] === THM) || THL[2])[1]} mode — click to change"><span class=ti>${(THL.find(x => x[0] === THM) || THL[2])[2]}</span></button><div class=av2 onclick="umTog(event)" title="${esc(ME.name)} — menu">${esc(ini(ME.name))}</div>${UMN ? `<div class="fly umn" style="--fyb:${Math.max(12, innerHeight - FLYY)}px"><b>${esc(ME.name)}</b><small class=umr>${ROLE[ME.role] || ME.role}</small>${thmBtns()}<a href="javascript:void(0)" onclick="UMN=false;openAcct('profile')">${IC.pen} My account</a><a href="javascript:void(0)" onclick="UMN=false;tsnd()">${SND ? IC.vol + ' Sound on' : IC.mute + ' Sound off'}</a>${ME.role === 'admin' ? `<a href="javascript:void(0)" onclick="UMN=false;SYS=true;render()">${IC.gear} System settings</a>` : ''}<a href="javascript:void(0)" onclick="UMN=false;out()">${IC.out} Log out</a></div>` : ''}</div>`
  : `<div class=ft><div class=thm>${[['light', 'Light', IC.sun], ['dark', 'Dark', IC.moon], ['system', 'System', IC.mon]].map(([k, l, s]) => `<button class="${THM === k ? 'on' : ''}" data-m="${k}" onclick="th('${k}')" title="${l} mode"><span class=ti>${s}</span></button>`).join('')}</div><div class=usr><div class=av2 onclick="openAcct('profile')" title="My account">${esc(ini(ME.name))}</div><div class=un onclick="openAcct('profile')" title="My account"><b>${esc(ME.name)}</b><small>${ROLE[ME.role] || ME.role}</small></div><button onclick="tsnd()" title="${SND ? 'Sound on' : 'Sound off'}">${SND ? IC.vol : IC.mute}</button>${ME.role === 'admin' ? `<button onclick="SYS=true;render()" title="System settings">${IC.gear}</button>` : ''}<button onclick="out()" title="Log out">${IC.out}</button></div></div>`;

// ---------------------------------------------------------------- render
function render() {
  document.body.classList.toggle('auth', !ME);
  if (!ME) { $('#m').innerHTML = LG(); $('#n').innerHTML = ''; $('#br').innerHTML = ''; $('#fz').innerHTML = ''; return; }
  applySb();
  $('#m').innerHTML = (PG[route] || PG.dash)() + overlays();
  $('#br').innerHTML = `<div class=brand onclick="location.hash='dash'" title="Go to Home">${mark('mg2', 36)}<div><b>Q-SMART</b><small>QA Platform</small></div></div>`;
  $('#n').innerHTML = NAVH();
  $('#fz').innerHTML = FOOT();
  $$('.chat').forEach(c => { c.scrollTop = c.scrollHeight; });
}

// ---------------------------------------------------------------- router: warns before leaving an unsaved form, reloads data on every tab change
let SKIPH = false;
async function onHash() {
  const n = location.hash.slice(1) || 'dash';
  if (SKIPH) { SKIPH = false; return; }
  if (!ME) { route = n; return; }
  if (((route === 'entry' && entDirty()) || (route === 'kb' && kbDirty())) && n !== route) {      // put the page back and ask first
    const back = route; SKIPH = true; location.hash = back;
    ask('Leave this page?', 'Your changes will be lost. Are you sure you want to leave?', () => { ENT = null; EDITID = ''; KBE = null; location.hash = n; }, { yes: 'Yes, leave', no: 'No, stay' });
    return;
  }
  if (!canRoute(n)) { location.hash = 'dash'; return; }
  if (n !== 'entry') { ENT = null; EDITID = ''; }
  if (n !== 'kb') KBE = null;
  OG = null; FLY = PENDFLY ? PENDFLY.id : null; if (PENDFLY) FLYY = PENDFLY.y; PENDFLY = null; TKV = null; QFM = null; PAL = null; TPLM = false; SSV = null; TEST = null; FM = null; AIH = false; CALV = ''; NWV = ''; WE = null; WADD = null; WSET = null; WDISP = null; AQV = ''; PKN = null;
  if (n === 'calls' && !KQ) { Q = ''; FSC = null; PN = 1; }   // opening Call Reviews from the menu starts with an empty search
  KQ = false; MD = null; NO = false; AC = null; SYS = false; RSV = null; PLY = null; SE = n === 'sco' ? SE : null;
  route = n; await load(); render(); window.scrollTo(0, 0);
}
addEventListener('hashchange', onHash);
// ---------------------------------------------------------------- quick jump (Ctrl+K or the search box in any header): pages, agents, leads and actions in one list
let PAL = null;
function palOpen(q = '') { if (!ME) return; PAL = { q, i: 0 }; render(); setTimeout(() => { const i = $('#palq'); if (i) { i.focus(); i.setSelectionRange(99, 99); } }, 20); }
function palItems() {
  const q = PAL.q.trim().toLowerCase(), hit = s => !q || s.toLowerCase().includes(q), out = [];
  const acts = [staff() && ['New evaluation', 'Score a call', "goPage('entry')"], isStaffR() && ['New quick flag', 'Red or green flag without a review', "goPage('flags');setTimeout(()=>qfNew({type:'red'}),300)"], isStaffR() && ['New task', 'Give a task to agents', "TV.tab='my';goPage('tasks');setTimeout(()=>newTask(),300)"], isStaffR() && ['New one-to-one', 'Document a one-to-one', "goPage('o2o')"]].filter(Boolean);
  acts.forEach(([t, s, go]) => hit(t) && out.push({ ic: IC.plus, t, s, go }));
  groupsFor().forEach(g => g.items.forEach(([k, n]) => hit(n + ' ' + g.name) && out.push({ ic: IC[g.icon], t: n, s: g.name, go: `goPage('${k}')` })));
  if (q) {
    AGENTS().filter(a => hit(a.name) || hit(a.username)).slice(0, 6).forEach(a => out.push({ ic: `<span class=av style="margin:0;width:24px;height:24px;font-size:9px">${esc(ini(a.name))}</span>`, t: a.name, s: 'Agent · ' + tn(a.team), go: ME.role === 'agent' ? "goPage('agents')" : `openAgent('${esc(a.username)}')` }));
    EV.filter(e => String(e.id).toLowerCase().includes(q)).slice(0, 6).forEach(e => out.push({ ic: IC.eye, t: 'Lead ' + e.id, s: `${agn(e)} · ${f(e.d)} · ${Math.round(e.sc)}%`, go: `om('view','${e.rid}')` }));
    out.push({ ic: IC.search, t: `Search Call Reviews for "${PAL.q.trim()}"`, s: 'Lead ID, agent or campaign', go: `Q=${JSON.stringify(PAL.q.trim()).replace(/"/g, "'")};KQ=true;location.hash==='#calls'?render():location.hash='calls'` });
  }
  return out.slice(0, 14);
}
function palGo(k) { const it = palItems()[k]; PAL = null; render(); if (it) new Function(it.go)(); }
const PALM = () => { const l = palItems(); if (PAL.i >= l.length) PAL.i = 0;
  return OVL(`<div class=pal><div class=sx><span>${IC.search}</span><input id=palq placeholder="Go to a page, an agent or a lead ID…" value="${esc(PAL.q)}" oninput="PAL.q=this.value;PAL.i=0;palRt()" onkeydown="palKey(event)"><kbd class=kb>Esc</kbd></div><div id=pall>${palList(l)}</div><small class=mu>↑ ↓ to choose · Enter to open</small></div>`, 'PAL=null;render()', 620, 99); };
const palList = l => l.map((it, k) => `<button class="palr ${k === PAL.i ? 'on' : ''}" onclick="palGo(${k})"><span class=pali>${it.ic}</span><span><b>${esc(it.t)}</b><small>${esc(it.s)}</small></span></button>`).join('') || '<p class=mu style="padding:14px">Nothing found</p>';
const palRt = () => { const b = $('#pall'); if (b) b.innerHTML = palList(palItems()); };
function palKey(e) { const n = palItems().length; if (e.key === 'Escape') { PAL = null; render(); } else if (e.key === 'ArrowDown') { e.preventDefault(); PAL.i = (PAL.i + 1) % Math.max(n, 1); palRt(); } else if (e.key === 'ArrowUp') { e.preventDefault(); PAL.i = (PAL.i - 1 + n) % Math.max(n, 1); palRt(); } else if (e.key === 'Enter') { e.preventDefault(); palGo(PAL.i); } }
addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); palOpen(); } });
// every header search box opens the quick jump too (typing goes straight into it)
document.addEventListener('focusin', e => { if (e.target.classList && e.target.classList.contains('qi') && route !== 'calls') { const v = e.target.value; e.target.blur(); palOpen(v); } });
addEventListener('beforeunload', e => { if (entDirty() || kbDirty()) { e.preventDefault(); e.returnValue = ''; } });

// new reviews and notifications show up by themselves (every 20 s and when you come back to the tab)
let PREVU = null;
const refreshBell = () => $$('.ib[onclick*="openN"]').forEach(b => { b.innerHTML = IC.bell + (UN() ? `<sup>${UN()}</sup>` : ''); });
async function poll() {
  if (!ME || ME.mustChange) return;
  const ch = await load(), u = UN(); if (PREVU !== null && u > PREVU) beep(); PREVU = u;
  const busy = ['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement || {}).tagName) || $$('audio').some(a => !a.paused);   // never restart a recording that is playing
  if (ch && (!MD || MD.t === 'view') && !NO && !AC && !SYS && !RSV && !CFM && !PLY && !FM && !TKV && !TEST && !SSV && !TPLM && !AQV && !WE && !WADD && !WSET && !WDISP && !QFM && !PAL && !busy && route !== 'entry' && !SE && !KBE && !QZE && !NWE) render(); else if (ch) refreshBell();
}
setInterval(poll, 20000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });

async function boot() {
  const r = await api('/api/me'); ME = r.ok ? await r.json() : null;
  if (ME && !ME.mustChange) await load();
  PREVU = UN(); render();
}
applyTheme(); boot();
