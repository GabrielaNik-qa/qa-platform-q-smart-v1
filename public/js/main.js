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
function toggleSb() { COL = !COL; LS.set('qa_col', COL); applySb(); }
function sbDbl(e) { if (!ME || e.target.closest('a,button,.usr,select,input')) return; toggleSb(); }
// ---------------------------------------------------------------- menu: a few main groups with drop-downs (a pop-out list when the sidebar is collapsed)
let OG = null, FLY = null, FLYY = 100;
const gOpen = g => !COL && (OG === null ? groupOf(route) === g.id : OG === g.id);
function tgG(id, ev) { if (COL) { FLY = FLY === id ? null : id; FLYY = ev.currentTarget.getBoundingClientRect().top; } else OG = (gOpen({ id }) ? '' : id); render(); }
const NAVH = () => groupsFor().map(g => { const act = groupOf(route) === g.id, open = gOpen(g);
  return `<div class="grp ${open ? 'open' : ''} ${act ? 'act' : ''}"><button class=gh onclick="tgG('${g.id}',event)" title="${g.name}"><i>${IC[g.icon]}</i><span>${g.name}</span><em>›</em></button>${open ? `<div class=sub>${g.items.map(([k, n]) => `<a href="#${k}" class="${k === route ? 'on' : ''}">${n}</a>`).join('')}</div>` : ''}${COL && FLY === g.id ? `<div class=fly style="--fy:${FLYY}px"><b>${g.name}</b>${g.items.map(([k, n]) => `<a href="#${k}" class="${k === route ? 'on' : ''}">${n}</a>`).join('')}</div>` : ''}</div>`; }).join('');
document.addEventListener('click', e => { if (FLY && !e.target.closest('.fly,.gh')) { FLY = null; render(); } });
const FOOT = () => `<div class=ft><div class=thm>${[['light', 'Light', IC.sun], ['dark', 'Dark', IC.moon], ['system', 'System', IC.mon]].map(([k, l, s]) => `<button class="${THM === k ? 'on' : ''}" data-m="${k}" onclick="th('${k}')" title="${l} mode"><span class=ti>${s}</span></button>`).join('')}</div><div class=usr><div class=av2 onclick="openAcct('profile')" title="My account">${esc(ini(ME.name))}</div><div class=un onclick="openAcct('profile')" title="My account"><b>${esc(ME.name)}</b><small>${ROLE[ME.role] || ME.role}</small></div><button onclick="tsnd()" title="${SND ? 'Sound on' : 'Sound off'}">${SND ? IC.vol : IC.mute}</button>${ME.role === 'admin' ? `<button onclick="SYS=true;render()" title="System settings">${IC.gear}</button>` : ''}<button onclick="out()" title="Log out">${IC.out}</button></div></div>`;

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
  OG = null; FLY = null; TKV = null; TPLM = false; SSV = null; TEST = null; FM = null; AIH = false; CALV = ''; NWV = ''; WE = null; AQV = ''; PKN = null;
  if (n === 'calls' && !KQ) { Q = ''; FSC = null; PN = 1; }   // opening Call Reviews from the menu starts with an empty search
  KQ = false; MD = null; NO = false; AC = null; SYS = false; RSV = null; PLY = null; SE = n === 'sco' ? SE : null;
  route = n; await load(); render(); window.scrollTo(0, 0);
}
addEventListener('hashchange', onHash);
addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { const i = $('.qi'); if (i) { e.preventDefault(); i.focus(); } } });
addEventListener('beforeunload', e => { if (entDirty() || kbDirty()) { e.preventDefault(); e.returnValue = ''; } });

// new reviews and notifications show up by themselves (every 20 s and when you come back to the tab)
let PREVU = null;
const refreshBell = () => $$('.ib[onclick*="openN"]').forEach(b => { b.innerHTML = IC.bell + (UN() ? `<sup>${UN()}</sup>` : ''); });
async function poll() {
  if (!ME || ME.mustChange) return;
  const ch = await load(), u = UN(); if (PREVU !== null && u > PREVU) beep(); PREVU = u;
  const busy = ['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement || {}).tagName);
  if (ch && (!MD || MD.t === 'view') && !NO && !AC && !SYS && !RSV && !CFM && !PLY && !FM && !TKV && !TEST && !SSV && !TPLM && !AQV && !WE && !busy && route !== 'entry' && !SE && !KBE && !QZE && !NWE) render(); else if (ch) refreshBell();
}
setInterval(poll, 20000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });

async function boot() {
  const r = await api('/api/me'); ME = r.ok ? await r.json() : null;
  if (ME && !ME.mustChange) await load();
  PREVU = UN(); render();
}
applyTheme(); boot();
