// ===================== Widgets: every card on a Home page is a widget you can move, resize, hide and add =====================
// Layouts: your own personal layout  >  the default layout of your role (set by admins)  >  the built-in default.
const WSZ = [3, 4, 6, 12], WLAB = { 3: 'Compact', 4: 'Small', 6: 'Medium', 12: 'Wide' };
const WREG = { dash: {}, autoqa: {} }, DEFL = { dash: {}, autoqa: {} };
let WE = null, WPREV = '';          // WE: the layout being edited ; WPREV: the role an admin is previewing
const wdef = (page, id, title, w, r) => { WREG[page][id] = { title, w, r }; };
const wl = (...a) => a.map(([id, size, on = true]) => ({ id, size, on }));
function layoutFor(page, role) {
  const reg = WREG[page], mine = (ME.layouts || {})[page], rl = ((SET.layouts || {})[page] || {})[role];
  const src = (!WPREV && mine) ? mine : (rl || DEFL[page][role] || DEFL[page].all);
  const seen = new Set(), out = [];
  src.forEach(x => { if (reg[x.id] && !seen.has(x.id)) { seen.add(x.id); out.push({ id: x.id, size: WSZ.includes(x.size) ? x.size : reg[x.id].w, on: x.on !== false }); } });
  Object.keys(reg).forEach(id => { if (!seen.has(id)) out.push({ id, size: reg[id].w, on: false }); });   // new widgets wait in the "Add widget" list
  return out;
}
const builtin = (page, role) => { const reg = WREG[page], src = DEFL[page][role] || DEFL[page].all, out = src.map(x => ({ ...x })); Object.keys(reg).forEach(id => { if (!out.some(x => x.id === id)) out.push({ id, size: reg[id].w, on: false }); }); return out; };
const wRoleName = r => r ? ROLE[r] : 'my own view';
function wStart(page) { const role = WPREV || ME.role; WE = { page, role, items: JSON.parse(JSON.stringify(layoutFor(page, role))), save: WPREV && ME.role === 'admin' ? WPREV : 'me' }; render(); }
const wCancel = () => { WE = null; render(); };
const wIdx = id => WE.items.findIndex(x => x.id === id);
function wMove(id, d) { const v = WE.items.filter(x => x.on), i = v.findIndex(x => x.id === id), o = v[i + d]; if (!o) return; const a = wIdx(id), b = wIdx(o.id); [WE.items[a], WE.items[b]] = [WE.items[b], WE.items[a]]; render(); }
function wSize(id, d) { const x = WE.items[wIdx(id)], k = WSZ.indexOf(x.size) + d; if (k < 0 || k >= WSZ.length) return; x.size = WSZ[k]; render(); }
const wHide = id => { WE.items[wIdx(id)].on = false; render(); };
const wAdd = id => { if (!id) return; WE.items[wIdx(id)].on = true; render(); };
const wDrag = (ev, id) => ev.dataTransfer.setData('text/plain', id);
function wDrop(ev, id) { ev.preventDefault(); const from = ev.dataTransfer.getData('text/plain'); if (!from || from === id) return render(); const a = wIdx(from), x = WE.items.splice(a, 1)[0]; WE.items.splice(wIdx(id), 0, x); render(); }
function wReset() { WE.items = builtin(WE.page, WE.role); render(); toast('Built-in layout restored. Press Save to keep it.'); }
async function wSave() {
  const e = WE, r = e.save === 'me' ? await api('/api/layout', { page: e.page, items: e.items }, 'PUT') : await api('/api/layouts/' + e.save, { page: e.page, items: e.items }, 'PUT');
  if (!r.ok) return toast(await errOf(r, 'Could not save the view'), true);
  const j = await r.json(); if (e.save === 'me') ME = j; else SET = { ...SET, layouts: j.layouts };
  WE = null; render(); toast(e.save === 'me' ? 'Your view is saved' : 'Default view of ' + ROLE[e.save] + ' saved');
}
async function wClearMine(page) { const r = await api('/api/layout', { page, reset: true, items: [] }, 'PUT'); if (r.ok) { ME = await r.json(); render(); toast('Back to the default view of your role'); } }
function wBar(page) {
  const adm = ME.role === 'admin';
  if (WE && WE.page === page) {
    const hidden = WE.items.filter(x => !x.on);
    return `<div class=wbar><b>Customizing ${wRoleName(WE.save === 'me' ? '' : WE.save)}</b><span class=mu style="font-size:13px">Drag the cards, or use the arrows and the size buttons.</span><select onchange="wAdd(this.value)"><option value="">+ Add widget (${hidden.length})</option>${hidden.map(x => `<option value="${x.id}">${esc(WREG[page][x.id].title)}</option>`).join('')}</select>${adm ? `<label style="display:flex;gap:6px;align-items:center;font-size:13px">Save as<select onchange="WE.save=this.value"><option value=me ${WE.save === 'me' ? 'selected' : ''}>My own view</option>${Object.entries(ROLE).map(([k, v]) => `<option value=${k} ${WE.save === k ? 'selected' : ''}>Default for ${v}</option>`).join('')}</select></label>` : ''}<button class=ib onclick="wReset()">Reset</button><button class=ib onclick="wCancel()">Cancel</button><button class=btn onclick="wSave()">Save</button></div>`;
  }
  return `<div class=row style="justify-content:flex-end;gap:8px;margin-bottom:12px;flex-wrap:wrap">${WPREV ? `<span class="pill wn">Previewing the ${ROLE[WPREV]} view</span>` : ''}${adm ? `<label style="display:flex;gap:6px;align-items:center;font-size:13px">View as<select onchange="WPREV=this.value==='me'?'':this.value;render()"><option value=me>Me (${ROLE[ME.role]})</option>${Object.entries(ROLE).map(([k, v]) => `<option value=${k} ${WPREV === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>` : ''}${(ME.layouts || {})[page] && !WPREV ? `<button class=ib onclick="wClearMine('${page}')">Reset my view</button>` : ''}<button class="ib ibx" onclick="wStart('${page}')">${IC.pen} Customize</button></div>`;
}
const wTb = x => `<div class=wtb><button onclick="wMove('${x.id}',-1)" title="Move earlier" aria-label="Move earlier">←</button><button onclick="wMove('${x.id}',1)" title="Move later" aria-label="Move later">→</button><small class=mu>${WLAB[x.size]}</small><button onclick="wSize('${x.id}',-1)" title="Narrower" aria-label="Narrower">−</button><button onclick="wSize('${x.id}',1)" title="Wider" aria-label="Wider">+</button><button onclick="wHide('${x.id}')" title="Hide" aria-label="Hide this card">${IC.x}</button></div>`;
function wGrid(page, ctx) {
  const items = WE && WE.page === page ? WE.items : layoutFor(page, WPREV || ME.role), reg = WREG[page], ed = WE && WE.page === page;
  return `<div class=wgrid>${items.filter(x => x.on).map(x => `<div class="wg w${x.size} ${ed ? 'edit' : ''}" ${ed ? `draggable=true ondragstart="wDrag(event,'${x.id}')" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="wDrop(event,'${x.id}')"` : ''}>${ed ? wTb(x) : ''}${reg[x.id].r(ctx, x.size)}</div>`).join('')}</div>`;
}

// ---------------------------------------------------------------- Home dashboard widgets
const kp = (t, v, s, c, b, act) => `<div class="card clk kpi" onclick="${act}"><small>${t}</small><div class=big style="color:${c}">${v}</div>${b == null ? '' : bar(b, c)}<small>${s}</small></div>`;
function dashCtx(g) {
  const d = dashD().sort((x, y) => y.d - x.d), n = d.length, a = avg(d.map(e => e.sc)), ps = d.filter(isPass).length, pc = n ? ps / n * 100 : 0, h = Math.ceil(n / 2), dl = avg(d.slice(0, h).map(e => e.sc)) - avg(d.slice(h).map(e => e.sc));
  return { d, n, a, ps, pc, g, dl, tr: Math.abs(dl) < 1.5 ? '— Stable' : dl > 0 ? '↗ Improving' : '↘ Declining', cs: CATS(d).map(c => ({ c, v: avg(d.map(e => cpv(e, c)).filter(v => v != null)) })).sort((x, y) => y.v - x.v) };
}
const catList = l => l.map(x => `<div class=clk onclick="goPage('cats')"><div class=row><span>${esc(x.c)}</span><b class=mono>${x.v.toFixed(1)}%</b></div>${bar(x.v, col(x.v))}</div>`).join('') || '<p class=mu style="margin:0">No category in this group for the selected period and team.</p>';
wdef('dash', 'kpi_total', 'Total evaluations', 3, c => kp('Total evaluations', c.n, T ? tn(T) : 'All teams', 'var(--tx)', null, 'goCalls()'));
wdef('dash', 'kpi_avg', 'Average score', 3, c => kp('Average score', c.a.toFixed(1) + '%', 'Target: ' + c.g + '%', 'var(--ok)', c.a, 'goCalls()'));
wdef('dash', 'kpi_pass', 'Pass rate', 3, c => kp('Pass rate', c.pc.toFixed(1) + '%', c.ps + ' passed', 'var(--ok)', c.pc, "goCalls({sc:{m:'pass'}})"));
wdef('dash', 'kpi_fail', 'Fail rate', 3, c => kp('Fail rate', (c.n ? 100 - c.pc : 0).toFixed(1) + '%', (c.n - c.ps) + ' failed', 'var(--bad)', c.n ? 100 - c.pc : 0, "goCalls({sc:{m:'fail'}})"));
wdef('dash', 'kpi_trend', 'Recent trend', 4, c => kp('Recent trend', c.tr, 'Δ ' + c.dl.toFixed(1) + ' pts', 'var(--tx)', null, "goPage('cats')"));
wdef('dash', 'kpi_flags', 'Flags', 4, c => { const red = c.d.filter(e => e.fl === 'red').length, green = c.d.filter(e => e.fl === 'green').length; return kp('Flags', `${red} red · ${green} green`, 'in the selected period', 'var(--tx)', null, "goPage('flags')"); });
wdef('dash', 'kpi_disputes', 'Open disputes', 4, c => { const n = c.d.filter(e => e.dp && e.dp.status === 'open').length; return kp('Open disputes', n, n ? 'waiting for a decision' : 'nothing open', n ? 'var(--wn)' : 'var(--ok)', null, "goPage('disputes')"); });
wdef('dash', 'last5', 'Last 5 evaluated conversations', 6, c => card('Last 5 evaluated conversations', [...c.d].sort((x, y) => y.d - x.d).slice(0, 5).map(e => `<div class="row li clk" onclick="om('view','${e.rid}')"><div>${lead(e)}</div>${sp(e.sc, e.tm)}</div>`).join('') || '<p class=mu>No evaluations yet</p>'));
wdef('dash', 'distribution', 'Score distribution', 6, c => { const bs = [...new Set([0, 50, 70, c.g, 101])].sort((x, y) => x - y);
  return card('Score distribution', bs.slice(0, -1).map((lo, i) => { const hi = bs[i + 1], k = c.d.filter(e => e.sc >= lo && e.sc < hi).length;
    return `<div class=clk onclick="goCalls({sc:{a:${lo},b:${hi}}})"><div class=row><span>${lo}-${hi > 100 ? 100 : hi - 1}%</span><b class=mono>${k} calls (${c.n ? Math.round(k / c.n * 100) : 0}%)</b></div>${bar(c.n ? k / c.n * 100 : 0, col(lo))}</div>`; }).join('')); });
wdef('dash', 'strong', 'Strong categories', 6, c => card(`▲ Strong categories (≥ ${c.g}%)`, catList(c.cs.filter(x => x.v >= c.g))));
wdef('dash', 'needs', 'Categories needing improvement', 6, c => card(`▼ Needs improvement (< ${c.g}%)`, catList(c.cs.filter(x => x.v < c.g))));
wdef('dash', 'top', 'Top performers', 6, c => card('Top performers', agS(c.d).filter(x => x.k).sort((x, y) => y.a - x.a).slice(0, 5).map((x, i) => `<div class="row li clk" onclick="goCalls({agent:'${esc(x.u)}'})"><span>#${i + 1} <b>${esc(x.n)}</b> <small>${x.k} evaluations</small></span><b class=mono>${x.a.toFixed(1)}%</b></div>`).join('') || '<p class=mu>No data</p>'));
wdef('dash', 'targets', 'Quality targets & disputes', 6, c => card('Quality targets & notifications', `<div class="card clk" onclick="goCalls()" style="background:color-mix(in srgb,var(--c) 12%,transparent);--c:${c.a >= c.g ? 'var(--ok)' : 'var(--bad)'}"><b>${c.a >= c.g ? `Target reached (≥ ${c.g}%)` : `Below target (< ${c.g}%)`}</b><br><small>Current average: ${c.a.toFixed(1)}%</small></div>` + (EV.filter(e => e.dp && e.dp.status === 'open').slice(0, 4).map(e => `<p class=clk style="margin:6px 0;padding:4px" onclick="om('view','${e.rid}')">• ${esc(agn(e))} disputed the review for Lead #${esc(e.id)}</p>`).join('') || '<p class=mu>No open disputes</p>')));
wdef('dash', 'attention', 'Calls requiring attention', 12, c => card('Calls requiring attention', c.d.filter(e => !isPass(e)).sort((x, y) => x.sc - y.sc).slice(0, 4).map(e => `<div class="row li clk" onclick="om('view','${e.rid}')"><div><b>Lead ${esc(e.id)}</b> <small>${esc(agn(e))} · ${f(e.d)}</small></div>${sp(e.sc, e.tm)}</div>`).join('') || '<p class=mu>Nothing to review</p>'));
wdef('dash', 'todo', 'Your to-do list', 12, () => myWork());
wdef('dash', 'coach_new', 'Latest coaching update', 12, () => {
  const mine = SESS.filter(s => s.agents.includes(ME.username) && s.kind !== 'o2o' || s.agents.includes(ME.username)).sort((x, y) => (y.date || '').localeCompare(x.date || ''))[0];
  if (!mine) return card('Latest coaching update', '<p class=mu style="margin:0">No coaching or one-to-one sessions documented for you yet.</p>');
  const open = (mine.actions || []).filter(a => !a.done);
  return card('Latest coaching update', `<div class=row><span><b>${esc(mine.title)}</b> <small class=mu>${mine.date} · ${esc(mine.byName || '')}</small></span><button class=ib onclick="goPage('${mine.kind === 'o2o' ? 'o2o' : 'coach'}')">Open</button></div>`
    + (mine.goals ? `<p style="margin:8px 0 0">${esc(mine.goals)}</p>` : '') + (open.length ? `<div style="margin-top:8px"><b>Your next steps</b>${open.map(a => `<div class=li>• ${esc(a.t)}${a.due ? ` <small class=mu>due ${a.due}</small>` : ''}</div>`).join('')}</div>` : '<p class=mu style="margin:8px 0 0">No open actions.</p>'));
});
const KPIS = [['kpi_total', 3], ['kpi_avg', 3], ['kpi_pass', 3], ['kpi_fail', 3], ['kpi_trend', 4], ['kpi_flags', 4], ['kpi_disputes', 4]];
DEFL.dash.all = wl(...KPIS, ['last5', 6], ['distribution', 6], ['strong', 6], ['needs', 6], ['top', 6], ['targets', 6], ['attention', 12], ['todo', 12, false]);
DEFL.dash.agent = wl(['coach_new', 12], ['todo', 12], ['kpi_avg', 3], ['kpi_pass', 3], ['kpi_fail', 3], ['kpi_trend', 3], ['last5', 6], ['strong', 6], ['needs', 6], ['attention', 6], ['kpi_flags', 4, false], ['kpi_disputes', 4, false], ['kpi_total', 3, false], ['distribution', 6, false], ['top', 6, false], ['targets', 6, false]);
['admin', 'qa', 'lead', 'trainer'].forEach(r => { DEFL.dash[r] = DEFL.dash.all; });

PG.dash = function () {
  const g = T ? PT(T) : PASSG(); THR = g;
  try {
    const ctx = dashCtx(g);
    const ctl = `<div style="display:flex;gap:8px;flex-wrap:wrap"><div class="seg card">${[['week', 'Week'], ['month', 'Month'], ['year', 'Year'], ['all', 'All Time'], ['custom', 'Custom']].map(([k, l]) => `<button class="${k === P ? 'on' : ''}" onclick="P='${k}';render()">${l}</button>`).join('')}</div>${P === 'custom' ? `<input type=date value=${DF} onchange="DF=this.value;render()"><input type=date value=${DT} onchange="DT=this.value;render()">` : ''}<select onchange="T=this.value;render()"><option value="">All Teams</option>${TEAMS.map(t => `<option value="${t.id}" ${t.id === T ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></div>`;
    return head('Home', 'Your quality overview. Every card is a widget: use Customize to arrange it.',
      `<div style="display:flex;gap:8px;position:relative;flex-wrap:wrap"><div class=sx style="width:400px"><span>${IC.search}</span><input class=qi placeholder="Search lead, agent or campaign… (Enter)" onkeydown='if(event.key=="Enter"){Q=this.value.trim();KQ=true;location.hash="calls"}'></div>${bellBtn()}<button class="ib ibx" onclick="viewHist()">${IC.clock} View history</button>${staff() ? `<button class="btn ibx" onclick="goPage('entry')">${IC.plus} New evaluation</button>` : ''}</div>`)
      + `<div class=hd><div><h2 style="margin:0">Welcome back, ${esc(ME.name)} ${pill(ROLE[ME.role] || ME.role, 'ac')}</h2><p class=mu style="margin:4px 0 0">Here is a quick overview of your recent quality performance.</p></div>${ctl}</div>`
      + wBar('dash') + wGrid('dash', ctx);
  } finally { THR = null; }
};
