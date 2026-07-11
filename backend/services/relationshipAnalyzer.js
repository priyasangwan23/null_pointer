const { getAIClient } = require('./geminiService');

/**
 * Use Gemini to analyze a conversation sample and determine the relationship
 * and communication style of the participants.
 *
 * We deliberately avoid `responseMimeType`/`responseSchema` because they are
 * not supported on all model variants (e.g. gemini-flash-latest returns 400).
 * Instead, we instruct Gemini in the system prompt to output pure JSON and
 * parse + validate the text response ourselves.
 *
 * @param {Array<{sender: string, text: string}>} messageSample
 * @returns {Promise<Object>} Parsed relationship profile conforming to the schema
 */
async function analyzeRelationship(messageSample) {
    if (!messageSample || messageSample.length === 0) {
        throw new Error('No messages provided for analysis');
    }

    const ai = getAIClient();

    // Format conversation log for the prompt
    const formattedChat = messageSample
        .map(msg => `[${msg.sender}]: ${msg.text}`)
        .join('\n');

    const systemInstruction = `You are an expert conversational analyst.
Analyze the chat log between two people and infer the relationship and communication style purely from the CONTENT of the messages — vocabulary, tone, emojis, respect-markers, caring expressions, nicknames, jokes, and sentence structure.

DO NOT rely on contact names alone (e.g. "Mummy ❤️" should not automatically mean Parent unless the messages have a parent-child dynamic).

Respond with VALID JSON ONLY. No markdown, no code fences, no explanation. Just the JSON object.

The JSON must use exactly this structure:
{
  "relationship": "<one of: Parent|Father|Mother|Friend|Best Friend|Sibling|Teacher|Elder|Relative|Colleague|Boss|Partner|Stranger|Other>",
  "confidence": <number between 0.0 and 1.0>,
  "communicationStyle": {
    "tone": "<describe tone>",
    "formality": "<Formal|Semi-formal|Informal|Very Informal>",
    "emotionalCloseness": "<Very High|High|Moderate|Low|Very Low>",
    "humor": "<High|Moderate|Low|None>",
    "emojiUsage": "<High|Moderate|Low|None>",
    "replyLength": "<Long|Medium|Short>",
    "languages": ["<language1>", "..."],
    "commonPhrases": ["<phrase1>", "..."],
    "greetingStyle": "<describe>",
    "farewellStyle": "<describe>",
    "positivity": "<Very High|High|Moderate|Low|Very Low>",
    "respectLevel": "<Very High|High|Moderate|Low|Very Low>"
  }
}`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
        model: modelName,
        contents: `Analyze this conversation and respond with the JSON profile:\n\n${formattedChat}`,
        config: {
            systemInstruction,
            temperature: 0.1 // Very low temperature for consistent structured output
        }
    });

    const rawText = (response.text || '').trim();

    // Strip markdown fences if Gemini adds them anyway
    const jsonText = rawText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();

    let parsed;
    try {
        parsed = JSON.parse(jsonText);
    } catch (parseErr) {
        console.error('[relationshipAnalyzer] Raw Gemini response:', rawText);
        throw new Error('Gemini returned invalid JSON: ' + parseErr.message);
    }

    // Basic validation to ensure required fields are present
    if (!parsed.relationship || !parsed.communicationStyle) {
        console.error('[relationshipAnalyzer] Incomplete response:', parsed);
        throw new Error('Gemini response is missing required fields (relationship, communicationStyle)');
    }

    return parsed;
}

module.exports = { analyzeRelationship };
