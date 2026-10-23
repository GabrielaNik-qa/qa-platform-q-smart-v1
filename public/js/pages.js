// ===================== Menu groups, Dashboard, analytics pages and the small pages =====================
const CATS = l => [...new Set(l.flatMap(e => (e.cs || []).map(c => c.n)))];
const cpv = (e, n) => { const x = (e.cs || []).find(c => c.n === n); return x && x.m ? x.e / x.m * 100 : null; };
const staff = () => ME && (ME.role === 'admin' || ME.role === 'qa');
const isStaffR = () => ME && STAFFR.includes(ME.role);

// ---- the menu: main groups, each with its own icon and a drop-down of pages
const GROUPS = [
  { id: 'home', name: 'Home', icon: 'g_home', items: [['dash', 'Dashboard'], ['autoqa', 'AutoQA'], ['tasks', 'Tasks']] },
  { id: 'quality', name: 'Quality', icon: 'g_quality', items: [['calls', 'Reviews'], ['entry', 'QA Entry'], ['flags', 'Quick Flags'], ['disputes', 'Disputes']] },
  { id: 'scorecards', name: 'Scorecards', icon: 'g_sc', items: [['sco', 'Scorecards'], ['scat', 'Categories'], ['roots', 'Root causes'], ['aqcats', 'Auto QA categories']] },
  { id: 'analytics', name: 'Analytics', icon: 'g_analytics', items: [['agents', 'Agents'], ['team', 'Team Review'], ['cats', 'Category Stats']] },
  { id: 'coaching', name: 'Coaching', icon: 'g_coaching', items: [['coach', 'Coaching'], ['o2o', 'One-to-One'], ['cal', 'Calibration']] },
  { id: 'learning', name: 'Learning', icon: 'g_learning', items: [['acad', 'My Learning'], ['kb', 'Knowledge Base'], ['quiz', 'Quizzes'], ['news', 'Newsletter']] },
  { id: 'tools', name: 'Tools', icon: 'g_tools', items: [['tr', 'Transcripts'], ['sim', 'Call Simulator']] },
  { id: 'admin', name: 'Admin', icon: 'g_admin', items: [['users', 'Users'], ['teams', 'Teams'], ['wsp', 'Workspaces'], ['skills', 'Skills'], ['audit', 'Audit log']] }
];
const RR = { entry: ['admin', 'qa'], flags: STAFFR, team: STAFFR, cats: STAFFR, coach: STAFFR, cal: STAFFR, sco: STAFFR, scat: ['admin', 'qa'], roots: ['admin', 'qa'], aqcats: ['admin', 'qa'], users: ['admin'], teams: ['admin'], wsp: ['admin'], skills: ['admin'], audit: ['admin'] };
const canRoute = k => !RR[k] || RR[k].includes(ME.role);
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
  Q = ''; FS = ''; FF = ''; FC = o.ch || ''; FSC = o.sc || null; FA = o.agent || ''; FT = o.agent ? teamOf(o.agent) : (o.team || T || ''); PN = 1;
  if (P === 'year') { FP = 'custom'; F1 = ds(-365); F2 = ds(0); } else if (P === 'custom') { FP = 'custom'; F1 = DF; F2 = DT; } else FP = P;
  KQ = true; if (location.hash === '#calls') render(); else location.hash = 'calls';
}
function viewHist() { Q = ''; FS = ''; FF = ''; FC = ''; FSC = null; FT = ''; FA = ''; PN = 1; KQ = true; if (location.hash === '#calls') render(); else location.hash = 'calls'; }
const goPage = h => { location.hash = h; };

const PG = {
  tr() {
    const e = EV[TI] || EV[0] || { id: '-', agent: '', sc: 0, tm: '' },
      L = [['Agent', 'Good afternoon, thank you for calling. How can I help you today?', 'Greeting'], ['Customer', 'I received a quote last week but I am not sure it is worth the price.', ''], ['Agent', 'I understand. Let me show you what is included and how it compares.', 'Objection handling'], ['Customer', 'Okay, that sounds reasonable. What are the next steps?', ''], ['Agent', 'I will send the contract now and note everything in your file.', 'Closing']];
    return head('Transcripts', 'Read and annotate calls') + `<div class="g g2"><div>${card('Select a call', EV.slice(0, 6).map((x, i) => `<div class="row li" style="cursor:pointer;${i === TI ? 'font-weight:600' : ''}" onclick="TI=${i};render()"><span class=mono>${esc(x.id)}</span>${sp(x.sc, x.tm)}</div>`).join(''))}</div><div>${card('Lead ' + esc(e.id) + ' · ' + esc(agn(e)), L.map(l => `<div class="msg ${l[0] === 'Agent' ? 'me' : ''}"><small style="color:inherit;opacity:.7">${l[0]}</small><br>${l[1]}${l[2] ? `<br>${pill(l[2], 'ok')}` : ''}</div>`).join(''))}</div></div>`;
  },
  sim: () => head('Call Simulator', 'Practice objection handling with a virtual customer') + card('Scenario: price objection', CH.map(m => `<div class="msg ${m[0] === 'u' ? 'me' : ''}">${esc(m[1])}</div>`).join('') + `<div class=row style="margin-top:10px"><input id=si style="flex:1" placeholder="Type your reply…" onkeydown='if(event.key=="Enter")snd()'><button class=btn onclick=snd()>Send</button></div><div class=row style="margin-top:12px"><small class=mu>When you are done, save the result: it appears on your Agents page (tab Simulations).</small><button class=pb onclick=simFinish()>Finish &amp; save score</button></div>`)
};
let SIMT = 0;
function snd() {
  const t = $('#si').value.trim(); if (!t) return;
  if (!SIMT) SIMT = Date.now();
  const g = /understand|value|include|\?/i.test(t);
  CH.push(['u', t], ['c', RP[Math.min(CH.filter(m => m[0] === 'u').length, 2)]], ['c', g ? '✔ Coach: good, you acknowledged the concern.' : 'ℹ Coach: empathise first, then ask a question.']); render();
}

// the practice call is scored by how many of your replies the coach liked, then saved for the Agents page
async function simFinish() {
  const you = CH.filter(m => m[0] === 'u').length; if (!you) return toast('Write at least one reply first', true);
  const good = CH.filter(m => m[0] === 'c' && m[1].startsWith('✔')).length, tips = [...new Set(CH.filter(m => m[0] === 'c' && m[1].startsWith('ℹ')).map(m => m[1].replace(/^ℹs*/, '')))];
  const score = Math.round(good / you * 100);
  const r = await api('/api/simulations', { scenario: 'Price objection', persona: 'Price-sensitive customer', score, minutes: Math.ceil((Date.now() - SIMT) / 60000), result: score >= 85 ? 'winner' : 'keep practising', tips });
  if (!r.ok) return toast(await errOf(r, 'Could not save the result'), true);
  CH = [CH[0]]; SIMT = 0; render(); toast('Saved: you scored ' + score + '%');
}
