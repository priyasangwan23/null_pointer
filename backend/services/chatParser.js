// services/chatParser.js
// Parses WhatsApp .txt chat export files and extracts messages by sender.

// Matches iOS format: [11/07/2026, 06:15:00] Priya: message text
// Matches iOS alternate: [11/07/26, 6:15 PM] Priya: message text
const IOS_LINE_REGEX = /^\[([\d\/]+,\s[\d:]+(?:\s[AP]M)?)\]\s([^:]+):\s(.+)$/i;

// Matches Android format: 11/07/2026, 06:15 - Priya: message text
// Matches Android alternate: 11-07-2026 06:15:01 - Priya: message text
const ANDROID_LINE_REGEX = /^([\d\/\-]+,\s[\d:]+(?:\s[AP]M)?|[\d\/\-]+\s[\d:]+(?:\s[AP]M)?)\s-\s([^:]+):\s(.+)$/i;

/**
 * Parse WhatsApp chat .txt content.
 * @param {string} text - Full content of the .txt file.
 * @returns {{ senders: Record<string, number>, messages: Array<{sender, text}> }}
 */
function parseWhatsAppChat(text) {
    const lines = text.split(/\r?\n/);
    const messages = [];
    const senderCounts = {};

    for (const line of lines) {
        // Strip BOM, LRM, RLM and zero-width spaces/characters
        const clean = line.replace(/[\u200e\u200f\ufeff\u200b]/g, '').trim();
        if (!clean) continue;

        let sender = '';
        let textVal = '';

        const iosMatch = IOS_LINE_REGEX.exec(clean);
        if (iosMatch) {
            sender = iosMatch[2].trim();
            textVal = iosMatch[3].trim();
        } else {
            const androidMatch = ANDROID_LINE_REGEX.exec(clean);
            if (androidMatch) {
                sender = androidMatch[2].trim();
                textVal = androidMatch[3].trim();
            }
        }

        if (!sender || !textVal) continue;

        // Skip system/media/unwanted status lines
        if (
            textVal === '<Media omitted>' ||
            textVal.includes('omitted') ||
            textVal.includes('attached') ||
            textVal.startsWith('Messages and calls are end-to-end encrypted') ||
            textVal.startsWith('This message was deleted') ||
            textVal.length < 2
        ) continue;

        messages.push({ sender, text: textVal });
        senderCounts[sender] = (senderCounts[sender] || 0) + 1;
    }

    return { messages, senders: senderCounts };
}

/**
 * Extract messages from a specific sender.
 * Performs a case-insensitive partial match.
 * @param {Array<{sender, text}>} messages
 * @param {string} senderName
 * @returns {string[]} Array of message strings from that sender
 */
function extractSenderMessages(messages, senderName) {
    const lower = senderName.toLowerCase().trim();
    return messages
        .filter(m => m.sender.toLowerCase().includes(lower))
        .map(m => m.text)
        .filter(t => t.length >= 5 && t.length <= 120);
}

module.exports = { parseWhatsAppChat, extractSenderMessages };
