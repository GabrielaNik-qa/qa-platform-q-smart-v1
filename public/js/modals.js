// ===================== Pop-ups =====================
const X = fn => `<button class="ic xbtn" onclick="${fn}" title="Close" aria-label="Close">${IC.x}</button>`;
// every pop-up: a dimmed background (clicking it, or Esc, closes the pop-up) and a dialog named after its first heading
const OVL = (inner, close, w = 640, z = 50, cls = '') => `<div class=ov style="z-index:${z}" onclick="if(event.target==this){${close}}"><div class="md ${cls}" role=dialog aria-modal=true aria-labelledby="dt${z}" style="max-width:${w}px;width:100%">${inner.replace('<h2', '<h2 id="dt' + z + '"')}</div></div>`;
let NUI = [];

// ---------------------------------------------------------------- notifications
const NFT = { task: [IC.check, 'New task', 'var(--ac)'], taskdone: [IC.check, 'Task completed', 'var(--ok)'], quiz: [IC.pen, 'New quiz', 'var(--wn)'], news: [IC.list, 'Newsletter', 'var(--ac)'], cal: [IC.grid, 'Calibration', 'var(--ac)'], review: [IC.eye, 'New Call Review', 'var(--ok)'], dispute: [IC.flag, 'Call Review Disputed', 'var(--wn)'], msg: [IC.pen, 'New dispute message', 'var(--ac)'], resolved: [IC.check, 'Dispute resolved', 'var(--ok)'], remind: [IC.clock, 'Reminder', 'var(--wn)'], reg: [IC.plus, 'New registration request', 'var(--ac)'] };
async function openN() {
  const r0 = await api('/api/notifications'); if (r0.ok) NF = (await r0.json()).filter(n => !NDEL.has(n.id));     // always show the freshest list
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
// a routine action: the person may switch the question off. It is only really deleted when the Undo chance is over
// (closing the page before that simply keeps the notification).
const nfDel = id => ask('Delete this notification?', 'It will be removed from your list.', () => {
  const n = NF.find(x => x.id === id); if (!n) return;
  NDEL.add(id); NF = NF.filter(x => x !== n); render();
  toast('Notification deleted', false, {
    undo: () => { NDEL.delete(id); if (!NF.some(x => x.id === id)) NF = [n, ...NF].sort((a, b) => String(b.at).localeCompare(String(a.at))); render(); },
    done: async () => { if (!NDEL.has(id)) return; const r = await api('/api/notifications/' + id, null, 'DELETE'); NDEL.delete(id); if (!r.ok && r.status !== 404 && r.status !== 401) { toast(await errOf(r, 'Could not delete the notification'), true); await load(); render(); } }
  });
}, { yes: 'Yes, delete', no: 'Cancel', danger: true, id: 'confirm.del-notif' });
const MODAL = () => OVL(`<div class=mh><h2>Notifications</h2><span class=bg>${NU} unread</span>${X('NO=false;render()')}</div><div class=mb>${NF.map(n => { const t = NFT[n.type] || [IC.info, 'Notification', 'var(--mu)'];
  return `<div class="nf clk ${NUI.includes(n.id) ? 'unr' : ''}" onclick="nfOpen('${n.id}')"><div class=ni style="color:${t[2]};background:color-mix(in srgb,${t[2]} 14%,transparent)">${t[0]}</div><div style="flex:1;min-width:0"><b>${t[1]}</b><div class=mu>${esc(n.text)}</div><small class=mono>${fdt(n.at)}</small></div><button class=dl onclick="event.stopPropagation();nfDel('${n.id}')" title="Delete" aria-label="Delete this notification">${IC.bin}</button></div>`; }).join('') || '<p class=mu style="padding:20px;text-align:center">No notifications</p>'}</div>`, 'NO=false;render()');

// ---------------------------------------------------------------- review pop-up (summary) + dispute chat
const dsp = rid => once('dsp', async () => {
  const t = DRF.trim(); if (!t) return toast('Write the reason for your dispute first', true);
  const r = await api(`/api/evaluations/${rid}/dispute`, { text: t }); if (!r.ok) return toast(await errOf(r, 'Could not send the dispute'), true);
  DRF = ''; await load(); render(); toast('Dispute sent to the QA team');
});
const dmsg = rid => once('dmsg', async () => {
  const t = DRF.trim(); if (!t) return;
  const r = await api(`/api/evaluations/${rid}/dispute/msg`, { text: t }); if (!r.ok) return toast(await errOf(r, 'Could not send the message'), true);
  DRF = ''; await load(); render();
});
function doRsv() {      // a safeguard: resolving cannot be undone and the agent is told, so this question is always asked
  ask('Resolve this dispute?', 'Are you sure you want to mark this dispute as resolved? The agent will be notified.', () => once('rsv', async () => {
    const x = RSV, r = await api(`/api/evaluations/${x.rid}/dispute/resolve`, { outcome: x.outcome, note: x.note });
    if (!r.ok) return toast(await errOf(r, 'Could not resolve the dispute'), true);
    RSV = null; await load(); render(); toast('Dispute resolved. The agent was notified.');
  }), { yes: 'Yes, resolve it', no: 'No, go back' });
}
const lnk = (t, u) => /^https?:\/\//.test(u || '') ? `<p style="margin:8px 0"><small>${t}</small><br><a href="${esc(u)}" target=_blank rel=noopener style="color:var(--ac);word-break:break-all">${esc(u)}</a></p>` : '';
const DSP = e => {
  const d = e.dp, mine = ME.role === 'agent' && e.agent === ME.username;
  if (!d) return mine ? `<div class=dsp><b>Do you disagree with this review?</b><textarea rows=3 placeholder="Explain why you want to dispute this review…" oninput="DRF=this.value">${esc(DRF)}</textarea><button class=btn style="justify-self:start" onclick="dsp('${e.rid}')">Dispute this review</button></div>` : '';
  const open = d.status === 'open';
  return `<div class=dsp><div class=row><b>Dispute</b>${open ? pill('Open', 'wn') : pill('Resolved', 'ok')}</div><div class=chat>${d.msgs.map(m => `<div class="msg ${m.sys ? 'sys' : m.u === ME.username ? 'me' : ''}"><small>${esc(m.n)} · ${fdt(m.at)}</small><br>${esc(m.t)}</div>`).join('')}</div>`
    + (open ? `<div class=row style="gap:8px;align-items:flex-end"><textarea rows=2 style="flex:1" placeholder="Write a message…" aria-label="Message" oninput="DRF=this.value">${esc(DRF)}</textarea><button class=btn onclick="dmsg('${e.rid}')">Send</button></div>${staff() ? `<button class="ib ibx" style="justify-self:start" onclick="RSV={rid:'${e.rid}',outcome:'kept',note:''};render()">${IC.check} Resolve dispute</button>` : ''}`
      : `<p class=mu style="margin:0">Resolved by ${esc(d.res.by)} on ${fdt(d.res.at)}: score ${d.res.outcome === 'kept' ? 'kept' : 'changed'}${d.res.note ? ' — ' + esc(d.res.note) : ''}</p>`) + `</div>`;
};
const MDL = () => {
  const e = EV.find(x => x.rid === MD.id); if (!e) { MD = null; return ''; }
  // deleting a review is permanent, so this question is a safeguard and can never be switched off
  if (MD.t === 'del') return OVL(`<div class=mh><h2>Delete evaluation?</h2>${X('cm()')}</div><div class=mb><p style="margin:0">This permanently deletes the review for Lead <b class=mono>#${esc(e.id)}</b> (${esc(agn(e))}), including its recording. This cannot be undone.</p><div class=acts><button class=ib data-af onclick="cm()">Cancel</button><button class="btn danger" onclick="rmv('${e.rid}')">Yes, delete it</button></div></div>`, 'cm()', 440, 50, 'danger');
  return OVL(`<div class=mh><h2>Lead #${esc(e.id)}</h2>${sp(e.sc, e.tm)}${e.fl ? `<span class="fgv ${e.fl}" title="${e.fl} flag">${IC.flag}</span>` : ''}${X('cm()')}</div><div class=mb>
<div class="g g2" style="margin:0">${[['Agent', agn(e)], ['Team', tn(e.tm) + (e.tmh && e.tmh !== e.tm ? ' (was ' + tn(e.tmh) + ' at review time)' : '')], ['Campaign', cpn(e)], ['Reviewer', e.rv || '—'], ['Date', fdt(e.d)], ['Scorecard', e.scn || '—']].map(([k, v]) => `<div><small>${k}</small><br><b>${esc(v)}</b></div>`).join('')}</div>
${staff() ? `<div class=row style="flex-wrap:wrap;gap:8px"><small class=ibx style="color:${e.seen ? 'var(--ok)' : 'var(--wn)'}">${e.seen ? IC.eye + ' Seen by the agent on ' + fdt(e.seen) : IC.warn + ' Not seen yet by the agent'}</small><span style="display:flex;gap:8px">${!e.seen ? `<button class="ib ibx" onclick="remind('${e.rid}')">${IC.bell} Remind agent</button>` : ''}${hasItems(e) ? `<button class="ib ibx" onclick="edE('${e.rid}')">${IC.pen} Edit score</button>` : ''}</span></div>` : ''}
${(e.cs || []).map(c => { const p = c.m ? c.e / c.m * 100 : 0; return `<div><div class=row><b>${esc(c.n)}${c.k ? '<span class=crit>Critical category</span>' : ''}${c.z ? '<span class=crit>Scored 0</span>' : ''}</b><b class=mono>${c.e}/${c.m}</b></div>${bar(p, scol(p, e.tm))}${c.it.map(i => `<div class=row style="font-size:13.5px;padding:3px 0;align-items:flex-start"><span>${esc(i.t)}${i.k ? '<span class=crit>Critical</span>' : ''}${i.cm ? `<br><small>${esc(i.cm)}</small>` : ''}</span>${i.a === 'y' ? pill('Yes', 'ok') : i.a === 'n' ? pill('No', 'bad') : pill('N/A', 'ac')}</div>`).join('')}</div>`; }).join('')}
${e.cm ? `<p style="margin:8px 0"><small>General comments</small><br>${esc(e.cm)}</p>` : ''}${lnk('Lead link', e.lk)}${lnk('Recording link', e.rl)}${e.rec ? `<audio class=player controls src="/api/recordings/${esc(e.rec)}"></audio>` : ''}${DSP(e)}</div>`, 'cm()', 720);
};
const RSVM = () => OVL(`<div class=mh><h2>Resolve dispute</h2>${X('RSV=null;render()')}</div><div class=mb><p class=mu style="margin:0">How did you and the agent settle it?</p><label class=rad><input type=radio name=ro ${RSV.outcome === 'kept' ? 'checked' : ''} onchange="RSV.outcome='kept'"><span><b>Score kept</b><br><small>We agreed to keep the score as it is.</small></span></label><label class=rad><input type=radio name=ro ${RSV.outcome === 'changed' ? 'checked' : ''} onchange="RSV.outcome='changed'"><span><b>Score changed</b><br><small>The score was (or will be) updated with Edit score.</small></span></label><label>Closing note <span class=mu>(optional)</span><textarea rows=3 oninput="RSV.note=this.value">${esc(RSV.note)}</textarea></label><div class=acts><button class=ib onclick="RSV=null;render()">Cancel</button><button class=btn onclick="doRsv()">Resolve dispute</button></div></div>`, 'RSV=null;render()', 480, 60);

// ---------------------------------------------------------------- recording player, confirmation, first-login password
const PLYM = () => { const e = EV.find(x => x.rid === PLY); if (!e || !e.rec) { PLY = null; return ''; } return OVL(`<div class=mh><h2>Recording · Lead #${esc(e.id)}</h2>${X('PLY=null;render()')}</div><div class=mb><small>${esc(agn(e))} · ${f(e.d)}</small><audio class=player controls autoplay src="/api/recordings/${esc(e.rec)}"></audio></div>`, 'PLY=null;render()', 520, 55); };
// "Don't ask me again" only appears for the routine confirmations listed in prefs.js; safeguards never show it
const CFMM = () => OVL(`<div class=mh><h2>${esc(CFM.title)}</h2></div><div class=mb><p style="margin:0">${esc(CFM.text)}</p>${CFM.id ? `<label class=dna><input type=checkbox ${CFM.dna ? 'checked' : ''} onchange="CFM.dna=this.checked"> Don't ask me again for this kind of action</label>` : ''}<div class=acts><button class=ib data-af onclick="cfN()">${esc(CFM.no)}</button><button class="btn ${CFM.danger ? 'danger' : ''}" onclick="cfY()">${esc(CFM.yes)}</button></div></div>`, 'cfN()', 460, 90, CFM.danger ? 'danger' : '');
const FIRSTM = () => OVL(`<div class=mh><h2>Set your new password</h2></div><div class=mb><p class=mu style="margin:0">For security, please choose a new password before you continue.</p><div class=form style="max-width:none"><label>New password<input id=pn1 data-af type=password autocomplete=new-password oninput="pwUpd()"></label><label>Confirm new password<input id=pn2 type=password autocomplete=new-password oninput="pwUpd()" onkeydown='if(event.key=="Enter")firstPw()'></label>${pwBox()}<div id=fpe role=alert></div><button class=btn onclick="firstPw()">OK</button></div></div>`, '', 480, 95);

// ---------------------------------------------------------------- welcome pop-up: once after signing in (on Home), until "Don't show me this again"
const WSTEPS = {
  admin: [['entry', 'g_quality', 'Score a call', 'QA Entry: choose a scorecard, answer Yes, No or N/A and submit.'], ['users', 'g_admin', 'Manage people and teams', 'Admin › Users, Teams and Workspaces.'], ['team', 'g_analytics', 'Follow the results', 'Home, Team Review and Category Stats update with every review.'], ['', 'gear', 'Set the pass rate', 'System settings: the gear button at the bottom of the menu.']],
  qa: [['entry', 'g_quality', 'Score a call', 'QA Entry: choose a scorecard, answer Yes, No or N/A and submit.'], ['calls', 'list', 'Find and edit reviews', 'Call Reviews: search, filter, edit, remind or export to Excel.'], ['disputes', 'flag', 'Answer disputes', 'Disputes: when an agent disagrees, talk it through and resolve it.'], ['cal', 'target', 'Calibrate together', 'Calibration: compare how reviewers score the same calls.']],
  lead: [['team', 'g_analytics', 'See your team', 'Team Review and Agents: scores, trends and who needs help.'], ['o2o', 'chat', 'Hold one-to-ones', 'One-to-One: agents without a recent one come first.'], ['coach', 'g_coaching', 'Plan coaching', 'Coaching: the weakest categories of every agent.'], ['tasks', 'task', 'Give tasks', 'Tasks: tasks and daily missions for your agents.']],
  trainer: [['coach', 'g_coaching', 'Plan coaching', 'Coaching: what each agent needs to work on.'], ['kb', 'book', 'Write lessons', 'Knowledge Base: articles, folders and lesson tests.'], ['quiz', 'quiz', 'Run quizzes', 'Quizzes: weekly and monthly quizzes with results.'], ['cal', 'target', 'Calibrate together', 'Calibration: agree on how calls are scored.']],
  agent: [['calls', 'eye', 'Read your reviews', 'New reviews arrive in the bell. Opening one tells QA you have seen it.'], ['disputes', 'flag', 'Disagree? Dispute it', 'Open the review and explain why: QA answers you there.'], ['acad', 'g_learning', 'Keep learning', 'My Learning: required reading and the quizzes given to you.'], ['tasks', 'task', 'Finish your tasks', 'Tasks: drag a card to move it and earn XP.']]
};
const welKey = un => 'qa_welcome_' + (un || (ME ? ME.username : ''));
function maybeWelcome() {
  if (!ME || ME.mustChange || route !== 'dash' || WEL || !msgOn('welcome')) return;
  let seen = false;
  try { seen = !!sessionStorage.getItem(welKey()); sessionStorage.setItem(welKey(), '1'); } catch (e) { seen = !!window.__welcomed; window.__welcomed = 1; }   // private windows may block storage
  if (seen) return;
  WEL = { dna: false }; render();
}
const welAgain = un => { try { sessionStorage.removeItem(welKey(un)); } catch (e) { window.__welcomed = 0; } };   // the welcome may show again (next sign-in, or "Show again")
function welClose(go) {
  const d = WEL && WEL.dna; WEL = null;
  if (go) location.hash = go; else render();
  if (d) setPrefs({ dismiss: ['welcome'] }, 'The welcome message will not show again. Switch it back on in My account › Notifications & Confirmations.');
}
const WELM = () => { const steps = (WSTEPS[ME.role] || WSTEPS.agent).filter(s => !s[0] || canRoute(s[0])), rn = ROLE[ME.role] || ME.role;
  return OVL(`<div class=mh><div><span class=kick>Welcome</span><h2>Hi ${esc(String(ME.name || '').split(' ')[0])}, welcome to Q-smart</h2></div>${X('welClose()')}</div><div class=mb><p class=mu style="margin:0">Where to start as ${/^[aeiou]/i.test(rn) ? 'an' : 'a'} ${esc(rn)}:</p><ol class=steps>${steps.map(([h, ic, t, s]) => `<li><span class=si>${IC[ic]}</span><span><b>${t}</b><br><small>${s}</small></span>${h ? `<button class=ib onclick="welClose('${h}')">Open</button>` : ''}</li>`).join('')}</ol></div><div class=mf><label class=dna><input type=checkbox ${WEL.dna ? 'checked' : ''} onchange="WEL.dna=this.checked"> Don't show me this again</label><button class=btn data-af onclick="welClose()">Get started</button></div>`, 'welClose()', 560, 72); };

// ---------------------------------------------------------------- "my account" menu (click your name) and system settings (gear)
const MYR = () => ROSTER.find(r => r.username === ME.username) || {};
const openAcct = tab => { const m = MYR(); ACD = { languages: [...(m.languages || [])], skills: [...(m.skills || [])] }; PKN = null; AC = tab || 'profile'; render(); };
async function sampleNf() { const r = await api('/api/notifications/sample', {}); if (!r.ok) return toast(await errOf(r, 'Could not create the samples'), true); AC = null; await openN(); toast('Sample notifications added: open any of them to see where it leads'); }
// Notifications & Confirmations: every switch here really changes what the pop-ups do (prefs.js), saved with the account
const swr = (on, fn, title, desc) => `<label class=swr><span><b>${title}</b><br><small>${desc}</small></span><input type=checkbox class=switch role=switch ${on ? 'checked' : ''} onchange="${fn}(this.checked)"></label>`;
const PREFS_TAB = () => { const p = PREFMSG.prefsOf(MYP()), off = PREFMSG.offList(MYP()), conf = Object.values(PREFMSG.MSGS).filter(m => m.kind === 'confirm').map(m => m.name.toLowerCase());
  return `<div class=form style="max-width:none;gap:0">
<section class=pset><h4>Informational messages</h4>${swr(p.info, 'prefInfo', 'Show welcome messages and tips', 'The welcome message on Home and the “How it works” tips on some pages. Error messages, security notices and warnings about unsaved changes always show.')}</section>
<section class=pset><h4>Routine confirmations</h4>${swr(p.confirm, 'prefConfirm', 'Ask me before routine actions', 'Only for ' + conf.join(' and for ') + '. When this is off they happen straight away, and an Undo button stays for a few seconds.')}</section>
<section class=pset><h4>Messages you switched off</h4>${off.length ? `<div class=offl>${off.map(m => `<div><span><b>${esc(m.name)}</b><br><small>${esc(m.where)}${m.at ? ' · switched off on ' + f(new Date(m.at)) : ''}</small></span><button class=ib onclick="prefRestore('${m.id}')">Show again</button></div>`).join('')}</div>` : '<p>None. You have not switched any message off with “Don\'t show me this again”.</p>'}<div><button class=ib onclick="prefClear()" ${off.length ? '' : 'disabled'}>Reset dismissed messages</button></div></section>
<section class=pset><h4>Always shown</h4><div class=lock><b>These protect your data and your account, so they cannot be switched off:</b><ul><li>Error messages, and problems with the connection or with permissions</li><li>The question before deleting anything (reviews, users, teams, scorecards, articles, tasks …)</li><li>The warning before leaving a page with unsaved changes</li><li>Password, account and access changes, and the new-password window at the first sign-in</li><li>Resolving a dispute and changing the score of a review</li></ul></div></section>
<section class=pset><h4>Sounds</h4><label class=rad><input type=checkbox ${SND ? 'checked' : ''} onchange="tsnd()"> <span><b>Notification sounds</b><br><small>Play a sound when a review is saved or a new notification arrives.</small></span></label><label>Sound<select onchange="SNDS=this.value;LS.set('qa_snd_style',SNDS);beep(true)">${[['beep', 'Beep'], ['chime', 'Chime'], ['bell', 'Bell']].map(([k, l]) => `<option value=${k} ${SNDS === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label><label>Volume<input type=range min=5 max=100 value=${VOL} oninput="VOL=+this.value;LS.set('qa_vol',VOL)"></label><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="ib ibx" onclick="beep(true)">${IC.play} Play test sound</button><button class="ib ibx" onclick="sampleNf()">${IC.bell} Show me sample notifications</button></div></section>
<section class=pset><h4>Start again</h4><p>Switch every message and question back on, as for a new account. Only your own settings change.</p><div><button class=ib onclick="prefDefaults()">Restore default settings</button></div></section>
<small class=mu>Saved with your account: the same on every browser and device where you sign in. Sounds are kept in this browser only.</small></div>`; };
const prefInfo = on => setPrefs({ info: on }, on ? 'Welcome messages and tips are switched on' : 'Welcome messages and tips are switched off');
const prefConfirm = on => setPrefs({ confirm: on }, on ? 'Routine actions are confirmed first again' : 'Routine actions now happen straight away, with an Undo button');
const prefRestore = id => { if (id === 'welcome') welAgain(); setPrefs({ restore: [id] }, '“' + (PREFMSG.MSGS[id] || {}).name + '” will show again'); };
const prefClear = () => { welAgain(); setPrefs({ clear: true }, 'Every dismissed message will show again'); };
const prefDefaults = () => { welAgain(); setPrefs({ defaults: true }, 'Default settings restored'); };
const ACCT = () => {
  const tabs = [['profile', 'Profile'], ['password', 'Password'], ['appearance', 'Appearance'], ['notif', 'Notifications & Confirmations']];
  let b = '';
  if (AC === 'profile') b = `<div class=form style="max-width:none"><label>Full name<input id=apn value="${esc(ME.name)}"></label><label>Email<input id=ape value="${esc(ME.email)}"></label><div><b style="font-size:12.5px">Languages</b>${pkHtml('ac', 'languages', 'languages')}</div><div><b style="font-size:12.5px">Skills</b>${pkHtml('ac', 'skills', 'skills')}</div><label>About me<textarea id=apd rows=3>${esc(MYR().desc || '')}</textarea></label><div class="g g2" style="margin:0"><div><small>Team</small><br><b>${esc(tn(ME.team))}</b></div><div><small>Team lead</small><br><b>${esc(leadName(ME.team))}</b></div><div><small>Username</small><br><b>${esc(ME.username)}</b></div><div><small>Role</small><br><b>${ROLE[ME.role] || ME.role}</b></div></div><div><button class=btn onclick="saveProfile()">Save profile</button></div></div>`;
  if (AC === 'password') b = `<div class=form style="max-width:none"><label>Current password<input id=pn0 type=password autocomplete=current-password></label><label>New password<input id=pn1 type=password autocomplete=new-password oninput="pwUpd()"></label><label>Repeat new password<input id=pn2 type=password autocomplete=new-password oninput="pwUpd()"></label>${pwBox()}<div><button class=btn onclick="chPw()">Update password</button></div></div>`;
  if (AC === 'appearance') b = `<div class=form style="max-width:none"><b>Mode</b><div class=sg role=group aria-label="Light or dark mode" style="width:fit-content">${[['light', 'Light', IC.sun], ['dark', 'Dark', IC.moon], ['system', 'System', IC.mon]].map(([k, l, s]) => `<button class="ibx ${THM === k ? 'on' : ''}" aria-pressed="${THM === k}" onclick="th('${k}')">${s} ${l}</button>`).join('')}</div><b>Theme</b><div class=thc>${Object.entries(THEMES).map(([k, x]) => `<button type=button class="thk ${THN === k ? 'on' : ''}" aria-pressed="${THN === k}" onclick="setTheme('${k}')"><i style="background:linear-gradient(90deg,${x.sb} 0 62%,${x.ac} 62% 100%)"></i><b>${x.n}</b><small class=mu>${x.d}</small></button>`).join('')}</div><small class=mu>A theme colours the menu, buttons and highlights. Light or dark mode is chosen separately.</small></div>`;
  if (AC === 'notif') b = PREFS_TAB();
  return OVL(`<div class=mh><h2>My account</h2>${X('AC=null;render()')}</div><div class=tabs role=tablist>${tabs.map(([k, l]) => `<button role=tab aria-selected="${AC === k}" class="${AC === k ? 'on' : ''}" onclick="AC='${k}';render()">${l}</button>`).join('')}</div><div class=mb>${b}<small class=mu>Q-smart · version 6</small></div>`, 'AC=null;render()', 640);
};
const SYSM = () => OVL(`<div class=mh><h2>System Settings</h2>${X('SYS=false;render()')}</div><div class=mb><b>Pass Rate Threshold (%)</b><p class=mu style="margin:0">A review passes when its score is at least this value. You can set a different value for a team; leave it empty to use the general one.</p><div class=form style="max-width:none"><label>General pass rate (%)<input id=spg type=number min=1 max=100 value="${PASSG()}"></label>${TEAMS.map(t => `<label>${esc(t.name)} <span class=mu>(optional)</span><input id=spt${t.id} type=number min=1 max=100 placeholder="Same as general" value="${SET.teams && SET.teams[t.id] != null ? SET.teams[t.id] : ''}"></label>`).join('')}<div><button class=btn onclick="saveSys()">Save settings</button></div></div>${ME.role === 'admin' ? `<hr style="margin:4px 0"><b>Demo data</b><p class=mu style="margin:0">Puts the made-up reviews, Auto QA conversations, knowledge base, tasks and sessions back to how they were at the start. Things you created yourself (users, teams, scorecards, your own reviews) stay.</p><div><button class=ib onclick="resetDemo()">Reset demo data</button></div>` : ''}</div>`, 'SYS=false;render()', 480);
const resetDemo = () => ask('Reset the demo data?', 'Demo reviews, conversations, articles, tasks and sessions return to their starting state. Anything you made yourself is kept.', async () => { const r = await api('/api/demo/reset', {}, 'POST'); if (!r.ok) return toast(await errOf(r, 'Could not reset'), true); SYS = false; await load(); render(); toast('Demo data reset'); }, { yes: 'Yes, reset', no: 'Cancel', danger: true });

// all overlays, in stacking order
const overlays = () => (NO ? MODAL() : '') + (MD ? MDL() : '') + (SSV ? SSVM() : '') + (TKV ? TKM() : '') + (TPLM ? TPLMM() : '') + (RSV ? RSVM() : '') + (AC ? ACCT() : '') + (SYS ? SYSM() : '') + (FM ? FMM() : '') + (WEL ? WELM() : '') + (PLY ? PLYM() : '') + (AQV ? AQM() : '') + (TEST ? TESTM() : '') + (AIH ? AIHM() : '') + (ME.mustChange ? FIRSTM() : '') + (CFM ? CFMM() : '');
