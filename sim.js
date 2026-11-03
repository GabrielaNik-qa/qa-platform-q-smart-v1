// The Call Simulator (3 November), like the one of converst-qa.web.app: scenarios grouped by segment and level, a written customer
// (or the AI customer when an admin switched it on), indicators that are ticked while the agent speaks, and at the end the agent
// chooses how the call ended. Everything here is plain rules, no AI: the same call always gets the same score.
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);

// the languages the AI customer can speak (the written customer speaks the language its lines are written in)
const LANGS = { en: 'English', fr: 'French', de: 'German', es: 'Spanish', it: 'Italian', pt: 'Portuguese', el: 'Greek', bg: 'Bulgarian' };
const OUT_CS = ['Solved', 'Escalated to a colleague', 'The customer will call back', 'Not solved'];
const OUT_RE = ['Winner: the player accepted the offer', 'Callback: call again later', 'Not interested', 'Do not call again'];
// the checklists the built-in scenarios share: an indicator is met when the agent says one of its words
const I = {
  greet: ['Greets and says their name', ['hello', 'good morning', 'good afternoon', 'my name is', 'this is', "i'm calling", 'i am calling']],
  rec: ['Says the call is recorded', ['recorded', 'recording']],
  empathy: ['Shows understanding', ['understand', 'sorry', 'i see', 'i hear you', 'apologi', 'frustrat']],
  ask: ['Asks a question', ['?', 'could you tell', 'can you tell', 'may i ask']],
  offer: ['Explains the offer clearly', ['bonus', 'free spin', 'cashback', 'cash back', '%', 'deposit']],
  terms: ['Gives the conditions (deposit, wager)', ['wager', 'minimum deposit', 'min deposit', 'terms', 'conditions']],
  value: ['Shows the value', ['include', 'value', 'benefit', 'save', 'worth']],
  option: ['Offers an option or a solution', ['option', 'instead', 'offer you', 'i can', 'we can', 'discount', 'pause', 'refund']],
  next: ['Agrees the next step', ['send', 'e-mail', 'email', 'sms', 'text you', 'call you back', 'tomorrow', 'next step']],
  close: ['Closes politely', ['thank you', 'thanks for', 'have a nice', 'have a great', 'goodbye', 'bye']],
  verify: ['Checks the identity', ['date of birth', 'security', 'verify', 'confirm your', 'postcode']],
  steps: ['Gives simple steps', ['first', 'then', 'step', 'tap', 'click', 'open the']]
};
const ind = (...k) => k.map(x => ({ t: I[x][0], kw: I[x][1] }));
const CS = (level, inds, lines, correct) => ({ seg: 'Customer service', level, inds: ind(...inds), lines, outcomes: OUT_CS, correct });
const RE = (id, seg, name, who, level, brief, open, lines) => ({ id, seg, name, who, persona: who.toLowerCase(), level, brief, open, lines,
  inds: ind('greet', 'rec', 'ask', 'offer', 'terms', 'next', 'close'), outcomes: OUT_RE, correct: OUT_RE[0] });
// what the built-in scenarios of routes-ai.js get on top of their name, customer and first sentence
const EXTRA = {
  price: CS(2, ['greet', 'empathy', 'ask', 'value', 'option', 'close'],
    ['I saw the same thing cheaper somewhere else, to be honest.', 'Hm. And what would that cost me per month?', 'OK, that sounds fair. Send me the details and I will think about it.'], 'The customer will call back'),
  late: CS(3, ['greet', 'empathy', 'ask', 'option', 'next', 'close'],
    ['I wrote to you twice! I need it for a birthday on Saturday.', 'So can you get it to me before Saturday or not?', 'Fine. Please make sure it really arrives this time.'], 'Solved'),
  cancel: CS(3, ['greet', 'empathy', 'ask', 'option', 'next', 'close'],
    ['I hardly use it any more, it is a waste of money.', 'A cheaper plan? What would that look like?', 'OK, let us try that for a month then.'], 'Solved'),
  tech: CS(2, ['greet', 'empathy', 'ask', 'steps', 'next', 'close'],
    ["I don't know which version I have, I'm not good with phones.", 'OK… I tapped it. Now what?', 'Oh, it works now! Thank you.'], 'Solved'),
  ident: CS(1, ['greet', 'empathy', 'verify', 'next', 'close'],
    ['Why do you need all that? I just want the address changed.', 'Fine. My date of birth is the 3rd of May 1985.', 'Good. Thanks, that was quick in the end.'], 'Solved')
};
// the reactivation calls of the outbound teams (like the player segments of Converst): Regular players by days away, and VIP
const REACT = [
  RE('rnd', 'Regular', 'RND: never deposited', 'Registered player who never deposited', 1, 'You opened an account a month ago but never deposited because you were not sure the site is safe. You deposit if the agent explains the welcome offer and its conditions clearly.', 'Hello? Who is this?',
    ['Oh, right, I remember signing up. I never put money in, I was not sure about it.', 'And what do I have to do to get that? Is there a catch?', 'OK, send it to me by e-mail and I will have a look tonight.']),
  RE('r8', 'Regular', 'Regular (8-30 days)', 'Recently inactive player', 1, 'You played every week until two weeks ago and simply forgot. You come back easily if the offer is good.', 'Hello?',
    ['Yes, I have been busy lately. What is it about?', 'That sounds nice. Is there a minimum deposit?', 'Fine, send me the offer, I will play this weekend.']),
  RE('r31', 'Regular', 'Regular (31-60 days)', 'Cooling player', 2, 'You stopped a month ago after a bad losing streak. You come back only if the agent asks why you stopped and offers something fair.', 'Yes, hello?',
    ['To be honest I lost quite a bit last time, so I took a break.', 'Free spins… and what are the conditions?', 'OK, maybe. Send it by SMS and I will see.']),
  RE('r61', 'Regular', 'Regular (61-90 days)', 'Player at risk of leaving', 3, 'You moved to another casino two months ago because their bonuses were better. You need a concrete reason to come back.', 'Hello, who am I speaking to?',
    ['I play somewhere else now, they give me better bonuses.', 'Hm, and the wager on that?', 'Alright, send it over, I will compare.']),
  RE('r91', 'Regular', 'Regular (91-120 days)', 'Almost lost player', 4, 'You have not played for three months and are not really interested. Only a strong, clear offer keeps you on the phone.', 'Yeah?',
    ["I'm not really playing any more.", "I don't know… what exactly would I get?", 'Fine, send it, but no promises.']),
  RE('r120', 'Regular', 'Regular (120 days+)', 'Long-inactive player', 5, 'You have not played for half a year and you are annoyed to be called. You stay polite only if the agent is respectful and quick.', 'Who gave you my number?',
    ['I really have not played in ages.', 'Okay, okay. What is the offer then?', 'Just send it to my e-mail, I have to go.']),
  RE('v31', 'VIP', 'VIP (31-60 days)', 'VIP player', 3, 'You are a VIP who stopped playing a month ago because your account manager changed and nobody called you. You expect personal attention.', 'Hello, yes?',
    ['Nobody has called me for weeks. My old manager always did.', 'And what is in it for me as a VIP?', 'Good. Send me the details and call me next week.']),
  RE('v120', 'VIP', 'VIP (120 days+)', 'Former VIP player', 5, 'You were a VIP but stopped four months ago after a slow withdrawal. You are suspicious and want to hear that it will not happen again.', 'Yes?',
    ['My last withdrawal took two weeks. Why would I come back?', 'And the offer, what are the conditions exactly?', 'OK. Send it in writing, I will think about it.'])
];
// a scenario as the simulator uses it: the extra parts are added to a built-in one, or taken from one a trainer wrote
const full = s => ({ seg: 'Customer service', level: 2, inds: [], lines: [], outcomes: OUT_CS, correct: '', ...s, ...(EXTRA[s.id] || {}) });

// what a trainer writes in AI Simulator › Scenarios, cleaned: indicators are "label: word, word", one per line
const extraBody = b => {
  const lines = (Array.isArray(b.lines) ? b.lines : String(b.lines || '').split('\n')).map(x => str(x, 400)).filter(Boolean).slice(0, 12);
  const inds = (Array.isArray(b.inds) ? b.inds : []).slice(0, 12).map(x => ({ t: str(x && x.t, 80), kw: (Array.isArray(x && x.kw) ? x.kw : String((x && x.kw) || '').split(',')).map(k => str(k, 40).toLowerCase()).filter(Boolean).slice(0, 12) })).filter(x => x.t && x.kw.length);
  const outcomes = (Array.isArray(b.outcomes) ? b.outcomes : String(b.outcomes || '').split('\n')).map(x => str(x, 80)).filter(Boolean).slice(0, 8);
  const level = Math.max(1, Math.min(5, Math.round(Number(b.level) || 2)));
  return { seg: str(b.seg, 40) || 'Customer service', level, lines, inds, outcomes, correct: outcomes.includes(str(b.correct, 80)) ? str(b.correct, 80) : '' };
};

// the indicators met by the agent's replies, with the reply that met each one first
function grade(sc, msgs, outcome) {
  const mine = msgs.filter(m => m.r === 'a').map(m => ' ' + m.t.toLowerCase() + ' ');
  const inds = (sc.inds || []).map(x => { const turn = mine.findIndex(t => x.kw.some(k => t.includes(k))); return { t: x.t, ok: turn >= 0, turn: turn + 1 }; });
  const has = (sc.outcomes || []).length && sc.correct, right = has ? outcome === sc.correct : null;
  const met = inds.filter(x => x.ok).length, n = inds.length;
  // the indicators count for 80 points and the right outcome for 20; a scenario without a right outcome is scored on its indicators only
  const score = !n && !has ? 0 : Math.round(has ? (n ? met / n * 80 : 80) + (right ? 20 : 0) : met / n * 100);
  const fb = mine.map((t, i) => { const hit = inds.filter(x => x.turn === i + 1).map(x => x.t); return { turn: i + 1, hit }; });
  return { inds, score, right, fb, good: inds.filter(x => x.ok).map(x => x.t).slice(0, 6), tips: inds.filter(x => !x.ok).map(x => 'Next time: ' + x.t.charAt(0).toLowerCase() + x.t.slice(1)).slice(0, 6) };
}
module.exports = { LANGS, REACT, full, extraBody, grade };
