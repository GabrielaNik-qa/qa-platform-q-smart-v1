// ===================== Call Reviews page =====================
const cpn = e => iso(e.d) + ' ' + (e.cp || 'general');
const UN = () => NF.filter(n => !n.read).length;
const bellBtn = () => `<button class="ib bellb" onclick="openN()" title="Notifications">${IC.bell}${UN() ? `<sup>${UN()}</sup>` : ''}</button>`;
const SORT = { id: e => String(e.id).toLowerCase(), d: e => +e.d, ag: e => agn(e), tm: e => tn(e.tm), cp: e => cpn(e), rv: e => e.rv || '', sc: e => e.sc, fl: e => ({ red: 2, green: 1 }[e.fl] || 0), st: e => e.st, sn: e => e.seen ? 1 : 0 };
const inP = e => FP === 'all' || (FP === 'custom' ? e.d >= new Date(F1 + 'T00:00:00') && e.d <= new Date(F2 + 'T23:59:59') : (Date.now() - e.d) / 864e5 <= (FP === 'week' ? 7 : 30));
const fscOk = e => !FSC || (FSC.m === 'pass' ? isPass(e) : FSC.m === 'fail' ? !isPass(e) : e.sc >= FSC.a && e.sc < FSC.b);
const CR = () => {
  const q = Q.toLowerCase(), g = SORT[SK];
  return EV.filter(e => (!FT || e.tm === FT) && (!FA || e.agent === FA) && inP(e) && fscOk(e) && (!FS || (FS === 'seen' ? e.seen : !e.seen)) &&
    (!q || String(e.id).toLowerCase().includes(q) || agn(e).toLowerCase().includes(q) || cpn(e).toLowerCase().includes(q)))
    .sort((a, b) => { const x = g(a), y = g(b); return (x > y ? 1 : x < y ? -1 : 0) * SD; });
};
const TH = [['id', 'LEAD ID'], ['d', 'DATE'], ['ag', 'AGENT'], ['tm', 'TEAM'], ['cp', 'CAMPAIGN'], ['rv', 'REVIEWER'], ['sc', 'SCORE'], ['fl', 'FLAG'], ['st', 'STATUS'], ['sn', 'SEEN']];
const hasItems = e => (e.cs || []).some(c => c.it.length);

const PGN = (n, pc, a) => `<div class=pg><label style="display:flex;align-items:center;gap:8px;font-size:13px">Items per page <select onchange="PS=+this.value;PN=1;rt()">${[10, 20, 50].map(x => `<option ${x === PS ? 'selected' : ''}>${x}</option>`).join('')}</select></label><small>${n ? `Showing ${a + 1} to ${Math.min(a + PS, n)} of ${n} results` : 'No results'}</small><div style="display:flex;gap:6px"><button class=pb ${PN < 2 ? 'disabled' : ''} onclick="gp(${PN - 1})">← Previous</button>${Array.from({ length: pc }, (_, i) => i + 1).filter(i => i === 1 || i === pc || Math.abs(i - PN) <= 1).map((i, k, ar) => (k && i - ar[k - 1] > 1 ? '<span class=mu>…</span>' : '') + `<button class="pb ${i === PN ? 'on' : ''}" onclick="gp(${i})">${i}</button>`).join('')}<button class=pb ${PN >= pc ? 'disabled' : ''} onclick="gp(${PN + 1})">Next →</button></div></div>`;

const rowH = e => {
  const hasRec = !!e.rec || /^https?:\/\//.test(e.rl || ''), r = e.rid;
  return `<tr><td><a href="javascript:void(0)" class=mono style="color:var(--ac);font-weight:600;text-decoration:none" onclick="om('view','${r}')">${esc(e.id)}</a></td><td>${f(e.d)}</td><td><span class=av>${ini(agn(e))}</span>${e.agent && ME.role !== 'agent' ? agLink(e.agent, agn(e)) : esc(agn(e))}</td><td><span class=tg style="color:${tcol(e.tm)}" title="${e.tmh && e.tmh !== e.tm ? 'Team when the review was made: ' + esc(tn(e.tmh)) : ''}">${esc(tn(e.tm))}</span></td><td>${esc(cpn(e))}</td><td>${esc(e.rv || '—')}</td>`
    + `<td><div class=sv><b class=mono style="color:${scol(e.sc, e.tm)}">${e.sc}%</b>${bar(e.sc, scol(e.sc, e.tm))}</div></td>`
    + `<td><span class="fgv ${e.fl || ''}" title="${e.fl ? e.fl + ' flag' : 'No flag'}">${IC.flag}</span></td>`
    + `<td>${e.st === 'disputed' ? pill('Disputed', 'wn') : pill('Completed', 'ok')}</td>`
    + `<td>${e.seen ? `<span class="pill ok" title="Seen ${fdt(e.seen)}">Seen</span>` : `<span class="pill wn" title="The agent has not opened this review yet">Not seen</span>`}</td>`
    + `<td style="white-space:nowrap">${hasRec ? `<button class=ic onclick="ply('${r}')" title="Play recording">${IC.play}</button>` : `<button class="ic off" disabled title="No recording attached">${IC.play}</button>`}`
    + `<button class=ic onclick="om('view','${r}')" title="View">${IC.eye}</button>`
    + (staff() ? `${hasItems(e) ? `<button class=ic onclick="edE('${r}')" title="Edit">${IC.pen}</button>` : `<button class="ic off" disabled title="Older record without item answers">${IC.pen}</button>`}<button class=ic onclick="om('del','${r}')" title="Delete">${IC.bin}</button>${e.seen ? '' : `<button class="ic rem" onclick="remind('${r}')" title="Remind the agent to open this review">${IC.bell}</button>`}` : '')
    + `</td></tr>`;
};
const CTBL = () => {
  const l = CR(), n = l.length, pc = Math.max(1, Math.ceil(n / PS)); if (PN > pc) PN = pc;
  const a = (PN - 1) * PS, pg = l.slice(a, a + PS), ar = k => k === SK ? (SD > 0 ? '▲' : '▼') : '↕';
  return card('', `<div class=row style="margin-bottom:14px"><h3 style="margin:0;display:flex;align-items:center;gap:10px">Call Reviews <span class=bg>${n}</span></h3><small>View and manage all call evaluations</small></div><div class=sc><table class=ct><tr>${TH.map(([k, t]) => `<th style="cursor:pointer" onclick="srt('${k}')">${t} <span style="opacity:${k === SK ? 1 : .4}">${ar(k)}</span></th>`).join('')}<th>ACTIONS</th></tr>${pg.map(rowH).join('') || `<tr><td colspan=11 class=mu style="text-align:center;padding:30px">No call reviews match your filters</td></tr>`}</table></div>` + PGN(n, pc, a));
};
const rt = () => { const t = $('#tb'); if (t) t.innerHTML = CTBL(); };
const gp = p => { PN = p; rt(); };
const srt = k => { if (SK === k) SD = -SD; else { SK = k; SD = (k === 'd' || k === 'sc') ? -1 : 1; } PN = 1; rt(); };
const sq = el => { Q = el.value; PN = 1; $$('.qi').forEach(i => { if (i !== el) i.value = Q; }); rt(); };
// team and agent filters depend on each other: an agent only exists in their own team
const setFT = v => { FT = v; if (FT && FA && teamOf(FA) !== FT) FA = ''; PN = 1; render(); };
const setFA = v => { FA = v; if (FA) FT = teamOf(FA); PN = 1; render(); };

PG.calls = function () {
  const seg = [['week', 'Week'], ['month', 'Month'], ['all', 'All'], ['custom', 'Custom']].map(([k, l]) => `<button class="${k === FP ? 'on' : ''}" onclick="FP='${k}';PN=1;render()">${l}</button>`).join('');
  const si = `<div class=sx><span>${IC.search}</span><input class=qi placeholder="Search by agent, lead ID, or campaign…" value="${esc(Q)}" oninput="sq(this)"></div>`;
  const tOpts = TEAMS.filter(t => !FA || t.id === teamOf(FA)), aOpts = AGENTS().filter(a => !FT || a.team === FT);
  const chip = FSC ? `<span class=chip onclick="FSC=null;PN=1;render()" title="Remove this filter">${FSC.m === 'pass' ? `Passing reviews (team pass rates)` : FSC.m === 'fail' ? 'Failing reviews (below the pass rate)' : `Score ${FSC.a}% – ${FSC.b > 100 ? 100 : FSC.b - 1}%`} ✕</span>` : '';
  return head('Call Reviews', 'View and manage all call evaluations', `<div style="display:flex;gap:8px;flex-wrap:wrap"><div class=sx style="width:290px"><span>${IC.search}</span><input class=qi style="padding-right:64px" placeholder="Search lead ID, agent, campaign…" value="${esc(Q)}" oninput="sq(this)"><kbd class=kb>Ctrl K</kbd></div>${bellBtn()}<button class="ib ibx" onclick="xp(CR(),'Call Reviews')">${IC.dl} Export to Excel</button></div>`)
    + card('', `<div class=fl><label>Search${si}</label>
<label>Team<select onchange="setFT(this.value)"><option value="">All Teams</option>${tOpts.map(t => `<option value="${t.id}" ${t.id === FT ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></label>
<label>Agent<select onchange="setFA(this.value)"><option value="">All Agents</option>${aOpts.map(a => `<option value="${esc(a.username)}" ${a.username === FA ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select></label>
<label>Viewed by agent<select onchange="FS=this.value;PN=1;rt()"><option value="">All</option><option value=seen ${FS === 'seen' ? 'selected' : ''}>Seen</option><option value=unseen ${FS === 'unseen' ? 'selected' : ''}>Not seen</option></select></label>
<label>Period<div class=sg>${seg}</div></label></div>${FP === 'custom' ? `<div style="display:flex;gap:8px;margin-top:12px"><input type=date value=${F1} onchange="F1=this.value;PN=1;rt()"><input type=date value=${F2} onchange="F2=this.value;PN=1;rt()"></div>` : ''}${chip}`)
    + `<div id=tb>${CTBL()}</div>`;
};

// ---- open / close the review pop-up, delete, remind, play, export
async function om(t, id) {
  if (t === 'view') await load();                       // always show the latest scores and dispute messages
  MD = { t, id }; DRF = ''; render();
  if (t === 'view' && ME.role === 'agent') {                 // the agent opening their review marks it as "seen"
    const e = EV.find(x => x.rid === id);
    if (e && !e.seen) api(`/api/evaluations/${id}/seen`, {}).then(async r => { if (r.ok) { e.seen = (await r.json()).seen; } });
  }
}
function cm() { MD = null; DRF = ''; render(); }
async function rmv(rid) { const r = await api('/api/evaluations/' + rid, null, 'DELETE'); if (!r.ok) return toast(await errOf(r, 'Could not delete the review'), true); MD = null; await load(); render(); toast('Review deleted'); }
async function remind(rid) { const r = await api(`/api/evaluations/${rid}/remind`, {}); if (r.ok) toast('Reminder sent to the agent'); else toast(await errOf(r, 'Could not send the reminder'), true); }
function ply(rid) { const e = EV.find(x => x.rid === rid); if (!e) return; if (e.rec) { PLY = rid; render(); } else if (/^https?:\/\//.test(e.rl || '')) window.open(e.rl, '_blank', 'noopener'); }
async function xp(l, name) {
  const cn = CATS(l), hd = ['Lead ID', 'Date', 'Agent', 'Team', 'Campaign', 'Reviewer', ...cn, 'Total Score (%)', 'Flag', 'Quick Flags', 'Status', 'Disputed', 'Comments', 'Link', 'Recording Link'],
    rows = [hd, ...l.map(e => [String(e.id), iso(e.d), agn(e), tn(e.tm), cpn(e), e.rv || '', ...cn.map(n => { const v = cpv(e, n); return v == null ? '' : Math.round(v * 10) / 10; }), e.sc, e.fl === 'red' ? 'Red Flag' : e.fl === 'green' ? 'Green Flag' : '', '', 'Completed', e.st === 'disputed' ? 'Yes' : 'No', [e.cm, ...(e.cs || []).flatMap(c => c.it.filter(i => i.cm).map(i => '[' + c.n + '] ' + i.cm))].filter(Boolean).join(' | '), e.lk || '', e.rl || (e.rec ? location.origin + '/api/recordings/' + e.rec : '')])];
  const r = await api('/api/export/call-reviews', { rows, pf: 6, pt: 6 + cn.length, name });
  if (!r.ok) return toast('Could not create the Excel file', true);
  const a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob()); a.download = name.replace(/\s+/g, '_') + '_' + iso(new Date()) + '.xlsx'; a.click();
}

// ===================== Quick Flags: every red / green flag (and disputes) in one place, with its own export =====================
let XF = { f: 'any', t: '', a: '', p: 'all', q: '' };
const XL = () => { const q = XF.q.toLowerCase(); return EV.filter(e => (XF.f === 'any' ? e.fl : e.fl === XF.f) && (!XF.t || e.tm === XF.t) && (!XF.a || e.agent === XF.a) && (XF.p === 'all' || (Date.now() - e.d) / 864e5 <= (XF.p === 'week' ? 7 : 30)) && (!q || String(e.id).toLowerCase().includes(q) || agn(e).toLowerCase().includes(q))).sort((a, b) => b.d - a.d); };
const xfSet = (k, v) => { XF[k] = v; if (k === 't' && XF.a && teamOf(XF.a) !== v && v) XF.a = ''; if (k === 'a' && v) XF.t = teamOf(v); render(); };
PG.flags = function () {
  const l = XL(), all = EV, cnt = { any: all.filter(e => e.fl).length, red: all.filter(e => e.fl === 'red').length, green: all.filter(e => e.fl === 'green').length };
  const tOpts = TEAMS.filter(t => !XF.a || t.id === teamOf(XF.a)), aOpts = AGENTS().filter(a => !XF.t || a.team === XF.t);
  return head('Quick Flags', 'Every red and green flag in one place (disputes have their own page)', `<div style="display:flex;gap:8px;flex-wrap:wrap">${bellBtn()}<button class="ib ibx" onclick="xp(XL(),'Quick Flags')">${IC.dl} Export to Excel</button></div>`)
    + card('', `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${[['any', 'All flags'], ['red', 'Red'], ['green', 'Green']].map(([k, n]) => `<button class="pb ${XF.f === k ? 'on' : ''}" onclick="xfSet('f','${k}')">${n} <b class=mono>${cnt[k]}</b></button>`).join('')}
<select onchange="xfSet('t',this.value)"><option value="">All Teams</option>${tOpts.map(t => `<option value="${t.id}" ${t.id === XF.t ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select>
<select onchange="xfSet('a',this.value)"><option value="">All Agents</option>${aOpts.map(a => `<option value="${esc(a.username)}" ${a.username === XF.a ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select>
<div class=sg>${[['week', 'Week'], ['month', 'Month'], ['all', 'All']].map(([k, n]) => `<button class="${XF.p === k ? 'on' : ''}" onclick="xfSet('p','${k}')">${n}</button>`).join('')}</div></div>`)
    + card(`${l.length} flagged review${l.length === 1 ? '' : 's'}`, tbl(['Lead ID', 'Date', 'Agent', 'Team', 'Flag', 'Score', 'Comment', 'Reviewer'], l.map(e => [`<a href="javascript:void(0)" class=mono style="color:var(--ac);font-weight:600;text-decoration:none" onclick="om('view','${e.rid}')">${esc(e.id)}</a>`, f(e.d), ME.role !== 'agent' ? agLink(e.agent, agn(e), 'flags') : esc(agn(e)), `<span class=tg style="color:${tcol(e.tm)}">${esc(tn(e.tm))}</span>`, e.fl ? `<span class="fgv ${e.fl}">${IC.flag}</span> ${e.fl === 'red' ? 'Red' : 'Green'}` : '<small>—</small>', sp(e.sc, e.tm), `<span style="white-space:normal;display:inline-block;max-width:260px">${esc(e.cm || '')}</span>`, esc(e.rv || '—')])) || '<p class=mu>Nothing matches these filters</p>');
};

// ===================== Disputes: every call that was ever disputed, with its status =====================
// Disputed = the agent disagreed and nobody has answered yet; Reviewed = QA answered, the conversation is going; Resolved = closed.
let DS = { s: '', t: '', a: '', p: 'all' };
const dispStatus = e => { const d = e.dp; if (!d) return ''; if (d.status === 'resolved') return 'resolved'; return d.msgs.some(m => m.r !== 'agent' && !m.sys) ? 'reviewed' : 'disputed'; };
const dispPill = e => ({ disputed: pill('Disputed', 'bad'), reviewed: pill('Reviewed', 'wn'), resolved: pill('Resolved', 'ok') })[dispStatus(e)] || '';
const dsSet = (k, v) => { DS[k] = v; if (k === 't' && DS.a && v && teamOf(DS.a) !== v) DS.a = ''; if (k === 'a' && v) DS.t = teamOf(v); render(); };
const DL = () => EV.filter(e => e.dp && (!DS.s || dispStatus(e) === DS.s) && (!DS.t || e.tm === DS.t) && (!DS.a || e.agent === DS.a) && (DS.p === 'all' || (Date.now() - new Date(e.dp.at)) / 864e5 <= (DS.p === 'week' ? 7 : 30))).sort((a, b) => new Date(b.dp.at) - new Date(a.dp.at));
PG.disputes = function () {
  const all = EV.filter(e => e.dp), cnt = k => k ? all.filter(e => dispStatus(e) === k).length : all.length, l = DL();
  const tOpts = TEAMS.filter(t => !t.system && (!DS.a || t.id === teamOf(DS.a))), aOpts = AGENTS().filter(a => !DS.t || a.team === DS.t);
  return head('Disputes', 'Every call that was ever disputed and where it stands', `<div style="display:flex;gap:8px;flex-wrap:wrap">${bellBtn()}${staff() ? `<button class="ib ibx" onclick="xp(DL(),'Disputes')">${IC.dl} Export to Excel</button>` : ''}</div>`)
    + card('', `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${[['', 'All'], ['disputed', 'Disputed'], ['reviewed', 'Reviewed'], ['resolved', 'Resolved']].map(([k, n]) => `<button class="pb ${DS.s === k ? 'on' : ''}" onclick="dsSet('s','${k}')">${n} <b class=mono>${cnt(k)}</b></button>`).join('')}
${ME.role === 'agent' ? '' : `<select onchange="dsSet('t',this.value)"><option value="">All Teams</option>${tOpts.map(t => `<option value="${t.id}" ${t.id === DS.t ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select><select onchange="dsSet('a',this.value)"><option value="">All Agents</option>${aOpts.map(a => `<option value="${esc(a.username)}" ${a.username === DS.a ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select>`}
<div class=sg>${[['week', 'Week'], ['month', 'Month'], ['all', 'All']].map(([k, n]) => `<button class="${DS.p === k ? 'on' : ''}" onclick="dsSet('p','${k}')">${n}</button>`).join('')}</div></div>`)
    + card(`${l.length} disputed call${l.length === 1 ? '' : 's'}`, tbl(['Lead ID', 'Agent', 'Team', 'Disputed on', 'Score', 'Status', 'Last message', 'Outcome'], l.map(e => { const m = e.dp.msgs.filter(x => !x.sys).slice(-1)[0] || {}, r = e.dp.res;
      return [`<a href="javascript:void(0)" class=mono style="color:var(--ac);font-weight:600;text-decoration:none" onclick="om('view','${e.rid}')">${esc(e.id)}</a>`, ME.role !== 'agent' ? agLink(e.agent, agn(e), 'flags') : esc(agn(e)), `<span class=tg style="color:${tcol(e.tm)}">${esc(tn(e.tm))}</span>`, f(new Date(e.dp.at)), sp(e.sc, e.tm), dispPill(e), `<span style="white-space:normal;display:inline-block;max-width:280px"><small class=mu>${esc(m.n || '')}:</small> ${esc((m.t || '').slice(0, 90))}</span>`, r ? `${r.outcome === 'kept' ? 'Score kept' : 'Score changed'}<br><small class=mu>${esc(r.by)} · ${f(new Date(r.at))}</small>` : '<small class=mu>—</small>']; })) || '<p class=mu>No disputes match these filters</p>');
};
