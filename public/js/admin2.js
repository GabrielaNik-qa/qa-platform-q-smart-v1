// ===================== Admin: Roles & permissions, Integrations, Notification rules, Backups & data, Email templates =====================
const ROLES5 = Object.keys(ROLE);
async function setX(key, value, msg) { const r = await api('/api/settings/x/' + key, { value }, 'PUT'); if (!r.ok) return toast(await errOf(r, 'Could not save'), true); SET = await r.json(); render(); if (msg) toast(msg); }

// ---- who can open which page (the server still checks every action, this decides what people see in the menu)
let PERMD = null;
PG.perms = function () {
  const pages = GROUPS.flatMap(g => g.items.map(([k, n]) => ({ k, n, g: g.name }))), cur = PERMD || JSON.parse(JSON.stringify(SET.perm || {}));
  const has = (k, r) => (cur[k] || RR[k] || ROLES5).includes(r), lock = k => GROUPS.find(g => g.id === 'admin').items.some(i => i[0] === k);
  return head('Roles & permissions', 'Which roles see which pages in the menu. Admins always keep the Admin pages.', `<div style="display:flex;gap:8px">${bellBtn()}${PERMD ? `<button class=ib onclick="PERMD=null;render()">Cancel</button><button class=btn onclick="setX('perm',PERMD,'Permissions saved');PERMD=null">Save</button>` : ''}<button class=ib onclick="ask('Back to the default permissions?','Every page goes back to the roles it had when the app was installed.',()=>setX('perm',{},'Default permissions restored'))">Reset to default</button></div>`)
    + card('', `<div class=sc><table class=ct><tr><th>Page</th><th>Menu group</th>${ROLES5.map(r => `<th style="text-align:center">${ROLE[r]}</th>`).join('')}</tr>${pages.map(p => `<tr><td><b>${esc(p.n)}</b></td><td><small>${esc(p.g)}</small></td>${ROLES5.map(r => `<td style="text-align:center"><input type=checkbox ${has(p.k, r) ? 'checked' : ''} ${lock(p.k) && r === 'admin' ? 'disabled' : ''} onchange="permTog('${p.k}','${r}',this.checked)"></td>`).join('')}</tr>`).join('')}</table></div><p class=mu style="font-size:13px;margin:10px 0 0">Unticking only hides the page. Actions are still protected on the server, so an agent can never change a review even if a page is visible.</p>`);
};
function permTog(k, r, on) { PERMD = PERMD || JSON.parse(JSON.stringify(SET.perm || {})); const l = new Set(PERMD[k] || RR[k] || ROLES5); on ? l.add(r) : l.delete(r); PERMD[k] = [...l]; render(); }

// ---- integrations: links to the other tools used every day
const INTF = [['crm', 'CRM lead link', 'https://montecryptos.myphoner.com/work/leads/{id}', 'Lead IDs become clickable everywhere, and QA Entry fills the CRM link by itself. {id} = the lead ID.'],
  ['rec', 'Recording link', 'https://app.voiso.com/cdr?search={id}', 'Optional. When a review has no recording link, this link is offered instead.'],
  ['zendesk', 'Zendesk', 'https://yourcompany.zendesk.com', 'Shown as a shortcut on the review pop-up of chats and emails.'],
  ['voiso', 'Voiso', 'https://cc-ams03.voiso.com', 'Telephony — a shortcut in the Tools of the review pop-up.'],
  ['modjo', 'Modjo', 'https://app.modjo.ai', 'Call recording and AI — a shortcut in the review pop-up.']];
PG.integ = function () {
  const v = SET.integ || {};
  return head('Integrations', 'Links to your CRM, telephony and help desk, used all over the app', bellBtn())
    + card('Links', `<div class=form style="max-width:none">${INTF.map(([k, n, ph, h]) => `<label>${n}<input id=ig_${k} value="${esc(v[k] || '')}" placeholder="${esc(ph)}"><small class=mu>${esc(h)}</small></label>`).join('')}<button class=btn style="justify-self:start" onclick="setX('integ',Object.fromEntries(INTF.map(([k])=>[k,$('#ig_'+k).value.trim()])),'Integrations saved')">Save</button></div>`)
    + card('AI', `<p style="margin:0">${AIS.enabled ? `✓ AI is switched on (${esc(AIS.model || '')}).` : 'AI is not switched on yet.'} The key is kept in the <b>.env</b> file on the server (never in the browser) — send it to your developer when you are ready.</p>`);
};
// a lead ID turned into the CRM link (when a pattern is set)
const crmLink = id => { const p = (SET.integ || {}).crm; return p && id ? p.replace('{id}', encodeURIComponent(String(id).trim())) : ''; };

// ---- notification rules: which roles receive which notifications
const NOTIFT = { review: 'A new review', dispute: 'A review is disputed', msg: 'A new dispute message', resolved: 'A dispute is resolved', remind: 'A reminder to open a review', task: 'A new task', taskdone: 'A task is completed / a session is signed', quiz: 'A new quiz', news: 'A new newsletter', cal: 'A calibration session', flag: 'A quick flag', kudos: 'Kudos', pip: 'An improvement plan', goal: 'A new goal', risk: 'A risk case assigned', reg: 'A new registration request' };
PG.notifs = function () {
  const off = SET.notifOff || {};
  return head('Notification rules', 'Which roles get which notifications in the bell (and the sound)', bellBtn())
    + card('', `<div class=sc><table class=ct><tr><th>Notification</th>${ROLES5.map(r => `<th style="text-align:center">${ROLE[r]}</th>`).join('')}</tr>${Object.entries(NOTIFT).map(([k, n]) => `<tr><td>${esc(n)}</td>${ROLES5.map(r => `<td style="text-align:center"><input type=checkbox ${(off[k] || []).includes(r) ? '' : 'checked'} onchange="nfTog('${k}','${r}',this.checked)"></td>`).join('')}</tr>`).join('')}</table></div><p class=mu style="font-size:13px;margin:10px 0 0">Changes are saved at once. A role only receives a notification when it is about them (for example agents get "a new review" only for their own reviews).</p>`);
};
function nfTog(k, r, on) { const off = JSON.parse(JSON.stringify(SET.notifOff || {})), l = new Set(off[k] || []); on ? l.delete(r) : l.add(r); off[k] = [...l]; setX('notifOff', off, 'Saved'); }

// ---- backups & data
PG.backup = function () {
  return head('Backups & data', 'Make a copy of all the data, download it, or go back to an earlier copy', bellBtn())
    + `<div class="g g2">${card('Back up now', `<p class=mu style="margin:0 0 10px">A copy of all the data is kept in the <b>backups</b> folder next to the app. Do it before big changes.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class=btn onclick="bkMake()">${IC.zip} Make a backup</button><a class="ib ibx" href="/api/backups/current/download" style="text-decoration:none;color:var(--tx)">${IC.dl} Download the data</a></div>`)}
${card('Restore from a file', `<p class=mu style="margin:0 0 10px">Choose a backup file (.json) from your computer. The current data is backed up first, so nothing is lost.</p><input type=file id=bkf accept=".json,application/json"> <button class="ib ibx" onclick="bkUpload()">${IC.up} Restore this file</button>`)}</div>`
    + card(`Backups <span class=bg>${BKS.length}</span>`, BKS.length ? tbl(['File', 'Size', 'Made', ''], BKS.map(b => [`<b class=mono>${esc(b.f)}</b>`, (b.size / 1024).toFixed(0) + ' KB', fdt(b.at), `<a class="ib ibx" href="/api/backups/${encodeURIComponent(b.f)}" style="text-decoration:none;color:var(--tx)">${IC.dl}</a> <button class="ib ibx" onclick="bkRestore('${esc(b.f)}')">Restore</button> <button class=ic onclick="bkDel('${esc(b.f)}')" title="Delete">${IC.bin}</button>`])) : '<p class=mu>No backups yet</p>')
    + card('seed.js — the starting data', `<p style="margin:0 0 10px">Running <code>node seed.js</code> (or starting the app without a data.json) brings back the data saved inside <b>seed.js</b>. Update it to today's data when you are happy with it.</p><button class="ib ibx" onclick="ask('Update seed.js?','seed.js will hold the data as it is right now. Running node seed.js later brings back exactly this data.',seedRefresh,{yes:'Yes, update it',no:'Cancel'})">Update seed.js with today's data</button>`)
    + card('Recordings', `<p class=mu style="margin:0">Call recordings are not inside the data file. They are kept in the folder <b>Documents\\Q-smart recordings</b> on the computer that runs the app — back that folder up too.</p>`);
};
async function bkMake() { const r = await api('/api/backups', {}); if (!r.ok) return toast(await errOf(r, 'Could not make the backup'), true); await load(); render(); toast('Backup made'); }
const bkRestore = f => ask('Go back to this backup?', `All the data becomes what it was in ${f}. The current data is backed up first.`, async () => { const r = await api('/api/backups/' + encodeURIComponent(f) + '/restore', {}); if (!r.ok) return toast(await errOf(r, 'Could not restore'), true); toast('Restored — reloading'); setTimeout(() => location.reload(), 900); }, { yes: 'Yes, restore', no: 'Cancel', danger: true });
const bkDel = f => ask('Delete this backup?', f + ' is deleted for good.', async () => { await api('/api/backups/' + encodeURIComponent(f), null, 'DELETE'); await load(); render(); }, { yes: 'Yes, delete', no: 'Cancel', danger: true });
async function bkUpload() { const fl = $('#bkf').files[0]; if (!fl) return toast('Choose a file first', true); let d; try { d = JSON.parse(await fl.text()); } catch (e) { return toast('That file is not a valid backup', true); } ask('Restore this file?', 'All the data becomes what is in ' + fl.name + '. The current data is backed up first.', async () => { const r = await api('/api/backups/upload/restore', { data: d }); if (!r.ok) return toast(await errOf(r, 'Could not restore'), true); toast('Restored — reloading'); setTimeout(() => location.reload(), 900); }, { yes: 'Yes, restore', no: 'Cancel', danger: true }); }
async function seedRefresh() { const r = await api('/api/seed/refresh', {}); if (!r.ok) return toast(await errOf(r, 'Could not update seed.js'), true); toast('seed.js now holds today’s data'); }

// ---- e-mail templates
const MAILT = { reset: ['Reset password', 'Reset your password', 'Hi {name},\n\nChoose a new password here (valid for 1 hour):\n{link}\n\nIf you did not ask for this, ignore this email.', '{name} {link}'],
  approved: ['Registration approved', 'Your registration has been approved', 'Hi {name},\n\nGood news - your registration has been approved. You can now log in:\n{link}\n\nUsername: {username}', '{name} {link} {username}'],
  account: ['New account', 'Your account has been created', 'Hi {name},\n\nAn account was created for you.\n\nAddress: {link}\nUsername: {username}\nTemporary password: {password}\n\nYou will be asked to choose a new password the first time you log in.', '{name} {link} {username} {password}'],
  reminder: ['Review reminder', 'Reminder: you have a review waiting', 'Hi {name},\n\nPlease open your review for Lead #{lead}:\n{link}', '{name} {link} {lead}'],
  report: ['Scheduled report', 'Q-smart report: {name}', '{name}\nOpen {link} to see the full report.', '{name} {link} (the table is added below the text)'] };
PG.mailtpl = function () {
  const v = SET.mailtpl || {};
  return head('Email templates', 'The words of the e-mails the app sends. Leave a field empty to use the default.', bellBtn())
    + Object.entries(MAILT).map(([k, [n, s, b, vars]]) => card(n, `<div class=form style="max-width:none"><label>Subject<input id=mt_s_${k} value="${esc((v[k] || {}).subject || '')}" placeholder="${esc(s)}"></label><label>Text<textarea id=mt_b_${k} rows=6 placeholder="${esc(b)}">${esc((v[k] || {}).body || '')}</textarea><small class=mu>You can use: ${esc(vars)}</small></label></div>`)).join('')
    + `<button class=btn onclick="setX('mailtpl',Object.fromEntries(Object.keys(MAILT).map(k=>[k,{subject:$('#mt_s_'+k).value.trim(),body:$('#mt_b_'+k).value.trim()}])),'Templates saved')">Save templates</button>`;
};
