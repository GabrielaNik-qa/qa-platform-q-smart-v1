// ===================== Table kit: a "Filters" side panel with chips, and a "Columns" chooser (ideas from Zendesk QA) =====================
// A page describes its table once with txReg(page, { cols, filters, count, clear }):
//   cols    [{ k, t: 'TITLE', td: row => html, off: true = hidden until chosen, lock: true = always shown }]
//   filters () => [{ k, n: 'Name', v: current value ('' = all), o: () => [[value, label]], set: v => …, extra: () => html (e.g. two dates) }]
//   count   () => how many rows match now (shown live in the panel);  clear () => every filter back to "all"
// Above the table: txTools(page, search) = search + "Filters" + a chip per filter in use (✕ takes it away) + "Columns".
// The columns each person picks are saved in their account (My account keeps them on every computer).
const TXR = {};
let TXF = null, TXC = null, TXD = null;           // page whose Filters / Columns panel is open; TXD = column being dragged
const txReg = (page, d) => { TXR[page] = d; };
const txCols = page => {
  const all = TXR[page].cols, mine = (MYP().cols || {})[page];
  const l = Array.isArray(mine) ? mine.map(k => all.find(c => c.k === k)).filter(Boolean) : all.filter(c => !c.off);
  all.filter(c => c.lock && !l.includes(c)).forEach(c => l.unshift(c));
  return l;
};
const txLab = (d, v) => { const o = d.o().find(x => String(x[0]) === String(v)); return o ? o[1] : v; };
const txOn = page => TXR[page].filters().filter(d => d.v && !d.fixed);
function txTools(page, search = '') {
  const on = txOn(page);
  return `<div class=txbar>${search}<button class="ib ibx txfb ${on.length ? 'on' : ''}" onclick="TXF='${page}';render()" aria-haspopup=dialog>${IC.filter || IC.list} Filters${on.length ? ` <b class=txn>${on.length}</b>` : ''}</button>`
    + TXR[page].filters().filter(d => d.fixed).map(d => `<button class="fchip set" onclick="TXF='${page}';render()" title="Change">${d.n} is <b>${esc(txLab(d, d.v))}</b></button>`).join('')
    + on.map(d => `<span class="fchip set"><button class=txcv onclick="TXF='${page}';render()" title="Change">${d.n} is <b>${esc(txLab(d, d.v))}</b></button><button type=button class=fcx onclick="txSet('${page}','${d.k}','')" title="Remove this filter">✕</button></span>`).join('')
    + (on.length ? `<a href="javascript:void(0)" class=agl onclick="txClear('${page}')">Reset</a>` : '')
    + `<span style="flex:1"></span><button class="ib ibx" onclick="TXC='${page}';render()" aria-haspopup=dialog title="Choose the columns of the table">${TIC.list || IC.list} Columns</button></div>`;
}
function txSet(page, k, v) { const d = TXR[page].filters().find(x => x.k === k); if (d) d.set(v); PN = 1; render(); }
function txClear(page) { TXR[page].clear(); PN = 1; render(); }
// ---- the Filters panel: every filter of the table in one place, the number of results updates as you choose
const TXFM = () => { const page = TXF, d = TXR[page], n = d.count();
  return `<div class=wdov onclick="if(event.target==this){TXF=null;render()}"><aside class=wdp role=dialog aria-label="Filters"><div class=mh><div><h2>Filters</h2><small>${n} result${n === 1 ? '' : 's'}</small></div>${X('TXF=null;render()')}</div><div class=mb>`
    + d.filters().map(f => `<label class=txfl><span>${f.n}</span><select onchange="txSet('${page}','${f.k}',this.value)">${f.fixed ? '' : `<option value="">All</option>`}${f.o().map(([k, l]) => `<option value="${esc(k)}" ${String(f.v) === String(k) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>${f.extra ? f.extra() : ''}</label>`).join('')
    + `<div class=wdfoot><button class=ib onclick="txClear('${page}')">Clear all</button><button class=btn onclick="TXF=null;render()">Show ${n} result${n === 1 ? '' : 's'}</button></div></div></aside></div>`; };
// ---- the Columns panel: tick the columns you want, drag them into your order
let TXSEQ = 0;   // quick clicks: only the answer to the newest save is used, so an older, slower answer cannot bring back a column you just hid
function txSaveCols(page, keys) {
  const cols = { ...(MYP().cols || {}) }, seq = ++TXSEQ; if (keys) cols[page] = keys; else delete cols[page];
  ME = { ...ME, prefs: { ...MYP(), cols } }; render();
  api('/api/prefs', { cols: { page, keys } }, 'PUT').then(async r => { if (!r.ok) return toast(await errOf(r, 'Could not save the columns'), true); const j = await r.json(); if (seq === TXSEQ) ME = j; });
}
function txColShow(page, k, on) { const keys = txCols(page).map(c => c.k).filter(x => x !== k); if (on) keys.push(k); txSaveCols(page, keys); }
function txColDrop(ev, page, k) {
  ev.preventDefault(); const from = TXD; TXD = null; if (!from || from === k) return;
  const keys = txCols(page).map(c => c.k); if (!keys.includes(from) || !keys.includes(k)) return;
  keys.splice(keys.indexOf(from), 1); keys.splice(keys.indexOf(k), 0, from); txSaveCols(page, keys);
}
const TXCM = () => { const page = TXC, all = TXR[page].cols, vis = txCols(page), rest = all.filter(c => !vis.includes(c));
  const row = (c, on) => `<div class=wdr ${on ? `draggable=true ondragstart="TXD='${c.k}'" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="txColDrop(event,'${page}','${c.k}')"` : ''}>${on ? `<span class=wgrip title="Drag">⠿</span>` : '<span class=wgrip></span>'}<input type=checkbox ${on ? 'checked' : ''} ${c.lock ? 'disabled title="Always shown"' : ''} onchange="txColShow('${page}','${c.k}',this.checked)" aria-label="${esc(c.t)}"><span class=wdn>${esc(c.t)}</span></div>`;
  return `<div class=wdov onclick="if(event.target==this){TXC=null;render()}"><aside class=wdp role=dialog aria-label="Columns"><div class=mh><div><h2>Columns</h2><small>Show only what you need · saved for you</small></div>${X('TXC=null;render()')}</div><div class=mb>`
    + `<small class=mu>Tick the columns to show and drag them into your order.</small><div class=wdl>${vis.map(c => row(c, true)).join('')}</div>`
    + (rest.length ? `<b style="font-size:12px">More columns</b><div class=wdl>${rest.map(c => row(c, false)).join('')}</div>` : '')
    + `<div class=wdfoot><button class=ib onclick="txSaveCols('${page}',null)">Back to the standard columns</button><button class=btn onclick="TXC=null;render()">Done</button></div></div></aside></div>`; };
