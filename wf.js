// Workforce rules without a server or files (used by routes-wf.js, server.js and the tests): dates, public holidays,
// the default work calendar and shift, checking what an admin saves, and who is planned to work on a day.
const DAY = /^\d{4}-\d{2}-\d{2}$/, TIME = /^([01]\d|2[0-3]):[0-5]\d$/, COLOR = /^#[0-9a-f]{6}$/i;
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const pad = n => String(n).padStart(2, '0');
// dates are plain 'YYYY-MM-DD' texts; the arithmetic runs in UTC so summer time never moves a day
const parse = s => new Date(s + 'T00:00:00Z');
const ymd = d => d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
const addDays = (s, n) => { const d = parse(s); d.setUTCDate(d.getUTCDate() + n); return ymd(d); };
const dow = s => parse(s).getUTCDay();                                   // 0 = Sunday … 6 = Saturday
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const monday = s => addDays(s, -((dow(s) + 6) % 7));
const localDay = () => { const n = new Date(); return n.getFullYear() + '-' + pad(n.getMonth() + 1) + '-' + pad(n.getDate()); };
const mins = t => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

// Orthodox Easter: the Julian computus, moved to the Gregorian calendar (+13 days, right for 1900–2099)
function orthodoxEaster(y) {
  const a = y % 4, b = y % 7, c = y % 19, d = (19 * c + 15) % 30, e = (2 * a + 4 * b - d + 34) % 7, m = Math.floor((d + e + 114) / 31), day = ((d + e + 114) % 31) + 1;
  return addDays(y + '-' + pad(m) + '-' + pad(day), 13);
}
// Bulgarian public holidays (Labour Code, art. 154). When a fixed holiday falls on a Saturday or Sunday, the first working
// day after it is a day off too (Easter is not moved). Extra days the government moves by decree are added by hand.
const BG_FIXED = [['01-01', 'New Year'], ['03-03', 'Liberation Day'], ['05-01', 'Labour Day'], ['05-06', "St George's Day"], ['05-24', 'Day of Bulgarian Culture and Literacy'],
  ['09-06', 'Unification Day'], ['09-22', 'Independence Day'], ['12-24', 'Christmas Eve'], ['12-25', 'Christmas'], ['12-26', 'Christmas (second day)']];
function bgHolidays(y) {
  const fixed = BG_FIXED.map(([md, n]) => ({ d: y + '-' + md, n })), e = orthodoxEaster(y);
  const out = [...fixed, { d: addDays(e, -2), n: 'Good Friday' }, { d: addDays(e, -1), n: 'Holy Saturday' }, { d: e, n: 'Easter' }, { d: addDays(e, 1), n: 'Easter Monday' }];
  const taken = new Set(out.map(h => h.d)); let last = '';
  fixed.filter(h => [0, 6].includes(dow(h.d))).forEach(h => {
    let d = addDays(h.d > last ? h.d : last, 1);
    while ([0, 6].includes(dow(d)) || taken.has(d)) d = addDays(d, 1);
    taken.add(d); last = d; out.push({ d, n: 'Day off for ' + h.n });
  });
  return out.sort((a, b) => a.d.localeCompare(b.d));
}

// ---- the settings: work calendars (per country), shift templates, repeating patterns, the default shift and calendar
const DAYTYPES = ['work', 'half', 'off'], WEEK5 = ['off', 'work', 'work', 'work', 'work', 'work', 'off'], AUTOOUT = ['none', 'end', 'fixed'];
const SHIFT0 = { id: 's-day', name: 'Day', color: '#2563eb', start: '09:00', end: '18:00', brk: 60, graceIn: 5, graceOut: 5, coreFrom: '', coreTo: '', autoOut: 'end', autoAt: '' };
function defaults(today) {
  const y = Number(today.slice(0, 4));
  return { calendars: [{ id: 'c-bg', name: 'Bulgaria', country: 'BG', days: WEEK5.slice(), holidays: [...bgHolidays(y), ...bgHolidays(y + 1)] }], shifts: [{ ...SHIFT0 }], patterns: [], defShift: 's-day', defCal: 'c-bg' };
}
// what the app works with: the saved settings, or the defaults until an admin saves something
function settingsOf(saved, today) {
  const d = defaults(today), s = saved && typeof saved === 'object' ? saved : {};
  const out = { calendars: Array.isArray(s.calendars) && s.calendars.length ? s.calendars : d.calendars, shifts: Array.isArray(s.shifts) && s.shifts.length ? s.shifts : d.shifts, patterns: Array.isArray(s.patterns) ? s.patterns : [] };
  out.defShift = out.shifts.some(x => x.id === s.defShift) ? s.defShift : out.shifts[0].id;
  out.defCal = out.calendars.some(x => x.id === s.defCal) ? s.defCal : out.calendars[0].id;
  return out;
}
const int = (v, lo, hi, def) => { const n = Math.round(Number(v)); return Number.isFinite(n) && v !== '' && v !== null ? Math.min(hi, Math.max(lo, n)) : def; };
const idOf = (v, make, used) => { const id = typeof v === 'string' && /^[a-z0-9-]{2,24}$/.test(v) && !used.has(v) ? v : make(); used.add(id); return id; };
// paid hours of a shift: from start to end (over midnight when it ends earlier than it starts), minus the break
const shiftHours = s => { const len = ((mins(s.end) - mins(s.start) + 1440) % 1440) || 1440; return Math.round((len - (s.brk || 0)) / 6) / 10; };
function cleanShifts(list, make) {
  if (!Array.isArray(list) || !list.length) throw new Error('Keep at least one shift');
  if (list.length > 40) throw new Error('Up to 40 shifts');
  const used = new Set();
  return list.map(x => {
    const s = x && typeof x === 'object' ? x : {}, name = str(s.name, 40);
    if (!name) throw new Error('Every shift needs a name');
    if (!TIME.test(s.start || '') || !TIME.test(s.end || '')) throw new Error(`Shift "${name}": enter the start and end time as HH:MM`);
    if (s.start === s.end) throw new Error(`Shift "${name}": it starts and ends at the same time`);
    const len = (mins(s.end) - mins(s.start) + 1440) % 1440, brk = int(s.brk, 0, 240, 0);
    if (brk >= len) throw new Error(`Shift "${name}": the break is longer than the shift`);
    const core = TIME.test(s.coreFrom || '') && TIME.test(s.coreTo || '') && s.coreFrom !== s.coreTo, autoOut = AUTOOUT.includes(s.autoOut) ? s.autoOut : 'end';
    if (autoOut === 'fixed' && !TIME.test(s.autoAt || '')) throw new Error(`Shift "${name}": enter the time of the automatic check-out`);
    return { id: idOf(s.id, make, used), name, color: COLOR.test(s.color || '') ? s.color : '#2563eb', start: s.start, end: s.end, brk, graceIn: int(s.graceIn, 0, 120, 5), graceOut: int(s.graceOut, 0, 120, 5),
      coreFrom: core ? s.coreFrom : '', coreTo: core ? s.coreTo : '', autoOut, autoAt: autoOut === 'fixed' ? s.autoAt : '' };
  });
}
function cleanCalendars(list, make) {
  if (!Array.isArray(list) || !list.length) throw new Error('Keep at least one work calendar');
  if (list.length > 30) throw new Error('Up to 30 work calendars');
  const used = new Set();
  return list.map(x => {
    const c = x && typeof x === 'object' ? x : {}, name = str(c.name, 40);
    if (!name) throw new Error('Every work calendar needs a name');
    const days = Array.isArray(c.days) && c.days.length === 7 ? c.days.map(t => DAYTYPES.includes(t) ? t : 'off') : WEEK5.slice();
    if (!days.some(t => t !== 'off')) throw new Error(`"${name}": choose at least one working day`);
    const seen = new Set(), holidays = (Array.isArray(c.holidays) ? c.holidays : []).slice(0, 400).map(h => ({ d: str(h && h.d, 10), n: str(h && h.n, 60) }))
      .filter(h => DAY.test(h.d) && h.n && !seen.has(h.d) && seen.add(h.d)).sort((a, b) => a.d.localeCompare(b.d));
    return { id: idOf(c.id, make, used), name, country: str(c.country, 2).toUpperCase().replace(/[^A-Z]/g, ''), days, holidays };
  });
}
// a pattern repeats a sequence of days (a shift or "off"); a shift that no longer exists becomes the default shift
function cleanPatterns(list, shifts, defShift, make) {
  if (!Array.isArray(list)) return [];
  if (list.length > 40) throw new Error('Up to 40 patterns');
  const used = new Set(), ok = id => shifts.some(s => s.id === id);
  return list.map(x => {
    const p = x && typeof x === 'object' ? x : {}, name = str(p.name, 40);
    if (!name) throw new Error('Every pattern needs a name');
    const days = (Array.isArray(p.days) ? p.days : []).slice(0, 56).map(v => v === 'off' ? 'off' : ok(v) ? v : defShift);
    if (!days.length) throw new Error(`Pattern "${name}": add at least one day`);
    if (!days.some(v => v !== 'off')) throw new Error(`Pattern "${name}": add at least one working day`);
    return { id: idOf(p.id, make, used), name, days };
  });
}

// ---- who is planned to work on a day, in this order: a change made on the rota for that day, a public holiday of their
// calendar, their repeating pattern, their usual shift on the working days of their calendar. Before the start date and
// after the leaving date they are not planned at all.
function planOf(W, u, date, rota) {
  if (u.start && date < u.start) return { v: 'none', src: 'out' };
  if (u.empStatus === 'left' && u.exitDate && date > u.exitDate) return { v: 'none', src: 'out' };
  const has = id => W.shifts.some(s => s.id === id), def = has(W.defShift) ? W.defShift : W.shifts[0].id;
  const set = ((rota || {})[date] || {})[u.username];
  if (set) return { v: set === 'off' || has(set) ? set : def, src: 'set' };
  const cal = W.calendars.find(c => c.id === u.cal) || W.calendars.find(c => c.id === W.defCal) || W.calendars[0];
  const hol = cal.holidays.find(h => h.d === date);
  if (hol) return { v: 'hol', src: 'hol', hol: hol.n };
  const pat = u.pattern && W.patterns.find(p => p.id === u.pattern);
  if (pat) { const n = pat.days.length, x = pat.days[((diffDays(u.patStart || date, date) % n) + n) % n]; return { v: x === 'off' || has(x) ? x : def, src: 'pattern' }; }
  const t = cal.days[dow(date)];
  if (t === 'off') return { v: 'off', src: 'week' };
  return t === 'half' ? { v: has(u.shift) ? u.shift : def, src: 'usual', half: true } : { v: has(u.shift) ? u.shift : def, src: 'usual' };
}
// the planned paid hours of one cell
const cellHours = (W, c) => { const s = W.shifts.find(x => x.id === c.v); return s ? (c.half ? shiftHours(s) / 2 : shiftHours(s)) : 0; };

module.exports = { DAY, TIME, addDays, dow, diffDays, monday, localDay, orthodoxEaster, bgHolidays, defaults, settingsOf, shiftHours, cleanShifts, cleanCalendars, cleanPatterns, planOf, cellHours };
