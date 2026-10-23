// ===================== Quick Flags (red / green flags on calls, kept apart from QA reviews) and Disputes =====================
let QF = [], QFM = null;                              // QF = all quick flags, QFM = the "New Quick Flag" pop-up
let XF = { c: '', q: '', t: '', a: '', p: 'month', f1: ds(-30), f2: ds(0), ff: 'all', pn: 1 };
let DS = { c: '', q: '', t: '', a: '', p: 'all', f1: ds(-30), f2: ds(0), s: '', pn: 1 };
const inPF = (d, o) => o.p === 'all' || (o.p === 'custom' ? d >= new Date(o.f1 + 'T00:00:00') && d <= new Date(o.f2 + 'T23:59:59') : (Date.now() - d) / 864e5 <= (o.p === 'week' ? 7 : 30));
const FLG = c => `<span class="fgv ${c}">${IC.flag}</span>`;

// ---- the filter card shared by both pages (search, team, agent, period); typing only redraws the numbers and the table
function fltCard(o, set, extra) {
  const tOpts = TEAMS.filter(t => !t.system && (!o.a || t.id === teamOf(o.a))), aOpts = AGENTS().filter(a => !o.t || a.team === o.t);
  return card('', `<div class=fl><label>Search<div class=sx><span>${IC.search}</span><input placeholder="Agent, lead ID, campaign…" value="${esc(o.q)}" oninput="${set}('q',this.value,1)"></div></label>`
    + (ME.role === 'agent' ? '' : `<label>Team<select onchange="${set}('t',this.value)"><option value="">All Teams</option>${tOpts.map(t => `<option value="${t.id}" ${t.id === o.t ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></label><label>Agent<select onchange="${set}('a',this.value)"><option value="">All Agents</option>${aOpts.map(a => `<option value="${esc(a.username)}" ${a.username === o.a ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select></label>`)
    + `<label>Type${chSel(o.c, `${set}('c',this.value)`)}</label><label>Period<div class=sg>${[['week', 'Week'], ['month', 'Month'], ['all', 'All'], ['custom', 'Custom']].map(([k, n]) => `<button class="${o.p === k ? 'on' : ''}" onclick="${set}('p','${k}')">${n}</button>`).join('')}</div></label></div>`
    + (o.p === 'custom' ? `<div class=fcust><label>From <input type=date value="${o.f1}" onchange="${set}('f1',this.value)"></label><label>To <input type=date value="${o.f2}" onchange="${set}('f2',this.value)"></label></div>` : '') + extra);
}
const fSet = (o, k, v) => { o[k] = v; o.pn = 1; if (k === 't' && o.a && v && teamOf(o.a) !== v) o.a = ''; if (k === 'a' && v) o.t = teamOf(v); };
const kpiF = (t, v, c, ic, click, on) => `<div class="fk ${click ? 'clk' : ''} ${on ? 'on' : ''}" ${click ? `onclick="${click}"` : ''}><div class=row><span>${t}</span>${ic}</div><b style="color:${c}">${v}</b></div>`;
const pager = (n, o, set, size = 20) => { const pc = Math.max(1, Math.ceil(n / size)); if (o.pn > pc) o.pn = pc; const a = (o.pn - 1) * size; return [a, a + size, `<div class=agpg><small>${n ? `Showing ${a + 1} to ${Math.min(a + size, n)} of ${n}` : 'Nothing to show'}</small><div style="display:flex;gap:6px"><button class=pb ${o.pn <= 1 ? 'disabled' : ''} onclick="${set}('pn',${o.pn - 1},1)">Previous</button><button class=pb ${o.pn >= pc ? 'disabled' : ''} onclick="${set}('pn',${o.pn + 1},1)">Next</button></div></div>`]; };
const qSearch = () => `<div class=sx style="width:290px"><span>${IC.search}</span><input class=qi style="padding-right:64px" placeholder="Search lead ID, agent, campaign…" onkeydown='if(event.key=="Enter"){Q=this.value.trim();KQ=true;location.hash="calls"}'><kbd class=kb>Ctrl K</kbd></div>`;
const leadA = (txt, click) => `<a href="javascript:void(0)" class=mono style="color:var(--ac);font-weight:600;text-decoration:none" onclick="${click}">${esc(txt)}</a>`;
const agCell = (u, name) => `<span class=av>${esc(ini(name))}</span>${ME.role === 'agent' ? esc(name) : agLink(u, name)}`;

// ================================================================ QUICK FLAGS
// one row per call: every reviewed call, plus calls that only have a quick flag (matched on lead ID + agent)
function qfRows() {
  const m = new Map(), key = (l, a) => String(l).trim().toLowerCase() + '|' + a;
  EV.forEach(e => m.set(key(e.id, e.agent), { lead: e.id, agent: e.agent, tm: e.tm, d: e.d, cp: cpn(e), ch: chOf(e), ev: e, qf: [] }));
  QF.forEach(f => { const k = key(f.lead, f.agent); let r = m.get(k); if (!r) { r = { lead: f.lead, agent: f.agent, tm: teamOf(f.agent) || f.tid, d: new Date(f.date + 'T12:00:00'), cp: f.date + ' ' + (f.cp || 'general'), ch: f.ch || 'call', ev: null, qf: [] }; m.set(k, r); } r.qf.push(f); });
  return [...m.values()].map(r => ({ ...r, red: (r.ev && r.ev.fl === 'red') || r.qf.some(f => f.type === 'red'), green: (r.ev && r.ev.fl === 'green') || r.qf.some(f => f.type === 'green') }));
}
const xfBase = () => { const q = XF.q.toLowerCase(); return qfRows().filter(r => (!XF.c || r.ch === XF.c) && (!XF.t || r.tm === XF.t) && (!XF.a || r.agent === XF.a) && inPF(r.d, XF) && (!q || (r.lead + ' ' + an(r.agent) + ' ' + r.cp + ' ' + r.qf.map(f => f.cm).join(' ')).toLowerCase().includes(q))).sort((a, b) => b.d - a.d); };
const XFF = { all: () => true, flagged: r => r.red || r.green, red: r => r.red, green: r => r.green, none: r => !r.red && !r.green };
const XL = () => xfBase().filter(XFF[XF.ff]);
const xfSet = (k, v, soft) => { fSet(XF, k, v); if (soft) xfRt(); else render(); };
const xfKpis = b => { const fl = b.filter(XFF.flagged); return `<div class=fkp>${kpiF('Total Flagged', fl.length, 'var(--tx)', `<span style="color:var(--mu)">${IC.flag}</span>`, "xfSet('ff','flagged')", XF.ff === 'flagged')}${kpiF('Red Flags', b.filter(r => r.red).length, 'var(--bad)', FLG('red'), "xfSet('ff','red')", XF.ff === 'red')}${kpiF('Green Flags', b.filter(r => r.green).length, 'var(--ok)', FLG('green'), "xfSet('ff','green')", XF.ff === 'green')}</div>`; };
function xfTable() {
  const l = XL(), [a, z, pg] = pager(l.length, XF, 'xfSet');
  const badges = r => [...(r.ev && r.ev.fl ? [`<span class="qfb ${r.ev.fl}" title="Flag given in the QA review">${IC.flag} QA ${r.ev.fl === 'red' ? 'Red' : 'Green'}</span>`] : []), ...r.qf.map(f => `<span class="qfb ${f.type} clk" onclick="qfEdit('${f.id}')" title="${esc((f.cm || 'No comment') + ' — by ' + (f.byName || f.by) + ', ' + f.date)}">${IC.flag} ${f.type === 'red' ? 'Red' : 'Green'}</span>`)].join('') || '<span class=mu>—</span>';
  return card(`${XF.c ? CHN[XF.c] + ' reviews' : 'Conversations'} <span class=bg>${l.length}</span>`, `<div class=sc><table class=ct><tr><th>LEAD ID</th><th>TYPE</th><th>DATE</th><th>AGENT</th><th>TEAM</th><th>CAMPAIGN</th><th>QA SCORE</th><th>QUICK FLAGS</th><th style="text-align:right">ACTIONS</th></tr>`
    + l.slice(a, z).map(r => { const pre = `{ch:'${r.ch}',agent:'${esc(r.agent)}',lead:'${esc(String(r.lead).replace(/'/g, ''))}',date:'${iso(r.d)}',cp:'${esc((r.ev ? r.ev.cp : (r.qf[0] || {}).cp || '').replace(/'/g, ''))}'`;
      return `<tr><td>${r.ev ? leadA(r.lead, `om('view','${r.ev.rid}')`) : leadA(r.lead, `qfEdit('${r.qf[0].id}')`)}</td><td>${chTag(r.ch, 1)}</td><td>${f(r.d)}</td><td>${agCell(r.agent, an(r.agent) || r.agent)}</td><td>${teamLink(r.tm)}</td><td>${esc(r.cp)}</td><td>${r.ev ? `<b class=mono style="color:${scol(r.ev.sc, r.tm)}">${Math.round(r.ev.sc)}%</b>` : '<small class=mu>no review</small>'}</td><td><div class=qfbs>${badges(r)}</div></td>`
        + `<td style="text-align:right;white-space:nowrap"><button class="ic qfr" title="Add a red flag" onclick="qfNew(${pre},type:'red'})">${IC.flag}</button><button class="ic qfg" title="Add a green flag" onclick="qfNew(${pre},type:'green'})">${IC.flag}</button><button class=ic title="View" onclick="${r.ev ? `om('view','${r.ev.rid}')` : `qfEdit('${r.qf[0].id}')`}">${IC.eye}</button></td></tr>`; }).join('')
    + (l.length ? '' : `<tr><td colspan=9 class=mu style="text-align:center;padding:26px">Nothing matches these filters</td></tr>`) + `</table></div>${pg}`, 'ftbl');
}
const xfRt = () => { const k = $('#xfk'), t = $('#xft'), b = xfBase(); if (k) k.innerHTML = xfKpis(b); if (t) t.innerHTML = xfTable(); };
PG.flags = function () {
  const b = xfBase(), cnt = k => b.filter(XFF[k]).length;
  const ff = `<div style="margin-top:14px"><span class=fcap>Flag Filter</span><div class=sg style="display:inline-flex">${[['all', 'All Calls'], ['flagged', 'Flagged'], ['red', '<i class=dotk style="background:var(--bad)"></i>Red'], ['green', '<i class=dotk style="background:var(--ok)"></i>Green'], ['none', 'No Flags']].map(([k, n]) => `<button class="${XF.ff === k ? 'on' : ''}" onclick="xfSet('ff','${k}')">${n} <small class=mono>${cnt(k)}</small></button>`).join('')}</div></div>`;
  return head('Quick Flags', 'Flag calls, chats and emails independently from QA reviews — does not affect scores', `<div style="display:flex;gap:8px;flex-wrap:wrap">${qSearch()}${bellBtn()}<button class="ib ibx" onclick="xfExport()">${IC.dl} Export</button><button class="btn ibx" onclick="qfNew({type:'red'})">${IC.plus} New Flag</button></div>`)
    + `<div id=xfk>${xfKpis(b)}</div>` + fltCard(XF, 'xfSet', ff) + `<div id=xft>${xfTable()}</div>`;
};
async function xfExport() {
  const l = XL(); if (!l.length) return toast('Nothing to export', true);
  const rows = [['Lead ID', 'Type', 'Date', 'Agent', 'Team', 'Campaign', 'QA Score', 'QA flag', 'Quick flags', 'Comments', 'Flagged by'], ...l.map(r => [String(r.lead), CHN[r.ch], iso(r.d), an(r.agent) || r.agent, tn(r.tm), r.cp, r.ev ? r.ev.sc : '', r.ev && r.ev.fl ? r.ev.fl : '', r.qf.map(x => x.type).join(', '), r.qf.map(x => x.cm).filter(Boolean).join(' | '), [...new Set(r.qf.map(x => x.byName || x.by))].join(', ')])];
  const r = await api('/api/export/call-reviews', { rows, pf: 6, pt: 6, name: 'Quick Flags' }); if (!r.ok) return toast('Could not create the Excel file', true);
  const a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob()); a.download = 'Quick_Flags_' + iso(new Date()) + '.xlsx'; a.click();
}

// ---- the "New Quick Flag" pop-up
const qfNew = (o = {}) => { QFM = { ch: XF.c || 'call', type: 'red', team: o.agent ? teamOf(o.agent) : (XF.t || ''), agent: o.agent || XF.a || '', lead: o.lead || '', date: o.date || todayS(), cp: o.cp || '', lk: '', rl: '', cm: '', ...o }; render(); setTimeout(() => { const i = $(QFM.agent ? '#qfc' : '#qft'); if (i) i.focus(); }, 30); };
const qfEdit = id => { const x = QF.find(f => f.id === id); if (!x) return; QFM = { ...x, team: teamOf(x.agent) || x.tid }; render(); };
let QFBUSY = false;                                       // a double-click on Save must not add the flag twice
async function qfSave() {
  const d = QFM; if (!d || QFBUSY) return;
  if (!d.agent) return toast('Choose the team and the agent', true); if (!String(d.lead).trim()) return toast('Enter the lead ID', true);
  QFBUSY = true;
  let r; try { r = await api('/api/qflags' + (d.id ? '/' + d.id : ''), d, d.id ? 'PUT' : 'POST'); } finally { QFBUSY = false; }
  if (!r.ok) return toast(await errOf(r, 'Could not save the flag'), true);
  QFM = null; await load(); render(); toast(d.id ? 'Flag saved' : (d.type === 'red' ? 'Red' : 'Green') + ' flag added');
}
const qfDel = id => ask('Delete this flag?', 'The flag is removed. QA reviews and scores are not affected.', async () => { await api('/api/qflags/' + id, null, 'DELETE'); QFM = null; await load(); render(); toast('Flag deleted'); }, { yes: 'Yes, delete', no: 'Cancel', danger: true });
const QFMM = () => { const d = QFM, red = d.type === 'red', tc = red ? 'var(--bad)' : 'var(--ok)', inp = (k, ph, t = 'text', id = '') => `<input ${id ? 'id=' + id : ''} type=${t} placeholder="${esc(ph)}" value="${esc(d[k] || '')}" oninput="QFM.${k}=this.value">`;
  return OVL(`<div class=mh><span class=qfic style="--c:${tc}">${IC.flag}</span><div><h2>${d.id ? 'Edit Quick Flag' : 'New Quick Flag'}</h2><small>Flag a call without a QA review — scores do not change</small></div>${X('QFM=null;render()')}</div><div class=mb><div class=form style="max-width:none">
<div><b class=flb>Flag Type</b><div class=qft><button class="${red ? 'on red' : ''}" onclick="QFM.type='red';render()">${IC.flag} Red Flag</button><button class="${red ? '' : 'on green'}" onclick="QFM.type='green';render()">${IC.flag} Green Flag</button></div></div>
<div><b class=flb>Conversation type</b><div class=chseg>${CHS.map(k => `<button type=button class="${(d.ch || 'call') === k ? 'on' : ''}" style="--c:${CHC[k]}" onclick="QFM.ch='${k}';render()">${IC['ch_' + k]} ${CHN[k]}</button>`).join('')}</div></div>
<div class=eg2><label>Team <i class=rq>*</i><select id=qft onchange="QFM.team=this.value;QFM.agent='';render()"><option value="">Select a team…</option>${TEAMS.filter(t => !t.system).map(t => `<option value="${t.id}" ${t.id === d.team ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></label>
<label>Agent <i class=rq>*</i><select ${d.team ? '' : 'disabled'} onchange="QFM.agent=this.value"><option value="">${d.team ? 'Select an agent…' : 'Select a team first'}</option>${AGENTS().filter(a => a.team === d.team).map(a => `<option value="${esc(a.username)}" ${a.username === d.agent ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select></label>
<label>Lead ID <i class=rq>*</i>${inp('lead', 'e.g. 123456')}</label><label>Date${inp('date', '', 'date')}</label></div>
<label>Campaign <span class=mu>(optional)</span>${inp('cp', 'e.g. Summer Reactivation')}</label>
<div class=eg2><label>CRM link <span class=mu>(optional)</span>${inp('lk', 'https://…')}</label><label>${(d.ch || 'call') === 'call' ? 'Recording link' : (d.ch === 'chat' ? 'Chat' : d.ch === 'email' ? 'Email' : 'Conversation') + ' link'} <span class=mu>(optional)</span>${inp('rl', 'https://…')}</label></div>
<label>Comment <span class=mu>(optional)</span><textarea id=qfc rows=3 placeholder="Reason for flagging this call…" oninput="QFM.cm=this.value">${esc(d.cm || '')}</textarea></label></div>
<div style="display:flex;gap:8px;justify-content:flex-end;align-items:center">${d.id ? `<button class="ib ibx" style="margin-right:auto;color:var(--bad)" onclick="qfDel('${d.id}')">${IC.bin} Delete</button><small class=mu>By ${esc(d.byName || d.by || '')}</small>` : ''}<button class=ib onclick="QFM=null;render()">Cancel</button><button class=btn style="background:${tc}" onclick="qfSave()">${d.id ? 'Save flag' : 'Create ' + (red ? 'Red' : 'Green') + ' Flag'}</button></div></div>`, 'QFM=null;render()', 560, 60); };

// ================================================================ DISPUTES
// Disputed = the agent disagreed and nobody answered yet · In progress = QA answered, the conversation is going · Resolved = closed
const dispStatus = e => { const d = e.dp; if (!d) return ''; if (d.status === 'resolved') return 'resolved'; return d.msgs.some(m => m.r !== 'agent' && !m.sys) ? 'progress' : 'disputed'; };
const DST = { disputed: ['Disputed', 'bad'], progress: ['In progress', 'ac'], resolved: ['Resolved', 'ok'] };
const dispPill = e => { const s = DST[dispStatus(e)]; return s ? pill(s[0], s[1]) : ''; };
const dsBase = () => { const q = DS.q.toLowerCase(); return EV.filter(e => e.dp && (!DS.c || chOf(e) === DS.c) && (!DS.t || e.tm === DS.t) && (!DS.a || e.agent === DS.a) && inPF(new Date(e.dp.at), DS) && (!q || (e.id + ' ' + agn(e) + ' ' + cpn(e) + ' ' + e.dp.msgs.map(m => m.t).join(' ')).toLowerCase().includes(q))).sort((a, b) => new Date(b.dp.at) - new Date(a.dp.at)); };
const DL = () => dsBase().filter(e => !DS.s || dispStatus(e) === DS.s);
const dsSet = (k, v, soft) => { fSet(DS, k, v); if (soft) dsRt(); else render(); };
const dsKpis = b => { const c = k => b.filter(e => dispStatus(e) === k).length; return `<div class=fkp style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">${kpiF('Total Disputes', b.length, 'var(--tx)', `<span style="color:var(--mu)">${IC.flag}</span>`, "dsSet('s','')", !DS.s)}${kpiF('Disputed', c('disputed'), 'var(--bad)', '<i class=dotk style="background:var(--bad)"></i>', "dsSet('s','disputed')", DS.s === 'disputed')}${kpiF('In Progress', c('progress'), 'var(--ac)', '<i class=dotk style="background:var(--ac)"></i>', "dsSet('s','progress')", DS.s === 'progress')}${kpiF('Resolved', c('resolved'), 'var(--ok)', '<i class=dotk style="background:var(--ok)"></i>', "dsSet('s','resolved')", DS.s === 'resolved')}</div>`; };
function dsTable() {
  const l = DL(), [a, z, pg] = pager(l.length, DS, 'dsSet');
  return card(`Disputed calls <span class=bg>${l.length}</span>`, `<div class=sc><table class=ct><tr><th>LEAD ID</th><th>TYPE</th><th>DISPUTED ON</th><th>AGENT</th><th>TEAM</th><th>QA SCORE</th><th>STATUS</th><th>LAST MESSAGE</th><th>OUTCOME</th><th style="text-align:right">ACTIONS</th></tr>`
    + l.slice(a, z).map(e => { const m = e.dp.msgs.filter(x => !x.sys).slice(-1)[0] || {}, r = e.dp.res;
      return `<tr><td>${leadA(e.id, `om('view','${e.rid}')`)}</td><td>${chTag(chOf(e), 1)}</td><td>${f(new Date(e.dp.at))}</td><td>${agCell(e.agent, agn(e))}</td><td>${teamLink(e.tm)}</td><td><b class=mono style="color:${scol(e.sc, e.tm)}">${Math.round(e.sc)}%</b></td><td>${dispPill(e)}</td><td style="max-width:280px;white-space:normal"><small>${esc(m.n || '')}</small><br>${esc(String(m.t || '').slice(0, 90))}</td><td>${r ? (r.outcome === 'kept' ? pill('Score kept', 'ac') : pill('Score changed', 'wn')) : '<span class=mu>—</span>'}</td><td style="text-align:right"><button class=ic title="Open the review and the conversation" onclick="om('view','${e.rid}')">${IC.eye}</button></td></tr>`; }).join('')
    + (l.length ? '' : `<tr><td colspan=10 class=mu style="text-align:center;padding:26px">No disputes match these filters</td></tr>`) + `</table></div>${pg}`, 'ftbl');
}
const dsRt = () => { const k = $('#dsk'), t = $('#dst'); if (k) k.innerHTML = dsKpis(dsBase()); if (t) t.innerHTML = dsTable(); };
PG.disputes = function () {
  const b = dsBase(), sf = `<div style="margin-top:14px"><span class=fcap>Status</span><div class=sg style="display:inline-flex">${[['', 'All'], ['disputed', '<i class=dotk style="background:var(--bad)"></i>Disputed'], ['progress', '<i class=dotk style="background:var(--ac)"></i>In progress'], ['resolved', '<i class=dotk style="background:var(--ok)"></i>Resolved']].map(([k, n]) => `<button class="${DS.s === k ? 'on' : ''}" onclick="dsSet('s','${k}')">${n}</button>`).join('')}</div></div>`;
  return head('Disputes', ME.role === 'agent' ? 'The reviews you disputed and where they stand' : 'Every disputed call and where it stands', `<div style="display:flex;gap:8px;flex-wrap:wrap">${qSearch()}${bellBtn()}${staff() ? `<button class="ib ibx" onclick="xp(DL(),'Disputes')">${IC.dl} Export</button>` : ''}</div>`)
    + `<div id=dsk>${dsKpis(b)}</div>` + fltCard(DS, 'dsSet', sf) + `<div id=dst>${dsTable()}</div>`;
};
