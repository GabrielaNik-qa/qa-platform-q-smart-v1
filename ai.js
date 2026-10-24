// Optional AI helpers (Anthropic API). Without ANTHROPIC_API_KEY everything still works,
// the import falls back to a simple splitter and quiz generation is simply switched off.
const MODEL = () => process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
const enabled = () => !!process.env.ANTHROPIC_API_KEY;

async function ask(system, content, max = 8000) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL(), max_tokens: max, system, messages: [{ role: 'user', content }] }),
    signal: AbortSignal.timeout(180000)                                           // a request that hangs gives up after 3 minutes instead of waiting forever
  }).catch(e => { throw new Error(e.name === 'TimeoutError' ? 'The AI took too long to answer. Try again or use a shorter text.' : 'Could not reach the AI service'); });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j.error && j.error.message) || 'Anthropic API error ' + r.status);
  return (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
}
const parseJson = t => {
  t = String(t).trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
};
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const cleanArticle = a => ({ title: str(a.title, 150) || 'Untitled', folder: str(a.folder, 200), topics: (Array.isArray(a.topics) ? a.topics : []).map(x => str(x, 40)).filter(Boolean).slice(0, 8), body: str(a.body, 200000) });
const cleanQs = qs => (Array.isArray(qs) ? qs : []).map(q => ({ q: str(q.q, 400), opts: (Array.isArray(q.opts) ? q.opts : []).map(o => str(o, 200)).filter(Boolean).slice(0, 6), a: Number(q.a), why: str(q.why, 400) }))
  .filter(q => q.q && q.opts.length >= 2 && Number.isInteger(q.a) && q.a >= 0 && q.a < q.opts.length).slice(0, 30);

// ---- no AI: split a text into articles at its headings
const STOP = new Set('about after again also because before being between could does doing during each from have having into more most other should that their them then there these they this those through very were what when where which while will with would your'.split(' '));
function splitText(text, filename) {
  const base = String(filename || 'Imported document').replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' ').trim() || 'Imported document';
  text = String(text || '').replace(/\r/g, '').trim();
  const parts = []; let cur = null;
  for (const line of text.split('\n')) {
    const m = line.match(/^(#{1,2})\s+(.*)/);
    if (m) { if (cur) parts.push(cur); cur = { title: m[2].trim(), body: '' }; } else { if (!cur) cur = { title: base, body: '' }; cur.body += line + '\n'; }
  }
  if (cur) parts.push(cur);
  return parts.filter(p => p.body.trim() || p.title).map(p => {
    const words = (p.title + ' ' + p.body).toLowerCase().match(/[a-zà-ÿ]{5,}/g) || [], freq = {};
    words.forEach(w => { if (!STOP.has(w)) freq[w] = (freq[w] || 0) + 1; });
    const topics = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w[0].toUpperCase() + w.slice(1));
    return cleanArticle({ title: p.title, folder: parts.length > 1 ? base : '', topics, body: p.body.trim() });
  });
}

async function draftArticles({ text, pdf, filename, folders }) {
  if (!enabled()) {
    if (!text) throw new Error('Without the AI connection only text, Markdown, HTML and Word files can be imported.');
    return { ai: false, articles: splitText(text, filename) };
  }
  const system = 'You are a knowledge base editor for a call-center quality team. Turn the source material into clear, well structured knowledge base articles. '
    + 'Stay faithful to the source: never invent facts. Split long material into several focused articles. Write in the same language as the source. '
    + 'Use Markdown for the body (## headings, - lists, **bold**). For each article choose 1-5 short topics and suggest a folder path such as "Processes/Objection handling" '
    + (folders && folders.length ? '(prefer one of these existing folders when it fits: ' + folders.slice(0, 60).join('; ') + ')' : '') + '. '
    + 'Reply with JSON only: {"articles":[{"title":"","folder":"","topics":[""],"body":""}]}';
  const content = [];
  if (pdf) content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdf } });
  content.push({ type: 'text', text: (filename ? 'File name: ' + filename + '\n\n' : '') + (text ? String(text).slice(0, 120000) : 'Analyse the attached document.') });
  const j = parseJson(await ask(system, content));
  const articles = (j.articles || []).map(cleanArticle).filter(a => a.body);
  if (!articles.length) throw new Error('The AI did not return any article. Try again or paste a shorter text.');
  return { ai: true, articles };
}

async function draftQuiz({ text, count }) {
  if (!enabled()) throw new Error('Connect the AI (ANTHROPIC_API_KEY) to generate questions automatically, or add them by hand.');
  const n = Math.min(20, Math.max(3, Number(count) || 5));
  const system = `You write multiple-choice quiz questions for call-center agents. Use ONLY the material you are given. Write exactly ${n} questions, each with 4 options, one correct answer and a one-sentence explanation. `
    + 'Write in the same language as the material. Reply with JSON only: {"questions":[{"q":"","opts":["","","",""],"a":0,"why":""}]} where "a" is the index (0-3) of the correct option.';
  const j = parseJson(await ask(system, [{ type: 'text', text: String(text).slice(0, 100000) }], 6000));
  const questions = cleanQs(j.questions);
  if (!questions.length) throw new Error('The AI did not return usable questions. Try again.');
  return { questions };
}

// rate one conversation for every Auto QA category (0-100 each)
async function scoreConversation(text, cats) {
  if (!enabled()) throw new Error('Connect the AI (ANTHROPIC_API_KEY) to rate conversations with AI.');
  const system = 'You are a call-center quality analyst. Rate ONLY what the agent said in the conversation for each category from 0 (very poor) to 100 (excellent). '
    + 'Be strict and consistent. Reply with JSON only: {"scores":{"<categoryId>":{"score":0,"reason":"one short sentence"}}}';
  const list = cats.map(c => `- ${c.id}: ${c.name}${c.desc ? ' (' + c.desc + ')' : ''}`).join('\n');
  const j = parseJson(await ask(system, [{ type: 'text', text: 'Categories:\n' + list + '\n\nConversation:\n' + String(text).slice(0, 30000) }], 2000));
  const scores = {}; let w = 0, tot = 0;
  cats.forEach(c => { const x = (j.scores || {})[c.id]; if (x && Number.isFinite(Number(x.score))) { const s = Math.max(0, Math.min(100, Math.round(Number(x.score)))), wt = Number(c.weight) || 1; scores[c.id] = { s, hits: [], bad: [], why: str(x.reason, 200) }; w += wt; tot += s * wt; } });
  if (!w) throw new Error('The AI did not return scores.');
  return { scores, total: Math.round(tot / w), mode: 'ai', at: new Date().toISOString() };
}
module.exports = { enabled, MODEL, draftArticles, draftQuiz, splitText, cleanQs, scoreConversation };
