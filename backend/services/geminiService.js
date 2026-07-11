const { GoogleGenAI } = require('@google/genai');

let aiInstance = null;

const getAIClient = () => {
    // If the Gemini API key is not set, we operate in a fallback mode.
    // The service will simply skip Gemini calls instead of throwing.
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key';
    if (!hasKey) {
        console.warn('[geminiService] GEMINI_API_KEY not configured – Gemini features are disabled.');
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

    // If Gemini is disabled, exit early with no output
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key') {
        console.warn('[geminiService] Skipping Gemini generation because API key is missing.');
        return; // no chunks will be yielded
    }

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
        // Guard against missing AI client (should not happen because of early return above)
        if (!ai) {
            console.warn('[geminiService] AI client unavailable.');
            return;
        }
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
    generateChatStream,
    getAIClient
};
