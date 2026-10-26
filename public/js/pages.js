// ===================== Menu groups, Dashboard, analytics pages and the small pages =====================
const CATS = l => [...new Set(l.flatMap(e => (e.cs || []).map(c => c.n)))];
const cpv = (e, n) => { const x = (e.cs || []).find(c => c.n === n); return x && x.m ? x.e / x.m * 100 : null; };
const staff = () => ME && (ME.role === 'admin' || ME.role === 'qa');
const isStaffR = () => ME && STAFFR.includes(ME.role);

// ---- the menu: main groups, each with its own icon and a drop-down of pages
// The menu has three panels (space): the main menu for the everyday work, and the Learning and Admin panels that open from the
// bottom of it ("Learning ›", "Admin ›") and have "← Back to the main menu" at the top (main.js)
const GROUPS = [
  { id: 'home', name: 'Home', icon: 'g_home', items: [['dash', 'Dashboard'], ['autoqa', 'AutoQA'], ['tasks', 'Tasks']] },
  { id: 'quality', name: 'Quality', icon: 'g_quality', items: [['calls', 'Reviews'], ['entry', 'QA Entry'], ['flags', 'Quick Flags'], ['disputes', 'Disputes']] },
  { id: 'analytics', name: 'Analytics', icon: 'g_analytics', items: [['agents', 'Agents'], ['team', 'Team Review'], ['cats', 'Category Stats']] },
  { id: 'coaching', name: 'Coaching', icon: 'g_coaching', items: [['coach', 'Coaching'], ['o2o', 'One-to-One'], ['cal', 'Calibration']] },
  { id: 'performance', name: 'Performance', icon: 'g_perf', items: [['goals', 'Goals & KPIs'], ['pips', 'Improvement plans'], ['kudos', 'Recognition']] },
  { id: 'planning', name: 'Planning', icon: 'g_plan', items: [['planner', 'Review planner'], ['workload', 'QA workload'], ['calendar', 'Calendar']] },
  { id: 'comply', name: 'Compliance & CX', icon: 'g_comply', items: [['compliance', 'Compliance'], ['risks', 'Risk register'], ['complaints', 'Complaints'], ['csat', 'Surveys (CSAT)']] },
  { id: 'reports', name: 'Reports', icon: 'g_reports', items: [['rbuild', 'Report builder'], ['rsaved', 'Saved & scheduled'], ['rexp', 'Export centre']] },
  { id: 'learning', name: 'Learning', icon: 'g_learning', space: 'learn', items: [['acad', 'My Learning'], ['kb', 'Knowledge Base'], ['quiz', 'Quizzes'], ['news', 'Newsletter']] },
  { id: 'tools', name: 'Practice', icon: 'g_tools', space: 'learn', items: [['tr', 'Transcripts'], ['sim', 'Call Simulator']] },
  { id: 'people', name: 'People', icon: 'g_people', space: 'admin', items: [['users', 'Users'], ['teams', 'Teams'], ['wsp', 'Workspaces'], ['skills', 'Skills']] },
  { id: 'scorecards', name: 'Quality set-up', icon: 'g_sc', space: 'admin', items: [['sco', 'Scorecards'], ['scat', 'Categories'], ['roots', 'Root causes'], ['aqcats', 'Auto QA categories']] },
  { id: 'admin', name: 'System', icon: 'g_sys', space: 'admin', items: [['perms', 'Roles & permissions'], ['integ', 'Integrations'], ['notifs', 'Notification rules'], ['mailtpl', 'Email templates'], ['backup', 'Backups & data'], ['audit', 'Audit log']] }
];
const RR = { entry: ['admin', 'qa'], flags: STAFFR, team: STAFFR, cats: STAFFR, coach: STAFFR, cal: STAFFR, sco: STAFFR, scat: ['admin', 'qa'], roots: ['admin', 'qa'], aqcats: ['admin', 'qa'], users: ['admin'], teams: ['admin'], wsp: ['admin'], skills: ['admin'], audit: ['admin'] };
Object.assign(RR, { rbuild: STAFFR, rsaved: STAFFR, rexp: STAFFR, planner: ['admin', 'qa', 'lead'], workload: ['admin', 'qa', 'lead'], compliance: STAFFR, risks: STAFFR, complaints: STAFFR, csat: STAFFR, perms: ['admin'], integ: ['admin'], notifs: ['admin'], backup: ['admin'], mailtpl: ['admin'] });
// an admin can change who sees which page (Admin > Roles & permissions); admins always keep the Admin pages
const ADMINP = ['users', 'teams', 'wsp', 'skills', 'perms', 'integ', 'notifs', 'backup', 'mailtpl', 'audit'];
const own = (o, k) => o && Object.hasOwn(o, k) ? o[k] : undefined;   // only the object's own entries (a link such as #constructor is not a page)
const canRoute = k => { if (ME.role === 'admin' && ADMINP.includes(k)) return true; const p = own(SET.perm, k) || own(RR, k); return !Array.isArray(p) || p.includes(ME.role); };
const groupsFor = () => GROUPS.map(g => ({ ...g, items: g.items.filter(([k]) => canRoute(k)) })).filter(g => g.items.length);
const groupOf = r => ({ aqlist: 'home', aqgaps: 'home' })[r] || (GROUPS.find(g => g.items.some(([k]) => k === r)) || {}).id;

// ---- dashboard
const dashD = () => EV.filter(e => (!T || e.tm === T) && (P === 'all' || (P === 'custom'
  ? e.d >= new Date(DF + 'T00:00:00') && e.d <= new Date(DT + 'T23:59:59')
  : (Date.now() - e.d) / 864e5 <= { week: 7, month: 30, year: 365 }[P])));
// stats per agent (current agents, all their reviews inside the list d)
const agS = d => AGENTS().map(u => { const x = d.filter(e => e.agent === u.username); return { u: u.username, n: u.name, team: u.team, k: x.length, a: avg(x.map(e => e.sc)), p: x.length ? x.filter(isPass).length / x.length * 100 : 0 }; });
const lead = e => `<b class=mono style="color:var(--ac)">${esc(e.id)}</b> <small>(${esc(agn(e))})</small><br><small>${f(e.d)} · ${esc(tn(e.tm))}</small>`;

// jump to Call Reviews with some filters already set (used by the dashboard cards)
function goCalls(o = {}) {
  Q = ''; FS = ''; FF = ''; FC = o.ch || ''; FSC = o.sc || null; FA = o.agent || ''; FT = o.agent ? teamOf(o.agent) : (o.team || T || ''); PN = 1; RF = { st: '', fl: '', rv: '', scid: '' };
  if (P === 'year') { FP = 'custom'; F1 = ds(-365); F2 = ds(0); } else if (P === 'custom') { FP = 'custom'; F1 = DF; F2 = DT; } else FP = P;
  KQ = true; if (location.hash === '#calls') render(); else location.hash = 'calls';
}
function viewHist() { Q = ''; FS = ''; FF = ''; FC = ''; FSC = null; FT = ''; FA = ''; PN = 1; RF = { st: '', fl: '', rv: '', scid: '' }; KQ = true; if (location.hash === '#calls') render(); else location.hash = 'calls'; }
const goPage = h => { location.hash = h; };

const PG = {
  tr() {
    const e = EV[TI] || EV[0] || { id: '-', agent: '', sc: 0, tm: '' },
      L = [['Agent', 'Good afternoon, thank you for calling. How can I help you today?', 'Greeting'], ['Customer', 'I received a quote last week but I am not sure it is worth the price.', ''], ['Agent', 'I understand. Let me show you what is included and how it compares.', 'Objection handling'], ['Customer', 'Okay, that sounds reasonable. What are the next steps?', ''], ['Agent', 'I will send the contract now and note everything in your file.', 'Closing']];
    return head('Transcripts', 'Read and annotate calls') + `<div class="g g2"><div>${card('Select a call', EV.slice(0, 6).map((x, i) => `<div class="row li" style="cursor:pointer;${i === TI ? 'font-weight:600' : ''}" onclick="TI=${i};render()"><span class=mono>${esc(x.id)}</span>${sp(x.sc, x.tm)}</div>`).join(''))}</div><div>${card('Lead ' + esc(e.id) + ' · ' + esc(agn(e)), L.map(l => `<div class="msg ${l[0] === 'Agent' ? 'me' : ''}"><small style="color:inherit;opacity:.7">${l[0]}</small><br>${l[1]}${l[2] ? `<br>${pill(l[2], 'ok')}` : ''}</div>`).join(''))}</div></div>`;
  },
  sim: () => AIRP.on ? aiSimPage() : head('Call Simulator', 'Practice objection handling with a virtual customer') + card('Scenario: price objection', CH.map(m => `<div class="msg ${m[0] === 'u' ? 'me' : ''}">${esc(m[1])}</div>`).join('') + `<div class=row style="margin-top:10px"><input id=si style="flex:1" placeholder="Type your reply…" onkeydown='if(event.key=="Enter")snd()'><button class=btn onclick=snd()>Send</button></div><div class=row style="margin-top:12px"><small class=mu>When you are done, save the result: it appears on your Agents page (tab Simulations).</small><button class=pb onclick=simFinish()>Finish &amp; save score</button></div>`)
};
let SIMT = 0;
const SIM_GOOD = 'Coach: good, you acknowledged the concern.', SIM_TIP = 'Coach tip: empathise first, then ask a question.';   // kept in English, translated on screen
function snd() {
  const t = $('#si').value.trim(); if (!t) return;
  if (!SIMT) SIMT = Date.now();
  const g = /understand|value|include|\?/i.test(t);
  CH.push(['u', t], ['c', RP[Math.min(CH.filter(m => m[0] === 'u').length, 2)]], ['c', g ? SIM_GOOD : SIM_TIP]); render();
}

// the practice call is scored by how many of your replies the coach liked, then saved for the Agents page
async function simFinish() {
  const you = CH.filter(m => m[0] === 'u').length; if (!you) return toast('Write at least one reply first', true);
  const good = CH.filter(m => m[0] === 'c' && m[1] === SIM_GOOD).length, tips = [...new Set(CH.filter(m => m[0] === 'c' && m[1] === SIM_TIP).map(m => m[1]))];
  const score = Math.round(good / you * 100);
  const r = await api('/api/simulations', { scenario: 'Price objection', persona: 'Price-sensitive customer', score, minutes: Math.ceil((Date.now() - SIMT) / 60000), result: score >= 85 ? 'winner' : 'keep practising', tips });
  if (!r.ok) return toast(await errOf(r, 'Could not save the result'), true);
  CH = [CH[0]]; SIMT = 0; render(); toast('Saved: you scored ' + score + '%');
}
