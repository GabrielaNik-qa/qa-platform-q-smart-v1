// ===================== Tasks: My Tasks (board), Team Progress (today), Evaluation (scores), Templates =====================
// Score of a person (0-100) = 70% completion + 30% done on time − 2 points for every overdue task.
let TV = { tab: 'my', q: '', st: 'all', team: '', agent: '', et: '', p: 'all', sk: 'score', sd: -1 }, TKV = null, TPLM = false;
const isOver = t => t.status !== 'done' && !t.archived && t.due && t.due < todayS();
const TIC = {
  my: svg('<path d="M10 6h11M10 12h11M10 18h11M3 6l1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2"/>', 17),
  team: svg('<circle cx="9" cy="8" r="4"/><path d="M2 21v-1a6 6 0 0112 0v1M16 4a4 4 0 010 8M22 21v-1a6 6 0 00-4-5.6"/>', 17),
  ev: svg('<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>', 17),
  tpl: svg('<path d="M12 2l10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5"/>', 17),
  list: svg('<path d="M10 6h11M10 12h11M10 18h11M3 6l1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2"/>', 18),
  done: svg('<path d="M5 13l4 4L19 7"/>', 18), act: svg('<path d="M21 12a9 9 0 01-15.5 6.3L3 16M3 12a9 9 0 0115.5-6.3L21 8M21 3v5h-5M3 21v-5h5"/>', 18),
  warn: svg('<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0zM12 9v4M12 17h.01"/>', 18),
  arch: svg('<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8M10 12h4"/>', 15),
  pin: svg('<path d="M12 17v5M9 3h6l-1 6 3 3v2H7v-2l3-3z"/>', 15),
  clip: svg('<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 11h6M9 15h4"/>', 15),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 12),
  play: svg('<path d="M7 4l13 8-13 8z"/>', 11), tgt: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>', 12)
};
const TPRI = { high: ['high', 'var(--bad)'], med: ['medium', 'var(--wn)'], low: ['low', 'var(--ok)'] };
const FREQN = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
const tkFreq = t => t.freq || (TPLS.find(p => p.id === t.tpl) || {}).freq || (t.key ? 'daily' : '');
const tkMin = m => !m ? '' : m >= 60 ? Math.floor(m / 60) + 'h' + (m % 60 ? (m % 60) + 'm' : '') : m + 'min';
const tkItems = l => (l || []).map(c => typeof c === 'string' ? { t: c, min: 0 } : c);
// checklist lines typed as "Check email | 5" (5 = minutes)
const tkLines = l => (l || []).map(x => { const m = String(x).match(/^(.*?)\s*\|\s*(\d+)\s*(min)?$/i); return m ? { t: m[1].trim(), min: +m[2] } : { t: String(x).trim(), min: 0 }; }).filter(c => c.t);
const tkUnlines = l => tkItems(l).map(c => c.t + (c.min ? ' | ' + c.min : ''));
const tkAv = (u, s = 30) => `<span class=tkav style="width:${s}px;height:${s}px;--c:${tcol(teamOf(u))}">${esc(ini(an(u) || u))}</span>`;

// ---- numbers of one person or a list of tasks
const tkStats = l => {
  const done = l.filter(t => t.status === 'done'), on = done.filter(t => t.due && t.completed && iso(new Date(t.completed)) <= t.due).length, over = l.filter(isOver).length;
  const comp = l.length ? done.length / l.length * 100 : 0, ont = done.length ? on / done.length * 100 : 0;
  return { total: l.length, done: done.length, on, over, comp, score: l.length ? Math.max(0, Math.min(100, Math.round(.7 * comp + .3 * ont - 2 * over))) : 0 };
};
const tkSCol = v => v >= 80 ? 'var(--ok)' : v >= 60 ? 'var(--wn)' : 'var(--bad)';
const tkInP = (t, p) => p === 'all' || [t.created, t.completed].some(d => d && Date.now() - new Date(d) <= (p === 'week' ? 7 : 30) * 864e5);

// ---- which tasks the board shows
const tkMine = () => TASKS.filter(t => canEditWork() || t.assignee === ME.username);
const tkBase = () => { const q = TV.q.toLowerCase(); return tkMine().filter(t => (!TV.team || teamOf(t.assignee) === TV.team) && (!TV.agent || t.assignee === TV.agent) && (!q || (t.title + ' ' + (t.desc || '') + ' ' + tkItems(t.checklist).map(c => c.t).join(' ') + ' ' + an(t.assignee)).toLowerCase().includes(q))); };
const tkOrder = (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (isOver(b) ? 1 : 0) - (isOver(a) ? 1 : 0) || (a.due || '9').localeCompare(b.due || '9') || String(b.created).localeCompare(String(a.created));

// ---- one card
// how the cards look (each person chooses): compact like Jira (title, who, due, progress; ▸ opens one card), detailed, or a list
let TKVM = LS.get('qa_tkvm', 'compact'); const TKX = new Set();   // TKX = cards opened in the compact view
const tkVm = v => { TKVM = v; LS.set('qa_tkvm', v); render(); };
const tkExp = id => { if (TKX.has(id)) TKX.delete(id); else TKX.add(id); tkRt(); };
function tkCard(t) {
  const can = canEditWork() || t.assignee === ME.username, ed = canEditWork(), cl = tkItems(t.checklist), dn = cl.filter(c => c.done).length, [pn, pc] = TPRI[t.priority] || TPRI.med, fq = tkFreq(t), td = todayS();
  const open = TKVM === 'detail' || TKX.has(t.id), xb = TKVM === 'detail' ? '' : `<button class="ic tkxp ${open ? 'on' : ''}" onclick="event.stopPropagation();tkExp('${t.id}')" title="${open ? 'Show less' : 'Show the details'}" aria-expanded="${open}">${IC.chev}</button>`;
  const acts = `<span class=tkac onclick="event.stopPropagation()">${can ? `<button class=ic title="${t.pinned ? 'Unpin' : 'Pin to the top'}" onclick="tkSet('${t.id}',{pinned:${!t.pinned}})" style="${t.pinned ? 'color:var(--ac)' : ''}">${TIC.pin}</button><button class=ic title="${t.archived ? 'Restore from the archive' : 'Archive'}" onclick="tkSet('${t.id}',{archived:${!t.archived}})">${TIC.arch}</button>` : ''}${ed ? `<button class=ic title="Edit" onclick="editTask('${t.id}')">${IC.pen}</button><button class=ic title="Delete" onclick="delTask('${t.id}')">${IC.bin}</button>` : ''}</span>`;
  const sw = t.archived ? '' : `<div class=tksw onclick="event.stopPropagation()">${[['todo', 'To Do', TIC.clip], ['doing', 'Active', TIC.act], ['done', 'Done', TIC.done]].map(([k, n, ic]) => `<button class="${(t.status === k || (k === 'doing' && t.status === 'review')) ? 'on' : ''}" ${can ? `onclick="mvT('${t.id}','${k}')"` : 'disabled'}>${ic} ${n}</button>`).join('')}</div>`;
  const who = ed ? `<small>For ${esc(an(t.assignee) || t.assignee)} · created by ${esc(an(t.by) || t.by || '—')}</small>` : `<small>Created by ${esc(an(t.by) || t.by || '—')}</small>`;
  const due = !t.due ? '' : t.status === 'done' ? `<span class=tkch>Due ${t.due}</span>` : isOver(t) ? `<span class=tkch style="--c:var(--bad)">${IC.clock} Overdue!</span>` : t.due === td ? `<span class=tkch style="--c:var(--wn)">Due today</span>` : `<span class=tkch>Due ${t.due}</span>`;
  const start = t.start ? (t.start <= td ? `<span class=tkch style="--c:var(--ok)">${TIC.play} Started</span>` : `<span class=tkch>Starts ${t.start}</span>`) : '';
  const head = `draggable=${can && !t.archived} ondragstart="event.dataTransfer.setData('text/plain','${t.id}')" onclick="TKV='${t.id}';render()"`;
  if (!open) return `<div class="tkx tkc ${t.pinned ? 'pin' : ''}" style="--pc:${pc}" ${head}><div class=tkh><i class=tkdot style="background:${pc}" title="Priority: ${pn}"></i><b title="${esc(t.title)}">${esc(t.title)}</b>${acts}${xb}</div>`
    + `<div class=tkf>${ed ? `<span title="${esc(an(t.assignee) || t.assignee)}">${tkAv(t.assignee, 20)}</span>` : ''}${cl.length ? `<span class=tkch style="--c:${dn === cl.length ? 'var(--ok)' : 'var(--ac)'}">${TIC.clip} ${dn}/${cl.length}</span>` : ''}${due}${t.type === 'mission' ? `<span class=tkch style="--c:var(--wn)" title="Target">${TIC.tgt}</span>` : ''}${t.points ? `<span class=tkch style="--c:var(--ok)">+${t.points} XP</span>` : ''}</div>`
    + (cl.length ? `<div class=tkpb><i style="width:${Math.round(dn / cl.length * 100)}%"></i></div>` : '') + `</div>`;
  if (cl.length) {
    const tot = cl.reduce((a, c) => a + (c.min || 0), 0);
    return `<div class="tkx ${t.pinned ? 'pin' : ''}" style="--pc:${pc}" ${head}><div class=tkh><span style="color:var(--mu)">${TIC.clip}</span><b>${esc(t.title)}</b>${acts}<span class=tkn style="color:${dn === cl.length ? 'var(--ok)' : 'var(--ac)'}">${dn}/${cl.length}</span>${xb}</div>`
      + `<div class=tkit onclick="event.stopPropagation()">${cl.map((c, i) => `<label><input type=checkbox ${c.done ? 'checked' : ''} ${can && !t.archived ? '' : 'disabled'} onchange="tickT('${t.id}',${i},this.checked)"><i style="background:${pc}"></i><span style="${c.done ? 'text-decoration:line-through;opacity:.55' : ''}">${esc(c.t)}</span>${c.min ? `<small>${TIC.clock} ${tkMin(c.min)}</small>` : ''}</label>`).join('')}</div>`
      + `<div class=tkf><span class=tkch style="--c:${pc}">${pn}</span><span class=tkch style="--c:#a855f7">${TIC.clip} checklist</span>${fq ? `<span class=tkch>${FREQN[fq]}</span>` : ''}${due}<small>${cl.length} tasks${tot ? ' · ~' + tkMin(tot) : ''}</small></div>${who}${sw}</div>`;
  }
  return `<div class="tkx ${t.pinned ? 'pin' : ''}" style="--pc:${pc}" ${head}><div class=tkh><i class=tkdot style="background:${pc}"></i><b>${esc(t.title)}</b>${acts}${xb}</div>${t.desc ? `<p>${esc(t.desc.length > 140 ? t.desc.slice(0, 140) + '…' : t.desc)}</p>` : ''}`
    + `<div class=tkf>${due}${start}${t.type === 'mission' ? `<span class=tkch style="--c:var(--wn)">${TIC.tgt} Target</span>` : ''}<span class=tkch style="--c:${pc}">${pn}</span>${fq ? `<span class=tkch>${FREQN[fq]}</span>` : ''}${t.points ? `<span class=tkch style="--c:var(--ok)">+${t.points} XP</span>` : ''}</div>${who}${sw}</div>`;
}

// ---- actions on cards
function tkDrop(ev, st) { ev.preventDefault(); const id = ev.dataTransfer.getData('text/plain'); if (id) mvT(id, st); }
async function mvT(id, st) {
  const t = TASKS.find(x => x.id === id); if (!t || t.status === st) return; const old = t.status; t.status = st; render();
  const r = await api('/api/tasks/' + id, { status: st }, 'PUT');
  if (!r.ok) { t.status = old; render(); return toast(await errOf(r, 'Could not move the card'), true); }
  Object.assign(t, await r.json()); render(); if (st === 'done') { beep(); toast(t.points ? `Done! +${t.points} XP` : 'Done!'); }
}
async function tkSet(id, b) { const t = TASKS.find(x => x.id === id); const r = await api('/api/tasks/' + id, b, 'PUT'); if (!r.ok) return toast(await errOf(r, 'Could not save'), true); Object.assign(t, await r.json()); render(); if (b.archived !== undefined) toast(b.archived ? 'Archived' : 'Restored'); }
// ticking a step moves the card by itself: first tick = Active, last tick = Done
async function tickT(id, i, on) {
  const t = TASKS.find(x => x.id === id); t.checklist[i].done = on; const r = await api('/api/tasks/' + id, { checklist: t.checklist }, 'PUT'); if (r.ok) Object.assign(t, await r.json());
  const cl = t.checklist, all = cl.every(c => c.done);
  if (all && t.status !== 'done') return mvT(id, 'done');
  if (!all && t.status === 'done') return mvT(id, 'doing');
  if (on && t.status === 'todo') return mvT(id, 'doing');
  render();
}

// ---- the page
const tkKpi = (t, v, s, ic, c, click) => `<div class="tkk ${click ? 'clk' : ''}" ${click ? `onclick="${click}"` : ''}><div class=row><span>${t}</span><span style="color:var(--mu)">${ic}</span></div><b style="color:${c || 'var(--tx)'}">${v}</b><small>${s}</small></div>`;
function tkMyScore() {
  const s = tkStats(TASKS.filter(t => t.assignee === ME.username));
  return `<div class=tkms><div><div class=cap>MY SCORE</div><div class=tkmsv><b style="color:${s.total ? tkSCol(s.score) : 'var(--bad)'}">${s.score}</b><small>/100</small></div><div class=row style="gap:10px"><div style="flex:1">${bar(s.comp, tkSCol(s.score))}</div><small>${Math.round(s.comp)}%</small></div></div><div class=tkmss><div><b>${s.done}/${s.total}</b><small>DONE</small></div><div><b>${s.on}</b><small>ON TIME</small></div><div><b style="${s.over ? 'color:var(--bad)' : ''}">${s.over}</b><small>OVERDUE</small></div></div></div>`;
}
const tkTeams = () => TEAMS.filter(t => !t.system && AGENTS().some(a => a.team === t.id));
const tkTeamChips = (key, cnt) => `<div class=tkchips><button class="tkcp ${TV[key] ? '' : 'on'}" onclick="TV.${key}='';${key === 'team' ? "TV.agent='';" : ''}render()">All Teams</button>${tkTeams().map(t => `<button class="tkcp ${TV[key] === t.id ? 'on' : ''}" onclick="TV.${key}='${t.id}';${key === 'team' ? "TV.agent='';" : ''}render()"><i style="background:${t.color}"></i>${esc(t.name)}${cnt ? ` (${cnt(t.id)})` : ''}</button>`).join('')}</div>`;

function tkMy() {
  const base = tkBase(), act = base.filter(t => !t.archived), arc = base.filter(t => t.archived), ed = canEditWork(), s = tkStats(act);
  const inProg = act.filter(t => t.status === 'doing' || t.status === 'review').length;
  const kp = `<div class=tkkp>${tkKpi('Total Tasks', act.length, 'assigned', TIC.list)}${tkKpi('Completed', s.done, Math.round(s.comp) + '% rate', TIC.done, 'var(--ok)')}${tkKpi('In Progress', inProg, 'active now', TIC.act, 'var(--wn)')}${tkKpi('Overdue', s.over, 'need attention', TIC.warn, 'var(--bad)')}${tkKpi('Archived', arc.length, 'click to view', TIC.arch, '', "TV.st='archive';render()")}</div>`;
  const cnt = k => k === 'archive' ? arc.length : k === 'all' ? act.length : act.filter(t => k === 'active' ? (t.status === 'doing' || t.status === 'review') : t.status === k).length;
  const segs = [['all', `All (${cnt('all')})`], ['todo', 'To Do'], ['active', 'Active'], ['done', 'Done'], ['archive', `${TIC.arch} Archives (${cnt('archive')})`]];
  const all = tkMine().filter(t => !t.archived), people = AGENTS().filter(a => !TV.team || a.team === TV.team);
  const filt = `<section class="card tkfl"><div class=row style="justify-content:flex-start;gap:12px;flex-wrap:wrap"><div class=sx style="width:300px"><span>${IC.search}</span><input id=tkq placeholder="Search tasks…" value="${esc(TV.q)}" oninput="TV.q=this.value;tkRt()"></div><div class=sg>${segs.map(([k, n]) => `<button class="${TV.st === k ? 'on' : ''}" onclick="TV.st='${k}';render()">${n}</button>`).join('')}</div><div class=sg role=group aria-label="View" style="margin-left:auto">${[['compact', 'Compact'], ['detail', 'Detailed'], ['list', 'List']].map(([k, n]) => `<button class="${TKVM === k ? 'on' : ''}" onclick="tkVm('${k}')">${n}</button>`).join('')}</div></div>`
    + (ed ? `<div class=tkrow><span class=cap>TEAM</span>${tkTeamChips('team', id => all.filter(t => teamOf(t.assignee) === id).length)}</div><div class=tkrow><span class=cap>AGENT</span><div class=tkchips><button class="tkcp ${TV.agent ? '' : 'on'}" onclick="TV.agent='';render()">All (${people.length})</button>${people.map(a => `<button class="tkcp ${TV.agent === a.username ? 'on' : ''}" onclick="TV.agent='${esc(a.username)}';render()" title="${esc(a.name)} · ${all.filter(t => t.assignee === a.username).length} tasks">${tkAv(a.username, 22)}${esc(a.name.split(' ')[0])}</button>`).join('')}</div></div>` : '') + `</section>`;
  return kp + filt + `<div id=tkbd>${tkBoard()}</div>`;
}
function tkBoard() {
  const base = tkBase();
  if (TV.st === 'archive') { const l = base.filter(t => t.archived).sort((a, b) => String(b.archived).localeCompare(String(a.archived))); return l.length ? `<div class=tkarc>${l.slice(0, 60).map(tkCard).join('')}</div>${l.length > 60 ? `<small class=mu>Showing the 60 most recent of ${l.length}</small>` : ''}` : '<div class=agem>The archive is empty</div>'; }
  const act = base.filter(t => !t.archived);
  if (TKVM === 'list') {
    const l = act.filter(t => TV.st === 'all' || (TV.st === 'active' ? t.status === 'doing' || t.status === 'review' : t.status === TV.st)).sort(tkOrder), ed = canEditWork(), stn = { todo: 'To Do', doing: 'In Progress', review: 'In Progress', done: 'Done' };
    return l.length ? `<div class=card style="padding:0"><div class=sc><table class=ct><tr><th>TASK</th>${ed ? '<th>FOR</th>' : ''}<th>STATUS</th><th>PRIORITY</th><th>DUE</th><th>PROGRESS</th></tr>${l.map(t => { const cl = tkItems(t.checklist), dn = cl.filter(c => c.done).length, [pn, pc] = TPRI[t.priority] || TPRI.med;
      return `<tr class=clk onclick="TKV='${t.id}';render()"><td><i class=tkdot style="background:${pc}"></i> <b>${esc(t.title)}</b>${t.pinned ? ` <span style="color:var(--ac)">${TIC.pin}</span>` : ''}</td>${ed ? `<td style="white-space:nowrap">${tkAv(t.assignee, 22)} ${esc(an(t.assignee) || t.assignee)}</td>` : ''}<td>${stn[t.status] || esc(t.status)}</td><td><span class=tkch style="--c:${pc}">${pn}</span></td><td style="white-space:nowrap">${t.due ? (isOver(t) ? `<b style="color:var(--bad)">${t.due}</b>` : t.due) : '—'}</td><td>${cl.length ? `<div class=sv><b class=mono>${dn}/${cl.length}</b>${bar(dn / cl.length * 100, dn === cl.length ? 'var(--ok)' : 'var(--ac)')}</div>` : '—'}</td></tr>`; }).join('')}</table></div></div>` : '<div class=agem>No tasks here</div>';
  }
  const cols = [['todo', 'To Do', 'var(--mu)', 'Nothing to do'], ['doing', 'In Progress', 'var(--wn)', 'Nothing in progress'], ['done', 'Done', 'var(--ok)', 'No completed tasks']].filter(([k]) => TV.st === 'all' || TV.st === k || (TV.st === 'active' && k === 'doing'));
  return `<div class=tkkan style="grid-template-columns:repeat(${cols.length},minmax(260px,1fr))">${cols.map(([k, n, c, em]) => { let x = act.filter(t => k === 'doing' ? (t.status === 'doing' || t.status === 'review') : t.status === k); const total = x.length;
    x = k === 'done' ? x.sort((a, b) => String(b.completed).localeCompare(String(a.completed))).slice(0, 30) : x.sort(tkOrder);
    return `<div class=tkcol ondragover="event.preventDefault()" ondrop="tkDrop(event,'${k}')"><div class=tkchd><span><i style="background:${c}"></i>${n}</span><span class=bg>${total}</span></div>${x.map(tkCard).join('') || `<div class=tkem>${em}</div>`}${total > x.length ? `<small class=mu style="text-align:center">+${total - x.length} older — archive them to keep the board short</small>` : ''}</div>`; }).join('')}</div>`;
}
const tkRt = () => { const b = $('#tkbd'); if (b) b.innerHTML = tkBoard(); };

// ---- Team Progress: how far everybody is today (who is behind comes first)
function tkTeam() {
  const td = todayS(), people = AGENTS().filter(a => !TV.et || a.team === TV.et).map(a => {
    const l = TASKS.filter(t => t.assignee === a.username && !t.archived), today = l.filter(t => t.due === td || (t.status !== 'done' && (!t.start || t.start <= td)) || (t.completed && iso(new Date(t.completed)) === td));
    let u = 0, d = 0; today.forEach(t => { const cl = tkItems(t.checklist); if (cl.length) { u += cl.length; d += t.status === 'done' ? cl.length : cl.filter(c => c.done).length; } else { u++; if (t.status === 'done') d++; } });
    const last = l.filter(t => t.completed).sort((x, y) => String(y.completed).localeCompare(String(x.completed)))[0];
    return { a, u, d, pct: u ? d / u * 100 : 100, open: l.filter(t => t.status === 'todo').length, act: l.filter(t => t.status === 'doing' || t.status === 'review').length, over: l.filter(isOver).length, last };
  }).sort((x, y) => x.pct - y.pct || y.over - x.over);
  const teams = tkTeams().filter(t => !TV.et || t.id === TV.et).map(t => { const p = people.filter(x => x.a.team === t.id), u = p.reduce((s, x) => s + x.u, 0), d = p.reduce((s, x) => s + x.d, 0); return { t, n: p.length, pct: u ? d / u * 100 : null, over: p.reduce((s, x) => s + x.over, 0) }; }).filter(x => x.n);
  return tkTeamChips('et') + `<div class=tktg>${teams.map(x => `<div class=tkk><div class=row><span><i class=tkdot style="background:${x.t.color}"></i> ${esc(x.t.name)}</span><small>${x.n} agents</small></div><b style="color:${x.pct == null ? 'var(--mu)' : tkSCol(x.pct)}">${x.pct == null ? '—' : Math.round(x.pct) + '%'}</b>${bar(x.pct || 0, x.pct == null ? 'var(--bd)' : tkSCol(x.pct))}<small>done today${x.over ? ` · <span style="color:var(--bad)">${x.over} overdue</span>` : ''}</small></div>`).join('')}</div>`
    + `<div class=tkpg>${people.map(x => `<div class="tkp clk" onclick="TV.tab='my';TV.agent='${esc(x.a.username)}';TV.team='';TV.st='all';render()"><div class=row style="justify-content:flex-start;gap:10px">${tkAv(x.a.username, 36)}<div style="min-width:0;flex:1"><b>${esc(x.a.name)}</b><br><small>${esc(tn(x.a.team))}</small></div><b style="color:${tkSCol(x.pct)};font-size:16px">${Math.round(x.pct)}%</b></div>${bar(x.pct, tkSCol(x.pct))}<div class=row style="flex-wrap:wrap;gap:6px;justify-content:flex-start"><span class=tkch>${x.d}/${x.u} today</span><span class=tkch>${x.open} to do</span><span class=tkch style="--c:var(--wn)">${x.act} active</span>${x.over ? `<span class=tkch style="--c:var(--bad)">${x.over} overdue</span>` : ''}</div><small>${x.last ? 'Last done ' + fdt(x.last.completed) : 'Nothing completed yet'}</small></div>`).join('') || '<div class=agem>No agents in this team</div>'}</div>`;
}

// ---- Evaluation: score of every agent (click a name to open the agent profile)
const TKS = { name: r => r.a.name, total: r => r.s.total, done: r => r.s.done, on: r => r.s.on, over: r => r.s.over, comp: r => r.s.comp, score: r => r.s.score };
function tkEval() {
  const rows = AGENTS().filter(a => !TV.et || a.team === TV.et).map(a => ({ a, s: tkStats(TASKS.filter(t => t.assignee === a.username && tkInP(t, TV.p))) })), g = TKS[TV.sk];
  rows.sort((x, y) => { const a = g(x), b = g(y); return (a > b ? 1 : a < b ? -1 : 0) * TV.sd; });
  const th = (k, t, al) => `<th style="cursor:pointer;${al ? 'text-align:' + al : ''}" onclick="TV.sd=TV.sk==='${k}'?-TV.sd:(${k === 'name' ? 1 : -1});TV.sk='${k}';render()">${t} <span style="opacity:${TV.sk === k ? 1 : .4}">${TV.sk === k ? (TV.sd > 0 ? '↑' : '↓') : '↕'}</span></th>`;
  return `<div class=row style="flex-wrap:wrap;gap:10px">${tkTeamChips('et')}<div class=sg>${[['week', 'Week'], ['month', 'Month'], ['all', 'All time']].map(([k, n]) => `<button class="${TV.p === k ? 'on' : ''}" onclick="TV.p='${k}';render()">${n}</button>`).join('')}</div></div>`
    + `<section class="card" style="padding:0;margin-top:14px"><div class=sc><table class="ct tkev"><tr>${th('name', 'AGENT')}${th('total', 'TOTAL', 'center')}${th('done', 'DONE', 'center')}${th('on', 'ON TIME', 'center')}${th('over', 'OVERDUE', 'center')}${th('comp', 'COMPLETION', 'center')}${th('score', 'SCORE', 'center')}</tr>`
    + rows.map(r => `<tr><td><div class=row style="justify-content:flex-start;gap:12px">${tkAv(r.a.username, 32)}<div>${agLink(r.a.username, r.a.name)}<br><small>${esc(tn(r.a.team))}</small></div></div></td><td style="text-align:center">${r.s.total}</td><td style="text-align:center;color:var(--ok)">${r.s.done}</td><td style="text-align:center">${r.s.on}</td><td style="text-align:center;${r.s.over ? 'color:var(--bad)' : ''}">${r.s.over}</td><td><div class=row style="justify-content:center;gap:10px"><div style="width:90px">${bar(r.s.comp, 'var(--ok)')}</div><b>${Math.round(r.s.comp)}%</b></div></td><td style="text-align:center"><span class=tkscore style="--c:${r.s.total ? tkSCol(r.s.score) : 'var(--mu)'}">${r.s.total ? r.s.score : '—'}</span></td></tr>`).join('')
    + `</table></div></section><small class=mu>Score = 70% completion + 30% done on time (by the deadline) − 2 points for every overdue task.</small>`;
}

// ---- Templates: saved task lists, used by hand or repeated by themselves
function tkTpls() {
  const l = TPLS.map(p => ({ ...p, items: tkItems(p.checklist) }));
  return `<p class=mu style="margin:0 0 14px">${l.length} template${l.length === 1 ? '' : 's'} saved</p><div class=tktp>${l.map(p => { const [pn, pc] = TPRI[p.priority] || TPRI.med, fq = p.freq || 'none', kind = p.kind || 'target', tot = p.items.reduce((a, c) => a + (c.min || 0), 0);
    return `<div class=tktc style="--tc:${p.color || '#7c3aed'}"><div class=tkh><div style="flex:1;min-width:0"><b style="font-size:17px">${esc(p.title)}</b>${p.desc ? `<br><small>${esc(p.desc)}</small>` : ''}</div><span class=tkac><button class=ic title="Edit" onclick="editTpl('${p.id}')">${IC.pen}</button><button class=ic title="Delete" onclick="delTpl('${p.id}')">${IC.bin}</button></span></div>`
      + `<div class=tkti>${p.items.map(c => `<div><span>${esc(c.t)}</span>${c.min ? `<small>${TIC.clock} ${tkMin(c.min)}</small>` : ''}</div>`).join('') || '<small class=mu>No steps — one single task</small>'}</div>`
      + `<div class=tkf><span class=tkch style="--c:${pc}">${pn}</span><span class=tkch style="--c:#a855f7">${kind}</span>${fq !== 'none' ? `<span class=tkch style="--c:var(--ac)">recurring · ${FREQN[fq]}</span>` : ''}<small>${p.items.length ? p.items.length + ' tasks' : '1 task'}${tot ? ' · ~' + tkMin(tot) : ''}</small></div>`
      + (fq !== 'none' ? `<small>Goes to: ${esc([...(p.teams || []).map(tn), ...(p.users || []).map(an)].join(', ') || '—')}</small>` : '')
      + `<div class=row style="border-top:1px solid var(--bd);padding-top:10px;margin-top:auto"><small>Created by ${esc(an(p.by) || p.by || '—')}</small><button class=pb onclick="useTpl('${p.id}')">Use template</button></div></div>`; }).join('') || '<div class=agem>No templates yet. Save the lists your agents repeat every day.</div>'}</div>`;
}

PG.tasks = function () {
  const ed = canEditWork(); if (!ed) TV.tab = 'my';
  const tabs = [['my', 'My Tasks', TIC.my], ['team', 'Team Progress', TIC.team], ['ev', 'Evaluation', TIC.ev], ['tpl', 'Templates', TIC.tpl]];
  const btn = !ed ? '' : TV.tab === 'tpl' ? `<button class="btn ibx" onclick="newTpl()">${IC.plus} New Template</button>` : `<button class="btn ibx" onclick="newTask()">${IC.plus} New Task</button>`;
  const top = `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><div class=sx style="width:290px"><span>${IC.search}</span><input class=qi style="padding-right:64px" placeholder="Search lead ID, agent, campaign…" onkeydown='if(event.key=="Enter"){Q=this.value.trim();KQ=true;location.hash="calls"}'><kbd class=kb>Ctrl K</kbd></div>${bellBtn()}${btn}</div>`;
  const body = { my: tkMy, team: tkTeam, ev: tkEval, tpl: tkTpls }[TV.tab]();
  return head('Tasks', 'Manage daily tasks, track deadlines, and evaluate agent productivity', top)
    + `<div class=tktop>${ed ? `<div class="tktabs">${tabs.map(([k, n, ic]) => `<button class="${TV.tab === k ? 'on' : ''}" onclick="TV.tab='${k}';render()">${ic} ${n}</button>`).join('')}</div>` : '<div></div>'}${tkMyScore()}</div>` + body;
};

// ---- forms
const TASK_FIELDS = [
  { k: 'title', l: 'Title', req: 1 }, { k: 'desc', l: 'Description', t: 'textarea' },
  { k: 'type', l: 'Type', t: 'select', o: [['task', '✅ Task'], ['mission', '🎯 Target (earns XP)']] }, { k: 'priority', l: 'Priority', t: 'select', o: [['low', '🟢 Low'], ['med', '🟡 Medium'], ['high', '🔴 High']] },
  { k: 'start', l: 'Start date', t: 'date' }, { k: 'due', l: 'Deadline', t: 'date' }, { k: 'points', l: 'XP points', t: 'number' }, { k: 'labels', l: 'Labels', t: 'chips' },
  { k: 'checklist', l: 'Checklist (one step per line, add | 5 for 5 minutes)', t: 'lines', rows: 5, ph: 'Check work email | 5\nClose tickets in Zendesk | 20' }
];
const newTask = (pre = {}) => openForm({ title: pre.title ? 'New task from template' : 'New task', w: 640, yes: 'Give to agents', d: { title: '', desc: '', type: 'task', priority: 'med', points: 0, start: '', due: '', labels: [], checklist: [], assignees: TV.agent ? [TV.agent] : [], teams: TV.team ? [TV.team] : [], ...pre },
  fields: [...TASK_FIELDS, { k: 'teams', l: 'Give to whole teams', t: 'multi', o: () => tkTeams().map(t => [t.id, t.name]) }, { k: 'assignees', l: 'And / or specific agents', t: 'multi', o: agentOpts }],
  save: async d => { const r = await api('/api/tasks', { ...d, checklist: tkLines(d.checklist) }); if (!r.ok) return errOf(r, 'Could not create the task'); const l = await r.json(); TV.tab = 'my'; await load(); toast(`Given to ${l.length} agent${l.length === 1 ? '' : 's'}`); } });
const editTask = id => { const t = TASKS.find(x => x.id === id); TKV = null; openForm({ title: 'Edit task', w: 640, d: { ...t, start: t.start || '', checklist: tkUnlines(t.checklist) }, fields: [...TASK_FIELDS, { k: 'assignee', l: 'Assigned to', t: 'select', o: agentOpts }],
  save: async d => { const old = tkItems(t.checklist), body = { ...d, checklist: tkLines(d.checklist).map(c => ({ ...c, done: !!(old.find(o => o.t === c.t) || {}).done })) }; const r = await api('/api/tasks/' + id, body, 'PUT'); if (!r.ok) return errOf(r, 'Could not save the task'); await load(); toast('Task saved'); } }); };
const delTask = id => ask('Delete this task?', 'It is removed for the agent too. Archive it instead if you want to keep the history.', async () => { TKV = null; const r = await api('/api/tasks/' + id, null, 'DELETE'); toast(r.ok ? 'Task deleted' : await errOf(r, 'Could not delete'), !r.ok); await load(); render(); }, { yes: 'Yes, delete', no: 'Cancel', danger: true });
const TKM = () => { const t = TASKS.find(x => x.id === TKV); if (!t) { TKV = null; return ''; } const can = canEditWork() || t.assignee === ME.username;
  return OVL(`<div class=mh><h2>${t.type === 'mission' ? '🎯' : '✅'} ${esc(t.title)}</h2>${X("TKV=null;render()")}</div><div class=mb><div class=row style="flex-wrap:wrap;gap:8px"><span>${pill(({ todo: 'To do', doing: 'In progress', review: 'In progress', done: 'Done' })[t.status], t.status === 'done' ? 'ok' : 'ac')} ${t.archived ? pill('Archived', 'wn') : ''}</span><small class=mu>${esc(an(t.assignee) || t.assignee)} · given by ${esc(an(t.by) || t.by)}</small></div>${t.desc ? `<p style="margin:0">${lineBr(t.desc)}</p>` : ''}${tkCard(t).replace('draggable=true', 'draggable=false').replace(/onclick="TKV='[^']*';render\(\)"/, '')}${t.completed ? `<small class=mu>Completed ${fdt(t.completed)}</small>` : ''}${canEditWork() ? `<div style="display:flex;gap:8px"><button class="ib ibx" onclick="editTask('${t.id}')">${IC.pen} Edit</button><button class="ib ibx" onclick="delTask('${t.id}')">${IC.bin} Delete</button></div>` : ''}</div>`, 'TKV=null;render()', 560, 55); };
const TPLMM = () => '';

const TPL_FIELDS = [
  { k: 'title', l: 'Template name', req: 1 }, { k: 'desc', l: 'Description', t: 'textarea', rows: 2 },
  { k: 'kind', l: 'Type', t: 'select', o: [['checklist', '📋 Checklist'], ['target', '🎯 Target'], ['task', '✅ Task']] }, { k: 'priority', l: 'Priority', t: 'select', o: [['low', 'Low'], ['med', 'Medium'], ['high', 'High']] },
  { k: 'checklist', l: 'Steps (one per line, add | 5 for 5 minutes)', t: 'lines', rows: 6, ph: 'Check work email – Outlook | 5\nCheck escalation group in Teams | 10' },
  { k: 'color', l: 'Colour', t: 'color' }, { k: 'points', l: 'XP points', t: 'number' },
  { k: 'freq', l: 'Repeats', t: 'select', re: 1, o: [['none', 'No — I use it by hand'], ['daily', 'Every day'], ['weekly', 'Every week'], ['monthly', 'Every month']] },
  { k: 'weekday', l: 'On', t: 'select', show: d => d.freq === 'weekly', o: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((n, i) => [i, n]) },
  { k: 'monthday', l: 'On day of the month (1-28)', t: 'number', show: d => d.freq === 'monthly' },
  { k: 'teams', l: 'Teams that receive it', t: 'multi', show: d => d.freq !== 'none', o: () => tkTeams().map(t => [t.id, t.name]) }, { k: 'users', l: 'Specific agents that receive it', t: 'multi', show: d => d.freq !== 'none', o: agentOpts }
];
const tplSave = id => async d => { const r = await api('/api/task-templates' + (id ? '/' + id : ''), { ...d, checklist: tkLines(d.checklist) }, id ? 'PUT' : 'POST'); if (!r.ok) return errOf(r, 'Could not save the template'); await load(); toast(id ? 'Template saved' : 'Template created'); };
const newTpl = () => openForm({ title: 'New template', w: 640, yes: 'Create', d: { title: '', desc: '', kind: 'checklist', priority: 'med', checklist: [], color: SWATCH[1], points: 0, freq: 'none', weekday: 1, monthday: 1, teams: [], users: [] }, fields: TPL_FIELDS, save: tplSave() });
const editTpl = id => { const p = TPLS.find(x => x.id === id); openForm({ title: 'Edit template', w: 640, d: { kind: 'target', color: SWATCH[1], monthday: 1, ...p, checklist: tkUnlines(p.checklist) }, fields: TPL_FIELDS, save: tplSave(id) }); };
const useTpl = id => { const p = TPLS.find(x => x.id === id); newTask({ title: p.title, desc: p.desc || '', type: p.kind === 'target' ? 'mission' : 'task', priority: p.priority, points: p.points || 0, labels: p.labels || [], checklist: tkUnlines(p.checklist), tpl: p.id }); };
const delTpl = id => ask('Delete this template?', 'No new cards will be created from it. Cards already given stay.', async () => { await api('/api/task-templates/' + id, null, 'DELETE'); await load(); render(); }, { yes: 'Yes, delete', no: 'Cancel', danger: true });
