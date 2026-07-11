const mongoose = require('mongoose');

const communicationStyleSchema = new mongoose.Schema({
    tone: { type: String, required: true },
    formality: { type: String, required: true },
    emotionalCloseness: { type: String, required: true },
    humor: { type: String, required: true },
    emojiUsage: { type: String, required: true },
    replyLength: { type: String, required: true },
    languages: [{ type: String }],
    commonPhrases: [{ type: String }],
    greetingStyle: { type: String, required: true },
    farewellStyle: { type: String, required: true },
    positivity: { type: String, required: true },
    respectLevel: { type: String, required: true }
});

const relationshipProfileSchema = new mongoose.Schema({
    relationship: {
        type: String,
        enum: [
            'Parent', 'Father', 'Mother', 'Friend', 'Best Friend',
            'Sibling', 'Teacher', 'Elder', 'Relative', 'Colleague',
            'Boss', 'Partner', 'Stranger', 'Other'
        ],
        required: true
    },
    confidence: { type: Number, required: true },
    communicationStyle: { type: communicationStyleSchema, required: true },
    detectedAt: { type: Date, default: Date.now }
});

// Virtual/Helper to map schema relations to style parser categories
relationshipProfileSchema.methods.getMappedRole = function () {
    const rel = this.relationship;
    if (['Mother', 'Father', 'Parent', 'Elder', 'Teacher', 'Relative'].includes(rel)) {
        return 'elder'; // Map to respectful / elder logic
    }
    if (['Friend', 'Best Friend', 'Sibling', 'Partner'].includes(rel)) {
        return 'friend'; // Map to casual / friend logic
    }
    return 'stranger'; // Map to neutral / stranger logic
};

module.exports = mongoose.model('RelationshipProfile', relationshipProfileSchema);
