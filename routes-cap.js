// Workforce, phase 4: Capacity planning. The leads of every campaign of a month (pasted from Excel or typed in) are split
// fairly among the agents of one or more teams (the rules are in cap.js) and published: every agent then sees their leads
// for the month, the week and the day. When something changes (somebody is away, new leads arrive, a person joins or
// leaves), the plan shows what changed and suggests a new split of the leads not worked yet over the days left; a team
// lead or an admin approves it before the agents see it. Until the dialer sends real numbers, a lead counts as worked when
// its day is over and the person was at work that day. Admins and team leads plan the teams they look after; QA
// specialists and trainers can look; agents see only their own numbers.
const wf = require('./wf'), cap = require('./cap');

module.exports = ({ app, load, save, need, bad, hex, iso, str, userBy, notify, scopeOf, seesUser, ADMIN_TEAM, att }) => {
  const W = db => wf.settingsOf(db.settings && db.settings.wf, wf.localDay());
  const { teamsFor } = wf.access({ scopeOf, seesUser, userBy, ADMIN_TEAM });
  const STAFF = ['admin', 'qa', 'lead', 'trainer'], NOT_YOURS = 'You can plan the teams you look after only', GONE = 'This plan no longer exists';
  const plansOf = db => db.capPlans || [];
  const myTeams = (db, me) => new Set(teamsFor(db, me).filter(t => !t.system).map(t => t.id));
  const canSee = (db, me, p) => me.role === 'admin' || (STAFF.includes(me.role) && p.teams.some(t => myTeams(db, me).has(t)));
  const canEdit = (db, me, p) => me.role === 'admin' || (me.role === 'lead' && p.teams.every(t => myTeams(db, me).has(t)));
  const agentsOf = (db, p) => db.users.filter(u => u.role === 'agent' && u.active !== false && p.teams.includes(u.team)).sort((a, b) => a.name.localeCompare(b.name));
  const pctOf = (p, un) => p.pct && p.pct[un] != null ? p.pct[un] : 100;
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
  const sum = o => Object.values(o || {}).reduce((a, b) => a + b, 0);
  const add = (o, id, n) => { o[id] = (o[id] || 0) + n; };
  // was the person at work on a day that is over (or on today): no when absent, away for the whole day, or not planned
  const atWork = s => !['absent', 'off', 'hol', 'none'].includes(s.st) && !(s.st === 'leave' && !['am', 'pm', 'hours'].includes(s.part));
  function teamsOk(db, me, list) {
    const ids = [...new Set(Array.isArray(list) ? list.map(x => str(x, 40)) : [])].filter(id => db.teams.some(t => t.id === id && !t.system));
    if (!ids.length) throw new Error('Choose at least one team');
    if (me.role !== 'admin' && !ids.every(id => myTeams(db, me).has(id))) throw Object.assign(new Error(NOT_YOURS), { status: 403 });
    return ids;
  }

  // ---- one plan as it stands: every person's numbers (from the published splits), what changed since the last split, and
  // the split the app suggests (for a plan not published yet: the first one). "only" works out a single person (an agent).
  function view(db, p, now, want, only) {
    const S = W(db), days = cap.monthDays(p.month), today = wf.localDay(), LV = wf.leavesBy(db.leaves), rota = db.rota || {};
    const V = p.versions || [], last = V[V.length - 1], members = only ? [] : agentsOf(db, p), inPlan = new Set(members.map(u => u.username));
    const before = [...new Set(V.flatMap(v => Object.keys(v.split)))].filter(un => !inPlan.has(un));   // people of earlier splits who are no longer in the plan: what they worked still counts
    const everyone = only ? [only] : [...members, ...before.map(un => userBy(db, un)).filter(Boolean)];
    // the numbers of every day are those of the split in force that day
    const eff = {};
    V.forEach((v, k) => {
      const until = k + 1 < V.length ? V[k + 1].from : '9999-12-31';
      Object.entries(v.split).forEach(([un, sp]) => {
        if (only && un !== only.username) return;
        const dl = cap.daily(sp, v.hours[un] || days.map(() => 0)), row = eff[un] = eff[un] || days.map(() => null);
        days.forEach((d, i) => { if (d >= v.from && d < until) row[i] = dl[i]; });
      });
    });
    // a new split starts on the first day of the month (a plan not published yet, or a month still to come), else tomorrow
    const first = days[0], end = days[days.length - 1], soonest = today > first ? today : first, tomorrow = wf.addDays(today, 1);
    let D = !last ? soonest : tomorrow > first ? tomorrow : first;
    if (wf.DAY.test(want || '') && want >= soonest && want <= end) D = want;
    const open = D <= end, wk0 = wf.monday(today), wk1 = wf.addDays(wk0, 6), worked = {};
    const people = everyone.map(u => {
      const row = eff[u.username] || days.map(() => null), m = {}, lost = {}, recent = {}, left = {}, td = {}, wk = {}, fromD = {}, byDay = [], lostAt = [];
      const seen = (last && last.seen && last.seen[u.username]) || [];   // days already known as not worked when the last split was made
      row.forEach((q, i) => {
        byDay.push(q ? sum(q) : null); if (!q) return;
        const d = days[i], gone = d <= today && !atWork(att.statusOf(db, S, u, d, LV, now));
        if (gone) lostAt.push(i);
        Object.entries(q).forEach(([id, n]) => {
          if (gone) { add(lost, id, n); if (last && !seen.includes(i)) add(recent, id, n); return; }
          add(m, id, n);
          if (d < D) add(worked, id, n); else add(fromD, id, n);
          if (d >= today) add(left, id, n);
          if (d === today) add(td, id, n);
          if (d >= wk0 && d <= wk1) add(wk, id, n);
        });
      });
      return { u: u.username, name: u.name, team: u.team, member: inPlan.has(u.username), pct: pctOf(p, u.username), month: m, lost, recent, lostAt, left, today: td, week: wk, fromD, byDay };
    });
    const camps = p.campaigns.slice().sort(cap.order), assigned = {};
    people.forEach(x => Object.entries(x.month).forEach(([id, n]) => add(assigned, id, n)));
    if (only) return { days, D, open, camps, people, assigned };
    // the hours each person can work from D on (their rota and approved time off) and their share
    const Di = days.indexOf(D);
    const cand = open ? members.map(u => { const h = days.map((d, i) => i >= Di ? cap.hoursOn(S, u, d, rota, wf.lvOn(LV[u.username], d)) : 0), pct = pctOf(p, u.username);
      return { u: u.username, name: u.name, h, pct, w: sum(h) * pct }; }) : [];
    const pool = camps.map(c => ({ id: c.id, n: Math.max(0, c.leads - (worked[c.id] || 0)) })).filter(c => c.n > 0);
    // what changed since the last split: leads, people and their hours in the days left, leads not worked on days that are over
    const reasons = [];
    if (last && open) {
      const was = Object.fromEntries((last.cs || []).map(c => [c.id, c]));
      camps.forEach(c => { const b = was[c.id]; if (!b) { if (c.leads) reasons.push({ k: 'camp', name: c.name, n: c.leads }); } else if (b.leads !== c.leads) reasons.push({ k: 'leads', name: c.name, before: b.leads, now: c.leads }); });
      (last.cs || []).forEach(c => { if (!camps.some(x => x.id === c.id)) reasons.push({ k: 'gone', name: c.name }); });
      everyone.forEach(u => {
        const c = cand.find(x => x.u === u.username), wasIn = has(last.split, u.username), nowH = c ? sum(c.h) : 0, nowP = c ? c.pct : 100;
        const then = (last.hours[u.username] || []).reduce((s, h, i) => s + (i >= Di ? h : 0), 0), thenP = last.pct && last.pct[u.username] != null ? last.pct[u.username] : 100;
        if (!wasIn && c && nowH * nowP > 0) reasons.push({ k: 'new', name: u.name, h: Math.round(nowH) / 100 });
        else if (wasIn && !c && then > 0) reasons.push({ k: 'out', name: u.name });
        else if (wasIn) {
          if (nowP !== thenP) reasons.push({ k: 'pct', name: u.name, before: thenP, now: nowP });
          if (Math.abs(nowH - then) >= 100) reasons.push({ k: 'hours', name: u.name, h: Math.round(nowH - then) / 100 });
        }
      });
      people.forEach(x => { const n = sum(x.recent); if (n) reasons.push({ k: 'lost', name: x.name, n }); });
    }
    // the split the app suggests: the leads not worked yet, over the hours of the days left
    let preview = null, why = '';
    if (open && (!last || reasons.length || want)) {
      const N = pool.reduce((s, c) => s + c.n, 0), Wt = cand.reduce((s, c) => s + c.w, 0);
      if (!N) why = 'There are no leads to split';
      else if (!Wt) why = 'Nobody in this plan can work in the days left';
      else {
        const sp = cap.fairSplit(pool, cand, p.id + '|' + (V.length + 1));
        preview = { from: D, pool: Object.fromEntries(pool.map(c => [c.id, c.n])), people: cand.map(c => {
          const x = people.find(r => r.u === c.u);
          return { u: c.u, name: c.name, h: c.h, w: c.w, pct: c.pct, hours: Math.round(sum(c.h)) / 100, days: c.h.filter(Boolean).length, share: c.w / Wt, exact: N * c.w / Wt, split: sp[c.u], total: sum(sp[c.u]), before: x ? sum(x.fromD) : 0 }; }) };
        preview.gap = Math.round(Math.max(...preview.people.map(x => Math.abs(x.total - x.exact))) * 100) / 100;
      }
    }
    return { days, D, open, camps, people, assigned, reasons, preview, why, capacity: cand.map(c => ({ u: c.u, hours: Math.round(sum(c.h)) / 100, days: c.h.filter(Boolean).length, pct: c.pct })) };
  }
  const nameOf = (db, un) => (userBy(db, un) || {}).name || un;
  function planOut(db, me, p, v) {
    const V = p.versions || [], last = V[V.length - 1], old = {};
    V.forEach(x => (x.cs || []).forEach(c => { if (!v.camps.some(k => k.id === c.id)) old[c.id] = { ...c, leads: 0, old: true }; }));
    return { id: p.id, name: p.name, month: p.month, teams: p.teams, canEdit: canEdit(db, me, p), campaigns: [...v.camps, ...Object.values(old)], days: v.days, from: v.D, open: v.open,
      version: last ? { no: last.no, from: last.from, at: last.at, by: nameOf(db, last.by) } : null,
      history: V.map(x => ({ no: x.no, from: x.from, at: x.at, by: nameOf(db, x.by), leads: sum(x.pool), people: Object.keys(x.split).length, why: x.why || [] })).reverse(),
      people: v.people.map(x => ({ u: x.u, name: x.name, team: x.team, member: x.member, pct: x.pct, month: x.month, total: sum(x.month), lost: sum(x.lost), left: sum(x.left), today: sum(x.today), week: sum(x.week), byDay: x.byDay, lostAt: x.lostAt })),
      assigned: v.assigned, reasons: v.reasons, why: v.why, capacity: v.capacity,
      preview: v.preview && { from: v.preview.from, gap: v.preview.gap, pool: v.preview.pool, people: v.preview.people.map(({ h, w, ...x }) => x) } };
  }
  // an agent's own numbers in every published plan of the month
  function mineOf(db, me, month, now) {
    const u = userBy(db, me.username);
    return plansOf(db).filter(p => p.month === month && (p.versions || []).some(v => has(v.split, me.username))).map(p => {
      const v = view(db, p, now, '', u), x = v.people[0], V = p.versions, last = V[V.length - 1], names = {};
      V.forEach(k => (k.cs || []).forEach(c => { names[c.id] = c; })); p.campaigns.forEach(c => { names[c.id] = c; });
      const wOf = un => (last.hours[un] || []).reduce((s, h) => s + h, 0) * (last.pct && last.pct[un] != null ? last.pct[un] : 100), Wt = Object.keys(last.split).reduce((s, un) => s + wOf(un), 0);
      const ids = [...new Set([...Object.keys(x.month), ...Object.keys(x.lost)])].filter(id => names[id]).sort((a, b) => cap.order(names[a], names[b]));
      return { id: p.id, name: p.name, from: last.from, at: last.at, share: has(last.split, me.username) && Wt ? wOf(me.username) / Wt : 0,
        total: sum(x.month), left: sum(x.left), today: sum(x.today), week: sum(x.week), lost: sum(x.lost),
        campaigns: ids.map(id => ({ id, name: names[id].name, brand: names[id].brand, segment: names[id].segment, month: x.month[id] || 0, today: x.today[id] || 0, week: x.week[id] || 0, left: x.left[id] || 0 })),
        days: v.days.map((d, i) => ({ d, n: x.byDay[i], lost: x.lostAt.includes(i) })) };
    });
  }

  // ---------------------------------------------------------------- reading: the plans of a month (staff), or my own numbers (agents)
  app.get('/api/cap', need(), (req, res) => {
    const db = load(), me = req.session.user, q = req.query || {}, now = Date.now();
    const month = cap.MONTH.test(typeof q.month === 'string' ? q.month : '') ? q.month : wf.localDay().slice(0, 7);
    if (!STAFF.includes(me.role)) return res.json({ month, mine: mineOf(db, me, month, now) });
    const list = plansOf(db).filter(p => p.month === month && canSee(db, me, p)), p = list.find(x => x.id === q.plan) || list[0];
    res.json({ month, canNew: me.role === 'admin' || me.role === 'lead', plans: list.map(x => ({ id: x.id, name: x.name, teams: x.teams, live: !!(x.versions || []).length })),
      plan: p ? planOut(db, me, p, view(db, p, now, typeof q.from === 'string' ? q.from : '')) : null });
  });

  // ---------------------------------------------------------------- planning (admins, and team leads for their own teams)
  const find = (db, me, id, res) => {
    const p = plansOf(db).find(x => x.id === id);
    if (!p) { res.status(404).json({ error: GONE }); return null; }
    if (!canEdit(db, me, p)) { res.status(403).json({ error: NOT_YOURS }); return null; }
    return p;
  };
  app.post('/api/cap/plans', need('admin', 'lead'), (req, res) => {
    const db = load(), me = req.session.user, b = req.body || {};
    if (!cap.MONTH.test(typeof b.month === 'string' ? b.month : '')) return bad(res, 'Choose the month');
    if (plansOf(db).length >= 1000) return bad(res, 'Too many plans: delete old ones first');
    try {
      const p = { id: 'cp' + hex(4), month: b.month, name: str(b.name, 60) || 'Leads ' + b.month, teams: teamsOk(db, me, b.teams), campaigns: [], pct: {}, versions: [], at: iso(), by: me.username };
      db.capPlans = [...plansOf(db), p]; save(db); res.json({ id: p.id });
    } catch (e) { res.status(e.status || 400).json({ error: e.message }); }
  });
  // the name, the teams, the campaigns (the whole list) and the share of people (only the ones sent change; 100 % is the usual)
  app.put('/api/cap/plans/:id', need('admin', 'lead'), (req, res) => {
    const db = load(), me = req.session.user, b = req.body || {}, p = find(db, me, req.params.id, res); if (!p) return;
    try {
      if (b.name !== undefined) { const n = str(b.name, 60); if (!n) throw new Error('Give the plan a name'); p.name = n; }
      if (b.teams !== undefined) p.teams = teamsOk(db, me, b.teams);
      if (b.campaigns !== undefined) p.campaigns = cap.cleanCampaigns(b.campaigns, () => 'c' + hex(3));
      if (b.pct !== undefined) { const set = cap.cleanPct(b.pct, new Set(agentsOf(db, p).map(u => u.username))), pct = { ...(p.pct || {}), ...set };
        Object.keys(pct).forEach(u => { if (pct[u] === 100) delete pct[u]; }); p.pct = pct; }
      save(db); res.json({ ok: 1 });
    } catch (e) { res.status(e.status || 400).json({ error: e.message }); }
  });
  // publish the split the app suggests (the first one, or a new one after changes): from then on the agents see it
  app.post('/api/cap/plans/:id/publish', need('admin', 'lead'), (req, res) => {
    const db = load(), me = req.session.user, b = req.body || {}, p = find(db, me, req.params.id, res); if (!p) return;
    const V = p.versions = p.versions || [], v = view(db, p, Date.now(), typeof b.from === 'string' ? b.from : '');
    if (!v.open) return bad(res, 'This month is over');
    if (!v.preview) return bad(res, v.why || 'Nothing has changed since the last split');
    if (V.length >= 60) return bad(res, 'This plan has been split 60 times: make a new plan for the rest of the month');
    const pv = v.preview, on = pv.people.filter(c => c.w > 0);
    const x = { no: V.length + 1, from: pv.from, at: iso(), by: me.username, cs: p.campaigns.map(c => ({ ...c })), pool: pv.pool, pct: Object.fromEntries(pv.people.map(c => [c.u, c.pct])),
      hours: Object.fromEntries(on.map(c => [c.u, c.h])), split: Object.fromEntries(on.map(c => [c.u, c.split])), why: v.reasons,
      seen: Object.fromEntries(v.people.filter(r => r.lostAt.length).map(r => [r.u, r.lostAt])) };
    V.push(x);
    on.forEach(c => { if (c.total) notify(db, c.u, 'cap', x.no === 1 ? `Your leads for ${p.month} are ready: ${c.total} leads from ${x.from}` : `Your leads for ${p.month} have changed: ${c.total} leads from ${x.from}`, { cap: p.id }); });
    save(db); res.json({ ok: 1, no: x.no, from: x.from });
  });
  app.delete('/api/cap/plans/:id', need('admin', 'lead'), (req, res) => {
    const db = load(), me = req.session.user, p = find(db, me, req.params.id, res); if (!p) return;
    db.capPlans = plansOf(db).filter(x => x.id !== p.id); save(db); res.json({ ok: 1 });
  });
};
