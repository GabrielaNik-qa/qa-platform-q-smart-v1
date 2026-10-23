// Tasks (Kanban + missions + recurring daily missions), coaching / one-to-one sessions, calibration sessions.
module.exports = ({ app, load, save, need, bad, hex, iso, str, list, notify, userBy }) => {
  const EDIT = ['admin', 'qa', 'lead', 'trainer'];
  const STATUS = ['todo', 'doing', 'review', 'done'], PRIO = ['low', 'med', 'high'];
  const DAY = /^\d{4}-\d{2}-\d{2}$/;
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const activeUsers = db => db.users.filter(u => u.active !== false);
  const checklist = v => (Array.isArray(v) ? v : []).slice(0, 30).map(c => ({ t: str(typeof c === 'string' ? c : c && c.t, 150), min: Math.min(600, Math.max(0, parseInt(c && c.min) || 0)), done: !!(c && c.done) })).filter(c => c.t);

  // ---------------------------------------------------------------- recurring missions: today's copy is created the first time anybody asks
  function recurring(db) {
    let changed = false; const td = today(), wd = new Date().getDay();
    const md = new Date().getDate();
    db.taskTpl.filter(t => t.active !== false && (t.freq === 'daily' || (t.freq === 'weekly' && t.weekday === wd) || (t.freq === 'monthly' && (t.monthday || 1) === md))).forEach(tpl => {
      const who = new Set((tpl.users || []).filter(x => userBy(db, x)));
      activeUsers(db).forEach(u => { if (u.role === 'agent' && (tpl.teams || []).includes(u.team)) who.add(u.username); });
      who.forEach(un => {
        const key = tpl.id + ':' + td + ':' + un;
        if (db.tasks.some(t => t.key === key)) return;
        db.tasks.push({ id: 'k' + hex(5), title: tpl.title, desc: tpl.desc || '', type: tpl.kind === 'task' || tpl.kind === 'checklist' ? 'task' : 'mission', priority: tpl.priority || 'med', points: tpl.points || 0, due: td, status: 'todo', assignee: un, labels: tpl.labels || [], checklist: checklist(tpl.checklist), created: iso(), by: tpl.by, key, tpl: tpl.id, freq: tpl.freq, completed: null });
        changed = true;
      });
    });
    if (changed) save(db);
  }
  app.get('/api/tasks', need(), (req, res) => {
    const db = load(), u = req.session.user; recurring(db);
    res.json(db.tasks.filter(t => u.role !== 'agent' || t.assignee === u.username));
  });
  app.post('/api/tasks', need(...EDIT), (req, res) => {
    const db = load(), b = req.body || {}, me = req.session.user;
    const title = str(b.title, 150); if (!title) return bad(res, 'Give the task a title');
    if (b.due && !DAY.test(b.due)) return bad(res, 'Choose a valid deadline');
    if (b.start && b.due && b.start > b.due) return bad(res, 'The start date is after the deadline');
    const who = new Set((Array.isArray(b.assignees) ? b.assignees : []).filter(x => { const u = userBy(db, x); return u && u.active !== false; }));
    activeUsers(db).forEach(u => { if (u.role === 'agent' && (b.teams || []).includes(u.team)) who.add(u.username); });
    if (!who.size) return bad(res, 'Choose at least one agent or team to give the task to');
    const group = 'g' + hex(4), out = [];
    who.forEach(un => {
      const t = { id: 'k' + hex(5), group, title, desc: str(b.desc, 1500), start: DAY.test(b.start || '') ? b.start : '', tpl: str(b.tpl, 20), type: b.type === 'mission' ? 'mission' : 'task', priority: PRIO.includes(b.priority) ? b.priority : 'med', points: Math.min(1000, Math.max(0, parseInt(b.points) || 0)), due: b.due || '', status: 'todo', assignee: un, labels: list(b.labels, 8), checklist: checklist(b.checklist), created: iso(), by: me.username, completed: null };
      db.tasks.push(t); out.push(t);
      notify(db, un, 'task', `New ${t.type}: ${title}${t.due ? ' (due ' + t.due + ')' : ''}`, { task: t.id });
    });
    save(db); res.json(out);
  });
  app.put('/api/tasks/:id', need(), (req, res) => {
    const db = load(), t = db.tasks.find(x => x.id === req.params.id), u = req.session.user, b = req.body || {};
    if (!t) return res.status(404).json({ error: 'not found' });
    const editor = EDIT.includes(u.role), mine = t.assignee === u.username;
    if (!editor && !mine) return res.status(403).json({ error: 'not allowed' });
    if (editor) {
      if (b.title !== undefined) { const x = str(b.title, 150); if (!x) return bad(res, 'Give the task a title'); t.title = x; }
      if (b.desc !== undefined) t.desc = str(b.desc, 1500);
      if (b.type !== undefined) t.type = b.type === 'mission' ? 'mission' : 'task';
      if (b.priority !== undefined && PRIO.includes(b.priority)) t.priority = b.priority;
      if (b.points !== undefined) t.points = Math.min(1000, Math.max(0, parseInt(b.points) || 0));
      if (b.due !== undefined) { if (b.due && !DAY.test(b.due)) return bad(res, 'Choose a valid deadline'); t.due = b.due || ''; }
      if (b.start !== undefined) { if (b.start && !DAY.test(b.start)) return bad(res, 'Choose a valid start date'); t.start = b.start || ''; }
      if (b.labels !== undefined) t.labels = list(b.labels, 8);
      if (b.checklist !== undefined) t.checklist = checklist(b.checklist);
      if (b.assignee !== undefined && b.assignee !== t.assignee) { const a = userBy(db, b.assignee); if (!a) return bad(res, 'Choose a valid person'); t.assignee = a.username; notify(db, a.username, 'task', `A ${t.type} was assigned to you: ${t.title}`, { task: t.id }); }
    } else if (b.checklist !== undefined && Array.isArray(b.checklist) && b.checklist.length === t.checklist.length) t.checklist.forEach((c, i) => { c.done = !!b.checklist[i].done; });
    if (b.pinned !== undefined) t.pinned = !!b.pinned;                                   // the agent can pin and archive their own cards too
    if (b.archived !== undefined) t.archived = b.archived ? iso() : null;
    if (b.status !== undefined) {
      if (!STATUS.includes(b.status)) return bad(res, 'Unknown status');
      if (b.status !== t.status) {
        const was = t.status; t.status = b.status;
        t.completed = b.status === 'done' ? iso() : null;
        if (b.status === 'done' && was !== 'done' && t.by && t.by !== u.username) notify(db, t.by, 'taskdone', `${u.name} completed: ${t.title}`, { task: t.id });
      }
    }
    save(db); res.json(t);
  });
  app.delete('/api/tasks/:id', need(...EDIT), (req, res) => {
    const db = load(); if (!db.tasks.some(t => t.id === req.params.id)) return res.status(404).json({ error: 'not found' });
    db.tasks = db.tasks.filter(t => t.id !== req.params.id); save(db); res.json({ ok: 1 });
  });
  app.get('/api/task-templates', need(...EDIT), (req, res) => res.json(load().taskTpl));
  // a template is a saved task: "none" = used by hand (New task from template), daily / weekly / monthly = a card is created by itself
  const FREQ = ['none', 'daily', 'weekly', 'monthly'], KINDS_T = ['checklist', 'target', 'task'];
  const tplBody = b => {
    const title = str(b.title, 150); if (!title) throw new Error('Give the template a title');
    const t = { title, desc: str(b.desc, 1500), kind: KINDS_T.includes(b.kind) ? b.kind : 'checklist', points: Math.min(1000, Math.max(0, parseInt(b.points) || 0)), priority: PRIO.includes(b.priority) ? b.priority : 'med', freq: FREQ.includes(b.freq) ? b.freq : 'none', weekday: Math.min(6, Math.max(0, parseInt(b.weekday) || 1)), monthday: Math.min(28, Math.max(1, parseInt(b.monthday) || 1)), color: /^#[0-9a-f]{6}$/i.test(b.color || '') ? b.color : '#7c3aed', users: list(b.users, 50, 40), teams: list(b.teams, 20, 40), checklist: checklist(b.checklist).map(({ t, min }) => ({ t, min })), labels: list(b.labels, 8) };
    if (t.freq !== 'none' && !t.users.length && !t.teams.length) throw new Error('Choose who receives the cards of a repeating template');
    return t;
  };
  app.post('/api/task-templates', need(...EDIT), (req, res) => {
    const db = load(); try { const tpl = { id: 'p' + hex(4), ...tplBody(req.body || {}), active: true, by: req.session.user.username, created: iso() }; db.taskTpl.push(tpl); save(db); res.json(tpl); } catch (e) { bad(res, e.message); }
  });
  app.put('/api/task-templates/:id', need(...EDIT), (req, res) => {
    const db = load(), tpl = db.taskTpl.find(x => x.id === req.params.id); if (!tpl) return res.status(404).json({ error: 'not found' });
    try { Object.assign(tpl, tplBody(req.body || {}), { updated: iso() }); save(db); res.json(tpl); } catch (e) { bad(res, e.message); }
  });
  app.delete('/api/task-templates/:id', need(...EDIT), (req, res) => {
    const db = load(); db.taskTpl = db.taskTpl.filter(t => t.id !== req.params.id); save(db); res.json({ ok: 1 });
  });

  // ---------------------------------------------------------------- coaching / training / one-to-one sessions
  const KINDS = ['o2o', 'coaching', 'group', 'training'];
  const writers = kind => kind === 'o2o' ? ['admin', 'lead', 'qa'] : ['admin', 'trainer', 'qa'];
  const sessBody = (b, db) => {
    const kind = KINDS.includes(b.kind) ? b.kind : null; if (!kind) throw new Error('Choose the type of session');
    if (!DAY.test(b.date || '')) throw new Error('Choose the date');
    const agents = list(b.agents, 60, 40).filter(x => userBy(db, x)); if (!agents.length) throw new Error('Choose at least one agent');
    const actions = (Array.isArray(b.actions) ? b.actions : []).slice(0, 20).map(a => ({ t: str(a.t, 200), owner: userBy(db, a.owner) ? a.owner : '', due: DAY.test(a.due || '') ? a.due : '', done: !!a.done, taskId: str(a.taskId, 20) })).filter(a => a.t);
    return { kind, date: b.date, title: str(b.title, 150) || ({ o2o: 'One-to-one', coaching: 'Coaching session', group: 'Group coaching', training: 'Training' })[kind], agents, topics: list(b.topics, 12), focus: list(b.focus, 12, 80), notes: str(b.notes, 6000), goals: str(b.goals, 2000), actions, follow: DAY.test(b.follow || '') ? b.follow : '', status: b.status === 'planned' ? 'planned' : 'done' };
  };
  function makeTasks(db, s, me) {
    s.actions.forEach(a => {
      if (a.taskId || !a.owner || !a.t) return;
      const t = { id: 'k' + hex(5), group: 'g' + hex(4), title: a.t, desc: 'From: ' + s.title, type: 'task', priority: 'med', points: 0, due: a.due, status: a.done ? 'done' : 'todo', assignee: a.owner, labels: ['coaching'], checklist: [], created: iso(), by: me.username, completed: a.done ? iso() : null };
      db.tasks.push(t); a.taskId = t.id; notify(db, a.owner, 'task', `New task from your ${s.kind === 'o2o' ? 'one-to-one' : 'coaching'}: ${a.t}`, { task: t.id });
    });
  }
  app.get('/api/sessions', need(), (req, res) => {
    const db = load(), u = req.session.user;
    res.json(db.sessions.filter(s => u.role !== 'agent' || s.agents.includes(u.username)));
  });
  app.post('/api/sessions', need(...EDIT), (req, res) => {
    const db = load(), me = req.session.user;
    try {
      const b = sessBody(req.body || {}, db); if (!writers(b.kind).includes(me.role)) return res.status(403).json({ error: 'Your role cannot document this type of session' });
      const s = { id: 's' + hex(5), ...b, by: me.username, byName: me.name, created: iso(), updated: iso() };
      if ((req.body || {}).makeTasks) makeTasks(db, s, me);
      db.sessions.unshift(s); save(db); res.json(s);
    } catch (e) { bad(res, e.message); }
  });
  // the agent signs a one-to-one / coaching session: "I have read it and agree" (optional comment); the person who wrote it is told
  app.post('/api/sessions/:id/sign', need(), (req, res) => {
    const db = load(), s = db.sessions.find(x => x.id === req.params.id), me = req.session.user;
    if (!s) return res.status(404).json({ error: 'not found' });
    if (!s.agents.includes(me.username)) return res.status(403).json({ error: 'Only the agents of this session can sign it' });
    s.signed = { ...(s.signed || {}), [me.username]: { at: iso(), cm: str((req.body || {}).cm, 500) } };
    if (s.by && s.by !== me.username) notify(db, s.by, 'taskdone', `${me.name} signed the ${s.kind === 'o2o' ? 'one-to-one' : 'session'}: ${s.title}`, {});
    save(db); res.json(s);
  });
  app.put('/api/sessions/:id', need(...EDIT), (req, res) => {
    const db = load(), s = db.sessions.find(x => x.id === req.params.id), me = req.session.user;
    if (!s) return res.status(404).json({ error: 'not found' });
    try {
      const b = sessBody({ ...s, ...(req.body || {}) }, db); if (!writers(b.kind).includes(me.role) || !writers(s.kind).includes(me.role)) return res.status(403).json({ error: 'not allowed' });
      Object.assign(s, b, { updated: iso() }); if ((req.body || {}).makeTasks) makeTasks(db, s, me); save(db); res.json(s);
    } catch (e) { bad(res, e.message); }
  });
  app.delete('/api/sessions/:id', need(...EDIT), (req, res) => {
    const db = load(), s = db.sessions.find(x => x.id === req.params.id), me = req.session.user;
    if (!s) return res.status(404).json({ error: 'not found' });
    if (!writers(s.kind).includes(me.role)) return res.status(403).json({ error: 'not allowed' });
    db.sessions = db.sessions.filter(x => x !== s); save(db); res.json({ ok: 1 });
  });

  // ---------------------------------------------------------------- quick flags: a red / green flag on a call, kept apart from QA reviews (scores never change)
  const qfBody = (b, db) => {
    const a = userBy(db, b.agent); if (!a || a.role !== 'agent') throw new Error('Choose the agent');
    const lead = str(b.lead, 60); if (!lead) throw new Error('Enter the lead ID');
    if (!DAY.test(b.date || '')) throw new Error('Choose the date');
    const link = v => /^https?:///i.test(String(v || '').trim()) ? str(v, 500) : '';
    return { type: b.type === 'green' ? 'green' : 'red', ch: ['call', 'chat', 'email', 'other'].includes(b.ch) ? b.ch : 'call', agent: a.username, tid: a.team, lead, date: b.date, cp: str(b.cp, 80), lk: link(b.lk), rl: link(b.rl), cm: str(b.cm, 1000) };
  };
  app.get('/api/qflags', need(), (req, res) => { const u = req.session.user; res.json(load().qflags.filter(f => u.role !== 'agent' || f.agent === u.username)); });
  app.post('/api/qflags', need(...EDIT), (req, res) => {
    const db = load(), me = req.session.user;
    try { const f = { id: 'f' + hex(5), ...qfBody(req.body || {}, db), by: me.username, byName: me.name, at: iso() }; db.qflags.unshift(f); notify(db, f.agent, 'flag', `${me.name} gave you a ${f.type} flag for Lead #${f.lead}${f.cm ? ': ' + f.cm.slice(0, 80) : ''}`, { flag: f.id, lead: f.lead }); save(db); res.json(f); } catch (e) { bad(res, e.message); }
  });
  app.put('/api/qflags/:id', need(...EDIT), (req, res) => {
    const db = load(), f = db.qflags.find(x => x.id === req.params.id); if (!f) return res.status(404).json({ error: 'not found' });
    try { Object.assign(f, qfBody({ ...f, ...(req.body || {}) }, db), { updated: iso() }); save(db); res.json(f); } catch (e) { bad(res, e.message); }
  });
  app.delete('/api/qflags/:id', need(...EDIT), (req, res) => { const db = load(); db.qflags = db.qflags.filter(x => x.id !== req.params.id); save(db); res.json({ ok: 1 }); });

  // ---------------------------------------------------------------- call simulator results (shown on the Agents page, tab Simulations)
  app.get('/api/simulations', need(), (req, res) => {
    const db = load(), u = req.session.user;
    res.json(db.simulations.filter(x => u.role !== 'agent' || x.agent === u.username));
  });
  app.post('/api/simulations', need(), (req, res) => {
    const db = load(), me = req.session.user, b = req.body || {};
    const agent = me.role === 'agent' ? me.username : (userBy(db, b.agent) ? b.agent : me.username);
    const x = { id: 'm' + hex(5), agent, scenario: str(b.scenario, 100) || 'Practice call', persona: str(b.persona, 60), score: Math.max(0, Math.min(100, Math.round(Number(b.score) || 0))), minutes: Math.max(1, Math.min(240, Math.round(Number(b.minutes) || 1))), result: str(b.result, 30), tips: list(b.tips, 6, 160), date: iso() };
    db.simulations.unshift(x); save(db); res.json(x);
  });

  // ---------------------------------------------------------------- calibration sessions (QA, team leads and trainers compare impressions and decide together)
  const decisions = v => (Array.isArray(v) ? v : []).slice(0, 30).map(d => ({ t: str(d.t, 250), owner: str(d.owner, 40), due: DAY.test(d.due || '') ? d.due : '', done: !!d.done })).filter(d => d.t);
  app.get('/api/calibrations', need(...EDIT), (req, res) => res.json(load().calibrations));
  app.post('/api/calibrations', need(...EDIT), (req, res) => {
    const db = load(), b = req.body || {}, me = req.session.user;
    if (!DAY.test(b.date || '')) return bad(res, 'Choose the date');
    const participants = list(b.participants, 30, 40).filter(x => { const u = userBy(db, x); return u && EDIT.includes(u.role); });
    if (!participants.includes(me.username)) participants.unshift(me.username);
    const c = { id: 'c' + hex(5), title: str(b.title, 150) || 'Calibration session', date: b.date, status: ['planned', 'held', 'closed'].includes(b.status) ? b.status : 'planned', participants, teams: list(b.teams, 20, 40), reviews: list(b.reviews, 30, 40), notes: str(b.notes, 5000), entries: {}, decisions: decisions(b.decisions), by: me.username, created: iso(), updated: iso() };
    participants.forEach(p => { if (p !== me.username) notify(db, p, 'cal', `${me.name} invited you to the calibration "${c.title}" on ${c.date}`, { cal: c.id }); });
    db.calibrations.unshift(c); save(db); res.json(c);
  });
  app.put('/api/calibrations/:id', need(...EDIT), (req, res) => {
    const db = load(), c = db.calibrations.find(x => x.id === req.params.id), me = req.session.user, b = req.body || {};
    if (!c) return res.status(404).json({ error: 'not found' });
    const owner = me.role === 'admin' || c.by === me.username, member = c.participants.includes(me.username);
    if (!owner && !member) return res.status(403).json({ error: 'Only the participants can change a calibration' });
    if (b.entry && member) c.entries[me.username] = { impression: str(b.entry.impression, 4000), done: str(b.entry.done, 4000), at: iso() };   // everybody writes only their own part
    if (b.decisions !== undefined) c.decisions = decisions(b.decisions);
    if (b.notes !== undefined) c.notes = str(b.notes, 5000);
    if (b.status !== undefined && ['planned', 'held', 'closed'].includes(b.status)) c.status = b.status;
    if (owner) {
      if (b.title !== undefined) c.title = str(b.title, 150) || c.title;
      if (b.date !== undefined && DAY.test(b.date)) c.date = b.date;
      if (b.participants !== undefined) { c.participants = list(b.participants, 30, 40).filter(x => { const u = userBy(db, x); return u && EDIT.includes(u.role); }); if (!c.participants.includes(c.by)) c.participants.unshift(c.by); }
      if (b.teams !== undefined) c.teams = list(b.teams, 20, 40);
      if (b.reviews !== undefined) c.reviews = list(b.reviews, 30, 40);
    }
    c.updated = iso(); save(db); res.json(c);
  });
  app.delete('/api/calibrations/:id', need(...EDIT), (req, res) => {
    const db = load(), c = db.calibrations.find(x => x.id === req.params.id), me = req.session.user;
    if (!c) return res.status(404).json({ error: 'not found' });
    if (me.role !== 'admin' && c.by !== me.username) return res.status(403).json({ error: 'Only the creator can delete a calibration' });
    db.calibrations = db.calibrations.filter(x => x !== c); save(db); res.json({ ok: 1 });
  });
};
