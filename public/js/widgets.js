// ===================== Widgets and dashboard views =====================
// Every card on Home and AutoQA is a widget. There is no special "edit mode":
//   • hover a widget: ⠿ drag it, ⚙ settings (title, review type, team, period, width), ✕ remove (with Undo)
//   • "+ Add widget" opens the gallery; "Display" opens a panel with the whole list (show/hide, order, width, view name, sharing)
//   • every change is saved at once.
// Views: "Standard" (your own version > the default of your role set by an admin > built in), plus named views:
//   personal views (only you) and shared views (made by admins / QA, shown to chosen roles or to everyone).
const WSZ = [12, 15, 20, 30, 40, 60], WLAB = { 12: '1/5', 15: '1/4', 20: '1/3', 30: '1/2', 40: '2/3', 60: 'Full width' }, LEG = { 3: 15, 4: 20, 6: 30, 12: 60 };
const WREG = { dash: {}, autoqa: {} }, DEFL = { dash: {}, autoqa: {} };
let WE = null, WPREV = '', WSET = null, WADD = null, WDISP = null, WUNDO = null;   // WSET = widget being set up, WADD / WDISP = page whose gallery / panel is open
const wdef = (page, id, title, w, r, desc = '', grp = 'More') => { WREG[page][id] = { title, w, r, desc, grp }; };
const wl = (...a) => a.map(([id, size, on = true]) => ({ k: id, id, size, on }));
const wNorm = x => ({ ...x, k: x.k || x.id, size: x.k ? (WSZ.includes(x.size) ? x.size : 30) : (LEG[x.size] || (WSZ.includes(x.size) ? x.size : 30)) });   // old layouts (no k) used a 12-column grid
const canShare = () => ['admin', 'qa'].includes(ME.role);
const ROLESEL = [['all', 'Everyone'], ...Object.entries(ROLE)];
const PERN = { week: 'Week', month: 'Month', year: 'Year', all: 'All time' };

// ---- which widgets a view shows
function stdLayout(page, role) {
  const reg = WREG[page], mine = (ME.layouts || {})[page], rl = ((SET.layouts || {})[page] || {})[role];
  return ((!WPREV && mine) ? mine : (rl || DEFL[page][role] || DEFL[page].all)).map(wNorm).filter(x => reg[x.id]);
}
const builtin = (page, role) => (DEFL[page][role] || DEFL[page].all).map(wNorm).filter(x => x.on !== false);
const sharedViews = page => ((SET.views || {})[page] || []);
const myViews = page => ((ME.views || {})[page] || []);
const viewsFor = page => { const r = WPREV || ME.role; return [{ id: 'std', name: 'Standard', kind: 'std' }, ...sharedViews(page).filter(v => canShare() && !WPREV || v.roles.includes('all') || v.roles.includes(r)).map(v => ({ ...v, kind: 'shared' })), ...(WPREV ? [] : myViews(page).map(v => ({ ...v, kind: 'mine' })))]; };
const curView = page => { const l = viewsFor(page), id = LS.get('qa_view_' + page, ''); return l.find(v => v.id === id) || l.find(v => v.kind === 'shared' && !canShare()) || l[0]; };
const itemsOf = (page, v) => v.kind === 'std' ? stdLayout(page, WPREV || ME.role) : (v.items || []).map(wNorm).filter(x => WREG[page][x.id]);
const canEditView = page => { const v = curView(page); return !WPREV && (v.kind !== 'shared' || canShare()); };
const setView = (page, id) => { LS.set('qa_view_' + page, id); render(); };

// ---- saving: every change goes straight into the view you are looking at (you can undo the last one)
async function wCommit(page, items, msg, patch = {}) {
  const v = curView(page), before = { page, vid: v.id, items: itemsOf(page, v), name: v.name, roles: v.roles };
  items = items.map(x => ({ ...x, on: x.on !== false }));
  let req;
  if (v.kind === 'std') { ME = { ...ME, layouts: { ...(ME.layouts || {}), [page]: items } }; req = api('/api/layout', { page, items }, 'PUT').then(async r => { if (r.ok) ME = await r.json(); return r; }); }
  else if (v.kind === 'mine') { const views = myViews(page).map(x => x.id === v.id ? { ...x, ...patch, items } : x); ME = { ...ME, views: { ...(ME.views || {}), [page]: views } }; req = api('/api/views', { page, views }, 'PUT').then(async r => { if (r.ok) ME = await r.json(); return r; }); }
  else { const views = sharedViews(page).map(x => x.id === v.id ? { ...x, ...patch, items } : x); SET = { ...SET, views: { ...(SET.views || {}), [page]: views } }; req = api('/api/shared-views', { page, views }, 'PUT').then(async r => { if (r.ok) SET = await r.json(); return r; }); }
  WUNDO = { ...before, msg }; render(); undoBar(msg);
  const r = await req; if (!r.ok) toast(await errOf(r, 'Could not save the change'), true);
}
function undoBar(msg) { if (!msg) return; let b = $('#wundo'); if (!b) { b = document.createElement('div'); b.id = 'wundo'; document.body.appendChild(b); } b.className = 'wundo'; b.innerHTML = `<span>${esc(msg)}</span><button onclick="wUndo()">Undo</button>`; clearTimeout(undoBar.t); undoBar.t = setTimeout(() => b.remove(), 6000); }
async function wUndo() { const u = WUNDO; if (!u) return; WUNDO = null; const b = $('#wundo'); if (b) b.remove(); LS.set('qa_view_' + u.page, u.vid); await wCommit(u.page, u.items, '', u.vid === 'std' ? {} : { name: u.name, ...(u.roles ? { roles: u.roles } : {}) }); WUNDO = null; const b2 = $('#wundo'); if (b2) b2.remove(); toast('Change undone'); }
const wGet = page => JSON.parse(JSON.stringify(itemsOf(page, curView(page))));
const wIdxIn = (l, k) => l.findIndex(x => x.k === k);
function wMove(page, k, d) { const l = wGet(page), i = wIdxIn(l, k), j = i + d; if (i < 0 || j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; wCommit(page, l, 'Widget moved'); }
function wSizeSet(page, k, v) { const l = wGet(page); l[wIdxIn(l, k)].size = +v; wCommit(page, l, 'Width changed'); }
function wShow(page, k, on) { const l = wGet(page); l[wIdxIn(l, k)].on = on; wCommit(page, l, on ? 'Widget shown' : 'Widget hidden'); }
function wDel(page, k) { const l = wGet(page), x = l[wIdxIn(l, k)]; wCommit(page, l.filter(z => z.k !== k), `"${(x && x.title) || WREG[page][x.id].title}" removed`); }
function wAdd(page, id) { const r = WREG[page][id], l = wGet(page); l.unshift({ k: id + '-' + Math.random().toString(36).slice(2, 6), id, size: r.w, on: true }); WADD = null; wCommit(page, l, r.title + ' added at the top'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
// drag and drop: grab the ⠿ handle of a card (or a row in the Display panel) and drop it on another one
let WDRAG = null;
const wGrip = (page, k) => `onmousedown="this.closest('[data-wk]').draggable=true" onmouseup="this.closest('[data-wk]').draggable=false"`;
function wDragStart(ev, page, k) { WDRAG = { page, k }; ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', k); }
function wDropOn(ev, page, k) { ev.preventDefault(); ev.currentTarget.classList.remove('over'); const d = WDRAG; WDRAG = null; if (!d || d.page !== page || d.k === k) return; const l = wGet(page), x = l.splice(wIdxIn(l, d.k), 1)[0]; l.splice(wIdxIn(l, k), 0, x); wCommit(page, l, 'Widget moved'); }
const wDnD = (page, k) => `data-wk="${k}" ondragstart="wDragStart(event,'${page}','${k}')" ondragend="this.draggable=false" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="wDropOn(event,'${page}','${k}')"`;

// ---- views: new, copy, rename, share, delete, admin default
function wNewView(page, from) {
  openForm({ title: 'New view', w: 520, yes: 'Create view', d: { name: '', from: from || 'current', roles: [] },
    fields: [{ k: 'name', l: 'Name', req: 1, ph: 'e.g. Team leads, My agents, Chats' }, { k: 'from', l: 'Start from', t: 'select', o: [['current', 'A copy of the view I am looking at'], ['builtin', 'The standard widgets'], ['empty', 'An empty page (add your own widgets)']] }, ...(canShare() ? [{ k: 'roles', l: 'Also show it to (leave empty for a personal view)', t: 'multi', o: ROLESEL }] : [])],
    save: async d => {
      if (!d.name.trim()) return 'Give the view a name';
      const id = 'v' + Date.now().toString(36), items = d.from === 'empty' ? [] : d.from === 'builtin' ? builtin(page, ME.role) : wGet(page), v = { id, name: d.name.trim(), items };
      if (canShare() && (d.roles || []).length) { const r = await api('/api/shared-views', { page, views: [...sharedViews(page), { ...v, roles: d.roles, by: ME.name }] }, 'PUT'); if (!r.ok) return errOf(r, 'Could not create the view'); SET = await r.json(); }
      else { const r = await api('/api/views', { page, views: [...myViews(page), v] }, 'PUT'); if (!r.ok) return errOf(r, 'Could not create the view'); ME = await r.json(); }
      LS.set('qa_view_' + page, id); WDISP = page; toast(`View "${v.name}" created`);
    } });
}
async function wViewPatch(page, patch, msg) { const v = curView(page); if (v.kind === 'std') return; await wCommit(page, wGet(page), msg, patch); }
async function wShare(page, r) {
  const v = curView(page); let roles = [...(v.roles || [])];
  if (r === 'all') roles = roles.includes('all') ? [] : ['all']; else { roles = roles.filter(x => x !== 'all'); roles = roles.includes(r) ? roles.filter(x => x !== r) : [...roles, r]; }
  const items = wGet(page);
  if (v.kind === 'mine' && roles.length) {            // a personal view becomes shared
    const r1 = await api('/api/shared-views', { page, views: [...sharedViews(page), { id: v.id, name: v.name, items, roles, by: ME.name }] }, 'PUT'); if (!r1.ok) return toast(await errOf(r1, 'Could not share'), true); SET = await r1.json();
    const r2 = await api('/api/views', { page, views: myViews(page).filter(x => x.id !== v.id) }, 'PUT'); if (r2.ok) ME = await r2.json(); render(); return toast('Shared');
  }
  if (v.kind === 'shared' && !roles.length) {         // nobody else: it becomes your personal view again
    const r1 = await api('/api/views', { page, views: [...myViews(page), { id: v.id, name: v.name, items }] }, 'PUT'); if (!r1.ok) return toast(await errOf(r1, 'Could not save'), true); ME = await r1.json();
    const r2 = await api('/api/shared-views', { page, views: sharedViews(page).filter(x => x.id !== v.id) }, 'PUT'); if (r2.ok) SET = await r2.json(); render(); return toast('Now a personal view');
  }
  wViewPatch(page, { roles }, 'Sharing changed');
}
const wDelView = page => { const v = curView(page); ask('Delete this view?', `"${v.name}" is removed${v.kind === 'shared' ? ' for everybody it was shared with' : ''}. The Standard view stays.`, async () => {
  if (v.kind === 'shared') { const r = await api('/api/shared-views', { page, views: sharedViews(page).filter(x => x.id !== v.id) }, 'PUT'); if (r.ok) SET = await r.json(); }
  else { const r = await api('/api/views', { page, views: myViews(page).filter(x => x.id !== v.id) }, 'PUT'); if (r.ok) ME = await r.json(); }
  LS.set('qa_view_' + page, 'std'); WDISP = null; render(); toast('View deleted');
}, { yes: 'Yes, delete', no: 'Cancel', danger: true }); };
async function wRoleDefault(page, role) { if (!role) return; const r = await api('/api/layouts/' + role, { page, items: wGet(page) }, 'PUT'); if (!r.ok) return toast(await errOf(r, 'Could not save'), true); const j = await r.json(); SET = { ...SET, layouts: j.layouts }; toast(`This layout is now the Standard view of every ${ROLE[role]}`); }
async function wResetStd(page) { const r = await api('/api/layout', { page, reset: true, items: [] }, 'PUT'); if (r.ok) { ME = await r.json(); render(); toast('Standard view reset to the default of your role'); } }

// ---- the bar above the widgets
function wBar(page) {
  const l = viewsFor(page), cv = curView(page), ed = canEditView(page), adm = ME.role === 'admin';
  return `<div class=wvbar><div class=wvt>${l.map(v => `<button class="${v.id === cv.id ? 'on' : ''}" onclick="setView('${page}','${v.id}')" title="${v.kind === 'shared' ? 'Shared with ' + esc(v.roles.map(r => r === 'all' ? 'everyone' : ROLE[r]).join(', ')) + (v.by ? ' · by ' + esc(v.by) : '') : v.kind === 'mine' ? 'Only you see this view' : 'The standard view of your role'}">${v.kind === 'shared' ? TIC.team : ''}${esc(v.name)}</button>`).join('')}<button class=wvn2 onclick="wNewView('${page}')" title="Make a new view">${IC.plus} New view</button></div>`
    + `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${WPREV ? `<span class="pill wn">Previewing as ${ROLE[WPREV]}</span>` : ''}${adm ? `<select title="See the page as another role" onchange="WPREV=this.value==='me'?'':this.value;render()"><option value=me>View as: me</option>${Object.entries(ROLE).map(([k, v]) => `<option value=${k} ${WPREV === k ? 'selected' : ''}>View as: ${v}</option>`).join('')}</select>` : ''}`
    + (ed ? `<button class="ib ibx" onclick="WADD='${page}';render()">${IC.plus} Add widget</button><button class="ib ibx" onclick="WDISP='${page}';render()">${TIC.list || IC.list} Display</button>` : cv.kind === 'shared' ? `<button class="ib ibx" onclick="wNewView('${page}')" title="Make your own copy you can change">${IC.plus} Make my own copy</button>` : '') + `</div></div>`;
}
const wTb = (x, page) => `<div class=wtb2><span class=wgrip title="Drag to move" ${wGrip(page, x.k)}>⠿</span><button onclick="WSET={page:'${page}',k:'${x.k}'};render()" title="Settings: title, filters, width">⚙</button><button onclick="wDel('${page}','${x.k}')" title="Remove this widget">✕</button></div>`;
const wFilt = x => x.f && (x.f.t || x.f.p || x.f.c) ? `<span class=wfc title="This widget has its own filter">${[x.f.c ? CHP[x.f.c] : '', x.f.t ? tn(x.f.t) : '', x.f.p ? PERN[x.f.p] : ''].filter(Boolean).join(' · ')}</span>` : '';
function wGrid(page, ctxOf) {
  const items = itemsOf(page, curView(page)).filter(x => x.on !== false), reg = WREG[page], ed = canEditView(page);
  if (!items.length) return `<div class="agem wempty"><b>This view has no widgets yet.</b>${ed ? `<br><button class=btn style="margin-top:12px" onclick="WADD='${page}';render()">${IC.plus} Add a widget</button>` : ''}</div>`;
  return `<div class=wgrid>${items.map(x => `<div class="wg w${x.size} ${ed ? 'ed' : ''}" ${ed ? wDnD(page, x.k) : ''}>${ed ? wTb(x, page) : ''}${wFilt(x)}${reg[x.id].r(typeof ctxOf === 'function' ? ctxOf(x) : ctxOf, x.size, x)}</div>`).join('')}</div>`;
}

// ---- gallery, widget settings, Display panel
const WADDM = () => { const page = WADD, reg = WREG[page], on = wGet(page), grps = [...new Set(Object.values(reg).map(r => r.grp))];
  return OVL(`<div class=mh><div><h2>Add a widget</h2><small>Click a card to put it at the top of this view. You can add the same widget twice with different filters.</small></div>${X('WADD=null;render()')}</div><div class=mb>${grps.map(gn => `<div class=cap style="margin-top:4px">${esc(gn.toUpperCase())}</div><div class=wgal>${Object.entries(reg).filter(([, r]) => r.grp === gn).map(([id, r]) => `<button class=wgi onclick="wAdd('${page}','${id}')"><b>${esc(r.title)}</b><small>${esc(r.desc || '')}</small><span style="display:flex;gap:6px;flex-wrap:wrap"><span class=tkch>${WLAB[r.w]}</span>${on.some(x => x.id === id) ? '<span class="tkch" style="--c:var(--ok)">✓ on this view</span>' : ''}</span></button>`).join('')}</div>`).join('')}</div>`, 'WADD=null;render()', 860, 60); };
const WSETM = () => { const { page, k } = WSET, l = wGet(page), x = l[wIdxIn(l, k)]; if (!x) { WSET = null; return ''; } const r = WREG[page][x.id], fl = x.f || {}, dash = page === 'dash';
  return OVL(`<div class=mh><div><h2>Widget settings</h2><small>${esc(r.title)}</small></div>${X('WSET=null;render()')}</div><div class=mb><div class=form style="max-width:none">
<label>Title<input id=wst value="${esc(x.title || '')}" placeholder="${esc(r.title)}"></label>
${dash ? `<label>Review type<select id=wsc><option value="">Same as the page filter</option>${CHS.map(c => `<option value=${c} ${fl.c === c ? 'selected' : ''}>${CHP[c]}</option>`).join('')}</select></label>
<div class=eg2><label>Team<select id=wstm><option value="">Same as the page filter</option>${TEAMS.filter(t => !t.system).map(t => `<option value="${t.id}" ${fl.t === t.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></label><label>Period<select id=wsp><option value="">Same as the page filter</option>${Object.entries(PERN).map(([p, n]) => `<option value=${p} ${fl.p === p ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>` : ''}
<label>Width<select id=wsw>${WSZ.map(s => `<option value=${s} ${x.size === s ? 'selected' : ''}>${WLAB[s]}</option>`).join('')}</select></label></div>
<div style="display:flex;justify-content:flex-end;gap:8px"><button class=ib onclick="WSET=null;render()">Cancel</button><button class=btn onclick="wSetSave()">Save</button></div></div>`, 'WSET=null;render()', 520, 60); };
function wSetSave() { const { page, k } = WSET, l = wGet(page), x = l[wIdxIn(l, k)], v = id => ($('#' + id) || {}).value || ''; x.title = v('wst').trim() || undefined; x.size = +v('wsw') || x.size; if (page === 'dash') x.f = { c: v('wsc'), t: v('wstm'), p: v('wsp') }; WSET = null; wCommit(page, l, 'Widget settings saved'); }
const WDISPM = () => { const page = WDISP, v = curView(page), l = wGet(page), reg = WREG[page], adm = ME.role === 'admin';
  return `<div class=wdov onclick="if(event.target==this){WDISP=null;render()}"><aside class=wdp><div class=mh><div><h2>Display</h2><small>${esc(v.name)} view · changes are saved at once</small></div>${X('WDISP=null;render()')}</div><div class=mb>`
    + (v.kind === 'std' ? `<p class=mu style="margin:0">This is your <b>Standard</b> view. Make a <a href="javascript:void(0)" class=agl onclick="WDISP=null;wNewView('${page}')">new view</a> to keep several layouts.</p>`
      : `<label>View name<input value="${esc(v.name)}" onchange="wViewPatch('${page}',{name:this.value.trim()||'My view'},'View renamed')"></label>`)
    + (v.kind !== 'std' && canShare() ? `<div><b style="font-size:12px">Who sees this view</b><div class=tkchips style="margin-top:6px">${ROLESEL.map(([r, n]) => `<button class="tkcp ${(v.roles || []).includes(r) ? 'on' : ''}" onclick="wShare('${page}','${r}')">${n}</button>`).join('')}</div><small class=mu>${(v.roles || []).length ? '' : 'Only you — a personal view'}</small></div>` : '')
    + (page === 'dash' ? `<div><b style="font-size:12px">Charts over time are grouped by</b><div class=sg style="margin-top:6px;display:inline-flex">${[['day', 'Day'], ['week', 'Week'], ['month', 'Month'], ['quarter', 'Quarter']].map(([k, n]) => `<button class="${DGR === k ? 'on' : ''}" onclick="DGR='${k}';LS.set('qa_dgr',DGR);render()">${n}</button>`).join('')}</div></div>` : '')
    + `<div class=row><b>Widgets (${l.length})</b><button class="ib ibx" onclick="WADD='${page}';render()">${IC.plus} Add widget</button></div><small class=mu>Drag the rows to change the order. Untick to hide a widget without deleting it.</small>`
    + `<div class=wdl>${l.map(x => `<div class=wdr ${wDnD(page, x.k)}><span class=wgrip ${wGrip(page, x.k)} title="Drag">⠿</span><input type=checkbox ${x.on !== false ? 'checked' : ''} onchange="wShow('${page}','${x.k}',this.checked)" title="Show / hide"><span class=wdn>${esc(x.title || reg[x.id].title)}${wFilt(x).replace('wfc', 'wfc in')}</span><select onchange="wSizeSet('${page}','${x.k}',this.value)" title="Width">${WSZ.map(s => `<option value=${s} ${x.size === s ? 'selected' : ''}>${WLAB[s]}</option>`).join('')}</select><button class=ic onclick="WSET={page:'${page}',k:'${x.k}'};render()" title="Settings">⚙</button><button class=ic onclick="wDel('${page}','${x.k}')" title="Remove">✕</button></div>`).join('') || '<p class=mu>No widgets yet.</p>'}</div>`
    + `<div class=wdfoot>${v.kind === 'std' ? ((ME.layouts || {})[page] ? `<button class=ib onclick="wResetStd('${page}')">Reset to my role's default</button>` : '') : `<button class=ib onclick="WDISP=null;wNewView('${page}')">Duplicate</button><button class=ib style="color:var(--bad)" onclick="wDelView('${page}')">${IC.bin} Delete view</button>`}${adm ? `<select onchange="wRoleDefault('${page}',this.value);this.value=''"><option value="">Use as Standard view for…</option>${Object.entries(ROLE).map(([r, n]) => `<option value=${r}>Everyone who is ${n}</option>`).join('')}</select>` : ''}</div></div></aside></div>`;
};
const wF = () => {};   // (kept for old links)

// ---------------------------------------------------------------- Home dashboard widgets
const kp = (t, v, s, c, b, act) => `<div class="card clk kpi kpc" onclick="${act}"><small>${t}</small><div class=big style="color:${c}">${v}</div>${b == null ? '' : bar(b, c)}<small>${s}</small></div>`;
const pc1 = v => v.toFixed(1) + '<small class=kps>%</small>';
let DCH = '';                                  // review type shown on the dashboard ('' = all types)
let DRV = '', DSC = '', DAG = '', DGR = LS.get('qa_dgr', 'week');   // dashboard filters: reviewer, scorecard, agent; DGR = date grouping of the charts over time
const dashDF = (p, t, c) => EV.filter(e => (!t || e.tm === t) && (!c || chOf(e) === c) && (!DRV || e.by === DRV) && (!DSC || e.scid === DSC) && (!DAG || e.agent === DAG) && (p === 'all' || (p === 'custom' ? e.d >= new Date(DF + 'T00:00:00') && e.d <= new Date(DT + 'T23:59:59') : (Date.now() - e.d) / 864e5 <= { week: 7, month: 30, year: 365 }[p])));
function dashCtx(p, t, ch) {
  const g = t ? PT(t) : PASSG(), d = dashDF(p, t, ch), n = d.length, a = avg(d.map(e => e.sc)), ps = d.filter(isPass).length, pc = n ? ps / n * 100 : 0, s = [...d].sort((x, y) => y.d - x.d), h = Math.ceil(n / 2), dl = n > 1 ? avg(s.slice(0, h).map(e => e.sc)) - avg(s.slice(h).map(e => e.sc)) : 0;
  const wk = Array.from({ length: 10 }, (_, i) => { const l = d.filter(e => { const age = (Date.now() - e.d) / 864e5 / 7; return age >= 9 - i && age < 10 - i; }); return l.length ? avg(l.map(e => e.sc)) : null; });
  return { d, n, a, ps, pc, g, t, p, c: ch || '', dl, wk, tr: Math.abs(dl) < 1.5 ? '— Stable' : dl > 0 ? '↗ Improving' : '↘ Declining', cs: CATS(d).map(c => ({ c, v: avg(d.map(e => cpv(e, c)).filter(v => v != null)) })).sort((x, y) => y.v - x.v) };
}
const wt = (x, d) => esc(x && x.title || d);
const catList = l => l.map(x => `<div class=clk onclick="goPage('cats')"><div class=row><span>${esc(x.c)}</span><b class=mono>${x.v.toFixed(1)}%</b></div>${bar(x.v, col(x.v))}</div>`).join('') || '<p class=mu style="text-align:center">✓ Nothing here</p>';
const tTxt = c => c.t ? tn(c.t) : 'All teams';
wdef('dash', 'kpi_total', 'Total evaluations', 12, (c, s, x) => kp(wt(x, 'Total evaluations'), c.n, tTxt(c), 'var(--tx)', null, `goCalls({ch:'${c.c}',team:'${c.t || ''}'})`), 'How many calls were reviewed');
wdef('dash', 'kpi_avg', 'Average score', 12, (c, s, x) => kp(wt(x, 'Average score'), c.n ? pc1(c.a) : '—', 'Target: ' + c.g + '%', scol(c.a, c.t || null), c.a, `goCalls({ch:'${c.c}',team:'${c.t || ''}'})`), 'Average score with the target');
wdef('dash', 'kpi_pass', 'Pass rate', 12, (c, s, x) => kp(wt(x, 'Pass rate'), pc1(c.pc), c.ps + ' passed', 'var(--ok)', c.pc, `goCalls({ch:'${c.c}',team:'${c.t || ''}',sc:{m:'pass'}})`), 'Share of reviews at or above the target');
wdef('dash', 'kpi_fail', 'Fail rate', 12, (c, s, x) => kp(wt(x, 'Fail rate'), pc1(c.n ? 100 - c.pc : 0), (c.n - c.ps) + ' failed', 'var(--bad)', c.n ? 100 - c.pc : 0, `goCalls({ch:'${c.c}',team:'${c.t || ''}',sc:{m:'fail'}})`), 'Share of reviews below the target');
wdef('dash', 'kpi_trend', 'Recent trend', 12, (c, s, x) => `<div class="card clk kpi kpc" onclick="goPage('cats')"><small>${wt(x, 'Recent trend')}</small><div class=big style="font:600 22px var(--font-d)">${c.tr}</div>${spark(c.wk, 120, 30)}<small>Δ ${c.dl >= 0 ? '+' : ''}${c.dl.toFixed(1)} pts</small></div>`, 'Newer reviews compared with older ones');
wdef('dash', 'kpi_flags', 'Flags', 20, (c, s, x) => { const red = c.d.filter(e => e.fl === 'red').length + QF.filter(f => f.type === 'red' && (!c.t || teamOf(f.agent) === c.t)).length, green = c.d.filter(e => e.fl === 'green').length + QF.filter(f => f.type === 'green' && (!c.t || teamOf(f.agent) === c.t)).length; return kp(wt(x, 'Flags'), `<span style="color:var(--bad)">${red}</span> · <span style="color:var(--ok)">${green}</span>`, 'red · green (reviews and quick flags)', 'var(--tx)', null, "goPage('flags')"); }, 'Red and green flags');
wdef('dash', 'kpi_disputes', 'Open disputes', 20, (c, s, x) => { const n = c.d.filter(e => e.dp && e.dp.status === 'open').length; return kp(wt(x, 'Open disputes'), n, n ? 'waiting for a decision' : 'nothing open', n ? 'var(--wn)' : 'var(--ok)', null, "goPage('disputes')"); }, 'Disputes that are not resolved');
wdef('dash', 'last5', 'Last 5 evaluated conversations', 30, (c, s, x) => card(wt(x, 'Last 5 evaluated conversations'), [...c.d].sort((p, q) => q.d - p.d).slice(0, 5).map(e => `<div class="row li clk" onclick="om('view','${e.rid}')"><div style="display:flex;gap:10px;align-items:center"><span class=av style="margin:0">${esc(ini(agn(e)))}</span><div>${lead(e)} ${chTag(chOf(e), 1)}</div></div>${sp(Math.round(e.sc * 10) / 10, e.tm)}</div>`).join('') || '<p class=mu>No evaluations yet</p>'), 'The newest reviews');
wdef('dash', 'distribution', 'Score distribution', 30, (c, s, x) => { const bs = [...new Set([0, 50, 70, c.g, 101])].sort((p, q) => p - q);
  return card(`${wt(x, 'Score distribution')} <small class=mu style="float:right;font-weight:400">${c.n} reviews</small>`, bs.slice(0, -1).map((lo, i) => { const hi = bs[i + 1], k = c.d.filter(e => e.sc >= lo && e.sc < hi).length;
    return `<div class=clk onclick="goCalls({ch:'${c.c}',team:'${c.t || ''}',sc:{a:${lo},b:${hi}}})"><div class=row><span>${lo}-${hi > 100 ? 100 : hi - 1}%</span><b class=mono>${k} reviews (${c.n ? Math.round(k / c.n * 100) : 0}%)</b></div>${bar(c.n ? k / c.n * 100 : 0, col(lo))}</div>`; }).join('')); }, 'How the scores are spread');
wdef('dash', 'strong', 'Strong categories', 30, (c, s, x) => card(`${wt(x, 'Strong categories')} ${pill('≥ ' + c.g + '%', 'ok')}`, catList(c.cs.filter(v => v.v >= c.g))), 'Categories at or above the target');
wdef('dash', 'needs', 'Categories needing improvement', 30, (c, s, x) => card(`${wt(x, 'Categories needing improvement')} ${pill('< ' + c.g + '%', 'wn')}`, c.cs.some(v => v.v < c.g) ? catList(c.cs.filter(v => v.v < c.g)) : '<p class=mu style="text-align:center">✓ Great job! Every category reaches the target.</p>'), 'Categories below the target');
wdef('dash', 'top', 'Top performers', 30, (c, s, x) => card(wt(x, 'Top performers'), agS(c.d).filter(v => v.k).sort((p, q) => q.a - p.a).slice(0, 5).map((v, i) => `<div class="row li clk" onclick="openAgent('${esc(v.u)}')"><span>#${i + 1} <b>${esc(v.n)}</b> <small>${v.k} evaluations</small></span><b class=mono style="color:${scol(v.a, v.team)}">${v.a.toFixed(1)}%</b></div>`).join('') || '<p class=mu>No data</p>'), 'The 5 best average scores');
wdef('dash', 'low', 'Agents needing support', 30, (c, s, x) => card(wt(x, 'Agents needing support'), agS(c.d).filter(v => v.k).sort((p, q) => p.a - q.a).slice(0, 5).map(v => `<div class="row li clk" onclick="openAgent('${esc(v.u)}')"><span><b>${esc(v.n)}</b> <small>${v.k} evaluations · pass ${v.p.toFixed(0)}%</small></span><b class=mono style="color:${scol(v.a, v.team)}">${v.a.toFixed(1)}%</b></div>`).join('') || '<p class=mu>No data</p>'), 'The 5 lowest average scores');
wdef('dash', 'teams', 'Teams compared', 30, (c, s, x) => card(wt(x, 'Teams compared'), TEAMS.filter(t => !t.system && (!c.t || t.id === c.t)).map(t => { const l = dashDF(c.p, t.id, c.c), a = avg(l.map(e => e.sc)); return `<div class=clk onclick="goTeam('${t.id}')"><div class=row><span><i class=dotk style="background:${t.color}"></i>${esc(t.name)} <small>${l.length} reviews</small></span><b class=mono style="color:${l.length ? scol(a, t.id) : 'var(--mu)'}">${l.length ? a.toFixed(1) + '%' : '—'}</b></div>${bar(a, l.length ? scol(a, t.id) : 'var(--bd)')}</div>`; }).join('')), 'Average score per team');
wdef('dash', 'qflags', 'Latest quick flags', 30, (c, s, x) => card(wt(x, 'Latest quick flags'), QF.filter(f => !c.t || teamOf(f.agent) === c.t).slice(0, 5).map(f => `<div class="row li clk" onclick="qfEdit('${f.id}')"><span><span class="fgv ${f.type}">${IC.flag}</span> <b class=mono>${esc(f.lead)}</b> <small>${esc(an(f.agent))} · ${f.date}</small><br><small>${esc((f.cm || '').slice(0, 70))}</small></span></div>`).join('') || '<p class=mu>No quick flags yet</p>'), 'Red and green flags given without a review');
wdef('dash', 'targets', 'Quality target & disputes', 30, (c, s, x) => card(wt(x, 'Quality target & disputes'), `<div class="card clk" onclick="goCalls()" style="margin:0 0 10px;background:color-mix(in srgb,var(--c) 12%,transparent);--c:${c.a >= c.g ? 'var(--ok)' : 'var(--bad)'}"><b>${c.a >= c.g ? `Target reached (≥ ${c.g}%)` : `Below target (< ${c.g}%)`}</b><br><small>Current average: ${c.a.toFixed(1)}%</small></div>` + (EV.filter(e => e.dp && e.dp.status === 'open').slice(0, 4).map(e => `<p class=clk style="margin:6px 0;padding:4px" onclick="om('view','${e.rid}')">• ${esc(agn(e))} disputed the review for Lead #${esc(e.id)}</p>`).join('') || '<p class=mu>No open disputes</p>')), 'Is the target reached, and open disputes');
wdef('dash', 'channels', 'Review types compared', 30, (c, s, x) => { const l = dashDF(c.p, c.t, ''), used = CHS.filter(k => l.some(e => chOf(e) === k));
  return card(wt(x, 'Review types compared'), used.map(k => { const z = l.filter(e => chOf(e) === k), a = avg(z.map(e => e.sc)), ps = z.filter(isPass).length; return `<div class=clk onclick="goCalls({ch:'${k}',team:'${c.t || ''}'})"><div class=row><span>${chTag(k)} <small>${z.length} reviews · pass ${Math.round(ps / z.length * 100)}%</small></span><b class=mono style="color:${scol(a, c.t || null)}">${a.toFixed(1)}%</b></div>${bar(a, CHC[k])}</div>`; }).join('') || '<p class=mu>No reviews yet</p>'); }, 'Calls, chats, emails and other: count, average and pass rate');
wdef('dash', 'attention', 'Reviews requiring attention', 60, (c, s, x) => card(wt(x, 'Reviews requiring attention'), c.d.filter(e => !isPass(e)).sort((p, q) => p.sc - q.sc).slice(0, 5).map(e => `<div class="row li clk" onclick="om('view','${e.rid}')"><div><b>Lead ${esc(e.id)}</b> <small>${esc(agn(e))} · ${f(e.d)}</small></div>${sp(Math.round(e.sc * 10) / 10, e.tm)}</div>`).join('') || '<p class=mu>Nothing to review</p>'), 'The lowest failing calls');
wdef('dash', 'tasks', 'Tasks overview', 30, (c, s, x) => { const l = TASKS.filter(t => !t.archived && (!c.t || teamOf(t.assignee) === c.t) && (canEditWork() || t.assignee === ME.username)), st = tkStats(l); return card(wt(x, 'Tasks overview'), `<div class=wtk><div><b>${l.filter(t => t.status !== 'done').length}</b><small>open</small></div><div><b style="color:var(--wn)">${l.filter(t => t.status === 'doing' || t.status === 'review').length}</b><small>active</small></div><div><b style="color:var(--bad)">${st.over}</b><small>overdue</small></div><div><b style="color:var(--ok)">${Math.round(st.comp)}%</b><small>done</small></div></div><a href="javascript:void(0)" class=agl onclick="goPage('tasks')">Open Tasks ›</a>`); }, 'Open, active and overdue tasks');
wdef('dash', 'todo', 'Your to-do list', 60, () => myWork(), 'Your own tasks, quizzes and reading');
wdef('dash', 'coach_new', 'Latest coaching update', 60, (c, s, x) => {
  const mine = SESS.filter(z => z.agents.includes(ME.username)).sort((p, q) => (q.date || '').localeCompare(p.date || ''))[0];
  if (!mine) return card(wt(x, 'Latest coaching update'), '<p class=mu style="margin:0">No coaching or one-to-one sessions documented for you yet.</p>');
  const open = (mine.actions || []).filter(a => !a.done);
  return card(wt(x, 'Latest coaching update'), `<div class=row><span><b>${esc(mine.title)}</b> <small class=mu>${mine.date} · ${esc(mine.byName || '')}</small></span><button class=ib onclick="viewSession('${mine.id}')">Open</button></div>`
    + (mine.goals ? `<p style="margin:8px 0 0">${esc(mine.goals)}</p>` : '') + (open.length ? `<div style="margin-top:8px"><b>Your next steps</b>${open.map(a => `<div class=li>• ${esc(a.t)}${a.due ? ` <small class=mu>due ${a.due}</small>` : ''}</div>`).join('')}</div>` : '<p class=mu style="margin:8px 0 0">No open actions.</p>'));
}, 'Your newest coaching or one-to-one');
// ---- charts over time and category insights (ideas from Zendesk QA)
const dgKey = d => { const x = new Date(d); if (DGR === 'day') return iso(x); if (DGR === 'month') return iso(x).slice(0, 7); if (DGR === 'quarter') return x.getFullYear() + ' Q' + (Math.floor(x.getMonth() / 3) + 1); const m = new Date(x); m.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return iso(m); };
const dgLab = k => DGR === 'day' || DGR === 'week' ? k.slice(8, 10) + '/' + k.slice(5, 7) : DGR === 'month' ? new Date(k + '-01T12:00').toLocaleString(I18N.locale(), { month: 'short', year: '2-digit' }) : k;
const dgBuckets = l => { const m = {}; l.forEach(e => { const k = dgKey(e.d); (m[k] = m[k] || []).push(e); }); return Object.keys(m).sort().slice(-16).map(k => ({ k, l: m[k] })); };
function svgCombo(b, g) {          // bars = number of reviews, line = average score (wide and low so it fits a full-width card)
  if (b.length < 1) return '<p class=mu>No reviews in this period</p>';
  const W = 1000, H = 240, L = 38, R = 34, T = 12, B = 30, pw = W - L - R, ph = H - T - B, n = b.length, bw = pw / n, mx = Math.max(...b.map(x => x.l.length)), y = v => T + ph * (1 - v / 100), yc = v => T + ph * (1 - v / mx);
  const pts = b.map((x, i) => [L + i * bw + bw / 2, y(avg(x.l.map(e => e.sc)))]);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" class=rbsvg>${[0, 25, 50, 75, 100].map(v => `<line x1=${L} x2=${W - R} y1=${y(v)} y2=${y(v)} style="stroke:var(--bd)"/><text x=${L - 6} y=${y(v) + 4} font-size=10 text-anchor=end style="fill:var(--mu)">${v}%</text>`).join('')}${b.map((x, i) => `<rect x=${(L + i * bw + bw * .15).toFixed(1)} y=${yc(x.l.length).toFixed(1)} width=${(bw * .7).toFixed(1)} height=${(T + ph - yc(x.l.length)).toFixed(1)} rx=3 style="fill:var(--bd)"><title>${x.l.length} reviews</title></rect><text x=${(L + i * bw + bw / 2).toFixed(1)} y=${H - 10} font-size=10 text-anchor=middle style="fill:var(--mu)">${dgLab(x.k)}</text>`).join('')}<text x=${W - R + 6} y=${T + 8} font-size=10 style="fill:var(--mu)">${mx}</text><polyline fill=none stroke="#e8458b" stroke-width=2.5 points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}"/>${pts.map((p, i) => `<circle cx=${p[0].toFixed(1)} cy=${p[1].toFixed(1)} r=4 fill="#e8458b"><title>${dgLab(b[i].k)}: ${avg(b[i].l.map(e => e.sc)).toFixed(1)}% (${b[i].l.length} reviews)</title></circle>`).join('')}</svg><div class=agleg><span><i style="background:#e8458b"></i>Average score</span><span><i style="background:var(--bd)"></i>Reviews</span></div>`;
}
const CATCOL = ['#2563eb', '#06b6d4', '#e8458b', '#f97316', '#eab308', '#22c55e', '#8b5cf6', '#64748b', '#14b8a6', '#ef4444', '#a3a635', '#0ea5e9', '#f472b6', '#84cc16'];
function svgCats(b, cats) {
  if (b.length < 2 || !cats.length) return '<p class=mu>Not enough reviews to draw a line</p>';
  const W = 1000, H = 240, L = 38, R = 10, T = 12, B = 30, pw = W - L - R, ph = H - T - B, n = b.length, x = i => L + i * pw / (n - 1), y = v => T + ph * (1 - v / 100);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" class=rbsvg>${[0, 25, 50, 75, 100].map(v => `<line x1=${L} x2=${W - R} y1=${y(v)} y2=${y(v)} style="stroke:var(--bd)"/><text x=${L - 6} y=${y(v) + 4} font-size=10 text-anchor=end style="fill:var(--mu)">${v}%</text>`).join('')}${b.map((z, i) => `<text x=${x(i)} y=${H - 10} font-size=10 text-anchor=middle style="fill:var(--mu)">${dgLab(z.k)}</text>`).join('')}${cats.map((c, ci) => { const p = b.map((z, i) => { const v = z.l.map(e => cpv(e, c)).filter(v => v != null); return v.length ? [x(i), y(avg(v))] : null; }).filter(Boolean); return `<polyline fill=none stroke="${CATCOL[ci % CATCOL.length]}" stroke-width=2 points="${p.map(q => q.map(v => v.toFixed(1)).join(',')).join(' ')}"><title>${esc(c)}</title></polyline>`; }).join('')}</svg><div class=agleg style="justify-content:flex-start">${cats.map((c, ci) => `<span style="font-size:12px"><i style="background:${CATCOL[ci % CATCOL.length]}"></i>${esc(c)}</span>`).join('')}</div>`;
}
wdef('dash', 'qtime', 'Quality scores over time', 60, (c, s, x) => card(`${wt(x, 'Quality scores over time')} <small class=mu style="font-weight:400">by ${DGR}</small>`, svgCombo(dgBuckets(c.d))), 'Reviews per day / week / month with the average score as a line');
wdef('dash', 'cattime', 'Category scores over time', 60, (c, s, x) => card(`${wt(x, 'Category scores over time')} <small class=mu style="font-weight:400">by ${DGR}</small>`, svgCats(dgBuckets(c.d), c.cs.map(z => z.c))), 'One line per category');
wdef('dash', 'catins', 'Category insights', 60, (c, s, x) => { const half = [...c.d].sort((p, q) => p.d - q.d), h = Math.floor(half.length / 2), old = half.slice(0, h), nw = half.slice(h);
  return card(wt(x, 'Category insights'), c.cs.length ? tbl(['Category', 'Average', 'Trend', 'Ratings', 'Below target', 'Scored 0', 'Disputes'], c.cs.map(z => { const v = c.d.map(e => cpv(e, z.c)).filter(v => v != null), a1 = avg(old.map(e => cpv(e, z.c)).filter(v => v != null)), a2 = avg(nw.map(e => cpv(e, z.c)).filter(v => v != null)), zero = c.d.filter(e => (e.cs || []).some(k => k.n === z.c && k.m && k.e === 0)).length;
    return [esc(z.c), `<b class=mono style="color:${col(z.v)}">${z.v.toFixed(1)}%</b>`, old.length && nw.length ? trendPill(a2 - a1) : '—', v.length, v.filter(p => p < c.g).length, zero ? `<span style="color:var(--bad)">${zero}</span>` : 0, c.d.filter(e => e.dp && (e.cs || []).some(k => k.n === z.c && k.e < k.m)).length]; })) : '<p class=mu>No data</p>'); }, 'Average, trend, number of ratings, below target and 0% per category');
wdef('dash', 'cat0', 'Category score 0%', 30, (c, s, x) => { const m = {}; c.d.forEach(e => (e.cs || []).forEach(k => { if (k.m && k.e === 0) m[k.n] = (m[k.n] || 0) + 1; })); const l = Object.entries(m).sort((a, b) => b[1] - a[1]), tot = l.reduce((a, z) => a + z[1], 0);
  return card(wt(x, 'Category score 0%'), l.length ? l.map(([n, v], i) => `<div><div class=row><span><i class=dotk style="background:${CATCOL[i % CATCOL.length]}"></i>${esc(n)}</span><b class=mono>${v} · ${(v / tot * 100).toFixed(0)}%</b></div>${bar(v / tot * 100, CATCOL[i % CATCOL.length])}</div>`).join('') : '<p class=mu style="text-align:center">✓ No category scored 0 in this period</p>'); }, 'Which categories most often scored 0 (critical failures)');
wdef('dash', 'goals', 'Goals this month', 30, (c, s, x) => { const l = (CO.goals || []).filter(g => (g.month || todayS().slice(0, 7)) === todayS().slice(0, 7)).slice(0, 6); return card(wt(x, 'Goals this month'), l.map(g => { const p = goalProgress(g); return `<div class=clk onclick="goPage('goals')"><div class=row><span>${esc(g.title || GMET[g.metric][0])} <small>${esc(gWho(g))}</small></span><b class=mono>${gFmt(g, p.v)} / ${gFmt(g, p.tg)}</b></div>${bar(p.pct, p.st === 'met' ? 'var(--ok)' : p.st === 'missed' ? 'var(--bad)' : 'var(--ac)')}</div>`; }).join('') || '<p class=mu>No goals for this month</p>'); }, 'Progress of the goals of this month');
wdef('dash', 'kudos', 'Latest kudos', 30, (c, s, x) => card(wt(x, 'Latest kudos'), (CO.kudos || []).slice(0, 5).map(k => `<div class="row li clk" onclick="goPage('kudos')"><span>${esc(k.badge || '⭐')} <b>${esc(an(k.to) || k.to)}</b> <small>from ${esc(k.byName || '')}</small><br><small>${esc(String(k.text || '').slice(0, 70))}</small></span></div>`).join('') || '<p class=mu>No kudos yet</p>'), 'The newest thank-you messages');
wdef('dash', 'csat', 'Customer satisfaction', 20, (c, s, x) => { const l = (CO.surveys || []).filter(z => !c.t || teamOf(z.agent) === c.t).map(z => +z.score).filter(Boolean); return kp(wt(x, 'Customer satisfaction'), l.length ? avg(l).toFixed(2) + '<small class=kps>/5</small>' : '—', l.length ? `${Math.round(l.filter(v => v >= 4).length / l.length * 100)}% satisfied · ${l.length} answers` : 'no survey answers yet', 'var(--ac)', null, "goPage('csat')"); }, 'Average survey score (CSAT)');
wdef('dash', 'complaints', 'Open complaints', 20, (c, s, x) => { const l = (CO.complaints || []).filter(z => z.status !== 'resolved'); return kp(wt(x, 'Open complaints'), l.length, l.filter(z => ['high', 'critical'].includes(z.severity)).length + ' high or critical', l.length ? 'var(--bad)' : 'var(--ok)', null, "goPage('complaints')"); }, 'Complaints that are not resolved');
wdef('dash', 'planner', 'Review plan this month', 30, (c, s, x) => { if (typeof plRows !== 'function') return ''; const keep = PLN.m; PLN.m = todayS().slice(0, 7); const r = plRows(); PLN.m = keep; const tg = r.reduce((a, z) => a + z.tg, 0), dn = r.reduce((a, z) => a + Math.min(z.done, z.tg || z.done), 0), bh = r.filter(z => z.st === 'behind');
  return card(wt(x, 'Review plan this month'), `<div class=row><b style="font-size:26px">${dn}<small style="font-size:14px"> / ${tg}</small></b><small>reviews planned</small></div>${bar(tg ? dn / tg * 100 : 0, 'var(--ac)')}<small>${bh.length} agent${bh.length === 1 ? '' : 's'} behind</small>${bh.slice(0, 4).map(z => `<div class="row li clk" onclick="reviewNow('${esc(z.a.username)}')"><span>${esc(z.a.name)}</span><small>${z.done}/${z.tg} · review now ›</small></div>`).join('')}`); }, 'How many planned reviews are done, and who is behind');
const KPIS = [['kpi_total', 12], ['kpi_avg', 12], ['kpi_pass', 12], ['kpi_fail', 12], ['kpi_trend', 12]];
DEFL.dash.all = wl(...KPIS, ['qtime', 60], ['channels', 30], ['distribution', 30], ['last5', 30], ['top', 30], ['strong', 30], ['needs', 30], ['catins', 60], ['low', 30], ['planner', 30], ['attention', 60]);
DEFL.dash.lead = wl(...KPIS, ['teams', 30], ['channels', 30], ['low', 30], ['last5', 30], ['needs', 30], ['tasks', 30], ['qflags', 30], ['attention', 60]);
DEFL.dash.trainer = wl(...KPIS, ['needs', 30], ['strong', 30], ['low', 30], ['teams', 30], ['coach_new', 60, false]);
DEFL.dash.agent = wl(['kpi_avg', 15], ['kpi_pass', 15], ['kpi_fail', 15], ['kpi_trend', 15], ['coach_new', 60], ['todo', 60], ['last5', 30], ['needs', 30], ['strong', 30], ['attention', 30]);
['admin', 'qa'].forEach(r => { DEFL.dash[r] = DEFL.dash.all; });

PG.dash = function () {
  const cache = {}, ctxOf = x => { const p = (x.f && x.f.p) || P, t = (x.f && x.f.t) || T, c = (x.f && x.f.c) || DCH, k = p + '|' + t + '|' + c; THR = t ? PT(t) : PASSG(); return cache[k] = cache[k] || dashCtx(p, t, c); };
  try {
    // the filters as chips: "Date is Last 30 days", "Team is All" … — click a chip to change it
    const chip = (lab, val, on, opts, set) => `<label class="fchip ${val ? 'set' : ''}">${lab} is <select onchange="${set}">${opts.map(([k, n]) => `<option value="${esc(k)}" ${String(on) === String(k) ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label>`;
    const isAg = ME.role === 'agent', any = DCH || T || DRV || DSC || DAG || P !== 'all';
    const ctl = `<div class=fchips>${chip('Date', P !== 'all', P, [['week', 'Last 7 days'], ['month', 'Last 30 days'], ['year', 'Last 12 months'], ['all', 'All time'], ['custom', 'Custom dates']], "P=this.value;render()")}${P === 'custom' ? `<input type=date value=${DF} onchange="DF=this.value;render()"><input type=date value=${DT} onchange="DT=this.value;render()">` : ''}${chip('Type', DCH, DCH, [['', 'All'], ...CHS.map(k => [k, CHP[k]])], "DCH=this.value;render()")}${isAg ? '' : chip('Team', T, T, [['', 'All'], ...TEAMS.filter(t => !t.system).map(t => [t.id, t.name])], "T=this.value;DAG='';render()") + chip('Agent', DAG, DAG, [['', 'All'], ...AGENTS().filter(a => !T || a.team === T).map(a => [a.username, a.name])], "DAG=this.value;render()") + chip('Reviewer', DRV, DRV, [['', 'All'], ...ROSTER.filter(r => r.active && ['qa', 'admin'].includes(r.role)).map(r => [r.username, r.name])], "DRV=this.value;render()")}${chip('Scorecard', DSC, DSC, [['', 'All'], ...SCS.map(s => [s.id, s.name])], "DSC=this.value;render()")}${any ? `<a href="javascript:void(0)" class=agl onclick="P='all';T='';DCH='';DRV='';DSC='';DAG='';render()">Reset</a>` : ''}</div>`;
    return head('Quality Dashboard', 'Personal overview of quality performance and quick actions',
      `<div style="display:flex;gap:8px;flex-wrap:wrap"><div class=sx style="width:290px"><span>${IC.search}</span><input class=qi style="padding-right:64px" placeholder="Search lead ID, agent, campaign…" onkeydown='if(event.key=="Enter"){Q=this.value.trim();KQ=true;location.hash="calls"}'><kbd class=kb>Ctrl K</kbd></div>${bellBtn()}<button class="ib ibx" onclick="viewHist()">${IC.clock} View history</button>${staff() ? `<button class="btn ibx" onclick="goPage('entry')">${IC.plus} New evaluation</button>` : ''}</div>`)
      + `<div class=hd style="margin-bottom:10px"><div><h2 style="margin:0;font-size:20px">Welcome back, ${esc(ME.name)} ${pill(ROLE[ME.role] || ME.role, 'ac')}</h2><p class=mu style="margin:4px 0 0">Here is a quick overview of your recent quality performance.</p></div></div>${ctl}`
      + wBar('dash') + wGrid('dash', ctxOf);
  } finally { THR = null; }
};

// the groups of the widget gallery
const WGRP = { qtime: 'Charts', cattime: 'Charts', catins: 'Categories', cat0: 'Categories', goals: 'Performance', kudos: 'Performance', csat: 'Customers', complaints: 'Customers', planner: 'Work', kpi_total: 'Numbers', kpi_avg: 'Numbers', kpi_pass: 'Numbers', kpi_fail: 'Numbers', kpi_trend: 'Numbers', kpi_flags: 'Numbers', kpi_disputes: 'Numbers', channels: 'Charts', distribution: 'Charts', teams: 'Charts', strong: 'Categories', needs: 'Categories', top: 'People', low: 'People', last5: 'Lists', attention: 'Lists', qflags: 'Lists', targets: 'Lists', tasks: 'Work', todo: 'Work', coach_new: 'Work' };
Object.entries(WGRP).forEach(([id, g]) => { if (WREG.dash[id]) WREG.dash[id].grp = g; });
