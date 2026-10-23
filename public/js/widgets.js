// ===================== Widgets and dashboard views =====================
// Every card on Home and AutoQA is a widget: drag it, resize it, rename it, give it its own team / period filter, remove it, add more.
// Views: "Standard" (your own version > the default of your role set by an admin > built in), plus named views:
//   personal views (only you) and shared views (made by admins / QA, shown to the roles they choose, or to everyone).
const WSZ = [12, 15, 20, 30, 40, 60], WLAB = { 12: '1/5', 15: '1/4', 20: '1/3', 30: '1/2', 40: '2/3', 60: 'Full width' }, LEG = { 3: 15, 4: 20, 6: 30, 12: 60 };
const WREG = { dash: {}, autoqa: {} }, DEFL = { dash: {}, autoqa: {} };
let WE = null, WPREV = '', WSET = null, WADD = false;     // WE = the view being edited, WPREV = role an admin previews, WSET = settings of one widget, WADD = widget gallery
const wdef = (page, id, title, w, r, desc = '') => { WREG[page][id] = { title, w, r, desc }; };
const wl = (...a) => a.map(([id, size, on = true]) => ({ k: id, id, size, on }));
const wNorm = x => ({ ...x, k: x.k || x.id, size: x.k ? (WSZ.includes(x.size) ? x.size : 30) : (LEG[x.size] || (WSZ.includes(x.size) ? x.size : 30)) });   // old layouts (no k) used a 12-column grid
const canShare = () => ['admin', 'qa'].includes(ME.role);
const ROLESEL = [['all', 'Everyone'], ...Object.entries(ROLE)];

// ---- which widgets a view shows
function stdLayout(page, role) {
  const reg = WREG[page], mine = (ME.layouts || {})[page], rl = ((SET.layouts || {})[page] || {})[role];
  return ((!WPREV && mine) ? mine : (rl || DEFL[page][role] || DEFL[page].all)).map(wNorm).filter(x => reg[x.id]);
}
const builtin = (page, role) => (DEFL[page][role] || DEFL[page].all).map(wNorm);
const sharedViews = page => ((SET.views || {})[page] || []);
const myViews = page => ((ME.views || {})[page] || []);
// the views this person can pick: Standard, shared views for their role (admins and QA see every shared view), their own views
const viewsFor = page => { const r = WPREV || ME.role; return [{ id: 'std', name: 'Standard', kind: 'std' }, ...sharedViews(page).filter(v => canShare() && !WPREV || v.roles.includes('all') || v.roles.includes(r)).map(v => ({ ...v, kind: 'shared' })), ...(WPREV ? [] : myViews(page).map(v => ({ ...v, kind: 'mine' })))]; };
const curView = page => { const l = viewsFor(page), id = LS.get('qa_view_' + page, ''); return l.find(v => v.id === id) || l.find(v => v.kind === 'shared' && !canShare()) || l[0]; };
const itemsOf = (page, v) => v.kind === 'std' ? stdLayout(page, WPREV || ME.role) : (v.items || []).map(wNorm).filter(x => WREG[page][x.id]);
const setView = (page, id) => { LS.set('qa_view_' + page, id); render(); };

// ---- editing
function wStart(page, fresh) {
  const v = fresh ? { id: '', name: 'New view', kind: 'mine', items: [] } : curView(page);
  WE = { page, vid: v.id, kind: v.kind, name: v.name, roles: [...(v.roles || [])], items: JSON.parse(JSON.stringify(fresh ? builtin(page, ME.role) : itemsOf(page, v))).filter(x => x.on !== false), save: WPREV && ME.role === 'admin' ? WPREV : 'me' };
  render();
}
const wCancel = () => { WE = null; WSET = null; WADD = false; render(); };
const wIdx = k => WE.items.findIndex(x => x.k === k);
function wMove(k, d) { const i = wIdx(k), j = i + d; if (j < 0 || j >= WE.items.length) return; [WE.items[i], WE.items[j]] = [WE.items[j], WE.items[i]]; render(); }
const wSizeSet = (k, v) => { WE.items[wIdx(k)].size = +v; render(); };
const wDel = k => { WE.items.splice(wIdx(k), 1); render(); };
const wAdd = id => { const r = WREG[WE.page][id]; WE.items.push({ k: id + '-' + Math.random().toString(36).slice(2, 6), id, size: r.w, on: true }); WADD = false; render(); toast(r.title + ' added at the end'); };
const wDrag = (ev, k) => ev.dataTransfer.setData('text/plain', k);
function wDrop(ev, k) { ev.preventDefault(); const from = ev.dataTransfer.getData('text/plain'); if (!from || from === k) return render(); const x = WE.items.splice(wIdx(from), 1)[0]; WE.items.splice(wIdx(k), 0, x); render(); }
function wReset() { WE.items = builtin(WE.page, WE.save === 'me' ? ME.role : WE.save).filter(x => x.on !== false); render(); toast('Built-in layout restored. Press Save to keep it.'); }
const wRole = r => { const a = WE.roles; if (r === 'all') WE.roles = a.includes('all') ? [] : ['all']; else { WE.roles = a.filter(x => x !== 'all'); WE.roles = a.includes(r) ? WE.roles.filter(x => x !== r) : [...WE.roles, r]; } render(); };
async function wSave() {
  const e = WE, items = e.items.map(x => ({ ...x, on: true }));
  if (e.kind === 'std') {
    const r = e.save === 'me' ? await api('/api/layout', { page: e.page, items }, 'PUT') : await api('/api/layouts/' + e.save, { page: e.page, items }, 'PUT');
    if (!r.ok) return toast(await errOf(r, 'Could not save the view'), true);
    const j = await r.json(); if (e.save === 'me') ME = j; else SET = { ...SET, layouts: j.layouts };
    WE = null; render(); return toast(e.save === 'me' ? 'Your Standard view is saved' : 'Standard view of ' + ROLE[e.save] + ' saved');
  }
  if (!e.name.trim()) return toast('Give the view a name', true);
  const id = e.vid || 'v' + Date.now().toString(36), v = { id, name: e.name.trim(), items }, shared = canShare() && e.roles.length;
  let mine = myViews(e.page).filter(x => x.id !== id), sh = sharedViews(e.page).filter(x => x.id !== id);
  if (shared) sh = [...sh, { ...v, roles: e.roles, by: ME.name }]; else mine = [...mine, v];
  const r1 = await api('/api/views', { page: e.page, views: mine }, 'PUT'); if (!r1.ok) return toast(await errOf(r1, 'Could not save the view'), true); ME = await r1.json();
  if (canShare() && (shared || e.kind === 'shared')) { const r2 = await api('/api/shared-views', { page: e.page, views: sh }, 'PUT'); if (!r2.ok) return toast(await errOf(r2, 'Could not share the view'), true); SET = await r2.json(); }
  LS.set('qa_view_' + e.page, id); WE = null; render(); toast(shared ? `View "${v.name}" saved and shared with ${e.roles.includes('all') ? 'everyone' : e.roles.map(r => ROLE[r]).join(', ')}` : `View "${v.name}" saved`);
}
const wDelView = () => ask('Delete this view?', `"${WE.name}" is removed${WE.kind === 'shared' ? ' for everybody it was shared with' : ''}. The Standard view stays.`, async () => {
  const e = WE; if (e.kind === 'shared') { const r = await api('/api/shared-views', { page: e.page, views: sharedViews(e.page).filter(x => x.id !== e.vid) }, 'PUT'); if (r.ok) SET = await r.json(); }
  else { const r = await api('/api/views', { page: e.page, views: myViews(e.page).filter(x => x.id !== e.vid) }, 'PUT'); if (r.ok) ME = await r.json(); }
  WE = null; LS.set('qa_view_' + e.page, 'std'); render(); toast('View deleted');
}, { yes: 'Yes, delete', no: 'Cancel', danger: true });
async function wClearMine(page) { const r = await api('/api/layout', { page, reset: true, items: [] }, 'PUT'); if (r.ok) { ME = await r.json(); render(); toast('Back to the default view of your role'); } }

// ---- the bar above the widgets: view tabs (normal) or the editing tools
function wBar(page) {
  const adm = ME.role === 'admin';
  if (WE && WE.page === page) {
    const std = WE.kind === 'std';
    return `<div class=wbar><div class=wbr><b>${std ? 'Customizing the Standard view' : 'View name'}</b>${std ? '' : `<input class=wvn value="${esc(WE.name)}" oninput="WE.name=this.value" placeholder="View name">`}<button class="ib ibx" onclick="WADD=true;render()">${IC.plus} Add widget</button>`
      + (std && adm ? `<label style="display:flex;gap:6px;align-items:center;font-size:13px">Save for<select onchange="WE.save=this.value"><option value=me ${WE.save === 'me' ? 'selected' : ''}>Only me</option>${Object.entries(ROLE).map(([k, v]) => `<option value=${k} ${WE.save === k ? 'selected' : ''}>Everyone who is ${v}</option>`).join('')}</select></label>` : '')
      + `<span style="margin-left:auto;display:flex;gap:8px">${std ? `<button class=ib onclick="wReset()">Reset</button>` : WE.vid ? `<button class=ib style="color:var(--bad)" onclick="wDelView()">${IC.bin} Delete view</button>` : ''}<button class=ib onclick="wCancel()">Cancel</button><button class=btn onclick="wSave()">Save view</button></span></div>`
      + (!std && canShare() ? `<div class=wbr><small>Show this view to</small>${ROLESEL.map(([k, n]) => `<button class="tkcp ${WE.roles.includes(k) ? 'on' : ''}" onclick="wRole('${k}')">${n}</button>`).join('')}<small class=mu>${WE.roles.length ? '' : 'Nobody else — a personal view'}</small></div>` : '')
      + `<small class=mu>Drag a widget to move it. Use its toolbar to change the size, open ⚙ to rename it or give it its own team and period, ✕ to remove it.</small></div>`;
  }
  const l = viewsFor(page), cv = curView(page);
  return `<div class=wvbar><div class=wvt>${l.map(v => `<button class="${v.id === cv.id ? 'on' : ''}" onclick="setView('${page}','${v.id}')" title="${v.kind === 'shared' ? 'Shared with ' + esc(v.roles.map(r => r === 'all' ? 'everyone' : ROLE[r]).join(', ')) + (v.by ? ' · by ' + esc(v.by) : '') : v.kind === 'mine' ? 'Only you see this view' : 'The standard view of your role'}">${v.kind === 'shared' ? TIC.team : ''}${esc(v.name)}</button>`).join('')}<button class=wvn2 onclick="wStart('${page}',1)" title="Make a new view">${IC.plus} New view</button></div>`
    + `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${WPREV ? `<span class="pill wn">Previewing as ${ROLE[WPREV]}</span>` : ''}${adm ? `<select title="See the page as another role" onchange="WPREV=this.value==='me'?'':this.value;render()"><option value=me>View as: me</option>${Object.entries(ROLE).map(([k, v]) => `<option value=${k} ${WPREV === k ? 'selected' : ''}>View as: ${v}</option>`).join('')}</select>` : ''}${cv.kind === 'std' && (ME.layouts || {})[page] && !WPREV ? `<button class=ib onclick="wClearMine('${page}')">Reset</button>` : ''}${cv.kind !== 'shared' || canShare() ? `<button class="ib ibx" onclick="wStart('${page}')">${IC.pen} Customize</button>` : ''}</div></div>`;
}
const wTb = (x, page) => `<div class=wtb><span class=wgrip title="Drag to move">⠿</span><button onclick="wMove('${x.k}',-1)" title="Move earlier">←</button><button onclick="wMove('${x.k}',1)" title="Move later">→</button><select onchange="wSizeSet('${x.k}',this.value)" title="Width">${WSZ.map(s => `<option value=${s} ${x.size === s ? 'selected' : ''}>${WLAB[s]}</option>`).join('')}</select>${page === 'dash' ? `<button onclick="WSET='${x.k}';render()" title="Title and filters">⚙</button>` : ''}<button onclick="wDel('${x.k}')" title="Remove">✕</button></div>`;
const wFilt = x => x.f && (x.f.t || x.f.p) ? `<span class=wfc title="This widget has its own filter">${[x.f.t ? tn(x.f.t) : '', x.f.p ? PERN[x.f.p] : ''].filter(Boolean).join(' · ')}</span>` : '';
function wGrid(page, ctxOf) {
  const ed = WE && WE.page === page, items = ed ? WE.items : itemsOf(page, curView(page)), reg = WREG[page];
  if (!items.length) return `<div class=agem>This view has no widgets yet. ${ed ? '' : `<a href="javascript:void(0)" class=agl onclick="wStart('${page}')">Customize</a> it to add some.`}</div>`;
  return `<div class=wgrid>${items.filter(x => x.on !== false).map(x => `<div class="wg w${x.size} ${ed ? 'edit' : ''}" ${ed ? `draggable=true ondragstart="wDrag(event,'${x.k}')" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="wDrop(event,'${x.k}')"` : ''}>${ed ? wTb(x, page) : ''}${wFilt(x)}${reg[x.id].r(typeof ctxOf === 'function' ? ctxOf(x) : ctxOf, x.size, x)}</div>`).join('')}</div>`;
}
// widget gallery and widget settings pop-ups
const WADDM = () => { const reg = WREG[WE.page]; return OVL(`<div class=mh><div><h2>Add a widget</h2><small>Pick a card for this view. You can add the same widget more than once with different filters.</small></div>${X('WADD=false;render()')}</div><div class=mb><div class=wgal>${Object.entries(reg).map(([id, r]) => `<button class=wgi onclick="wAdd('${id}')"><b>${esc(r.title)}</b><small>${esc(r.desc || '')}</small><span class=tkch>${WLAB[r.w]}</span>${WE.items.some(x => x.id === id) ? '<span class="tkch" style="--c:var(--ok)">on this view</span>' : ''}</button>`).join('')}</div></div>`, 'WADD=false;render()', 820, 60); };
const PERN = { week: 'Week', month: 'Month', year: 'Year', all: 'All time' };
const WSETM = () => { const x = WE.items[wIdx(WSET)]; if (!x) { WSET = null; return ''; } const r = WREG[WE.page][x.id], fl = x.f || {};
  return OVL(`<div class=mh><div><h2>Widget settings</h2><small>${esc(r.title)}</small></div>${X('WSET=null;render()')}</div><div class=mb><div class=form style="max-width:none"><label>Title<input value="${esc(x.title || '')}" placeholder="${esc(r.title)}" oninput="WE.items[wIdx('${x.k}')].title=this.value"></label>
<div class=eg2><label>Team<select onchange="wF('${x.k}','t',this.value)"><option value="">Same as the page filter</option>${TEAMS.filter(t => !t.system).map(t => `<option value="${t.id}" ${fl.t === t.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></label><label>Period<select onchange="wF('${x.k}','p',this.value)"><option value="">Same as the page filter</option>${Object.entries(PERN).map(([k, n]) => `<option value=${k} ${fl.p === k ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>
<label>Width<select onchange="WE.items[wIdx('${x.k}')].size=+this.value">${WSZ.map(s => `<option value=${s} ${x.size === s ? 'selected' : ''}>${WLAB[s]}</option>`).join('')}</select></label></div><div style="display:flex;justify-content:flex-end"><button class=btn onclick="WSET=null;render()">Done</button></div></div>`, 'WSET=null;render()', 520, 60); };
const wF = (k, key, v) => { const x = WE.items[wIdx(k)]; x.f = { ...(x.f || {}), [key]: v }; };

// ---------------------------------------------------------------- Home dashboard widgets
const kp = (t, v, s, c, b, act) => `<div class="card clk kpc" onclick="${act}"><small>${t}</small><div class=big style="color:${c}">${v}</div>${b == null ? '' : bar(b, c)}<small>${s}</small></div>`;
const pc1 = v => v.toFixed(1) + '<small class=kps>%</small>';
const dashDF = (p, t) => EV.filter(e => (!t || e.tm === t) && (p === 'all' || (p === 'custom' ? e.d >= new Date(DF + 'T00:00:00') && e.d <= new Date(DT + 'T23:59:59') : (Date.now() - e.d) / 864e5 <= { week: 7, month: 30, year: 365 }[p])));
function dashCtx(p, t) {
  const g = t ? PT(t) : PASSG(), d = dashDF(p, t), n = d.length, a = avg(d.map(e => e.sc)), ps = d.filter(isPass).length, pc = n ? ps / n * 100 : 0, s = [...d].sort((x, y) => y.d - x.d), h = Math.ceil(n / 2), dl = n > 1 ? avg(s.slice(0, h).map(e => e.sc)) - avg(s.slice(h).map(e => e.sc)) : 0;
  const wk = Array.from({ length: 10 }, (_, i) => { const l = d.filter(e => { const age = (Date.now() - e.d) / 864e5 / 7; return age >= 9 - i && age < 10 - i; }); return l.length ? avg(l.map(e => e.sc)) : null; });
  return { d, n, a, ps, pc, g, t, p, dl, wk, tr: Math.abs(dl) < 1.5 ? '— Stable' : dl > 0 ? '↗ Improving' : '↘ Declining', cs: CATS(d).map(c => ({ c, v: avg(d.map(e => cpv(e, c)).filter(v => v != null)) })).sort((x, y) => y.v - x.v) };
}
const wt = (x, d) => esc(x && x.title || d);
const catList = l => l.map(x => `<div class=clk onclick="goPage('cats')"><div class=row><span>${esc(x.c)}</span><b class=mono>${x.v.toFixed(1)}%</b></div>${bar(x.v, col(x.v))}</div>`).join('') || '<p class=mu style="text-align:center">✓ Nothing here</p>';
const tTxt = c => c.t ? tn(c.t) : 'All teams';
wdef('dash', 'kpi_total', 'Total evaluations', 12, (c, s, x) => kp(wt(x, 'Total evaluations'), c.n, tTxt(c), 'var(--tx)', null, `goCalls({team:'${c.t || ''}'})`), 'How many calls were reviewed');
wdef('dash', 'kpi_avg', 'Average score', 12, (c, s, x) => kp(wt(x, 'Average score'), c.n ? pc1(c.a) : '—', 'Target: ' + c.g + '%', scol(c.a, c.t || null), c.a, `goCalls({team:'${c.t || ''}'})`), 'Average score with the target');
wdef('dash', 'kpi_pass', 'Pass rate', 12, (c, s, x) => kp(wt(x, 'Pass rate'), pc1(c.pc), c.ps + ' passed', 'var(--ok)', c.pc, `goCalls({team:'${c.t || ''}',sc:{m:'pass'}})`), 'Share of reviews at or above the target');
wdef('dash', 'kpi_fail', 'Fail rate', 12, (c, s, x) => kp(wt(x, 'Fail rate'), pc1(c.n ? 100 - c.pc : 0), (c.n - c.ps) + ' failed', 'var(--bad)', c.n ? 100 - c.pc : 0, `goCalls({team:'${c.t || ''}',sc:{m:'fail'}})`), 'Share of reviews below the target');
wdef('dash', 'kpi_trend', 'Recent trend', 12, (c, s, x) => `<div class="card clk kpc" onclick="goPage('cats')"><small>${wt(x, 'Recent trend')}</small><div class=big style="font:600 22px Outfit,sans-serif">${c.tr}</div>${spark(c.wk, 120, 30)}<small>Δ ${c.dl >= 0 ? '+' : ''}${c.dl.toFixed(1)} pts</small></div>`, 'Newer reviews compared with older ones');
wdef('dash', 'kpi_flags', 'Flags', 20, (c, s, x) => { const red = c.d.filter(e => e.fl === 'red').length + QF.filter(f => f.type === 'red' && (!c.t || teamOf(f.agent) === c.t)).length, green = c.d.filter(e => e.fl === 'green').length + QF.filter(f => f.type === 'green' && (!c.t || teamOf(f.agent) === c.t)).length; return kp(wt(x, 'Flags'), `<span style="color:var(--bad)">${red}</span> · <span style="color:var(--ok)">${green}</span>`, 'red · green (reviews and quick flags)', 'var(--tx)', null, "goPage('flags')"); }, 'Red and green flags');
wdef('dash', 'kpi_disputes', 'Open disputes', 20, (c, s, x) => { const n = c.d.filter(e => e.dp && e.dp.status === 'open').length; return kp(wt(x, 'Open disputes'), n, n ? 'waiting for a decision' : 'nothing open', n ? 'var(--wn)' : 'var(--ok)', null, "goPage('disputes')"); }, 'Disputes that are not resolved');
wdef('dash', 'last5', 'Last 5 evaluated conversations', 30, (c, s, x) => card(wt(x, 'Last 5 evaluated conversations'), [...c.d].sort((p, q) => q.d - p.d).slice(0, 5).map(e => `<div class="row li clk" onclick="om('view','${e.rid}')"><div style="display:flex;gap:10px;align-items:center"><span class=av style="margin:0">${esc(ini(agn(e)))}</span><div>${lead(e)}</div></div>${sp(Math.round(e.sc * 10) / 10, e.tm)}</div>`).join('') || '<p class=mu>No evaluations yet</p>'), 'The newest reviews');
wdef('dash', 'distribution', 'Score distribution', 30, (c, s, x) => { const bs = [...new Set([0, 50, 70, c.g, 101])].sort((p, q) => p - q);
  return card(`${wt(x, 'Score distribution')} <small class=mu style="float:right;font-weight:400">${c.n} calls</small>`, bs.slice(0, -1).map((lo, i) => { const hi = bs[i + 1], k = c.d.filter(e => e.sc >= lo && e.sc < hi).length;
    return `<div class=clk onclick="goCalls({team:'${c.t || ''}',sc:{a:${lo},b:${hi}}})"><div class=row><span>${lo}-${hi > 100 ? 100 : hi - 1}%</span><b class=mono>${k} calls (${c.n ? Math.round(k / c.n * 100) : 0}%)</b></div>${bar(c.n ? k / c.n * 100 : 0, col(lo))}</div>`; }).join('')); }, 'How the scores are spread');
wdef('dash', 'strong', 'Strong categories', 30, (c, s, x) => card(`${wt(x, 'Strong categories')} ${pill('≥ ' + c.g + '%', 'ok')}`, catList(c.cs.filter(v => v.v >= c.g))), 'Categories at or above the target');
wdef('dash', 'needs', 'Categories needing improvement', 30, (c, s, x) => card(`${wt(x, 'Categories needing improvement')} ${pill('< ' + c.g + '%', 'wn')}`, c.cs.some(v => v.v < c.g) ? catList(c.cs.filter(v => v.v < c.g)) : '<p class=mu style="text-align:center">✓ Great job! Every category reaches the target.</p>'), 'Categories below the target');
wdef('dash', 'top', 'Top performers', 30, (c, s, x) => card(wt(x, 'Top performers'), agS(c.d).filter(v => v.k).sort((p, q) => q.a - p.a).slice(0, 5).map((v, i) => `<div class="row li clk" onclick="openAgent('${esc(v.u)}')"><span>#${i + 1} <b>${esc(v.n)}</b> <small>${v.k} evaluations</small></span><b class=mono style="color:${scol(v.a, v.team)}">${v.a.toFixed(1)}%</b></div>`).join('') || '<p class=mu>No data</p>'), 'The 5 best average scores');
wdef('dash', 'low', 'Agents needing support', 30, (c, s, x) => card(wt(x, 'Agents needing support'), agS(c.d).filter(v => v.k).sort((p, q) => p.a - q.a).slice(0, 5).map(v => `<div class="row li clk" onclick="openAgent('${esc(v.u)}')"><span><b>${esc(v.n)}</b> <small>${v.k} evaluations · pass ${v.p.toFixed(0)}%</small></span><b class=mono style="color:${scol(v.a, v.team)}">${v.a.toFixed(1)}%</b></div>`).join('') || '<p class=mu>No data</p>'), 'The 5 lowest average scores');
wdef('dash', 'teams', 'Teams compared', 30, (c, s, x) => card(wt(x, 'Teams compared'), TEAMS.filter(t => !t.system && (!c.t || t.id === c.t)).map(t => { const l = dashDF(c.p, t.id), a = avg(l.map(e => e.sc)); return `<div class=clk onclick="goTeam('${t.id}')"><div class=row><span><i class=dotk style="background:${t.color}"></i>${esc(t.name)} <small>${l.length} reviews</small></span><b class=mono style="color:${l.length ? scol(a, t.id) : 'var(--mu)'}">${l.length ? a.toFixed(1) + '%' : '—'}</b></div>${bar(a, l.length ? scol(a, t.id) : 'var(--bd)')}</div>`; }).join('')), 'Average score per team');
wdef('dash', 'qflags', 'Latest quick flags', 30, (c, s, x) => card(wt(x, 'Latest quick flags'), QF.filter(f => !c.t || teamOf(f.agent) === c.t).slice(0, 5).map(f => `<div class="row li clk" onclick="qfEdit('${f.id}')"><span><span class="fgv ${f.type}">${IC.flag}</span> <b class=mono>${esc(f.lead)}</b> <small>${esc(an(f.agent))} · ${f.date}</small><br><small>${esc((f.cm || '').slice(0, 70))}</small></span></div>`).join('') || '<p class=mu>No quick flags yet</p>'), 'Red and green flags given without a review');
wdef('dash', 'targets', 'Quality target & disputes', 30, (c, s, x) => card(wt(x, 'Quality target & disputes'), `<div class="card clk" onclick="goCalls()" style="margin:0 0 10px;background:color-mix(in srgb,var(--c) 12%,transparent);--c:${c.a >= c.g ? 'var(--ok)' : 'var(--bad)'}"><b>${c.a >= c.g ? `Target reached (≥ ${c.g}%)` : `Below target (< ${c.g}%)`}</b><br><small>Current average: ${c.a.toFixed(1)}%</small></div>` + (EV.filter(e => e.dp && e.dp.status === 'open').slice(0, 4).map(e => `<p class=clk style="margin:6px 0;padding:4px" onclick="om('view','${e.rid}')">• ${esc(agn(e))} disputed the review for Lead #${esc(e.id)}</p>`).join('') || '<p class=mu>No open disputes</p>')), 'Is the target reached, and open disputes');
wdef('dash', 'attention', 'Calls requiring attention', 60, (c, s, x) => card(wt(x, 'Calls requiring attention'), c.d.filter(e => !isPass(e)).sort((p, q) => p.sc - q.sc).slice(0, 5).map(e => `<div class="row li clk" onclick="om('view','${e.rid}')"><div><b>Lead ${esc(e.id)}</b> <small>${esc(agn(e))} · ${f(e.d)}</small></div>${sp(Math.round(e.sc * 10) / 10, e.tm)}</div>`).join('') || '<p class=mu>Nothing to review</p>'), 'The lowest failing calls');
wdef('dash', 'tasks', 'Tasks overview', 30, (c, s, x) => { const l = TASKS.filter(t => !t.archived && (!c.t || teamOf(t.assignee) === c.t) && (canEditWork() || t.assignee === ME.username)), st = tkStats(l); return card(wt(x, 'Tasks overview'), `<div class=wtk><div><b>${l.filter(t => t.status !== 'done').length}</b><small>open</small></div><div><b style="color:var(--wn)">${l.filter(t => t.status === 'doing' || t.status === 'review').length}</b><small>active</small></div><div><b style="color:var(--bad)">${st.over}</b><small>overdue</small></div><div><b style="color:var(--ok)">${Math.round(st.comp)}%</b><small>done</small></div></div><a href="javascript:void(0)" class=agl onclick="goPage('tasks')">Open Tasks ›</a>`); }, 'Open, active and overdue tasks');
wdef('dash', 'todo', 'Your to-do list', 60, () => myWork(), 'Your own tasks, quizzes and reading');
wdef('dash', 'coach_new', 'Latest coaching update', 60, (c, s, x) => {
  const mine = SESS.filter(z => z.agents.includes(ME.username)).sort((p, q) => (q.date || '').localeCompare(p.date || ''))[0];
  if (!mine) return card(wt(x, 'Latest coaching update'), '<p class=mu style="margin:0">No coaching or one-to-one sessions documented for you yet.</p>');
  const open = (mine.actions || []).filter(a => !a.done);
  return card(wt(x, 'Latest coaching update'), `<div class=row><span><b>${esc(mine.title)}</b> <small class=mu>${mine.date} · ${esc(mine.byName || '')}</small></span><button class=ib onclick="viewSession('${mine.id}')">Open</button></div>`
    + (mine.goals ? `<p style="margin:8px 0 0">${esc(mine.goals)}</p>` : '') + (open.length ? `<div style="margin-top:8px"><b>Your next steps</b>${open.map(a => `<div class=li>• ${esc(a.t)}${a.due ? ` <small class=mu>due ${a.due}</small>` : ''}</div>`).join('')}</div>` : '<p class=mu style="margin:8px 0 0">No open actions.</p>'));
}, 'Your newest coaching or one-to-one');
const KPIS = [['kpi_total', 12], ['kpi_avg', 12], ['kpi_pass', 12], ['kpi_fail', 12], ['kpi_trend', 12]];
DEFL.dash.all = wl(...KPIS, ['last5', 30], ['distribution', 30], ['strong', 30], ['needs', 30], ['top', 30], ['low', 30], ['attention', 60]);
DEFL.dash.lead = wl(...KPIS, ['teams', 30], ['low', 30], ['last5', 30], ['needs', 30], ['tasks', 30], ['qflags', 30], ['attention', 60]);
DEFL.dash.trainer = wl(...KPIS, ['needs', 30], ['strong', 30], ['low', 30], ['teams', 30], ['coach_new', 60, false]);
DEFL.dash.agent = wl(['kpi_avg', 15], ['kpi_pass', 15], ['kpi_fail', 15], ['kpi_trend', 15], ['coach_new', 60], ['todo', 60], ['last5', 30], ['needs', 30], ['strong', 30], ['attention', 30]);
['admin', 'qa'].forEach(r => { DEFL.dash[r] = DEFL.dash.all; });

PG.dash = function () {
  const cache = {}, ctxOf = x => { const p = (x.f && x.f.p) || P, t = (x.f && x.f.t) || T, k = p + '|' + t; THR = t ? PT(t) : PASSG(); return cache[k] = cache[k] || dashCtx(p, t); };
  try {
    const ctl = `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><div class=sg>${[['week', 'Week'], ['month', 'Month'], ['year', 'Year'], ['all', 'All Time'], ['custom', 'Custom']].map(([k, l]) => `<button class="${k === P ? 'on' : ''}" onclick="P='${k}';render()">${l}</button>`).join('')}</div>${P === 'custom' ? `<input type=date value=${DF} onchange="DF=this.value;render()"><input type=date value=${DT} onchange="DT=this.value;render()">` : ''}${ME.role === 'agent' ? '' : `<select onchange="T=this.value;render()"><option value="">All Teams</option>${TEAMS.filter(t => !t.system).map(t => `<option value="${t.id}" ${t.id === T ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select>`}</div>`;
    return head('Quality Dashboard', 'Personal overview of quality performance and quick actions',
      `<div style="display:flex;gap:8px;flex-wrap:wrap"><div class=sx style="width:290px"><span>${IC.search}</span><input class=qi style="padding-right:64px" placeholder="Search lead ID, agent, campaign…" onkeydown='if(event.key=="Enter"){Q=this.value.trim();KQ=true;location.hash="calls"}'><kbd class=kb>Ctrl K</kbd></div>${bellBtn()}<button class="ib ibx" onclick="viewHist()">${IC.clock} View history</button>${staff() ? `<button class="btn ibx" onclick="goPage('entry')">${IC.plus} New evaluation</button>` : ''}</div>`)
      + `<div class=hd style="margin-bottom:12px"><div><h2 style="margin:0;font-size:20px">Welcome back, ${esc(ME.name)} ${pill(ROLE[ME.role] || ME.role, 'ac')}</h2><p class=mu style="margin:4px 0 0">Here is a quick overview of your recent quality performance.</p></div>${ctl}</div>`
      + wBar('dash') + wGrid('dash', ctxOf);
  } finally { THR = null; }
};
