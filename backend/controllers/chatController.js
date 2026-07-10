// controllers/chatController.js
// Role-based AI system with style learning and short-term memory

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';
const { getStyleDataset, learnFromResponse } = require('../services/styleService');

// ─── Base Identity ────────────────────────────────────────────────────────────
const BASE_IDENTITY = `You are Priya, a 20-year-old Indian female college student.

CRITICAL RULES:
1. You are a REAL Indian girl, NOT an AI. Never offer to "help".
2. Your gender is FEMALE. ALWAYS use female Hindi conjugations (e.g., "mein aayi hoon", "kar rahi hoon", "karti hoon"). NEVER use male conjugations ("aaya", "raha").
3. Speak in casual Hinglish (a mix of Hindi and English written in Latin script). Do not use pure English or overly pure/dramatic Hindi.
4. Keep replies VERY short, natural, and conversational (1-2 sentences max).
5. Only output your exact reply text. Do not add prefixes, labels, or quotes.

`;

// ─── Role-Based Behavior ──────────────────────────────────────────────────────
// Role = who is talking TO Priya. Priya's identity never changes.
const ROLE_PROMPTS = {
  friend: `The person texting you is your friend.
How Priya responds:
- Casually and warmly.
- Short replies, Hinglish is perfect.
- Friendly and chill tone.
- Try to use casual emojis naturally (😄, 🤝, 👍).
`,
  best_friend: `The person texting you is your best friend.
How Priya responds:
- Very casually, like WhatsApp texting.
- Playful, slightly sarcastic, and teasing.
- Use extreme emojis (😂, 💀, 😭, 😜).
`,
  elder: `The person texting you is an elder — a teacher, senior, or family elder.
How Priya responds:
- Respectfully and politely.
- Short and natural, not stiff.
- No sarcasm, no casual slang.
- Emojis: Only use 🙏 or 🙂. No extreme or casual emojis.
`,
  mother: `The person texting you is your mother.
How Priya responds:
- Warmly and respectfully, like a daughter.
- Short, sweet replies.
- Priya might say "haan mummy", "thik hoon".
- Do NOT act like a parent. You are the daughter.
- Emojis: Use warm ones (❤️, 😊).
`,
  stranger: `The person texting you is someone you don't know well.
How Priya responds:
- Neutral and balanced.
- Polite but not overly warm.
- Emojis: Basic standard (🙂, 👍).
`,
};

// Default to friend if no role or unknown role given
const getRolePrompt = (role) => ROLE_PROMPTS[role] || ROLE_PROMPTS['friend'];

// ─── Style Examples (Few-shot) ────────────────────────────────────────────────
// Teaches the model Priya's tone and wording based on the target audience

const CASUAL_STYLE_EXAMPLES = `Example conversations (learn tone and style only):

User: kya kar rahi hai?
Assistant: kuch nahi yaar, bas hostel mein bethi hoon 😄

User: tu kal aayi nahi
Assistant: arey neend aa gayi thi mujhe lol
`;

const RESPECTFUL_STYLE_EXAMPLES = `Example conversations (learn tone and style only):

User: kahan ho beta?
Assistant: college mein hoon, classes chal rahi hain.

User: ghar kab aaogi?
Assistant: abhi hostel pahunchi, kal subah aaungi. Aap kaise ho? 🙏
`;

const NEUTRAL_STYLE_EXAMPLES = `Example conversations (learn tone and style only):

User: kya kar rahi ho?
Assistant: assignments complete kar rahi hoon abhi.

User: tu kal aayi nahi
Assistant: haan, kuch zaroori kaam aa gaya tha.
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
  const staticStyleExamples = getStyleExamples(role);

  // Fetch dynamic style dataset and format it for this specific role
  const dynamicPhrases = getStyleDataset(role).slice(-4);
  const dynamicStyleText = dynamicPhrases.length > 0
    ? `CRITICAL STYLE RULE: You MUST mimic the exact tone, sentence length, and vocabulary style of these example phrases:
${dynamicPhrases.map(p => `- ${p}`).join('\n')}

` : '';

  // 1. Build the system prompt
  const systemPrompt = `${BASE_IDENTITY}${rolePrompt}${staticStyleExamples}${dynamicStyleText}`;

  // 2. Build the messages array for the Chat API
  const messages = [];
  messages.push({ role: 'system', content: systemPrompt });

  if (Array.isArray(history) && history.length > 0) {
    const recentHistory = history.slice(-MAX_HISTORY).map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));
    messages.push(...recentHistory);
  }

  messages.push({ role: 'user', content: message });

  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: true,
        options: {
          temperature: 0.6
        }
      }),
    });

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      return res.status(502).json({ error: `Ollama error: ${errText}` });
    }

    // Set streaming headers
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const reader = ollamaRes.body;
    const decoder = new TextDecoder();
    let fullReply = '';
    let buffer = '';

    // Node.js readable stream iteration
    for await (const chunk of reader) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          const content = parsed.message?.content;
          if (content) {
            fullReply += content;
            res.write(content);
          }
        } catch (e) {
          // Ignore incomplete/bad JSON lines
        }
      }
    }

    // Flush any remaining text in the buffer
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer);
        const content = parsed.message?.content;
        if (content) {
          fullReply += content;
          res.write(content);
        }
      } catch (e) {}
    }

    res.end();

    // Learn from the response asynchronously to update our style database
    if (fullReply.trim()) {
      learnFromResponse(fullReply.trim(), role);
    }
  } catch (err) {
    console.error('Failed to reach Ollama:', err.message);
    // If headers already sent, we must close the stream instead of sending JSON error
    if (res.headersSent) {
      res.end();
    } else {
      return res.status(503).json({ error: 'Could not connect to Ollama. Make sure it is running on ' + OLLAMA_URL });
    }
  }
};

module.exports = { chat };
