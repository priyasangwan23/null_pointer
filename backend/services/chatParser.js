// services/chatParser.js
// Parses WhatsApp .txt chat export files and extracts messages by sender.
// Handles all known export formats from Android and iOS.

/**
 * WhatsApp exports vary by OS version. Known formats:
 *
 * iOS (square brackets):
 *   [11/7/2026, 6:15:00 PM] Priya: message
 *   [11/7/26, 6:15 PM] Priya: message
 *   [11.07.2026, 06:15:00] Priya: message   (some locales use dots)
 *
 * Android (dash separator, NO brackets):
 *   11/07/2026, 06:15 - Priya: message
 *   7/11/26, 6:15 AM - Priya: message
 *   11-07-2026, 06:15:01 - Priya: message
 *   2026-07-11, 06:15 - Priya: message
 *
 * Zero-width / BOM characters are stripped first.
 */

// Matches: [any date, any time (optional AM/PM)] Name: text
const IOS_REGEX = /^\[[\d\/.]+,\s[\d:]+(?:\s[AP]M)?\]\s([^:]+):\s(.+)$/i;

// Matches: any date, any time (optional AM/PM) - Name: text
//   The date can use /, - or . as separators
//   The time can be HH:MM or HH:MM:SS optionally with AM/PM
const ANDROID_REGEX = /^[\d\/.+-]+[\d],\s[\d:]+(?:\s[AP]M)?\s-\s([^:]+):\s(.+)$/i;

// Even more permissive fallback: captures lines that have 2 + digits followed eventually by " - Name: text"
const ANDROID_FALLBACK_REGEX = /^[\d\/\-. ,:]+(AM|PM)?\s-\s([^:]+):\s(.+)$/i;

/**
 * Parse WhatsApp chat .txt content.
 * @param {string} text - Full content of the .txt file.
 * @returns {{ senders: Record<string, number>, messages: Array<{sender, text}> }}
 */
function parseWhatsAppChat(text) {
    // Normalize line endings and strip BOM / zero-width characters
    const lines = text
        .replace(/\ufeff/g, '')           // BOM
        .replace(/\u200e/g, '')           // Left-to-right mark
        .replace(/\u200f/g, '')           // Right-to-left mark
        .replace(/\u200b/g, '')           // Zero-width space
        .replace(/\u202a/g, '')           // Left-to-right embedding
        .replace(/\u202c/g, '')           // Pop directional formatting
        .split(/\r?\n/);

    const messages = [];
    const senderCounts = {};

    for (const line of lines) {
        const clean = line.trim();
        if (!clean) continue;

        let sender = '';
        let textVal = '';

        // Try iOS format first (most common on iPhones)
        const iosMatch = IOS_REGEX.exec(clean);
        if (iosMatch) {
            sender = iosMatch[1].trim();
            textVal = iosMatch[2].trim();
        } else {
            // Try standard Android format
            const androidMatch = ANDROID_REGEX.exec(clean);
            if (androidMatch) {
                sender = androidMatch[1].trim();
                textVal = androidMatch[2].trim();
            } else {
                // Try more permissive Android fallback (catches unusual date formats)
                const fallbackMatch = ANDROID_FALLBACK_REGEX.exec(clean);
                if (fallbackMatch) {
                    sender = fallbackMatch[2].trim();
                    textVal = fallbackMatch[3].trim();
                }
            }
        }

        if (!sender || !textVal) continue;

        // Skip system/media messages
        const lowerText = textVal.toLowerCase();
        if (
            lowerText === '<media omitted>' ||
            lowerText.includes(' omitted') ||
            lowerText.includes(' attached') ||
            lowerText.startsWith('messages and calls are end-to-end') ||
            lowerText.startsWith('this message was deleted') ||
            lowerText.startsWith('you deleted this message') ||
            lowerText.startsWith('null') ||
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
        .filter(t => t.length >= 5 && t.length <= 200); // Allow slightly longer messages
}

module.exports = { parseWhatsAppChat, extractSenderMessages };
