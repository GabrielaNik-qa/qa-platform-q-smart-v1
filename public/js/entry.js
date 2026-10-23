// ===================== QA Entry form (new review and edit review) =====================
const ent0 = id => {
  const s = SCS.find(x => x.id === id) || SCS[0];
  return { scid: s.id, scn: s.name, team: '', agent: '', id: '', dt: '', lk: '', rl: '', cp: '', cm: '', fl: '',
    cats: s.cats.map(c => ({ n: c.n, k: !!c.k, it: c.it.map(i => ({ t: i.t, p: i.p, k: !!i.k, a: 'y', cm: '', rc: '' })) })) };
};
const newEnt = id => { ENT = ent0(id); ENT0 = JSON.stringify(ENT); EDITID = ''; };
const entDirty = () => !!ENT && JSON.stringify(ENT) !== ENT0;

// the same rules as the server:  N/A is left out of the possible points;
// critical item = No -> its category scores 0;  critical category = any No -> the whole review is 0%
const entS = () => {
  let zero = false;
  const cs = ENT.cats.map(c => {
    let e = 0, m = 0, cf = false, no = false;
    c.it.forEach(i => { if (i.a !== 'na') { m += i.p; if (i.a === 'y') e += i.p; } if (i.a === 'n') { no = true; if (i.k) cf = true; } });
    if (cf) e = 0; if (c.k && no) zero = true;
    return { n: c.n, e, m, z: cf };
  });
  if (zero) cs.forEach(c => { c.e = 0; c.z = true; });
  const E = cs.reduce((a, c) => a + c.e, 0), M = cs.reduce((a, c) => a + c.m, 0);
  return { cs, zero, pc: zero ? 0 : (M ? E / M * 100 : 0) };
};
const PV = () => {
  const s = entS(), pc = s.pc, thr = ENT.team ? PT(ENT.team) : PASSG(), ok = pc >= thr, C = 326.7;
  const clr = ok ? 'url(#dg)' : pc >= Math.min(70, thr) ? 'var(--wn)' : 'var(--bad)';
  const fb = (k, l) => `<button class="${ENT.fl === k ? 'on' : ''}" onclick="setFl('${k}')"><span class="${k ? 'f' : ''}" style="display:flex;color:${k === 'red' ? 'var(--bad)' : k === 'green' ? 'var(--ok)' : 'var(--mu)'}">${IC.flag}</span>${l}</button>`;
  return `<div class="card rp-c"><small class=cap>CURRENT SCORE PREVIEW</small><div class=ring><svg viewBox="0 0 124 124" width="124" height="124"><defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f8fe6"/><stop offset="1" stop-color="#3ecfa6"/></linearGradient></defs><circle cx="62" cy="62" r="52" fill="none" stroke="var(--bd)" stroke-width="9"/><circle cx="62" cy="62" r="52" fill="none" stroke="${clr}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(pc * C / 100).toFixed(1)} ${C}" transform="rotate(-90 62 62)"/></svg><div class=rv><div><b class=mono>${pc.toFixed(1)}</b><small>%</small></div></div></div>
<div>${s.zero ? pill('Critical failure: score set to 0%', 'bad') : ok ? pill(`✓ Passing (≥ ${thr}%)`, 'ok') : pill(`Below target (< ${thr}%)`, pc >= Math.min(70, thr) ? 'wn' : 'bad')}</div><hr><small class=cap style="text-align:left">FLAG</small><div class=fgs>${fb('', 'Blank')}${fb('green', 'Green')}${fb('red', 'Red')}</div>
<button class=sbtn2 onclick="subE()">${EDITID ? 'Save Changes' : 'Submit QA Review'}</button>${EDITID ? `<button class=ib style="width:100%;margin-top:10px" onclick="cancelE()">Cancel</button>` : ''}</div>
<div class=card><small class=cap>CATEGORIES</small>${s.cs.map(c => `<div class=row style="font-size:13px;margin-top:10px"><span>${esc(c.n)}</span><b class=mono ${c.z ? 'style="color:var(--bad)"' : ''}>${c.e}/${c.m}</b></div>`).join('')}</div>`;
};
const AGO = () => !ENT.team ? '<option value="">Select a team first</option>' : '<option value="">Select an agent</option>' + AGENTS().filter(a => a.team === ENT.team).map(a => `<option value="${esc(a.username)}" ${ENT.agent === a.username ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
const pvu = () => { $('#pv').innerHTML = PV(); entS().cs.forEach((c, ci) => { const x = $('#sh' + ci); if (x) { x.textContent = c.e + ' / ' + c.m; x.style.color = c.z ? 'var(--bad)' : ''; } }); };
const setA = (ci, ii, v) => { const it = ENT.cats[ci].it[ii]; it.a = v; if (v !== 'n') it.rc = ''; const row = $('#r' + ci + '_' + ii); row.querySelectorAll('.yn button').forEach(b => b.classList.toggle('on', b.dataset.v === v)); const s = row.querySelector('.rcs'); if (s) { s.classList.toggle('hide', v !== 'n'); if (v !== 'n') s.value = ''; } pvu(); };
const setFl = v => { ENT.fl = v; pvu(); };
const setSc = id => { newEnt(id); render(); };
const setTm = v => { ENT.team = v; ENT.agent = ''; const a = $('#eag'); a.innerHTML = AGO(); a.disabled = !v; pvu(); };

PG.entry = function () {
  if (!SCS.length) return head('QA Entry Form', 'Enter QA scores for calls directly') + card('', '<p class=mu>There is no scorecard yet. Create one in Scorecards first.</p>');
  if (!ENT || (!EDITID && !SCS.some(x => x.id === ENT.scid))) newEnt();
  const ed = EDITID, s = SCS.find(x => x.id === ENT.scid), S = entS(), L = (t, r) => t + (r ? ' <i class=rq>*</i>' : ' <span class=mu>(optional)</span>');
  return head(ed ? 'Edit QA Review' : 'QA Entry Form', ed ? 'Update the answers and save your changes' : 'Enter QA scores for calls directly',
    `<div style="display:flex;gap:8px;flex-wrap:wrap">${ed ? `<button class=ib onclick="cancelE()">Cancel</button>` : ''}<div class=sx style="width:290px"><span>${IC.search}</span><input class=qi style="padding-right:64px" placeholder="Search lead ID, agent, campaign…" value="${esc(Q)}" oninput="sq(this)" onkeydown='if(event.key=="Enter"&&!document.getElementById("tb")){KQ=true;location.hash="calls"}'><kbd class=kb>Ctrl K</kbd></div>${bellBtn()}</div>`)
    + `<div class=eg><div>` + card('Call Information', `<label>${L('Select Scorecard', 1)}<select ${ed ? 'disabled' : ''} onchange="setSc(this.value)">${s ? '' : `<option>${esc(ENT.scn || '')}</option>`}${SCS.map(x => `<option value="${esc(x.id)}" ${x.id === ENT.scid ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label><small class=mu>${esc(s ? s.desc : '')}</small><hr><div class=eg2>`
      + `<label>${L('Team', 1)}<select id=etm onchange="setTm(this.value)"><option value="">Select a team</option>${TEAMS.map(t => `<option value="${t.id}" ${ENT.team === t.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></label>`
      + `<label>${L('Agent', 1)}<select id=eag ${!ENT.team ? 'disabled' : ''} onchange="ENT.agent=this.value">${AGO()}</select></label>`
      + `<label>${L('Lead ID', 1)}<input id=eid placeholder="Enter lead ID (any characters)" maxlength=60 value="${esc(ENT.id)}" oninput="ENT.id=this.value"></label>`
      + `<label>${L('Call Date', 1)}<input id=edt type=date value="${ENT.dt}" oninput="ENT.dt=this.value"></label>`
      + `<label>${L('CRM Link')}<input placeholder="https://…" value="${esc(ENT.lk)}" oninput="ENT.lk=this.value"></label>`
      + `<label>${L('Recording Link')}<input placeholder="https://…" value="${esc(ENT.rl)}" oninput="ENT.rl=this.value"></label>`
      + `<label>${L('Campaign')}<input id=ecp placeholder="Enter campaign name" value="${esc(ENT.cp)}" oninput="ENT.cp=this.value"></label>`
      + `<label>${L(ed && ENT.rec && !ENT.recDel ? 'Replace recording file' : 'Recording file')}<input id=ef type=file accept="audio/*">${ed && ENT.rec ? (ENT.recDel ? `<small class=mu>The recording will be removed when you save. <a href="javascript:void(0)" style="color:var(--ac)" onclick="ENT.recDel=false;render()">Undo</a></small>` : `<small class=mu style="display:flex;gap:8px;align-items:center">${IC.play} Current file: ${esc(ENT.rec)} <a href="javascript:void(0)" style="color:var(--bad)" onclick="ENT.recDel=true;render()">Remove</a></small>`) : ''}</label>` + `</div>`)
    + ENT.cats.map((c, ci) => card('', `<div class=row><h3 style="margin:0">${esc(c.n)}${c.k ? '<span class=crit title="If any item in this category is answered No, the whole review scores 0%">Critical category</span>' : ''}</h3><b class=mono id=sh${ci} ${S.cs[ci].z ? 'style="color:var(--bad)"' : ''}>${S.cs[ci].e} / ${S.cs[ci].m}</b></div>` + c.it.map((i, ii) => `<div class=ir id=r${ci}_${ii}><div class=row style="gap:16px;align-items:center"><span>${esc(i.t)}${i.k ? '<span class=crit title="If answered No, this category scores 0 points">Critical</span>' : ''}</span><div style="display:flex;align-items:center;gap:12px;flex:none"><small class=mono>${i.p} pts</small><div class=yn>${[['y', 'Yes'], ['n', 'No'], ['na', 'N/A']].map(([v, l]) => `<button class="${v} ${i.a === v ? 'on' : ''}" data-v=${v} onclick="setA(${ci},${ii},'${v}')">${l}</button>`).join('')}</div></div></div><select class="rcs ${i.a === 'n' ? '' : 'hide'}" onchange="ENT.cats[${ci}].it[${ii}].rc=this.value"><option value="">Root cause: why was this answered No? (optional)</option>${RCS.filter(x => x.active !== false || x.name === i.rc).map(x => `<option ${i.rc === x.name ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select><textarea rows=1 placeholder="Add a comment for this item (optional)…" oninput="ENT.cats[${ci}].it[${ii}].cm=this.value">${esc(i.cm)}</textarea></div>`).join(''))).join('')
    + card('', `<label>General Comments <span class=mu>(optional)</span><textarea rows=4 placeholder="Enter any additional comments or observations…" oninput="ENT.cm=this.value">${esc(ENT.cm)}</textarea></label>`)
    + `</div><div class=rp><div id=pv>${PV()}</div></div></div>`;
};

function edE(rid) {
  const e = EV.find(x => x.rid === rid); if (!e) return false;
  MD = null; EDITID = rid;
  ENT = { scid: e.scid || '', scn: e.scn || '', team: e.tm || teamOf(e.agent), agent: e.agent, id: String(e.id), dt: iso(e.d), lk: e.lk || '', rl: e.rl || '', cp: e.cp || '', cm: e.cm || '', fl: e.fl || '', rec: e.rec || '', recDel: false,
    cats: e.cs.map(c => ({ n: c.n, k: !!c.k, it: c.it.map(i => ({ t: i.t, p: i.p, k: !!i.k, a: i.a, cm: i.cm || '', rc: i.rc || '' })) })) };
  ENT0 = JSON.stringify(ENT);
  if (location.hash === '#entry') render(); else location.hash = 'entry';
  return false;
}
function cancelE() {
  const out = () => { ENT = null; EDITID = ''; location.hash = 'calls'; };
  if (entDirty()) ask('Cancel editing?', 'You have unsaved changes. If you leave now they will be lost. Are you sure?', out, { yes: 'Yes, discard changes', no: 'No, keep editing' }); else out();
}
function subE() {
  const E = ENT;
  if (!E.team) return toast('Select a team', true);
  if (!E.agent) return toast('Select an agent', true);
  if (!E.id.trim()) return toast('Enter the lead ID', true);
  if (!E.dt) return toast('Select the call date', true);
  if (EDITID) return ask('Change this score?', 'Are you sure you want to save these changes? The answers and the score of this review will be updated.', saveE, { yes: 'Yes, save changes', no: 'No, keep editing' });
  saveE();
}
async function saveE() {
  const E = ENT, a = E.cats.map(c => c.it.map(i => [i.a, i.cm, i.rc])), fl = $('#ef') && $('#ef').files[0];
  const body = { scid: E.scid, agent: E.agent, id: E.id.trim(), dt: E.dt, lk: E.lk, rl: E.rl, cp: E.cp, cm: E.cm, fl: E.fl, a };
  const r = EDITID ? await api('/api/evaluations/' + EDITID, body, 'PUT') : await api('/api/evaluations', body);
  if (!r.ok) { if (r.status === 401) return; return toast(await errOf(r, r.status === 403 ? 'Your role cannot add evaluations' : 'Could not save the review'), true); }
  const ev = await r.json();
  if (!fl && EDITID && E.recDel) await api('/api/evaluations/' + ev.rid + '/recording', null, 'DELETE');
  if (fl) { const u = await fetch('/api/evaluations/' + ev.rid + '/recording?ext=' + encodeURIComponent((fl.name.split('.').pop() || '').toLowerCase()), { method: 'POST', headers: { 'Content-Type': fl.type || 'application/octet-stream' }, body: fl }); if (!u.ok) toast('The review was saved, but the recording was not accepted (use mp3, wav, m4a, ogg or webm).', true); }
  beep(); await load();
  if (EDITID) { ENT = null; EDITID = ''; location.hash = 'calls'; render(); toast('Changes saved'); return; }
  newEnt(E.scid); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); toast('Review saved ✓  You can enter the next one');   // stay on the form, ready for the next review
}
