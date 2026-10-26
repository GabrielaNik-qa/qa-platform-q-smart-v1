// ===================== AI team: the AI QA reviewer (AutoQA › "AI reviewer", admins and QA) =====================
// The AI reviews a conversation on your real scorecard (Yes / No / N/A per item, a comment for every No, a comment for the agent)
// and leaves it as a draft. A person checks it: changes any answer, then approves (it becomes a normal review, the agent is told)
// or rejects it. Every approved draft records how much the person agreed with the AI: that is the similarity rate.
let AQTAB = LS.get('qa_aqtab', 'auto'), AIDV = null, AINEW = false;   // AIDV = the draft being checked; AINEW = the "New AI review" form is open
const aiRev = () => ['admin', 'qa'].includes(ME.role);
const aqTab = t => { AQTAB = t; LS.set('qa_aqtab', t); render(); };
const aiMonth = d => String(d.decided || d.at || '').slice(0, 7) === todayS().slice(0, 7);
// similarity: the share of items where the person kept the AI's answer (approved drafts), overall and per category
function aiSim(list) {
  const ok = list.filter(d => d.status === 'approved' && d.sim && d.sim.items != null), cats = {};
  ok.forEach(d => { const sc = SCS.find(s => s.id === d.scid); (d.sim.cats || []).forEach((v, i) => { const n = sc && sc.cats[i] ? sc.cats[i].n : '#' + (i + 1); if (v != null) (cats[n] = cats[n] || []).push(v); }); });
  return { n: ok.length, v: ok.length ? avg(ok.map(d => d.sim.items)) : null, diff: ok.length ? avg(ok.map(d => Math.abs((d.fsc || 0) - (d.sc || 0)))) : null, cats: Object.entries(cats).map(([n, l]) => ({ n, v: avg(l) })).sort((p, q) => p.v - q.v) };
}
const aiTabs = () => aiRev() ? `<div class=sg role=tablist style="margin:0 0 14px"><button role=tab class="${AQTAB !== 'ai' ? 'on' : ''}" onclick="aqTab('auto')">AutoQA</button><button role=tab class="${AQTAB === 'ai' ? 'on' : ''}" onclick="aqTab('ai')">AI reviewer${AIDR.filter(d => d.status === 'draft').length ? ` · ${AIDR.filter(d => d.status === 'draft').length}` : ''}</button></div>` : '';
function aiRevPage() {
  const wait = AIDR.filter(d => d.status === 'draft'), done = AIDR.filter(d => d.status !== 'draft'), m = aiSim(AIDR.filter(aiMonth)), all = aiSim(AIDR);
  const row = d => [d.dt, `<b>${esc(d.agn || an(d.agent))}</b>`, `<span class=mono>${esc(d.lead)}</span>`, chTag(d.ch), esc(d.scn), `<b class=mono style="color:${col(d.sc)}">${d.sc}%</b>`];
  return `<div class=fkp>${kpiS('Human vs AI similarity this month', m.v == null ? '—' : m.v.toFixed(1) + '%', m.n ? `${m.n} approved drafts` : 'appears after the first approved draft', m.v == null ? '' : col(m.v))}${kpiS('Drafts waiting for you', wait.length, wait.length ? 'check and approve them' : 'nothing waiting', wait.length ? 'var(--wn)' : 'var(--ok)')}${kpiS('Average score difference', all.diff == null ? '—' : all.diff.toFixed(1) + ' pts', 'between the AI and the final review')}${kpiS('Approved · rejected', `${done.filter(d => d.status === 'approved').length} · ${done.filter(d => d.status === 'rejected').length}`, 'all time')}</div>`
    + `<div class=row style="margin:0 0 12px"><p class=mu style="margin:0">The AI reviews a conversation on your scorecard and leaves a draft. You check it, change any answer, and approve or reject it.</p><button class=btn onclick="AINEW=true;render()">${IC.plus} New AI review</button></div>`
    + card(`Waiting for you <span class=bg>${wait.length}</span>`, wait.length ? tbl(['Date', 'Agent', 'Lead', 'Type', 'Scorecard', 'AI score', 'Confidence', ''], wait.map(d => [...row(d), d.conf + '%', `<button class=ib onclick="AIDV=${jsq(d.id)};render()">Check</button>`])) : '<p class=mu style="margin:0">No drafts are waiting. Press "New AI review" to let the AI review a conversation.</p>')
    + (all.cats.length ? card('Agreement per category <small class=mu style="font-weight:400">the lowest first: where the AI needs clearer rules (Admin › Integrations › playbook)</small>', all.cats.map(c => `<div style="margin-bottom:8px"><div class=row><span>${esc(c.n)}</span><b class=mono style="color:${col(c.v)}">${c.v.toFixed(0)}%</b></div>${bar(c.v, col(c.v))}</div>`).join('')) : '')
    + (done.length ? card('Decided', tbl(['Date', 'Agent', 'Lead', 'Type', 'Scorecard', 'AI score', 'Final', 'Similarity', 'Status'], done.slice(0, 100).map(d => [...row(d), d.status === 'approved' ? `<a href="javascript:void(0)" class=agl onclick="om('view','${esc(d.rid)}')">${d.fsc}%</a>` : '—', d.sim ? `<b class=mono style="color:${col(d.sim.items)}">${d.sim.items}%</b>` : '—', d.status === 'approved' ? pill('Approved', 'ok') : `<span title="${esc(d.why || '')}">${pill('Rejected', 'bad')}</span>`]))) : '');
}
// ---- a new AI review: paste a transcript, or pick a conversation already in AutoQA
const AINEWM = () => OVL(`<div class=mh><div><h2>New AI review</h2><small>The AI answers every item of the scorecard; you check the draft before anything is published</small></div>${X('AINEW=false;render()')}</div><div class=mb><div class=form style="max-width:none">
<label>From a conversation in AutoQA (optional)<select id=ain_conv onchange="document.getElementById('ain_man').hidden=!!this.value"><option value="">— paste a transcript instead —</option>${AQC.slice(0, 200).map(c => `<option value="${esc(c.id)}">${esc(c.date)} · ${esc(an(c.agent) || c.agn || '')}</option>`).join('')}</select></label>
<div id=ain_man class=form style="max-width:none;padding:0"><div class=eg2><label>Agent<select id=ain_ag>${AGENTS().map(a => `<option value="${esc(a.username)}">${esc(a.name)}</option>`).join('')}</select></label><label>Date<input id=ain_dt type=date value="${todayS()}"></label></div>
<label>Transcript<textarea id=ain_tx rows=8 placeholder="Agent: Good morning, my name is …&#10;Customer: …"></textarea></label></div>
<div class=eg2><label>Lead ID<input id=ain_id placeholder="4640814"></label><label>Type<select id=ain_ch>${CHS.map(k => `<option value=${k}>${CHP[k]}</option>`).join('')}</select></label></div>
<label>Scorecard<select id=ain_sc>${SCS.map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('')}</select></label></div>
<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px"><button class=ib onclick="AINEW=false;render()">Cancel</button><button class=btn id=ain_go onclick="aiNew()">Let the AI review it</button></div></div>`, 'AINEW=false;render()', 640, 50);
const aiNew = () => once('ainew', async () => {
  const v = id => ($('#' + id) || {}).value || '', conv = v('ain_conv'), b = { id: v('ain_id').trim(), ch: v('ain_ch'), scid: v('ain_sc') };
  if (conv) b.conv = conv; else Object.assign(b, { agent: v('ain_ag'), dt: v('ain_dt'), tx: v('ain_tx') });
  const go = $('#ain_go'); if (go) { go.disabled = true; go.textContent = tr('The AI is reading the conversation…'); }
  const r = await api('/api/ai/drafts', b); if (!r.ok) { if (go) { go.disabled = false; go.textContent = tr('Let the AI review it'); } return toast(await errOf(r, 'The AI could not review it'), true); }
  const d = await r.json(); AIDR.unshift(d); AINEW = false; AIDV = d.id; render(); toast('Draft ready: check it before you approve');
});
// ---- checking a draft: every item with the AI's answer and comment, all of them can be changed
function AIDVM() {
  const d = AIDR.find(x => x.id === AIDV), sc = d && SCS.find(s => s.id === d.scid); if (!d || !sc) { AIDV = null; return ''; }
  const opt = (v, cur) => [['y', 'Yes'], ['n', 'No'], ['na', 'N/A']].map(([k, n]) => `<option value=${k} ${k === cur ? 'selected' : ''}>${n}</option>`).join('');
  return OVL(`<div class=mh><div><h2>Check the AI review</h2><small>${esc(d.agn)} · Lead ${esc(d.lead)} · ${esc(d.scn)} · AI score ${d.sc}% · confidence ${d.conf}%</small></div>${X('AIDV=null;render()')}</div><div class="mb aich">
<details open class=aitx><summary>Transcript</summary><pre>${esc(d.tx || '')}</pre></details>
${sc.cats.map((c, ci) => `<div class=aicat><b>${esc(c.n)}${c.k ? ' <span class=crit>Critical</span>' : ''}</b>${c.it.map((it, ii) => { const x = (d.a[ci] || [])[ii] || ['na', '']; return `<div class=aiit data-ai="${x[0]}"><span>${esc(it.t)}${it.k ? ' <small class=crit>critical</small>' : ''}</span><select id="aia_${ci}_${ii}" onchange="this.closest('.aiit').classList.toggle('chg',this.value!==this.closest('.aiit').dataset.ai)">${opt(x[0], x[0])}</select><input id="aic_${ci}_${ii}" value="${esc(x[1] || '')}" placeholder="Comment"></div>`; }).join('')}</div>`).join('')}
<label>Comment for the agent<textarea id=aia_cm rows=3>${esc(d.cm || '')}</textarea></label>
<small class=mu>Answers you change are marked. When you approve, a normal review is published and the agent is told.</small>
<div style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap"><button class=ib style="color:var(--bad)" onclick="aiReject()">Reject</button><button class=btn onclick="aiApprove()">Approve and publish</button></div></div>`, 'AIDV=null;render()', 860, 30);
}
const aiApprove = () => once('aiok', async () => {
  const d = AIDR.find(x => x.id === AIDV), sc = SCS.find(s => s.id === d.scid);
  const a = sc.cats.map((c, ci) => c.it.map((it, ii) => [($('#aia_' + ci + '_' + ii) || {}).value || 'na', ($('#aic_' + ci + '_' + ii) || {}).value || '', '']));
  const r = await api('/api/ai/drafts/' + d.id + '/approve', { a, cm: ($('#aia_cm') || {}).value || '' }); if (!r.ok) return toast(await errOf(r, 'Could not approve'), true);
  const j = await r.json(); Object.assign(d, j.draft); AIDV = null; await load(); render(); toast(`Review published · ${j.ev.sc}% · similarity ${j.draft.sim.items}%`);
});
const aiReject = () => ask('Reject this AI review?', 'Nothing is published. You can write why, so the rules for the AI can be improved.', async () => {
  const r = await api('/api/ai/drafts/' + AIDV + '/reject', { why: '' }); if (!r.ok) return toast(await errOf(r, 'Could not reject'), true);
  Object.assign(AIDR.find(x => x.id === AIDV), await r.json()); AIDV = null; render(); toast('Draft rejected');
}, { yes: 'Yes, reject', no: 'Cancel', danger: true });
