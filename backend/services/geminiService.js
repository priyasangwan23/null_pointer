const { GoogleGenAI } = require('@google/genai');

let aiInstance = null;

const getAIClient = () => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key') {
        throw new Error('GEMINI_API_KEY is not configured or contains placeholder value in .env file.');
    }

    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiInstance;
};

/**
 * Generate chunked text stream from Gemini.
 * @param {string} message - Current user message.
 * @param {Array} history - Array of previous messages [{role, content}].
 * @param {string} systemPrompt - Combined system instructions.
 * @returns {AsyncGenerator<string>} Stream of text chunks.
 */
async function* generateChatStream(message, history, systemPrompt) {
    const ai = getAIClient();

    // Convert history from standard format to Gemini schema content format
    // Ollama history: [ { role: 'user' | 'assistant', content: '...' } ]
    // Gemini expects: [ { role: 'user' | 'model', parts: [ { text: '...' } ] } ]
    const contents = [];

    if (Array.isArray(history)) {
        history.forEach((msg) => {
            if (msg.role === 'system') return;
            contents.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            });
        });
    }

    // Append current user message
    contents.push({
        role: 'user',
        parts: [{ text: message }]
    });

    try {
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: contents,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.6,
                // Disable extended thinking for chat — it adds seconds of delay before the first token.
                // For short Hinglish replies, we don't need deep reasoning.
                thinkingConfig: { thinkingBudget: 0 },
            }
        });

        for await (const chunk of responseStream) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error('Gemini API call failed:', error);
        throw new Error(`Gemini API Error: ${error.message || error}`);
    }
}

module.exports = {
    generateChatStream
};
