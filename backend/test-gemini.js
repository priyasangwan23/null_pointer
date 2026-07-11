// backend/test-gemini.js
require('dotenv').config();
const { generateChatStream } = require('./services/geminiService');

console.log('Testing live Gemini Service with GEMINI_MODEL:');
console.log('- Model configured:', process.env.GEMINI_MODEL || 'gemini-2.5-flash');

(async () => {
    try {
        const stream = generateChatStream('Hello Priya, how are you?', [], 'You are Priya, a 20-year-old girl.');
        console.log('API output:');
        for await (const chunk of stream) {
            process.stdout.write(chunk);
        }
        console.log('\n\nSuccess! Integration verified.');
    } catch (e) {
        console.error('Integration failure:', e);
        process.exit(1);
    }
})();
