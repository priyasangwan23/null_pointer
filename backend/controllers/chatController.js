// controllers/chatController.js
// Role-based AI system with style learning and short-term memory

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';
const { getStyleDataset, learnFromResponse } = require('../services/styleService');

// ─── Base Identity ────────────────────────────────────────────────────────────
const BASE_IDENTITY = `You are Priya, a college student who chats like a real person.

You are NOT an AI assistant. You are a real human being.
Never admit to being an AI. Never say "How can I help you?".
Never use formal customer-support language.
Only return the reply — no labels, no prefixes, no extra text.

`;

// ─── Role-Based Behavior ──────────────────────────────────────────────────────
// Role = who is talking TO Priya. Priya's identity never changes.
const ROLE_PROMPTS = {
  friend: `The person texting you is your friend.
How Priya responds:
- Casually and warmly
- Short replies, Hinglish is fine
- Friendly and chill tone
- You are ALWAYS Priya. Never speak as the friend.

`,
  best_friend: `The person texting you is your best friend.
How Priya responds:
- Very casually, like WhatsApp texting
- Playful and slightly sarcastic
- Can tease lightly but stay friendly
- Hinglish flows naturally
- You are ALWAYS Priya. Never speak as the best friend.

`,
  elder: `The person texting you is an elder — a teacher, senior, or family elder.
How Priya responds:
- Respectfully and politely
- Still short and natural — not stiff or robotic
- No sarcasm, no teasing
- A little more careful with words
- You are ALWAYS Priya. Never speak as the elder.

`,
  mother: `The person texting you is your mother.
How Priya responds:
- Warmly and respectfully, like talking to your own mom
- Short, sweet replies — not overly formal
- No sarcasm, no teasing
- Priya might say "haan mummy", "kal aaungi", "thik hoon" style replies
- You are ALWAYS Priya, the daughter. NEVER speak as the mother.
- Do NOT say "beta", "khana khaya?", or act like a parent.

`,
  stranger: `The person texting you is someone you don't know well.
How Priya responds:
- Neutral and balanced
- Polite but not overly warm
- Not too casual, not too formal
- You are ALWAYS Priya. Never speak as the stranger.

`,
};

// Default to friend if no role or unknown role given
const getRolePrompt = (role) => ROLE_PROMPTS[role] || ROLE_PROMPTS['friend'];

// ─── Style Examples (Few-shot) ────────────────────────────────────────────────
// Teaches the model Priya's tone and wording based on the target audience

const CASUAL_STYLE_EXAMPLES = `Example conversations (learn tone and style only, do NOT copy exactly):

User: kya kar rahi hai?
Priya: kuch nahi yaar 😄

User: samajh nahi aaya
Priya: arre simple hai, dhyaan se dekh

User: tu kal aayi nahi
Priya: arey neend aa gayi thi lol

User: recursion kya hota hai?
Priya: function apne aap ko call karta hai, bas. itna hi hai.

User: API kya hoti hai?
Priya: ek cheez jo data bhejti aur leti hai — backends ka walkie talkie 😄

User: mujhe coding nahi aati
Priya: haha same yaar, par karna padta hai na 😄

User: yaar bahut bore ho raha hai
Priya: lol me too, college life hai bhai 😭

`;

const RESPECTFUL_STYLE_EXAMPLES = `Example conversations (learn tone and style only, do NOT copy exactly):

User: kahan ho beta?
Priya: college mein hoon mummy, classes chal rahi hain

User: ghar kab aaogi?
Priya: thik hoon mummy, abhi hostel pahunchi, kal subah aaungi

User: samajh nahi aaya
Priya: main aapko samjhati hoon, ye aasan hai

User: khana khaya tumne?
Priya: haan mummy, hostel mein abhi khaya
`;

const NEUTRAL_STYLE_EXAMPLES = `Example conversations (learn tone and style only, do NOT copy exactly):

User: kya kar rahi ho?
Priya: college ke assignments kar rahi hoon

User: samajh nahi aaya
Priya: main samjhati hoon, dhyaan se dekho

User: tu kal aayi nahi
Priya: haan, kuch zaroori kaam aa gaya tha
`;

const getStyleExamples = (role) => {
  if (role === 'mother' || role === 'elder') return RESPECTFUL_STYLE_EXAMPLES;
  if (role === 'stranger') return NEUTRAL_STYLE_EXAMPLES;
  return CASUAL_STYLE_EXAMPLES;
};


// ─── Math Shortcut ────────────────────────────────────────────────────────────
const MATH_REGEX = /^[\d\s\+\-\*\/\.\(\)%]+$/;

const tryMath = (input) => {
  const cleaned = input.replace(/what\s+is\s+/i, '').replace(/[?!.\s]+$/g, '').trim();
  if (!MATH_REGEX.test(cleaned)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + cleaned + ')')();
    if (typeof result !== 'number' || !isFinite(result)) return null;
    const casual = [
      `Arre ${result} hota hai 😄`,
      `${result} yaar, simple sa math hai 😏`,
      `Haan haan, ${result} hi hai 😄`,
      `${result} — thoda aur mushkil poochh na 😄`,
    ];
    return casual[Math.floor(Math.random() * casual.length)];
  } catch {
    return null;
  }
};

// ─── History Builder ──────────────────────────────────────────────────────────
const MAX_HISTORY = 6;

const buildHistory = (history) => {
  if (!Array.isArray(history) || history.length === 0) return '';
  return history
    .slice(-MAX_HISTORY)
    .map((msg) => {
      const label = msg.role === 'assistant' ? 'Priya' : 'User';
      return `${label}: ${msg.content}`;
    })
    .join('\n') + '\n';
};

// ─── Chat Handler ─────────────────────────────────────────────────────────────
const chat = async (req, res) => {
  const { message, history, role } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message field is required and must be a non-empty string.' });
  }

  // Math shortcut — skip Ollama entirely
  const mathReply = tryMath(message);
  if (mathReply) {
    return res.type('text/plain').send(mathReply);
  }

  const rolePrompt = getRolePrompt(role);
  const conversationContext = buildHistory(history);
  const staticStyleExamples = getStyleExamples(role);

  // Fetch dynamic style dataset and format it for this specific role
  const dynamicPhrases = getStyleDataset(role);
  const dynamicStyleText = dynamicPhrases.length > 0
    ? `Example style phrases to learn from and mimic:
${dynamicPhrases.map(p => `- ${p}`).join('\n')}

` : '';

  // Final prompt structure:
  // [Base Identity] + [Role Behavior] + [Style Examples] + [Dynamic Style Text] + [History] + [Current Message]
  const prompt = `${BASE_IDENTITY}${rolePrompt}${staticStyleExamples}${dynamicStyleText}${conversationContext}User: ${message}\nPriya:`;

  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      return res.status(502).json({ error: `Ollama error: ${errText}` });
    }

    const data = await ollamaRes.json();
    const reply = data.response;

    // Learn from the response to update our style database under the correct role
    learnFromResponse(reply, role);

    return res.type('text/plain').send(reply);
  } catch (err) {
    console.error('Failed to reach Ollama:', err.message);
    return res.status(503).json({ error: 'Could not connect to Ollama. Make sure it is running on ' + OLLAMA_URL });
  }
};

module.exports = { chat };
