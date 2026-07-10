// controllers/chatController.js
// Handles chat related requests

const chat = (req, res) => {
    // Expect body: { message: string }
    // For now, ignore the incoming message and return a static reply
    return res.json({ reply: "This is a test reply" });
};

module.exports = { chat };
