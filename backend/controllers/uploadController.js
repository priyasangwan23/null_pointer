// controllers/uploadController.js
// Handles WhatsApp chat file uploads, parses them, and updates the style dataset.

const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper'); // npm i unzipper
const { parseWhatsAppChat, extractSenderMessages } = require('../services/chatParser');
const { learnFromUpload } = require('../services/styleService');

/**
 * POST /api/upload-chat
 * Body (multipart/form-data):
 *   - file: the .txt WhatsApp export
 *   - senderName: (optional) whose messages to learn from
 *   - category: (optional) 'casual' | 'respectful' | 'neutral' — defaults to 'casual'
 */
const uploadChat = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded. Please attach a .txt WhatsApp export.' });
    }

    try {
        // Determine file type and read content
        const ext = path.extname(req.file.originalname).toLowerCase();
        let fileContent;
        if (ext === '.zip') {
            // Unzip in memory and extract first .txt file
            const directory = await unzipper.Open.buffer(fs.readFileSync(req.file.path));
            const txtEntry = directory.files.find(f => path.extname(f.path).toLowerCase() === '.txt');
            if (!txtEntry) {
                return res.status(422).json({ error: 'ZIP does not contain a .txt WhatsApp export.' });
            }
            fileContent = (await txtEntry.buffer()).toString('utf-8');
        } else {
            fileContent = fs.readFileSync(req.file.path, 'utf-8');
        }

        // Parse the chat
        const { messages, senders } = parseWhatsAppChat(fileContent);

        if (messages.length === 0) {
            return res.status(422).json({
                error: 'Could not find any messages. Make sure the file is a WhatsApp .txt export.'
            });
        }

        // Determine the sender to learn from
        const senderName = (req.body.senderName || '').trim();
        const category = ['casual', 'respectful', 'neutral'].includes(req.body.category)
            ? req.body.category
            : 'casual';

        let extractedPhrases;

        if (senderName) {
            // Use the specified sender
            extractedPhrases = extractSenderMessages(messages, senderName);
            if (extractedPhrases.length === 0) {
                return res.status(422).json({
                    error: `No messages found for sender "${senderName}". Check the name or leave blank to use the most frequent sender.`,
                    senders
                });
            }
        } else {
            // Default: pick the most frequent sender automatically
            const topSender = Object.entries(senders).sort((a, b) => b[1] - a[1])[0]?.[0];
            if (!topSender) {
                return res.status(422).json({ error: 'No senders detected in the file.', senders });
            }
            extractedPhrases = extractSenderMessages(messages, topSender);
        }

        // Learn from the extracted messages
        const { added, total } = learnFromUpload(extractedPhrases, category);

        // Run automatic relationship analysis on a sample of the conversation
        let analysis = null;
        try {
            const { analyzeRelationship } = require('../services/relationshipAnalyzer');
            const RelationshipProfile = require('../models/RelationshipProfile');
            const mongoose = require('mongoose');

            // Take the first 100 messages as context for Gemini to analyze the dialogue flow
            const sampleMessages = messages.slice(0, 100);
            analysis = await analyzeRelationship(sampleMessages);

            if (mongoose.connection.readyState === 1) {
                const profile = new RelationshipProfile({
                    relationship: analysis.relationship,
                    confidence: analysis.confidence,
                    communicationStyle: analysis.communicationStyle
                });
                await profile.save();
                console.log(`[uploadController] Saved relationship profile to MongoDB: ${analysis.relationship}`);
            } else {
                console.log('[uploadController] MongoDB not connected, skipping profile database save.');
            }
        } catch (analysisErr) {
            console.error('[uploadController] Failed to analyze relationship from upload:', analysisErr.message);
        }

        // Clean up the temp file
        try { fs.unlinkSync(req.file.path); } catch (_) { /* ignore cleanup errors */ }

        // Build customized success message
        const responseMessage = analysis
            ? `✅ Learned ${added} new phrases. Automatically detected relationship: ${analysis.relationship} (confidence: ${(analysis.confidence * 100).toFixed(0)}%). Style dataset now has ${total} entries.`
            : `✅ Learned ${added} new phrases from ${extractedPhrases.length} messages. Style dataset now has ${total} entries.`;

        return res.json({
            success: true,
            senders,
            totalMessages: messages.length,
            extractedCount: extractedPhrases.length,
            added,
            total,
            category,
            relationship: analysis ? analysis.relationship : null,
            confidence: analysis ? analysis.confidence : null,
            communicationStyle: analysis ? analysis.communicationStyle : null,
            message: responseMessage
        });
    } catch (err) {
        console.error('Error in uploadChat:', err.message);
        // Clean up temp file on error too
        if (req.file?.path) { try { fs.unlinkSync(req.file.path); } catch (_) { } }
        return res.status(500).json({ error: 'Failed to process the uploaded file: ' + err.message });
    }
};

module.exports = { uploadChat };
