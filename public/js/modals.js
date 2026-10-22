// ===================== Pop-ups =====================
const X = fn => `<button class=ib style="margin-left:auto" onclick="${fn}">✕</button>`;
const OVL = (inner, close, w = 640, z = 50) => `<div class=ov style="z-index:${z}" onclick="if(event.target==this){${close}}"><div class=md style="max-width:${w}px;width:100%">${inner}</div></div>`;
let NUI = [];

// ---------------------------------------------------------------- notifications
const NFT = { task: [IC.check, 'New task', 'var(--ac)'], taskdone: [IC.check, 'Task completed', 'var(--ok)'], quiz: [IC.pen, 'New quiz', 'var(--wn)'], news: [IC.list, 'Newsletter', 'var(--ac)'], cal: [IC.grid, 'Calibration', 'var(--ac)'], review: [IC.eye, 'New Call Review', 'var(--ok)'], dispute: [IC.flag, 'Call Review Disputed', 'var(--wn)'], msg: [IC.pen, 'New dispute message', 'var(--ac)'], resolved: [IC.check, 'Dispute resolved', 'var(--ok)'], remind: [IC.clock, 'Reminder', 'var(--wn)'], reg: [IC.plus, 'New registration request', 'var(--ac)'] };
async function openN() {
  const r0 = await api('/api/notifications'); if (r0.ok) NF = await r0.json();     // always show the freshest list
  NU = UN(); NUI = NF.filter(n => !n.read).map(n => n.id); NO = true; render();
  api('/api/notifications/read', {}).then(r => { if (r.ok) NF.forEach(n => { n.read = true; }); });
}
function nfOpen(id) {
  const n = NF.find(x => x.id === id); if (!n) return;
  NO = false;
  const go = { reg: 'users', task: 'tasks', taskdone: 'tasks', quiz: 'quiz', news: 'news', cal: 'cal' }[n.type];
  if (go) { if (location.hash === '#' + go) render(); else location.hash = go; return; }
  if (n.rid && EV.some(e => e.rid === n.rid)) om('view', n.rid); else { render(); toast('This review no longer exists', true); }
}
const nfDel = id => ask('Delete this notification?', 'It will be removed from your list. This cannot be undone.', async () => {
  const r = await api('/api/notifications/' + id, null, 'DELETE'); if (r.ok) NF = NF.filter(n => n.id !== id); render();
}, { yes: 'Yes, delete', no: 'Cancel', danger: true });
const MODAL = () => OVL(`<div class=mh><h2>Notifications</h2><span class=bg>${NU} unread</span>${X('NO=false;render()')}</div><div class=mb>${NF.map(n => { const t = NFT[n.type] || ['•', 'Notification', 'var(--mu)'];
  return `<div class="nf clk ${NUI.includes(n.id) ? 'unr' : ''}" onclick="nfOpen('${n.id}')"><div class=ni style="color:${t[2]};background:color-mix(in srgb,${t[2]} 16%,transparent)">${t[0]}</div><div style="flex:1"><b>${t[1]}</b><div class=mu>${esc(n.text)}</div><small class=mono>${fdt(n.at)}</small></div><button class=dl onclick="event.stopPropagation();nfDel('${n.id}')" title="Delete">${IC.bin}</button></div>`; }).join('') || '<p class=mu style="padding:20px;text-align:center">No notifications</p>'}</div>`, 'NO=false;render()');

// ---------------------------------------------------------------- review pop-up (summary) + dispute chat
async function dsp(rid) {
  const t = DRF.trim(); if (!t) return toast('Write the reason for your dispute first', true);
  const r = await api(`/api/evaluations/${rid}/dispute`, { text: t }); if (!r.ok) return toast(await errOf(r, 'Could not send the dispute'), true);
  DRF = ''; await load(); render(); toast('Dispute sent to the QA team');
}
async function dmsg(rid) {
  const t = DRF.trim(); if (!t) return;
  const r = await api(`/api/evaluations/${rid}/dispute/msg`, { text: t }); if (!r.ok) return toast(await errOf(r, 'Could not send the message'), true);
  DRF = ''; await load(); render();
}
function doRsv() {
  ask('Resolve this dispute?', 'Are you sure you want to mark this dispute as resolved? The agent will be notified.', async () => {
    const x = RSV, r = await api(`/api/evaluations/${x.rid}/dispute/resolve`, { outcome: x.outcome, note: x.note });
    if (!r.ok) return toast(await errOf(r, 'Could not resolve the dispute'), true);
    RSV = null; await load(); render(); toast('Dispute resolved. The agent was notified.');
  }, { yes: 'Yes, resolve it', no: 'No, go back' });
}
const lnk = (t, u) => /^https?:\/\//.test(u || '') ? `<p style="margin:8px 0"><small>${t}</small><br><a href="${esc(u)}" target=_blank rel=noopener style="color:var(--ac);word-break:break-all">${esc(u)}</a></p>` : '';
const DSP = e => {
  const d = e.dp, mine = ME.role === 'agent' && e.agent === ME.username;
  if (!d) return mine ? `<div class=dsp><b>Do you disagree with this review?</b><textarea rows=3 placeholder="Explain why you want to dispute this review…" oninput="DRF=this.value">${esc(DRF)}</textarea><button class=btn onclick="dsp('${e.rid}')">Dispute this review</button></div>` : '';
  const open = d.status === 'open';
  return `<div class=dsp><div class=row><b>Dispute</b>${open ? pill('Open', 'wn') : pill('Resolved', 'ok')}</div><div class=chat>${d.msgs.map(m => `<div class="msg ${m.sys ? 'sys' : m.u === ME.username ? 'me' : ''}"><small>${esc(m.n)} · ${fdt(m.at)}</small><br>${esc(m.t)}</div>`).join('')}</div>`
    + (open ? `<div class=row style="gap:8px;align-items:flex-end"><textarea rows=2 style="flex:1" placeholder="Write a message…" oninput="DRF=this.value">${esc(DRF)}</textarea><button class=btn onclick="dmsg('${e.rid}')">Send</button></div>${staff() ? `<button class="ib ibx" style="justify-self:start" onclick="RSV={rid:'${e.rid}',outcome:'kept',note:''};render()">✓ Resolve dispute</button>` : ''}`
      : `<p class=mu style="margin:0">Resolved by ${esc(d.res.by)} on ${fdt(d.res.at)}: score ${d.res.outcome === 'kept' ? 'kept' : 'changed'}${d.res.note ? ' — ' + esc(d.res.note) : ''}</p>`) + `</div>`;
};
const MDL = () => {
  const e = EV.find(x => x.rid === MD.id); if (!e) { MD = null; return ''; }
  if (MD.t === 'del') return OVL(`<div class=mh><h2>Delete evaluation?</h2>${X('cm()')}</div><div class=mb><p>This permanently deletes the review for Lead <b class=mono>#${esc(e.id)}</b> (${esc(agn(e))}), including its recording. This cannot be undone.</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class=ib onclick="cm()">Cancel</button><button class=btn style="background:var(--bad)" onclick="rmv('${e.rid}')">Delete</button></div></div>`, 'cm()', 420);
  return OVL(`<div class=mh><h2>Lead #${esc(e.id)}</h2>${sp(e.sc, e.tm)}${e.fl ? `<span class="fgv ${e.fl}" title="${e.fl} flag">${IC.flag}</span>` : ''}${X('cm()')}</div><div class=mb>
<div class="g g2" style="margin:0">${[['Agent', agn(e)], ['Team', tn(e.tm) + (e.tmh && e.tmh !== e.tm ? ' (was ' + tn(e.tmh) + ' at review time)' : '')], ['Campaign', cpn(e)], ['Reviewer', e.rv || '—'], ['Date', fdt(e.d)], ['Scorecard', e.scn || '—']].map(([k, v]) => `<div><small>${k}</small><br><b>${esc(v)}</b></div>`).join('')}</div>
${staff() ? `<div class=row style="flex-wrap:wrap;gap:8px"><small>${e.seen ? '👁 Seen by the agent on ' + fdt(e.seen) : '⚠ Not seen yet by the agent'}</small><span style="display:flex;gap:8px">${!e.seen ? `<button class="ib ibx" onclick="remind('${e.rid}')">${IC.bell} Remind agent</button>` : ''}${hasItems(e) ? `<button class="ib ibx" onclick="edE('${e.rid}')">${IC.pen} Edit score</button>` : ''}</span></div>` : ''}
${(e.cs || []).map(c => { const p = c.m ? c.e / c.m * 100 : 0; return `<div><div class=row><b>${esc(c.n)}${c.k ? '<span class=crit>Critical category</span>' : ''}${c.z ? '<span class=crit>Scored 0</span>' : ''}</b><b class=mono>${c.e}/${c.m}</b></div>${bar(p, scol(p, e.tm))}${c.it.map(i => `<div class=row style="font-size:13px;padding:3px 0;align-items:flex-start"><span>${esc(i.t)}${i.k ? '<span class=crit>Critical</span>' : ''}${i.cm ? `<br><small>${esc(i.cm)}</small>` : ''}</span>${i.a === 'y' ? pill('Yes', 'ok') : i.a === 'n' ? pill('No', 'bad') : pill('N/A', 'ac')}</div>`).join('')}</div>`; }).join('')}
${e.cm ? `<p style="margin:8px 0"><small>General comments</small><br>${esc(e.cm)}</p>` : ''}${lnk('Lead link', e.lk)}${lnk('Recording link', e.rl)}${e.rec ? `<audio class=player controls src="/api/recordings/${esc(e.rec)}"></audio>` : ''}${DSP(e)}</div>`, 'cm()', 720);
};
const RSVM = () => OVL(`<div class=mh><h2>Resolve dispute</h2>${X('RSV=null;render()')}</div><div class=mb><p class=mu style="margin:0">How did you and the agent settle it?</p><label class=rad><input type=radio name=ro ${RSV.outcome === 'kept' ? 'checked' : ''} onchange="RSV.outcome='kept'"><span><b>Score kept</b><br><small>We agreed to keep the score as it is.</small></span></label><label class=rad><input type=radio name=ro ${RSV.outcome === 'changed' ? 'checked' : ''} onchange="RSV.outcome='changed'"><span><b>Score changed</b><br><small>The score was (or will be) updated with Edit score.</small></span></label><label>Closing note <span class=mu>(optional)</span><textarea rows=3 oninput="RSV.note=this.value">${esc(RSV.note)}</textarea></label><div style="display:flex;gap:8px;justify-content:flex-end"><button class=ib onclick="RSV=null;render()">Cancel</button><button class=btn onclick="doRsv()">Resolve dispute</button></div></div>`, 'RSV=null;render()', 480, 60);

// ---------------------------------------------------------------- recording player, confirmation, first-login password
const PLYM = () => { const e = EV.find(x => x.rid === PLY); if (!e || !e.rec) { PLY = null; return ''; } return OVL(`<div class=mh><h2>Recording · Lead #${esc(e.id)}</h2>${X('PLY=null;render()')}</div><div class=mb><small>${esc(agn(e))} · ${f(e.d)}</small><audio class=player controls autoplay src="/api/recordings/${esc(e.rec)}"></audio></div>`, 'PLY=null;render()', 520, 55); };
const CFMM = () => OVL(`<div class=mh><h2>${esc(CFM.title)}</h2></div><div class=mb><p style="margin:0">${esc(CFM.text)}</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class=ib onclick="cfN()">${esc(CFM.no)}</button><button class=btn style="${CFM.danger ? 'background:var(--bad)' : ''}" onclick="cfY()">${esc(CFM.yes)}</button></div></div>`, 'cfN()', 440, 90);
const FIRSTM = () => OVL(`<div class=mh><h2>Set your new password</h2></div><div class=mb><p class=mu style="margin:0">For security, please choose a new password before you continue.</p><div class=form style="max-width:none"><label>New password<input id=pn1 type=password autocomplete=new-password oninput="pwUpd()"></label><label>Confirm new password<input id=pn2 type=password autocomplete=new-password oninput="pwUpd()" onkeydown='if(event.key=="Enter")firstPw()'></label>${pwBox()}<div id=fpe></div><button class=btn onclick="firstPw()">OK</button></div></div>`, '', 480, 95);

// ---------------------------------------------------------------- "my account" menu (click your name) and system settings (gear)
const MYR = () => ROSTER.find(r => r.username === ME.username) || {};
const openAcct = tab => { const m = MYR(); ACD = { languages: [...(m.languages || [])], skills: [...(m.skills || [])] }; PKN = null; AC = tab || 'profile'; render(); };
async function sampleNf() { const r = await api('/api/notifications/sample', {}); if (!r.ok) return toast(await errOf(r, 'Could not create the samples'), true); AC = null; await openN(); toast('Sample notifications added: open any of them to see where it leads'); }
const ACCT = () => {
  const tabs = [['profile', 'Profile'], ['password', 'Password'], ['appearance', 'Appearance'], ['notif', 'Notifications & sound']];
  let b = '';
  if (AC === 'profile') b = `<div class=form style="max-width:none"><label>Full name<input id=apn value="${esc(ME.name)}"></label><label>Email<input id=ape value="${esc(ME.email)}"></label><div><b style="font-size:12px">Languages</b>${pkHtml('ac', 'languages', 'languages')}</div><div><b style="font-size:12px">Skills</b>${pkHtml('ac', 'skills', 'skills')}</div><label>About me<textarea id=apd rows=3>${esc(MYR().desc || '')}</textarea></label><div class="g g2" style="margin:0"><div><small>Team</small><br><b>${esc(tn(ME.team))}</b></div><div><small>Team lead</small><br><b>${esc(leadName(ME.team))}</b></div><div><small>Username</small><br><b>${esc(ME.username)}</b></div><div><small>Role</small><br><b>${ROLE[ME.role] || ME.role}</b></div></div><button class=btn onclick="saveProfile()">Save profile</button></div>`;
  if (AC === 'password') b = `<div class=form style="max-width:none"><label>Current password<input id=pn0 type=password autocomplete=current-password></label><label>New password<input id=pn1 type=password autocomplete=new-password oninput="pwUpd()"></label><label>Repeat new password<input id=pn2 type=password autocomplete=new-password oninput="pwUpd()"></label>${pwBox()}<button class=btn onclick="chPw()">Update password</button></div>`;
  if (AC === 'appearance') b = `<div class=form style="max-width:none"><b>Mode</b><div class=thm style="max-width:260px;background:var(--bg)">${[['light', 'Light', IC.sun], ['dark', 'Dark', IC.moon], ['system', 'System', IC.mon]].map(([k, l, s]) => `<button class="${THM === k ? 'on' : ''}" data-m="${k}" onclick="th('${k}')" title="${l}" style="color:var(--tx)"><span class=ti>${s}</span></button>`).join('')}</div><b>Theme</b><div class=thc>${Object.entries(THEMES).map(([k, x]) => `<button type=button class="thk ${THN === k ? 'on' : ''}" onclick="setTheme('${k}')"><i style="background:linear-gradient(90deg,${x.sb},${x.sb2} 55%,${x.ac})"></i><b>${x.n}</b><small class=mu>${x.d}</small></button>`).join('')}</div><small class=mu>A theme colours the menu, buttons and highlights. Light or dark mode is chosen separately.</small></div>`;
  if (AC === 'notif') b = `<div class=form style="max-width:none"><label class=rad><input type=checkbox ${SND ? 'checked' : ''} onchange="tsnd()"> <span><b>Notification sounds</b><br><small>Play a sound when a review is saved or a new notification arrives.</small></span></label><label>Sound<select onchange="SNDS=this.value;LS.set('qa_snd_style',SNDS);beep(true)">${[['beep', 'Beep'], ['chime', 'Chime'], ['bell', 'Bell']].map(([k, l]) => `<option value=${k} ${SNDS === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label><label>Volume<input type=range min=5 max=100 value=${VOL} oninput="VOL=+this.value;LS.set('qa_vol',VOL)"></label><div style="display:flex;gap:8px;flex-wrap:wrap"><button class=ib onclick="beep(true)">▶ Play test sound</button><button class=ib onclick="sampleNf()">Show me sample notifications</button></div></div>`;
  return OVL(`<div class=mh><h2>My account</h2>${X('AC=null;render()')}</div><div class=tabs>${tabs.map(([k, l]) => `<button class="${AC === k ? 'on' : ''}" onclick="AC='${k}';render()">${l}</button>`).join('')}</div><div class=mb>${b}<small class=mu>Q-smart · version 5</small></div>`, 'AC=null;render()', 600);
};
const SYSM = () => OVL(`<div class=mh><h2>System Settings</h2>${X('SYS=false;render()')}</div><div class=mb><b>Pass Rate Threshold (%)</b><p class=mu style="margin:0">A review passes when its score is at least this value. You can set a different value for a team; leave it empty to use the general one.</p><div class=form style="max-width:none"><label>General pass rate (%)<input id=spg type=number min=1 max=100 value="${PASSG()}"></label>${TEAMS.map(t => `<label>${esc(t.name)} <span class=mu>(optional)</span><input id=spt${t.id} type=number min=1 max=100 placeholder="Same as general" value="${SET.teams && SET.teams[t.id] != null ? SET.teams[t.id] : ''}"></label>`).join('')}<button class=btn onclick="saveSys()">Save settings</button></div>${ME.role === 'admin' ? `<hr style="margin:18px 0;border:0;border-top:1px solid var(--bd)"><b>Demo data</b><p class=mu style="margin:4px 0 10px">Puts the made-up reviews, Auto QA conversations, knowledge base, tasks and sessions back to how they were at the start. Things you created yourself (users, teams, scorecards, your own reviews) stay.</p><button class=ib onclick="resetDemo()">Reset demo data</button>` : ''}</div>`, 'SYS=false;render()', 480);
const resetDemo = () => ask('Reset the data?', 'All data goes back to the copy saved in seed.js. Everything changed since then is replaced (a backup is kept in data.backup.json).', async () => { const r = await api('/api/demo/reset', {}, 'POST'); if (!r.ok) return toast(await errOf(r, 'Could not reset')); SYS = false; await load(); render(); toast('Data reset'); });

// all overlays, in stacking order
const overlays = () => (NO ? MODAL() : '') + (MD ? MDL() : '') + (SSV ? SSVM() : '') + (TKV ? TKM() : '') + (TPLM ? TPLMM() : '') + (RSV ? RSVM() : '') + (AC ? ACCT() : '') + (SYS ? SYSM() : '') + (FM ? FMM() : '') + (PLY ? PLYM() : '') + (AQV ? AQM() : '') + (TEST ? TESTM() : '') + (AIH ? AIHM() : '') + (ME.mustChange ? FIRSTM() : '') + (CFM ? CFMM() : '');
